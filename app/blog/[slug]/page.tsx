import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getTrendingPosts,
} from "@/lib/queries";
import { urlFor, ogImage } from "@/lib/sanity";
import BlogCard from "@/components/ui/BlogCard";
import TableOfContents from "./TableOfContents";
import { BlogViewTracker } from "./BlogViewTracker";
import type { TocHeading } from "./TableOfContents";
import type { TypedObject } from "@portabletext/types";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ShareBar from "@/components/ui/ShareBar";
import ClapButton from "@/components/ui/ClapButton";
import AuthorCard from "@/components/ui/AuthorCard";
import NewsletterInline from "@/components/ui/NewsletterInline";
import SponsoredSlot from "@/components/ui/SponsoredSlot";

export const revalidate = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortableTextSpan {
  _type: "span";
  text: string;
  marks?: string[];
}

interface PortableTextBlock {
  _type: "block";
  _key: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: unknown[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(body: unknown[]): TocHeading[] {
  return (body as PortableTextBlock[])
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => {
      const text = (b.children ?? []).map((c) => c.text).join("");
      return { id: slugify(text), text };
    })
    .filter((h) => h.text.length > 0);
}

function readingTime(body: unknown[]): number {
  const words = (body as PortableTextBlock[])
    .filter((b) => b._type === "block")
    .flatMap((b) => b.children ?? [])
    .map((c) => c.text)
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Split body into 3 sections: intro (2–3 blocks) | first half | second half
function splitBody(body: TypedObject[]): [TypedObject[], TypedObject[], TypedObject[]] {
  if (body.length < 4) return [body, [], []];
  const introEnd = Math.min(3, Math.floor(body.length * 0.2));
  const midEnd   = introEnd + Math.floor((body.length - introEnd) / 2);
  return [
    body.slice(0, introEnd),
    body.slice(introEnd, midEnd),
    body.slice(midEnd),
  ];
}

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((p) => ({ slug: p.slug.current }));
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found | Alpha Rig" };

  const description = post.seoDescription ?? post.excerpt;
  const imageUrl = post.coverImage?.asset ? ogImage(post.coverImage) : undefined;
  const titleField = post.seoTitle
    ? { absolute: post.seoTitle }
    : post.title;

  return {
    title: titleField,
    description,
    openGraph: {
      title: post.seoTitle ?? `${post.title} | Alpha Rig`,
      description,
      url: `https://alpharig.in/blog/${post.slug.current}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// ─── Portable Text components ─────────────────────────────────────────────────

function makePortableTextComponents(): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => (
        <p
          style={{
            fontFamily: "var(--font-rajdhani)",
            fontSize: "17px",
            color: "#888",
            lineHeight: 1.85,
            margin: "0 0 22px",
          }}
        >
          {children}
        </p>
      ),
      h2: ({ children, value }) => {
        const text = (value as PortableTextBlock).children
          ?.map((c) => c.text)
          .join("") ?? "";
        const id = slugify(text);
        return (
          <h2
            id={id}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: "0.04em",
              color: "#ffffff",
              margin: "56px 0 20px",
              lineHeight: 1,
              scrollMarginTop: "96px",
            }}
          >
            {children}
          </h2>
        );
      },
      h3: ({ children, value }) => {
        const text = (value as PortableTextBlock).children
          ?.map((c) => c.text)
          .join("") ?? "";
        const id = slugify(text);
        return (
          <h3
            id={id}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(22px, 3vw, 32px)",
              letterSpacing: "0.04em",
              color: "#e0e0e0",
              margin: "40px 0 16px",
              lineHeight: 1,
              scrollMarginTop: "96px",
            }}
          >
            {children}
          </h3>
        );
      },
      h4: ({ children }) => (
        <h4
          style={{
            fontFamily: "var(--font-rajdhani)",
            fontWeight: 700,
            fontSize: "18px",
            color: "#ccc",
            margin: "32px 0 12px",
            lineHeight: 1.3,
          }}
        >
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote
          style={{
            borderLeft: "3px solid #C0392B",
            paddingLeft: "24px",
            margin: "32px 0",
            fontFamily: "var(--font-rajdhani)",
            fontSize: "18px",
            color: "#aaa",
            fontStyle: "italic",
            lineHeight: 1.7,
          }}
        >
          {children}
        </blockquote>
      ),
    },

    marks: {
      strong: ({ children }) => (
        <strong style={{ color: "#e0e0e0", fontWeight: 700 }}>{children}</strong>
      ),
      em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
      underline: ({ children }) => (
        <span style={{ textDecoration: "underline" }}>{children}</span>
      ),
      code: ({ children }) => (
        <code
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "13px",
            color: "#C0392B",
            background: "#1A1A1A",
            border: "1px solid rgba(192,57,43,0.2)",
            padding: "2px 7px",
            borderRadius: "4px",
          }}
        >
          {children}
        </code>
      ),
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#C0392B",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          {children}
        </a>
      ),
    },

    types: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image: ({ value }: { value: any }) => {
        if (!value?.asset) return null;
        const url = urlFor(value).width(760).auto("format").url();
        return (
          <figure style={{ margin: "36px 0" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Image
                src={url}
                alt={value.alt ?? ""}
                fill
                sizes="760px"
                style={{ objectFit: "cover" }}
              />
            </div>
            {value.caption && (
              <figcaption
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "10px",
                  color: "#444",
                  marginTop: "10px",
                  letterSpacing: "0.05em",
                }}
              >
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      codeBlock: ({ value }: { value: any }) => (
        <pre
          style={{
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "24px",
            overflowX: "auto",
            margin: "28px 0",
          }}
        >
          <code
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "13px",
              color: "#d4d4d4",
              lineHeight: 1.65,
            }}
          >
            {value?.code ?? ""}
          </code>
        </pre>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      proTip: ({ value }: { value: any }) => (
        <div
          style={{
            border: "1px solid rgba(192,57,43,0.3)",
            borderLeft: "3px solid #C0392B",
            background: "rgba(192,57,43,0.05)",
            padding: "20px 24px",
            margin: "28px 0",
            borderRadius: "0 6px 6px 0",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "10px",
              color: "#C0392B",
              letterSpacing: "0.2em",
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            Pro Tip
          </p>
          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontSize: "16px",
              color: "#aaa",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {value?.tip ?? ""}
          </p>
        </div>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      comparisonTable: ({ value }: { value: any }) => {
        const rows = value?.rows ?? [];
        const cols = rows[0] ? ["feature", "a", "b", ...(rows[0].c != null ? ["c"] : [])] : [];
        return (
          <div style={{ overflowX: "auto", margin: "28px 0" }}>
            {value?.caption && (
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", color: "#555", marginBottom: "12px" }}>
                {value.caption}
              </p>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {rows.map((row: Record<string, string>, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1e1e1e" }}>
                    {cols.map((col) => (
                      <td
                        key={col}
                        style={{
                          padding: "12px 16px",
                          fontFamily: col === "feature" ? "var(--font-space-mono)" : "var(--font-rajdhani)",
                          fontSize: col === "feature" ? "11px" : "15px",
                          color: col === "feature" ? "#666" : "#aaa",
                          background: i % 2 === 0 ? "#0d0d0d" : "transparent",
                          letterSpacing: col === "feature" ? "0.05em" : "normal",
                        }}
                      >
                        {row[col] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },

    list: {
      bullet: ({ children }) => (
        <ul
          style={{
            fontFamily: "var(--font-rajdhani)",
            fontSize: "17px",
            color: "#888",
            lineHeight: 1.8,
            paddingLeft: "28px",
            margin: "0 0 22px",
          }}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          style={{
            fontFamily: "var(--font-rajdhani)",
            fontSize: "17px",
            color: "#888",
            lineHeight: 1.8,
            paddingLeft: "28px",
            margin: "0 0 22px",
          }}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li style={{ marginBottom: "8px" }}>{children}</li>
      ),
      number: ({ children }) => (
        <li style={{ marginBottom: "8px" }}>{children}</li>
      ),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, trending] = await Promise.all([
    getBlogPostBySlug(slug),
    getTrendingPosts(5),
  ]);

  if (!post) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "#0A0A0A",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "4rem",
            color: "#C0392B",
            letterSpacing: "0.06em",
          }}
        >
          Post Not Found
        </h1>
        <Link
          href="/blog"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "11px",
            color: "#666",
            letterSpacing: "0.1em",
          }}
        >
          ← Back to The Rig Report
        </Link>
      </main>
    );
  }

  const body = (post.body ?? []) as TypedObject[];
  const headings = extractHeadings(body as unknown[]);
  const mins = post.readingTime ?? readingTime(body as unknown[]);
  const [bodyIntro, bodyMid, bodyEnd] = splitBody(body);
  const trendingFiltered = trending.filter((p) => p._id !== post._id).slice(0, 4);

  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(560).fit("crop").auto("format").url()
    : null;

  let related = await getBlogPostsByCategory(post.category);
  related = related.filter((p) => p._id !== post._id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Alpha Rig",
      url: "https://alpharig.in",
    },
    image: coverUrl ?? undefined,
  };

  const ptComponents = makePortableTextComponents();
  const hasSidebar = headings.length > 0 || trendingFiltered.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogViewTracker title={post.title} />
      <ReadingProgress />

      <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>

        {/* ── Article header ── */}
        <header
          style={{
            padding: "120px 24px 0",
            maxWidth: "820px",
            margin: "0 auto",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "32px",
            }}
          >
            <Link
              href="/blog"
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "#444",
                textDecoration: "none",
              }}
            >
              The Rig Report
            </Link>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#2a2a2a" }}>
              /
            </span>
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "#C0392B",
                textTransform: "uppercase",
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Sponsored notice */}
          {post.sponsored && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                background: "rgba(192,57,43,0.06)",
                border: "1px solid rgba(192,57,43,0.2)",
                borderRadius: "4px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  color: "#C0392B",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "rgba(192,57,43,0.15)",
                  padding: "3px 8px",
                  borderRadius: "3px",
                }}
              >
                Sponsored
              </span>
              {post.sponsorName && (
                <span
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    fontSize: "13px",
                    color: "#888",
                  }}
                >
                  Presented by{" "}
                  {post.sponsorUrl ? (
                    <a
                      href={post.sponsorUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      style={{ color: "#C0392B", textDecoration: "none" }}
                    >
                      {post.sponsorName}
                    </a>
                  ) : (
                    post.sponsorName
                  )}
                </span>
              )}
            </div>
          )}

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: "#C0392B",
                background: "rgba(192,57,43,0.1)",
                border: "1px solid rgba(192,57,43,0.25)",
                padding: "5px 10px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              {post.category}
            </span>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#444" }}>
              {formatDate(post.publishedAt)}
            </span>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#333" }}>
              {mins} min read
            </span>
            {(post.likes ?? 0) > 0 && (
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#555" }}>
                {post.likes?.toLocaleString()} claps
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(48px, 8vw, 80px)",
              lineHeight: 1,
              letterSpacing: "0.03em",
              color: "#ffffff",
              margin: "0 0 24px",
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontSize: "20px",
              color: "#666",
              fontStyle: "italic",
              lineHeight: 1.6,
              margin: "0 0 32px",
            }}
          >
            {post.excerpt}
          </p>

          {/* Author row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 0",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C0392B 0%, rgba(192,57,43,0.4) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "14px",
                  color: "#fff",
                  letterSpacing: "0.05em",
                }}
              >
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", color: "#ccc", margin: 0, letterSpacing: "0.05em" }}>
                {post.author}
              </p>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#444", margin: 0 }}>
                {mins} min read · {formatDate(post.publishedAt)}
              </p>
            </div>

            {post.tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginLeft: "auto" }}>
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: "9px",
                      color: "#444",
                      background: "#111",
                      border: "1px solid #222",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover image */}
          {coverUrl && (
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "52%",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Image
                src={coverUrl}
                alt={post.coverImage?.alt ?? post.title}
                fill
                priority
                sizes="(max-width: 820px) 100vw, 820px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
        </header>

        {/* ── Article body + sidebars ── */}
        <div
          className="blog-body-grid"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "56px 24px 80px",
            display: "grid",
            gridTemplateColumns: hasSidebar
              ? "56px minmax(0,1fr) 240px"
              : "56px minmax(0,1fr)",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Share bar column */}
          <ShareBar title={post.title} />

          {/* Article body */}
          <article style={{ minWidth: 0 }}>

            {/* Intro section */}
            {bodyIntro.length > 0 ? (
              <PortableText value={bodyIntro} components={ptComponents} />
            ) : (
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "17px", color: "#555", fontStyle: "italic" }}>
                No content yet.
              </p>
            )}

            {/* After-intro sponsored slot */}
            {bodyIntro.length > 0 && (
              <SponsoredSlot position="blog-after-intro" />
            )}

            {/* Mid section */}
            {bodyMid.length > 0 && (
              <PortableText value={bodyMid} components={ptComponents} />
            )}

            {/* Mid-article newsletter + sponsored slot */}
            {bodyMid.length > 0 && (
              <>
                <NewsletterInline />
                <SponsoredSlot position="blog-mid" />
              </>
            )}

            {/* Final section */}
            {bodyEnd.length > 0 && (
              <PortableText value={bodyEnd} components={ptComponents} />
            )}

            {/* End-of-article sponsored slot */}
            <SponsoredSlot position="blog-end" />

            {/* Author card */}
            <AuthorCard name={post.author} bio={post.authorBio} />

            {/* Clap row */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                padding: "48px 0 16px",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                marginTop: "40px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "10px",
                  color: "#444",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Did this help you?
              </p>
              <ClapButton slug={post.slug.current} initialLikes={post.likes ?? 0} />
              <p
                style={{
                  fontFamily: "var(--font-rajdhani)",
                  fontSize: "14px",
                  color: "#333",
                  margin: 0,
                }}
              >
                Tap to clap — you can clap more than once
              </p>
            </div>
          </article>

          {/* Right sidebar: ToC + Trending */}
          {hasSidebar && (
            <aside className="blog-sidebar">
              {headings.length > 0 && (
                <TableOfContents headings={headings} />
              )}

              {trendingFiltered.length > 0 && (
                <div
                  style={{
                    marginTop: headings.length > 0 ? "32px" : "0",
                    padding: "24px",
                    border: "1px solid #1a1a1a",
                    background: "#0d0d0d",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: "9px",
                      color: "#C0392B",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      margin: "0 0 16px",
                    }}
                  >
                    Trending
                  </p>
                  <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                    {trendingFiltered.map((p, i) => (
                      <li key={p._id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-bebas)",
                            fontSize: "20px",
                            color: "#2a2a2a",
                            lineHeight: 1,
                            flexShrink: 0,
                            width: "20px",
                            textAlign: "right",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <Link
                            href={`/blog/${p.slug.current}`}
                            style={{
                              fontFamily: "var(--font-rajdhani)",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#aaa",
                              textDecoration: "none",
                              lineHeight: 1.4,
                              display: "block",
                            }}
                          >
                            {p.title}
                          </Link>
                          {(p.likes ?? 0) > 0 && (
                            <span
                              style={{
                                fontFamily: "var(--font-space-mono)",
                                fontSize: "9px",
                                color: "#444",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {p.likes?.toLocaleString()} claps
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </aside>
          )}
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <section
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 24px 96px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  letterSpacing: "0.04em",
                  color: "#fff",
                  margin: 0,
                }}
              >
                More from {post.category}
              </h2>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "linear-gradient(to right, rgba(192,57,43,0.3), transparent)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {related.map((p, i) => (
                <BlogCard key={p._id} post={p} index={i} />
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link
                href="/blog"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  color: "#C0392B",
                  border: "1px solid rgba(192,57,43,0.3)",
                  padding: "12px 28px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                ← All Articles
              </Link>
            </div>
          </section>
        )}
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .blog-body-grid {
            grid-template-columns: 1fr !important;
          }
          .blog-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
