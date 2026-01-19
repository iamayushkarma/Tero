import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { ResumeAnalysisProvider } from "./context/ResumeAnalysisContext";
import ResumeAnalysisResult from "./components/modules/ResumeAnalysisResult";
import { helix } from "ldrs";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfService";
import SupportPage from "./pages/Support";
import ResumeOptimizationPage from "./pages/ResumeOptimization";
import ResumeTipsPage from "./pages/ResumeTips";
import ResumeGuidePage from "./pages/Guide";
import AboutPage from "./pages/About";
import ScrollToTop from "./components/ui/ScrollToTop";
import NotFound from "./pages/NotFound";

helix.register();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/resume-analysis", element: <ResumeAnalysisResult /> },
      { path: "/privacy", element: <PrivacyPolicyPage /> },
      { path: "/terms-of-service", element: <TermsOfServicePage /> },
      { path: "/support", element: <SupportPage /> },
      { path: "/optimize", element: <ResumeOptimizationPage /> },
      { path: "/tips", element: <ResumeTipsPage /> },
      { path: "/guides", element: <ResumeGuidePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <>
      <ScrollToTop />
      <ThemeProvider>
        <ResumeAnalysisProvider>
          <RouterProvider router={router} />
        </ResumeAnalysisProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
