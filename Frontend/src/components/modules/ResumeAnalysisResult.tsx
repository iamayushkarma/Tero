import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import { useNavigate } from "react-router-dom";
import ResumeLoading from "../ui/ResumeLoading";
import { useTheme } from "../../hooks/useThemeContext";
import ProgressBar from "../ui/ProgressBar";
import { useLayoutEffect } from "react";
import { PdfOnlyPreview } from "../ui/PdfPreview";
import { DocxPreview } from "../ui/DocxPreview";
import { CheckCircle, FileText } from "lucide-react";
import ResumeAnalysisDisplay from "../ui/ResumeAnalysisDisplay";
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
        <div className="mt-20 rounded-lg border border-red-300 bg-red-50 p-4">
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
    <section className="bg-gray-3 dark:bg-gray-12/50 min-h-screen w-full p-5 pt-20 md:mx-auto">
      <div className="mx-auto grid w-full items-start gap-5 md:w-11/12 md:grid-cols-10 md:p-8">
        {/* score section */}
        <div className="md:sticky md:top-[20%] md:col-span-3">
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
        <div className="sm:bg-blue-5/50 sm:border-gray-5 sm:dark:border-gray-11/40 sm:dark:bg-blue-12/20 text-gray-12/90 dark:text-gray-4 mt-5 box-border w-full rounded-xl font-medium sm:border md:col-span-7 md:mt-0 md:p-8">
          <div className="border-gray-3 dark:bg-gray-12/90 bg-bg-gray-2 overflow-hidden rounded-xl border dark:border-gray-800">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ATS Compatibility
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    How well your resume works with Applicant Tracking Systems
                  </p>
                </div>
                {analysis?.atsResult?.parseRate && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 dark:border-green-800 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {Math.round(analysis.atsResult.parseRate)}% Parsed
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Description */}
              <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                <p>
                  Applicant Tracking Systems scan and extract information from your resume before a
                  recruiter sees it. A high parse rate ensures your qualifications are accurately
                  captured and matched to job requirements.
                </p>
              </div>

              {/* Resume Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Resume
                  </h4>
                  {file?.name && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>

                {/* Resume Preview Container */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  {file?.type === "application/pdf" && <PdfOnlyPreview file={file} />}
                  {file?.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                    <DocxPreview file={file} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* AI Analysis Display */}
          {aiBreakdown && (
            <ResumeAnalysisDisplay
              data={typeof aiBreakdown === "string" ? JSON.parse(aiBreakdown) : aiBreakdown}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ResumeAnalysisResult;
