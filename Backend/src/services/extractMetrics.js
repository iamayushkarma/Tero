const VALID_EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;
const VALID_PHONE_PATTERN = /(\+?\d{1,3}[\s-]?)?\d{10}/;
const LINKEDIN_PATTERN = /linkedin\.com\/in\//i;
const GITHUB_PATTERN = /github\.com\//i;
const PORTFOLIO_PATTERN = /https?:\/\/(www\.)?[\w\-\.]+\.\w{2,}/;

const STRONG_ACTION_VERBS = [
  "built",
  "developed",
  "designed",
  "implemented",
  "created",
  "improved",
  "optimized",
  "led",
  "managed",
  "collaborated",
  "analyzed",
  "maintained",
  "achieved",
  "delivered",
  "launched",
  "increased",
  "reduced",
  "established",
  "executed",
  "facilitated",
  "generated",
  "initiated",
  "integrated",
  "orchestrated",
  "resolved",
  "streamlined",
  "transformed",
  "spearheaded",
  "drove",
];

export function extractResumeMetrics({ normalizedText = "", normalizedLines = [], sections = {} }) {
  // Count basic text statistics
  const totalWordCount = normalizedText.length > 0 ? normalizedText.split(/\s+/).length : 0;
  const totalLineCount = normalizedLines.length;

  // Check contact information
  const containsEmail = VALID_EMAIL_PATTERN.test(normalizedText);
  const containsPhoneNumber = VALID_PHONE_PATTERN.test(normalizedText);
  const hasLinkedIn = LINKEDIN_PATTERN.test(normalizedText);
  const hasGitHub = GITHUB_PATTERN.test(normalizedText);
  const hasPortfolioLink = PORTFOLIO_PATTERN.test(normalizedText);

  // Count bullet points (ATS systems prefer bullet points for readability)
  const BULLET_PATTERNS = ["-", "•", "*", "◦", "▪", "–", ">"];
  const totalBulletPoints = normalizedLines.filter((line) =>
    BULLET_PATTERNS.some((bullet) => line.trim().startsWith(bullet)),
  ).length;

  // Analyze skills section (Count how many skills are listed)
  let totalSkillsListed = 0;

  if (sections.skills?.found) {
    // Skills are usually comma or pipe-separated
    const skillsText = sections.skills.lines.join(" ");

    totalSkillsListed = skillsText
      .split(/[,|]/) // Split by comma or pipe
      .map((skill) => skill.trim()) // Remove whitespace
      .filter((skill) => skill.length > 0).length; // Remove empty strings
  }
  // Analyze experience section quality

  let experienceHasQuantifiableResults = false;
  let experienceUsesStrongActionVerbs = false;

  if (sections.experience?.found) {
    const experienceContent = sections.experience.lines.join(" ").toLowerCase();

    // Check if experience mentions numbers (e.g., "increased sales by 30%")
    experienceHasQuantifiableResults = /\d+/.test(experienceContent);

    // Check if experience uses strong action verbs
    experienceUsesStrongActionVerbs = STRONG_ACTION_VERBS.some((verb) => {
      const wordBoundaryPattern = new RegExp(`\\b${verb}\\b`, "i");
      return wordBoundaryPattern.test(experienceContent);
    });
  }

  return {
    totalWordCount,
    totalLineCount,
    totalSkillsListed,
    totalBulletPoints,
    containsEmail,
    containsPhoneNumber,
    hasLinkedIn,
    hasGitHub,
    hasPortfolioLink,
    experienceHasQuantifiableResults,
    experienceUsesStrongActionVerbs,
  };
}
