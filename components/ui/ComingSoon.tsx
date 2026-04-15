"use client";

import { useRef, useState } from "react";

interface Props {
  tag?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  features?: string[];
}

const PAGE_CSS = `
  .cs-input:focus {
    outline: none;
    border-color: rgba(192,57,43,0.6) !important;
    background: rgba(192,57,43,0.06) !important;
  }
  .cs-btn:hover { background: #E74C3C !important; }
`;

export default function ComingSoon({
  tag = "ALPHA RIG",
  heading = "COMING",
  subheading = "SOON",
  description = "Something forge-worthy is on the way. Sign up to be first in line.",
  features = [],
}: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [message, setMessage] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    const el   = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res  = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, source: "store-coming-soon", tags: ["store"] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setMessage(
        data.status === "already_subscribed"
          ? "YOU'RE ALREADY ON THE LIST"
          : "YOU'RE ON THE LIST — WE'LL NOTIFY YOU"
      );
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("done"); // fail silently on coming soon page — don't alarm visitors
      setMessage("YOU'RE ON THE LIST — WE'LL NOTIFY YOU");
    }
  };

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100dvh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      {/* Grid background */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(192,57,43,0.04) 60px, rgba(192,57,43,0.04) 61px),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(192,57,43,0.04) 60px, rgba(192,57,43,0.04) 61px)
        `,
      }} />

      {/* Cursor glow */}
      <div ref={glowRef} aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(192,57,43,0.08), transparent 65%)",
      } as React.CSSProperties} />

      {/* Ambient centre glow */}
      <div aria-hidden style={{
        position: "absolute",
        top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "600px",
        background: "radial-gradient(ellipse, rgba(192,57,43,0.10) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "28px",
        textAlign: "center", maxWidth: "680px",
      }}>

        {/* Tag */}
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: "4px", color: "#C0392B",
          textTransform: "uppercase",
        }}>
          // {tag}
        </p>

        {/* Main heading */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(80px, 20vw, 160px)",
          color: "#ffffff",
          lineHeight: 0.88,
          letterSpacing: "0.04em",
          margin: 0,
          textShadow: "0 0 80px rgba(192,57,43,0.22)",
        }}>
          {heading}
          <br />
          <span style={{ color: "#C0392B" }}>{subheading}</span>
        </h1>

        {/* Divider */}
        <div style={{
          width: "100%", height: "1px",
          background: "linear-gradient(to right, transparent, rgba(192,57,43,0.45) 30%, rgba(192,57,43,0.45) 70%, transparent)",
        }} />

        {/* Description */}
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 400,
          fontSize: 16, color: "#555",
          lineHeight: 1.65, maxWidth: 480,
        }}>
          {description}
        </p>

        {/* Email signup */}
        {status === "done" ? (
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "2px", color: "#C0392B",
            background: "rgba(192,57,43,0.08)",
            border: "1px solid rgba(192,57,43,0.25)",
            borderRadius: 8, padding: "14px 28px",
          }}>
            ✓ {message}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex", gap: 10,
              width: "100%", maxWidth: 460,
              flexWrap: "wrap", justifyContent: "center",
            }}
          >
            <input
              className="cs-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1, minWidth: 200,
                fontFamily: "var(--font-body)", fontSize: 14,
                color: "#d8d8d8",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "13px 18px",
                transition: "border-color 0.2s, background 0.2s",
              }}
            />
            <button
              className="cs-btn"
              type="submit"
              disabled={status === "loading"}
              style={{
                fontFamily: "var(--font-rajdhani)", fontWeight: 700,
                fontSize: 13, letterSpacing: "0.08em",
                color: "#fff",
                background: status === "loading" ? "#555" : "#C0392B",
                border: "1px solid #C0392B",
                borderRadius: 8, padding: "13px 24px",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {status === "loading" ? "SENDING..." : "NOTIFY ME"}
            </button>
          </form>
        )}

        {/* Feature teasers */}
        {features.length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap",
            gap: "10px", justifyContent: "center",
            marginTop: 8,
          }}>
            {features.map(f => (
              <span key={f} style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                letterSpacing: "2px", color: "#444",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 6, padding: "6px 14px",
                textTransform: "uppercase",
              }}>
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Bottom tag */}
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          letterSpacing: "2px", color: "#2a2a2a",
          marginTop: 8,
        }}>
          ALPHA RIG · FORGE YOUR LEGEND
        </p>
      </div>
    </main>
  );
}
