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
  charactersToRemove: /[:\-–—_•*#]/g,
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

  // Check for heading-like characteristics
  const hasAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
  const hasColonOrDash = /[:\-–—]/.test(trimmed);
  const isShort = trimmed.length < 50;

  return hasAllCaps || hasColonOrDash || isShort;
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

  // Fuzzy matching for common section names
  const fuzzyMatches = {
    experience: ["exp", "work", "job", "career", "employment", "professional"],
    skills: ["skill", "tech", "technical", "abilities", "competencies"],
    education: ["edu", "academic", "degree", "qualification", "school", "university"],
    projects: ["project", "portfolio", "work samples"],
    contact: ["info", "details", "personal"],
  };

  for (const [sectionKey, keywords] of Object.entries(fuzzyMatches)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      // Find the section config
      const section = sectionConfigs.find((s) => s.key === sectionKey);
      if (section) {
        return sectionKey;
      }
    }
  }

  return null;
}
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
      if (currentSectionKey === "contact" && sectionContentMap["contact"].length >= 8) {
        // Stop adding to contact section after 8 lines to avoid including too much
        currentSectionKey = null;
      } else if (
        currentSectionKey === "contact" &&
        sectionContentMap["contact"].length > 2 &&
        !isLikelyContactInfo(line) &&
        !isLikelyHeading(line)
      ) {
        // Stop contact section if line doesn't look like contact info or heading after we've collected some contact info
        currentSectionKey = null;
      } else {
        sectionContentMap[currentSectionKey].push(line);
        sectionPositions[currentSectionKey].endLine = lineIndex;
      }
    } else {
      // No section started yet - check if this might be contact info at the top
      if (lineIndex < 15 && (isLikelyContactInfo(line) || isLikelyHeading(line))) {
        // Auto-start contact section for content at the beginning that looks like contact info or could be a heading
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
    // Check if line contains keywords relevant to this section
    if (sectionKeywords.some((keyword) => lineLower.includes(keyword))) {
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
