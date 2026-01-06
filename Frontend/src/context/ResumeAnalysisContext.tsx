import { createContext, useState, useEffect } from "react";

export type ResumeAnalysis = {
  score: number;
  verdict: string;
  atsResult: any;
  aiVerdict: string;
};

type ResumeAnalysisState = {
  status: "idle" | "analyzing" | "done" | "error";
  analysis: ResumeAnalysis | null;
  jobRole: string | null;
  file: File | null;
  error: string | null;
};

const STORAGE_KEY = "resumeAnalysisState";

type ResumeAnalysisContextType = ResumeAnalysisState & {
  startAnalysis: (file?: File | null) => void;
  setResult: (data: ResumeAnalysis, jobRole?: string | null, file?: File | null) => void;
  setAnalysisError: (message: string) => void;
  reset: () => void;
};

export const ResumeAnalysisContext = createContext<ResumeAnalysisContextType | null>(null);

export function ResumeAnalysisProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from sessionStorage if available
  const [state, setState] = useState<ResumeAnalysisState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Note: File objects can't be serialized, so we lose the file on refresh
        return { ...parsed, file: null };
      }
    } catch (error) {
      console.error("Failed to load saved analysis:", error);
    }
    return {
      status: "idle",
      analysis: null,
      jobRole: null,
      file: null,
      error: null,
    };
  });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      // Don't save if status is idle or analyzing
      if (state.status === "done" || state.status === "error") {
        // Exclude file from storage (can't serialize File objects)
        const { file, ...stateToSave } = state;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      }
    } catch (error) {
      console.error("Failed to save analysis:", error);
    }
  }, [state]);

  const startAnalysis = (file?: File | null) => {
    setState({
      status: "analyzing",
      analysis: null,
      jobRole: null,
      file: file || null,
      error: null,
    });
  };

  const setResult = (data: ResumeAnalysis, jobRole?: string | null, file?: File | null) => {
    setState({
      status: "done",
      analysis: data,
      jobRole: jobRole || null,
      file: file || null,
      error: null,
    });
  };

  const setAnalysisError = (message: string) => {
    setState({
      status: "error",
      analysis: null,
      jobRole: null,
      file: null,
      error: message,
    });
  };

  const reset = () => {
    setState({
      status: "idle",
      analysis: null,
      jobRole: null,
      file: null,
      error: null,
    });
    // Clear sessionStorage when resetting
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear saved analysis:", error);
    }
  };

  return (
    <ResumeAnalysisContext.Provider
      value={{
        ...state,
        startAnalysis,
        setResult,
        setAnalysisError,
        reset,
      }}
    >
      {children}
    </ResumeAnalysisContext.Provider>
  );
}
