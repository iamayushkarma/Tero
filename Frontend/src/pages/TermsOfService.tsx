import { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import "../components/modules/Modules.css";

type TermsOfServiceProps = {
  className?: string;
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function TermsOfServicePage({ className = "" }: TermsOfServiceProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const sections = [
    {
      title: "Acceptance of Terms",
      content: (
        <>
          By accessing or using Tero (the "Service"), you agree to be bound by these Terms of
          Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
          These Terms apply to all visitors, users, and others who access or use the Service.
        </>
      ),
    },
    {
      title: "Description of Service",
      content: (
        <>
          Tero is an AI-powered applicant tracking system (ATS) resume scoring tool that helps users
          analyze and optimize their resumes against job descriptions. The Service operates
          primarily in your browser and includes:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Local resume analysis and scoring</li>
            <li>Job description comparison tools</li>
            <li>Optional AI-powered recommendations and insights</li>
            <li>Resume optimization suggestions</li>
            <li>ATS compatibility checking</li>
          </ul>
        </>
      ),
    },
    {
      title: "No Account Required",
      content: (
        <>
          Tero does not require account creation for basic functionality. The Service operates
          locally in your browser, and your data is stored on your device using browser local
          storage. You are responsible for maintaining the security of your device and any data
          stored locally.
        </>
      ),
    },
    {
      title: "User Responsibilities",
      content: (
        <>
          When using Tero, you agree to:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">Provide accurate information:</span> Ensure that any
              resumes or job descriptions you analyze contain accurate and truthful information.
            </li>
            <li>
              <span className="font-medium">Use for lawful purposes only:</span> Not use the Service
              for any illegal or unauthorized purpose.
            </li>
            <li>
              <span className="font-medium">Respect intellectual property:</span> Only upload and
              analyze content you own or have permission to use.
            </li>
            <li>
              <span className="font-medium">No malicious use:</span> Not attempt to compromise,
              hack, or interfere with the Service's functionality.
            </li>
            <li>
              <span className="font-medium">No automated abuse:</span> Not use bots, scrapers, or
              automated tools to access the Service excessively.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Acceptable Use Policy",
      content: (
        <>
          You may NOT use Tero to:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Upload or analyze content that is illegal, harmful, or offensive</li>
            <li>Impersonate others or misrepresent your identity or qualifications</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights of others</li>
            <li>Distribute malware, viruses, or harmful code</li>
            <li>Attempt to reverse engineer or decompile the Service</li>
            <li>
              Use the Service to spam, harass, or send unsolicited communications to third parties
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "AI Features & Third-Party Services",
      content: (
        <>
          Tero offers optional AI-powered features that may send your resume and job description
          content to third-party AI service providers (such as OpenAI or Anthropic). By using these
          features, you:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Acknowledge that your data will be processed by third-party AI services</li>
            <li>Agree to the terms and privacy policies of those third-party providers</li>
            <li>Understand that Tero cannot guarantee the accuracy of AI-generated results</li>
            <li>Accept that AI suggestions are for informational purposes only</li>
          </ul>
        </>
      ),
    },
    {
      title: "Intellectual Property",
      content: (
        <>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">Tero's IP:</span> The Service, including its design,
              features, code, and branding, is owned by Tero and protected by copyright, trademark,
              and other intellectual property laws.
            </li>
            <li>
              <span className="font-medium">Your content:</span> You retain all ownership rights to
              your resumes and content. By using the Service, you grant Tero a limited,
              non-exclusive license to process your content solely to provide the Service.
            </li>
            <li>
              <span className="font-medium">Generated results:</span> Scoring results, suggestions,
              and analysis generated by Tero are provided to you for your personal use. You may use
              them freely to improve your resume.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Disclaimer of Warranties",
      content: (
        <>
          <span className="font-semibold">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
          </span>{" "}
          Tero does not guarantee that:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>The Service will be error-free, uninterrupted, or secure</li>
            <li>Results will be accurate, complete, or up-to-date</li>
            <li>AI suggestions will improve your job search outcomes</li>
            <li>The Service will meet your specific requirements</li>
            <li>Any errors or defects will be corrected</li>
          </ul>
          <p className="mt-3">
            You use the Service at your own risk. Tero is not responsible for employment decisions
            made by you or employers based on information processed through the Service.
          </p>
        </>
      ),
    },
    {
      title: "Limitation of Liability",
      content: (
        <>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, TERO SHALL NOT BE LIABLE FOR:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              Any indirect, incidental, special, consequential, or punitive damages arising from
              your use of the Service
            </li>
            <li>Loss of data, profits, opportunities, or employment resulting from the Service</li>
            <li>Damages resulting from third-party AI services or integrations</li>
            <li>Unauthorized access to your locally stored data</li>
            <li>Errors, bugs, or security vulnerabilities in the Service</li>
          </ul>
          <p className="mt-3">
            In no event shall Tero's total liability exceed $100 USD or the amount you paid to use
            the Service (if applicable), whichever is greater.
          </p>
        </>
      ),
    },
    {
      title: "Indemnification",
      content: (
        <>
          You agree to indemnify and hold harmless Tero, its affiliates, and their respective
          officers, directors, and employees from any claims, damages, losses, liabilities, and
          expenses (including legal fees) arising from:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another party</li>
            <li>Content you upload or process through the Service</li>
          </ul>
        </>
      ),
    },
    {
      title: "No Professional Advice",
      content: (
        <>
          Tero provides tools and suggestions for resume optimization. However, the Service does not
          provide professional career counseling, legal advice, or employment guarantees. Results
          and suggestions are for informational purposes only. You should consult with qualified
          professionals for career guidance and legal matters.
        </>
      ),
    },
    {
      title: "Data and Privacy",
      content: (
        <>
          Your use of Tero is also governed by our Privacy Policy. By using the Service, you consent
          to our data practices as described in the Privacy Policy. Since Tero operates locally, you
          maintain control over your data stored on your device.
        </>
      ),
    },
    {
      title: "Modifications to Service",
      content: (
        <>
          Tero reserves the right to:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Modify, suspend, or discontinue the Service at any time without notice</li>
            <li>Update features, change functionality, or remove capabilities</li>
            <li>Impose usage limits or restrictions</li>
            <li>Change pricing or introduce fees for previously free features</li>
          </ul>
          <p className="mt-3">
            We will make reasonable efforts to notify users of significant changes, but we are not
            obligated to do so.
          </p>
        </>
      ),
    },
    {
      title: "Termination",
      content: (
        <>
          You may stop using the Service at any time by ceasing access and clearing your local
          browser data. Tero may terminate or suspend your access to the Service immediately,
          without notice, if you violate these Terms or for any other reason at our discretion.
          <p className="mt-3">
            Upon termination, your right to use the Service ceases immediately. Since data is stored
            locally, you can delete your data by clearing your browser storage.
          </p>
        </>
      ),
    },
    {
      title: "Governing Law",
      content: (
        <>
          These Terms shall be governed by and construed in accordance with the laws of [Your
          Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from
          these Terms or the Service shall be resolved in the courts of [Your Jurisdiction].
        </>
      ),
    },
    {
      title: "Changes to Terms",
      content: (
        <>
          We may update these Terms from time to time. When we do, we will update the "Last updated"
          date at the top of this page. Material changes will be communicated through the Service or
          via email (if you have provided one). Your continued use of the Service after changes
          constitutes acceptance of the updated Terms.
        </>
      ),
    },
    {
      title: "Severability",
      content: (
        <>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining
          provisions shall remain in full force and effect. The invalid provision will be modified
          to the minimum extent necessary to make it valid and enforceable.
        </>
      ),
    },
    {
      title: "Entire Agreement",
      content: (
        <>
          These Terms, together with the Privacy Policy, constitute the entire agreement between you
          and Tero regarding the Service and supersede all prior agreements and understandings.
        </>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <>
          For questions about these Terms of Service, please contact us at:{" "}
          <motion.a
            href="mailto:ayushkarma.dev@gmail.com"
            className="text-blue-11 hover:text-blue-12 dark:text-dark-blue-11 dark:hover:text-dark-blue-12 font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            ayushkarma.dev@gmail.com
          </motion.a>
          <p className="mt-3">
            For technical support or general inquiries, you may also reach out to the same email
            address.
          </p>
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
        transition={{ duration: 0.7 }}
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
            Terms of Service
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
        <div className="z-99999999 mx-auto w-full max-w-3xl">
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
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-gray-11 dark:text-dark-gray-11 m-0 text-sm leading-6">
                    <span className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      Important Notice:
                    </span>{" "}
                    By using Tero, you agree to these Terms of Service. Please read them carefully.
                    These terms govern your use of our AI-powered resume scoring service and outline
                    your rights and responsibilities.
                  </p>
                </motion.div>

                <motion.p
                  className="text-gray-11 dark:text-dark-gray-11"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  Welcome to Tero! These Terms of Service ("Terms") govern your access to and use of
                  the Tero website and services. By using Tero, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms.
                </motion.p>

                {sections.map((s, index) => (
                  <motion.section
                    key={s.title}
                    className="mt-6"
                    variants={slideInLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <motion.h2
                      className="text-gray-12 dark:text-dark-gray-12 text-lg font-semibold"
                      whileHover={{ x: 3 }}
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

                {/* Footer Note */}
                <motion.div
                  className="border-gray-6 bg-gray-3 dark:border-dark-gray-6 dark:bg-dark-gray-3 mt-8 rounded-xl border p-4 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-gray-11 dark:text-dark-gray-11 m-0">
                    <span className="font-semibold">Note:</span> By continuing to use Tero, you
                    acknowledge that you have read and agree to these Terms of Service. If you do
                    not agree, please discontinue use of the Service immediately.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-gray-9 dark:text-dark-gray-9 mt-4 text-center text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            © {new Date().getFullYear()} Tero. All rights reserved.
          </motion.p>
        </div>
      </div>
    </>
  );
}
