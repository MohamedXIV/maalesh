import { JOBS, type JobId, type Locale } from "./content";

export type MailKind = "welcome" | "hired" | "quit" | "paid";

export interface MailItem {
  id: number;
  kind: MailKind;
  jobId: JobId | null;
}

export interface SaveData {
  version: 1;
  locale: Locale;
  hasProfile: boolean;
  coins: number;
  shifts: number;
  activeJob: JobId | null;
  mails: MailItem[];
}

const STORAGE_KEY = "maalesh-save-v1";
const mailKinds: readonly string[] = ["welcome", "hired", "quit", "paid"];

export function freshSave(): SaveData {
  return {
    version: 1,
    locale: "en",
    hasProfile: false,
    coins: 0,
    shifts: 0,
    activeJob: null,
    mails: [],
  };
}

function validJob(value: unknown): value is JobId {
  return typeof value === "string" && JOBS.some((job) => job.id === value);
}

export function loadSave(): SaveData {
  const initial = freshSave();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || !("version" in saved) || saved.version !== 1) {
      return initial;
    }
    const data = saved as Partial<SaveData>;
    const mails: MailItem[] = Array.isArray(data.mails)
      ? data.mails.filter((item): item is MailItem =>
          Boolean(item && typeof item.id === "number" && mailKinds.includes(item.kind) &&
            (item.jobId === null || validJob(item.jobId))))
      : [];
    return {
      version: 1,
      locale: data.locale === "ar" ? "ar" : "en",
      hasProfile: data.hasProfile === true,
      coins: typeof data.coins === "number" && Number.isFinite(data.coins) ? Math.max(0, data.coins) : 0,
      shifts: typeof data.shifts === "number" && Number.isFinite(data.shifts) ? Math.max(0, data.shifts) : 0,
      activeJob: validJob(data.activeJob) ? data.activeJob : null,
      mails,
    };
  } catch {
    return initial;
  }
}

export function persistSave(save: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Private browsing and storage-quota failures must not interrupt gameplay.
  }
}

export function addMail(save: SaveData, kind: MailKind, jobId: JobId | null): MailItem[] {
  const nextId = (save.mails.at(-1)?.id ?? 0) + 1;
  return [...save.mails, { id: nextId, kind, jobId }];
}
