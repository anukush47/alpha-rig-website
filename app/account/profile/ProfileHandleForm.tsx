"use client";

import { useState } from "react";

export default function ProfileHandleForm({
  initialHandle,
  initialBio,
  clerkUserId,
}: {
  initialHandle: string;
  initialBio: string;
  clerkUserId: string;
}) {
  const [handle, setHandle] = useState(initialHandle);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // suppress unused warning — clerkUserId used in future direct write if needed
  void clerkUserId;

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.trim(), bio: bio.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 7,
    padding: "11px 14px",
    color: "#fff",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s ease",
  };

  const labelStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: 8,
    letterSpacing: "0.18em",
    color: "#333",
    textTransform: "uppercase" as const,
    display: "block",
    marginBottom: 8,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Handle */}
      <div>
        <label style={labelStyle}>Gaming Handle</label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="e.g. xX_Dragon_Xx"
          maxLength={30}
          style={inputStyle}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(192,57,43,0.4)"; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
        />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#222", margin: "6px 0 0", letterSpacing: "0.06em" }}>
          Displayed on your Rig Identity Card · Max 30 characters
        </p>
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the Alpha Rig community about yourself..."
          maxLength={160}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(192,57,43,0.4)"; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
        />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#222", margin: "6px 0 0", letterSpacing: "0.06em" }}>
          {bio.length}/160
        </p>
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ef4444", margin: 0 }}>
          {error}
        </p>
      )}

      {/* Save button */}
      <div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.06em",
            color: saved ? "#4ade80" : "#fff",
            background: saved
              ? "rgba(74,222,128,0.1)"
              : saving
              ? "rgba(255,255,255,0.04)"
              : "rgba(192,57,43,0.15)",
            border: saved
              ? "1px solid rgba(74,222,128,0.25)"
              : "1px solid rgba(192,57,43,0.2)",
            padding: "10px 24px",
            borderRadius: 7,
            cursor: saving ? "wait" : "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {saved ? "✓ SAVED" : saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}
