import axios from "axios";
import { Upload, CircleCheck, File } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../utils/contants.ts";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import SearchBox from "./SearchBox.tsx";
import { useResumeAnalysis } from "../../hooks/useResumeAnalysis.tsx";

// Set worker from imported URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isFormValid = Boolean(file);
  const { setResult, startAnalysis, setAnalysisError } = useResumeAnalysis();
  const navigate = useNavigate();

  // Function to get a fresh token from backend
  const getToken = async (): Promise<string> => {
    try {
      const response = await axios.get(`${serverUrl}token`);
      return response.data.token;
    } catch (err: any) {
      console.error("Token generation error:", err);
      throw new Error("Failed to generate security token. Please try again.");
    }
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF and DOCX files are allowed";
    }
    // Check file size max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  useEffect(() => {
    if (error) {
      console.error("Upload error:", error);
    }
  }, [error]);

  // Extract text from PDF using PDF.js with better word spacing
  const extractPDFText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const isTextItem = (item: any): item is TextItem => {
          return "transform" in item && "width" in item;
        };

        let lastY: number | null = null;
        let pageText = "";

        textContent.items.forEach((item: any, index: number) => {
          if (!isTextItem(item)) return;

          const currentY = item.transform[5];
          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            pageText += "\n";
          } else if (index > 0) {
            const prevItem = textContent.items[index - 1];
            if (isTextItem(prevItem)) {
              const gap = item.transform[4] - (prevItem.transform[4] + prevItem.width);
              if (gap > 2) {
                pageText += " ";
              }
            }
          }

          pageText += item.str;
          lastY = currentY;
        });

        fullText += pageText + "\n\n";
      }

      // Final cleanup
      return fullText
        .replace(/\s{2,}/g, " ") // Multiple spaces to one
        .replace(/\n{3,}/g, "\n\n") // Multiple newlines to two
        .trim();
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileUploadRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate uploaded file
    const errorMsg = validateFile(selectedFile);
    if (errorMsg) {
      setError(errorMsg);
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  // Drag and drop functionality
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    const errorMsg = validateFile(droppedFile);
    if (errorMsg) {
      setError(errorMsg);
      setFile(null);
      return;
    }

    setError(null);
    setFile(droppedFile);
  };

  // Handle file upload with token
  const handleUpload = async (uploadFile: File) => {
    console.log("Uploading:", uploadFile.name);
    setError(null);
    setIsUploading(true);

    try {
      // Get fresh token before upload
      const token = await getToken();

      let extractedText = "";

      // Handle both PDF and DOCX
      if (uploadFile.type === "application/pdf") {
        // Extract PDF text using PDF.js with improved spacing
        extractedText = await extractPDFText(uploadFile);

        if (!extractedText || extractedText.trim().length === 0) {
          setError(
            "Unable to extract text from this PDF. The file might be scanned or image-based.",
          );
          setIsUploading(false);
          return;
        }

        // Send extracted text to backend with token
        const uploadResponse = await axios.post(`${serverUrl}resume/upload-text`, {
          text: extractedText,
          jobRole,
          token, // Include token in request body
        });

        const analysisData = uploadResponse.data.data;
        setResult(analysisData, jobRole, file);
        console.log("Backend response:", uploadResponse.data);
      } else if (
        uploadFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const formData = new FormData();
        formData.append("resume", uploadFile);
        formData.append("token", token); // Include token in form data
        if (jobRole) formData.append("jobRole", jobRole);

        const uploadResponse = await axios.post(`${serverUrl}resume/upload-file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Backend response:", uploadResponse.data);
        const analysisData = uploadResponse.data.data;
        setResult(analysisData, jobRole, file);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      let errorMessage = "Upload failed. Please try again.";

      if (err.response) {
        // Server responded with error
        const serverError = err.response.data?.error || err.response.data?.message;

        // Handle specific error messages
        if (serverError?.includes("token")) {
          errorMessage = "Security token expired. Please try again.";
        } else if (serverError?.includes("too many")) {
          errorMessage = serverError; // Use the rate limit message as-is
        } else {
          errorMessage = serverError || `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message || "Upload failed. Please try again.";
      }

      setError(errorMessage);
      setAnalysisError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file || isUploading) return;

    startAnalysis(file);
    await handleUpload(file);
    navigate("/resume-analysis", { state: { fromUpload: true } });
  };

  return (
    <div className="py-2">
      <section
        className={`bg-bg-gray-2 mt-6 flex w-86 flex-col items-center justify-center overflow-visible rounded-lg p-2 md:w-102`}
      >
        {file ? (
          <div className="border-success-border bg-success-bg box-border flex h-32 w-[98%] flex-col items-center rounded-lg border-2 border-dashed p-2 text-center text-[.8rem] sm:h-34 md:h-36">
            <span>
              <CircleCheck className="text-success-text mt-1 size-7" />
            </span>
            <div className="mt-3 flex w-full max-w-[90%] items-center justify-center gap-2">
              <File className="size-4 shrink-0 md:size-5" />
              <p className="truncate font-medium md:text-sm" title={file.name}>
                {file.name}
              </p>
            </div>
            <p className="text-gray-10 mt-1 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setError("");
              }}
              className="text-primary mt-2 hover:underline"
              disabled={isUploading}
            >
              Remove
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            onDragOver={handleDrag}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group bg-gray-3/90 box-border flex h-32 w-[98%] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-2 transition-transform duration-250 sm:h-34 md:h-36 ${
              isDragging ? "border-blue-10 bg-blue-3/40 scale-[1.01]" : "border-gray-7"
            } `}
          >
            <div className="text-gray-12 group text-center text-[0.7rem] font-medium transition-all duration-200 md:text-[.85rem]">
              <div>
                <span className="flex">
                  <Upload className="text-gray-10 mx-auto mb-2 size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                </span>
                <strong className="text-blue-11">Click</strong> or{" "}
                <strong className="text-blue-11">drop</strong> your PDF, DOC, or DOCX file here to
                get an instant resume score.
              </div>
            </div>
            <input
              type="file"
              ref={fileUploadRef}
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
          </div>
        )}
        <div className="text-error mt-2 ml-2 flex w-[98%] items-start text-[.7rem] md:text-[.8rem]">
          {error}
        </div>

        {/* Role selection */}
        <div className="relative mx-auto mt-6 flex w-[97%] flex-col gap-1">
          <label className="text-gray-12 flex items-center gap-2 text-[.9rem] font-medium md:text-[1rem]">
            Target Job Role
            <span className="bg-gray-3 text-gray-10 rounded-md px-2 py-0.5 text-xs font-medium">
              Optional
            </span>
          </label>
          <p className="text-gray-9 text-[.8rem]">
            Selecting a job role improves keyword and skill matching.
          </p>
          <SearchBox onSelectRole={setJobRole} />
        </div>

        {/* Submit button */}
        <button
          disabled={!isFormValid || isUploading}
          onClick={handleAnalyze}
          className={`z-20 mx-auto mt-4 w-[97%] rounded-lg p-2 md:text-[1rem] ${
            isFormValid && !isUploading
              ? "bg-primary hover:bg-blue-10 cursor-pointer text-white shadow-md"
              : "bg-gray-5 text-gray-10 cursor-not-allowed"
          }`}
        >
          {isUploading ? "Analyzing..." : "Analyze Resume"}
        </button>

        <span className="border-gray-7 mt-5 w-3/4 border border-t-[.1px]"></span>
        <p className="text-gray-10 mt-2 text-center text-[.7rem] md:text-[.8rem]">
          Your resume is analyzed securely and never stored on our servers
        </p>
      </section>
    </div>
  );
}

export default FileUploader;
