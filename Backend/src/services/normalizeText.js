export function normalizeText(rawText = "") {
  if (!rawText || typeof rawText !== "string") {
    return {
      rawText: "",
      normalizedText: "",
      normalizedLines: [],
      rawLines: [],
      lowerText: "",
      stats: {
        wordCount: 0,
        lineCount: 0,
      },
    };
  }

  // Normalize line endings (Windows / Mac / Linux)
  // It identifies all the different ways computers create a "new line" (like hitting Enter on Windows vs. Mac) and converts them into one single format. This cleans up the text so your code doesn't get confused by hidden formatting characters when reading the resume.
  let text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Replace common bullet symbols with standard dash
  text = text.replace(/[•●▪■►◦]/g, "-");

  // Normalize dashes and quotes (PDF artifacts)
  text = text.replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  // Remove non-breaking spaces & weird unicode spacing
  text = text.replace(/\u00A0/g, " ");

  //  Collapse multiple spaces into one
  text = text.replace(/[ \t]{2,}/g, " ");

  // Collapse excessive newlines (find 3 or more empty lines in a row, turn them into exactly 2 new lines.)
  text = text.replace(/\n{3,}/g, "\n\n");

  // Trim each line
  const rawLines = text.split("\n");

  const normalizedLines = rawLines
    .map((line) =>
      line
        .trim()
        // Normalize section headers like "SKILLS:" → "SKILLS"
        .replace(/[:|\-]+$/, ""),
    )
    .filter((line) => line.length > 0);

  // Rebuild normalized text
  const normalizedText = normalizedLines.join("\n");

  const lowerText = normalizedText.toLowerCase();
  const wordCount = normalizedText.split(/\s+/).length;
  const lineCount = normalizedLines.length;

  return {
    rawText,
    normalizedText,
    normalizedLines,
    rawLines,
    lowerText,
    stats: {
      wordCount,
      lineCount,
    },
  };
}
