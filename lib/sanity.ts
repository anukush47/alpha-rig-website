import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
// SanityImageSource is inferred from the builder — no separate type import needed

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

// ── Read client (CDN, public) ─────────────────────────────────────────────────
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

// ── Write / preview client (bypasses CDN) ─────────────────────────────────────
export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
});

// ── Image URL builder ──────────────────────────────────────────────────────────
const builder = createImageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// Convenience: 1200×630 OG image
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ogImage(source: any): string {
  return urlFor(source).width(1200).height(630).fit("crop").auto("format").url();
}
