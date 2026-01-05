import { useContext } from "react";
import { ResumeAnalysisContext } from "../context/ResumeAnalysisContext";
export function useResumeAnalysis() {
  const context = useContext(ResumeAnalysisContext);
  if (!context) {
    throw new Error("useResumeAnalysis must be used within ResumeAnalysisProvider");
  }
  return context;
}
