"use client";

import { useEffect, useRef } from "react";

/**
 * GameCursor
 * Replaces the system cursor with a red-dot + crosshair on fine-pointer devices.
 * Touch / stylus / coarse-pointer devices keep the native cursor.
 *
 * Key design decisions:
 * - Cursor elements are ALWAYS rendered (invisible off-screen) so refs are
 *   attached immediately — no timing gap between the RAF loop starting and the
 *   DOM elements existing.
 * - cursor:none is injected via a <style> tag with !important so it overrides
 *   browser-default `a { cursor: pointer }` rules that defeat inline inheritance.
 * - All overlay elements carry pointer-events:none — verified in DOM, not just JSX.
 * - Positioning uses CSS custom properties + transform so there is zero layout
 *   thrashing from top/left changes.
 */
export default function GameCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    // Only activate on fine-pointer devices (mouse / trackpad)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    // Inject global cursor:none — overrides a/button default rules
    const style = document.createElement("style");
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);
    styleRef.current = style;

    // Show cursor elements
    if (rootRef.current) rootRef.current.style.opacity = "1";

    let rafId: number;
    let rawX = -200;
    let rawY = -200;
    let smoothX = -200;
    let smoothY = -200;
    let isHovering = false;

    function detectLabel(x: number, y: number): string {
      // Temporarily hide our overlay so elementFromPoint sees the real element
      if (rootRef.current) rootRef.current.style.display = "none";
      const el = document.elementFromPoint(x, y);
      if (rootRef.current) rootRef.current.style.display = "block";

      if (!el) return "";
      const interactive = el.closest("a, button, [role='button'], [data-cursor-label]");
      if (!interactive) return "";

      const custom = interactive.getAttribute("data-cursor-label");
      if (custom) return custom;

      const tag = interactive.tagName.toLowerCase();
      if (tag === "a") return "OPEN";
      if (tag === "button") return "CLICK";
      return "CLICK";
    }

    function onMove(e: MouseEvent) {
      rawX = e.clientX;
      rawY = e.clientY;
    }

    function loop() {
      const LERP = 0.22;
      smoothX += (rawX - smoothX) * LERP;
      smoothY += (rawY - smoothY) * LERP;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${smoothX}px - 50%), calc(${smoothY}px - 50%))`;
      }
      if (crossRef.current) {
        crossRef.current.style.transform = `translate(calc(${rawX}px - 50%), calc(${rawY}px - 50%))`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${rawX + 16}px, ${rawY - 20}px)`;
      }

      rafId = requestAnimationFrame(loop);
    }

    // Detect hover label on mousemove (throttled: every other frame is fine)
    let moveFrame = 0;
    function onMoveThrottled(e: MouseEvent) {
      onMove(e);
      moveFrame++;
      if (moveFrame % 2 !== 0) return;

      const label = detectLabel(e.clientX, e.clientY);
      const entering = !!label;

      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? "1" : "0";
      }

      if (entering !== isHovering) {
        isHovering = entering;
        if (crossRef.current) {
          crossRef.current.style.transform = `translate(calc(${rawX}px - 50%), calc(${rawY}px - 50%)) scale(${entering ? 1.5 : 1})`;
          crossRef.current.style.opacity = entering ? "0.5" : "0.25";
        }
        if (dotRef.current) {
          dotRef.current.style.width = entering ? "14px" : "10px";
          dotRef.current.style.height = entering ? "14px" : "10px";
        }
      }
    }

    function onLeave() {
      if (rootRef.current) rootRef.current.style.opacity = "0";
    }
    function onEnter() {
      if (rootRef.current) rootRef.current.style.opacity = "1";
    }

    window.addEventListener("mousemove", onMoveThrottled, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMoveThrottled);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      style.remove();
      styleRef.current = null;
      if (rootRef.current) rootRef.current.style.opacity = "0";
    };
  }, []);

  // Always render — hidden off-screen until the effect confirms fine pointer
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        opacity: 0,
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        // Prevent this wrapper from blocking any clicks
      }}
    >
      {/* Red dot — lerps behind the crosshair for organic feel */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#c0392b",
          boxShadow: "0 0 8px 2px rgba(192,57,43,0.55)",
          transition: "width 0.15s ease, height 0.15s ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Crosshair — tracks raw mouse position for precision feel */}
      <div
        ref={crossRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 30,
          height: 30,
          opacity: 0.25,
          transition: "opacity 0.2s, transform 0.12s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Horizontal bar */}
        <div style={{
          position: "absolute",
          top: "50%", left: 0, right: 0,
          height: 1,
          background: "#c0392b",
          transform: "translateY(-50%)",
        }} />
        {/* Vertical bar */}
        <div style={{
          position: "absolute",
          left: "50%", top: 0, bottom: 0,
          width: 1,
          background: "#c0392b",
          transform: "translateX(-50%)",
        }} />
        {/* Corner brackets — TL */}
        <div style={{ position:"absolute", top:0, left:0, width:6, height:6, borderTop:"1px solid #c0392b", borderLeft:"1px solid #c0392b" }} />
        {/* TR */}
        <div style={{ position:"absolute", top:0, right:0, width:6, height:6, borderTop:"1px solid #c0392b", borderRight:"1px solid #c0392b" }} />
        {/* BL */}
        <div style={{ position:"absolute", bottom:0, left:0, width:6, height:6, borderBottom:"1px solid #c0392b", borderLeft:"1px solid #c0392b" }} />
        {/* BR */}
        <div style={{ position:"absolute", bottom:0, right:0, width:6, height:6, borderBottom:"1px solid #c0392b", borderRight:"1px solid #c0392b" }} />
      </div>

      {/* Contextual label */}
      <span
        ref={labelRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          color: "#c0392b",
          opacity: 0,
          transition: "opacity 0.12s",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}
