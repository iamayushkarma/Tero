import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sectionRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../rules/section.rules.json"), "utf-8"),
);

export const sectionDetector = ({ lines }) => {
  if (!Array.isArray(lines)) {
    throw new Error("sectionDetector: lines must be an array");
  }

  // 1. Prepare Section Configs
  const sectionConfigs = sectionRules.sections.map((section) => ({
    key: section.key,
    displayName: section.displayName,
    required: section.required,
    importance: section.importance,
    headingSet: new Set(section.headings.map((h) => h.toLowerCase().trim())),
  }));
  // 2. Normalize Heading
  const normalizeHeading = (line) => {
    return line
      .toLowerCase()
      .trim()
      .replace(/[:\-–—_•*]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // 3. Match Section Heading
  const matchSectionHeading = (line) => {
    const normalized = normalizeHeading(line);
    if (!normalized) return null;

    for (const section of sectionConfigs) {
      if (section.headingSet.has(normalized)) {
        return section.key;
      }
    }
    // example
    // matchSectionHeading("EXPERIENCE"); → "experience"
    // matchSectionHeading("Work Experience:"); → "experience"
    // matchSectionHeading("Employment History"); → "experience"
    // matchSectionHeading("EDUCATION")  → "education"
    // matchSectionHeading("Random Text"); → null
    // matchSectionHeading("Software Engineer"); → null

    return null;
  };

  // 4. Detection State
  const sectionContentMap = {};
  const sectionOrder = [];
  let currentSectionKey = null;

  // 5. Line by Line Detection
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const matchedKey = matchSectionHeading(line);

    if (matchedKey) {
      // New section detected
      if (!sectionContentMap[matchedKey]) {
        sectionContentMap[matchedKey] = [];
        sectionOrder.push(matchedKey);
      }
      currentSectionKey = matchedKey;
    } else if (currentSectionKey) {
      // Add content to current section
      sectionContentMap[currentSectionKey].push(line);
    }
  }

  // 6. Build Section Objects
  const sections = sectionConfigs.map((config) => {
    const content = sectionContentMap[config.key] || [];

    return {
      key: config.key,
      displayName: config.displayName,
      required: config.required,
      importance: config.importance,
      found: content.length > 0,
      content,
    };
  });

  // 7. Identify Missing Required Sections
  const detectedSections = sectionOrder;
  const missingRequiredSections = sectionConfigs
    .filter((config) => config.required && !sectionContentMap[config.key])
    .map((config) => config.key);

  // 8. Return Detection Results
  return {
    sections,
    detectedSections,
    missingRequiredSections,
    sectionOrder,
    meta: {
      rulesVersion: sectionRules.meta?.version || "unknown",
      targetAudience: sectionRules.meta?.targetAudience || "general",
    },
  };
};
