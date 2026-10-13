"use client";

import { useMemo, useState } from "react";
import { SectionHead, Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { profile, ui } from "@/content";

const COLORS = ["var(--text)", "var(--g1)", "var(--g4)", "var(--g2)"];
const COLS = 10; // 90 prompts per dialect → 10 × 9 grid
const GAP = 13;
const COL_W = 150;

export default function Research() {
  const { t, rich } = useI18n();
  const r = ui.res;
  const [stage, setStage] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  const dots = useMemo(
    () => Array.from({ length: 360 }, (_, i) => {
      const d = Math.floor(i / 90), n = i % 90;
      return { d, n, x: 30 + d * (COL_W + 30) + (n % COLS) * GAP, y: 74 + Math.floor(n / COLS) * GAP };
    }),
    [],
  );

  return (
    <section id="research" className="sec wide">
      <SectionHead n="05" label={t(ui.nav.research)} title={rich(r.title)} lead={t(r.lead)} />
      <div className="res-grid">
        <Reveal className="res-viz card">
          <svg viewBox="0 0 700 214" role="img" aria-label="360 prompt dots: 90 prompts across four Thai dialects">
            {r.dialects.map((d, i) => {
              const x = 30 + i * (COL_W + 30);
              const visible = i === 0 || stage >= 1;
              return (
                <g key={d.name.en} style={{ opacity: visible ? 1 : 0.1, transition: "opacity .6s" }}>
                  <text x={x} y="30" style={{ fill: COLORS[i] }} fontSize="13" fontWeight="700" fontFamily="var(--font-display)">{t(d.name)}</text>
                  <text x={x} y="46" style={{ fill: "var(--muted)" }} fontSize="9.5" fontFamily="var(--font-mono)">{t(d.sub)} · 90</text>
                </g>
              );
            })}
            {dots.map((p, i) => {
              const show = p.d === 0 || stage >= 1;
              const fromX = 30 + (p.n % COLS) * GAP;
              return (
                <circle
                  key={i}
                  cx={show ? p.x : fromX}
                  cy={p.y}
                  r={hover === i ? 5 : 3.4}
                  className={stage === 2 ? "judge" : ""}
                  style={{
                    fill: COLORS[p.d],
                    opacity: show ? 0.95 : 0,
                    transition: `cx .9s cubic-bezier(.2,.7,.2,1) ${p.d * 0.12 + (p.n % COLS) * 0.015}s, opacity .5s ${p.d * 0.12}s, r .2s`,
                    animationDelay: `${(p.n % COLS) * 0.08 + Math.floor(p.n / COLS) * 0.08}s`,
                  }}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
              );
            })}
            {hover !== null && (dots[hover].d === 0 || stage >= 1) && (
              <text x="350" y="206" textAnchor="middle" style={{ fill: "var(--text)" }} fontSize="11" fontFamily="var(--font-mono)">
                {t(r.prompt)} {dots[hover].n + 1} · {t(r.dialects[dots[hover].d].name)}
              </text>
            )}
          </svg>
          <div className="stepper" role="tablist">
            {r.stages.map((s, i) => (
              <button key={s.t.en} role="tab" aria-selected={stage === i} className={stage === i ? "on" : ""} onClick={() => setStage(i)}>
                <span>{i + 1}</span>{t(s.t)}
              </button>
            ))}
          </div>
          <p className="stage-text" key={stage}>{t(r.stages[stage].d)}</p>
        </Reveal>
        <Reveal delay={0.1} className="res-find">
          <p className="eyebrow"><span>{t(r.finding)}</span></p>
          <p className="big">{t(r.findText)}</p>
          <a className="btn" href={profile.paper} target="_blank" rel="noreferrer">{t(r.read)}</a>
        </Reveal>
      </div>
    </section>
  );
}
