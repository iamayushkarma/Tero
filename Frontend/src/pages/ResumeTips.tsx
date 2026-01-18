import { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CheckCircle2, Lightbulb, Target, Award, BookOpen, Users } from "lucide-react";

type ResumeTipsProps = {
  className?: string;
};

// Subtle, professional animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const scaleOnHover = {
  scale: 1.01,
  transition: { duration: 0.2 },
};

const cardHover = {
  y: -4,
  transition: { duration: 0.2 },
};

export default function ResumeTipsPage({ className = "" }: ResumeTipsProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const tipCategories = [
    {
      title: "Content & Writing",
      icon: <BookOpen className="size-6" />,
      description: "Craft compelling resume content that showcases your value",
      tips: [
        "Use the PAR method: Problem, Action, Result for each achievement",
        "Start each bullet with a powerful action verb",
        "Write in past tense for previous roles, present for current",
        "Remove personal pronouns (I, me, my) from descriptions",
        "Focus on achievements, not just responsibilities",
      ],
    },
    {
      title: "Skills & Keywords",
      icon: <Target className="size-6" />,
      description: "Highlight the right skills to match job requirements",
      tips: [
        "Create a dedicated skills section near the top",
        "Include both hard skills (technical) and soft skills (interpersonal)",
        "Match skill terminology exactly as used in job postings",
        "Group related skills into categories",
        "Include proficiency levels for technical skills when relevant",
      ],
    },
    {
      title: "Experience Presentation",
      icon: <Award className="size-6" />,
      description: "Present your work history for maximum impact",
      tips: [
        "List experiences in reverse chronological order",
        "Include 3-5 bullet points per role",
        "Emphasize promotions and career progression",
        "Use consistent date formatting throughout",
        "Include relevant volunteer work and side projects",
      ],
    },
  ];

  const expertTips = [
    {
      tip: "Lead with your strongest qualifications",
      explanation:
        "Place your most relevant experience and skills at the top where recruiters look first",
      category: "Structure",
      icon: <Lightbulb className="text-warning-text size-5" />,
    },
    {
      tip: "Quantify everything possible",
      explanation:
        "Numbers catch the eye and prove impact: revenue, percentages, team size, time saved",
      category: "Impact",
      icon: <Lightbulb className="text-warning-text size-5" />,
    },
    {
      tip: "Tailor your summary statement",
      explanation:
        "Write a brief 2-3 line summary that directly addresses the target role's requirements",
      category: "Customization",
      icon: <Lightbulb className="text-warning-text size-5" />,
    },
    {
      tip: "Remove outdated skills",
      explanation: "Focus on current, in-demand skills rather than obsolete technologies",
      category: "Relevance",
      icon: <Lightbulb className="text-warning-text size-5" />,
    },
    {
      tip: "Use industry-specific terminology",
      explanation:
        "Demonstrate you speak the language of your field with appropriate jargon and acronyms",
      category: "Language",
      icon: <Lightbulb className="text-warning-text size-5" />,
    },
    {
      tip: "Include relevant certifications",
      explanation:
        "Professional certifications can set you apart - list them prominently if job-relevant",
      category: "Credentials",
      icon: <Lightbulb className="text-warning-text size-5" />,
    },
  ];

  const sectionGuidelines = [
    {
      section: "Contact Information",
      guidelines: [
        "Include: Name, phone, email, LinkedIn, location (city/state)",
        "Use a professional email address",
        "Make sure LinkedIn profile is updated and matches resume",
        "Don't include: Full address, photo (unless required), age, marital status",
      ],
    },
    {
      section: "Professional Summary",
      guidelines: [
        "Keep it to 2-3 sentences maximum",
        "Highlight years of experience and key expertise",
        "Mention your target role or career goal",
        "Include 1-2 major achievements or unique qualifications",
      ],
    },
    {
      section: "Work Experience",
      guidelines: [
        "Include company name, location, job title, and dates",
        "Use bullet points, not paragraphs",
        "Focus on last 10-15 years of experience",
        "Explain employment gaps briefly if significant",
      ],
    },
    {
      section: "Education",
      guidelines: [
        "List degree, institution, graduation year",
        "Include GPA only if recent graduate and 3.5+",
        "Add relevant coursework for entry-level positions",
        "Certifications can go here or in separate section",
      ],
    },
  ];

  const industrySpecificTips = [
    {
      industry: "Technology",
      tips: "Highlight programming languages, frameworks, and tools. Include GitHub or portfolio links. Showcase projects and contributions to open source.",
    },
    {
      industry: "Marketing",
      tips: "Emphasize campaign results with metrics. Include social media growth numbers. Showcase creativity with portfolio examples and case studies.",
    },
    {
      industry: "Sales",
      tips: "Lead with quota attainment percentages. Show revenue growth and client acquisition numbers. Highlight awards and top performer rankings.",
    },
    {
      industry: "Healthcare",
      tips: "List relevant licenses and certifications prominently. Include patient care metrics. Mention specialized equipment or procedures mastered.",
    },
    {
      industry: "Finance",
      tips: "Showcase certifications (CFA, CPA). Quantify assets managed or savings achieved. Emphasize analytical tools and financial modeling skills.",
    },
    {
      industry: "Education",
      tips: "Highlight student outcomes and achievement data. Include curriculum development experience. Mention special programs or initiatives led.",
    },
  ];

  const commonQuestions = [
    {
      question: "How long should my resume be?",
      answer:
        "One page for 0-10 years experience, two pages for more extensive careers. Quality over quantity - every line should add value.",
    },
    {
      question: "Should I include a photo?",
      answer:
        "In the US, generally no unless specifically requested. In some countries (Germany, Spain), photos are standard practice.",
    },
    {
      question: "What about references?",
      answer:
        "Don't list references on your resume. Prepare a separate reference sheet to provide when requested during the interview process.",
    },
    {
      question: "How do I explain career gaps?",
      answer:
        "Be honest and brief. Focus on any productive activities during the gap - freelancing, education, caregiving, skill development.",
    },
    {
      question: "Should I include hobbies?",
      answer:
        "Only if they're relevant to the job or demonstrate valuable skills. Athletic achievements, leadership roles, or unique experiences can work.",
    },
  ];

  return (
    <>
      <motion.div
        className="relative mt-15 flex h-60 flex-col items-center justify-center p-10 md:h-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
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
            Expert Resume Tips
          </motion.h1>
          <motion.p
            className="text-gray-11 dark:text-dark-gray-11 mt-2 max-w-2xl text-center text-sm"
            variants={fadeInUp}
          >
            Professional insights and best practices to create a resume that stands out and gets
            results
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
            whileHover={scaleOnHover}
          >
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex-1">
                <h2 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-xl font-semibold">
                  Put these tips into action
                </h2>
                <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                  Use Tero to analyze your resume and get personalized recommendations based on your
                  target job.
                </p>
              </div>
              <motion.a
                href="/"
                className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-3 font-medium whitespace-nowrap text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Analyze My Resume
              </motion.a>
            </div>
          </motion.div>

          {/* Core Categories */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Essential Resume Writing Tips
            </motion.h2>
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {tipCategories.map((category, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                  variants={fadeInUp}
                  whileHover={cardHover}
                >
                  <motion.div
                    className="text-primary mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-lg font-semibold">
                    {category.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 mb-4 text-sm">
                    {category.description}
                  </p>
                  <motion.ul
                    className="space-y-2"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {category.tips.map((tip, tipIndex) => (
                      <motion.li
                        key={tipIndex}
                        className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                        variants={slideIn}
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

          {/* Expert Tips */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Expert Tips from Career Professionals
            </motion.h2>
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {expertTips.map((item, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                  variants={fadeInUp}
                  whileHover={cardHover}
                >
                  <div className="mb-3 flex items-start gap-3">
                    <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                      {item.icon}
                    </motion.div>
                    <div>
                      <span className="text-primary mb-1 block text-xs font-semibold uppercase">
                        {item.category}
                      </span>
                      <h3 className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                        {item.tip}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">{item.explanation}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Section Guidelines */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Resume Section Guidelines
            </motion.h2>
            <motion.div
              className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="grid gap-6 md:grid-cols-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {sectionGuidelines.map((section, index) => (
                  <motion.div
                    key={index}
                    className="border-gray-6 dark:border-dark-gray-6 rounded-lg border p-5"
                    variants={fadeIn}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-lg font-semibold">
                      {section.section}
                    </h3>
                    <motion.ul
                      className="space-y-2"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {section.guidelines.map((guideline, gIndex) => (
                        <motion.li
                          key={gIndex}
                          className="text-gray-11 dark:text-dark-gray-11 flex gap-2 text-sm"
                          variants={slideIn}
                        >
                          <CheckCircle2 className="text-success-text mt-0.5 size-4 flex-shrink-0" />
                          <span>{guideline}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Industry-Specific Tips */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Industry-Specific Advice
            </motion.h2>
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {industrySpecificTips.map((item, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-lg border p-5"
                  variants={fadeInUp}
                  whileHover={cardHover}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                      <Users className="text-primary size-5" />
                    </motion.div>
                    <h3 className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      {item.industry}
                    </h3>
                  </div>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">{item.tips}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-2xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 space-y-4 rounded-xl border p-6"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {commonQuestions.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border-gray-6 dark:border-dark-gray-6 rounded-lg border p-4"
                    variants={fadeIn}
                    whileHover={{
                      x: 4,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 font-semibold">
                      {item.question}
                    </h3>
                    <p className="text-gray-11 dark:text-dark-gray-11 text-sm">{item.answer}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Final CTA */}
          <motion.div
            className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={scaleOnHover}
          >
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-3 text-2xl font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Ready to Create Your Perfect Resume?
            </motion.h2>
            <motion.p
              className="text-gray-11 dark:text-dark-gray-11 mb-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Use Tero to apply these tips and get instant feedback on how your resume measures up
              against real job requirements.
            </motion.p>
            <motion.a
              href="/"
              className="bg-primary hover:bg-primary-hover inline-block rounded-lg px-8 py-3 font-semibold text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Get Started with Tero
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
