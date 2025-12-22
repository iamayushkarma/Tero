import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProp {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}
export const faqContent = [
  {
    question: "What happens after I upload my resume?",
    answer:
      "Once uploaded, your resume is analyzed automatically to check formatting, keywords, section structure, and overall compatibility with screening systems. You’ll receive a clear score along with specific insights on what needs improvement.",
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

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="mt-50 mb-30 select-none">
      <div className="mx-auto md:w-3/4">
        <div>
          <h2 className="text-gray-12 dark:text-gray-3 mx-auto mt-8 text-center text-[1.2rem] font-semibold md:w-1/2 lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-11 dark:text-gray-9 mx-auto mt-4 text-center text-[.9rem] md:w-[40%] lg:text-[.9rem]">
            Quick answers to common questions about uploading, scanning, and improving your resume.
          </p>
        </div>
        <div className="mx-auto mt-12 w-11/12 md:w-[60%]">
          {faqContent.map((content, index) => {
            return (
              <AccordionItem
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                isOpen={openIndex === index}
                key={index}
                {...content}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FAQSection;

const AccordionItem = ({ question, answer, isOpen, onToggle }: AccordionItemProp) => {
  return (
    <div
      onClick={onToggle}
      className="border-b-gray-7 dark:border-b-gray-12 hover:bg-gray-3 hover:dark:bg-gray-12/50 w-full border-b p-3 md:py-6"
    >
      {/* question */}
      <div className="flex items-center justify-between">
        <h3 className="text-gray-12 dark:text-gray-3 font-medium md:text-[1.09rem]">{question}</h3>
        <button>
          <ChevronDown
            className={`text-gray-12 dark:text-gray-3 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {/* answer */}
      {isOpen && (
        <div className="text-gray-11 dark:text-gray-9 mt-2 text-[.9rem] md:text-[.9rem]">
          {answer}
        </div>
      )}
    </div>
  );
};
