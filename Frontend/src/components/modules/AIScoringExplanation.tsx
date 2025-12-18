interface ExplanationCardProp {
  className?: string;
  imgSrc: string;
  heading: string;
  subHeading: string;
}

const explanationCardContent = [
  {
    imgSrc: "/assets/KeywordMatching.svg",
    heading: "Keyword Matching & Skill Detection",
    subHeading:
      "Our AI scans your resume and compares it with the job description to identify missing skills, tools, and role-specific keywords, and checks whether they are used correctly in the right sections.",
  },
  {
    imgSrc: "/assets/SectionAnalysis.svg",
    heading: "Resume Section Analysis",
    subHeading:
      "Our AI reviews each section of your resume—summary, skills, experience, and education—to ensure they are clearly structured and properly labeled so ATS systems can easily understand your profile.",
  },
  {
    imgSrc: "/assets/FormattingCheck.svg",
    heading: "Formatting & ATS Readability",
    subHeading:
      "Our AI checks your resume layout to ensure it is ATS-friendly and flags issues such as tables, graphics, unusual fonts, or spacing that may prevent proper parsing.",
  },
  {
    imgSrc: "/assets/ExperienceScoring.svg",
    heading: "Experience Relevance Scoring",
    subHeading:
      "Our AI analyzes your work experience based on role relevance, clarity, and impact by evaluating job titles, responsibilities, and how well they align with the target position.",
  },
  {
    imgSrc: "/assets/ATSScore.svg",
    heading: "Overall ATS Compatibility Score",
    subHeading:
      "Our AI combines all evaluation factors into a single ATS score that shows how likely your resume is to pass screening, along with clear suggestions for improvement.",
  },
];
function AIScoringExplanation() {
  return (
    <div className="mt-20 flex items-center justify-center pb-20">
      <div className="w-[95%]">
        {/* Heading */}
        <div className="mx-auto mt-20 flex flex-col items-center justify-center text-center">
          <h2 className="text-gray-12 dark:text-bg-gray-1 text-lg font-semibold max-sm:w-3/4 md:text-3xl lg:text-4xl">
            How Our AI Analyzes Your Resume for ATS Compatibility
          </h2>
          <p className="text-gray-11 dark:text-gray-9 mx-auto mt-4 text-center text-[.9rem] md:w-[40%] lg:text-lg">
            Understand how Tero evaluates your resume to improve its chances of passing automated
            screening systems.
          </p>
        </div>
        <div className="mx-auto mt-20 w-11/12 md:w-3/4">
          {/* Grid layout */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            {explanationCardContent.slice(0, 2).map((card, index) => {
              return <ExplanationCard key={index} {...card} />;
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {explanationCardContent.slice(2, 5).map((card, index) => (
              <ExplanationCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIScoringExplanation;

const ExplanationCard = ({ className, imgSrc, heading, subHeading }: ExplanationCardProp) => {
  return (
    <div
      className={` ${className} bg-bg-gray-1 dark:bg-gray-12/10 border-gray-5 dark:border-gray-12 hover:bg-gray-3/60 dark:hover:bg-gray-12/40 rounded-xl border-2 p-4 md:p-6`}
    >
      <div className="flex items-center justify-center p-2 py-10">
        <img className="size-40 md:size-74" src={imgSrc} />
      </div>
      <div>
        <div className="relative mb-3 dark:hidden">
          <div className="bg-bg-gray-1 dark:bg-gray-12 absolute bottom-5 mx-auto h-15 w-full opacity-70 blur-2xl md:h-25" />
        </div>
        <h3 className="text-gray-12 dark:text-gray-3 text-[1rem] font-semibold sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.3rem]">
          {heading}
        </h3>
        <p className="text-gray-11 dark:text-gray-9 lg-text[1.1rem] mt-2 text-[.8rem] md:text-[1rem]">
          {subHeading}
        </p>
      </div>
    </div>
  );
};
