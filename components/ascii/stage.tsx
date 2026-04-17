"use client";

import { useEffect, useRef } from "react";
import { AsciiGrid, CHARS } from "./grid";
import {
  sphere,
  torus,
  torusKnot,
  ribbon,
  helix,
  heart,
  rotate,
  hash,
  type Point,
} from "./shapes";
import { scenes } from "./content";

const N = 1400;

export function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const shapes: Record<string, Point[]> = {
      sphere: sphere(N),
      torus: torus(N),
      knot: torusKnot(N),
      ribbon: ribbon(N),
      helix: helix(N),
      heart: heart(N),
    };
    const chaos: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < N; i++) {
      const a = hash(i) * Math.PI * 2;
      const b = hash(i + 7.3) * Math.PI - Math.PI / 2;
      chaos.push({
        x: Math.cos(a) * Math.cos(b),
        y: Math.sin(b),
        z: Math.sin(a) * Math.cos(b),
      });
    }

    const grid = new AsciiGrid();

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let cellW = 9, cellH = 15, fontSize = 14;
    let isMobile = false;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      isMobile = W < 740;
      fontSize = isMobile ? 11 : 14;
      cellW = isMobile ? 7 : 9;
      cellH = isMobile ? 12 : 15;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      grid.resize(Math.ceil(W / cellW), Math.ceil(H / cellH));
    };
    setup();

    const scroll = { v: 0 };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.v = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onMove = (e: MouseEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onResize = () => setup();

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = 0;
    let last = performance.now();
    let raf = 0;
    let sSmooth = 0;

    const rampIdx = (t: number) =>
      Math.max(1, Math.min(CHARS.length - 1, Math.floor(t * (CHARS.length - 1))));

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;

      sSmooth += (scroll.v - sSmooth) * Math.min(1, dt * 3);
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);

      const sMax = scenes.length;
      const raw = sSmooth * (sMax - 0.001);
      const seg = Math.min(sMax - 1, Math.floor(raw));
      const local = raw - seg;

      const sceneA = scenes[seg];
      const sceneB = scenes[Math.min(sMax - 1, seg + 1)];
      const shapeA = shapes[sceneA.shape];
      const shapeB = shapes[sceneB.shape];

      const edge = 0.15;
      const disint =
        local < edge
          ? 1 - local / edge
          : local > 1 - edge
            ? (local - (1 - edge)) / edge
            : 0;
      const prevSceneDominant = local < 0.5;
      const textScene = prevSceneDominant ? sceneA : sceneB;
      const textAppear = prevSceneDominant
        ? 1 - Math.min(1, Math.max(0, (0.5 - local) / 0.35))
        : Math.min(1, Math.max(0, (local - 0.5) / 0.35));
      const morphT = local < 0.5 ? 0 : 1;

      grid.clear();

      const minDim = Math.min(W, H);
      const scale = isMobile
        ? minDim * 0.28
        : Math.min(W * 0.32, H * 0.42);
      const shapeCx = isMobile ? W * 0.5 : W * 0.72;
      const shapeCy = isMobile ? H * 0.28 : H * 0.5;

      const rx = time * 0.25 + pointer.y * 0.6;
      const ry = time * 0.4 + pointer.x * 0.8 + sSmooth * Math.PI * 1.2;
      const rz = Math.sin(time * 0.18) * 0.1;

      const chaosAmp = disint * (isMobile ? 0.9 : 1.1);
      const focal = 3.2;

      for (let i = 0; i < N; i++) {
        const a = shapeA[i] ?? shapeA[shapeA.length - 1];
        const b = shapeB[i] ?? shapeB[shapeB.length - 1];
        const base = morphT === 0 ? a : b;
        const c = chaos[i];

        let p: Point = {
          x: base.x + c.x * chaosAmp * 1.8,
          y: base.y + c.y * chaosAmp * 1.8,
          z: base.z + c.z * chaosAmp * 1.8,
        };
        p = rotate(p, rx, ry, rz);

        const zf = focal / (focal + p.z);
        const sx = p.x * zf * scale + shapeCx;
        const sy = -p.y * zf * scale + shapeCy;

        if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
        const col = Math.floor(sx / cellW);
        const row = Math.floor(sy / cellH);
        const depthT = (p.z + 1) * 0.5;
        const ci = rampIdx(depthT * 0.9 + 0.1);
        const tone =
          depthT > 0.72 ? 3 : depthT > 0.5 ? 2 : depthT > 0.28 ? 1 : 1;
        grid.setZ(col, row, ci, tone as 0 | 1 | 2 | 3, p.z);
      }

      drawChrome(grid, {
        scene: textScene,
        sceneIndex: prevSceneDominant ? seg : Math.min(sMax - 1, seg + 1),
        total: sMax,
        scroll: sSmooth,
        appear: textAppear,
        time,
        mobile: isMobile,
      });

      ctx.fillStyle = "#0a0617";
      ctx.fillRect(0, 0, W, H);
      grid.render(ctx, cellW, cellH);

      if (!reduced) raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-0 h-full w-full"
    />
  );
}

type ChromeCtx = {
  scene: (typeof scenes)[number];
  sceneIndex: number;
  total: number;
  scroll: number;
  appear: number;
  time: number;
  mobile: boolean;
};

function drawChrome(grid: AsciiGrid, ctx: ChromeCtx) {
  const { scene, appear, time, mobile, sceneIndex, total, scroll } = ctx;

  const leftCol = mobile ? 2 : 4;
  const topRow = mobile ? 2 : 2;
  grid.writeText(leftCol, topRow, "JUNO VARGA", 3);
  grid.writeText(leftCol, topRow + 1, "studio of one · berlin", 1);

  const rightLabel = `${scene.chapter}`;
  grid.writeText(
    grid.cols - rightLabel.length - leftCol,
    topRow,
    rightLabel,
    2,
  );

  const segBarCol = leftCol;
  const segBarRow = topRow + 3;
  const barLen = Math.min(grid.cols - leftCol * 2, mobile ? 28 : 48);
  const filled = Math.floor(scroll * barLen);
  let bar = "";
  for (let i = 0; i < barLen; i++) bar += i < filled ? "█" : "·";
  grid.writeText(segBarCol, segBarRow, bar, 1);
  grid.writeText(
    segBarCol,
    segBarRow + 1,
    `chapter ${String(sceneIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    1,
  );

  const textStartRow = mobile
    ? Math.floor(grid.rows * 0.55)
    : Math.floor(grid.rows * 0.32);
  const textCol = leftCol;

  const titleTone: 0 | 1 | 2 | 3 = 3;
  const metaTone: 0 | 1 | 2 | 3 = 2;
  const bodyTone: 0 | 1 | 2 | 3 = 1;

  const revealChars = (text: string, progress: number): string => {
    const total = text.length;
    const count = Math.floor(progress * total);
    if (count >= total) return text;
    if (count <= 0) return "";
    return text.slice(0, count);
  };

  let row = textStartRow;
  for (let i = 0; i < scene.title.length; i++) {
    const t = Math.min(1, Math.max(0, appear * 1.6 - i * 0.08));
    const str = revealChars(scene.title[i], t);
    grid.writeText(textCol, row, str, titleTone);
    row += 2;
  }
  row += 1;
  for (let i = 0; i < scene.meta.length; i++) {
    const t = Math.min(1, Math.max(0, appear * 2 - 0.3 - i * 0.1));
    const str = revealChars(scene.meta[i].toUpperCase(), t);
    grid.writeText(textCol, row, str, metaTone);
    row += 1;
  }
  row += 2;
  for (let i = 0; i < scene.body.length; i++) {
    const t = Math.min(1, Math.max(0, appear * 2.2 - 0.55 - i * 0.08));
    const str = revealChars(scene.body[i], t);
    grid.writeText(textCol, row, str, bodyTone);
    row += 1;
  }

  const footerRow = grid.rows - 3;
  const blink = Math.floor(time * 2) % 2 === 0 ? "▍" : " ";
  grid.writeText(
    leftCol,
    footerRow,
    `scroll ${Math.round(scroll * 100).toString().padStart(3, "0")} %  ${blink}`,
    2,
  );
  const coord = "52.5200° N  13.4050° E";
  grid.writeText(grid.cols - coord.length - leftCol, footerRow, coord, 1);
}
