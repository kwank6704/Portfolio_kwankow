// Tiny helpers that generate the mountain silhouettes used by the hero view and the footer horizon.
// Everything is deterministic (seeded) so server and client render identical SVG.
export const r1 = (n: number) => Math.round(n * 10) / 10;

export function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

/** A smooth rolling ridge line: y(x) for a given seed, base height and amplitude. */
export const ridge = (seed: number, base: number, amp: number) => (x: number) =>
  base + amp * (0.55 * Math.sin(x * 0.0042 + seed) + 0.3 * Math.sin(x * 0.011 + seed * 2.3) + 0.15 * Math.sin(x * 0.027 + seed * 4.1));

/** The filled area under a ridge, from the ridge down to `bottom`. */
export function area(fn: (x: number) => number, bottom: number) {
  let d = `M-80 ${bottom}`;
  for (let x = -80; x <= 1680; x += 20) d += `L${x} ${r1(fn(x))}`;
  return `${d}L1680 ${bottom}Z`;
}

/** Pine-tree silhouettes standing on a ridge, as one path. */
export function pines(fn: (x: number) => number, seed: number, count: number, size: number, from = 0, to = 1600) {
  const r = rng(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = r1(from + r() * (to - from));
    const y = r1(fn(x) + 3);
    const s = size * (0.7 + r() * 0.6);
    const p = (dx: number, dy: number) => `${r1(x + dx * s)} ${r1(y - dy * s)}`;
    d += `M${p(0, 2.7)}L${p(0.55, 1.6)}L${p(0.28, 1.6)}L${p(0.8, 0.6)}L${p(0.34, 0.6)}L${p(0.34, 0)}L${p(-0.34, 0)}L${p(-0.34, 0.6)}L${p(-0.8, 0.6)}L${p(-0.28, 1.6)}L${p(-0.55, 1.6)}Z`;
  }
  return d;
}
