import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import { useNavigate } from "react-router-dom";
import ResumeLoading from "../ui/ResumeLoading";
import { useTheme } from "../../hooks/useThemeContext";
import ProgressBar from "../ui/ProgressBar";
import { useLayoutEffect } from "react";
import { PdfOnlyPreview } from "../ui/PdfPreview";
import { DocxPreview } from "../ui/DocxPreview";

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
    <section className="bg bg-gray-3 dark:bg-gray-12/70 min-h-screen p-5 pt-20">
      <div className="mx-auto grid p-4 md:w-11/12 md:grid-cols-10 md:p-8">
        {/* score section */}
        <div className="md:col-span-3">
          <div className="bg-bg-gray-2 dark:bg-gray-12/5 border-gray-5 dark:border-gray-11/40 flex flex-col items-center justify-center rounded-xl border py-2 md:w-[95%]">
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
        <div className="md:col-span-7">
          <div>
            {file?.type === "application/pdf" && <PdfOnlyPreview file={file} />}

            {file?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
              <DocxPreview file={file} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResumeAnalysisResult;
