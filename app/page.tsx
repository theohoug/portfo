import { BlobBackground } from "@/components/blob-background";
import { Cursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";
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
      <BlobBackground />
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
