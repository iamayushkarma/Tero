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
    ],
  },
]);
function App() {
  return (
    <ThemeProvider>
      <ResumeAnalysisProvider>
        <RouterProvider router={router} />
      </ResumeAnalysisProvider>
    </ThemeProvider>
  );
}
export default App;
