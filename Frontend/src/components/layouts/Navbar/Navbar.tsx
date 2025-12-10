// import TeroLogo from "../../../assets/logos/Tero-dark.png";
import { Sun, Moon } from "lucide-react";
import TeroLogo from "../../../assets/logos/Tero-icon.png";
import TeroLogoDark from "../../../assets/logos/Tero-dark.png";
import { useTheme } from "../../../hooks/useThemeContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  console.log(theme)
  return (
    <div className="fixed z-50 h-16 bg-bg-blue-1 dark:bg-dark-bg-blue-1 w-full py-3 flex items-center justify-center">
      <div className="w-11/12 flex justify-between items-center">
        {/* Logo section */}
        <Link to="/">
        <div>
            <img alt="Tero logo" src={theme === 'dark' ? TeroLogoDark : TeroLogo}  className="h-6 w-auto md:h-7 lg:h-8 object-contain" />
        </div>
        </Link>

        {/* Dark mode toggler */}
        <div onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-3 dark:hover:bg-dark-gray-3 transition-all duration-100">
        { theme === "dark" ? <Sun className="text-dark-gray-11" size={20}/> : <Moon className="text-gray-11" size={20}/> }
        </div>
      </div>
    </div>
  )
}

export default Navbar
