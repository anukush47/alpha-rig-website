"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/ui/BlogCard";
import { urlFor } from "@/lib/sanity";
import type { BlogPostSummary } from "@/lib/queries";

// Matches BLOG_CATEGORIES in sanity/schemas/blogPost.ts
const CATEGORIES = [
  { label: "All",                       value: "All"                       },
  { label: "AI Hardware",               value: "AI Hardware"               },
  { label: "CPUs & Processing",         value: "CPUs & Processing"         },
  { label: "GPUs & Gaming",             value: "GPUs & Gaming"             },
  { label: "Storage & Memory",          value: "Storage & Memory"          },
  { label: "PC Building & Upgrades",    value: "PC Building & Upgrades"    },
  { label: "Troubleshooting & Fixes",   value: "Troubleshooting & Fixes"   },
  { label: "Cooling & Power",           value: "Cooling & Power"           },
  { label: "Connectivity & Future Tech", value: "Connectivity & Future Tech" },
  { label: "Esports & Gaming Culture",  value: "Esports & Gaming Culture"  },
  { label: "Security & Privacy",        value: "Security & Privacy"        },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogGrid({ posts }: { posts: BlogPostSummary[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const isFiltered = activeCategory !== "All" || search.trim() !== "";

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat =
        activeCategory === "All" ||
        p.category === activeCategory ||
        (p as BlogPostSummary & { subcategories?: string[] }).subcategories?.includes(activeCategory);
      const matchSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase().trim()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase().trim()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase().trim()));
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, search]);

  const featured = !isFiltered && posts[0] ? posts[0] : null;
  const gridPosts = isFiltered ? filtered : filtered.slice(1);

  const featuredImage = featured?.coverImage?.asset
    ? urlFor(featured.coverImage).width(1200).height(560).fit("crop").auto("format").url()
    : null;

  return (
    <div style={{ padding: "0 24px 80px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Filter bar + Search */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {CATEGORIES.map(({ label, value }) => {
            const active = activeCategory === value;
            return (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "6px 13px",
                  borderRadius: "6px",
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  backdropFilter: active ? "none" : "blur(10px)",
                  WebkitBackdropFilter: active ? "none" : "blur(10px)",
                  background: active
                    ? "#C0392B"
                    : "rgba(255,255,255,0.04)",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  borderColor: active
                    ? "#C0392B"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: active
                    ? "0 2px 12px rgba(192,57,43,0.35)"
                    : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: "240px" }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "var(--font-rajdhani)",
              fontSize: "14px",
              color: "#ccc",
              background: "rgba(26,26,26,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px",
              padding: "9px 16px 9px 36px",
              outline: "none",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                "rgba(192,57,43,0.4)")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                "rgba(255,255,255,0.07)")
            }
          />
          <svg
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.35,
              pointerEvents: "none",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Featured post */}
      <AnimatePresence mode="wait">
        {featured && (
          <motion.div
            key="featured"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ marginBottom: "48px" }}
          >
            <Link href={`/blog/${featured.slug.current}`} className="block">
              <article
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  background: "rgba(15,10,10,0.6)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  minHeight: "420px",
                  transition: "border-color 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(192,57,43,0.4)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.07)")
                }
              >
                {/* Image side */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(26,26,26,0.9)",
                  }}
                >
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={featured.coverImage?.alt ?? featured.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                          "linear-gradient(135deg, rgba(192,57,43,0.1) 0%, rgba(10,10,10,0.9) 100%)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-bebas)",
                          fontSize: "3rem",
                          color: "rgba(192,57,43,0.2)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        ALPHA RIG
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay on image edge */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to right, transparent 60%, rgba(15,10,10,0.4) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* Content side */}
                <div
                  style={{
                    padding: "48px 40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        color: "#C0392B",
                        background: "rgba(192,57,43,0.12)",
                        border: "1px solid rgba(192,57,43,0.25)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                      }}
                    >
                      {featured.category}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "9px",
                        color: "#444",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Featured
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "clamp(32px, 4vw, 52px)",
                      letterSpacing: "0.03em",
                      color: "#fff",
                      lineHeight: 1.05,
                      margin: 0,
                    }}
                  >
                    {featured.title}
                  </h2>

                  <p
                    style={{
                      fontFamily: "var(--font-rajdhani)",
                      fontSize: "16px",
                      color: "#888",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {featured.excerpt}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "20px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "10px",
                        color: "#444",
                      }}
                    >
                      {formatDate(featured.publishedAt)}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-rajdhani)",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#C0392B",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Read Article →
                    </span>
                  </div>
                </div>

                {/* Accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(to right, #C0392B 0%, rgba(192,57,43,0.3) 50%, transparent 100%)",
                  }}
                />
              </article>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count when filtering */}
      {isFiltered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "#444",
            marginBottom: "24px",
          }}
        >
          {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
        </motion.p>
      )}

      {/* Posts grid */}
      {gridPosts.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {gridPosts.map((post, i) => (
            <BlogCard key={post._id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "80px 0" }}
        >
          <p
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "2rem",
              color: "#333",
              letterSpacing: "0.06em",
              marginBottom: "12px",
            }}
          >
            No articles found
          </p>
          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontSize: "14px",
              color: "#444",
            }}
          >
            Try a different category or search term.
          </p>
        </motion.div>
      )}
    </div>
  );
}
