"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

// Lazy-load the 3D viewer — keeps SSR clean
const CreatureViewer = dynamic(() => import("@/components/3d/CreatureViewer"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center"
      style={{ aspectRatio: "4/3", minHeight: "280px" }}
    >
      <span
        className="animate-pulse"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "4px",
          color: "#C0392B",
        }}
      >
        INITIALIZING...
      </span>
    </div>
  ),
});

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center px-5 py-3"
      style={{
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(10,10,10,0.55)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          color: "#C0392B",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "2px",
          color: "#555555",
          marginTop: "4px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Cursor-tracking liquid-glass button ─────────────────────────────────────
function GlowButton({
  href,
  children,
  variant,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "secondary";
  onClick?: () => void;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current;
    const ov = overlayRef.current;
    if (!el || !ov) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ov.style.setProperty("--x", `${x}%`);
    ov.style.setProperty("--y", `${y}%`);
    ov.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  };

  const base: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 28px",
    borderRadius: "8px",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: "14px",
    letterSpacing: "0.08em",
    textDecoration: "none",
    overflow: "hidden",
    transition: "all 0.2s ease",
    cursor: "pointer",
    userSelect: "none",
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      ...base,
      background: "#C0392B",
      color: "#ffffff",
      border: "1px solid #C0392B",
    },
    secondary: {
      ...base,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      background: "rgba(10,10,10,0.4)",
      color: "#888888",
      border: "1px solid rgba(192,57,43,0.3)",
    },
  };

  return (
    <Link
      href={href}
      ref={btnRef}
      style={styles[variant]}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        if (variant === "secondary") {
          (e.currentTarget as HTMLElement).style.color = "#ffffff";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.6)";
        } else {
          (e.currentTarget as HTMLElement).style.background = "#E74C3C";
        }
      }}
      onMouseOut={(e) => {
        if (variant === "secondary") {
          (e.currentTarget as HTMLElement).style.color = "#888888";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)";
        } else {
          (e.currentTarget as HTMLElement).style.background = "#C0392B";
        }
      }}
    >
      {/* Cursor-tracking radial glow overlay */}
      <span
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.3s ease",
          background:
            variant === "primary"
              ? "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.18), transparent 80%)"
              : "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.25), transparent 80%)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Link>
  );
}

// Hardware-accelerated fade-up — only transforms opacity and Y (compositor-only)
const EASE = "easeOut" as const;
function fadeUpProps(delay: number) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: EASE },
    // layout={false} prevents Framer from measuring DOM for layout animations
    layout: false,
  };
}

// ─── Hero section ────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      className="relative w-full min-h-screen flex items-center"
      style={{
        background: "#0A0A0A",
        paddingTop: "clamp(72px, 12vw, 100px)", // clear floating navbar
      }}
    >
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% 100%, rgba(192,57,43,0.08) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 mx-auto w-full px-6"
        style={{ maxWidth: "1200px" }}
      >
        {/* Two-column grid: text left, creature right — equal split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-6">

          {/* ── LEFT: text content ── */}
          <div className="flex flex-col gap-8 order-1 lg:order-1">

            {/* Tag */}
            <motion.p
              {...fadeUpProps(0)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#C0392B",
                textTransform: "uppercase",
              }}
            >
              // ALPHA RIG PRIVATE LIMITED
            </motion.p>

            {/* H1 */}
            <motion.h1
              {...fadeUpProps(0.15)}
              className="leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(60px, 8vw, 96px)",
                color: "#ffffff",
                lineHeight: 0.92,
                letterSpacing: "0.02em",
              }}
            >
              FORGE YOUR
              <br />
              <span style={{ color: "#C0392B" }}>LEGEND</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              {...fadeUpProps(0.30)}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "18px",
                color: "#888888",
                maxWidth: "440px",
                lineHeight: 1.6,
              }}
            >
              Custom Builds · Esports Events · PC Culture — Redefined.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              {...fadeUpProps(0.45)}
              className="flex flex-wrap gap-4"
            >
              <GlowButton href="/builds" variant="primary" onClick={() => trackEvent("click", "CTA", "hero_explore_builds")}>
                Explore Builds
              </GlowButton>
              <GlowButton href="/store" variant="secondary" onClick={() => trackEvent("click", "CTA", "hero_visit_store")}>
                Visit Store
              </GlowButton>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              {...fadeUpProps(0.60)}
              className="flex flex-wrap gap-3"
            >
              <StatPill value="50+" label="Custom Builds" />
              <StatPill value="12+" label="Esports Events" />
              <StatPill value="30+" label="Blog Posts" />
            </motion.div>
          </div>

          {/* ── RIGHT: 3D creature — fade in after hero text ── */}
          <motion.div
            className="order-2 lg:order-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
            layout={false}
            style={{ marginLeft: "auto" }}
          >
            <CreatureViewer />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
