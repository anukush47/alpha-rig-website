"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCursorGlow } from "@/lib/useCursorGlow";
import type { Build } from "@/lib/buildsData";

interface BuildCardProps {
  build: Build;
  index?: number;
}

export default function BuildCard({ build, index = 0 }: BuildCardProps) {
  const { hostRef, glowRef, handlers } = useCursorGlow();

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      ref={hostRef as React.RefObject<HTMLElement>}
      {...handlers}
      className="relative flex flex-col overflow-hidden group"
      style={{
        borderRadius: "16px",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(26,26,26,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(192,57,43,0.3)";
        handlers.onMouseMove(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.06)";
        handlers.onMouseLeave();
      }}
    >
      {/* Cursor-tracking glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: 0,
          background:
            "radial-gradient(250px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.09), transparent 70%)",
        }}
      />

      {/* Image area — top 55% */}
      <div
        className="relative flex items-center justify-center overflow-hidden shrink-0"
        style={{
          height: "220px",
          background:
            "linear-gradient(160deg, rgba(26,26,26,1) 0%, rgba(10,10,10,1) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Grid decoration */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`grid-${build.slug}`}
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="#C0392B"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${build.slug})`} />
        </svg>

        {/* Subtle bottom gradient fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "60px",
            background:
              "linear-gradient(to top, rgba(26,26,26,0.7), transparent)",
          }}
        />

        {/* Placeholder icon */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            style={{
              width: "44px",
              height: "44px",
              border: "1px solid #2a2a2a",
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
                stroke="#3a3a3a"
                strokeWidth="1.5"
              />
              <path
                d="M3 15l5-5 4 4 3-3 6 6"
                stroke="#3a3a3a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#3a3a3a" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#2a2a2a",
            }}
          >
            BUILD IMAGE
          </span>
        </div>

        {/* Category badge — top-left */}
        {build.featured && (
          <span
            className="absolute top-3 left-3"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#ffffff",
              background: "#C0392B",
              padding: "3px 8px",
              borderRadius: "4px",
            }}
          >
            FEATURED
          </span>
        )}
      </div>

      {/* Content area */}
      <div className="relative z-10 flex flex-col gap-3 p-5">
        {/* Name + tag */}
        <div className="flex flex-col gap-1">
          <h3
            className="leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            {build.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "1.5px",
              color: "#C0392B",
            }}
          >
            {build.tag}
          </p>
        </div>

        {/* Spec pills */}
        <div className="flex flex-wrap gap-2">
          {[
            build.specs.gpu,
            build.specs.cpu,
            build.specs.ram,
          ].map((spec) => (
            <span
              key={spec}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.5px",
                color: "#555555",
                background: "#1A1A1A",
                border: "1px solid #222",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between mt-1 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "20px",
              color: "#ffffff",
            }}
          >
            {build.price}
          </span>
          <Link
            href={`/builds/${build.slug}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "1px",
              color: "#C0392B",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.7")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            View Build →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
