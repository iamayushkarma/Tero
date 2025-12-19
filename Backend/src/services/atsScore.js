export function calculateATSScore({
  sections = {},
  metrics = {},
  jobDescription = null,
  formatting = {},
}) {
  let score = 0;
  const strengths = [];
  const penalties = [];
  const breakdown = {
    keywordMatch: 0, // 30 points -
    formatting: 0, // 15 points
    sections: 0, // 20 points
    skills: 0, // 15 points
    experience: 0, // 15 points
    contact: 0, // 5 points
  };

  // 1. KEYWORD MATCHING (30 points)
  if (jobDescription && metrics.resumeText) {
    const keywordScore = calculateKeywordMatch(metrics.resumeText, jobDescription);
    breakdown.keywordMatch = Math.round(keywordScore * 30);

    if (keywordScore >= 0.7) {
      strengths.push("Excellent keyword alignment with job description");
    } else if (keywordScore >= 0.5) {
      strengths.push("Good keyword match");
    } else if (keywordScore >= 0.3) {
      penalties.push("Moderate keyword match - add more relevant terms");
    } else {
      penalties.push("Low keyword match - tailor resume to job description");
    }
  } else {
    // If no job description provided, give partial credit
    breakdown.keywordMatch = 15;
    penalties.push("No job description provided for keyword analysis");
  }

  // 2. FORMATTING & PARSEABILITY (15 points)
  let formatScore = 15;

  // Length check
  if (metrics.totalWordCount >= 300 && metrics.totalWordCount <= 800) {
    strengths.push("Optimal resume length for ATS");
  } else if (metrics.totalWordCount < 300) {
    formatScore -= 3;
    penalties.push("Resume too short - add more detail");
  } else if (metrics.totalWordCount > 900) {
    formatScore -= 2;
    penalties.push("Resume too long - may be truncated by ATS");
  }

  // File format warnings
  if (formatting.hasMultipleColumns) {
    formatScore -= 4;
    penalties.push("Multiple columns may confuse ATS parsers");
  }

  if (formatting.hasTextBoxes || formatting.hasImages) {
    formatScore -= 4;
    penalties.push("Text boxes and images are not ATS-friendly");
  }

  if (formatting.hasHeaderFooter) {
    formatScore -= 2;
    penalties.push("Header/footer content may not be parsed correctly");
  }

  if (formatting.hasTables) {
    formatScore -= 3;
    penalties.push("Tables can cause parsing issues in ATS");
  }

  // Standard fonts and simple formatting
  if (formatting.usesStandardFonts) {
    strengths.push("Uses ATS-friendly fonts");
  }

  breakdown.formatting = Math.max(formatScore, 0);

  // 3. SECTION PRESENCE & STRUCTURE (20 points)
  const REQUIRED_SECTIONS = {
    contact: 3,
    experience: 6,
    education: 5,
    skills: 6,
  };

  let sectionScore = 0;

  Object.entries(REQUIRED_SECTIONS).forEach(([section, points]) => {
    if (sections[section]?.found) {
      sectionScore += points;

      // Check for clear section headers
      if (sections[section]?.hasClearHeader) {
        sectionScore += 0.5;
      }
    } else {
      penalties.push(`Missing critical "${section}" section`);
    }
  });

  // Optional but recommended sections
  if (sections.summary?.found) {
    sectionScore += 1;
    strengths.push("Professional summary included");
  }

  if (sections.projects?.found) {
    sectionScore += 1;
    strengths.push("Projects section strengthens technical profile");
  }

  if (sections.certifications?.found) {
    sectionScore += 1;
    strengths.push("Certifications add credibility");
  }

  breakdown.sections = Math.min(sectionScore, 20);

  // 4. SKILLS SECTION (15 points)
  let skillScore = 0;

  if (metrics.totalSkillsListed >= 10 && metrics.totalSkillsListed <= 20) {
    skillScore = 15;
    strengths.push("Comprehensive skills section");
  } else if (metrics.totalSkillsListed >= 6 && metrics.totalSkillsListed <= 25) {
    skillScore = 12;
    strengths.push("Good skills coverage");
  } else if (metrics.totalSkillsListed >= 3) {
    skillScore = 7;
    penalties.push("Skills section needs expansion");
  } else {
    skillScore = 2;
    penalties.push("Very limited skills listed");
  }

  // Hard skills vs soft skills balance
  if (metrics.hardSkillsCount >= metrics.softSkillsCount * 2) {
    strengths.push("Strong emphasis on hard/technical skills");
  }

  // Skills categorization
  if (metrics.skillsCategorized) {
    skillScore += 1;
    strengths.push("Well-organized skills section");
  }

  breakdown.skills = Math.min(skillScore, 15);

  // 5. EXPERIENCE QUALITY (15 points)
  let experienceScore = 0;

  if (!sections.experience?.found) {
    penalties.push("Experience section is critical for ATS");
    breakdown.experience = 0;
  } else {
    experienceScore = 5; // Base points for having section

    // Job titles present
    if (metrics.hasJobTitles) {
      experienceScore += 2;
    } else {
      penalties.push("Job titles missing or unclear");
    }

    // Company names present
    if (metrics.hasCompanyNames) {
      experienceScore += 2;
    } else {
      penalties.push("Company names missing");
    }

    // Dates present and formatted correctly
    if (metrics.hasDates && metrics.datesFormatted) {
      experienceScore += 2;
    } else {
      penalties.push("Employment dates missing or poorly formatted");
    }

    // Action verbs
    if (metrics.experienceUsesStrongActionVerbs) {
      experienceScore += 2;
      strengths.push("Strong action verbs used");
    } else {
      penalties.push("Use more impactful action verbs");
    }

    // Quantifiable results
    if (metrics.experienceHasQuantifiableResults) {
      experienceScore += 2;
      strengths.push("Results-driven experience descriptions");
    } else {
      penalties.push("Add metrics and quantifiable achievements");
    }

    breakdown.experience = Math.min(experienceScore, 15);
  }

  // 6. CONTACT INFORMATION (5 points)
  let contactScore = 0;

  if (metrics.containsEmail) {
    contactScore += 2;
  } else {
    penalties.push("Email address required");
  }

  if (metrics.containsPhoneNumber) {
    contactScore += 1;
  } else {
    penalties.push("Phone number recommended");
  }

  if (metrics.hasLocation) {
    contactScore += 1;
    strengths.push("Location information included");
  }

  if (metrics.hasLinkedIn) {
    contactScore += 0.5;
  }

  if (metrics.hasGitHub || metrics.hasPortfolioLink) {
    contactScore += 0.5;
  }

  breakdown.contact = Math.min(contactScore, 5);

  // FINAL SCORE CALCULATION
  score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  score = Math.min(Math.max(Math.round(score), 0), 100);

  // Generate recommendations based on score
  const recommendations = generateRecommendations(score, penalties);

  return {
    score,
    grade: getGrade(score),
    strengths,
    penalties,
    recommendations,
    breakdown,
    details: {
      totalPossible: 100,
      keywordMatchWeight: "30%",
      formattingWeight: "15%",
      sectionsWeight: "20%",
      skillsWeight: "15%",
      experienceWeight: "15%",
      contactWeight: "5%",
    },
  };
}

// HELPER FUNCTIONS

function calculateKeywordMatch(resumeText, jobDescription) {
  // Extract keywords from job description
  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  let matchCount = 0;
  let totalWeight = 0;

  jdKeywords.forEach(({ word, weight }) => {
    totalWeight += weight;
    if (resumeKeywords.some((rk) => rk.word.toLowerCase() === word.toLowerCase())) {
      matchCount += weight;
    }
  });

  return totalWeight > 0 ? matchCount / totalWeight : 0;
}

function extractKeywords(text) {
  // Simple keyword extraction (in production, use NLP library)
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !commonWords.has(w));

  // Count frequency
  const frequency = {};
  words.forEach((w) => {
    frequency[w] = (frequency[w] || 0) + 1;
  });

  // Convert to weighted keywords
  return Object.entries(frequency)
    .map(([word, count]) => ({
      word,
      weight: Math.min(count, 3), // Cap weight at 3
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 50); // Top 50 keywords
}

function getGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function generateRecommendations(score, penalties) {
  const recommendations = [];

  if (score < 70) {
    recommendations.push("Focus on tailoring resume to specific job descriptions");
  }

  if (score < 60) {
    recommendations.push("Consider using a simple, single-column format");
    recommendations.push("Ensure all critical sections are present and clearly labeled");
  }

  if (penalties.some((p) => p.includes("keyword"))) {
    recommendations.push("Mirror language from the job posting where truthful");
  }

  if (penalties.some((p) => p.includes("quantifiable"))) {
    recommendations.push("Add specific numbers, percentages, and measurable results");
  }

  return recommendations;
}
