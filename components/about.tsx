"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { persona, experience } from "@/lib/data";
import { Reveal, RevealText } from "./reveal";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-32 md:py-44"
    >
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
              <span className="h-px w-8 bg-[#f6eddf]/40" /> 02 / About
            </div>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-light tracking-[-0.02em]">
            <RevealText text="A developer with a designer's hands." />
            <br />
            <span className="font-display italic text-[#ffc97a]">
              <RevealText text="A designer with a developer's mind." delay={0.15} />
            </span>
          </h2>
        </div>
        <Reveal delay={0.2}>
          <div className="glass rounded-2xl px-5 py-3 font-mono text-[11px] tracking-wider text-[#f6eddf]/80 uppercase">
            {persona.handle} · {persona.location}
          </div>
        </Reveal>
      </header>

      <div className="grid gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <motion.div
            style={{ y: portraitY, rotate: portraitRotate }}
            className="relative aspect-[4/5] w-full will-change-transform"
          >
            <Portrait />
          </motion.div>
        </div>

        <div className="md:col-span-7 md:pt-16">
          <Reveal>
            <p className="text-2xl leading-[1.35] font-light text-[#f6eddf] md:text-3xl">
              I operate as an embedded designer-engineer —{" "}
              <em className="font-display text-[#ff9d8a]">
                the one translation layer between vision and ship
              </em>
              . I prototype in code, polish in Figma, and obsess over the 40ms
              that make an interface feel inhabited.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#f6eddf]/70">
              {persona.longBio}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {persona.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="glass rounded-2xl px-4 py-5">
                  <div className="font-display text-4xl text-[#fff6ea]">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] tracking-wider text-[#f6eddf]/60 uppercase">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <Reveal>
              <div className="mb-6 font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
                Selected experience
              </div>
            </Reveal>
            <ol className="divide-y divide-white/5">
              {experience.map((e, i) => (
                <Reveal key={e.role} delay={i * 0.08}>
                  <li
                    data-cursor
                    className="group grid grid-cols-12 items-baseline gap-4 py-5 transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="col-span-4 font-mono text-[11px] tracking-wider text-[#f6eddf]/55 md:col-span-3">
                      {e.year}
                    </span>
                    <div className="col-span-8 md:col-span-9">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="text-lg text-[#fff6ea]">{e.role}</span>
                        <span className="font-display text-[#b9a7d4] italic">
                          — {e.place}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-[#f6eddf]/55">
                        {e.detail}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Portrait() {
  return (
    <div className="glass relative h-full w-full overflow-hidden rounded-[32px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8] opacity-40" />

      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="aura" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#fff6ea" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffc9bf" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9b8cff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#140a2e" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#140a2e" stopOpacity="0.55" />
          </linearGradient>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <rect width="400" height="500" fill="url(#aura)" />

        <g filter="url(#blur1)" opacity="0.7">
          <circle cx="200" cy="180" r="120" fill="#ff9d8a" />
          <circle cx="120" cy="340" r="100" fill="#9b8cff" />
          <circle cx="280" cy="360" r="90" fill="#6be5c8" />
        </g>

        <ellipse cx="200" cy="200" rx="95" ry="108" fill="url(#body)" />
        <ellipse
          cx="200"
          cy="200"
          rx="95"
          ry="108"
          fill="none"
          stroke="#fff6ea"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        <path
          d="M 200 340 C 110 340, 80 420, 80 500 L 320 500 C 320 420, 290 340, 200 340 Z"
          fill="url(#body)"
        />
        <path
          d="M 200 340 C 110 340, 80 420, 80 500 L 320 500 C 320 420, 290 340, 200 340 Z"
          fill="none"
          stroke="#fff6ea"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        <g stroke="#fff6ea" strokeOpacity="0.25" fill="none">
          <circle cx="200" cy="250" r="170" />
          <circle cx="200" cy="250" r="210" />
        </g>

        <g
          fontFamily="var(--font-instrument-serif), serif"
          fill="#fff6ea"
          fillOpacity="0.85"
        >
          <text x="24" y="32" fontSize="13" letterSpacing="3">
            JV · STUDIO
          </text>
          <text x="24" y="480" fontSize="13" letterSpacing="3">
            ◉ ON AIR
          </text>
          <text
            x="376"
            y="32"
            fontSize="13"
            letterSpacing="3"
            textAnchor="end"
          >
            2020 — ∞
          </text>
          <text
            x="376"
            y="480"
            fontSize="13"
            letterSpacing="3"
            textAnchor="end"
          >
            N 52.52° E 13.40°
          </text>
        </g>
      </svg>

      <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
        <div className="glass-strong rounded-xl px-3 py-2 text-[10px] tracking-widest text-[#fff6ea] uppercase">
          self-portrait · synth
        </div>
        <div className="font-mono text-[10px] tracking-widest text-[#fff6ea]/70 uppercase">
          N° 042 / 100
        </div>
      </div>
    </div>
  );
}
