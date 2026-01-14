import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import { useNavigate } from "react-router-dom";
import ResumeLoading from "../ui/ResumeLoading";
import { useTheme } from "../../hooks/useThemeContext";
import ProgressBar from "../ui/ProgressBar";
import { useLayoutEffect } from "react";
import { PdfOnlyPreview } from "../ui/PdfPreview";
import { DocxPreview } from "../ui/DocxPreview";
import "./Modules.css";

type ScoreBreakdownItem = {
  score: number;
  maxScore: number;
  percentage?: number;
};

type ScoreBreakdown = Record<string, ScoreBreakdownItem>;
function ResumeAnalysisResult() {
  const { status, analysis, jobRole, error, file } = useResumeAnalysis();
  const navigate = useNavigate();
  const { theme } = useTheme();

  console.log(file);

  // Use useLayoutEffect to scroll immediately before browser paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const score = analysis?.atsResult?.score ?? 0;
  function getScoreColor(score: number, isDark: boolean) {
    if (score < 40) return isDark ? "#f87171" : "#dc2626"; // Red
    if (score < 50) return isDark ? "#fb923c" : "#ea580c"; // Slightly lighter orange
    if (score < 75) return isDark ? "#fde047" : "#facc15"; // Slightly lighter yellow
    if (score < 90) return isDark ? "#4ade80" : "#22c55e"; // Green
    return isDark ? "#22c55e" : "#16a34a"; // Darker green for 90+
  }
  const isDark = theme === "dark";
  const color = getScoreColor(score, isDark);

  const breakdown = analysis?.atsResult?.breakdown as ScoreBreakdown | undefined;
  const aiBreakdown = analysis?.aiVerdict;

  const progressBarConfig = [
    { key: "experience_quality", label: "Experience" },
    { key: "sections", label: "Sections" },
    { key: "skills_relevance", label: "Skills" },
    { key: "formatting", label: "Formatting" },
    { key: "keywords", label: "Keywords" },
  ];

  switch (status) {
    case "idle":
      navigate("/");
      return null;
    case "analyzing":
      return <ResumeLoading />;
    case "error":
      return (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      );
    default:
      break;
  }
  if (!analysis) {
    navigate("/");
    return null;
  }

  return (
    <section className="bg-gray-3 dark:bg-gray-12/70 min-h-screen w-full p-5 pt-20 md:mx-auto">
      <div className="mx-auto grid items-start gap-5 md:w-11/12 md:grid-cols-10 md:p-8">
        {/* score section */}
        <div className="top-[20%] md:sticky md:col-span-3">
          <div className="bg-bg-gray-1 dark:bg-gray-12/5 border-gray-5 dark:border-gray-11/40 flex flex-col items-center justify-center rounded-xl border py-2 md:w-[95%]">
            {/* actual score */}
            <div className="border-b-gray-4 dark:border-b-gray-11/50 box-border w-11/12 border-b p-5 text-center md:p-8">
              <h3 className="text-gray-12 dark:text-gray-3 text-[1.3rem] font-medium md:text-[1.5rem]">
                Your Score
              </h3>
              <div style={{ color }} className="mt-2 text-[1.3rem] font-semibold md:text-[1.5rem]">
                {Math.round(analysis.atsResult.score) || 0}
                <span>/100</span>
              </div>
            </div>
            {/* overview for score */}
            <div className="mt-5 w-11/12 p-4">
              {breakdown && (
                <div className="flex flex-col gap-4">
                  {progressBarConfig.map(({ key, label }, index) => {
                    const percentage = breakdown[key]?.percentage ?? 0;
                    return (
                      <ProgressBar
                        key={key}
                        percentage={percentage}
                        color={getScoreColor(percentage, isDark)}
                        type={label}
                        delay={index * 50}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* review section */}
        <div className="bg-blue-5/50 border-gray-5 dark:border-gray-11/40 dark:bg-blue-12/30 text-gray-12/90 dark:text-gray-4 mx-auto mt-5 box-border w-full rounded-xl border p-5 font-medium md:col-span-7 md:mt-0 md:p-8">
          <div className="bg-bg-gray-1 dark:bg-gray-12 box-border rounded-xl md:p-5">
            <h3 className="text-gray-12/90 dark:text-gray-3 p-2 text-[1.2rem] font-semibold md:text-[1.3rem]">
              ATS Parse Rate
            </h3>
            <p className="mt-3 p-2 text-[.9rem] md:text-[1rem]">
              An <strong>Applicant Tracking System</strong> (ATS) is software recruiters use to scan
              and sort large numbers of resumes. A high ATS parse rate means your resume is easy for
              these systems to read, so your skills and experience are captured correctly-making it
              more likely your resume reaches a recruiter.
            </p>
            <div className="no-scrollbar mt-6 rounded-xl">
              <div className="p-2">Your resume</div>
              {file?.type === "application/pdf" && <PdfOnlyPreview file={file} />}

              {file?.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                <DocxPreview file={file} />
              )}
            </div>
          </div>

          <pre>{JSON.stringify(aiBreakdown, null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}

export default ResumeAnalysisResult;
