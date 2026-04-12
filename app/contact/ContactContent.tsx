"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursorGlow } from "@/lib/useCursorGlow";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const SUBJECTS = [
  "Custom Build Inquiry",
  "Event Partnership",
  "Store",
  "Blog Collaboration",
  "General",
];

// ─── Shared input base style ──────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  fontFamily: "var(--font-rajdhani)",
  fontWeight: 500,
  fontSize: "15px",
  color: "#ffffff",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "10px",
  padding: "13px 16px",
  outline: "none",
  width: "100%",
  colorScheme: "dark",          // prevents Chrome autofill from turning bg white
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function applyFocus(el: HTMLElement) {
  el.style.borderColor = "rgba(192,57,43,0.65)";
  el.style.boxShadow  = "0 0 0 3px rgba(192,57,43,0.10)";
}
function removeFocus(el: HTMLElement, hasError: boolean) {
  el.style.borderColor = hasError ? "rgba(231,76,60,0.55)" : "rgba(255,255,255,0.09)";
  el.style.boxShadow  = "none";
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: error ? "#E74C3C" : "rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {label}
        {error && (
          <span style={{ color: "#E74C3C", fontWeight: 400 }}>— {error}</span>
        )}
      </label>
      {children}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
      <div
        style={{
          flexShrink: 0,
          width: "38px",
          height: "38px",
          borderRadius: "9px",
          background: "rgba(192,57,43,0.10)",
          border: "1px solid rgba(192,57,43,0.22)",
          color: "#C0392B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "1px",
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "4px" }}>
          {label}
        </p>
        <p style={{ fontFamily: "var(--font-rajdhani)", fontWeight: 500, fontSize: "15px", color: href ? "#C0392B" : "#aaa", lineHeight: 1.45, transition: "opacity 0.2s" }}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        style={{ textDecoration: "none", display: "block" }}
        onMouseEnter={(e) => {
          const p = e.currentTarget.querySelector("p:last-child") as HTMLElement | null;
          if (p) p.style.opacity = "0.65";
        }}
        onMouseLeave={(e) => {
          const p = e.currentTarget.querySelector("p:last-child") as HTMLElement | null;
          if (p) p.style.opacity = "1";
        }}
      >
        {inner}
      </a>
    );
  }
  return <div>{inner}</div>;
}

// ─── Social button ────────────────────────────────────────────────────────────
function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.07)",
        color: "#555",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        transition: "color 0.2s, border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "#C0392B";
        el.style.borderColor = "rgba(192,57,43,0.35)";
        el.style.background = "rgba(192,57,43,0.07)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "#555";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.background = "transparent";
      }}
    >
      {children}
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactContent() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { hostRef: infoRef, glowRef: infoGlowRef, handlers: infoHandlers } = useCursorGlow();

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject) e.subject = "Choose a subject";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.trim().length < 20) e.message = "Min 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    console.log("[Alpha Rig Contact Form]", form);
    setStatus("success");
  };

  const field = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main className="flex flex-col flex-1" style={{ background: "#0A0A0A" }}>

      {/* Fix Chrome autofill yellow / blue bg override */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(26,26,26,1) inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
          border-color: rgba(255,255,255,0.09) !important;
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: "280px", paddingTop: "80px" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(500px circle at 70% 110%, rgba(192,57,43,0.1) 0%, transparent 60%)",
        }} />
        <div className="relative z-10 mx-auto w-full px-6 pb-10" style={{ maxWidth: "1200px" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}
          >
            // GET IN TOUCH
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="leading-none"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(48px, 8vw, 72px)", color: "#ffffff", letterSpacing: "0.04em" }}
          >
            CONTACT US
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontFamily: "var(--font-rajdhani)", fontSize: "17px", color: "#777", marginTop: "12px" }}
          >
            Builds, events, collabs, or just want to talk hardware — we&apos;re listening.
          </motion.p>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section className="w-full py-16">
        <div
          className="mx-auto px-6 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]"
          style={{ maxWidth: "1200px" }}
        >

          {/* ── LEFT: FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    background: "rgba(17,17,17,0.7)",
                    border: "1px solid rgba(192,57,43,0.25)",
                    borderRadius: "16px",
                    textAlign: "center",
                    padding: "64px 40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "rgba(192,57,43,0.1)", border: "2px solid #C0392B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-bebas)", fontSize: "36px", color: "#fff", letterSpacing: "0.04em", marginBottom: "6px" }}>MESSAGE SENT.</p>
                    <p style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "#C0392B", letterSpacing: "0.04em" }}>WE&apos;LL BE IN TOUCH.</p>
                  </div>
                  <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "15px", color: "#666", maxWidth: "300px", lineHeight: 1.7 }}>
                    Expect a reply within 24 hours. Urgent? Reach us at{" "}
                    <a href="mailto:hello@alpharig.in" style={{ color: "#C0392B" }}>hello@alpharig.in</a>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                  noValidate
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full Name *" id="name" error={errors.name}>
                      <input
                        id="name" type="text"
                        value={form.name}
                        onChange={(e) => field("name", e.target.value)}
                        placeholder="Anupam Kushwaha"
                        autoComplete="name"
                        style={{ ...inputBase, borderColor: errors.name ? "rgba(231,76,60,0.55)" : "rgba(255,255,255,0.09)" }}
                        onFocus={(e) => applyFocus(e.currentTarget)}
                        onBlur={(e) => removeFocus(e.currentTarget, !!errors.name)}
                      />
                    </Field>

                    <Field label="Email *" id="email" error={errors.email}>
                      <input
                        id="email" type="email"
                        value={form.email}
                        onChange={(e) => field("email", e.target.value)}
                        placeholder="you@email.com"
                        autoComplete="email"
                        style={{ ...inputBase, borderColor: errors.email ? "rgba(231,76,60,0.55)" : "rgba(255,255,255,0.09)" }}
                        onFocus={(e) => applyFocus(e.currentTarget)}
                        onBlur={(e) => removeFocus(e.currentTarget, !!errors.email)}
                      />
                    </Field>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Phone (optional)" id="phone">
                      <input
                        id="phone" type="tel"
                        value={form.phone}
                        onChange={(e) => field("phone", e.target.value)}
                        placeholder="+91 82259 86582"
                        autoComplete="tel"
                        style={{ ...inputBase }}
                        onFocus={(e) => applyFocus(e.currentTarget)}
                        onBlur={(e) => removeFocus(e.currentTarget, false)}
                      />
                    </Field>

                    <Field label="Subject *" id="subject" error={errors.subject}>
                      {/* Wrapper gives us a custom arrow since appearance:none strips the native one */}
                      <div style={{ position: "relative" }}>
                        <select
                          id="subject"
                          value={form.subject}
                          onChange={(e) => field("subject", e.target.value)}
                          style={{
                            ...inputBase,
                            appearance: "none",
                            WebkitAppearance: "none",
                            cursor: "pointer",
                            paddingRight: "40px",
                            color: form.subject ? "#ffffff" : "rgba(255,255,255,0.3)",
                            borderColor: errors.subject ? "rgba(231,76,60,0.55)" : "rgba(255,255,255,0.09)",
                          }}
                          onFocus={(e) => applyFocus(e.currentTarget)}
                          onBlur={(e) => removeFocus(e.currentTarget, !!errors.subject)}
                        >
                          <option value="" disabled style={{ background: "#111", color: "#555" }}>
                            Choose subject…
                          </option>
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s} style={{ background: "#111", color: "#fff" }}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {/* Custom chevron */}
                        <svg
                          aria-hidden
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </Field>
                  </div>

                  {/* Message */}
                  <Field label="Message * (min 20 chars)" id="message" error={errors.message}>
                    <textarea
                      id="message"
                      rows={6}
                      value={form.message}
                      onChange={(e) => field("message", e.target.value)}
                      placeholder="Tell us what you're looking for — build specs, event details, collab ideas..."
                      style={{
                        ...inputBase,
                        resize: "vertical",
                        minHeight: "140px",
                        borderColor: errors.message ? "rgba(231,76,60,0.55)" : "rgba(255,255,255,0.09)",
                        lineHeight: 1.6,
                      }}
                      onFocus={(e) => applyFocus(e.currentTarget)}
                      onBlur={(e) => removeFocus(e.currentTarget, !!errors.message)}
                    />
                    {form.message.length > 0 && (
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "1px",
                        color: form.message.length < 20 ? "#E74C3C" : "#3a3a3a",
                        alignSelf: "flex-end", marginTop: "4px",
                      }}>
                        {form.message.length} / 20 min
                      </span>
                    )}
                  </Field>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    style={{
                      fontFamily: "var(--font-bebas)",
                      fontSize: "22px",
                      letterSpacing: "0.08em",
                      color: "#fff",
                      background: status === "loading" ? "#7a2020" : "#C0392B",
                      border: "none",
                      borderRadius: "10px",
                      padding: "16px",
                      cursor: status === "loading" ? "wait" : "pointer",
                      transition: "background 0.2s",
                      width: "100%",
                      marginTop: "4px",
                    }}
                    onMouseEnter={(e) => {
                      if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#E74C3C";
                    }}
                    onMouseLeave={(e) => {
                      if (status !== "loading") (e.currentTarget as HTMLElement).style.background = "#C0392B";
                    }}
                  >
                    {status === "loading" ? "SENDING..." : "SEND MESSAGE →"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── RIGHT: INFO ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Info card */}
            <div
              ref={infoRef as React.RefObject<HTMLDivElement>}
              {...infoHandlers}
              className="relative overflow-hidden"
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: "rgba(17,17,17,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* cursor glow */}
              <div
                ref={infoGlowRef as React.RefObject<HTMLDivElement>}
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{ opacity: 0, background: "radial-gradient(280px circle at var(--x,50%) var(--y,50%), rgba(192,57,43,0.07), transparent 70%)" }}
              />

              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "#C0392B" }}>
                // HOW TO FIND US
              </p>

              <InfoRow
                label="Location"
                value="Durg, Chhattisgarh — 491001, India"
                href="https://maps.google.com/?q=Durg,Chhattisgarh,India"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />

              <InfoRow
                label="Phone"
                value="+91-8225986582"
                href="tel:+918225986582"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.16v2.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />

              <InfoRow
                label="Email"
                value="hello@alpharig.in"
                href="mailto:hello@alpharig.in"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />

              <InfoRow
                label="Response Time"
                value="Typically within 24 hours"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />

              {/* Socials */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "#333" }}>SOCIAL</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <SocialBtn href="https://twitter.com/alpharig" label="X / Twitter">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </SocialBtn>
                  <SocialBtn href="https://instagram.com/alpharig" label="Instagram">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </SocialBtn>
                  <SocialBtn href="https://youtube.com/@alpharig" label="YouTube">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </SocialBtn>
                  <SocialBtn href="https://linkedin.com/company/alpharig" label="LinkedIn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </SocialBtn>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
              <iframe
                title="Alpha Rig Location — Durg, Chhattisgarh"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59447.31697547261!2d81.2360396!3d21.1900183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a294001e1ef14f7%3A0xcf5af984fb2ccfde!2sDurg%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg) saturate(0.7) brightness(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
