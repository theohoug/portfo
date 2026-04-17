"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader({ onDone }: { onDone?: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    const start = performance.now();
    const dur = 1300;
    let raf = 0;
    const tick = (t: number) => {
      const e = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - e, 3);
      setCount(Math.round(eased * 100));
      if (e < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(async () => {
          await controls.start("exit");
          setDone(true);
          onDone?.();
        }, 150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [controls, onDone]);

  if (done) return null;

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
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-[#0a0617] p-6 md:p-10"
    >
      <div className="flex items-start justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/60 uppercase">
        <span>Juno Varga</span>
        <span>Studio · Berlin</span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-24 w-24 items-center justify-center"
        >
          <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8] blur-md" />
          <div className="relative h-20 w-20 rounded-full border border-white/20 bg-[#0a0617]/80 backdrop-blur-md" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display text-center text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-tight text-[#fff6ea]"
        >
          {count.toString().padStart(3, "0")}
        </motion.div>

        <div className="h-px w-52 overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8]"
            initial={{ width: 0 }}
            animate={{ width: `${count}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>

      <div className="flex items-end justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/60 uppercase">
        <span>Loading immersive experience</span>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ◉ Live
        </motion.span>
      </div>
    </motion.div>
  );
}
