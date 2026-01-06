import { useEffect, useState } from "react";

const steps = [
  {
    id: "scan",
    text: "Scanning Document",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <defs>
          <filter id="docShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(85.58% 0.122 84.38)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(85.58% 0.122 84.38)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(85.58% 0.122 84.38)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect
          x="50"
          y="30"
          width="100"
          height="140"
          rx="8"
          className="doc"
          filter="url(#docShadow)"
        />

        <line x1="70" y1="55" x2="130" y2="55" className="line line-1" />
        <line x1="70" y1="70" x2="130" y2="70" className="line line-2" />
        <line x1="70" y1="85" x2="120" y2="85" className="line line-3" />
        <line x1="70" y1="105" x2="130" y2="105" className="line line-4" />
        <line x1="70" y1="120" x2="125" y2="120" className="line line-5" />
        <line x1="70" y1="135" x2="110" y2="135" className="line line-6" />
        <line x1="70" y1="150" x2="130" y2="150" className="line line-7" />

        <rect
          x="45"
          y="95"
          width="110"
          height="10"
          fill="url(#scanGradient)"
          className="scan-beam"
          opacity="0.6"
        />
        <line x1="45" y1="100" x2="155" y2="100" className="scan" strokeWidth="4" />
      </svg>
    ),
  },
  {
    id: "ai-analysis",
    text: "AI Analysis",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <defs>
          <radialGradient id="brainGlow">
            <stop offset="0%" stopColor="oklch(59.3% 0.2234 258.5)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(59.3% 0.2234 258.5)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* AI Brain/Neural Network */}
        <circle cx="100" cy="100" r="35" fill="url(#brainGlow)" className="brain-glow" />

        {/* Central brain shape */}
        <ellipse
          cx="100"
          cy="95"
          rx="28"
          ry="32"
          className="brain-core"
          fill="none"
          stroke="oklch(59.3% 0.2234 258.5)"
          strokeWidth="3"
        />
        <path
          d="M 75 95 Q 85 80, 100 85 T 125 95"
          className="brain-wave brain-wave-1"
          fill="none"
          stroke="oklch(73.4% 0.1447 258.5)"
          strokeWidth="2"
        />
        <path
          d="M 75 100 Q 85 115, 100 110 T 125 100"
          className="brain-wave brain-wave-2"
          fill="none"
          stroke="oklch(73.4% 0.1447 258.5)"
          strokeWidth="2"
        />

        {/* Neural nodes */}
        <circle cx="80" cy="75" r="5" className="node node-1" fill="oklch(85.58% 0.122 84.38)" />
        <circle cx="120" cy="75" r="5" className="node node-2" fill="oklch(85.58% 0.122 84.38)" />
        <circle cx="70" cy="100" r="5" className="node node-3" fill="oklch(85.58% 0.122 84.38)" />
        <circle cx="130" cy="100" r="5" className="node node-4" fill="oklch(85.58% 0.122 84.38)" />
        <circle cx="80" cy="125" r="5" className="node node-5" fill="oklch(85.58% 0.122 84.38)" />
        <circle cx="120" cy="125" r="5" className="node node-6" fill="oklch(85.58% 0.122 84.38)" />

        {/* Connecting lines */}
        <line
          x1="80"
          y1="75"
          x2="100"
          y2="95"
          className="neural-line line-1"
          stroke="oklch(73.4% 0.1447 258.5)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="120"
          y1="75"
          x2="100"
          y2="95"
          className="neural-line line-2"
          stroke="oklch(73.4% 0.1447 258.5)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="70"
          y1="100"
          x2="100"
          y2="95"
          className="neural-line line-3"
          stroke="oklch(73.4% 0.1447 258.5)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <line
          x1="130"
          y1="100"
          x2="100"
          y2="95"
          className="neural-line line-4"
          stroke="oklch(73.4% 0.1447 258.5)"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Data particles flowing */}
        <circle
          cx="85"
          cy="65"
          r="2"
          className="data-particle particle-1"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="115"
          cy="65"
          r="2"
          className="data-particle particle-2"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="60"
          cy="90"
          r="2"
          className="data-particle particle-3"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="140"
          cy="90"
          r="2"
          className="data-particle particle-4"
          fill="oklch(85.58% 0.122 84.38)"
        />
      </svg>
    ),
  },
  {
    id: "keywords",
    text: "Matching Keywords",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <defs>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="oklch(59.3% 0.2234 258.5)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(59.3% 0.2234 258.5)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="55" className="ring-outer ring" strokeDasharray="8 8" />
        <circle cx="100" cy="100" r="40" className="ring-middle ring" />
        <circle cx="100" cy="100" r="25" className="ring-inner ring" />

        <circle
          cx="100"
          cy="100"
          r="28"
          fill="url(#coreGlow)"
          opacity="0.4"
          className="core-glow"
        />
        <circle cx="100" cy="100" r="18" className="core" />

        <circle cx="100" cy="100" r="8" className="pulse pulse-1" />
        <circle cx="100" cy="100" r="8" className="pulse pulse-2" />
        <circle cx="100" cy="100" r="8" className="pulse pulse-3" />

        <circle
          cx="100"
          cy="45"
          r="4"
          className="keyword-dot keyword-1"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="145"
          cy="75"
          r="4"
          className="keyword-dot keyword-2"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="145"
          cy="125"
          r="4"
          className="keyword-dot keyword-3"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="100"
          cy="155"
          r="4"
          className="keyword-dot keyword-4"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="55"
          cy="125"
          r="4"
          className="keyword-dot keyword-5"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="55"
          cy="75"
          r="4"
          className="keyword-dot keyword-6"
          fill="oklch(85.58% 0.122 84.38)"
        />
      </svg>
    ),
  },
  {
    id: "score",
    text: "Ranking Qualifications",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <defs>
          <linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(85.58% 0.122 84.38)" />
            <stop offset="100%" stopColor="oklch(75% 0.15 84.38)" />
          </linearGradient>
          <linearGradient id="barGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(73.4% 0.1447 258.5)" />
            <stop offset="100%" stopColor="oklch(63% 0.16 258.5)" />
          </linearGradient>
          <linearGradient id="barGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(59.3% 0.2234 258.5)" />
            <stop offset="100%" stopColor="oklch(49% 0.24 258.5)" />
          </linearGradient>
        </defs>

        {/* Y-axis */}
        <line x1="50" y1="50" x2="50" y2="150" stroke="oklch(91% 0.0077 277.7)" strokeWidth="2" />
        {/* X-axis */}
        <line x1="50" y1="150" x2="160" y2="150" stroke="oklch(91% 0.0077 277.7)" strokeWidth="2" />

        {/* Bar 1 - Skills */}
        <rect
          x="65"
          y="70"
          width="25"
          height="80"
          rx="3"
          className="rank-bar bar-1"
          fill="url(#barGradient1)"
        />
        <circle
          cx="77.5"
          cy="60"
          r="3"
          className="bar-dot dot-1"
          fill="oklch(85.58% 0.122 84.38)"
        />

        {/* Bar 2 - Experience */}
        <rect
          x="100"
          y="85"
          width="25"
          height="65"
          rx="3"
          className="rank-bar bar-2"
          fill="url(#barGradient2)"
        />
        <circle
          cx="112.5"
          cy="75"
          r="3"
          className="bar-dot dot-2"
          fill="oklch(73.4% 0.1447 258.5)"
        />

        {/* Bar 3 - Education */}
        <rect
          x="135"
          y="95"
          width="25"
          height="55"
          rx="3"
          className="rank-bar bar-3"
          fill="url(#barGradient3)"
        />
        <circle
          cx="147.5"
          cy="85"
          r="3"
          className="bar-dot dot-3"
          fill="oklch(59.3% 0.2234 258.5)"
        />

        {/* Grid lines */}
        <line
          x1="50"
          y1="110"
          x2="160"
          y2="110"
          stroke="oklch(91% 0.0077 277.7)"
          strokeWidth="0.5"
          opacity="0.3"
          className="grid-line grid-1"
        />
        <line
          x1="50"
          y1="90"
          x2="160"
          y2="90"
          stroke="oklch(91% 0.0077 277.7)"
          strokeWidth="0.5"
          opacity="0.3"
          className="grid-line grid-2"
        />
        <line
          x1="50"
          y1="70"
          x2="160"
          y2="70"
          stroke="oklch(91% 0.0077 277.7)"
          strokeWidth="0.5"
          opacity="0.3"
          className="grid-line grid-3"
        />

        {/* Animated star/sparkles */}
        <circle
          cx="77.5"
          cy="65"
          r="2"
          className="sparkle sparkle-1"
          fill="oklch(85.58% 0.122 84.38)"
        />
        <circle
          cx="112.5"
          cy="80"
          r="2"
          className="sparkle sparkle-2"
          fill="oklch(73.4% 0.1447 258.5)"
        />
        <circle
          cx="147.5"
          cy="90"
          r="2"
          className="sparkle sparkle-3"
          fill="oklch(59.3% 0.2234 258.5)"
        />
      </svg>
    ),
  },
  {
    id: "report",
    text: "Generating Report",
    svg: (
      <svg viewBox="0 0 200 200" className="illustration">
        <defs>
          <filter id="reportShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        <rect
          x="65"
          y="45"
          width="70"
          height="110"
          rx="8"
          className="doc"
          filter="url(#reportShadow)"
        />

        <line x1="75" y1="65" x2="115" y2="65" className="line report-line" strokeWidth="2" />
        <line x1="75" y1="95" x2="115" y2="95" className="line report-line" strokeWidth="2" />
        <line x1="75" y1="125" x2="115" y2="125" className="line report-line" strokeWidth="2" />

        <g className="check-group check-group-1">
          <circle cx="122" cy="65" r="8" fill="oklch(85.58% 0.122 84.38)" opacity="0.2" />
          <polyline points="118,65 121,68 126,63" className="check check-1" />
        </g>

        <g className="check-group check-group-2">
          <circle cx="122" cy="95" r="8" fill="oklch(85.58% 0.122 84.38)" opacity="0.2" />
          <polyline points="118,95 121,98 126,93" className="check check-2" />
        </g>

        <g className="check-group check-group-3">
          <circle cx="122" cy="125" r="8" fill="oklch(85.58% 0.122 84.38)" opacity="0.2" />
          <polyline points="118,125 121,128 126,123" className="check check-3" />
        </g>
      </svg>
    ),
  },
];

export default function ResumeLoading() {
  const [index, setIndex] = useState(0);
  const [hasShownScan, setHasShownScan] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % steps.length;
        // Skip scan step after first time
        if (next === 0 && hasShownScan) {
          return 1;
        }
        if (next === 1 && !hasShownScan) {
          setHasShownScan(true);
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(timer);
  }, [hasShownScan]);

  const step = steps[index];

  return (
    <>
      <style>{`
        .resume-loading {
          position: fixed;
          inset: 0;
          background: oklch(99.3% 0.0037 258.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: slideFade 2.2s ease-in-out;
          max-width: 100%;
        }
        
        .step-text {
          margin-top: 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: oklch(24.1% 0.0099 277.7);
          letter-spacing: 0.3px;
          text-align: center;
        }
        
        @keyframes slideFade {
          0% {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          20% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-40px) scale(0.95);
          }
        }
        
        .illustration {
          width: 200px;
          height: 200px;
          max-width: 100%;
          height: auto;
        }
        
        /* Responsive sizing */
        @media (max-width: 640px) {
          .illustration {
            width: 150px;
            height: 150px;
          }
          
          .step-text {
            font-size: 0.875rem;
            margin-top: 1rem;
          }
        }
        
        @media (max-width: 400px) {
          .illustration {
            width: 120px;
            height: 120px;
          }
          
          .step-text {
            font-size: 0.8rem;
            margin-top: 0.75rem;
          }
        }
        
        /* Document styles */
        .doc {
          fill: white;
          stroke: oklch(59.3% 0.2234 258.5);
          stroke-width: 3;
        }
        
        .line {
          stroke: oklch(91% 0.0077 277.7);
          stroke-width: 2.5;
          stroke-linecap: round;
        }
        
        /* Scanning animations */
        .line-1 { animation: lineAppear 0.8s ease-out 0.1s both; }
        .line-2 { animation: lineAppear 0.8s ease-out 0.2s both; }
        .line-3 { animation: lineAppear 0.8s ease-out 0.3s both; }
        .line-4 { animation: lineAppear 0.8s ease-out 0.4s both; }
        .line-5 { animation: lineAppear 0.8s ease-out 0.5s both; }
        .line-6 { animation: lineAppear 0.8s ease-out 0.6s both; }
        .line-7 { animation: lineAppear 0.8s ease-out 0.7s both; }
        
        @keyframes lineAppear {
          from {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            opacity: 0;
          }
          to {
            stroke-dasharray: 60;
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        .scan {
          stroke: oklch(85.58% 0.122 84.38);
          stroke-width: 3;
          stroke-linecap: round;
          animation: scan 1.5s ease-in-out infinite;
          filter: drop-shadow(0 0 4px oklch(85.58% 0.122 84.38));
        }
        
        .scan-beam {
          animation: scan 1.5s ease-in-out infinite;
        }
        
        @keyframes scan {
          0%, 100% {
            transform: translateY(-50px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(60px);
          }
        }
        
        /* AI Analysis animations */
        .brain-glow {
          animation: brainPulse 2s ease-in-out infinite;
        }
        
        @keyframes brainPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        .brain-core {
          animation: brainBreathe 2s ease-in-out infinite;
        }
        
        @keyframes brainBreathe {
          0%, 100% {
            stroke-width: 3;
          }
          50% {
            stroke-width: 3.5;
          }
        }
        
        .brain-wave-1 {
          animation: waveFlow 1.5s ease-in-out infinite;
        }
        
        .brain-wave-2 {
          animation: waveFlow 1.5s ease-in-out 0.75s infinite;
        }
        
        @keyframes waveFlow {
          0%, 100% {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            opacity: 0.3;
          }
          50% {
            stroke-dasharray: 50;
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        .node {
          animation: nodePulse 1.2s ease-in-out infinite;
        }
        
        .node-1 { animation-delay: 0s; }
        .node-2 { animation-delay: 0.2s; }
        .node-3 { animation-delay: 0.4s; }
        .node-4 { animation-delay: 0.6s; }
        .node-5 { animation-delay: 0.8s; }
        .node-6 { animation-delay: 1s; }
        
        @keyframes nodePulse {
          0%, 100% {
            r: 5;
            opacity: 0.6;
          }
          50% {
            r: 6;
            opacity: 1;
          }
        }
        
        .neural-line {
          animation: signalFlow 1.5s ease-in-out infinite;
        }
        
        .line-1 { animation-delay: 0s; }
        .line-2 { animation-delay: 0.3s; }
        .line-3 { animation-delay: 0.6s; }
        .line-4 { animation-delay: 0.9s; }
        
        @keyframes signalFlow {
          0%, 100% {
            opacity: 0.2;
            stroke-width: 1.5;
          }
          50% {
            opacity: 0.8;
            stroke-width: 2;
          }
        }
        
        .data-particle {
          animation: particleMove 2s ease-in-out infinite;
        }
        
        .particle-1 { animation-delay: 0s; }
        .particle-2 { animation-delay: 0.5s; }
        .particle-3 { animation-delay: 1s; }
        .particle-4 { animation-delay: 1.5s; }
        
        @keyframes particleMove {
          0%, 100% {
            opacity: 0;
            r: 2;
          }
          50% {
            opacity: 1;
            r: 3;
          }
        }
        
        /* Keyword matching animations */
        .ring {
          fill: none;
          stroke: oklch(73.4% 0.1447 258.5);
          stroke-width: 2.5;
        }
        
        .ring-outer {
          animation: rotateRing 4s linear infinite;
          transform-origin: 100px 100px;
        }
        
        .ring-middle {
          animation: pulseRing 2s ease-in-out infinite;
        }
        
        .ring-inner {
          animation: pulseRing 2s ease-in-out 0.5s infinite;
        }
        
        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulseRing {
          0%, 100% {
            stroke-opacity: 0.4;
            stroke-width: 2.5;
          }
          50% {
            stroke-opacity: 1;
            stroke-width: 3;
          }
        }
        
        .core {
          fill: oklch(59.3% 0.2234 258.5);
          animation: coreGlow 2s ease-in-out infinite;
        }
        
        .core-glow {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        @keyframes coreGlow {
          0%, 100% {
            filter: drop-shadow(0 0 4px oklch(59.3% 0.2234 258.5));
          }
          50% {
            filter: drop-shadow(0 0 12px oklch(59.3% 0.2234 258.5));
          }
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        
        .pulse {
          fill: oklch(85.58% 0.122 84.38);
        }
        
        .pulse-1 {
          animation: pulse 1.8s infinite;
        }
        
        .pulse-2 {
          animation: pulse 1.8s infinite 0.6s;
        }
        
        .pulse-3 {
          animation: pulse 1.8s infinite 1.2s;
        }
        
        @keyframes pulse {
          0% {
            r: 6;
            opacity: 0.8;
          }
          100% {
            r: 18;
            opacity: 0;
          }
        }
        
        .keyword-dot {
          animation: orbitKeyword 3s linear infinite;
          transform-origin: 100px 100px;
        }
        
        .keyword-1 { animation-delay: 0s; }
        .keyword-2 { animation-delay: 0.5s; }
        .keyword-3 { animation-delay: 1s; }
        .keyword-4 { animation-delay: 1.5s; }
        .keyword-5 { animation-delay: 2s; }
        .keyword-6 { animation-delay: 2.5s; }
        
        @keyframes orbitKeyword {
          from { transform: rotate(0deg) translateX(55px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(55px) rotate(-360deg); }
        }
        
        /* Score/Ranking animations */
        .rank-bar {
          opacity: 0;
          animation: barGrow 1s ease-out both;
        }
        
        .bar-1 { animation-delay: 0.2s; }
        .bar-2 { animation-delay: 0.5s; }
        .bar-3 { animation-delay: 0.8s; }
        
        @keyframes barGrow {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        .bar-dot {
          animation: dotBounce 0.6s ease-out both;
        }
        
        .dot-1 { animation-delay: 1s; }
        .dot-2 { animation-delay: 1.3s; }
        .dot-3 { animation-delay: 1.6s; }
        
        @keyframes dotBounce {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          60% {
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid-line {
          animation: gridFade 0.5s ease-out both;
        }
        
        .grid-1 { animation-delay: 0s; }
        .grid-2 { animation-delay: 0.1s; }
        .grid-3 { animation-delay: 0.2s; }
        
        @keyframes gridFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }
        
        .sparkle {
          animation: sparkleShine 1.5s ease-in-out infinite;
        }
        
        .sparkle-1 { animation-delay: 0s; }
        .sparkle-2 { animation-delay: 0.5s; }
        .sparkle-3 { animation-delay: 1s; }
        
        @keyframes sparkleShine {
          0%, 100% {
            opacity: 0;
            r: 2;
          }
          50% {
            opacity: 1;
            r: 3;
          }
        }
        
        /* Report generation animations */
        .report-line {
          animation: drawLine 0.8s ease-out both;
        }
        
        .report-line:nth-child(2) { animation-delay: 0.3s; }
        .report-line:nth-child(3) { animation-delay: 0.6s; }
        
        @keyframes drawLine {
          from {
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
          }
          to {
            stroke-dasharray: 40;
            stroke-dashoffset: 0;
          }
        }
        
        .check {
          fill: none;
          stroke: oklch(85.58% 0.122 84.38);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
        }
        
        .check-group {
          animation: checkAppear 0.5s ease-out both;
        }
        
        .check-group-1 { animation-delay: 0.8s; }
        .check-group-2 { animation-delay: 1.2s; }
        .check-group-3 { animation-delay: 1.6s; }
        
        @keyframes checkAppear {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .check-1 {
          animation: drawCheck 0.4s ease-out 0.8s both;
        }
        
        .check-2 {
          animation: drawCheck 0.4s ease-out 1.2s both;
        }
        
        .check-3 {
          animation: drawCheck 0.4s ease-out 1.6s both;
        }
        
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
        html.dark .resume-loading {
          background: var(--color-dark-bg-gray-1);
        }

        /* Text */
        html.dark .step-text {
          color: var(--color-dark-gray-12);
        }

        /* SVG container */
        html.dark .illustration {
          color-scheme: dark;
        }

        /* Document card */
        html.dark .doc {
          fill: var(--color-dark-bg-gray-2);
          stroke: var(--color-dark-blue-7);
        }

        /* Text lines inside document */
        html.dark .line {
          stroke: var(--color-dark-gray-6);
        }

        /* Scanning beam */
        html.dark .scan {
          stroke: var(--color-accent-gold);
        }

        /* Target rings */
        html.dark .ring {
          stroke: var(--color-dark-blue-7);
        }

        /* Target center */
        html.dark .core {
          fill: var(--color-dark-blue-9);
        }

        /* Pulse dot */
        html.dark .pulse {
          fill: var(--color-dark-gray-12);
        }

        /* Calculator body */
        html.dark .calc {
          fill: var(--color-dark-bg-gray-2);
          stroke: var(--color-dark-blue-7);
        }

        /* Percentage text */
        html.dark .percent {
          fill: var(--color-dark-blue-11);
        }

        /* Checkmarks */
        html.dark .check {
          stroke: var(--color-accent-gold);
        }

        }
      `}</style>

      <div className="resume-loading z-9999999">
        <div key={step.id} className="step">
          {step.svg}
          <p className="step-text">{step.text}</p>
        </div>
      </div>
    </>
  );
}
