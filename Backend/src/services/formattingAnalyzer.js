// // // import fs from "fs";
// // // import path from "path";
// // // import { fileURLToPath } from "url";

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);

// // // const formattingRules = JSON.parse(
// // //   fs.readFileSync(path.join(__dirname, "../rules/formatting.rules.json"), "utf-8"),
// // // );

// // // export const formattingAnalyzer = ({ parsedResume }) => {
// // //   if (!parsedResume?.cleanText || !Array.isArray(parsedResume.lines)) {
// // //     throw new Error("formattingAnalyzer: cleanText and lines are required");
// // //   }

// // //   const text = parsedResume.cleanText;
// // //   const lines = parsedResume.lines.map((l) => l.text || l);

// // //   const layoutSignals = {
// // //     multiColumnSuspected: detectMultiColumn(lines),
// // //     tablesSuspected: detectTables(lines),
// // //     imagesOrIconsSuspected: detectIcons(text),
// // //   };
// // //   const fontSignals = {
// // //     excessiveAllCaps: detectAllCaps(lines),
// // //     excessiveWhitespace: detectExcessiveWhitespace(text),
// // //   };
// // //   const structureSignals = {
// // //     bulletConsistency: detectBulletConsistency(lines),
// // //     lineSpacingIssues: detectLineSpacing(text),
// // //     pageLengthEstimate: estimatePages(lines),
// // //   };
// // //   const ruleFindings = [];

// // //   if (!formattingRules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
// // //     ruleFindings.push("multiColumnLayout");
// // //   }

// // //   if (!formattingRules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
// // //     ruleFindings.push("tablesUsed");
// // //   }

// // //   if (!formattingRules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
// // //     ruleFindings.push("imagesOrIconsUsed");
// // //   }

// // //   if (
// // //     formattingRules.structureRules.maxPages &&
// // //     structureSignals.pageLengthEstimate > formattingRules.structureRules.maxPages
// // //   ) {
// // //     ruleFindings.push("tooManyPages");
// // //   }
// // //   return {
// // //     layoutSignals,
// // //     fontSignals,
// // //     structureSignals,
// // //     ruleFindings,
// // //     meta: {
// // //       rulesVersion: formattingRules.meta?.version || "unknown",
// // //       analyzer: "formattingAnalyzer",
// // //     },
// // //   };
// // // };
// // // function detectMultiColumn(lines) {
// // //   let alignedSeparators = 0;

// // //   lines.forEach((line) => {
// // //     if (/\s{4,}\S+\s{4,}\S+/.test(line)) {
// // //       alignedSeparators++;
// // //     }
// // //   });

// // //   return alignedSeparators >= 3;
// // // }

// // // function detectTables(lines) {
// // //   let tableLikeLines = 0;

// // //   lines.forEach((line) => {
// // //     if (/\|.+\|/.test(line) || /\t{2,}/.test(line)) {
// // //       tableLikeLines++;
// // //     }
// // //   });

// // //   return tableLikeLines >= 2;
// // // }

// // // function detectIcons(text) {
// // //   return /[✓✔✕✖★☆→►▪●○◆]/.test(text);
// // // }

// // // function detectAllCaps(lines) {
// // //   const capsLines = lines.filter(
// // //     (line) => line.length > 10 && line === line.toUpperCase() && /[A-Z]/.test(line),
// // //   );

// // //   return capsLines.length >= 3;
// // // }

// // // function detectExcessiveWhitespace(text) {
// // //   return /\n{3,}/.test(text);
// // // }

// // // function detectBulletConsistency(lines) {
// // //   const bulletTypes = new Set();

// // //   lines.forEach((line) => {
// // //     const match = line.match(/^[\s]*([•\-*▪►])\s+/);
// // //     if (match) bulletTypes.add(match[1]);
// // //   });

// // //   return bulletTypes.size <= 1;
// // // }

// // // function detectLineSpacing(text) {
// // //   const blankLines = text.split("\n").filter((l) => l.trim() === "").length;
// // //   return blankLines > text.split("\n").length * 0.3;
// // // }

// // // function estimatePages(lines) {
// // //   // Rough ATS-safe estimate: 45–50 lines per page
// // //   return Math.ceil(lines.length / 48);
// // // }

// // import fs from "fs";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // // ES Module __dirname equivalent
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // Configuration for formatting detection thresholds

// // const DETECTION_THRESHOLDS = {
// //   multiColumn: {
// //     minAlignedSeparators: 3,
// //     minSpacingGap: 4,
// //   },
// //   tables: {
// //     minTableLikeLines: 2,
// //     minConsecutiveTabs: 2,
// //   },
// //   allCaps: {
// //     minLineLength: 10,
// //     minOccurrences: 3,
// //   },
// //   whitespace: {
// //     maxConsecutiveNewlines: 3,
// //     maxBlankLineRatio: 0.3,
// //   },
// //   pageEstimation: {
// //     linesPerPage: 48,
// //   },
// // };

// // /**
// //  * Regular expressions for pattern detection
// //  */
// // const PATTERNS = {
// //   multiColumnSpacing: /\s{4,}\S+\s{4,}\S+/,
// //   tablePipes: /\|.+\|/,
// //   consecutiveTabs: /\t{2,}/,
// //   icons: /[✓✔✕✖★☆→►▪●○◆]/,
// //   bulletPoints: /^[\s]*([•\-*▪►])\s+/,
// //   excessiveNewlines: /\n{3,}/,
// // };

// // function loadFormattingRules(rulesPath) {
// //   try {
// //     const rulesContent = fs.readFileSync(rulesPath, "utf-8");
// //     const rules = JSON.parse(rulesContent);

// //     // Validate required structure
// //     if (!rules.atsCompatibility || !rules.structureRules) {
// //       throw new Error("Invalid rules structure: missing required sections");
// //     }

// //     return rules;
// //   } catch (error) {
// //     if (error.code === "ENOENT") {
// //       throw new Error(`Formatting rules file not found: ${rulesPath}`);
// //     }
// //     throw new Error(`Failed to load formatting rules: ${error.message}`);
// //   }
// // }

// // function validateInput(parsedResume) {
// //   if (!parsedResume) {
// //     throw new Error("formattingAnalyzer: parsedResume is required");
// //   }

// //   if (!parsedResume.cleanText || typeof parsedResume.cleanText !== "string") {
// //     throw new Error("formattingAnalyzer: cleanText must be a non-empty string");
// //   }

// //   if (!Array.isArray(parsedResume.lines)) {
// //     throw new Error("formattingAnalyzer: lines must be an array");
// //   }

// //   if (parsedResume.lines.length === 0) {
// //     throw new Error("formattingAnalyzer: lines array cannot be empty");
// //   }
// // }

// // function normalizeLines(lines) {
// //   return lines.map((line) => {
// //     if (typeof line === "string") {
// //       return line;
// //     }
// //     if (line && typeof line.text === "string") {
// //       return line.text;
// //     }
// //     return "";
// //   });
// // }

// // function detectMultiColumn(
// //   lines,
// //   threshold = DETECTION_THRESHOLDS.multiColumn.minAlignedSeparators,
// // ) {
// //   let alignedSeparators = 0;

// //   for (const line of lines) {
// //     if (PATTERNS.multiColumnSpacing.test(line)) {
// //       alignedSeparators++;
// //       if (alignedSeparators >= threshold) {
// //         return true;
// //       }
// //     }
// //   }

// //   return false;
// // }

// // function detectTables(lines, threshold = DETECTION_THRESHOLDS.tables.minTableLikeLines) {
// //   let tableLikeLines = 0;

// //   for (const line of lines) {
// //     const hasPipes = PATTERNS.tablePipes.test(line);
// //     const hasMultipleTabs = PATTERNS.consecutiveTabs.test(line);

// //     if (hasPipes || hasMultipleTabs) {
// //       tableLikeLines++;
// //       if (tableLikeLines >= threshold) {
// //         return true;
// //       }
// //     }
// //   }

// //   return false;
// // }

// // function detectIcons(text) {
// //   return PATTERNS.icons.test(text);
// // }

// // function detectAllCaps(
// //   lines,
// //   config = {
// //     minLength: DETECTION_THRESHOLDS.allCaps.minLineLength,
// //     minOccurrences: DETECTION_THRESHOLDS.allCaps.minOccurrences,
// //   },
// // ) {
// //   const capsLines = lines.filter((line) => {
// //     const trimmedLine = line.trim();
// //     return (
// //       trimmedLine.length > config.minLength &&
// //       trimmedLine === trimmedLine.toUpperCase() &&
// //       /[A-Z]/.test(trimmedLine)
// //     );
// //   });

// //   return capsLines.length >= config.minOccurrences;
// // }

// // function detectExcessiveWhitespace(text) {
// //   return PATTERNS.excessiveNewlines.test(text);
// // }

// // function detectBulletConsistency(lines) {
// //   const bulletTypes = new Set();

// //   for (const line of lines) {
// //     const match = line.match(PATTERNS.bulletPoints);
// //     if (match) {
// //       bulletTypes.add(match[1]);
// //     }
// //   }

// //   // Consistent if 0 bullets (no bullets used) or only 1 type of bullet
// //   return bulletTypes.size <= 1;
// // }

// // function detectLineSpacing(text) {
// //   const allLines = text.split("\n");
// //   const blankLines = allLines.filter((line) => line.trim() === "").length;
// //   const blankLineRatio = blankLines / allLines.length;

// //   return blankLineRatio > DETECTION_THRESHOLDS.whitespace.maxBlankLineRatio;
// // }

// // function estimatePages(lines, linesPerPage = DETECTION_THRESHOLDS.pageEstimation.linesPerPage) {
// //   if (lines.length === 0) return 0;
// //   return Math.ceil(lines.length / linesPerPage);
// // }

// // function evaluateRules(rules, layoutSignals, structureSignals) {
// //   const findings = [];

// //   // Check multi-column layout
// //   if (!rules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
// //     findings.push("multiColumnLayout");
// //   }

// //   // Check tables usage
// //   if (!rules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
// //     findings.push("tablesUsed");
// //   }

// //   // Check images/icons
// //   if (!rules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
// //     findings.push("imagesOrIconsUsed");
// //   }

// //   // Check page length
// //   if (
// //     rules.structureRules.maxPages &&
// //     structureSignals.pageLengthEstimate > rules.structureRules.maxPages
// //   ) {
// //     findings.push("tooManyPages");
// //   }

// //   return findings;
// // }

// // export const formattingAnalyzer = ({ parsedResume, rulesPath }) => {
// //   // Validate input
// //   validateInput(parsedResume);

// //   // Load formatting rules
// //   const defaultRulesPath = path.join(__dirname, "../rules/formatting.rules.json");
// //   const effectiveRulesPath = rulesPath || defaultRulesPath;
// //   const formattingRules = loadFormattingRules(effectiveRulesPath);

// //   // Normalize data
// //   const text = parsedResume.cleanText;
// //   const lines = normalizeLines(parsedResume.lines);

// //   // Analyze layout signals
// //   const layoutSignals = {
// //     multiColumnSuspected: detectMultiColumn(lines),
// //     tablesSuspected: detectTables(lines),
// //     imagesOrIconsSuspected: detectIcons(text),
// //   };

// //   // Analyze font signals
// //   const fontSignals = {
// //     excessiveAllCaps: detectAllCaps(lines),
// //     excessiveWhitespace: detectExcessiveWhitespace(text),
// //   };

// //   // Analyze structure signals
// //   const structureSignals = {
// //     bulletConsistency: detectBulletConsistency(lines),
// //     lineSpacingIssues: detectLineSpacing(text),
// //     pageLengthEstimate: estimatePages(lines),
// //   };

// //   // Evaluate rules and identify violations
// //   const ruleFindings = evaluateRules(formattingRules, layoutSignals, structureSignals);

// //   return {
// //     layoutSignals,
// //     fontSignals,
// //     structureSignals,
// //     ruleFindings,
// //     meta: {
// //       rulesVersion: formattingRules.meta?.version || "unknown",
// //       analyzer: "formattingAnalyzer",
// //       timestamp: new Date().toISOString(),
// //       totalLines: lines.length,
// //     },
// //   };
// // };

// // /**
// //  * Export detection functions for testing purposes
// //  */
// // export const testHelpers = {
// //   detectMultiColumn,
// //   detectTables,
// //   detectIcons,
// //   detectAllCaps,
// //   detectExcessiveWhitespace,
// //   detectBulletConsistency,
// //   detectLineSpacing,
// //   estimatePages,
// //   validateInput,
// //   normalizeLines,
// //   DETECTION_THRESHOLDS,
// //   PATTERNS,
// // };

// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ STRICTER thresholds
// const DETECTION_THRESHOLDS = {
//   multiColumn: {
//     minAlignedSeparators: 3,
//     minSpacingGap: 4,
//   },
//   tables: {
//     minTableLikeLines: 2,
//     minConsecutiveTabs: 2,
//   },
//   allCaps: {
//     minLineLength: 10,
//     minOccurrences: 2, // ✅ Lowered from 3
//   },
//   whitespace: {
//     maxConsecutiveNewlines: 3,
//     maxBlankLineRatio: 0.3,
//   },
//   pageEstimation: {
//     linesPerPage: 48,
//   },
//   // ✅ NEW: Emoji/icon detection thresholds
//   emojis: {
//     maxAllowed: 2, // More than 2 emojis is unprofessional
//   },
//   // ✅ NEW: Minimum content requirements
//   minContent: {
//     minLines: 20,
//     minWords: 150,
//     minCharsPerLine: 30,
//   },
// };

// const PATTERNS = {
//   multiColumnSpacing: /\s{4,}\S+\s{4,}\S+/,
//   tablePipes: /\|.+\|/,
//   consecutiveTabs: /\t{2,}/,
//   // ✅ EXPANDED: More comprehensive emoji/icon detection
//   icons: /[✓✔✕✖★☆→►▪●◦◆🚀💾📧📱🔗💻⭐🎯✨🔥💡📊📈🎓]/,
//   bulletPoints: /^[\s]*([•\-*▪►])\s+/,
//   excessiveNewlines: /\n{3,}/,
//   // ✅ NEW: Detect decorative characters
//   decorativeChars: /[⭐🚀💾📧📱🔗💻🎯✨🔥💡📊📈🎓]/g,
//   // ✅ NEW: Detect arrow symbols
//   arrowSymbols: /[→➔➜➡️]/g,
// };

// function loadFormattingRules(rulesPath) {
//   try {
//     const rulesContent = fs.readFileSync(rulesPath, "utf-8");
//     const rules = JSON.parse(rulesContent);

//     if (!rules.atsCompatibility || !rules.structureRules) {
//       throw new Error("Invalid rules structure: missing required sections");
//     }

//     return rules;
//   } catch (error) {
//     if (error.code === "ENOENT") {
//       throw new Error(`Formatting rules file not found: ${rulesPath}`);
//     }
//     throw new Error(`Failed to load formatting rules: ${error.message}`);
//   }
// }

// function validateInput(parsedResume) {
//   if (!parsedResume) {
//     throw new Error("formattingAnalyzer: parsedResume is required");
//   }

//   if (!parsedResume.cleanText || typeof parsedResume.cleanText !== "string") {
//     throw new Error("formattingAnalyzer: cleanText must be a non-empty string");
//   }

//   if (!Array.isArray(parsedResume.lines)) {
//     throw new Error("formattingAnalyzer: lines must be an array");
//   }

//   if (parsedResume.lines.length === 0) {
//     throw new Error("formattingAnalyzer: lines array cannot be empty");
//   }
// }

// function normalizeLines(lines) {
//   return lines.map((line) => {
//     if (typeof line === "string") {
//       return line;
//     }
//     if (line && typeof line.text === "string") {
//       return line.text;
//     }
//     return "";
//   });
// }

// function detectMultiColumn(
//   lines,
//   threshold = DETECTION_THRESHOLDS.multiColumn.minAlignedSeparators,
// ) {
//   let alignedSeparators = 0;

//   for (const line of lines) {
//     if (PATTERNS.multiColumnSpacing.test(line)) {
//       alignedSeparators++;
//       if (alignedSeparators >= threshold) {
//         return true;
//       }
//     }
//   }

//   return false;
// }

// function detectTables(lines, threshold = DETECTION_THRESHOLDS.tables.minTableLikeLines) {
//   let tableLikeLines = 0;

//   for (const line of lines) {
//     const hasPipes = PATTERNS.tablePipes.test(line);
//     const hasMultipleTabs = PATTERNS.consecutiveTabs.test(line);

//     if (hasPipes || hasMultipleTabs) {
//       tableLikeLines++;
//       if (tableLikeLines >= threshold) {
//         return true;
//       }
//     }
//   }

//   return false;
// }

// function detectIcons(text) {
//   return PATTERNS.icons.test(text);
// }

// // ✅ NEW: Count emojis and decorative characters
// function countEmojisAndDecorations(text) {
//   const decorativeMatches = text.match(PATTERNS.decorativeChars) || [];
//   const arrowMatches = text.match(PATTERNS.arrowSymbols) || [];

//   return {
//     decorativeCount: decorativeMatches.length,
//     arrowCount: arrowMatches.length,
//     totalCount: decorativeMatches.length + arrowMatches.length,
//     hasExcessiveDecorations: decorativeMatches.length > DETECTION_THRESHOLDS.emojis.maxAllowed,
//   };
// }

// function detectAllCaps(
//   lines,
//   config = {
//     minLength: DETECTION_THRESHOLDS.allCaps.minLineLength,
//     minOccurrences: DETECTION_THRESHOLDS.allCaps.minOccurrences,
//   },
// ) {
//   const capsLines = lines.filter((line) => {
//     const trimmedLine = line.trim();
//     return (
//       trimmedLine.length > config.minLength &&
//       trimmedLine === trimmedLine.toUpperCase() &&
//       /[A-Z]/.test(trimmedLine)
//     );
//   });

//   return capsLines.length >= config.minOccurrences;
// }

// function detectExcessiveWhitespace(text) {
//   return PATTERNS.excessiveNewlines.test(text);
// }

// function detectBulletConsistency(lines) {
//   const bulletTypes = new Set();

//   for (const line of lines) {
//     const match = line.match(PATTERNS.bulletPoints);
//     if (match) {
//       bulletTypes.add(match[1]);
//     }
//   }

//   return bulletTypes.size <= 1;
// }

// function detectLineSpacing(text) {
//   const allLines = text.split("\n");
//   const blankLines = allLines.filter((line) => line.trim() === "").length;
//   const blankLineRatio = blankLines / allLines.length;

//   return blankLineRatio > DETECTION_THRESHOLDS.whitespace.maxBlankLineRatio;
// }

// function estimatePages(lines, linesPerPage = DETECTION_THRESHOLDS.pageEstimation.linesPerPage) {
//   if (lines.length === 0) return 0;
//   return Math.ceil(lines.length / linesPerPage);
// }

// function evaluateRules(rules, layoutSignals, structureSignals) {
//   const findings = [];

//   if (!rules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
//     findings.push("multiColumnLayout");
//   }

//   if (!rules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
//     findings.push("tablesUsed");
//   }

//   if (!rules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
//     findings.push("imagesOrIconsUsed");
//   }

//   if (
//     rules.structureRules.maxPages &&
//     structureSignals.pageLengthEstimate > rules.structureRules.maxPages
//   ) {
//     findings.push("tooManyPages");
//   }

//   return findings;
// }

// // ✅ ENHANCED: Much stricter quality detection
// function detectQualityIssues(layoutSignals, fontSignals, structureSignals, lines, text) {
//   const qualityIssues = [];
//   const wordCount = text.split(/\s+/).length;
//   const avgLineLength = lines.length > 0 ? text.length / lines.length : 0;

//   // ✅ Check for very short resume
//   if (lines.length < DETECTION_THRESHOLDS.minContent.minLines) {
//     qualityIssues.push("tooShort");
//   }

//   // ✅ Check for minimal content
//   if (wordCount < DETECTION_THRESHOLDS.minContent.minWords) {
//     qualityIssues.push("minimalContent");
//   }

//   // ✅ Check for excessive emojis/decorations
//   const emojiData = countEmojisAndDecorations(text);
//   if (emojiData.hasExcessiveDecorations) {
//     qualityIssues.push("excessiveEmojis");
//   }

//   // ✅ Check for excessive arrows (unprofessional)
//   if (emojiData.arrowCount > 5) {
//     qualityIssues.push("excessiveArrows");
//   }

//   // ✅ Check for excessive uppercase
//   if (fontSignals.excessiveAllCaps) {
//     qualityIssues.push("excessiveAllCaps");
//   }

//   // ✅ Check for poor line spacing
//   if (structureSignals.lineSpacingIssues) {
//     qualityIssues.push("poorLineSpacing");
//   }

//   // ✅ Check for lack of bullets (unstructured content)
//   const bulletCount = lines.filter((l) => PATTERNS.bulletPoints.test(l)).length;
//   if (bulletCount === 0 && lines.length > 10) {
//     qualityIssues.push("noBulletPoints");
//   }

//   // ✅ Check for excessively long lines (poor formatting)
//   const longLines = lines.filter((l) => l.length > 150).length;
//   if (longLines > lines.length * 0.3) {
//     qualityIssues.push("excessivelyLongLines");
//   }

//   // ✅ NEW: Check for very short lines (incomplete content)
//   const shortLines = lines.filter((l) => {
//     const trimmed = l.trim();
//     return trimmed.length > 0 && trimmed.length < DETECTION_THRESHOLDS.minContent.minCharsPerLine;
//   }).length;

//   if (shortLines > lines.length * 0.4) {
//     qualityIssues.push("tooManyShortLines");
//   }

//   // ✅ NEW: Check average line length (indicates content quality)
//   if (avgLineLength < 40) {
//     qualityIssues.push("poorContentDensity");
//   }

//   // ✅ NEW: Check for lack of professional language indicators
//   const professionalWords = [
//     "developed",
//     "managed",
//     "led",
//     "created",
//     "implemented",
//     "designed",
//     "achieved",
//     "improved",
//     "analyzed",
//   ];
//   const hasProfessionalLanguage = professionalWords.some((word) =>
//     text.toLowerCase().includes(word),
//   );

//   if (!hasProfessionalLanguage && wordCount > 50) {
//     qualityIssues.push("lacksProfessionalLanguage");
//   }

//   return qualityIssues;
// }

// // ✅ ENHANCED: Stricter quality scoring
// function calculateQualityScore(lines, text, findings) {
//   let score = 10;

//   // ✅ STRICTER penalties
//   const severityMap = {
//     multiColumnLayout: -3,
//     tablesUsed: -3,
//     imagesOrIconsUsed: -2,
//     tooManyPages: -2,
//     tooShort: -5, // ✅ Increased from -4
//     excessiveAllCaps: -3, // ✅ Increased from -2
//     poorLineSpacing: -1,
//     noBulletPoints: -3,
//     excessivelyLongLines: -2,
//     minimalContent: -6, // ✅ Increased from -5
//     excessiveEmojis: -4, // ✅ NEW
//     excessiveArrows: -3, // ✅ NEW
//     tooManyShortLines: -3, // ✅ NEW
//     poorContentDensity: -4, // ✅ NEW
//     lacksProfessionalLanguage: -3, // ✅ NEW
//   };

//   findings.forEach((finding) => {
//     score += severityMap[finding] || -1;
//   });

//   return Math.max(0, Math.min(10, score));
// }

// export const formattingAnalyzer = ({ parsedResume, rulesPath }) => {
//   validateInput(parsedResume);

//   const defaultRulesPath = path.join(__dirname, "../rules/formatting.rules.json");
//   const effectiveRulesPath = rulesPath || defaultRulesPath;
//   const formattingRules = loadFormattingRules(effectiveRulesPath);

//   const text = parsedResume.cleanText;
//   const lines = normalizeLines(parsedResume.lines);

//   // ✅ Get emoji/decoration data
//   const emojiData = countEmojisAndDecorations(text);

//   const layoutSignals = {
//     multiColumnSuspected: detectMultiColumn(lines),
//     tablesSuspected: detectTables(lines),
//     imagesOrIconsSuspected: detectIcons(text),
//     emojiCount: emojiData.totalCount, // ✅ NEW
//     hasExcessiveEmojis: emojiData.hasExcessiveDecorations, // ✅ NEW
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

//   const ruleFindings = evaluateRules(formattingRules, layoutSignals, structureSignals);
//   const qualityIssues = detectQualityIssues(
//     layoutSignals,
//     fontSignals,
//     structureSignals,
//     lines,
//     text,
//   );

//   const allFindings = [...ruleFindings, ...qualityIssues];

//   return {
//     layoutSignals,
//     fontSignals,
//     structureSignals,
//     ruleFindings: allFindings,
//     qualityScore: calculateQualityScore(lines, text, allFindings),
//     emojiData, // ✅ NEW: Include emoji data in output
//     meta: {
//       rulesVersion: formattingRules.meta?.version || "unknown",
//       analyzer: "formattingAnalyzer",
//       timestamp: new Date().toISOString(),
//       totalLines: lines.length,
//       totalIssues: allFindings.length,
//     },
//   };
// };

// export const testHelpers = {
//   detectMultiColumn,
//   detectTables,
//   detectIcons,
//   detectAllCaps,
//   detectExcessiveWhitespace,
//   detectBulletConsistency,
//   detectLineSpacing,
//   estimatePages,
//   validateInput,
//   normalizeLines,
//   detectQualityIssues,
//   calculateQualityScore,
//   countEmojisAndDecorations, // ✅ NEW
//   DETECTION_THRESHOLDS,
//   PATTERNS,
// };
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ BALANCED thresholds - strict but fair
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

// ✅ PRECISE pattern matching
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

// ✅ ENHANCED: Detect professional content quality
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

// ✅ BALANCED: Quality detection with clear criteria
function detectQualityIssues(layoutSignals, fontSignals, structureSignals, lines, text) {
  const qualityIssues = [];
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  const avgLineLength = lines.length > 0 ? text.length / lines.length : 0;

  // Get professional content analysis
  const professionalContent = analyzeProfessionalContent(text, lines);

  // ✅ Check 1: Minimum content length
  if (lines.length < DETECTION_THRESHOLDS.minContent.minLines) {
    qualityIssues.push("tooShort");
  }

  // ✅ Check 2: Minimum word count
  if (wordCount < DETECTION_THRESHOLDS.minContent.minWords) {
    qualityIssues.push("minimalContent");
  }

  // ✅ Check 3: Excessive emojis
  const emojiData = countEmojisAndDecorations(text);
  if (emojiData.hasExcessiveDecorations) {
    qualityIssues.push("excessiveEmojis");
  }

  // ✅ Check 4: Too many arrows
  if (emojiData.arrowCount > 8) {
    qualityIssues.push("excessiveArrows");
  }

  // ✅ Check 5: All caps text
  if (fontSignals.excessiveAllCaps) {
    qualityIssues.push("excessiveAllCaps");
  }

  // ✅ Check 6: Poor line spacing
  if (structureSignals.lineSpacingIssues) {
    qualityIssues.push("poorLineSpacing");
  }

  // ✅ Check 7: No bullet points at all (unprofessional)
  if (professionalContent.bulletPointCount === 0 && lines.length > 15) {
    qualityIssues.push("noBulletPoints");
  }

  // ✅ Check 8: Excessively long lines (>60% of lines are too long)
  const longLines = lines.filter((l) => l.length > 150).length;
  if (longLines > lines.length * 0.6) {
    qualityIssues.push("excessivelyLongLines");
  }

  // ✅ Check 9: Too many very short lines (>50% are too short)
  const shortLines = lines.filter((l) => {
    const trimmed = l.trim();
    return trimmed.length > 0 && trimmed.length < DETECTION_THRESHOLDS.minContent.minCharsPerLine;
  }).length;

  if (shortLines > lines.length * 0.5) {
    qualityIssues.push("tooManyShortLines");
  }

  // ✅ Check 10: Poor content density (average line is very short)
  if (avgLineLength < 35 && lines.length > 10) {
    qualityIssues.push("poorContentDensity");
  }

  // ✅ Check 11: Lacks professional structure
  if (!professionalContent.hasProfessionalStructure) {
    qualityIssues.push("lacksProfessionalStructure");
  }

  // ✅ Check 12: No quantified achievements
  if (professionalContent.quantifiedCount === 0 && wordCount > 150) {
    qualityIssues.push("noQuantifiedAchievements");
  }

  return qualityIssues;
}

// ✅ BALANCED: Penalty system with clear severity levels
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
    professionalContent, // ✅ NEW: Include professional content analysis
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
