import { normalizeText } from "../services/normalizeText.js";
import { detectSections, extractMetrics } from "../services/detectSections.js";
import { calculateATSScore } from "../services/atsScore.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyzeResume = asyncHandler(async (req, res) => {
  const { text, jobDescription } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json(new ApiResponse(400, null, "Resume text is required"));
  }
  const normalized = normalizeText(text);

  const sections = detectSections(normalized.normalizedLines);

  const metrics = extractMetrics(normalized.normalizedLines, sections);

  const atsResult = calculateATSScore({
    sections,
    metrics,
    jobDescription: jobDescription || null,
    formatting: {},
  });

  return res.status(200).json(
    new ApiResponse(200, {
      score: atsResult.score,
      grade: atsResult.grade,
      breakdown: atsResult.breakdown,
      strengths: atsResult.strengths,
      penalties: atsResult.penalties,
      recommendations: atsResult.recommendations,
    }),
  );
});
