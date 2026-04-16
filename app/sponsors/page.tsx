import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getActiveSponsors } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import PartnershipForm from "@/components/ui/PartnershipForm";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sponsors & Partners | Alpha Rig",
  description:
    "Partner with Alpha Rig and put your brand in front of India's most engaged PC hardware and esports community. Title, Gold, Silver, and Community partnership tiers available.",
  openGraph: {
    title: "Partner with Alpha Rig",
    description: "Sponsor India's rising PC hardware and esports platform.",
    url: "https://alpharig.in/sponsors",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Partner with Alpha Rig" },
};

// ─── Tier configuration ────────────────────────────────────────────────────────

const TIERS = [
  {
    value:       "title",
    label:       "Title Sponsor",
    accent:      "#E8C547",
    description: "Maximum visibility across the entire Alpha Rig platform. Your brand becomes synonymous with the Alpha Rig name.",
    includes: [
      "\"Powered by [Brand]\" naming in site header",
      "Homepage hero logo placement",
      "All 4 blog ad slot positions",
      "Logo on every event page",
      "Sponsored blog post (written by Alpha Rig)",
      "Social media shoutout + pinned posts",
      "Exclusive category — only one Title Sponsor at a time",
    ],
  },
  {
    value:       "gold",
    label:       "Gold Partner",
    accent:      "#C0392B",
    description: "Premium placement across blog and events. Gold partners are the first brands our readers associate with Alpha Rig.",
    includes: [
      "Homepage sponsor bar (logo pill)",
      "Blog ad slots — After Intro + Mid Article",
      "Logo on event pages you choose to sponsor",
      "Co-branded event option (\"Alpha Rig × [Brand]\")",
      "Monthly audience insights report",
      "2 sponsored blog posts per quarter",
    ],
  },
  {
    value:       "silver",
    label:       "Silver Partner",
    accent:      "#888",
    description: "Consistent brand presence across our most-read content without the premium commitment.",
    includes: [
      "Homepage sponsor bar (logo pill)",
      "Blog ad slot — Mid Article or End of Article",
      "1 sponsored blog post per quarter",
      "Event logo placement on request",
      "Monthly impression report",
    ],
  },
  {
    value:       "community",
    label:       "Community Partner",
    accent:      "#555",
    description: "Perfect for indie brands, regional businesses, and startups entering the PC hardware space.",
    includes: [
      "Community partner badge in footer",
      "Blog End-of-Article slot",
      "Mention in Alpha Rig newsletter",
      "Social media acknowledgement",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SponsorsPage() {
  const sponsors = await getActiveSponsors();

  const sponsorsByTier: Record<string, typeof sponsors> = {
    title:     sponsors.filter((s) => s.tier === "title"),
    gold:      sponsors.filter((s) => s.tier === "gold"),
    silver:    sponsors.filter((s) => s.tier === "silver"),
    community: sponsors.filter((s) => s.tier === "community"),
  };

  const hasAnySponsors = sponsors.length > 0;

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>

      {/* ── Hero ── */}
      <section style={{ padding: "140px 24px 80px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 20px" }}>
          Partnerships
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(52px, 9vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            color: "#ffffff",
            margin: "0 0 28px",
          }}
        >
          FORGE YOUR BRAND
          <br />
          <span style={{ color: "#C0392B" }}>WITH ALPHA RIG</span>
        </h1>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "19px", color: "#666", lineHeight: 1.65, maxWidth: "620px", margin: "0 auto 36px" }}>
          We&apos;re building India&apos;s most trusted PC hardware platform. Partner with us and
          align your brand with a community that actually buys hardware, attends events, and
          reads every word.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#tiers"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "16px",
              letterSpacing: "0.1em",
              color: "#fff",
              background: "#C0392B",
              padding: "12px 28px",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            See Partnership Tiers
          </a>
          <a
            href="#inquiry"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "16px",
              letterSpacing: "0.1em",
              color: "#C0392B",
              border: "1px solid rgba(192,57,43,0.4)",
              padding: "12px 28px",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* ── Why Alpha Rig ── */}
      <section style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px" }}>
          {[
            { icon: "⚡", title: "High Intent Audience", body: "Our readers are actively researching and buying. They come to Alpha Rig to make purchase decisions — not scroll passively." },
            { icon: "🎯", title: "Contextual Placement", body: "Every ad slot is native to the content. No pop-ups, no interstitials. Your brand appears where readers are most engaged." },
            { icon: "🏆", title: "Esports Community", body: "Alpha Rig runs competitive events. Sponsor our events and your brand is in the arena — literally." },
            { icon: "📊", title: "Full Transparency", body: "Monthly reports with real impression, click, and engagement data. No black-box analytics." },
          ].map((w) => (
            <div key={w.title}>
              <p style={{ fontSize: "28px", margin: "0 0 12px" }}>{w.icon}</p>
              <p style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#e0e0e0", letterSpacing: "0.06em", margin: "0 0 8px" }}>{w.title}</p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#666", lineHeight: 1.65, margin: 0 }}>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Current sponsors ── */}
      {hasAnySponsors && (
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
              Current Partners
            </p>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px, 4vw, 48px)", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>
              BRANDS THAT BELIEVE IN US
            </h2>
          </div>

          {TIERS.filter((t) => sponsorsByTier[t.value]?.length > 0).map((tier) => (
            <div key={tier.value} style={{ marginBottom: "48px" }}>
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  color: tier.accent,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  margin: "0 0 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {tier.label}
                <span style={{ flex: 1, height: "1px", background: `${tier.accent}33`, display: "inline-block" }} />
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                {sponsorsByTier[tier.value].map((s) => (
                  <Link
                    key={s._id}
                    href={s.url ?? "#"}
                    target={s.url ? "_blank" : undefined}
                    rel={s.url ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "20px 24px",
                      border: "1px solid #1e1e1e",
                      background: "#0d0d0d",
                      textDecoration: "none",
                      minWidth: "200px",
                      transition: "border-color 0.15s",
                    }}
                  >
                    {s.logo?.asset && (
                      <div style={{ position: "relative", width: "48px", height: "32px", flexShrink: 0 }}>
                        <Image
                          src={urlFor(s.logo).height(64).auto("format").url()}
                          alt={s.name}
                          fill
                          sizes="48px"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    )}
                    <div>
                      <p style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", color: "#e0e0e0", letterSpacing: "0.06em", margin: 0 }}>
                        {s.name}
                      </p>
                      {s.description && (
                        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "12px", color: "#555", margin: 0, lineHeight: 1.4 }}>
                          {s.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Tier wall ── */}
      <section
        id="tiers"
        style={{
          background: hasAnySponsors ? "#0d0d0d" : "transparent",
          borderTop: "1px solid #1a1a1a",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
              Partnership Tiers
            </p>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 5vw, 56px)", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>
              PICK YOUR LEVEL
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "#1a1a1a" }}>
            {TIERS.map((tier) => (
              <div
                key={tier.value}
                style={{
                  background: "#0A0A0A",
                  padding: "36px 28px",
                  borderTop: `3px solid ${tier.accent}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: tier.accent, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>
                    {tier.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#666", lineHeight: 1.6, margin: 0 }}>
                    {tier.description}
                  </p>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontFamily: "var(--font-rajdhani)",
                        fontSize: "13px",
                        color: "#777",
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: tier.accent, flexShrink: 0 }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="#inquiry"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: "9px",
                    color: tier.accent,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    marginTop: "auto",
                    paddingTop: "16px",
                    borderTop: "1px solid #1a1a1a",
                  }}
                >
                  Inquire about {tier.label} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inquiry form ── */}
      <section
        id="inquiry"
        style={{ maxWidth: "780px", margin: "0 auto", padding: "80px 24px 100px" }}
      >
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Partnership Inquiry
          </p>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px, 5vw, 52px)", color: "#fff", letterSpacing: "0.04em", margin: "0 0 12px" }}>
            LET&apos;S TALK
          </h2>
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#555", margin: 0 }}>
            Tell us about your brand and goals — we&apos;ll put together a custom proposal within 48 hours.
          </p>
        </div>

        <PartnershipForm type="sponsor" />

        <div
          style={{
            marginTop: "40px",
            padding: "24px",
            border: "1px solid #1a1a1a",
            background: "#0d0d0d",
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#555", letterSpacing: "0.15em", margin: "0 0 4px" }}>PREFER EMAIL?</p>
            <Link
              href="mailto:partnerships@alpharig.in"
              style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#C0392B", textDecoration: "none" }}
            >
              partnerships@alpharig.in
            </Link>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#555", letterSpacing: "0.15em", margin: "0 0 4px" }}>INTERESTED IN ADS INSTEAD?</p>
            <Link href="/advertise" style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#888", textDecoration: "none" }}>
              See our advertising options →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
