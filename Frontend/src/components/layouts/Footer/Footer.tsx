import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useThemeContext";
import TeroLogo from "../../../assets/logos/Tero-icon.png";
import TeroLogoDark from "../../../assets/logos/Tero-dark.png";

function Footer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="p-16">
      <div>
        <div>
          <Link to="/">
            <div>
              <img
                alt="Tero logo"
                src={theme === "dark" ? TeroLogoDark : TeroLogo}
                className="h-4 w-auto object-contain md:h-5 lg:h-6"
              />
            </div>
          </Link>
          <div>
            <p>
              Tero analyzes your resume and highlights what matters — making optimization easier,
              faster, and more effective.
            </p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Footer;
