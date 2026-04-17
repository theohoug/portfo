import {
  rotateX,
  rotateY,
  rotateZ,
  type Point,
} from "./shapes";

const CHARS = " .·:-=+xo*#%@";

export type RenderConfig = {
  width: number;
  height: number;
  cellW: number;
  cellH: number;
  scale: number;
  centerX: number;
  centerY: number;
  focal?: number;
  palette: [string, string, string];
  clear?: boolean;
  background?: string;
};

export function renderAsciiShape(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  rotation: { x: number; y: number; z: number },
  cfg: RenderConfig,
) {
  const {
    width,
    height,
    cellW,
    cellH,
    scale,
    centerX,
    centerY,
    focal = 4,
    palette,
    clear = true,
    background,
  } = cfg;

  const cols = Math.ceil(width / cellW);
  const rows = Math.ceil(height / cellH);
  const zBuf = new Float32Array(cols * rows).fill(-Infinity);
  const chBuf = new Uint8Array(cols * rows);
  const palBuf = new Uint8Array(cols * rows);

  for (let i = 0; i < zBuf.length; i++) zBuf[i] = -Infinity;

  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    p = rotateX(p, rotation.x);
    p = rotateY(p, rotation.y);
    p = rotateZ(p, rotation.z);

    const zf = focal / (focal + p.z);
    const sx = p.x * zf * scale + centerX;
    const sy = p.y * zf * scale + centerY;
    if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;

    const col = Math.floor(sx / cellW);
    const row = Math.floor(sy / cellH);
    const idx = row * cols + col;
    if (p.z > zBuf[idx]) {
      zBuf[idx] = p.z;
      const d = (p.z + 1) * 0.5;
      const ci = Math.min(
        CHARS.length - 1,
        Math.max(1, Math.floor(d * (CHARS.length - 1))),
      );
      chBuf[idx] = ci;
      palBuf[idx] = d > 0.6 ? 0 : d > 0.3 ? 1 : 2;
    }
  }

  if (clear) ctx.clearRect(0, 0, width, height);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  for (let r = 0; r < rows; r++) {
    const y = r * cellH;
    let c = 0;
    while (c < cols) {
      while (c < cols && chBuf[r * cols + c] === 0) c++;
      if (c >= cols) break;
      const currentPal = palBuf[r * cols + c];
      const startCol = c;
      let str = "";
      while (
        c < cols &&
        chBuf[r * cols + c] > 0 &&
        palBuf[r * cols + c] === currentPal
      ) {
        str += CHARS[chBuf[r * cols + c]];
        c++;
      }
      ctx.fillStyle = palette[Math.min(2, currentPal)];
      ctx.fillText(str, startCol * cellW, y);
    }
  }
}
