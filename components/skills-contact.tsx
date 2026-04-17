"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { persona, skills } from "@/lib/data";
import { Reveal, RevealText } from "./reveal";
import { Magnetic } from "./magnetic";

export function SkillsContact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section
      id="studio"
      ref={ref}
      className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-36"
    >
      <header className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
              <span className="h-px w-8 bg-[#f6eddf]/40" /> 04 / Studio · toolbox
            </div>
          </Reveal>
          <h2 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-light tracking-[-0.02em]">
            <RevealText text="The stack I use to make" />
            <br />
            <span className="font-display italic text-[#ffb39d]">
              <RevealText text="pixels feel alive." delay={0.15} />
            </span>
          </h2>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-12">
        <div className="glass relative overflow-hidden rounded-[28px] p-8 md:col-span-7 md:p-10">
          <div className="grid gap-10 md:grid-cols-2">
            <SkillGroup title="Craft" tint="#ff7a6b" items={skills.craft} />
            <SkillGroup title="Motion" tint="#ffc97a" items={skills.motion} />
            <SkillGroup title="Graphics" tint="#6be5c8" items={skills.graphics} />
            <SkillGroup title="Design" tint="#9b8cff" items={skills.design} />
          </div>
          <div className="mt-10 border-t border-white/5 pt-6">
            <SkillGroup title="Living on the edges" tint="#fff6ea" items={skills.edges} horizontal />
          </div>
        </div>

        <div
          id="contact"
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#ff9d8a] via-[#9b8cff] to-[#6be5c8] p-8 md:col-span-5 md:p-10"
        >
          <motion.div
            aria-hidden
            style={{ rotate: ringRotate }}
            className="pointer-events-none absolute -top-24 -right-24 h-[22rem] w-[22rem] rounded-full border border-white/30 will-change-transform"
          >
            <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white" />
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/60" />
          </motion.div>
          <motion.div
            aria-hidden
            style={{ rotate: ringRotate }}
            className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full border border-white/25 will-change-transform"
          />

          <div className="relative flex h-full flex-col">
            <div className="font-mono text-[11px] tracking-[0.3em] text-[#140a2e]/75 uppercase">
              ◉ Taking on two projects · Q3 2026
            </div>
            <h3 className="mt-6 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight text-[#140a2e]">
              Let&apos;s build
              <br />
              <em className="italic">something rare.</em>
            </h3>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[#140a2e]/80">
              Brands, studios and product teams — I take on a handful of
              engagements per year. Tell me the vision and the constraints, I
              bring craft and momentum.
            </p>

            <div className="mt-auto flex flex-col gap-3 pt-10">
              <Magnetic>
                <Link
                  href={`mailto:${persona.email}`}
                  data-cursor
                  data-cursor-label="write"
                  className="group inline-flex items-center justify-between gap-4 rounded-full bg-[#140a2e] px-6 py-4 text-sm font-medium text-[#fff6ea] transition hover:bg-black"
                >
                  <span>{persona.email}</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </Magnetic>
              <div className="flex flex-wrap gap-2">
                {persona.socials.map((s) => (
                  <Magnetic key={s.label} strength={10}>
                    <Link
                      href={s.href}
                      data-cursor
                      className="inline-flex rounded-full border border-[#140a2e]/35 px-4 py-2 text-[12px] font-medium tracking-wide text-[#140a2e] transition hover:bg-[#140a2e] hover:text-[#fff6ea]"
                    >
                      {s.label}
                    </Link>
                  </Magnetic>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillGroup({
  title,
  items,
  tint,
  horizontal = false,
}: {
  title: string;
  items: readonly string[];
  tint: string;
  horizontal?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: tint, boxShadow: `0 0 14px ${tint}` }}
        />
        <span className="font-mono text-[11px] tracking-[0.28em] text-[#f6eddf]/65 uppercase">
          {title}
        </span>
      </div>
      <ul
        className={
          horizontal
            ? "mt-4 flex flex-wrap gap-2"
            : "mt-4 flex flex-col gap-2"
        }
      >
        {items.map((s) => (
          <li
            key={s}
            data-cursor
            className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-[#f6eddf]/90 transition hover:border-white/25 hover:bg-white/[0.07]"
          >
            <span
              className="h-1 w-1 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
              style={{ backgroundColor: tint }}
            />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
