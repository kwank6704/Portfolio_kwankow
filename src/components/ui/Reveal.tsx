"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Fades/slides a block in the first time it scrolls into view. One IntersectionObserver, CSS does the animation.
// (The hidden starting state only applies when JS is running — see the .js class set by /theme-init.js.)
export function Reveal({ children, delay = 0, y = 28, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { rootMargin: "0px 0px -60px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ["--d" as string]: `${delay}s`, ["--y" as string]: `${y}px` }}>
      {children}
    </div>
  );
}

export function SectionHead({ n, label, title, lead }: { n: string; label: string; title: ReactNode; lead?: string }) {
  return (
    <Reveal className="sec-head">
      <p className="eyebrow"><span>{n}</span> {label}</p>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}
