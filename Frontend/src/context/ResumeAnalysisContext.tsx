import { createContext, useState } from "react";

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
  error: string | null;
};

type ResumeAnalysisContextType = ResumeAnalysisState & {
  startAnalysis: () => void;
  setResult: (data: ResumeAnalysis, jobRole?: string | null) => void;
  setAnalysisError: (message: string) => void;
  reset: () => void;
};
export const ResumeAnalysisContext = createContext<ResumeAnalysisContextType | null>(null);

export function ResumeAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResumeAnalysisState>({
    status: "idle",
    analysis: null,
    jobRole: null,
    error: null,
  });

  const startAnalysis = () => {
    setState({
      status: "analyzing",
      analysis: null,
      jobRole: null,
      error: null,
    });
  };

  const setResult = (data: ResumeAnalysis, jobRole?: string | null) => {
    setState({
      status: "done",
      analysis: data,
      jobRole: jobRole || null,
      error: null,
    });
  };

  const setAnalysisError = (message: string) => {
    setState({
      status: "error",
      analysis: null,
      jobRole: null,
      error: message,
    });
  };

  const reset = () => {
    setState({
      status: "idle",
      analysis: null,
      jobRole: null,
      error: null,
    });
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
