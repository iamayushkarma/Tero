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

interface ResumeAnalysisDisplayProps {
  data: AnalysisData;
}

const ResumeAnalysisDisplay = ({ data }: ResumeAnalysisDisplayProps) => {
  const [activeTab, setActiveTab] = useState<"strengths" | "weaknesses" | "improvements">(
    "strengths",
  );

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.startsWith("EASY")) return "text-green-600 dark:text-green-400";
    if (difficulty.startsWith("MEDIUM")) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes("HIGH"))
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    if (impact.includes("MEDIUM"))
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-3 p-2 sm:space-y-4 sm:p-4 md:space-y-6 md:p-6">
      {/* Final Verdict Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-5 md:p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 sm:mt-1 sm:h-6 sm:w-6 dark:text-blue-400" />
          <div>
            <h2 className="mb-1.5 text-base font-semibold text-gray-900 sm:mb-2 sm:text-lg md:mb-3 md:text-xl dark:text-gray-100">
              Overall Assessment
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base dark:text-gray-300">
              {data.finalVerdict}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm sm:rounded-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3">
            <button
              onClick={() => setActiveTab("strengths")}
              className={`px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base ${
                activeTab === "strengths"
                  ? "border-b-2 border-blue-600 bg-gray-50 text-gray-900 dark:border-blue-400 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="xs:inline hidden sm:hidden">Str.</span>
                <span className="hidden sm:inline">Strengths</span>
                <span className="xs:text-xs text-[10px] sm:text-sm">({data.working.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("weaknesses")}
              className={`px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base ${
                activeTab === "weaknesses"
                  ? "border-b-2 border-blue-600 bg-gray-50 text-gray-900 dark:border-blue-400 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="xs:inline hidden sm:hidden">Weak.</span>
                <span className="hidden sm:inline">Weaknesses</span>
                <span className="xs:text-xs text-[10px] sm:text-sm">({data.hurting.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("improvements")}
              className={`px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base ${
                activeTab === "improvements"
                  ? "border-b-2 border-blue-600 bg-gray-50 text-gray-900 dark:border-blue-400 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="xs:inline hidden sm:hidden">Plan</span>
                <span className="hidden sm:inline">Action Plan</span>
                <span className="xs:text-xs text-[10px] sm:text-sm">({data.fixPlan.length})</span>
              </div>
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {/* Strengths Tab */}
          {activeTab === "strengths" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {data.working.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 md:p-6 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 sm:mt-1 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:text-green-400" />
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base md:text-lg dark:text-gray-100">
                      {item.title}
                    </h3>
                  </div>
                  <div className="ml-0 space-y-2.5 sm:ml-8 sm:space-y-3 md:ml-9 md:space-y-4">
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        What's Strong
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
                        {item.whatsStrong}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        Why It Matters
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
                        {item.whyItMatters}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-white p-2.5 sm:rounded-lg sm:p-3 md:p-4 dark:border-gray-600 dark:bg-gray-800">
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        Your Advantage
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
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
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {data.hurting.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 md:p-6 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 sm:mt-1 sm:h-5 sm:w-5 md:h-6 md:w-6 dark:text-red-400" />
                    <div className="flex-1">
                      <h3 className="mb-1.5 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-base md:text-lg dark:text-gray-100">
                        {item.title}
                      </h3>
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:py-1 sm:text-xs ${getDifficultyColor(item.difficulty)}`}
                      >
                        {item.difficulty.split(" - ")[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-0 space-y-2.5 sm:ml-8 sm:space-y-3 md:ml-9 md:space-y-4">
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        The Issue
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
                        {item.issue}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        Typical Mistake
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 italic sm:text-sm md:text-base dark:text-gray-400">
                        {item.typicalMistake}
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-white p-2.5 sm:rounded-lg sm:p-3 md:p-4 dark:border-gray-600 dark:bg-gray-800">
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        Better Approach
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
                        {item.betterApproach}
                      </p>
                    </div>
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 sm:rounded-lg sm:p-3 md:p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                      <h4 className="mb-1 text-xs font-semibold text-amber-900 sm:mb-1.5 sm:text-sm dark:text-amber-300">
                        ATS Impact
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-700 sm:text-sm md:text-base dark:text-gray-300">
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
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {data.fixPlan.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4 md:p-6 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white sm:h-7 sm:w-7 sm:text-sm md:h-8 md:w-8 md:text-base dark:bg-blue-500">
                      {item.priority}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1.5 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-base md:text-lg dark:text-gray-100">
                        {item.action}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:py-1 sm:text-xs ${getImpactColor(item.impactLevel)}`}
                        >
                          {item.impactLevel} Impact
                        </span>
                        <span className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 sm:px-2 sm:py-1 sm:text-xs dark:bg-gray-700 dark:text-gray-300">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-0 space-y-2.5 sm:ml-10 sm:space-y-3 md:ml-11 md:space-y-4">
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        How to Do It
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
                        {item.howToDoIt}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-gray-300 bg-white p-2.5 sm:rounded-lg sm:p-3 md:p-4 dark:border-gray-600 dark:bg-gray-800">
                        <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                          ❌ Before
                        </h4>
                        <p className="text-[11px] leading-relaxed text-gray-600 sm:text-xs md:text-sm dark:text-gray-400">
                          {item.exampleOld}
                        </p>
                      </div>
                      <div className="rounded-md border border-gray-300 bg-white p-2.5 sm:rounded-lg sm:p-3 md:p-4 dark:border-gray-600 dark:bg-gray-800">
                        <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                          ✓ After
                        </h4>
                        <p className="text-[11px] leading-relaxed text-gray-600 sm:text-xs md:text-sm dark:text-gray-400">
                          {item.exampleNew}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-white p-2.5 sm:rounded-lg sm:p-3 md:p-4 dark:border-gray-600 dark:bg-gray-800">
                      <h4 className="mb-1 text-xs font-semibold text-gray-700 sm:mb-1.5 sm:text-sm dark:text-gray-300">
                        Expected Outcome
                      </h4>
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
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
