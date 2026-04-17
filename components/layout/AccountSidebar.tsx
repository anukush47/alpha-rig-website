"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { getForgeLevel } from "@/lib/forge";

const NAV = [
  { href: "/account",          label: "Dashboard",       icon: "⬡" },
  { href: "/account/orders",   label: "Orders",          icon: "◈" },
  { href: "/account/wishlist", label: "Wishlist",        icon: "◇" },
  { href: "/account/builds",   label: "Build Vault",     icon: "▣" },
  { href: "/account/events",   label: "Tournament Wall", icon: "◎" },
  { href: "/account/profile",  label: "Profile",         icon: "◉" },
  { href: "/account/points",   label: "Alpha Points",    icon: "✦" },
];

export default function AccountSidebar() {
  const pathname    = usePathname();
  const { user }    = useUser();
  const { signOut } = useClerk();

  const points = 0;
  const level  = getForgeLevel(points);

  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 0",
        position: "sticky",
        top: "80px",
        height: "calc(100vh - 80px)",
        overflowY: "auto",
      }}
    >
      {/* ── User identity ─────────────────────────────────────── */}
      <div style={{
        padding: "0 20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Avatar ring */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${level.color}`,
          marginBottom: 12,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={user.fullName ?? "Avatar"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              color: level.color,
              lineHeight: 1,
            }}>
              {(user?.firstName?.[0] ?? "A").toUpperCase()}
            </span>
          )}
        </div>

        {/* Name */}
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          color: "#fff",
          letterSpacing: "0.04em",
          lineHeight: 1.1,
          margin: "0 0 3px",
        }}>
          {user?.firstName ?? "Alpha"} {user?.lastName ?? ""}
        </p>

        {/* Forge level label */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.14em",
          color: level.color,
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}>
          {level.label}
        </p>

        {/* Progress bar */}
        <div style={{
          height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: 6,
        }}>
          <div style={{
            height: "100%",
            width: `${Math.round(level.progress * 100)}%`,
            background: level.color,
            borderRadius: 2,
            transition: "width 0.6s ease",
          }} />
        </div>

        {/* Points label */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "#3a3a3a",
          letterSpacing: "0.08em",
          margin: 0,
        }}>
          {points.toLocaleString("en-IN")} PTS
        </p>
      </div>

      {/* ── Nav links ─────────────────────────────────────────── */}
      <nav style={{ padding: "12px 0", flex: 1 }}>
        {NAV.map(({ href, label, icon }) => {
          const active = href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 20px",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.04em",
                color: active ? "#ffffff" : "#4a4a4a",
                background: active ? "rgba(192,57,43,0.07)" : "transparent",
                borderLeft: active ? "2px solid #c0392b" : "2px solid transparent",
                textDecoration: "none",
                transition: "color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = "#888";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.color = "#4a4a4a";
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: active ? "#c0392b" : "#333",
                transition: "color 0.15s ease",
                width: 14,
                textAlign: "center",
                flexShrink: 0,
              }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Sign out ──────────────────────────────────────────── */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          style={{
            width: "100%",
            padding: "9px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#383838",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 6,
            cursor: "pointer",
            transition: "color 0.15s ease, border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#c0392b";
            el.style.borderColor = "rgba(192,57,43,0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#383838";
            el.style.borderColor = "rgba(255,255,255,0.05)";
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
