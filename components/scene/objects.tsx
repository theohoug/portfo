"use client";

import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";

type SceneRefs = {
  scroll: MutableRefObject<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
};

export function GlassKnot({ scroll, pointer }: SceneRefs) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef({ s: 0, px: 0, py: 0 });

  useFrame((_, dt) => {
    if (!group.current) return;
    smooth.current.s += (scroll.current - smooth.current.s) * Math.min(1, dt * 3);
    smooth.current.px += (pointer.current.x - smooth.current.px) * Math.min(1, dt * 3);
    smooth.current.py += (pointer.current.y - smooth.current.py) * Math.min(1, dt * 3);

    const t = smooth.current.s;
    group.current.rotation.x = smooth.current.py * 0.4 + t * 1.6;
    group.current.rotation.y = smooth.current.px * 0.5 + t * 2.4;
    group.current.position.x = -0.1 + Math.sin(t * Math.PI * 2) * 0.35;
    group.current.position.y = 0.05 + Math.cos(t * Math.PI * 1.5) * 0.2;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
      <group ref={group}>
        <mesh castShadow>
          <torusKnotGeometry args={[0.9, 0.3, 220, 32, 2, 3]} />
          <MeshTransmissionMaterial
            samples={6}
            resolution={256}
            thickness={0.6}
            roughness={0.08}
            anisotropy={0.25}
            chromaticAberration={0.08}
            distortion={0.35}
            distortionScale={0.3}
            temporalDistortion={0.18}
            ior={1.45}
            color="#fff2e4"
            background={new THREE.Color("#ff9d8a")}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function IridescentIcosa({ scroll }: SceneRefs) {
  const mesh = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    smooth.current += (scroll.current - smooth.current) * Math.min(1, dt * 2);
    const t = smooth.current;
    mesh.current.rotation.x += dt * 0.15;
    mesh.current.rotation.y += dt * 0.2;
    mesh.current.position.set(
      2.1 - t * 1.4,
      -0.8 + Math.sin(t * Math.PI) * 0.5,
      -0.5 - t * 0.6,
    );
  });
  return (
    <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={mesh} position={[2.1, -0.8, -0.5]}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshPhysicalMaterial
          color="#9b8cff"
          roughness={0.18}
          metalness={0.25}
          iridescence={1}
          iridescenceIOR={1.6}
          iridescenceThicknessRange={[120, 620]}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

export function SoftTorus({ scroll }: SceneRefs) {
  const mesh = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    smooth.current += (scroll.current - smooth.current) * Math.min(1, dt * 2);
    const t = smooth.current;
    mesh.current.rotation.x = 0.6 + t * Math.PI;
    mesh.current.rotation.y = t * Math.PI * 1.6;
    mesh.current.position.set(-2.3 + t * 1.2, 0.9 - t * 0.5, -0.8);
  });
  return (
    <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={mesh} position={[-2.3, 0.9, -0.8]}>
        <torusGeometry args={[0.45, 0.16, 48, 120]} />
        <meshPhysicalMaterial
          color="#6be5c8"
          roughness={0.3}
          metalness={0.4}
          emissive="#6be5c8"
          emissiveIntensity={0.08}
          envMapIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

export function Pill({ scroll }: SceneRefs) {
  const mesh = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    smooth.current += (scroll.current - smooth.current) * Math.min(1, dt * 2);
    const t = smooth.current;
    mesh.current.rotation.z = Math.PI * 0.25 + t * Math.PI * 1.5;
    mesh.current.rotation.x = t * Math.PI;
    mesh.current.position.set(1.8, 1.3 - t * 1.8, -1.2);
  });
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.2}>
      <mesh ref={mesh} position={[1.8, 1.3, -1.2]}>
        <capsuleGeometry args={[0.18, 0.6, 16, 32]} />
        <meshPhysicalMaterial
          color="#ffc97a"
          roughness={0.35}
          metalness={0.2}
          clearcoat={0.8}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

export function Orbs({ scroll }: SceneRefs) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.1;
    group.current.rotation.x = scroll.current * Math.PI;
  });
  const orbs = [
    { p: [1.4, 0.4, 0.8] as [number, number, number], c: "#ff7a6b", s: 0.09 },
    { p: [-1.5, -0.6, 0.6] as [number, number, number], c: "#9b8cff", s: 0.07 },
    { p: [0.2, 1.6, -0.4] as [number, number, number], c: "#6be5c8", s: 0.06 },
    { p: [-0.3, -1.7, 0.2] as [number, number, number], c: "#ffc97a", s: 0.08 },
    { p: [2.4, 0.1, 0.4] as [number, number, number], c: "#fff6ea", s: 0.05 },
  ];
  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.p}>
          <sphereGeometry args={[o.s, 24, 24]} />
          <meshStandardMaterial
            color={o.c}
            emissive={o.c}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
