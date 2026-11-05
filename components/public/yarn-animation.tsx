export function YarnAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 600 400"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <defs>
          <style>{`
            @keyframes floatYarn {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-12px) rotate(3deg); }
            }
            @keyframes gentlePulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.04); }
            }
            @keyframes stitchWave {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 100; }
            }
            @keyframes sparkle {
              0%, 100% { opacity: 0.3; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
            }
            @keyframes hookMove {
              0%, 100% { transform: translate(0, 0) rotate(-25deg); }
              50% { transform: translate(-8px, -14px) rotate(-18deg); }
            }
            .yarn-ball { transform-origin: center; animation: floatYarn 4.5s ease-in-out infinite; }
            .puff-stitch { transform-origin: center; animation: gentlePulse 3.5s ease-in-out infinite; }
            .yarn-strand { stroke-dasharray: 8 6; animation: stitchWave 4s linear infinite; }
            .sparkle-1 { transform-origin: 120px 100px; animation: sparkle 2.4s ease-in-out infinite; }
            .sparkle-2 { transform-origin: 480px 140px; animation: sparkle 3.1s ease-in-out infinite 0.8s; }
            .sparkle-3 { transform-origin: 360px 80px; animation: sparkle 2.8s ease-in-out infinite 0.4s; }
            .crochet-hook { transform-origin: 340px 180px; animation: hookMove 3.8s ease-in-out infinite; }
          `}</style>
          <linearGradient id="pinkBall" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="puffGrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="100%" stopColor="#FCE7F3" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#F472B6" floodOpacity="0.25" />
          </filter>
        </defs>

        <circle cx="300" cy="200" r="170" fill="#FFF5F7" opacity="0.8" />
        <circle cx="210" cy="160" r="90" fill="#FDF2F8" opacity="0.6" />
        <circle cx="390" cy="230" r="110" fill="#FCE7F3" opacity="0.5" />

        <path
          className="yarn-strand"
          d="M 60 280 C 140 240, 180 340, 260 270 S 370 200, 440 280 S 520 230, 560 260"
          fill="none"
          opacity="0.7"
          stroke="#F472B6"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          className="yarn-strand"
          d="M 100 130 C 170 90, 230 140, 310 110 S 430 70, 500 120"
          fill="none"
          opacity="0.5"
          stroke="#FDA4AF"
          strokeLinecap="round"
          strokeWidth="3"
        />

        <g className="yarn-ball" filter="url(#softShadow)">
          <ellipse cx="260" cy="220" rx="90" ry="85" fill="url(#pinkBall)" />
          <path
            d="M 190 190 C 220 160, 280 170, 310 210 C 330 240, 310 280, 260 290"
            fill="none"
            opacity="0.75"
            stroke="#FFF"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M 210 240 C 240 270, 290 260, 320 220 C 340 180, 290 160, 240 170"
            fill="none"
            opacity="0.85"
            stroke="#FCE7F3"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M 230 160 C 270 190, 270 250, 220 275"
            fill="none"
            opacity="0.5"
            stroke="#F43F5E"
            strokeLinecap="round"
            strokeWidth="3.5"
          />
          <path
            d="M 180 220 C 210 210, 280 205, 330 230"
            fill="none"
            opacity="0.7"
            stroke="#FFF"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </g>

        <g className="puff-stitch" transform="translate(370, 160)">
          <circle cx="0" cy="-35" r="26" fill="url(#puffGrad)" stroke="#F472B6" strokeWidth="3" />
          <circle cx="33" cy="-11" r="26" fill="url(#puffGrad)" stroke="#F472B6" strokeWidth="3" />
          <circle cx="21" cy="30" r="26" fill="url(#puffGrad)" stroke="#F472B6" strokeWidth="3" />
          <circle cx="-21" cy="30" r="26" fill="url(#puffGrad)" stroke="#F472B6" strokeWidth="3" />
          <circle cx="-33" cy="-11" r="26" fill="url(#puffGrad)" stroke="#F472B6" strokeWidth="3" />
          <circle cx="0" cy="0" r="16" fill="#F43F5E" />
          <circle cx="0" cy="0" r="7" fill="#FFF" />
        </g>

        <g className="crochet-hook">
          <rect
            x="290"
            y="70"
            width="12"
            height="180"
            rx="6"
            fill="#9D174D"
            transform="rotate(-30 290 70)"
          />
          <rect
            x="286"
            y="140"
            width="20"
            height="90"
            rx="10"
            fill="#EC4899"
            transform="rotate(-30 290 70)"
          />
          <rect
            x="289"
            y="160"
            width="14"
            height="45"
            rx="7"
            fill="#F472B6"
            transform="rotate(-30 290 70)"
          />
          <path
            d="M 230 65 C 235 55, 245 56, 248 62 C 250 67, 242 72, 238 68"
            fill="none"
            stroke="#9D174D"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </g>

        <g className="sparkle-1">
          <path
            d="M 120 90 Q 120 100 110 100 Q 120 100 120 110 Q 120 100 130 100 Q 120 100 120 90 Z"
            fill="#EC4899"
          />
        </g>
        <g className="sparkle-2">
          <path
            d="M 480 130 Q 480 140 470 140 Q 480 140 480 150 Q 480 140 490 140 Q 480 140 480 130 Z"
            fill="#F43F5E"
          />
        </g>
        <g className="sparkle-3">
          <path
            d="M 360 70 Q 360 80 350 80 Q 360 80 360 90 Q 360 80 370 80 Q 360 80 360 70 Z"
            fill="#F472B6"
          />
        </g>
      </svg>
    </div>
  );
}
