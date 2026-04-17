"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { Effect } from "postprocessing";

const CHARS = " .'`\":!i+x*?X#%8&$@";

function makeAsciiAtlas(
  chars: string,
  charPx = 16,
): { texture: THREE.Texture; count: number } {
  const canvas = document.createElement("canvas");
  const count = chars.length;
  canvas.width = charPx * count;
  canvas.height = charPx;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.floor(charPx * 0.9)}px ui-monospace, "SF Mono", Menlo, monospace`;
  for (let i = 0; i < count; i++) {
    ctx.fillText(chars[i], charPx * (i + 0.5), charPx * 0.55);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return { texture: tex, count };
}

const fragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uCount;
  uniform vec2 uCellPx;
  uniform vec2 uResolution;
  uniform float uSaturation;
  uniform float uBrightness;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cellUv = uCellPx / uResolution;
    vec2 cellIndex = floor(uv / cellUv);
    vec2 cellOrigin = cellIndex * cellUv;
    vec2 cellCenter = cellOrigin + cellUv * 0.5;

    vec4 scene = texture2D(inputBuffer, cellCenter);
    float lum = dot(scene.rgb, vec3(0.299, 0.587, 0.114));
    lum = clamp(lum * uBrightness, 0.0, 1.0);

    float idx = floor(lum * (uCount - 1.0));
    vec2 inCell = (uv - cellOrigin) / cellUv;
    // atlas: horizontal strip, chars left to right
    vec2 atlasUv = vec2((idx + inCell.x) / uCount, inCell.y);
    float mask = texture2D(uAtlas, atlasUv).r;

    vec3 avgColor = scene.rgb;
    // boost saturation
    float avg = (avgColor.r + avgColor.g + avgColor.b) / 3.0;
    avgColor = mix(vec3(avg), avgColor, uSaturation);

    vec3 color = avgColor * mask;
    outputColor = vec4(color, 1.0);
  }
`;

class AsciiPass extends Effect {
  constructor({
    atlas,
    count,
    cell = 8,
    saturation = 1.35,
    brightness = 1.15,
  }: {
    atlas: THREE.Texture;
    count: number;
    cell?: number;
    saturation?: number;
    brightness?: number;
  }) {
    super(
      "AsciiPass",
      fragment,
      {
        uniforms: new Map<string, THREE.Uniform>([
          ["uAtlas", new THREE.Uniform(atlas)],
          ["uCount", new THREE.Uniform(count)],
          ["uCellPx", new THREE.Uniform(new THREE.Vector2(cell, cell))],
          ["uResolution", new THREE.Uniform(new THREE.Vector2(1, 1))],
          ["uSaturation", new THREE.Uniform(saturation)],
          ["uBrightness", new THREE.Uniform(brightness)],
        ]),
      },
    );
  }
  override update(
    _renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
  ) {
    const u = (this as unknown as {
      uniforms: Map<string, THREE.Uniform<THREE.Vector2>>;
    }).uniforms;
    const r = u.get("uResolution");
    if (r) r.value.set(inputBuffer.width, inputBuffer.height);
  }
}

export const Ascii = forwardRef<
  AsciiPass,
  { cell?: number; saturation?: number; brightness?: number }
>(function Ascii({ cell = 8, saturation = 1.35, brightness = 1.15 }, ref) {
  const effect = useMemo(() => {
    const { texture, count } = makeAsciiAtlas(CHARS, 16);
    return new AsciiPass({ atlas: texture, count, cell, saturation, brightness });
  }, [cell, saturation, brightness]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
