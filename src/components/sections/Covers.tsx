import type { CoverId } from "@/content";

// Deterministic pseudo-random so server and client render the same SVG.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

const f = (n: number) => +n.toFixed(2);

function Nochill() {
  const r = rng(7);
  const shards = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + r() * 0.3;
    const d = 40 + r() * 70;
    return { x: 160 + Math.cos(a) * d, y: 105 + Math.sin(a) * d * 0.7, rot: r() * 360, s: 6 + r() * 12, dx: Math.cos(a) * 14, dy: Math.sin(a) * 10, delay: r() * 1.5 };
  });
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <defs>
        <radialGradient id="nc-g" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#ff5c7a" stopOpacity=".55" /><stop offset="1" stopColor="#ff5c7a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="320" height="200" fill="#16080f" />
      <circle cx="160" cy="105" r="95" fill="url(#nc-g)" className="pulse" />
      <path d="M160 0 L152 40 L168 62 L150 100 L166 128 L158 200" stroke="#ff5c7a" strokeWidth="1.2" fill="none" opacity=".5" />
      <circle cx="160" cy="105" r="32" fill="#ff5c7a" className="breathe" />
      <path d="M160 137 q-3 14 6 22" stroke="#ff8aa0" strokeWidth="1.5" fill="none" />
      {shards.map((s, i) => (
        <polygon key={i} points={`0,0 ${f(s.s)},${f(s.s * 0.3)} ${f(s.s * 0.4)},${f(s.s)}`} fill={i % 3 ? "#ffc857" : "#f4f5fa"} opacity=".9"
          transform={`translate(${f(s.x)} ${f(s.y)}) rotate(${f(s.rot)})`} className="shard" style={{ ["--dx" as string]: `${f(s.dx)}px`, ["--dy" as string]: `${f(s.dy)}px`, animationDelay: `${f(s.delay)}s` }} />
      ))}
      <text x="160" y="110" textAnchor="middle" fontSize="15" fontWeight="800" fill="#16080f" fontFamily="monospace">NO CHILL</text>
    </svg>
  );
}

function BeingHuman() {
  const tiles = [[24, 22, 84, 70, "#ffc857"], [116, 22, 84, 70, "#ff8f6b"], [208, 22, 88, 70, "#f4d9a6"], [24, 100, 84, 60, "#e9a96b"], [116, 100, 84, 60, "#ffd98a"]];
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <rect width="320" height="200" fill="#1a1308" />
      {tiles.map(([x, y, w, h, c], i) => (
        <g key={i} className="float" style={{ animationDelay: `${i * 0.4}s` }}>
          <rect x={x as number} y={y as number} width={w as number} height={h as number} rx="10" fill={c as string} opacity=".9" />
          <circle cx={(x as number) + 22} cy={(y as number) + 20} r="7" fill="#1a1308" opacity=".25" />
          <path d={`M${x} ${(y as number) + (h as number) - 14} l22 -18 l16 12 l14 -10 l${(w as number) - 52} 16 v${(h as number) - ((h as number) - 14)} h-${w}z`} fill="#1a1308" opacity=".2" />
        </g>
      ))}
      <rect x="208" y="100" width="88" height="60" rx="14" fill="#f4f5fa" />
      <path d="M232 130 h40 M262 120 l10 10 l-10 10" stroke="#1a1308" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${24 + i * 8} ${176 - i * 2} q${6 + i * 2} -${6 + i * 2} 0 -${12 + i * 4}`} stroke="#ffc857" strokeWidth="3" strokeLinecap="round" fill="none" className="wave" style={{ animationDelay: `${i * 0.25}s` }} />)}
      <rect x="150" y="172" width="100" height="6" rx="3" fill="#ffc857" opacity=".35" />
      <rect x="150" y="172" width="42" height="6" rx="3" fill="#ffc857" className="bar" />
    </svg>
  );
}

function Tercelo() {
  const blocks = Array.from({ length: 36 }, (_, i) => i);
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <rect width="320" height="200" fill="#0b1020" />
      <g transform="translate(160 100)">
        <g className="spin">
          <circle r="86" fill="#1b2340" />
          {blocks.map((i) => (
            <rect key={i} x="-5" y="-86" width="10" height="16" rx="2" fill={i % 2 ? "#8aa4ff" : "#5b72c9"} transform={`rotate(${i * 10})`} />
          ))}
          <circle r="66" fill="#0b1020" stroke="#8aa4ff" strokeWidth="1" opacity=".6" />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0 -14 L7 -60 L-7 -60Z" fill="#c9d4ff" opacity=".85" transform={`rotate(${i * 45})`} />)}
        </g>
        <circle r="14" fill="#f4f5fa" />
        <circle r="5" fill="#0b1020" />
      </g>
      <text x="16" y="28" fontSize="10" fill="#8aa4ff" fontFamily="monospace">205/55 R16</text>
      <text x="304" y="186" fontSize="10" fill="#8aa4ff" fontFamily="monospace" textAnchor="end">3D · tread by code</text>
    </svg>
  );
}

function Cocoa() {
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <rect width="320" height="200" fill="#071611" />
      <g stroke="#7cffb2" strokeWidth="1" opacity=".35" fill="none">
        <path d="M200 40 L250 80 L220 130 L270 160 M250 80 L300 70 M220 130 L170 150" />
      </g>
      {[[200, 40], [250, 80], [220, 130], [270, 160], [300, 70], [170, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#7cffb2" className="pulse" style={{ animationDelay: `${i * 0.3}s` }} />)}
      <g className="float">
        <rect x="24" y="30" width="130" height="34" rx="16" fill="#06c755" />
        <text x="40" y="52" fontSize="12" fill="#04210f" fontWeight="700" fontFamily="sans-serif">How's the harvest?</text>
      </g>
      <g className="float" style={{ animationDelay: ".6s" }}>
        <rect x="64" y="78" width="110" height="30" rx="14" fill="#1d2a25" />
        <text x="80" y="98" fontSize="11" fill="#cfe9dc" fontFamily="sans-serif">120 kg · pods ok</text>
      </g>
      <ellipse cx="80" cy="152" rx="34" ry="24" fill="#8a4b2a" transform="rotate(-18 80 152)" />
      <path d="M52 158 q28 -34 56 -12 M58 168 q26 -26 50 -8" stroke="#5a2f17" strokeWidth="2" fill="none" />
    </svg>
  );
}

function Camp() {
  const r = rng(3);
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <defs><linearGradient id="cp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060d1c" /><stop offset="1" stopColor="#12304a" /></linearGradient></defs>
      <rect width="320" height="200" fill="url(#cp)" />
      {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={f(r() * 320)} cy={f(r() * 110)} r={f(0.6 + r() * 1.1)} fill="#fff" className="twinkle" style={{ animationDelay: `${f(r() * 3)}s` }} />)}
      <circle cx="258" cy="42" r="16" fill="#f4f5fa" /><circle cx="264" cy="38" r="14" fill="#0a1426" />
      <path d="M0 160 L60 110 L110 150 L170 100 L240 150 L320 120 V200 H0Z" fill="#0b2233" />
      {[30, 70, 250, 292].map((x, i) => <path key={i} d={`M${x} 176 l12 -36 l12 36z M${x + 2} 160 l10 -30 l10 30z`} fill="#0d3a33" />)}
      <path d="M130 176 L170 118 L210 176Z" fill="#7cffb2" /><path d="M170 118 L170 176 L150 176Z" fill="#4fd08a" /><path d="M170 144 l12 32 h-24z" fill="#071611" />
      <circle cx="226" cy="168" r="7" fill="#ffc857" className="pulse" /><path d="M222 176 q4 -14 8 0" fill="#ff5c7a" />
      <rect y="176" width="320" height="24" fill="#071611" />
    </svg>
  );
}

function Hotel() {
  const r = rng(11);
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <rect width="320" height="200" fill="#0b1020" />
      <rect x="80" y="26" width="160" height="164" rx="6" fill="#1b2340" />
      {Array.from({ length: 6 }, (_, row) => Array.from({ length: 6 }, (_, col) => {
        const lit = r() > 0.45;
        return <rect key={`${row}${col}`} x={96 + col * 24} y={40 + row * 24} width="14" height="16" rx="2" fill={lit ? "#ffc857" : "#2b3558"} className={lit ? "twinkle" : ""} style={{ animationDelay: `${f(r() * 4)}s` }} />;
      }))}
      <rect x="148" y="162" width="24" height="28" rx="3" fill="#8aa4ff" />
      <text x="160" y="20" textAnchor="middle" fontSize="11" fill="#8aa4ff" fontFamily="monospace">★★★★★</text>
      <g transform="translate(24 120)"><rect width="46" height="28" rx="8" fill="#f4f5fa" /><text x="23" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0b1020" fontFamily="sans-serif">Book</text></g>
      <g transform="translate(252 70)"><rect width="50" height="28" rx="8" fill="#2b3558" /><text x="25" y="19" textAnchor="middle" fontSize="10" fill="#c9d4ff" fontFamily="monospace">admin</text></g>
    </svg>
  );
}

function Sleep() {
  return (
    <svg viewBox="0 0 320 200" className="cover">
      <rect width="320" height="200" fill="#0e0a1c" />
      <circle cx="248" cy="52" r="26" fill="#c9a6ff" /><circle cx="258" cy="44" r="23" fill="#0e0a1c" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${120 + i * 14} q40 -${22 - i * 3} 80 0 t80 0 t80 0 t80 0`} stroke="#c9a6ff" strokeWidth="1.6" fill="none" opacity={0.7 - i * 0.14} className="slide" style={{ animationDelay: `${i * 0.4}s` }} />)}
      {[[40, 60], [96, 40], [150, 70]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="14" fill="none" stroke="#c9a6ff" strokeWidth="1" className="ring" style={{ animationDelay: `${i * 0.5}s` }} /><circle cx={x} cy={y} r="5" fill="#c9a6ff" /></g>
      ))}
      <path d="M40 60 L96 40 L150 70 L210 150" stroke="#c9a6ff" strokeWidth="1" strokeDasharray="3 4" opacity=".5" fill="none" />
      <rect x="196" y="150" width="28" height="34" rx="6" fill="#f4f5fa" />
      <path d="M210 146 q-8 -14 2 -24 q-8 -12 2 -22" stroke="#7cffb2" strokeWidth="2" fill="none" strokeLinecap="round" className="smoke" />
      <text x="16" y="186" fontSize="10" fill="#c9a6ff" fontFamily="monospace">ESP32 · ESP-NOW</text>
    </svg>
  );
}

const map: Record<CoverId, () => React.JSX.Element> = { nochill: Nochill, beinghuman: BeingHuman, tercelo: Tercelo, cocoa: Cocoa, camp: Camp, hotel: Hotel, sleep: Sleep };

export default function Cover({ id }: { id: CoverId }) {
  const C = map[id];
  return <C />;
}
