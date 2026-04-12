"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/ui/CountdownTimer";
import EventCard from "@/components/ui/EventCard";
import { gameColor } from "@/components/ui/EventCard";
import type { EventFull } from "@/lib/queries";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

function PastCard({ event }: { event: EventFull }) {
  const accent = gameColor(event.game);
  return (
    <div
      className="relative flex flex-col justify-end overflow-hidden shrink-0"
      style={{ width: "300px", height: "200px", borderRadius: "12px", background: "linear-gradient(145deg, rgba(26,26,26,1), rgba(10,10,10,1))", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <svg aria-hidden className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`past-${event._id}`} width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke={accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#past-${event._id})`} />
      </svg>
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)" }} />

      <div className="relative z-10 flex flex-col gap-1 p-4">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: accent, opacity: 0.8 }}>
          {fmtDate(event.eventDate)}
        </span>
        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "#ffffff", lineHeight: 1, letterSpacing: "0.02em" }}>
          {event.name}
        </h4>
        {event.highlights && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1px", color: "#F39C12", marginTop: "2px" }}>
            🏆 {event.highlights.split("\n")[0].slice(0, 60)}
          </p>
        )}
        <Link
          href={`/events/${event.slug.current}`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "1px", color: "#555", textDecoration: "none", marginTop: "4px", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
        >
          View Highlights →
        </Link>
      </div>
    </div>
  );
}

export default function EventsContent({ events }: { events: EventFull[] }) {
  const upcoming = events.filter((e) => e.status !== "completed");
  const past = events.filter((e) => e.status === "completed");
  const nextEvent = upcoming[0];

  return (
    <>
      {/* ── COUNTDOWN ── */}
      {nextEvent && (
        <section className="w-full py-16" style={{ background: "#0A0A0A" }}>
          <div className="mx-auto px-6" style={{ maxWidth: "900px" }}>
            <CountdownTimer event={nextEvent} />
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS GRID ── */}
      {upcoming.length > 0 && (
        <section className="w-full py-20" style={{ background: "#0A0A0A", borderTop: "1px solid #111" }}>
          <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>// ON THE HORIZON</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 56px)", color: "#ffffff", letterSpacing: "0.02em", lineHeight: 0.95 }}>
                UPCOMING EVENTS
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {upcoming.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PAST EVENTS ── */}
      {past.length > 0 && (
        <section className="w-full py-20" style={{ background: "#080808", borderTop: "1px solid #111" }}>
          <div className="mx-auto px-6 mb-10" style={{ maxWidth: "1200px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>// BATTLE HISTORY</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 56px)", color: "#ffffff", letterSpacing: "0.02em", lineHeight: 0.95 }}>
                WAR CHRONICLES
              </h2>
            </motion.div>
          </div>

          <div className="mx-auto pl-6" style={{ maxWidth: "1200px", overflowX: "auto", paddingBottom: "16px" }}>
            <div className="flex gap-4" style={{ width: "max-content" }}>
              {past.map((event) => (
                <PastCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {upcoming.length === 0 && past.length === 0 && (
        <section className="w-full py-32 flex flex-col items-center" style={{ background: "#0A0A0A" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#222", letterSpacing: "0.06em" }}>NO EVENTS YET</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#444", marginTop: "12px" }}>Add events in the Sanity Studio to see them here.</p>
        </section>
      )}
    </>
  );
}
