import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keywordRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../rules/keyword.rules.json"), "utf-8"),
);

export const keywordMatcher = ({ parsedResume, sectionData }) => {
  if (!parsedResume?.normalizedText) {
    throw new Error("keywordMatcher: normalizedText is required");
  }

  if (!Array.isArray(sectionData?.sections)) {
    throw new Error("keywordMatcher: section data required");
  }

  const text = parsedResume.normalizedText;
  const tokens = parsedResume.tokens || [];

  // 1. Prepare Keyword Groups
  const groups = keywordRules.keywordGroups.map((group) => {
    const keywordSet = new Set();

    group.keywords.forEach((k) => keywordSet.add(k.toLowerCase()));

    if (group.synonyms && keywordRules.matchingConfig.enableSynonyms) {
      Object.values(group.synonyms).forEach((synList) => {
        synList.forEach((s) => keywordSet.add(s.toLowerCase()));
      });
    }

    return {
      group: group.group,
      roleCategory: group.roleCategory,
      subcategory: group.subcategory,
      importance: group.importance,
      weight: group.weight,
      required: group.required,
      keywords: [...keywordSet],
    };
  });

  //  2. Global Keyword Matching
  const globalMatches = {};
  const repetitionMap = {};

  groups.forEach((group) => {
    globalMatches[group.group] = {
      matched: [],
      totalCount: 0,
      uniqueCount: 0,
    };

    group.keywords.forEach((keyword) => {
      const regex = buildRegex(keyword, keywordRules.matchingConfig);
      const matches = text.match(regex);

      if (matches) {
        globalMatches[group.group].matched.push(keyword);
        globalMatches[group.group].totalCount += matches.length;
        repetitionMap[keyword] = matches.length;
      }
    });

    globalMatches[group.group].uniqueCount = globalMatches[group.group].matched.length;
  });

  // 3. Section-wise Matching
  const sectionMatches = {};

  sectionData.sections.forEach((section) => {
    const sectionText = section.content.join(" ").toLowerCase();
    sectionMatches[section.key] = {};

    groups.forEach((group) => {
      let count = 0;
      const matched = [];

      group.keywords.forEach((keyword) => {
        const regex = buildRegex(keyword, keywordRules.matchingConfig);
        const matches = sectionText.match(regex);

        if (matches) {
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

  //  4. Keyword Density
  const density = {};

  Object.keys(globalMatches).forEach((group) => {
    const count = globalMatches[group].totalCount;
    density[group] = tokens.length ? count / tokens.length : 0;
  });

  // 5. Action Verb Detection
  const actionVerbGroup = groups.find((g) => g.group === "action_verbs");
  const actionVerbsFound = [];

  if (actionVerbGroup) {
    actionVerbGroup.keywords.forEach((verb) => {
      const regex = new RegExp(`\\b${escape(verb)}\\b`, "gi");
      if (text.match(regex)) actionVerbsFound.push(verb);
    });
  }

  // 6. Quantified Achievements
  const quantifiedPatterns = keywordRules.bonuses?.quantifiedAchievements?.patterns || [];

  const quantifiedAchievements = quantifiedPatterns.filter((pattern) =>
    new RegExp(pattern).test(text),
  );

  // 7. Keyword Stuffing Signals
  const stuffingSignals = [];

  if (keywordRules.penalties.keywordStuffing.enabled) {
    const threshold = keywordRules.penalties.keywordStuffing.repeatThreshold;

    Object.entries(repetitionMap).forEach(([keyword, count]) => {
      if (count > threshold) {
        stuffingSignals.push({
          keyword,
          count,
          threshold,
        });
      }
    });
  }

  // Final Output

  return {
    globalMatches,
    sectionMatches,
    keywordDensity: density,
    actionVerbs: {
      count: actionVerbsFound.length,
      verbs: actionVerbsFound,
    },
    quantifiedAchievements,
    stuffingSignals,
    meta: {
      rulesVersion: keywordRules.meta.version,
      matchingConfig: keywordRules.matchingConfig,
    },
  };
};

// Helpers
function buildRegex(keyword, config) {
  const escaped = escape(keyword);

  if (config.enablePhraseMatching && keyword.includes(" ")) {
    return new RegExp(escaped, "gi");
  }

  if (config.allowPartialMatches) {
    return new RegExp(escaped, "gi");
  }

  return new RegExp(`\\b${escaped}\\b`, "gi");
}

function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
