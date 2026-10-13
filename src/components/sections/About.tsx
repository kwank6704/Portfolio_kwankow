"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { Reveal, SectionHead } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { ui } from "@/content";

function Counter({ to, decimals, suffix }: { to: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toFixed(decimals)}<small>{suffix}</small></span>;
}


const ticker = ["Playwright", "React", "Next.js", "Postman", "PostgreSQL", "Django", "Spring Boot", "scikit-learn", "Docker", "Figma", "n8n", "Node.js", "MongoDB", "Python", "Java", "TypeScript"];

export default function About() {
  const { t, rich } = useI18n();
  const a = ui.about;
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div>{[...ticker, ...ticker].map((x, i) => <span key={i}>{x}<i>✦</i></span>)}</div>
      </div>
      <section id="about" className="sec">
        <SectionHead n="01" label={t(ui.nav.about)} title={rich(a.title)} />
        <div className="about-grid">
          <Reveal>
            <p className="big">{t(a.summary)}</p>
            <p className="muted">{t(a.edu)}</p>
            <p className="muted small">{t(a.langs)}</p>
          </Reveal>
          <Reveal delay={0.1} className="stat-grid">
            {a.stats.map((s) => (
              <div key={s.label.en} className="stat">
                <b><Counter to={s.value} decimals={s.decimals} suffix={s.suffix} /></b>
                <span>{t(s.label)}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
