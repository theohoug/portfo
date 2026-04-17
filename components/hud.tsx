"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Hud() {
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        `${d.getUTCHours().toString().padStart(2, "0")}:${d
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${d.getUTCSeconds().toString().padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed top-5 left-5 z-20 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/60 uppercase md:top-8 md:left-8"
      >
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#6be5c8] opacity-80" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-[#6be5c8]" />
        </span>
        Juno Varga · Studio
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed top-5 right-5 z-20 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/60 uppercase md:top-8 md:right-8"
      >
        <span className="hidden md:inline">UTC</span>
        <span className="tabular-nums text-[#fff6ea]/80">{now}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed bottom-5 left-5 z-20 font-mono text-[10px] leading-[1.6] tracking-[0.28em] text-[#f6eddf]/50 uppercase md:bottom-8 md:left-8"
      >
        <div>Berlin · 52.52° N 13.40° E</div>
        <div className="opacity-60">Q3 2026 · briefs open</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed right-5 bottom-5 z-20 text-right font-mono text-[10px] leading-[1.6] tracking-[0.28em] text-[#f6eddf]/50 uppercase md:right-8 md:bottom-8"
      >
        <div>scroll ↓ to narrate</div>
        <div className="opacity-60">06 chapters</div>
      </motion.div>
    </>
  );
}
