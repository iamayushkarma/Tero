export const resumeParser = ({ text, source }) => {
  // validating input
  if (!text || typeof text !== "string") {
    throw new Error("resumeParser: invalid resume text");
  }
  //- 1. preserving raw text
  const rawText = text;

  //- 2. Bullet normalization
  let precleanText = rawText.replace(/^[\s]*[•–—▪*→⇒►‣⁃◦∙⚫○]+[\s]*/gm, "- ");

  //- 3. Character Cleaning
  // removing or replacing problematic characters that could cause issues in text processing
  let sanitizedText = precleanText
    .replace(/\t/g, " ") // tabs → spaces
    .replace(/\u00A0/g, " ") // non-breaking spaces → spaces
    .replace(/\u200B/g, "") // remove zero-width spaces
    .replace(/\r\n|\r/g, "\n") // standardize line breaks
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
  // remove non-printable chars

  //- 4. Unicode Normalization
  // converts visually similar characters into a single canonical form like café to cafe ﬁ to fi, ㎏ to kg, Microsoft® to Microsoft(R).
  sanitizedText = sanitizedText.normalize("NFKC");

  //- 5. Whitespace cleanup
  let cleanText = sanitizedText
    .replace(/[ ]{2,}/g, " ") // collapse multiple spaces "Software    Engineer"  // 4 spaces -> "Software Engineer"     // 1 space
    .replace(/\n{3,}/g, "\n\n") // max 1 blank line
    // Before:
    //"Experience

    //Work History"  // 3 blank lines

    // After:
    //"Experience

    //Work History"  // 1 blank line (2 newlines)
    .replace(/[ \t]+$/gm, "")
    .trim(); // remove trailing spaces
  // Before:
  // ("Software Engineer    \n"); // spaces at end
  // ("Python Developer\t\t\n"); // tabs at end

  // After:
  // ("Software Engineer\n");
  // "Python Developer\n".trim(); // trim document edges

  //- 6. Insert line breaks before potential headings
  // Potential section headings to insert line breaks before
  const potentialHeadingsInsert = new Set([
    "contact",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "awards",
    "languages",
    "interests",
    "work experience",
    "professional experience",
    "academic background",
    "technical skills",
    "personal projects",
    "professional certifications",
    "internships",
    "publications",
    "research",
    "volunteer",
    "community",
    "hackathons",
    "competitions",
    "patents",
    "conferences",
    "speaking",
    "employment",
    "employment history",
    "career",
    "career history",
    "work history",
    "professional background",
    "positions",
    "roles",
    "jobs",
    "educational qualifications",
    "academic qualifications",
    "educational background",
  ]);

  let processedText = cleanText;
  for (const heading of potentialHeadingsInsert) {
    // Escape special regex chars
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedHeading}\\b`, "gi");
    processedText = processedText.replace(regex, "\n" + heading + "\n");
  }

  //- 7. Line Structuring

  const rawLines = processedText.split("\n"); // Split text into array of lines
  const lines = [];
  let buffer = ""; // Temporary storage for merging

  // Potential section headings to prevent merging
  const potentialHeadings = new Set([
    "contact",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "awards",
    "languages",
    "interests",
    "work experience",
    "professional experience",
    "academic background",
    "technical skills",
    "personal projects",
    "professional certifications",
    "internships",
    "publications",
    "research",
    "volunteer",
    "community",
    "hackathons",
    "competitions",
    "patents",
    "conferences",
    "speaking",
    "employment",
    "employment history",
    "career",
    "career history",
    "work history",
    "professional background",
    "positions",
    "roles",
    "jobs",
    "educational qualifications",
    "academic qualifications",
    "educational background",
  ]);

  for (const line of rawLines) {
    const trimmed = line.trim();

    if (!trimmed) continue; // Skip empty lines

    // Detect Line Type:
    const isBullet = trimmed.startsWith("-"); // Examples: "- Led team of 5 engineers"
    const isHeading =
      trimmed === trimmed.toUpperCase() && trimmed.length <= 50 && /^[A-Z\s&]+$/.test(trimmed); // Examples: "WORK EXPERIENCE", "EDUCATION"
    const endsSentence = /[.!?:]$/.test(trimmed);
    const isPotentialHeading = potentialHeadings.has(trimmed.toLowerCase());

    if (
      buffer &&
      !isBullet &&
      !isHeading &&
      !isPotentialHeading &&
      trimmed.length < 60 &&
      !endsSentence
    ) {
      buffer += " " + trimmed;
    } else {
      if (buffer) lines.push(buffer);
      buffer = trimmed;
    }
  }
  if (buffer) lines.push(buffer);

  //- 7. Converts all text to lowercase
  const normalizedText = cleanText.toLowerCase();

  //- 8. Tokenization
  const STOP_TOKENS = new Set(["ba", "ma", "ms", "bs", "js", "ts", "py", "r", "c"]);

  const tokens = normalizedText
    .split(/[\s\n\r\t,;.!?()[\]{}]+/)
    .map((t) => t.trim())
    .filter((t) => {
      if (t.length < 3) return false; // minimum semantic length
      if (STOP_TOKENS.has(t)) return false; // remove ATS-noise abbreviations
      if (!/[a-z]/.test(t)) return false; // must contain letters
      return true;
    });

  //- 9 Statistics
  const uppercaseLetters = cleanText.replace(/[^A-Z]/g, "").length;
  const totalLetters = cleanText.replace(/[^A-Za-z]/g, "").length;

  const stats = {
    charCount: cleanText.length,
    wordCount: tokens.length,
    lineCount: lines.length,
    bulletCount: lines.filter((l) => l.startsWith("-")).length,
    uppercaseRatio: totalLetters ? uppercaseLetters / totalLetters : 0,
  };

  return {
    rawText,
    cleanText,
    normalizedText,
    lines,
    tokens,
    stats,
    source,
  };
};
