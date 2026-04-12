import { getAllBlogPosts } from "@/lib/queries";
import BlogGrid from "./BlogGrid";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Rig Report — PC Hardware Blog",
  description:
    "Hardware deep-dives, esports coverage, custom PC build guides and gaming culture from Alpha Rig — straight from the forge.",
  keywords: ["PC hardware blog India", "gaming blog", "custom PC guide", "esports news India", "Alpha Rig blog"],
  openGraph: {
    title: "The Rig Report | Alpha Rig",
    description: "Hardware deep-dives, esports coverage, and gaming culture — straight from the forge.",
    url: "https://alpharig.in/blog",
    siteName: "Alpha Rig",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "The Rig Report | Alpha Rig" },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      {/* ── Hero ── */}
      <section
        style={{
          padding: "140px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient radial */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "360px",
            background:
              "radial-gradient(ellipse, rgba(192,57,43,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Horizontal rule accents */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent 0%, rgba(192,57,43,0.15) 30%, rgba(192,57,43,0.15) 70%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#C0392B",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Alpha Rig · Field Notes
          </p>

          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(64px, 12vw, 104px)",
              lineHeight: 0.95,
              color: "#ffffff",
              letterSpacing: "0.04em",
              margin: "0 0 20px",
            }}
          >
            THE RIG REPORT
          </h1>

          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontWeight: 400,
              fontSize: "18px",
              color: "#666",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Hardware deep-dives, esports coverage, custom builds &amp; gaming
            culture — straight from the forge.
          </p>

          {/* Post count */}
          {posts.length > 0 && (
            <p
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "10px",
                color: "#333",
                marginTop: "28px",
                letterSpacing: "0.1em",
              }}
            >
              {posts.length} article{posts.length !== 1 ? "s" : ""} published
            </p>
          )}
        </div>
      </section>

      {/* ── Grid + Filters ── */}
      <BlogGrid posts={posts} />
    </main>
  );
}
