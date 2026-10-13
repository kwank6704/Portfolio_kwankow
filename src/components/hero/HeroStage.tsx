"use client";

import { useEffect, useRef, useState } from "react";
import { squash } from "@/lib/audio";

// Lives INSIDE the monitor's screen (.screen). Two small canvases, built to stay light:
//  · particles — ~450 chunky dots form the word; the loop SLEEPS once everything has settled and the pointer
//    is idle, and wakes on pointer movement or a theme change. Idle cost: zero.
//  · bugs — a handful of sprites at 30 fps, only while the screen is visible and not zoomed past.
export interface HeroLabels { bugs: string; n5: string; n15: string; n30: string }

interface P { x: number; y: number; hx: number; hy: number; vx: number; vy: number; c: number; r: number }
interface Bug { x: number; y: number; a: number; s: number; t: number; dead: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number }

const PAL_NIGHT = ["#f0e9dc", "#ffc2d9", "#ff8fb8", "#ffb3cf"];
const PAL_DAY = ["#2a2438", "#4b3f6a", "#bd2d6b", "#e07aa6"];

export default function HeroStage({ labels, word = "KWAN" }: { labels: HeroLabels; word?: string }) {
  const pc = useRef<HTMLCanvasElement>(null);
  const bc = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [note, setNote] = useState("");
  const lab = useRef(labels);
  lab.current = labels;

  useEffect(() => {
    const pCanvas = pc.current!, bCanvas = bc.current!;
    const screen = pCanvas.closest<HTMLElement>(".screen")!;
    const hero = document.getElementById("top")!;
    const root = document.documentElement;
    const pg = pCanvas.getContext("2d")!, bg = bCanvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, S = 1, alive = true, visible = true, zoomed = false;
    let parts: P[] = [];
    const bugs: Bug[] = [];
    const sparks: Spark[] = [];
    const mouse = { x: -999, y: -999, down: false, last: 0 };
    let pRaf = 0, bRaf = 0, lastB = 0, squashed = 0;

    /* ── particles ── */
    const stepP = () => {
      pRaf = 0;
      if (!visible || zoomed || document.hidden) return;
      const pal = root.dataset.theme === "light" ? PAL_DAY : PAL_NIGHT;
      pg.clearRect(0, 0, W, H);
      let energy = 0, last = -1;
      const R = 80 * S, R2 = R * R;
      for (const p of parts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * (mouse.down ? -2 : 6);
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        p.vx += (p.hx - p.x) * 0.06; p.vy += (p.hy - p.y) * 0.06;
        p.vx *= 0.84; p.vy *= 0.84;
        p.x += p.vx; p.y += p.vy;
        energy += Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y);
        if (p.c !== last) { pg.fillStyle = pal[p.c]; last = p.c; }
        pg.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      const active = performance.now() - mouse.last < 400;
      if (energy > parts.length * 0.03 || active) pRaf = requestAnimationFrame(stepP);
    };
    const wakeP = () => { if (!pRaf && visible && !zoomed && !reduce) pRaf = requestAnimationFrame(stepP); };

    const build = async () => {
      W = screen.clientWidth; H = screen.clientHeight;
      if (W < 60 || H < 60 || W * H > 6e6) return; // not laid out yet, or absurdly large
      S = Math.max(0.6, W / 900);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [pCanvas, bCanvas]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      pg.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg.setTransform(dpr, 0, 0, dpr, 0, 0);
      try { await document.fonts.ready; } catch { /* ignore */ }

      const chrome = screen.querySelector<HTMLElement>(".chrome");
      const text = screen.querySelector<HTMLElement>(".screen-text");
      const top = (chrome?.offsetHeight ?? 24) + 6;
      const avail = Math.max(60, H - top - (text?.offsetHeight ?? 90) - 8);
      const off = document.createElement("canvas");
      off.width = Math.ceil(W); off.height = Math.ceil(H);
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(document.body).fontFamily;
      let fs = 200;
      o.font = `800 ${fs}px ${family}`;
      fs = Math.min((fs * W * 0.8) / o.measureText(word).width, avail / 0.78);
      o.font = `800 ${fs}px ${family}`;
      o.textAlign = "center"; o.textBaseline = "alphabetic";
      o.fillText(word, W / 2, top + avail / 2 + fs * 0.36);
      const step = Math.max(5, Math.round(fs / 20)); // ≈400 dots whatever the screen size
      const iw = off.width;
      const data = o.getImageData(0, 0, iw, off.height).data;
      const next: P[] = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(Math.floor(y) * iw + Math.floor(x)) * 4 + 3] > 140) {
            const c = Math.random() < 0.2 ? 2 + (Math.random() < 0.4 ? 1 : 0) : Math.floor((x / W) * 2);
            next.push({ x: reduce ? x : Math.random() * W, y: reduce ? y : H * 0.55 + Math.random() * H * 0.45, hx: x, hy: y, vx: 0, vy: 0, c, r: step * 0.3 });
          }
        }
      }
      next.sort((a, b) => a.c - b.c);
      parts = next;
      if (!bugs.length) for (let i = 0; i < (W < 500 ? 4 : 6); i++) bugs.push(spawn());
      if (reduce) stepP(); else wakeP();
    };

    /* ── bugs (crawl around inside the screen) ── */
    const spawn = (b?: Bug): Bug => {
      const edge = Math.floor(Math.random() * 4);
      const x = edge === 0 ? 4 : edge === 1 ? W - 4 : Math.random() * W;
      const y = edge === 2 ? 4 : edge === 3 ? H - 4 : Math.random() * H;
      const nb: Bug = { x, y, a: Math.atan2(H / 2 - y, W / 2 - x) + (Math.random() - 0.5), s: 0.6 + Math.random() * 0.7, t: Math.random() * 10, dead: 0 };
      return b ? Object.assign(b, nb) : nb;
    };
    const drawBug = (b: Bug) => {
      bg.save();
      bg.translate(b.x, b.y);
      bg.scale(S, S);
      bg.rotate(b.a + Math.PI / 2);
      const w = Math.sin(b.t * 14) * 2;
      bg.strokeStyle = "rgba(230,80,100,.85)";
      bg.lineWidth = 1.3;
      bg.beginPath();
      for (let i = -1; i <= 1; i++) {
        bg.moveTo(-3, i * 3.5); bg.lineTo(-9, i * 4.5 + w * (i || 1));
        bg.moveTo(3, i * 3.5); bg.lineTo(9, i * 4.5 - w * (i || 1));
      }
      bg.stroke();
      bg.fillStyle = "#e8506a";
      bg.beginPath(); bg.ellipse(0, 0, 5, 7.5, 0, 0, Math.PI * 2); bg.fill();
      bg.fillStyle = "#2a1b3a"; bg.fillRect(-0.5, -6, 1, 12);
      bg.fillStyle = "#ff8fa0"; bg.beginPath(); bg.arc(0, -8, 2.6, 0, Math.PI * 2); bg.fill();
      bg.restore();
    };
    const stepB = (t: number) => {
      bRaf = requestAnimationFrame(stepB);
      if (t - lastB < 32) return; // 30 fps is plenty for crawling bugs
      lastB = t;
      bg.clearRect(0, 0, W, H);
      for (const b of bugs) {
        if (b.dead > 0) { if (--b.dead === 0) spawn(b); continue; }
        b.t += 0.032;
        b.a += Math.sin(b.t * 2.1 + b.s * 7) * 0.09;
        const dx = b.x - mouse.x, dy = b.y - mouse.y;
        if (dx * dx + dy * dy < (70 * S) * (70 * S)) b.a = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4; // scurry away
        b.x += Math.cos(b.a) * b.s * 3 * S; b.y += Math.sin(b.a) * b.s * 3 * S;
        const m = 8 * S;
        if (b.x < m || b.x > W - m) { b.a = Math.PI - b.a; b.x = Math.min(W - m, Math.max(m, b.x)); }
        if (b.y < m || b.y > H - m) { b.a = -b.a; b.y = Math.min(H - m, Math.max(m, b.y)); }
        drawBug(b);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= 0.04;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        bg.globalAlpha = s.life; bg.fillStyle = "#ff8fb8"; bg.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
      }
      bg.globalAlpha = 1;
    };
    const startB = () => { if (!bRaf && !reduce && visible && !zoomed) bRaf = requestAnimationFrame(stepB); };
    const stopB = () => { cancelAnimationFrame(bRaf); bRaf = 0; };

    /* ── input: listeners live on the screen; coordinates are mapped through the zoom transform ── */
    const pos = (e: PointerEvent) => {
      const r = screen.getBoundingClientRect();
      return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
    };
    const onMove = (e: PointerEvent) => { const p = pos(e); mouse.x = p.x; mouse.y = p.y; mouse.last = performance.now(); wakeP(); };
    const onLeave = () => { mouse.x = mouse.y = -999; mouse.down = false; wakeP(); };
    const onDown = (e: PointerEvent) => {
      const p = pos(e); mouse.x = p.x; mouse.y = p.y; mouse.down = true; mouse.last = performance.now(); wakeP();
      for (const b of bugs) {
        if (b.dead > 0 || Math.hypot(b.x - p.x, b.y - p.y) > 34 * S) continue;
        b.dead = 90;
        for (let i = 0; i < 16; i++) { const a = Math.random() * 6.283, v = 1 + Math.random() * 3; sparks.push({ x: b.x, y: b.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, life: 1 }); }
        squash();
        squashed += 1;
        setCount(squashed);
        if (squashed === 5) setNote(lab.current.n5);
        else if (squashed === 15) setNote(lab.current.n15);
        else if (squashed === 30) setNote(lab.current.n30);
        break;
      }
    };
    const onUp = () => { mouse.down = false; };
    screen.addEventListener("pointermove", onMove);
    screen.addEventListener("pointerleave", onLeave);
    screen.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let rt: ReturnType<typeof setTimeout>;
    let firstResize = true;
    const ro = new ResizeObserver(() => {
      if (firstResize) { firstResize = false; return; } // the initial notification; the idle build below covers it
      clearTimeout(rt);
      rt = setTimeout(() => alive && build(), 200);
    });
    ro.observe(screen);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) { startB(); wakeP(); } else stopB();
    });
    io.observe(hero);
    const onZoom = (e: Event) => {
      zoomed = (e as CustomEvent<boolean>).detail;
      if (zoomed) stopB(); else { startB(); wakeP(); }
    };
    window.addEventListener("hero-zoom", onZoom);
    const onVis = () => { if (document.hidden) stopB(); else { startB(); wakeP(); } };
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(wakeP); // repaint with the new palette when the lamp is switched
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    zoomed = hero.classList.contains("is-zoomed");
    // the pixel scan of the word is the heaviest thing on the page: do it when the browser is idle, not during first paint
    const run = () => { if (alive) build(); };
    if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 1200 }); else setTimeout(run, 300);
    startB();

    return () => {
      alive = false;
      cancelAnimationFrame(pRaf); stopB(); clearTimeout(rt);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      screen.removeEventListener("pointermove", onMove);
      screen.removeEventListener("pointerleave", onLeave);
      screen.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("hero-zoom", onZoom);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [word]);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(""), 3500);
    return () => clearTimeout(t);
  }, [note]);

  return (
    <>
      <canvas ref={pc} className="fade" aria-hidden="true" />
      <canvas ref={bc} className="fade" aria-hidden="true" />
      <div className="hud fade" aria-hidden="true">
        <span className="hud-dot" />
        <span>{labels.bugs}</span>
        <b>{String(count).padStart(2, "0")}</b>
        {note && <span className="hud-note">{note}</span>}
      </div>
    </>
  );
}
