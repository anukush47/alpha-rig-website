"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterStrip() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const inputRef            = useRef<HTMLInputElement>(null);
  const sectionRef          = useRef<HTMLElement>(null);
  const cursorGlowRef       = useRef<HTMLDivElement>(null);

  // ── Cursor tracking: update CSS vars on the glow overlay ─────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el   = sectionRef.current;
    const glow = cursorGlowRef.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const handleMouseLeave = () => {
    // Move glow off-screen on leave so it doesn't linger at the edge
    const glow = cursorGlowRef.current;
    if (glow) {
      glow.style.setProperty("--mx", `-600px`);
      glow.style.setProperty("--my", `-600px`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { inputRef.current?.focus(); return; }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden"
      style={{
        background: "#0A0A0A",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      {/* ── Cursor-tracking dragon-fire glow ───────────────────────────────── */}
      <div
        ref={cursorGlowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          // starts off-screen — moves to cursor on first mousemove
          ["--mx" as string]: "-600px",
          ["--my" as string]: "-600px",
          background:
            "radial-gradient(700px circle at var(--mx) var(--my), rgba(192,57,43,0.16) 0%, transparent 65%)",
        }}
      />

      {/* ── Static ambient pulse — always-on warm center ───────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 50% 60%, rgba(192,57,43,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Liquid glass card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 mx-auto flex flex-col items-center text-center gap-7"
        style={{
          maxWidth: "640px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingTop: "52px",
          paddingBottom: "52px",

          // Apple liquid glass
          backdropFilter: "blur(48px) saturate(180%)",
          WebkitBackdropFilter: "blur(48px) saturate(180%)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "28px",
          boxShadow: [
            "0 0 0 1px rgba(255,255,255,0.04) inset",
            "0 1px 0 rgba(255,255,255,0.14) inset",   // top specular highlight
            "0 -1px 0 rgba(0,0,0,0.25) inset",         // bottom shadow
            "0 24px 64px rgba(0,0,0,0.55)",             // drop shadow
            "0 0 80px rgba(192,57,43,0.08)",            // ambient red glow
          ].join(", "),
        }}
      >
        {/* Top specular streak — Apple glass "shine" */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.35) 60%, transparent)",
            borderRadius: "1px",
          }}
        />

        {/* Tag */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#C0392B",
            textTransform: "uppercase",
          }}
        >
          // STAY UPDATED
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 5vw, 52px)",
            color: "#ffffff",
            lineHeight: 0.95,
            letterSpacing: "0.03em",
          }}
        >
          STAY IN THE{" "}
          <span style={{ color: "#C0392B" }}>LOOP</span>
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "16px",
            color: "rgba(255,255,255,0.50)",
            lineHeight: 1.65,
            maxWidth: "400px",
          }}
        >
          Build drops, event registrations, and PC culture — delivered straight
          to your inbox. No spam, unsubscribe any time.
        </p>

        {/* Form / Success */}
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#C0392B",
              padding: "16px 28px",
              background: "rgba(192,57,43,0.08)",
              border: "1px solid rgba(192,57,43,0.30)",
              borderRadius: "10px",
            }}
          >
            ✓ YOU&apos;RE IN — CHECK YOUR INBOX
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full gap-3 flex-col sm:flex-row"
          >
            {/* Glass input */}
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="flex-1 outline-none min-w-0"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "#ffffff",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                padding: "14px 18px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.55)";
                (e.currentTarget as HTMLElement).style.boxShadow  =
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 3px rgba(192,57,43,0.12)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.boxShadow  =
                  "inset 0 1px 0 rgba(255,255,255,0.08)";
              }}
            />

            {/* Glass-red submit button */}
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.08em",
                color: "#ffffff",
                background:
                  status === "loading"
                    ? "rgba(139,32,32,0.80)"
                    : "rgba(192,57,43,0.90)",
                border: "1px solid rgba(255,120,100,0.25)",
                borderRadius: "10px",
                padding: "14px 28px",
                cursor: status === "loading" ? "wait" : "pointer",
                whiteSpace: "nowrap",
                boxShadow:
                  "0 2px 16px rgba(192,57,43,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                if (status === "loading") return;
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(231,76,60,0.95)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 24px rgba(192,57,43,0.60), inset 0 1px 0 rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e) => {
                if (status === "loading") return;
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(192,57,43,0.90)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 16px rgba(192,57,43,0.45), inset 0 1px 0 rgba(255,255,255,0.18)";
              }}
            >
              {status === "loading" ? "SENDING..." : "SUBSCRIBE"}
            </button>
          </form>
        )}

        {/* Privacy note */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "1.5px",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          WE RESPECT YOUR PRIVACY · NO SPAM EVER
        </p>
      </motion.div>
    </section>
  );
}
