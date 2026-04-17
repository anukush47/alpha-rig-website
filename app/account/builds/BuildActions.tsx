"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuildActions({
  buildId,
  quoteRequested,
  buildName,
}: {
  buildId: string;
  quoteRequested: boolean;
  buildName: string;
}) {
  const [deleting, setDeleting] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [quoted, setQuoted] = useState(quoteRequested);
  const router = useRouter();

  async function deleteBuild() {
    if (deleting) return;
    if (!confirm(`Delete "${buildName}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/saved-builds/${buildId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function requestQuote() {
    if (requesting || quoted) return;
    setRequesting(true);
    try {
      const res = await fetch(`/api/saved-builds/${buildId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteRequested: true }),
      });
      if (res.ok) setQuoted(true);
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {/* Request Quote */}
      <button
        onClick={requestQuote}
        disabled={quoted || requesting}
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.05em",
          color: quoted ? "#888" : "#fff",
          background: quoted ? "rgba(255,255,255,0.04)" : "rgba(192,57,43,0.15)",
          border: quoted ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(192,57,43,0.25)",
          padding: "7px 14px",
          borderRadius: 6,
          cursor: quoted ? "default" : requesting ? "wait" : "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s ease",
        }}
      >
        {quoted ? "✓ QUOTE SENT" : requesting ? "SENDING..." : "REQUEST QUOTE"}
      </button>

      {/* Delete */}
      <button
        onClick={deleteBuild}
        disabled={deleting}
        aria-label="Delete build"
        style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(255,255,255,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: deleting ? "wait" : "pointer",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)";
          (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
        }}
      >
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  );
}
