"use client";

import { useEffect, useRef } from "react";
import { renderAsciiShape } from "../ascii/renderer";
import { sphere, torus, torusKnot, type Point } from "../ascii/shapes";

export type ShapeKind = "sphere" | "torus" | "knot";

const POINT_COUNT = 1400;
const CACHE: Record<ShapeKind, Point[]> = {
  sphere: sphere(POINT_COUNT),
  torus: torus(POINT_COUNT),
  knot: torusKnot(POINT_COUNT),
};

export function AsciiShape({
  kind,
  palette,
  spinSpeed = 0.6,
  active = true,
}: {
  kind: ShapeKind;
  palette: [string, string, string];
  spinSpeed?: number;
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const cellW = 7.5;
    const cellH = 13;
    const fontSize = 13;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      w = Math.max(220, rect.width);
      h = Math.max(180, rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, "SF Mono", Menlo, monospace`;
      ctx.textBaseline = "top";
    };

    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(parent);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t0 = performance.now();

    const loop = (now: number) => {
      const time = (now - t0) / 1000;
      const points = CACHE[kind];
      const scale = Math.min(w, h) * 0.33;
      renderAsciiShape(
        ctx,
        points,
        {
          x: Math.sin(time * spinSpeed * 0.6) * 0.4,
          y: time * spinSpeed,
          z: Math.sin(time * spinSpeed * 0.3) * 0.15,
        },
        {
          width: w,
          height: h,
          cellW,
          cellH,
          scale,
          centerX: w / 2,
          centerY: h / 2,
          palette,
        },
      );
      if (!reduced && active) raf = requestAnimationFrame(loop);
    };

    if (active) raf = requestAnimationFrame(loop);
    else {
      loop(performance.now());
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [kind, palette, spinSpeed, active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
