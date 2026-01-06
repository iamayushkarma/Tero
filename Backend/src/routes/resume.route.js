import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { uploadResumeText, uploadResumeFile } from "../controllers/resume.controller.js";
// import { analyzeResume } from "../controllers/resume-score.controller.js";

const router = Router();

// PDF
router.post("/upload-text", uploadResumeText);
// PDF file upload (for preview)
router.post("/upload-pdf", upload.single("resume"), uploadResumeText);

// DOCS
router.post("/upload-file", upload.single("resume"), uploadResumeFile);
// DOCX upload
router.post("/upload-file", upload.single("resume"), uploadResumeFile);

// router.post("/analyze", analyzeResume);

export default router;
