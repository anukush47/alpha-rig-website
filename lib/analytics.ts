declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "js" | "set",
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string
): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}
