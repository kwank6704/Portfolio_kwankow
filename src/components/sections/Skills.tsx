"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal, SectionHead } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { skillGroups, ui } from "@/content";

// A radial tree: core → group hubs → skill dots, with labels rotated along the radius.
// Labels can never overlap because every skill owns its own angle (360° / number of skills).
const SIZE = 920, C = SIZE / 2;
const R_CORE = 40, R_HUB = 150, R_DOT = 262, R_LABEL = R_DOT + 14, GAP = 7;
const r1 = (n: number) => Math.round(n * 10) / 10;
const polar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [r1(C + r * Math.cos(a)), r1(C + r * Math.sin(a))];
};

export default function Skills() {
  const { t, rich } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  // draw the links when the chart scrolls into view; pause the pulsing when it leaves
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("idle", !e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const layout = useMemo(() => {
    const total = skillGroups.reduce((n, g) => n + g.items.length, 0);
    const step = (360 - GAP * skillGroups.length) / total;
    let cursor = -90 + GAP / 2;
    return skillGroups.map((g) => {
      const hubDeg = cursor + (g.items.length * step) / 2;
      const hub = polar(R_HUB, hubDeg);
      const leaves = g.items.map((label, i) => {
        const deg = cursor + (i + 0.5) * step;
        const norm = ((deg % 360) + 360) % 360;
        return { label, deg: r1(deg), flip: norm > 90 && norm < 270, dot: polar(R_DOT, deg), ctrl: polar((R_HUB + R_DOT) / 2 + 16, deg) };
      });
      cursor += g.items.length * step + GAP;
      return { g, hub, leaves };
    });
  }, []);

  return (
    <section id="skills" className="sec wide">
      <SectionHead n="06" label={t(ui.nav.skills)} title={rich(ui.skills.title)} lead={t(ui.skills.lead)} />
      <Reveal className="skill-card">
        <svg ref={svg} viewBox={`0 0 ${SIZE} ${SIZE}`} className="skill-svg idle" role="img" aria-label="Skills grouped by category">
          <circle cx={C} cy={C} r={R_HUB} className="ring" />
          <circle cx={C} cy={C} r={R_DOT} className="ring dashed" />
          {layout.map(({ g, hub, leaves }, gi) => (
            <g key={g.name.en} className="grp" style={{ opacity: active === null || active === gi ? 1 : 0.14 }}>
              <line x1={C} y1={C} x2={hub[0]} y2={hub[1]} className="spoke" style={{ stroke: g.color }} />
              {leaves.map((l, li) => (
                <g key={l.label}>
                  <path d={`M${hub[0]} ${hub[1]}Q${l.ctrl[0]} ${l.ctrl[1]} ${l.dot[0]} ${l.dot[1]}`} pathLength={1} className="link" style={{ stroke: g.color, animationDelay: `${gi * 0.12 + li * 0.05}s` }} />
                  <circle cx={l.dot[0]} cy={l.dot[1]} r="4.5" className="dot" style={{ fill: g.color, animationDelay: `${-(gi + li) * 0.7}s` }} />
                  <g transform={`rotate(${r1(l.flip ? l.deg + 180 : l.deg)} ${C} ${C})`}>
                    <text x={l.flip ? C - R_LABEL : C + R_LABEL} y={C} dy="0.34em" textAnchor={l.flip ? "end" : "start"} className="leaf">{l.label}</text>
                  </g>
                </g>
              ))}
              <g
                className="hub" tabIndex={0} role="button" aria-label={t(g.name)}
                onPointerEnter={() => setActive(gi)} onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(gi)} onBlur={() => setActive(null)}
                onClick={() => setActive(active === gi ? null : gi)}
              >
                <circle cx={hub[0]} cy={hub[1]} r="38" className="hub-bg" style={{ stroke: g.color }} />
                <text x={hub[0]} y={hub[1]} dy="0.34em" textAnchor="middle" className="hub-t">{t(g.name)}</text>
              </g>
            </g>
          ))}
          <circle cx={C} cy={C} r={R_CORE + 12} className="core-halo" />
          <circle cx={C} cy={C} r={R_CORE} className="core" />
          <text x={C} y={C} dy="0.34em" textAnchor="middle" className="core-t">Kwan</text>
        </svg>
        <div className="skill-chips">
          {skillGroups.map((g) => (
            <div key={g.name.en}>
              <h3><i style={{ background: g.color }} />{t(g.name)}</h3>
              <ul className="chips">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
