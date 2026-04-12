import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getBuildBySlug, getAllBuilds } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import { BuildCTA } from "./BuildCTA";
import BuildCard from "@/components/ui/BuildCard";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);
  if (!build) return {};
  const imageUrl = build.images?.[0]?.asset
    ? urlFor(build.images[0]).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;
  const specsSnippet = build.specs?.slice(0, 3).map((s) => `${s.label}: ${s.value}`).join(" · ");
  const description = specsSnippet ? `${build.tagline} — ${specsSnippet}` : (build.description?.slice(0, 155) ?? "");
  return {
    title: build.name,
    description,
    openGraph: {
      title: `${build.name} | Alpha Rig`,
      description,
      url: `https://alpharig.in/builds/${slug}`,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: build.name }] : [],
    },
    twitter: { card: "summary_large_image", title: build.name, description, images: imageUrl ? [imageUrl] : [] },
  };
}

function fmtPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [build, allBuilds] = await Promise.all([getBuildBySlug(slug), getAllBuilds()]);
  if (!build) notFound();

  const related = allBuilds.filter((b) => b.slug.current !== slug).slice(0, 3);

  const firstImage = build.images?.[0];
  const heroUrl = firstImage?.asset
    ? urlFor(firstImage).width(1200).height(720).fit("crop").auto("format").url()
    : null;

  const thumbUrls = build.images?.slice(1, 4).map((img) =>
    img.asset ? urlFor(img).width(400).height(220).fit("crop").auto("format").url() : null
  ) ?? [];

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* Breadcrumb */}
      <div className="mx-auto w-full px-6 pt-28 pb-6" style={{ maxWidth: "1200px" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#444" }}>
          <Link
            href="/builds"
            style={{ color: "#555", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C0392B")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
          >
            BUILDS
          </Link>
          {" / "}
          <span style={{ color: "#C0392B" }}>{build.name}</span>
        </p>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="mx-auto w-full px-6 pb-16" style={{ maxWidth: "1200px" }}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          {/* LEFT — image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {/* Main image */}
            <div
              className="relative overflow-hidden flex items-center justify-center"
              style={{
                height: "360px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, rgba(26,26,26,1), rgba(10,10,10,1))",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {heroUrl ? (
                <Image src={heroUrl} alt={firstImage?.alt ?? build.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 1024px) 100vw, 60vw" />
              ) : (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "#2a2a2a" }}>
                  BUILD IMAGE
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => {
                const url = thumbUrls[i];
                return (
                  <div
                    key={i}
                    className="relative overflow-hidden flex items-center justify-center"
                    style={{
                      height: "110px",
                      borderRadius: "8px",
                      background: "linear-gradient(145deg, rgba(26,26,26,1), rgba(10,10,10,1))",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {url ? (
                      <Image src={url} alt={`${build.name} angle ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="200px" />
                    ) : (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "#2a2a2a" }}>
                        ANGLE {i + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT — build info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B" }}>
              // CUSTOM BUILD · {build.tagline}
            </p>

            <h1
              className="leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 5vw, 64px)", color: "#ffffff", letterSpacing: "0.02em" }}
            >
              {build.name}
            </h1>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#888888", lineHeight: 1.7 }}>
              {build.description}
            </p>

            {/* Spec table */}
            {build.specs && build.specs.length > 0 && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(17,17,17,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
              >
                <div className="px-5 py-3" style={{ borderBottom: "1px solid #1A1A1A" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "#555" }}>SPECIFICATIONS</span>
                </div>
                <div className="px-5">
                  {build.specs.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid #1A1A1A" }}
                    >
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "1px", color: "#555555", textTransform: "uppercase" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#ffffff", textAlign: "right" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span style={{ fontFamily: "var(--font-display)", fontSize: "48px", color: "#C0392B", lineHeight: 1 }}>
                {fmtPrice(build.price)}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#444" }}>
                STARTING PRICE
              </span>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <BuildCTA href="/contact?build=commission" variant="primary">
                Commission Similar Build
              </BuildCTA>
              <BuildCTA href="/contact" variant="ghost">
                Contact Us
              </BuildCTA>
            </div>

            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1.5px", color: "#333", lineHeight: 1.8 }}>
              ALL BUILDS · HAND ASSEMBLED · BENCH TESTED · 1-YEAR WARRANTY
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Related builds ── */}
      {related.length > 0 && (
        <div style={{ background: "#0A0A0A", borderTop: "1px solid #1A1A1A" }}>
          <div className="mx-auto px-6 py-16" style={{ maxWidth: "1200px" }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "10px" }}>
                // YOU MIGHT ALSO LIKE
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 48px)", color: "#ffffff", letterSpacing: "0.02em" }}>
                OTHER BUILDS
              </h2>
            </motion.div>

            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
              {related.map((b, i) => (
                <BuildCard key={b._id} build={b} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
