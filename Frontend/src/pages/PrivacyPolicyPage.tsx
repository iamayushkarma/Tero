import { useLayoutEffect } from "react";
import "../components/modules/Modules.css";

type PrivacyPolicyProps = {
  className?: string;
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
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">Local-first approach:</span> Your uploaded resumes and job
            descriptions are saved in your browser's local storage on your device only.
          </li>
          <li>
            <span className="font-medium">No server storage:</span> We do not store your files on
            our servers. Your data remains private and under your control.
          </li>
          <li>
            <span className="font-medium">You control deletion:</span> You can clear your data at
            any time through your browser settings or by clearing Tero's local storage.
          </li>
          <li>
            <span className="font-medium">Device-specific:</span> Your data is tied to your browser
            on your device. If you use Tero on another device or browser, your previous data won't
            be there.
          </li>
        </ul>
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
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Only the text content needed for analysis is transmitted</li>
            <li>Data is sent securely over encrypted connections</li>
            <li>We do not retain copies of your data after processing</li>
            <li>
              Third-party AI providers may temporarily process your data according to their privacy
              policies
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Information We Don't Collect",
      content: (
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">No personal accounts:</span> We don't collect names,
            emails, passwords, or any account information.
          </li>
          <li>
            <span className="font-medium">No resume storage:</span> Your resumes are never uploaded
            to or stored on our servers.
          </li>
          <li>
            <span className="font-medium">No tracking:</span> We don't use tracking cookies or
            third-party analytics that identify you personally.
          </li>
          <li>
            <span className="font-medium">No sale of data:</span> Since we don't collect your
            personal data, there's nothing to sell.
          </li>
        </ul>
      ),
    },
    {
      title: "Anonymous Usage Data",
      content: (
        <>
          To improve Tero, we may collect minimal, anonymous usage statistics such as:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Feature usage patterns (which features are used most)</li>
            <li>Error logs and performance metrics</li>
            <li>General device information (browser type, screen size)</li>
            <li>Approximate location (city/region level, via IP address)</li>
          </ul>
          This data is aggregated, anonymized, and cannot be used to identify you personally.
        </>
      ),
    },
    {
      title: "Cookies & Local Storage",
      content: (
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">Essential storage:</span> We use browser local storage to
            save your preferences and uploaded content on your device.
          </li>
          <li>
            <span className="font-medium">No tracking cookies:</span> We do not use cookies for
            advertising or cross-site tracking.
          </li>
          <li>
            <span className="font-medium">Session cookies:</span> May be used for basic
            functionality and security.
          </li>
        </ul>
      ),
    },
    {
      title: "Security",
      content: (
        <>
          Since your data stays on your device, you maintain full control over its security.
          However:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              If you use AI features, data is transmitted over secure, encrypted connections
              (HTTPS/TLS).
            </li>
            <li>We follow industry best practices for web security and code safety.</li>
            <li>
              We recommend using up-to-date browsers and keeping your device secure with passwords
              and encryption.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Third-Party Services",
      content: (
        <>
          Tero may integrate with third-party services for optional features:
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">AI providers:</span> For optional AI analysis (e.g.,
              OpenAI, Anthropic)
            </li>
            <li>
              <span className="font-medium">Analytics:</span> For anonymous usage statistics (if
              applicable)
            </li>
          </ul>
          These services have their own privacy policies. We recommend reviewing them if you use
          these features.
        </>
      ),
    },
    {
      title: "Your Rights & Control",
      content: (
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium">Data access:</span> Your data is stored locally on your
            device. You can access it through your browser's developer tools.
          </li>
          <li>
            <span className="font-medium">Data deletion:</span> Clear your browser's local storage
            or use Tero's delete functions to remove your data.
          </li>
          <li>
            <span className="font-medium">No data portability needed:</span> Since data is local,
            you already have full access to it.
          </li>
          <li>
            <span className="font-medium">Opt-out:</span> Don't use AI features if you prefer to
            keep everything local.
          </li>
        </ul>
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
          <a
            href="mailto:ayushkarma.dev@gmail.com"
            className="text-blue-11 hover:text-blue-12 dark:text-dark-blue-11 dark:hover:text-dark-blue-12 font-medium"
          >
            ayushkarma.dev@gmail.com
          </a>
          <br />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="relative mt-18 flex h-60 flex-col items-center justify-center p-10 md:h-75">
        <div className="StartResumeScan pointer-events-none absolute inset-0 overflow-hidden"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-gray-3 mt-2 text-center text-sm">
            Last updated: {new Date().toLocaleDateString()}
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
        <div className="z-99999999 mx-auto w-full max-w-3xl">
          <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border shadow-sm">
            <div className="px-6 py-6 sm:px-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {/* Introduction Box */}
                <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 mb-6 rounded-xl border p-4">
                  <p className="text-gray-11 dark:text-dark-gray-11 m-0 text-sm leading-6">
                    <span className="text-gray-12 dark:text-dark-gray-12 font-semibold">
                      Privacy-First by Design:
                    </span>{" "}
                    Tero processes your resumes locally on your device. No account required, no
                    personal data collected, no server storage. Your privacy is our priority.
                  </p>
                </div>

                <p className="text-gray-11 dark:text-dark-gray-11">
                  This Privacy Policy describes how Tero collects, uses, and protects information
                  when you use our website and services. Our commitment to privacy means we've built
                  Tero to minimize data collection and maximize your control.
                </p>

                {sections.map((s) => (
                  <section key={s.title} className="mt-6">
                    <h2 className="text-gray-12 dark:text-dark-gray-12 text-lg font-semibold">
                      {s.title}
                    </h2>
                    <div className="text-gray-11 dark:text-dark-gray-11 mt-2 text-sm leading-6">
                      {s.content}
                    </div>
                  </section>
                ))}
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
