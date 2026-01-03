import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Advanced ATS Scoring Engine
 * Optimized for accuracy, performance, and comprehensive analysis
 */

/**
 * Score thresholds for verdicts with more granular levels
 */
const VERDICT_THRESHOLDS = {
  excellent: 90,
  very_good: 80,
  good: 70,
  average: 60,
  below_average: 50,
  poor: 30,
  very_poor: 0,
};

/**
 * Severity levels with impact weights
 */
const SEVERITY = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
};

/**
 * Scoring weights and multipliers for advanced calculations
 */
const SCORING_MULTIPLIERS = {
  SECTION_COMPLETENESS: 1.2,
  KEYWORD_RELEVANCE: 1.5,
  EXPERIENCE_DEPTH: 1.3,
  FORMATTING_QUALITY: 1.1,
  SKILLS_ALIGNMENT: 1.4,
  PENALTY_MULTIPLIER: 0.8,
};

/**
 * Cache for loaded scoring rules to avoid repeated file reads
 */
let cachedScoringRules = null;

/**
 * Loads and caches scoring rules from JSON file
 * @param {string} rulesPath - Path to the scoring rules JSON file
 * @param {boolean} [forceReload=false] - Force reload even if cached
 * @returns {Object} Scoring rules configuration
 * @throws {Error} If rules file cannot be loaded or is invalid
 */
function loadScoringRules(rulesPath, forceReload = false) {
  if (cachedScoringRules && !forceReload) {
    return cachedScoringRules;
  }

  try {
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");
    const rules = JSON.parse(rulesContent);

    // Validate required structure
    validateRulesStructure(rules);

    cachedScoringRules = rules;
    return rules;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Scoring rules file not found: ${rulesPath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in scoring rules file: ${error.message}`);
    }
    throw new Error(`Failed to load scoring rules: ${error.message}`);
  }
}

/**
 * Validates the structure of scoring rules
 * @param {Object} rules - Rules object to validate
 * @throws {Error} If validation fails
 */
function validateRulesStructure(rules) {
  const requiredFields = ["baseWeights", "scoreScale"];

  for (const field of requiredFields) {
    if (!rules[field]) {
      throw new Error(`Invalid rules structure: missing required field '${field}'`);
    }
  }

  // Validate score scale
  if (typeof rules.scoreScale.min !== "number" || typeof rules.scoreScale.max !== "number") {
    throw new Error("Invalid rules structure: scoreScale must have numeric min and max");
  }

  if (rules.scoreScale.min >= rules.scoreScale.max) {
    throw new Error("Invalid rules structure: scoreScale.min must be less than max");
  }
}

/**
 * Validates input parameters for scoring
 * @param {SectionData} sectionData - Section detection data
 * @param {KeywordData} keywordData - Keyword matching data
 * @param {FormattingData} formattingData - Formatting analysis data
 * @throws {Error} If validation fails
 */
function validateInput(sectionData, keywordData, formattingData) {
  // Validate section data
  if (!sectionData || !Array.isArray(sectionData.sections)) {
    throw new Error("atsScoring: sectionData with sections array is required");
  }

  // Validate keyword data
  if (!keywordData || typeof keywordData.globalMatches !== "object") {
    throw new Error("atsScoring: keywordData with globalMatches is required");
  }

  // Validate formatting data
  if (!formattingData || !Array.isArray(formattingData.ruleFindings)) {
    throw new Error("atsScoring: formattingData with ruleFindings array is required");
  }
}

/**
 * Calculates sections score with advanced weighting
 */
function calculateSectionsScore(sectionData, scoringRules, explanations) {
  let score = 0;
  let totalPossibleScore = 0;
  let foundSections = 0;
  let requiredSections = 0;
  let missingCriticalSections = 0;

  sectionData.sections.forEach((section) => {
    const weight = scoringRules.sectionWeights?.[section.key] || 0;
    totalPossibleScore += weight;

    if (section.required) {
      requiredSections++;
    }

    if (section.found) {
      foundSections++;
      score += weight * SCORING_MULTIPLIERS.SECTION_COMPLETENESS;
      explanations.push({
        category: "section",
        message: `Section '${section.displayName}' found (+${weight} points)`,
        impact: weight,
        severity: SEVERITY.POSITIVE,
      });
    } else if (section.required) {
      const penalty =
        (scoringRules.missingSectionPenalty?.required || -5) *
        SCORING_MULTIPLIERS.PENALTY_MULTIPLIER;
      score += penalty;
      missingCriticalSections++;
      explanations.push({
        category: "section",
        message: `Missing required section: '${section.displayName}' (${Math.round(penalty)} points)`,
        impact: penalty,
        severity: SEVERITY.CRITICAL,
      });
    }
  });

  // Bonus for complete section coverage
  const completenessRatio = foundSections / sectionData.sections.length;
  if (completenessRatio >= 0.9) {
    const bonus = Math.round(totalPossibleScore * 0.1);
    score += bonus;
    explanations.push({
      category: "section",
      message: `Excellent section completeness (${Math.round(completenessRatio * 100)}%)`,
      impact: bonus,
      severity: SEVERITY.POSITIVE,
    });
  }

  // Penalty for missing too many required sections
  if (missingCriticalSections > 1) {
    const additionalPenalty = missingCriticalSections * -2;
    score += additionalPenalty;
    explanations.push({
      category: "section",
      message: `Multiple missing required sections (${missingCriticalSections})`,
      impact: additionalPenalty,
      severity: SEVERITY.HIGH,
    });
  }

  return Math.max(0, Math.min(totalPossibleScore * 1.2, score)); // Allow slight bonus over maximum
}

/**
 * Calculates keywords score with advanced relevance analysis
 */
function calculateKeywordsScore(keywordData, scoringRules, explanations) {
  let score = 0;
  const maxScore = scoringRules.baseWeights.keywords;
  let totalKeywords = 0;
  let highImpactKeywords = 0;
  let uniqueGroups = 0;

  Object.entries(keywordData.globalMatches || {}).forEach(([groupName, groupData]) => {
    if (groupData.uniqueCount > 0) {
      uniqueGroups++;
      const importance = groupData.importance || "medium";
      const weight = scoringRules.keywordWeights?.[importance] || 1;

      // Apply relevance multiplier
      const relevanceMultiplier =
        importance === "very_high"
          ? 1.5
          : importance === "high"
            ? 1.2
            : importance === "medium"
              ? 1.0
              : 0.7;

      const groupScore =
        weight *
        groupData.uniqueCount *
        relevanceMultiplier *
        SCORING_MULTIPLIERS.KEYWORD_RELEVANCE;
      score += groupScore;
      totalKeywords += groupData.uniqueCount;

      if (importance === "very_high" || importance === "high") {
        highImpactKeywords += groupData.uniqueCount;
      }

      explanations.push({
        category: "keyword",
        message: `${groupData.uniqueCount} ${importance} priority keywords in '${groupName}'`,
        impact: Math.round(groupScore),
        severity: importance === "very_high" ? SEVERITY.HIGH : SEVERITY.POSITIVE,
      });
    }
  });

  // Bonus for keyword diversity
  if (uniqueGroups >= 5) {
    const diversityBonus = Math.round(maxScore * 0.15);
    score += diversityBonus;
    explanations.push({
      category: "keyword",
      message: `Excellent keyword diversity (${uniqueGroups} groups)`,
      impact: diversityBonus,
      severity: SEVERITY.POSITIVE,
    });
  }

  // Bonus for high-impact keywords
  if (highImpactKeywords >= 8) {
    const impactBonus = Math.round(maxScore * 0.1);
    score += impactBonus;
    explanations.push({
      category: "keyword",
      message: `Strong high-impact keywords (${highImpactKeywords} found)`,
      impact: impactBonus,
      severity: SEVERITY.HIGH,
    });
  }

  // Penalty for too few keywords
  if (totalKeywords < 10) {
    const penalty = Math.round(maxScore * -0.2);
    score += penalty;
    explanations.push({
      category: "keyword",
      message: `Limited keyword coverage (${totalKeywords} total)`,
      impact: penalty,
      severity: SEVERITY.MEDIUM,
    });
  }

  return Math.min(maxScore * 1.3, score); // Allow bonus over maximum
}

/**
 * Calculates formatting score
 */
function calculateFormattingScore(formattingData, scoringRules, explanations) {
  let penalty = 0;
  const baseScore = scoringRules.baseWeights.formatting;

  (formattingData.ruleFindings || []).forEach((ruleKey) => {
    const penaltyValue = scoringRules.formattingPenaltyMap?.[ruleKey] || 0;
    if (penaltyValue !== 0) {
      penalty += penaltyValue;
      explanations.push({
        category: "formatting",
        message: `Formatting issue: '${ruleKey}'`,
        impact: penaltyValue,
        severity: SEVERITY.NEGATIVE,
      });
    }
  });

  const maxPenalty = scoringRules.caps?.maxFormattingPenalty || -6;
  penalty = Math.max(penalty, maxPenalty);

  return Math.max(0, baseScore + penalty); // Positive score, reduced by penalties
}

/**
 * Calculates penalties
 */
function calculatePenalties(keywordData, scoringRules, explanations) {
  let penalty = 0;

  // Keyword stuffing
  const stuffingSignals = keywordData.stuffingSignals || [];
  const maxPenalty = scoringRules.caps?.maxKeywordPenalty || -15;
  const penaltyPerStuffing = maxPenalty / 3;

  stuffingSignals.forEach((signal) => {
    penalty += penaltyPerStuffing;
    explanations.push({
      category: "penalty",
      message: `Keyword stuffing: '${signal.keyword}'`,
      impact: penaltyPerStuffing,
      severity: SEVERITY.NEGATIVE,
    });
  });

  return Math.max(penalty, maxPenalty); // More negative
}

/**
 * Calculates experience quality with advanced analysis
 */
function calculateExperienceQuality(keywordData, scoringRules, explanations) {
  let score = 0;
  const maxScore = scoringRules.baseWeights.experience_quality;

  const actionVerbCount = keywordData.actionVerbs?.count || 0;
  const quantifiedAchievements = keywordData.quantifiedAchievements || [];
  const actionVerbBonus = scoringRules.experienceSignals?.actionVerbsUsed || 5;
  const quantifiedBonus = scoringRules.experienceSignals?.quantifiedAchievements || 5;

  // Advanced action verb scoring
  let actionVerbScore = 0;
  if (actionVerbCount >= 12) {
    actionVerbScore = actionVerbBonus * 1.2;
    explanations.push({
      category: "experience",
      message: `Outstanding action verbs (${actionVerbCount} found)`,
      impact: Math.round(actionVerbScore),
      severity: SEVERITY.HIGH,
    });
  } else if (actionVerbCount >= 8) {
    actionVerbScore = actionVerbBonus;
    explanations.push({
      category: "experience",
      message: `Excellent action verbs (${actionVerbCount} found)`,
      impact: Math.round(actionVerbScore),
      severity: SEVERITY.POSITIVE,
    });
  } else if (actionVerbCount >= 5) {
    actionVerbScore = actionVerbBonus * 0.8;
    explanations.push({
      category: "experience",
      message: `Good action verbs (${actionVerbCount} found)`,
      impact: Math.round(actionVerbScore),
      severity: SEVERITY.POSITIVE,
    });
  } else if (actionVerbCount >= 3) {
    actionVerbScore = actionVerbBonus * 0.5;
    explanations.push({
      category: "experience",
      message: `Some action verbs (${actionVerbCount} found)`,
      impact: Math.round(actionVerbScore),
      severity: SEVERITY.LOW,
    });
  } else {
    explanations.push({
      category: "experience",
      message: `Limited action verbs (${actionVerbCount} found)`,
      impact: 0,
      severity: SEVERITY.MEDIUM,
    });
  }

  // Advanced quantified achievements scoring
  let quantifiedScore = 0;
  if (quantifiedAchievements.length >= 5) {
    quantifiedScore = quantifiedBonus * 1.3;
    explanations.push({
      category: "experience",
      message: `Exceptional quantified achievements (${quantifiedAchievements.length} found)`,
      impact: Math.round(quantifiedScore),
      severity: SEVERITY.HIGH,
    });
  } else if (quantifiedAchievements.length >= 3) {
    quantifiedScore = quantifiedBonus;
    explanations.push({
      category: "experience",
      message: `Strong quantified achievements (${quantifiedAchievements.length} found)`,
      impact: Math.round(quantifiedScore),
      severity: SEVERITY.POSITIVE,
    });
  } else if (quantifiedAchievements.length >= 1) {
    quantifiedScore = quantifiedBonus * 0.7;
    explanations.push({
      category: "experience",
      message: `Some quantified achievements (${quantifiedAchievements.length} found)`,
      impact: Math.round(quantifiedScore),
      severity: SEVERITY.POSITIVE,
    });
  } else {
    explanations.push({
      category: "experience",
      message: `No quantified achievements found`,
      impact: 0,
      severity: SEVERITY.MEDIUM,
    });
  }

  score = actionVerbScore + quantifiedScore;

  // Experience depth bonus
  const experienceDepth = Math.min(actionVerbCount + quantifiedAchievements.length * 2, 20);
  if (experienceDepth >= 15) {
    const depthBonus = Math.round(maxScore * 0.2);
    score += depthBonus;
    explanations.push({
      category: "experience",
      message: `Deep experience demonstrated (${experienceDepth} indicators)`,
      impact: depthBonus,
      severity: SEVERITY.POSITIVE,
    });
  }

  return Math.min(maxScore * 1.2, score); // Allow slight bonus
}

/**
 * Calculates skills relevance with advanced analysis
 */
function calculateSkillsRelevance(keywordData, scoringRules, explanations) {
  let score = 0;
  const maxScore = scoringRules.baseWeights.skills_relevance;

  const matchedSkills = keywordData.matchedSkills || [];
  const totalSkills = keywordData.totalSkills || 1;
  const skillMatchRatio = matchedSkills.length / totalSkills;

  // Advanced skills matching with relevance tiers
  let relevanceScore = 0;
  if (skillMatchRatio >= 0.8) {
    relevanceScore = maxScore * 0.9;
    explanations.push({
      category: "skills",
      message: `Excellent skills match (${Math.round(skillMatchRatio * 100)}% of skills matched)`,
      impact: Math.round(relevanceScore),
      severity: SEVERITY.HIGH,
    });
  } else if (skillMatchRatio >= 0.6) {
    relevanceScore = maxScore * 0.7;
    explanations.push({
      category: "skills",
      message: `Good skills match (${Math.round(skillMatchRatio * 100)}% of skills matched)`,
      impact: Math.round(relevanceScore),
      severity: SEVERITY.POSITIVE,
    });
  } else if (skillMatchRatio >= 0.4) {
    relevanceScore = maxScore * 0.5;
    explanations.push({
      category: "skills",
      message: `Moderate skills match (${Math.round(skillMatchRatio * 100)}% of skills matched)`,
      impact: Math.round(relevanceScore),
      severity: SEVERITY.MEDIUM,
    });
  } else if (skillMatchRatio >= 0.2) {
    relevanceScore = maxScore * 0.3;
    explanations.push({
      category: "skills",
      message: `Limited skills match (${Math.round(skillMatchRatio * 100)}% of skills matched)`,
      impact: Math.round(relevanceScore),
      severity: SEVERITY.LOW,
    });
  } else {
    relevanceScore = maxScore * 0.1;
    explanations.push({
      category: "skills",
      message: `Poor skills match (${Math.round(skillMatchRatio * 100)}% of skills matched)`,
      impact: Math.round(relevanceScore),
      severity: SEVERITY.MEDIUM,
    });
  }

  score += relevanceScore;

  // Technical skills bonus
  const technicalSkills = matchedSkills.filter((skill) => skill.category === "technical").length;
  if (technicalSkills >= 5) {
    const techBonus = Math.round(maxScore * 0.15);
    score += techBonus;
    explanations.push({
      category: "skills",
      message: `Strong technical skills (${technicalSkills} matched)`,
      impact: techBonus,
      severity: SEVERITY.POSITIVE,
    });
  } else if (technicalSkills >= 3) {
    const techBonus = Math.round(maxScore * 0.1);
    score += techBonus;
    explanations.push({
      category: "skills",
      message: `Good technical skills (${technicalSkills} matched)`,
      impact: techBonus,
      severity: SEVERITY.POSITIVE,
    });
  }

  // Soft skills bonus
  const softSkills = matchedSkills.filter((skill) => skill.category === "soft").length;
  if (softSkills >= 3) {
    const softBonus = Math.round(maxScore * 0.1);
    score += softBonus;
    explanations.push({
      category: "skills",
      message: `Well-rounded soft skills (${softSkills} matched)`,
      impact: softBonus,
      severity: SEVERITY.POSITIVE,
    });
  }

  return Math.min(maxScore * 1.1, score); // Allow slight bonus
}

/**
 * Determines verdict based on final score
 * @param {number} score - Final calculated score
 * @returns {string} Verdict (excellent, good, average, poor)
 */
function determineVerdict(score) {
  if (score >= VERDICT_THRESHOLDS.excellent) return "excellent";
  if (score >= VERDICT_THRESHOLDS.very_good) return "very_good";
  if (score >= VERDICT_THRESHOLDS.good) return "good";
  if (score >= VERDICT_THRESHOLDS.average) return "average";
  if (score >= VERDICT_THRESHOLDS.below_average) return "below_average";
  if (score >= VERDICT_THRESHOLDS.poor) return "poor";
  return "very_poor";
}

/**
 * Generates actionable recommendations based on analysis
 * @param {SectionData} sectionData - Section detection data
 * @param {KeywordData} keywordData - Keyword matching data
 * @param {FormattingData} formattingData - Formatting analysis data
 * @param {number} score - Final score
 * @returns {{critical: string[], improvements: string[]}}
 */
function generateRecommendations(sectionData, keywordData, formattingData, score) {
  const critical = [];
  const improvements = [];

  // Check for missing required sections
  const missingRequired = sectionData.missingRequiredSections || [];
  if (missingRequired.length > 0) {
    critical.push(`Add missing required sections: ${missingRequired.join(", ")}`);
  }

  // Check formatting issues
  if (formattingData.ruleFindings.length > 0) {
    const majorIssues = formattingData.ruleFindings.filter((issue) =>
      ["multiColumnLayout", "tablesUsed", "tooManyPages"].includes(issue),
    );

    if (majorIssues.length > 0) {
      critical.push("Fix major formatting issues: " + majorIssues.join(", "));
    } else {
      improvements.push("Address formatting issues: " + formattingData.ruleFindings.join(", "));
    }
  }

  // Check keyword stuffing
  const stuffingSignals = keywordData.stuffingSignals || [];
  if (stuffingSignals.length > 0) {
    critical.push(
      `Remove keyword stuffing for: ${stuffingSignals.map((s) => s.keyword).join(", ")}`,
    );
  }

  // Check action verbs
  const actionVerbCount = keywordData.actionVerbs?.count || 0;
  if (actionVerbCount < 5) {
    improvements.push(`Add more action verbs (currently ${actionVerbCount}, aim for 5+)`);
  }

  // Check quantified achievements
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
export const atsScoring = ({ sectionData, keywordData, formattingData, rulesPath }) => {
  // Validate input
  validateInput(sectionData, keywordData, formattingData);

  // Load scoring rules
  const defaultRulesPath = path.join(__dirname, "../rules/scoring.weights.json");
  const effectiveRulesPath = rulesPath || defaultRulesPath;
  const scoringRules = loadScoringRules(effectiveRulesPath);

  const explanations = [];

  // Calculate component scores using dedicated functions
  const sectionsScore = calculateSectionsScore(sectionData, scoringRules, explanations);
  const keywordsScore = calculateKeywordsScore(keywordData, scoringRules, explanations);
  const formattingScore = calculateFormattingScore(formattingData, scoringRules, explanations);
  const penaltiesScore = calculatePenalties(keywordData, scoringRules, explanations);
  const experienceScore = calculateExperienceQuality(keywordData, scoringRules, explanations);
  const skillsScore = calculateSkillsRelevance(keywordData, scoringRules, explanations);

  // Calculate total score
  const totalScore =
    sectionsScore +
    keywordsScore +
    formattingScore +
    penaltiesScore +
    experienceScore +
    skillsScore;

  // Final score with bounds checking
  const finalScore = Math.max(0, Math.min(100, totalScore));
  const verdict = determineVerdict(finalScore);

  // Generate recommendations
  const recommendations = generateRecommendations(
    sectionData,
    keywordData,
    formattingData,
    finalScore,
  );

  // Breakdown
  const breakdown = {
    sections: sectionsScore,
    keywords: keywordsScore,
    formatting: formattingScore,
    experience_quality: experienceScore,
    skills_relevance: skillsScore,
    penalties: penaltiesScore,
  };

  return {
    score: finalScore,
    verdict,
    breakdown,
    explanations,
    recommendations,
    meta: {
      scoringVersion: scoringRules.meta?.version || "unknown",
      analyzer: "atsScoring",
      timestamp: new Date().toISOString(),
      verdictThresholds: VERDICT_THRESHOLDS,
    },
  };
};

/**
 * Clears the cached scoring rules (useful for testing or rule updates)
 */
export function clearRulesCache() {
  cachedScoringRules = null;
}

/**
 * Export helper functions for testing purposes
 */
export const testHelpers = {
  loadScoringRules,
  validateInput,
  validateRulesStructure,
  calculateSectionsScore,
  calculateKeywordsScore,
  calculateFormattingScore,
  calculatePenalties,
  calculateExperienceQuality,
  calculateSkillsRelevance,
  determineVerdict,
  generateRecommendations,
  clearRulesCache,
  VERDICT_THRESHOLDS,
  SEVERITY,
};
