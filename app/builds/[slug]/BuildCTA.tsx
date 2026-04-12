"use client";

import Link from "next/link";
import { useCursorGlow } from "@/lib/useCursorGlow";

export function BuildCTA({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const { hostRef, glowRef, handlers } = useCursorGlow<HTMLAnchorElement>();

  const style: React.CSSProperties =
    variant === "primary"
      ? { background: "#C0392B", color: "#ffffff", border: "1px solid #C0392B" }
      : {
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(10,10,10,0.4)",
          color: "#888888",
          border: "1px solid rgba(192,57,43,0.25)",
        };

  return (
    <Link
      href={href}
      ref={hostRef}
      {...handlers}
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{
        ...style,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: "14px",
        letterSpacing: "0.06em",
        padding: "14px 28px",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "all 0.2s ease",
        flex: "1 1 0",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        if (variant === "primary")
          (e.currentTarget as HTMLElement).style.background = "#E74C3C";
        else {
          (e.currentTarget as HTMLElement).style.color = "#ffffff";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.5)";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary")
          (e.currentTarget as HTMLElement).style.background = "#C0392B";
        else {
          (e.currentTarget as HTMLElement).style.color = "#888888";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.25)";
        }
        handlers.onMouseLeave();
      }}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 0,
          background:
            variant === "primary"
              ? "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.15), transparent 80%)"
              : "radial-gradient(80px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.2), transparent 80%)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Link>
  );
}
