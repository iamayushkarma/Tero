import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const VERDICT_THRESHOLDS = Object.freeze({
  EXCELLENT: 80,
  VERY_GOOD: 70,
  GOOD: 60,
  AVERAGE: 50,
  BELOW_AVERAGE: 40,
  POOR: 30,
  VERY_POOR: 0,
});

const SEVERITY = Object.freeze({
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
});

const SCORE_LIMITS = Object.freeze({
  MIN: 5,
  MAX: 90,
});

// Cache for scoring rules
let cachedScoringRules = null;

class ATSScoringError extends Error {
  constructor(message, code = "ATS_ERROR") {
    super(message);
    this.name = "ATSScoringError";
    this.code = code;
  }
}

class RulesLoader {
  static load(rulesPath, forceReload = false) {
    if (cachedScoringRules && !forceReload) {
      return cachedScoringRules;
    }

    try {
      const rulesContent = fs.readFileSync(rulesPath, "utf-8");
      const rules = JSON.parse(rulesContent);
      this.validate(rules);
      cachedScoringRules = rules;
      return rules;
    } catch (error) {
      this.handleLoadError(error, rulesPath);
    }
  }

  static validate(rules) {
    const requiredFields = ["baseWeights", "scoreScale"];
    for (const field of requiredFields) {
      if (!rules[field]) {
        throw new ATSScoringError(
          `Invalid rules structure: missing required field '${field}'`,
          "INVALID_RULES_STRUCTURE",
        );
      }
    }

    const { min, max } = rules.scoreScale;
    if (typeof min !== "number" || typeof max !== "number" || min >= max) {
      throw new ATSScoringError(
        "Invalid rules structure: scoreScale must have valid numeric min and max",
        "INVALID_SCORE_SCALE",
      );
    }
  }

  static handleLoadError(error, rulesPath) {
    if (error.code === "ENOENT") {
      throw new ATSScoringError(`Scoring rules file not found: ${rulesPath}`, "FILE_NOT_FOUND");
    }
    if (error instanceof SyntaxError) {
      throw new ATSScoringError(
        `Invalid JSON in scoring rules file: ${error.message}`,
        "INVALID_JSON",
      );
    }
    throw new ATSScoringError(`Failed to load scoring rules: ${error.message}`, "LOAD_ERROR");
  }

  static clearCache() {
    cachedScoringRules = null;
  }
}

class InputValidator {
  static validate(sectionData, keywordData, formattingData) {
    this.validateSectionData(sectionData);
    this.validateKeywordData(keywordData);
    this.validateFormattingData(formattingData);
  }

  static validateSectionData(sectionData) {
    if (!sectionData || !Array.isArray(sectionData.sections)) {
      throw new ATSScoringError(
        "sectionData with sections array is required",
        "INVALID_SECTION_DATA",
      );
    }
  }

  static validateKeywordData(keywordData) {
    if (!keywordData || typeof keywordData.globalMatches !== "object") {
      throw new ATSScoringError(
        "keywordData with globalMatches is required",
        "INVALID_KEYWORD_DATA",
      );
    }
  }

  static validateFormattingData(formattingData) {
    if (!formattingData || !Array.isArray(formattingData.ruleFindings)) {
      throw new ATSScoringError(
        "formattingData with ruleFindings array is required",
        "INVALID_FORMATTING_DATA",
      );
    }
  }
}

class ScoreCalculator {
  constructor(scoringRules, explanations) {
    this.scoringRules = scoringRules;
    this.explanations = explanations;
  }

  addExplanation(category, message, impact, severity) {
    this.explanations.push({ category, message, impact, severity });
  }

  clamp(score, min, max) {
    return Math.max(min, Math.min(max, score));
  }
}

// SectionsScoreCalculator
class SectionsScoreCalculator extends ScoreCalculator {
  calculate(sectionData) {
    const maxScore = this.scoringRules.baseWeights.sections;
    let score = 0;
    let foundSections = 0;
    let missingRequiredCount = 0;

    // Calculate total weight to normalize scores
    const sectionWeights = this.scoringRules.sectionWeights || {};
    const totalWeight = Object.values(sectionWeights).reduce((a, b) => a + b, 0);

    // Calculate base score from sections (normalized)
    sectionData.sections.forEach((section) => {
      if (section.found) {
        foundSections++;
        const weight = sectionWeights[section.key] || 1;
        const normalizedScore = (weight / totalWeight) * maxScore;
        score += normalizedScore;

        this.addExplanation(
          "section",
          `Section '${section.displayName}' found`,
          Math.round(normalizedScore * 10) / 10,
          SEVERITY.POSITIVE,
        );
      } else if (section.required) {
        missingRequiredCount++;
        const penalty = this.scoringRules.missingSectionPenalty?.required || -3;
        score += penalty;
        this.addExplanation(
          "section",
          `Missing required section: '${section.displayName}'`,
          penalty,
          SEVERITY.CRITICAL,
        );
      }
    });

    // Apply coverage bonus (capped)
    const coverageRatio = foundSections / sectionData.sections.length;
    const bonusConfig = this.scoringRules.bonusConfig?.sectionCoverage;

    if (bonusConfig?.enabled && coverageRatio >= (bonusConfig.threshold || 0.95)) {
      const maxBonus = bonusConfig.maxBonus || 2;
      const bonus = Math.min(maxBonus, maxScore - score);
      if (bonus > 0) {
        score += bonus;
        this.addExplanation(
          "section",
          `Excellent section coverage (${Math.round(coverageRatio * 100)}%)`,
          bonus,
          SEVERITY.POSITIVE,
        );
      }
    }

    // Multiple missing penalty
    const multiMissingConfig = this.scoringRules.penaltyConfig?.multipleMissingSections;
    if (multiMissingConfig?.enabled && missingRequiredCount > 1) {
      const penaltyPerSection = multiMissingConfig.perSection || -2;
      const penalty = missingRequiredCount * penaltyPerSection;
      score += penalty;
      this.addExplanation("section", "Multiple missing required sections", penalty, SEVERITY.HIGH);
    }

    const finalScore = this.clamp(score, 0, maxScore);
    return {
      score: finalScore,
      maxScore: maxScore,
      foundSections: foundSections,
      totalSections: sectionData.sections.length,
      missingRequired: missingRequiredCount,
      percentage: Math.round((finalScore / maxScore) * 100),
    };
  }
}

// KeywordsScoreCalculator

// class KeywordsScoreCalculator extends ScoreCalculator {
//   calculate(keywordData) {
//     const maxScore = this.scoringRules.baseWeights.keywords;
//     let baseScore = 0;
//     let totalKeywords = 0;
//     let highImpactCount = 0;
//     let veryHighImpactCount = 0;

//     // Calculate base keyword score
//     Object.entries(keywordData.globalMatches || {}).forEach(([groupName, groupData]) => {
//       if (groupData.uniqueCount > 0) {
//         const importance = groupData.importance || "medium";
//         const weight = this.scoringRules.keywordWeights?.[importance] || 1.0;
//         const groupScore = weight * groupData.uniqueCount;

//         baseScore += groupScore;
//         totalKeywords += groupData.uniqueCount;

//         if (importance === "very_high") veryHighImpactCount += groupData.uniqueCount;
//         else if (importance === "high") highImpactCount += groupData.uniqueCount;

//         this.addExplanation(
//           "keyword",
//           `${groupData.uniqueCount} ${importance} priority keywords in '${groupName}'`,
//           Math.round(groupScore * 10) / 10,
//           importance === "very_high" ? SEVERITY.HIGH : SEVERITY.POSITIVE,
//         );
//       }
//     });

//     // Normalize base score to maxScore range
//     const maxPossibleBase = maxScore * 0.85; // Reserve 15% for bonuses
//     baseScore = Math.min(baseScore, maxPossibleBase);

//     // Apply bonuses (with caps)
//     let bonusPoints = 0;
//     const uniqueGroups = Object.keys(keywordData.globalMatches || {}).length;

//     // Diversity bonus
//     const diversityConfig = this.scoringRules.bonusConfig?.keywordDiversity;
//     if (diversityConfig?.enabled) {
//       if (uniqueGroups >= (diversityConfig.excellent?.minGroups || 6)) {
//         const bonus = diversityConfig.excellent?.bonus || 3;
//         bonusPoints += bonus;
//         this.addExplanation(
//           "keyword",
//           `Excellent keyword diversity (${uniqueGroups} categories)`,
//           bonus,
//           SEVERITY.POSITIVE,
//         );
//       } else if (uniqueGroups >= (diversityConfig.good?.minGroups || 4)) {
//         const bonus = diversityConfig.good?.bonus || 1.5;
//         bonusPoints += bonus;
//         this.addExplanation(
//           "keyword",
//           `Good keyword diversity (${uniqueGroups} categories)`,
//           bonus,
//           SEVERITY.POSITIVE,
//         );
//       }
//     }

//     // High impact bonus
//     const highImpactConfig = this.scoringRules.bonusConfig?.highImpactKeywords;
//     const totalHighImpact = highImpactCount + veryHighImpactCount;

//     if (highImpactConfig?.enabled) {
//       if (totalHighImpact >= (highImpactConfig.outstanding?.minCount || 15)) {
//         const bonus = highImpactConfig.outstanding?.bonus || 3;
//         bonusPoints += bonus;
//         this.addExplanation(
//           "keyword",
//           `Outstanding high-impact keywords (${totalHighImpact} found)`,
//           bonus,
//           SEVERITY.HIGH,
//         );
//       } else if (totalHighImpact >= (highImpactConfig.strong?.minCount || 10)) {
//         const bonus = highImpactConfig.strong?.bonus || 1.5;
//         bonusPoints += bonus;
//         this.addExplanation(
//           "keyword",
//           `Strong high-impact keywords (${totalHighImpact} found)`,
//           bonus,
//           SEVERITY.HIGH,
//         );
//       }
//     }

//     // Low coverage penalty
//     const lowCoverageConfig = this.scoringRules.penaltyConfig?.lowKeywordCoverage;
//     if (lowCoverageConfig?.enabled) {
//       if (totalKeywords < (lowCoverageConfig.critical?.maxKeywords || 5)) {
//         const penalty = lowCoverageConfig.critical?.penalty || -6;
//         bonusPoints += penalty;
//         this.addExplanation(
//           "keyword",
//           `Critical: Very limited keyword coverage (${totalKeywords} total)`,
//           penalty,
//           SEVERITY.CRITICAL,
//         );
//       } else if (totalKeywords < (lowCoverageConfig.low?.maxKeywords || 8)) {
//         const penalty = lowCoverageConfig.low?.penalty || -3;
//         bonusPoints += penalty;
//         this.addExplanation(
//           "keyword",
//           `Limited keyword coverage (${totalKeywords} total)`,
//           penalty,
//           SEVERITY.MEDIUM,
//         );
//       }
//     }

//     // Cap bonus points
//     const maxBonus = this.scoringRules.caps?.maxKeywordBonus || 5;
//     bonusPoints = this.clamp(bonusPoints, -10, maxBonus);

//     const finalScore = this.clamp(baseScore + bonusPoints, 0, maxScore);

//     return {
//       score: finalScore,
//       maxScore: maxScore,
//       totalKeywords: totalKeywords,
//       highImpactCount: highImpactCount,
//       veryHighImpactCount: veryHighImpactCount,
//       percentage: Math.round((finalScore / maxScore) * 100),
//     };
//   }
// }
// KeywordsScoreCalculator - FIXED VERSION
class KeywordsScoreCalculator extends ScoreCalculator {
  calculate(keywordData) {
    const maxScore = this.scoringRules.baseWeights.keywords;
    let baseScore = 0;
    let totalKeywords = 0;
    let highImpactCount = 0;
    let veryHighImpactCount = 0;

    // ✅ FIXED: Define realistic max keywords for normalization
    const REALISTIC_MAX_KEYWORDS = 30; // A strong resume has ~25-35 keywords
    let weightedKeywordCount = 0;

    // Calculate base keyword score with proper normalization
    Object.entries(keywordData.globalMatches || {}).forEach(([groupName, groupData]) => {
      if (groupData.uniqueCount > 0) {
        const importance = groupData.importance || "medium";
        const weight = this.scoringRules.keywordWeights?.[importance] || 1.0;

        // ✅ FIXED: Use uniqueCount only (not totalCount which includes repetitions)
        const groupContribution = weight * groupData.uniqueCount;
        weightedKeywordCount += groupContribution;

        totalKeywords += groupData.uniqueCount;

        if (importance === "very_high") veryHighImpactCount += groupData.uniqueCount;
        else if (importance === "high") highImpactCount += groupData.uniqueCount;

        this.addExplanation(
          "keyword",
          `${groupData.uniqueCount} ${importance} priority keywords in '${groupName}'`,
          Math.round(groupContribution * 10) / 10,
          importance === "very_high" ? SEVERITY.HIGH : SEVERITY.POSITIVE,
        );
      }
    });

    // ✅ FIXED: Normalize to maxScore using realistic scaling
    // Scale: 0 keywords = 0, REALISTIC_MAX_KEYWORDS = maxScore * 0.85
    const maxPossibleBase = maxScore * 0.85; // Reserve 15% for bonuses
    const scaleFactor = maxPossibleBase / REALISTIC_MAX_KEYWORDS;
    baseScore = Math.min(weightedKeywordCount * scaleFactor, maxPossibleBase);

    // ✅ FIXED: Add penalty for LOW keyword count
    if (totalKeywords < 5) {
      const penalty = -8; // Severe penalty for very few keywords
      baseScore += penalty;
      this.addExplanation(
        "keyword",
        `Critical: Very few keywords found (${totalKeywords})`,
        penalty,
        SEVERITY.CRITICAL,
      );
    } else if (totalKeywords < 10) {
      const penalty = -4;
      baseScore += penalty;
      this.addExplanation(
        "keyword",
        `Low keyword count (${totalKeywords})`,
        penalty,
        SEVERITY.HIGH,
      );
    }

    // Apply bonuses (with caps)
    let bonusPoints = 0;
    const uniqueGroups = Object.keys(keywordData.globalMatches || {}).length;

    // Diversity bonus
    const diversityConfig = this.scoringRules.bonusConfig?.keywordDiversity;
    if (diversityConfig?.enabled) {
      if (uniqueGroups >= (diversityConfig.excellent?.minGroups || 6)) {
        const bonus = diversityConfig.excellent?.bonus || 3;
        bonusPoints += bonus;
        this.addExplanation(
          "keyword",
          `Excellent keyword diversity (${uniqueGroups} categories)`,
          bonus,
          SEVERITY.POSITIVE,
        );
      } else if (uniqueGroups >= (diversityConfig.good?.minGroups || 4)) {
        const bonus = diversityConfig.good?.bonus || 1.5;
        bonusPoints += bonus;
        this.addExplanation(
          "keyword",
          `Good keyword diversity (${uniqueGroups} categories)`,
          bonus,
          SEVERITY.POSITIVE,
        );
      }
    }

    // High impact bonus
    const highImpactConfig = this.scoringRules.bonusConfig?.highImpactKeywords;
    const totalHighImpact = highImpactCount + veryHighImpactCount;

    if (highImpactConfig?.enabled) {
      if (totalHighImpact >= (highImpactConfig.outstanding?.minCount || 15)) {
        const bonus = highImpactConfig.outstanding?.bonus || 3;
        bonusPoints += bonus;
        this.addExplanation(
          "keyword",
          `Outstanding high-impact keywords (${totalHighImpact} found)`,
          bonus,
          SEVERITY.HIGH,
        );
      } else if (totalHighImpact >= (highImpactConfig.strong?.minCount || 10)) {
        const bonus = highImpactConfig.strong?.bonus || 1.5;
        bonusPoints += bonus;
        this.addExplanation(
          "keyword",
          `Strong high-impact keywords (${totalHighImpact} found)`,
          bonus,
          SEVERITY.HIGH,
        );
      }
    }

    // Cap bonus points
    const maxBonus = this.scoringRules.caps?.maxKeywordBonus || 5;
    bonusPoints = this.clamp(bonusPoints, -10, maxBonus);

    const finalScore = this.clamp(baseScore + bonusPoints, 0, maxScore);

    return {
      score: finalScore,
      maxScore: maxScore,
      totalKeywords: totalKeywords,
      highImpactCount: highImpactCount,
      veryHighImpactCount: veryHighImpactCount,
      percentage: Math.round((finalScore / maxScore) * 100),
    };
  }
}

// FormattingScoreCalculator
class FormattingScoreCalculator extends ScoreCalculator {
  calculate(formattingData) {
    const maxScore = this.scoringRules.baseWeights.formatting;
    let penalty = 0;

    (formattingData.ruleFindings || []).forEach((ruleKey) => {
      const penaltyValue = this.scoringRules.formattingPenaltyMap?.[ruleKey] || 0;

      if (penaltyValue !== 0) {
        penalty += penaltyValue;
        this.addExplanation(
          "formatting",
          `Formatting issue: '${ruleKey}'`,
          penaltyValue,
          SEVERITY.NEGATIVE,
        );
      }
    });

    const maxPenalty = this.scoringRules.caps?.maxFormattingPenalty || -10;
    penalty = Math.max(penalty, maxPenalty);

    const finalScore = this.clamp(maxScore + penalty, 0, maxScore);

    return {
      score: finalScore,
      maxScore: maxScore,
      issuesFound: formattingData.ruleFindings.length,
      totalPenalty: penalty,
      percentage: Math.round((finalScore / maxScore) * 100),
    };
  }
}

// PenaltiesCalculator
class PenaltiesCalculator extends ScoreCalculator {
  calculate(keywordData) {
    let penalty = 0;
    const stuffingSignals = keywordData.stuffingSignals || [];
    const penaltyConfig = this.scoringRules.penaltyConfig?.keywordStuffing;

    if (penaltyConfig?.enabled) {
      const penaltyPerViolation = penaltyConfig.perViolation || -2;
      stuffingSignals.forEach((signal) => {
        penalty += penaltyPerViolation;
        this.addExplanation(
          "penalty",
          `Keyword stuffing: '${signal.keyword}'`,
          penaltyPerViolation,
          SEVERITY.NEGATIVE,
        );
      });
    }

    const maxPenalty = this.scoringRules.caps?.maxKeywordPenalty || -10;
    const finalPenalty = Math.max(penalty, maxPenalty);

    return {
      score: finalPenalty,
      maxPenalty: maxPenalty,
      stuffingCount: stuffingSignals.length,
      totalPenalty: penalty,
    };
  }
}

// ExperienceScoreCalculator
// class ExperienceScoreCalculator extends ScoreCalculator {
//   // calculate(keywordData) {
//   //   const maxScore = this.scoringRules.baseWeights.experience_quality;
//   //   const actionVerbCount = keywordData.actionVerbs?.count || 0;
//   //   const quantifiedAchievements = keywordData.quantifiedAchievements || [];

//   //   const actionVerbScore = this.calculateActionVerbScore(actionVerbCount);
//   //   const quantifiedScore = this.calculateQuantifiedScore(quantifiedAchievements.length);

//   //   let totalScore = actionVerbScore + quantifiedScore;

//   //   // Exceptional quality bonus
//   //   const expSignals = this.scoringRules.experienceSignals;
//   //   const bonusThreshold = expSignals?.bonusForExceptional || 2;

//   //   if (actionVerbScore >= 8 && quantifiedScore >= 6) {
//   //     totalScore += bonusThreshold;
//   //     this.addExplanation(
//   //       "experience",
//   //       "Exceptional experience quality demonstrated",
//   //       bonusThreshold,
//   //       SEVERITY.HIGH,
//   //     );
//   //   }

//   //   const finalScore = this.clamp(totalScore, 0, maxScore);

//   //   return {
//   //     score: finalScore,
//   //     maxScore: maxScore,
//   //     actionVerbCount: actionVerbCount,
//   //     // quantifiedCount: quantifiedAchievements.length,
//   //     quantifiedCount: quantifiedCount,
//   //     actionVerbScore: actionVerbScore,
//   //     quantifiedScore: quantifiedScore,
//   //     percentage: Math.round((finalScore / maxScore) * 100),
//   //   };
//   // }
//   calculate(keywordData) {
//     const maxScore = this.scoringRules.baseWeights.experience_quality;
//     const actionVerbCount = keywordData.actionVerbs?.count || 0;

//     const quantifiedCount =
//       typeof keywordData.quantifiedCount === "number"
//         ? keywordData.quantifiedCount
//         : (keywordData.quantifiedAchievements || []).length;

//     const actionVerbScore = this.calculateActionVerbScore(actionVerbCount);
//     const quantifiedScore = this.calculateQuantifiedScore(quantifiedCount);

//     let totalScore = actionVerbScore + quantifiedScore;

//     const expSignals = this.scoringRules.experienceSignals;
//     const bonusThreshold = expSignals?.bonusForExceptional || 2;

//     if (actionVerbScore >= 8 && quantifiedScore >= 6) {
//       totalScore += bonusThreshold;
//     }

//     const finalScore = this.clamp(totalScore, 0, maxScore);

//     return {
//       score: finalScore,
//       maxScore,
//       actionVerbCount,
//       quantifiedCount,
//       actionVerbScore,
//       quantifiedScore,
//       percentage: Math.round((finalScore / maxScore) * 100),
//     };
//   }

//   // calculateActionVerbScore(count) {
//   //   const thresholds = this.scoringRules.experienceSignals?.actionVerbThresholds || {
//   //     outstanding: 20,
//   //     excellent: 15,
//   //     good: 10,
//   //     adequate: 7,
//   //     few: 4,
//   //     minimal: 0,
//   //   };
//   //   const maxScore = this.scoringRules.experienceSignals?.actionVerbMaxScore || 10;

//   //   const tiers = [
//   //     { min: thresholds.outstanding, score: maxScore, label: "Outstanding" },
//   //     { min: thresholds.excellent, score: Math.round(maxScore * 0.8), label: "Excellent" },
//   //     { min: thresholds.good, score: Math.round(maxScore * 0.6), label: "Good" },
//   //     { min: thresholds.adequate, score: Math.round(maxScore * 0.4), label: "Adequate" },
//   //     { min: thresholds.few, score: Math.round(maxScore * 0.2), label: "Few" },
//   //     { min: thresholds.minimal, score: 0, label: "Minimal" },
//   //   ];

//   //   for (const tier of tiers) {
//   //     if (count >= tier.min) {
//   //       this.addExplanation(
//   //         "experience",
//   //         `${tier.label} action verbs (${count} found)`,
//   //         tier.score,
//   //         tier.score >= maxScore * 0.6 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
//   //       );
//   //       return tier.score;
//   //     }
//   //   }

//   //   return 0;
//   // }

//   // calculateQuantifiedScore(count) {
//   //   const thresholds = this.scoringRules.experienceSignals?.quantifiedThresholds || {
//   //     outstanding: 8,
//   //     excellent: 6,
//   //     good: 4,
//   //     adequate: 3,
//   //     few: 1,
//   //     none: 0,
//   //   };
//   //   const maxScore = this.scoringRules.experienceSignals?.quantifiedMaxScore || 8;

//   //   const tiers = [
//   //     { min: thresholds.outstanding, score: maxScore, label: "Outstanding" },
//   //     { min: thresholds.excellent, score: Math.round(maxScore * 0.75), label: "Excellent" },
//   //     { min: thresholds.good, score: Math.round(maxScore * 0.6), label: "Good" },
//   //     { min: thresholds.adequate, score: Math.round(maxScore * 0.4), label: "Adequate" },
//   //     { min: thresholds.few, score: Math.round(maxScore * 0.15), label: "Few" },
//   //     { min: thresholds.none, score: 0, label: "None" },
//   //   ];

//   //   for (const tier of tiers) {
//   //     if (count >= tier.min) {
//   //       this.addExplanation(
//   //         "experience",
//   //         `${tier.label} quantified achievements (${count} found)`,
//   //         tier.score,
//   //         tier.score >= maxScore * 0.6 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
//   //       );
//   //       return tier.score;
//   //     }
//   //   }

//   //   return 0;
//   // }

//   calculateActionVerbScore(count) {
//     const maxScore = this.scoringRules.experienceSignals?.actionVerbMaxScore || 10;
//     const targetCount = 12; // Resumes with 12+ verbs get 100% of this category

//     // Instead of tiers, calculate a smooth percentage
//     const score = (count / targetCount) * maxScore;
//     const finalScore = Math.min(maxScore, Math.round(score * 10) / 10);

//     this.addExplanation(
//       "experience",
//       `Action verb quality: ${count} found`,
//       finalScore,
//       count >= 8 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
//     );
//     return finalScore;
//   }

//   calculateQuantifiedScore(count) {
//     const maxScore = this.scoringRules.experienceSignals?.quantifiedMaxScore || 8;
//     const targetCount = 5; // Resumes with 5+ metrics get 100% of this category

//     const score = (count / targetCount) * maxScore;
//     const finalScore = Math.min(maxScore, Math.round(score * 10) / 10);

//     this.addExplanation(
//       "experience",
//       `Quantified achievements: ${count} found`,
//       finalScore,
//       count >= 3 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
//     );
//     return finalScore;
//   }
// }

// class ExperienceScoreCalculator extends ScoreCalculator {
//   calculate(keywordData) {
//     const maxScore = this.scoringRules.baseWeights.experience_quality;

//     const verbCount = keywordData.actionVerbs?.count || 0;
//     const metricCount =
//       typeof keywordData.quantifiedCount === "number"
//         ? keywordData.quantifiedCount
//         : (keywordData.quantifiedAchievements || []).length;

//     const verbMax = this.scoringRules.experienceSignals?.actionVerbMaxScore || 10;
//     const metricMax = this.scoringRules.experienceSignals?.quantifiedMaxScore || 8;

//     const verbTarget = this.scoringRules.experienceSignals?.actionVerbThresholds?.excellent || 12;
//     const metricTarget = this.scoringRules.experienceSignals?.quantifiedThresholds?.excellent || 5;

//     const verbScore = Math.min(verbMax, (verbCount / verbTarget) * verbMax);
//     const metricScore = Math.min(metricMax, (metricCount / metricTarget) * metricMax);

//     this.addExplanation(
//       "experience",
//       `Action Verb Density: ${verbCount} found (Goal: ${verbTarget})`,
//       Math.round(verbScore * 10) / 10,
//       verbCount >= (this.scoringRules.experienceSignals?.actionVerbThresholds?.good || 10)
//         ? SEVERITY.POSITIVE
//         : SEVERITY.MEDIUM,
//     );

//     this.addExplanation(
//       "experience",
//       `Quantified Results: ${metricCount} metrics (Goal: ${metricTarget})`,
//       Math.round(metricScore * 10) / 10,
//       metricCount >= (this.scoringRules.experienceSignals?.quantifiedThresholds?.good || 4)
//         ? SEVERITY.POSITIVE
//         : SEVERITY.MEDIUM,
//     );

//     const total = Math.round((verbScore + metricScore) * 10) / 10;
//     const finalScore = this.clamp(total, 0, maxScore);

//     return {
//       score: finalScore,
//       maxScore,
//       actionVerbCount: verbCount,
//       quantifiedCount: metricCount,
//       actionVerbScore: Math.round(verbScore * 10) / 10,
//       quantifiedScore: Math.round(metricScore * 10) / 10,
//       percentage: Math.round((finalScore / maxScore) * 100),
//     };
//   }
// }

class ExperienceScoreCalculator extends ScoreCalculator {
  calculate(keywordData, sectionData) {
    const maxScore = this.scoringRules.baseWeights.experience_quality;

    // ✅ Gate: if no experience section, experience score must be 0
    const expSection = sectionData?.sections?.find((s) => s.key === "experience");
    if (
      !expSection?.found ||
      !Array.isArray(expSection.content) ||
      expSection.content.length === 0
    ) {
      this.addExplanation(
        "experience",
        "No Experience section found, so experience quality cannot be scored.",
        0,
        SEVERITY.CRITICAL,
      );

      return {
        score: 0,
        maxScore,
        actionVerbCount: 0,
        quantifiedCount: 0,
        actionVerbScore: 0,
        quantifiedScore: 0,
        percentage: 0,
      };
    }

    // ✅ Analyze only experience text
    const expText = expSection.content.join(" ").toLowerCase();

    // --- Action verbs only from experience ---
    const actionVerbGroup = Object.values(keywordData.globalMatches || {}).length ? null : null; // not needed

    // Use the action verbs list from rules (best), not keywordData global count
    const verbList = this.scoringRules._actionVerbList || []; // we'll set this in a second OR just hardcode from keyword.rules via keywordMatcher (see note)

    // If you DON'T have verbList here, easiest is: pass it from keywordData (see below).
    const expVerbCount = keywordData.experienceActionVerbs?.count ?? 0;
    const expMetricCount = keywordData.experienceQuantifiedCount ?? 0;

    const actionVerbScore = this.calculateActionVerbScore(expVerbCount);
    const quantifiedScore = this.calculateQuantifiedScore(expMetricCount);

    const total = this.clamp(actionVerbScore + quantifiedScore, 0, maxScore);

    return {
      score: total,
      maxScore,
      actionVerbCount: expVerbCount,
      quantifiedCount: expMetricCount,
      actionVerbScore,
      quantifiedScore,
      percentage: Math.round((total / maxScore) * 100),
    };
  }

  calculateActionVerbScore(count) {
    const maxScore = this.scoringRules.experienceSignals?.actionVerbMaxScore || 10;
    const target = this.scoringRules.experienceSignals?.actionVerbThresholds?.excellent || 12;
    return Math.round(Math.min(maxScore, (count / target) * maxScore) * 10) / 10;
  }

  calculateQuantifiedScore(count) {
    const maxScore = this.scoringRules.experienceSignals?.quantifiedMaxScore || 8;
    const target = this.scoringRules.experienceSignals?.quantifiedThresholds?.excellent || 5;
    return Math.round(Math.min(maxScore, (count / target) * maxScore) * 10) / 10;
  }
}

// SkillsScoreCalculator
class SkillsScoreCalculator extends ScoreCalculator {
  calculate(keywordData) {
    const maxScore = this.scoringRules.baseWeights.skills_relevance;
    const matchedSkills = keywordData.matchedSkills || [];
    const totalSkills = keywordData.totalSkills || 1;
    const skillMatchRatio = matchedSkills.length / totalSkills;

    let baseScore = this.calculateBaseSkillScore(skillMatchRatio, maxScore);
    let bonusScore = this.calculateTechnicalBonus(matchedSkills, maxScore);

    // Cap bonus
    const maxBonus = this.scoringRules.caps?.maxSkillsBonus || 4;
    bonusScore = Math.min(bonusScore, maxBonus);

    const finalScore = this.clamp(baseScore + bonusScore, 0, maxScore);

    return {
      score: finalScore,
      maxScore: maxScore,
      matchedSkills: matchedSkills.length,
      totalSkills: totalSkills,
      matchRatio: skillMatchRatio,
      percentage: Math.round((finalScore / maxScore) * 100),
    };
  }

  calculateBaseSkillScore(ratio, maxScore) {
    const tiers = this.scoringRules.skillsConfig?.matchRatioTiers || {
      excellent: { minRatio: 0.7, multiplier: 1.0 },
      veryGood: { minRatio: 0.5, multiplier: 0.85 },
      good: { minRatio: 0.35, multiplier: 0.7 },
      moderate: { minRatio: 0.2, multiplier: 0.5 },
      limited: { minRatio: 0.1, multiplier: 0.3 },
      poor: { minRatio: 0, multiplier: 0.1 },
    };

    const orderedTiers = [
      { ...tiers.excellent, label: "Excellent" },
      { ...tiers.veryGood, label: "Very good" },
      { ...tiers.good, label: "Good" },
      { ...tiers.moderate, label: "Moderate" },
      { ...tiers.limited, label: "Limited" },
      { ...tiers.poor, label: "Poor" },
    ];

    for (const tier of orderedTiers) {
      if (ratio >= tier.minRatio) {
        const score = Math.round(maxScore * tier.multiplier * 0.85); // Reserve 15% for bonuses
        const percentage = Math.round(ratio * 100);
        this.addExplanation(
          "skills",
          `${tier.label} skills match (${percentage}%)`,
          score,
          tier.multiplier >= 0.7 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
        );
        return score;
      }
    }

    return 0;
  }

  calculateTechnicalBonus(matchedSkills, maxScore) {
    const technicalCount = matchedSkills.filter(
      (s) =>
        s.category === "technical" ||
        s.category?.includes("programming") ||
        s.category?.includes("framework") ||
        s.category?.includes("database"),
    ).length;

    const techConfig = this.scoringRules.bonusConfig?.technicalSkills;

    if (!techConfig?.enabled) return 0;

    if (technicalCount >= (techConfig.outstanding?.minCount || 8)) {
      const bonus = techConfig.outstanding?.bonus || 3;
      this.addExplanation(
        "skills",
        `Outstanding technical skills (${technicalCount} matched)`,
        bonus,
        SEVERITY.HIGH,
      );
      return bonus;
    } else if (technicalCount >= (techConfig.strong?.minCount || 5)) {
      const bonus = techConfig.strong?.bonus || 1.5;
      this.addExplanation(
        "skills",
        `Strong technical skills (${technicalCount} matched)`,
        bonus,
        SEVERITY.POSITIVE,
      );
      return bonus;
    }

    return 0;
  }
}

// VerdictEngine
class VerdictEngine {
  static determineVerdict(score) {
    if (score >= VERDICT_THRESHOLDS.EXCELLENT) return "excellent";
    if (score >= VERDICT_THRESHOLDS.VERY_GOOD) return "very good";
    if (score >= VERDICT_THRESHOLDS.GOOD) return "good";
    if (score >= VERDICT_THRESHOLDS.AVERAGE) return "average";
    if (score >= VERDICT_THRESHOLDS.BELOW_AVERAGE) return "below average";
    if (score >= VERDICT_THRESHOLDS.POOR) return "poor";
    return "very poor";
  }

  static generateRecommendations(sectionData, keywordData, formattingData, score) {
    const critical = [];
    const improvements = [];

    const missingRequired = sectionData.missingRequiredSections || [];
    if (missingRequired.length > 0) {
      critical.push(`Add missing required sections: ${missingRequired.join(", ")}`);
    }

    if (formattingData.ruleFindings.length > 0) {
      const majorIssues = formattingData.ruleFindings.filter((issue) =>
        ["multiColumnLayout", "tablesUsed", "tooManyPages"].includes(issue),
      );

      if (majorIssues.length > 0) {
        critical.push(`Fix major formatting issues: ${majorIssues.join(", ")}`);
      } else {
        improvements.push(`Address formatting issues: ${formattingData.ruleFindings.join(", ")}`);
      }
    }

    const stuffingSignals = keywordData.stuffingSignals || [];
    if (stuffingSignals.length > 0) {
      critical.push(
        `Remove keyword stuffing for: ${stuffingSignals.map((s) => s.keyword).join(", ")}`,
      );
    }

    const actionVerbCount = keywordData.actionVerbs?.count || 0;
    if (actionVerbCount < 10) {
      improvements.push(`Add more action verbs (currently ${actionVerbCount}, aim for 10+)`);
    }

    const achievements = keywordData.quantifiedAchievements || [];
    if (achievements.length < 3) {
      improvements.push("Include more quantified achievements (numbers, percentages, metrics)");
    }

    if (score < 40) {
      critical.push("Overall score is low - consider a comprehensive resume rewrite");
    } else if (score < 60) {
      improvements.push(
        "Score is average - focus on adding relevant keywords and quantified results",
      );
    }

    return { critical, improvements };
  }
}

// Main ATS Scoring function
export const atsScoring = ({ sectionData, keywordData, formattingData, rulesPath }) => {
  try {
    InputValidator.validate(sectionData, keywordData, formattingData);

    const defaultRulesPath = path.join(__dirname, "../rules/scoring.weights.json");
    const effectiveRulesPath = rulesPath || defaultRulesPath;
    const scoringRules = RulesLoader.load(effectiveRulesPath);

    const explanations = [];

    const sectionsResult = new SectionsScoreCalculator(scoringRules, explanations).calculate(
      sectionData,
    );
    const keywordsResult = new KeywordsScoreCalculator(scoringRules, explanations).calculate(
      keywordData,
    );
    const formattingResult = new FormattingScoreCalculator(scoringRules, explanations).calculate(
      formattingData,
    );
    const penaltiesResult = new PenaltiesCalculator(scoringRules, explanations).calculate(
      keywordData,
    );
    const experienceResult = new ExperienceScoreCalculator(scoringRules, explanations).calculate(
      keywordData,
      sectionData,
    );
    const skillsResult = new SkillsScoreCalculator(scoringRules, explanations).calculate(
      keywordData,
    );

    const totalScore =
      sectionsResult.score +
      keywordsResult.score +
      formattingResult.score +
      penaltiesResult.score +
      experienceResult.score +
      skillsResult.score;

    const finalScore = Math.max(
      SCORE_LIMITS.MIN,
      Math.min(SCORE_LIMITS.MAX, Math.round(totalScore)),
    );

    const verdict = VerdictEngine.determineVerdict(finalScore);
    const recommendations = VerdictEngine.generateRecommendations(
      sectionData,
      keywordData,
      formattingData,
      finalScore,
    );

    return {
      score: finalScore,
      verdict,
      breakdown: {
        sections: sectionsResult,
        keywords: keywordsResult,
        formatting: formattingResult,
        experience_quality: experienceResult,
        skills_relevance: skillsResult,
        penalties: penaltiesResult,
      },
      explanations,
      recommendations,
      meta: {
        scoringVersion: scoringRules.meta?.version || "unknown",
        analyzer: "atsScoring",
        timestamp: new Date().toISOString(),
        verdictThresholds: VERDICT_THRESHOLDS,
      },
    };
  } catch (error) {
    if (error instanceof ATSScoringError) {
      throw error;
    }
    throw new ATSScoringError(`Unexpected error in ATS scoring: ${error.message}`, "UNKNOWN_ERROR");
  }
};

export const clearRulesCache = () => RulesLoader.clearCache();

export const testHelpers = {
  RulesLoader,
  InputValidator,
  SectionsScoreCalculator,
  KeywordsScoreCalculator,
  FormattingScoreCalculator,
  PenaltiesCalculator,
  ExperienceScoreCalculator,
  SkillsScoreCalculator,
  VerdictEngine,
  VERDICT_THRESHOLDS,
  SEVERITY,
  SCORE_LIMITS,
  ATSScoringError,
};
