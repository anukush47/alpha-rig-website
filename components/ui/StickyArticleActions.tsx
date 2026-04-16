"use client";

import { useState, useCallback } from "react";

interface Props {
  title: string;
  slug: string;
  initialLikes?: number;
  url?: string;
}

export default function StickyArticleActions({ title, slug, initialLikes = 0, url }: Props) {
  const [likes, setLikes]   = useState(initialLikes);
  const [clapped, setClapped] = useState(0);   // session claps
  const [burst, setBurst]   = useState(false);
  const [copied, setCopied] = useState(false);
  const [clapLoading, setClapLoading] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const enc      = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(title);

  // ── Clap ──────────────────────────────────────────────────────────────────
  const handleClap = useCallback(async () => {
    if (clapLoading) return;
    setLikes((n) => n + 1);
    setClapped((n) => n + 1);
    setBurst(true);
    setTimeout(() => setBurst(false), 420);
    setClapLoading(true);
    try {
      await fetch(`/api/blog/${slug}/clap`, { method: "POST" });
    } catch { /* optimistic — silent fail */ }
    finally { setClapLoading(false); }
  }, [slug, clapLoading]);

  // ── Copy link ─────────────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(shareUrl); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  // ── Shared icon style ─────────────────────────────────────────────────────
  const iconBtn = (active = false): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    border: `1px solid ${active ? "#C0392B" : "#222"}`,
    background: active ? "#1a0a09" : "#111",
    color: active ? "#C0392B" : "#777",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
    textDecoration: "none",
    flexShrink: 0,
  });

  const socialLinks = [
    {
      label: "Share on X",
      href: `https://x.com/intent/tweet?text=${encTitle}&url=${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encTitle}%20${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ── DESKTOP: sticky left column ────────────────────────────────────── */}
      <div
        className="sticky-actions-desktop"
        style={{
          position: "sticky",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "44px",
          alignSelf: "flex-start",
          marginTop: "-22px",
        }}
      >
        {/* Label */}
        <span style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "8px",
          color: "#444",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          marginBottom: "4px",
        }}>
          Share
        </span>

        {/* Social links */}
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            style={iconBtn()}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "#C0392B";
              el.style.color = "#C0392B";
              el.style.background = "#1a0a09";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "#222";
              el.style.color = "#777";
              el.style.background = "#111";
            }}
          >
            {link.icon}
          </a>
        ))}

        {/* Copy */}
        <button onClick={handleCopy} aria-label="Copy link" style={iconBtn(copied)}>
          {copied
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
          }
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "24px", background: "#1e1e1e", margin: "4px 0" }} />

        {/* Clap button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", position: "relative" }}>
          <button
            onClick={handleClap}
            aria-label={`Clap — ${likes} claps`}
            style={{
              ...iconBtn(clapped > 0),
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              position: "relative",
              transform: burst ? "scale(1.22)" : "scale(1)",
              transition: "transform 0.15s, border-color 0.15s, color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (clapped === 0) {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "#C0392B";
                el.style.color = "#C0392B";
                el.style.background = "#1a0a09";
              }
            }}
            onMouseLeave={(e) => {
              if (clapped === 0) {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "#222";
                el.style.color = "#777";
                el.style.background = "#111";
              }
            }}
          >
            {/* Burst ring */}
            {burst && (
              <span style={{
                position: "absolute", inset: "-4px", borderRadius: "50%",
                border: "2px solid #C0392B",
                animation: "clap-ring 0.42s ease-out forwards",
                pointerEvents: "none",
              }} />
            )}
            {/* Session badge */}
            {clapped > 0 && (
              <span style={{
                position: "absolute", top: "-7px", right: "-7px",
                background: "#C0392B", color: "#fff",
                fontSize: "9px", fontFamily: "var(--font-space-mono)",
                width: "16px", height: "16px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, lineHeight: 1,
              }}>
                {clapped > 9 ? "9+" : clapped}
              </span>
            )}
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={clapped > 0 ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth={clapped > 0 ? "0" : "1.5"}
            >
              <path d="M8.5 3.5c.5-.5 1.3-.5 1.8 0l.7.7-.9.9-.7-.7c-.2-.2-.2-.6 0-.8zm-2 2c.5-.5 1.3-.5 1.8 0l3.5 3.5-.9.9L7.4 6.3c-.2-.2-.2-.6 0-.8zm9.5-.5l.9.9-6 6-.9-.9 6-6zm-1.5-1.5l.9.9-6 6-.9-.9 6-6zm-7 9l-1.8-1.8c-.5-.5-.5-1.3 0-1.8s1.3-.5 1.8 0l1.8 1.8 5-5c.5-.5 1.3-.5 1.8 0s.5 1.3 0 1.8L9.7 14.8c-.8.8-1.8 1.2-2.8 1.2H5.5v1.5c0 2.2 1.8 4 4 4h3c2.2 0 4-1.8 4-4V13l-1.5-1.5-4 4z" />
            </svg>
          </button>

          {/* Like count */}
          <span style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "9px",
            color: clapped > 0 ? "#C0392B" : "#444",
            transition: "color 0.2s",
            letterSpacing: "0.02em",
          }}>
            {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
          </span>
        </div>
      </div>

      {/* ── MOBILE: fixed bottom bar ───────────────────────────────────────── */}
      <div
        className="sticky-actions-mobile"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9990,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid #1e1e1e",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 20px",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Clap — prominent on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "8px" }}>
          <button
            onClick={handleClap}
            aria-label={`Clap — ${likes}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: `2px solid ${clapped > 0 ? "#C0392B" : "#2a2a2a"}`,
              background: clapped > 0 ? "#1a0a09" : "#111",
              color: clapped > 0 ? "#C0392B" : "#666",
              cursor: "pointer",
              position: "relative",
              transform: burst ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.15s, border-color 0.2s",
            }}
          >
            {burst && (
              <span style={{
                position: "absolute", inset: "-4px", borderRadius: "50%",
                border: "2px solid #C0392B",
                animation: "clap-ring 0.42s ease-out forwards",
                pointerEvents: "none",
              }} />
            )}
            {clapped > 0 && (
              <span style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "#C0392B", color: "#fff",
                fontSize: "9px", fontFamily: "var(--font-space-mono)",
                width: "15px", height: "15px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700,
              }}>
                {clapped > 9 ? "9+" : clapped}
              </span>
            )}
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={clapped > 0 ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth={clapped > 0 ? "0" : "1.5"}
            >
              <path d="M8.5 3.5c.5-.5 1.3-.5 1.8 0l.7.7-.9.9-.7-.7c-.2-.2-.2-.6 0-.8zm-2 2c.5-.5 1.3-.5 1.8 0l3.5 3.5-.9.9L7.4 6.3c-.2-.2-.2-.6 0-.8zm9.5-.5l.9.9-6 6-.9-.9 6-6zm-1.5-1.5l.9.9-6 6-.9-.9 6-6zm-7 9l-1.8-1.8c-.5-.5-.5-1.3 0-1.8s1.3-.5 1.8 0l1.8 1.8 5-5c.5-.5 1.3-.5 1.8 0s.5 1.3 0 1.8L9.7 14.8c-.8.8-1.8 1.2-2.8 1.2H5.5v1.5c0 2.2 1.8 4 4 4h3c2.2 0 4-1.8 4-4V13l-1.5-1.5-4 4z" />
            </svg>
          </button>
          <span style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "11px",
            color: clapped > 0 ? "#C0392B" : "#555",
            minWidth: "28px",
          }}>
            {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "#1e1e1e" }} />

        {/* Share links */}
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "40px", height: "40px",
              color: "#666", textDecoration: "none",
            }}
          >
            {link.icon}
          </a>
        ))}

        {/* Copy */}
        <button onClick={handleCopy} aria-label="Copy link" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "40px", height: "40px",
          background: "none", border: "none",
          color: copied ? "#C0392B" : "#666", cursor: "pointer",
        }}>
          {copied
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
          }
        </button>
      </div>

      <style>{`
        @keyframes clap-ring {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.6); }
        }
        @media (max-width: 1024px) {
          .sticky-actions-desktop { display: none !important; }
          .sticky-actions-mobile  { display: flex !important; }
        }
        /* Push page content up so mobile bar doesn't cover the bottom */
        @media (max-width: 1024px) {
          main { padding-bottom: 72px; }
        }
      `}</style>
    </>
  );
}
