"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { Reveal, SectionHead } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { ui } from "@/content";

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
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

const Tape = () => <i className="tape" aria-hidden="true" />;

// The "about me" as notes pinned to a board. Pure CSS tilt/hover, one tiny counter animation.
export default function About() {
  const { t, rich } = useI18n();
  const a = ui.about;

  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div>{[...ticker, ...ticker].map((x, i) => <span key={i}>{x}<i>✦</i></span>)}</div>
      </div>
      <section id="about" className="sec wide">
        <SectionHead n="01" label={t(ui.nav.about)} title={<span className="about-title">{rich(a.title)}</span>} />
        <div className="about-grid">
          <Reveal className="about-intro">
            <p className="big">{t(a.summary)}</p>
          </Reveal>
          <Reveal delay={0.1} className="board">
            <article className="note pink tilt-l n-st">
              <Tape />
              <p className="note-tag">{t(a.studying.tag)}</p>
              <h3>{t(a.studying.title)}</h3>
              <p className="note-sub">{t(a.studying.sub)}</p>
            </article>
            <article className="note yellow tilt-r n-gp">
              <Tape />
              <p className="note-tag">{t(a.gpax.tag)}</p>
              <p className="note-num"><Counter to={a.gpax.value} decimals={a.gpax.decimals} suffix={a.gpax.suffix} /></p>
            </article>
            <article className="note mint tilt-r2 n-lo">
              <Tape />
              <p className="note-tag">{t(a.looking.tag)}</p>
              <ul className="note-list">{a.looking.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
            <article className="note lilac tilt-l2 n-la">
              <Tape />
              <p className="note-tag">{t(a.languages.tag)}</p>
              <ul className="note-list">{a.languages.items.map((x) => <li key={x.en}>{t(x)}</li>)}</ul>
            </article>
            <article className="note sky tilt-r n-so">
              <Tape />
              <p className="note-tag">{t(a.sofar.tag)}</p>
              <div className="note-pair">
                <p><b className="note-num"><Counter to={a.sofar.internships.value} /></b><span>{t(a.sofar.internships.label)}</span></p>
                <p><b className="note-num"><Counter to={a.sofar.repos.value} suffix="+" /></b><span>{t(a.sofar.repos.label)}</span></p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const ticker = ["Playwright", "React", "Next.js", "Postman", "PostgreSQL", "Django", "Spring Boot", "scikit-learn", "Docker", "Figma", "n8n", "Node.js", "MongoDB", "Python", "Java", "TypeScript"];
