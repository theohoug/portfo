export type Point = { x: number; y: number; z: number };

export function sphere(n: number): Point[] {
  const pts: Point[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

export function torus(n: number, R = 1, r = 0.38): Point[] {
  const pts: Point[] = [];
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      const u = (i / side) * Math.PI * 2;
      const v = (j / side) * Math.PI * 2;
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
  const tube = 0.3;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const ringOffset = (i % 12) / 12;
    const vTheta = ringOffset * Math.PI * 2;
    const radial = 0.55 + Math.cos(q * t) * 0.2;
    const x = radial * Math.cos(p * t);
    const y = radial * Math.sin(p * t);
    const z = Math.sin(q * t) * 0.35;
    pts.push({
      x: x + Math.cos(vTheta) * tube * 0.2,
      y: y + Math.sin(vTheta) * tube * 0.2,
      z: z + Math.cos(vTheta) * tube * 0.2,
    });
  }
  return pts;
}

export function ribbon(n: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 4;
    const ringOffset = (i % 10) / 10 - 0.5;
    pts.push({
      x: Math.cos(u) * (0.8 + Math.sin(u * 0.5) * 0.2),
      y: ringOffset * 0.8,
      z: Math.sin(u) * (0.8 + Math.sin(u * 0.5) * 0.2),
    });
  }
  return pts;
}

export function heart(n: number): Point[] {
  const pts: Point[] = [];
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      const u = (i / side) * Math.PI * 2;
      const v = ((j / side) - 0.5) * Math.PI;
      const x = 16 * Math.pow(Math.sin(u), 3);
      const y =
        13 * Math.cos(u) -
        5 * Math.cos(2 * u) -
        2 * Math.cos(3 * u) -
        Math.cos(4 * u);
      pts.push({
        x: (x / 18) * Math.cos(v),
        y: y / 18,
        z: (x / 18) * Math.sin(v),
      });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function wave(n: number): Point[] {
  const pts: Point[] = [];
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      const u = (i / side) * 2 - 1;
      const v = (j / side) * 2 - 1;
      const r = Math.sqrt(u * u + v * v);
      const y = Math.cos(r * 6) * 0.25 * Math.exp(-r * 1.2);
      pts.push({ x: u, y, z: v });
      if (pts.length >= n) return pts;
    }
  }
  return pts;
}

export function rotateY(p: Point, a: number): Point {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

export function rotateX(p: Point, a: number): Point {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

export function rotateZ(p: Point, a: number): Point {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
}

export function lerpShapes(a: Point[], b: Point[], t: number): Point[] {
  const out: Point[] = [];
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    out.push({
      x: a[i].x + (b[i].x - a[i].x) * t,
      y: a[i].y + (b[i].y - a[i].y) * t,
      z: a[i].z + (b[i].z - a[i].z) * t,
    });
  }
  return out;
}
