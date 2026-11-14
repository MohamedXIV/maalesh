"use client";

import { JOBS, copy, type JobId, type Locale } from "@/lib/content";

export function JobBoard({
  locale, activeJob, onApply, onVillage,
}: {
  locale: Locale;
  activeJob: JobId | null;
  onApply: (jobId: JobId) => void;
  onVillage: () => void;
}) {
  const t = copy[locale];
  return (
    <>
      <section className="board-hero">
        <div>
          <p className="eyebrow spaced">{t.heroEyebrow}</p>
          <h1>{t.boardTitle}</h1>
          <p className="lead">{t.boardBody}</p>
          <button className="button secondary" onClick={onVillage}>🏡 {t.goVillage}</button>
        </div>
        <div className="hire-sticker" aria-hidden="true">100%<span>ALMOST<br/>HIRED!</span></div>
      </section>
      <div className="section-heading">
        <h2>{locale === "ar" ? "فرص لا تعوّض" : "Career opportunities"}</h2>
        <span className="subtle-note">{t.prototype}</span>
      </div>
      <section className="job-grid" aria-label={t.navJobs}>
        {JOBS.map(job => {
          const isActive = activeJob === job.id;
          const canApply = job.playable && (!activeJob || isActive);
          return (
            <article className="job-card" key={job.id}>
              <div className="job-card-top">
                <span className="job-emoji" aria-hidden="true">{job.emoji}</span>
                <span className={job.playable ? "status hiring" : "status upcoming"}>
                  {job.playable ? t.available : t.comingSoon}
                </span>
              </div>
              <h3>{job.title[locale]}</h3>
              <p className="job-location">⌁ {job.location[locale]}</p>
              <p className="job-description">{job.description[locale]}</p>
              <div className="job-card-bottom">
                <span className="salary">🪙 {job.pay} <small>/ shift</small></span>
                <button
                  className={canApply ? "button primary" : "button disabled"}
                  disabled={!canApply}
                  onClick={() => isActive ? onVillage() : onApply(job.id)}
                >
                  {!job.playable ? t.reserved :
                    isActive ? t.myJob : activeJob ? t.quitFirst : t.apply}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
