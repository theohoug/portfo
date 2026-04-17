export function ProjectVisual({
  kind,
  accent,
}: {
  kind: string;
  accent: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80`}
      />
      <div className="absolute inset-0 bg-[#0a0617]/20 mix-blend-multiply" />
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      >
        {kind === "orb" && <Orb />}
        {kind === "grid" && <Grid />}
        {kind === "beam" && <Beam />}
        {kind === "chart" && <Chart />}
        {kind === "rings" && <Rings />}
        {kind === "type" && <Type />}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0617]/80 via-[#0a0617]/10 to-transparent" />
    </div>
  );
}

function Orb() {
  return (
    <g>
      <defs>
        <radialGradient id="orb-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6ea" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ffc9bf" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff7a6b" stopOpacity="0" />
        </radialGradient>
        <filter id="orb-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <circle cx="300" cy="200" r="140" fill="url(#orb-g)" filter="url(#orb-blur)" />
      <g fill="none" stroke="#fff6ea" strokeOpacity="0.45">
        <circle cx="300" cy="200" r="70" />
        <circle cx="300" cy="200" r="110" strokeDasharray="2 6" />
        <circle cx="300" cy="200" r="150" strokeDasharray="1 10" />
        <circle cx="300" cy="200" r="190" strokeOpacity="0.2" />
      </g>
      <circle cx="380" cy="140" r="4" fill="#fff6ea" />
      <circle cx="220" cy="260" r="3" fill="#fff6ea" />
    </g>
  );
}

function Grid() {
  const cells = [];
  for (let x = 0; x < 12; x++) {
    for (let y = 0; y < 8; y++) {
      const seed = Math.sin(x * 13 + y * 7) * 0.5 + 0.5;
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x * 50 + 10}
          y={y * 50 + 10}
          width={38}
          height={38}
          rx={6}
          fill="#fff6ea"
          fillOpacity={0.06 + seed * 0.35}
        />,
      );
    }
  }
  return (
    <g>
      {cells}
      <rect
        x={60}
        y={60}
        width={180}
        height={100}
        rx={14}
        fill="#fff6ea"
        fillOpacity={0.92}
      />
      <rect
        x={80}
        y={82}
        width={90}
        height={6}
        rx={3}
        fill="#140a2e"
        fillOpacity={0.7}
      />
      <rect
        x={80}
        y={100}
        width={140}
        height={4}
        rx={2}
        fill="#140a2e"
        fillOpacity={0.45}
      />
      <rect
        x={80}
        y={112}
        width={120}
        height={4}
        rx={2}
        fill="#140a2e"
        fillOpacity={0.35}
      />
      <circle cx={340} cy={260} r={46} fill="#fff6ea" fillOpacity={0.9} />
      <path
        d="M 330 260 L 340 270 L 356 250"
        stroke="#140a2e"
        strokeWidth={3}
        fill="none"
      />
    </g>
  );
}

function Beam() {
  return (
    <g>
      <defs>
        <linearGradient id="beam-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6ea" stopOpacity="0" />
          <stop offset="30%" stopColor="#fff6ea" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff6ea" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={280} y={0} width={40} height={400} fill="url(#beam-g)" />
      <rect x={200} y={0} width={4} height={400} fill="#fff6ea" fillOpacity={0.4} />
      <rect x={400} y={0} width={4} height={400} fill="#fff6ea" fillOpacity={0.4} />
      <rect x={100} y={0} width={1} height={400} fill="#fff6ea" fillOpacity={0.2} />
      <rect x={500} y={0} width={1} height={400} fill="#fff6ea" fillOpacity={0.2} />
      <circle cx={300} cy={200} r={50} fill="#fff6ea" fillOpacity={0.95} />
      <circle cx={300} cy={200} r={80} fill="none" stroke="#fff6ea" strokeOpacity={0.3} />
      <circle cx={300} cy={200} r={130} fill="none" stroke="#fff6ea" strokeOpacity={0.15} />
    </g>
  );
}

function Chart() {
  const pts = [30, 80, 55, 140, 110, 170, 135, 210, 180, 240, 220, 270, 245];
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * 48 + 20} ${340 - p}`)
    .join(" ");
  return (
    <g>
      {[...Array(6)].map((_, i) => (
        <line
          key={i}
          x1={0}
          x2={600}
          y1={60 + i * 50}
          y2={60 + i * 50}
          stroke="#fff6ea"
          strokeOpacity={0.12}
        />
      ))}
      <path
        d={`${path} L 596 340 L 20 340 Z`}
        fill="#fff6ea"
        fillOpacity={0.18}
      />
      <path d={path} stroke="#fff6ea" strokeWidth={2.5} fill="none" />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={i * 48 + 20}
          cy={340 - p}
          r={3}
          fill="#fff6ea"
        />
      ))}
      <rect
        x={40}
        y={40}
        width={130}
        height={30}
        rx={8}
        fill="#fff6ea"
        fillOpacity={0.92}
      />
      <text
        x={55}
        y={60}
        fontFamily="var(--font-geist-mono), monospace"
        fontSize={13}
        fill="#140a2e"
      >
        + 24.8% · 60fps
      </text>
    </g>
  );
}

function Rings() {
  return (
    <g>
      {[...Array(14)].map((_, i) => (
        <circle
          key={i}
          cx={300}
          cy={200}
          r={30 + i * 18}
          fill="none"
          stroke="#fff6ea"
          strokeOpacity={0.45 - i * 0.025}
          strokeWidth={1}
          strokeDasharray={i % 2 === 0 ? "none" : "2 6"}
        />
      ))}
      <circle cx={300} cy={200} r={18} fill="#fff6ea" />
    </g>
  );
}

function Type() {
  return (
    <g fontFamily="var(--font-instrument-serif), serif" fill="#fff6ea">
      <text
        x={300}
        y={260}
        textAnchor="middle"
        fontSize={240}
        fontStyle="italic"
        fillOpacity={0.95}
      >
        Aa
      </text>
      <text
        x={300}
        y={100}
        textAnchor="middle"
        fontSize={14}
        letterSpacing="6"
        fillOpacity={0.8}
        fontFamily="var(--font-geist-mono), monospace"
      >
        VARIABLE · 00 — 99
      </text>
      <text
        x={300}
        y={340}
        textAnchor="middle"
        fontSize={14}
        letterSpacing="6"
        fillOpacity={0.6}
        fontFamily="var(--font-geist-mono), monospace"
      >
        WGHT 300 / ITAL 1
      </text>
    </g>
  );
}
