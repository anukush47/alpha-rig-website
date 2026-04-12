"use client";

import { useRef } from "react";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home",   href: "/" },
  { label: "Builds", href: "/builds" },
  { label: "Events", href: "/events" },
  { label: "Blog",   href: "/blog" },
];

const VERTICALS = [
  { label: "Store",    href: "/store" },
  { label: "About Us", href: "/about" },
  { label: "Contact",  href: "/contact" },
  { label: "Careers",  href: "/about#careers" },
];

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL = [
  { label: "X / Twitter", href: "https://twitter.com/alpharig",             Icon: IconX         },
  { label: "Instagram",   href: "https://instagram.com/alpharig",            Icon: IconInstagram },
  { label: "YouTube",     href: "https://youtube.com/@alpharig",             Icon: IconYouTube   },
  { label: "LinkedIn",    href: "https://linkedin.com/company/alpharig",     Icon: IconLinkedIn  },
];

// ── Shared glass pill for social icons ────────────────────────────────────────
function SocialPill({
  label,
  href,
  Icon,
}: {
  label: string;
  href: string;
  Icon: React.FC;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        color: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
        transition: "color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color           = "#C0392B";
        el.style.background      = "rgba(192,57,43,0.12)";
        el.style.borderColor     = "rgba(192,57,43,0.35)";
        el.style.boxShadow       = "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 16px rgba(192,57,43,0.25)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color           = "rgba(255,255,255,0.45)";
        el.style.background      = "rgba(255,255,255,0.06)";
        el.style.borderColor     = "rgba(255,255,255,0.09)";
        el.style.boxShadow       = "inset 0 1px 0 rgba(255,255,255,0.10)";
      }}
    >
      <Icon />
    </a>
  );
}

// ── Column heading ─────────────────────────────────────────────────────────────
function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "3px",
        color: "rgba(255,255,255,0.30)",
        textTransform: "uppercase",
        marginBottom: "4px",
      }}
    >
      {children}
    </h3>
  );
}

// ── Footer link ────────────────────────────────────────────────────────────────
function FootLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const style: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 400,
    color: "rgba(255,255,255,0.45)",
    transition: "color 0.18s",
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      style={style}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
    >
      {children}
    </Link>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const footerRef     = useRef<HTMLElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el   = footerRef.current;
    const glow = cursorGlowRef.current;
    if (!el || !glow) return;
    const r = el.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const handleMouseLeave = () => {
    const glow = cursorGlowRef.current;
    if (glow) {
      glow.style.setProperty("--mx", "-600px");
      glow.style.setProperty("--my", "-600px");
    }
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mt-auto w-full overflow-hidden"
      style={{
        // Liquid glass surface
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        background:
          "linear-gradient(180deg, rgba(12,12,12,0.92) 0%, rgba(8,8,8,0.96) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ── Cursor-tracking glow ─────────────────────────────────────────── */}
      <div
        ref={cursorGlowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          ["--mx" as string]: "-600px",
          ["--my" as string]: "-600px",
          background:
            "radial-gradient(600px circle at var(--mx) var(--my), rgba(192,57,43,0.09) 0%, transparent 60%)",
        }}
      />

      {/* ── Top specular highlight — Apple glass "edge" ───────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.18) 75%, transparent 100%)",
        }}
      />

      {/* ── Subtle inner ambient glow at bottom ──────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "200px",
          background:
            "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(192,57,43,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 mx-auto px-6 pt-16 pb-8"
        style={{ maxWidth: "1200px" }}
      >
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4" style={{ marginBottom: "48px" }}>

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            {/* Logo glass pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "2px",
                padding: "8px 16px",
                borderRadius: "12px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                width: "fit-content",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  letterSpacing: "0.06em",
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                ALPHA <span style={{ color: "#C0392B" }}>RIG</span>
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255,255,255,0.40)",
                lineHeight: "1.70",
                maxWidth: "210px",
              }}
            >
              Precision-engineered custom PC builds for enthusiasts who demand
              the extraordinary.
            </p>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.05em",
              }}
            >
              Chhindwara, Madhya Pradesh, India
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIAL.map(({ label, href, Icon }) => (
                <SocialPill key={label} label={label} href={href} Icon={Icon} />
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="flex flex-col gap-4">
            <ColHead>Quick Links</ColHead>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <FootLink href={href}>{label}</FootLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div className="flex flex-col gap-4">
            <ColHead>Company</ColHead>
            <ul className="flex flex-col gap-3">
              {VERTICALS.map(({ label, href }) => (
                <li key={href}>
                  <FootLink href={href}>{label}</FootLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="flex flex-col gap-4">
            <ColHead>Contact</ColHead>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="mailto:hello@alpharig.in"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.45)",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C0392B"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                >
                  hello@alpharig.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+918225986582"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.04em",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
                >
                  +91-8225986582
                </a>
              </li>

              {/* Glass CTA button */}
              <li>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 18px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    color: "#C0392B",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    background: "rgba(192,57,43,0.08)",
                    border: "1px solid rgba(192,57,43,0.28)",
                    borderRadius: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                    transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background   = "#C0392B";
                    el.style.color        = "#ffffff";
                    el.style.borderColor  = "#C0392B";
                    el.style.boxShadow    = "0 4px 20px rgba(192,57,43,0.40), inset 0 1px 0 rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background  = "rgba(192,57,43,0.08)";
                    el.style.color       = "#C0392B";
                    el.style.borderColor = "rgba(192,57,43,0.28)";
                    el.style.boxShadow   = "inset 0 1px 0 rgba(255,255,255,0.07)";
                  }}
                >
                  GET IN TOUCH →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Our Verticals ─────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "40px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Our Verticals
          </p>
          <div className="flex flex-wrap gap-3" style={{ justifyContent: "center" }}>
            {/* Alpha Zen-X — links out */}
            <a
              href="https://alphazenx.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "color 0.2s, background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#ffffff";
                el.style.background = "rgba(255,255,255,0.08)";
                el.style.borderColor = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "rgba(255,255,255,0.55)";
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.borderColor = "rgba(255,255,255,0.09)";
              }}
            >
              Alpha Zen-X
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* Codexa Syndicates — no external link yet */}
            {[
              { label: "Codexa Syndicates" },
              { label: "Alpha Brew" },
            ].map(({ label }) => (
              <div
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {label}
                <span
                  style={{
                    marginLeft: "10px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    letterSpacing: "1.5px",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  COMING SOON
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <div
          className="mt-14 mb-6 w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)",
          }}
        />

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.20)",
              letterSpacing: "0.05em",
            }}
          >
            © 2026 Alpha Rig Private Limited. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase().replace(/ /g, "-")}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.20)",
                  letterSpacing: "0.04em",
                  transition: "color 0.18s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.20)"; }}
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
