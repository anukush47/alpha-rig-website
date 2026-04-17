"use client";

import Link from "next/link";

const CARDS = [
  { label: "Orders",       icon: "◈", href: "/account/orders",  value: "—", desc: "Purchase history" },
  { label: "Wishlist",     icon: "◇", href: "/account/wishlist", value: "—", desc: "Saved products" },
  { label: "Build Vault",  icon: "▣", href: "/account/builds",  value: "—", desc: "Saved configurations" },
  { label: "Alpha Points", icon: "✦", href: "/account/points",  value: "0",  desc: "Loyalty balance" },
];

export default function DashboardCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: 1,
      background: "rgba(255,255,255,0.03)",
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.04)",
      marginBottom: 40,
    }}>
      {CARDS.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: "26px 22px",
            background: "#0a0a0a",
            textDecoration: "none",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#0f0f0f";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#0a0a0a";
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#c0392b",
            lineHeight: 1,
            marginBottom: 4,
          }}>
            {card.icon}
          </span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 38,
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}>
            {card.value}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "#c0392b",
            textTransform: "uppercase",
          }}>
            {card.label}
          </span>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "#333",
            marginTop: 2,
          }}>
            {card.desc}
          </span>
        </Link>
      ))}
    </div>
  );
}
