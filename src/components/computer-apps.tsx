"use client";

import { useState, type FormEvent } from "react";
import { copy, JOBS, type JobId, type Locale } from "@/lib/content";
import { FREELANCE_GIGS, resolveFakeWebsite, WEBSITE_ROUTES } from "@/lib/computer";
import type { SaveData } from "@/lib/save";
import type { Bulletin } from "@/lib/ai-bulletin";

export interface AiSession {
  apiKey: string; model: string; enabled: boolean; connected: boolean;
}

export interface ComputerAppActions {
  onApply: (job: JobId) => void;
  onCreateProfile: () => void;
  onGigFinish: (order: readonly number[]) => void;
  onNotes: (notes: string) => void;
  onHonk: () => void;
  onHistory: (host: string) => void;
  onBulletin: (item: Bulletin) => void;
  onAi: (update: Partial<AiSession>) => void;
  openApp: (app: string) => void;
}

export function FakeJobPortal({ save, locale, actions }: {
  save: SaveData; locale: Locale; actions: ComputerAppActions;
}) {
  const t = copy[locale];
  if (!save.hasProfile) return (
    <section className="pc-content">
      <p className="pc-muted">{t.fictional}</p>
      <h2>{t.introTitle}</h2>
      <p>{t.introBody}</p>
      <button className="pc-action" onClick={actions.onCreateProfile}>{t.introButton}</button>
    </section>
  );
  return (
    <section className="pc-content">
      <h2>{locale === "ar" ? "معلش: الوظايف" : "Maalesh Employment Services"}</h2>
      <p className="pc-muted">{locale === "ar" ? "قدم على وظيفة وتقدر تستقيل في أي وقت." : "Apply, try it, quit. We'll still like you."}</p>
      <div className="pc-job-grid">
        {JOBS.map(job => (
          <article className="pc-job" key={job.id}>
            <strong>{job.emoji} {job.title[locale]}</strong>
            <small>{job.location[locale]}</small>
            <p>{job.description[locale]}</p>
            <div className="pc-job-bottom">
              <span>🪙 {job.pay}</span>
              <button className="pc-action" disabled={!job.playable || Boolean(save.activeJob)}
                onClick={() => actions.onApply(job.id)}>
                {!job.playable ? t.reserved : save.activeJob === job.id ? t.myJob :
                  save.activeJob ? t.quitFirst : t.apply}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FakeMail({ save, locale }: { save: SaveData; locale: Locale }) {
  const t = copy[locale];
  const titles = {
    welcome: t.letterWelcomeTitle, hired: t.letterHiredTitle,
    quit: t.letterQuitTitle, paid: t.letterPaidTitle,
  };
  const bodies = {
    welcome: t.letterWelcomeBody, hired: t.letterHiredBody,
    quit: t.letterQuitBody, paid: t.letterPaidBody,
  };
  return <section className="pc-content">
    <h2>✉ {t.inboxTitle}</h2>
    {save.mails.length === 0 && <p className="pc-muted">{t.noLetters}</p>}
    {[...save.mails].reverse().map(mail =>
      <article className="pc-mail" key={mail.id}>
        <strong>{titles[mail.kind]}</strong>
        <small>{t.from}</small>
        <p>{bodies[mail.kind]}</p>
      </article>
    )}
  </section>;
}

export function FreelancerApp({ save, locale, actions }: {
  save: SaveData; locale: Locale; actions: ComputerAppActions;
}) {
  const gig = FREELANCE_GIGS[0];
  const [order, setOrder] = useState<number[]>([...gig.initial]);
  const [notice, setNotice] = useState("");
  const done = save.computer.completedGigs.includes(gig.id);
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    setOrder(previous => {
      const next = [...previous];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setNotice("");
  }
  function deliver() {
    if (order.every((number, i) => number === [...gig.initial].sort((a, b) => a - b)[i])) {
      actions.onGigFinish(order);
      setNotice(locale === "ar" ? "اتبعت الشغل! الفلوس اتحولت." : "Delivered! Your client has paid.");
    } else setNotice(locale === "ar" ? "لسه الترتيب مش صح، حاول تاني." : "Still out of order. Try again.");
  }
  return <section className="pc-content">
    <div className="pc-app-banner">
      <h2>oddjobs.gig</h2>
      <p>{locale === "ar" ? "منصة عمل حر للمهام التي لا تعرف أنها موجودة" :
        "A freelance marketplace for tasks nobody admits they need."}</p>
    </div>
    <article className="pc-gig">
      <div className="pc-split"><strong>{gig.label[locale]}</strong><span>🪙 {gig.pay}</span></div>
      <small>{gig.client[locale]}</small>
      <p>{gig.description[locale]}</p>
      {done ? <p className="pc-success">{locale === "ar" ? "✓ المهمة خلصت، ومفيش عقوبة لو رفضت الجاية." :
        "✓ Contract complete. You may now return to doing nothing."}</p> :
        <>
          <div className="pc-invoice-list">
            {order.map((number, i) => <div className="pc-invoice" key={number}>
              <span>📄 INV-{String(number).padStart(3, "0")}</span>
              <div className="pc-invoice-controls">
                <button disabled={i === 0} onClick={() => move(i,-1)} aria-label={"Move invoice " + number + " up"}>↑</button>
                <button disabled={i === order.length - 1} onClick={() => move(i,1)} aria-label={"Move invoice " + number + " down"}>↓</button>
              </div>
            </div>)}
          </div>
          <button className="pc-action" onClick={deliver}>{locale === "ar" ? "سلم الشغل" : "Deliver work"}</button>
          <p className="pc-muted" role="status">{notice}</p>
        </>}
    </article>
    <p className="pc-muted">{locale === "ar" ? "مهام أكتر هتجيلك مع التحديثات. كلها اختيارية." :
      "More contracts will arrive in future updates. Every gig is optional."}</p>
  </section>;
}

const OFFLINE_POSTS = [
  {
    en: ["Town council announces improved pothole naming policy", "Every pothole may now request a personal name. Applications close on Tuesday."],
    ar: ["المجلس المحلي يعلن نظام تسمية الحفر", "كل حفرة في الأسفلت من حقها اسم خاص. التقديم لحد الثلاثاء."],
  },
  {
    en: ["Sunny Farm's chickens require a formal lunch break", "The farmer says negotiations are moving in the right direction."],
    ar: ["فراخ المزرعة تطلب بريك غدا رسمي", "صاحب المزرعة بيقول إن المفاوضات ماشية في الاتجاه الصح."],
  },
  {
    en: ["Library confirms silence is still free", "The librarian politely refused to comment any louder."],
    ar: ["المكتبة تؤكد إن الهدوء ببلاش", "أمين المكتبة رفض يعلق بصوت أعلى من الهمس."],
  },
];

export function TownBulletin({ save, locale, ai, actions }: {
  save: SaveData; locale: Locale; ai: AiSession; actions: ComputerAppActions;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function generate() {
    if (!ai.enabled || !ai.connected || !ai.apiKey) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/ai/town-bulletin", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ apiKey: ai.apiKey, model: ai.model, locale, worldMinutes: save.worldMinutes }),
      });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error(
        data && typeof data === "object" && "error" in data ? String(data.error) : "Provider unavailable",
      );
      const bulletin = data as Bulletin;
      if (typeof bulletin.headline !== "string" || typeof bulletin.body !== "string") throw new Error("Invalid story");
      actions.onBulletin(bulletin);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Provider unavailable");
    } finally { setLoading(false); }
  }
  return <section className="pc-content">
    <h2>{locale === "ar" ? "لوحة إعلانات البلد" : "Town Noticeboard"}</h2>
    <p className="pc-muted">{locale === "ar" ? "الأخبار دي شغالة من غير إنترنت حقيقي." :
      "The usual neighborhood news is always available offline."}</p>
    {[...save.computer.savedBulletins].reverse().map((line,i) => (
      <article className="pc-mail" key={i}><strong>✨ {locale === "ar" ? "إضافة اختيارية" : "Extra local report"}</strong><p>{line}</p></article>
    ))}
    {OFFLINE_POSTS.map((post,i) => <article className="pc-mail" key={i}>
      <strong>{post[locale][0]}</strong><p>{post[locale][1]}</p>
    </article>)}
    <div className="pc-ai-box">
      <strong>{locale === "ar" ? "أخبار إضافية بالذكاء الاصطناعي (اختياري)" : "Optional AI neighborhood edition"}</strong>
      <p>{locale === "ar" ? "محتوى اللعبة الأساسي لا يحتاج مفتاح أو اتصال. الإضافة دي تستخدم مفتاحك أنت فقط." :
        "The built-in town works without a key or network. Extras use only your own API key."}</p>
      <button className="pc-action" disabled={!ai.enabled || !ai.connected || !ai.apiKey || loading} onClick={generate}>
        {loading ? "…" : locale === "ar" ? "ولد خبر جديد" : "Generate extra report"}
      </button>
      <span className="pc-muted">{!ai.connected ? " Offline" : !ai.enabled || !ai.apiKey ? " Configure AI Settings first" : ""}</span>
      {error && <p className="pc-error" role="alert">{error}</p>}
    </div>
  </section>;
}

export function BrowserApp({ save, locale, ai, actions }: {
  save: SaveData; locale: Locale; ai: AiSession; actions: ComputerAppActions;
}) {
  const [address, setAddress] = useState("town.bbs");
  const [current, setCurrent] = useState("town.bbs");
  const route = resolveFakeWebsite(current);
  function navigate(event: FormEvent) {
    event.preventDefault();
    const next = address.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    setCurrent(next);
    if (resolveFakeWebsite(next)) actions.onHistory(next);
  }
  return <div className="pc-browser">
    <form className="pc-addressbar" onSubmit={navigate}>
      <span>📡 FauxNet</span><input aria-label="Fictional website address" value={address} onChange={e => setAddress(e.target.value)} />
      <button className="pc-action" type="submit">Go</button>
    </form>
    <div className="pc-quicklinks">{WEBSITE_ROUTES.map(site => <button key={site.host}
      onClick={() => { setAddress(site.host); setCurrent(site.host); actions.onHistory(site.host); }}>
      {site.host}
    </button>)}</div>
    {route === "jobs" ? <FakeJobPortal save={save} locale={locale} actions={actions} /> :
      route === "freelance" ? <FreelancerApp save={save} locale={locale} actions={actions} /> :
      route === "bulletin" ? <TownBulletin save={save} locale={locale} ai={ai} actions={actions} /> :
      route === "help" ? <section className="pc-content"><h2>Help.pc</h2><p>The internet here is fictional and offline-first.</p><p>Visit oddjobs.gig for tasks or maalesh.jobs for local employment.</p></section> :
      <section className="pc-content"><h2>404: That site doesn't exist in this town.</h2><p>No real external websites are opened by this fake browser.</p></section>}
  </div>;
}

export function NotesApp({ save, locale, actions }: {
  save: SaveData; locale: Locale; actions: ComputerAppActions;
}) {
  return <div className="pc-content">
    <h2>{locale === "ar" ? "مفكرة" : "Notepad"} — notes.txt</h2>
    <textarea className="pc-notes" value={save.computer.notes}
      onChange={event => actions.onNotes(event.target.value.slice(0,4000))}
      aria-label="Text editor" spellCheck={false} />
    <small className="pc-muted">{locale === "ar" ? "بتتحفظ مع اللعبة تلقائيًا." : "Saved to your fictional computer automatically."}</small>
  </div>;
}

export function FilesApp({ save, locale, actions }: {
  save: SaveData; locale: Locale; actions: ComputerAppActions;
}) {
  return <section className="pc-content">
    <h2>📁 {locale === "ar" ? "الكمبيوتر بتاعي" : "My Computer"}</h2>
    <p className="pc-muted">C:\Documents — {locale === "ar" ? "نظام ملفات وهمي" : "virtual filesystem"}</p>
    <button className="pc-file" onClick={() => actions.openApp("notepad")}>📃 notes.txt <small>{save.computer.notes.length} bytes</small></button>
    <button className="pc-file" onClick={() => actions.openApp("mail")}>📨 Mailbox <small>{save.mails.length} messages</small></button>
    <button className="pc-file" onClick={() => actions.openApp("duck")}>🦆 RubberDuck.exe <small>{save.computer.duckHonks} honks</small></button>
    <button className="pc-file" onClick={() => actions.openApp("freelance")}>📄 Invoices <small>{save.computer.completedGigs.length} completed</small></button>
  </section>;
}

export function DuckApp({ save, actions, locale }: {
  save: SaveData; actions: ComputerAppActions; locale: Locale;
}) {
  return <div className="pc-content pc-duck-app">
    <div className="pc-duck-emoji" role="img" aria-label="Rubber duck">🦆</div>
    <h2>RubberDuck.exe</h2>
    <p className="pc-muted">{locale === "ar" ? "البطة دي معندهاش أي لازمة. وده سبب وجودها." :
      "This duck has no productive purpose. It's perfect."}</p>
    <button className="pc-action" onClick={actions.onHonk}>HONK! ({save.computer.duckHonks})</button>
  </div>;
}

export function AiSettingsApp({ ai, locale, actions }: {
  ai: AiSession; locale: Locale; actions: ComputerAppActions;
}) {
  return <section className="pc-content">
    <h2>⚙ AI / BYOK</h2>
    <p className="pc-muted">{locale === "ar"
      ? "الـ AI مش مطلوب لتشغيل اللعبة. المفتاح بيعيش في الذاكرة فقط، وبيتصفّر لما تعمل Refresh."
      : "AI is optional. Your key is held only in this browser session's memory, cleared on refresh, and sent to our server only when you explicitly generate."}</p>
    <label className="pc-field">Gemini API key
      <input type="password" autoComplete="off" spellCheck={false} placeholder="Your own API key"
        value={ai.apiKey} onChange={e => actions.onAi({ apiKey: e.target.value })} />
    </label>
    <label className="pc-field">Model ID
      <input spellCheck={false} value={ai.model} onChange={e => actions.onAi({ model: e.target.value })} />
    </label>
    <label className="pc-check">
      <input type="checkbox" checked={ai.enabled} onChange={e => actions.onAi({ enabled: e.target.checked })} />
      {locale === "ar" ? "السماح بتوليد أخبار إضافية عند طلبي فقط" : "Enable manual extra bulletin generation"}
    </label>
    <p className="pc-muted">{ai.connected ? "● Browser online" : "○ Browser offline"} · {ai.enabled ? "Opted in" : "Offline content only"}</p>
    <button className="pc-action" onClick={() => actions.onAi({ enabled: false, apiKey: "" })}>Clear key & disable</button>
  </section>;
}
