import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import FileUploder from "../ui/FileUploder";
import "./Modules.css";
import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import ResumeLoading from "../ui/ResumeLoading";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StartResumeScan() {
  const { status, error } = useResumeAnalysis();

  if (status === "analyzing") {
    return <ResumeLoading />;
  }

  if (status === "error") {
    return (
      <div className="relative flex flex-col items-center justify-start p-10">
        <motion.div
          className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4"
          initial="hidden"
          animate="visible"
          variants={errorVariants}
        >
          <motion.p
            className="text-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {error}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-start p-10">
      {/* Background effect */}
      <div className="StartResumeScan pointer-events-none absolute inset-0 overflow-hidden"></div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h3
          className="text-bg-gray-1 mt-4 text-xl font-medium md:text-3xl lg:text-4xl"
          variants={itemVariants}
        >
          Test Your Resume Against ATS Systems
        </motion.h3>

        <motion.p
          className="text-gray-3 mt-5 mb-8 text-[.91rem] sm:text-[1rem] md:w-3/4 md:text-[1.1rem] lg:text-[1.1rem]"
          variants={itemVariants}
        >
          Upload your resume to get an instant ATS score and clear suggestions to improve it.
        </motion.p>

        <motion.div
          className="text-left"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <FileUploder />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default StartResumeScan;
