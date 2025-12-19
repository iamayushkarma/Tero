import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { uploadResumeText, uploadResumeFile } from "../controllers/resume.controller.js";

const router = Router();

// PDF
router.post("/upload-text", uploadResumeText);

// DOCS
router.post("/upload-file", upload.single("resume"), uploadResumeFile);

export default router;
