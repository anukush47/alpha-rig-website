import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Find the document id for this slug
  const doc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "blogPost" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  if (!doc) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await writeClient.patch(doc._id).inc({ likes: 1 }).commit();

  return NextResponse.json({ ok: true });
}
