import type { Metadata } from "next";
import { motion } from "framer-motion";
import Link from "next/link";
import { getAllEvents } from "@/lib/queries";
import EventsContent from "./EventsContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Esports Events | Alpha Rig",
  description: "Full-scale professional esports events by Alpha Rig. Live commentary, media coverage, and serious prize pools.",
};

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

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>
      {/* ── HERO ── */}
      <section className="relative w-full flex items-end overflow-hidden" style={{ height: "360px", paddingTop: "80px" }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${10 + i * 18}%`, width: "1px", background: "linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.12) 40%, rgba(192,57,43,0.04) 100%)", transform: "skewX(-20deg)" }} />
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(700px circle at 20% 100%, rgba(192,57,43,0.12) 0%, transparent 60%)" }} />

        <div className="relative z-10 mx-auto w-full px-6 pb-12" style={{ maxWidth: "1200px" }}>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>
            // ALPHA RIG · EVENTS
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 9vw, 80px)", color: "#ffffff", letterSpacing: "0.02em" }}>
            ESPORTS EVENTS
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ fontFamily: "var(--font-body)", fontSize: "20px", color: "#888888", marginTop: "12px" }}>
            Full-scale. Professional. Unforgettable.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }} className="flex flex-wrap gap-3 mt-5">
            {["PROFESSIONAL COMMENTARY", "LIVE MEDIA COVERAGE"].map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "2px", color: "#555", border: "1px solid #222", padding: "5px 12px", borderRadius: "4px", background: "rgba(17,17,17,0.6)" }}>
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dynamic content (countdown, events) */}
      <EventsContent events={events} />

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
    </main>
  );
}
