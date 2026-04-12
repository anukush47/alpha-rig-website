"use client";

import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Builds", href: "/builds" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
];

const VERTICALS = [
  { label: "Store", href: "/store" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/about#careers" },
];

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL = [
  { label: "X / Twitter", href: "https://twitter.com/alpharig", Icon: IconX },
  { label: "Instagram", href: "https://instagram.com/alpharig", Icon: IconInstagram },
  { label: "YouTube", href: "https://youtube.com/@alpharig", Icon: IconYouTube },
  { label: "LinkedIn", href: "https://linkedin.com/company/alpharig", Icon: IconLinkedIn },
];

export default function Footer() {
  return (
    <footer
      className="mt-auto w-full"
      style={{
        background: "#111111",
        borderTop: "1px solid #1A1A1A",
      }}
    >
      <div
        className="mx-auto px-6 pt-16 pb-8"
        style={{ maxWidth: "1200px" }}
      >
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                letterSpacing: "0.06em",
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              ALPHA <span style={{ color: "#C0392B" }}>RIG</span>
            </span>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "#888888",
                lineHeight: "1.65",
                maxWidth: "220px",
              }}
            >
              Precision-engineered custom PC builds for enthusiasts who demand the extraordinary.
            </p>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#555555",
                letterSpacing: "0.03em",
              }}
            >
              Durg, Chhattisgarh, India
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200"
                  style={{ color: "#888888" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C0392B"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#888888"; }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="flex flex-col gap-4">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "#ffffff",
              }}
            >
              QUICK LINKS
            </h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#888888",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#888888"; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Verticals */}
          <div className="flex flex-col gap-4">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "#ffffff",
              }}
            >
              COMPANY
            </h3>
            <ul className="flex flex-col gap-3">
              {VERTICALS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#888888",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#888888"; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact + Social */}
          <div className="flex flex-col gap-4">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "#ffffff",
              }}
            >
              CONTACT
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:hello@alpharig.in"
                  className="transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "#888888",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C0392B"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#888888"; }}
                >
                  hello@alpharig.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+919999999999"
                  className="transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "#888888",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#888888"; }}
                >
                  +91 99999 99999
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                    color: "#C0392B",
                    border: "1px solid rgba(192,57,43,0.35)",
                    borderRadius: "6px",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#C0392B";
                    el.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent";
                    el.style.color = "#C0392B";
                  }}
                >
                  GET IN TOUCH
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-12 mb-6 w-full h-px"
          style={{ background: "#1A1A1A" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#444444",
              letterSpacing: "0.04em",
            }}
          >
            © 2024 Alpha Rig Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase().replace(/ /g, "-")}`}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "#444444",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#888888"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#444444"; }}
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
