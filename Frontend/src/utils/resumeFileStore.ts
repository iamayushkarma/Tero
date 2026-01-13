import { del, get, set } from "idb-keyval";

const KEY = "resumeFile";

export async function saveResumeFile(file: File) {
  await set(KEY, file);
}

export async function loadResumeFile(): Promise<File | null> {
  const f = await get<File>(KEY);
  return f ?? null;
}

export async function clearResumeFile() {
  await del(KEY);
}
