import { area, pines, ridge } from "@/lib/ridge";

// The landscape at the end of the page: the same sun/moon and mountain layers as the hero view,
// so the colours of the opening scene come back at the bottom. Static SVG, no JS.
const H = 420;
const f1 = ridge(2.1, 190, 50);
const f2 = ridge(4.4, 250, 55);
const f3 = ridge(6.1, 305, 50);
const f4 = ridge(8.7, 350, 36);

export default function Horizon() {
  return (
    <svg className="horizon" viewBox={`0 0 1600 ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--sky-mid)", stopOpacity: 0 }} />
          <stop offset="0.55" style={{ stopColor: "var(--sky-mid)", stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: "var(--sky-low)" }} />
        </linearGradient>
        <radialGradient id="hz-glow">
          <stop offset="0" style={{ stopColor: "var(--sun-glow)", stopOpacity: 0.7 }} />
          <stop offset="1" style={{ stopColor: "var(--sun-glow)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="1600" height={H} fill="url(#hz-sky)" />
      <circle cx="1180" cy="190" r="240" fill="url(#hz-glow)" />
      <circle cx="1180" cy="190" r="44" style={{ fill: "var(--sun)" }} />
      <path d={area(f1, H)} style={{ fill: "var(--m1)" }} />
      <path d={area(f2, H)} style={{ fill: "var(--m2)" }} />
      <path d={area(f3, H)} style={{ fill: "var(--m3)" }} />
      <path d={pines(f3, 21, 14, 14)} style={{ fill: "var(--m3)" }} />
      <path d={area(f4, H)} style={{ fill: "var(--m4)" }} />
      <path d={pines(f4, 33, 18, 20)} style={{ fill: "var(--m5)" }} />
      <rect x="-80" y="388" width="1760" height="40" style={{ fill: "var(--m5)" }} />
    </svg>
  );
}
