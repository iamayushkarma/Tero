const resumeSectionKeywords = {
  summary: ["summary", "professional summary", "profile", "objective", "career objective"],
  skills: [
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "skills & tools",
    "technologies",
  ],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "employment history",
  ],
  projects: ["projects", "personal projects", "academic projects", "key projects"],
  education: ["education", "academic background", "qualifications"],
  certifications: ["certifications", "certificates", "licenses"],
};

function cleanHeaderText(lineOfText) {
  // Take text like " EXPERIENCE "
  // Make it "experience" (lowercase + no spaces)
  return lineOfText.toLowerCase().trim();
}

function findSectionType(lineOfText) {
  const cleanedLine = cleanHeaderText(lineOfText);
  for (const [sectionName, keywordList] of Object.entries(resumeSectionKeywords)) {
    // Example: sectionName = "experience"
    // keywordList = ["experience", "work experience", ...]
    if (keywordList.includes(cleanedLine)) {
      return sectionName; // Return "experience", "skills", etc.
    }
  }
  return null;
}

export function detectSections(resumeLines = []) {
  const sectionsFound = {};

  Object.keys(resumeSectionKeywords).forEach((sectionName) => {
    sectionsFound[sectionName] = {
      found: false, // Did we find this section?
      lines: [], // Store the text under this section
    };
  });

  // Track which section we're currently reading
  let currentSectionBeingRead = null;

  for (const lineOfText of resumeLines) {
    const sectionType = findSectionType(lineOfText);
    if (sectionType) {
      // This line is a header! Like "WORK EXPERIENCE"
      currentSectionBeingRead = sectionType;
      sectionsFound[currentSectionBeingRead].found = true;
      continue;
    }
    if (currentSectionBeingRead) {
      sectionsFound[currentSectionBeingRead].lines.push(lineOfText);
    }
  }
  return sectionsFound;
}
