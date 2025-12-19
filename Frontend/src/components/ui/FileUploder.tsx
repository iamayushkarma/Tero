import pdfToText from "react-pdftotext";
import axios from "axios";
import { Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { serverUrl } from "../../utils/contants.ts";

function FileUploder() {
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

  //> Drag and drop functionality
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
    console.log("File Name:", droppedFile.name);
    console.log("File Type:", droppedFile.type);
    console.log("File Size (bytes):", droppedFile.size);
  };

  const handleUpload = async (uploadFile: File) => {
    console.log("Uploading:", uploadFile.name);
    setError(null);
    try {
      // Extract PDF text
      if (uploadFile.type == "application/pdf") {
        const extractedText = await pdfToText(uploadFile);

        if (!extractedText || extractedText.trim().length === 0) {
          setError("Unable to extract text from this PDF");
          return;
        }
        console.log("PDF text length:", extractedText.length);

        const response = await axios.post(`${serverUrl}resume/upload-text`, {
          text: extractedText,
        });
        console.log("Backend response:", response.data);
        return;
      }

      // Send extracted text to backend
      const formData = new FormData();
      formData.append("resume", uploadFile);

      const response = await axios.post(`${serverUrl}resume/upload`, formData);
      const data = response.data;
      if (data.success) {
        console.log("Analysis:", data.data);
      } else {
        setError(data.message || "Analysis failed");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    }
  };
  return (
    <section className="bg-gray-3 mt-6 flex h-30 w-86 items-center justify-center rounded-lg p-2 md:h-36 md:w-102">
      <div
        onClick={handleClick}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group box-border flex h-[97%] w-[98%] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-2 transition-transform duration-250 ${isDragging ? "border-blue-10 bg-blue-3/40 scale-[1.01]" : "border-gray-7"}`}
      >
        <div>
          <Upload className="stroke-blue-11 h-5 w-5 transition-transform duration-250 group-hover:-translate-y-[1.5px] md:h-6 md:w-6" />
        </div>
        <div className="text-gray-12 text-center text-[0.65rem] font-medium md:text-[.8rem]">
          <strong className="text-blue-11">Click</strong> or{" "}
          <strong className="text-blue-11">drop</strong> your PDF, DOC, or DOCX file here to get an
          instant resume score.
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

export default FileUploder;
