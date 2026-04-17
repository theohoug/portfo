"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BlobBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(155,140,255,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,122,107,0.14),transparent_60%),radial-gradient(ellipse_at_center,rgba(107,229,200,0.08),transparent_60%)]" />

      <motion.div
        style={{ y: y1 }}
        className="animate-float-blob absolute -top-40 -left-40 h-[60vh] w-[60vh] rounded-full bg-[#ff7a6b] opacity-35 blur-[140px] will-change-transform"
      />
      <motion.div
        style={{ y: y2 }}
        className="animate-float-blob-slow absolute top-1/3 -right-32 h-[70vh] w-[70vh] rounded-full bg-[#9b8cff] opacity-30 blur-[160px] will-change-transform"
      />
      <motion.div
        style={{ y: y3 }}
        className="animate-float-blob absolute -bottom-40 left-1/4 h-[55vh] w-[55vh] rounded-full bg-[#6be5c8] opacity-25 blur-[140px] will-change-transform"
      />
      <motion.div
        style={{ y: y2 }}
        className="animate-float-blob-slow absolute top-[120vh] left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-[#ffc97a] opacity-20 blur-[160px] will-change-transform"
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden
      >
        <defs>
          <pattern
            id="grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke="#fff6ea"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="grain-overlay" />
    </div>
  );
}
