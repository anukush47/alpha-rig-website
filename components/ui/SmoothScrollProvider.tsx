"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * SmoothScrollProvider
 * Initialises Lenis scroll-smoothing on mount.
 * - Respects prefers-reduced-motion: when the user opts out of motion the
 *   provider still renders children but does NOT attach Lenis, so the browser's
 *   native scroll is used instead.
 * - Lenis RAF loop is wired via requestAnimationFrame and torn down on unmount.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Honour prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Expose lenis instance on window so other components can access it
    (window as unknown as Record<string, unknown>).__lenis__ = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as Record<string, unknown>).__lenis__;
    };
  }, []);

  return <>{children}</>;
}
