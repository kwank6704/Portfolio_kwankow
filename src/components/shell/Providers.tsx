"use client";

import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { L } from "@/content";
import { setAmbientTheme, startAmbient } from "@/lib/ambient";

export type Lang = "en" | "th";
export type Theme = "dark" | "light";

interface Ctx {
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  fontScale: number;
  cycleFont: () => void;
  t: (l: L) => string;
  /** Like t(), but turns <em>…</em> into real <em> elements. */
  rich: (l: L) => ReactNode;
}

/** Text-size steps; the button cycles through them. */
const FONT_STEPS = [1, 1.15, 1.3, 0.9];

const I18n = createContext<Ctx | null>(null);

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n outside Providers");
  return c;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const th = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setThemeState(th);
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "th" || saved === "en") setLangState(saved);
      else if (navigator.language.toLowerCase().startsWith("th")) setLangState("th");
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // text size: the saved value is also applied by /theme-init.js before first paint
  useEffect(() => {
    try {
      const v = parseFloat(localStorage.getItem("fs") ?? "1");
      if (FONT_STEPS.includes(v)) setFontScale(v);
    } catch { /* storage unavailable */ }
  }, []);
  const cycleFont = useCallback(() => {
    setFontScale((cur) => {
      const next = FONT_STEPS[(FONT_STEPS.indexOf(cur) + 1) % FONT_STEPS.length];
      document.documentElement.style.setProperty("--fs", String(next));
      try { localStorage.setItem("fs", String(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Sound may only start after a gesture: the first click, tap or key press turns the soundscape on.
  useEffect(() => {
    const go = () => { startAmbient(); setAmbientTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"); };
    const opts = { once: true, capture: true } as const;
    window.addEventListener("pointerdown", go, opts);
    window.addEventListener("keydown", go, opts);
    return () => { window.removeEventListener("pointerdown", go, opts); window.removeEventListener("keydown", go, opts); };
  }, []);
  useEffect(() => { setAmbientTheme(theme); }, [theme]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* ignore */ }
  }, []);
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch { /* ignore */ }
  }, []);

  const value = useMemo<Ctx>(() => {
    const t = (l: L) => l[lang];
    const rich = (l: L) => {
      const parts = l[lang].split(/(<em>.*?<\/em>)/g);
      return parts.map((p, i) =>
        p.startsWith("<em>") ? <em key={i}>{p.slice(4, -5)}</em> : <Fragment key={i}>{p}</Fragment>,
      );
    };
    return { lang, theme, setLang, setTheme, fontScale, cycleFont, t, rich };
  }, [lang, theme, setLang, setTheme, fontScale, cycleFont]);

  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}
