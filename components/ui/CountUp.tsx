"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number */
  end: number;
  /** Starting number — default 0 */
  start?: number;
  /** Animation duration in ms — default 1800 */
  duration?: number;
  /** Suffix appended after number (e.g. "+" or "%") */
  suffix?: string;
  /** Prefix prepended before number (e.g. "₹") */
  prefix?: string;
  /** Easing: "ease-out" (default) or "linear" */
  easing?: "ease-out" | "linear";
  /** Extra className */
  className?: string;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * CountUp
 * Animates a number from `start` to `end` using requestAnimationFrame
 * when the element enters the viewport (IntersectionObserver).
 *
 * Respects prefers-reduced-motion: jumps directly to the final number.
 *
 * Usage:
 *   <CountUp end={500} suffix="+" className="text-5xl font-display" />
 *   <CountUp end={98} suffix="%" prefix="" duration={2000} />
 */
export default function CountUp({
  end,
  start = 0,
  duration = 1800,
  suffix = "",
  prefix = "",
  easing = "ease-out",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(start);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setValue(end);
      return;
    }

    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, triggered]);

  useEffect(() => {
    if (!triggered) return;

    const startTime = performance.now();
    const range = end - start;
    let rafId: number;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing === "ease-out" ? easeOut(progress) : progress;
      setValue(Math.round(start + range * easedProgress));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [triggered, start, end, duration, easing]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
