import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";

// Types for the analysis data
interface WorkingItem {
  title: string;
  whatsStrong: string;
  whyItMatters: string;
  advantage: string;
}

interface HurtingItem {
  title: string;
  issue: string;
  typicalMistake: string;
  betterApproach: string;
  atsImpact: string;
  difficulty: string;
}

interface FixPlanItem {
  priority: number;
  action: string;
  howToDoIt: string;
  exampleOld: string;
  exampleNew: string;
  expectedOutcome: string;
  time: string;
  impactLevel: string;
}

interface AnalysisData {
  finalVerdict: string;
  working: WorkingItem[];
  hurting: HurtingItem[];
  fixPlan: FixPlanItem[];
}

// Sample data (replace with your actual data)
const sampleData: AnalysisData = {
  finalVerdict:
    "The resume scored 75 out of 100, indicating a very good overall quality. This score range typically reflects a well-structured and informative resume that effectively communicates the candidate's experience and skills.",
  working: [
    {
      title: "Strong Technical Keywords",
      whatsStrong:
        "The resume demonstrates a robust understanding of industry-standard terminology, with keywords like 'cloud computing' and 'data analytics' prominently featured.",
      whyItMatters:
        "ATS algorithms assign higher relevance scores to resumes with industry-standard terminology, as it indicates the candidate's ability to understand and work with specific technologies and tools.",
      advantage:
        "By leveraging strong technical keywords, the candidate can increase their callback rate by 18% and improve their chances of passing initial screenings by 22%.",
    },
  ],
  hurting: [
    {
      title: "Missing Quantifiable Achievements",
      issue:
        "The resume lacks specific, quantifiable achievements in the experience section, making it difficult for recruiters to understand the candidate's impact and value.",
      typicalMistake:
        "The candidate lists responsibilities without providing concrete metrics or outcomes, such as 'managed a team' without specifying the team size or achievements.",
      betterApproach:
        "Instead, the candidate could provide specific, measurable achievements, such as 'managed a team of 8 engineers, resulting in a 25% increase in project delivery speed and a 30% reduction in defects'.",
      atsImpact:
        "The lack of quantifiable achievements can reduce the ATS score by 8-12 points, as the algorithm struggles to match the candidate's experience with the job requirements.",
      difficulty:
        "MEDIUM - The candidate needs to review their experience and add specific metrics and outcomes to each entry. Estimated time: 1-2 hours.",
    },
  ],
  fixPlan: [
    {
      priority: 1,
      action: "Add Quantifiable Metrics to Experience",
      howToDoIt:
        "Review each experience entry and add specific, measurable achievements, such as 'increased sales by 25% in 6 months' or 'reduced project delivery time by 30%'.",
      exampleOld: "Managed a team of engineers",
      exampleNew:
        "Managed a team of 8 engineers, resulting in a 25% increase in project delivery speed and a 30% reduction in defects.",
      expectedOutcome:
        "Should increase score from 75 to 82-85 by improving keyword density from 45% to 68% and adding measurable achievements.",
      time: "1-2 hours",
      impactLevel: "HIGH",
    },
  ],
};

const ResumeAnalysisDisplay = () => {
  const [activeTab, setActiveTab] = useState<"strengths" | "weaknesses" | "improvements">(
    "strengths",
  );
  const data = sampleData;

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.startsWith("EASY")) return "text-green-600 dark:text-green-400";
    if (difficulty.startsWith("MEDIUM")) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes("HIGH"))
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    if (impact.includes("MEDIUM"))
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      {/* Final Verdict Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Overall Assessment
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">{data.finalVerdict}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab("strengths")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "strengths"
                  ? "border-b-2 border-green-600 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Strengths ({data.working.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("weaknesses")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "weaknesses"
                  ? "border-b-2 border-red-600 bg-red-50 text-red-600 dark:border-red-400 dark:bg-red-900/20 dark:text-red-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle className="h-5 w-5" />
                Weaknesses ({data.hurting.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("improvements")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "improvements"
                  ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Action Plan ({data.fixPlan.length})
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Strengths Tab */}
          {activeTab === "strengths" && (
            <div className="space-y-6">
              {data.working.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h3>
                  </div>

                  <div className="ml-9 space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">
                        What's Strong
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.whatsStrong}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">
                        Why It Matters
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.whyItMatters}
                      </p>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-white p-4 dark:border-green-700 dark:bg-gray-800">
                      <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">
                        Your Advantage
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.advantage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Weaknesses Tab */}
          {activeTab === "weaknesses" && (
            <div className="space-y-6">
              {data.hurting.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <XCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}
                      >
                        {item.difficulty.split(" - ")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="ml-9 space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">
                        The Issue
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.issue}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">
                        Typical Mistake
                      </h4>
                      <p className="leading-relaxed text-gray-700 italic dark:text-gray-300">
                        {item.typicalMistake}
                      </p>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-white p-4 dark:border-red-700 dark:bg-gray-800">
                      <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">
                        Better Approach
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.betterApproach}
                      </p>
                    </div>

                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
                      <h4 className="mb-2 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        ATS Impact
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.atsImpact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Improvements Tab */}
          {activeTab === "improvements" && (
            <div className="space-y-6">
              {data.fixPlan.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white dark:bg-blue-500">
                      {item.priority}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {item.action}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${getImpactColor(item.impactLevel)}`}
                        >
                          {item.impactLevel} Impact
                        </span>
                        <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-11 space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                        How to Do It
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.howToDoIt}
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
                        <h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">
                          ❌ Before
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.exampleOld}
                        </p>
                      </div>

                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
                        <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300">
                          ✓ After
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.exampleNew}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-700 dark:bg-gray-800">
                      <h4 className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                        Expected Outcome
                      </h4>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.expectedOutcome}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisDisplay;
