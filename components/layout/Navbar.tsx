"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Builds", href: "/builds" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Store", href: "/store" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          className="mx-auto flex items-center justify-between px-6 py-3"
          style={{
            maxWidth: "1200px",
            marginTop: "16px",
            borderRadius: "12px",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            background: scrolled ? "rgba(10,10,10,0.75)" : "rgba(10,10,10,0.4)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "background 0.3s ease",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="select-none shrink-0"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              letterSpacing: "0.05em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            ALPHA <span style={{ color: "#C0392B" }}>RIG</span>
          </Link>

          {/* Center nav links — desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="relative transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: active ? "#ffffff" : "#888888",
                      letterSpacing: "0.04em",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = active ? "#ffffff" : "#888888"; }}
                  >
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px"
                        style={{ background: "#C0392B" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right — auth + CTA + hamburger */}
          <div className="flex items-center gap-3">

            {/* Signed-out: Sign In — desktop */}
            {!isSignedIn && (
              <SignInButton mode="redirect">
                <button
                  className="hidden md:inline-flex items-center px-4 py-2 transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                    color: "#888",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#fff";
                    el.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#888";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  SIGN IN
                </button>
              </SignInButton>
            )}

            {/* Signed-in: UserButton only — avatar click opens menu with account link */}
            {isSignedIn && (
              <div className="hidden md:flex items-center">
                <UserButton
                  appearance={{
                    variables: {
                      colorBackground:    "#111111",
                      colorText:          "#ffffff",
                      colorTextSecondary: "#888888",
                      colorPrimary:       "#c0392b",
                      borderRadius:       "8px",
                    },
                    elements: {
                      avatarBox:               "w-9 h-9 ring-2 ring-[#c0392b]/60 ring-offset-1 ring-offset-black",
                      userButtonPopoverCard:    "!bg-[#111] !border !border-white/[0.07] !shadow-2xl !w-[260px] !min-w-0",
                      userButtonPopoverMain:    "!bg-transparent",
                      userButtonPopoverActions: "!bg-transparent",
                      userButtonPopoverFooter:  "!bg-[#0d0d0d] !border-t !border-white/[0.05]",
                      userPreviewMainIdentifier:"!text-white !font-semibold",
                      userPreviewSecondaryIdentifier: "!text-[#555]",
                      userButtonPopoverActionButton: "!text-[#888] hover:!text-white hover:!bg-white/[0.04] !transition-colors",
                      userButtonPopoverActionButtonText: "!text-inherit",
                      userButtonPopoverActionButtonIcon: "!text-[#444]",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      href="/account"
                      label="My Account"
                      labelIcon={<span style={{ fontSize: 13 }}>⬡</span>}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            )}

            {/* Visit Store — desktop */}
            <Link
              href="/store"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm transition-all duration-200"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.06em",
                color: "#C0392B",
                borderRadius: "8px",
                border: "1px solid rgba(192,57,43,0.4)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#C0392B";
                el.style.color = "#ffffff";
                el.style.borderColor = "#C0392B";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "#C0392B";
                el.style.borderColor = "rgba(192,57,43,0.4)";
              }}
            >
              VISIT STORE
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.span className="block h-px w-6 origin-center" style={{ background: "#ffffff" }}
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
              <motion.span className="block h-px w-6" style={{ background: "#ffffff" }}
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.25 }} />
              <motion.span className="block h-px w-6 origin-center" style={{ background: "#ffffff" }}
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background: "rgba(10,10,10,0.92)",
            }}
          >
            <div className="mt-24 flex flex-col items-center justify-center flex-1 gap-8 pb-16">
              {NAV_LINKS.map(({ label, href }, i) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <motion.div key={href}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }} transition={{ delay: i * 0.07, duration: 0.3 }}
                  >
                    <Link href={href} className="block text-center" style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(32px, 8vw, 48px)",
                      letterSpacing: "0.05em",
                      color: active ? "#C0392B" : "#ffffff",
                    }}>
                      {label.toUpperCase()}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07, duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
              >
                <Link href="/store" className="inline-flex items-center px-8 py-3" style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "0.08em",
                  color: "#ffffff",
                  background: "#C0392B",
                  borderRadius: "8px",
                }}>
                  VISIT STORE
                </Link>

                {!isSignedIn ? (
                  <SignInButton mode="redirect">
                    <button style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      color: "#888",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      padding: "10px 24px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}>
                      Sign In
                    </button>
                  </SignInButton>
                ) : (
                  <Link href="/account" style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: "#c0392b",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}>
                    My Account →
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
