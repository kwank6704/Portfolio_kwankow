"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/shell/Providers";
import { ui, type Detail, type L } from "@/content";

export interface DetailItem {
  id: string;
  title: string;
  subtitle: L | string;
  meta: string;
  accent: string;
  stack: string[];
  detail: Detail;
  links?: { label: L; href: string }[];
  art?: React.ReactNode;
}

function Flow({ nodes, loop, accent }: { nodes: L[]; loop?: boolean; accent: string }) {
  const { t } = useI18n();
  return (
    <div className="flow" style={{ ["--accent" as string]: accent }}>
      <ol>
        {nodes.map((n, i) => (
          <li key={i} style={{ ["--i" as string]: i }}>
            <span className="flow-n">{i + 1}</span>
            <span className="flow-t">{t(n)}</span>
            {i < nodes.length - 1 && <span className="flow-arrow" aria-hidden="true"><i /></span>}
          </li>
        ))}
      </ol>
      {loop && (
        <p className="flow-loop" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></svg>
          {t(ui.detail.loop)}
        </p>
      )}
    </div>
  );
}

// A side panel that slides in. It stays mounted after the first open (so the close animation can play)
// and keeps showing the last item while it slides out.
export default function DetailSheet({ item, onClose, onNav }: { item: DetailItem | null; onClose: () => void; onNav?: (dir: 1 | -1) => void }) {
  const { t, lang } = useI18n();
  const panel = useRef<HTMLElement>(null);
  const [shown, setShown] = useState<DetailItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!item) { setOpen(false); return; }
    setShown(item);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    return () => cancelAnimationFrame(id);
  }, [item]);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav?.(1);
      if (e.key === "ArrowLeft") onNav?.(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose, onNav]);

  if (!shown) return null;
  const it = shown;

  return (
    <div className={`sheet-wrap ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="sheet-scrim" onClick={onClose} />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={it.title}
        className="sheet"
        style={{ ["--accent" as string]: it.accent }}
      >
        <div className="sheet-bar">
          <div className="sheet-nav">
            {onNav && <>
              <button className="icon-btn" onClick={() => onNav(-1)} aria-label={t(ui.detail.prev)}>←</button>
              <button className="icon-btn" onClick={() => onNav(1)} aria-label={t(ui.detail.next)}>→</button>
            </>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label={t(ui.detail.close)}>✕</button>
        </div>

        <div className="sheet-scroll" key={it.id + lang}>
          {it.art && <div className="sheet-art">{it.art}</div>}
          <p className="eyebrow"><span>{it.meta}</span></p>
          <h2>{it.title}</h2>
          <p className="sheet-sub">{typeof it.subtitle === "string" ? it.subtitle : t(it.subtitle)}</p>

          <h3 className="sh">{t(ui.detail.summary)}</h3>
          <p className="sheet-summary">{t(it.detail.summary)}</p>

          <h3 className="sh">{t(it.detail.flowTitle ?? ui.detail.flow)}</h3>
          <Flow nodes={it.detail.flow} loop={it.detail.loop} accent={it.accent} />

          <h3 className="sh">{t(ui.detail.did)}</h3>
          <ul className="did">
            {it.detail.did.map((d, i) => <li key={i}>{t(d)}</li>)}
          </ul>

          <h3 className="sh">{t(it.detail.phasesTitle ?? ui.detail.timeline)}</h3>
          <ol className="mini-tl">
            {it.detail.phases.map((p, i) => (
              <li key={i}>
                <b>{t(p.when)}</b>
                <span>{t(p.what)}</span>
              </li>
            ))}
          </ol>

          <h3 className="sh">{t(ui.detail.stack)}</h3>
          <ul className="chips">{it.stack.map((s) => <li key={s}>{s}</li>)}</ul>

          {it.links && it.links.length > 0 && (
            <div className="proj-links sheet-links">
              {it.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{t(l.label)} <span aria-hidden>↗</span></a>)}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
