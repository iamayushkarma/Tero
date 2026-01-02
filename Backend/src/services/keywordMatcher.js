// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const keywordRules = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../rules/keyword.rules.json"), "utf-8"),
// );

// export const keywordMatcher = ({ parsedResume, sectionData }) => {
//   if (!parsedResume?.normalizedText) {
//     throw new Error("keywordMatcher: normalizedText is required");
//   }

//   if (!Array.isArray(sectionData?.sections)) {
//     throw new Error("keywordMatcher: section data required");
//   }

//   const text = parsedResume.normalizedText;
//   const tokens = parsedResume.tokens || [];

//   // 1. Prepare Keyword Groups
//   const groups = keywordRules.keywordGroups.map((group) => {
//     const keywordSet = new Set();

//     group.keywords.forEach((k) => keywordSet.add(k.toLowerCase()));

//     if (group.synonyms && keywordRules.matchingConfig.enableSynonyms) {
//       Object.values(group.synonyms).forEach((synList) => {
//         synList.forEach((s) => keywordSet.add(s.toLowerCase()));
//       });
//     }

//     return {
//       group: group.group,
//       roleCategory: group.roleCategory,
//       subcategory: group.subcategory,
//       importance: group.importance,
//       weight: group.weight,
//       required: group.required,
//       keywords: [...keywordSet],
//     };
//   });

//   //  2. Global Keyword Matching
//   const globalMatches = {};
//   const repetitionMap = {};

//   groups.forEach((group) => {
//     globalMatches[group.group] = {
//       matched: [],
//       totalCount: 0,
//       uniqueCount: 0,
//     };

//     group.keywords.forEach((keyword) => {
//       const regex = buildRegex(keyword, keywordRules.matchingConfig);
//       const matches = text.match(regex);

//       if (matches) {
//         globalMatches[group.group].matched.push(keyword);
//         globalMatches[group.group].totalCount += matches.length;
//         repetitionMap[keyword] = matches.length;
//       }
//     });

//     globalMatches[group.group].uniqueCount = globalMatches[group.group].matched.length;
//   });

//   // 3. Section-wise Matching
//   const sectionMatches = {};

//   sectionData.sections.forEach((section) => {
//     const sectionText = section.content.join(" ").toLowerCase();
//     sectionMatches[section.key] = {};

//     groups.forEach((group) => {
//       let count = 0;
//       const matched = [];

//       group.keywords.forEach((keyword) => {
//         const regex = buildRegex(keyword, keywordRules.matchingConfig);
//         const matches = sectionText.match(regex);

//         if (matches) {
//           matched.push(keyword);
//           count += matches.length;
//         }
//       });

//       if (count > 0) {
//         sectionMatches[section.key][group.group] = {
//           matched,
//           count,
//         };
//       }
//     });
//   });

//   //  4. Keyword Density
//   const density = {};

//   Object.keys(globalMatches).forEach((group) => {
//     const count = globalMatches[group].totalCount;
//     density[group] = tokens.length ? count / tokens.length : 0;
//   });

//   // 5. Action Verb Detection
//   const actionVerbGroup = groups.find((g) => g.group === "action_verbs");
//   const actionVerbsFound = [];

//   if (actionVerbGroup) {
//     actionVerbGroup.keywords.forEach((verb) => {
//       const regex = new RegExp(`\\b${escape(verb)}\\b`, "gi");
//       if (text.match(regex)) actionVerbsFound.push(verb);
//     });
//   }

//   // 6. Quantified Achievements
//   const quantifiedPatterns = keywordRules.bonuses?.quantifiedAchievements?.patterns || [];

//   const quantifiedAchievements = quantifiedPatterns.filter((pattern) =>
//     new RegExp(pattern).test(text),
//   );

//   // 7. Keyword Stuffing Signals
//   const stuffingSignals = [];

//   if (keywordRules.penalties.keywordStuffing.enabled) {
//     const threshold = keywordRules.penalties.keywordStuffing.repeatThreshold;

//     Object.entries(repetitionMap).forEach(([keyword, count]) => {
//       if (count > threshold) {
//         stuffingSignals.push({
//           keyword,
//           count,
//           threshold,
//         });
//       }
//     });
//   }

//   // Final Output

//   return {
//     globalMatches,
//     sectionMatches,
//     keywordDensity: density,
//     actionVerbs: {
//       count: actionVerbsFound.length,
//       verbs: actionVerbsFound,
//     },
//     quantifiedAchievements,
//     stuffingSignals,
//     meta: {
//       rulesVersion: keywordRules.meta.version,
//       matchingConfig: keywordRules.matchingConfig,
//     },
//   };
// };

// // Helpers
// function buildRegex(keyword, config) {
//   const escaped = escape(keyword);

//   if (config.enablePhraseMatching && keyword.includes(" ")) {
//     return new RegExp(escaped, "gi");
//   }

//   if (config.allowPartialMatches) {
//     return new RegExp(escaped, "gi");
//   }

//   return new RegExp(`\\b${escaped}\\b`, "gi");
// }

// function escape(str) {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} ParsedResume
 * @property {string} normalizedText - Normalized text content of the resume
 * @property {string[]} [tokens] - Tokenized words from the resume
 */

/**
 * @typedef {Object} Section
 * @property {string} key - Section identifier (e.g., 'experience', 'skills')
 * @property {string[]} content - Array of text content for this section
 */

/**
 * @typedef {Object} SectionData
 * @property {Section[]} sections - Array of resume sections
 */

/**
 * @typedef {Object} KeywordGroup
 * @property {string} group - Group identifier
 * @property {string} roleCategory - Role category (technical, non_technical, etc.)
 * @property {string|null} subcategory - Subcategory identifier
 * @property {string} importance - Importance level (very_high, high, medium, low)
 * @property {number} weight - Numerical weight for scoring
 * @property {boolean} required - Whether this group is required
 * @property {string[]} keywords - Array of keywords to match
 */

/**
 * @typedef {Object} GroupMatches
 * @property {string[]} matched - Array of matched keywords
 * @property {number} totalCount - Total count of all keyword occurrences
 * @property {number} uniqueCount - Count of unique matched keywords
 */

/**
 * @typedef {Object} SectionGroupMatch
 * @property {string[]} matched - Matched keywords in this section
 * @property {number} count - Total occurrence count in section
 */

/**
 * @typedef {Object} StuffingSignal
 * @property {string} keyword - The repeated keyword
 * @property {number} count - Number of repetitions
 * @property {number} threshold - Allowed threshold
 */

/**
 * @typedef {Object} MatchingResult
 * @property {Object.<string, GroupMatches>} globalMatches - Keyword matches across entire resume
 * @property {Object.<string, Object.<string, SectionGroupMatch>>} sectionMatches - Keyword matches per section
 * @property {Object.<string, number>} keywordDensity - Density of keywords per group
 * @property {Object} actionVerbs - Action verb analysis
 * @property {number} actionVerbs.count - Number of action verbs found
 * @property {string[]} actionVerbs.verbs - List of action verbs found
 * @property {string[]} quantifiedAchievements - Patterns of quantified achievements found
 * @property {StuffingSignal[]} stuffingSignals - Detected keyword stuffing instances
 * @property {Object} meta - Metadata about the matching process
 */

/**
 * Cache for loaded keyword rules to avoid repeated file reads
 */
let cachedKeywordRules = null;

/**
 * Loads and caches keyword matching rules from JSON file
 * @param {string} rulesPath - Path to the keyword rules JSON file
 * @param {boolean} [forceReload=false] - Force reload even if cached
 * @returns {Object} Keyword matching rules configuration
 * @throws {Error} If rules file cannot be loaded or is invalid
 */
function loadKeywordRules(rulesPath, forceReload = false) {
  if (cachedKeywordRules && !forceReload) {
    return cachedKeywordRules;
  }

  try {
    const rulesContent = fs.readFileSync(rulesPath, "utf-8");
    const rules = JSON.parse(rulesContent);

    // Validate required structure
    validateRulesStructure(rules);

    cachedKeywordRules = rules;
    return rules;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Keyword rules file not found: ${rulesPath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in keyword rules file: ${error.message}`);
    }
    throw new Error(`Failed to load keyword rules: ${error.message}`);
  }
}

/**
 * Validates the structure of keyword rules
 * @param {Object} rules - Rules object to validate
 * @throws {Error} If validation fails
 */
function validateRulesStructure(rules) {
  const requiredFields = ["keywordGroups", "matchingConfig", "penalties", "meta"];

  for (const field of requiredFields) {
    if (!rules[field]) {
      throw new Error(`Invalid rules structure: missing required field '${field}'`);
    }
  }

  if (!Array.isArray(rules.keywordGroups)) {
    throw new Error("Invalid rules structure: keywordGroups must be an array");
  }

  if (rules.keywordGroups.length === 0) {
    throw new Error("Invalid rules structure: keywordGroups cannot be empty");
  }
}

/**
 * Validates input parameters for keyword matching
 * @param {ParsedResume} parsedResume - The parsed resume object
 * @param {SectionData} sectionData - The section data object
 * @throws {Error} If validation fails
 */
function validateInput(parsedResume, sectionData) {
  if (!parsedResume) {
    throw new Error("keywordMatcher: parsedResume is required");
  }

  if (!parsedResume.normalizedText || typeof parsedResume.normalizedText !== "string") {
    throw new Error("keywordMatcher: normalizedText must be a non-empty string");
  }

  if (parsedResume.normalizedText.trim().length === 0) {
    throw new Error("keywordMatcher: normalizedText cannot be empty");
  }

  if (!sectionData) {
    throw new Error("keywordMatcher: sectionData is required");
  }

  if (!Array.isArray(sectionData.sections)) {
    throw new Error("keywordMatcher: sectionData.sections must be an array");
  }

  // Validate section structure
  for (let i = 0; i < sectionData.sections.length; i++) {
    const section = sectionData.sections[i];
    if (!section.key || typeof section.key !== "string") {
      throw new Error(`keywordMatcher: section at index ${i} missing valid 'key' field`);
    }
    if (!Array.isArray(section.content)) {
      throw new Error(`keywordMatcher: section '${section.key}' must have 'content' array`);
    }
  }
}

/**
 * Escapes special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for use in regex
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Builds a regular expression for keyword matching based on config
 * @param {string} keyword - The keyword to match
 * @param {Object} config - Matching configuration
 * @param {boolean} config.enablePhraseMatching - Enable phrase matching
 * @param {boolean} config.allowPartialMatches - Allow partial word matches
 * @param {boolean} config.caseSensitive - Case sensitive matching
 * @returns {RegExp} Configured regular expression
 */
function buildKeywordRegex(keyword, config) {
  const escaped = escapeRegex(keyword);
  const flags = config.caseSensitive ? "g" : "gi";

  // For multi-word phrases
  if (config.enablePhraseMatching && keyword.includes(" ")) {
    return new RegExp(escaped, flags);
  }

  // For partial matches (e.g., "react" matches "react.js")
  if (config.allowPartialMatches) {
    return new RegExp(escaped, flags);
  }

  // For exact word boundary matches
  return new RegExp(`\\b${escaped}\\b`, flags);
}

/**
 * Prepares keyword groups by expanding synonyms and normalizing
 * @param {Array} keywordGroups - Raw keyword groups from rules
 * @param {Object} matchingConfig - Matching configuration
 * @returns {KeywordGroup[]} Prepared keyword groups
 */
function prepareKeywordGroups(keywordGroups, matchingConfig) {
  return keywordGroups.map((group) => {
    const keywordSet = new Set();

    // Add primary keywords
    group.keywords.forEach((keyword) => {
      keywordSet.add(keyword.toLowerCase());
    });

    // Add synonyms if enabled
    if (group.synonyms && matchingConfig.enableSynonyms) {
      Object.values(group.synonyms).forEach((synList) => {
        synList.forEach((synonym) => {
          keywordSet.add(synonym.toLowerCase());
        });
      });
    }

    return {
      group: group.group,
      roleCategory: group.roleCategory,
      subcategory: group.subcategory,
      importance: group.importance,
      weight: group.weight,
      required: group.required || false,
      keywords: Array.from(keywordSet),
    };
  });
}

/**
 * Performs global keyword matching across entire resume text
 * @param {string} text - Normalized resume text
 * @param {KeywordGroup[]} groups - Prepared keyword groups
 * @param {Object} matchingConfig - Matching configuration
 * @returns {{matches: Object.<string, GroupMatches>, repetitions: Object.<string, number>}}
 */
function performGlobalMatching(text, groups, matchingConfig) {
  const globalMatches = {};
  const repetitionMap = {};

  groups.forEach((group) => {
    globalMatches[group.group] = {
      matched: [],
      totalCount: 0,
      uniqueCount: 0,
      importance: group.importance,
    };

    group.keywords.forEach((keyword) => {
      const regex = buildKeywordRegex(keyword, matchingConfig);
      const matches = text.match(regex);

      if (matches && matches.length > 0) {
        globalMatches[group.group].matched.push(keyword);
        globalMatches[group.group].totalCount += matches.length;
        repetitionMap[keyword] = (repetitionMap[keyword] || 0) + matches.length;
      }
    });

    globalMatches[group.group].uniqueCount = globalMatches[group.group].matched.length;
  });

  return { matches: globalMatches, repetitions: repetitionMap };
}

/**
 * Performs section-wise keyword matching
 * @param {Section[]} sections - Array of resume sections
 * @param {KeywordGroup[]} groups - Prepared keyword groups
 * @param {Object} matchingConfig - Matching configuration
 * @returns {Object.<string, Object.<string, SectionGroupMatch>>} Section-wise matches
 */
function performSectionMatching(sections, groups, matchingConfig) {
  const sectionMatches = {};

  sections.forEach((section) => {
    const sectionText = section.content.join(" ").toLowerCase();
    sectionMatches[section.key] = {};

    groups.forEach((group) => {
      const matched = [];
      let count = 0;

      group.keywords.forEach((keyword) => {
        const regex = buildKeywordRegex(keyword, matchingConfig);
        const matches = sectionText.match(regex);

        if (matches && matches.length > 0) {
          matched.push(keyword);
          count += matches.length;
        }
      });

      if (count > 0) {
        sectionMatches[section.key][group.group] = {
          matched,
          count,
        };
      }
    });
  });

  return sectionMatches;
}

/**
 * Calculates keyword density for each group
 * @param {Object.<string, GroupMatches>} globalMatches - Global keyword matches
 * @param {number} totalTokens - Total number of tokens in resume
 * @returns {Object.<string, number>} Density per group
 */
function calculateKeywordDensity(globalMatches, totalTokens) {
  const density = {};

  Object.entries(globalMatches).forEach(([groupName, groupData]) => {
    density[groupName] = totalTokens > 0 ? groupData.totalCount / totalTokens : 0;
  });

  return density;
}

/**
 * Detects action verbs in the resume text
 * @param {string} text - Resume text
 * @param {KeywordGroup[]} groups - Prepared keyword groups
 * @param {Object} matchingConfig - Matching configuration
 * @returns {{count: number, verbs: string[]}} Action verb analysis
 */
function detectActionVerbs(text, groups, matchingConfig) {
  const actionVerbGroup = groups.find((g) => g.group === "action_verbs");

  if (!actionVerbGroup) {
    return { count: 0, verbs: [] };
  }

  const actionVerbsFound = new Set();

  actionVerbGroup.keywords.forEach((verb) => {
    const regex = buildKeywordRegex(verb, matchingConfig);
    const matches = text.match(regex);

    if (matches && matches.length > 0) {
      actionVerbsFound.add(verb);
    }
  });

  const verbs = Array.from(actionVerbsFound);
  return {
    count: verbs.length,
    verbs,
  };
}

/**
 * Detects quantified achievements using predefined patterns
 * @param {string} text - Resume text
 * @param {string[]} patterns - Regex patterns for quantified achievements
 * @returns {string[]} Matched patterns
 */
function detectQuantifiedAchievements(text, patterns) {
  if (!patterns || patterns.length === 0) {
    return [];
  }

  return patterns.filter((pattern) => {
    try {
      return new RegExp(pattern).test(text);
    } catch (error) {
      console.warn(`Invalid quantified achievement pattern: ${pattern}`);
      return false;
    }
  });
}

/**
 * Detects keyword stuffing based on repetition threshold
 * @param {Object.<string, number>} repetitionMap - Keyword repetition counts
 * @param {Object} penalties - Penalty configuration
 * @returns {StuffingSignal[]} Detected stuffing signals
 */
function detectKeywordStuffing(repetitionMap, penalties) {
  const stuffingSignals = [];

  if (!penalties.keywordStuffing.enabled) {
    return stuffingSignals;
  }

  const threshold = penalties.keywordStuffing.repeatThreshold;

  Object.entries(repetitionMap).forEach(([keyword, count]) => {
    if (count > threshold) {
      stuffingSignals.push({
        keyword,
        count,
        threshold,
      });
    }
  });

  return stuffingSignals;
}

/**
 * Main keyword matcher function
 * Performs comprehensive keyword analysis on a resume
 *
 * @param {Object} params - Matching parameters
 * @param {ParsedResume} params.parsedResume - The parsed resume to analyze
 * @param {SectionData} params.sectionData - Section-wise resume data
 * @param {string} [params.rulesPath] - Optional custom path to keyword rules file
 * @returns {MatchingResult} Comprehensive keyword matching results
 * @throws {Error} If input validation fails or rules cannot be loaded
 *
 * @example
 * const result = keywordMatcher({
 *   parsedResume: {
 *     normalizedText: "software engineer with react experience...",
 *     tokens: ["software", "engineer", "react", ...]
 *   },
 *   sectionData: {
 *     sections: [
 *       { key: "experience", content: ["Software Engineer at..."] },
 *       { key: "skills", content: ["React, Node.js, ..."] }
 *     ]
 *   }
 * });
 */
export const keywordMatcher = ({ parsedResume, sectionData, rulesPath }) => {
  // Validate input
  validateInput(parsedResume, sectionData);

  // Load keyword rules
  const defaultRulesPath = path.join(__dirname, "../rules/keyword.rules.json");
  const effectiveRulesPath = rulesPath || defaultRulesPath;
  const keywordRules = loadKeywordRules(effectiveRulesPath);

  // Extract data
  const text = parsedResume.normalizedText.toLowerCase();
  const tokens = parsedResume.tokens || [];

  // Prepare keyword groups
  const preparedGroups = prepareKeywordGroups(
    keywordRules.keywordGroups,
    keywordRules.matchingConfig,
  );

  // Perform global matching
  const { matches: globalMatches, repetitions: repetitionMap } = performGlobalMatching(
    text,
    preparedGroups,
    keywordRules.matchingConfig,
  );

  // Perform section-wise matching
  const sectionMatches = performSectionMatching(
    sectionData.sections,
    preparedGroups,
    keywordRules.matchingConfig,
  );

  // Calculate keyword density
  const keywordDensity = calculateKeywordDensity(globalMatches, tokens.length);

  // Detect action verbs
  const actionVerbs = detectActionVerbs(text, preparedGroups, keywordRules.matchingConfig);

  // Detect quantified achievements
  const quantifiedPatterns = keywordRules.bonuses?.quantifiedAchievements?.patterns || [];
  const quantifiedAchievements = detectQuantifiedAchievements(text, quantifiedPatterns);

  // Detect keyword stuffing
  const stuffingSignals = detectKeywordStuffing(repetitionMap, keywordRules.penalties);

  // Return comprehensive results
  return {
    globalMatches,
    sectionMatches,
    keywordDensity,
    actionVerbs,
    quantifiedAchievements,
    stuffingSignals,
    meta: {
      rulesVersion: keywordRules.meta?.version || "unknown",
      matchingConfig: keywordRules.matchingConfig,
      analyzer: "keywordMatcher",
      timestamp: new Date().toISOString(),
      totalTokens: tokens.length,
      totalGroups: preparedGroups.length,
      sectionsAnalyzed: sectionData.sections.length,
    },
  };
};

/**
 * Clears the cached keyword rules (useful for testing or rule updates)
 */
export function clearRulesCache() {
  cachedKeywordRules = null;
}

/**
 * Export helper functions for testing purposes
 */
export const testHelpers = {
  loadKeywordRules,
  validateInput,
  validateRulesStructure,
  escapeRegex,
  buildKeywordRegex,
  prepareKeywordGroups,
  performGlobalMatching,
  performSectionMatching,
  calculateKeywordDensity,
  detectActionVerbs,
  detectQuantifiedAchievements,
  detectKeywordStuffing,
  clearRulesCache,
};
