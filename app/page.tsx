import { Stage } from "@/components/ascii/stage";
import { Loader } from "@/components/ascii/loader";
import { Cursor } from "@/components/cursor";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Cursor />
      <Stage />
      <main aria-hidden className="relative">
        <div className="h-[600vh] w-full" />
      </main>
      <a
        href="mailto:hello@junovarga.studio"
        data-cursor
        data-cursor-label="write"
        className="fixed right-4 bottom-4 z-20 font-mono text-[11px] tracking-[0.22em] text-[#fff6ea]/70 uppercase underline-offset-4 hover:text-[#fff6ea] hover:underline md:right-8 md:bottom-8"
      >
        hello@junovarga.studio
      </a>
    </>
  );
}
