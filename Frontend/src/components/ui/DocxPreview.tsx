import mammoth from "mammoth";
import { useEffect, useState } from "react";
import "./common.css";

export function DocxPreview({ file }: { file: File | null }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!file) return;
    (async () => {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtml(result.value);
    })();
  }, [file]);

  if (!file) return null;

  return (
    <div className="bg-bg-gray-2 dark:bg-gray-12/10 h-[75vh] overflow-auto rounded-lg p-4">
      <div
        className="docx-preview text-gray-12 dark:text-gray-3 rounded-lg!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
