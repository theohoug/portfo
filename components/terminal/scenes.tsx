"use client";

import { motion } from "framer-motion";
import { persona, projects, skills, experience } from "@/lib/data";
import { AsciiShape } from "./ascii-shape";

const PALETTES = {
  coral: ["#fff6ea", "#ffc9bf", "#ff7a6b"] as [string, string, string],
  violet: ["#fff6ea", "#c9bdff", "#9b8cff"] as [string, string, string],
  mint: ["#fff6ea", "#b7f0d9", "#6be5c8"] as [string, string, string],
  amber: ["#fff6ea", "#ffe1b0", "#ffc97a"] as [string, string, string],
};

// ── UTILS ────────────────────────────────────────────────────────────────

function revealChars(str: string, t: number): string {
  const n = Math.floor(str.length * Math.max(0, Math.min(1, t)));
  return str.slice(0, n);
}

function Cursor() {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-[0.9em] w-[0.55ch] translate-y-[0.12em] bg-[#fff6ea]"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ── SCENE 1 · IDENTITY (typewriter) ──────────────────────────────────────

const IDENTITY_LINES = [
  "> booting juno.studio v3.4.1",
  "> loading creative modules ..... ok",
  "> init identity ................",
  "",
  "NAME      Juno Varga",
  "ROLE      Creative developer · motion engineer",
  "BASE      Berlin · Remote",
  "STATUS    ◉ accepting briefs for Q3 2026",
];

export function IdentityScene({ t }: { t: number }) {
  const joined = IDENTITY_LINES.join("\n");
  const shown = revealChars(joined, t * 1.2);
  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-6 md:p-10">
      <div className="font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <span>01 · identity</span>
      </div>

      <pre className="font-mono text-[clamp(0.72rem,1.45vw,0.95rem)] leading-[1.7] whitespace-pre-wrap text-[#f6eddf]">
        {shown}
        <Cursor />
      </pre>

      <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase">
        <span>scroll ↓ to transmit</span>
        <span>{Math.round(t * 100)}%</span>
      </div>
    </div>
  );
}

// ── SCENE 2 · ORB + bio ─────────────────────────────────────────────────

const BIO_LINES = persona.longBio.split(/(?<=\. )/);

export function OrbScene({ t }: { t: number }) {
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <span>02 · transmission</span>
        <span>◎ sphere · 1400 pts</span>
      </div>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0617]/40">
          <AsciiShape kind="sphere" palette={PALETTES.coral} />
        </div>
        <div className="flex flex-col justify-center gap-4 font-mono text-[clamp(0.78rem,1.4vw,0.95rem)] leading-[1.7] text-[#f6eddf]/85">
          <div className="text-[11px] tracking-[0.3em] text-[#ff9d8a] uppercase">
            signal · juno /{revealChars("bio", t * 3)}
          </div>
          <p>
            {revealChars(BIO_LINES[0] ?? "", t * 3)}
            {t > 0.33 && (
              <>
                {" "}
                {revealChars(BIO_LINES[1] ?? "", (t - 0.33) * 3)}
              </>
            )}
            {t > 0.66 && (
              <>
                {" "}
                {revealChars(BIO_LINES[2] ?? "", (t - 0.66) * 3)}
                <Cursor />
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase">
        <span>frequency 52.520, 13.405</span>
        <span>{persona.handle}</span>
      </div>
    </div>
  );
}

// ── SCENE 3 · TORUS + stats ─────────────────────────────────────────────

export function TorusScene({ t }: { t: number }) {
  const stats = persona.stats;
  const reveal = Math.min(stats.length, Math.floor(t * stats.length * 1.4) + 1);
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <span>03 · atlas</span>
        <span>◎ torus · logging run</span>
      </div>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0617]/40">
          <AsciiShape kind="torus" palette={PALETTES.mint} spinSpeed={0.8} />
        </div>
        <div className="flex flex-col justify-center gap-3 font-mono">
          <div className="text-[11px] tracking-[0.3em] text-[#9be5d0] uppercase">
            vitals
          </div>
          <ul className="divide-y divide-white/5">
            {stats.map((s, i) => (
              <li
                key={s.label}
                className="flex items-baseline justify-between py-3 transition-opacity duration-500"
                style={{ opacity: i < reveal ? 1 : 0 }}
              >
                <span className="text-[#f6eddf]/60 text-[11px] tracking-[0.3em] uppercase">
                  {s.label}
                </span>
                <span className="font-display text-[clamp(1.5rem,3vw,2.2rem)] text-[#fff6ea]">
                  {s.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase">
        <span>cycle 06 / ∞</span>
        <span>{Math.round(t * 100)}%</span>
      </div>
    </div>
  );
}

// ── SCENE 4 · WORKS (projects cycling) ──────────────────────────────────

export function WorksScene({ t }: { t: number }) {
  const idx = Math.min(projects.length - 1, Math.floor(t * projects.length));
  const local = t * projects.length - idx;
  const p = projects[idx];
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <span>04 · works</span>
        <span>
          case {String(idx + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-[1fr_1.2fr]">
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0617]/40">
          <div
            key={p.slug}
            className={`absolute inset-0 bg-gradient-to-br opacity-40 ${p.accent}`}
            style={{ opacity: 0.15 + local * 0.25 }}
          />
          <AsciiShape
            kind={idx % 3 === 0 ? "knot" : idx % 3 === 1 ? "torus" : "sphere"}
            palette={
              idx % 4 === 0
                ? PALETTES.coral
                : idx % 4 === 1
                  ? PALETTES.violet
                  : idx % 4 === 2
                    ? PALETTES.mint
                    : PALETTES.amber
            }
            spinSpeed={0.9}
          />
        </div>
        <div className="relative flex flex-col justify-center gap-3">
          <div
            key={p.slug}
            className="space-y-3 font-mono"
            style={{ opacity: Math.min(1, Math.max(0, 1 - Math.abs(local - 0.5) * 1.6)) }}
          >
            <div className="text-[11px] tracking-[0.3em] text-[#f6eddf]/55 uppercase">
              {p.category} · {p.year}
            </div>
            <h3 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-none tracking-tight text-[#fff6ea]">
              {p.title}
            </h3>
            <p className="text-[11px] tracking-[0.3em] text-[#9be5d0] uppercase">
              ↳ {p.client}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-[#f6eddf]/80">
              {p.summary}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 flex gap-1">
            {projects.map((_, i) => (
              <span
                key={i}
                className="h-0.5 w-5 transition-colors"
                style={{
                  backgroundColor: i <= idx ? "#fff6ea" : "rgba(255,246,234,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase">
        <span>streaming portfolio ..</span>
        <span>{Math.round(t * 100)}%</span>
      </div>
    </div>
  );
}

// ── SCENE 5 · STACK (skills cascade) ────────────────────────────────────

const STACK_ROWS = [
  { group: "CRAFT", items: skills.craft, tint: "#ff7a6b" },
  { group: "MOTION", items: skills.motion, tint: "#ffc97a" },
  { group: "GRAPHICS", items: skills.graphics, tint: "#6be5c8" },
  { group: "DESIGN", items: skills.design, tint: "#9b8cff" },
  { group: "EDGES", items: skills.edges, tint: "#fff6ea" },
];

export function StackScene({ t }: { t: number }) {
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <span>05 · stack</span>
        <span>◎ toolbox · 2026</span>
      </div>

      <div className="flex flex-col gap-3 overflow-hidden">
        {STACK_ROWS.map((row, i) => {
          const local = Math.max(0, Math.min(1, t * STACK_ROWS.length - i));
          return (
            <div
              key={row.group}
              className="flex items-center gap-3 border-b border-white/5 py-2 font-mono text-sm"
              style={{
                opacity: local > 0 ? 1 : 0.08,
                transform: `translateY(${(1 - local) * 8}px)`,
                transition: "opacity 0.4s, transform 0.4s",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: row.tint, boxShadow: `0 0 10px ${row.tint}` }}
              />
              <span
                className="w-28 shrink-0 text-[11px] tracking-[0.3em] uppercase"
                style={{ color: row.tint, opacity: 0.9 }}
              >
                {row.group}
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-1 text-[#f6eddf]/85">
                {row.items.map((it, j) => {
                  const sub = local > 0.15 + j * 0.08 ? 1 : 0;
                  return (
                    <span
                      key={it}
                      style={{ opacity: sub }}
                      className="transition-opacity duration-500"
                    >
                      {it}
                      {j < row.items.length - 1 ? " ·" : ""}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}

        <div className="mt-auto grid grid-cols-1 gap-2 font-mono text-[11px] text-[#f6eddf]/55 md:grid-cols-3">
          {experience.map((e) => (
            <div key={e.role} className="border-l-2 border-white/10 pl-3">
              <div className="text-[10px] tracking-[0.28em] text-[#f6eddf]/40 uppercase">
                {e.year}
              </div>
              <div className="text-[#fff6ea]/85">{e.role}</div>
              <div className="text-[#f6eddf]/50">{e.place}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase">
        <span>compiled · ready</span>
        <span>{Math.round(t * 100)}%</span>
      </div>
    </div>
  );
}

// ── SCENE 6 · HAIL (contact) ────────────────────────────────────────────

export function HailScene({ t }: { t: number }) {
  const msg1 = "Let's make";
  const msg2 = "something rare.";
  const email = persona.email;
  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4 p-6 md:p-10">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/50 uppercase">
        <span>06 · hail</span>
        <span>◎ open channel</span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="absolute inset-0 -z-10 opacity-40">
          <AsciiShape kind="knot" palette={PALETTES.amber} spinSpeed={0.4} />
        </div>
        <h3 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em] text-[#fff6ea]">
          {revealChars(msg1, t * 2)}
          <br />
          <em className="text-gradient italic">{revealChars(msg2, (t - 0.4) * 2.5)}</em>
        </h3>
        <div className="flex flex-col items-center gap-3 opacity-[var(--o,0)] transition-opacity duration-700"
             style={{ ["--o" as string]: t > 0.6 ? 1 : 0 }}>
          <a
            href={`mailto:${email}`}
            data-cursor
            data-cursor-label="write"
            className="rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono text-sm text-[#fff6ea] backdrop-blur transition hover:bg-white/10"
          >
            {email}
          </a>
          <div className="flex gap-3 font-mono text-[11px] tracking-[0.3em] text-[#f6eddf]/55 uppercase">
            {persona.socials.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-[#fff6ea]">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between font-mono text-[10px] tracking-[0.3em] text-[#f6eddf]/45 uppercase">
        <span>© 2026 juno varga</span>
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>
          ◉ live
        </motion.span>
      </div>
    </div>
  );
}
