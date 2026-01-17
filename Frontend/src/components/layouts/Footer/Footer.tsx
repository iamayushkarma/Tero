import { Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useThemeContext";
import TeroLogo from "../../../assets/logos/Tero-icon.png";
import TeroLogoDark from "../../../assets/logos/Tero-dark.png";
import { useNavigate } from "react-router-dom";

function Footer() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const navigateTOp = () => {
    navigate("");
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "How It Works", href: "/how-it-works" },
        { name: "ATS Score", href: "/ats-score" },
        { name: "Resume Optimization", href: "/optimize" },
        { name: "Examples", href: "/examples" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Resume Tips", href: "/tips" },
        { name: "FAQ", href: "/faq" },
        { name: "Guides", href: "/guides" },
        { name: "Support", href: "/support" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Contact", href: "mailto:ayushkarma.dev@gmail.com" },
        { name: "GitHub", href: "https://github.com/iamayushkarma/Tero" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <div className="bg-gray-3 dark:bg-gray-12/30 text-gray-11 dark:text-gray-7 z-10 w-full p-8 pb-0 md:p-16">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* left section */}
        <div className="">
          {/* Logo */}
          <Link to="/">
            <div className="gap-2 py-6">
              <img
                alt="Tero logo"
                src={theme === "dark" ? TeroLogoDark : TeroLogo}
                className="h-5 w-auto object-contain md:h-6 lg:h-7"
              />
            </div>
          </Link>
          {/* Sub information */}
          <div className="max-w-md leading-relaxed">
            <p className="max-sm:text-[.9rem]">
              Tero analyzes your resume and highlights what matters - making optimization easier,
              faster, and more effective.
            </p>
          </div>
          {/* social media icons */}
          <div className="mt-3 flex gap-2 max-sm:mt-6 md:py-4">
            <a
              href="https://github.com/iamayushkarma/Tero"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:hover:text-gray-5 text-gray-500 transition hover:text-gray-800"
            >
              <Github className="size-5" />
            </a>
            <a
              href="mailto:ayushkarma.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:hover:text-gray-5 text-gray-500 transition hover:text-gray-800"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>
        {/* right section */}
        <div className="flex lg:justify-end">
          <div className="grid grid-cols-1 gap-10 text-sm sm:grid-cols-3 md:gap-16">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-gray-12 dark:text-bg-gray-2 mb-3 text-[.95rem] font-bold md:text-[1rem]">
                  {section.title}
                </h4>

                <ul className="space-y-3 md:space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="hover:text-gray-12 hover:dark:text-bg-gray-2 hover:underline"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer bottom bar */}
      <div className="border-t-gray-7 dark:border-t-gray-10 mt-6 flex justify-between border-t-2 pt-6 max-sm:mb-10 max-sm:flex-col">
        <div className="mt-4">
          <p className="text-gray-11 dark:text-gray-7 md:text[1rem] text-sm font-medium">
            © 2025 Tero. Crafted by Ayush Karma.
          </p>
        </div>
        <div className="mt-4 flex gap-3 text-sm underline max-sm:flex-col md:gap-6">
          <button
            onClick={() => navigate("/privacy")}
            className="hover:text-gray-12 hover:dark:text-bg-gray-2"
          >
            Privacy Policy{" "}
          </button>
          <button
            onClick={() => navigate("/terms-of-service")}
            className="hover:text-gray-12 hover:dark:text-bg-gray-2"
          >
            Terms of Service{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
