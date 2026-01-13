import mammoth from "mammoth";
import { useEffect, useState } from "react";

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
    <div className="h-[75vh] overflow-auto rounded-lg bg-white p-4">
      <div className="docx-preview" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
