"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCursorGlow } from "@/lib/useCursorGlow";
import { urlFor } from "@/lib/sanity";
import type { BuildSummary } from "@/lib/queries";

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function BuildCard({ build, index = 0 }: { build: BuildSummary; index?: number }) {
  const { hostRef, glowRef, handlers } = useCursorGlow();
  const slug = build.slug.current;
  const firstImage = build.images?.[0];
  const imgUrl = firstImage?.asset
    ? urlFor(firstImage).width(680).height(440).fit("crop").auto("format").url()
    : null;

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
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)";
        handlers.onMouseMove(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
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

      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden shrink-0"
        style={{
          height: "220px",
          background: "linear-gradient(160deg, rgba(26,26,26,1) 0%, rgba(10,10,10,1) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={firstImage?.alt ?? build.name}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <>
            <svg
              aria-hidden
              className="absolute inset-0 w-full h-full opacity-[0.08]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id={`grid-${slug}`} width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#C0392B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${slug})`} />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "2px",
                color: "#2a2a2a",
                position: "relative",
                zIndex: 1,
              }}
            >
              BUILD IMAGE
            </span>
          </>
        )}

        {build.featured && (
          <span
            className="absolute top-3 left-3 z-20"
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
            {build.tagline}
          </p>
        </div>

        {/* Category pill */}
        <div className="flex flex-wrap gap-2">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "0.5px",
              color: "#555555",
              background: "#1A1A1A",
              border: "1px solid #222",
              padding: "3px 8px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            {build.category.replace("-", " ")}
          </span>
          {!build.available && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.5px",
                color: "#444",
                background: "#111",
                border: "1px solid #1a1a1a",
                padding: "3px 8px",
                borderRadius: "4px",
              }}
            >
              SHOWCASE ONLY
            </span>
          )}
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
            {fmtPrice(build.price)}
          </span>
          <Link
            href={`/builds/${slug}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "1px",
              color: "#C0392B",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            View Build →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
