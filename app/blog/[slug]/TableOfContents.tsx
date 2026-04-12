"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
}

export default function TableOfContents({
  headings,
}: {
  headings: TocHeading[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0% -70% 0%", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      style={{
        position: "sticky",
        top: "96px",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        background: "rgba(26,26,26,0.6)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "20px",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "#444",
          textTransform: "uppercase",
          margin: "0 0 16px",
        }}
      >
        On this page
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                style={{
                  display: "block",
                  padding: "7px 0 7px 14px",
                  fontFamily: "var(--font-rajdhani)",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "13px",
                  color: isActive ? "#C0392B" : "#555",
                  textDecoration: "none",
                  borderLeft: `2px solid ${isActive ? "#C0392B" : "rgba(255,255,255,0.06)"}`,
                  transition: "color 0.2s, border-color 0.2s, font-weight 0s",
                  lineHeight: 1.4,
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
