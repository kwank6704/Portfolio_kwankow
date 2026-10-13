// Server component: the whole illustrated landscape is generated here as plain SVG markup — zero client JS.
// Each depth plane is its own <div><svg/></div>, so the browser rasterises it once and the scroll parallax
// is a pure GPU transform (see .layer in globals.css). Colours come from CSS variables, so light/dark is free.
import { area, pines, r1, rng, ridge } from "@/lib/ridge";

const W = 1600;
const H = 900;

const f1 = ridge(1.2, 560, 70);
const f2 = ridge(3.4, 612, 80);
const f3 = ridge(5.1, 672, 90);
const f4 = ridge(7.7, 740, 80);
const f5 = ridge(9.3, 815, 60);


const stars = (() => {
  const r = rng(42);
  return Array.from({ length: 46 }, () => ({ x: r1(r() * W), y: r1(r() * 420), r: r1(0.8 + r() * 1.4), g: Math.floor(r() * 3) }));
})();

const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice" focusable="false">{children}</svg>
);

const Layer = ({ d, children, className = "" }: { d: number; children: React.ReactNode; className?: string }) => (
  <div className={`layer ${className}`} style={{ ["--d" as string]: d }}>{children}</div>
);

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <Layer d={0}>
        <Svg>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--sky-top)" }} />
              <stop offset="0.55" style={{ stopColor: "var(--sky-mid)" }} />
              <stop offset="1" style={{ stopColor: "var(--sky-low)" }} />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#sky)" />
          <g className="stars">
            {[0, 1, 2].map((g) => (
              <g key={g} className={`tw tw${g}`}>
                {stars.filter((s) => s.g === g).map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} />)}
              </g>
            ))}
          </g>
        </Svg>
      </Layer>

      <Layer d={5}>
        <Svg>
          <defs>
            <radialGradient id="glow">
              <stop offset="0" style={{ stopColor: "var(--sun-glow)", stopOpacity: 0.65 }} />
              <stop offset="1" style={{ stopColor: "var(--sun-glow)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle cx="1330" cy="440" r="300" fill="url(#glow)" />
          <circle cx="1330" cy="440" r="58" style={{ fill: "var(--sun)" }} />
        </Svg>
      </Layer>

      <div className="clouds">
        {[
          { top: "12%", w: "26vw", dur: 150, delay: -20, o: 0.7 },
          { top: "24%", w: "18vw", dur: 110, delay: -70, o: 0.5 },
          { top: "7%", w: "14vw", dur: 190, delay: -120, o: 0.4 },
        ].map((c, i) => (
          <div key={i} className="cloud" style={{ top: c.top, width: c.w, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, opacity: c.o }}>
            <svg viewBox="0 0 200 60" focusable="false"><path d="M10 48c-9 0-10-14 2-16 0-12 16-16 24-8 6-12 28-10 32 2 10-8 26-2 24 10 12-2 20 10 8 12z" style={{ fill: "var(--cloud)" }} /><path d="M104 48c-8 0-8-10 2-12 2-8 14-10 18-4 6-6 18-2 18 6 8 0 12 8 4 10z" style={{ fill: "var(--cloud)" }} /></svg>
          </div>
        ))}
        {[
          { top: "30%", dur: 46, delay: -8 },
          { top: "36%", dur: 62, delay: -30 },
        ].map((b, i) => (
          <div key={i} className="bird" style={{ top: b.top, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
            <svg viewBox="0 0 36 12" focusable="false"><path d="M1 8q8-9 17 0q9-9 17 0" fill="none" strokeWidth="1.6" strokeLinecap="round" style={{ stroke: "var(--bird)" }} /></svg>
          </div>
        ))}
      </div>

      <Layer d={4}><Svg><path d={area(f1, H)} style={{ fill: "var(--m1)" }} /></Svg></Layer>
      <Layer d={8}>
        <Svg>
          <defs>
            <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--mist)", stopOpacity: 0 }} />
              <stop offset="0.6" style={{ stopColor: "var(--mist)", stopOpacity: 0.5 }} />
              <stop offset="1" style={{ stopColor: "var(--mist)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={area(f2, H)} style={{ fill: "var(--m2)" }} />
          <rect x="-80" y="560" width="1760" height="130" fill="url(#mist)" />
        </Svg>
      </Layer>
      <Layer d={16}>
        <Svg>
          <path d={area(f3, H)} style={{ fill: "var(--m3)" }} />
          <rect x="-80" y="640" width="1760" height="110" fill="url(#mist)" />
        </Svg>
      </Layer>
      <Layer d={28}>
        <Svg>
          <path d={area(f4, H)} style={{ fill: "var(--m4)" }} />
          <path d={pines(f4, 11, 26, 15)} style={{ fill: "var(--m4)", filter: "none" }} className="pine" />
        </Svg>
      </Layer>
      <Layer d={42}>
        <Svg>
          <path d={area(f5, H)} style={{ fill: "var(--m5)" }} />
          <path d={pines(f5, 5, 16, 26, 0, 1180)} style={{ fill: "var(--m5)" }} />
          <path d={pines(f5, 9, 5, 22, 1500, 1620)} style={{ fill: "var(--m5)" }} />
        </Svg>
      </Layer>
      <div className="glass" />
    </div>
  );
}
