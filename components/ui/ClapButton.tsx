"use client";

import { useState } from "react";

interface ClapButtonProps {
  slug: string;
  initialLikes?: number;
}

export default function ClapButton({ slug, initialLikes = 0 }: ClapButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [burst, setBurst] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // session claps from this user

  const handleClap = async () => {
    if (loading) return;

    // Optimistic update
    setLikes((n) => n + 1);
    setTotal((n) => n + 1);
    setBurst(true);
    setTimeout(() => setBurst(false), 400);

    setLoading(true);
    try {
      await fetch(`/api/blog/${slug}/clap`, { method: "POST" });
    } catch {
      // silently fail — optimistic state stays
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        userSelect: "none",
      }}
    >
      <button
        onClick={handleClap}
        aria-label={`Clap for this article — ${likes} claps`}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "52px",
          height: "52px",
          border: `2px solid ${total > 0 ? "#C0392B" : "#333"}`,
          borderRadius: "50%",
          background: total > 0 ? "#1a0a09" : "#0d0d0d",
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s, transform 0.1s",
          transform: burst ? "scale(1.2)" : "scale(1)",
          color: total > 0 ? "#C0392B" : "#666",
        }}
        onMouseEnter={(e) => {
          if (total === 0) {
            (e.currentTarget).style.borderColor = "#C0392B";
            (e.currentTarget).style.color = "#C0392B";
          }
        }}
        onMouseLeave={(e) => {
          if (total === 0) {
            (e.currentTarget).style.borderColor = "#333";
            (e.currentTarget).style.color = "#666";
          }
        }}
      >
        {/* Clap / hands icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={total > 0 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={total > 0 ? "0" : "1.5"}
        >
          <path d="M8.5 3.5c.5-.5 1.3-.5 1.8 0l.7.7-.9.9-.7-.7c-.2-.2-.2-.6 0-.8zm-2 2c.5-.5 1.3-.5 1.8 0l3.5 3.5-.9.9L7.4 6.3c-.2-.2-.2-.6 0-.8zm9.5-.5l.9.9-6 6-.9-.9 6-6zm-1.5-1.5l.9.9-6 6-.9-.9 6-6zm-7 9l-1.8-1.8c-.5-.5-.5-1.3 0-1.8s1.3-.5 1.8 0l1.8 1.8 5-5c.5-.5 1.3-.5 1.8 0s.5 1.3 0 1.8L9.7 14.8c-.8.8-1.8 1.2-2.8 1.2H5.5v1.5c0 2.2 1.8 4 4 4h3c2.2 0 4-1.8 4-4V13l-1.5-1.5-4 4z" />
        </svg>

        {/* Burst ring animation */}
        {burst && (
          <span
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              border: "2px solid #C0392B",
              animation: "clap-ring 0.4s ease-out forwards",
            }}
          />
        )}

        {/* Session count badge */}
        {total > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "#C0392B",
              color: "#fff",
              fontSize: "10px",
              fontFamily: "var(--font-space-mono)",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      <span
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "11px",
          color: total > 0 ? "#C0392B" : "#555",
          letterSpacing: "0.05em",
          transition: "color 0.2s",
        }}
      >
        {likes.toLocaleString()}
      </span>

      <style>{`
        @keyframes clap-ring {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
