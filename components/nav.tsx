"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Magnetic } from "./magnetic";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#studio", label: "Studio" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [shrunk, setShrunk] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setShrunk(v > 40);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 w-full max-w-[calc(100%-2rem)] md:max-w-fit"
    >
      <motion.nav
        animate={{
          paddingLeft: shrunk ? 20 : 24,
          paddingRight: shrunk ? 20 : 24,
          paddingTop: shrunk ? 10 : 14,
          paddingBottom: shrunk ? 10 : 14,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass flex items-center justify-between gap-6 rounded-full md:justify-start"
      >
        <Link
          href="#top"
          data-cursor
          data-cursor-label="home"
          className="flex items-center gap-2 text-[13px] tracking-tight"
        >
          <span className="relative inline-flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8] opacity-90 blur-[6px]" />
            <span className="relative h-3 w-3 rounded-full bg-[#fff6ea]" />
          </span>
          <span className="font-medium">Juno Varga</span>
        </Link>

        <ul className="hidden items-center gap-1 text-[13px] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Magnetic strength={10}>
                <Link
                  href={l.href}
                  data-cursor
                  className="relative inline-block rounded-full px-3 py-1.5 text-[#f6eddf]/75 transition hover:text-[#f6eddf]"
                >
                  {l.label}
                </Link>
              </Magnetic>
            </li>
          ))}
        </ul>

        <Link
          href="#contact"
          data-cursor
          data-cursor-label="say hi"
          className="hidden items-center gap-2 rounded-full bg-[#fff6ea] px-4 py-1.5 text-[12.5px] font-medium text-[#140a2e] transition hover:bg-white md:inline-flex"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#6be5c8] opacity-80" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#6be5c8]" />
          </span>
          Available
        </Link>
      </motion.nav>
    </motion.header>
  );
}
