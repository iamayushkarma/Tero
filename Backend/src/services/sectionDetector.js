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
 * Cache for loaded section rules to avoid repeated file reads
 */
let cachedSectionRules = null;

/**
 * Configuration for heading normalization
 */
const NORMALIZATION_CONFIG = {
  // Characters to remove during normalization
  charactersToRemove: /[:\-–—_•*#()\d]/g,
  // Whitespace normalization
  whitespacePattern: /\s+/g,
  // Maximum heading length to consider (longer lines are likely content)
  maxHeadingLength: 100,
};
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

  // Very short lines (1-2 chars) are unlikely to be headings
  if (trimmed.length < 3) {
    return false;
  }

  // Check for heading-like characteristics (more strict)
  const hasAllCaps =
    trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && trimmed.length > 3;
  const hasColonOrDash = /[:\-–—]/.test(trimmed) && trimmed.length > 5;
  const isReasonableLength = trimmed.length >= 4 && trimmed.length <= 40;

  // Must have at least one strong heading indicator
  return (hasAllCaps || hasColonOrDash) && isReasonableLength;
}
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
    "contact",
    "tel",
    "cell",
  ];
  if (contactKeywords.some((keyword) => trimmed.includes(keyword))) {
    return true;
  }

  // Check for URLs (LinkedIn, GitHub, etc.)
  const urlRegex = /https?:\/\/[^\s]+/;
  if (urlRegex.test(trimmed)) {
    return true;
  }

  // Check for potential names (2-4 words, title case or all caps)
  const words = trimmed.split(/\s+/);
  if (words.length >= 2 && words.length <= 5) {
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

  // Check for location patterns (City, State or City, Country)
  const locationRegex = /^[A-Z][a-z]+,?\s*[A-Z][a-z]+$/;
  if (locationRegex.test(trimmed)) {
    return true;
  }

  return false;
}

function prepareSectionConfigs(sections) {
  return sections.map((section) => ({
    key: section.key,
    displayName: section.displayName,
    required: section.required || false,
    importance: section.importance || "medium",
    headingSet: new Set(section.headings.map((heading) => normalizeHeading(heading))),
  }));
}

function matchSectionHeading(line, sectionConfigs) {
  const normalized = normalizeHeading(line);

  // Empty normalized heading cannot match
  if (!normalized) {
    return null;
  }

  // Check against all section configurations
  for (const section of sectionConfigs) {
    for (const h of section.headingSet) {
      if (normalized === h || normalized.startsWith(h + " ")) {
        return section.key;
      }
    }
  }

  // More restrictive fuzzy matching - only for specific patterns
  const trimmed = line.trim().toLowerCase();

  // Only do fuzzy matching for lines that look like they could be section headers
  if (trimmed.length < 6 || trimmed.length > 35) {
    return null;
  }

  // Fuzzy matching for common section names (more restrictive)
  const fuzzyMatches = {
    experience: ["work experience", "professional experience", "employment", "career history"],
    skills: ["technical skills", "skills & competencies"],
    education: ["education", "academic background"],
    projects: ["projects", "portfolio"],
    contact: ["contact information", "personal details"],
  };

  for (const [sectionKey, keywords] of Object.entries(fuzzyMatches)) {
    if (keywords.some((keyword) => trimmed.includes(keyword))) {
      // Additional validation: ensure it's not just a random word match
      const section = sectionConfigs.find((s) => s.key === sectionKey);
      if (section && trimmed.length >= 8) {
        return sectionKey;
      }
    }
  }

  return null;
}

/**
 * Determines if the current section should be stopped based on content analysis
 * @param {string} sectionKey - Current section key
 * @param {string[]} sectionContent - Current section content
 * @param {string} currentLine - Current line being processed
 * @param {number} lineIndex - Current line index
 * @param {number} sectionStartLine - Line where section started
 * @param {number} linesSinceLastHeading - Lines since last heading
 * @returns {boolean} True if section should be stopped
 */
function shouldStopCurrentSection(
  sectionKey,
  sectionContent,
  currentLine,
  lineIndex,
  sectionStartLine,
  linesSinceLastHeading,
) {
  const sectionLength = lineIndex - sectionStartLine;

  // Stop contact section after reasonable length or when content doesn't match
  if (sectionKey === "contact") {
    if (sectionContent.length >= 6) {
      return true; // Contact sections shouldn't be longer than 6 lines
    }
    if (
      sectionContent.length > 1 &&
      !isLikelyContactInfo(currentLine) &&
      !isLikelyHeading(currentLine)
    ) {
      return true; // Stop if line doesn't look like contact info
    }
  }

  // Stop sections that become too long (likely false detection)
  if (sectionLength > 50) {
    return true;
  }

  // Stop if we encounter another likely heading (section boundary)
  if (isLikelyHeading(currentLine) && linesSinceLastHeading > 2) {
    return true;
  }

  // Stop sections with too many empty lines (content break)
  if (linesSinceLastHeading > 5) {
    return true;
  }

  return false;
}

/**
 * Checks if a group of lines has strong contact information indicators
 * @param {string[]} lines - Lines to check
 * @returns {boolean} True if lines show strong contact indicators
 */
function hasStrongContactIndicators(lines) {
  let contactScore = 0;
  const contactText = lines.join(" ").toLowerCase();

  // Email addresses are strong indicators
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(contactText)) {
    contactScore += 3;
  }

  // Phone numbers are strong indicators
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(contactText)) {
    contactScore += 3;
  }

  // URLs (LinkedIn, GitHub, portfolio)
  if (/https?:\/\/[^\s]+/.test(contactText)) {
    contactScore += 2;
  }

  // Contact keywords
  const contactKeywords = [
    "email",
    "phone",
    "linkedin",
    "github",
    "website",
    "address",
    "location",
  ];
  contactKeywords.forEach((keyword) => {
    if (contactText.includes(keyword)) {
      contactScore += 1;
    }
  });

  // Name-like patterns (capitalized words)
  const words = contactText.split(/\s+/);
  const capitalizedWords = words.filter(
    (word) =>
      word.length > 1 &&
      word[0] === word[0].toUpperCase() &&
      word.slice(1) === word.slice(1).toLowerCase(),
  );

  if (capitalizedWords.length >= 2) {
    contactScore += 2;
  }

  return contactScore >= 3; // Require at least 3 points for strong contact detection
}

function processLines(lines, sectionConfigs) {
  const sectionContentMap = {};
  const sectionOrder = [];
  const sectionPositions = {};
  let currentSectionKey = null;
  let currentSectionStartLine = -1;
  let linesSinceLastHeading = 0;

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      linesSinceLastHeading++;
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
      linesSinceLastHeading = 0;
    } else if (currentSectionKey) {
      // Add content to current section with stricter validation
      const shouldStopSection = shouldStopCurrentSection(
        currentSectionKey,
        sectionContentMap[currentSectionKey],
        line,
        lineIndex,
        currentSectionStartLine,
        linesSinceLastHeading,
      );

      if (shouldStopSection) {
        currentSectionKey = null;
        linesSinceLastHeading++;
        return;
      }

      sectionContentMap[currentSectionKey].push(line);
      sectionPositions[currentSectionKey].endLine = lineIndex;
      linesSinceLastHeading = 0;
    } else {
      // No section started yet - more conservative contact detection
      if (lineIndex < 8 && isLikelyContactInfo(line) && !isLikelyHeading(line)) {
        // Only auto-start contact section if we have strong contact indicators
        if (
          !sectionContentMap["contact"] &&
          hasStrongContactIndicators(lines.slice(0, lineIndex + 1))
        ) {
          sectionContentMap["contact"] = [];
          sectionOrder.push("contact");
          sectionPositions["contact"] = {
            startLine: lineIndex,
            endLine: lineIndex,
          };
          currentSectionKey = "contact";
          currentSectionStartLine = lineIndex;
          sectionContentMap["contact"].push(line);
          sectionPositions["contact"].endLine = lineIndex;
          linesSinceLastHeading = 0;
        }
      } else {
        linesSinceLastHeading++;
      }
    }
  });

  return {
    sectionContentMap,
    sectionOrder,
    sectionPositions,
  };
}

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

function postProcessSections(sections, lines, sectionConfigs) {
  const enhancedSections = [...sections];

  // Find sections that are still missing
  const missingSections = sectionConfigs.filter(
    (config) => !enhancedSections.find((s) => s.key === config.key)?.found,
  );

  // For each missing section, try to find content that might belong to it
  for (const missingConfig of missingSections) {
    const detectedContent = findSectionContentByKeywords(lines, missingConfig);
    if (detectedContent.length > 0) {
      // Update the section with detected content
      const sectionIndex = enhancedSections.findIndex((s) => s.key === missingConfig.key);
      if (sectionIndex >= 0) {
        enhancedSections[sectionIndex] = {
          ...enhancedSections[sectionIndex],
          found: true,
          content: detectedContent,
          lineCount: detectedContent.length,
        };
      }
    }
  }

  return enhancedSections;
}

function findSectionContentByKeywords(lines, sectionConfig) {
  const contentLines = [];
  const sectionKeywords = getSectionKeywords(sectionConfig.key);

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    // Check if line contains at least two keywords relevant to this section
    const matchingKeywords = sectionKeywords.filter((keyword) => lineLower.includes(keyword));
    if (matchingKeywords.length >= 2) {
      contentLines.push(line);
    }
  }

  return contentLines;
}

function getSectionKeywords(sectionKey) {
  const keywordMap = {
    experience: [
      "worked",
      "developed",
      "led",
      "managed",
      "created",
      "built",
      "designed",
      "implemented",
      "company",
      "role",
      "position",
      "years",
    ],
    skills: [
      "javascript",
      "python",
      "java",
      "react",
      "node",
      "sql",
      "html",
      "css",
      "aws",
      "docker",
      "git",
      "api",
    ],
    education: [
      "university",
      "college",
      "degree",
      "bachelor",
      "master",
      "phd",
      "gpa",
      "graduated",
      "major",
      "minor",
    ],
    projects: ["project", "built", "developed", "created", "github", "demo", "live", "features"],
    contact: ["email", "phone", "linkedin", "github", "website", "address"],
  };

  return keywordMap[sectionKey] || [];
}
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

  // Post-processing: Try to detect missed sections based on content analysis
  const enhancedSections = postProcessSections(sections, lines, sectionConfigs);

  // Update detected sections and missing sections based on post-processing
  const finalDetectedSections = enhancedSections.filter((s) => s.found).map((s) => s.key);

  const finalMissingRequiredSections = sectionConfigs
    .filter(
      (config) => config.required && !enhancedSections.find((s) => s.key === config.key)?.found,
    )
    .map((config) => config.key);

  // Recalculate statistics with enhanced sections
  const finalStatistics = calculateStatistics(
    enhancedSections,
    finalDetectedSections,
    finalMissingRequiredSections,
  );

  // Return comprehensive results
  return {
    sections: enhancedSections,
    detectedSections: finalDetectedSections,
    missingRequiredSections: finalMissingRequiredSections,
    sectionOrder: finalDetectedSections,
    statistics: finalStatistics,
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
