import FileUploder from "../ui/FileUploder";
import "./Modules.css";
function StartResumeScan() {
  return (
    <>
      <div className="StartResumeScan relative flex flex-col items-center justify-center p-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-bg-gray-1 mt-4 text-xl font-medium md:text-3xl lg:text-4xl">
            Test Your Resume Against ATS Systems
          </h3>
          <p className="text-gray-3 mt-5 mb-8 text-[.9rem] sm:text-[1rem] md:w-3/4 md:text-[1.1rem] lg:text-[1.1rem]">
            Upload your resume to get an instant ATS score and clear suggestions to improve it.
          </p>
          <div className="text-left">
            <FileUploder />
          </div>
        </div>
      </div>
    </>
  );
}

export default StartResumeScan;
