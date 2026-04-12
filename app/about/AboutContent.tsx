"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCursorGlow } from "@/lib/useCursorGlow";

// ─── Shared fade-up helper ────────────────────────────────────────────────────
function fu(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: "easeOut" as const },
  };
}

// ─── Value card ───────────────────────────────────────────────────────────────
function ValueCard({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  const { hostRef, glowRef, handlers } = useCursorGlow();
  return (
    <motion.div
      {...fu(index * 0.12)}
      ref={hostRef as React.RefObject<HTMLDivElement>}
      {...handlers}
      className="relative flex flex-col gap-4 p-6 overflow-hidden"
      style={{
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(17,17,17,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        transition: "border-color 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(192,57,43,0.25)";
        handlers.onMouseMove(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.06)";
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
            "radial-gradient(240px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.09), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="w-8 h-px"
        style={{ background: "#C0392B" }}
      />
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "28px",
          color: "#ffffff",
          letterSpacing: "0.03em",
          position: "relative",
          zIndex: 1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "#777777",
          lineHeight: 1.7,
          position: "relative",
          zIndex: 1,
        }}
      >
        {body}
      </p>
    </motion.div>
  );
}

// ─── Vertical tile ────────────────────────────────────────────────────────────
function VerticalTile({
  label,
  tag,
  href,
  index,
}: {
  label: string;
  tag: string;
  href: string;
  index: number;
}) {
  return (
    <motion.div {...fu(index * 0.1)}>
      <Link
        href={href}
        className="flex flex-col gap-3 p-5 group"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(17,17,17,0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "12px",
          textDecoration: "none",
          transition: "border-color 0.2s, background 0.2s",
          display: "block",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(192,57,43,0.35)";
          el.style.background = "rgba(26,10,10,0.6)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,255,255,0.05)";
          el.style.background = "rgba(17,17,17,0.6)";
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "3px",
            color: "#C0392B",
          }}
        >
          {tag}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            color: "#ffffff",
            letterSpacing: "0.03em",
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "1px",
            color: "#444",
            marginTop: "4px",
          }}
        >
          EXPLORE →
        </span>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutContent() {
  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>

      {/* ── HERO ── */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "340px", paddingTop: "80px" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px circle at 60% 110%, rgba(192,57,43,0.1) 0%, transparent 60%)",
          }}
        />
        {/* Subtle vertical lines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[15, 40, 65, 85].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${x}%`,
                width: "1px",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.08) 60%, transparent 100%)",
              }}
            />
          ))}
        </div>

        <div
          className="relative z-10 mx-auto w-full px-6 pb-12"
          style={{ maxWidth: "1200px" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
              marginBottom: "12px",
            }}
          >
            // ALPHA RIG · WHO WE ARE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(52px, 9vw, 80px)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            OUR STORY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "#888",
              marginTop: "12px",
            }}
          >
            Built from scratch. Rooted in Durg. Reaching everywhere.
          </motion.p>
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section className="w-full py-24" style={{ background: "#0A0A0A" }}>
        <div
          className="mx-auto px-6 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
          style={{ maxWidth: "1200px" }}
        >
          {/* LEFT — text */}
          <div className="flex flex-col gap-7">
            <motion.p {...fu(0)} style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
            }}>
              // FOUNDER &amp; DIRECTOR
            </motion.p>

            <motion.h2 {...fu(0.1)} className="leading-none" style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 48px)",
              color: "#ffffff",
              letterSpacing: "0.03em",
            }}>
              ANUPAM KUSHWAHA
            </motion.h2>

            {/* Timeline pill */}
            <motion.div {...fu(0.18)} className="flex items-center gap-3">
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#C0392B",
                background: "rgba(192,57,43,0.1)",
                border: "1px solid rgba(192,57,43,0.2)",
                padding: "4px 12px",
                borderRadius: "4px",
              }}>
                FOUNDED 2022
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#333",
                border: "1px solid #1E1E1E",
                padding: "4px 12px",
                borderRadius: "4px",
              }}>
                DURG, CG
              </span>
            </motion.div>

            {/* Story paragraphs */}
            {[
              "Alpha Rig started in 2022 with one desk, one soldering iron, and a genuine frustration — Chhattisgarh had no serious custom PC culture to speak of. Anupam Kushwaha had spent years watching enthusiasts in his city overpay for mediocre builds or settle for off-the-shelf machines that never matched their vision.",
              "So he built one. Then another. Word spread the way it does in a tight-knit city — person to person, over chai and benchmark scores. By mid-2022, Alpha Rig had its first real workshop and a waitlist. Not because of ads or influencers, but because the machines genuinely performed.",
              "The mission has never changed: bring world-class PC culture to the heart of India. Not just builds — events, content, community, honest reviews, and a space where hardware obsession is understood and respected. Alpha Rig is still growing, still bootstrapped, and still built entirely from Durg.",
            ].map((para, i) => (
              <motion.p key={i} {...fu(0.26 + i * 0.1)} style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                color: "#777777",
                lineHeight: 1.8,
              }}>
                {para}
              </motion.p>
            ))}
          </div>

          {/* RIGHT — image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              height: "460px",
              borderRadius: "16px",
              background: "linear-gradient(145deg, rgba(26,26,26,1), rgba(10,10,10,1))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Grid */}
            <svg aria-hidden className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="founder-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C0392B" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#founder-grid)" />
            </svg>
            {/* Corner accents */}
            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} w-8 h-8`}
                style={{ border: "1px solid rgba(192,57,43,0.25)", borderRadius: "2px" }}
              />
            ))}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div style={{
                width: "56px",
                height: "56px",
                border: "1px solid #2A2A2A",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#3A3A3A" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3A3A3A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "3px",
                color: "#2A2A2A",
              }}>
                FOUNDER PHOTO
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION / VALUES ── */}
      <section className="w-full py-20" style={{ background: "#080808", borderTop: "1px solid #111" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <motion.div {...fu(0)} className="text-center mb-14">
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
              marginBottom: "14px",
            }}>
              // WHAT DRIVES US
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 56px)",
              color: "#ffffff",
              letterSpacing: "0.02em",
              lineHeight: 0.95,
            }}>
              WHY WE EXIST
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <ValueCard
              index={0}
              title="NO FAKE BUILDS"
              body="Every machine we build is real, bench-tested, and fully documented before handover. No inflated part costs, no hidden margins, no shortcuts. You see exactly what goes in and why."
            />
            <ValueCard
              index={1}
              title="COMMUNITY FIRST"
              body="Free build advice, honest GPU reviews, real esports events open to anyone. We exist to grow a culture, not just close sales. The community made Alpha Rig — everything we do is for them."
            />
            <ValueCard
              index={2}
              title="INDIA'S PC CULTURE"
              body="Born in Durg, Chhattisgarh. We believe world-class hardware culture belongs everywhere — not just metros. We're building a scene that every city in India can eventually call its own."
            />
          </div>
        </div>
      </section>

      {/* ── VERTICALS RECAP ── */}
      <section className="w-full py-20" style={{ background: "#0A0A0A", borderTop: "1px solid #111" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <motion.div {...fu(0)} className="mb-12">
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "4px",
              color: "#C0392B",
              marginBottom: "12px",
            }}>
              // WHAT WE DO
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 48px)",
              color: "#ffffff",
              letterSpacing: "0.02em",
              lineHeight: 0.95,
            }}>
              THE RIG UNIVERSE
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <VerticalTile index={0} label="BUILDS" tag="// HARDWARE" href="/builds" />
            <VerticalTile index={1} label="EVENTS" tag="// ESPORTS" href="/events" />
            <VerticalTile index={2} label="BLOG" tag="// CONTENT" href="/blog" />
            <VerticalTile index={3} label="STORE" tag="// SHOP" href="/store" />
          </div>
        </div>
      </section>

      {/* ── JOIN THE RIG ── */}
      <section className="w-full py-20" style={{ background: "#111111", borderTop: "1px solid #1A1A1A" }}>
        <div className="mx-auto px-6 flex flex-col items-center text-center gap-6" style={{ maxWidth: "680px" }}>
          <motion.p {...fu(0)} style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#C0392B",
          }}>
            // LET&apos;S BUILD TOGETHER
          </motion.p>
          <motion.h2 {...fu(0.1)} className="leading-none" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 6vw, 56px)",
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}>
            JOIN THE RIG
          </motion.h2>
          <motion.p {...fu(0.2)} style={{
            fontFamily: "var(--font-body)",
            fontSize: "17px",
            color: "#777",
            lineHeight: 1.7,
          }}>
            Whether you want a custom build, a partnership, a collab, or just want to
            talk hardware — we're always reachable. No automated replies.
            Real humans who care about this stuff.
          </motion.p>

          <motion.div {...fu(0.3)} className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.07em",
                color: "#ffffff",
                background: "#C0392B",
                padding: "14px 32px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#E74C3C")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#C0392B")
              }
            >
              CONTACT US →
            </Link>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com/alpharig", icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )},
                { label: "YouTube", href: "https://youtube.com/@alpharig", icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )},
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center transition-colors duration-200"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#555",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#C0392B";
                    el.style.borderColor = "rgba(192,57,43,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#555";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
