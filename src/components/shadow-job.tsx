"use client";

import { useState, type PointerEvent } from "react";
import type { Locale } from "@/lib/content";

const TARGETS = [43, 59, 35] as const;
const POLE_X = 50;
const CAST_RATIO = 0.58;
const TOLERANCE = 4.5;
const LAMP_MIN = 10;
const LAMP_MAX = 90;

function castShadow(lampX: number): number {
  return POLE_X + (POLE_X - lampX) * CAST_RATIO;
}

export function ShadowJob({
  locale, onQuit, onClose, onComplete,
}: {
  locale: Locale;
  onQuit: () => void;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [round, setRound] = useState(0);
  const [lampX, setLampX] = useState(73);
  const [message, setMessage] = useState("");
  const finished = round >= TARGETS.length;
  const target = TARGETS[Math.min(round, TARGETS.length - 1)];
  const shadowX = castShadow(lampX);

  function setFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(LAMP_MIN, Math.min(LAMP_MAX, (event.clientX - rect.left) / rect.width * 100));
    setLampX(x);
    return x;
  }
  function check(x = lampX) {
    if (finished) return;
    if (Math.abs(castShadow(x) - target) <= TOLERANCE) {
      setRound(old => old + 1);
      setLampX(73);
      setMessage(locale === "ar" ? "الظل اتظبط! هات العلامة اللي بعدها." : "Shadow approved. Next chalk outline!");
    } else {
      setMessage(locale === "ar"
        ? "مش على العلامة بالظبط. حرّك المصباح وحاول تاني."
        : "Not aligned yet. Move the light and try again.");
    }
  }
  return <section className="shadow-job">
    <p className="eyebrow">MUNICIPAL LIGHTING DEPARTMENT · SHIFT #A-001</p>
    <h2>{locale === "ar" ? "موظف تعديل الظلال" : "Official Shadow Repositioner"}</h2>
    <p className="muted">{locale === "ar"
      ? "في علامة مرسومة بالطباشير. حرّك المصباح لحد ما ظل العمود يقف عليها. تلات علامات وتقبض."
      : "Someone marked where this sign's shadow should go. Move the light until the shadow meets the chalk. Three inspections make a shift."}</p>
    <strong className="shadow-progress">{locale === "ar" ? "علامات اتظبطت" : "Outlines approved"}: {round} / {TARGETS.length}</strong>
    <div className="shadow-board" role="application"
      aria-label="Move the light left or right to align the post shadow with the chalk target"
      onPointerDown={e => { if (!finished) { e.currentTarget.setPointerCapture(e.pointerId); setFromPointer(e); } }}
      onPointerMove={e => { if (!finished && e.buttons > 0) setFromPointer(e); }}
      onPointerUp={e => { if (!finished) check(setFromPointer(e)); }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="100" fill="#dfecd0" />
        <path d="M0 73 H100 V100 H0 Z" fill="#ccb394" />
        <path d="M0 82 H100" stroke="#e5cdb2" strokeWidth="1" strokeDasharray="1 2"/>
        <ellipse cx={target} cy="77" rx="6.1" ry="7" stroke="#faf8e8" strokeWidth="1.5"
          strokeDasharray="2.2 2" fill="none" />
        <path d={"M" + POLE_X + " 55 L" + shadowX + " 77 L" + (shadowX + 5) + " 81 L" + (POLE_X + 5) + " 58 Z"}
          fill="#576e59" opacity=".55" />
        <rect x="48" y="46" width="4" height="30" rx="1" fill="#876d55" />
        <rect x="41" y="39" width="18" height="15" rx="2" fill="#f8e7b7" stroke="#a28c65" strokeWidth="1" />
        <text x="50" y="48" fontSize="3.6" textAnchor="middle" fill="#735f4c">WELCOME</text>
        <path d={"M" + lampX + " 5 L" + lampX + " 28"} stroke="#846e54" strokeWidth="2" />
        <path d={"M" + (lampX-6) + " 28 L" + (lampX+6) + " 28 L" + (lampX+9) + " 35 L" + (lampX-9) + " 35 Z"}
          fill="#f3a768" stroke="#b26e4c" strokeWidth="1"/>
        <circle cx={lampX} cy="37" r="3.5" fill="#ffe69d" />
        <circle cx={lampX} cy="37" r="12" fill="#fff5b9" opacity=".27" />
      </svg>
    </div>
    <label className="shadow-slider-label">
      {locale === "ar" ? "حرّك المصباح" : "Move the lamp"}
      <input type="range" value={lampX} min={LAMP_MIN} max={LAMP_MAX} step="1"
        disabled={finished} onChange={e => setLampX(Number(e.target.value))} />
    </label>
    <p role="status" className="shadow-feedback">{finished
      ? (locale === "ar" ? "المجلس المحلي راضي عن الظلال. والله غريبة." : "Town council approves the shadows. Somehow.")
      : message || (locale === "ar" ? "اسحب المصباح أو استخدم الشريط." : "Drag the lamp, or use the slider.")}</p>
    <div className="modal-actions">
      {finished
        ? <button className="button primary" onClick={onComplete}>
            {locale === "ar" ? "اقبض ٤ عملات" : "Collect 4 coins"}
          </button>
        : <button className="button primary" onClick={() => check()}>
            {locale === "ar" ? "اختبر الظل" : "Inspect alignment"}
          </button>}
      <button className="button secondary" onClick={onClose}>{locale === "ar" ? "اقفل المهمة" : "Leave shift"}</button>
      <button className="button secondary" onClick={onQuit}>{locale === "ar" ? "أنا مستقيل!" : "I QUIT!"}</button>
    </div>
  </section>;
}
