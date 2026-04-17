"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

const BOOT_LINES = [
  "> juno.studio · v3.4.1",
  "> initializing interface ..",
  "> mounting display 01/06 ok",
  "> streaming shape library ..",
  "> handshake: pointer, scroll",
  "> palette: coral · violet · mint · amber",
  "> ready.",
];

const BLOCKS = "░▒▓█";

export function Loader() {
  const [shown, setShown] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const totalMs = 1400;
      const perLine = totalMs / BOOT_LINES.length;
      const start = performance.now();
      const pctRaf = () => {
        const p = Math.min(
          100,
          Math.round(((performance.now() - start) / (totalMs + 200)) * 100),
        );
        setPercent(p);
        if (p < 100 && !cancelled) requestAnimationFrame(pctRaf);
      };
      requestAnimationFrame(pctRaf);

      for (let i = 0; i < BOOT_LINES.length; i++) {
        const line = BOOT_LINES[i];
        const charDelay = perLine / Math.max(4, line.length);
        for (let c = 0; c <= line.length; c++) {
          if (cancelled) return;
          setTyped(line.slice(0, c));
          await wait(charDelay);
        }
        setShown((s) => [...s, line]);
        setTyped("");
      }

      await wait(120);
      await controls.start("exit");
      if (!cancelled) setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [controls]);

  if (done) return null;

  const blockBar = () => {
    const filled = Math.floor((percent / 100) * 40);
    let s = "";
    for (let i = 0; i < 40; i++) {
      if (i < filled) s += BLOCKS[Math.min(3, Math.floor(Math.random() * 3) + 1)];
      else s += "·";
    }
    return s;
  };

  return (
    <motion.div
      initial="initial"
      animate={controls}
      variants={{
        initial: { clipPath: "inset(0% 0% 0% 0%)" },
        exit: {
          clipPath: "inset(0% 0% 100% 0%)",
          transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
        },
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0617] p-6 md:p-10"
    >
      <div className="glass relative aspect-[16/10] w-full max-w-[920px] overflow-hidden rounded-[22px] md:rounded-[28px]">
        <div className="absolute inset-x-0 top-0 flex h-10 items-center justify-between border-b border-white/5 px-4 font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/60 uppercase md:h-12 md:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff7a6b]" />
            <span className="h-2 w-2 rounded-full bg-[#ffc97a]" />
            <span className="h-2 w-2 rounded-full bg-[#6be5c8]" />
            <span className="ml-3 text-[#f6eddf]/85">juno.studio ▸ boot</span>
          </div>
          <span className="hidden md:inline">tty0 · utf-8</span>
        </div>

        <div className="absolute inset-x-0 top-10 bottom-6 flex flex-col gap-6 p-6 md:top-12 md:bottom-8 md:p-10">
          <pre className="flex-1 font-mono text-[clamp(0.78rem,1.4vw,0.95rem)] leading-[1.7] whitespace-pre-wrap text-[#f6eddf]">
            {shown.join("\n")}
            {shown.length > 0 && "\n"}
            {typed}
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block h-[0.9em] w-[0.55ch] translate-y-[0.12em] bg-[#fff6ea]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          </pre>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
              <span>bootstrap</span>
              <span className="tabular-nums text-[#fff6ea]">
                {percent.toString().padStart(3, "0")}%
              </span>
            </div>
            <pre className="font-mono text-[clamp(0.8rem,1.5vw,1.05rem)] leading-none tracking-tight text-[#fff6ea]">
              [{blockBar()}]
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
