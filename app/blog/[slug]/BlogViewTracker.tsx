"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function BlogViewTracker({ title }: { title: string }) {
  useEffect(() => {
    trackEvent("page_view", "Blog", title);
  }, [title]);

  return null;
}
