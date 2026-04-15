"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [resetting, setResetting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Log to console for debugging
  useEffect(() => {
    console.error("[Alpha Rig] Runtime Error:", error);
  }, [error]);

  // Auto-retry countdown
  useEffect(() => {
    if (countdown === 0) { reset(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, reset]);

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
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100dvh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
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

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(192,57,43,0.08) 0%, transparent 70%)",
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
        {/* Tag */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#C0392B",
            textTransform: "uppercase",
          }}
        >
          // SYSTEM ERROR
        </p>

        {/* Giant 500 */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(120px, 25vw, 200px)",
            color: "#ffffff",
            lineHeight: 0.88,
            letterSpacing: "0.04em",
            margin: 0,
            userSelect: "none",
            textShadow: "0 0 60px rgba(192,57,43,0.2)",
          }}
        >
          500
        </h1>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(192,57,43,0.4) 30%, rgba(192,57,43,0.4) 70%, transparent)",
          }}
        />

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 36px)",
            color: "#ffffff",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          SOMETHING BROKE THE FORGE
        </h2>

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
          An unexpected error occurred. Our systems are already firing back up.
          We&apos;ll auto-retry in{" "}
          <span style={{ color: "#C0392B", fontWeight: 700 }}>{countdown}s</span>
          {" "}— or hit Retry now.
        </p>

        {/* Error digest badge */}
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

        {/* CTAs */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
          <button
            onClick={handleReset}
            disabled={resetting}
            style={{
              fontFamily: "var(--font-body)",
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
            {resetting ? "RETRYING..." : "Retry Now"}
          </button>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-body)",
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
            Back to Home
          </Link>
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
  );
}
