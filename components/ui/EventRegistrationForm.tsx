"use client";

import { useState } from "react";

interface EventRegistrationFormProps {
  eventId: string;
  eventName: string;
  game: string;
  maxTeams?: number;
}

export default function EventRegistrationForm({
  eventId,
  eventName,
  game,
  maxTeams,
}: EventRegistrationFormProps) {
  const [form, setForm] = useState({
    teamName: "",
    captainName: "",
    email: "",
    gameId: "",
    teamSize: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teamName || !form.email || !form.gameId) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); return; }
      setStatus(data.status === "already_registered" ? "duplicate" : "success");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0A0A0A",
    border: "1px solid #1e1e1e",
    color: "#e0e0e0",
    padding: "11px 14px",
    fontFamily: "var(--font-rajdhani)",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-space-mono)",
    fontSize: "9px",
    color: "#555",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    marginBottom: "6px",
  };

  if (status === "success") {
    return (
      <div style={{ padding: "32px", border: "1px solid #C0392B", background: "#0d0d0d", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "28px", color: "#C0392B", letterSpacing: "0.08em", margin: "0 0 8px" }}>
          REGISTRATION RECEIVED
        </p>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#666", margin: 0 }}>
          We&apos;ll confirm your slot via email within 24 hours. See you in the arena.
        </p>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div style={{ padding: "32px", border: "1px solid #333", background: "#0d0d0d", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", color: "#888", letterSpacing: "0.08em", margin: "0 0 8px" }}>
          ALREADY REGISTERED
        </p>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#555", margin: 0 }}>
          This email is already signed up for {eventName}.
        </p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #1e1e1e", borderTop: "3px solid #C0392B", background: "#0d0d0d", padding: "32px" }}>
      <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#C0392B", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
        Registration Open
      </p>
      <p style={{ fontFamily: "var(--font-bebas)", fontSize: "26px", color: "#fff", letterSpacing: "0.06em", margin: "0 0 4px" }}>
        REGISTER FOR {game.toUpperCase()}
      </p>
      {maxTeams && (
        <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#555", margin: "0 0 24px" }}>
          Limited to {maxTeams} teams / players
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Team / Player Name *</label>
            <input type="text" required value={form.teamName} onChange={set("teamName")} placeholder="Team Alpha" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Captain Name</label>
            <input type="text" value={form.captainName} onChange={set("captainName")} placeholder="Full name" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address *</label>
          <input type="email" required value={form.email} onChange={set("email")} placeholder="captain@email.com" style={inputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>In-Game ID / Username *</label>
            <input type="text" required value={form.gameId} onChange={set("gameId")} placeholder="#TAG or username" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Team Size</label>
            <input type="number" min={1} max={10} value={form.teamSize} onChange={set("teamSize")} placeholder="e.g. 5" style={inputStyle} />
          </div>
        </div>

        {status === "error" && (
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#E74C3C", margin: 0 }}>
            SOMETHING WENT WRONG — PLEASE TRY AGAIN
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background: status === "loading" ? "#6b1a13" : "#C0392B",
            color: "#fff",
            border: "none",
            padding: "14px",
            fontFamily: "var(--font-bebas)",
            fontSize: "18px",
            letterSpacing: "0.12em",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            width: "100%",
          }}
        >
          {status === "loading" ? "REGISTERING..." : "REGISTER NOW →"}
        </button>
      </form>
    </div>
  );
}
