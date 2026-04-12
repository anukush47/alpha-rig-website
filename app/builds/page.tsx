"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BuildCard from "@/components/ui/BuildCard";
import { BUILDS } from "@/lib/buildsData";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Water Cooled", value: "water-cooled" },
  { label: "Air Cooled", value: "air-cooled" },
  { label: "RGB", value: "rgb" },
  { label: "Compact", value: "compact" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function BuildsPage() {
  const [active, setActive] = useState<FilterValue>("all");

  const filtered =
    active === "all"
      ? BUILDS
      : BUILDS.filter((b) => b.category === active);

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* ── Hero ── */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "300px", paddingTop: "80px" }}
      >
        {/* Red glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 30% 120%, rgba(192,57,43,0.1) 0%, transparent 65%)",
          }}
        />
        {/* Grid */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#C0392B" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        <div
          className="relative z-10 mx-auto w-full px-6 pb-12"
          style={{ maxWidth: "1200px" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
              marginBottom: "12px",
            }}
          >
            // ALPHA RIG · PORTFOLIO
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 8vw, 80px)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            OUR BUILDS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "#888888",
              marginTop: "12px",
            }}
          >
            Every machine is hand-assembled, bench-tested, and built to outlast the hype.
          </motion.p>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div
        className="sticky top-0 z-30 w-full"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(10,10,10,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto scrollbar-none"
          style={{ maxWidth: "1200px" }}
        >
          {FILTERS.map(({ label, value }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                onClick={() => setActive(value)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  padding: "7px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  background: isActive ? "#C0392B" : "#1A1A1A",
                  color: isActive ? "#ffffff" : "#888888",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color = "#C0392B";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color = "#888888";
                }}
              >
                {label.toUpperCase()}
              </button>
            );
          })}

          {/* Count */}
          <span
            className="ml-auto shrink-0"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "1px",
              color: "#444",
            }}
          >
            {filtered.length} BUILDS
          </span>
        </div>
      </div>

      {/* ── Builds grid ── */}
      <div
        className="mx-auto w-full px-6 py-12"
        style={{ maxWidth: "1200px" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24">
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#333",
              }}
            >
              NO BUILDS IN THIS CATEGORY YET
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            }}
          >
            {filtered.map((build, i) => (
              <BuildCard key={build.slug} build={build} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
