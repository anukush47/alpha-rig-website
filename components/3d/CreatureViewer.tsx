"use client";

import { Suspense, useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

useGLTF.setDecoderPath("/draco/");
useGLTF.preload("/models/creature.glb");

// ─────────────────────────────────────────────────────────────────────────────
// GEOMETRY NOTES (from gltf-transform inspect):
//
//   Original model faces +X direction (side-on to camera at +Z).
//   After rotation.y = -π/2:
//     • Visible WIDTH  = original Z-depth  = ±0.50 → 1.00 units
//     • Visible HEIGHT = original Y-height = ±0.38 → 0.763 units
//     • Model aspect ratio = 1.00 / 0.763 = 1.31  (LANDSCAPE, wider than tall)
//
//   Target canvas is 4:3 landscape. Cinematic ~65% fill (breathing room for wings).
//   At scale=1.8, FOV=44°, camera z=2.8:
//     • Visible half-height = 2.8 × tan(22°) = 1.131
//     • Model half-height   = 0.763 × 1.8/2  = 0.686  → 60.7% fill ✓
//     • Visible half-width  = 1.131 × (4/3)  = 1.508
//     • Model half-width    = 1.00  × 1.8/2  = 0.900  → 59.7% fill, wings clear ✓
// ─────────────────────────────────────────────────────────────────────────────

interface CreatureProps {
  isMobile: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function Creature({ isMobile, containerRef }: CreatureProps) {
  const { scene } = useGLTF("/models/creature.glb");
  const groupRef   = useRef<THREE.Group>(null);
  const targetRot  = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });
  // Slow idle drift when mouse is far away
  const idleTime   = useRef(0);

  const clonedScene = useRef<THREE.Group | null>(null);
  if (!clonedScene.current) {
    clonedScene.current = scene.clone(true);

    // ── Rotate to face camera (was facing +X, camera at +Z) ──────────────
    clonedScene.current.rotation.y = -Math.PI / 2;

    // ── Scale: 1.8 gives ~60% frame fill — wings fully clear, cinematic breathing room ──
    clonedScene.current.scale.setScalar(1.8);

    // ── Shift up slightly so shadow pad doesn't eat into the feet ────────
    clonedScene.current.position.y = 0.06;

    // ── Material: dark metallic armor needs tuning so lights read on it ──
    clonedScene.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (!mat.isMeshStandardMaterial) return;
        // Allow diffuse light to read on the armor surface
        mat.metalness       = Math.min(mat.metalness, 0.60);
        mat.roughness       = Math.max(mat.roughness, 0.38);
        // Amplify IBL reflections from the sunset environment
        mat.envMapIntensity = 2.8;
        mat.needsUpdate     = true;
      });
    });
  }

  // ── Mouse tracking: relative to the 3D viewer container ─────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const MAX_X = 16 * (Math.PI / 180);
    const MAX_Y =  8 * (Math.PI / 180);
    const el = containerRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width  / 2) / (r.width  / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - r.top  - r.height / 2) / (r.height / 2)));
    targetRot.current.y =  nx * MAX_X;
    targetRot.current.x = -ny * MAX_Y;
    idleTime.current = 0; // reset idle clock on interaction
  }, [containerRef]);

  const handleMouseLeave = useCallback(() => {
    targetRot.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    // ── Vertical float — smooth sine ──────────────────────────────────────
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.055;

    // ── Cursor-tracking lerp ──────────────────────────────────────────────
    const LERP = 0.055;
    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * LERP;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * LERP;

    // ── Idle slow drift when no mouse interaction ─────────────────────────
    idleTime.current += delta;
    const idleDrift = idleTime.current > 3
      ? Math.sin(t * 0.18) * 0.08    // gentle sway after 3s idle
      : 0;

    groupRef.current.rotation.x = currentRot.current.x;
    groupRef.current.rotation.y = currentRot.current.y + idleDrift;
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

// ─── Lights ───────────────────────────────────────────────────────────────────
function Lights() {
  const emberRef = useRef<THREE.PointLight>(null);

  // Pulse the ember glow subtly — gives the model a "breathing" energy feel
  useFrame(({ clock }) => {
    if (!emberRef.current) return;
    emberRef.current.intensity = 10 + Math.sin(clock.getElapsedTime() * 1.4) * 2.5;
  });

  return (
    <>
      {/* Warm frontal fill — makes armor surfaces readable */}
      <directionalLight position={[0, 2, 6]} intensity={3.0} color="#fff5e0" />

      {/* Theatrical key from upper-right — separates from background */}
      <spotLight
        position={[4, 7, 4]}
        angle={0.45}
        penumbra={0.85}
        intensity={25}
        color="#ffe8cc"
        castShadow={false}
      />

      {/* Pulsing dragon-fire ember from below — signature brand red */}
      <pointLight ref={emberRef} position={[0, -1.0, 1.4]} color="#C0392B" intensity={10} decay={2} />

      {/* Cool blue-violet rim from back-left — carves the wing silhouette */}
      <pointLight position={[-5, 3, -3]} color="#4455cc" intensity={4} decay={2} />

      {/* Top accent — traces the horns and helmet crown */}
      <pointLight position={[0, 7, 0.5]} color="#aac0ff" intensity={3} decay={2} />
    </>
  );
}

// ─── Camera ───────────────────────────────────────────────────────────────────
// Telephoto setup: narrow FOV + farther camera = model looks large and cinematic
function CameraRig({ isMobile }: { isMobile: boolean }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    // ACESFilmic tone mapping — pulls dark armor toward visible range
    // and creates natural HDR contrast without blowing out highlights
    gl.toneMapping         = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;

    camera.position.set(0, 0.04, isMobile ? 3.2 : 2.8);
    (camera as THREE.PerspectiveCamera).fov = isMobile ? 52 : 44;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }, [camera, gl, isMobile]);

  return null;
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "4px", color: "#C0392B" }}>
        INITIALIZING...
      </span>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function CreatureViewer() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        // LANDSCAPE ratio — matches the model's natural proportions after rotation.
        // 4:3 ensures wings never clip and the model fills the canvas.
        aspectRatio: isMobile ? "unset" : "4 / 3",
        height: isMobile ? "360px" : "auto",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <Suspense fallback={<Loader />}>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
          camera={{ fov: 44, near: 0.1, far: 100, position: [0, 0.04, 2.8] }}
        >
          <CameraRig isMobile={isMobile} />
          <Lights />

          {/*
            "sunset" preset wraps the model in warm orange-amber IBL.
            Metallic armor reflects the gradient sky, giving it depth
            and the glowing energy the brand aesthetic calls for.
          */}
          <Environment preset="sunset" background={false} />

          <Creature isMobile={isMobile} containerRef={containerRef} />

          {/* Ground shadow — anchors the character, tinted red to brand */}
          <ContactShadows
            position={[0, -0.75, 0]}
            opacity={0.50}
            scale={2.5}
            blur={1.6}
            far={1.0}
            color="#8B1A10"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
