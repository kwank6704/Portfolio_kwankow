"use client";

import { useEffect, useState } from "react";
import { click, isMuted, setMuted } from "@/lib/audio";
import { profile, ui } from "@/content";
import { useI18n } from "@/components/shell/Providers";

const ids = ["about", "experience", "projects", "testing", "research", "skills", "resume", "contact"] as const;

export default function Nav() {
  const { t, lang, setLang, theme, setTheme } = useI18n();
  const [active, setActive] = useState("");
  const [muted, setM] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Out of the way while reading (scroll down), back as soon as you scroll up or reach the top.
    let lastY = window.scrollY, raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY, dy = y - lastY;
      setScrolled(y > 40);
      if (y < 120 || dy < -6) setHidden(false);
      else if (dy > 6) setHidden(true);
      if (Math.abs(dy) > 6) lastY = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const light = theme === "light";
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`}>
      <a href="#top" className="logo" aria-label="Back to top">
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" style={{ fill: "var(--accent)" }} />
          <path d="M10 8v16M10 16l9-8M12.5 14l8 10" style={{ stroke: "var(--bg)" }} strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
        <span>kwan<i>.</i>kow</span>
      </a>
      <nav aria-label="Primary">
        {ids.map((id) => (
          <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>{t(ui.nav[id])}</a>
        ))}
      </nav>
      <div className="nav-end">
        <button className="lang-btn" onClick={() => setLang(lang === "en" ? "th" : "en")} aria-label={t(ui.nav.lang)} title={t(ui.nav.lang)}>
          <b className={lang === "en" ? "on" : ""}>EN</b><b className={lang === "th" ? "on" : ""}>TH</b>
        </button>
        <button className="icon-btn" onClick={() => setTheme(light ? "dark" : "light")} aria-label={t(ui.nav.theme)} title={t(ui.nav.theme)}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
            {light ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
          </svg>
        </button>
        <button
          className="icon-btn"
          aria-pressed={muted}
          aria-label={t(ui.nav.sound)}
          title={t(ui.nav.sound)}
          onClick={() => { const m = !isMuted(); setMuted(m); setM(m); if (!m) click(); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
            <path d="M11 5 6 9H3v6h3l5 4z" />
            {muted ? <path d="m22 9-6 6m0-6 6 6" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
          </svg>
        </button>
        <a className="btn btn-sm hide-sm" href={`mailto:${profile.email}`}>{t(ui.nav.hire)}</a>
      </div>
    </header>
  );
}
