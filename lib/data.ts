export const persona = {
  name: "Juno Varga",
  handle: "@junovarga",
  role: "Creative Developer",
  subRole: "Motion Engineer",
  location: "Berlin · Remote",
  availability: "Available — Q3 2026",
  email: "hello@junovarga.studio",
  tagline: "Crafting interfaces that feel alive.",
  bio: "I build immersive digital experiences at the intersection of design, motion and code. Six years shipping award-winning products for brands and studios that care about craft.",
  longBio:
    "Half designer, half engineer — I spend my days translating editorial ideas into interactive systems. My work lives between WebGL, typography and choreography. When I'm not shipping, I'm writing shaders, climbing, or ruining expensive film stock on my Pentax.",
  stats: [
    { value: "06", label: "Years crafting" },
    { value: "42", label: "Shipped projects" },
    { value: "11", label: "Awards & features" },
    { value: "∞", label: "Cups of yerba" },
  ],
  socials: [
    { label: "Read.cv", href: "https://read.cv" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "Twitter", href: "https://x.com" },
  ],
} as const;

export const projects = [
  {
    slug: "kairos",
    title: "Kairos",
    category: "Installation · WebGL",
    year: "2025",
    client: "Centre Pompidou",
    summary:
      "Real-time generative art installation rendered across 12 synchronised displays.",
    accent: "from-[#ff7a6b] via-[#ff9d8a] to-[#ffc97a]",
    span: "md:col-span-7 md:row-span-2",
    kind: "orb",
  },
  {
    slug: "echo-os",
    title: "Echo OS",
    category: "Product · AI interface",
    year: "2025",
    client: "Y Combinator · Echo",
    summary:
      "AI-native canvas for design teams. Spatial UI, live multiplayer, ambient agents.",
    accent: "from-[#9b8cff] via-[#b7a8ff] to-[#6be5c8]",
    span: "md:col-span-5",
    kind: "grid",
  },
  {
    slug: "lumen",
    title: "Lumen",
    category: "Brand · Site",
    year: "2024",
    client: "Lumen Studio · FWA SOTD",
    summary: "WebGL landing for a Copenhagen lighting atelier.",
    accent: "from-[#ffc97a] via-[#ff7a6b] to-[#9b8cff]",
    span: "md:col-span-5",
    kind: "beam",
  },
  {
    slug: "flux",
    title: "Flux Protocol",
    category: "Dashboard · Data",
    year: "2024",
    client: "Flux · DeFi",
    summary: "Live trading terminal — 60fps charts, command palette, keyboard-native.",
    accent: "from-[#6be5c8] via-[#9b8cff] to-[#ff7a6b]",
    span: "md:col-span-7",
    kind: "chart",
  },
  {
    slug: "polaris",
    title: "Polaris",
    category: "Design system",
    year: "2023",
    client: "Nordea · Scandinavia",
    summary: "Cross-platform design system and motion language for a Nordic bank.",
    accent: "from-[#b7a8ff] via-[#6be5c8] to-[#fff6ea]",
    span: "md:col-span-6",
    kind: "rings",
  },
  {
    slug: "atlas",
    title: "Atlas",
    category: "Experiment · Type",
    year: "2023",
    client: "Awwwards feature",
    summary: "Generative variable-font playground. Write, warp, export.",
    accent: "from-[#ff7a6b] via-[#ffc97a] to-[#6be5c8]",
    span: "md:col-span-6",
    kind: "type",
  },
] as const;

export const skills = {
  craft: ["TypeScript", "React", "Next.js", "Svelte", "Node"],
  motion: ["Framer Motion", "GSAP", "Lenis", "Rive", "Lottie"],
  graphics: ["Three.js", "GLSL", "WebGL", "Shader Toy", "Pixi"],
  design: ["Figma", "Blender", "After Effects", "Cavalry", "Procreate"],
  edges: ["Rust / WASM", "Swift", "Python", "Supabase", "Prisma"],
} as const;

export const marqueeWords = [
  "Creative development",
  "Motion systems",
  "Interaction design",
  "Art direction",
  "WebGL · Shaders",
  "Typography",
  "Brand in motion",
  "Design engineering",
];

export const experience = [
  {
    year: "2024 — now",
    role: "Independent — Studio of one",
    place: "Juno Varga Studio",
    detail: "Shipping interfaces for Linear, Figma, Centre Pompidou and early teams.",
  },
  {
    year: "2022 — 2024",
    role: "Senior Creative Engineer",
    place: "Active Theory",
    detail: "Led motion and WebGL for Samsung, Nike SNKRS and Epic Games campaigns.",
  },
  {
    year: "2020 — 2022",
    role: "Design Engineer",
    place: "Framer",
    detail: "Core product — on-canvas animation, interactions and variables.",
  },
];
