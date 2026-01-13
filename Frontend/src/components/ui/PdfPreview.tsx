import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../modules/Modules.css";
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
      <div className="bg-bg-gray-2 dark:bg-gray-12/10 mx-auto h-[75vh] w-fit overflow-auto rounded-lg p-2 dark:hue-rotate-180 dark:invert">
        <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="mb-3 flex justify-center rounded-lg">
              <Page
                pageNumber={i + 1}
                width={Math.min(containerWidth - 16, 500)}
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
