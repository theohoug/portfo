"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  GlassKnot,
  IridescentIcosa,
  SoftTorus,
  Pill,
  Orbs,
} from "./objects";

function CameraRig({
  scroll,
  pointer,
}: {
  scroll: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const smooth = useRef({ s: 0, px: 0, py: 0 });
  useFrame((state, dt) => {
    smooth.current.s += (scroll.current - smooth.current.s) * Math.min(1, dt * 2.5);
    smooth.current.px += (pointer.current.x - smooth.current.px) * Math.min(1, dt * 3);
    smooth.current.py += (pointer.current.y - smooth.current.py) * Math.min(1, dt * 3);
    const t = smooth.current.s;
    const px = smooth.current.px;
    const py = smooth.current.py;

    state.camera.position.x = px * 0.4 + Math.sin(t * Math.PI) * 0.2;
    state.camera.position.y = -py * 0.4 + Math.cos(t * Math.PI * 0.5) * 0.15;
    state.camera.position.z = 4.6 - t * 1.2;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function SceneCanvas() {
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const refs = { scroll, pointer };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(155,140,255,0.18),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(255,122,107,0.16),transparent_60%)]" />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.6], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <color attach="background" args={["#0a0617"]} />
        <fog attach="fog" args={["#0a0617", 5, 14]} />

        <CameraRig {...refs} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff6ea" />
        <pointLight position={[-3, -2, 2]} intensity={1.2} color="#ff7a6b" />
        <pointLight position={[3, -1, -2]} intensity={0.8} color="#6be5c8" />
        <pointLight position={[0, 4, -3]} intensity={0.8} color="#9b8cff" />

        <Environment preset="sunset" background={false} />

        <GlassKnot {...refs} />
        <IridescentIcosa {...refs} />
        <SoftTorus {...refs} />
        <Pill {...refs} />
        <Orbs {...refs} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,6,23,0.55)_100%)]" />
      <div className="grain-overlay" />
    </div>
  );
}
