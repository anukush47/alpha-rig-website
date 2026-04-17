import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@sanity/client";
import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";
import ProfileHandleForm from "./ProfileHandleForm";

export const metadata: Metadata = { title: "Profile | Alpha Rig" };

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, profile] = await Promise.all([
    currentUser(),
    sanity.fetch<{ handle?: string; bio?: string }>(
      `*[_type == "userProfile" && clerkUserId == $uid][0]{ handle, bio }`,
      { uid: userId }
    ),
  ]);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "#c0392b",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          // PROFILE
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 50px)",
          letterSpacing: "0.04em",
          color: "#fff",
          lineHeight: 0.95,
          margin: "0 0 8px",
        }}>
          YOUR IDENTITY
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333", letterSpacing: "0.06em", margin: 0 }}>
          {user?.emailAddresses?.[0]?.emailAddress}
        </p>
      </div>

      {/* ── Gaming handle + bio ── */}
      <div style={{
        marginBottom: 36,
        padding: "28px 32px",
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 12,
      }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "#444",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          // GAMING IDENTITY
        </p>
        <ProfileHandleForm
          initialHandle={profile?.handle ?? ""}
          initialBio={profile?.bio ?? ""}
          clerkUserId={userId}
        />
      </div>

      {/* ── Clerk managed settings ── */}
      <div style={{ marginBottom: 8 }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "#444",
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          // ACCOUNT SETTINGS
        </p>
        <div style={{ maxWidth: 520 }}>
          <UserProfile
            appearance={{
              variables: {
                colorPrimary: "#c0392b",
                colorBackground: "#0e0e0e",
                colorInputBackground: "#141414",
                colorText: "#ffffff",
                colorTextSecondary: "#888888",
                colorNeutral: "#ffffff",
                borderRadius: "6px",
                fontFamily: "var(--font-body, sans-serif)",
              },
              elements: {
                card: "!bg-transparent !border-0 !shadow-none !p-0",
                navbar: "!hidden",
                pageScrollBox: "!p-0",
                rootBox: "!w-full",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
