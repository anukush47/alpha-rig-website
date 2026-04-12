import { useRef, useCallback } from "react";

/**
 * Returns refs for the host element and its radial-glow overlay,
 * plus mouse-event handlers. Wire them like:
 *
 *   const { hostRef, glowRef, handlers } = useCursorGlow();
 *   <div ref={hostRef} {...handlers}>
 *     <div ref={glowRef} style={GLOW_STYLE} />
 *   </div>
 *
 * On touch-only devices (hover: none) the handlers are no-ops so we
 * don't burn CPU on getBoundingClientRect calls that produce no effect.
 */
export function useCursorGlow<
  H extends HTMLElement = HTMLDivElement,
  G extends HTMLElement = HTMLDivElement,
>() {
  const hostRef = useRef<H>(null);
  const glowRef = useRef<G>(null);

  const isTouch = useCallback(() => {
    return typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouch()) return;
    const host = hostRef.current;
    const glow = glowRef.current;
    if (!host || !glow) return;
    const r = host.getBoundingClientRect();
    glow.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    glow.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    glow.style.opacity = "1";
  }, [isTouch]);

  const onMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  return { hostRef, glowRef, handlers: { onMouseMove, onMouseLeave } };
}
