"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCursorGlow } from "@/lib/useCursorGlow";
import { trackEvent } from "@/lib/analytics";
import type { EventSummary } from "@/lib/queries";

// Map game name → accent color
const GAME_COLORS: Record<string, string> = {
  VALORANT: "#FF4655",
  BGMI: "#F39C12",
  CS2: "#FFAA00",
  "FREE FIRE": "#FF6B00",
  DOTA: "#C23C2A",
  "DOTA 2": "#C23C2A",
};
export function gameColor(game: string): string {
  return GAME_COLORS[game.toUpperCase().trim()] ?? "#C0392B";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtPrice(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  "registration-open": { label: "REGISTRATION OPEN", color: "#27AE60", bg: "rgba(39,174,96,0.12)" },
  "upcoming":          { label: "COMING SOON",        color: "#F39C12", bg: "rgba(243,156,18,0.12)" },
  "completed":         { label: "COMPLETED",           color: "#555555", bg: "rgba(85,85,85,0.12)"  },
  "live":              { label: "● LIVE NOW",          color: "#C0392B", bg: "rgba(192,57,43,0.12)" },
};

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function EventCard({ event, index = 0 }: { event: EventSummary; index?: number }) {
  const { hostRef, glowRef, handlers } = useCursorGlow();
  const accent = gameColor(event.game);
  const statusCfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG["upcoming"];
  const isPast = event.status === "completed";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      ref={hostRef as React.RefObject<HTMLElement>}
      {...handlers}
      className="relative flex overflow-hidden"
      style={{
        borderRadius: "14px",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(17,17,17,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`;
        handlers.onMouseMove(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        handlers.onMouseLeave();
      }}
    >
      {/* Left game-color strip */}
      <div aria-hidden className="shrink-0" style={{ width: "4px", background: accent, opacity: isPast ? 0.35 : 1 }} />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: 0, background: `radial-gradient(280px circle at var(--x,50%) var(--y,50%), ${accent}12, transparent 65%)` }}
      />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-6 flex-1">
        {/* Game badge + status */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: accent, opacity: isPast ? 0.5 : 1 }}>
            {event.game}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1.5px", color: statusCfg.color, background: statusCfg.bg, padding: "3px 10px", borderRadius: "4px" }}>
            {statusCfg.label}
          </span>
        </div>

        {/* Event name */}
        <h3 className="leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.5vw, 32px)", color: isPast ? "#666666" : "#ffffff", letterSpacing: "0.02em" }}>
          {event.name}
        </h3>

        {/* Date + venue */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#666666" }}>
            <CalendarIcon />
            <span>{fmtDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#666666" }}>
            <LocationIcon />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Prize pool */}
        {event.prizePool > 0 && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "1.5px", color: isPast ? "#555" : "#C0392B" }}>
            PRIZE POOL: {fmtPrice(event.prizePool)}
          </p>
        )}

        {/* CTA */}
        <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {isPast ? (
            <Link
              href={`/events/${event.slug.current}`}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "1px", color: "#555555", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888888")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555555")}
            >
              View Highlights →
            </Link>
          ) : (
            <Link
              href={`/events/${event.slug.current}`}
              className="inline-flex items-center gap-2"
              style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "13px", letterSpacing: "0.06em", color: "#ffffff", background: "#C0392B", padding: "10px 20px", borderRadius: "7px", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#E74C3C")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#C0392B")}
              onClick={() => trackEvent("click", "Events", "register_click")}
            >
              Register →
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
