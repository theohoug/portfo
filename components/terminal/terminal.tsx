"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  IdentityScene,
  OrbScene,
  TorusScene,
  WorksScene,
  StackScene,
  HailScene,
} from "./scenes";

const SCENES = [
  { id: "identity", Component: IdentityScene },
  { id: "orb", Component: OrbScene },
  { id: "torus", Component: TorusScene },
  { id: "works", Component: WorksScene },
  { id: "stack", Component: StackScene },
  { id: "hail", Component: HailScene },
] as const;

export function Terminal() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setProgress(v));
  }, [scrollYProgress]);

  const active = Math.min(SCENES.length - 1, Math.floor(progress * SCENES.length));
  const local = progress * SCENES.length - active;
  const Active = SCENES[active].Component;
  const sceneId = SCENES[active].id;

  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <div
        ref={spacerRef}
        aria-hidden
        className="pointer-events-none relative"
        style={{ height: `${SCENES.length * 100}vh` }}
      />

      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-4 md:px-10">
        <div className="pointer-events-auto relative aspect-[16/10] h-[78vh] max-h-[800px] w-full max-w-[1180px] md:aspect-[16/9]">
          <div className="glass absolute inset-0 overflow-hidden rounded-[22px] md:rounded-[28px]">
            <TerminalChrome activeId={sceneId} index={active} total={SCENES.length} />

            <div className="absolute inset-x-0 top-10 bottom-6 md:top-12 md:bottom-8">
              {SCENES.map((s, i) => {
                const SceneComp = s.Component;
                const isActive = i === active;
                const isPrev = i === active - 1;
                const isNext = i === active + 1;
                if (!isActive && !isPrev && !isNext) return null;

                const opacity = isActive
                  ? Math.min(1, local < 0.1 ? local * 10 : local > 0.9 ? (1 - local) * 10 : 1)
                  : isPrev
                    ? Math.max(0, (0.1 - local) * 10)
                    : Math.max(0, (local - 0.9) * 10);

                const t = isActive ? local : isPrev ? 1 : 0;

                return (
                  <motion.div
                    key={s.id}
                    className="absolute inset-0"
                    style={{ opacity, pointerEvents: isActive ? "auto" : "none" }}
                  >
                    <SceneComp t={t} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="absolute -bottom-8 left-0 right-0 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase md:-bottom-10">
            <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                style={{ width: progressBarWidth }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff7a6b] via-[#9b8cff] to-[#6be5c8]"
              />
            </div>
            <span className="shrink-0 tabular-nums">
              {Math.round(progress * 100)
                .toString()
                .padStart(3, "0")}
              %
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function TerminalChrome({
  activeId,
  index,
  total,
}: {
  activeId: string;
  index: number;
  total: number;
}) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-10 items-center justify-between border-b border-white/5 px-4 font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/60 uppercase md:h-12 md:px-6">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ff7a6b]" />
        <span className="h-2 w-2 rounded-full bg-[#ffc97a]" />
        <span className="h-2 w-2 rounded-full bg-[#6be5c8]" />
        <span className="ml-3 text-[#f6eddf]/85">juno.studio ▸ {activeId}</span>
      </div>
      <div className="hidden gap-3 md:flex">
        <span>buf {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
        <span>52.52n 13.40e</span>
        <span>◉ live</span>
      </div>
      <div className="flex gap-3 md:hidden">
        <span>{String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
