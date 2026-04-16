import Link from "next/link";
import Image from "next/image";
import { getHomepageSponsors } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";

export default async function SponsorBar() {
  const sponsors = await getHomepageSponsors();
  if (!sponsors.length) return null;

  return (
    <section
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        padding: "24px 0",
        background: "#0d0d0d",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "9px",
            color: "#333",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Partners
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {sponsors.map((s) => (
            <Link
              key={s._id}
              href={s.url ?? "/sponsors"}
              target={s.url ? "_blank" : undefined}
              rel={s.url ? "noopener noreferrer" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: 0.45,
                transition: "opacity 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.45";
              }}
            >
              {s.logo?.asset ? (
                <div style={{ position: "relative", height: "28px", width: "80px" }}>
                  <Image
                    src={urlFor(s.logo).height(56).auto("format").url()}
                    alt={s.name}
                    fill
                    sizes="80px"
                    style={{ objectFit: "contain", filter: "grayscale(100%) brightness(2)" }}
                  />
                </div>
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-bebas)",
                    fontSize: "16px",
                    color: "#555",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        <Link
          href="/sponsors"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "9px",
            color: "#C0392B",
            letterSpacing: "0.15em",
            textDecoration: "none",
            flexShrink: 0,
            textTransform: "uppercase",
          }}
        >
          Partner with us →
        </Link>
      </div>
    </section>
  );
}
