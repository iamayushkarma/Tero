import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PdfOnlyPreview({ file }: { file: File | null }) {
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const ro = new ResizeObserver(() => {
      const w = wrapRef.current?.clientWidth ?? 0;
      setContainerWidth(w);
    });

    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  if (!file) return null;

  return (
    <div ref={wrapRef} className="w-full max-w-full">
      <div className="h-[75vh] overflow-auto rounded-lg bg-white p-2">
        <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="mb-3 flex justify-center">
              <Page
                pageNumber={i + 1}
                width={Math.min(containerWidth - 16, 800)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
