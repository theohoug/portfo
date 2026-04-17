import { Stage } from "@/components/ascii/stage";
import { Loader } from "@/components/ascii/loader";
import { Cursor } from "@/components/cursor";

const sections = [
  { key: "fish", title: "a school of ideas" },
  { key: "forming", title: "the school aligns" },
  { key: "dive", title: "we plunge through the tunnel" },
  { key: "arrive", title: "emerging" },
  { key: "sign", title: "juno varga" },
];

export default function Home() {
  return (
    <>
      <Loader />
      <Cursor />
      <Stage />
      <main
        aria-label="scroll checkpoints"
        className="relative z-10"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {sections.map((s) => (
          <section
            key={s.key}
            className="flex h-screen w-full snap-start items-end justify-center"
            aria-label={s.title}
          />
        ))}
      </main>
    </>
  );
}
