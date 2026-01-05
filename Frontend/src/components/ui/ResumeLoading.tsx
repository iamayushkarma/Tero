import { useEffect, useState } from "react";

const steps = [
  {
    id: "scan",
    text: "Scanning Document",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <rect x="50" y="30" width="100" height="140" rx="5" className="doc" />
        <line x1="70" y1="60" x2="130" y2="60" className="line" />
        <line x1="70" y1="80" x2="130" y2="80" className="line" />
        <line x1="70" y1="100" x2="130" y2="100" className="line" />
        <line x1="70" y1="120" x2="110" y2="120" className="line" />
        <line x1="45" y1="100" x2="155" y2="100" className="scan" />
      </svg>
    ),
  },
  {
    id: "keywords",
    text: "Matching Keywords",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <circle cx="100" cy="100" r="50" className="ring" />
        <circle cx="100" cy="100" r="35" className="ring" />
        <circle cx="100" cy="100" r="20" className="core" />
        <circle cx="100" cy="100" r="8" className="pulse" />
      </svg>
    ),
  },
  {
    id: "score",
    text: "Calculating Score",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <rect x="60" y="60" width="80" height="80" rx="8" className="calc" />
        <text x="100" y="90" textAnchor="middle" className="percent">
          85%
        </text>
      </svg>
    ),
  },
  {
    id: "report",
    text: "Generating Report",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <rect x="65" y="50" width="70" height="100" rx="5" className="doc" />
        <polyline points="80,75 85,80 95,70" className="check" />
        <polyline points="80,95 85,100 95,90" className="check" />
        <polyline points="80,115 85,120 95,110" className="check" />
      </svg>
    ),
  },
];

export default function ResumeLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  const step = steps[index];

  return (
    <div className="resume-loading z-9999999">
      <div key={step.id} className="step">
        {step.svg}
        <p className="step-text">{step.text}</p>
      </div>
    </div>
  );
}
