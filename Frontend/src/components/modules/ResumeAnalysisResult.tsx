// import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
// import { useNavigate } from "react-router-dom";
// import ResumeLoading from "../ui/ResumeLoading";
// import { useTheme } from "../../hooks/useThemeContext";
// import ProgressBar from "../ui/ProgressBar";
// import { useLayoutEffect, useState } from "react";
// import { PdfOnlyPreview } from "../ui/PdfPreview";
// import { DocxPreview } from "../ui/DocxPreview";
// import "./Modules.css";

// type ScoreBreakdownItem = {
//   score: number;
//   maxScore: number;
//   percentage?: number;
// };
// type ScoreBreakdown = Record<string, ScoreBreakdownItem>;
// function ResumeAnalysisResult() {
//   const { status, analysis, jobRole, error, file } = useResumeAnalysis();
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const [activeTab, setActiveTab] = useState("tab1");

//   console.log(file);
//   useLayoutEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "instant" });
//   }, []);

//   const score = analysis?.atsResult?.score ?? 0;
//   function getScoreColor(score: number, isDark: boolean) {
//     if (score < 40) return isDark ? "#f87171" : "#dc2626"; // Red
//     if (score < 50) return isDark ? "#fb923c" : "#ea580c"; // Slightly lighter orange
//     if (score < 75) return isDark ? "#fde047" : "#facc15"; // Slightly lighter yellow
//     if (score < 90) return isDark ? "#4ade80" : "#22c55e"; // Green
//     return isDark ? "#22c55e" : "#16a34a"; // Darker green for 90+
//   }
//   const isDark = theme === "dark";
//   const color = getScoreColor(score, isDark);

//   const breakdown = analysis?.atsResult?.breakdown as ScoreBreakdown | undefined;
//   const aiBreakdown = analysis?.aiVerdict;

//   const progressBarConfig = [
//     { key: "experience_quality", label: "Experience" },
//     { key: "sections", label: "Sections" },
//     { key: "skills_relevance", label: "Skills" },
//     { key: "formatting", label: "Formatting" },
//     { key: "keywords", label: "Keywords" },
//   ];

//   switch (status) {
//     case "idle":
//       navigate("/");
//       return null;
//     case "analyzing":
//       return <ResumeLoading />;
//     case "error":
//       return (
//         <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
//           <p className="text-red-600">{error}</p>
//         </div>
//       );
//     default:
//       break;
//   }
//   if (!analysis) {
//     navigate("/");
//     return null;
//   }

//   const tabs = [
//     { id: "tab1", label: "Strength" },
//     { id: "tab2", label: "Weekness" },
//     { id: "tab3", label: "Improvement" },
//   ];

//   const tabContent = {
//     tab1: (
//       <div>
//         {/* <p>{aiBreakdown.working}</p> */}
//         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa harum voluptatum provident a
//         nam suscipit error ratione, facere odit accusantium similique excepturi inventore placeat
//         doloribus! Itaque dignissimos doloribus sed provident? Lorem ipsum dolor sit amet
//         consectetur adipisicing elit. Quos rem reprehenderit ratione eum fuga quod id, laudantium
//         ut. Ducimus doloremque officia fugiat, accusamus amet optio necessitatibus? Ipsam aliquid
//         aspernatur dolorum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, dolores
//         consequuntur! Ipsum quis, ducimus neque aliquam ullam perferendis assumenda asperiores,
//         laborum officia quisquam accusantium doloribus earum alias voluptates qui. Enim. Ea
//         molestiae, repudiandae tempora nulla sequi fugit debitis corrupti doloremque excepturi
//         distinctio et eius inventore repellat asperiores veritatis nisi blanditiis architecto at
//         repellendus reprehenderit. Beatae tenetur dolore facere voluptatem a! Quibusdam quisquam,
//         eveniet nam earum deleniti omnis molestias voluptatibus in tenetur necessitatibus voluptates
//         repellat. Facilis, rerum at eius dolor nemo officiis dolorum animi velit harum labore
//         distinctio odit et fugiat. Repellendus dolore cupiditate saepe sint! Sequi aliquam vero
//         omnis repudiandae? Consequuntur laboriosam saepe ad officiis, obcaecati voluptatibus
//         recusandae sunt aut autem! Tempora, repudiandae modi. Voluptates dicta illum architecto quo
//         suscipit! Velit corrupti laboriosam iure adipisci porro quas itaque sequi doloribus ipsa
//         quisquam. Magnam impedit reprehenderit, ad dignissimos sunt, dolores aliquam nihil expedita
//         ex tenetur similique ab rem ratione deleniti ipsa. Eaque, expedita magni quis consectetur
//         sunt error placeat vero deserunt ullam corporis optio eius quisquam fugit sit a natus omnis
//         facilis quae alias mollitia voluptate inventore et? Et, ad? Maxime. Iusto perspiciatis
//         beatae blanditiis ex ratione dolorem alias nihil sapiente placeat quae porro dolorum
//         molestiae asperiores quaerat iure pariatur facilis dolore dicta exercitationem consequatur,
//         veritatis unde tempore. Dolorum, mollitia deleniti! Nam quasi consequatur natus sapiente.
//         Optio velit consequuntur nulla laboriosam eligendi aut blanditiis molestiae saepe sunt
//         maxime iusto eveniet iste ea dicta, ab et obcaecati ratione. Magni earum ut consequatur.
//         Molestiae sequi modi nulla quos eos reiciendis, ratione necessitatibus ab ipsum mollitia
//         voluptate maxime autem dolores eligendi? Possimus harum consequatur architecto fugit
//         dolorum, amet inventore nulla ex, cumque quo neque. Iure molestiae labore ratione eligendi
//         illo est expedita ipsum obcaecati adipisci eveniet voluptates qui tempora, amet corrupti
//         corporis dolor fugit quibusdam animi fuga debitis sapiente nisi. Natus esse totam laborum.
//         lorem
//       </div>
//     ),
//     tab2: (
//       <div>
//         <p>Overview</p>
//         nam suscipit error ratione, facere odit accusantium similique excepturi inventore placeat
//         doloribus! Itaque dignissimos doloribus sed provident? Lorem ipsum dolor sit amet
//         consectetur adipisicing elit. Consequuntur ipsum dicta fugit maiores voluptatem libero
//         ducimus repellendus sapiente quod? Corporis, natus laboriosam. Placeat atque unde eius
//         quidem et laboriosam nobis? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
//         inventore non saepe mollitia repudiandae amet nemo eum ullam totam distinctio fugit debitis
//         tempora pariatur, aperiam provident. Numquam quasi nobis voluptatum. Lorem ipsum dolor, sit
//         amet consectetur adipisicing elit. Odio, esse fuga! Dicta vero perferendis, quae inventore
//         deserunt odit ducimus asperiores tempora tenetur, veniam, aliquid eos impedit eum officiis
//         odio repudiandae. Repudiandae, molestias. Officiis veniam aspernatur nemo sed non nulla
//         laboriosam doloribus temporibus at fugit tenetur dolorum dolor, sunt illum deleniti aliquid
//         esse ab sequi ducimus modi accusantium inventore suscipit voluptates. Repudiandae, nesciunt
//         debitis. Tenetur, beatae sed, sint molestiae a laboriosam assumenda velit ab odit quia nihil
//         in unde ex corrupti, eum rem excepturi veniam soluta aperiam obcaecati? Laudantium, iste
//         voluptatem. Autem ea distinctio numquam ad magnam totam est ex cupiditate, et, error, ipsa
//         molestiae quidem velit id vitae? Consectetur delectus harum maxime, impedit iste voluptatum?
//         Odit delectus magni eius obcaecati. Maxime nisi accusamus repudiandae, vitae suscipit
//         perferendis impedit obcaecati quae pariatur alias quidem, neque sint officia at,
//         consequuntur iure? Cupiditate reiciendis dolor facilis dolorem, provident quos sapiente
//         velit animi minus. Ipsa autem maxime possimus atque qui, distinctio voluptatibus ullam, rem,
//         pariatur perspiciatis asperiores velit ex voluptas aliquam impedit quisquam nihil
//         consequuntur quia alias assumenda accusamus? Aperiam aliquam eius molestias dolorem.
//         Temporibus iure saepe eum maiores laborum voluptatum nobis odit sit qui. Fugiat sit
//         molestias magnam atque fugit, labore quia, officia beatae nesciunt animi et dolorem natus
//         voluptates veniam excepturi error. Nulla nobis animi quasi pariatur, harum qui repellat rem
//         culpa cumque accusamus suscipit a nostrum adipisci ad expedita ab eveniet aperiam voluptas
//         autem, saepe esse corporis, maiores quis! Sequi, nulla. Consectetur blanditiis sequi minus
//         magnam explicabo aliquid, quam omnis sint aliquam, nisi possimus consequatur laborum
//         molestiae modi voluptatem est dolorem. In iste nesciunt tenetur tempore cumque ad, libero
//         optio! Voluptate? Alias ipsa beatae velit officiis dicta quam reprehenderit obcaecati,
//         similique delectus minima quasi earum voluptatem qui deserunt tenetur! Perferendis voluptate
//         a aliquam ad vitae itaque dolore modi dolores magnam totam.
//       </div>
//     ),
//     tab3: (
//       <div>
//         <p>Overview</p>
//         jsfkj;iugf syyog rsebgfewyo gfraioy gtresiy gfrue dignissimos doloribus sed provident? Lorem
//         ipsum dolor sit amet consectetur adipisicing elit. Ullam ratione error reprehenderit
//         accusamus sit dignissimos molestias quod amet exercitationem? Quisquam debitis atque aliquid
//         dolorum, magni amet aut nam nobis aspernatur. Lorem ipsum dolor sit amet, consectetur
//         adipisicing elit. Doloremque vel architecto eligendi aut repellat harum omnis quia
//         voluptatum dolor, consequatur quod velit optio quam? Ipsum magnam saepe repellendus. Quidem,
//         fugit. Ducimus impedit explicabo in? Obcaecati iure nemo at porro? Sapiente iure placeat
//         dolor assumenda ipsam voluptate sit quidem deleniti a totam quis, nesciunt debitis sint
//         veritatis harum iusto nihil perferendis. Suscipit quam deserunt in, sed ad doloremque non
//         ipsam a omnis sit consequatur eaque molestiae animi numquam qui cumque distinctio unde iure,
//         ipsum praesentium magnam tenetur nemo! Sapiente, beatae saepe. Minima, illo soluta nostrum
//         iure dicta iusto dolorum eum accusantium voluptatem hic sint. Quasi aliquid consequuntur
//         accusantium reiciendis et omnis alias numquam, aut animi eius ratione quis dicta repellat
//         perferendis? Ex libero minus iure? Eum minus beatae hic ipsum quis fuga esse? Ab explicabo
//         quasi, ad amet reprehenderit porro consectetur illo consequatur adipisci! Dignissimos
//         consectetur laboriosam doloremque dolore, nostrum ex. Temporibus excepturi praesentium
//         reprehenderit minima optio, animi nam sunt dignissimos dolore ducimus. Iure optio dolor
//         vitae doloremque? Eius, explicabo. Delectus, praesentium! Sapiente, voluptatum temporibus
//         nesciunt voluptates rerum debitis natus deleniti. Ratione aperiam ad cumque dolor
//         consequuntur corporis quaerat, quas eveniet eaque. Quo, quibusdam temporibus reprehenderit
//         fuga aliquid voluptatibus veniam omnis facilis dolores repellat nobis porro obcaecati, quia
//         necessitatibus maiores ipsum! Deserunt minima qui fugiat explicabo totam perferendis! Ipsum
//         repellat eligendi excepturi provident quae magni? Reiciendis, inventore voluptatum
//         cupiditate est alias aspernatur ipsa necessitatibus tempora! Dolore dicta atque aliquid amet
//         veniam! Ipsum, laboriosam. Odio dolores in consectetur voluptatibus dolore eos fugiat quam
//         accusamus, sunt molestias laudantium provident eaque quis officiis mollitia necessitatibus
//         obcaecati deleniti adipisci inventore quisquam ipsam porro quasi facilis! Temporibus dicta,
//         quia in error natus laboriosam, pariatur, asperiores ipsum voluptas at ratione unde quos
//         voluptate saepe! Officiis delectus impedit, illo quam quia amet nesciunt voluptas ipsa
//         voluptatibus necessitatibus nulla.
//       </div>
//     ),
//   };

//   return (
//     <section className="bg-gray-3 dark:bg-gray-12/70 min-h-screen w-full p-5 pt-20 md:mx-auto">
//       <div className="mx-auto grid items-start gap-5 md:w-11/12 md:grid-cols-10 md:p-8">
//         {/* score section */}
//         <div className="top-[20%] md:sticky md:col-span-3">
//           <div className="bg-bg-gray-1 dark:bg-gray-12/5 border-gray-5 dark:border-gray-11/40 flex flex-col items-center justify-center rounded-xl border py-2 md:w-[95%]">
//             {/* actual score */}
//             <div className="border-b-gray-4 dark:border-b-gray-11/50 box-border w-11/12 border-b p-5 text-center md:p-8">
//               <h3 className="text-gray-12 dark:text-gray-3 text-[1.3rem] font-medium md:text-[1.5rem]">
//                 Your Score
//               </h3>
//               <div style={{ color }} className="mt-2 text-[1.3rem] font-semibold md:text-[1.5rem]">
//                 {Math.round(analysis.atsResult.score) || 0}
//                 <span>/100</span>
//               </div>
//             </div>
//             {/* overview for score */}
//             <div className="mt-5 w-11/12 p-4">
//               {breakdown && (
//                 <div className="flex flex-col gap-4">
//                   {progressBarConfig.map(({ key, label }, index) => {
//                     const percentage = breakdown[key]?.percentage ?? 0;
//                     return (
//                       <ProgressBar
//                         key={key}
//                         percentage={percentage}
//                         color={getScoreColor(percentage, isDark)}
//                         type={label}
//                         delay={index * 50}
//                       />
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* review section */}
//         <div className="bg-blue-5/50 border-gray-5 dark:border-gray-11/40 dark:bg-blue-12/30 text-gray-12/90 dark:text-gray-4 mx-auto mt-5 box-border w-full rounded-xl border p-5 font-medium md:col-span-7 md:mt-0 md:p-8">
//           <div className="bg-bg-gray-1 dark:bg-gray-12 box-border rounded-xl md:p-5">
//             <h3 className="text-gray-12/90 dark:text-gray-3 p-2 text-[1.2rem] font-semibold md:text-[1.3rem]">
//               ATS Parse Rate
//             </h3>
//             <p className="mt-3 p-2 text-justify text-[.9rem] leading-6 md:text-[1rem] md:leading-7">
//               An <strong>Applicant Tracking System</strong> (ATS) is software recruiters use to scan
//               and sort large numbers of resumes. A high ATS parse rate means your resume is easy for
//               these systems to read, so your skills and experience are captured correctly-making it
//               more likely your resume reaches a recruiter.
//             </p>
//             <div className="no-scrollbar mt-6 rounded-xl">
//               <div className="p-2">Your resume</div>
//               {file?.type === "application/pdf" && <PdfOnlyPreview file={file} />}

//               {file?.type ===
//                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
//                 <DocxPreview file={file} />
//               )}
//             </div>
//           </div>

//           {/* display object for testing */}
//           <div className="bg-bg-gray-1 dark:bg-gray-12 mt-6 box-border rounded-xl md:p-5">
//             <div>{aiBreakdown.finalVerdict}</div>
//             <ul>
//               {tabs.map((tab) => {
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => {
//                       setActiveTab(tab.id);
//                     }}
//                     className={`px-4 py-2 font-semibold ${activeTab == tab.id ? "border-b-2" : "text-gray-11"}`}
//                   >
//                     {tab.label}
//                   </button>
//                 );
//               })}
//               <div>{tabContent[activeTab]}</div>
//             </ul>
//             {/* tab content */}
//           </div>
//           <pre>{JSON.stringify(aiBreakdown, null, 2)}</pre>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ResumeAnalysisResult;

import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import { useNavigate } from "react-router-dom";
import ResumeLoading from "../ui/ResumeLoading";
import { useTheme } from "../../hooks/useThemeContext";
import ProgressBar from "../ui/ProgressBar";
import { useLayoutEffect } from "react";
import { PdfOnlyPreview } from "../ui/PdfPreview";
import { DocxPreview } from "../ui/DocxPreview";
import ResumeAnalysisDisplay from "../ui/ResumeAnalysisDisplay"; // Import the new component
import "./Modules.css";

type ScoreBreakdownItem = {
  score: number;
  maxScore: number;
  percentage?: number;
};
type ScoreBreakdown = Record<string, ScoreBreakdownItem>;

function ResumeAnalysisResult() {
  const { status, analysis, jobRole, error, file } = useResumeAnalysis();
  const navigate = useNavigate();
  const { theme } = useTheme();

  console.log(file);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const score = analysis?.atsResult?.score ?? 0;
  function getScoreColor(score: number, isDark: boolean) {
    if (score < 40) return isDark ? "#f87171" : "#dc2626"; // Red
    if (score < 50) return isDark ? "#fb923c" : "#ea580c"; // Slightly lighter orange
    if (score < 75) return isDark ? "#fde047" : "#facc15"; // Slightly lighter yellow
    if (score < 90) return isDark ? "#4ade80" : "#22c55e"; // Green
    return isDark ? "#22c55e" : "#16a34a"; // Darker green for 90+
  }
  const isDark = theme === "dark";
  const color = getScoreColor(score, isDark);

  const breakdown = analysis?.atsResult?.breakdown as ScoreBreakdown | undefined;
  const aiBreakdown = analysis?.aiVerdict;

  const progressBarConfig = [
    { key: "experience_quality", label: "Experience" },
    { key: "sections", label: "Sections" },
    { key: "skills_relevance", label: "Skills" },
    { key: "formatting", label: "Formatting" },
    { key: "keywords", label: "Keywords" },
  ];

  switch (status) {
    case "idle":
      navigate("/");
      return null;
    case "analyzing":
      return <ResumeLoading />;
    case "error":
      return (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      );
    default:
      break;
  }
  if (!analysis) {
    navigate("/");
    return null;
  }

  return (
    <section className="bg-gray-3 dark:bg-gray-12/70 min-h-screen w-full p-5 pt-20 md:mx-auto">
      <div className="mx-auto grid items-start gap-5 md:w-11/12 md:grid-cols-10 md:p-8">
        {/* score section */}
        <div className="top-[20%] md:sticky md:col-span-3">
          <div className="bg-bg-gray-1 dark:bg-gray-12/5 border-gray-5 dark:border-gray-11/40 flex flex-col items-center justify-center rounded-xl border py-2 md:w-[95%]">
            {/* actual score */}
            <div className="border-b-gray-4 dark:border-b-gray-11/50 box-border w-11/12 border-b p-5 text-center md:p-8">
              <h3 className="text-gray-12 dark:text-gray-3 text-[1.3rem] font-medium md:text-[1.5rem]">
                Your Score
              </h3>
              <div style={{ color }} className="mt-2 text-[1.3rem] font-semibold md:text-[1.5rem]">
                {Math.round(analysis.atsResult.score) || 0}
                <span>/100</span>
              </div>
            </div>
            {/* overview for score */}
            <div className="mt-5 w-11/12 p-4">
              {breakdown && (
                <div className="flex flex-col gap-4">
                  {progressBarConfig.map(({ key, label }, index) => {
                    const percentage = breakdown[key]?.percentage ?? 0;
                    return (
                      <ProgressBar
                        key={key}
                        percentage={percentage}
                        color={getScoreColor(percentage, isDark)}
                        type={label}
                        delay={index * 50}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* review section */}
        <div className="bg-blue-5/50 border-gray-5 dark:border-gray-11/40 dark:bg-blue-12/30 text-gray-12/90 dark:text-gray-4 mx-auto mt-5 box-border w-full rounded-xl border p-5 font-medium md:col-span-7 md:mt-0 md:p-8">
          <div className="bg-bg-gray-1 dark:bg-gray-12 box-border rounded-xl md:p-5">
            <h3 className="text-gray-12/90 dark:text-gray-3 p-2 text-[1.2rem] font-semibold md:text-[1.3rem]">
              ATS Parse Rate
            </h3>
            <p className="mt-3 p-2 text-justify text-[.9rem] leading-6 md:text-[1rem] md:leading-7">
              An <strong>Applicant Tracking System</strong> (ATS) is software recruiters use to scan
              and sort large numbers of resumes. A high ATS parse rate means your resume is easy for
              these systems to read, so your skills and experience are captured correctly-making it
              more likely your resume reaches a recruiter.
            </p>
            <div className="no-scrollbar mt-6 rounded-xl">
              <div className="p-2">Your resume</div>
              {file?.type === "application/pdf" && <PdfOnlyPreview file={file} />}
              {file?.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                <DocxPreview file={file} />
              )}
            </div>
          </div>

          {/* AI Analysis Display */}
          {aiBreakdown && (
            <ResumeAnalysisDisplay
              data={typeof aiBreakdown === "string" ? JSON.parse(aiBreakdown) : aiBreakdown}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ResumeAnalysisResult;
