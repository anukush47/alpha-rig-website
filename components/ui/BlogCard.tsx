"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCursorGlow } from "@/lib/useCursorGlow";
import { urlFor } from "@/lib/sanity";
import type { BlogPostSummary } from "@/lib/queries";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface BlogCardProps {
  post: BlogPostSummary;
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const { hostRef, glowRef, handlers } = useCursorGlow();

  const imageUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(640).height(360).fit("crop").auto("format").url()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug.current}`} className="block h-full" tabIndex={-1}>
        <article
          ref={hostRef}
          {...handlers}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.35)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
            handlers.onMouseMove(e);
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            handlers.onMouseLeave();
          }}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(15,10,10,0.6)",
            border: "1px solid rgba(255,255,255,0.05)",
            transition: "border-color 0.25s ease, transform 0.25s ease",
            cursor: "pointer",
          }}
        >
          {/* Cursor-tracking glow */}
          <div
            ref={glowRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.11), transparent 70%)",
              opacity: 0,
              transition: "opacity 0.3s",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Image area */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              flexShrink: 0,
              background: "rgba(26,26,26,0.8)",
              overflow: "hidden",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.coverImage?.alt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(192,57,43,0.06) 0%, rgba(26,26,26,0.9) 100%)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "2rem",
                    letterSpacing: "0.1em",
                    color: "rgba(192,57,43,0.25)",
                  }}
                >
                  ALPHA RIG
                </span>
              </div>
            )}

            {/* Category badge */}
            <span
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                fontFamily: "var(--font-space-mono)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "#C0392B",
                background: "rgba(10,10,10,0.9)",
                border: "1px solid rgba(192,57,43,0.3)",
                padding: "4px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
                zIndex: 1,
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "18px 20px 20px",
              position: "relative",
              zIndex: 1,
              gap: "10px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 700,
                fontSize: "18px",
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.title}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-rajdhani)",
                fontWeight: 400,
                fontSize: "14px",
                color: "#888",
                margin: 0,
                lineHeight: 1.65,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {post.excerpt}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                marginTop: "auto",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "10px",
                  color: "#444",
                }}
              >
                {formatDate(post.publishedAt)}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-rajdhani)",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "#C0392B",
                  letterSpacing: "0.02em",
                }}
              >
                Read More →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
