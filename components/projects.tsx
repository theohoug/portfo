"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { projects } from "@/lib/data";
import { Reveal, RevealText } from "./reveal";
import { ProjectVisual } from "./project-visual";

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);

  return (
    <section id="work" ref={ref} className="relative h-[480vh] w-full">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 pt-16 md:pt-24">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
              <span className="h-px w-8 bg-[#f6eddf]/40" /> 03 / Selected work · drag / scroll
            </div>
          </Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[18ch] text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-light tracking-[-0.02em]">
              <RevealText text="Six stories shipped" />
              <br />
              <span className="font-display italic text-[#9be5d0]">
                <RevealText text="in motion." delay={0.1} />
              </span>
            </h2>
            <Reveal delay={0.2}>
              <p className="max-w-sm text-sm text-[#f6eddf]/60">
                Brands, tools, installations and experiments from the last
                few seasons. Scroll to wander through.
              </p>
            </Reveal>
          </div>
        </div>

        <motion.div
          style={{ x }}
          className="mt-10 flex flex-1 items-center gap-6 px-6 pb-10 will-change-transform md:gap-8 md:pb-16"
        >
          {projects.map((p, i) => (
            <HorizontalCard key={p.slug} project={p} index={i} />
          ))}
          <div className="flex h-[60vh] w-[80vw] shrink-0 items-center justify-center md:w-[50vw]">
            <Link
              href="#contact"
              data-cursor
              data-cursor-label="contact"
              className="group glass flex h-full w-full flex-col items-center justify-center rounded-[28px] p-10 text-center"
            >
              <p className="font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/55 uppercase">
                — fin —
              </p>
              <p className="mt-6 font-display text-[clamp(2rem,5vw,4rem)] leading-none tracking-tight text-[#fff6ea]">
                Your project
                <br />
                <em className="text-gradient italic">next in line.</em>
              </p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-[#fff6ea] transition group-hover:bg-white/10">
                Start a brief
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type Project = (typeof projects)[number];

function HorizontalCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [5, -5]), {
    stiffness: 160,
    damping: 18,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), {
    stiffness: 160,
    damping: 18,
  });

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.a
      ref={ref}
      href={`#${project.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      data-cursor
      data-cursor-label="view"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{
        duration: 0.9,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex h-[62vh] w-[78vw] shrink-0 flex-col justify-end overflow-hidden rounded-[28px] border border-white/10 bg-[#140a2e]/40 p-6 backdrop-blur-sm will-change-transform md:h-[68vh] md:w-[48vw] md:p-8"
    >
      <ProjectVisual kind={project.kind} accent={project.accent} />

      <div className="absolute top-6 right-6 left-6 flex items-start justify-between text-[10.5px] tracking-[0.28em] text-[#fff6ea]/85 uppercase md:top-8 md:right-8 md:left-8">
        <span className="glass rounded-full px-3 py-1.5">{project.category}</span>
        <span className="font-mono text-[11px] opacity-80">{project.year}</span>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] tracking-wider text-[#fff6ea]/70 uppercase">
            {project.client}
          </div>
          <h3 className="mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] font-light tracking-tight text-[#fff6ea]">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm text-[#fff6ea]/80">
            {project.summary}
          </p>
        </div>
        <div className="hidden translate-y-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <div className="glass-strong flex h-14 w-14 items-center justify-center rounded-full text-[#140a2e]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff6ea" strokeWidth="1.8">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
