"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FeaturedBuild() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.setProperty("--x", `${x}%`);
    glow.style.setProperty("--y", `${y}%`);
    glow.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <section
      className="w-full py-20"
      style={{ background: "#0A0A0A" }}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#C0392B",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          // SECTION — FEATURED
        </motion.p>

        {/* Cinematic card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden featured-build-card"
          style={{
            height: "clamp(320px, 42vw, 480px)",
            borderRadius: "16px",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            background: "rgba(17,17,17,0.9)",
            border: "1px solid rgba(255,255,255,0.06)",
            cursor: "default",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left-side ambient red glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(500px circle at -10% 50%, rgba(192,57,43,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Cursor-tracking overlay */}
          <div
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: 0,
              background:
                "radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.07), transparent 70%)",
            }}
          />

          {/* Inner layout */}
          <div className="relative z-10 flex h-full featured-build-inner">
            {/* LEFT 60% — content */}
            <div
              className="flex flex-col justify-center gap-6 featured-build-content"
              style={{ width: "60%", padding: "clamp(24px, 4vw, 40px)" }}
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
                // FEATURED BUILD
              </p>

              {/* Title */}
              <div>
                <h2
                  className="leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(48px, 6vw, 72px)",
                    color: "#ffffff",
                    lineHeight: 0.9,
                    letterSpacing: "0.02em",
                  }}
                >
                  DRAGON&apos;S
                  <br />
                  BREATH
                </h2>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    color: "#888888",
                    fontWeight: 400,
                  }}
                >
                  Custom Water-Cooled · Limited Edition
                </p>
              </div>

              {/* Specs strip */}
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "#C0392B",
                  letterSpacing: "1px",
                }}
              >
                RTX 4090 · i9-14900K · 64GB DDR5 · Custom Loop
              </p>

              {/* CTA */}
              <div className="mt-2">
                <GlassButton href="/builds/dragons-breath">
                  View Full Build →
                </GlassButton>
              </div>
            </div>

            {/* RIGHT 40% — image placeholder */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: "40%",
                borderLeft: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(10,10,10,0.5)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle inner glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(300px circle at 50% 50%, rgba(192,57,43,0.06), transparent 70%)",
                }}
              />
              {/* Grid lines decoration */}
              <svg
                aria-hidden
                className="absolute inset-0 w-full h-full opacity-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#C0392B"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="#555"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 15l5-5 4 4 3-3 6 6"
                      stroke="#555"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#555" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "3px",
                    color: "#333333",
                    textTransform: "uppercase",
                  }}
                >
                  Build Image
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GlassButton({ href, children }: { href: string; children: React.ReactNode }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current;
    const ov = overlayRef.current;
    if (!el || !ov) return;
    const r = el.getBoundingClientRect();
    ov.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    ov.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    ov.style.opacity = "1";
  };

  return (
    <Link
      href={href}
      ref={btnRef}
      className="inline-flex items-center relative overflow-hidden"
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: "13px",
        letterSpacing: "0.06em",
        color: "#C0392B",
        padding: "12px 24px",
        borderRadius: "8px",
        border: "1px solid rgba(192,57,43,0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "color 0.2s, border-color 0.2s",
        textDecoration: "none",
      }}
      onMouseMove={onMove}
      onMouseLeave={(e) => {
        if (overlayRef.current) overlayRef.current.style.opacity = "0";
        (e.currentTarget as HTMLElement).style.color = "#C0392B";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.35)";
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#ffffff";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.7)";
      }}
    >
      <span
        ref={overlayRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.3s",
          background:
            "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.2), transparent 80%)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Link>
  );
}
