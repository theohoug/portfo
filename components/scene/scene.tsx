"use client";

import dynamic from "next/dynamic";

export const Scene = dynamic(
  () => import("./scene-canvas").then((m) => m.SceneCanvas),
  { ssr: false },
);
