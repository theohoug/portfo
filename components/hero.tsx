"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { persona } from "@/lib/data";
import { Magnetic } from "./magnetic";

const rotatingWords = ["motion", "shaders", "typography", "interaction", "systems"];

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const blobX = useTransform(sx, [-0.5, 0.5], [-40, 40]);
  const blobY = useTransform(sy, [-0.5, 0.5], [-40, 40]);
  const orbX = useTransform(sx, [-0.5, 0.5], [20, -20]);
  const orbY = useTransform(sy, [-0.5, 0.5], [20, -20]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      <motion.div
        style={{ x: blobX, y: blobY }}
        className="pointer-events-none absolute top-[18%] left-[8%] h-48 w-48 rounded-full bg-gradient-to-br from-[#ff7a6b] to-[#ffc97a] opacity-70 blur-3xl md:h-72 md:w-72"
      />
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="pointer-events-none absolute bottom-[14%] right-[6%] h-56 w-56 rounded-full bg-gradient-to-br from-[#9b8cff] to-[#6be5c8] opacity-60 blur-3xl md:h-80 md:w-80"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass mb-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase"
      >
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#6be5c8] opacity-80" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-[#6be5c8]" />
        </span>
        <span className="text-[#f6eddf]/85">{persona.availability}</span>
      </motion.div>

      <h1 className="relative z-10 max-w-[10ch] text-center text-[clamp(3rem,11vw,10rem)] leading-[0.92] font-light tracking-[-0.04em] md:max-w-[14ch]">
        <Word text="Interfaces" delay={0.35} />
        <br />
        <span className="font-display text-[#fff6ea] italic">
          <Word text="that" delay={0.55} />{" "}
          <Word text="breathe" delay={0.7} />
        </span>
        <br />
        <span className="inline-flex items-baseline gap-3">
          <Word text="through" delay={0.85} />
          <RotatingWord words={rotatingWords} />
        </span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex max-w-2xl flex-col items-center gap-8 text-center"
      >
        <p className="text-base leading-relaxed text-[#f6eddf]/70 md:text-lg">
          {persona.bio}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Magnetic strength={14}>
            <Link
              href="#work"
              data-cursor
              data-cursor-label="see work"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#fff6ea] px-6 py-3 text-sm font-medium text-[#140a2e] transition"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2">
                Browse the work
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </Magnetic>
          <Magnetic strength={14}>
            <Link
              href="#contact"
              data-cursor
              data-cursor-label="email"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-[#f6eddf]/90 backdrop-blur transition hover:border-white/30 hover:bg-white/5"
            >
              Start a project
            </Link>
          </Magnetic>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="inline-flex items-center gap-3"
        >
          <span className="h-5 w-px bg-gradient-to-b from-transparent via-[#fff6ea] to-transparent" />
          scroll
          <span className="h-5 w-px bg-gradient-to-b from-transparent via-[#fff6ea] to-transparent" />
        </motion.span>
      </div>

      <div className="absolute bottom-6 left-6 hidden text-[11px] font-mono tracking-wider text-[#f6eddf]/50 md:block">
        <span className="opacity-60">01 /</span> hero
      </div>
      <div className="absolute bottom-6 right-6 hidden text-right text-[11px] font-mono tracking-wider text-[#f6eddf]/50 md:block">
        <div>{persona.location}</div>
        <div className="opacity-60">52.52° N, 13.40° E</div>
      </div>
    </section>
  );
}

function Word({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden align-baseline">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function RotatingWord({ words }: { words: string[] }) {
  return (
    <span className="relative inline-grid h-[0.95em] place-items-start overflow-hidden align-baseline">
      <motion.span
        className="font-display text-[#ff7a6b] italic"
        initial={{ y: 0 }}
        animate={{ y: Array.from({ length: words.length + 1 }, (_, i) => `-${i * 100}%`) }}
        transition={{
          duration: words.length * 2.1,
          times: Array.from({ length: words.length + 1 }, (_, i) => i / words.length),
          ease: [0.83, 0, 0.17, 1],
          repeat: Infinity,
          repeatDelay: 0,
          delay: 1.3,
        }}
      >
        {words.concat(words[0]).map((w, i) => (
          <span key={i} className="block">
            {w}.
          </span>
        ))}
      </motion.span>
    </span>
  );
}
