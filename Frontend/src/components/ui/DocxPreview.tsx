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
    <div className="overflow-auto rounded bg-white p-4">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
