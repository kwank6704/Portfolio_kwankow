"use client";

import { useCallback, useState } from "react";
import { Reveal, SectionHead } from "@/components/ui/Reveal";
import Cover from "@/components/sections/Covers";
import DetailSheet, { type DetailItem } from "@/components/ui/DetailSheet";
import { useI18n } from "@/components/shell/Providers";
import { click } from "@/lib/audio";
import { otherProjects, projects, ui, type Project } from "@/content";

function Card({ p, i, onOpen }: { p: Project; i: number; onOpen: () => void }) {
  const { t } = useI18n();
  const u = ui.proj;

  return (
    <Reveal className={`proj-cell ${p.featured ? "feat" : ""}`} delay={(i % 2) * 0.08} y={40}>
    <article className="proj" style={{ ["--accent" as string]: p.accent }}>
      <button className="proj-art" onClick={onOpen} aria-label={`${t(u.more)}: ${p.title}`}><Cover id={p.id} /></button>
      <div className="proj-body">
        <p className="proj-meta"><span>{t(p.year)}</span>{t(p.kind)}</p>
        <h3>{p.title}</h3>
        <p className="proj-text">{t(p.text)}</p>
        {p.role && <p className="proj-role"><b>{t(u.role)}</b> {t(p.role)}</p>}
        <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="proj-links">
          <button className="more-btn" onClick={onOpen}>{t(u.more)} <span aria-hidden>→</span></button>
          {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="link-live">{t(u.live)} <span aria-hidden>↗</span></a>}
          {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">{t(u.source)} <span aria-hidden>↗</span></a>}
        </div>
      </div>
    </article>
    </Reveal>
  );
}

export default function Projects() {
  const { t, rich } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const u = ui.proj;

  const nav = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + projects.length) % projects.length)), []);
  const close = useCallback(() => setOpen(null), []);

  const p = open === null ? null : projects[open];
  const item: DetailItem | null = p && {
    id: p.id,
    title: p.title,
    subtitle: p.kind,
    meta: t(p.year),
    accent: p.accent,
    stack: p.stack,
    detail: p.detail,
    art: <Cover id={p.id} />,
    links: [
      ...(p.live ? [{ label: u.live, href: p.live }] : []),
      ...(p.repo ? [{ label: u.source, href: p.repo }] : []),
    ],
  };

  return (
    <section id="projects" className="sec wide">
      <SectionHead n="03" label={t(ui.nav.projects)} title={rich(u.title)} lead={t(u.lead)} />
      <div className="proj-grid">
        {projects.map((x, i) => <Card key={x.id} p={x} i={i} onOpen={() => { click(); setOpen(i); }} />)}
      </div>
      <Reveal className="others">
        <h3>{t(u.others)}</h3>
        <ul className="chips big">{otherProjects.map((o) => <li key={o.en}>{t(o)}</li>)}</ul>
      </Reveal>
      <DetailSheet item={item} onClose={close} onNav={nav} />
    </section>
  );
}
