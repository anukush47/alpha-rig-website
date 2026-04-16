"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/ui/CountdownTimer";
import EventCard from "@/components/ui/EventCard";
import { gameColor } from "@/components/ui/EventCard";
import type { EventFull } from "@/lib/queries";

function fmtDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    .toUpperCase();
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

function RegisterInterestForm() {
  const [form, setForm] = useState({ name: "", email: "", game: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          source: "events-interest",
          tags: ["events", form.game].filter(Boolean),
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ padding: "24px", border: "1px solid #C0392B", background: "#0d0d0d", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#C0392B", letterSpacing: "0.08em", margin: 0 }}>
          YOU&apos;RE ON THE LIST
        </p>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#555", margin: "6px 0 0" }}>
          We&apos;ll notify you when registration opens.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0A0A0A", border: "1px solid #1e1e1e",
    color: "#e0e0e0", padding: "10px 12px", fontFamily: "var(--font-rajdhani)",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ border: "1px solid #1e1e1e", borderTop: "3px solid #C0392B", background: "#0d0d0d", padding: "24px" }}>
      <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
        Get Notified
      </p>
      <p style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "#e0e0e0", letterSpacing: "0.06em", margin: "0 0 16px" }}>
        REGISTER YOUR INTEREST
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" value={form.name} onChange={set("name")} placeholder="Your name" style={inputStyle} />
        <input type="email" required value={form.email} onChange={set("email")} placeholder="Email address *" style={inputStyle} />
        <input type="text" value={form.game} onChange={set("game")} placeholder="Preferred game (e.g. VALORANT)" style={inputStyle} />
        {status === "error" && (
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#E74C3C", margin: 0 }}>ERROR — PLEASE TRY AGAIN</p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          style={{ background: "#C0392B", color: "#fff", border: "none", padding: "12px", fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.1em", cursor: "pointer", marginTop: "4px" }}
        >
          {status === "loading" ? "..." : "NOTIFY ME →"}
        </button>
      </form>
    </div>
  );
}

function RoleCard({ role, name, description, index }: { role: string; name: string; description: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col gap-4 p-6"
      style={{ backdropFilter: "blur(15px)", WebkitBackdropFilter: "blur(15px)", background: "rgba(17,17,17,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px" }}
    >
      <div className="flex flex-col gap-1">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "#C0392B", textTransform: "uppercase" }}>{role}</span>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "18px", color: "#ffffff" }}>{name}</p>
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#666666", lineHeight: 1.7 }}>{description}</p>
    </motion.div>
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

      {/* ── UPCOMING EVENTS ── */}
      {upcoming.length > 0 && (
        <section className="w-full py-20" style={{ background: "#0A0A0A", borderTop: "1px solid #111" }}>
          <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>// ON THE HORIZON</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 56px)", color: "#ffffff", letterSpacing: "0.02em", lineHeight: 0.95 }}>
                UPCOMING EVENTS
              </h2>
            </motion.div>
            {/* Grid + interest form sidebar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }} className="events-grid-sidebar">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2" style={{ gridColumn: undefined }}>
                {upcoming.map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} />
                ))}
              </div>
              <div className="events-interest-sidebar">
                <RegisterInterestForm />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PAST EVENTS ── */}
      {past.length > 0 && (
        <section className="w-full py-20" style={{ background: "#080808", borderTop: "1px solid #111" }}>
          <div className="mx-auto px-6 mb-10" style={{ maxWidth: "1200px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>// BATTLE HISTORY</p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 56px)", color: "#ffffff", letterSpacing: "0.02em", lineHeight: 0.95 }}>
                    WAR CHRONICLES
                  </h2>
                </div>
                <Link
                  href="/hall-of-fame"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#E8C547", textDecoration: "none", border: "1px solid rgba(232,197,71,0.3)", padding: "10px 18px", borderRadius: "4px", whiteSpace: "nowrap" }}
                >
                  🏆 HALL OF FAME →
                </Link>
              </div>
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

      {/* ── EMPTY STATE ── */}
      {upcoming.length === 0 && past.length === 0 && (
        <section className="w-full py-32 flex flex-col items-center" style={{ background: "#0A0A0A" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#222", letterSpacing: "0.06em" }}>NO EVENTS YET</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#444", marginTop: "12px" }}>Add events in the Sanity Studio to see them here.</p>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          .events-grid-sidebar { grid-template-columns: 1fr !important; }
          .events-interest-sidebar { display: none; }
        }
      `}</style>

      {/* ── TEAM SECTION ── */}
      <section className="w-full py-20" style={{ background: "#0A0A0A", borderTop: "1px solid #111" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-4">
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>// THE CREW</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 48px)", color: "#ffffff", letterSpacing: "0.02em", lineHeight: 0.95 }}>
              OUR BATTLE TEAM
            </h2>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#666", maxWidth: "560px", lineHeight: 1.7, marginBottom: "40px" }}>
            Every Alpha Rig event is run by a dedicated production team — from venue setup and bracket management to live commentary and post-event media.
          </motion.p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <RoleCard index={0} role="EVENT DIRECTOR" name="Open Position" description="Responsible for end-to-end event logistics — venue coordination, bracket management, team communications, and day-of operations. 3+ years event management experience preferred." />
            <RoleCard index={1} role="LEAD COMMENTATOR" name="Open Position" description="Voice of the event. Handles play-by-play and color commentary across all Alpha Rig broadcasts. Deep knowledge of the featured game title required. Bilingual (Hindi/English) preferred." />
            <RoleCard index={2} role="MEDIA & PRODUCTION" name="Open Position" description="Manages OBS/stream setup, graphics overlay, on-site photography, and post-event highlight reels. Handles social media rollout during and after the event." />
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="mt-10 flex justify-center">
            <Link
              href="/contact?subject=events-team"
              style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", letterSpacing: "0.06em", color: "#C0392B", padding: "13px 32px", borderRadius: "8px", border: "1px solid rgba(192,57,43,0.35)", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "#C0392B"; el.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#C0392B"; }}
            >
              JOIN THE TEAM →
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
