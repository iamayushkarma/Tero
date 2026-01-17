import { useLayoutEffect } from "react";
import "../components/modules/Modules.css";

type SupportPageProps = {
  className?: string;
};

export default function SupportPage({ className = "" }: SupportPageProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const faqs = [
    {
      question: "How does Tero work?",
      answer: (
        <>
          Tero analyzes your resume locally in your browser by comparing it against job
          descriptions. It checks for keyword matches, formatting compatibility with ATS systems,
          and provides a detailed score breakdown. Your resume never leaves your device unless you
          choose to use optional AI features.
        </>
      ),
    },
    {
      question: "Do I need to create an account?",
      answer: (
        <>
          No! Tero works entirely in your browser without requiring an account. Your resumes and job
          descriptions are stored locally on your device using browser storage. This means your data
          remains private and under your control.
        </>
      ),
    },
    {
      question: "Is my resume data secure?",
      answer: (
        <>
          Yes. Your resume is stored only in your browser's local storage on your device. We don't
          upload, store, or have access to your resume data on our servers. If you use optional AI
          features, only the text content is sent securely to AI providers for analysis, and we
          don't retain copies.
        </>
      ),
    },
    {
      question: "What are AI features and are they required?",
      answer: (
        <>
          AI features are optional enhancements that provide detailed recommendations and insights
          using advanced language models. You can use Tero's core scoring functionality without AI.
          When you choose to use AI features, your resume text is sent to third-party AI services
          (like OpenAI or Anthropic) for processing.
        </>
      ),
    },
    {
      question: "How accurate is the ATS score?",
      answer: (
        <>
          Tero provides an estimate based on common ATS screening criteria like keyword matching,
          formatting, and structure. However, every company's ATS system is different. Use Tero's
          score as a guide to optimize your resume, but understand that actual results may vary.
        </>
      ),
    },
    {
      question: "Can I use Tero on mobile devices?",
      answer: (
        <>
          Yes! Tero is designed to work on both desktop and mobile browsers. However, for the best
          experience and full functionality, we recommend using a desktop or laptop computer.
        </>
      ),
    },
    {
      question: "What file formats are supported?",
      answer: (
        <>
          Tero currently supports PDF and text-based resume formats. You can also paste your resume
          text directly into the analyzer. For best results, ensure your resume is in a clean,
          standard format that ATS systems can easily parse.
        </>
      ),
    },
    {
      question: "Why is my score low?",
      answer: (
        <>
          A low score typically indicates missing keywords from the job description, formatting
          issues, or ATS incompatibility. Review the detailed breakdown to see specific areas for
          improvement. Common issues include:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Missing key skills or qualifications from the job posting</li>
            <li>Complex formatting (tables, graphics, headers/footers)</li>
            <li>Unusual fonts or styling</li>
            <li>Lack of measurable achievements or metrics</li>
          </ul>
        </>
      ),
    },
    {
      question: "Can I save my results?",
      answer: (
        <>
          Your analysis results are automatically saved in your browser's local storage. They'll
          remain available until you clear your browser data or manually delete them. You can also
          export or screenshot your results for future reference.
        </>
      ),
    },
    {
      question: "How do I delete my data?",
      answer: (
        <>
          Since Tero stores data locally on your device, you can delete it by:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Using the delete functions within Tero's interface</li>
            <li>Clearing your browser's local storage for the Tero website</li>
            <li>Clearing your browser's cache and site data</li>
          </ul>
        </>
      ),
    },
    {
      question: "Does Tero work offline?",
      answer: (
        <>
          Basic resume analysis can work offline once the page is loaded, as processing happens
          locally in your browser. However, AI features require an internet connection to
          communicate with external AI services.
        </>
      ),
    },
    {
      question: "Is Tero free to use?",
      answer: (
        <>
          Yes! Tero's core resume scoring features are completely free. We may introduce premium
          features or AI-powered enhancements in the future, but the essential functionality will
          always remain free.
        </>
      ),
    },
  ];

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Get help via email for any questions or issues",
      contact: "ayushkarma.dev@gmail.com",
      action: "mailto:ayushkarma.dev@gmail.com",
    },
    {
      icon: "🐛",
      title: "Bug Reports",
      description: "Found a bug? Let us know so we can fix it",
      contact: "ayushkarma.dev@gmail.com",
      action: "mailto:ayushkarma.dev@gmail.com?subject=Bug%20Report",
    },
    {
      icon: "💡",
      title: "Feature Requests",
      description: "Have an idea? We'd love to hear your suggestions",
      contact: "ayushkarma.dev@gmail.com",
      action: "mailto:ayushkarma.dev@gmail.com?subject=Feature%20Request",
    },
  ];

  return (
    <>
      <div className="relative mt-18 flex h-60 flex-col items-center justify-center p-10 md:h-75">
        <div className="StartResumeScan pointer-events-none absolute inset-0 overflow-hidden"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Support
          </h1>
          <p className="text-gray-3 mt-2 text-center text-sm">
            Get help with Tero - We're here to assist you
          </p>
        </div>
      </div>

      <div
        className={[
          "min-h-screen px-4 py-10",
          "bg-bg-gray-1 text-gray-12",
          "dark:bg-dark-bg-gray-1 dark:text-dark-gray-12",
          className,
        ].join(" ")}
      >
        <div className="z-99999999 mx-auto w-full max-w-4xl">
          {/* Contact Methods Section */}
          <div className="mb-12">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-6 text-center text-2xl font-semibold">
              Get in Touch
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.action}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 hover:border-blue-7 dark:hover:border-dark-blue-7 group block rounded-xl border p-6 transition-all hover:shadow-md"
                >
                  <div className="mb-3 text-4xl">{method.icon}</div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-lg font-semibold">
                    {method.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 mb-3 text-sm">
                    {method.description}
                  </p>
                  <p className="text-blue-11 group-hover:text-blue-12 dark:text-dark-blue-11 dark:group-hover:text-dark-blue-12 text-sm font-medium break-all">
                    {method.contact}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border shadow-sm">
            <div className="px-6 py-6 sm:px-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {/* Introduction Box */}
                <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 mb-6 rounded-xl border p-4">
                  <p className="text-gray-11 dark:text-dark-gray-11 m-0 text-sm leading-6">
                    <span className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      Quick Help:
                    </span>{" "}
                    Check out our frequently asked questions below. If you can't find what you're
                    looking for, feel free to reach out via email.
                  </p>
                </div>

                <h2 className="text-gray-12 dark:text-dark-gray-12 mb-6 text-xl font-semibold">
                  Frequently Asked Questions
                </h2>

                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-gray-6 dark:border-dark-gray-6 mb-4 rounded-lg border p-5"
                  >
                    <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-base font-semibold">
                      {faq.question}
                    </h3>
                    <div className="text-gray-11 dark:text-dark-gray-11 text-sm leading-6">
                      {faq.answer}
                    </div>
                  </div>
                ))}

                {/* Additional Help Box */}
                <div className="border-gray-6 bg-gray-3 dark:border-dark-gray-6 dark:bg-dark-gray-3 mt-8 rounded-xl border p-5">
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 text-base font-semibold">
                    Still need help?
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 mb-3 text-sm leading-6">
                    If you couldn't find the answer to your question, we're here to help! Send us an
                    email with your question or concern, and we'll get back to you as soon as
                    possible.
                  </p>
                  <a
                    href="mailto:ayushkarma.dev@gmail.com"
                    className="text-blue-11 hover:text-blue-12 dark:text-dark-blue-11 dark:hover:text-dark-blue-12 inline-block text-sm font-medium"
                  >
                    Email us at ayushkarma.dev@gmail.com →
                  </a>
                </div>

                {/* Tips Section */}
                <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 mt-8 rounded-xl border p-5">
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-base font-semibold">
                    💡 Tips for Getting Better Results
                  </h3>
                  <ul className="text-gray-11 dark:text-dark-gray-11 m-0 list-disc space-y-2 pl-5 text-sm">
                    <li>Use a clean, simple resume format without complex tables or graphics</li>
                    <li>
                      Include relevant keywords from the job description naturally in your resume
                    </li>
                    <li>Quantify your achievements with numbers and metrics where possible</li>
                    <li>Keep your resume to 1-2 pages for optimal ATS scanning</li>
                    <li>Use standard section headings like "Experience" and "Education"</li>
                    <li>Save your resume as a PDF to preserve formatting</li>
                    <li>Proofread for spelling and grammar errors before analyzing</li>
                  </ul>
                </div>

                {/* Response Time Notice */}
                <div className="mt-6 text-center">
                  <p className="text-gray-9 dark:text-dark-gray-9 text-xs">
                    We typically respond to support emails within 24-48 hours (business days).
                    <br />
                    Thank you for using Tero!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-9 dark:text-dark-gray-9 mt-4 text-center text-xs">
            © {new Date().getFullYear()} Tero. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
