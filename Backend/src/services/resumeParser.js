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

  //- 6. Line Structuring

  const rawLines = cleanText.split("\n"); // Split text into array of lines
  const lines = [];
  let buffer = ""; // Temporary storage for merging

  for (const line of rawLines) {
    const trimmed = line.trim();

    if (!trimmed) continue; // Skip empty lines

    // Detect Line Type:
    const isBullet = trimmed.startsWith("-"); // Examples: "- Led team of 5 engineers"
    const isHeading =
      trimmed === trimmed.toUpperCase() && trimmed.length <= 50 && /^[A-Z\s&]+$/.test(trimmed); // Examples: "WORK EXPERIENCE", "EDUCATION"
    const endsSentence = /[.!?:]$/.test(trimmed);

    if (buffer && !isBullet && !isHeading && trimmed.length < 60 && !endsSentence) {
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
  const tokens = normalizedText
    .split(/[\s\n\r\t,;.!?()[\]{}]+/)
    .filter((t) => t.length > 1 && /[a-z]/.test(t));

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
