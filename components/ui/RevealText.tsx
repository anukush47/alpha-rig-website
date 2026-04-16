"use client";

import { useEffect, useRef, useState } from "react";

interface RevealTextProps {
  /** The text to animate */
  children: string;
  /** Element tag to render — defaults to "span" */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  /** Stagger delay per character in ms — default 18 */
  stagger?: number;
  /** Duration per character animation in ms — default 420 */
  duration?: number;
  /** Extra className on the wrapper */
  className?: string;
  /** Threshold before triggering — 0‒1 fraction of element visible */
  threshold?: number;
}

/**
 * RevealText
 * Splits text into individual characters and animates each from
 * translateY(100%) / opacity:0 → translateY(0) / opacity:1 when
 * the element enters the viewport (IntersectionObserver).
 *
 * Respects prefers-reduced-motion: when the user opts out, text is
 * rendered as plain text with no animation.
 *
 * Usage:
 *   <RevealText as="h2" stagger={22}>Alpha Rig</RevealText>
 *   <RevealText as="p" className="text-steel">Your custom PC partner.</RevealText>
 */
export default function RevealText({
  children,
  as: Tag = "span",
  stagger = 18,
  duration = 420,
  className = "",
  threshold = 0.1,
}: RevealTextProps) {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (prefersReduced || !wrapperRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [prefersReduced, threshold]);

  if (prefersReduced) {
    return (
      <Tag className={className} aria-label={children}>
        {children}
      </Tag>
    );
  }

  const chars = children.split("");

  return (
    <Tag
      ref={wrapperRef as React.RefObject<never>}
      className={className}
      aria-label={children}
      style={{ display: "inline-block" }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: revealed ? "translateY(0)" : "translateY(110%)",
              opacity: revealed ? 1 : 0,
              transition: `transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms, opacity ${duration * 0.6}ms ease ${i * stagger}ms`,
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </Tag>
  );
}
