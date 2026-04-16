"use client";

import { useState } from "react";

export default function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "blog-inline", tags: ["blog"] }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); return; }
      setStatus(data.status === "already_subscribed" ? "duplicate" : "success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        style={{
          padding: "28px 32px",
          border: "1px solid #C0392B",
          background: "#0d0d0d",
          textAlign: "center",
          margin: "40px 0",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            color: "#C0392B",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          YOU&apos;RE IN — CHECK YOUR INBOX
        </p>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div
        style={{
          padding: "28px 32px",
          border: "1px solid #333",
          background: "#0d0d0d",
          textAlign: "center",
          margin: "40px 0",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "22px",
            color: "#888",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          YOU&apos;RE ALREADY ON THE LIST
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        border: "1px solid #1e1e1e",
        borderLeft: "3px solid #C0392B",
        background: "#0d0d0d",
        margin: "40px 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "10px",
          color: "#C0392B",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}
      >
        Newsletter
      </p>
      <p
        style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "24px",
          color: "#f0f0f0",
          letterSpacing: "0.06em",
          margin: "0 0 6px",
        }}
      >
        ENJOYING THIS ARTICLE?
      </p>
      <p
        style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "15px",
          color: "#888",
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}
      >
        Get the best PC hardware guides, benchmarks, and deals straight to your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            flex: "1 1 200px",
            background: "#0A0A0A",
            border: "1px solid #2a2a2a",
            color: "#f0f0f0",
            padding: "10px 14px",
            fontFamily: "var(--font-rajdhani)",
            fontSize: "15px",
            outline: "none",
            minWidth: 0,
          }}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background: "#C0392B",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            fontFamily: "var(--font-bebas)",
            fontSize: "16px",
            letterSpacing: "0.1em",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.7 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {status === "loading" ? "..." : "SUBSCRIBE"}
        </button>
      </form>

      {status === "error" && (
        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "11px",
            color: "#E74C3C",
            margin: "10px 0 0",
          }}
        >
          SOMETHING WENT WRONG — PLEASE TRY AGAIN
        </p>
      )}
    </div>
  );
}
