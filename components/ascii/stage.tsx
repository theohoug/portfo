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
      angSpeed: (0.35 + rand(i, 2) * 0.5) * (rand(i, 3) > 0.5 ? 1 : -1),
      radius: 0.5 + rand(i, 4) * 0.55,
      yBase: (rand(i, 5) - 0.5) * 1.4,
      yAmp: 0.06 + rand(i, 6) * 0.2,
      yPhase: rand(i, 7) * Math.PI * 2,
      z: (rand(i, 8) - 0.5) * 0.8,
    });
  }
  return out;
};

const FISH_N = 38;

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

const easeInOut = (t: number) => {
  t = Math.min(1, Math.max(0, t));
  return t * t * (3 - 2 * t);
};

// Camera Z position through the journey.
// Fish float at z≈0. Tube spans z=0..20. Arrival scene at z=24.
function cameraZ(s: number): number {
  // phase 0 — fish: camera at z=-6, steady
  if (s < 0.12) return -6;
  // phase 1 — approach: camera eases from -6 to -0.5 (mouth growing)
  if (s < 0.30) {
    const t = (s - 0.12) / 0.18;
    const eased = t * t;
    return -6 + eased * 5.5;
  }
  // phase 2 — dive: crosses entrance, accelerates through 0..18
  if (s < 0.72) {
    const t = (s - 0.30) / 0.42;
    const eased = easeInOut(t);
    return -0.5 + eased * 18.5;
  }
  // phase 3 — emerge: decelerates past 20 toward 24
  if (s < 0.88) {
    const t = (s - 0.72) / 0.16;
    const eased = 1 - Math.pow(1 - t, 2.5);
    return 18 + eased * 6;
  }
  // phase 4 — arrived
  return 24;
}

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
    let prevCamZ = cameraZ(0);

    const put = (c: number, r: number, ch: string, tone: 0 | 1 | 2 | 3) => {
      const idx = ch === " " ? 0
        : CHARS.indexOf(ch) >= 0 ? CHARS.indexOf(ch)
        : CHARS.length - 1;
      grid.setChar(c, r, idx, tone);
    };

    const putZ = (c: number, r: number, ch: string, tone: 0 | 1 | 2 | 3, z: number) => {
      const idx = ch === " " ? 0
        : CHARS.indexOf(ch) >= 0 ? CHARS.indexOf(ch)
        : CHARS.length - 1;
      grid.setZ(c, r, idx, tone, z);
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
      sSmooth += (scroll.v - sSmooth) * Math.min(1, dt * 3.2);
      const s = sSmooth;

      grid.clear();

      const minDim = Math.min(W, H);
      const cx = W * 0.5;
      const cy = H * 0.5;
      const focal = 3.0;

      // Phases
      const fishVis = 1 - smoothstep(0.10, 0.22, s);
      const formingVis = smoothstep(0.10, 0.22, s) * (1 - smoothstep(0.26, 0.32, s));
      const sphereVis = smoothstep(0.62, 0.88, s);
      const scene2TextVis = smoothstep(0.78, 0.95, s);

      const camZ = cameraZ(s);
      const camSpeed = Math.abs(camZ - prevCamZ) / Math.max(dt, 0.001);
      prevCamZ = camZ;

      const yaw = time * 0.08 + s * 0.4;
      const pitch = Math.sin(time * 0.12) * 0.06;

      // ——— Fish school ———
      if (fishVis > 0.02) {
        const scaleF = minDim * 0.34;
        for (let i = 0; i < FISH_N; i++) {
          const f = fishes[i];
          const a = f.angle + time * f.angSpeed;
          const bob = Math.sin(time * 1.4 + f.yPhase) * f.yAmp;
          let px = Math.cos(a) * f.radius;
          let py = f.yBase + bob;
          let pz = f.z;
          // as forming increases, compress radius to 0 (fish pulled into center)
          const pull = 1 - smoothstep(0.10, 0.24, s);
          px *= pull;
          py *= pull;
          [px, pz] = rotateY(px, pz, yaw);
          [py, pz] = rotateX(py, pz, pitch);

          const zf = focal / (focal + pz - camZ);
          if (zf <= 0) continue;
          const sx = px * zf * scaleF + cx;
          const sy = -py * zf * scaleF + cy;
          if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;

          // direction of motion at next step
          const a2 = a + 0.04 * Math.sign(f.angSpeed || 1);
          const nx = Math.cos(a2) * f.radius * pull;
          const [nxr] = rotateY(nx, pz, yaw);
          const vx = nxr * zf * scaleF + cx - sx;

          const spriteR = ["><>", "><>>", "≡>"][i % 3];
          const spriteL = ["<><", "<<><", "<≡"][i % 3];
          const sprite = vx >= 0 ? spriteR : spriteL;

          const tone: 0 | 1 | 2 | 3 =
            fishVis < 0.25 ? 1 : pz > 0.1 ? 3 : pz > -0.2 ? 2 : 1;

          const col = Math.floor(sx / cellW);
          const row = Math.floor(sy / cellH);
          grid.writeText(col - Math.floor(sprite.length / 2), row, sprite, tone);
        }
      }

      // ——— Tube (visible from approach through emerge) ———
      // Tube geometry: cylinder radius 1.0, z=[0, 20], dense rings with twist.
      if (s > 0.08 && s < 0.90) {
        const tubeR = 1.0;
        const tubeScale = minDim * 0.58; // large enough to envelop when close
        const zMin = 0;
        const zMax = 20;
        const nRings = 72;
        const perRing = 22;

        for (let i = 0; i < nRings; i++) {
          const t = i / (nRings - 1);
          const wz = zMin + t * (zMax - zMin);
          const relZ = wz - camZ;
          if (relZ < 0.05) continue; // behind camera
          if (relZ > 12) continue; // too far to matter

          // twist that accumulates with distance — gives sense of rotation
          const twist = wz * 0.24 + time * 0.3 + s * 2.2;

          // ring intensity: feature rings (every 6th) get different char
          const isFeature = i % 6 === 0;
          const isTick = i % 3 === 0;

          const depthT = Math.max(0, Math.min(1, 1 - relZ / 12));
          const ringFade =
            // fade in as approach, out as exit
            smoothstep(0.08, 0.30, s) *
            (1 - smoothstep(0.80, 0.90, s));

          for (let j = 0; j < perRing; j++) {
            const phi = (j / perRing) * Math.PI * 2 + twist;
            const wx = Math.cos(phi) * tubeR;
            const wy = Math.sin(phi) * tubeR;

            // optional gate markers (vertical ribs) at feature rings
            const gateFactor = isFeature ? 1 : isTick ? 0.7 : 0.4;

            const zf = focal / (focal + relZ);
            const sx = wx * zf * tubeScale + cx;
            const sy = -wy * zf * tubeScale + cy;
            if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;

            const col = Math.floor(sx / cellW);
            const row = Math.floor(sy / cellH);

            const charRamp = " .:;+*#%@";
            const rampT = Math.pow(depthT, 1.2) * gateFactor * ringFade;
            const ci = Math.floor(rampT * (charRamp.length - 1));
            if (ci < 1) continue;
            const ch = charRamp[ci];
            const tone: 0 | 1 | 2 | 3 =
              depthT > 0.7 && isFeature ? 3
              : depthT > 0.5 ? 2
              : depthT > 0.25 ? 1 : 0;
            if (tone === 0) continue;
            putZ(col, row, ch, tone, -relZ);

            // Speed streaks: radially outward when moving fast
            if (camSpeed > 2 && depthT > 0.3) {
              const dx = sx - cx;
              const dy = sy - cy;
              const len = Math.hypot(dx, dy) || 1;
              const ux = dx / len, uy = dy / len;
              const stretchCells = Math.min(
                3,
                Math.floor(camSpeed / 6) + 1,
              );
              for (let k = 1; k <= stretchCells; k++) {
                const tcol = col + Math.round((ux * k * cellW) / cellW);
                const trow = row + Math.round((uy * k * cellH) / cellH);
                const streakTone: 0 | 1 | 2 | 3 =
                  k === 1 ? (Math.max(1, tone - 1) as 0 | 1 | 2 | 3) : 1;
                putZ(tcol, trow, charRamp[Math.max(1, ci - k)], streakTone, -relZ - 0.05 * k);
              }
            }
          }
        }

        // Central vanishing point glow — small dot growing as we approach
        if (s < 0.40) {
          const glowDepth = Math.max(0.01, -camZ);
          const zf = focal / (focal + glowDepth);
          const radius = Math.max(2, 12 * zf);
          for (let yy = -radius; yy <= radius; yy += cellH) {
            for (let xx = -radius; xx <= radius; xx += cellW) {
              const d = Math.hypot(xx, yy);
              if (d > radius) continue;
              const col = Math.floor((cx + xx) / cellW);
              const row = Math.floor((cy + yy) / cellH);
              const t2 = 1 - d / radius;
              const ci = Math.floor(t2 * 8);
              const ch = " .:;+*#%@"[ci] ?? "·";
              if (ch === " ") continue;
              const tone: 0 | 1 | 2 | 3 = t2 > 0.6 ? 3 : t2 > 0.3 ? 2 : 1;
              putZ(col, row, ch, tone, 5);
            }
          }
        }
      }

      // ——— Arrival sphere (emerges from tunnel end) ———
      if (sphereVis > 0.02) {
        const lat = 20;
        const lon = 56;
        // Sphere world position
        const sphereWz = 22 - camZ; // relative to cam
        if (sphereWz > 0.05) {
          const shapeCx = isMobile ? cx : W * 0.72;
          const shapeCy = isMobile ? H * 0.32 : cy;
          const ry = time * 0.3 + s * Math.PI * 2;
          const rx = time * 0.18;
          const baseScale = isMobile ? minDim * 0.28 : minDim * 0.34;
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
              // convert to world: sphere is at (shape cx/cy, z=sphereWz+pz)
              const totalZ = sphereWz + pz * 0.6;
              if (totalZ < 0.05) continue;
              const zf = focal / (focal + totalZ);
              const sx = px * zf * baseScale + shapeCx;
              const sy = -py * zf * baseScale + shapeCy;
              if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
              const col = Math.floor(sx / cellW);
              const row = Math.floor(sy / cellH);
              const depthT = (pz + 1) * 0.5;
              const charRamp = " .·:;+*o#%@";
              const ci = Math.max(1, Math.floor(depthT * (charRamp.length - 1)));
              const ch = charRamp[ci];
              const tone: 0 | 1 | 2 | 3 =
                depthT > 0.72 ? 3 : depthT > 0.45 ? 2 : 1;
              putZ(col, row, ch, tone, -totalZ);
            }
          }
        }
      }

      // ——— Overlays / HUD ———
      const cols = grid.cols;
      const rows = grid.rows;
      const pad = isMobile ? 2 : 4;

      grid.writeText(pad, 2, "JUNO VARGA · STUDIO", 3);
      grid.writeText(pad, 3, "creative developer · berlin", 1);
      const rightTitle = "2026 · AVAILABLE";
      grid.writeText(cols - rightTitle.length - pad, 2, rightTitle, 2);

      // Chapter indicator
      const chapters = ["fish", "forming", "dive", "emerge", "arrive"];
      const chapterIdx = Math.min(
        chapters.length - 1,
        Math.floor(s * chapters.length - 0.001),
      );
      const dotCol = cols - pad - 1;
      for (let i = 0; i < chapters.length; i++) {
        const activeDot = i === chapterIdx;
        const row = Math.floor(rows / 2) - Math.floor(chapters.length / 2) + i * 2;
        grid.writeText(
          dotCol - chapters[i].length - 2,
          row,
          activeDot ? chapters[i].toUpperCase() : chapters[i],
          activeDot ? 3 : 1,
        );
        grid.writeText(dotCol, row, activeDot ? "●" : "○", activeDot ? 3 : 1);
      }

      // Top center phase label (ambient)
      if (fishVis > 0.3) {
        const label = "A SCHOOL OF IDEAS";
        grid.writeText(Math.floor((cols - label.length) / 2), Math.floor(rows * 0.12), label, 3);
        const sub = "scroll ↓ to dive in";
        grid.writeText(Math.floor((cols - sub.length) / 2), Math.floor(rows * 0.12) + 2, sub, 1);
      }
      if (s > 0.30 && s < 0.70) {
        const label = "PASSING THROUGH";
        grid.writeText(Math.floor((cols - label.length) / 2), Math.floor(rows * 0.12), label, 2);
      }

      // ——— Big ASCII name + text (scene 2) ———
      if (scene2TextVis > 0.03) {
        const words = ["JUNO", "VARGA"];
        const totalH = GLYPH_H * words.length + (words.length - 1);
        const leftCol = isMobile ? 2 : Math.floor(cols * 0.05);
        const topRow = isMobile
          ? Math.floor(rows * 0.6)
          : Math.floor((rows - totalH) / 2);
        let curRow = topRow;
        const reveal = Math.min(1, scene2TextVis * 1.6);
        for (const w of words) {
          const wcols = measureWord(w);
          const showCols = Math.floor(wcols * reveal);
          writeGlyphsPartial(w, leftCol, curRow, showCols, 3);
          curRow += GLYPH_H + 1;
        }
        const metaRow = topRow + totalH + 2;
        const meta = [
          "CREATIVE DEVELOPER · MOTION ENGINEER",
          "crafting interfaces that feel alive",
          "",
          "HELLO@JUNOVARGA.STUDIO",
        ];
        const metaReveal = Math.min(1, (scene2TextVis - 0.2) * 2);
        for (let i = 0; i < meta.length; i++) {
          const line = meta[i];
          const t = Math.min(1, Math.max(0, metaReveal * 1.6 - i * 0.2));
          const shown = line.slice(0, Math.floor(line.length * t));
          const tone: 0 | 1 | 2 | 3 = i === 3 ? 3 : i === 0 ? 2 : 1;
          grid.writeText(leftCol, metaRow + i, shown, tone);
        }
      }

      // Footer
      const pct = Math.round(s * 100).toString().padStart(3, "0");
      grid.writeText(pad, rows - 3, `${pct} %`, 2);
      const hint =
        s < 0.10 ? "scroll to dive ↓"
        : s > 0.90 ? "transmission complete"
        : s < 0.30 ? "approaching"
        : s < 0.72 ? "inside"
        : "emerging";
      grid.writeText(cols - hint.length - pad, rows - 3, hint, 1);

      // ——— Paint ———
      ctx.fillStyle = "#0a0617";
      ctx.fillRect(0, 0, W, H);

      // ambient noise, very faint
      ctx.fillStyle = `rgba(${INK}, 0.045)`;
      for (let r = 0; r < rows; r++) {
        let str = "";
        for (let c = 0; c < cols; c++) {
          const n = Math.sin(c * 0.17 + r * 0.11 + time * 0.25);
          str += n > 0.65 ? "·" : n > 0.25 ? "." : " ";
        }
        ctx.fillText(str, 0, r * cellH);
      }

      grid.render(ctx, cellW, cellH);

      // Vignette
      const grad = ctx.createRadialGradient(cx, cy, minDim * 0.2, cx, cy, minDim * 0.75);
      grad.addColorStop(0, "rgba(10,6,23,0)");
      grad.addColorStop(1, "rgba(10,6,23,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

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
