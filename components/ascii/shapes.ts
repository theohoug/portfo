export type Point = { x: number; y: number; z: number };

export function sphere(n: number): Point[] {
  const pts: Point[] = [];
  const lat = Math.max(14, Math.round(Math.sqrt(n * 0.55)));
  const lon = Math.max(24, Math.round(n / lat));
  for (let i = 0; i < lat; i++) {
    const phi = (i / (lat - 1)) * Math.PI - Math.PI / 2;
    for (let j = 0; j < lon; j++) {
      const theta = (j / lon) * Math.PI * 2;
      pts.push({
        x: Math.cos(phi) * Math.cos(theta),
        y: Math.sin(phi),
        z: Math.cos(phi) * Math.sin(theta),
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function torus(n: number, R = 0.92, r = 0.36): Point[] {
  const pts: Point[] = [];
  const uRes = Math.max(36, Math.round(Math.sqrt(n * 1.8)));
  const vRes = Math.max(14, Math.round(n / uRes));
  for (let i = 0; i < uRes; i++) {
    for (let j = 0; j < vRes; j++) {
      const u = (i / uRes) * Math.PI * 2;
      const v = (j / vRes) * Math.PI * 2;
      pts.push({
        x: (R + r * Math.cos(v)) * Math.cos(u),
        y: r * Math.sin(v),
        z: (R + r * Math.cos(v)) * Math.sin(u),
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function torusKnot(n: number, p = 2, q = 3): Point[] {
  const pts: Point[] = [];
  const steps = Math.max(120, Math.round(n * 0.85));
  const tube = 0.22;
  const tubeSeg = Math.max(8, Math.round(n / steps));
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const cx = Math.cos(p * t) * (0.55 + 0.25 * Math.cos(q * t));
    const cy = Math.sin(p * t) * (0.55 + 0.25 * Math.cos(q * t));
    const cz = Math.sin(q * t) * 0.3;
    const dt = 0.01;
    const dx = Math.cos(p * (t + dt)) * (0.55 + 0.25 * Math.cos(q * (t + dt))) - cx;
    const dy = Math.sin(p * (t + dt)) * (0.55 + 0.25 * Math.cos(q * (t + dt))) - cy;
    const dz = Math.sin(q * (t + dt)) * 0.3 - cz;
    const len = Math.hypot(dx, dy, dz) || 1;
    const tx = dx / len, ty = dy / len, tz = dz / len;
    let ax = 0, ay = 0, az = 1;
    if (Math.abs(tz) > 0.9) { ax = 1; ay = 0; az = 0; }
    const nx = ty * az - tz * ay;
    const ny = tz * ax - tx * az;
    const nz = tx * ay - ty * ax;
    const nLen = Math.hypot(nx, ny, nz) || 1;
    const nxu = nx / nLen, nyu = ny / nLen, nzu = nz / nLen;
    const bx = ty * nzu - tz * nyu;
    const by = tz * nxu - tx * nzu;
    const bz = tx * nyu - ty * nxu;
    for (let k = 0; k < tubeSeg; k++) {
      const a = (k / tubeSeg) * Math.PI * 2;
      const ca = Math.cos(a) * tube;
      const sa = Math.sin(a) * tube;
      pts.push({
        x: cx + nxu * ca + bx * sa,
        y: cy + nyu * ca + by * sa,
        z: cz + nzu * ca + bz * sa,
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function ribbon(n: number): Point[] {
  const pts: Point[] = [];
  const turns = 3.5;
  const strand = Math.max(10, Math.round(Math.sqrt(n / 3)));
  const steps = Math.max(80, Math.round(n / strand));
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const u = t * Math.PI * 2 * turns;
    const radius = 0.85 - 0.25 * t;
    for (let k = 0; k < strand; k++) {
      const w = (k / (strand - 1) - 0.5) * 0.35;
      pts.push({
        x: Math.cos(u) * radius,
        y: w + (t - 0.5) * 0.15,
        z: Math.sin(u) * radius,
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function helix(n: number): Point[] {
  const pts: Point[] = [];
  const turns = 4;
  const strands = 3;
  const perStrand = Math.floor(n / strands);
  for (let s = 0; s < strands; s++) {
    const offset = (s / strands) * Math.PI * 2;
    for (let i = 0; i < perStrand; i++) {
      const t = i / perStrand;
      const u = t * Math.PI * 2 * turns + offset;
      const y = (t - 0.5) * 1.6;
      pts.push({
        x: Math.cos(u) * 0.7,
        y,
        z: Math.sin(u) * 0.7,
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function heart(n: number): Point[] {
  const pts: Point[] = [];
  const shells = Math.max(10, Math.round(Math.sqrt(n * 0.6)));
  const each = Math.max(20, Math.round(n / shells));
  for (let s = 0; s < shells; s++) {
    const sh = (s / (shells - 1) - 0.5) * 0.6;
    for (let i = 0; i < each; i++) {
      const t = (i / each) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      pts.push({
        x: (x / 20) * (1 - Math.abs(sh) * 0.2),
        y: y / 20,
        z: sh,
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function rotate(p: Point, rx: number, ry: number, rz: number): Point {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);
  let y = p.y * cx - p.z * sx;
  let z = p.y * sx + p.z * cx;
  let x = p.x;
  const nx = x * cy + z * sy;
  z = -x * sy + z * cy;
  x = nx;
  const fx = x * cz - y * sz;
  const fy = x * sz + y * cz;
  return { x: fx, y: fy, z };
}

export function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
