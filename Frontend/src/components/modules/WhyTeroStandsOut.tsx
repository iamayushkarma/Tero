import React from "react";

interface WhyTeroStandsOutCardProps {
  absImg: string;
  heading: string;
  paragraph: string;
}
const whyTeroData = [
  {
    absImg: "/assets/resume-mistakes.svg",
    heading: "Live content analysis",
    paragraph:
      "See how your resume’s language matches industry standards. We’ll point out missing skills, certifications, and employer-preferred phrases - paste the job description to evaluate fit more precisely.",
  },
  {
    absImg: "/assets/resume-number.svg",
    heading: "ATS compatibility checks",
    paragraph:
      "Spot formatting problems like unsupported fonts, tables, and headers that can affect ATS parsing. Receive simple, automated fixes.",
  },
  {
    absImg: "/assets/resume-score-improvement.svg",
    heading: "Simple, practical tips",
    paragraph:
      "Get guidance on the right section order, bullet style, and resume length. The checker spots issues and explains how to adjust your resume to match what recruiters look for, with fixes you can apply instantly.",
  },
];

function WhyTeroStandsOut() {
  return (
    <section className="mt-30 p-4 md:p-10">
      {/* Heading */}
      <div className="flex items-center justify-center p-2 text-center font-semibold">
        <h2 className="text-gray-12 dark:text-bg-gray-1 text-2xl md:text-3xl lg:text-4xl">
          A Practical Tool for Better Resume Analysis
        </h2>
      </div>
      {/* Why Tero StandsOut Card */}
      <div className="mx-auto mt-10 grid w-[95%] gap-6 md:grid-cols-2 lg:grid-cols-3">
        {whyTeroData.slice(0, 2).map((whyTeroData, index) => (
          <WhyTeroStandsOutCard key={index} {...whyTeroData} />
        ))}
        <div className="md:col-span-2 md:mx-auto md:max-w-[50%] lg:col-span-1 lg:max-w-full">
          <WhyTeroStandsOutCard {...whyTeroData[2]} />
        </div>
      </div>
    </section>
  );
}

export default WhyTeroStandsOut;

const WhyTeroStandsOutCard: React.FC<WhyTeroStandsOutCardProps> = ({
  absImg,
  heading,
  paragraph,
}) => {
  const headingId = heading.replace(/\s+/g, "-").toLowerCase();
  return (
    <article aria-labelledby={headingId} className="overflow-hidden rounded-lg p-4">
      {/* Image section */}
      <div className="bg-gray-3 dark:bg-gray-12/90 dark:hover:bg-gray-12/30 hover:bg-gray-5 relative rounded-lg rounded-b-none p-4 pb-0 transition-all duration-100">
        <div className="absolute top-[25%] left-[5%] rounded-md shadow-md lg:top-[20%]">
          <img
            src={absImg}
            alt="Resume Preview"
            className="bg-bg-gray-1 mx-auto w-46 rounded-md md:w-54 lg:w-64 [@media(max-width:1350px)]:w-48"
          />
        </div>
        <div className="max-h-3/4">
          <img
            src="/assets/stark-plain-resume.svg"
            alt="Resume Preview"
            className="mx-auto w-80 max-w-full rounded-md"
          />
        </div>
      </div>
      {/* Content section */}
      <div className="bg-gray-3/50 dark:bg-gray-12/30 rounded-lg rounded-t-none px-8 py-6">
        <h3
          id={headingId}
          className="lg:text-text-[1.4rem] dark:text-bg-blue-2 text-gray-12 mt-2 mb-4 font-semibold md:text-[1.2rem]"
        >
          {heading}
        </h3>
        <p className="dark:text-gray-9 text-gray-11 font-normal md:text-[1.1rem]">{paragraph}</p>
      </div>
    </article>
  );
};
