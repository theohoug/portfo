"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS: Record<string, string[]> = {
  L: [
    "█ █ █ █ █ ",
    "█         ",
    "█         ",
    "█         ",
    "█ █ █ █ █ ",
  ],
  O: [
    "  █ █ █   ",
    "█       █ ",
    "█       █ ",
    "█       █ ",
    "  █ █ █   ",
  ],
  A: [
    "  █ █     ",
    "█     █   ",
    "█ █ █ █   ",
    "█     █   ",
    "█     █   ",
  ],
  D: [
    "█ █ █     ",
    "█     █   ",
    "█     █   ",
    "█     █   ",
    "█ █ █     ",
  ],
  I: [
    "█ █ █ ",
    "  █   ",
    "  █   ",
    "  █   ",
    "█ █ █ ",
  ],
  N: [
    "█     █ ",
    "█ █   █ ",
    "█   █ █ ",
    "█     █ ",
    "█     █ ",
  ],
  G: [
    "  █ █ █   ",
    "█         ",
    "█   █ █ █ ",
    "█       █ ",
    "  █ █ █   ",
  ],
  " ": ["  ", "  ", "  ", "  ", "  "],
  ".": ["   ", "   ", "   ", "   ", " █ "],
};

function renderWord(word: string): string[] {
  const rows = ["", "", "", "", ""];
  for (const ch of word) {
    const glyph = GLYPHS[ch.toUpperCase()] ?? GLYPHS[" "];
    for (let r = 0; r < 5; r++) rows[r] += glyph[r];
  }
  return rows;
}

export function Loader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let cellW = 9, cellH = 15, fontSize = 14;

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      const mobile = W < 740;
      fontSize = mobile ? 11 : 14;
      cellW = mobile ? 7 : 9;
      cellH = mobile ? 12 : 15;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace`;
      ctx.textBaseline = "top";
    };
    setup();

    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    const word = renderWord("LOADING");
    const wordCols = word[0].length;
    const wordRows = word.length;

    const start = performance.now();
    const DURATION = 2400;
    let raf = 0;

    const loop = (now: number) => {
      const e = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - e, 2.5);
      const cols = Math.ceil(W / cellW);
      const rows = Math.ceil(H / cellH);
      const originCol = Math.floor((cols - wordCols) / 2);
      const originRow = Math.floor((rows - wordRows - 3) / 2);

      ctx.fillStyle = "#0a0617";
      ctx.fillRect(0, 0, W, H);

      const t = (now - start) / 1000;
      for (let r = 0; r < rows; r++) {
        let str = "";
        for (let c = 0; c < cols; c++) {
          const nx = (c * 0.12 + t * 0.4) % 8;
          const ny = (r * 0.2 + t * 0.15) % 8;
          const v = (Math.sin(nx) + Math.cos(ny)) * 0.5;
          str += v > 0.7 ? "·" : v > 0.3 ? "." : " ";
        }
        ctx.fillStyle = `rgba(246,237,223,0.08)`;
        ctx.fillText(str, 0, r * cellH);
      }

      for (let r = 0; r < wordRows; r++) {
        const line = word[r];
        const y = (originRow + r) * cellH;
        for (let c = 0; c < line.length; c++) {
          const ch = line[c];
          if (ch === " ") continue;
          const progress = c / wordCols;
          const visible = progress <= eased;
          if (!visible) continue;
          const alpha = 0.6 + 0.4 * Math.sin(t * 3 + c * 0.2);
          ctx.fillStyle = `rgba(246,237,223,${alpha.toFixed(2)})`;
          ctx.fillText(ch, (originCol + c) * cellW, y);
        }
      }

      const barRow = originRow + wordRows + 3;
      const barLen = Math.min(cols - 8, 60);
      const barStart = Math.floor((cols - barLen) / 2);
      const filled = Math.floor(eased * barLen);
      let bar = "";
      for (let i = 0; i < barLen; i++) bar += i < filled ? "█" : "░";
      ctx.fillStyle = `rgba(246,237,223,0.55)`;
      ctx.fillText(bar, barStart * cellW, barRow * cellH);

      const pct = `${Math.round(eased * 100).toString().padStart(3, "0")} %`;
      ctx.fillStyle = `rgba(246,237,223,0.9)`;
      ctx.fillText(
        pct,
        Math.floor((cols - pct.length) / 2) * cellW,
        (barRow + 2) * cellH,
      );

      const brandTop = "JUNO VARGA · STUDIO";
      ctx.fillStyle = `rgba(246,237,223,0.4)`;
      ctx.fillText(brandTop, 3 * cellW, 2 * cellH);
      const brandRight = "2026 / BERLIN · REMOTE";
      ctx.fillText(
        brandRight,
        (cols - brandRight.length - 3) * cellW,
        2 * cellH,
      );
      const bottom = "initialising interface ...";
      ctx.fillStyle = `rgba(246,237,223,0.35)`;
      ctx.fillText(
        bottom,
        Math.floor((cols - bottom.length) / 2) * cellW,
        (rows - 3) * cellH,
      );

      if (e < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setExiting(true);
        setTimeout(() => setVisible(false), 800);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-[#0a0617] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        clipPath: exiting ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
