"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A hand-drawn-feeling trail down the left margin that links every section. Measured once (and on resize),
// then updated by a throttled scroll listener that only touches 3 SVG attributes — no React re-renders.
interface Geo { d: string; h: number; pts: { x: number; y: number; f: number }[]; y0: number; y1: number }

export default function Journey() {
  const root = useRef<SVGSVGElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const nodes = useRef<(SVGCircleElement | null)[]>([]);
  const len = useRef(0);
  const [geo, setGeo] = useState<Geo | null>(null);

  const measure = useCallback(() => {
    const main = root.current?.parentElement;
    if (!main) return;
    const mt = main.getBoundingClientRect().top + window.scrollY;
    const secs = Array.from(main.querySelectorAll<HTMLElement>("section[id]")).filter((s) => s.id !== "top");
    if (!secs.length) return;
    let left = Infinity;
    const raw = secs.map((s) => {
      const r = s.getBoundingClientRect();
      left = Math.min(left, r.left + parseFloat(getComputedStyle(s).paddingLeft));
      const e = s.querySelector<HTMLElement>(".eyebrow");
      const y = (e ? e.getBoundingClientRect().top : r.top + 100) + window.scrollY - mt + 9;
      return y;
    });
    const cx = Math.max(9, left - 40);
    const amp = Math.min(8, cx - 5);
    const y0 = Math.max(0, raw[0] - 150); // the trail starts just above the first section
    const ys = [y0, ...raw];
    const pts = ys.map((y, i) => ({ x: i === 0 ? cx : cx + (i % 2 ? -amp : amp), y: Math.round(y), f: 0 }));
    const span = pts[pts.length - 1].y - y0;
    pts.forEach((p) => { p.f = (p.y - y0) / span; });
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], m = (a.y + b.y) / 2;
      d += `C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}`;
    }
    setGeo({ d, h: Math.round(main.scrollHeight), pts, y0, y1: pts[pts.length - 1].y });
  }, []);

  useEffect(() => {
    const t = setTimeout(measure, 300);
    let raf = 0;
    const re = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("resize", re);
    const ro = new ResizeObserver(re);
    const main = root.current?.parentElement;
    if (main) ro.observe(main);
    document.fonts?.ready.then(re).catch(() => {});
    return () => { clearTimeout(t); cancelAnimationFrame(raf); window.removeEventListener("resize", re); ro.disconnect(); };
  }, [measure]);

  useEffect(() => {
    if (!geo || !trail.current) return;
    const path = trail.current;
    len.current = path.getTotalLength();
    path.style.strokeDasharray = `${len.current}`;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.max(0, Math.min(1, (window.scrollY + window.innerHeight * 0.6 - geo.y0) / (geo.y1 - geo.y0)));
      path.style.strokeDashoffset = `${len.current * (1 - p)}`;
      const pt = path.getPointAtLength(len.current * p);
      head.current?.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      nodes.current.forEach((n, i) => n?.classList.toggle("on", p >= geo.pts[i + 1].f - 0.004));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [geo]);

  return (
    <svg ref={root} className="journey" aria-hidden="true" style={{ height: geo?.h }} focusable="false">
      {geo && (
        <>
          <path d={geo.d} className="j-base" />
          <path ref={trail} d={geo.d} className="j-trail" />
          {geo.pts.slice(1).map((p, i) => (
            <circle key={i} ref={(el) => { nodes.current[i] = el; }} cx={p.x} cy={p.y} r="4.5" className="j-node" />
          ))}
          <g ref={head}><circle r="9" className="j-halo" /><circle r="3.6" className="j-head" /></g>
        </>
      )}
    </svg>
  );
}
