"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface RigIdentityCardProps {
  displayName: string;
  level: "RECRUIT" | "SOLDIER" | "VETERAN" | "LEGEND" | "ALPHA";
  levelColor: string;
  totalPoints: number;
  avatarUrl?: string | null;
  ledgerCount?: number;
}

export default function RigIdentityCard({
  displayName,
  level,
  levelColor,
  totalPoints,
  avatarUrl,
  ledgerCount = 0,
}: RigIdentityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function downloadCard() {
    if (downloading || !cardRef.current) return;
    setDownloading(true);
    try {
      // Dynamically import html2canvas only when needed
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `alpharig-${displayName.toLowerCase().replace(/\s+/g, "-")}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to download card:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      {/* Card */}
      <div
        ref={cardRef}
        style={{
          width: "min(480px, 100%)",
          background: "linear-gradient(135deg, #111111 0%, #0a0a0a 50%, #0f0b0b 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "monospace", // fallback — html2canvas can't use CSS vars
        }}
      >
        {/* Background grid */}
        <svg
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}
        >
          <defs>
            <pattern id="card-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C0392B" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-grid)" />
        </svg>

        {/* Level glow */}
        <div aria-hidden style={{
          position: "absolute",
          bottom: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${levelColor}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Top row: logo + site */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Crosshair logo mark */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={levelColor} strokeWidth="1.5">
              <circle cx="12" cy="12" r="7" />
              <line x1="12" y1="1" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="1" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="23" y2="12" />
            </svg>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.2em", color: "#c0392b", margin: 0, textTransform: "uppercase" }}>
                // ALPHA RIG
              </p>
              <p style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.14em", color: "#444", margin: 0 }}>
                PRIVATE LIMITED
              </p>
            </div>
          </div>

          <span style={{
            fontFamily: "monospace",
            fontSize: 7,
            letterSpacing: "0.12em",
            color: "#222",
          }}>
            alpharig.in
          </span>
        </div>

        {/* Avatar + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24, position: "relative" }}>
          {/* Avatar */}
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: `2px solid ${levelColor}50`,
            overflow: "hidden",
            background: "#1a1a1a",
            flexShrink: 0,
            position: "relative",
          }}>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                sizes="60px"
                style={{ objectFit: "cover" }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, #1a1a1a, ${levelColor}20)`,
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 22, color: levelColor, lineHeight: 1 }}>◉</span>
              </div>
            )}
          </div>

          {/* Name + level */}
          <div>
            <h2 style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 6px",
              letterSpacing: "0.06em",
              lineHeight: 1,
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}>
              {displayName}
            </h2>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: `${levelColor}12`,
              border: `1px solid ${levelColor}30`,
              borderRadius: 4,
              padding: "4px 10px",
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: levelColor,
                flexShrink: 0,
                display: "inline-block",
              }} />
              <span style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                color: levelColor,
                textTransform: "uppercase",
              }}>
                FORGE LEVEL: {level}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0) 100%)",
          marginBottom: 20,
          position: "relative",
        }} />

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
        }}>
          {[
            { label: "ALPHA POINTS", value: totalPoints.toLocaleString("en-IN"), icon: "✦" },
            { label: "ACTIVITIES", value: ledgerCount.toString(), icon: "◈" },
            { label: "RANK", value: level, icon: "⬡" },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: "14px 10px",
              background: "#0d0d0d",
              textAlign: "center",
            }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: levelColor, margin: "0 0 4px", lineHeight: 1 }}>
                {stat.icon}
              </p>
              <p style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 3px", lineHeight: 1, letterSpacing: "0.04em" }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.14em", color: "#2a2a2a", margin: 0, textTransform: "uppercase" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Download button (outside the card, not captured) */}
      <button
        onClick={downloadCard}
        disabled={downloading}
        style={{
          marginTop: 16,
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.06em",
          color: downloading ? "#444" : "#fff",
          background: downloading ? "rgba(255,255,255,0.04)" : "rgba(192,57,43,0.15)",
          border: "1px solid rgba(192,57,43,0.2)",
          padding: "10px 22px",
          borderRadius: 7,
          cursor: downloading ? "wait" : "pointer",
          transition: "all 0.15s ease",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloading ? "EXPORTING..." : "DOWNLOAD CARD"}
      </button>
    </div>
  );
}
