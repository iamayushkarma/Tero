import "./Modules.css";
import { TrendingUp, Sparkles } from "lucide-react";
import HeroBadge from "../ui/HeroBadge";
import FileUploder from "../ui/FileUploder";

function HeroSection() {
  return (
    <section className="mt-4 flex w-full items-center justify-center sm:mt-8">
      {/* Main section with blue bg */}
      <div className="bg-checker-blue box-border flex w-[97%] items-center rounded-2xl p-5 max-sm:h-150 md:p-10">
        {/* Heading portion */}
        <div className="flex w-full flex-col max-lg:items-center sm:justify-center sm:p-2 lg:w-[40%]">
          {/* Heading badge */}
          <HeroBadge />
          {/* Heading Section */}
          <h1 className="text-bg-gray-1 mt-4 text-left text-[1.68rem] font-medium md:text-center md:text-4xl lg:text-left lg:text-6xl">
            Better Understanding. Better Decisions. Better Resume
          </h1>
          <p className="text-gray-3 mt-5 mb-8 text-[.9rem] sm:text-[1rem] md:w-3/4 md:text-[1.1rem] lg:text-[1.3rem]">
            Tero highlights what’s working in your resume and what could be stronger, offering
            simple suggestions to help you refine it with confidence.
          </p>
          {/* File upload section */}
          <FileUploder />
          <div className="mt-8 text-[.7rem] md:mt-10 md:text-[.8rem]">
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
          </div>
        </div>
        {/* Resume image section */}
        <div className="hidden w-[60%] items-center justify-center lg:flex">
          <figure className="resume-image relative max-w-120 max-[1200px]:max-w-96">
            <img
              src="/assets/mr-stark-resume.svg"
              alt="Resume Preview"
              className="mx-auto w-120 max-w-full"
            />
            <div className="absolute top-[8%] right-[-27%] w-[43%] max-w-[220px] rounded-md bg-white shadow-lg max-[1200px]:max-w-[180px]">
              <img src="/assets/resume-score.svg" alt="Resume Preview" className="mx-auto w-full" />
            </div>
            <div className="absolute top-[35%] left-[-26%] w-[56%] max-w-60 rounded-md shadow-lg max-[1200px]:max-w-[180px]">
              <img
                src="/assets/resume-suggestion.svg"
                alt="Resume Preview"
                className="mx-auto w-full"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
export default HeroSection;
