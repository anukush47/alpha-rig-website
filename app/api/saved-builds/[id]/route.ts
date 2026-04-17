import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:     false,
  token:      process.env.SANITY_API_TOKEN,
});

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership before deleting
  const doc = await sanity.fetch(
    `*[_type == "savedBuild" && _id == $id && clerkUserId == $uid][0]._id`,
    { id, uid: userId }
  );
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sanity.delete(id);
  return NextResponse.json({ deleted: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const doc = await sanity.fetch(
    `*[_type == "savedBuild" && _id == $id && clerkUserId == $uid][0]._id`,
    { id, uid: userId }
  );
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await sanity.patch(id).set(body).commit();
  return NextResponse.json({ build: updated });
}
