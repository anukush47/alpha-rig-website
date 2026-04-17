import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import DashboardCards from "./DashboardCards";

export const metadata: Metadata = { title: "Account | Alpha Rig" };

export default async function AccountDashboard() {
  const user = await currentUser();

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "#c0392b",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          // DASHBOARD
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 5vw, 54px)",
          letterSpacing: "0.04em",
          color: "#fff",
          lineHeight: 0.95,
          margin: "0 0 10px",
        }}>
          WELCOME BACK,{" "}
          <span style={{ color: "#c0392b" }}>
            {user?.firstName?.toUpperCase() ?? "ALPHA"}
          </span>
        </h1>
        {user?.emailAddresses?.[0]?.emailAddress && (
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#333",
            letterSpacing: "0.06em",
            margin: 0,
          }}>
            {user.emailAddresses[0].emailAddress}
          </p>
        )}
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <DashboardCards />

      {/* ── Quick links ──────────────────────────────────────── */}
      <div style={{
        padding: "26px 28px",
        border: "1px solid rgba(192,57,43,0.1)",
        borderLeft: "2px solid rgba(192,57,43,0.5)",
        borderRadius: 8,
        background: "rgba(192,57,43,0.02)",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "#c0392b",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          // QUICK ACCESS
        </p>
        <p style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 14,
          color: "#555",
          margin: 0,
          lineHeight: 1.7,
        }}>
          Orders · Wishlist · Build Vault · Alpha Points · Rig Identity Card · Tournament Wall — all live and ready.
        </p>
      </div>
    </div>
  );
}
