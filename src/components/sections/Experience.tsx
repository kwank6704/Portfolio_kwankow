"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal, SectionHead } from "@/components/ui/Reveal";
import DetailSheet, { type DetailItem } from "@/components/ui/DetailSheet";
import { useI18n } from "@/components/shell/Providers";
import { click } from "@/lib/audio";
import { experience, ui } from "@/content";

export default function Experience() {
  const { t, rich } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const nav = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + experience.length) % experience.length)), []);
  const close = useCallback(() => setOpen(null), []);

  const e = open === null ? null : experience[open];
  const item: DetailItem | null = e && {
    id: e.id,
    title: t(e.role),
    subtitle: `${e.org} · ${t(e.tag)}`,
    meta: `${t(e.when)} · ${t(e.span)}`,
    accent: "var(--brand)",
    stack: e.tech,
    detail: e.detail,
  };

  return (
    <section id="experience" className="sec">
      <SectionHead n="02" label={t(ui.nav.experience)} title={rich(ui.exp.title)} />
      <div className="timeline" ref={ref}>
        <div className="tl-rail" aria-hidden="true">
          <motion.div className="tl-fill" style={{ scaleY: h }} />
        </div>
        {experience.map((x, i) => (
          <Reveal key={x.id} delay={0.05 * i} className="tl-item">
            <span className="tl-node" aria-hidden="true" />
            <div className="tl-when"><b>{t(x.when)}</b><span>{t(x.span)}</span></div>
            <div className="card tl-card">
              <h3>{t(x.role)}</h3>
              <p className="org">{x.org} <em>· {t(x.tag)}</em></p>
              <p>{t(x.text)}</p>
              <ul className="chips">{x.tech.map((s) => <li key={s}>{s}</li>)}</ul>
              <button className="more-btn" onClick={() => { click(); setOpen(i); }}>{t(ui.exp.more)} <span aria-hidden>→</span></button>
            </div>
          </Reveal>
        ))}
      </div>
      <DetailSheet item={item} onClose={close} onNav={nav} />
    </section>
  );
}
