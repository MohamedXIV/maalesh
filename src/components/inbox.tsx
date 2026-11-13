"use client";

import { copy, getJob, type Locale } from "@/lib/content";
import type { MailItem } from "@/lib/save";

export function Inbox({
  locale, mails, onClose, onVillage,
}: {
  locale: Locale;
  mails: MailItem[];
  onClose: () => void;
  onVillage: () => void;
}) {
  const t = copy[locale];
  const subjects = {
    welcome: t.letterWelcomeTitle, hired: t.letterHiredTitle,
    quit: t.letterQuitTitle, paid: t.letterPaidTitle,
  };
  const bodies = {
    welcome: t.letterWelcomeBody, hired: t.letterHiredBody,
    quit: t.letterQuitBody, paid: t.letterPaidBody,
  };
  return (
    <>
      <div className="modal-top">
        <div><p className="eyebrow">{t.from}</p><h2>✉ {t.inboxTitle}</h2></div>
        <button className="icon-close" onClick={onClose} aria-label={t.close}>×</button>
      </div>
      <div className="mail-list">
        {mails.length === 0 && <p className="muted">{t.noLetters}</p>}
        {[...mails].reverse().map(letter => (
          <article className="mail-item" key={letter.id}>
            <h3>{subjects[letter.kind]}</h3>
            {letter.jobId && (
              <p className="mail-job">↳ {getJob(letter.jobId)?.title[locale]}</p>
            )}
            <p>{bodies[letter.kind]}</p>
            <small>— Maalesh HR ❤️</small>
          </article>
        ))}
      </div>
      <div className="modal-actions">
        <button className="button primary" onClick={onClose}>{t.close}</button>
        <button className="button secondary" onClick={onVillage}>{t.goVillage}</button>
      </div>
    </>
  );
}
