"use client";

import { useEffect, useRef } from "react";
import {
  sphere,
  torus,
  torusKnot,
  ribbon,
  wave,
  rotateX,
  rotateY,
  rotateZ,
  type Point,
} from "./shapes";

const CHARS = " .·:-=+xo*#%@";

function hexToRgb(h: string) {
  const s = h.replace("#", "");
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

function mix(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r},${g},${bl})`;
}
const PALETTES: Array<[string, string, string]> = [
  ["#ff7a6b", "#ffc9bf", "#fff6ea"],
  ["#9b8cff", "#c9bdff", "#fff6ea"],
  ["#6be5c8", "#9be5d0", "#fff6ea"],
  ["#ffc97a", "#ffe1b0", "#fff6ea"],
  ["#ff7a6b", "#9b8cff", "#6be5c8"],
];

export function AsciiScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const N = 2200;
    const shapes = [
      sphere(N),
      torus(N),
      torusKnot(N),
      ribbon(N),
      wave(N),
    ];

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let fontSize = 0;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      const mobile = width < 768;
      fontSize = mobile ? 12 : 15;
      cellW = mobile ? 7.5 : 9.5;
      cellH = mobile ? 12 : 15;
      cols = Math.ceil(width / cellW);
      rows = Math.ceil(height / cellH);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      ctx.font = `${fontSize}px ui-monospace, "SF Mono", Menlo, "Fira Mono", monospace`;
      ctx.textBaseline = "top";
    };

    setup();

    const scroll = { v: 0 };
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.v = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      const t = "touches" in e ? e.touches[0] : e;
      if (!t) return;
      pointer.targetX = (t.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -((t.clientY / window.innerHeight) * 2 - 1);
    };
    const onResize = () => setup();

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove as EventListener, {
      passive: true,
    });
    window.addEventListener("resize", onResize);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const zBuf = new Float32Array(0);
    const chBuf = new Uint8Array(0);
    const palIdx = new Uint8Array(0);
    let buffers = { zBuf, chBuf, palIdx };

    const ensureBuffers = () => {
      const size = cols * rows;
      if (buffers.zBuf.length !== size) {
        buffers = {
          zBuf: new Float32Array(size),
          chBuf: new Uint8Array(size),
          palIdx: new Uint8Array(size),
        };
      }
    };

    let smoothedScroll = 0;
    let time = 0;
    let last = performance.now();
    let raf = 0;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;

      smoothedScroll += (scroll.v - smoothedScroll) * Math.min(1, dt * 3);
      pointer.x += (pointer.targetX - pointer.x) * Math.min(1, dt * 3.5);
      pointer.y += (pointer.targetY - pointer.y) * Math.min(1, dt * 3.5);

      const s = smoothedScroll;
      const seg = Math.min(shapes.length - 1, Math.floor(s * (shapes.length - 0.0001)));
      const local = s * (shapes.length - 1) - seg;
      const eased = local * local * (3 - 2 * local);

      const shapeA = shapes[seg];
      const shapeB = shapes[Math.min(shapes.length - 1, seg + 1)];
      const n = shapeA.length;

      ensureBuffers();
      const { zBuf, chBuf, palIdx } = buffers;
      zBuf.fill(-Infinity);
      chBuf.fill(0);
      palIdx.fill(0);

      const rx = time * 0.12 + pointer.y * 0.6 + s * Math.PI * 1.2;
      const ry = time * 0.18 + pointer.x * 0.6 + s * Math.PI * 1.5;
      const rz = Math.sin(time * 0.2) * 0.08;

      const scale = Math.min(width, height) * 0.36;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const focal = 4;

      const palA = PALETTES[seg % PALETTES.length];
      const palB = PALETTES[(seg + 1) % PALETTES.length];

      for (let i = 0; i < n; i++) {
        const a = shapeA[i];
        const b = shapeB[i];
        let p: Point = {
          x: a.x + (b.x - a.x) * eased,
          y: a.y + (b.y - a.y) * eased,
          z: a.z + (b.z - a.z) * eased,
        };
        p = rotateX(p, rx);
        p = rotateY(p, ry);
        p = rotateZ(p, rz);

        const zf = focal / (focal + p.z);
        const sx = p.x * zf * scale + cx;
        const sy = p.y * zf * scale + cy;
        if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;

        const col = Math.floor(sx / cellW);
        const row = Math.floor(sy / cellH);
        const idx = row * cols + col;
        if (p.z > zBuf[idx]) {
          zBuf[idx] = p.z;
          const d = (p.z + 1) * 0.5;
          const ci = Math.min(
            CHARS.length - 1,
            Math.max(0, Math.floor(d * (CHARS.length - 1))),
          );
          chBuf[idx] = ci;
          palIdx[idx] = d > 0.5 ? 0 : d > 0.25 ? 1 : 2;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const pal: [string, string, string] = [
        mix(palA[0], palB[0], eased),
        mix(palA[1], palB[1], eased),
        mix(palA[2], palB[2], eased),
      ];

      for (let r = 0; r < rows; r++) {
        const y = r * cellH;
        let c = 0;
        while (c < cols) {
          while (c < cols && chBuf[r * cols + c] === 0) c++;
          if (c >= cols) break;
          const currentPal = palIdx[r * cols + c];
          const startCol = c;
          let str = "";
          while (
            c < cols &&
            chBuf[r * cols + c] > 0 &&
            palIdx[r * cols + c] === currentPal
          ) {
            str += CHARS[chBuf[r * cols + c]];
            c++;
          }
          ctx.fillStyle = pal[Math.min(2, currentPal)];
          ctx.fillText(str, startCol * cellW, y);
        }
      }

      if (!reducedMotion) raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0617]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(155,140,255,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,122,107,0.18),transparent_60%),radial-gradient(ellipse_at_center,rgba(107,229,200,0.08),transparent_70%)]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          mixBlendMode: "screen",
          filter: "blur(0.3px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,6,23,0.55)_100%)]" />
      <div className="grain-overlay" />
    </div>
  );
}
