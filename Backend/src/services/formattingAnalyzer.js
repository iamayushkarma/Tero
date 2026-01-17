import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DETECTION_THRESHOLDS = {
  multiColumn: {
    minAlignedSeparators: 4, // Balanced
    minSpacingGap: 5,
  },
  tables: {
    minTableLikeLines: 3,
    minConsecutiveTabs: 2,
  },
  allCaps: {
    minLineLength: 12,
    minOccurrences: 3, // 3+ all-caps lines is unprofessional
  },
  whitespace: {
    maxConsecutiveNewlines: 3,
    maxBlankLineRatio: 0.35,
  },
  pageEstimation: {
    linesPerPage: 48,
  },
  emojis: {
    maxAllowed: 3, // Max 3 emojis is reasonable
  },
  minContent: {
    minLines: 18, // At least 18 lines for a resume
    minWords: 120, // At least 120 words
    minCharsPerLine: 28,
  },
  professionalContent: {
    minActionVerbs: 3, // Should have at least 3 action verbs
    minBulletPoints: 2, // Should have at least 2 bullet points
  },
};

const PATTERNS = {
  multiColumnSpacing: /\s{5,}\S+\s{5,}\S+/,
  tablePipes: /\|.+\|.+\|/,
  consecutiveTabs: /\t{2,}/,
  // Only real decorative emojis, NOT professional bullets
  icons: /[🚀👾🔧📱🔗💻⭐🎯✨🔥💡📊📈🎓😀😃😄😁😎🤔👍❤️]/,
  bulletPoints: /^[\s]*(•|\-|\*|▪|►|→|✓)\s+/,
  excessiveNewlines: /\n{4,}/,
  decorativeChars: /[🚀👾🔧📱🔗💻🎯✨🔥💡📊📈😀😃😄😁😎🤔👍❤️]/g,
  arrowSymbols: /[➔➜➡️⬆️⬇️⬅️]/g,
  // Professional action verbs
  actionVerbs:
    /\b(achieved|designed|developed|implemented|managed|led|improved|optimized|analyzed|created|established|executed|launched|initiated|streamlined|coordinated|facilitated|delivered|automated|increased|reduced|enhanced|built|architected|maintained|collaborated|spearheaded|transformed|resolved|mentored)\b/gi,
};

function loadFormattingRules(rulesPath) {
  try {
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");
    const rules = JSON.parse(rulesContent);
    if (!rules.atsCompatibility || !rules.structureRules) {
      throw new Error("Invalid rules structure");
    }
    return rules;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Formatting rules file not found: ${rulesPath}`);
    }
    throw new Error(`Failed to load formatting rules: ${error.message}`);
  }
}

function validateInput(parsedResume) {
  if (!parsedResume?.cleanText || !Array.isArray(parsedResume.lines)) {
    throw new Error("formattingAnalyzer: cleanText and lines are required");
  }
  if (parsedResume.lines.length === 0) {
    throw new Error("formattingAnalyzer: lines array cannot be empty");
  }
}

function normalizeLines(lines) {
  return lines.map((l) => (typeof l === "string" ? l : l?.text || ""));
}

function detectMultiColumn(
  lines,
  threshold = DETECTION_THRESHOLDS.multiColumn.minAlignedSeparators,
) {
  let alignedSeparators = 0;
  for (const line of lines) {
    if (PATTERNS.multiColumnSpacing.test(line)) {
      alignedSeparators++;
      if (alignedSeparators >= threshold) return true;
    }
  }
  return false;
}

function detectTables(lines, threshold = DETECTION_THRESHOLDS.tables.minTableLikeLines) {
  let tableLikeLines = 0;
  for (const line of lines) {
    if (PATTERNS.tablePipes.test(line) || PATTERNS.consecutiveTabs.test(line)) {
      tableLikeLines++;
      if (tableLikeLines >= threshold) return true;
    }
  }
  return false;
}

function detectIcons(text) {
  return PATTERNS.icons.test(text);
}

function countEmojisAndDecorations(text) {
  const decorativeMatches = text.match(PATTERNS.decorativeChars) || [];
  const arrowMatches = text.match(PATTERNS.arrowSymbols) || [];

  return {
    decorativeCount: decorativeMatches.length,
    arrowCount: arrowMatches.length,
    totalCount: decorativeMatches.length + arrowMatches.length,
    hasExcessiveDecorations: decorativeMatches.length > DETECTION_THRESHOLDS.emojis.maxAllowed,
  };
}

function detectAllCaps(
  lines,
  config = {
    minLength: DETECTION_THRESHOLDS.allCaps.minLineLength,
    minOccurrences: DETECTION_THRESHOLDS.allCaps.minOccurrences,
  },
) {
  const capsLines = lines.filter((line) => {
    const trimmed = line.trim();
    // Exclude common section headers that are legitimately all caps
    const isLikelyHeader =
      /^(SUMMARY|SKILLS|EDUCATION|EXPERIENCE|PROJECTS|CONTACT|CERTIFICATIONS|LANGUAGES)$/i.test(
        trimmed,
      );
    return (
      !isLikelyHeader &&
      trimmed.length > config.minLength &&
      trimmed === trimmed.toUpperCase() &&
      /[A-Z]/.test(trimmed)
    );
  });
  return capsLines.length >= config.minOccurrences;
}

function detectExcessiveWhitespace(text) {
  return PATTERNS.excessiveNewlines.test(text);
}

function detectBulletConsistency(lines) {
  const bulletTypes = new Set();
  for (const line of lines) {
    const match = line.match(PATTERNS.bulletPoints);
    if (match) bulletTypes.add(match[1]);
  }
  // Inconsistent if more than 2 different bullet types
  return bulletTypes.size <= 2;
}

function detectLineSpacing(text) {
  const allLines = text.split("\n");
  const blankLines = allLines.filter((l) => l.trim() === "").length;
  return blankLines / allLines.length > DETECTION_THRESHOLDS.whitespace.maxBlankLineRatio;
}

function estimatePages(lines, linesPerPage = DETECTION_THRESHOLDS.pageEstimation.linesPerPage) {
  return lines.length === 0 ? 0 : Math.ceil(lines.length / linesPerPage);
}

function evaluateRules(rules, layoutSignals, structureSignals) {
  const findings = [];

  if (!rules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
    findings.push("multiColumnLayout");
  }
  if (!rules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
    findings.push("tablesUsed");
  }
  if (!rules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
    findings.push("imagesOrIconsUsed");
  }
  if (
    rules.structureRules.maxPages &&
    structureSignals.pageLengthEstimate > rules.structureRules.maxPages
  ) {
    findings.push("tooManyPages");
  }

  return findings;
}

function analyzeProfessionalContent(text, lines) {
  // Count action verbs
  const actionVerbMatches = text.match(PATTERNS.actionVerbs) || [];
  const uniqueActionVerbs = new Set(actionVerbMatches.map((v) => v.toLowerCase()));

  // Count bullet points
  const bulletLines = lines.filter((l) => PATTERNS.bulletPoints.test(l));

  // Count quantified achievements (numbers, percentages, metrics)
  const quantifiedMatches =
    text.match(/\d+%|\$\d+|\d+\+|increased by \d+|reduced by \d+|improved \d+/gi) || [];

  return {
    actionVerbCount: uniqueActionVerbs.size,
    bulletPointCount: bulletLines.length,
    quantifiedCount: quantifiedMatches.length,
    hasProfessionalStructure:
      uniqueActionVerbs.size >= DETECTION_THRESHOLDS.professionalContent.minActionVerbs &&
      bulletLines.length >= DETECTION_THRESHOLDS.professionalContent.minBulletPoints,
  };
}

function detectQualityIssues(layoutSignals, fontSignals, structureSignals, lines, text) {
  const qualityIssues = [];
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const avgLineLength = lines.length > 0 ? text.length / lines.length : 0;

  // Get professional content analysis
  const professionalContent = analyzeProfessionalContent(text, lines);

  // Check 1: Minimum content length
  if (lines.length < DETECTION_THRESHOLDS.minContent.minLines) {
    qualityIssues.push("tooShort");
  }

  // Check 2: Minimum word count
  if (wordCount < DETECTION_THRESHOLDS.minContent.minWords) {
    qualityIssues.push("minimalContent");
  }

  // Check 3: Excessive emojis
  const emojiData = countEmojisAndDecorations(text);
  if (emojiData.hasExcessiveDecorations) {
    qualityIssues.push("excessiveEmojis");
  }

  // Check 4: Too many arrows
  if (emojiData.arrowCount > 8) {
    qualityIssues.push("excessiveArrows");
  }

  // Check 5: All caps text
  if (fontSignals.excessiveAllCaps) {
    qualityIssues.push("excessiveAllCaps");
  }

  // Check 6: Poor line spacing
  if (structureSignals.lineSpacingIssues) {
    qualityIssues.push("poorLineSpacing");
  }

  // Check 7: No bullet points at all (unprofessional)
  if (professionalContent.bulletPointCount === 0 && lines.length > 15) {
    qualityIssues.push("noBulletPoints");
  }

  // Check 8: Excessively long lines (>60% of lines are too long)
  const longLines = lines.filter((l) => l.length > 150).length;
  if (longLines > lines.length * 0.6) {
    qualityIssues.push("excessivelyLongLines");
  }

  // Check 9: Too many very short lines (>50% are too short)
  const shortLines = lines.filter((l) => {
    const trimmed = l.trim();
    return trimmed.length > 0 && trimmed.length < DETECTION_THRESHOLDS.minContent.minCharsPerLine;
  }).length;

  if (shortLines > lines.length * 0.5) {
    qualityIssues.push("tooManyShortLines");
  }

  // Check 10: Poor content density (average line is very short)
  if (avgLineLength < 35 && lines.length > 10) {
    qualityIssues.push("poorContentDensity");
  }

  // Check 11: Lacks professional structure
  if (!professionalContent.hasProfessionalStructure) {
    qualityIssues.push("lacksProfessionalStructure");
  }

  // Check 12: No quantified achievements
  if (professionalContent.quantifiedCount === 0 && wordCount > 150) {
    qualityIssues.push("noQuantifiedAchievements");
  }

  return qualityIssues;
}

// BALANCED: Penalty system with clear severity levels
function calculateQualityScore(lines, text, findings) {
  let score = 10;

  const severityMap = {
    // Critical issues (-3 to -4 points)
    multiColumnLayout: -3,
    tablesUsed: -3,
    tooShort: -4,
    minimalContent: -4,

    // High severity (-2 to -2.5 points)
    tooManyPages: -2,
    excessiveAllCaps: -2.5,
    lacksProfessionalStructure: -2.5,
    noBulletPoints: -2,

    // Medium severity (-1 to -1.5 points)
    imagesOrIconsUsed: -1.5,
    excessiveEmojis: -2,
    poorLineSpacing: -1,
    excessivelyLongLines: -1.5,
    poorContentDensity: -1.5,

    // Low severity (-0.5 to -1 points)
    excessiveArrows: -1,
    tooManyShortLines: -1,
    noQuantifiedAchievements: -0.5,
  };

  findings.forEach((finding) => {
    score += severityMap[finding] || -1;
  });

  return Math.max(0, Math.min(10, score));
}

export const formattingAnalyzer = ({ parsedResume, rulesPath }) => {
  validateInput(parsedResume);

  const defaultRulesPath = path.join(__dirname, "../rules/formatting.rules.json");
  const effectiveRulesPath = rulesPath || defaultRulesPath;
  const formattingRules = loadFormattingRules(effectiveRulesPath);

  const text = parsedResume.cleanText;
  const lines = normalizeLines(parsedResume.lines);

  const emojiData = countEmojisAndDecorations(text);
  const professionalContent = analyzeProfessionalContent(text, lines);

  const layoutSignals = {
    multiColumnSuspected: detectMultiColumn(lines),
    tablesSuspected: detectTables(lines),
    imagesOrIconsSuspected: detectIcons(text),
    emojiCount: emojiData.totalCount,
    hasExcessiveEmojis: emojiData.hasExcessiveDecorations,
  };

  const fontSignals = {
    excessiveAllCaps: detectAllCaps(lines),
    excessiveWhitespace: detectExcessiveWhitespace(text),
  };

  const structureSignals = {
    bulletConsistency: detectBulletConsistency(lines),
    lineSpacingIssues: detectLineSpacing(text),
    pageLengthEstimate: estimatePages(lines),
  };

  const ruleFindings = evaluateRules(formattingRules, layoutSignals, structureSignals);
  const qualityIssues = detectQualityIssues(
    layoutSignals,
    fontSignals,
    structureSignals,
    lines,
    text,
  );

  const allFindings = [...ruleFindings, ...qualityIssues];

  return {
    layoutSignals,
    fontSignals,
    structureSignals,
    professionalContent,
    ruleFindings: allFindings,
    qualityScore: calculateQualityScore(lines, text, allFindings),
    emojiData,
    meta: {
      rulesVersion: formattingRules.meta?.version || "unknown",
      analyzer: "formattingAnalyzer",
      timestamp: new Date().toISOString(),
      totalLines: lines.length,
      totalWords: text.split(/\s+/).filter((w) => w.length > 0).length,
      totalIssues: allFindings.length,
    },
  };
};

export const testHelpers = {
  detectMultiColumn,
  detectTables,
  detectIcons,
  detectAllCaps,
  detectExcessiveWhitespace,
  detectBulletConsistency,
  detectLineSpacing,
  estimatePages,
  validateInput,
  normalizeLines,
  detectQualityIssues,
  calculateQualityScore,
  countEmojisAndDecorations,
  analyzeProfessionalContent,
  DETECTION_THRESHOLDS,
  PATTERNS,
};
