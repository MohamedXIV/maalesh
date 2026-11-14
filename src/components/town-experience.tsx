"use client";

import { useEffect, useState } from "react";
import { copy, getJob, type JobId, type Locale } from "@/lib/content";
import { freshSave, loadSave, persistSave, type SaveData } from "@/lib/save";
import {
  applyForJob, buyDuckLamp, cancelShift, completeShift,
  createProfile, DUCK_LAMP_PRICE, quitJob, startShift,
} from "@/lib/employment";
import { appendComputerHistory, finishFreelanceGig, honkDuck } from "@/lib/computer";
import type { Bulletin } from "@/lib/ai-bulletin";
import type { TownLandmarkId, GridPosition } from "@/game/town/town-model";
import { TownCanvas } from "./town-canvas";
import { ApartmentCanvas } from "./apartment-canvas";
import { PaperOfficeCanvas } from "./paper-office-canvas";
import { InkHrDialog } from "./ink-hr-dialog";
import { NeedleGame } from "./needle-game";
import { ShadowJob } from "./shadow-job";
import { FakeJobPortal, type AiSession } from "./computer-apps";
import { RetroComputer } from "./retro-computer";

type Place = "town" | "home" | "office";
type Overlay = "hr" | "jobs" | "needle" | "shadow" | "computer" | null;
const GAME_MINUTES_PER_TICK = 5;
const REAL_TICK_MS = 10_000;

export function TownExperience() {
  const [save, setSave] = useState<SaveData>(freshSave);
  const [ready, setReady] = useState(false);
  const [place, setPlace] = useState<Place>("town");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [notice, setNotice] = useState("");
  const [ai, setAi] = useState<AiSession>({
    apiKey: "", model: "gemini-3.8-flash", enabled: false, connected: false,
  });
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSave(loadSave());
    setReady(true);
    const syncConnection = () => setAi(current => ({ ...current, connected: navigator.onLine }));
    syncConnection();
    window.addEventListener("online", syncConnection);
    window.addEventListener("offline", syncConnection);
    return () => {
      window.removeEventListener("online", syncConnection);
      window.removeEventListener("offline", syncConnection);
    };
  }, []);

  useEffect(() => { if (ready) persistSave(save); }, [save, ready]);
  useEffect(() => {
    if (!ready) return;
    const ticker = window.setInterval(() => {
      setSave(previous => ({ ...previous, worldMinutes: previous.worldMinutes + GAME_MINUTES_PER_TICK }));
    }, REAL_TICK_MS);
    return () => window.clearInterval(ticker);
  }, [ready]);

  const locale: Locale = save.locale;
  const t = copy[locale];
  const job = getJob(save.activeJob);
  const paused = overlay !== null;
  const day = Math.floor(save.worldMinutes / 1440) + 1;
  const time = save.worldMinutes % 1440;
  const clock = String(Math.floor(time / 60)).padStart(2,"0") + ":" +
    String(time % 60).padStart(2,"0");

  function apply(jobId: JobId) {
    if (save.activeJob) {
      setNotice(t.quitFirst);
      return;
    }
    setSave(previous => applyForJob(previous, jobId));
    setNotice(locale === "ar" ? "معلش، للأسف اتقبلت! راجع بريدك في البيت." :
      "Unfortunately, you're hired! Your computer mailbox has the details.");
    setOverlay(null);
  }
  function quit() {
    if (!save.activeJob) return;
    setSave(previous => quitJob(previous));
    setPlace("town");
    setOverlay(null);
    setNotice(locale === "ar"
      ? "معلش بتقولك: عملت الصح! 96.65% استقالوا أول أسبوع. في وظيفة أحسن مستنياك."
      : "Maalesh says you did the right thing! 96.65% quit in week one. Something better awaits.");
  }
  function startWork(id: JobId) {
    if (save.activeJob !== id) {
      setNotice(locale === "ar" ? "قدم من مكتب معلش الأول، والباب مفتوح!" :
        "Visit the Maalesh agency to apply first. You're welcome here either way.");
      return;
    }
    if (save.activeShiftId) return;
    setSave(previous => startShift(previous));
    if (id === "needle" || id === "shadow") setOverlay(id);
    else if (id === "paperweight") setPlace("office");
  }
  function leaveWork() {
    setSave(previous => cancelShift(previous));
    setOverlay(null);
    setPlace("town");
  }
  function finishWork() {
    const shiftId = save.activeShiftId;
    if (!shiftId) return;
    setSave(previous => completeShift(previous, shiftId));
    setOverlay(null);
    setPlace("town");
    setNotice(locale === "ar" ? "مبروك! خلصت الوردية وقبضت مرتبك." : "Shift complete! Your wallet thanks you.");
  }
  function visit(id: TownLandmarkId) {
    switch (id) {
      case "agency":
        setOverlay("hr");
        return;
      case "home":
        setOverlay(null); setPlace("home");
        return;
      case "workshop":
        startWork("needle"); return;
      case "lampshop":
        startWork("shadow"); return;
      case "office":
        startWork("paperweight"); return;
      case "cafe":
        setNotice(locale === "ar" ? "قعدة رايقة، والشاي على النار. ☕" : "The tea is warm. No work required. ☕"); return;
      case "park":
        setNotice(locale === "ar" ? "خدت بريك في الجنينة. أحسن قرار النهارده. 🌼" : "A little break in the park. Excellent career choice. 🌼"); return;
      case "farm":
        setNotice(locale === "ar" ? "الفراخ لسه بتتفاوض على نظام الإجازات. 🐔" : "The chickens are negotiating their holiday policy. 🐔"); return;
      case "library":
        setNotice(locale === "ar" ? "في المكتبة الهدوء ببلاش، بس الكلام عليه غرامة خيالية. 📚" : "Silence is free at the library. Opinions cost extra. 📚"); return;
      case "market":
        setNotice(locale === "ar" ? "البقال بيقولك: رجعتلنا تاني؟ نورت! 🛒" : "The shopkeeper says: Back again? Welcome! 🛒"); return;
    }
  }

  return <div className="town-experience" dir={locale === "ar" ? "rtl" : "ltr"}>
    {place === "town" &&
      <TownCanvas locale={locale} startPosition={save.townPosition} worldMinute={save.worldMinutes}
        paused={paused}
        onVisit={visit}
        onChat={setNotice}
        onPosition={(position: GridPosition) => setSave(previous => {
          if (previous.townPosition.x === position.x && previous.townPosition.y === position.y) return previous;
          return { ...previous, townPosition: position };
        })}
      />}
    {place === "home" &&
      <div className="town-interior-stage">
        <ApartmentCanvas locale={locale} hasLamp={save.hasDuckLamp}
          onInteract={action => action === "computer" ? setOverlay("computer") :
            setNotice(locale === "ar" ? "استريحت شوية، الدنيا لذيذة." : "You had a nice quiet moment.")} />
      </div>}
    {place === "office" &&
      <div className="town-interior-stage"><PaperOfficeCanvas locale={locale} onComplete={finishWork} /></div>}

    <header className="town-hud" aria-label="Game information">
      <div className="town-hud-brand">
        <strong>m<span>.</span></strong>
        <div><b>{locale === "ar" ? "بلدة معلش" : "Maalesh Town"}</b>
          <small>{locale === "ar" ? "يوم" : "Day"} {day} · {clock}</small></div>
      </div>
      <div className="town-hud-actions">
        <span className="town-hud-wallet" title="Fictional money">🪙 {save.coins}</span>
        <button onClick={() => setSave(previous => ({ ...previous, locale: previous.locale === "en" ? "ar" : "en" }))}>
          {locale === "ar" ? "EN" : "عربي"}</button>
        <button onClick={() => setShowHelp(current => !current)} aria-label="Show controls">?</button>
      </div>
    </header>

    <div className="town-bottom-ui">
      {showHelp && <aside className="town-help">
        <strong>{place === "town" ? (locale === "ar" ? "اتمشى براحتك" : "Explore the town") :
          place === "home" ? t.homeWelcome : t.paperTask}</strong>
        <p>{place === "town" ? (locale === "ar" ?
          "اتحرك بـ WASD أو الأسهم، المس مكان أو مبنى، واضغط E للتفاعل. شوف الأسفلت والضواحي والطرف الريفي!" :
          "WASD / arrows to walk, tap to travel, E to interact. Explore downtown, side streets and the rural edge.") :
          place === "home" ? t.villageHelp : t.paperHint}</p>
      </aside>}
      <div className="town-quick-actions">
        {place !== "town" && <button className="town-action" onClick={leaveWork}>← {t.goVillage}</button>}
        {place === "home" && <button className="town-action" onClick={() => setOverlay("computer")}>💻 {t.computer}</button>}
        {place === "home" && <button className="town-action" disabled={save.hasDuckLamp} onClick={() => {
          if (save.coins < DUCK_LAMP_PRICE) setNotice(t.notEnough);
          else { setSave(previous => buyDuckLamp(previous)); setNotice(t.lampOwned); }
        }}>🦆 {save.hasDuckLamp ? t.lampOwned : t.lampBuy + " (" + DUCK_LAMP_PRICE + ")"}</button>}
        {place === "office" && <button className="town-action" onClick={leaveWork}>{t.shiftExit}</button>}
        {job && <button className="town-action quit" onClick={quit}>{t.quit}</button>}
      </div>
    </div>

    {notice && <div className="town-toast" role="status">
      <span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss">×</button>
    </div>}

    {overlay === "computer" && <RetroComputer save={save} locale={locale} ai={ai}
      onPowerOff={() => setOverlay(null)}
      onApply={apply}
      onCreateProfile={() => {
        setSave(previous => createProfile(previous));
        setNotice(locale === "ar" ? "معلش عملتلك حساب! هتلاقي رسالة في البريد." :
          "Your pretend Maalesh account has been tolerated. Check the mailbox.");
      }}
      onGigFinish={order => setSave(previous => finishFreelanceGig(previous, "invoices", order))}
      onNotes={notes => setSave(previous => ({ ...previous, computer: { ...previous.computer, notes } }))}
      onHonk={() => setSave(previous => honkDuck(previous))}
      onHistory={host => setSave(previous => appendComputerHistory(previous, host))}
      onBulletin={(item: Bulletin) => setSave(previous => ({
        ...previous,
        computer: { ...previous.computer,
          savedBulletins: [...previous.computer.savedBulletins, item.headline + " — " + item.body].slice(-8) },
      }))}
      onAi={update => setAi(previous => ({ ...previous, ...update }))}
    />}

    {(overlay === "hr" || overlay === "jobs" || overlay === "needle" || overlay === "shadow") &&
      <div className="town-modal-backdrop" role="presentation">
        <section className="town-modal" role="dialog" aria-modal="true"
          aria-label={overlay === "hr" ? "Maalesh HR" : overlay === "jobs" ? t.navJobs : overlay === "shadow" ? "Shadow job" : t.needleTitle}>
          {overlay === "hr" && <InkHrDialog locale={locale} onClose={() => setOverlay(null)}
            onIntent={intent => setOverlay(intent === "jobs" ? "jobs" : null)} />}
          {overlay === "jobs" && <FakeJobPortal save={save} locale={locale} actions={{
            onApply: apply,
            onCreateProfile: () => setSave(previous => createProfile(previous)),
            onGigFinish: () => {},
            onNotes: () => {},
            onHonk: () => {},
            onHistory: () => {},
            onBulletin: () => {},
            onAi: () => {},
            openApp: () => {},
          }} />}
          {overlay === "needle" && <NeedleGame locale={locale} onComplete={finishWork}
            onQuit={quit} onClose={leaveWork} />}
          {overlay === "shadow" && <ShadowJob locale={locale} onComplete={finishWork}
            onQuit={quit} onClose={leaveWork} />}
          <button className="town-modal-close" onClick={overlay === "needle" || overlay === "shadow" ? leaveWork : () => setOverlay(null)}
            aria-label={t.close}>×</button>
        </section>
      </div>}
  </div>;
}
