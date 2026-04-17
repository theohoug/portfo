"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { persona } from "@/lib/data";

export function Outro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  return (
    <section
      ref={ref}
      className="relative mx-auto flex w-full max-w-[96rem] flex-col items-center justify-center overflow-hidden px-6 py-40 text-center md:py-56"
    >
      <motion.div style={{ y, scale }} className="relative will-change-transform">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8] opacity-30 blur-3xl" />
        </div>
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/55 uppercase">
          05 / Let&apos;s collaborate
        </p>
        <h2 className="mt-6 font-display text-[clamp(3.5rem,14vw,14rem)] leading-[0.88] tracking-[-0.035em]">
          Make it{" "}
          <em className="text-gradient italic">unforgettable</em>
          <span className="text-[#ff7a6b]">.</span>
        </h2>
        <Link
          href={`mailto:${persona.email}`}
          data-cursor
          data-cursor-label="write"
          className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-[#fff6ea] backdrop-blur transition hover:bg-white/[0.08]"
        >
          {persona.email}
          <span className="h-1.5 w-1.5 rounded-full bg-[#6be5c8]" />
        </Link>
      </motion.div>
    </section>
  );
}
