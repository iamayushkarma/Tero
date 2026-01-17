import React, { createContext, useEffect, useMemo, useState } from "react";
import { clearResumeFile, loadResumeFile, saveResumeFile } from "../utils/resumeFileStore";

export type ResumeAnalysis = {
  score: number;
  verdict: string;
  atsResult: any;
  aiVerdict: string;
};

type Status = "idle" | "analyzing" | "done" | "error";

type ResumeAnalysisState = {
  status: Status;
  analysis: ResumeAnalysis | null;
  jobRole: string | null;
  file: File | null;
  error: string | null;
};

const STORAGE_KEY = "resumeAnalysisState";

type ResumeAnalysisContextType = ResumeAnalysisState & {
  startAnalysis: (file?: File | null, jobRole?: string | null) => void;
  setResult: (data: ResumeAnalysis, jobRole?: string | null, file?: File | null) => void;
  setAnalysisError: (message: string) => void;
  reset: () => void;
  setFile: (file: File | null) => void;
};

export const ResumeAnalysisContext = createContext<ResumeAnalysisContextType | null>(null);

const DEFAULT_STATE: ResumeAnalysisState = {
  status: "idle",
  analysis: null,
  jobRole: null,
  file: null,
  error: null,
};

export function ResumeAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResumeAnalysisState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ResumeAnalysisState>;
        return { ...DEFAULT_STATE, ...parsed, file: null }; // file restored from IndexedDB
      }
    } catch (e) {
      console.error("Failed to load saved analysis:", e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    (async () => {
      const f = await loadResumeFile();
      if (f) setState((prev) => ({ ...prev, file: f }));
    })();
  }, []);

  useEffect(() => {
    try {
      const { file, ...toSave } = state;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save analysis:", e);
    }
  }, [state.status, state.analysis, state.jobRole, state.error]); // avoid file

  const setFile = (file: File | null) => {
    setState((prev) => ({ ...prev, file }));
    if (file) saveResumeFile(file);
    else clearResumeFile();
  };

  const startAnalysis = (file?: File | null, jobRole?: string | null) => {
    const f = file ?? null;
    setState({
      status: "analyzing",
      analysis: null,
      jobRole: jobRole ?? null,
      file: f,
      error: null,
    });
    if (f) saveResumeFile(f);
  };

  const setResult = (data: ResumeAnalysis, jobRole?: string | null, file?: File | null) => {
    const f = file ?? null;
    setState({
      status: "done",
      analysis: data,
      jobRole: jobRole ?? null,
      file: f,
      error: null,
    });
    if (f) saveResumeFile(f);
  };

  const setAnalysisError = (message: string) => {
    setState((prev) => ({
      ...prev,
      status: "error",
      analysis: null,
      error: message,
    }));
  };

  const reset = () => {
    setState(DEFAULT_STATE);
    sessionStorage.removeItem(STORAGE_KEY);
    clearResumeFile();
  };

  const value = useMemo(
    () => ({
      ...state,
      startAnalysis,
      setResult,
      setAnalysisError,
      reset,
      setFile,
    }),
    [state],
  );

  return <ResumeAnalysisContext.Provider value={value}>{children}</ResumeAnalysisContext.Provider>;
}
