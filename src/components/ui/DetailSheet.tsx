"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
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
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.45 }}
          >
            <span className="flow-n">{i + 1}</span>
            <span className="flow-t">{t(n)}</span>
            {i < nodes.length - 1 && <span className="flow-arrow" aria-hidden="true"><i /></span>}
          </motion.li>
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

export default function DetailSheet({ item, onClose, onNav }: { item: DetailItem | null; onClose: () => void; onNav?: (dir: 1 | -1) => void }) {
  const { t, lang } = useI18n();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;
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
  }, [item, onClose, onNav]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="sheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="sheet-scrim" onClick={onClose} />
          <motion.aside
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="sheet"
            style={{ ["--accent" as string]: item.accent }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
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

            <div className="sheet-scroll" key={item.id + lang}>
              {item.art && <div className="sheet-art">{item.art}</div>}
              <p className="eyebrow"><span>{item.meta}</span></p>
              <h2>{item.title}</h2>
              <p className="sheet-sub">{typeof item.subtitle === "string" ? item.subtitle : t(item.subtitle)}</p>

              <h3 className="sh">{t(ui.detail.summary)}</h3>
              <p className="sheet-summary">{t(item.detail.summary)}</p>

              <h3 className="sh">{t(item.detail.flowTitle ?? ui.detail.flow)}</h3>
              <Flow nodes={item.detail.flow} loop={item.detail.loop} accent={item.accent} />

              <h3 className="sh">{t(ui.detail.did)}</h3>
              <ul className="did">
                {item.detail.did.map((d, i) => <li key={i}>{t(d)}</li>)}
              </ul>

              <h3 className="sh">{t(item.detail.phasesTitle ?? ui.detail.timeline)}</h3>
              <ol className="mini-tl">
                {item.detail.phases.map((p, i) => (
                  <li key={i}>
                    <b>{t(p.when)}</b>
                    <span>{t(p.what)}</span>
                  </li>
                ))}
              </ol>

              <h3 className="sh">{t(ui.detail.stack)}</h3>
              <ul className="chips">{item.stack.map((s) => <li key={s}>{s}</li>)}</ul>

              {item.links && item.links.length > 0 && (
                <div className="proj-links sheet-links">
                  {item.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{t(l.label)} <span aria-hidden>↗</span></a>)}
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
