import { useLayoutEffect } from "react";
import { Target, Zap, Shield, Heart, Users, TrendingUp, Award, Sparkles, Code } from "lucide-react";

type AboutPageProps = {
  className?: string;
};

export default function AboutPage({ className = "" }: AboutPageProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const mission = {
    title: "Our Mission",
    description:
      "Help job seekers get past ATS filters and land more interviews by showing them exactly what their resume needs.",
    icon: <Target className="size-8" />,
  };

  const values = [
    {
      title: "Transparency",
      description:
        "Clear, honest feedback. No hidden scores or confusing metrics. Just straightforward insights you can actually use.",
      icon: <Shield className="size-6" />,
    },
    {
      title: "Accessibility",
      description:
        "Everyone deserves a fair shot at getting their resume seen. We keep Tero simple and accessible for all job seekers.",
      icon: <Heart className="size-6" />,
    },
    {
      title: "Innovation",
      description:
        "ATS systems change constantly. We stay updated on the latest hiring tech to keep our advice relevant.",
      icon: <Sparkles className="size-6" />,
    },
    {
      title: "Results",
      description:
        "We focus on giving you practical advice that actually helps. More interviews and better responses matter most.",
      icon: <TrendingUp className="size-6" />,
    },
  ];

  const story = [
    {
      title: "The Problem",
      content:
        "Job seekers send out hundreds of applications but hear nothing back. Most don't realize their resumes get filtered out by ATS software before any human sees them. The whole process feels like a black box.",
    },
    {
      title: "The Solution",
      content:
        "Tero shows you exactly what ATS systems see in your resume. Compare it against real job descriptions and get specific feedback on what to fix. No guessing, just clear next steps.",
    },
    {
      title: "The Vision",
      content:
        "Keep improving Tero based on what actually works. Listen to user feedback, track hiring trends, and give everyone the same advantages that recruiters have.",
    },
  ];

  const features = [
    {
      title: "ATS Compatibility Check",
      description: "See if your resume format can actually be read by applicant tracking systems",
      icon: <Zap className="size-6" />,
    },
    {
      title: "Keyword Matching",
      description:
        "Find out which important keywords from the job description are missing from your resume",
      icon: <Target className="size-6" />,
    },
    {
      title: "Clear Recommendations",
      description: "Get specific suggestions on what to add, remove, or change in your resume",
      icon: <Award className="size-6" />,
    },
    {
      title: "Job-Specific Analysis",
      description:
        "Test your resume against different job descriptions to see how well it matches each one",
      icon: <Users className="size-6" />,
    },
  ];

  const creator = {
    title: "Built by Ayush Karma",
    description:
      "Tero was created by Ayush Karma after dealing with the frustrating ATS job application process. If you've ever sent out dozens of applications and heard nothing back, you know the feeling. Tero exists to show you what ATS systems actually see and what you need to change to get more responses.",
  };

  return (
    <>
      <div className="relative mt-15 flex h-60 flex-col items-center justify-center p-10 md:h-75">
        <div className="from-blue-3/50 dark:from-dark-blue-3/50 pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="text-gray-12 dark:text-dark-gray-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            About Tero
          </h1>
          <p className="text-gray-11 dark:text-dark-gray-11 mt-2 max-w-2xl text-center text-sm">
            Helping job seekers navigate the digital hiring landscape with confidence
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
        <div className="mx-auto w-full max-w-6xl">
          {/* Mission Statement */}
          <section className="mb-16">
            <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 rounded-2xl border p-8 text-center">
              <div className="text-primary mb-4 flex justify-center">{mission.icon}</div>
              <h2 className="text-gray-12 dark:text-dark-gray-12 mb-4 text-2xl font-semibold">
                {mission.title}
              </h2>
              <p className="text-gray-11 dark:text-dark-gray-11 mx-auto max-w-3xl text-lg">
                {mission.description}
              </p>
            </div>
          </section>

          {/* Creator Section */}
          <section className="mb-16">
            <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8">
              <div className="mx-auto max-w-3xl text-center">
                <Code className="text-primary mx-auto mb-4 size-12" />
                <h2 className="text-gray-12 dark:text-dark-gray-12 mb-4 text-2xl font-semibold">
                  {creator.title}
                </h2>
                <p className="text-gray-11 dark:text-dark-gray-11 leading-relaxed">
                  {creator.description}
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-center text-2xl font-semibold">
              Why Tero Exists
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {story.map((chapter, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                >
                  <div className="bg-primary mb-4 flex size-10 items-center justify-center rounded-full text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-xl font-semibold">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 leading-relaxed">
                    {chapter.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-center text-2xl font-semibold">
              Our Core Values
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6"
                >
                  <div className="text-primary mb-4">{value.icon}</div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-xl font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-16">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-8 text-center text-2xl font-semibold">
              What Tero Offers
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-xl border p-6 text-center"
                >
                  <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-2 font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Commitment Section */}
          <section className="mb-16">
            <div className="border-blue-6 bg-blue-3 dark:border-dark-blue-6 dark:bg-dark-blue-3 rounded-2xl border p-8">
              <h2 className="text-gray-12 dark:text-dark-gray-12 mb-6 text-center text-2xl font-semibold">
                Our Commitment
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border-gray-6 dark:border-dark-gray-6 rounded-lg border bg-white/50 p-6 dark:bg-black/20">
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 font-semibold">
                    Your Privacy Matters
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                    Your resume stays yours. We don't share, sell, or use your information for
                    anything other than analyzing your resume. Simple as that.
                  </p>
                </div>
                <div className="border-gray-6 dark:border-dark-gray-6 rounded-lg border bg-white/50 p-6 dark:bg-black/20">
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 font-semibold">
                    Staying Current
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                    ATS systems and hiring practices change all the time. We keep track of these
                    changes so our advice stays useful and up to date.
                  </p>
                </div>
                <div className="border-gray-6 dark:border-dark-gray-6 rounded-lg border bg-white/50 p-6 dark:bg-black/20">
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 font-semibold">
                    Built on Feedback
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                    User feedback drives what we build next. If something isn't working right or
                    could be better, we want to know and fix it.
                  </p>
                </div>
                <div className="border-gray-6 dark:border-dark-gray-6 rounded-lg border bg-white/50 p-6 dark:bg-black/20">
                  <h3 className="text-gray-12 dark:text-dark-gray-12 mb-3 font-semibold">
                    More Than Just Scanning
                  </h3>
                  <p className="text-gray-11 dark:text-dark-gray-11 text-sm">
                    Beyond the scanner, we provide guides and tips to help you through your entire
                    job search. Real advice that actually helps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="border-gray-6 bg-bg-gray-2 dark:border-dark-gray-6 dark:bg-dark-bg-gray-2 rounded-2xl border p-8 text-center">
            <h2 className="text-gray-12 dark:text-dark-gray-12 mb-3 text-2xl font-semibold">
              Start Optimizing Your Resume
            </h2>
            <p className="text-gray-11 dark:text-dark-gray-11 mb-6">
              Take the first step toward landing your dream job with Tero's ATS analysis and
              optimization tools.
            </p>
            <a
              href="/"
              className="bg-primary hover:bg-primary-hover inline-block rounded-lg px-8 py-3 font-semibold text-white transition-colors"
            >
              Get Started with Tero
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
