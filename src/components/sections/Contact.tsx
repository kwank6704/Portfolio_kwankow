"use client";

import { useState } from "react";
import { Reveal, SectionHead } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { achievements, leadership, profile, ui } from "@/content";
import { pass } from "@/lib/audio";
import EmailMenu from "@/components/shell/EmailMenu";
import Resume from "@/components/sections/Resume";
import Horizon from "@/components/scene/Horizon";

export default function Contact() {
  const { t, rich } = useI18n();
  const [copied, setCopied] = useState(false);
  const c = ui.contact;

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { /* ignore */ }
    pass();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <section id="more" className="sec wide">
        <SectionHead n="07" label={t(ui.more.lead)} title={rich(ui.more.title)} />
        <div className="ach-grid">
          {achievements.map((a, i) => (
            <Reveal key={a.text.en} delay={i * 0.06} className="card ach">
              <b>{a.big}</b>
              <p>{t(a.text)}</p>
              <span>{a.year}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="lead-wrap">
          <h3>{t(ui.more.lead)}</h3>
          <ul className="lead-list">
            {leadership.map((l) => (
              <li key={l.role.en + l.org.en}><b>{t(l.role)}</b><span>{t(l.org)}</span><i>{l.year}</i></li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Resume />

      <section id="contact" className="sec contact">
        <Reveal>
          <p className="eyebrow"><span>09</span> {t(ui.nav.contact)}</p>
          <h2 className="mega">{rich(c.title)}</h2>
          <p className="lead">{t(c.lead)}</p>
          <div className="contact-row">
            <EmailMenu big center label={profile.email} />
            <button className="btn ghost big" onClick={copy}>{copied ? t(c.copied) : t(c.copy)}</button>
          </div>
          <div className="contact-links">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.drive} target="_blank" rel="noreferrer">{t(c.drive)}</a>
            <a href={profile.paper} target="_blank" rel="noreferrer">{t(c.paper)}</a>
          </div>
        </Reveal>
      </section>
      <footer className="foot">
        <Horizon />
        <p className="foot-text">© 2026 {t(profile.name)}</p>
      </footer>
    </>
  );
}
