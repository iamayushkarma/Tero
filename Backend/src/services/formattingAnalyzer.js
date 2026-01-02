// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const formattingRules = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../rules/formatting.rules.json"), "utf-8"),
// );

// export const formattingAnalyzer = ({ parsedResume }) => {
//   if (!parsedResume?.cleanText || !Array.isArray(parsedResume.lines)) {
//     throw new Error("formattingAnalyzer: cleanText and lines are required");
//   }

//   const text = parsedResume.cleanText;
//   const lines = parsedResume.lines.map((l) => l.text || l);

//   const layoutSignals = {
//     multiColumnSuspected: detectMultiColumn(lines),
//     tablesSuspected: detectTables(lines),
//     imagesOrIconsSuspected: detectIcons(text),
//   };
//   const fontSignals = {
//     excessiveAllCaps: detectAllCaps(lines),
//     excessiveWhitespace: detectExcessiveWhitespace(text),
//   };
//   const structureSignals = {
//     bulletConsistency: detectBulletConsistency(lines),
//     lineSpacingIssues: detectLineSpacing(text),
//     pageLengthEstimate: estimatePages(lines),
//   };
//   const ruleFindings = [];

//   if (!formattingRules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
//     ruleFindings.push("multiColumnLayout");
//   }

//   if (!formattingRules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
//     ruleFindings.push("tablesUsed");
//   }

//   if (!formattingRules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
//     ruleFindings.push("imagesOrIconsUsed");
//   }

//   if (
//     formattingRules.structureRules.maxPages &&
//     structureSignals.pageLengthEstimate > formattingRules.structureRules.maxPages
//   ) {
//     ruleFindings.push("tooManyPages");
//   }
//   return {
//     layoutSignals,
//     fontSignals,
//     structureSignals,
//     ruleFindings,
//     meta: {
//       rulesVersion: formattingRules.meta?.version || "unknown",
//       analyzer: "formattingAnalyzer",
//     },
//   };
// };
// function detectMultiColumn(lines) {
//   let alignedSeparators = 0;

//   lines.forEach((line) => {
//     if (/\s{4,}\S+\s{4,}\S+/.test(line)) {
//       alignedSeparators++;
//     }
//   });

//   return alignedSeparators >= 3;
// }

// function detectTables(lines) {
//   let tableLikeLines = 0;

//   lines.forEach((line) => {
//     if (/\|.+\|/.test(line) || /\t{2,}/.test(line)) {
//       tableLikeLines++;
//     }
//   });

//   return tableLikeLines >= 2;
// }

// function detectIcons(text) {
//   return /[✓✔✕✖★☆→►▪●○◆]/.test(text);
// }

// function detectAllCaps(lines) {
//   const capsLines = lines.filter(
//     (line) => line.length > 10 && line === line.toUpperCase() && /[A-Z]/.test(line),
//   );

//   return capsLines.length >= 3;
// }

// function detectExcessiveWhitespace(text) {
//   return /\n{3,}/.test(text);
// }

// function detectBulletConsistency(lines) {
//   const bulletTypes = new Set();

//   lines.forEach((line) => {
//     const match = line.match(/^[\s]*([•\-*▪►])\s+/);
//     if (match) bulletTypes.add(match[1]);
//   });

//   return bulletTypes.size <= 1;
// }

// function detectLineSpacing(text) {
//   const blankLines = text.split("\n").filter((l) => l.trim() === "").length;
//   return blankLines > text.split("\n").length * 0.3;
// }

// function estimatePages(lines) {
//   // Rough ATS-safe estimate: 45–50 lines per page
//   return Math.ceil(lines.length / 48);
// }

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for formatting detection thresholds

const DETECTION_THRESHOLDS = {
  multiColumn: {
    minAlignedSeparators: 3,
    minSpacingGap: 4,
  },
  tables: {
    minTableLikeLines: 2,
    minConsecutiveTabs: 2,
  },
  allCaps: {
    minLineLength: 10,
    minOccurrences: 3,
  },
  whitespace: {
    maxConsecutiveNewlines: 3,
    maxBlankLineRatio: 0.3,
  },
  pageEstimation: {
    linesPerPage: 48,
  },
};

/**
 * Regular expressions for pattern detection
 */
const PATTERNS = {
  multiColumnSpacing: /\s{4,}\S+\s{4,}\S+/,
  tablePipes: /\|.+\|/,
  consecutiveTabs: /\t{2,}/,
  icons: /[✓✔✕✖★☆→►▪●○◆]/,
  bulletPoints: /^[\s]*([•\-*▪►])\s+/,
  excessiveNewlines: /\n{3,}/,
};

function loadFormattingRules(rulesPath) {
  try {
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");
    const rules = JSON.parse(rulesContent);

    // Validate required structure
    if (!rules.atsCompatibility || !rules.structureRules) {
      throw new Error("Invalid rules structure: missing required sections");
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
  if (!parsedResume) {
    throw new Error("formattingAnalyzer: parsedResume is required");
  }

  if (!parsedResume.cleanText || typeof parsedResume.cleanText !== "string") {
    throw new Error("formattingAnalyzer: cleanText must be a non-empty string");
  }

  if (!Array.isArray(parsedResume.lines)) {
    throw new Error("formattingAnalyzer: lines must be an array");
  }

  if (parsedResume.lines.length === 0) {
    throw new Error("formattingAnalyzer: lines array cannot be empty");
  }
}

function normalizeLines(lines) {
  return lines.map((line) => {
    if (typeof line === "string") {
      return line;
    }
    if (line && typeof line.text === "string") {
      return line.text;
    }
    return "";
  });
}

function detectMultiColumn(
  lines,
  threshold = DETECTION_THRESHOLDS.multiColumn.minAlignedSeparators,
) {
  let alignedSeparators = 0;

  for (const line of lines) {
    if (PATTERNS.multiColumnSpacing.test(line)) {
      alignedSeparators++;
      if (alignedSeparators >= threshold) {
        return true;
      }
    }
  }

  return false;
}

function detectTables(lines, threshold = DETECTION_THRESHOLDS.tables.minTableLikeLines) {
  let tableLikeLines = 0;

  for (const line of lines) {
    const hasPipes = PATTERNS.tablePipes.test(line);
    const hasMultipleTabs = PATTERNS.consecutiveTabs.test(line);

    if (hasPipes || hasMultipleTabs) {
      tableLikeLines++;
      if (tableLikeLines >= threshold) {
        return true;
      }
    }
  }

  return false;
}

function detectIcons(text) {
  return PATTERNS.icons.test(text);
}

function detectAllCaps(
  lines,
  config = {
    minLength: DETECTION_THRESHOLDS.allCaps.minLineLength,
    minOccurrences: DETECTION_THRESHOLDS.allCaps.minOccurrences,
  },
) {
  const capsLines = lines.filter((line) => {
    const trimmedLine = line.trim();
    return (
      trimmedLine.length > config.minLength &&
      trimmedLine === trimmedLine.toUpperCase() &&
      /[A-Z]/.test(trimmedLine)
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
    if (match) {
      bulletTypes.add(match[1]);
    }
  }

  // Consistent if 0 bullets (no bullets used) or only 1 type of bullet
  return bulletTypes.size <= 1;
}

function detectLineSpacing(text) {
  const allLines = text.split("\n");
  const blankLines = allLines.filter((line) => line.trim() === "").length;
  const blankLineRatio = blankLines / allLines.length;

  return blankLineRatio > DETECTION_THRESHOLDS.whitespace.maxBlankLineRatio;
}

function estimatePages(lines, linesPerPage = DETECTION_THRESHOLDS.pageEstimation.linesPerPage) {
  if (lines.length === 0) return 0;
  return Math.ceil(lines.length / linesPerPage);
}

function evaluateRules(rules, layoutSignals, structureSignals) {
  const findings = [];

  // Check multi-column layout
  if (!rules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
    findings.push("multiColumnLayout");
  }

  // Check tables usage
  if (!rules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
    findings.push("tablesUsed");
  }

  // Check images/icons
  if (!rules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
    findings.push("imagesOrIconsUsed");
  }

  // Check page length
  if (
    rules.structureRules.maxPages &&
    structureSignals.pageLengthEstimate > rules.structureRules.maxPages
  ) {
    findings.push("tooManyPages");
  }

  return findings;
}

export const formattingAnalyzer = ({ parsedResume, rulesPath }) => {
  // Validate input
  validateInput(parsedResume);

  // Load formatting rules
  const defaultRulesPath = path.join(__dirname, "../rules/formatting.rules.json");
  const effectiveRulesPath = rulesPath || defaultRulesPath;
  const formattingRules = loadFormattingRules(effectiveRulesPath);

  // Normalize data
  const text = parsedResume.cleanText;
  const lines = normalizeLines(parsedResume.lines);

  // Analyze layout signals
  const layoutSignals = {
    multiColumnSuspected: detectMultiColumn(lines),
    tablesSuspected: detectTables(lines),
    imagesOrIconsSuspected: detectIcons(text),
  };

  // Analyze font signals
  const fontSignals = {
    excessiveAllCaps: detectAllCaps(lines),
    excessiveWhitespace: detectExcessiveWhitespace(text),
  };

  // Analyze structure signals
  const structureSignals = {
    bulletConsistency: detectBulletConsistency(lines),
    lineSpacingIssues: detectLineSpacing(text),
    pageLengthEstimate: estimatePages(lines),
  };

  // Evaluate rules and identify violations
  const ruleFindings = evaluateRules(formattingRules, layoutSignals, structureSignals);

  return {
    layoutSignals,
    fontSignals,
    structureSignals,
    ruleFindings,
    meta: {
      rulesVersion: formattingRules.meta?.version || "unknown",
      analyzer: "formattingAnalyzer",
      timestamp: new Date().toISOString(),
      totalLines: lines.length,
    },
  };
};

/**
 * Export detection functions for testing purposes
 */
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
  DETECTION_THRESHOLDS,
  PATTERNS,
};
