import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@sanity/client";

// ── Sanity write client ───────────────────────────────────────────────────────
function getSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-01-01",
    useCdn:    false,
    token:     process.env.SANITY_API_TOKEN,
  });
}

// ── Clerk event shapes (minimal) ──────────────────────────────────────────────
interface ClerkUserData {
  id: string;
  first_name: string | null;
  last_name:  string | null;
  image_url:  string | null;
  email_addresses: Array<{ email_address: string; id: string }>;
  primary_email_address_id: string | null;
}

interface ClerkEvent {
  type: string;
  data: ClerkUserData;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Clerk Webhook] CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  // Verify the signature using svix
  const svixId        = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh   = new Webhook(webhookSecret);
  let event: ClerkEvent;

  try {
    event = wh.verify(body, {
      "svix-id":        svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sanity = getSanityClient();

  // ── user.created ─────────────────────────────────────────────────────────────
  if (event.type === "user.created") {
    const user = event.data;
    const primaryEmail = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    );

    const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ");

    await sanity.create({
      _type:       "userProfile",
      _id:         `userProfile-${user.id}`,   // deterministic — safe to re-create
      clerkUserId: user.id,
      displayName: displayName || null,
      email:       primaryEmail?.email_address ?? null,
      avatarUrl:   user.image_url ?? null,
      totalPoints: 0,
      createdAt:   new Date().toISOString(),
    });

    console.log(`[Clerk Webhook] Created userProfile for ${user.id}`);
  }

  // ── user.updated ─────────────────────────────────────────────────────────────
  if (event.type === "user.updated") {
    const user = event.data;
    const primaryEmail = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    );
    const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ");

    await sanity
      .patch(`userProfile-${user.id}`)
      .set({
        displayName: displayName || undefined,
        email:       primaryEmail?.email_address ?? undefined,
        avatarUrl:   user.image_url ?? undefined,
      })
      .commit()
      .catch(() => {
        // Profile may not exist yet (race condition) — ignore
      });

    console.log(`[Clerk Webhook] Updated userProfile for ${user.id}`);
  }

  // ── user.deleted ─────────────────────────────────────────────────────────────
  if (event.type === "user.deleted") {
    const userId = event.data.id;
    await sanity.delete(`userProfile-${userId}`).catch(() => {});
    console.log(`[Clerk Webhook] Deleted userProfile for ${userId}`);
  }

  return NextResponse.json({ received: true });
}
