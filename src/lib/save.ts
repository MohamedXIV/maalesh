import { JOBS, type JobId, type Locale } from "./content";

export type MailKind = "welcome" | "hired" | "quit" | "paid";
export interface MailItem {
  id: number;
  kind: MailKind;
  jobId: JobId | null;
}
export interface SaveData {
  version: 2;
  locale: Locale;
  hasProfile: boolean;
  coins: number;
  shifts: number;
  activeJob: JobId | null;
  activeShiftId: string | null;
  nextShiftNumber: number;
  paidShiftIds: string[];
  hasDuckLamp: boolean;
  villagePosition: { x: number; y: number };
  mails: MailItem[];
}
const STORAGE_KEY = "maalesh-save-v1";
const validMailKinds: readonly string[] = ["welcome", "hired", "quit", "paid"];
const DEFAULT_POSITION = { x: 465, y: 273 };

export function freshSave(): SaveData {
  return {
    version: 2, locale: "en", hasProfile: false, coins: 0, shifts: 0,
    activeJob: null, activeShiftId: null, nextShiftNumber: 1, paidShiftIds: [],
    hasDuckLamp: false, villagePosition: { ...DEFAULT_POSITION }, mails: [],
  };
}
function validJob(value: unknown): value is JobId {
  return typeof value === "string" && JOBS.some(job => job.id === value);
}
function validNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;
}
function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}
export function parseSave(raw: string | null): SaveData {
  const fresh = freshSave();
  if (!raw) return fresh;
  try {
    const source = record(JSON.parse(raw));
    if (source.version !== 1 && source.version !== 2) return fresh;
    const mail = Array.isArray(source.mails) ? source.mails : [];
    const mails = mail.filter((item): item is MailItem => {
      const data = record(item);
      return Number.isSafeInteger(data.id) && (data.id as number) >= 0 &&
        validMailKinds.includes(String(data.kind)) &&
        (data.jobId === null || validJob(data.jobId));
    });
    const pos = record(source.villagePosition);
    return {
      version: 2,
      locale: source.locale === "ar" ? "ar" : "en",
      hasProfile: source.hasProfile === true,
      coins: validNumber(source.coins),
      shifts: validNumber(source.shifts),
      activeJob: validJob(source.activeJob) ? source.activeJob : null,
      // A running shift never resumes after a browser restart.
      activeShiftId: null,
      nextShiftNumber: Math.max(1, Math.floor(validNumber(source.nextShiftNumber,1))),
      paidShiftIds: Array.isArray(source.paidShiftIds)
        ? source.paidShiftIds.filter((x): x is string => typeof x === "string").slice(-50)
        : [],
      hasDuckLamp: source.hasDuckLamp === true,
      villagePosition: {
        x: Math.min(935,Math.max(25,validNumber(pos.x,DEFAULT_POSITION.x))),
        y: Math.min(540,Math.max(20,validNumber(pos.y,DEFAULT_POSITION.y))),
      },
      mails,
    };
  } catch {
    return fresh;
  }
}
export function loadSave(): SaveData {
  try { return parseSave(localStorage.getItem(STORAGE_KEY)); }
  catch { return freshSave(); }
}
export function persistSave(save: SaveData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); }
  catch { /* Storage disabled must not stop the game. */ }
}
export function addMail(save: SaveData, kind: MailKind, jobId: JobId | null): MailItem[] {
  return [...save.mails, { id: (save.mails.at(-1)?.id ?? 0) + 1, kind, jobId }];
}
