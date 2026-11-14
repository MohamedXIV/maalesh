"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { JobId, Locale } from "@/lib/content";
import type { SaveData } from "@/lib/save";
import type { Bulletin } from "@/lib/ai-bulletin";
import {
  AiSettingsApp, BrowserApp, DuckApp, FakeJobPortal, FakeMail,
  FilesApp, FreelancerApp, NotesApp, type AiSession, type ComputerAppActions,
} from "./computer-apps";

type AppId = "browser" | "mail" | "jobs" | "freelance" | "files" | "notepad" | "duck" | "settings";
type Window = {
  id: number; app: AppId; x: number; y: number;
  minimized: boolean; maximized: boolean; z: number;
};
const CATALOG: readonly { id: AppId; icon: string; en: string; ar: string }[] = [
  { id: "browser", icon: "🌐", en: "Voyager", ar: "متصفح فوياجر" },
  { id: "mail", icon: "✉️", en: "Mailbox", ar: "البريد" },
  { id: "jobs", icon: "💼", en: "Maalesh Jobs", ar: "وظايف معلش" },
  { id: "freelance", icon: "📋", en: "OddJobs", ar: "شغل حر" },
  { id: "files", icon: "📁", en: "My Computer", ar: "الكمبيوتر" },
  { id: "notepad", icon: "📝", en: "Notepad", ar: "مفكرة" },
  { id: "duck", icon: "🦆", en: "RubberDuck", ar: "بطة" },
  { id: "settings", icon: "⚙️", en: "Settings", ar: "إعدادات" },
];

export interface RetroComputerProps {
  save: SaveData;
  locale: Locale;
  ai: AiSession;
  onPowerOff: () => void;
  onApply: (job: JobId) => void;
  onCreateProfile: () => void;
  onGigFinish: (order: readonly number[]) => void;
  onNotes: (notes: string) => void;
  onHonk: () => void;
  onHistory: (host: string) => void;
  onBulletin: (item: Bulletin) => void;
  onAi: (update: Partial<AiSession>) => void;
}

export function RetroComputer({
  save, locale, ai, onPowerOff, onApply, onCreateProfile, onGigFinish, onNotes,
  onHonk, onHistory, onBulletin, onAi,
}: RetroComputerProps) {
  const [windows, setWindows] = useState<Window[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const nextId = useRef(1);
  const zIndex = useRef(4);
  const drag = useRef<{ id: number; pointerX: number; pointerY: number; x: number; y: number } | null>(null);

  function updateWindow(id: number, changes: Partial<Window>) {
    setWindows(old => old.map(w => w.id === id ? { ...w, ...changes } : w));
  }
  function focus(id: number) { updateWindow(id, { z: ++zIndex.current }); }
  function openApp(raw: string) {
    const app = CATALOG.find(value => value.id === raw)?.id;
    if (!app) return;
    const existing = windows.find(w => w.app === app);
    if (existing) {
      updateWindow(existing.id, { minimized: false, z: ++zIndex.current });
      setStartOpen(false);
      return;
    }
    const id = nextId.current++;
    const count = windows.length;
    setWindows(old => [...old, {
      id, app, x: Math.min(70 + count * 28, 180), y: Math.min(54 + count * 24, 145),
      minimized: false, maximized: false, z: ++zIndex.current,
    }]);
    setStartOpen(false);
  }
  const actions: ComputerAppActions = {
    onApply, onCreateProfile, onGigFinish, onNotes, onHonk, onHistory, onBulletin, onAi, openApp,
  };
  function appContent(id: AppId) {
    switch (id) {
      case "browser": return <BrowserApp save={save} locale={locale} ai={ai} actions={actions} />;
      case "mail": return <FakeMail save={save} locale={locale} />;
      case "jobs": return <FakeJobPortal save={save} locale={locale} actions={actions} />;
      case "freelance": return <FreelancerApp save={save} locale={locale} actions={actions} />;
      case "files": return <FilesApp save={save} locale={locale} actions={actions} />;
      case "notepad": return <NotesApp save={save} locale={locale} actions={actions} />;
      case "duck": return <DuckApp save={save} locale={locale} actions={actions} />;
      case "settings": return <AiSettingsApp locale={locale} ai={ai} actions={actions} />;
    }
  }

  function handleDragStart(event: PointerEvent<HTMLDivElement>, window: Window) {
    if (window.maximized || (event.target as HTMLElement).closest("button")) return;
    drag.current = { id: window.id, pointerX: event.clientX, pointerY: event.clientY, x: window.x, y: window.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    focus(window.id);
  }
  function handleDragMove(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (!active) return;
    const x = Math.max(0, active.x + event.clientX - active.pointerX);
    const y = Math.max(0, active.y + event.clientY - active.pointerY);
    updateWindow(active.id, { x, y });
  }
  function stopDrag() { drag.current = null; }

  return <div className="retro-computer" dir={locale === "ar" ? "rtl" : "ltr"}>
    <div className="retro-wallpaper">
      <div className="retro-desktop-title"><strong>MAALESH OS</strong><span>v0.1 · 2004-ish</span></div>
      <div className="retro-icon-grid">
        {CATALOG.map(app => <button className="retro-desktop-icon" key={app.id} onDoubleClick={() => openApp(app.id)}
          onClick={() => openApp(app.id)} aria-label={app[locale]}>
          <span>{app.icon}</span>{app[locale]}
        </button>)}
      </div>
      {windows.filter(w => !w.minimized).sort((a,b) => a.z-b.z).map(window => {
        const app = CATALOG.find(value => value.id === window.app)!;
        return <div key={window.id}
          className={"retro-window" + (window.maximized ? " maximized" : "")}
          style={{ left: window.maximized ? undefined : window.x, top: window.maximized ? undefined : window.y, zIndex: window.z }}
          onPointerDown={() => focus(window.id)}
          role="region" aria-label={app[locale]}>
          <div className="retro-window-title"
            onPointerDown={e => handleDragStart(e, window)}
            onPointerMove={handleDragMove}
            onPointerUp={stopDrag} onPointerCancel={stopDrag}>
            <span>{app.icon} {app[locale]}</span>
            <div className="retro-window-controls">
              <button aria-label="Minimize" onClick={() => updateWindow(window.id, { minimized: true })}>_</button>
              <button aria-label="Maximize or restore" onClick={() => updateWindow(window.id, { maximized: !window.maximized })}>▢</button>
              <button aria-label="Close" onClick={() => setWindows(old => old.filter(w => w.id !== window.id))}>×</button>
            </div>
          </div>
          <div className="retro-window-content" key={window.app}>{appContent(window.app)}</div>
        </div>;
      })}
      {windows.length === 0 && <div className="retro-hint">
        {locale === "ar" ? "افتح أي برنامج. المواقع اللي جوه خيالية." :
          "Open an app. The whole in-game internet is pretend and offline-friendly."}
      </div>}
    </div>
    <div className="retro-taskbar">
      <button className="retro-start" aria-expanded={startOpen} onClick={() => setStartOpen(!startOpen)}>m. Start</button>
      <div className="retro-running">
        {windows.map(w => {
          const app = CATALOG.find(x => x.id === w.app)!;
          return <button key={w.id} className={!w.minimized ? "retro-task active" : "retro-task"}
            onClick={() => {
              updateWindow(w.id, { minimized: !w.minimized, z: ++zIndex.current });
            }}>{app.icon} {app[locale]}</button>;
        })}
      </div>
      <span className="retro-tray">💾 {String(Math.floor(save.worldMinutes % 1440 / 60)).padStart(2,"0")}:
        {String(save.worldMinutes % 60).padStart(2,"0")}</span>
      {startOpen && <div className="retro-start-menu">
        <strong>MAALESH OS · SOFTWARE</strong>
        {CATALOG.map(app => <button key={app.id} onClick={() => openApp(app.id)}>{app.icon} {app[locale]}</button>)}
        <hr/>
        <button onClick={onPowerOff}>⏻ {locale === "ar" ? "اقفل الكمبيوتر" : "Shut down computer"}</button>
      </div>}
    </div>
    <button className="retro-exit-game" onClick={onPowerOff} aria-label="Exit computer">
      ⏻ {locale === "ar" ? "ارجع للغرفة" : "Leave computer"}
    </button>
  </div>;
}
