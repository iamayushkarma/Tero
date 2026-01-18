import { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import "../components/modules/Modules.css";

type PrivacyPolicyProps = {
  className?: string;
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const listItemVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

export default function PrivacyPolicyPage({ className = "" }: PrivacyPolicyProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const sections = [
    {
      title: "Overview",
      content: (
        <>
          Tero is a privacy-first, AI-powered ATS resume scoring system that operates entirely on
          your device. We believe in protecting your privacy by design - your resumes and job
          descriptions never leave your browser unless you explicitly choose to use AI analysis
          features.
        </>
      ),
    },
    {
      title: "No Account Required",
      content: (
        <>
          Tero does not require you to create an account or provide personal information to use the
          core features. All resume analysis happens locally in your browser, and your files are
          stored only on your device using browser local storage. We do not collect, store, or have
          access to your personal details, resumes, or job descriptions.
        </>
      ),
    },
    {
      title: "Local Storage & Your Data",
      content: (
        <motion.ul
          className="list-disc space-y-2 pl-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Local-first approach:</span> Your uploaded resumes and job
            descriptions are saved in your browser's local storage on your device only.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No server storage:</span> We do not store your files on
            our servers. Your data remains private and under your control.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">You control deletion:</span> You can clear your data at
            any time through your browser settings or by clearing Tero's local storage.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Device-specific:</span> Your data is tied to your browser
            on your device. If you use Tero on another device or browser, your previous data won't
            be there.
          </motion.li>
        </motion.ul>
      ),
    },
    {
      title: "Optional AI Analysis",
      content: (
        <>
          If you choose to use our AI-powered analysis features, the resume and job description text
          will be sent to an external AI service (such as OpenAI or Anthropic) for processing. This
          is entirely optional - you can use Tero's core features without AI. When using AI
          analysis:
          <motion.ul
            className="mt-2 list-disc space-y-2 pl-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.li variants={listItemVariant}>
              Only the text content needed for analysis is transmitted
            </motion.li>
            <motion.li variants={listItemVariant}>
              Data is sent securely over encrypted connections
            </motion.li>
            <motion.li variants={listItemVariant}>
              We do not retain copies of your data after processing
            </motion.li>
            <motion.li variants={listItemVariant}>
              Third-party AI providers may temporarily process your data according to their privacy
              policies
            </motion.li>
          </motion.ul>
        </>
      ),
    },
    {
      title: "Information We Don't Collect",
      content: (
        <motion.ul
          className="list-disc space-y-2 pl-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No personal accounts:</span> We don't collect names,
            emails, passwords, or any account information.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No resume storage:</span> Your resumes are never uploaded
            to or stored on our servers.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No tracking:</span> We don't use tracking cookies or
            third-party analytics that identify you personally.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No sale of data:</span> Since we don't collect your
            personal data, there's nothing to sell.
          </motion.li>
        </motion.ul>
      ),
    },
    {
      title: "Anonymous Usage Data",
      content: (
        <>
          To improve Tero, we may collect minimal, anonymous usage statistics such as:
          <motion.ul
            className="mt-2 list-disc space-y-2 pl-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.li variants={listItemVariant}>
              Feature usage patterns (which features are used most)
            </motion.li>
            <motion.li variants={listItemVariant}>Error logs and performance metrics</motion.li>
            <motion.li variants={listItemVariant}>
              General device information (browser type, screen size)
            </motion.li>
            <motion.li variants={listItemVariant}>
              Approximate location (city/region level, via IP address)
            </motion.li>
          </motion.ul>
          This data is aggregated, anonymized, and cannot be used to identify you personally.
        </>
      ),
    },
    {
      title: "Cookies & Local Storage",
      content: (
        <motion.ul
          className="list-disc space-y-2 pl-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Essential storage:</span> We use browser local storage to
            save your preferences and uploaded content on your device.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No tracking cookies:</span> We do not use cookies for
            advertising or cross-site tracking.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Session cookies:</span> May be used for basic
            functionality and security.
          </motion.li>
        </motion.ul>
      ),
    },
    {
      title: "Security",
      content: (
        <>
          Since your data stays on your device, you maintain full control over its security.
          However:
          <motion.ul
            className="mt-2 list-disc space-y-2 pl-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.li variants={listItemVariant}>
              If you use AI features, data is transmitted over secure, encrypted connections
              (HTTPS/TLS).
            </motion.li>
            <motion.li variants={listItemVariant}>
              We follow industry best practices for web security and code safety.
            </motion.li>
            <motion.li variants={listItemVariant}>
              We recommend using up-to-date browsers and keeping your device secure with passwords
              and encryption.
            </motion.li>
          </motion.ul>
        </>
      ),
    },
    {
      title: "Third-Party Services",
      content: (
        <>
          Tero may integrate with third-party services for optional features:
          <motion.ul
            className="mt-2 list-disc space-y-2 pl-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.li variants={listItemVariant}>
              <span className="font-medium">AI providers:</span> For optional AI analysis (e.g.,
              OpenAI, Anthropic)
            </motion.li>
            <motion.li variants={listItemVariant}>
              <span className="font-medium">Analytics:</span> For anonymous usage statistics (if
              applicable)
            </motion.li>
          </motion.ul>
          These services have their own privacy policies. We recommend reviewing them if you use
          these features.
        </>
      ),
    },
    {
      title: "Your Rights & Control",
      content: (
        <motion.ul
          className="list-disc space-y-2 pl-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Data access:</span> Your data is stored locally on your
            device. You can access it through your browser's developer tools.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Data deletion:</span> Clear your browser's local storage
            or use Tero's delete functions to remove your data.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">No data portability needed:</span> Since data is local,
            you already have full access to it.
          </motion.li>
          <motion.li variants={listItemVariant}>
            <span className="font-medium">Opt-out:</span> Don't use AI features if you prefer to
            keep everything local.
          </motion.li>
        </motion.ul>
      ),
    },
    {
      title: "Children's Privacy",
      content: (
        <>
          Tero is not intended for children under 13 years of age (or the minimum age required in
          your region). We do not knowingly collect personal information from children. Since we
          don't collect personal data, this risk is minimal.
        </>
      ),
    },
    {
      title: "International Users",
      content: (
        <>
          Tero can be used from anywhere in the world. Since processing happens locally on your
          device, your data doesn't cross borders unless you use optional AI features. When using
          AI, your data may be processed by servers located in various countries, subject to their
          respective privacy laws.
        </>
      ),
    },
    {
      title: "Changes to This Policy",
      content: (
        <>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          for legal reasons. We will post the updated policy on this page with a new "Last updated"
          date. Your continued use of Tero after changes indicates your acceptance of the updated
          policy.
        </>
      ),
    },
    {
      title: "Contact Us",
      content: (
        <>
          For privacy questions, concerns, or requests, contact us at{" "}
          <motion.a
            href="mailto:ayushkarma.dev@gmail.com"
            className="text-blue-11 hover:text-blue-12 dark:text-dark-blue-11 dark:hover:text-dark-blue-12 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ayushkarma.dev@gmail.com
          </motion.a>
          <br />
        </>
      ),
    },
  ];

  return (
    <>
      <motion.div
        className="relative mt-18 flex h-60 flex-col items-center justify-center p-10 md:h-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="StartResumeScan pointer-events-none absolute inset-0 overflow-hidden"></div>
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            variants={fadeInUp}
          >
            Privacy Policy
          </motion.h1>
          <motion.p className="text-gray-3 mt-2 text-center text-sm" variants={fadeInUp}>
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>
        </motion.div>
      </motion.div>

      <div
        className={[
          "min-h-screen px-4 py-10",
          "bg-bg-gray-1 text-gray-12",
          "dark:bg-dark-bg-gray-1 dark:text-dark-gray-12",
          className,
        ].join(" ")}
      >
        <motion.div
          className="z-99999999 mx-auto w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border shadow-sm"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            whileHover={{
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="px-6 py-6 sm:px-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {/* Introduction Box */}
                <motion.div
                  className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 mb-6 rounded-xl border p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-gray-11 dark:text-dark-gray-11 m-0 text-sm leading-6">
                    <span className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      Privacy-First by Design:
                    </span>{" "}
                    Tero processes your resumes locally on your device. No account required, no
                    personal data collected, no server storage. Your privacy is our priority.
                  </p>
                </motion.div>

                <motion.p
                  className="text-gray-11 dark:text-dark-gray-11"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  This Privacy Policy describes how Tero collects, uses, and protects information
                  when you use our website and services. Our commitment to privacy means we've built
                  Tero to minimize data collection and maximize your control.
                </motion.p>

                {sections.map((s, index) => (
                  <motion.section
                    key={s.title}
                    className="mt-6"
                    variants={slideInLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.h2
                      className="text-gray-12 dark:text-dark-gray-12 text-lg font-semibold"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {s.title}
                    </motion.h2>
                    <motion.div
                      className="text-gray-11 dark:text-dark-gray-11 mt-2 text-sm leading-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {s.content}
                    </motion.div>
                  </motion.section>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-gray-9 dark:text-dark-gray-9 mt-4 text-center text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            © {new Date().getFullYear()} Tero. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
