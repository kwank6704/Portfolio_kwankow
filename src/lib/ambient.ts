// A generative lo-fi hip-hop loop, synthesised live with Web Audio (no audio files):
// soft electric-piano chords, a mellow bass, gentle swung drums and a dreamy echo. Everything is rounded off
// (no hiss, no crackle, no bright hi-hats) so nothing sounds shrill.
//  · night = slow jazzy minor 9ths   · day = brighter major 7ths, a little faster
//  · scrolling opens the muffled filter a little, so the music brightens while you move and settles when you stop
// Browsers only allow sound after a user gesture, so nothing starts until startAmbient() is called from one.
import { audioContext, isMuted, onMuteChange } from "./audio";

type Theme = "dark" | "light";
interface Mood { bpm: number; chords: number[][]; bass: number[]; scale: number[]; cutoff: number }

// MIDI note numbers. Four bars, then repeat.
const MOODS: Record<Theme, Mood> = {
  dark: {
    bpm: 72,
    chords: [[50, 53, 57, 60, 64], [55, 59, 64, 65], [52, 55, 59, 62], [55, 57, 60, 64]], // Dm9 · G13 · Cmaj9 · Am7
    bass: [38, 43, 36, 33],
    scale: [62, 65, 67, 69, 72],
    cutoff: 1700,
  },
  light: {
    bpm: 80,
    chords: [[57, 60, 64, 67], [52, 59, 62, 67], [53, 57, 60, 64], [55, 59, 62, 64]], // Fmaj9 · Em7 · Dm9 · G6
    bass: [41, 40, 38, 43],
    scale: [64, 67, 69, 72, 74],
    cutoff: 2200,
  },
};

const LEVEL = 0.5;
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

let started = false;
let theme: Theme = "dark";
let master: GainNode;
let bus: GainNode;
let echo: GainNode;
let tone: BiquadFilterNode;
let noise: AudioBuffer;
let step = 0;
let bar = 0;
let nextTime = 0;
let timer: ReturnType<typeof setInterval> | undefined;

function makeNoise(ctx: AudioContext) {
  const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function piano(ctx: AudioContext, midi: number, t: number, dur: number, vel: number) {
  const f = mtof(midi);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.025);
  g.gain.exponentialRampToValueAtTime(vel * 0.42, t + 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const a = ctx.createOscillator(), b = ctx.createOscillator(), bg = ctx.createGain();
  a.type = "sine"; a.frequency.value = f; a.detune.value = (Math.random() - 0.5) * 10;
  b.type = "triangle"; b.frequency.value = f * 2; bg.gain.value = 0.05;
  a.connect(g); b.connect(bg).connect(g);
  g.connect(bus);
  g.connect(echo);
  a.start(t); b.start(t); a.stop(t + dur + 0.1); b.stop(t + dur + 0.1);
}

function bassNote(ctx: AudioContext, midi: number, t: number, dur: number, vel: number) {
  const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = "triangle"; o.frequency.value = mtof(midi);
  lp.type = "lowpass"; lp.frequency.value = 420;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(lp).connect(g).connect(bus);
  o.start(t); o.stop(t + dur + 0.05);
}

function kick(ctx: AudioContext, t: number, vel: number) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(135, t);
  o.frequency.exponentialRampToValueAtTime(44, t + 0.12);
  g.gain.setValueAtTime(vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  o.connect(g).connect(bus);
  o.start(t); o.stop(t + 0.35);
}

function snare(ctx: AudioContext, t: number, vel: number) {
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noise;
  f.type = "bandpass"; f.frequency.value = 1300; f.Q.value = 0.6;
  const len = 0.2;
  g.gain.setValueAtTime(vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(f).connect(g).connect(bus);
  src.start(t, Math.random() * 0.5, len + 0.05);
  const o = ctx.createOscillator(), og = ctx.createGain();
  o.type = "sine"; o.frequency.value = 170;
  og.gain.setValueAtTime(vel * 0.6, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  o.connect(og).connect(bus);
  o.start(t); o.stop(t + 0.12);
}

function playStep(ctx: AudioContext, s: number, b: number, t: number, stepDur: number) {
  const mood = MOODS[theme];
  const i = b % 4;
  if (s === 0) {
    mood.chords[i].forEach((m, k) => piano(ctx, m, t + k * 0.035, stepDur * 15.5, 0.045));
  }
  if (s === 0) bassNote(ctx, mood.bass[i], t, stepDur * 6, 0.2);
  if (s === 10) bassNote(ctx, mood.bass[i], t, stepDur * 3, 0.14);
  if (s === 14 && Math.random() < 0.35) bassNote(ctx, mood.bass[i] + 7, t, stepDur * 2, 0.1);

  if (s === 0 || s === 10) kick(ctx, t, s === 0 ? 0.55 : 0.4);
  if (s === 4 || s === 12) snare(ctx, t, 0.14);

  if ((s === 3 || s === 7 || s === 11 || s === 14) && Math.random() < 0.28) {
    const m = mood.scale[Math.floor(Math.random() * mood.scale.length)];
    piano(ctx, m, t, 1.4, 0.028);
  }
}

function tick() {
  const ctx = audioContext();
  if (!ctx || ctx.state !== "running") { if (ctx) nextTime = ctx.currentTime + 0.1; return; }
  // if the tab was in the background, don't try to catch up
  if (nextTime < ctx.currentTime - 0.3) nextTime = ctx.currentTime + 0.05;
  while (nextTime < ctx.currentTime + 0.16) {
    const stepDur = 60 / MOODS[theme].bpm / 4;
    const swing = step % 2 === 1 ? stepDur * 0.24 : 0; // lazy, swung off-beats
    if (!isMuted()) playStep(ctx, step, bar, nextTime + swing, stepDur);
    nextTime += stepDur;
    step = (step + 1) % 16;
    if (step === 0) bar++;
  }
}

function applyTheme() {
  if (!started) return;
  tone.frequency.setTargetAtTime(MOODS[theme].cutoff, audioContext()!.currentTime, 0.8);
}

function applyMute() {
  if (!started) return;
  master.gain.setTargetAtTime(isMuted() ? 0 : LEVEL, audioContext()!.currentTime, 0.4);
}

export function startAmbient() {
  if (started || typeof window === "undefined") return;
  const ctx = audioContext();
  if (!ctx) return;
  started = true;
  noise = makeNoise(ctx);

  master = ctx.createGain();
  master.gain.value = 0;
  const glue = ctx.createDynamicsCompressor();
  glue.threshold.value = -20; glue.ratio.value = 3; glue.attack.value = 0.01; glue.release.value = 0.25;
  tone = ctx.createBiquadFilter();
  tone.type = "lowpass"; tone.frequency.value = MOODS[theme].cutoff; tone.Q.value = 0.4;
  bus = ctx.createGain();
  bus.gain.value = 1;
  bus.connect(tone).connect(glue).connect(master).connect(ctx.destination);

  // dreamy echo: a dotted delay that gets duller on every repeat
  echo = ctx.createGain();
  echo.gain.value = 0.32;
  const delay = ctx.createDelay(1.5), feedback = ctx.createGain(), damp = ctx.createBiquadFilter();
  delay.delayTime.value = (60 / MOODS[theme].bpm) * 0.75;
  feedback.gain.value = 0.38;
  damp.type = "lowpass"; damp.frequency.value = 1100;
  echo.connect(delay);
  delay.connect(damp).connect(feedback).connect(delay);
  damp.connect(bus);

  nextTime = ctx.currentTime + 0.2;
  timer = setInterval(tick, 50);
  applyMute();

  onMuteChange(applyMute);

  // scrolling opens up the muffled filter; it relaxes again when you stop
  let lastY = window.scrollY, lastT = performance.now(), speed = 0, decay: ReturnType<typeof setInterval> | undefined;
  const push = () => {
    const x = Math.min(1, speed / 3000);
    tone.frequency.setTargetAtTime(MOODS[theme].cutoff + 700 * x, ctx.currentTime, 0.15);
  };
  window.addEventListener("scroll", () => {
    const now = performance.now(), dy = Math.abs(window.scrollY - lastY);
    speed = speed * 0.7 + ((dy / Math.max(16, now - lastT)) * 1000) * 0.3;
    lastY = window.scrollY;
    lastT = now;
    push();
    if (!decay) decay = setInterval(() => { speed *= 0.8; push(); if (speed < 5 && decay) { clearInterval(decay); decay = undefined; } }, 120);
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { void ctx.suspend(); } else { void ctx.resume(); }
  });
  void timer;
}

export function setAmbientTheme(t: Theme) {
  theme = t;
  applyTheme();
}
