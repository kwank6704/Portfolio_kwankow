// Tiny Web Audio synth — no audio files. Context is created lazily on the first user gesture.
let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}
export function isMuted() {
  return muted;
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, start = 0, slideTo?: number) {
  const a = ac();
  if (!a || muted) return;
  const t = a.currentTime + start;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** Bug squashed: crunchy drop + happy two-note "pass" chime. */
export function squash() {
  const a = ac();
  if (!a || muted) return;
  tone(220, 0.12, "sawtooth", 0.07, 0, 60);
  tone(880, 0.12, "triangle", 0.06, 0.09);
  tone(1320, 0.18, "triangle", 0.06, 0.17);
}

export function tick(i = 0) {
  tone(660 + i * 60, 0.07, "square", 0.025);
}

export function pass() {
  tone(740, 0.08, "triangle", 0.05);
  tone(1110, 0.12, "triangle", 0.05, 0.06);
}

export function fail() {
  tone(180, 0.28, "sawtooth", 0.05, 0, 90);
}

export function click() {
  tone(520, 0.05, "sine", 0.04);
}
