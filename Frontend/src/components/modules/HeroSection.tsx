import "./Modules.css";
import { TrendingUp, Sparkles } from "lucide-react";
import HeroBadge from "../ui/HeroBadge";
import FileUploder from "../ui/FileUploder";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const fadeDown = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function HeroSection() {
  return (
    <section className="mt-4 flex w-full items-center justify-center sm:mt-8">
      {/* Main section with blue bg */}
      <motion.div
        className="bg-checker-blue box-border flex w-[97%] items-center rounded-2xl p-5 max-sm:min-h-220 md:p-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Heading portion */}
        <div className="flex w-full flex-col max-lg:items-center sm:justify-center sm:p-2 lg:w-[40%]">
          {/* Badge */}
          <motion.div variants={fadeDown}>
            <HeroBadge />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-bg-gray-1 mt-4 text-left text-[1.68rem] font-medium md:text-center md:text-4xl lg:text-left lg:text-5xl"
          >
            Better Understanding. Better Decisions. Better Resume
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            variants={fadeUp}
            className="text-gray-3 mt-5 mb-8 text-[.9rem] sm:text-[1rem] md:w-3/4 md:text-[1.1rem]"
          >
            Tero highlights what’s working in your resume and what could be stronger, offering
            simple suggestions to help you refine it with confidence.
          </motion.p>

          {/* File upload */}
          <motion.div variants={fadeUp}>
            <FileUploder />
          </motion.div>

          {/* Points */}
          <motion.div variants={fadeUp} className="mt-8 text-[.7rem] md:mt-10 md:text-[.8rem]">
            <div className="flex items-center gap-2">
              <TrendingUp className="stroke-accent-gold h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-gray-3">
                Improve your chances of getting noticed by recruiters.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="stroke-accent-gold h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-gray-3">
                Powered by AI designed to evaluate resumes like an ATS.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Resume image section */}
        <div className="hidden w-[60%] items-center justify-center lg:flex">
          <motion.figure
            variants={scaleIn}
            className="resume-image relative max-w-120 max-[1200px]:max-w-96"
          >
            <motion.img
              src="/assets/mr-stark-resume.svg"
              alt="Resume Preview"
              className="mx-auto w-120 max-w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            <motion.div
              className="absolute top-[8%] right-[-27%] w-[43%] max-w-[220px] rounded-md bg-white shadow-lg max-[1200px]:max-w-[180px]"
              initial={{ opacity: 0, x: 16, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              <img src="/assets/resume-score.svg" alt="Resume Score" className="mx-auto w-full" />
            </motion.div>

            <motion.div
              className="absolute top-[35%] left-[-26%] w-[56%] max-w-60 rounded-md shadow-lg max-[1200px]:max-w-[180px]"
              initial={{ opacity: 0, x: -16, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.35 }}
            >
              <img
                src="/assets/resume-suggestion.svg"
                alt="Resume Suggestion"
                className="mx-auto w-full"
              />
            </motion.div>
          </motion.figure>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
