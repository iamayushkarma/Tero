import { Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

function FileUploder() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    fileUploadRef.current?.click();
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
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

    setFile(droppedFile);
    console.log("File Name:", droppedFile.name);
    console.log("File Type:", droppedFile.type);
    console.log("File Size (bytes):", droppedFile.size);
  };
  return (
    <div className="bg-gray-3 mt-6 flex h-30 w-86 items-center justify-center rounded-lg p-2">
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
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default FileUploder;
