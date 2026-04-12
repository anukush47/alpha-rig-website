/**
 * Embedded Sanity Studio — accessible at /studio
 *
 * NextStudio uses React context internally, so this must be a Client Component.
 * The metadata/viewport exports are kept as a separate server-side concern.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
