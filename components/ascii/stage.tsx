"use client";

import { useEffect, useRef } from "react";
import { AsciiGrid, CHARS } from "./grid";
import { GLYPHS, GLYPH_H, measureWord } from "./glyphs";

const INK = "246, 237, 223";

type Fish = {
  angle: number;
  angSpeed: number;
  radius: number;
  yBase: number;
  yAmp: number;
  yPhase: number;
  z: number;
};

function rand(i: number, s = 0) {
  const x = Math.sin(i * 91.27 + s * 53.1) * 43758.5453;
  return x - Math.floor(x);
}

const makeFish = (n: number): Fish[] => {
  const out: Fish[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      angle: rand(i, 1) * Math.PI * 2,
      angSpeed: (0.3 + rand(i, 2) * 0.5) * (rand(i, 3) > 0.5 ? 1 : -1),
      radius: 0.55 + rand(i, 4) * 0.55,
      yBase: (rand(i, 5) - 0.5) * 1.3,
      yAmp: 0.05 + rand(i, 6) * 0.18,
      yPhase: rand(i, 7) * Math.PI * 2,
      z: (rand(i, 8) - 0.5) * 0.6,
    });
  }
  return out;
};

const FISH_N = 40;
const TUBE_STEPS = 160;
const TUBE_RING = 14;

function rotateY(x: number, z: number, a: number): [number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, -x * s + z * c];
}
function rotateX(y: number, z: number, a: number): [number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [y * c - z * s, y * s + z * c];
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const fishes = makeFish(FISH_N);

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
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.v = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onResize = () => setup();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let time = 0;
    let last = performance.now();
    let raf = 0;
    let sSmooth = 0;

    const put = (c: number, r: number, ch: string, tone: 0 | 1 | 2 | 3) => {
      const idx =
        ch === "█"
          ? CHARS.length - 1
          : CHARS.indexOf(ch) >= 0
            ? CHARS.indexOf(ch)
            : CHARS.length - 2;
      grid.setChar(c, r, idx, tone);
    };

    const writeGlyphsPartial = (
      word: string,
      col: number,
      row: number,
      maxCols: number,
      tone: 0 | 1 | 2 | 3,
    ) => {
      let x = col;
      let drawn = 0;
      for (const ch of word.toUpperCase()) {
        const g = GLYPHS[ch] ?? GLYPHS[" "];
        const gw = g[0].length;
        for (let r = 0; r < g.length; r++) {
          const line = g[r];
          for (let c = 0; c < line.length; c++) {
            if (drawn + c >= maxCols) break;
            const gc = line[c];
            if (gc !== " ") put(x + c, row + r, gc, tone);
          }
        }
        x += gw;
        drawn += gw;
        if (drawn >= maxCols) break;
      }
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      sSmooth += (scroll.v - sSmooth) * Math.min(1, dt * 5);
      const s = sSmooth;

      grid.clear();

      const minDim = Math.min(W, H);
      const cx = W * 0.5;
      const cy = H * 0.5;
      const scale = minDim * 0.33;
      const focal = 3.2;

      // phase mapping
      const introVis = 1 - smoothstep(0.22, 0.38, s);
      const tubeVis = smoothstep(0.22, 0.38, s) * (1 - smoothstep(0.72, 0.82, s));
      const diveT = smoothstep(0.38, 0.66, s);
      const scene2Vis = smoothstep(0.7, 0.88, s);

      const yaw = time * 0.1 + s * Math.PI * 0.5;
      const pitch = Math.sin(time * 0.15) * 0.1;

      // ——— Fish ———
      if (introVis > 0.02) {
        for (let i = 0; i < FISH_N; i++) {
          const f = fishes[i];
          const a = f.angle + time * f.angSpeed;
          const bob = Math.sin(time * 1.4 + f.yPhase) * f.yAmp;
          let px = Math.cos(a) * f.radius;
          let py = f.yBase + bob;
          let pz = f.z;
          [px, pz] = rotateY(px, pz, yaw);
          [py, pz] = rotateX(py, pz, pitch);

          const zf = focal / (focal + pz);
          const sx = px * zf * scale + cx;
          const sy = -py * zf * scale + cy;
          if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;

          const nextA = a + 0.04;
          const nextRaw = Math.cos(nextA) * f.radius;
          const [nx2] = rotateY(nextRaw, pz, yaw);
          const vx = nx2 * zf * scale + cx - sx;

          const spriteR = i % 3 === 0 ? "><>>" : "><>";
          const spriteL = i % 3 === 0 ? "<<><" : "<><";
          const sprite = vx >= 0 ? spriteR : spriteL;

          const tone: 0 | 1 | 2 | 3 =
            introVis < 0.3 ? 1 : pz > 0.2 ? 3 : pz > -0.1 ? 2 : 1;

          const col = Math.floor(sx / cellW);
          const row = Math.floor(sy / cellH);
          const startC = col - Math.floor(sprite.length / 2);
          grid.writeText(startC, row, sprite, tone);
        }
      }

      // ——— Tube dive ———
      if (tubeVis > 0.02) {
        const tubeR = isMobile ? 0.55 : 0.5;
        // Camera travels along +z through a tube that spans [-1.2, 2.2]
        const camZ = -1.2 + diveT * 3.4;
        for (let i = 0; i < TUBE_STEPS; i++) {
          const zBase = -1.2 + (i / TUBE_STEPS) * 3.4;
          for (let j = 0; j < TUBE_RING; j++) {
            const theta =
              (j / TUBE_RING) * Math.PI * 2 + time * 0.6 + i * 0.12;
            let wx = Math.cos(theta) * tubeR;
            let wy = Math.sin(theta) * tubeR;
            let wz = zBase;

            // formation from fish: before dive, tube rotates with yaw
            if (diveT < 0.12) {
              [wx, wz] = rotateY(wx, wz, yaw);
              [wy, wz] = rotateX(wy, wz, pitch);
            }

            const relZ = wz - camZ;
            if (relZ < -0.05 || relZ > 3.5) continue;

            const zf = focal / (focal + relZ);
            const sx = wx * zf * scale * 1.25 + cx;
            const sy = -wy * zf * scale * 1.25 + cy;
            if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;

            const col = Math.floor(sx / cellW);
            const row = Math.floor(sy / cellH);
            const nearness = Math.max(0, Math.min(1, 1 - relZ / 3.5));
            const ci = Math.max(
              1,
              Math.min(
                CHARS.length - 1,
                Math.floor(Math.pow(nearness, 1.3) * (CHARS.length - 1)),
              ),
            );
            const tone: 0 | 1 | 2 | 3 =
              tubeVis < 0.15
                ? 1
                : nearness > 0.7
                  ? 3
                  : nearness > 0.4
                    ? 2
                    : 1;
            grid.setZ(col, row, ci, tone, -relZ);
          }
        }
      }

      // ——— Scene 2 shape (rotating sphere) ———
      if (scene2Vis > 0.03) {
        const lat = 20;
        const lon = 56;
        const shapeCx = isMobile ? W * 0.5 : W * 0.75;
        const shapeCy = isMobile ? H * 0.32 : H * 0.5;
        const shapeScale =
          (isMobile ? minDim * 0.22 : minDim * 0.3) * scene2Vis;
        const ry = time * 0.3 + s * Math.PI * 1.5;
        const rx = time * 0.18;
        for (let i = 0; i < lat; i++) {
          const phi = (i / (lat - 1)) * Math.PI - Math.PI / 2;
          for (let j = 0; j < lon; j++) {
            const theta = (j / lon) * Math.PI * 2;
            const px0 = Math.cos(phi) * Math.cos(theta);
            const py0 = Math.sin(phi);
            const pz0 = Math.cos(phi) * Math.sin(theta);
            const [x1, z1] = rotateY(px0, pz0, ry);
            const [y2, z2] = rotateX(py0, z1, rx);
            const px = x1, py = y2, pz = z2;
            const zf = focal / (focal + pz);
            const sx = px * zf * shapeScale + shapeCx;
            const sy = -py * zf * shapeScale + shapeCy;
            if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
            const col = Math.floor(sx / cellW);
            const row = Math.floor(sy / cellH);
            const depthT = (pz + 1) * 0.5;
            const ci = Math.max(
              1,
              Math.min(
                CHARS.length - 1,
                Math.floor(depthT * (CHARS.length - 1)),
              ),
            );
            const tone: 0 | 1 | 2 | 3 =
              depthT > 0.72 ? 3 : depthT > 0.45 ? 2 : 1;
            grid.setZ(col, row, ci, tone, pz);
          }
        }
      }

      // ——— Overlay ———
      const cols = grid.cols;
      const rows = grid.rows;
      const pad = isMobile ? 2 : 4;

      grid.writeText(pad, 2, "JUNO VARGA · STUDIO", 3);
      grid.writeText(pad, 3, "creative developer · berlin", 1);
      const rightTitle = "2026 · AVAILABLE";
      grid.writeText(cols - rightTitle.length - pad, 2, rightTitle, 2);

      const pct = Math.round(s * 100).toString().padStart(3, "0");
      grid.writeText(pad, rows - 3, `scroll ${pct} %`, 2);
      const hint =
        s < 0.1
          ? "scroll to dive ↓"
          : s > 0.9
            ? "transmission complete"
            : s < 0.35
              ? "forming tunnel"
              : s < 0.7
                ? "passing through"
                : "emerging";
      grid.writeText(cols - hint.length - pad, rows - 3, hint, 1);

      if (introVis > 0.1) {
        const label = "A SCHOOL OF IDEAS";
        grid.writeText(
          Math.floor((cols - label.length) / 2),
          Math.floor(rows * 0.1),
          label,
          3,
        );
        const sub = "scroll ↓ to plunge in";
        grid.writeText(
          Math.floor((cols - sub.length) / 2),
          Math.floor(rows * 0.1) + 2,
          sub,
          1,
        );
      }

      if (scene2Vis > 0.05) {
        const words = ["JUNO", "VARGA"];
        const totalH = GLYPH_H * words.length + (words.length - 1);
        const leftCol = isMobile ? 2 : Math.floor(cols * 0.05);
        const topRow = isMobile
          ? Math.floor(rows * 0.58)
          : Math.floor((rows - totalH) / 2);
        let curRow = topRow;
        const reveal = Math.min(1, scene2Vis * 1.4);
        for (const w of words) {
          const wcols = measureWord(w);
          const showCols = Math.floor(wcols * reveal);
          writeGlyphsPartial(w, leftCol, curRow, showCols, 3);
          curRow += GLYPH_H + 1;
        }

        const metaRow = topRow + totalH + 2;
        const meta = [
          "CREATIVE DEVELOPER · MOTION ENGINEER",
          "crafting interfaces that feel alive.",
          "",
          "HELLO@JUNOVARGA.STUDIO",
        ];
        const metaReveal = Math.min(1, (scene2Vis - 0.3) * 2);
        for (let i = 0; i < meta.length; i++) {
          const line = meta[i];
          const t = Math.min(1, Math.max(0, metaReveal * 1.6 - i * 0.2));
          const shown = line.slice(0, Math.floor(line.length * t));
          const tone: 0 | 1 | 2 | 3 = i === 3 ? 3 : i === 0 ? 2 : 1;
          grid.writeText(leftCol, metaRow + i, shown, tone);
        }
      }

      // ——— Paint ———
      ctx.fillStyle = "#0a0617";
      ctx.fillRect(0, 0, W, H);

      // faint ambient noise field
      ctx.fillStyle = `rgba(${INK}, 0.05)`;
      for (let r = 0; r < rows; r++) {
        let str = "";
        for (let c = 0; c < cols; c++) {
          const n = Math.sin(c * 0.17 + r * 0.11 + time * 0.25);
          str += n > 0.6 ? "·" : n > 0.2 ? "." : " ";
        }
        ctx.fillText(str, 0, r * cellH);
      }

      grid.render(ctx, cellW, cellH);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
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
