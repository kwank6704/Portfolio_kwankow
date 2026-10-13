"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/shell/Providers";
import { profile, ui } from "@/content";
import { pass } from "@/lib/audio";

// A plain mailto: link silently does nothing on computers with no mail app set up, so the button
// opens a small menu instead: Gmail (works in any browser), the mail app, or just copy the address.
export default function EmailMenu({ label, big = false, center = false }: { label: string; big?: boolean; center?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { /* clipboard blocked: the address is shown above anyway */ }
    pass();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`email-menu ${center ? "center" : ""}`} ref={root}>
      <button className={`btn ${big ? "big" : "btn-sm"}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && (
        <div className="email-pop" role="menu">
          <p className="email-addr">{profile.email}</p>
          <a role="menuitem" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            {t(ui.email.gmail)} <span aria-hidden>↗</span>
          </a>
          <a role="menuitem" href={`mailto:${profile.email}`} onClick={() => setOpen(false)}>{t(ui.email.app)}</a>
          <button role="menuitem" onClick={copy}>{copied ? t(ui.contact.copied) : t(ui.contact.copy)}</button>
        </div>
      )}
    </div>
  );
}
