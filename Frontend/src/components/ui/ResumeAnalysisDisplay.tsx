import { useLayoutEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const ResumeAnalysisDisplay = ({ data }: ResumeAnalysisDisplayProps) => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [activeTab, setActiveTab] = useState<"strengths" | "weaknesses" | "improvements">(
    "strengths",
  );

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.startsWith("EASY")) return "text-success-text dark:text-success-text/70";
    if (difficulty.startsWith("MEDIUM")) return "text-accent-gold dark:text-accent-gold/70";
    return "text-error dark:text-error/70";
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes("HIGH"))
      return "bg-error/10 dark:bg-error/15 text-error dark:text-error/80";
    if (impact.includes("MEDIUM"))
      return "bg-accent-gold/10 dark:bg-accent-gold/15 text-accent-gold dark:text-accent-gold/80";
    return "bg-primary/10 dark:bg-primary/15 text-primary dark:text-primary/80";
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-3 p-2 sm:space-y-4 sm:p-4 md:space-y-6 md:p-6">
      {/* Final Verdict Section */}
      <motion.div
        className="bg-bg-gray-2 dark:bg-dark-bg-gray-2 border-gray-6 dark:border-dark-gray-6 rounded-lg border p-3 shadow-sm sm:rounded-xl sm:p-5 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <AlertCircle className="text-primary dark:text-primary mt-0.5 h-5 w-5 shrink-0 sm:mt-1 sm:h-6 sm:w-6" />
          </motion.div>
          <div>
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-1.5 text-lg font-semibold sm:mb-2 sm:text-lg md:mb-3 md:text-xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Overall Assessment
            </motion.h2>
            <motion.p
              className="text-gray-11 dark:text-dark-gray-11 text-base leading-relaxed sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {data.finalVerdict}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="bg-bg-gray-2 dark:bg-dark-bg-gray-2 border-gray-6 dark:border-dark-gray-6 overflow-hidden rounded-lg border shadow-sm sm:rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="border-gray-6 dark:border-dark-gray-6 border-b">
          <div className="grid grid-cols-3">
            <motion.button
              onClick={() => setActiveTab("strengths")}
              className={`px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base ${
                activeTab === "strengths"
                  ? "border-primary dark:border-primary bg-gray-3 text-gray-12 dark:bg-dark-gray-3 dark:text-dark-gray-12 border-b-2"
                  : "text-gray-11 hover:bg-gray-3 hover:text-gray-12 dark:text-dark-gray-11 dark:hover:bg-dark-gray-3 dark:hover:text-dark-gray-12"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="xs:inline hidden sm:hidden">Str.</span>
                <span className="hidden sm:inline">Strengths</span>
                <span className="xs:text-xs text-[10px] sm:text-sm">({data.working.length})</span>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setActiveTab("weaknesses")}
              className={`px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base ${
                activeTab === "weaknesses"
                  ? "border-primary dark:border-primary bg-gray-3 text-gray-12 dark:bg-dark-gray-3 dark:text-dark-gray-12 border-b-2"
                  : "text-gray-11 hover:bg-gray-3 hover:text-gray-12 dark:text-dark-gray-11 dark:hover:bg-dark-gray-3 dark:hover:text-dark-gray-12"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="xs:inline hidden sm:hidden">Weak.</span>
                <span className="hidden sm:inline">Weaknesses</span>
                <span className="xs:text-xs text-[10px] sm:text-sm">({data.hurting.length})</span>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setActiveTab("improvements")}
              className={`px-2 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base ${
                activeTab === "improvements"
                  ? "border-primary dark:border-primary bg-gray-3 text-gray-12 dark:bg-dark-gray-3 dark:text-dark-gray-12 border-b-2"
                  : "text-gray-11 hover:bg-gray-3 hover:text-gray-12 dark:text-dark-gray-11 dark:hover:bg-dark-gray-3 dark:hover:text-dark-gray-12"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="xs:inline hidden sm:hidden">Plan</span>
                <span className="hidden sm:inline">Action Plan</span>
                <span className="xs:text-xs text-[10px] sm:text-sm">({data.fixPlan.length})</span>
              </div>
            </motion.button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Strengths Tab */}
              {activeTab === "strengths" && (
                <motion.div
                  className="space-y-3 sm:space-y-4 md:space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.working.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-bg-gray-1 dark:bg-dark-bg-gray-1 border-gray-6 dark:border-dark-gray-6 rounded-lg border p-3 sm:p-4 md:p-6"
                      variants={cardVariants}
                    >
                      <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                        <CheckCircle className="text-success-text dark:text-success-text/70 mt-0.5 h-4 w-4 shrink-0 sm:mt-1 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <h3 className="text-gray-12 dark:text-dark-gray-12 text-base font-semibold sm:text-base md:text-lg">
                          {item.title}
                        </h3>
                      </div>
                      <div className="ml-0 space-y-2.5 sm:ml-8 sm:space-y-3 md:ml-9 md:space-y-4">
                        <div>
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            What's Strong
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.whatsStrong}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            Why It Matters
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.whyItMatters}
                          </p>
                        </div>
                        <div className="bg-success-bg dark:bg-success-text/5 border-success-border dark:border-success-border/40 rounded-md border p-2.5 sm:rounded-lg sm:p-3 md:p-4">
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            Your Advantage
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.advantage}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Weaknesses Tab */}
              {activeTab === "weaknesses" && (
                <motion.div
                  className="space-y-3 sm:space-y-4 md:space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.hurting.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-bg-gray-1 dark:bg-dark-bg-gray-1 border-gray-6 dark:border-dark-gray-6 rounded-lg border p-3 sm:p-4 md:p-6"
                      variants={cardVariants}
                    >
                      <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                        <XCircle className="text-error dark:text-error/70 mt-0.5 h-4 w-4 shrink-0 sm:mt-1 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        <div className="flex-1">
                          <h3 className="text-gray-12 dark:text-dark-gray-12 mb-1.5 text-base font-semibold sm:mb-2 sm:text-base md:text-lg">
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
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            The Issue
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.issue}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            Typical Mistake
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed italic sm:text-sm md:text-base">
                            {item.typicalMistake}
                          </p>
                        </div>
                        <div className="bg-bg-gray-2 dark:bg-dark-bg-gray-2 border-gray-6 dark:border-dark-gray-6 rounded-md border p-2.5 sm:rounded-lg sm:p-3 md:p-4">
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            Better Approach
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.betterApproach}
                          </p>
                        </div>
                        <div className="bg-accent-gold/10 dark:bg-accent-gold/10 border-accent-gold/30 dark:border-accent-gold/25 rounded-md border p-2.5 sm:rounded-lg sm:p-3 md:p-4">
                          <h4 className="text-accent-gold dark:text-accent-gold/80 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            ATS Impact
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.atsImpact}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Improvements Tab */}
              {activeTab === "improvements" && (
                <motion.div
                  className="space-y-3 sm:space-y-4 md:space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.fixPlan.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-bg-gray-1 dark:bg-dark-bg-gray-1 border-gray-6 dark:border-dark-gray-6 rounded-lg border p-3 sm:p-4 md:p-6"
                      variants={cardVariants}
                    >
                      <div className="mb-2 flex items-start gap-2 sm:mb-3 sm:gap-3">
                        <motion.div
                          className="bg-primary dark:bg-primary/80 text-bg-gray-1 dark:text-dark-gray-12 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-sm md:h-8 md:w-8 md:text-base"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.priority}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-gray-12 dark:text-dark-gray-12 mb-1.5 text-base font-semibold sm:mb-2 sm:text-base md:text-lg">
                            {item.action}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:py-1 sm:text-xs ${getImpactColor(item.impactLevel)}`}
                            >
                              {item.impactLevel} Impact
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 ml-0 space-y-2.5 sm:ml-10 sm:space-y-3 md:ml-11 md:space-y-4">
                        <div>
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            How to Do It
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.howToDoIt}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2">
                          <div className="bg-bg-gray-2 dark:bg-dark-bg-gray-2 border-gray-6 dark:border-dark-gray-6 rounded-md border p-2.5 sm:rounded-lg sm:p-3 md:p-4">
                            <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                              ❌ Before
                            </h4>
                            <p className="text-gray-11 dark:text-dark-gray-11 text-xs leading-relaxed sm:text-xs md:text-sm">
                              {item.exampleOld}
                            </p>
                          </div>
                          <div className="bg-bg-gray-2 dark:bg-dark-bg-gray-2 border-gray-6 dark:border-dark-gray-6 rounded-md border p-2.5 sm:rounded-lg sm:p-3 md:p-4">
                            <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                              ✓ After
                            </h4>
                            <p className="text-gray-11 dark:text-dark-gray-11 text-xs leading-relaxed sm:text-xs md:text-sm">
                              {item.exampleNew}
                            </p>
                          </div>
                        </div>
                        <div className="bg-bg-gray-2 dark:bg-dark-bg-gray-2 border-gray-6 dark:border-dark-gray-6 rounded-md border p-2.5 sm:rounded-lg sm:p-3 md:p-4">
                          <h4 className="text-gray-11 dark:text-dark-gray-11 mb-1 text-sm font-semibold sm:mb-1.5 sm:text-sm">
                            Expected Outcome
                          </h4>
                          <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed sm:text-sm md:text-base">
                            {item.expectedOutcome}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeAnalysisDisplay;
