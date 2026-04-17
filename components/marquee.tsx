"use client";

import { marqueeWords } from "@/lib/data";

export function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = Array.from({ length: 3 }).flatMap(() => marqueeWords);
  return (
    <div className="marquee-mask relative w-full overflow-hidden py-6">
      <div
        className={`flex w-max items-center gap-12 whitespace-nowrap ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {items.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-4xl tracking-tight text-[#f6eddf]/85 md:text-6xl"
          >
            <span
              className={`italic ${
                i % 2 === 0 ? "text-[#ff9d8a]" : "text-[#fff6ea]"
              }`}
            >
              {w}
            </span>
            <span aria-hidden className="text-[#6be5c8]">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
