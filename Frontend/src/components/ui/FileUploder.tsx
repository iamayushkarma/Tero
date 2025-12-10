import { Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

function FileUploder() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileUploadRef = useRef<HTMLInputElement | null>(null);
    const handleClick = ()=>{
        fileUploadRef.current?.click();
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>)=>{
        const selectedFile = event.target.files?.[0];
        if(!selectedFile) return;

        setFile(selectedFile);
        console.log("File Name:", selectedFile.name);
        console.log("File Type:", selectedFile.type);
        console.log("File Size (bytes):", selectedFile.size);
    }

    //> Drag and drop functionality
    const handleDrag = (e: React.DragEvent<HTMLDivElement>)=>{
        e.preventDefault();
        setIsDragging(true);
    }
    const handleDragLeave = () =>{
        setIsDragging(false);
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>)=>{
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;

        setFile(droppedFile);
        console.log("File Name:", droppedFile.name);
        console.log("File Type:", droppedFile.type);
        console.log("File Size (bytes):", droppedFile.size);
    }
  return (
        <div className="mt-6 w-86 h-30 bg-gray-3 p-2 rounded-lg flex items-center justify-center">
            <div 
            onClick={handleClick} 
            onDragOver={handleDrag}
           onDragLeave={handleDragLeave}
            onDrop={handleDrop} className={`w-[98%] h-[97%] border-2 p-2 flex flex-col gap-3 items-center justify-center box-border border-dashed rounded-lg cursor-pointer transition-transform duration-250 group ${isDragging ? "border-blue-10 bg-blue-3/40 scale-[1.01]" : "border-gray-7"}`}>
                <div>
                    <Upload className="w-5 h-5 md:w-6 md:h-6 stroke-blue-11 transition-transform duration-250 group-hover:-translate-y-[1.5px] " />
                </div>
                <div className="text-[0.65rem] md:text-[.8rem] text-gray-12 text-center font-medium"><strong className="text-blue-11">Click</strong> or <strong className="text-blue-11">drop</strong> your PDF, DOC, or DOCX file here to get an instant resume score.</div>
                <input
                    type="file"
                    ref={fileUploadRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                />
            </div>
        </div>
  )
}

export default FileUploder
