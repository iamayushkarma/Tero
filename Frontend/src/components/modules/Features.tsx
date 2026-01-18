import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Gauge,
  Puzzle,
  SearchCheck,
  Layers,
  AlignCenter,
  Briefcase,
  SpellCheck,
  ListChecks,
} from "lucide-react";
import { useState } from "react";

interface FeatureCardProps {
  icon: React.ElementType;
  iconColor: string;
  bgClass: string;
  heading: string;
  info: string;
  index: number;
}

const featureCardContent = [
  {
    icon: Gauge,
    iconColor: "#EF4444",
    bgClass: "bg-red-100 dark:bg-[#3A1F22]",
    heading: "ATS Resume Score",
    info: "Measure how well your resume aligns with modern ATS parsing and screening standards. Get a clear score that reflects how likely your resume is to pass automated filters.",
  },
  {
    icon: Puzzle,
    iconColor: "#3B82F6",
    bgClass: "bg-blue-100 dark:bg-[#1C2F45]",
    heading: "Skill Match Analysis",
    info: "Compare your skills with job requirements to identify strong matches, gaps, and weak areas. This helps you focus on skills that matter most for the role.",
  },
  {
    icon: SearchCheck,
    iconColor: "#22C55E",
    bgClass: "bg-green-100 dark:bg-[#1F4D3A]",
    heading: "Keyword Coverage",
    info: "Analyze job-specific keywords and see what's missing or overused in your resume. Ensure critical terms appear naturally in the right sections.",
  },
  {
    icon: Layers,
    iconColor: "#F59E0B",
    bgClass: "bg-yellow-100 dark:bg-[#4A3A1E]",
    heading: "Section-Wise Resume Review",
    info: "Evaluate each resume section separately, including experience, skills, projects, and education. This ensures every section is clear, complete, and ATS-friendly.",
  },
  {
    icon: AlignCenter,
    iconColor: "#A855F7",
    bgClass: "bg-purple-100 dark:bg-[#3A2A4A]",
    heading: "Formatting & Readability",
    info: "Check layout, spacing, and structure to ensure your resume is easy to scan. Avoid formatting issues that can confuse ATS systems or recruiters.",
  },
  {
    icon: Briefcase,
    iconColor: "#FB923C",
    bgClass: "bg-orange-100 dark:bg-[#4A2F1E]",
    heading: "Experience Relevance",
    info: "Assess how relevant your experience and projects are to the target role. The AI highlights areas that need clearer impact or better alignment.",
  },
  {
    icon: SpellCheck,
    iconColor: "#F472B6",
    bgClass: "bg-pink-100 dark:bg-[#4A2436]",
    heading: "Language & Style Checks",
    info: "Identify weak wording, overused phrases, and passive sentences. Improve clarity and tone to make your resume more professional and impactful.",
  },
  {
    icon: ListChecks,
    iconColor: "#9CA3AF",
    bgClass: "bg-gray-100 dark:bg-[#2A2E35]",
    heading: "Resume Consistency",
    info: "Verify contact details, dates, section order, and overall completeness. Catch small inconsistencies that can reduce credibility during screening.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Features() {
  return (
    <div className="mx-auto mb-30 w-[95%] p-4 pt-20">
      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.span
          className="text-primary border-gray-7 dark:border-gray-10 mx-auto flex w-fit items-center justify-center gap-2 rounded-lg border px-2 py-0.5 text-[.8rem] font-medium select-none md:text-[.9rem]"
          variants={headingVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="text-primary size-4"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </motion.svg>
          <p>Our Features</p>
        </motion.span>

        <motion.h2
          className="text-gray-12 dark:text-gray-3 mx-auto mt-8 text-center text-[1.2rem] font-semibold md:w-1/2 lg:text-4xl"
          variants={headingVariants}
        >
          Smart resume analysis focused on issues recruiters and ATS notice first
        </motion.h2>

        <motion.p
          className="text-gray-11 dark:text-gray-9 mx-auto mt-4 text-center text-[.9rem] md:w-[40%] lg:text-[.95rem]"
          variants={headingVariants}
        >
          Evaluate content, formatting, and relevance to improve how your resume performs during
          initial screening.
        </motion.p>
      </motion.div>

      {/* Feature cards */}
      <div className="mx-auto mt-12 grid gap-6 md:w-[85%] md:grid-cols-2 lg:grid-cols-4">
        {featureCardContent.map((feature, index) => {
          return <FeatureCard key={index} {...feature} index={index} />;
        })}
      </div>
    </div>
  );
}

export default Features;

const FeatureCard = ({
  icon: Icon,
  iconColor,
  bgClass,
  heading,
  info,
  index,
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for subtle tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="border-gray-5 dark:border-gray-12 relative cursor-pointer overflow-hidden rounded-lg border-2 p-4 md:p-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(circle at ${x.get() * 100 + 50}% ${y.get() * 100 + 50}%, rgba(255,255,255,0.05), transparent 50%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <div style={{ transform: "translateZ(20px)" }}>
        <motion.div
          className={`w-fit rounded-lg p-2.5 transition-colors md:p-3 ${bgClass}`}
          whileHover={{
            scale: 1.05,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.4 },
          }}
        >
          <motion.div
            animate={
              isHovered
                ? {
                    y: [0, -2, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.2,
            }}
          >
            <Icon aria-hidden className="h-4 w-4 md:h-6 md:w-6" style={{ color: iconColor }} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="mt-6" style={{ transform: "translateZ(30px)" }}>
        <h4 className="text-gray-12 dark:text-gray-3 text-[1rem] font-semibold sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.2rem]">
          {heading}
        </h4>
        <p className="text-gray-11 dark:text-gray-9 lg-text[1.1rem] mt-2 text-[.8rem] md:text-[.9rem]">
          {info}
        </p>
      </motion.div>
    </motion.div>
  );
};
