"use client";

import { useEffect, useState } from "react";
import { copy, getJob, type JobId } from "@/lib/content";
import { freshSave, loadSave, persistSave, type SaveData } from "@/lib/save";
import {
  applyForJob, buyDuckLamp, cancelShift, completeShift as finishPaidShift,
  createProfile, DUCK_LAMP_PRICE, quitJob, startShift,
} from "@/lib/employment";
import { JobBoard } from "./job-board";
import { Inbox } from "./inbox";
import { VillageCanvas } from "./village-canvas";
import { ApartmentCanvas } from "./apartment-canvas";
import { PaperOfficeCanvas } from "./paper-office-canvas";
import { NeedleGame } from "./needle-game";
import type { VillageDestination } from "@/game/village";

type Screen = "jobs" | "village" | "home" | "office";
type Dialog = "inbox" | "needle" | "computer" | null;

export function MaaleshApp() {
  const [save, setSave] = useState<SaveData>(freshSave);
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<Screen>("jobs");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Loaded only on the client to avoid a server/localStorage mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSave(loadSave());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) persistSave(save);
  }, [save, hydrated]);

  const locale = save.locale;
  const t = copy[locale];
  const activeJob = getJob(save.activeJob);

  function openProfile() {
    setSave(previous => createProfile(previous));
    setDialog("inbox");
  }
  function apply(jobId: JobId) {
    if (save.activeJob) {
      setNotice(t.quitFirst);
      return;
    }
    setSave(previous => applyForJob(previous, jobId));
    setNotice("");
    setDialog("inbox");
  }
  function quit() {
    setSave(previous => quitJob(previous));
    setScreen("village");
    setNotice("");
    setDialog("inbox");
  }
  function beginShift(jobId: JobId) {
    if (save.activeJob !== jobId || save.activeShiftId) return;
    setSave(previous => startShift(previous));
    setNotice("");
    if (jobId === "needle") {
      setDialog("needle");
    } else if (jobId === "paperweight") {
      setScreen("office");
    }
  }
  function leaveShift() {
    setSave(previous => cancelShift(previous));
    setDialog(null);
    setScreen("village");
  }
  function completeShift() {
    const shiftId = save.activeShiftId;
    if (!shiftId) return;
    setSave(previous => finishPaidShift(previous, shiftId));
    setDialog(null);
    setScreen("village");
    setNotice(t.paperDone);
  }
  function visit(place: VillageDestination) {
    switch (place) {
      case "agency":
        setScreen("jobs");
        return;
      case "home":
        setScreen("home");
        return;
      case "workshop":
      case "office": {
        const job = place === "workshop" ? "needle" : "paperweight";
        if (save.activeJob === job) beginShift(job);
        else setNotice(locale === "ar"
          ? "تقدر تزور المكان، بس لو عايز تشتغل هنا قدّم من معلش الأول."
          : "Lovely place! Apply through Maalesh if you'd like to work here.");
        return;
      }
    }
  }

  return (
    <div className="maalesh-app" dir={locale === "ar" ? "rtl" : "ltr"}>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand" aria-label="Maalesh">
            <span className="brand-mark">m<span>.</span></span>
            <div className="brand-copy">
              <strong>maalesh<span>.</span></strong>
              <small>{locale === "ar" ? "معلش للتوظيف البشري" : "human placement services"}</small>
            </div>
          </div>
          <nav className="site-nav" aria-label="Main navigation">
            <button
              className={screen === "jobs" ? "nav-tab active" : "nav-tab"}
              onClick={() => { setScreen("jobs"); setDialog(null); }}
            >{t.navJobs}</button>
            <button
              className={screen !== "jobs" ? "nav-tab active" : "nav-tab"}
              disabled={!save.hasProfile}
              onClick={() => { setScreen("village"); setDialog(null); }}
            >{t.navVillage}</button>
          </nav>
          <div className="header-tools">
            <span className="wallet" title={t.shiftCount + ": " + save.shifts}>
              🪙 {save.coins} <span className="wallet-label">{t.coins}</span>
            </span>
            <button className="tool-button" onClick={() => setSave(previous => ({
              ...previous, locale: previous.locale === "en" ? "ar" : "en",
            }))} aria-label="Switch language">{locale === "en" ? "عربي" : "EN"}</button>
            <button className="tool-button inbox-button" onClick={() => setDialog("inbox")} disabled={!save.hasProfile}>
              ✉ <span className="inbox-label">{t.inbox}</span>
              {save.mails.length > 0 && <span className="mail-count">{save.mails.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="container page-content">
        {notice && save.hasProfile && (
          <div className="game-notice" role="status">
            <span>🌼 {notice}</span>
            <button onClick={() => setNotice("")} aria-label={t.close}>×</button>
          </div>
        )}
        {!save.hasProfile ? (
          <section className="welcome-layout">
            <div className="welcome-copy">
              <span className="tiny-label">✦ {t.fictional}</span>
              <p className="eyebrow spaced">{t.greeting}</p>
              <h1>{t.introTitle}</h1>
              <p className="lead">{t.introBody}</p>
              <button className="button primary big" onClick={openProfile}>
                {t.introButton} <span aria-hidden="true">↗</span>
              </button>
              <p className="legal-inline">{t.introFoot}</p>
            </div>
            <div className="poster" aria-hidden="true">
              <div className="poster-ticket">MAALESH<br/>CAREERS DEPT.</div>
              <div className="poster-face"><span className="poster-eye" /><span className="poster-eye" /><span className="poster-mouth" /></div>
              <div className="poster-note">SORRY,<br />YOU&apos;RE HIRED!</div>
              <div className="poster-stamp">APPROVED<br />PROBABLY</div>
            </div>
          </section>
        ) : screen === "jobs" ? (
          <JobBoard
            locale={locale}
            activeJob={save.activeJob}
            onApply={apply}
            onVillage={() => { setScreen("village"); setNotice(""); }}
          />
        ) : screen === "village" ? (
          <>
            <section className="village-heading">
              <div>
                <p className="eyebrow spaced">{t.prototype}</p>
                <h1>{t.villageTitle}</h1>
                <p className="muted">{t.villageBody}</p>
              </div>
              <button className="button secondary" onClick={() => setScreen("home")}>🏡 {t.homeFromVillage}</button>
            </section>
            <section className="village-layout">
              <div className="world-card">
                <VillageCanvas
                  locale={locale}
                  startPosition={save.villagePosition}
                  onVisit={visit}
                  onPosition={position => setSave(previous => {
                    if (previous.villagePosition.x === position.x && previous.villagePosition.y === position.y) return previous;
                    return { ...previous, villagePosition: position };
                  })}
                />
                <div className="world-hint">🕹 {t.visitHint}</div>
              </div>
              <aside className="work-panel">
                <span className="tiny-label">✦ MAALESH EMPLOYEE DESK</span>
                <h2>{t.jobPanelTitle}</h2>
                {activeJob ? (
                  <>
                    <div className="active-work-emoji" aria-hidden="true">{activeJob.emoji}</div>
                    <h3>{activeJob.title[locale]}</h3>
                    <p className="muted">{activeJob.location[locale]}</p>
                    <p className="small-copy">{activeJob.description[locale]}</p>
                    <div className="work-actions">
                      <button className="button primary full" onClick={() => beginShift(activeJob.id)}>
                        {t.goWork} · 🪙 {activeJob.pay}
                      </button>
                      <button className="button secondary full" onClick={quit}>{t.quit}</button>
                    </div>
                    <p className="tiny-note">{t.quitHint}</p>
                  </>
                ) : (
                  <>
                    <div className="active-work-emoji" aria-hidden="true">🌼</div>
                    <h3>{t.noJob}</h3>
                    <p className="muted">{t.noJobBody}</p>
                    <button className="button primary full" onClick={() => setScreen("jobs")}>{t.browse}</button>
                  </>
                )}
                <div className="work-stats"><span>{t.shiftCount}</span><strong>{save.shifts}</strong></div>
              </aside>
            </section>
          </>
        ) : screen === "home" ? (
          <>
            <section className="village-heading">
              <div>
                <p className="eyebrow spaced">{t.homeWelcome}</p>
                <h1>{t.apartment}</h1>
                <p className="muted">{t.apartmentBody}</p>
              </div>
              <button className="button secondary" onClick={() => setScreen("village")}>{t.goVillage}</button>
            </section>
            <section className="village-layout">
              <div className="world-card">
                <ApartmentCanvas
                  locale={locale}
                  hasLamp={save.hasDuckLamp}
                  onInteract={name => {
                    if (name === "computer") setDialog("computer");
                    else setNotice(t.relaxMessage);
                  }}
                />
                <div className="world-hint">🏠 {t.villageHelp}</div>
              </div>
              <aside className="work-panel">
                <span className="tiny-label">✦ HOME SWEET HOME</span>
                <h2>{t.deskShop}</h2>
                <div className="active-work-emoji" aria-hidden="true">🦆</div>
                <p className="small-copy">{save.hasDuckLamp ? t.lampOwned : t.apartmentBody}</p>
                <button className="button primary full"
                  disabled={save.hasDuckLamp}
                  onClick={() => {
                    if (save.coins < DUCK_LAMP_PRICE) setNotice(t.notEnough);
                    else { setSave(previous => buyDuckLamp(previous)); setNotice(t.lampOwned); }
                  }}>
                  {save.hasDuckLamp ? t.lampOwned : t.lampBuy + " · 🪙 " + DUCK_LAMP_PRICE}
                </button>
                <div className="work-actions">
                  <button className="button secondary full" onClick={() => setDialog("computer")}>💻 {t.computer}</button>
                  <button className="button secondary full" onClick={() => setNotice(t.relaxMessage)}>☕ {t.relax}</button>
                </div>
              </aside>
            </section>
          </>
        ) : (
          <>
            <section className="village-heading">
              <div>
                <p className="eyebrow spaced">{t.officeIntro}</p>
                <h1>{t.paperWork}</h1>
                <p className="muted">{t.paperTask}</p>
              </div>
              <button className="button secondary" onClick={leaveShift}>{t.shiftExit}</button>
            </section>
            <section className="village-layout">
              <div className="world-card">
                <PaperOfficeCanvas locale={locale} onComplete={completeShift} />
                <div className="world-hint">🕹 {t.paperHint}</div>
              </div>
              <aside className="work-panel">
                <span className="tiny-label">✦ MUNICIPAL FILING OFFICE</span>
                <h2>{activeJob?.title[locale] ?? t.paperWork}</h2>
                <div className="active-work-emoji" aria-hidden="true">📄</div>
                <p className="small-copy">{t.paperTask}</p>
                <p className="tiny-note">{t.quitHint}</p>
                <div className="work-actions">
                  <button className="button secondary full" onClick={leaveShift}>{t.shiftExit}</button>
                  <button className="button primary full" onClick={quit}>{t.quit}</button>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>

      <footer className="container site-footer">
        <span>maalesh. © {new Date().getFullYear()} · {t.prototype}</span>
        <span>{t.legal}</span>
      </footer>

      {dialog && (
        <div className="modal-scrim" role="presentation">
          <div
            className={dialog === "needle" ? "modal-window wide" : "modal-window"}
            role="dialog" aria-modal="true"
            aria-label={dialog === "inbox" ? t.inboxTitle : dialog === "needle" ? t.needleTitle : t.computer}
          >
            {dialog === "needle" ? (
              <NeedleGame locale={locale} onClose={leaveShift} onQuit={quit} onComplete={completeShift} />
            ) : dialog === "inbox" ? (
              <Inbox locale={locale} mails={save.mails} onClose={() => setDialog(null)}
                onVillage={() => { setDialog(null); setScreen("village"); }} />
            ) : (
              <>
                <div className="modal-top">
                  <div><p className="eyebrow">MAALESH HOME OS v0.01</p><h2>💻 {t.computer}</h2></div>
                  <button className="icon-close" onClick={() => setDialog(null)} aria-label={t.close}>×</button>
                </div>
                <div className="fake-desktop">
                  <button className="desktop-app" onClick={() => { setDialog(null); setScreen("jobs"); }}>
                    <span>💼</span> {t.navJobs}
                  </button>
                  <button className="desktop-app" onClick={() => setDialog("inbox")}>
                    <span>✉️</span> {t.inbox}
                  </button>
                  <button className="desktop-app" onClick={() => { setDialog(null); setNotice(t.relaxMessage); }}>
                    <span>🦆</span> {t.relax}
                  </button>
                </div>
                <div className="modal-actions">
                  <button className="button secondary" onClick={() => setDialog(null)}>{t.close}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
