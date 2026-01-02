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

/**
 * @typedef {Object} ParsedResume
 * @property {string} cleanText - The cleaned text content of the resume
 * @property {Array<{text: string}>|Array<string>} lines - Array of lines from the resume
 */

/**
 * @typedef {Object} LayoutSignals
 * @property {boolean} multiColumnSuspected - Whether multi-column layout is detected
 * @property {boolean} tablesSuspected - Whether tables are detected
 * @property {boolean} imagesOrIconsSuspected - Whether images or icons are detected
 */

/**
 * @typedef {Object} FontSignals
 * @property {boolean} excessiveAllCaps - Whether excessive all-caps text is detected
 * @property {boolean} excessiveWhitespace - Whether excessive whitespace is detected
 */

/**
 * @typedef {Object} StructureSignals
 * @property {boolean} bulletConsistency - Whether bullet points are consistent
 * @property {boolean} lineSpacingIssues - Whether line spacing issues exist
 * @property {number} pageLengthEstimate - Estimated number of pages
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {LayoutSignals} layoutSignals - Layout-related signals
 * @property {FontSignals} fontSignals - Font-related signals
 * @property {StructureSignals} structureSignals - Structure-related signals
 * @property {string[]} ruleFindings - List of formatting rule violations
 * @property {Object} meta - Metadata about the analysis
 * @property {string} meta.rulesVersion - Version of the formatting rules
 * @property {string} meta.analyzer - Name of the analyzer
 */

/**
 * Configuration for formatting detection thresholds
 */
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

/**
 * Loads and validates formatting rules from JSON file
 * @param {string} rulesPath - Path to the rules JSON file
 * @returns {Object} Formatting rules configuration
 * @throws {Error} If rules file cannot be loaded or is invalid
 */
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

/**
 * Validates the parsed resume input
 * @param {ParsedResume} parsedResume - The parsed resume object
 * @throws {Error} If validation fails
 */
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

/**
 * Normalizes line data to string format
 * @param {Array<{text: string}>|Array<string>} lines - Array of line objects or strings
 * @returns {string[]} Array of line strings
 */
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

/**
 * Detects multi-column layout in the resume
 * @param {string[]} lines - Array of text lines
 * @param {number} threshold - Minimum number of lines to confirm multi-column
 * @returns {boolean} True if multi-column layout is suspected
 */
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

/**
 * Detects table-like structures in the resume
 * @param {string[]} lines - Array of text lines
 * @param {number} threshold - Minimum number of table-like lines
 * @returns {boolean} True if tables are suspected
 */
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

/**
 * Detects icons or special characters in the text
 * @param {string} text - The full text content
 * @returns {boolean} True if icons are detected
 */
function detectIcons(text) {
  return PATTERNS.icons.test(text);
}

/**
 * Detects excessive use of all-caps text
 * @param {string[]} lines - Array of text lines
 * @param {Object} config - Configuration for all-caps detection
 * @returns {boolean} True if excessive all-caps detected
 */
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

/**
 * Detects excessive whitespace in the text
 * @param {string} text - The full text content
 * @returns {boolean} True if excessive whitespace detected
 */
function detectExcessiveWhitespace(text) {
  return PATTERNS.excessiveNewlines.test(text);
}

/**
 * Checks consistency of bullet point styles
 * @param {string[]} lines - Array of text lines
 * @returns {boolean} True if bullets are consistent
 */
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

/**
 * Detects line spacing issues
 * @param {string} text - The full text content
 * @returns {boolean} True if line spacing issues detected
 */
function detectLineSpacing(text) {
  const allLines = text.split("\n");
  const blankLines = allLines.filter((line) => line.trim() === "").length;
  const blankLineRatio = blankLines / allLines.length;

  return blankLineRatio > DETECTION_THRESHOLDS.whitespace.maxBlankLineRatio;
}

/**
 * Estimates the number of pages in the resume
 * @param {string[]} lines - Array of text lines
 * @param {number} linesPerPage - Average lines per page
 * @returns {number} Estimated page count
 */
function estimatePages(lines, linesPerPage = DETECTION_THRESHOLDS.pageEstimation.linesPerPage) {
  if (lines.length === 0) return 0;
  return Math.ceil(lines.length / linesPerPage);
}

/**
 * Evaluates formatting rules and identifies violations
 * @param {Object} rules - Formatting rules configuration
 * @param {LayoutSignals} layoutSignals - Detected layout signals
 * @param {StructureSignals} structureSignals - Detected structure signals
 * @returns {string[]} Array of rule violation identifiers
 */
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

/**
 * Main formatting analyzer function
 * Analyzes resume formatting and identifies ATS compatibility issues
 *
 * @param {Object} params - Analysis parameters
 * @param {ParsedResume} params.parsedResume - The parsed resume to analyze
 * @param {string} [params.rulesPath] - Optional custom path to rules file
 * @returns {AnalysisResult} Comprehensive formatting analysis results
 * @throws {Error} If input validation fails or rules cannot be loaded
 *
 * @example
 * const result = formattingAnalyzer({
 *   parsedResume: {
 *     cleanText: "Resume text...",
 *     lines: ["Line 1", "Line 2"]
 *   }
 * });
 */
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
