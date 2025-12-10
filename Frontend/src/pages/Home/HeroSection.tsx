import "./Home.css";
import { TrendingUp, Sparkles } from "lucide-react";
import HeroBadge from "../../components/ui/HeroBadge";
import FileUploder from "../../components/ui/FileUploder";

function HeroSection() {
  return (
    <div className="mt-4 sm:mt-8 w-full flex items-center justify-center">
    {/* Main section with blue bg */}
      <div className="w-[97%] max-sm:h-150 p-5 md:p-10 box-border flex items-center rounded-2xl bg-checker-blue">
        {/* Heading portion */}
        <div className="sm:p-2 w-full lg:w-[40%] flex flex-col sm:justify-center max-lg:items-center">
            {/* Heading badge */}
            <HeroBadge />
            {/* Heading Section */}
            <h2 className="mt-4 text-bg-gray-1 font-medium text-[1.68rem] md:text-4xl lg:text-5xl text-left md:text-center lg:text-left">Better Understanding. Better Decisions. Better Resume</h2>
            <p className="md:w-3/4 mb-8 text-gray-3 mt-5 text-[.8rem] sm:text-[1rem] md:text-[1.1rem]">Tero highlights what’s working in your resume and what could be stronger, offering simple suggestions to help you refine it with confidence.</p>
            {/* File upload section */}
            <FileUploder />
            <div className="mt-8 md:mt-10 text-[.7rem] md:text-[.8rem]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-accent-gold" />
                <span className="text-gray-3">Improve your chances of getting noticed by recruiters.</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-accent-gold" />
                <span className="text-gray-3">Powered by AI designed to evaluate resumes like an ATS.</span>
              </div>
            </div>
        </div>
        {/* Resume image section */}
        <div className="hidden w-[60%] lg:flex items-center justify-center">
          <div className="resume-image max-[1200px]:max-w-96 max-w-120 relative">
            <img src="/assets/mr-stark-resume.svg" alt="Resume Preview"  className="w-[480px] max-w-full mx-auto" />
            <div className="absolute rounded-md bg-white shadow-lg top-[8%] right-[-27%] w-[43%] max-[1200px]:max-w-[180px] max-w-[220px]">
                <img src="/assets/resume-score.svg" alt="Resume Preview" className="w-full mx-auto" />
            </div>
            <div className="absolute rounded-md shadow-lg top-[35%] left-[-26%] w-[56%] max-[1200px]:max-w-[180px] max-w-60">
                <img src="/assets/resume-suggestion.svg" alt="Resume Preview" className="w-full mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HeroSection