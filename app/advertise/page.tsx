import type { Metadata } from "next";
import PartnershipForm from "@/components/ui/PartnershipForm";
import AdvertiseStats from "@/components/sections/AdvertiseStats";

export const metadata: Metadata = {
  title: "Advertise | Alpha Rig",
  description:
    "Reach 10,000+ PC builders, gamers, and esports enthusiasts every month. Advertise on Alpha Rig — contextual, non-intrusive placements built for a hardware-obsessed audience.",
  openGraph: {
    title: "Advertise on Alpha Rig",
    description: "Put your brand in front of India's most engaged PC hardware community.",
    url: "https://alpharig.in/advertise",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Advertise on Alpha Rig" },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const AD_FORMATS = [
  {
    id:          "blog-after-intro",
    position:    "After Intro",
    description: "Appears immediately after the article's opening paragraphs — highest attention zone, before readers decide to keep scrolling.",
    specs:       "Banner or custom creative · Swappable from Sanity",
    bestFor:     "Brand awareness, product launches",
  },
  {
    id:          "blog-mid",
    position:    "Mid Article",
    description: "Drops into the body midway through. Readers are invested — this is the sweet spot for click-through.",
    specs:       "Inline card with CTA button · Your headline + body copy",
    bestFor:     "Conversion campaigns, lead gen",
  },
  {
    id:          "blog-end",
    position:    "End of Article",
    description: "Shown after the conclusion, just before related posts. Readers who finish articles are your most qualified audience.",
    specs:       "Full-width card · Logo + headline + CTA",
    bestFor:     "Retargeting, offer promotion",
  },
  {
    id:          "sidebar-trending",
    position:    "Sidebar — Trending",
    description: "Persistent sidebar placement visible throughout the article on desktop. Scrolls with the reader for continuous exposure.",
    specs:       "Compact card · Shows alongside trending posts",
    bestFor:     "Sustained brand visibility",
  },
];

const PRICING = [
  {
    tier:     "Starter",
    price:    "₹5,000",
    period:   "/ month",
    color:    "#444",
    features: [
      "1 ad slot (Mid Article or End of Article)",
      "Your headline, body copy & CTA button",
      "Swappable creative any time",
      "Basic monthly impression report",
    ],
  },
  {
    tier:     "Growth",
    price:    "₹12,000",
    period:   "/ month",
    color:    "#C0392B",
    featured: true,
    features: [
      "2 ad slots (After Intro + Mid or End)",
      "Sidebar placement included",
      "Custom HTML creative option",
      "Weekly impression + click report",
      "Sponsored badge on 1 blog post",
    ],
  },
  {
    tier:     "Full Takeover",
    price:    "Custom",
    period:   "",
    color:    "#888",
    features: [
      "All 4 ad slot positions",
      "Homepage sponsor bar placement",
      "Sponsored post (written by Alpha Rig)",
      "Social media amplification",
      "Dedicated analytics dashboard",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdvertisePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>

      {/* ── Hero ── */}
      <section
        style={{
          padding: "140px 24px 80px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "10px",
            color: "#C0392B",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            margin: "0 0 20px",
          }}
        >
          Advertising
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
          REACH THE BUILDERS
          <br />
          <span style={{ color: "#C0392B" }}>NOT JUST BROWSERS</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-rajdhani)",
            fontSize: "19px",
            color: "#666",
            lineHeight: 1.65,
            maxWidth: "620px",
            margin: "0 auto",
          }}
        >
          Alpha Rig attracts hardware enthusiasts who are actively researching,
          comparing, and buying. Put your brand in front of the most engaged
          PC community in India.
        </p>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          padding: "48px 24px",
          background: "#0d0d0d",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <AdvertiseStats />
        </div>
      </section>

      {/* ── Ad Formats ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Ad Formats
          </p>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 5vw, 56px)", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>
            FOUR PLACEMENTS. ZERO POP-UPS.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "#1a1a1a" }}>
          {AD_FORMATS.map((f) => (
            <div
              key={f.id}
              style={{
                background: "#0A0A0A",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  color: "#C0392B",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {f.position}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-rajdhani)",
                  fontSize: "15px",
                  color: "#888",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {f.description}
              </p>
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#333", margin: 0 }}>
                {f.specs}
              </p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "13px", color: "#555", margin: 0 }}>
                Best for: <span style={{ color: "#666" }}>{f.bestFor}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        style={{
          background: "#0d0d0d",
          borderTop: "1px solid #1a1a1a",
          borderBottom: "1px solid #1a1a1a",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
              Pricing
            </p>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 5vw, 56px)", color: "#fff", letterSpacing: "0.04em", margin: "0 0 12px" }}>
              STRAIGHTFORWARD RATES
            </h2>
            <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#555", margin: 0 }}>
              All prices are monthly. No annual lock-in required to start.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "#1a1a1a" }}>
            {PRICING.map((p) => (
              <div
                key={p.tier}
                style={{
                  background: "#0A0A0A",
                  padding: "36px 32px",
                  position: "relative",
                  borderTop: p.featured ? `3px solid ${p.color}` : "3px solid transparent",
                }}
              >
                {p.featured && (
                  <span
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      fontFamily: "var(--font-space-mono)",
                      fontSize: "8px",
                      color: "#C0392B",
                      background: "rgba(192,57,43,0.1)",
                      border: "1px solid rgba(192,57,43,0.3)",
                      padding: "4px 8px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Most Popular
                  </span>
                )}

                <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>
                  {p.tier}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "48px", color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>
                    {p.price}
                  </span>
                  {p.period && (
                    <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#555" }}>
                      {p.period}
                    </span>
                  )}
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {p.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontFamily: "var(--font-rajdhani)",
                        fontSize: "14px",
                        color: "#777",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: "#C0392B", flexShrink: 0, marginTop: "1px" }}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontSize: "14px",
              color: "#444",
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            Rates are indicative and negotiable based on campaign duration, exclusivity, and category.
          </p>
        </div>
      </section>

      {/* ── Inquiry form ── */}
      <section style={{ maxWidth: "780px", margin: "0 auto", padding: "80px 24px 100px" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Get in Touch
          </p>
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(32px, 5vw, 52px)", color: "#fff", letterSpacing: "0.04em", margin: "0 0 12px" }}>
            START A CAMPAIGN
          </h2>
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#555", margin: 0 }}>
            Fill in the form — we&apos;ll respond within 48 hours with a custom proposal.
          </p>
        </div>

        <PartnershipForm type="advertise" />
      </section>

    </main>
  );
}
