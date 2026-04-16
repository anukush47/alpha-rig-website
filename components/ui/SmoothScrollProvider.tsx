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
      // 0.72s keeps smoothness without the scrollbar visibly lagging behind input.
      // The original 1.1s was too slow — scrollbar trailed the wheel by >1 second.
      duration: 0.72,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // quartic ease-out: fast start, soft landing
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // Expose lenis instance on window so other components can access it
    (window as unknown as Record<string, unknown>).__lenis__ = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Recalculate scroll limit whenever the window resizes or content changes
    function onResize() {
      lenis.resize();
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as Record<string, unknown>).__lenis__;
    };
  }, []);

  return <>{children}</>;
}
