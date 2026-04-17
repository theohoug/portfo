"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
  const dotX = useSpring(x, { damping: 30, stiffness: 900, mass: 0.3 });
  const dotY = useSpring(y, { damping: 30, stiffness: 900, mass: 0.3 });
  const ringX = useSpring(x, springConfig);
  const ringY = useSpring(y, springConfig);

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setVisible(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest<HTMLElement>("[data-cursor]");
      if (trigger) {
        setHovering(true);
        const l = trigger.getAttribute("data-cursor-label");
        setLabel(l && l.length > 0 ? l : null);
      } else {
        setHovering(false);
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ translateX: ringX, translateY: ringY }}
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      >
        <motion.div
          animate={{
            width: hovering ? 72 : 28,
            height: hovering ? 72 : 28,
            borderColor: hovering
              ? "rgba(255, 246, 234, 0.9)"
              : "rgba(255, 246, 234, 0.45)",
          }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
        >
          {label ? (
            <span className="text-[10px] font-medium tracking-wider uppercase text-[#fff6ea]">
              {label}
            </span>
          ) : null}
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        style={{ translateX: dotX, translateY: dotY }}
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff6ea] mix-blend-difference"
      />
    </>
  );
}
