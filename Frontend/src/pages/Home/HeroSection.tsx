import "./Home.css";
import { TrendingUp, Sparkles } from "lucide-react";
import HeroBadge from "../../components/ui/HeroBadge";
import FileUploder from "../../components/ui/FileUploder";

function HeroSection() {
  return (
    <div className="mt-6 sm:mt-8 w-full flex items-center justify-center">
    {/* Main section with blue bg */}
      <div className='w-[97%] max-sm:h-150 p-10 box-border flex rounded-2xl bg-checker-blue'>
        {/* Heading portion */}
        <div className="p-2 w-full md:w-[40%] flex flex-col sm:justify-center">
            {/* Heading badge */}
            <HeroBadge />
            {/* Heading Section */}
            <h2 className="mt-4 text-bg-gray-1 font-medium text-2xl md:text-4xl lg:text-5xl">Better Understanding. Better Decisions. Better Resume</h2>
            <p className="md:w-3/4 text-gray-3 mt-5 text-[.9rem] sm:text-[1rem] md:text-[1.1rem]">Tero highlights what’s working in your resume and what could be stronger, offering simple suggestions to help you refine it with confidence.</p>
            {/* File upload section */}
            <FileUploder />

            <div className="mt-8 md:mt-10 text-[.8rem]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 stroke-accent-gold" />
                <span className="text-gray-3">Improve your chances of getting noticed by recruiters.</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 stroke-accent-gold" />
                <span className="text-gray-3">Powered by AI designed to evaluate resumes like an ATS.</span>
              </div>
            </div>
        </div>
        {/* Resume image section */}
        <div className="hidden w-[60%] md:flex items-center justify-center">
          <div className="max-w-120 relative">
            <img src="/assets/mr-stark-resume.svg" alt="Resume Preview"  className="w-[480px] max-w-full mx-auto" />
            <div className="absolute rounded-md bg-white shadow-lg top-[8%] right-[-27%] w-[43%] max-w-[220px]">
                <img src="/assets/resume-score.svg" alt="Resume Preview" className="w-full mx-auto" />
            </div>
            <div className="absolute rounded-md shadow-lg top-[35%] left-[-22%] w-[56%] max-w-60">
                <img src="/assets/resume-suggestion.svg" alt="Resume Preview" className="w-full mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HeroSection