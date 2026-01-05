import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import ResumeLoading from "../ui/ResumeLoading";
function ResumeAnalysisResult() {
  const { status, analysis, jobRole, error } = useResumeAnalysis();

  if (status === "idle") return null;

  if (status === "analyzing") {
    return <ResumeLoading />;
  }

  if (status === "error") {
    return (
      <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <section className="mt-6 rounded-lg border p-5">
      <h2 className="text-xl font-semibold">Resume Analysis</h2>

      {jobRole && (
        <p className="mt-1 text-sm text-gray-600">
          Target Role: <strong>{jobRole}</strong>
        </p>
      )}

      {/* Score */}
      <div className="mt-4 flex items-center gap-4">
        <div className="text-3xl font-bold">{Math.round(analysis.score)}%</div>
        <div className="text-gray-700 capitalize">{analysis.verdict}</div>
      </div>

      {/* AI Verdict */}
      <div className="mt-5">
        <h3 className="mb-2 font-semibold">AI Evaluation</h3>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
          {analysis.aiVerdict}
        </pre>
      </div>
    </section>
  );
}

export default ResumeAnalysisResult;
