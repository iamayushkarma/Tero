// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const sectionRules = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../rules/section.rules.json"), "utf-8"),
// );

// export const sectionDetector = ({ lines }) => {
//   if (!Array.isArray(lines)) {
//     throw new Error("sectionDetector: lines must be an array");
//   }

//   // 1. Prepare Section Configs
//   const sectionConfigs = sectionRules.sections.map((section) => ({
//     key: section.key,
//     displayName: section.displayName,
//     required: section.required,
//     importance: section.importance,
//     headingSet: new Set(section.headings.map((h) => h.toLowerCase().trim())),
//   }));
//   // 2. Normalize Heading
//   const normalizeHeading = (line) => {
//     return line
//       .toLowerCase()
//       .trim()
//       .replace(/[:\-–—_•*]/g, "")
//       .replace(/\s+/g, " ")
//       .trim();
//   };

//   // 3. Match Section Heading
//   const matchSectionHeading = (line) => {
//     const normalized = normalizeHeading(line);
//     if (!normalized) return null;

//     for (const section of sectionConfigs) {
//       if (section.headingSet.has(normalized)) {
//         return section.key;
//       }
//     }
//     // example
//     // matchSectionHeading("EXPERIENCE"); → "experience"
//     // matchSectionHeading("Work Experience:"); → "experience"
//     // matchSectionHeading("Employment History"); → "experience"
//     // matchSectionHeading("EDUCATION")  → "education"
//     // matchSectionHeading("Random Text"); → null
//     // matchSectionHeading("Software Engineer"); → null

//     return null;
//   };

//   // 4. Detection State
//   const sectionContentMap = {};
//   const sectionOrder = [];
//   let currentSectionKey = null;

//   // 5. Line by Line Detection
//   for (const line of lines) {
//     const trimmedLine = line.trim();
//     if (!trimmedLine) continue;

//     const matchedKey = matchSectionHeading(line);

//     if (matchedKey) {
//       // New section detected
//       if (!sectionContentMap[matchedKey]) {
//         sectionContentMap[matchedKey] = [];
//         sectionOrder.push(matchedKey);
//       }
//       currentSectionKey = matchedKey;
//     } else if (currentSectionKey) {
//       // Add content to current section
//       sectionContentMap[currentSectionKey].push(line);
//     }
//   }

//   // 6. Build Section Objects
//   const sections = sectionConfigs.map((config) => {
//     const content = sectionContentMap[config.key] || [];

//     return {
//       key: config.key,
//       displayName: config.displayName,
//       required: config.required,
//       importance: config.importance,
//       found: content.length > 0,
//       content,
//     };
//   });

//   // 7. Identify Missing Required Sections
//   const detectedSections = sectionOrder;
//   const missingRequiredSections = sectionConfigs
//     .filter((config) => config.required && !sectionContentMap[config.key])
//     .map((config) => config.key);

//   // 8. Return Detection Results
//   return {
//     sections,
//     detectedSections,
//     missingRequiredSections,
//     sectionOrder,
//     meta: {
//       rulesVersion: sectionRules.meta?.version || "unknown",
//       targetAudience: sectionRules.meta?.targetAudience || "general",
//     },
//   };
// };

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} SectionConfig
 * @property {string} key - Section identifier
 * @property {string} displayName - Human-readable section name
 * @property {boolean} required - Whether this section is required
 * @property {string} importance - Importance level (critical, high, medium, low)
 * @property {string[]} headings - List of possible heading variations
 */

/**
 * @typedef {Object} PreparedSectionConfig
 * @property {string} key - Section identifier
 * @property {string} displayName - Human-readable section name
 * @property {boolean} required - Whether this section is required
 * @property {string} importance - Importance level
 * @property {Set<string>} headingSet - Set of normalized heading variations for O(1) lookup
 */

/**
 * @typedef {Object} DetectedSection
 * @property {string} key - Section identifier
 * @property {string} displayName - Human-readable section name
 * @property {boolean} required - Whether this section is required
 * @property {string} importance - Importance level
 * @property {boolean} found - Whether this section was found
 * @property {string[]} content - Array of content lines for this section
 * @property {number} lineCount - Number of content lines
 * @property {number} [startLine] - Line number where section starts (0-indexed)
 * @property {number} [endLine] - Line number where section ends (0-indexed)
 */

/**
 * @typedef {Object} DetectionResult
 * @property {DetectedSection[]} sections - Array of all sections with their content
 * @property {string[]} detectedSections - Array of detected section keys in order
 * @property {string[]} missingRequiredSections - Array of missing required section keys
 * @property {string[]} sectionOrder - Order in which sections appear
 * @property {Object} statistics - Detection statistics
 * @property {number} statistics.totalSections - Total sections configured
 * @property {number} statistics.detectedCount - Number of sections detected
 * @property {number} statistics.requiredCount - Number of required sections
 * @property {number} statistics.missingRequiredCount - Number of missing required sections
 * @property {number} statistics.completionRate - Percentage of sections detected
 * @property {Object} meta - Metadata about the detection
 */

/**
 * Cache for loaded section rules to avoid repeated file reads
 */
let cachedSectionRules = null;

/**
 * Configuration for heading normalization
 */
const NORMALIZATION_CONFIG = {
  // Characters to remove during normalization
  charactersToRemove: /[:\-–—_•*#]/g,
  // Whitespace normalization
  whitespacePattern: /\s+/g,
  // Maximum heading length to consider (longer lines are likely content)
  maxHeadingLength: 100,
};

/**
 * Loads and caches section detection rules from JSON file
 * @param {string} rulesPath - Path to the section rules JSON file
 * @param {boolean} [forceReload=false] - Force reload even if cached
 * @returns {Object} Section detection rules configuration
 * @throws {Error} If rules file cannot be loaded or is invalid
 */
function loadSectionRules(rulesPath, forceReload = false) {
  if (cachedSectionRules && !forceReload) {
    return cachedSectionRules;
  }

  try {
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");
    const rules = JSON.parse(rulesContent);

    // Validate required structure
    validateRulesStructure(rules);

    cachedSectionRules = rules;
    return rules;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Section rules file not found: ${rulesPath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in section rules file: ${error.message}`);
    }
    throw new Error(`Failed to load section rules: ${error.message}`);
  }
}

/**
 * Validates the structure of section rules
 * @param {Object} rules - Rules object to validate
 * @throws {Error} If validation fails
 */
function validateRulesStructure(rules) {
  if (!rules.sections || !Array.isArray(rules.sections)) {
    throw new Error("Invalid rules structure: 'sections' must be an array");
  }

  if (rules.sections.length === 0) {
    throw new Error("Invalid rules structure: 'sections' cannot be empty");
  }

  // Validate each section config
  rules.sections.forEach((section, index) => {
    if (!section.key || typeof section.key !== "string") {
      throw new Error(`Invalid section at index ${index}: missing 'key' field`);
    }
    if (!Array.isArray(section.headings) || section.headings.length === 0) {
      throw new Error(`Invalid section '${section.key}': 'headings' must be a non-empty array`);
    }
  });
}

/**
 * Validates input parameters for section detection
 * @param {string[]} lines - Array of text lines from resume
 * @throws {Error} If validation fails
 */
function validateInput(lines) {
  if (!Array.isArray(lines)) {
    throw new Error("sectionDetector: lines must be an array");
  }

  if (lines.length === 0) {
    throw new Error("sectionDetector: lines array cannot be empty");
  }

  // Check if all elements are strings
  const invalidLines = lines.filter((line) => typeof line !== "string");
  if (invalidLines.length > 0) {
    throw new Error(
      `sectionDetector: all lines must be strings, found ${invalidLines.length} invalid line(s)`,
    );
  }
}

/**
 * Normalizes a heading line for matching
 * Removes special characters, extra whitespace, and converts to lowercase
 *
 * @param {string} line - Raw heading line
 * @returns {string} Normalized heading
 *
 * @example
 * normalizeHeading("EXPERIENCE:"); // "experience"
 * normalizeHeading("Work Experience"); // "work experience"
 * normalizeHeading("  Skills • "); // "skills"
 */
function normalizeHeading(line) {
  if (typeof line !== "string") {
    return "";
  }

  return line
    .toLowerCase()
    .trim()
    .replace(NORMALIZATION_CONFIG.charactersToRemove, "")
    .replace(NORMALIZATION_CONFIG.whitespacePattern, " ")
    .trim();
}

/**
 * Checks if a line is likely a section heading based on formatting
 * @param {string} line - Line to check
 * @returns {boolean} True if line appears to be a heading
 */
function isLikelyHeading(line) {
  const trimmed = line.trim();

  // Empty lines are not headings
  if (!trimmed) {
    return false;
  }

  // Very long lines are likely content, not headings
  if (trimmed.length > NORMALIZATION_CONFIG.maxHeadingLength) {
    return false;
  }

  // Check for heading-like characteristics
  const hasAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
  const hasColonOrDash = /[:\-–—]/.test(trimmed);
  const isShort = trimmed.length < 50;

  return hasAllCaps || hasColonOrDash || isShort;
}

/**
 * Checks if a line likely contains contact information
 * @param {string} line - Line to check
 * @returns {boolean} True if line appears to contain contact info
 */
function isLikelyContactInfo(line) {
  const trimmed = line.trim().toLowerCase();

  // Check for email patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  if (emailRegex.test(trimmed)) {
    return true;
  }

  // Check for phone patterns (various formats)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phoneRegex.test(trimmed)) {
    return true;
  }

  // Check for common contact keywords
  const contactKeywords = [
    "email",
    "phone",
    "mobile",
    "address",
    "linkedin",
    "github",
    "portfolio",
    "website",
    "location",
    "city",
    "state",
    "zip",
  ];
  if (contactKeywords.some((keyword) => trimmed.includes(keyword))) {
    return true;
  }

  // Check for URLs (LinkedIn, GitHub, etc.)
  const urlRegex = /https?:\/\/[^\s]+/;
  if (urlRegex.test(trimmed)) {
    return true;
  }

  // Check for potential names (2-3 words, title case or all caps)
  const words = trimmed.split(/\s+/);
  if (words.length >= 2 && words.length <= 4) {
    // Check if it looks like a name (starts with capital letters)
    const looksLikeName = words.every(
      (word) =>
        word.length > 1 &&
        word[0] === word[0].toUpperCase() &&
        word.slice(1) === word.slice(1).toLowerCase(),
    );
    if (looksLikeName) {
      return true;
    }
  }

  // Check for address-like patterns (street numbers, directions)
  const addressRegex =
    /\b\d+\s+[A-Za-z0-9\s,.-]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct)\b/i;
  if (addressRegex.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Prepares section configurations for efficient matching
 * @param {SectionConfig[]} sections - Raw section configurations
 * @returns {PreparedSectionConfig[]} Prepared configurations with normalized heading sets
 */
function prepareSectionConfigs(sections) {
  return sections.map((section) => ({
    key: section.key,
    displayName: section.displayName,
    required: section.required || false,
    importance: section.importance || "medium",
    headingSet: new Set(section.headings.map((heading) => normalizeHeading(heading))),
  }));
}

/**
 * Matches a line against known section headings
 * @param {string} line - Line to match
 * @param {PreparedSectionConfig[]} sectionConfigs - Prepared section configurations
 * @returns {string|null} Matched section key or null
 *
 * @example
 * matchSectionHeading("EXPERIENCE", configs); // "experience"
 * matchSectionHeading("Work Experience:", configs); // "experience"
 * matchSectionHeading("Random Text", configs); // null
 */
function matchSectionHeading(line, sectionConfigs) {
  const normalized = normalizeHeading(line);

  // Empty normalized heading cannot match
  if (!normalized) {
    return null;
  }

  // Quick heuristic check before expensive matching
  if (!isLikelyHeading(line)) {
    return null;
  }

  // Check against all section configurations
  for (const section of sectionConfigs) {
    if (section.headingSet.has(normalized)) {
      return section.key;
    }
  }

  return null;
}

/**
 * Processes lines and detects sections
 * @param {string[]} lines - Array of text lines
 * @param {PreparedSectionConfig[]} sectionConfigs - Prepared section configurations
 * @returns {Object} Processing results with content map and order
 */
function processLines(lines, sectionConfigs) {
  const sectionContentMap = {};
  const sectionOrder = [];
  const sectionPositions = {};
  let currentSectionKey = null;
  let currentSectionStartLine = -1;

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      return;
    }

    // Check if this line is a section heading
    const matchedKey = matchSectionHeading(line, sectionConfigs);

    if (matchedKey) {
      // Close previous section
      if (currentSectionKey) {
        sectionPositions[currentSectionKey].endLine = lineIndex - 1;
      }

      // Start new section
      if (!sectionContentMap[matchedKey]) {
        sectionContentMap[matchedKey] = [];
        sectionOrder.push(matchedKey);
        sectionPositions[matchedKey] = {
          startLine: lineIndex,
          endLine: lineIndex,
        };
      }

      currentSectionKey = matchedKey;
      currentSectionStartLine = lineIndex;
    } else if (currentSectionKey) {
      // Add content to current section
      // Special handling for auto-detected contact section
      if (currentSectionKey === "contact" && sectionContentMap["contact"].length >= 6) {
        // Stop adding to contact section after 6 lines to avoid including too much
        // This will be treated as unassigned content
      } else if (currentSectionKey === "contact" && !isLikelyContactInfo(line)) {
        // Stop contact section if line doesn't look like contact info
        currentSectionKey = null;
      } else {
        sectionContentMap[currentSectionKey].push(line);
        sectionPositions[currentSectionKey].endLine = lineIndex;
      }
    } else {
      // No section started yet - check if this might be contact info at the top
      if (lineIndex < 10 && isLikelyContactInfo(line)) {
        // Auto-start contact section for content at the beginning that looks like contact info
        if (!sectionContentMap["contact"]) {
          sectionContentMap["contact"] = [];
          sectionOrder.push("contact");
          sectionPositions["contact"] = {
            startLine: lineIndex,
            endLine: lineIndex,
          };
        }
        currentSectionKey = "contact";
        currentSectionStartLine = lineIndex;
        sectionContentMap["contact"].push(line);
        sectionPositions["contact"].endLine = lineIndex;
      }
    }
  });

  return {
    sectionContentMap,
    sectionOrder,
    sectionPositions,
  };
}

/**
 * Builds section objects with complete information
 * @param {PreparedSectionConfig[]} sectionConfigs - Section configurations
 * @param {Object.<string, string[]>} sectionContentMap - Map of section keys to content
 * @param {Object.<string, Object>} sectionPositions - Map of section keys to positions
 * @returns {DetectedSection[]} Array of section objects
 */
function buildSectionObjects(sectionConfigs, sectionContentMap, sectionPositions) {
  return sectionConfigs.map((config) => {
    const content = sectionContentMap[config.key] || [];
    const found = content.length > 0;
    const positions = sectionPositions[config.key];

    const section = {
      key: config.key,
      displayName: config.displayName,
      required: config.required,
      importance: config.importance,
      found,
      content,
      lineCount: content.length,
    };

    // Add position information if section was found
    if (found && positions) {
      section.startLine = positions.startLine;
      section.endLine = positions.endLine;
    }

    return section;
  });
}

/**
 * Calculates detection statistics
 * @param {DetectedSection[]} sections - Array of detected sections
 * @param {string[]} detectedSections - Array of detected section keys
 * @param {string[]} missingRequiredSections - Array of missing required section keys
 * @returns {Object} Detection statistics
 */
function calculateStatistics(sections, detectedSections, missingRequiredSections) {
  const totalSections = sections.length;
  const detectedCount = detectedSections.length;
  const requiredSections = sections.filter((s) => s.required);
  const requiredCount = requiredSections.length;
  const missingRequiredCount = missingRequiredSections.length;
  const completionRate = totalSections > 0 ? (detectedCount / totalSections) * 100 : 0;

  return {
    totalSections,
    detectedCount,
    requiredCount,
    missingRequiredCount,
    completionRate: parseFloat(completionRate.toFixed(2)),
  };
}

/**
 * Main section detector function
 * Detects and extracts sections from resume text lines
 *
 * @param {Object} params - Detection parameters
 * @param {string[]} params.lines - Array of text lines from the resume
 * @param {string} [params.rulesPath] - Optional custom path to section rules file
 * @returns {DetectionResult} Comprehensive section detection results
 * @throws {Error} If input validation fails or rules cannot be loaded
 *
 * @example
 * const result = sectionDetector({
 *   lines: [
 *     "John Doe",
 *     "EXPERIENCE",
 *     "Software Engineer at ABC Corp",
 *     "EDUCATION",
 *     "BS Computer Science"
 *   ]
 * });
 *
 * // Result:
 * // {
 * //   sections: [{ key: 'experience', found: true, content: [...] }, ...],
 * //   detectedSections: ['experience', 'education'],
 * //   missingRequiredSections: [],
 * //   sectionOrder: ['experience', 'education'],
 * //   statistics: { totalSections: 10, detectedCount: 2, ... }
 * // }
 */
export const sectionDetector = ({ lines, rulesPath }) => {
  // Validate input
  validateInput(lines);

  // Load section rules
  const defaultRulesPath = path.join(__dirname, "../rules/section.rules.json");
  const effectiveRulesPath = rulesPath || defaultRulesPath;
  const sectionRules = loadSectionRules(effectiveRulesPath);

  // Prepare section configurations
  const sectionConfigs = prepareSectionConfigs(sectionRules.sections);

  // Process lines and detect sections
  const { sectionContentMap, sectionOrder, sectionPositions } = processLines(lines, sectionConfigs);

  // Build section objects
  const sections = buildSectionObjects(sectionConfigs, sectionContentMap, sectionPositions);

  // Identify detected sections
  const detectedSections = sectionOrder;

  // Identify missing required sections
  const missingRequiredSections = sectionConfigs
    .filter((config) => config.required && !sectionContentMap[config.key])
    .map((config) => config.key);

  // Calculate statistics
  const statistics = calculateStatistics(sections, detectedSections, missingRequiredSections);

  // Return comprehensive results
  return {
    sections,
    detectedSections,
    missingRequiredSections,
    sectionOrder,
    statistics,
    meta: {
      rulesVersion: sectionRules.meta?.version || "unknown",
      targetAudience: sectionRules.meta?.targetAudience || "general",
      analyzer: "sectionDetector",
      timestamp: new Date().toISOString(),
      totalLinesProcessed: lines.length,
    },
  };
};

/**
 * Clears the cached section rules (useful for testing or rule updates)
 */
export function clearRulesCache() {
  cachedSectionRules = null;
}

/**
 * Export helper functions for testing purposes
 */
export const testHelpers = {
  loadSectionRules,
  validateInput,
  validateRulesStructure,
  normalizeHeading,
  isLikelyHeading,
  prepareSectionConfigs,
  matchSectionHeading,
  processLines,
  buildSectionObjects,
  calculateStatistics,
  clearRulesCache,
  NORMALIZATION_CONFIG,
};
