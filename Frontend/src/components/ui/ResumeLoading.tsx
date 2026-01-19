import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
const ResumeLoading: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<
    Array<{
      text: string;
      index: number;
      completed: boolean;
      started: boolean;
    }>
  >([]);

  const steps = [
    "Uploading resume",
    "Extracting resume text",
    "Identifying resume sections",
    "Matching skills and keywords",
    "Evaluating experience and education",
    "AI generating ATS compatibility score",
  ];

  useEffect(() => {
    // Show all steps immediately but mark them as not started
    setVisibleSteps(
      steps.map((step, index) => ({
        text: step,
        index,
        completed: false,
        started: false,
      })),
    );

    steps.forEach((_step, index) => {
      setTimeout(() => {
        setVisibleSteps((prev) =>
          prev.map((s) => (s.index === index ? { ...s, started: true } : s)),
        );

        if (index < 5) {
          setTimeout(() => {
            setVisibleSteps((prev) =>
              prev.map((s) => (s.index === index ? { ...s, completed: true } : s)),
            );
          }, 1200);
        }
      }, index * 1800);
    });
  }, []);

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="pointer-events-none! fixed inset-0 z-9999999 flex min-h-screen items-center justify-center p-4 backdrop-blur-[10px]">
      <div className="relative flex h-64 w-full max-w-xs flex-col items-center justify-center overflow-hidden sm:h-80 sm:max-w-sm md:h-96 md:max-w-md">
        {visibleSteps.map((step) => {
          const startedCount = visibleSteps.filter((s) => s.started).length;
          const position = startedCount - 1 - step.index;
          const isUpcoming = !step.started;
          const isGone = position > 2;
          const isActive = position === 0;

          let opacity = 1;
          if (isUpcoming || isGone) opacity = 0;

          let textOpacity = 1;
          if (!isActive) textOpacity = 0.4;

          const showIcon = isActive || (step.started && position > 0 && position <= 2);

          return (
            <div
              key={step.index}
              className="absolute flex items-center gap-2 transition-all duration-700 ease-out sm:gap-3"
              style={{
                transform: `translateY(${position * -40}px)`,
                opacity: opacity,
              }}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center sm:h-6 sm:w-6">
                {showIcon && step.completed ? (
                  <div className="animate-in fade-in zoom-in flex h-5 w-5 items-center justify-center rounded-full bg-green-500 duration-300">
                    <Check className="h-3 w-3 text-white sm:h-4 sm:w-4" strokeWidth={2} />
                  </div>
                ) : showIcon && step.index === 5 ? (
                  <Ring size="19" stroke="2" bgOpacity="0" speed="2" color="#364140" />
                ) : null}
              </div>

              <span
                className="md:text-md text-sm font-medium whitespace-nowrap text-gray-700 transition-opacity duration-700 sm:text-base"
                style={{ opacity: textOpacity }}
              >
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeLoading;
