"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BuildCard from "@/components/ui/BuildCard";
import { getBuildBySlug, getRelatedBuilds } from "@/lib/buildsData";
import { useCursorGlow } from "@/lib/useCursorGlow";

// ─── Spec table ───────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid #1A1A1A" }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "1px",
          color: "#555555",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "#ffffff",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Image placeholder tile ───────────────────────────────────────────────────
function ImageTile({
  large,
  label,
  index,
}: {
  large?: boolean;
  label?: string;
  index: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        borderRadius: large ? "12px" : "8px",
        background: "linear-gradient(145deg, rgba(26,26,26,1), rgba(10,10,10,1))",
        border: "1px solid rgba(255,255,255,0.05)",
        height: large ? "360px" : "110px",
      }}
    >
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`dt-grid-${index}`}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="#C0392B"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dt-grid-${index})`} />
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
        {label ?? "BUILD IMAGE"}
      </span>
    </div>
  );
}

// ─── CTA button ───────────────────────────────────────────────────────────────
function CTAButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const { hostRef, glowRef, handlers } = useCursorGlow<HTMLAnchorElement>();

  const style: React.CSSProperties =
    variant === "primary"
      ? {
          background: "#C0392B",
          color: "#ffffff",
          border: "1px solid #C0392B",
        }
      : {
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(10,10,10,0.4)",
          color: "#888888",
          border: "1px solid rgba(192,57,43,0.25)",
        };

  return (
    <Link
      href={href}
      ref={hostRef}
      {...handlers}
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{
        ...style,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: "14px",
        letterSpacing: "0.06em",
        padding: "14px 28px",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "all 0.2s ease",
        flex: "1 1 0",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        if (variant === "primary")
          (e.currentTarget as HTMLElement).style.background = "#E74C3C";
        else {
          (e.currentTarget as HTMLElement).style.color = "#ffffff";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(192,57,43,0.5)";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary")
          (e.currentTarget as HTMLElement).style.background = "#C0392B";
        else {
          (e.currentTarget as HTMLElement).style.color = "#888888";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(192,57,43,0.25)";
        }
        handlers.onMouseLeave();
      }}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 0,
          background:
            variant === "primary"
              ? "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.15), transparent 80%)"
              : "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.2), transparent 80%)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BuildDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const build = getBuildBySlug(slug);
  if (!build) notFound();

  const related = getRelatedBuilds(slug);

  const SPEC_ROWS: [string, string][] = [
    ["GPU", build.specs.gpu],
    ["CPU", build.specs.cpu],
    ["RAM", build.specs.ram],
    ["Storage", build.specs.storage],
    ["Cooling", build.specs.cooling],
    ["PSU", build.specs.psu],
    ["Motherboard", build.specs.motherboard],
    ["Case", build.specs.case],
  ];

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* Breadcrumb */}
      <div
        className="mx-auto w-full px-6 pt-28 pb-6"
        style={{ maxWidth: "1200px" }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "2px",
            color: "#444",
          }}
        >
          <Link
            href="/builds"
            style={{ color: "#555", textDecoration: "none" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#C0392B")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#555")
            }
          >
            BUILDS
          </Link>
          {" / "}
          <span style={{ color: "#C0392B" }}>{build.name}</span>
        </p>
      </div>

      {/* ── Main two-column layout ── */}
      <div
        className="mx-auto w-full px-6 pb-16"
        style={{ maxWidth: "1200px" }}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">

          {/* LEFT — image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <ImageTile large index={0} label="MAIN IMAGE" />
            <div className="grid grid-cols-3 gap-3">
              <ImageTile index={1} label="ANGLE 1" />
              <ImageTile index={2} label="ANGLE 2" />
              <ImageTile index={3} label="DETAIL" />
            </div>
          </motion.div>

          {/* RIGHT — build info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Tag */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
              }}
            >
              // CUSTOM BUILD · {build.tag}
            </p>

            {/* Name */}
            <h1
              className="leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 5vw, 64px)",
                color: "#ffffff",
                letterSpacing: "0.02em",
              }}
            >
              {build.name}
            </h1>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                color: "#888888",
                lineHeight: 1.7,
              }}
            >
              {build.description}
            </p>

            {/* Spec table */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(17,17,17,0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div
                className="px-5 py-3"
                style={{ borderBottom: "1px solid #1A1A1A" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "3px",
                    color: "#555",
                  }}
                >
                  SPECIFICATIONS
                </span>
              </div>
              <div className="px-5">
                {SPEC_ROWS.map(([label, value]) => (
                  <SpecRow key={label} label={label} value={value} />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "48px",
                  color: "#C0392B",
                  lineHeight: 1,
                }}
              >
                {build.price}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#444",
                }}
              >
                STARTING PRICE
              </span>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <CTAButton href="/contact?build=commission" variant="primary">
                Commission Similar Build
              </CTAButton>
              <CTAButton href="/contact" variant="ghost">
                Contact Us
              </CTAButton>
            </div>

            {/* Trust note */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "1.5px",
                color: "#333",
                lineHeight: 1.8,
              }}
            >
              ALL BUILDS · HAND ASSEMBLED · BENCH TESTED · 1-YEAR WARRANTY
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Related builds ── */}
      <div
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid #1A1A1A",
        }}
      >
        <div
          className="mx-auto px-6 py-16"
          style={{ maxWidth: "1200px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
                marginBottom: "10px",
              }}
            >
              // YOU MIGHT ALSO LIKE
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 4vw, 48px)",
                color: "#ffffff",
                letterSpacing: "0.02em",
              }}
            >
              OTHER BUILDS
            </h2>
          </motion.div>

          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            }}
          >
            {related.map((b, i) => (
              <BuildCard key={b.slug} build={b} index={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
