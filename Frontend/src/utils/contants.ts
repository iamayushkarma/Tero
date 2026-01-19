const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
export const serverUrl = `${base}/api/v1/`;
