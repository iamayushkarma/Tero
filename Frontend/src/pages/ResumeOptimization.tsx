import { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, FileText, Zap } from "lucide-react";

type ResumeOptimizationProps = {
  className?: string;
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardHover = {
  scale: 1.02,
  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
  transition: { duration: 0.3 },
};

const iconFloat: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
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
      <motion.div
        className="relative mt-15 flex h-60 flex-col items-center justify-center p-10 md:h-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="from-blue-3/50 dark:from-dark-blue-3/50 pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b to-transparent"></div>
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-gray-12 dark:text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            Resume Optimization Guide
          </motion.h1>
          <motion.p
            className="text-gray-11 dark:text-dark-gray-11 mt-2 max-w-2xl text-center text-sm"
            variants={fadeInUp}
          >
            Master the art of creating ATS-friendly resumes that get you past automated filters and
            into the hands of hiring managers
          </motion.p>
        </motion.div>
      </motion.div>

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
          <motion.div
            className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 mb-12 rounded-xl border p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
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
              <motion.a
                href="/"
                className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-3 font-medium whitespace-nowrap text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Scanning Now
              </motion.a>
            </div>
          </motion.div>

          {/* Optimization Process Steps */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              5-Step Optimization Process
            </motion.h2>
            <motion.div
              className="grid gap-4 md:grid-cols-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-5"
                  variants={scaleIn}
                  whileHover={cardHover}
                >
                  <motion.div
                    className="bg-primary mb-3 flex size-10 items-center justify-center rounded-full text-xl font-bold text-white"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Optimization Strategies */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Key Optimization Strategies
            </motion.h2>
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {optimizationStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                  variants={slideInLeft}
                  whileHover={cardHover}
                >
                  <motion.div
                    className="text-primary mb-4"
                    variants={iconFloat}
                    initial="initial"
                    animate="animate"
                  >
                    {strategy.icon}
                  </motion.div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-lg font-semibold">
                    {strategy.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 mb-4 text-sm">
                    {strategy.description}
                  </p>
                  <motion.ul
                    className="space-y-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {strategy.tips.map((tip, tipIndex) => (
                      <motion.li
                        key={tipIndex}
                        className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                        variants={fadeInUp}
                      >
                        <CheckCircle2 className="text-success-text mt-0.5 size-4 flex-shrink-0" />
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Common Mistakes to Avoid
            </motion.h2>
            <motion.div
              className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="grid gap-4 md:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {commonMistakes.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border-gray-6 dark:border-dark-gray-6 rounded-lg border p-4"
                    variants={slideInRight}
                    whileHover={{
                      scale: 1.02,
                      borderColor: "rgba(239, 68, 68, 0.3)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
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
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Best Practices */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Best Practices for Success
            </motion.h2>
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {bestPractices.map((item, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(34, 197, 94, 0.3)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="mb-3 flex items-start gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      {item.practice}
                    </h3>
                  </div>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Pro Tips */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 rounded-xl border p-6"
              whileHover={{ scale: 1.01 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AlertCircle className="text-primary size-6" />
                </motion.div>
                <h2 className="text-gray-12 dark:text-dark-gray-12 text-xl font-semibold">
                  Pro Tips from Tero
                </h2>
              </div>
              <motion.ul
                className="text-gray-11 dark:text-dark-gray-11 space-y-3 text-sm"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.li className="flex gap-2" variants={fadeInUp}>
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Target 70%+ keyword match:</strong> Aim for at least 70% match with job
                    description keywords for best results
                  </span>
                </motion.li>
                <motion.li className="flex gap-2" variants={fadeInUp}>
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Use Tero before each application:</strong> Even small changes in job
                    descriptions matter - scan every time
                  </span>
                </motion.li>
                <motion.li className="flex gap-2" variants={fadeInUp}>
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Keep multiple versions:</strong> Maintain 2-3 resume versions for
                    different job types, then customize further
                  </span>
                </motion.li>
                <motion.li className="flex gap-2" variants={fadeInUp}>
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Check readability:</strong> Your resume should still read naturally to
                    humans - don't over-optimize
                  </span>
                </motion.li>
                <motion.li className="flex gap-2" variants={fadeInUp}>
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Update regularly:</strong> Refresh your resume every 3-6 months with new
                    skills and achievements
                  </span>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.section>

          {/* Final CTA */}
          <motion.div
            className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.3 },
            }}
          >
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-3 text-2xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Start Optimizing Your Resume Today
            </motion.h2>
            <motion.p
              className="text-gray-11 dark:text-dark-gray-11 mb-6 text-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Get instant feedback on your resume and discover exactly what you need to improve to
              pass ATS filters.
            </motion.p>
            <motion.a
              href="/"
              className="bg-primary hover:bg-primary-hover inline-block rounded-lg px-8 py-3 font-semibold text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Scan Your Resume Now
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
