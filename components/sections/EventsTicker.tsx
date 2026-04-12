import React from "react";

const TICKER_TEXT =
  "UPCOMING: VALORANT OPEN 2024 · REGISTRATION OPEN · · BGMI CHAMPIONSHIP · COMING SOON · · CUSTOM PC SHOWCASE · REGISTER NOW · · INTEL EXTREME MASTERS QUALIFIER · FEB 2025 · · ALPHA RIG LAN PARTY · DURG · MARCH 2025 · ·";

export default function EventsTicker() {
  return (
    <div
      className="w-full overflow-hidden relative"
      style={{
        background: "#C0392B",
        height: "48px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Fade masks on left/right */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10"
        style={{
          width: "80px",
          background: "linear-gradient(to right, #C0392B, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10"
        style={{
          width: "80px",
          background: "linear-gradient(to left, #C0392B, transparent)",
        }}
      />

      {/* Scrolling track — two copies for seamless loop */}
      <div className="ticker-track flex items-center whitespace-nowrap">
        <span className="ticker-content">{TICKER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="ticker-content" aria-hidden>{TICKER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </div>

      <style>{`
        .ticker-track {
          display: flex;
          animation: ticker-scroll 30s linear infinite;
          will-change: transform;
        }
        .ticker-content {
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: 2px;
          color: #ffffff;
          white-space: nowrap;
          padding-right: 40px;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
