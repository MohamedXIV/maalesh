"use client";

import { useEffect, useState } from "react";
import { JOBS, copy, getJob, type JobId, type Locale } from "@/lib/content";
import { addMail, freshSave, loadSave, persistSave, type MailItem, type SaveData } from "@/lib/save";
import { VillageCanvas } from "./village-canvas";
import { NeedleGame } from "./needle-game";

type Screen = "jobs" | "village";
type Dialog = "inbox" | "needle" | null;

function letterDetails(letter: MailItem, locale: Locale) {
  const t = copy[locale];
  const subject = {
    welcome: t.letterWelcomeTitle,
    hired: t.letterHiredTitle,
    quit: t.letterQuitTitle,
    paid: t.letterPaidTitle,
  }[letter.kind];
  const body = {
    welcome: t.letterWelcomeBody,
    hired: t.letterHiredBody,
    quit: t.letterQuitBody,
    paid: t.letterPaidBody,
  }[letter.kind];
  const jobName = getJob(letter.jobId)?.title[locale];
  return { subject, body, jobName };
}

export function MaaleshApp() {
  const [save, setSave] = useState<SaveData>(freshSave);
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<Screen>("jobs");
  const [dialog, setDialog] = useState<Dialog>(null);

  useEffect(() => {
    setSave(loadSave());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistSave(save);
  }, [save, hydrated]);

  const locale = save.locale;
  const t = copy[locale];
  const activeJob = getJob(save.activeJob);

  function makeProfile() {
    setSave((previous) => ({
      ...previous,
      hasProfile: true,
      mails: addMail(previous, "welcome", null),
    }));
    setDialog("inbox");
  }

  function apply(jobId: JobId) {
    const job = getJob(jobId);
    if (!job?.playable) return;
    setSave((previous) => ({
      ...previous,
      activeJob: jobId,
      mails: addMail(previous, "hired", jobId),
    }));
    setDialog("inbox");
  }

  function quit() {
    setSave((previous) => {
      if (!previous.activeJob) return previous;
      return {
        ...previous,
        activeJob: null,
        mails: addMail(previous, "quit", previous.activeJob),
      };
    });
    setDialog("inbox");
  }

  function completeShift() {
    setSave((previous) => {
      if (!previous.activeJob) return previous;
      const job = getJob(previous.activeJob);
      return {
        ...previous,
        coins: previous.coins + (job?.pay ?? 0),
        shifts: previous.shifts + 1,
        mails: addMail(previous, "paid", previous.activeJob),
      };
    });
    setDialog(null);
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
            <button className={screen === "jobs" ? "nav-tab active" : "nav-tab"} onClick={() => setScreen("jobs")}>
              {t.navJobs}
            </button>
            <button className={screen === "village" ? "nav-tab active" : "nav-tab"} disabled={!save.hasProfile} onClick={() => setScreen("village")}>
              {t.navVillage}
            </button>
          </nav>
          <div className="header-tools">
            <span className="wallet" title={t.shiftCount + ": " + save.shifts}>🪙 {save.coins} <span className="wallet-label">{t.coins}</span></span>
            <button className="tool-button" onClick={() => setSave((previous) => ({ ...previous, locale: previous.locale === "en" ? "ar" : "en" }))} aria-label="Switch language">
              {locale === "en" ? "عربي" : "EN"}
            </button>
            <button className="tool-button inbox-button" onClick={() => setDialog("inbox")} disabled={!save.hasProfile}>
              ✉ <span className="inbox-label">{t.inbox}</span>
              {save.mails.length > 0 && <span className="mail-count">{save.mails.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="container page-content">
        {!save.hasProfile ? (
          <section className="welcome-layout">
            <div className="welcome-copy">
              <span className="tiny-label">✦ {t.fictional}</span>
              <p className="eyebrow spaced">{t.greeting}</p>
              <h1>{t.introTitle}</h1>
              <p className="lead">{t.introBody}</p>
              <button className="button primary big" onClick={makeProfile}>{t.introButton} <span aria-hidden="true">↗</span></button>
              <p className="legal-inline">{t.introFoot}</p>
            </div>
            <div className="poster" aria-hidden="true">
              <div className="poster-ticket">MAALESH<br/>CAREERS DEPT.</div>
              <div className="poster-face">
                <span className="poster-eye" /><span className="poster-eye" />
                <span className="poster-mouth" />
              </div>
              <div className="poster-note">SORRY,<br />YOU&apos;RE HIRED!</div>
              <div className="poster-stamp">APPROVED<br />PROBABLY</div>
            </div>
          </section>
        ) : screen === "jobs" ? (
          <>
            <section className="board-hero">
              <div>
                <p className="eyebrow spaced">{t.heroEyebrow}</p>
                <h1>{t.boardTitle}</h1>
                <p className="lead">{t.boardBody}</p>
                <button className="button secondary" onClick={() => setScreen("village")}>🏡 {t.goVillage}</button>
              </div>
              <div className="hire-sticker" aria-hidden="true">100%<span>ALMOST<br/>HIRED!</span></div>
            </section>
            <div className="section-heading">
              <h2>{locale === "ar" ? "فرص لا تعوّض" : "Career opportunities"}</h2>
              <span className="subtle-note">{t.prototype}</span>
            </div>
            <section className="job-grid" aria-label={t.navJobs}>
              {JOBS.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <span className="job-emoji" aria-hidden="true">{job.emoji}</span>
                    <span className={job.playable ? "status hiring" : "status upcoming"}>{job.playable ? t.available : t.comingSoon}</span>
                  </div>
                  <h3>{job.title[locale]}</h3>
                  <p className="job-location">⌁ {job.location[locale]}</p>
                  <p className="job-description">{job.description[locale]}</p>
                  <div className="job-card-bottom">
                    <span className="salary">🪙 {job.pay} <small>/ shift</small></span>
                    <button
                      className={job.playable ? "button primary" : "button disabled"}
                      disabled={!job.playable}
                      onClick={() => save.activeJob === job.id ? setScreen("village") : apply(job.id)}
                    >
                      {!job.playable ? t.reserved : save.activeJob === job.id ? t.myJob : t.apply}
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        ) : (
          <>
            <section className="village-heading">
              <div>
                <p className="eyebrow spaced">{t.prototype}</p>
                <h1>{t.villageTitle}</h1>
                <p className="muted">{t.villageBody}</p>
              </div>
              <button className="button secondary" onClick={() => setScreen("jobs")}>{t.back}</button>
            </section>
            <section className="village-layout">
              <div className="world-card">
                <VillageCanvas locale={locale} />
                <div className="world-hint">🕹 {t.villageHelp}</div>
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
                      <button
                        className="button primary full"
                        onClick={() => activeJob.id === "needle" && setDialog("needle")}
                        disabled={activeJob.id !== "needle"}
                      >{t.startShift} · 🪙 {activeJob.pay}</button>
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
        )}
      </main>
      <footer className="container site-footer">
        <span>maalesh. © {new Date().getFullYear()} · {t.prototype}</span>
        <span>{t.legal}</span>
      </footer>

      {dialog && (
        <div className="modal-scrim" role="presentation">
          <div className={dialog === "needle" ? "modal-window wide" : "modal-window"} role="dialog" aria-modal="true" aria-label={dialog === "inbox" ? t.inboxTitle : t.needleTitle}>
            {dialog === "needle" ? (
              <NeedleGame locale={locale} onClose={() => setDialog(null)} onQuit={quit} onComplete={completeShift} />
            ) : (
              <>
                <div className="modal-top"><div><p className="eyebrow">{t.from}</p><h2>✉ {t.inboxTitle}</h2></div>
                  <button className="icon-close" onClick={() => setDialog(null)} aria-label={t.close}>×</button>
                </div>
                <div className="mail-list">
                  {save.mails.length === 0 && <p className="muted">{t.noLetters}</p>}
                  {[...save.mails].reverse().map((letter) => {
                    const details = letterDetails(letter, locale);
                    return (
                      <article className="mail-item" key={letter.id}>
                        <h3>{details.subject}</h3>
                        {details.jobName && <p className="mail-job">↳ {details.jobName}</p>}
                        <p>{details.body}</p>
                        <small>— Maalesh HR ❤️</small>
                      </article>
                    );
                  })}
                </div>
                <div className="modal-actions">
                  <button className="button primary" onClick={() => setDialog(null)}>{t.close}</button>
                  {save.hasProfile && <button className="button secondary" onClick={() => { setDialog(null); setScreen("village"); }}>{t.goVillage}</button>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
