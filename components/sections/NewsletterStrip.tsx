"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    // Placeholder — wire to Resend/API route later
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      className="w-full py-20"
      style={{
        background: "#111111",
        borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto px-6 flex flex-col items-center text-center gap-6"
        style={{ maxWidth: "600px" }}
      >
        {/* Tag */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#C0392B",
            textTransform: "uppercase",
          }}
        >
          // STAY UPDATED
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 48px)",
            color: "#ffffff",
            lineHeight: 0.95,
            letterSpacing: "0.03em",
          }}
        >
          STAY IN THE LOOP
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "16px",
            color: "#888888",
            lineHeight: 1.6,
            maxWidth: "420px",
          }}
        >
          Build drops, event registrations, and PC culture — delivered straight
          to your inbox. No spam, unsubscribe any time.
        </p>

        {/* Form */}
        {status === "success" ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#C0392B",
              padding: "16px 24px",
              border: "1px solid rgba(192,57,43,0.3)",
              borderRadius: "8px",
            }}
          >
            ✓ YOU&apos;RE IN — CHECK YOUR INBOX
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full gap-3 flex-col sm:flex-row"
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="flex-1 outline-none min-w-0"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "#ffffff",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "14px 18px",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(192,57,43,0.5)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.1)")
              }
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.06em",
                color: "#ffffff",
                background: status === "loading" ? "#8B2020" : "#C0392B",
                border: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                cursor: status === "loading" ? "wait" : "pointer",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (status !== "loading")
                  (e.currentTarget as HTMLElement).style.background = "#E74C3C";
              }}
              onMouseLeave={(e) => {
                if (status !== "loading")
                  (e.currentTarget as HTMLElement).style.background = "#C0392B";
              }}
            >
              {status === "loading" ? "SENDING..." : "SUBSCRIBE"}
            </button>
          </form>
        )}

        {/* Privacy note */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "1px",
            color: "#333333",
          }}
        >
          WE RESPECT YOUR PRIVACY · NO SPAM EVER
        </p>
      </motion.div>
    </section>
  );
}
