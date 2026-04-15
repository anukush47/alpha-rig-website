"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    Razorpay: new (options: RzpOptions) => { open: () => void };
  }
}
interface RzpOptions {
  key: string; amount: number; currency: string; name: string;
  description: string; order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (r: { razorpay_payment_id: string; razorpay_order_id: string }) => void;
  modal: { ondismiss: () => void };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const USE_CASES = [
  { id: "gaming",     label: "Gaming",            icon: "🎮", desc: "High FPS, competitive or AAA titles" },
  { id: "workstation",label: "Workstation",        icon: "🖥️", desc: "3D rendering, CAD, video editing" },
  { id: "streaming",  label: "Streaming / Content",icon: "🎬", desc: "OBS, encoding, multi-app workflow" },
  { id: "office",     label: "Office / Hybrid",    icon: "💼", desc: "Productivity, Excel, Zoom, light tasks" },
  { id: "ai",         label: "AI / ML",            icon: "🤖", desc: "Model training, CUDA, data science" },
  { id: "esports",    label: "Esports Pro",        icon: "⚡", desc: "240Hz+, lowest latency, tournament-ready" },
];

const BUDGETS = [
  { id: "30-50k",   label: "₹30K – ₹50K",   sub: "Entry build" },
  { id: "50-80k",   label: "₹50K – ₹80K",   sub: "Mid-range" },
  { id: "80-120k",  label: "₹80K – ₹1.2L",  sub: "Enthusiast" },
  { id: "120-200k", label: "₹1.2L – ₹2L",   sub: "High-end" },
  { id: "200k+",    label: "₹2L+",           sub: "No compromise" },
  { id: "custom",   label: "Custom Budget",  sub: "I'll specify" },
];

const TIMELINES = [
  { id: "asap",    label: "ASAP",           sub: "Within 1 week" },
  { id: "2weeks",  label: "2 Weeks",        sub: "Standard build" },
  { id: "1month",  label: "1 Month",        sub: "No rush" },
  { id: "planning",label: "Just Planning",  sub: "Research phase" },
];

const STEPS = ["Use Case", "Budget", "Details", "Contact", "Confirm"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "40px" }}>
      {STEPS.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "unset" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: "11px",
              background: i < current ? "#C0392B" : i === current ? "rgba(192,57,43,0.15)" : "rgba(255,255,255,0.04)",
              border: i <= current ? "1px solid #C0392B" : "1px solid rgba(255,255,255,0.08)",
              color: i <= current ? "#fff" : "#444",
              transition: "all 0.3s",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1.5px", color: i === current ? "#C0392B" : "#333", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: "1px", background: i < current ? "#C0392B" : "rgba(255,255,255,0.06)", margin: "0 8px", marginBottom: "22px", transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectCard({ label, sub, icon, selected, onClick }: { label: string; sub?: string; icon?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 18px", borderRadius: "10px", cursor: "pointer", textAlign: "left",
        background: selected ? "rgba(192,57,43,0.12)" : "rgba(255,255,255,0.03)",
        border: selected ? "1px solid rgba(192,57,43,0.6)" : "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "4px",
      }}
    >
      {icon && <span style={{ fontSize: "20px", marginBottom: "2px" }}>{icon}</span>}
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "14px", color: selected ? "#fff" : "#aaa" }}>{label}</span>
      {sub && <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1px", color: selected ? "rgba(192,57,43,0.9)" : "#444" }}>{sub}</span>}
    </button>
  );
}

function GlassInput({ label, type = "text", value, onChange, placeholder, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: "#C0392B" }}> *</span>}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#fff", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "11px 14px", outline: "none", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(192,57,43,0.5)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BuildWithUs() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    useCase: "",
    budget: "",
    customBudget: "",
    timeline: "",
    peripherals: false,
    existingParts: "",
    games: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    intendsToBuild: true, // waive flag — toggled on confirmation
  });

  const f = (key: keyof typeof form) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const next = () => { setStep((s) => Math.min(s + 1, STEPS.length - 1)); scrollTop(); };
  const back = () => { setStep((s) => Math.max(s - 1, 0)); scrollTop(); };

  // ── Razorpay checkout ──
  async function handlePay() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/counseling-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: data.amount * 100,
        currency: "INR",
        name: "Alpha Rig",
        description: "Build Counseling Session",
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#C0392B" },
        handler: () => {
          trackEvent("purchase", "Counseling", "₹299 counseling session");
          setPaid(true);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  }

  const canNext = [
    !!form.useCase,
    !!form.budget,
    true,
    !!(form.name && form.email && form.phone),
    true,
  ][step];

  // ── Success screen ──
  if (paid) {
    return (
      <main style={{ minHeight: "100dvh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: "520px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>✓</div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", textTransform: "uppercase" }}>// SESSION BOOKED</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px,8vw,60px)", color: "#fff", letterSpacing: "0.04em", margin: 0, lineHeight: 0.95 }}>
            YOUR FORGE<br /><span style={{ color: "#C0392B" }}>AWAITS</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#666", lineHeight: 1.65 }}>
            Our team will reach out to <strong style={{ color: "#fff" }}>{form.email}</strong> within 24 hours to schedule your counseling session. The <strong style={{ color: "#C0392B" }}>₹299 fee is fully credited</strong> toward your build if you proceed.
          </p>
          <div style={{ background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "10px", padding: "16px 24px", width: "100%", textAlign: "left" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "#444", marginBottom: "10px" }}>BOOKING SUMMARY</p>
            {[["Use Case", USE_CASES.find(u => u.id === form.useCase)?.label ?? "—"], ["Budget", BUDGETS.find(b => b.id === form.budget)?.label ?? "—"], ["Timeline", TIMELINES.find(t => t.id === form.timeline)?.label ?? "—"], ["Contact", form.phone]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#444" }}>{k}</span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", color: "#fff" }}>{v}</span>
              </div>
            ))}
          </div>
          <a href="/" style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "14px", color: "#fff", background: "#C0392B", borderRadius: "8px", padding: "14px 32px", textDecoration: "none", display: "inline-block", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E74C3C")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C0392B")}>
            Back to Home
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", background: "#0A0A0A", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(192,57,43,0.03) 60px, rgba(192,57,43,0.03) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(192,57,43,0.03) 60px, rgba(192,57,43,0.03) 61px)`, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(192,57,43,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={topRef} style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>// BUILD WITH US</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px,8vw,72px)", color: "#fff", lineHeight: 0.92, letterSpacing: "0.04em", margin: "0 0 16px" }}>
            LET&apos;S FORGE<br /><span style={{ color: "#C0392B" }}>YOUR BUILD</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#666", lineHeight: 1.6, maxWidth: "500px" }}>
            Book a 1-on-1 counseling session with our build experts for <strong style={{ color: "#fff" }}>₹299</strong>.
            The fee is <strong style={{ color: "#C0392B" }}>fully waived</strong> if you build with us.
          </p>
        </div>

        <StepIndicator current={step} />

        {/* Step card */}
        <div style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(15,15,15,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "clamp(24px,5vw,40px)", minHeight: "320px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

              {/* ── Step 0: Use Case ── */}
              {step === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>WHAT WILL YOU USE IT FOR?</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                    {USE_CASES.map(u => (
                      <SelectCard key={u.id} label={u.label} sub={u.desc} icon={u.icon} selected={form.useCase === u.id} onClick={() => f("useCase")(u.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 1: Budget ── */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>WHAT&apos;S YOUR BUDGET?</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                    {BUDGETS.map(b => (
                      <SelectCard key={b.id} label={b.label} sub={b.sub} selected={form.budget === b.id} onClick={() => f("budget")(b.id)} />
                    ))}
                  </div>
                  {form.budget === "custom" && (
                    <div style={{ marginTop: "8px" }}>
                      <GlassInput label="Your Budget (₹)" value={form.customBudget} onChange={f("customBudget") as (v: string) => void} placeholder="e.g. 75000" />
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 2: Details ── */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>TELL US MORE</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: 0 }}>WHEN DO YOU NEED IT?</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                        {TIMELINES.map(t => (
                          <SelectCard key={t.id} label={t.label} sub={t.sub} selected={form.timeline === t.id} onClick={() => f("timeline")(t.id)} />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => f("peripherals")(!form.peripherals)}
                      style={{ display: "flex", alignItems: "center", gap: "12px", background: form.peripherals ? "rgba(192,57,43,0.10)" : "rgba(255,255,255,0.03)", border: form.peripherals ? "1px solid rgba(192,57,43,0.5)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px 18px", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: form.peripherals ? "#C0392B" : "transparent", border: form.peripherals ? "1px solid #C0392B" : "1px solid #444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {form.peripherals && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", color: "#fff", margin: 0 }}>Include Peripherals</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1px", color: "#444", margin: 0 }}>Monitor, keyboard, mouse, headset</p>
                      </div>
                    </button>
                    <GlassInput label="Games / Software You Run" value={form.games} onChange={f("games") as (v: string) => void} placeholder="e.g. Valorant, Blender, Premiere Pro" />
                    <GlassInput label="Existing Parts (if any)" value={form.existingParts} onChange={f("existingParts") as (v: string) => void} placeholder="e.g. I have a monitor and keyboard" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>ADDITIONAL NOTES</label>
                      <textarea
                        value={form.notes} onChange={(e) => f("notes")(e.target.value)}
                        placeholder="Any specific requirements, preferences, or questions..."
                        rows={3}
                        style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#fff", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "11px 14px", outline: "none", resize: "vertical", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(192,57,43,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Contact ── */}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>YOUR CONTACT DETAILS</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <GlassInput label="Full Name" value={form.name} onChange={f("name") as (v: string) => void} placeholder="Your full name" required />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <GlassInput label="Email" type="email" value={form.email} onChange={f("email") as (v: string) => void} placeholder="you@example.com" required />
                      <GlassInput label="Phone / WhatsApp" type="tel" value={form.phone} onChange={f("phone") as (v: string) => void} placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <GlassInput label="City" value={form.city} onChange={f("city") as (v: string) => void} placeholder="e.g. Chhindwara, Bhopal, Nagpur" />
                  </div>
                </div>
              )}

              {/* ── Step 4: Confirm ── */}
              {step === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", letterSpacing: "0.04em", margin: 0 }}>CONFIRM YOUR SESSION</h2>

                  {/* Summary */}
                  <div style={{ background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.15)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      ["Use Case",  USE_CASES.find(u => u.id === form.useCase)?.label ?? "—"],
                      ["Budget",    form.budget === "custom" ? `₹${form.customBudget}` : BUDGETS.find(b => b.id === form.budget)?.label ?? "—"],
                      ["Timeline",  TIMELINES.find(t => t.id === form.timeline)?.label ?? "Not specified"],
                      ["Peripherals", form.peripherals ? "Yes" : "No"],
                      ["Name",      form.name],
                      ["Email",     form.email],
                      ["Phone",     form.phone],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1.5px", color: "#444", textTransform: "uppercase" }}>{k}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "14px", color: "#ccc" }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#666" }}>Counseling Session</span>
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "15px", color: "#fff" }}>₹299</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#555" }}>Credited toward build</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#C0392B", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "4px", padding: "3px 8px" }}>100% WAIVED</span>
                    </div>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "16px", color: "#fff" }}>Pay Today</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#C0392B", lineHeight: 1 }}>₹299</span>
                    </div>
                  </div>

                  {error && <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#E74C3C", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: "8px", padding: "10px 14px" }}>{error}</p>}

                  <button
                    onClick={handlePay} disabled={loading}
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "24px", letterSpacing: "0.06em", color: "#fff", background: loading ? "#555" : "#C0392B", border: "none", borderRadius: "12px", padding: "18px", cursor: loading ? "not-allowed" : "pointer", width: "100%", transition: "background 0.2s" }}
                    onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#E74C3C"; }}
                    onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#C0392B"; }}
                  >
                    {loading ? "PROCESSING..." : "PAY ₹299 — BOOK SESSION"}
                  </button>
                  <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                    {["SECURE PAYMENT", "RAZORPAY PROTECTED", "FEE 100% CREDITED"].map(t => (
                      <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1.5px", color: "#333" }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        {step < 4 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button onClick={back} disabled={step === 0} style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "13px", letterSpacing: "0.06em", color: step === 0 ? "#333" : "#888", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "12px 24px", cursor: step === 0 ? "not-allowed" : "pointer", transition: "color 0.2s" }}>
              ← Back
            </button>
            <button onClick={next} disabled={!canNext} style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", color: "#fff", background: canNext ? "#C0392B" : "#2a2a2a", border: "1px solid transparent", borderRadius: "8px", padding: "12px 28px", cursor: canNext ? "pointer" : "not-allowed", transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (canNext) (e.currentTarget as HTMLElement).style.background = "#E74C3C"; }}
              onMouseLeave={(e) => { if (canNext) (e.currentTarget as HTMLElement).style.background = "#C0392B"; }}>
              {step === 3 ? "Review & Pay →" : "Continue →"}
            </button>
          </div>
        )}
      </div>

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </main>
  );
}
