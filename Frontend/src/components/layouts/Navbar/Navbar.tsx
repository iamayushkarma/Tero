import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../hooks/useThemeContext";
import TeroLogo from "../../../assets/logos/Tero-icon.png";
import TeroLogoDark from "../../../assets/logos/Tero-dark.png";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="bg-bg-blue-1 fixed z-50 flex h-16 w-full items-center justify-center py-3 dark:bg-[#151518]">
      <div className="flex w-11/12 items-center justify-between">
        {/* Logo section */}
        <Link to="/">
          <div>
            <img
              alt="Tero logo"
              src={theme === "dark" ? TeroLogoDark : TeroLogo}
              className="h-6 w-auto object-contain md:h-7 lg:h-8"
            />
          </div>
        </Link>
        {/* Dark mode toggler */}
        <div
          onClick={toggleTheme}
          className="hover:bg-gray-3 dark:hover:bg-dark-gray-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-100"
        >
          {theme === "dark" ? (
            <Sun className="text-dark-gray-11" size={20} />
          ) : (
            <Moon className="text-gray-11" size={20} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
