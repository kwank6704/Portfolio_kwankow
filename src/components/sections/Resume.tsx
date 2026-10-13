"use client";

import { Reveal, SectionHead } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { profile, ui } from "@/content";

export default function Resume() {
  const { t, rich } = useI18n();
  const r = ui.resume;

  const items = [
    { href: "/Nattarat_Samartkit_Resume.pdf", download: true, title: t(r.download), sub: t(r.downloadSub), icon: "download", primary: true },
    { href: profile.drive, title: t(r.drive), sub: t(r.driveSub), icon: "folder" },
    { href: profile.paper, title: t(r.paper), sub: t(r.paperSub), icon: "paper" },
    { href: `mailto:${profile.email}`, title: t(r.mail), sub: profile.email, icon: "mail" },
  ];

  return (
    <section id="resume" className="sec">
      <SectionHead n="08" label={t(ui.nav.resume)} title={rich(r.title)} lead={t(r.lead)} />
      <div className="doc-grid">
        {items.map((it, i) => (
          <Reveal key={it.icon} delay={i * 0.06}>
            <a
              className={`doc ${it.primary ? "primary" : ""}`}
              href={it.href}
              {...(it.download ? { download: "Nattarat_Samartkit_Resume.pdf" } : { target: it.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" })}
            >
              <span className="doc-ico" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {it.icon === "download" && <><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></>}
                  {it.icon === "folder" && <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
                  {it.icon === "paper" && <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h6M10 17h6" /></>}
                  {it.icon === "mail" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}
                </svg>
              </span>
              <span className="doc-t">{it.title}</span>
              <span className="doc-s">{it.sub}</span>
              <span className="doc-go" aria-hidden="true">{it.download ? "↓" : "↗"}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
