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

let cachedKeywordRules = null;
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
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

function calculateKeywordDensity(globalMatches, totalTokens) {
  const density = {};

  Object.entries(globalMatches).forEach(([groupName, groupData]) => {
    density[groupName] = totalTokens > 0 ? groupData.totalCount / totalTokens : 0;
  });

  return density;
}

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
