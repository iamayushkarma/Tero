// import { Github, Mail } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useTheme } from "../../../hooks/useThemeContext";
// import TeroLogo from "../../../assets/logos/Tero-icon.png";
// import TeroLogoDark from "../../../assets/logos/Tero-dark.png";

// function Footer() {
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const scrollToSection = (sectionId: string) => {
//     if (location.pathname === "/") {
//       document.getElementById(sectionId)?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     } else {
//       // Better than setTimeout: put the id in the URL hash, then Home page scrolls
//       navigate(`/#${sectionId}`);
//     }
//   };

//   const footerLinks = [
//     {
//       title: "Product",
//       links: [
//         { name: "How It Works", href: "#how-it-works" },
//         { name: "ATS Score", href: "#ats-score" },
//         { name: "Resume Optimization", href: "/optimize" },
//         { name: "Features", href: "#tero-features" },
//       ],
//     },
//     {
//       title: "Resources",
//       links: [
//         { name: "Resume Tips", href: "/tips" },
//         { name: "FAQ", href: "#faq" },
//         { name: "Guides", href: "/guides" },
//         { name: "Support", href: "/support" },
//       ],
//     },
//     {
//       title: "Company",
//       links: [
//         { name: "About", href: "/about" },
//         { name: "Contact", href: "mailto:ayushkarma.dev@gmail.com" },
//         { name: "GitHub", href: "https://github.com/iamayushkarma/Tero" },
//         { name: "Privacy Policy", href: "/privacy" },
//       ],
//     },
//   ];

//   return (
//     <div className="bg-gray-3 dark:bg-gray-12/30 text-gray-11 dark:text-gray-7 z-10 w-full p-8 pb-0 md:p-16">
//       <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
//         {/* left section */}
//         <div>
//           {/* Logo */}
//           <Link to="/">
//             <div className="gap-2 py-6">
//               <img
//                 alt="Tero logo"
//                 src={theme === "dark" ? TeroLogoDark : TeroLogo}
//                 className="h-5 w-auto object-contain md:h-6 lg:h-7"
//               />
//             </div>
//           </Link>

//           {/* Sub information */}
//           <div className="max-w-md leading-relaxed">
//             <p className="max-sm:text-[.9rem]">
//               Tero analyzes your resume and highlights what matters - making optimization easier,
//               faster, and more effective.
//             </p>
//           </div>

//           {/* social media icons */}
//           <div className="mt-3 flex gap-2 max-sm:mt-6 md:py-4">
//             <a
//               href="https://github.com/iamayushkarma/Tero"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="dark:hover:text-gray-5 text-gray-500 transition hover:text-gray-800"
//             >
//               <Github className="size-5" />
//             </a>

//             <a
//               href="mailto:ayushkarma.dev@gmail.com"
//               className="dark:hover:text-gray-5 text-gray-500 transition hover:text-gray-800"
//             >
//               <Mail className="size-5" />
//             </a>
//           </div>
//         </div>

//         {/* right section */}
//         <div className="flex lg:justify-end">
//           <div className="grid grid-cols-1 gap-10 text-sm sm:grid-cols-3 md:gap-16">
//             {footerLinks.map((section) => (
//               <div key={section.title}>
//                 <h4 className="text-gray-12 dark:text-bg-gray-2 mb-3 text-[.95rem] font-bold md:text-[1rem]">
//                   {section.title}
//                 </h4>

//                 <ul className="space-y-3 md:space-y-4">
//                   {section.links.map((link) => {
//                     const isExternal =
//                       link.href.startsWith("http") || link.href.startsWith("mailto:");
//                     const isHash = link.href.startsWith("#");

//                     return (
//                       <li key={link.name}>
//                         {isHash ? (
//                           <button
//                             type="button"
//                             onClick={() => scrollToSection(link.href.slice(1))}
//                             className="hover:text-gray-12 hover:dark:text-bg-gray-2 cursor-pointer text-left hover:underline"
//                           >
//                             {link.name}
//                           </button>
//                         ) : isExternal ? (
//                           <a
//                             href={link.href}
//                             className="hover:text-gray-12 hover:dark:text-bg-gray-2 hover:underline"
//                             target={link.href.startsWith("http") ? "_blank" : undefined}
//                             rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
//                           >
//                             {link.name}
//                           </a>
//                         ) : (
//                           <Link
//                             to={link.href}
//                             className="hover:text-gray-12 hover:dark:text-bg-gray-2 hover:underline"
//                           >
//                             {link.name}
//                           </Link>
//                         )}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Footer bottom bar */}
//       <div className="border-t-gray-7 dark:border-t-gray-10 mt-6 flex justify-between border-t-2 pt-6 max-sm:mb-10 max-sm:flex-col">
//         <div className="mt-4">
//           <p className="text-gray-11 dark:text-gray-7 md:text[1rem] text-sm font-medium">
//             © 2025 Tero. Crafted by Ayush Karma.
//           </p>
//         </div>

//         <div className="mt-4 flex gap-3 text-sm underline max-sm:flex-col md:gap-6">
//           <button
//             onClick={() => navigate("/privacy")}
//             className="hover:text-gray-12 hover:dark:text-bg-gray-2"
//           >
//             Privacy Policy
//           </button>
//           <button
//             onClick={() => navigate("/terms-of-service")}
//             className="hover:text-gray-12 hover:dark:text-bg-gray-2"
//           >
//             Terms of Service
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Footer;

import { Github, Mail } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTheme } from "../../../hooks/useThemeContext";
import TeroLogo from "../../../assets/logos/Tero-icon.png";
import TeroLogoDark from "../../../assets/logos/Tero-dark.png";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Footer() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "How It Works", href: "#how-it-works" },
        { name: "ATS Score", href: "#ats-score" },
        { name: "Resume Optimization", href: "/optimize" },
        { name: "Features", href: "#tero-features" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Resume Tips", href: "/tips" },
        { name: "FAQ", href: "#faq" },
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
    <motion.div
      className="bg-gray-3 dark:bg-gray-12/30 text-gray-11 dark:text-gray-7 z-10 w-full p-8 pb-0 md:p-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* left section */}
        <motion.div variants={itemVariants}>
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="gap-2 py-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img
                alt="Tero logo"
                src={theme === "dark" ? TeroLogoDark : TeroLogo}
                className="h-5 w-auto object-contain md:h-6 lg:h-7"
              />
            </motion.div>
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
            <motion.a
              href="https://github.com/iamayushkarma/Tero"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:hover:text-gray-5 text-gray-500 transition hover:text-gray-800"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Github className="size-5" />
            </motion.a>
            <motion.a
              href="mailto:ayushkarma.dev@gmail.com"
              className="dark:hover:text-gray-5 text-gray-500 transition hover:text-gray-800"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className="size-5" />
            </motion.a>
          </div>
        </motion.div>

        {/* right section */}
        <motion.div className="flex lg:justify-end" variants={itemVariants}>
          <div className="grid grid-cols-1 gap-10 text-sm sm:grid-cols-3 md:gap-16">
            {footerLinks.map((section, sectionIndex) => (
              <motion.div key={section.title} variants={itemVariants}>
                <h4 className="text-gray-12 dark:text-bg-gray-2 mb-3 text-[.95rem] font-bold md:text-[1rem]">
                  {section.title}
                </h4>
                <motion.ul
                  className="space-y-3 md:space-y-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                >
                  {section.links.map((link) => {
                    const isExternal =
                      link.href.startsWith("http") || link.href.startsWith("mailto:");
                    const isHash = link.href.startsWith("#");

                    return (
                      <motion.li key={link.name} variants={linkVariants}>
                        {isHash ? (
                          <motion.button
                            type="button"
                            onClick={() => scrollToSection(link.href.slice(1))}
                            className="hover:text-gray-12 hover:dark:text-bg-gray-2 cursor-pointer text-left hover:underline"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.name}
                          </motion.button>
                        ) : isExternal ? (
                          <motion.a
                            href={link.href}
                            className="hover:text-gray-12 hover:dark:text-bg-gray-2 hover:underline"
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.name}
                          </motion.a>
                        ) : (
                          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                            <Link
                              to={link.href}
                              className="hover:text-gray-12 hover:dark:text-bg-gray-2 hover:underline"
                            >
                              {link.name}
                            </Link>
                          </motion.div>
                        )}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer bottom bar */}
      <motion.div
        className="border-t-gray-7 dark:border-t-gray-10 mt-6 flex justify-between border-t-2 pt-6 max-sm:mb-10 max-sm:flex-col"
        variants={itemVariants}
      >
        <div className="mt-4">
          <p className="text-gray-11 dark:text-gray-7 md:text[1rem] text-sm font-medium">
            © 2025 Tero. Crafted by Ayush Karma.
          </p>
        </div>
        <div className="mt-4 flex gap-3 text-sm underline max-sm:flex-col md:gap-6">
          <motion.button
            onClick={() => navigate("/privacy")}
            className="hover:text-gray-12 hover:dark:text-bg-gray-2"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            Privacy Policy
          </motion.button>
          <motion.button
            onClick={() => navigate("/terms-of-service")}
            className="hover:text-gray-12 hover:dark:text-bg-gray-2"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            Terms of Service
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Footer;
