const resumeSectionKeywords = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "objective",
    "career objective",
    "about me",
    "about",
  ],
  skills: [
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "skills & tools",
    "technologies",
    "expertise",
    "competencies",
  ],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "employment history",
    "work history",
    "career history",
  ],
  projects: [
    "projects",
    "personal projects",
    "academic projects",
    "key projects",
    "portfolio",
    "work samples",
  ],
  education: [
    "education",
    "academic background",
    "qualifications",
    "academic",
    "degree",
    "university",
    "college",
  ],
  certifications: ["certifications", "certificates", "licenses", "credentials", "achievements"],
};

/**
 * Clean and normalize header text for comparison
 * Removes extra spaces, punctuation, and converts to lowercase
 */
function cleanHeaderText(lineOfText) {
  return lineOfText
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // Remove punctuation like :, •, -, etc.
    .replace(/\s+/g, " "); // Normalize multiple spaces to single space
}

/**
 * Check if a line is likely a section header
 * Returns section type or null
 */
function findSectionType(lineOfText) {
  const cleanedLine = cleanHeaderText(lineOfText);

  // Skip empty lines
  if (!cleanedLine) return null;

  // Check if line is short enough to be a header (typically < 50 chars)
  if (cleanedLine.length > 50) return null;

  // Try exact match first
  for (const [sectionName, keywordList] of Object.entries(resumeSectionKeywords)) {
    if (keywordList.includes(cleanedLine)) {
      return sectionName;
    }
  }

  // Try partial match (for cases like "my skills" or "technical skills list")
  for (const [sectionName, keywordList] of Object.entries(resumeSectionKeywords)) {
    for (const keyword of keywordList) {
      // Check if the cleaned line contains the keyword as a whole word
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(cleanedLine)) {
        return sectionName;
      }
    }
  }

  return null;
}

/**
 * Detect if line is all caps (likely a header)
 */
function isAllCapsLine(lineOfText) {
  const trimmed = lineOfText.trim();
  if (trimmed.length < 2) return false;

  // Remove non-letter characters for check
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length === 0) return false;

  return letters === letters.toUpperCase();
}

/**
 * Main section detection function
 */
export function detectSections(resumeLines = []) {
  const sectionsFound = {};

  // Initialize all sections
  Object.keys(resumeSectionKeywords).forEach((sectionName) => {
    sectionsFound[sectionName] = {
      found: false,
      lines: [],
      hasClearHeader: false,
    };
  });

  // Add contact section (detected differently)
  sectionsFound.contact = {
    found: false,
    lines: [],
    hasClearHeader: false,
  };

  let currentSectionBeingRead = null;
  let potentialContactInfo = [];

  // First pass: identify headers and content
  for (let i = 0; i < resumeLines.length; i++) {
    const lineOfText = resumeLines[i];
    const trimmedLine = lineOfText.trim();

    // Skip empty lines
    if (!trimmedLine) continue;

    // Check if this line is a section header
    const sectionType = findSectionType(lineOfText);

    if (sectionType) {
      // Found a section header!
      currentSectionBeingRead = sectionType;
      sectionsFound[currentSectionBeingRead].found = true;
      sectionsFound[currentSectionBeingRead].hasClearHeader = true;
      continue;
    }

    // Check if it's an all-caps line that might be a header we missed
    if (isAllCapsLine(trimmedLine) && trimmedLine.length < 30) {
      const possibleSection = findSectionType(trimmedLine);
      if (possibleSection) {
        currentSectionBeingRead = possibleSection;
        sectionsFound[currentSectionBeingRead].found = true;
        sectionsFound[currentSectionBeingRead].hasClearHeader = true;
        continue;
      }
    }

    // Store lines in current section or potential contact info
    if (currentSectionBeingRead) {
      sectionsFound[currentSectionBeingRead].lines.push(lineOfText);
    } else if (i < 10) {
      // First 10 lines without a section are likely contact info
      potentialContactInfo.push(lineOfText);
    }
  }

  // Second pass: Detect contact information
  const fullText = resumeLines.join("\n");
  const contactPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/,
    linkedin: /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i,
    github: /github\.com\/[a-zA-Z0-9_-]+/i,
    portfolio: /\b(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.(com|dev|io|net|org)\b/i,
  };

  const hasEmail = contactPatterns.email.test(fullText);
  const hasPhone = contactPatterns.phone.test(fullText);
  const hasLinkedIn = contactPatterns.linkedin.test(fullText);
  const hasGitHub = contactPatterns.github.test(fullText);
  const hasPortfolio = contactPatterns.portfolio.test(fullText);

  if (hasEmail || hasPhone || hasLinkedIn || hasGitHub) {
    sectionsFound.contact.found = true;
    sectionsFound.contact.lines = potentialContactInfo;
  }

  // Third pass: Handle "Projects as Experience" for students/juniors
  // If experience section is missing but projects exist, mark experience as found
  if (!sectionsFound.experience.found && sectionsFound.projects.found) {
    sectionsFound.experience.found = true;
    sectionsFound.experience.lines = [...sectionsFound.projects.lines];
  }

  return sectionsFound;
}

/**
 * Enhanced metrics extraction
 */
export function extractMetrics(resumeLines = [], sectionsData = {}) {
  const fullText = resumeLines.join("\n");

  const metrics = {
    // Basic counts
    totalWordCount: fullText.split(/\s+/).filter((w) => w.length > 0).length,

    // Contact information
    containsEmail: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(fullText),
    containsPhoneNumber: /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/.test(
      fullText,
    ),
    hasLinkedIn: /linkedin\.com/i.test(fullText),
    hasGitHub: /github\.com/i.test(fullText),
    hasPortfolioLink: /\.(com|dev|io|net|org)\b/i.test(fullText),
    hasLocation: /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/.test(fullText),

    // Skills analysis
    totalSkillsListed: extractSkillCount(sectionsData.skills?.lines || []),
    skillsCategorized: detectSkillCategorization(sectionsData.skills?.lines || []),
    hardSkillsCount: countTechnicalSkills(fullText),
    softSkillsCount: countSoftSkills(fullText),

    // Experience/Projects quality
    hasJobTitles: /\b(developer|engineer|intern|analyst|designer|manager|lead)\b/i.test(fullText),
    hasCompanyNames: detectCompanyNames(fullText, sectionsData),
    hasDates: /\b(20\d{2}|19\d{2})\b/.test(fullText),
    datesFormatted: /\b(20\d{2})\s*[-–—]\s*(20\d{2}|present|current)\b/i.test(fullText),

    experienceUsesStrongActionVerbs: checkActionVerbs(fullText),
    experienceHasQuantifiableResults: /\d+%|\d+x|improved by|increased by|reduced by|\d+\+/i.test(
      fullText,
    ),

    // Full text for keyword matching
    resumeText: fullText,
  };

  return metrics;
}

/**
 * Helper: Count skills in skills section
 */
function extractSkillCount(skillLines) {
  if (!skillLines || skillLines.length === 0) return 0;

  const skillText = skillLines.join(" ");

  // Count comma-separated items and newline-separated items
  const items = skillText
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && s.length < 50);

  return items.length;
}

/**
 * Helper: Check if skills are categorized
 */
function detectSkillCategorization(skillLines) {
  const skillText = skillLines.join("\n");
  const categoryPatterns = [
    /frontend:/i,
    /backend:/i,
    /languages:/i,
    /frameworks:/i,
    /tools:/i,
    /databases:/i,
    /technical skills:/i,
    /soft skills:/i,
  ];

  return categoryPatterns.some((pattern) => pattern.test(skillText));
}

/**
 * Helper: Count technical/hard skills
 */
function countTechnicalSkills(text) {
  const technicalSkills = [
    "react",
    "vue",
    "angular",
    "javascript",
    "typescript",
    "python",
    "java",
    "node",
    "express",
    "mongodb",
    "sql",
    "postgresql",
    "firebase",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "html",
    "css",
    "tailwind",
    "next.js",
    "redux",
    "graphql",
    "rest api",
    "ci/cd",
    "webpack",
    "vite",
    "figma",
  ];

  const lowerText = text.toLowerCase();
  let count = 0;

  technicalSkills.forEach((skill) => {
    if (lowerText.includes(skill)) count++;
  });

  return count;
}

/**
 * Helper: Count soft skills
 */
function countSoftSkills(text) {
  const softSkills = [
    "problem-solving",
    "communication",
    "teamwork",
    "collaboration",
    "leadership",
    "agile",
    "scrum",
    "time management",
    "critical thinking",
  ];

  const lowerText = text.toLowerCase();
  let count = 0;

  softSkills.forEach((skill) => {
    if (lowerText.includes(skill)) count++;
  });

  return count;
}

/**
 * Helper: Detect company names or project names
 */
function detectCompanyNames(text, sectionsData) {
  // Check if there are proper company names or substantial project descriptions
  const experienceLines = sectionsData.experience?.lines || [];
  const projectLines = sectionsData.projects?.lines || [];

  // If we have multiple projects with descriptions, that counts
  if (projectLines.length > 5) return true;

  // Look for company name patterns
  return /\b(Inc\.|LLC|Ltd\.|Corp\.|Company|Technologies)\b/i.test(text);
}

/**
 * Helper: Check for strong action verbs
 */
function checkActionVerbs(text) {
  const actionVerbs = [
    "built",
    "developed",
    "created",
    "implemented",
    "designed",
    "managed",
    "led",
    "improved",
    "increased",
    "reduced",
    "achieved",
    "delivered",
    "launched",
    "optimized",
    "integrated",
    "architected",
    "engineered",
    "established",
    "spearheaded",
    "executed",
  ];

  const lowerText = text.toLowerCase();
  let count = 0;

  actionVerbs.forEach((verb) => {
    if (lowerText.includes(verb)) count++;
  });

  // If we found at least 3 different action verbs, that's good
  return count >= 3;
}
