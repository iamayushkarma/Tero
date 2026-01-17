import { useLayoutEffect } from "react";
import {
  CheckCircle2,
  FileText,
  Search,
  Zap,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type ResumeGuideProps = {
  className?: string;
};

export default function ResumeGuidePage({ className = "" }: ResumeGuideProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const guideSteps = [
    {
      number: "1",
      title: "Choose the Right Format",
      icon: <FileText className="size-6" />,
      description:
        "Select a format that best showcases your experience and fits your career stage.",
      details: [
        "Chronological: Best for steady career progression",
        "Functional: Emphasizes skills over work history",
        "Combination: Balances skills and experience",
        "ATS-friendly templates are essential for modern job hunting",
      ],
    },
    {
      title: "Craft Your Header",
      icon: <Sparkles className="size-6" />,
      number: "2",
      description: "Create a professional header with essential contact information.",
      details: [
        "Full name in large, professional font",
        "Phone number and professional email address",
        "LinkedIn profile URL (make sure it's updated)",
        "City and state (full address not necessary)",
      ],
    },
    {
      number: "3",
      title: "Write Your Summary",
      icon: <BookOpen className="size-6" />,
      description: "Create a compelling professional summary that hooks the reader immediately.",
      details: [
        "2-3 sentences highlighting your expertise",
        "Include years of experience and key specializations",
        "Mention your most impressive achievement or credential",
        "Tailor it to align with your target role",
      ],
    },
    {
      number: "4",
      title: "Detail Your Experience",
      icon: <Award className="size-6" />,
      description: "Showcase your work history with impact-driven bullet points.",
      details: [
        "List positions in reverse chronological order",
        "Use action verbs to start each bullet point",
        "Quantify achievements with numbers and percentages",
        "Focus on results and impact, not just duties",
      ],
    },
    {
      number: "5",
      title: "Highlight Your Skills",
      icon: <Target className="size-6" />,
      description: "Create a strategic skills section that matches job requirements.",
      details: [
        "Include both technical and soft skills",
        "Match keywords from the job description",
        "Group similar skills into categories",
        "Be honest about proficiency levels",
      ],
    },
    {
      number: "6",
      title: "Add Education & Certifications",
      icon: <TrendingUp className="size-6" />,
      description: "List your educational background and relevant certifications.",
      details: [
        "Degree, institution, and graduation year",
        "Relevant certifications with issuing organizations",
        "Honors, awards, or notable achievements",
        "Relevant coursework for entry-level positions",
      ],
    },
    {
      number: "7",
      title: "Optimize for ATS",
      icon: <Search className="size-6" />,
      description: "Ensure your resume passes applicant tracking systems.",
      details: [
        "Use standard section headings and simple formatting",
        "Incorporate keywords from job descriptions",
        "Avoid tables, images, and complex layouts",
        "Save as PDF to preserve formatting",
      ],
    },
    {
      number: "8",
      title: "Review & Refine",
      icon: <Zap className="size-6" />,
      description: "Polish your resume to perfection before submitting.",
      details: [
        "Proofread multiple times for errors",
        "Get feedback from trusted colleagues",
        "Test your resume with ATS scanners",
        "Customize for each job application",
      ],
    },
  ];

  const resumeSections = [
    {
      section: "Contact Information",
      priority: "Essential",
      tips: "Keep it professional and current. Use a professional email address, not something like partyguy123@email.com. Include LinkedIn if your profile is polished and up-to-date.",
    },
    {
      section: "Professional Summary",
      priority: "Highly Recommended",
      tips: "Your elevator pitch on paper. This is your chance to immediately show value. Focus on what makes you unique and relevant to the target role.",
    },
    {
      section: "Work Experience",
      priority: "Essential",
      tips: "The heart of your resume. Use the PAR method: Problem, Action, Result. Each bullet should tell a mini-story of your impact.",
    },
    {
      section: "Skills",
      priority: "Essential",
      tips: "Strategic keyword placement. This section helps with ATS scanning and gives recruiters a quick snapshot of your capabilities.",
    },
    {
      section: "Education",
      priority: "Essential",
      tips: "List degrees and institutions. Recent graduates can include relevant coursework and academic achievements. Experienced professionals can keep this brief.",
    },
    {
      section: "Certifications",
      priority: "Recommended",
      tips: "Industry credentials that validate your expertise. Include issuing organization and expiration dates if applicable.",
    },
    {
      section: "Projects/Portfolio",
      priority: "Optional",
      tips: "Especially valuable for technical roles, designers, and creatives. Link to online portfolios or describe significant projects.",
    },
    {
      section: "Volunteer Experience",
      priority: "Optional",
      tips: "Shows character and can fill employment gaps. Treat it like work experience if it's relevant to your target role.",
    },
  ];

  const formatComparison = [
    {
      format: "Chronological",
      bestFor: "Steady career progression, traditional industries",
      pros: ["Easy to follow", "Highlights career growth", "Most familiar to recruiters"],
      cons: ["Exposes employment gaps", "Less effective for career changers"],
    },
    {
      format: "Functional",
      bestFor: "Career changers, employment gaps, diverse experience",
      pros: ["Emphasizes skills over timeline", "Hides gaps", "Flexible organization"],
      cons: ["Less familiar format", "Some recruiters distrust it", "ATS may struggle"],
    },
    {
      format: "Combination",
      bestFor: "Experienced professionals, technical roles",
      pros: ["Best of both worlds", "Shows skills and history", "Very comprehensive"],
      cons: ["Can be longer", "Requires careful balance", "More complex to create"],
    },
  ];

  const writingFormulas = [
    {
      formula: "PAR Method",
      stands: "Problem → Action → Result",
      example:
        "Identified 20% decline in customer retention (Problem) → Implemented new onboarding program (Action) → Increased retention by 35% in 6 months (Result)",
    },
    {
      formula: "CAR Method",
      stands: "Challenge → Action → Result",
      example:
        "Faced tight deadline for product launch (Challenge) → Led cross-functional team of 8 (Action) → Delivered 2 weeks early, exceeding quality targets (Result)",
    },
    {
      formula: "STAR Method",
      stands: "Situation → Task → Action → Result",
      example:
        "During system migration (Situation), tasked with data integrity (Task) → Developed automated validation scripts (Action) → Achieved 99.9% accuracy (Result)",
    },
  ];

  const actionVerbs = [
    {
      category: "Leadership",
      verbs: ["Led", "Directed", "Managed", "Coordinated", "Supervised", "Orchestrated"],
    },
    {
      category: "Achievement",
      verbs: ["Achieved", "Exceeded", "Delivered", "Accomplished", "Attained", "Surpassed"],
    },
    {
      category: "Improvement",
      verbs: ["Improved", "Enhanced", "Optimized", "Streamlined", "Transformed", "Revitalized"],
    },
    {
      category: "Creation",
      verbs: ["Developed", "Created", "Designed", "Built", "Established", "Launched"],
    },
    {
      category: "Analysis",
      verbs: ["Analyzed", "Evaluated", "Assessed", "Researched", "Investigated", "Examined"],
    },
    {
      category: "Communication",
      verbs: [
        "Presented",
        "Communicated",
        "Collaborated",
        "Negotiated",
        "Facilitated",
        "Influenced",
      ],
    },
  ];

  const dosAndDonts = [
    {
      category: "Content",
      dos: [
        "Use specific numbers and metrics",
        "Tailor resume to each job",
        "Focus on achievements",
      ],
      donts: [
        "Use generic descriptions",
        "Include irrelevant information",
        "List responsibilities only",
      ],
    },
    {
      category: "Format",
      dos: ["Keep it clean and scannable", "Use consistent formatting", "Stick to 1-2 pages"],
      donts: [
        "Use multiple fonts/colors",
        "Include tables or columns",
        "Make it visually cluttered",
      ],
    },
    {
      category: "Language",
      dos: ["Start with action verbs", "Use industry terminology", "Write concisely"],
      donts: ["Use passive voice", "Include personal pronouns", "Write in paragraph form"],
    },
  ];

  return (
    <>
      <div className="relative mt-15 flex h-60 flex-col items-center justify-center p-10 md:h-75">
        <div className="from-blue-3/50 dark:from-dark-blue-3/50 pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-gray-12 dark:text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Complete Resume Writing Guide
          </h1>
          <p className="text-gray-11 dark:text-dark-gray-11 mt-2 max-w-2xl text-center text-sm">
            Your comprehensive roadmap to creating a professional, ATS-friendly resume that lands
            interviews
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
                  Follow this guide, then test your resume
                </h2>
                <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                  Once you've created your resume using this guide, scan it with Tero to ensure it's
                  optimized for success.
                </p>
              </div>
              <a
                href="/"
                className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-3 font-medium whitespace-nowrap text-white transition-colors"
              >
                Test Your Resume
              </a>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              8-Step Resume Creation Process
            </h2>
            <div className="space-y-6">
              {guideSteps.map((step, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary flex size-12 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-white">
                        {step.number}
                      </div>
                      <div className="text-primary mt-2">{step.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-xl font-semibold">
                        {step.title}
                      </h3>
                      <p className="text-gray-11 dark:text-dark-gray-11 mb-4 text-sm">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, dIndex) => (
                          <li
                            key={dIndex}
                            className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                          >
                            <ArrowRight className="text-primary mt-0.5 size-4 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Resume Sections Overview */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Resume Sections Explained
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {resumeSections.map((item, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-gray-12 dark:text-dark-gray-12 text-lg font-semibold">
                      {item.section}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.priority === "Essential"
                          ? "bg-red-3 text-red-11 dark:bg-dark-red-3 dark:text-dark-red-11"
                          : item.priority === "Highly Recommended"
                            ? "bg-blue-3 text-blue-11 dark:bg-dark-blue-3 dark:text-dark-blue-11"
                            : "bg-gray-3 text-gray-11 dark:bg-dark-gray-3 dark:text-dark-gray-11"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">{item.tips}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Format Comparison */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Choose Your Resume Format
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {formatComparison.map((format, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                >
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-xl font-semibold">
                    {format.format}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 mb-4 text-sm font-medium">
                    Best for: {format.bestFor}
                  </p>
                  <div className="mb-4">
                    <h4 className="text-success-text mb-2 text-sm font-semibold">Pros:</h4>
                    <ul className="space-y-1">
                      {format.pros.map((pro, pIndex) => (
                        <li
                          key={pIndex}
                          className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                        >
                          <CheckCircle2 className="text-success-text mt-0.5 size-4 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-error mb-2 text-sm font-semibold">Cons:</h4>
                    <ul className="space-y-1">
                      {format.cons.map((con, cIndex) => (
                        <li
                          key={cIndex}
                          className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                        >
                          <span className="text-error mt-0.5 flex-shrink-0">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Writing Formulas */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Proven Writing Formulas
            </h2>
            <div className="space-y-4">
              {writingFormulas.map((formula, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                >
                  <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-gray-12 dark:text-dark-gray-12 text-lg font-semibold">
                      {formula.formula}
                    </h3>
                    <span className="bg-blue-3 text-blue-11 dark:bg-dark-blue-3 dark:text-dark-blue-11 w-fit rounded-full px-3 py-1 font-mono text-xs font-semibold">
                      {formula.stands}
                    </span>
                  </div>
                  <div className="bg-gray-3 dark:bg-dark-gray-3 rounded-lg p-4">
                    <p className="text-gray-11 dark:text-dark-gray-11 text-sm italic">
                      "{formula.example}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Verbs */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Powerful Action Verbs by Category
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {actionVerbs.map((category, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                >
                  <h3 className="text-primary mb-3 font-semibold">{category.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.verbs.map((verb, vIndex) => (
                      <span
                        key={vIndex}
                        className="bg-gray-3 text-gray-11 dark:bg-dark-gray-3 dark:text-dark-gray-11 rounded-md px-3 py-1 text-sm"
                      >
                        {verb}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Do's and Don'ts */}
          <section className="mb-12">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold">
              Resume Do's and Don'ts
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {dosAndDonts.map((item, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                >
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-4 text-lg font-semibold">
                    {item.category}
                  </h3>
                  <div className="mb-4">
                    <h4 className="text-success-text mb-2 flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="size-4" />
                      Do:
                    </h4>
                    <ul className="space-y-2">
                      {item.dos.map((doItem, dIndex) => (
                        <li
                          key={dIndex}
                          className="text-gray-11 dark:text-dark-gray-11 pl-6 text-sm"
                        >
                          • {doItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-error mb-2 flex items-center gap-2 text-sm font-semibold">
                      <span className="flex size-4 items-center justify-center rounded-full border-2 border-current text-xs font-bold">
                        ✕
                      </span>
                      Don't:
                    </h4>
                    <ul className="space-y-2">
                      {item.donts.map((dontItem, dnIndex) => (
                        <li
                          key={dnIndex}
                          className="text-gray-11 dark:text-dark-gray-11 pl-6 text-sm"
                        >
                          • {dontItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8 text-center">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-2xl font-semibold">
              Put Your Knowledge Into Action
            </h2>
            <p className="text-gray-11 dark:text-dark-gray-11 mb-6 text-sm">
              Now that you know how to create an effective resume, use Tero to scan and optimize it
              for your target jobs.
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
