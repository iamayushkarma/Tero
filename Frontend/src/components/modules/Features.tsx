import {
  Gauge,
  Puzzle,
  SearchCheck,
  Layers,
  TextAlignCenter,
  Briefcase,
  SpellCheck,
  ListChecks,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ElementType;
  iconColor: string;
  bgClass: string;
  heading: string;
  info: string;
}
// const featureCardContent = [
//   {
//     icon: Gauge,
//     iconColor: "#EF4444",
//     bgClass: "bg-red-100 dark:bg-[#3A1F22]",
//     heading: "ATS Resume Score",
//     info: "Measure how well your resume aligns with modern ATS parsing and screening standards.",
//   },
//   {
//     icon: Puzzle,
//     iconColor: "#3B82F6",
//     bgClass: "bg-blue-100 dark:bg-[#1C2F45]",
//     heading: "Skill Match Analysis",
//     info: "Compare your skills with job requirements to identify matches, gaps, and weak areas.",
//   },
//   {
//     icon: SearchCheck,
//     iconColor: "#22C55E",
//     bgClass: "bg-green-100 dark:bg-[#1F4D3A]",
//     heading: "Keyword Coverage",
//     info: "Analyze job-specific keywords and see what’s missing or overused in your resume.",
//   },
//   {
//     icon: Layers,
//     iconColor: "#F59E0B",
//     bgClass: "bg-yellow-100 dark:bg-[#4A3A1E]",
//     heading: "Section-Wise Resume Review",
//     info: "Evaluate each resume section separately, including experience, skills, projects, and education.",
//   },
//   {
//     icon: TextAlignCenter,
//     iconColor: "#A855F7",
//     bgClass: "bg-purple-100 dark:bg-[#3A2A4A]",
//     heading: "Formatting & Readability",
//     info: "Check layout, spacing, and structure to ensure your resume is easy to scan.",
//   },
//   {
//     icon: Briefcase,
//     iconColor: "#FB923C",
//     bgClass: "bg-orange-100 dark:bg-[#4A2F1E]",
//     heading: "Experience Relevance",
//     info: "Assess how relevant your experience and projects are to the target role.",
//   },
//   {
//     icon: SpellCheck,
//     iconColor: "#F472B6",
//     bgClass: "bg-pink-100 dark:bg-[#4A2436]",
//     heading: "Language & Style Checks",
//     info: "Spots weak wording, overused phrases, and passive sentences that make your resume less effective.",
//   },
//   {
//     icon: ListChecks,
//     iconColor: "#9CA3AF",
//     bgClass: "bg-gray-100 dark:bg-[#2A2E35]",
//     heading: "Resume Consistency",
//     info: "Verify contact details, dates, section order, and overall resume completeness.",
//   },
// ];
const featureCardContent = [
  {
    icon: Gauge,
    iconColor: "#EF4444",
    bgClass: "bg-red-100 dark:bg-[#3A1F22]",
    heading: "ATS Resume Score",
    info: "Measure how well your resume aligns with modern ATS parsing and screening standards. Get a clear score that reflects how likely your resume is to pass automated filters.",
  },
  {
    icon: Puzzle,
    iconColor: "#3B82F6",
    bgClass: "bg-blue-100 dark:bg-[#1C2F45]",
    heading: "Skill Match Analysis",
    info: "Compare your skills with job requirements to identify strong matches, gaps, and weak areas. This helps you focus on skills that matter most for the role.",
  },
  {
    icon: SearchCheck,
    iconColor: "#22C55E",
    bgClass: "bg-green-100 dark:bg-[#1F4D3A]",
    heading: "Keyword Coverage",
    info: "Analyze job-specific keywords and see what’s missing or overused in your resume. Ensure critical terms appear naturally in the right sections.",
  },
  {
    icon: Layers,
    iconColor: "#F59E0B",
    bgClass: "bg-yellow-100 dark:bg-[#4A3A1E]",
    heading: "Section-Wise Resume Review",
    info: "Evaluate each resume section separately, including experience, skills, projects, and education. This ensures every section is clear, complete, and ATS-friendly.",
  },
  {
    icon: TextAlignCenter,
    iconColor: "#A855F7",
    bgClass: "bg-purple-100 dark:bg-[#3A2A4A]",
    heading: "Formatting & Readability",
    info: "Check layout, spacing, and structure to ensure your resume is easy to scan. Avoid formatting issues that can confuse ATS systems or recruiters.",
  },
  {
    icon: Briefcase,
    iconColor: "#FB923C",
    bgClass: "bg-orange-100 dark:bg-[#4A2F1E]",
    heading: "Experience Relevance",
    info: "Assess how relevant your experience and projects are to the target role. The AI highlights areas that need clearer impact or better alignment.",
  },
  {
    icon: SpellCheck,
    iconColor: "#F472B6",
    bgClass: "bg-pink-100 dark:bg-[#4A2436]",
    heading: "Language & Style Checks",
    info: "Identify weak wording, overused phrases, and passive sentences. Improve clarity and tone to make your resume more professional and impactful.",
  },
  {
    icon: ListChecks,
    iconColor: "#9CA3AF",
    bgClass: "bg-gray-100 dark:bg-[#2A2E35]",
    heading: "Resume Consistency",
    info: "Verify contact details, dates, section order, and overall completeness. Catch small inconsistencies that can reduce credibility during screening.",
  },
];

function Features() {
  return (
    <div className="mx-auto mb-30 w-[95%] p-4 pt-20">
      {/* Heading */}
      <div>
        <span className="text-primary border-gray-7 dark:border-gray-10 mx-auto flex w-fit items-center justify-center gap-2 rounded-lg border px-2 py-0.5 text-[.8rem] font-medium select-none md:text-[.9rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="text-primary size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          <p>Our Features</p>
        </span>

        <h2 className="text-gray-12 dark:text-gray-3 mx-auto mt-8 text-center text-[1.2rem] font-semibold md:w-1/2 lg:text-4xl">
          Smart resume analysis focused on issues recruiters and ATS notice first
        </h2>
        <p className="text-gray-11 dark:text-gray-9 mx-auto mt-4 text-center text-[.9rem] md:w-[40%] lg:text-lg">
          Evaluate content, formatting, and relevance to improve how your resume performs during
          initial screening.
        </p>
      </div>
      {/* Feature cards */}
      <div>
        <div className="mx-auto mt-12 grid gap-6 md:w-[85%] md:grid-cols-2 lg:grid-cols-4">
          {featureCardContent.map((howItWorks, index) => {
            return <FeatureCard key={index} {...howItWorks} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Features;

const FeatureCard = ({ icon: Icon, iconColor, bgClass, heading, info }: FeatureCardProps) => {
  return (
    <div className="border-gray-5 dark:border-gray-11 hover:bg-gray-3/60 dark:hover:bg-gray-12/40 rounded-lg border-2 p-4 md:p-6">
      <div>
        <div className={`w-fit rounded-lg p-2.5 transition-colors md:p-3 ${bgClass}`}>
          <Icon aria-hidden className="h-4 w-4 md:h-6 md:w-6" style={{ color: iconColor }} />
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-gray-12 dark:text-gray-3 text-[1rem] font-semibold sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem]">
          {heading}
        </h4>
        <p className="text-gray-11 dark:text-gray-9 lg-text[1.1rem] mt-2 text-[.8rem] md:text-[1rem]">
          {info}
        </p>
      </div>
    </div>
  );
};
