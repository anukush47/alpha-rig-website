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
    const { type, name, company, email, budget, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!["advertise", "sponsor"].includes(type)) {
      return NextResponse.json({ error: "Invalid inquiry type." }, { status: 400 });
    }

    await writeClient.create({
      _type: "partnershipInquiry",
      type:        type.trim(),
      name:        name.trim(),
      company:     company?.trim() ?? "",
      email:       email.trim().toLowerCase(),
      budget:      budget?.trim() ?? "",
      message:     message.trim(),
      submittedAt: new Date().toISOString(),
      status:      "new",
    });

    return NextResponse.json({ status: "received" });
  } catch (err) {
    console.error("[partnership-inquiry]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
