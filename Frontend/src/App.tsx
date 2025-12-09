import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import { ThemeProvider } from "./context/ThemeContext";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> }
    ]
  }
])
function App(){
    return (
      <ThemeProvider>
        <RouterProvider router={router} />;
      </ThemeProvider>
    )
}
export default App;
