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

// prepareKeywordGroups
function prepareKeywordGroups(keywordGroups, matchingConfig) {
  return keywordGroups.map((group) => {
    // Only store PRIMARY keywords (not synonyms yet)
    const primaryKeywords = group.keywords.map((k) => k.toLowerCase());

    // Store synonyms separately for later matching
    const synonymMap = {};
    if (group.synonyms && matchingConfig.enableSynonyms) {
      Object.entries(group.synonyms).forEach(([primary, synList]) => {
        synonymMap[primary.toLowerCase()] = synList.map((s) => s.toLowerCase());
      });
    }

    return {
      group: group.group,
      roleCategory: group.roleCategory,
      subcategory: group.subcategory,
      importance: group.importance,
      weight: group.weight,
      required: group.required || false,
      keywords: primaryKeywords,
      synonyms: synonymMap,
    };
  });
}

// performGlobalMatching
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

    const matchedConcepts = new Set(); // Track unique concepts

    // For each primary keyword
    group.keywords.forEach((primaryKeyword) => {
      // Build list of variations to search (primary + synonyms)
      const variations = [primaryKeyword];

      if (group.synonyms && group.synonyms[primaryKeyword]) {
        variations.push(...group.synonyms[primaryKeyword]);
      }

      let conceptMatched = false;
      let conceptTotalCount = 0;

      // Search for any variation
      variations.forEach((variation) => {
        const regex = buildKeywordRegex(variation, matchingConfig);
        const matches = text.match(regex);

        if (matches && matches.length > 0) {
          conceptMatched = true;
          conceptTotalCount += matches.length;
          repetitionMap[variation] = (repetitionMap[variation] || 0) + matches.length;
        }
      });

      // Only count the CONCEPT once (not each synonym)
      if (conceptMatched && !matchedConcepts.has(primaryKeyword)) {
        matchedConcepts.add(primaryKeyword);
        globalMatches[group.group].matched.push(primaryKeyword);
        globalMatches[group.group].uniqueCount++;
        globalMatches[group.group].totalCount += conceptTotalCount;
      }
    });
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
      const matchedConcepts = new Set();

      // For each primary keyword
      group.keywords.forEach((primaryKeyword) => {
        // Build list of variations
        const variations = [primaryKeyword];
        if (group.synonyms && group.synonyms[primaryKeyword]) {
          variations.push(...group.synonyms[primaryKeyword]);
        }

        let conceptMatched = false;
        let conceptCount = 0;

        // Search for any variation
        variations.forEach((variation) => {
          const regex = buildKeywordRegex(variation, matchingConfig);
          const matches = sectionText.match(regex);

          if (matches && matches.length > 0) {
            conceptMatched = true;
            conceptCount += matches.length;
          }
        });

        // Only count concept once
        if (conceptMatched && !matchedConcepts.has(primaryKeyword)) {
          matchedConcepts.add(primaryKeyword);
          matched.push(primaryKeyword);
          count += conceptCount;
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
  if (!text || !Array.isArray(patterns) || patterns.length === 0) {
    return { count: 0, matches: [] };
  }

  const matches = [];

  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, "gi");
      const found = text.match(regex);
      if (found && found.length) matches.push(...found);
    } catch {
      // ignore invalid regex
    }
  }

  const uniqueMatches = Array.from(new Set(matches.map((m) => String(m).trim()).filter(Boolean)));

  return {
    count: uniqueMatches.length,
    matches: uniqueMatches.slice(0, 50),
  };
}

function detectKeywordStuffing(repetitionMap, penalties) {
  const stuffingSignals = [];

  if (!penalties.keywordStuffing.enabled) {
    return stuffingSignals;
  }

  const threshold = penalties.keywordStuffing.repeatThreshold;

  Object.entries(repetitionMap).forEach(([keyword, count]) => {
    // Skip short keywords (<=2 chars) as they often match as substrings
    if (keyword.length <= 2) {
      return;
    }
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

// calculateSkillsData
function calculateSkillsData(globalMatches, preparedGroups) {
  const skillGroups = [
    "programming_languages",
    "frontend_frameworks",
    "backend_frameworks",
    "databases",
    "cloud_platforms",
    "devops_tools",
    "mobile_development",
    "testing_qa",
    "data_science_ml",
    "cybersecurity",
  ];

  const matchedSkills = [];
  let totalExpectedSkills = 0;

  // Calculate total expected skills from rules
  preparedGroups.forEach((group) => {
    if (skillGroups.includes(group.group)) {
      // Count primary keywords only (reasonable cap per category)
      const primarySkills = group.keywords.slice(0, 10);
      totalExpectedSkills += primarySkills.length;
    }
  });

  // Count matched skills
  Object.entries(globalMatches).forEach(([groupName, groupData]) => {
    if (skillGroups.includes(groupName) && groupData.uniqueCount > 0) {
      groupData.matched.forEach((skill) => {
        matchedSkills.push({
          name: skill,
          category: groupName,
          group: groupName,
        });
      });
    }
  });

  // Remove duplicates based on normalized skill name
  const uniqueMatchedSkills = [];
  const seen = new Set();

  matchedSkills.forEach((skill) => {
    const normalized = skill.name
      .toLowerCase()
      .replace(/\..*$/, "") // Remove extensions
      .replace(/^.*\//, "") // Remove paths
      .replace(/[^a-z0-9]/g, ""); // Remove special chars

    if (!seen.has(normalized) && normalized.length > 1) {
      seen.add(normalized);
      uniqueMatchedSkills.push(skill);
    }
  });

  return {
    matchedSkills: uniqueMatchedSkills,
    totalSkills: Math.max(totalExpectedSkills, 25), // Realistic minimum
  };
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

  // Prepare keyword groups (with synonyms stored separately)
  const preparedGroups = prepareKeywordGroups(
    keywordRules.keywordGroups,
    keywordRules.matchingConfig,
  );

  // Perform global matching (counts concepts, not synonym variations)
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
  // ✅ Build experience-only text
  const expSection = sectionData.sections.find((s) => s.key === "experience");
  const experienceText = expSection?.found ? expSection.content.join(" ").toLowerCase() : "";

  // ✅ Detect experience-only action verbs
  const experienceActionVerbs = experienceText
    ? detectActionVerbs(experienceText, preparedGroups, keywordRules.matchingConfig)
    : { count: 0, verbs: [] };

  // ✅ Detect experience-only quantified metrics
  const quantifiedPatterns = keywordRules.bonuses?.quantifiedAchievements?.patterns || [];
  const experienceQuantified = experienceText
    ? detectQuantifiedAchievements(experienceText, quantifiedPatterns)
    : { count: 0, matches: [] };

  // Calculate keyword density
  const keywordDensity = calculateKeywordDensity(globalMatches, tokens.length);

  // Detect action verbs
  const actionVerbs = detectActionVerbs(text, preparedGroups, keywordRules.matchingConfig);
  // const quantifiedPatterns = keywordRules.bonuses?.quantifiedAchievements?.patterns || [];
  const quantified = detectQuantifiedAchievements(text, quantifiedPatterns);

  // Detect keyword stuffing
  const stuffingSignals = detectKeywordStuffing(repetitionMap, keywordRules.penalties);

  // Calculate skills data for scoring
  const skillsData = calculateSkillsData(globalMatches, preparedGroups);

  // Return comprehensive results
  return {
    globalMatches,
    sectionMatches,
    keywordDensity,
    actionVerbs,
    // quantifiedAchievements,
    experienceActionVerbs,
    experienceQuantifiedAchievements: experienceQuantified.matches,
    experienceQuantifiedCount: experienceQuantified.count,
    quantifiedAchievements: quantified.matches,
    quantifiedCount: quantified.count,
    stuffingSignals,
    matchedSkills: skillsData.matchedSkills,
    totalSkills: skillsData.totalSkills,
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
export function clearRulesCache() {
  cachedKeywordRules = null;
}
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
  calculateSkillsData,
  clearRulesCache,
};
