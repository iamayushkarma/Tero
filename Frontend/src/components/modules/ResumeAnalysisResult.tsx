import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import { useNavigate } from "react-router-dom";
import ResumePreviewPanel from "../common/ResumePreviewPanel";
import ResumeLoading from "../ui/ResumeLoading";

function ResumeAnalysisResult() {
  const { status, analysis, jobRole, error, file } = useResumeAnalysis();
  const navigate = useNavigate();

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
    <section className="mt-15 rounded-lg border p-5">
      {file ? (
        // Two-column layout when file is available
        <div className="grid h-screen grid-cols-2 gap-4">
          {/* PDF Preview Column */}
          <div className="overflow-auto border-r pr-4">
            <ResumePreviewPanel file={file} />
          </div>

          {/* Analysis Results Column */}
          <div className="overflow-auto">
            <h2 className="text-xl font-semibold">Resume Analysis</h2>

            {jobRole && (
              <p className="mt-1 text-sm text-gray-600">
                Target Role: <strong>{jobRole}</strong>
              </p>
            )}

            {/* Score */}
            <div className="mt-4 flex items-center gap-4">
              <div className="text-3xl font-bold">{Math.round(analysis.score)}</div>
              <div className="text-gray-700 capitalize">{analysis.verdict}</div>
            </div>

            {/* AI Verdict */}
            <div className="mt-5">
              <h3 className="mb-2 font-semibold">AI Evaluation</h3>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {analysis.aiVerdict}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        // Single column layout when file is not available (after refresh)
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            Note: Resume preview is unavailable after page refresh. The analysis results are
            preserved below.
          </div>

          <h2 className="text-xl font-semibold">Resume Analysis</h2>

          {jobRole && (
            <p className="mt-1 text-sm text-gray-600">
              Target Role: <strong>{jobRole}</strong>
            </p>
          )}

          {/* Score */}
          <div className="mt-4 flex items-center gap-4">
            <div className="text-3xl font-bold">{Math.round(analysis.score)}</div>
            <div className="text-gray-700 capitalize">{analysis.verdict}</div>
          </div>

          {/* AI Verdict */}
          <div className="mt-5">
            <h3 className="mb-2 font-semibold">AI Evaluation</h3>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
              {analysis.aiVerdict}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResumeAnalysisResult;
