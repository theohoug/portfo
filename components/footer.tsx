import Link from "next/link";
import { persona } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto mt-10 w-full max-w-7xl px-6 pb-12">
      <div className="glass flex flex-col gap-8 rounded-[28px] p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <div className="font-display text-3xl tracking-tight">
            <span className="text-[#fff6ea]">Juno Varga</span>{" "}
            <em className="text-[#b9a7d4] italic">— Studio of one</em>
          </div>
          <p className="mt-2 max-w-md text-sm text-[#f6eddf]/55">
            Independent creative development out of {persona.location}. Coffee,
            CRTs and questionable puns keep the engine running.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm md:grid-cols-3">
          {persona.socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              data-cursor
              className="group flex items-center justify-between gap-3 border-b border-white/5 py-1.5 text-[#f6eddf]/75 transition hover:text-[#fff6ea]"
            >
              <span>{s.label}</span>
              <svg
                className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 font-mono text-[11px] tracking-wider text-[#f6eddf]/45 uppercase">
        <span>© {new Date().getFullYear()} Juno Varga — All pixels intentional</span>
        <span>crafted in Next · Framer Motion · caffeine</span>
      </div>
    </footer>
  );
}
