export const CHARS = " .'\"^,:;|+*o#%@";
export const INK = "246, 237, 223";

export type Tone = 0 | 1 | 2 | 3;

export class AsciiGrid {
  cols = 0;
  rows = 0;
  private chars!: Uint8Array;
  private tones!: Uint8Array;
  private z!: Float32Array;

  resize(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.chars = new Uint8Array(cols * rows);
    this.tones = new Uint8Array(cols * rows);
    this.z = new Float32Array(cols * rows);
  }

  clear() {
    this.chars.fill(0);
    this.tones.fill(0);
    this.z.fill(-Infinity);
  }

  setZ(col: number, row: number, charIdx: number, tone: Tone, depth: number) {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return;
    const i = row * this.cols + col;
    if (depth <= this.z[i]) return;
    this.z[i] = depth;
    this.chars[i] = charIdx;
    this.tones[i] = tone;
  }

  setChar(col: number, row: number, charIdx: number, tone: Tone) {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return;
    const i = row * this.cols + col;
    this.chars[i] = charIdx;
    this.tones[i] = tone;
    this.z[i] = Infinity;
  }

  writeText(col: number, row: number, text: string, tone: Tone) {
    for (let i = 0; i < text.length; i++) {
      const c = text.charAt(i);
      if (c === "\n") return;
      const idx = CHARS.indexOf(c);
      if (idx >= 0) {
        this.setChar(col + i, row, idx, tone);
      } else {
        const g = this.glyphIndex(c);
        if (g !== null) this.setCharRaw(col + i, row, g, tone);
      }
    }
  }

  private rawGlyphs: string[] = [];
  private rawGlyphMap: Map<string, number> = new Map();

  private glyphIndex(ch: string): number | null {
    let idx = this.rawGlyphMap.get(ch);
    if (idx === undefined) {
      idx = 256 + this.rawGlyphs.length;
      if (this.rawGlyphs.length >= 200) return null;
      this.rawGlyphs.push(ch);
      this.rawGlyphMap.set(ch, idx);
    }
    return idx;
  }

  private setCharRaw(col: number, row: number, charIdx: number, tone: Tone) {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return;
    const i = row * this.cols + col;
    this.chars[i] = charIdx;
    this.tones[i] = tone;
    this.z[i] = Infinity;
  }

  render(ctx: CanvasRenderingContext2D, cellW: number, cellH: number) {
    const tones = [
      `rgba(${INK}, 0.18)`,
      `rgba(${INK}, 0.4)`,
      `rgba(${INK}, 0.75)`,
      `rgba(${INK}, 1)`,
    ];
    for (let r = 0; r < this.rows; r++) {
      const y = r * cellH;
      let c = 0;
      while (c < this.cols) {
        while (c < this.cols && this.chars[r * this.cols + c] === 0) c++;
        if (c >= this.cols) break;
        const startCol = c;
        const tone = this.tones[r * this.cols + c];
        let str = "";
        while (
          c < this.cols &&
          this.chars[r * this.cols + c] !== 0 &&
          this.tones[r * this.cols + c] === tone
        ) {
          const ci = this.chars[r * this.cols + c];
          const ch = ci >= 256 ? this.rawGlyphs[ci - 256] : CHARS[ci];
          str += ch ?? " ";
          c++;
        }
        ctx.fillStyle = tones[tone];
        ctx.fillText(str, startCol * cellW, y);
      }
    }
  }
}
