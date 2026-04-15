"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";

function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let frame = 0;
    let iter = 0;
    const max = text.length * 3;
    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iter / 3) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      iter++;
      frame++;
      if (frame > max) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [active, text]);

  return display;
}

export default function NotFound() {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const heading = useGlitch("404", hovered);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
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
      {/* Grid pattern */}
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

      {/* Ambient bottom glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "300px",
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
          // ERROR 404
        </p>

        {/* Giant 404 with glitch on hover */}
        <h1
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(120px, 25vw, 200px)",
            color: "#ffffff",
            lineHeight: 0.88,
            letterSpacing: "0.04em",
            margin: 0,
            cursor: "default",
            userSelect: "none",
            // Subtle red text-shadow for depth
            textShadow: hovered
              ? "2px 0 0 #C0392B, -2px 0 0 #4455cc"
              : "0 0 40px rgba(192,57,43,0.15)",
            transition: "text-shadow 0.1s",
          }}
        >
          {heading}
        </h1>

        {/* Divider line */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(192,57,43,0.4) 30%, rgba(192,57,43,0.4) 70%, transparent)",
          }}
        />

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 40px)",
            color: "#ffffff",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          PAGE NOT FOUND
        </h2>

        {/* Body */}
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
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Even our creature couldn&apos;t track it down.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.08em",
              color: "#fff",
              background: "#C0392B",
              border: "1px solid #C0392B",
              borderRadius: "8px",
              padding: "14px 28px",
              textDecoration: "none",
              transition: "background 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E74C3C")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}
          >
            Back to Home
          </Link>
          <Link
            href="/store"
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
            Visit Store
          </Link>
        </div>

        {/* Bottom mono tag */}
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
