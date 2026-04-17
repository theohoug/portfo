export type Scene = {
  key: string;
  shape: "sphere" | "torus" | "knot" | "ribbon" | "helix" | "heart";
  chapter: string;
  title: string[];
  meta: string[];
  body: string[];
};

export const scenes: Scene[] = [
  {
    key: "identity",
    shape: "sphere",
    chapter: "00 — identity",
    title: ["JUNO", "VARGA"],
    meta: ["creative developer", "motion engineer", "berlin · remote"],
    body: [
      "a studio of one.",
      "building interfaces",
      "that feel alive.",
    ],
  },
  {
    key: "about",
    shape: "torus",
    chapter: "01 — transmission",
    title: ["CRAFT", "IN THE", "LIMINAL"],
    meta: ["six years shipping", "design + code + motion"],
    body: [
      "i prototype in code.",
      "polish in figma.",
      "obsess over the 40 ms",
      "that make an interface",
      "feel inhabited.",
    ],
  },
  {
    key: "kairos",
    shape: "knot",
    chapter: "02 — works · kairos",
    title: ["KAIROS"],
    meta: ["centre pompidou · 2025", "installation · webgl"],
    body: [
      "real-time generative art",
      "on twelve synchronised",
      "displays, driven by",
      "ambient visitor density.",
    ],
  },
  {
    key: "echo",
    shape: "helix",
    chapter: "03 — works · echo os",
    title: ["ECHO", "OS"],
    meta: ["y combinator · 2025", "product · ai interface"],
    body: [
      "an ai-native canvas",
      "for design teams.",
      "spatial ui,",
      "multiplayer,",
      "ambient agents.",
    ],
  },
  {
    key: "lumen",
    shape: "ribbon",
    chapter: "04 — works · lumen",
    title: ["LUMEN"],
    meta: ["fwa · site of the day · 2024", "brand · webgl site"],
    body: [
      "a digital atelier",
      "for a copenhagen",
      "lighting studio.",
      "light as a language.",
    ],
  },
  {
    key: "contact",
    shape: "heart",
    chapter: "05 — let's make",
    title: ["SOMETHING", "RARE"],
    meta: ["available · q3 2026"],
    body: [
      "hello@junovarga.studio",
      "",
      "read.cv · github",
      "dribbble · x · are.na",
    ],
  },
];
