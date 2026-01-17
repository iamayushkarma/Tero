import { useLayoutEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, FileText, Zap } from "lucide-react";

type ResumeOptimizationProps = {
  className?: string;
};

export default function ResumeOptimizationPage({ className = "" }: ResumeOptimizationProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const optimizationStrategies = [
    {
      title: "Keyword Optimization",
      icon: <FileText className="size-6" />,
      description: "Match your resume with job description keywords to pass ATS filters",
      tips: [
        "Extract key skills and requirements from the job description",
        "Use exact keyword phrases from the posting",
        "Include both acronyms and full terms (e.g., 'AI' and 'Artificial Intelligence')",
        "Naturally incorporate keywords throughout your resume",
        "Don't keyword stuff - maintain readability",
      ],
    },
    {
      title: "Format for ATS Compatibility",
      icon: <Zap className="size-6" />,
      description: "Ensure your resume format can be properly parsed by ATS systems",
      tips: [
        "Use standard section headings (Experience, Education, Skills)",
        "Stick to simple, clean layouts without tables or columns",
        "Avoid headers, footers, and text boxes",
        "Use standard fonts (Arial, Calibri, Times New Roman)",
        "Save as PDF to preserve formatting",
        "Avoid images, graphics, and logos in your resume content",
      ],
    },
    {
      title: "Quantify Your Achievements",
      icon: <TrendingUp className="size-6" />,
      description: "Use numbers and metrics to demonstrate your impact",
      tips: [
        "Include percentages, dollar amounts, and time frames",
        "Show results: 'Increased sales by 30%' vs 'Responsible for sales'",
        "Quantify team size, budget managed, or projects completed",
        "Use action verbs followed by measurable outcomes",
        "Compare before/after metrics when possible",
      ],
    },
  ];

  const commonMistakes = [
    {
      mistake: "Using complex formatting",
      impact: "ATS can't parse tables, columns, or graphics",
      solution: "Use a simple, single-column layout with clear sections",
      icon: <XCircle className="text-error size-5" />,
    },
    {
      mistake: "Missing keywords from job description",
      impact: "Resume gets filtered out before human review",
      solution: "Mirror language from the job posting in your resume",
      icon: <XCircle className="text-error size-5" />,
    },
    {
      mistake: "Generic, one-size-fits-all resume",
      impact: "Doesn't align with specific job requirements",
      solution: "Customize your resume for each application",
      icon: <XCircle className="text-error size-5" />,
    },
    {
      mistake: "Vague job descriptions without metrics",
      impact: "Fails to demonstrate actual impact or results",
      solution: "Add numbers, percentages, and specific achievements",
      icon: <XCircle className="text-error size-5" />,
    },
    {
      mistake: "Using unconventional section names",
      impact: "ATS may not categorize information correctly",
      solution: "Stick to standard headings like 'Work Experience', 'Education'",
      icon: <XCircle className="text-error size-5" />,
    },
    {
      mistake: "Outdated or irrelevant information",
      impact: "Dilutes your strongest qualifications",
      solution: "Focus on recent, relevant experience (last 10-15 years)",
      icon: <XCircle className="text-error size-5" />,
    },
  ];

  const bestPractices = [
    {
      practice: "Tailor for each application",
      description: "Customize keywords and experiences to match the specific job",
      icon: <CheckCircle2 className="text-success-text size-5" />,
    },
    {
      practice: "Use action verbs",
      description: "Start bullet points with strong verbs (Led, Achieved, Developed, Implemented)",
      icon: <CheckCircle2 className="text-success-text size-5" />,
    },
    {
      practice: "Keep it concise",
      description: "1-2 pages maximum, focus on most relevant information",
      icon: <CheckCircle2 className="text-success-text size-5" />,
    },
    {
      practice: "Include a skills section",
      description: "List technical and soft skills relevant to the position",
      icon: <CheckCircle2 className="text-success-text size-5" />,
    },
    {
      practice: "Proofread thoroughly",
      description: "Spelling and grammar errors can instantly disqualify you",
      icon: <CheckCircle2 className="text-success-text size-5" />,
    },
    {
      practice: "Use consistent formatting",
      description: "Maintain uniform fonts, spacing, and bullet styles throughout",
      icon: <CheckCircle2 className="text-success-text size-5" />,
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Analyze the Job Description",
      description: "Identify key requirements, skills, and qualifications mentioned in the posting",
    },
    {
      number: "2",
      title: "Update Your Resume",
      description: "Incorporate relevant keywords and tailor your experience to match the role",
    },
    {
      number: "3",
      title: "Scan with Tero",
      description: "Upload your resume and job description to get your ATS compatibility score",
    },
    {
      number: "4",
      title: "Review Recommendations",
      description: "Follow Tero's suggestions to improve keyword matching and formatting",
    },
    {
      number: "5",
      title: "Refine and Re-scan",
      description: "Make improvements and scan again until you achieve a high score",
    },
  ];

  return (
    <>
      <div className="relative mt-15 flex h-60 flex-col items-center justify-center p-10 md:h-75">
        <div className="from-blue-3/50 dark:from-dark-blue-3/50 pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-gray-12 dark:text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Resume Optimization Guide
          </h1>
          <p className="text-gray-11 dark:text-dark-gray-11 mt-2 max-w-2xl text-center text-sm">
            Master the art of creating ATS-friendly resumes that get you past automated filters and
            into the hands of hiring managers
          </p>
        </div>
      </div>

      <div
        className={[
          "min-h-screen px-4 py-10",
          "bg-bg-gray-1 text-gray-12",
          "dark:bg-dark-bg-gray-1 dark:text-dark-gray-12",
          className,
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* CTA Box */}
          <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 mb-12 rounded-xl border p-6">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex-1">
                <h2 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-xl font-semibold">
                  Ready to optimize your resume?
                </h2>
                <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                  Use Tero to instantly analyze your resume against any job description and get
                  actionable recommendations.
                </p>
              </div>
              <a
                href="/"
                className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-3 font-medium whitespace-nowrap text-white transition-colors"
              >
                Start Scanning Now
              </a>
            </div>
          </div>

          {/* Optimization Process Steps */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              5-Step Optimization Process
            </h2>
            <div className="grid gap-4 md:grid-cols-5">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-5"
                >
                  <div className="bg-primary mb-3 flex size-10 items-center justify-center rounded-full text-xl font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Optimization Strategies */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Key Optimization Strategies
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {optimizationStrategies.map((strategy, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                >
                  <div className="text-primary mb-4">{strategy.icon}</div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-lg font-semibold">
                    {strategy.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 mb-4 text-sm">
                    {strategy.description}
                  </p>
                  <ul className="space-y-2">
                    {strategy.tips.map((tip, tipIndex) => (
                      <li
                        key={tipIndex}
                        className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                      >
                        <CheckCircle2 className="text-success-text mt-0.5 size-4 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Common Mistakes to Avoid
            </h2>
            <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {commonMistakes.map((item, index) => (
                  <div
                    key={index}
                    className="border-gray-6 dark:border-dark-gray-6 rounded-lg border p-4"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      {item.icon}
                      <h3 className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                        {item.mistake}
                      </h3>
                    </div>
                    <p className="text-gray-11 dark:text-dark-gray-11 mb-2 text-sm">
                      <strong>Impact:</strong> {item.impact}
                    </p>
                    <p className="text-success-text dark:text-dark-gray-11 text-sm">
                      <strong>Solution:</strong> {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Best Practices for Success
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bestPractices.map((item, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                >
                  <div className="mb-3 flex items-start gap-3">
                    {item.icon}
                    <h3 className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      {item.practice}
                    </h3>
                  </div>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pro Tips */}
          <section className="mb-12">
            <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 rounded-xl border p-6">
              <div className="mb-4 flex items-center gap-3">
                <AlertCircle className="text-primary size-6" />
                <h2 className="text-gray-12 dark:text-dark-gray-12 text-xl font-semibold">
                  Pro Tips from Tero
                </h2>
              </div>
              <ul className="text-gray-11 dark:text-dark-gray-11 space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Target 70%+ keyword match:</strong> Aim for at least 70% match with job
                    description keywords for best results
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Use Tero before each application:</strong> Even small changes in job
                    descriptions matter - scan every time
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Keep multiple versions:</strong> Maintain 2-3 resume versions for
                    different job types, then customize further
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Check readability:</strong> Your resume should still read naturally to
                    humans - don't over-optimize
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Update regularly:</strong> Refresh your resume every 3-6 months with new
                    skills and achievements
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Final CTA */}
          <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8 text-center">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-2xl font-semibold">
              Start Optimizing Your Resume Today
            </h2>
            <p className="text-gray-11 dark:text-dark-gray-11 mb-6 text-sm">
              Get instant feedback on your resume and discover exactly what you need to improve to
              pass ATS filters.
            </p>
            <a
              href="/"
              className="bg-primary hover:bg-primary-hover inline-block rounded-lg px-8 py-3 font-semibold text-white transition-colors"
            >
              Scan Your Resume Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
