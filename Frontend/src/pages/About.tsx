import { useLayoutEffect } from "react";
import { Target, Zap, Shield, Heart, Users, TrendingUp, Award, Sparkles, Code } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type AboutPageProps = {
  className?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
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

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function AboutPage({ className = "" }: AboutPageProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  const values = [
    {
      title: "Transparency",
      description:
        "Clear, honest feedback. No hidden scores or confusing metrics. Just straightforward insights you can actually use.",
      icon: <Shield className="size-6" />,
    },
    {
      title: "Accessibility",
      description:
        "Everyone deserves a fair shot at getting their resume seen. We keep Tero simple and accessible for all job seekers.",
      icon: <Heart className="size-6" />,
    },
    {
      title: "Innovation",
      description:
        "ATS systems change constantly. We stay updated on the latest hiring tech to keep our advice relevant.",
      icon: <Sparkles className="size-6" />,
    },
    {
      title: "Results",
      description:
        "We focus on giving you practical advice that actually helps. More interviews and better responses matter most.",
      icon: <TrendingUp className="size-6" />,
    },
  ];

  const story = [
    {
      title: "The Problem",
      content:
        "Job seekers send out hundreds of applications but hear nothing back. Most don't realize their resumes get filtered out by ATS software before any human sees them. The whole process feels like a black box.",
    },
    {
      title: "The Solution",
      content:
        "Tero shows you exactly what ATS systems see in your resume. Compare it against real job descriptions and get specific feedback on what to fix. No guessing, just clear next steps.",
    },
    {
      title: "The Vision",
      content:
        "Keep improving Tero based on what actually works. Listen to user feedback, track hiring trends, and give everyone the same advantages that recruiters have.",
    },
  ];

  const features = [
    {
      title: "ATS Compatibility Check",
      description: "See if your resume format can actually be read by applicant tracking systems",
      icon: <Zap className="size-6" />,
    },
    {
      title: "Keyword Matching",
      description:
        "Find out which important keywords from the job description are missing from your resume",
      icon: <Target className="size-6" />,
    },
    {
      title: "Clear Recommendations",
      description: "Get specific suggestions on what to add, remove, or change in your resume",
      icon: <Award className="size-6" />,
    },
    {
      title: "Job-Specific Analysis",
      description:
        "Test your resume against different job descriptions to see how well it matches each one",
      icon: <Users className="size-6" />,
    },
  ];

  const creator = {
    title: "Built by Ayush Karma",
    description:
      "Tero was created by Ayush Karma after dealing with the frustrating ATS job application process. If you've ever sent out dozens of applications and heard nothing back, you know the feeling. Tero exists to show you what ATS systems actually see and what you need to change to get more responses.",
  };

  return (
    <>
      <motion.div
        className="relative mt-15 flex h-60 flex-col items-center justify-center p-10 md:h-75"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="from-blue-3/50 dark:from-dark-blue-3/50 pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.h1
            className="text-gray-12 dark:text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            About Tero
          </motion.h1>
          <motion.p
            className="text-gray-11 dark:text-dark-gray-11 mt-2 max-w-2xl text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Helping job seekers navigate the digital hiring landscape with confidence
          </motion.p>
        </div>
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
          {/* Creator Section */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
          >
            <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8">
              <div className="mx-auto max-w-3xl text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Code className="text-primary mx-auto mb-4 size-12" />
                </motion.div>
                <h2 className="text-gray-12 dark:text-dark-gray-12 mb-4 text-2xl font-semibold">
                  {creator.title}
                </h2>
                <p className="text-gray-11 dark:text-dark-gray-11 leading-relaxed">
                  {creator.description}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Our Story */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-center text-2xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Tero Exists
            </motion.h2>
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              {story.map((chapter, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                  variants={cardVariants}
                >
                  <motion.div
                    className="bg-primary mb-4 flex size-10 items-center justify-center rounded-full text-lg font-bold text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index + 1}
                  </motion.div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-xl font-semibold">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 leading-relaxed">
                    {chapter.content}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-center text-2xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Our Core Values
            </motion.h2>
            <motion.div
              className="grid gap-6 md:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                  variants={cardVariants}
                >
                  <motion.div
                    className="text-primary mb-4 inline-flex origin-center"
                    whileHover={{ scale: 1.1, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {value.icon}
                  </motion.div>

                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-xl font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* What We Offer */}
          <section className="mb-16">
            <motion.h2
              className="text-gray-12 dark:text-dark-gray-12 mb-8 text-center text-2xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              What Tero Offers
            </motion.h2>
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6 text-center"
                  variants={cardVariants}
                >
                  <motion.div
                    className="text-primary mb-4 flex justify-center"
                    whileHover={{ scale: 1.1, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Commitment Section */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
          >
            <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 rounded-2xl border p-8">
              <h2 className="text-gray-12 dark:text-dark-gray-12 mb-6 text-center text-2xl font-semibold">
                Our Commitment
              </h2>
              <motion.div
                className="grid gap-6 md:grid-cols-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                {[
                  {
                    title: "Your Privacy Matters",
                    description:
                      "Your resume stays yours. We don't share, sell, or use your information for anything other than analyzing your resume. Simple as that.",
                  },
                  {
                    title: "Staying Current",
                    description:
                      "ATS systems and hiring practices change all the time. We keep track of these changes so our advice stays useful and up to date.",
                  },
                  {
                    title: "Built on Feedback",
                    description:
                      "User feedback drives what we build next. If something isn't working right or could be better, we want to know and fix it.",
                  },
                  {
                    title: "More Than Just Scanning",
                    description:
                      "Beyond the scanner, we provide guides and tips to help you through your entire job search. Real advice that actually helps.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="border-gray-6 dark:border-dark-gray-6 rounded-lg border bg-white/50 p-6 dark:bg-black/20"
                    variants={cardVariants}
                  >
                    <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-2xl font-semibold">
              Start Optimizing Your Resume
            </h2>
            <p className="text-gray-11 dark:text-dark-gray-11 mb-6">
              Take the first step toward landing your dream job with Tero's ATS analysis and
              optimization tools.
            </p>
            <motion.a
              href="/"
              className="bg-primary hover:bg-primary-hover inline-block rounded-lg px-8 py-3 font-semibold text-white transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Get Started with Tero
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
