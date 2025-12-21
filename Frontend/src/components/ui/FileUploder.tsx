import pdfToText from "react-pdftotext";
import axios from "axios";
import { Upload, Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { serverUrl } from "../../utils/contants.ts";

function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    setIsUploading(true);

    try {
      let extractedText = "";

      // Handle both PDF and DOCX
      if (uploadFile.type === "application/pdf") {
        // Extract PDF text
        extractedText = await pdfToText(uploadFile);

        if (!extractedText || extractedText.trim().length === 0) {
          setError(
            "Unable to extract text from this PDF. The file might be scanned or image-based.",
          );
          setIsUploading(false);
          return;
        }

        console.log("PDF text length:", extractedText.length);

        // Send extracted text to backend
        const uploadResponse = await axios.post(`${serverUrl}resume/upload-text`, {
          text: extractedText,
        });
        console.log("Backend response:", uploadResponse.data);

        // Analyze the text
        const analysisResponse = await axios.post(`${serverUrl}resume/analyze`, {
          text: extractedText,
        });

        setAtsResult(analysisResponse.data.data);
        console.log("ATS Result:", analysisResponse.data.data);
      } else if (
        uploadFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const formData = new FormData();
        formData.append("resume", uploadFile);

        const response = await axios.post(`${serverUrl}resume/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = response.data;

        if (data.success) {
          console.log("Analysis:", data.data);
          setAtsResult(data.data);
        } else {
          setError(data.message || "Analysis failed");
        }
      }

      setIsUploading(false);
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

      setIsUploading(false);
    }
  };

  return (
    <section className="bg-gray-3 mt-6 flex h-30 w-86 items-center justify-center rounded-lg p-2 md:h-36 md:w-102">
      <div
        onClick={isUploading ? undefined : handleClick}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group box-border flex h-[97%] w-[98%] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-2 transition-transform duration-250 ${
          isDragging ? "border-blue-10 bg-blue-3/40 scale-[1.01]" : "border-gray-7"
        } ${isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <div>
          {isUploading ? (
            <Loader2 className="stroke-blue-11 h-5 w-5 animate-spin md:h-6 md:w-6" />
          ) : (
            <Upload className="stroke-blue-11 h-5 w-5 transition-transform duration-250 group-hover:-translate-y-[1.5px] md:h-6 md:w-6" />
          )}
        </div>

        <div className="text-gray-12 text-center text-[0.65rem] font-medium md:text-[.8rem]">
          {isUploading ? (
            <span>Analyzing your resume...</span>
          ) : file ? (
            <span>
              <strong className="text-blue-11">{file.name}</strong> uploaded successfully!
            </span>
          ) : (
            <>
              <strong className="text-blue-11">Click</strong> or{" "}
              <strong className="text-blue-11">drop</strong> your PDF, DOC, or DOCX file here to get
              an instant resume score.
            </>
          )}
        </div>

        {error && (
          <div className="text-red-11 text-center text-[0.65rem] font-medium md:text-[.75rem]">
            {error}
          </div>
        )}

        {atsResult && !isUploading && (
          <div className="text-green-11 text-center text-[0.7rem] font-semibold md:text-[.85rem]">
            ATS Score: {atsResult.score}/100
          </div>
        )}

        <input
          type="file"
          ref={fileUploadRef}
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </section>
  );
}

export default FileUploader;
