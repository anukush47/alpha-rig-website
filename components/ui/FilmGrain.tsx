"use client";

import { useEffect, useRef } from "react";

/**
 * FilmGrain
 * Renders animated film grain on a fixed canvas that sits on top of every page.
 * Performance notes:
 *  - Canvas is pointer-events:none so it never blocks clicks
 *  - Grain is drawn on an offscreen canvas then composited — one GPU upload
 *  - Reduced on mobile (smaller grain patch, lower opacity) to save battery
 *  - Fully skipped when prefers-reduced-motion: reduce is set
 *  - Alpha channel only — no colour bleed onto page content
 */
export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect mobile — smaller grain, lower opacity
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Grain patch dimensions — smaller on mobile so we generate less randomness
    const PATCH = isMobile ? 128 : 256;
    const OPACITY = isMobile ? 0.025 : 0.045;

    // Create an offscreen canvas for the repeating grain tile
    const offscreen = document.createElement("canvas");
    offscreen.width = PATCH;
    offscreen.height = PATCH;
    const off = offscreen.getContext("2d")!;
    const imageData = off.createImageData(PATCH, PATCH);
    const buf = imageData.data; // Uint8ClampedArray, RGBA

    let animId = 0;
    let frame = 0;

    function fillGrain() {
      // We only touch every other pixel on mobile to halve cost
      const step = isMobile ? 2 : 1;
      for (let y = 0; y < PATCH; y += step) {
        for (let x = 0; x < PATCH; x += step) {
          const i = (y * PATCH + x) * 4;
          const v = (Math.random() * 255) | 0;
          buf[i] = v;       // R
          buf[i + 1] = v;   // G
          buf[i + 2] = v;   // B
          buf[i + 3] = (OPACITY * 255) | 0; // A
        }
      }
      off.putImageData(imageData, 0, 0);
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      frame++;
      // Regenerate grain every 2 frames (~30 fps effective) — halves GPU work
      if (frame % 2 === 0) fillGrain();

      // Tile the patch across the full canvas with random offsets for shimmer
      const ox = (Math.random() * PATCH) | 0;
      const oy = (Math.random() * PATCH) | 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use createPattern for efficient tiling
      const pattern = ctx.createPattern(offscreen, "repeat");
      if (pattern) {
        const m = new DOMMatrix();
        m.translateSelf(ox, oy);
        pattern.setTransform(m);
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(draw);
    }

    // Initial grain fill before first draw
    fillGrain();
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "overlay",
      }}
    />
  );
}
