"use client";

import { useEffect } from "react";

// Drives the "walk into the monitor" scroll: one passive scroll listener (rAF-throttled) that writes a single
// CSS variable (--e = eased progress). Everything else — scale, translate, fades — is pure CSS calc() on the GPU.
// The stage geometry (cover-size, zoom factor, centring offsets) is measured once and again on resize.
export default function HeroZoom() {
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const scene = document.querySelector<HTMLElement>(".scene");
    let vh = 1, raf = 0, last = -1, zoomed = false;

    const update = (force = false) => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)));
      if (!force && p === last) return;
      last = p;
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
      hero.style.setProperty("--e", e.toFixed(4));
      scene?.style.setProperty("--hp", e.toFixed(3));
      const z = p >= 1;
      if (z !== zoomed) {
        zoomed = z;
        hero.classList.toggle("is-zoomed", z);
        scene?.classList.toggle("is-off", z);
        window.dispatchEvent(new CustomEvent("hero-zoom", { detail: z }));
      }
    };

    const measure = () => {
      const vw = window.innerWidth;
      vh = window.innerHeight;
      // monitor should be ~92% of the width on phones, and the room should cover the viewport on wide screens
      const narrow = vw / vh < 1.2;
      const sw = narrow ? vw * 1.3 : Math.min(Math.max(vw, (vh * 16) / 9), vw * 1.48);
      const sh = (sw * 9) / 16;
      // on phones the monitor and the lamp must both stay in view, so the camera sits right of centre
      const left = narrow ? -0.185 * sw : (vw - sw) / 2, top = (vh - sh) / 2;
      const cw = sw * 0.62, ch = sh * 0.62; // the screen rectangle inside the stage
      const cx = sw * 0.19 + cw / 2, cy = sh * (100 / 900) + ch / 2;
      const z = Math.max(vw / cw, vh / ch) * 1.04;
      const s = hero.style;
      s.setProperty("--sw", `${sw}px`);
      s.setProperty("--sh", `${sh}px`);
      s.setProperty("--shift", `${(left - (vw - sw) / 2).toFixed(1)}px`);
      s.setProperty("--z", z.toFixed(3));
      s.setProperty("--dx", `${(vw / 2 - (left + cx)).toFixed(1)}px`);
      s.setProperty("--dy", `${(vh / 2 - (top + cy)).toFixed(1)}px`);
      s.setProperty("--ox", `${cx.toFixed(1)}px`);
      s.setProperty("--oy", `${cy.toFixed(1)}px`);
      update(true);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => update()); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
