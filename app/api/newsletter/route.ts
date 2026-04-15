import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

// Server-only write client — token never reaches the browser
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // needs Editor or higher permissions
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = "website", tags = [] } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const normalised = email.toLowerCase().trim();

    // Check for existing subscriber
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email: normalised }
    );

    if (existing) {
      // Already subscribed — return success so the UI shows the confirmation state
      return NextResponse.json({ status: "already_subscribed" });
    }

    // Create subscriber document
    await writeClient.create({
      _type: "subscriber",
      email: normalised,
      source,
      tags,
      subscribedAt: new Date().toISOString(),
      active: true,
    });

    return NextResponse.json({ status: "subscribed" });
  } catch (err) {
    console.error("[Newsletter API]", err);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
