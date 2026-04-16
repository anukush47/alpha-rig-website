import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, teamName, captainName, email, gameId, teamSize } = body;

    if (!eventId || !teamName?.trim() || !email?.trim() || !gameId?.trim()) {
      return NextResponse.json(
        { error: "Event, team name, email, and game ID are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Check if already registered (same email + event)
    const existing = await writeClient.fetch(
      `*[_type == "eventRegistration" && event._ref == $eventId && email == $email][0]{ _id }`,
      { eventId, email: email.trim().toLowerCase() }
    );

    if (existing) {
      return NextResponse.json({ status: "already_registered" });
    }

    await writeClient.create({
      _type: "eventRegistration",
      event: { _type: "reference", _ref: eventId },
      teamName:    teamName.trim(),
      captainName: captainName?.trim() ?? "",
      email:       email.trim().toLowerCase(),
      gameId:      gameId.trim(),
      teamSize:    teamSize ? Number(teamSize) : undefined,
      registeredAt: new Date().toISOString(),
      status: "pending",
    });

    // Optional: send confirmation email via Resend if key is set
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Alpha Rig Events <events@alpharig.in>",
            to: [email.trim()],
            subject: "Registration received — Alpha Rig",
            html: `<p>Hi ${captainName || teamName},</p>
<p>Your registration for the event has been received. We'll confirm your slot shortly.</p>
<p>Team: <strong>${teamName}</strong><br/>In-Game ID: <strong>${gameId}</strong></p>
<p>— Alpha Rig Events Team</p>`,
          }),
        });
      } catch {
        // Email failure is non-fatal — registration is already saved
      }
    }

    return NextResponse.json({ status: "registered" });
  } catch (err) {
    console.error("[events/register]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
