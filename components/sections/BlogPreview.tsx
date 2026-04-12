"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ─── Static placeholder data ──────────────────────────────────────────────────
const POSTS = [
  {
    slug: "rtx-5090-worth-it",
    category: "GPU GUIDE",
    title: "Is the RTX 5090 Worth It For Custom Builds in 2025?",
    excerpt:
      "We benchmark the 5090 against the 4090 across 10 real-world workloads to help you decide before you drop ₹2L.",
    date: "JAN 28, 2025",
  },
  {
    slug: "water-cooling-beginners",
    category: "BUILD GUIDE",
    title: "Custom Water Cooling: From Zero to Full Loop in One Weekend",
    excerpt:
      "Soft tubing vs hard tubing, reservoir placement, bleeding the loop — everything you need to know before you fill.",
    date: "JAN 14, 2025",
  },
  {
    slug: "esports-durg-valorant",
    category: "ESPORTS",
    title: "How Durg's Esports Scene Went From Zero to Regional Champions",
    excerpt:
      "We trace the rise of competitive gaming in Chhattisgarh, from LAN cafes to the Alpha Rig Valorant Open stage.",
    date: "DEC 30, 2024",
  },
];

// ─── Blog card ────────────────────────────────────────────────────────────────
function BlogCard({
  post,
  index,
}: {
  post: (typeof POSTS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    glow.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    glow.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    glow.style.opacity = "1";
  };

  const onLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      ref={cardRef}
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: "12px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(15,10,10,0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "default",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Cursor glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 0,
          borderRadius: "12px",
          background:
            "radial-gradient(200px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.08), transparent 70%)",
        }}
      />

      {/* Image placeholder */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          height: "160px",
          background: "rgba(10,10,10,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Grid decoration */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`grid-blog-${index}`}
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
          <rect width="100%" height="100%" fill={`url(#grid-blog-${index})`} />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "3px",
            color: "#333",
          }}
        >
          POST IMAGE
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3 p-6 flex-1">
        {/* Category badge */}
        <span
          className="self-start"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "2px",
            color: "#C0392B",
            background: "#1A1A1A",
            padding: "3px 8px",
            borderRadius: "4px",
          }}
        >
          {post.category}
        </span>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "17px",
            color: "#ffffff",
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "14px",
            color: "#888888",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Link
            href={`/blog/${post.slug}`}
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
            Read More →
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "1px",
              color: "#444444",
            }}
          >
            {post.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Blog preview section ─────────────────────────────────────────────────────
export default function BlogPreview() {
  return (
    <section
      className="w-full py-24"
      style={{ background: "#0A0A0A" }}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12 gap-6 flex-wrap"
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "4px",
                color: "#C0392B",
                marginBottom: "12px",
              }}
            >
              // THE RIG REPORTS
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 5vw, 56px)",
                color: "#ffffff",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
              }}
            >
              LATEST FROM
              <br />
              THE RIG
            </h2>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 transition-all duration-200"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.06em",
              color: "#888888",
              padding: "12px 32px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#ffffff";
              el.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#888888";
              el.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            View All Posts →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
