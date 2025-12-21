import axios from "axios";
import { Upload, Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { serverUrl } from "../../utils/contants.ts";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

// Set worker from imported URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    handleUpload(selectedFile);
    console.log("File Name:", selectedFile.name);
    console.log("File Type:", selectedFile.type);
    console.log("File Size (bytes):", selectedFile.size);
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
    handleUpload(droppedFile);
    console.log("File Name:", droppedFile.name);
    console.log("File Type:", droppedFile.type);
    console.log("File Size (bytes):", droppedFile.size);
  };

  // Handle file upload
  const handleUpload = async (uploadFile: File) => {
    console.log("Uploading:", uploadFile.name);
    setError(null);

    try {
      let extractedText = "";

      // Handle both PDF and DOCX
      if (uploadFile.type === "application/pdf") {
        // Extract PDF text using PDF.js with improved spacing
        extractedText = await extractPDFText(uploadFile);

        if (!extractedText || extractedText.trim().length === 0) {
          setError(
            "Unable to extract text from this PDF. The file might be scanned or image-based.",
          );
          return;
        }
        console.log("PDF text length:", extractedText.length);
        console.log("Extracted text preview:", extractedText);

        // Send extracted text to backend
        const uploadResponse = await axios.post(`${serverUrl}resume/upload-text`, {
          text: extractedText,
        });
        console.log("Backend response:", uploadResponse.data);
      } else if (
        uploadFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const formData = new FormData();
        formData.append("resume", uploadFile);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request made but no response
        setError("No response from server. Please check your connection.");
      } else {
        // Something else happened
        setError(err.message || "Upload failed. Please try again.");
      }
    }
  };

  return (
    <section className="bg-gray-3 mt-6 flex h-30 w-86 items-center justify-center rounded-lg p-2 md:h-36 md:w-102">
      <div
        onClick={handleClick}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group box-border flex h-[97%] w-[98%] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-2 transition-transform duration-250 ${
          isDragging ? "border-blue-10 bg-blue-3/40 scale-[1.01]" : "border-gray-7"
        } `}
      >
        <div className="text-gray-12 text-center text-[0.65rem] font-medium md:text-[.8rem]">
          <div>
            <strong className="text-blue-11">Click</strong> or{" "}
            <strong className="text-blue-11">drop</strong> your PDF, DOC, or DOCX file here to get
            an instant resume score.
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
    </section>
  );
}

export default FileUploader;
