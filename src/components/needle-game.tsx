"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { copy, type Locale } from "@/lib/content";

const START_TIP = { x: 19, y: 68 };
const EYE = { x: 77, y: 46 };
const REQUIRED_NEEDLES = 3;

interface NeedleGameProps {
  locale: Locale;
  onQuit: () => void;
  onClose: () => void;
  onComplete: () => void;
}

export function NeedleGame({ locale, onQuit, onClose, onComplete }: NeedleGameProps) {
  const t = copy[locale];
  const [tip, setTip] = useState(START_TIP);
  const [threaded, setThreaded] = useState(0);
  const [feedback, setFeedback] = useState("");
  const dragging = useRef(false);
  const finished = threaded >= REQUIRED_NEEDLES;

  function position(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)),
      y: Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100)),
    };
  }

  function tryThread(point: { x: number; y: number }) {
    if (finished) return;
    if (Math.abs(point.x - EYE.x) <= 5 && Math.abs(point.y - EYE.y) <= 9) {
      setThreaded((previous) => previous + 1);
      setTip(START_TIP);
      setFeedback(t.needleSuccess);
    } else {
      setFeedback(t.needleTryAgain);
    }
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (finished) return;
    const point = position(event);
    if (Math.hypot(point.x - tip.x, point.y - tip.y) > 13) return;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFeedback("");
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragging.current) setTip(position(event));
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    const point = position(event);
    setTip(point);
    tryThread(point);
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (finished) return;
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3],
    };
    const step = steps[event.key];
    if (step) {
      event.preventDefault();
      setTip((old) => ({
        x: Math.max(0, Math.min(100, old.x + step[0])),
        y: Math.max(0, Math.min(100, old.y + step[1])),
      }));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tryThread(tip);
    }
  }

  return (
    <div className="needle-game">
      <div className="mini-heading">
        <div>
          <span className="eyebrow">{t.needleTitle}</span>
          <h2>{finished ? t.needleFinished : t.needleTitle}</h2>
        </div>
        <span className="progress-pill">{t.threaded}: {threaded}/{REQUIRED_NEEDLES}</span>
      </div>
      <p className="muted">{t.needleDescription}</p>
      <div
        className="needle-board"
        role="application"
        tabIndex={0}
        aria-label="Needle threading game. Drag the blue tip into the needle eye, or use arrow keys and press Enter."
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={() => { dragging.current = false; }}
        onKeyDown={keyboard}
      >
        <svg className="needle-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="12" y1="68" x2={tip.x} y2={tip.y} stroke="#4d95bc" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M77 55 L77 91" fill="none" stroke="#8f9ba2" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M77 55 L77 91" fill="none" stroke="#eff7f6" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx={EYE.x} cy={EYE.y} rx="3.4" ry="8.2" fill="#e7d5ba" stroke="#8297a0" strokeWidth="1.8" />
          <circle cx={tip.x} cy={tip.y} r="3.5" fill="#2a83ac" stroke="#ffffff" strokeWidth="1.1" />
        </svg>
        <span className="needle-board-label">THREAD & CO. · QUALITY CONTROL</span>
      </div>
      <p className="game-feedback" aria-live="polite">
        {finished ? t.needleFinished : feedback || (locale === "ar" ? "الأسهم + Enter شغالة برضه" : "Keyboard: arrow keys + Enter")}
      </p>
      <div className="modal-actions">
        {finished ? (
          <button className="button primary" onClick={onComplete}>{t.claim} · +4</button>
        ) : (
          <button className="button primary soft" onClick={onClose}>{t.close}</button>
        )}
        <button className="button secondary" onClick={onQuit}>{t.quit}</button>
      </div>
    </div>
  );
}
