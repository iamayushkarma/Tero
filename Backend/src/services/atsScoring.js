import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} SectionData
 * @property {Array<{key: string, displayName: string, found: boolean, required: boolean}>} sections
 * @property {string[]} missingRequiredSections
 */

/**
 * @typedef {Object} KeywordData
 * @property {Object.<string, {uniqueCount: number, importance: string}>} globalMatches
 * @property {Array<{keyword: string}>} stuffingSignals
 * @property {{count: number}} actionVerbs
 * @property {Array} quantifiedAchievements
 * @property {Array<{category: string}>} matchedSkills
 * @property {number} totalSkills
 */

/**
 * @typedef {Object} FormattingData
 * @property {string[]} ruleFindings
 */

/**
 * @typedef {Object} ScoringResult
 * @property {number} score
 * @property {string} verdict
 * @property {Object} breakdown
 * @property {Array} explanations
 * @property {Object} recommendations
 * @property {Object} meta
 */

// Constants
const VERDICT_THRESHOLDS = Object.freeze({
  EXCELLENT: 85,
  VERY_GOOD: 75,
  GOOD: 65,
  AVERAGE: 55,
  BELOW_AVERAGE: 45,
  POOR: 35,
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

const SCORING_MULTIPLIERS = Object.freeze({
  SECTION_COMPLETENESS: 1.2,
  KEYWORD_RELEVANCE: 1.5,
  EXPERIENCE_DEPTH: 1.3,
  FORMATTING_QUALITY: 1.1,
  SKILLS_ALIGNMENT: 1.4,
  PENALTY_MULTIPLIER: 0.8,
});

const SCORE_LIMITS = Object.freeze({
  MIN: 5,
  MAX: 95,
});

// Cache for scoring rules
let cachedScoringRules = null;

/**
 * Custom error class for ATS scoring errors
 */
class ATSScoringError extends Error {
  constructor(message, code = "ATS_ERROR") {
    super(message);
    this.name = "ATSScoringError";
    this.code = code;
  }
}

/**
 * RulesLoader - Handles loading and validation of scoring rules
 */
class RulesLoader {
  /**
   * Loads scoring rules from JSON file with caching
   * @param {string} rulesPath - Path to scoring rules file
   * @param {boolean} forceReload - Force reload even if cached
   * @returns {Object} Scoring rules configuration
   * @throws {ATSScoringError}
   */
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

  /**
   * Validates scoring rules structure
   * @param {Object} rules - Rules to validate
   * @throws {ATSScoringError}
   */
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

    if (typeof min !== "number" || typeof max !== "number") {
      throw new ATSScoringError(
        "Invalid rules structure: scoreScale must have numeric min and max",
        "INVALID_SCORE_SCALE",
      );
    }

    if (min >= max) {
      throw new ATSScoringError(
        "Invalid rules structure: scoreScale.min must be less than max",
        "INVALID_SCORE_SCALE",
      );
    }
  }

  /**
   * Handles loading errors with appropriate error messages
   * @param {Error} error - Original error
   * @param {string} rulesPath - Path that failed to load
   * @throws {ATSScoringError}
   */
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

  /**
   * Clears the cached scoring rules
   */
  static clearCache() {
    cachedScoringRules = null;
  }
}

/**
 * InputValidator - Validates input data for scoring
 */
class InputValidator {
  /**
   * Validates all required input data
   * @param {SectionData} sectionData
   * @param {KeywordData} keywordData
   * @param {FormattingData} formattingData
   * @throws {ATSScoringError}
   */
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

/**
 * ScoreCalculator - Base class for score calculations
 */
class ScoreCalculator {
  constructor(scoringRules, explanations) {
    this.scoringRules = scoringRules;
    this.explanations = explanations;
  }

  /**
   * Adds an explanation entry
   * @param {string} category
   * @param {string} message
   * @param {number} impact
   * @param {string} severity
   */
  addExplanation(category, message, impact, severity) {
    this.explanations.push({ category, message, impact, severity });
  }

  /**
   * Clamps score within min and max bounds
   * @param {number} score
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  clamp(score, min, max) {
    return Math.max(min, Math.min(max, score));
  }
}

/**
 * SectionsScoreCalculator - Calculates sections score
 */
class SectionsScoreCalculator extends ScoreCalculator {
  calculate(sectionData) {
    const maxScore = this.scoringRules.baseWeights.sections;
    let score = 0;
    let foundSections = 0;
    let missingRequiredCount = 0;

    // Calculate base score from sections
    sectionData.sections.forEach((section) => {
      if (section.found) {
        foundSections++;
        const weight = this.scoringRules.sectionWeights?.[section.key] || 1;
        score += weight;
        this.addExplanation(
          "section",
          `Section '${section.displayName}' found`,
          weight,
          SEVERITY.POSITIVE,
        );
      } else if (section.required) {
        missingRequiredCount++;
        const penalty = this.scoringRules.missingSectionPenalty?.required || -2;
        score += penalty;
        this.addExplanation(
          "section",
          `Missing required section: '${section.displayName}'`,
          penalty,
          SEVERITY.CRITICAL,
        );
      }
    });

    // Apply bonuses and penalties
    this.applyCoverageBonus(foundSections, sectionData.sections.length, maxScore);
    this.applyMultipleMissingPenalty(missingRequiredCount);

    // return this.clamp(score, 0, maxScore);
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

  applyCoverageBonus(foundSections, totalSections, maxScore) {
    const coverageRatio = foundSections / totalSections;

    if (coverageRatio >= 0.9) {
      const bonus = Math.round(maxScore * 0.1);
      this.addExplanation(
        "section",
        `Excellent section coverage (${Math.round(coverageRatio * 100)}%)`,
        bonus,
        SEVERITY.POSITIVE,
      );
      return bonus;
    }
    return 0;
  }

  applyMultipleMissingPenalty(missingCount) {
    if (missingCount > 1) {
      const penalty = missingCount * -1;
      this.addExplanation("section", "Multiple missing required sections", penalty, SEVERITY.HIGH);
      return penalty;
    }
    return 0;
  }
}

/**
 * KeywordsScoreCalculator - Calculates keywords score
 */
class KeywordsScoreCalculator extends ScoreCalculator {
  calculate(keywordData) {
    const maxScore = this.scoringRules.baseWeights.keywords;
    let score = 0;
    let totalKeywords = 0;
    let highImpactCount = 0;
    let veryHighImpactCount = 0;

    // Calculate base keyword score
    Object.entries(keywordData.globalMatches || {}).forEach(([groupName, groupData]) => {
      if (groupData.uniqueCount > 0) {
        const importance = groupData.importance || "medium";
        const weight = this.scoringRules.keywordWeights?.[importance] || 1.0;
        const groupScore = weight * groupData.uniqueCount;

        score += groupScore;
        totalKeywords += groupData.uniqueCount;

        if (importance === "very_high") veryHighImpactCount += groupData.uniqueCount;
        else if (importance === "high") highImpactCount += groupData.uniqueCount;

        this.addExplanation(
          "keyword",
          `${groupData.uniqueCount} ${importance} priority keywords in '${groupName}'`,
          Math.round(groupScore),
          importance === "very_high" ? SEVERITY.HIGH : SEVERITY.POSITIVE,
        );
      }
    });

    // Apply bonuses and penalties
    score += this.applyDiversityBonus(keywordData, maxScore);
    score += this.applyHighImpactBonus(highImpactCount, veryHighImpactCount, maxScore);
    score += this.applyLowCoveragePenalty(totalKeywords, maxScore);

    // return this.clamp(score, 0, maxScore * 1.2);
    const finalScore = this.clamp(score, 0, maxScore * 1.2);

    return {
      score: finalScore,
      maxScore: maxScore * 1.2,
      totalKeywords: totalKeywords,
      highImpactCount: highImpactCount,
      veryHighImpactCount: veryHighImpactCount,
      percentage: Math.round((finalScore / (maxScore * 1.2)) * 100),
    };
  }

  applyDiversityBonus(keywordData, maxScore) {
    const uniqueGroups = Object.keys(keywordData.globalMatches || {}).length;

    if (uniqueGroups >= 4) {
      const bonus = Math.round(maxScore * 0.15);
      this.addExplanation(
        "keyword",
        `Excellent keyword diversity (${uniqueGroups} categories)`,
        bonus,
        SEVERITY.POSITIVE,
      );
      return bonus;
    } else if (uniqueGroups >= 3) {
      const bonus = Math.round(maxScore * 0.1);
      this.addExplanation(
        "keyword",
        `Good keyword diversity (${uniqueGroups} categories)`,
        bonus,
        SEVERITY.POSITIVE,
      );
      return bonus;
    }
    return 0;
  }

  applyHighImpactBonus(highCount, veryHighCount, maxScore) {
    const totalHighImpact = highCount + veryHighCount;

    if (totalHighImpact >= 12) {
      const bonus = Math.round(maxScore * 0.15);
      this.addExplanation(
        "keyword",
        `Outstanding high-impact keywords (${totalHighImpact} found)`,
        bonus,
        SEVERITY.HIGH,
      );
      return bonus;
    } else if (totalHighImpact >= 8) {
      const bonus = Math.round(maxScore * 0.1);
      this.addExplanation(
        "keyword",
        `Strong high-impact keywords (${totalHighImpact} found)`,
        bonus,
        SEVERITY.HIGH,
      );
      return bonus;
    }
    return 0;
  }

  applyLowCoveragePenalty(totalKeywords, maxScore) {
    if (totalKeywords < 5) {
      const penalty = Math.round(maxScore * -0.3);
      this.addExplanation(
        "keyword",
        `Limited keyword coverage (${totalKeywords} total)`,
        penalty,
        SEVERITY.MEDIUM,
      );
      return penalty;
    }
    return 0;
  }
}

/**
 * FormattingScoreCalculator - Calculates formatting score
 */
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

    const maxPenalty = this.scoringRules.caps?.maxFormattingPenalty || -6;
    penalty = Math.max(penalty, maxPenalty);

    // return this.clamp(maxScore + penalty, 0, maxScore);
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

/**
 * PenaltiesCalculator - Calculates penalties
 */
class PenaltiesCalculator extends ScoreCalculator {
  calculate(keywordData) {
    let penalty = 0;
    const stuffingSignals = keywordData.stuffingSignals || [];
    const maxPenalty = this.scoringRules.caps?.maxKeywordPenalty || -5;

    stuffingSignals.forEach((signal) => {
      penalty += -1;
      this.addExplanation(
        "penalty",
        `Keyword stuffing: '${signal.keyword}'`,
        -1,
        SEVERITY.NEGATIVE,
      );
    });

    // return Math.max(penalty, maxPenalty);
    const finalPenalty = Math.max(penalty, maxPenalty);

    return {
      score: finalPenalty,
      maxPenalty: maxPenalty,
      stuffingCount: stuffingSignals.length,
      totalPenalty: penalty,
    };
  }
}

/**
 * ExperienceScoreCalculator - Calculates experience quality score
 */
class ExperienceScoreCalculator extends ScoreCalculator {
  calculate(keywordData) {
    const maxScore = this.scoringRules.baseWeights.experience_quality;
    const actionVerbCount = keywordData.actionVerbs?.count || 0;
    const quantifiedAchievements = keywordData.quantifiedAchievements || [];

    const actionVerbScore = this.calculateActionVerbScore(actionVerbCount);
    const quantifiedScore = this.calculateQuantifiedScore(quantifiedAchievements.length);

    let totalScore = actionVerbScore + quantifiedScore;

    // Exceptional quality bonus
    if (actionVerbScore >= 7 && quantifiedScore >= 5) {
      totalScore += 1;
      this.addExplanation(
        "experience",
        "Exceptional experience quality demonstrated",
        1,
        SEVERITY.HIGH,
      );
    }

    // return this.clamp(totalScore, 0, maxScore);
    const finalScore = this.clamp(totalScore, 0, maxScore);

    return {
      score: finalScore,
      maxScore: maxScore,
      actionVerbCount: actionVerbCount,
      quantifiedCount: quantifiedAchievements.length,
      actionVerbScore: actionVerbScore,
      quantifiedScore: quantifiedScore,
      percentage: Math.round((finalScore / maxScore) * 100),
    };
  }

  calculateActionVerbScore(count) {
    const tiers = [
      { min: 15, score: 10, label: "Outstanding" },
      { min: 12, score: 9, label: "Excellent" },
      { min: 8, score: 7, label: "Good" },
      { min: 5, score: 5, label: "Some" },
      { min: 2, score: 3, label: "Few" },
      { min: 0, score: 1, label: "Minimal" },
    ];

    for (const tier of tiers) {
      if (count >= tier.min) {
        this.addExplanation(
          "experience",
          `${tier.label} action verbs (${count} found)`,
          tier.score,
          tier.score >= 5 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
        );
        return tier.score;
      }
    }

    this.addExplanation("experience", "No action verbs found", 0, SEVERITY.MEDIUM);
    return 0;
  }

  calculateQuantifiedScore(count) {
    const tiers = [
      { min: 6, score: 8, label: "Outstanding" },
      { min: 4, score: 7, label: "Excellent" },
      { min: 3, score: 6, label: "Strong" },
      { min: 2, score: 4, label: "Some" },
      { min: 1, score: 2, label: "Few" },
      { min: 0, score: 0, label: "None" },
    ];

    for (const tier of tiers) {
      if (count >= tier.min) {
        this.addExplanation(
          "experience",
          `${tier.label} quantified achievements (${count} found)`,
          tier.score,
          tier.score >= 5 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
        );
        return tier.score;
      }
    }

    this.addExplanation("experience", "No quantified achievements found", 0, SEVERITY.MEDIUM);
    return 0;
  }
}

/**
 * SkillsScoreCalculator - Calculates skills relevance score
 */
class SkillsScoreCalculator extends ScoreCalculator {
  calculate(keywordData) {
    const maxScore = this.scoringRules.baseWeights.skills_relevance;
    const matchedSkills = keywordData.matchedSkills || [];
    const totalSkills = keywordData.totalSkills || 1;
    const skillMatchRatio = matchedSkills.length / totalSkills;

    let score = this.calculateBaseSkillScore(skillMatchRatio, maxScore);
    score += this.calculateTechnicalBonus(matchedSkills, maxScore);

    // return this.clamp(score, 0, maxScore * 1.1);
    const finalScore = this.clamp(score, 0, maxScore * 1.1);

    return {
      score: finalScore,
      maxScore: maxScore * 1.1,
      matchedSkills: matchedSkills.length,
      totalSkills: totalSkills,
      matchRatio: skillMatchRatio,
      percentage: Math.round((finalScore / (maxScore * 1.1)) * 100),
    };
  }

  calculateBaseSkillScore(ratio, maxScore) {
    const tiers = [
      { min: 0.9, multiplier: 1.0, label: "Excellent" },
      { min: 0.7, multiplier: 0.9, label: "Very good" },
      { min: 0.5, multiplier: 0.8, label: "Good" },
      { min: 0.3, multiplier: 0.6, label: "Moderate" },
      { min: 0.1, multiplier: 0.4, label: "Limited" },
      { min: 0, multiplier: 0.2, label: "Poor" },
    ];

    for (const tier of tiers) {
      if (ratio >= tier.min) {
        const score = Math.round(maxScore * tier.multiplier);
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
    const technicalCount = matchedSkills.filter((s) => s.category === "technical").length;

    const tiers = [
      { min: 6, multiplier: 0.2, label: "Outstanding" },
      { min: 4, multiplier: 0.15, label: "Strong" },
      { min: 2, multiplier: 0.1, label: "Good" },
    ];

    for (const tier of tiers) {
      if (technicalCount >= tier.min) {
        const bonus = Math.round(maxScore * tier.multiplier);
        this.addExplanation(
          "skills",
          `${tier.label} technical skills (${technicalCount} matched)`,
          bonus,
          tier.multiplier >= 0.15 ? SEVERITY.HIGH : SEVERITY.POSITIVE,
        );
        return bonus;
      }
    }

    return 0;
  }
}

/**
 * VerdictEngine - Determines verdict and generates recommendations
 */
class VerdictEngine {
  static determineVerdict(score) {
    if (score >= VERDICT_THRESHOLDS.EXCELLENT) return "excellent";
    if (score >= VERDICT_THRESHOLDS.VERY_GOOD) return "very_good";
    if (score >= VERDICT_THRESHOLDS.GOOD) return "good";
    if (score >= VERDICT_THRESHOLDS.AVERAGE) return "average";
    if (score >= VERDICT_THRESHOLDS.BELOW_AVERAGE) return "below_average";
    if (score >= VERDICT_THRESHOLDS.POOR) return "poor";
    return "very_poor";
  }

  static generateRecommendations(sectionData, keywordData, formattingData, score) {
    const critical = [];
    const improvements = [];

    // Missing sections
    const missingRequired = sectionData.missingRequiredSections || [];
    if (missingRequired.length > 0) {
      critical.push(`Add missing required sections: ${missingRequired.join(", ")}`);
    }

    // Formatting issues
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

    // Keyword stuffing
    const stuffingSignals = keywordData.stuffingSignals || [];
    if (stuffingSignals.length > 0) {
      critical.push(
        `Remove keyword stuffing for: ${stuffingSignals.map((s) => s.keyword).join(", ")}`,
      );
    }

    // Action verbs
    const actionVerbCount = keywordData.actionVerbs?.count || 0;
    if (actionVerbCount < 5) {
      improvements.push(`Add more action verbs (currently ${actionVerbCount}, aim for 5+)`);
    }

    // Quantified achievements
    const achievements = keywordData.quantifiedAchievements || [];
    if (achievements.length === 0) {
      improvements.push("Include quantified achievements (numbers, percentages, metrics)");
    }

    // Score-based recommendations
    if (score < 50) {
      critical.push("Overall score is low - consider a comprehensive resume rewrite");
    } else if (score < 70) {
      improvements.push(
        "Score is average - focus on adding relevant keywords and quantified results",
      );
    }

    return { critical, improvements };
  }
}

/**
 * Main ATS Scoring function
 * @param {Object} params
 * @param {SectionData} params.sectionData
 * @param {KeywordData} params.keywordData
 * @param {FormattingData} params.formattingData
 * @param {string} [params.rulesPath]
 * @returns {ScoringResult}
 * @throws {ATSScoringError}
 */
export const atsScoring = ({ sectionData, keywordData, formattingData, rulesPath }) => {
  try {
    // Validate input
    InputValidator.validate(sectionData, keywordData, formattingData);

    // Load scoring rules
    const defaultRulesPath = path.join(__dirname, "../rules/scoring.weights.json");
    const effectiveRulesPath = rulesPath || defaultRulesPath;
    const scoringRules = RulesLoader.load(effectiveRulesPath);

    const explanations = [];

    // Calculate component scores
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
    );
    const skillsResult = new SkillsScoreCalculator(scoringRules, explanations).calculate(
      keywordData,
    );

    // Calculate final score
    const totalScore =
      sectionsResult.score +
      keywordsResult.score +
      formattingResult.score +
      penaltiesResult.score +
      experienceResult.score +
      skillsResult.score;

    const finalScore = Math.max(SCORE_LIMITS.MIN, Math.min(SCORE_LIMITS.MAX, totalScore));

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

// Exports
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
  SCORING_MULTIPLIERS,
  SCORE_LIMITS,
  ATSScoringError,
};
