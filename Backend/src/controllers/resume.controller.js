import mammoth from "mammoth";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { resumeParser } from "../services/resumeParser.js";

// PDF
const uploadResumeText = asyncHandler(async (req, res) => {
  const { text, jobRole } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "Resume text is required"));
  }
  console.log("PDF resume received");
  console.log("Text length:", text.length);

  // sending extracted text to resumeParser.js
  const parsedResume = resumeParser({
    text,
    source: "pdf",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        textLength: text.length,
        parsedResume,
        jobRole,
        preview: text.slice(0, 300),
      },
      "Resume processed successfully",
    ),
  );
});

// DOCS
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
  } catch (err) {
    return res.status(400).json(new ApiResponse(400, null, "Failed to read DOCX file"));
  }

  if (!result.value || result.value.trim().length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "No readable text found in DOCX"));
  }

  console.log("DOCX resume received");
  console.log("Text length:", result.value.length);

  // sending extracted text to resumeParser.js
  const parsedResume = resumeParser({
    text: result.value,
    source: "DOCS",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        textLength: result.value.length,
        parsedResume,
        jobRole,
        preview: result.value.slice(0, 300),
      },
      "Resume processed successfully",
    ),
  );
});

export { uploadResumeText, uploadResumeFile };
