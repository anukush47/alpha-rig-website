"use client";

import { useState } from "react";

interface PartnershipFormProps {
  type: "advertise" | "sponsor";
  budgetOptions?: string[];
}

const DEFAULT_BUDGET_OPTIONS = [
  "Under ₹10,000 / month",
  "₹10,000 – ₹25,000 / month",
  "₹25,000 – ₹50,000 / month",
  "₹50,000 – ₹1,00,000 / month",
  "Above ₹1,00,000 / month",
  "Let's discuss",
];

export default function PartnershipForm({ type, budgetOptions }: PartnershipFormProps) {
  const [form, setForm] = useState({ name: "", company: "", email: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const budgets = budgetOptions ?? DEFAULT_BUDGET_OPTIONS;

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/partnership-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        style={{
          padding: "48px 40px",
          border: "1px solid #C0392B",
          background: "#0d0d0d",
          textAlign: "center",
        }}
      >
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "32px", color: "#C0392B", letterSpacing: "0.08em", margin: "0 0 12px" }}>
          WE&apos;LL BE IN TOUCH
        </p>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "16px", color: "#666", margin: 0 }}>
          Your inquiry has been received. Expect a reply within 48 hours.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0A0A0A",
    border: "1px solid #1e1e1e",
    color: "#e0e0e0",
    padding: "12px 16px",
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

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <label style={labelStyle}>Your Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Full name"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Company / Brand</label>
          <input
            type="text"
            value={form.company}
            onChange={set("company")}
            placeholder="Brand or company name"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Email Address *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={set("email")}
          placeholder="work@yourbrand.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Estimated Monthly Budget</label>
        <select
          value={form.budget}
          onChange={set("budget")}
          style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
        >
          <option value="">— Select a range —</option>
          {budgets.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder={
            type === "advertise"
              ? "Tell us about your campaign — goals, target audience, preferred ad formats..."
              : "Tell us about your brand, what partnership tier interests you, campaign goals..."
          }
          style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
        />
      </div>

      {status === "error" && (
        <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", color: "#E74C3C", margin: 0 }}>
          SOMETHING WENT WRONG — PLEASE TRY AGAIN OR EMAIL US DIRECTLY
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          background: status === "loading" ? "#6b1a13" : "#C0392B",
          color: "#fff",
          border: "none",
          padding: "14px 32px",
          fontFamily: "var(--font-bebas)",
          fontSize: "18px",
          letterSpacing: "0.12em",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          alignSelf: "flex-start",
        }}
      >
        {status === "loading" ? "SENDING..." : "SEND INQUIRY"}
      </button>
    </form>
  );
}
