import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { uploadResumeText, uploadResumeFile } from "../controllers/resume.controller.js";
import { validateToken } from "../middlewares/tokenValidation.middleware.js";

const router = Router();

router.post("/upload-text", validateToken, uploadResumeText);
router.post("/upload-pdf", validateToken, upload.single("resume"), uploadResumeText);
router.post("/upload-file", upload.single("resume"), validateToken, uploadResumeFile);

export default router;
