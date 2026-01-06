// components/ResumePreviewPanel.tsx
import { Document, Page, pdfjs } from "react-pdf";
import DocxPreview from "./DocxPreview";

type ResumePreviewPanelProps = {
  file: File | null;
};
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();
export default function ResumePreviewPanel({ file }: ResumePreviewPanelProps) {
  if (!file) return null;

  if (file.type === "application/pdf") {
    return (
      <Document file={file}>
        <Page 
          pageNumber={1} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    );
  }

  return <DocxPreview file={file} />;
}
