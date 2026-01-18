import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface AccordionItemProp {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

export const faqContent = [
  {
    question: "What happens after I upload my resume?",
    answer:
      "Once uploaded, your resume is analyzed automatically to check formatting, keywords, section structure, and overall compatibility with screening systems. You'll receive a clear score along with specific insights on what needs improvement.",
  },
  {
    question: "How long does the resume analysis take?",
    answer:
      "The analysis usually completes within a few seconds. Your ATS score and detailed feedback are generated instantly so you can take action right away.",
  },
  {
    question: "Can I upload my resume without signing up?",
    answer:
      "Yes, you can upload your resume and get an initial analysis without creating an account. This allows you to quickly check how your resume performs before deciding on next steps.",
  },
  {
    question: "Which file formats can I upload?",
    answer:
      "You can upload resumes in PDF, DOC, DOCX, and plain text formats. These formats are widely supported and work well with most applicant tracking systems.",
  },
  {
    question: "Can I paste my resume text instead of uploading a file?",
    answer:
      "We currently support resume uploads in PDF, DOC, and DOCX formats. Please make sure your file is in one of these formats for accurate analysis.",
  },
  {
    question: "Will my resume be stored after the scan?",
    answer:
      "Your resume is processed securely for analysis and is not publicly stored or shared. We follow a privacy-first approach to ensure your data remains protected.",
  },
  {
    question: "Can I re-upload my resume after making changes?",
    answer:
      "Yes, you can update your resume and run the analysis again as many times as needed. This helps you track improvements and optimize your resume step by step.",
  },
  {
    question: "What kind of issues does the scan detect?",
    answer:
      "The scan identifies missing keywords, formatting problems, unclear or poorly structured sections, weak wording, and relevance gaps based on the target role.",
  },
  {
    question: "Does the resume score guarantee shortlisting?",
    answer:
      "No tool can guarantee shortlisting. The score is meant to guide you by showing how well your resume is optimized and where it can be improved for better visibility.",
  },
  {
    question: "Can I use this for different job roles?",
    answer:
      "Yes, you can analyze the same resume for different job roles by adjusting its content. This helps you understand how well your resume matches different positions.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const headingVariants: Variants = {
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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-50 mb-30 select-none">
      <div className="mx-auto md:w-3/4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-gray-12 dark:text-gray-3 mx-auto mt-8 text-center text-[1.2rem] font-semibold md:w-1/2 lg:text-4xl"
            variants={headingVariants}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-gray-11 dark:text-gray-9 mx-auto mt-4 text-center text-[.9rem] md:w-[40%] lg:text-[.9rem]"
            variants={headingVariants}
          >
            Quick answers to common questions about uploading, scanning, and improving your resume.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 w-11/12 md:w-[60%]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {faqContent.map((content, index) => {
            return (
              <AccordionItem
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                isOpen={openIndex === index}
                key={index}
                index={index}
                {...content}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default FAQSection;

const AccordionItem = ({ question, answer, isOpen, onToggle, index }: AccordionItemProp) => {
  return (
    <motion.div
      onClick={onToggle}
      className="border-b-gray-7 dark:border-b-gray-12 hover:bg-gray-3 hover:dark:bg-gray-12/50 w-full cursor-pointer border-b p-3 md:py-6"
      variants={itemVariants}
      whileHover={{
        x: 2,
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* question */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-12 dark:text-gray-3 font-medium md:text-[1.09rem]">{question}</h3>
        <motion.button
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="text-gray-12 dark:text-gray-3 h-5 w-5" />
        </motion.button>
      </div>

      {/* answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                  ease: "easeOut",
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              className="text-gray-11 dark:text-gray-9 mt-2 text-[.9rem] md:text-[.9rem]"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {answer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
