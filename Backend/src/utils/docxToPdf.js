import libre from "libreoffice-convert";
import { promisify } from "util";

const convertAsync = promisify(libre.convert);

export async function docxToPdfBuffer(docxBuffer) {
  const pdfBuf = await convertAsync(docxBuffer, ".pdf", undefined);
  return pdfBuf;
}
