"use client";

import HeroStage from "@/components/hero/HeroStage";
import HeroZoom from "@/components/hero/HeroZoom";
import RoomFront from "@/components/hero/RoomFront";
import { useI18n } from "@/components/shell/Providers";
import { click } from "@/lib/audio";
import { profile, ui } from "@/content";

// The hero is a room: the page background is the window (the landscape outside), the monitor is the page.
// Scrolling zooms into the screen until it fills the viewport — then the content scrolls like normal.
// The desk lamp is the theme switch: lamp on = night, lamp off = day, and the view outside follows.
export default function Hero() {
  const { t, theme, setTheme } = useI18n();
  const h = ui.hero;
  const night = theme === "dark";

  return (
    <section id="top" className="hero">
      <HeroZoom />
      <div className="hero-pin">
        <div className="stage">
          <RoomFront />
          <div className="wash" aria-hidden="true" />
          <div className="screen">
            <HeroStage labels={{ bugs: t(h.bugs), n5: t(h.n5), n15: t(h.n15), n30: t(h.n30) }} />
            <div className="chrome fade" aria-hidden="true"><i /><i /><i /><span>kwan.dev · {t(profile.location)}</span></div>
            <div className="screen-text fade">
              <h1>{t(profile.name)}</h1>
              <p className="roles">{profile.roles.map((r) => t(r)).join("  ·  ")}</p>
              <p className="intro">{t(h.pre)}</p>
            </div>
          </div>
          <button
            className="lamp-btn"
            aria-pressed={night}
            aria-label={t(ui.nav.theme)}
            title={t(ui.nav.theme)}
            onClick={() => { click(); setTheme(night ? "light" : "dark"); }}
          />
        </div>

        <div className="dock">
          <div className="dock-cta">
            <a className="btn" href="#projects">{t(h.cta1)} <span aria-hidden>↓</span></a>
            <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <p className="dock-hint">{t(h.hint)}</p>
        </div>
      </div>
    </section>
  );
}
