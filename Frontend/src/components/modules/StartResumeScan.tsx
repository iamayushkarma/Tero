import FileUploder from "../ui/FileUploder";
import "./Modules.css";
import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import ResumeLoading from "../ui/ResumeLoading";

function StartResumeScan() {
  const { status, error } = useResumeAnalysis();

  if (status === "analyzing") {
    return <ResumeLoading />;
  }

  if (status === "error") {
    return (
      <div className="relative flex flex-col items-center justify-start p-10">
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-start p-10">
      <div className="StartResumeScan pointer-events-none absolute inset-0 overflow-hidden"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h3 className="text-bg-gray-1 mt-4 text-xl font-medium md:text-3xl lg:text-4xl">
          Test Your Resume Against ATS Systems
        </h3>
        <p className="text-gray-3 mt-5 mb-8 text-[.91rem] sm:text-[1rem] md:w-3/4 md:text-[1.1rem] lg:text-[1.1rem]">
          Upload your resume to get an instant ATS score and clear suggestions to improve it.
        </p>
        <div className="text-left">
          <FileUploder />
        </div>
      </div>
    </div>
  );
}

export default StartResumeScan;
