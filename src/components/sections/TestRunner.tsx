"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHead, Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/components/shell/Providers";
import { fail, pass, tick } from "@/lib/audio";
import { testSuite, ui } from "@/content";

type State = "idle" | "running" | "pass" | "fail";

export default function TestRunner() {
  const { t, rich } = useI18n();
  const [states, setStates] = useState<State[]>(() => testSuite.map(() => "idle"));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const times = useRef<number[]>(testSuite.map((_, i) => 38 + ((i * 53) % 90)));
  const q = ui.qa;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    setDone(false);
    setRunning(true);
    setStates(testSuite.map(() => "idle"));
    let at = 150;
    testSuite.forEach((s, i) => {
      timers.current.push(setTimeout(() => { setStates((a) => a.map((v, j) => (j === i ? "running" : v))); tick(i); }, at));
      at += 380 + (i % 3) * 120;
      timers.current.push(setTimeout(() => {
        setStates((a) => a.map((v, j) => (j === i ? (s.fail ? "fail" : "pass") : v)));
        if (s.fail) fail(); else pass();
      }, at));
      at += 90;
    });
    timers.current.push(setTimeout(() => { setRunning(false); setDone(true); }, at + 200));
  };

  const passed = states.filter((s) => s === "pass").length;
  const failed = states.filter((s) => s === "fail").length;
  const pct = ((passed + failed) / testSuite.length) * 100;

  return (
    <section id="testing" className="sec">
      <SectionHead n="04" label={t(ui.nav.testing)} title={rich(q.title)} lead={t(q.lead)} />
      <Reveal>
        <div className="term">
          <div className="term-bar">
            <i /><i /><i />
            <span>kwan.spec.ts</span>
            <button className="btn btn-sm" onClick={run} disabled={running}>
              {running ? t(q.running) : done ? t(q.again) : t(q.run)}
            </button>
          </div>
          <div className="term-progress" aria-hidden="true"><div style={{ width: `${pct}%` }} /></div>
          <div className="term-body" role="log" aria-live="polite">
            <p className="dim">describe(&quot;Nattarat — QA &amp; Dev&quot;, () =&gt; {"{"}</p>
            {testSuite.map((s, i) => (
              <div key={s.name.en} className={`t-row ${states[i]}`}>
                <span className="t-icon" aria-hidden="true">
                  {states[i] === "idle" && "○"}
                  {states[i] === "running" && <span className="spin-ring" />}
                  {states[i] === "pass" && "✓"}
                  {states[i] === "fail" && "✗"}
                </span>
                <span className="t-name">it(&quot;{t(s.name)}&quot;)</span>
                <span className="t-via">{t(s.via)}</span>
                <span className="t-ms">{states[i] === "pass" || states[i] === "fail" ? `${times.current[i]}ms` : ""}</span>
                {states[i] === "pass" && s.repos.length > 0 && (
                  <span className="t-repos">
                    {s.repos.map((r) => <a key={r} href={`https://github.com/kwank6704/${r}`} target="_blank" rel="noreferrer">{r}</a>)}
                  </span>
                )}
              </div>
            ))}
            <p className="dim">{"})"}</p>
            <p className={`t-sum ${done ? "show" : ""}`}>
              <b className="ok">{passed} {t(q.passed)}</b> · <b className="bad">{failed} {t(q.known)}</b> · {testSuite.length} {t(q.total)}
              {done && <span className="cursor-blink" />}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
