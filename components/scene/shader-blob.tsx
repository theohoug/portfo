"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  uniform vec2 uPointer;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  // Classic 3D Perlin noise by Stefan Gustavson
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.0);
    Pi0=mod289(Pi0);Pi1=mod289(Pi1);
    vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.0);
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);
    vec4 gx0=ixy0*(1.0/7.0);vec4 gy0=fract(floor(gx0)*(1.0/7.0))-0.5;
    gx0=fract(gx0);vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.0));gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);
    vec4 gx1=ixy1*(1.0/7.0);vec4 gy1=fract(floor(gx1)*(1.0/7.0))-0.5;
    gx1=fract(gx1);vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.0));gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
    float n000=dot(g000,Pf0);
    float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
    float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
    float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
    float n111=dot(g111,Pf1);
    vec3 fade_xyz=fade(Pf0);
    vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
    vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
    float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
    return 2.2*n_xyz;
  }

  void main(){
    vec3 pos = position;
    float n = cnoise(pos * uFreq + vec3(uTime * 0.25, uTime * 0.18, uTime * 0.2));
    float n2 = cnoise(pos * (uFreq * 2.1) + vec3(-uTime * 0.3));
    float disp = uAmp * (n * 0.7 + n2 * 0.3);
    disp += 0.1 * (sin(pos.y * 3.0 + uTime) + cos(pos.x * 2.0 + uTime * 1.3));

    vec3 displaced = pos + normal * disp;
    // soft pull toward pointer
    displaced.xy += uPointer * 0.12 * (1.0 + disp);

    vNormal = normalize(normalMatrix * normal);
    vPosition = displaced;
    vDisplace = disp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uMix;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  void main(){
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.2);

    float t = smoothstep(-0.6, 0.6, vDisplace);
    vec3 base = mix(uColorA, uColorB, t);
    base = mix(base, uColorC, fresnel);

    // shimmer bands
    float bands = 0.5 + 0.5 * sin(vPosition.y * 6.0 + uTime * 1.2);
    base += 0.08 * bands * uColorC;

    // subtle grain
    float grain = fract(sin(dot(vPosition.xy, vec2(12.9898,78.233)) + uTime * 0.001) * 43758.5453);
    base += (grain - 0.5) * 0.02;

    float alpha = 0.92 + 0.08 * fresnel;
    gl_FragColor = vec4(base, alpha);
  }
`;

export function ShaderBlob({
  scroll,
  pointer,
}: {
  scroll: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.35 },
      uFreq: { value: 1.15 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#ff7a6b") },
      uColorB: { value: new THREE.Color("#9b8cff") },
      uColorC: { value: new THREE.Color("#6be5c8") },
      uMix: { value: 0 },
    }),
    [],
  );

  const paletteA = useMemo(
    () => [
      new THREE.Color("#ff7a6b"),
      new THREE.Color("#ffc97a"),
      new THREE.Color("#9b8cff"),
      new THREE.Color("#6be5c8"),
    ],
    [],
  );
  const paletteB = useMemo(
    () => [
      new THREE.Color("#9b8cff"),
      new THREE.Color("#ff7a6b"),
      new THREE.Color("#6be5c8"),
      new THREE.Color("#fff6ea"),
    ],
    [],
  );
  const paletteC = useMemo(
    () => [
      new THREE.Color("#6be5c8"),
      new THREE.Color("#9b8cff"),
      new THREE.Color("#ffc97a"),
      new THREE.Color("#ff7a6b"),
    ],
    [],
  );

  const smoothed = useRef({ scroll: 0, px: 0, py: 0 });

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const s = scroll.current;
    smoothed.current.scroll += (s - smoothed.current.scroll) * Math.min(1, delta * 4);
    smoothed.current.px += (pointer.current.x - smoothed.current.px) * Math.min(1, delta * 4);
    smoothed.current.py += (pointer.current.y - smoothed.current.py) * Math.min(1, delta * 4);

    const t = smoothed.current.scroll;
    const mat = mesh.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uAmp.value = 0.25 + t * 0.7;
    mat.uniforms.uFreq.value = 1.0 + Math.sin(t * 6.28) * 0.4 + t * 0.4;
    mat.uniforms.uPointer.value.set(smoothed.current.px, smoothed.current.py);

    const seg = Math.min(3, Math.floor(t * 4));
    const local = t * 4 - seg;
    const ease = local * local * (3 - 2 * local);
    mat.uniforms.uColorA.value.lerpColors(paletteA[seg], paletteA[(seg + 1) % 4], ease);
    mat.uniforms.uColorB.value.lerpColors(paletteB[seg], paletteB[(seg + 1) % 4], ease);
    mat.uniforms.uColorC.value.lerpColors(paletteC[seg], paletteC[(seg + 1) % 4], ease);

    mesh.current.rotation.y = t * Math.PI * 1.8 + smoothed.current.px * 0.3;
    mesh.current.rotation.x = Math.sin(t * Math.PI) * 0.6 + smoothed.current.py * 0.2;
    const scaleBase = size.width < 768 ? 0.9 : 1.2;
    const scale = scaleBase + t * 0.4;
    mesh.current.scale.setScalar(scale);
    mesh.current.position.x = -0.2 + Math.sin(t * Math.PI * 2) * 0.3;
    mesh.current.position.y = Math.cos(t * Math.PI * 1.5) * 0.25;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 64]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
