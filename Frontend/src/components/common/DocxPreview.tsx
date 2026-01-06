// components/DocxPreview.tsx
import { renderAsync } from "docx-preview";
import { useEffect, useRef } from "react";
import "./DocxPreview.css";

export default function DocxPreview({ file }: { file: File }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file || !ref.current) return;

    file.arrayBuffer().then((buffer) => {
      renderAsync(buffer, ref.current!, undefined, {
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: false,
        renderChanges: false,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      }).then(() => {
        // Remove inline padding styles from rendered elements
        if (ref.current) {
          const elements = ref.current.querySelectorAll('[style*="padding"]');
          elements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            // Remove padding from inline styles while preserving other styles
            if (htmlEl.style.padding) {
              htmlEl.style.padding = "0";
            }
          });
        }
      });
    });
  }, [file]);

  return <div ref={ref} className="docx-preview-container h-full overflow-auto" />;
}
