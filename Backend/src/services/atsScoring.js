import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Score thresholds for verdicts
 */
const VERDICT_THRESHOLDS = {
  excellent: 85,
  good: 70,
  average: 50,
  poor: 0,
};

/**
 * Severity levels for explanations
 */
const SEVERITY = {
  POSITIVE: "positive",
  NEUTRAL: "neutral",
  NEGATIVE: "negative",
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
 * Calculates sections score
 */
function calculateSectionsScore(sectionData, scoringRules, explanations) {
  let score = 0;
  const maxScore = scoringRules.baseWeights.sections;

  sectionData.sections.forEach((section) => {
    if (section.found) {
      const weight = scoringRules.sectionWeights?.[section.key] || 0;
      score += weight;
      explanations.push({
        category: "section",
        message: `Section '${section.displayName}' found`,
        impact: weight,
        severity: SEVERITY.POSITIVE,
      });
    } else if (section.required) {
      const penalty = scoringRules.missingSectionPenalty?.required || -10;
      score += penalty;
      explanations.push({
        category: "section",
        message: `Missing required section: '${section.displayName}'`,
        impact: penalty,
        severity: SEVERITY.NEGATIVE,
      });
    }
  });

  return Math.max(0, Math.min(maxScore, score)); // Cap between 0 and max
}

/**
 * Calculates keywords score
 */
function calculateKeywordsScore(keywordData, scoringRules, explanations) {
  let score = 0;
  const maxScore = scoringRules.baseWeights.keywords;

  Object.entries(keywordData.globalMatches || {}).forEach(([groupName, groupData]) => {
    if (groupData.uniqueCount > 0) {
      const importance = groupData.importance || "medium";
      const weight = scoringRules.keywordWeights?.[importance] || 1;
      const groupScore = weight * groupData.uniqueCount;
      score += groupScore;
      explanations.push({
        category: "keyword",
        message: `Matched ${groupData.uniqueCount} unique keywords in '${groupName}' group`,
        impact: groupScore,
        severity: SEVERITY.POSITIVE,
      });
    }
  });

  return Math.min(maxScore, score); // Cap at max
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
 * Calculates experience quality
 */
function calculateExperienceQuality(keywordData, scoringRules, explanations) {
  let score = 0;
  const maxScore = scoringRules.baseWeights.experience_quality;

  const actionVerbCount = keywordData.actionVerbs?.count || 0;
  if (actionVerbCount >= 5) {
    score += 5;
    explanations.push({
      category: "experience",
      message: `Strong action verbs (${actionVerbCount} found)`,
      impact: 5,
      severity: SEVERITY.POSITIVE,
    });
  }

  const quantifiedAchievements = keywordData.quantifiedAchievements || [];
  if (quantifiedAchievements.length > 0) {
    score += 5;
    explanations.push({
      category: "experience",
      message: `Quantified achievements (${quantifiedAchievements.length} found)`,
      impact: 5,
      severity: SEVERITY.POSITIVE,
    });
  }

  return Math.min(maxScore, score);
}

/**
 * Calculates skills relevance
 */
function calculateSkillsRelevance(keywordsScore, scoringRules, explanations) {
  const maxKeywords = scoringRules.baseWeights.keywords;
  const maxSkills = scoringRules.baseWeights.skills_relevance;

  const ratio = keywordsScore / maxKeywords;
  const score = Math.round(ratio * maxSkills);

  explanations.push({
    category: "skills",
    message: `Skills relevance based on keyword matching`,
    impact: score,
    severity: SEVERITY.POSITIVE,
  });

  return Math.min(maxSkills, score);
}

/**
 * Determines verdict based on final score
 * @param {number} score - Final calculated score
 * @returns {string} Verdict (excellent, good, average, poor)
 */
function determineVerdict(score) {
  if (score >= VERDICT_THRESHOLDS.excellent) return "excellent";
  if (score >= VERDICT_THRESHOLDS.good) return "good";
  if (score >= VERDICT_THRESHOLDS.average) return "average";
  return "poor";
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

  let totalScore = 0;

  const explanations = [];

  // Add points for found sections
  sectionData.sections.forEach((section) => {
    if (section.found) {
      const weight = scoringRules.sectionWeights?.[section.key] || 0;
      totalScore += weight;
      explanations.push({
        category: "section",
        message: `Section found: ${section.displayName}`,
        impact: weight,
        severity: SEVERITY.POSITIVE,
      });
    } else if (section.required) {
      const penalty = scoringRules.missingSectionPenalty?.required || -5;
      totalScore += penalty;
      explanations.push({
        category: "section",
        message: `Missing required section: ${section.displayName}`,
        impact: penalty,
        severity: SEVERITY.NEGATIVE,
      });
    }
  });

  // Calculate sections score with cap
  const sectionsPoints = sectionData.sections
    .filter((s) => s.found)
    .reduce((sum, s) => sum + (scoringRules.sectionWeights?.[s.key] || 0), 0);
  const sectionsPenalty =
    (sectionData.missingRequiredSections || []).length *
    (scoringRules.missingSectionPenalty?.required || -5);
  const sectionsScore =
    Math.min(sectionsPoints, scoringRules.baseWeights.sections) + sectionsPenalty;

  // Add points for keywords
  const penaltyPerStuffing = (scoringRules.caps?.maxKeywordPenalty || -10) / 3;
  const stuffingSignals = keywordData.stuffingSignals || [];
  Object.entries(keywordData.globalMatches || {}).forEach(([groupName, groupData]) => {
    if (groupData.uniqueCount > 0) {
      const importance = groupData.importance || "medium";
      const weight = scoringRules.keywordWeights?.[importance] || 1;
      const points = weight * groupData.uniqueCount;
      explanations.push({
        category: "keyword",
        message: `Keywords in ${groupName}: ${groupData.uniqueCount} unique`,
        impact: points,
        severity: SEVERITY.POSITIVE,
      });
    }
  });

  // Calculate keywords score with cap
  const keywordsPoints = Object.values(keywordData.globalMatches || {}).reduce((sum, g) => {
    if (g.uniqueCount > 0) {
      const importance = g.importance || "medium";
      const weight = scoringRules.keywordWeights?.[importance] || 1;
      return sum + weight * g.uniqueCount;
    }
    return sum;
  }, 0);
  const penaltiesPoints = stuffingSignals.length * penaltyPerStuffing;
  const keywordsScore =
    Math.min(keywordsPoints, scoringRules.baseWeights.keywords) + penaltiesPoints;

  totalScore += sectionsScore + keywordsScore;

  // Add points for formatting (if clean)
  const formattingIssues = formattingData.ruleFindings || [];
  let formattingPoints;
  if (formattingIssues.length === 0) {
    formattingPoints = scoringRules.baseWeights.formatting;
    totalScore += formattingPoints;
    explanations.push({
      category: "formatting",
      message: "Clean formatting",
      impact: formattingPoints,
      severity: SEVERITY.POSITIVE,
    });
  } else {
    formattingPoints = formattingIssues.reduce(
      (sum, rule) => sum + (scoringRules.formattingPenaltyMap?.[rule] || 0),
      0,
    );
    totalScore += formattingPoints;
    formattingIssues.forEach((ruleKey) => {
      const penalty = scoringRules.formattingPenaltyMap?.[ruleKey] || 0;
      explanations.push({
        category: "formatting",
        message: `Formatting issue: ${ruleKey}`,
        impact: penalty,
        severity: SEVERITY.NEGATIVE,
      });
    });
  }

  // Add points for experience quality
  const actionVerbCount = keywordData.actionVerbs?.count || 0;
  let experiencePoints = 0;
  if (actionVerbCount >= 5) {
    experiencePoints += 4;
    explanations.push({
      category: "experience",
      message: `Action verbs: ${actionVerbCount}`,
      impact: 4,
      severity: SEVERITY.POSITIVE,
    });
  } else if (actionVerbCount >= 3) {
    experiencePoints += 2;
    explanations.push({
      category: "experience",
      message: `Action verbs: ${actionVerbCount}`,
      impact: 2,
      severity: SEVERITY.POSITIVE,
    });
  }
  const quantifiedAchievements = keywordData.quantifiedAchievements || [];
  if (quantifiedAchievements.length > 0) {
    experiencePoints += 4;
    explanations.push({
      category: "experience",
      message: `Quantified achievements: ${quantifiedAchievements.length}`,
      impact: 4,
      severity: SEVERITY.POSITIVE,
    });
  }
  totalScore += experiencePoints;

  // Add points for skills relevance (proportional to keywords)
  const skillsRatio = Math.min(keywordsPoints / 25, 1); // assume 25 is excellent
  const skillsPoints = Math.round(skillsRatio * scoringRules.baseWeights.skills_relevance);
  const cappedSkills = Math.min(skillsPoints, scoringRules.baseWeights.skills_relevance);
  totalScore += cappedSkills;
  explanations.push({
    category: "skills",
    message: "Skills relevance",
    impact: cappedSkills,
    severity: SEVERITY.POSITIVE,
  });

  // Final score
  const finalScore = totalScore;
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
    formatting: formattingPoints,
    experience_quality: experiencePoints,
    skills_relevance: cappedSkills,
    penalties: 0,
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
