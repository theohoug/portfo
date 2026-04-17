import { AsciiScene } from "@/components/ascii/ascii-scene";
import { Cursor } from "@/components/cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Loader } from "@/components/loader";
import { Hud } from "@/components/hud";
import { Terminal } from "@/components/terminal/terminal";

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <AsciiScene />
      <Cursor />
      <Hud />
      <Terminal />
    </>
  );
}
