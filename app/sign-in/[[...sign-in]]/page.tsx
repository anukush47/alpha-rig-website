import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | Alpha Rig",
  description: "Sign in to your Alpha Rig account to access orders, wishlist, builds and more.",
};

const CLERK_APPEARANCE = {
  variables: {
    colorPrimary:         "#c0392b",
    colorBackground:      "#0e0e0e",   // tells Clerk to compute white text
    colorInputBackground: "#161616",
    colorInputText:       "#ffffff",
    colorText:            "#ffffff",
    colorTextSecondary:   "#888888",
    colorDanger:          "#e74c3c",
    colorNeutral:         "#ffffff",
    borderRadius:         "8px",
    fontSize:             "14px",
    spacingUnit:          "16px",
  },
  elements: {
    rootBox:                      "w-full",
    // Card transparent — our outer wrapper provides background
    card:                         "!bg-transparent !border-0 !shadow-none !w-full !rounded-none !p-0",
    cardBox:                      "!w-full !shadow-none",
    headerTitle:                  "hidden",
    headerSubtitle:               "hidden",
    header:                       "hidden",
    dividerRow:                   "!my-3",
    dividerText:                  "!text-[#333]",
    dividerLine:                  "!bg-[#1e1e1e]",
    socialButtonsBlockButton:     "!border-white/[0.08] !bg-white/[0.03] hover:!bg-white/[0.07] !text-[#aaa] hover:!text-white !transition-colors",
    socialButtonsBlockButtonText: "!text-[#aaa]",
    socialButtonsBlockButtonArrow:"!text-[#555]",
    formFieldLabel:               "!text-[#777] !text-[13px]",
    formFieldInput:               "!bg-[#161616] !border-white/[0.08] !text-white placeholder:!text-[#333] focus:!border-[#c0392b] !transition-colors",
    formFieldHintText:            "!text-[#444]",
    formFieldErrorText:           "!text-[#e74c3c]",
    formButtonPrimary:            "!bg-[#c0392b] hover:!bg-[#e74c3c] !text-white !font-semibold !tracking-widest !transition-colors !border-0",
    footerActionLink:             "!text-[#c0392b] hover:!text-[#e74c3c]",
    footerActionText:             "!text-[#444]",
    footer:                       "!bg-transparent !border-t-0",
    identityPreviewText:          "!text-white",
    identityPreviewEditButton:    "!text-[#c0392b]",
    alternativeMethodsBlockButton:"!border-white/[0.08] !bg-transparent !text-[#888] hover:!text-white !transition-colors",
    main:                         "!bg-transparent",
    form:                         "!bg-transparent",
  },
};

const STATS = [
  { value: "500+", label: "Builds Delivered" },
  { value: "12k+", label: "Community Members" },
  { value: "48h",  label: "Avg Build Time" },
];

export default function SignInPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--color-void)",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(192,57,43,0.04) 59px,rgba(192,57,43,0.04) 60px)",
            "repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(192,57,43,0.04) 59px,rgba(192,57,43,0.04) 60px)",
          ].join(","),
          pointerEvents: "none",
        }}
      />

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          flex: "0 0 52%",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
          position: "relative",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Glow blob */}
        <div aria-hidden style={{
          position: "absolute",
          top: "45%", left: "35%",
          transform: "translate(-50%,-50%)",
          width: "480px", height: "380px",
          background: "radial-gradient(ellipse,rgba(192,57,43,0.13) 0%,transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "var(--font-display)", fontSize: "20px",
          letterSpacing: "0.08em", color: "#ffffff",
          textDecoration: "none", marginBottom: "72px",
          display: "block", position: "relative",
        }}>
          ALPHA <span style={{ color: "#c0392b" }}>RIG</span>
        </Link>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.28em", color: "#c0392b",
          textTransform: "uppercase", marginBottom: "18px",
          position: "relative",
        }}>
          // ALPHA RIG PRIVATE LIMITED
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px,6vw,84px)",
          lineHeight: 0.93, letterSpacing: "0.03em",
          color: "#ffffff", margin: "0 0 22px", position: "relative",
        }}>
          FORGE YOUR<br />
          <span style={{ color: "#c0392b" }}>IDENTITY</span>
        </h1>

        {/* Body */}
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 400,
          fontSize: "16px", color: "#555",
          lineHeight: 1.65, maxWidth: "380px",
          marginBottom: "52px", position: "relative",
        }}>
          India&apos;s premier custom PC builder — track builds, earn Alpha Points,
          and join a community that lives for the rig.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "36px", position: "relative" }}>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "30px",
                color: "#ffffff", letterSpacing: "0.04em",
                lineHeight: 1, margin: "0 0 5px",
              }}>{value}</p>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.14em", color: "#444",
                textTransform: "uppercase", margin: 0,
              }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Back link */}
        <Link href="/" style={{
          position: "absolute", bottom: "36px", left: "64px",
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.15em", color: "#333", textDecoration: "none",
        }}>
          ← BACK TO ALPHARIG.IN
        </Link>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        position: "relative",
      }}>
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden" style={{
          fontFamily: "var(--font-display)", fontSize: "20px",
          letterSpacing: "0.08em", color: "#ffffff",
          textDecoration: "none", marginBottom: "32px",
        }}>
          ALPHA <span style={{ color: "#c0392b" }}>RIG</span>
        </Link>

        {/* Mobile headline */}
        <div className="lg:hidden" style={{ textAlign: "center", marginBottom: "28px" }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "9px",
            letterSpacing: "0.25em", color: "#c0392b",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            // ALPHA RIG PRIVATE LIMITED
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px,10vw,56px)",
            lineHeight: 0.95, letterSpacing: "0.04em",
            color: "#ffffff", margin: 0,
          }}>
            FORGE YOUR <span style={{ color: "#c0392b" }}>IDENTITY</span>
          </h1>
        </div>

        {/* Single unified card — our wrapper owns bg/border, Clerk card is transparent inside */}
        <div style={{
          width: "100%",
          maxWidth: "400px",
          background: "#0e0e0e",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Red top accent */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg,transparent,#c0392b 50%,transparent)",
          }} />

          {/* Our title inside the card */}
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px", letterSpacing: "0.08em",
            color: "#ffffff", margin: 0,
            padding: "20px 28px 4px",
          }}>
            SIGN IN
          </p>

          {/* Clerk form — transparent card, fits flush inside our wrapper */}
          <div style={{ padding: "0 28px 28px" }}>
            <SignIn
              appearance={CLERK_APPEARANCE}
              forceRedirectUrl="/account"
              signUpUrl="/sign-up"
            />
          </div>
        </div>

        {/* Mobile back link */}
        <Link href="/" className="lg:hidden" style={{
          marginTop: "28px",
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.15em", color: "#333", textDecoration: "none",
        }}>
          ← BACK TO ALPHARIG.IN
        </Link>
      </div>
    </main>
  );
}
