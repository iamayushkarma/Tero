import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formattingRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../rules/formatting.rules.json"), "utf-8"),
);

export const formattingAnalyzer = ({ parsedResume }) => {
  if (!parsedResume?.cleanText || !Array.isArray(parsedResume.lines)) {
    throw new Error("formattingAnalyzer: cleanText and lines are required");
  }

  const text = parsedResume.cleanText;
  const lines = parsedResume.lines.map((l) => l.text || l);

  const layoutSignals = {
    multiColumnSuspected: detectMultiColumn(lines),
    tablesSuspected: detectTables(lines),
    imagesOrIconsSuspected: detectIcons(text),
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
  const ruleFindings = [];

  if (!formattingRules.atsCompatibility.allowMultiColumn && layoutSignals.multiColumnSuspected) {
    ruleFindings.push("multiColumnLayout");
  }

  if (!formattingRules.atsCompatibility.allowTables && layoutSignals.tablesSuspected) {
    ruleFindings.push("tablesUsed");
  }

  if (!formattingRules.atsCompatibility.allowImages && layoutSignals.imagesOrIconsSuspected) {
    ruleFindings.push("imagesOrIconsUsed");
  }

  if (
    formattingRules.structureRules.maxPages &&
    structureSignals.pageLengthEstimate > formattingRules.structureRules.maxPages
  ) {
    ruleFindings.push("tooManyPages");
  }
  return {
    layoutSignals,
    fontSignals,
    structureSignals,
    ruleFindings,
    meta: {
      rulesVersion: formattingRules.meta?.version || "unknown",
      analyzer: "formattingAnalyzer",
    },
  };
};
function detectMultiColumn(lines) {
  let alignedSeparators = 0;

  lines.forEach((line) => {
    if (/\s{4,}\S+\s{4,}\S+/.test(line)) {
      alignedSeparators++;
    }
  });

  return alignedSeparators >= 3;
}

function detectTables(lines) {
  let tableLikeLines = 0;

  lines.forEach((line) => {
    if (/\|.+\|/.test(line) || /\t{2,}/.test(line)) {
      tableLikeLines++;
    }
  });

  return tableLikeLines >= 2;
}

function detectIcons(text) {
  return /[✓✔✕✖★☆→►▪●○◆]/.test(text);
}

function detectAllCaps(lines) {
  const capsLines = lines.filter(
    (line) => line.length > 10 && line === line.toUpperCase() && /[A-Z]/.test(line),
  );

  return capsLines.length >= 3;
}

function detectExcessiveWhitespace(text) {
  return /\n{3,}/.test(text);
}

function detectBulletConsistency(lines) {
  const bulletTypes = new Set();

  lines.forEach((line) => {
    const match = line.match(/^[\s]*([•\-*▪►])\s+/);
    if (match) bulletTypes.add(match[1]);
  });

  return bulletTypes.size <= 1;
}

function detectLineSpacing(text) {
  const blankLines = text.split("\n").filter((l) => l.trim() === "").length;
  return blankLines > text.split("\n").length * 0.3;
}

function estimatePages(lines) {
  // Rough ATS-safe estimate: 45–50 lines per page
  return Math.ceil(lines.length / 48);
}
