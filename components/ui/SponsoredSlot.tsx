import { getAdSlot } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import AdUnit from "./AdUnit";

// Positions mapped to AdSense slot IDs — fill in NEXT_PUBLIC_ADSENSE_SLOT_* env vars
const ADSENSE_SLOTS: Record<string, string> = {
  "blog-after-intro": process.env.NEXT_PUBLIC_ADSENSE_SLOT_AFTER_INTRO ?? "",
  "blog-mid":         process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID         ?? "",
  "blog-end":         process.env.NEXT_PUBLIC_ADSENSE_SLOT_END         ?? "",
  "sidebar-trending": process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR     ?? "",
};

interface SponsoredSlotProps {
  position: "blog-after-intro" | "blog-mid" | "blog-end" | "sidebar-trending";
}

function isExpired(endDate?: string): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date(new Date().toDateString());
}

export default async function SponsoredSlot({ position }: SponsoredSlotProps) {
  const slot = await getAdSlot(position);
  const adsenseSlotId = ADSENSE_SLOTS[position];

  // ── No active Sanity slot → fall back to AdSense (or render nothing) ──────
  if (!slot || isExpired(slot.endDate)) {
    if (!adsenseSlotId) return null;
    return (
      <div style={{ margin: "32px 0" }}>
        <AdUnit slot={adsenseSlotId} />
      </div>
    );
  }

  // ── Custom HTML override ───────────────────────────────────────────────────
  if (slot.customHtml) {
    return (
      <div style={{ margin: "32px 0" }}>
        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "8px",
            color: "#2a2a2a",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          Sponsored
        </p>
        {/* customHtml comes from Sanity Studio (trusted editorial input only) */}
        <div dangerouslySetInnerHTML={{ __html: slot.customHtml }} />
      </div>
    );
  }

  // ── Branded creative card ─────────────────────────────────────────────────
  const isSidebar = position === "sidebar-trending";

  return (
    <div
      style={{
        margin: isSidebar ? "0" : "36px 0",
        border: "1px solid #1e1e1e",
        background: "#0d0d0d",
        padding: isSidebar ? "20px" : "28px 32px",
        position: "relative",
        display: "flex",
        flexDirection: isSidebar ? "column" : "row",
        gap: isSidebar ? "12px" : "24px",
        alignItems: isSidebar ? "flex-start" : "center",
      }}
    >
      {/* "Sponsored" label */}
      <span
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          fontFamily: "var(--font-space-mono)",
          fontSize: "7px",
          color: "#333",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Sponsored
      </span>

      {/* Logo */}
      {slot.sponsorLogo?.asset && (
        <div
          style={{
            flexShrink: 0,
            position: "relative",
            width: isSidebar ? "60px" : "80px",
            height: isSidebar ? "36px" : "44px",
          }}
        >
          <Image
            src={urlFor(slot.sponsorLogo).height(88).auto("format").url()}
            alt={slot.sponsorName ?? "Sponsor"}
            fill
            sizes={isSidebar ? "60px" : "80px"}
            style={{ objectFit: "contain" }}
          />
        </div>
      )}

      {/* Copy */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {slot.sponsorName && (
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "9px",
              color: "#555",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: "0 0 6px",
            }}
          >
            Presented by {slot.sponsorName}
          </p>
        )}

        {slot.headline && (
          <p
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: isSidebar ? "18px" : "22px",
              color: "#e0e0e0",
              letterSpacing: "0.04em",
              margin: "0 0 6px",
              lineHeight: 1.1,
            }}
          >
            {slot.headline}
          </p>
        )}

        {slot.body && (
          <p
            style={{
              fontFamily: "var(--font-rajdhani)",
              fontSize: isSidebar ? "13px" : "14px",
              color: "#666",
              margin: "0 0 12px",
              lineHeight: 1.55,
            }}
          >
            {slot.body}
          </p>
        )}

        {slot.ctaUrl && (
          <a
            href={slot.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-bebas)",
              fontSize: "13px",
              letterSpacing: "0.12em",
              color: "#fff",
              background: "#C0392B",
              padding: "8px 18px",
              textDecoration: "none",
              borderRadius: "3px",
            }}
          >
            {slot.ctaLabel ?? "Learn More"}
          </a>
        )}
      </div>
    </div>
  );
}
