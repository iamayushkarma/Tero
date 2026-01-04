import mammoth from "mammoth";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { resumeParser } from "../services/resumeParser.js";
import { sectionDetector } from "../services/sectionDetector.js";
import { keywordMatcher } from "../services/keywordMatcher.js";
import { formattingAnalyzer } from "../services/formattingAnalyzer.js";
import { atsScoring } from "../services/atsScoring.js";
import { generateAIVerdict } from "../services/aiEvaluation.js";

// PDF/Text Upload
const uploadResumeText = asyncHandler(async (req, res) => {
  const { text, jobRole } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "Resume text is required"));
  }

  try {
    // 1. Parse resume
    const parsedResume = resumeParser({
      text,
      source: "pdf",
    });

    // 2. Detect sections
    const sectionData = sectionDetector({
      lines: parsedResume.lines,
    });

    // 3. Match keywords
    const keywordData = keywordMatcher({
      parsedResume,
      sectionData,
    });

    // 4. Analyze formatting
    const formattingData = formattingAnalyzer({
      parsedResume,
    });

    // 5. Final ATS score
    const atsResult = atsScoring({
      sectionData,
      keywordData,
      formattingData,
    });

    const aiVerdict = await generateAIVerdict({ atsResult, jobRole });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          jobRole,
          score: atsResult.score,
          verdict: atsResult.verdict,
          atsResult,
          aiVerdict,
          breakdown: {
            sections: sectionData,
            keywords: keywordData,
            formatting: formattingData,
          },
        },
        "Resume analyzed successfully",
      ),
    );
  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json(new ApiResponse(500, null, `Analysis failed: ${error.message}`));
  }
});

// DOCX File Upload
const uploadResumeFile = asyncHandler(async (req, res) => {
  const { jobRole } = req.body;

  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "Resume file is required"));
  }

  let result;
  try {
    result = await mammoth.extractRawText({
      buffer: req.file.buffer,
    });
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return res.status(400).json(new ApiResponse(400, null, "Failed to read DOCX file"));
  }

  if (!result.value || result.value.trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "No readable text found in DOCX"));
  }

  try {
    // 1. Parse resume
    const parsedResume = resumeParser({
      text: result.value,
      source: "docx",
    });

    // 2. Detect sections
    const sectionData = sectionDetector({
      lines: parsedResume.lines,
    });

    // 3. Match keywords
    const keywordData = keywordMatcher({
      parsedResume,
      sectionData,
    });

    // 4. Analyze formatting
    const formattingData = formattingAnalyzer({
      parsedResume,
    });

    // 5. Final ATS score
    const atsResult = atsScoring({
      sectionData,
      keywordData,
      formattingData,
    });

    const aiVerdict = await generateAIVerdict({ atsResult, jobRole });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          jobRole,
          score: atsResult.score,
          verdict: atsResult.verdict,
          atsResult,
          aiVerdict,
          breakdown: {
            sections: sectionData,
            keywords: keywordData,
            formatting: formattingData,
          },
        },
        "Resume analyzed successfully",
      ),
    );
  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json(new ApiResponse(500, null, `Analysis failed: ${error.message}`));
  }
});

export { uploadResumeText, uploadResumeFile };
