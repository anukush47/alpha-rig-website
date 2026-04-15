"use client";

import { useEffect, useRef, useState } from "react";
import { Bebas_Neue, Rajdhani, Space_Mono } from "next/font/google";

// Re-declare fonts — global-error replaces the root layout entirely
const bebasNeue = Bebas_Neue({ weight: "400", variable: "--font-bebas", subsets: ["latin"], display: "swap" });
const rajdhani = Rajdhani({ weight: ["400", "600", "700"], variable: "--font-rajdhani", subsets: ["latin"], display: "swap" });
const spaceMono = Space_Mono({ weight: ["400", "700"], variable: "--font-space-mono", subsets: ["latin"], display: "swap" });

const GLITCH = "!<>-_\\/[]{}—=+*^?#@$%";

function GlitchText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Auto-trigger glitch on mount
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    let iter = 0;
    const max = text.length * 4;
    const id = setInterval(() => {
      setDisplay(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (i < iter / 4) return char;
          return GLITCH[Math.floor(Math.random() * GLITCH.length)];
        }).join("")
      );
      iter++;
      if (iter > max) { setDisplay(text); setActive(false); clearInterval(id); }
    }, 30);
    return () => clearInterval(id);
  }, [active, text]);

  return (
    <span
      onMouseEnter={() => setActive(true)}
      style={{ cursor: "default", userSelect: "none" }}
    >
      {display}
    </span>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    console.error("[Alpha Rig] Critical Error:", error);
  }, [error]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const handleReset = () => {
    setResetting(true);
    setTimeout(() => { reset(); setResetting(false); }, 400);
  };

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${rajdhani.variable} ${spaceMono.variable}`}
    >
      <body
        style={{ margin: 0, padding: 0, background: "#0A0A0A", color: "#ffffff", fontFamily: "var(--font-rajdhani), sans-serif" }}
      >
        {/* Minimal Navbar */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: "64px",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            background: "rgba(10,10,10,0.6)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "#ffffff",
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            ALPHA <span style={{ color: "#C0392B" }}>RIG</span>
          </a>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#C0392B",
              background: "rgba(192,57,43,0.1)",
              border: "1px solid rgba(192,57,43,0.25)",
              borderRadius: "4px",
              padding: "4px 10px",
            }}
          >
            CRITICAL ERROR
          </span>
        </header>

        {/* Main */}
        <main
          ref={containerRef}
          onMouseMove={handleMouseMove}
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 24px 100px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(192,57,43,0.04) 60px, rgba(192,57,43,0.04) 61px),
                repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(192,57,43,0.04) 60px, rgba(192,57,43,0.04) 61px)
              `,
              pointerEvents: "none",
            }}
          />

          {/* Cursor glow */}
          <div
            ref={glowRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(192,57,43,0.09), transparent 65%)",
            } as React.CSSProperties}
          />

          {/* Ambient */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              height: "500px",
              background: "radial-gradient(ellipse, rgba(192,57,43,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              textAlign: "center",
              maxWidth: "640px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
                textTransform: "uppercase",
              }}
            >
              // CRITICAL SYSTEM FAILURE
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(80px, 18vw, 160px)",
                color: "#ffffff",
                lineHeight: 0.9,
                letterSpacing: "0.04em",
                margin: 0,
                textShadow: "0 0 60px rgba(192,57,43,0.25)",
              }}
            >
              <GlitchText text="SYSTEM" />
              <br />
              <span style={{ color: "#C0392B" }}>
                <GlitchText text="DOWN" />
              </span>
            </h1>

            <div
              style={{
                width: "100%",
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(192,57,43,0.4) 30%, rgba(192,57,43,0.4) 70%, transparent)",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "16px",
                color: "#555",
                lineHeight: 1.65,
                maxWidth: "440px",
              }}
            >
              A critical error crashed the application root. This has been logged.
              Try reloading — if the issue persists, the forge will be back shortly.
            </p>

            {error.digest && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "1.5px",
                  color: "#333",
                  background: "rgba(192,57,43,0.05)",
                  border: "1px solid rgba(192,57,43,0.12)",
                  borderRadius: "6px",
                  padding: "6px 14px",
                }}
              >
                ERROR ID: {error.digest}
              </div>
            )}

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
              <button
                onClick={handleReset}
                disabled={resetting}
                style={{
                  fontFamily: "var(--font-rajdhani)",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  background: resetting ? "#555" : "#C0392B",
                  border: "1px solid #C0392B",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  cursor: resetting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!resetting) (e.currentTarget as HTMLElement).style.background = "#E74C3C";
                }}
                onMouseLeave={(e) => {
                  if (!resetting) (e.currentTarget as HTMLElement).style.background = "#C0392B";
                }}
              >
                {resetting ? "RELOADING..." : "Reload App"}
              </button>
              <a
                href="/"
                style={{
                  fontFamily: "var(--font-rajdhani)",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  color: "#888",
                  background: "rgba(10,10,10,0.4)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(192,57,43,0.3)",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#888";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)";
                }}
              >
                Go Home
              </a>
            </div>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "2px",
                color: "#2a2a2a",
                marginTop: "16px",
              }}
            >
              ALPHA RIG · FORGE YOUR LEGEND
            </p>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#2a2a2a",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Alpha Rig Private Limited
          </span>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#C0392B",
              textDecoration: "none",
            }}
          >
            alpharig.in
          </a>
        </footer>
      </body>
    </html>
  );
}
