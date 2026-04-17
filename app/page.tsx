import { Scene } from "@/components/scene/scene";
import { Cursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Loader } from "@/components/loader";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { SkillsContact } from "@/components/skills-contact";
import { Outro } from "@/components/outro";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Scene />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main className="relative flex flex-1 flex-col">
        <Hero />
        <Marquee />
        <About />
        <Marquee reverse />
        <Projects />
        <SkillsContact />
        <Outro />
        <Footer />
      </main>
    </>
  );
}
