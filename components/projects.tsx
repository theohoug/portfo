"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { projects } from "@/lib/data";
import { Reveal, RevealText } from "./reveal";
import { ProjectVisual } from "./project-visual";

export function Projects() {
  return (
    <section
      id="work"
      className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-36"
    >
      <header className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
              <span className="h-px w-8 bg-[#f6eddf]/40" /> 03 / Selected work
            </div>
          </Reveal>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-light tracking-[-0.02em]">
            <RevealText text="Six stories of design" />
            <br />
            <span className="font-display italic text-[#9be5d0]">
              <RevealText text="shipped in motion." delay={0.15} />
            </span>
          </h2>
        </div>
        <Reveal delay={0.25}>
          <p className="max-w-sm text-sm text-[#f6eddf]/60">
            A sample from the last few seasons — brands, tools, installations
            and experiments that pushed my hands and changed how I think.
          </p>
        </Reveal>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[320px]">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), {
    stiffness: 180,
    damping: 18,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-8, 8]), {
    stiffness: 180,
    damping: 18,
  });
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);

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
    <Reveal
      delay={index * 0.05}
      className={`${project.span ?? ""} h-full min-h-[320px]`}
    >
      <motion.a
        ref={ref}
        href={`#${project.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        data-cursor
        data-cursor-label="view"
        className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[28px] border border-white/10 bg-[#140a2e]/40 p-6 backdrop-blur-sm will-change-transform md:p-8"
      >
        <ProjectVisual kind={project.kind} accent={project.accent} />

        <motion.div
          aria-hidden
          style={{
            background: `radial-gradient(600px circle at ${glareX.get()} ${glareY.get()}, rgba(255,246,234,0.25), transparent 40%)`,
          }}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="absolute top-6 right-6 left-6 flex items-start justify-between text-[10.5px] tracking-[0.28em] text-[#fff6ea]/85 uppercase md:top-8 md:right-8 md:left-8">
          <span className="glass rounded-full px-3 py-1.5 backdrop-blur">
            {project.category}
          </span>
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
    </Reveal>
  );
}
