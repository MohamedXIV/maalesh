import { JOBS, type JobId, type Locale } from "./content";
import { freshComputer, parseComputer, type ComputerSave } from "./computer";
import { START_GRID, TOWN_GRID, type GridPosition } from "@/game/town/town-model";

export type MailKind = "welcome" | "hired" | "quit" | "paid";
export interface MailItem { id: number; kind: MailKind; jobId: JobId | null; }

export interface SaveData {
  version: 3;
  locale: Locale;
  hasProfile: boolean;
  coins: number;
  shifts: number;
  activeJob: JobId | null;
  activeShiftId: string | null;
  nextShiftNumber: number;
  paidShiftIds: string[];
  hasDuckLamp: boolean;
  villagePosition: { x: number; y: number }; // legacy v2 room/world coordinates, retained for migration
  townPosition: GridPosition;
  worldMinutes: number;
  computer: ComputerSave;
  mails: MailItem[];
}
const STORAGE_KEY = "maalesh-save-v1";
const validMailKinds: readonly string[] = ["welcome", "hired", "quit", "paid"];
const LEGACY_POSITION = { x: 465, y: 273 };
const WORLD_START = 8 * 60;

export function freshSave(): SaveData {
  return {
    version: 3, locale: "en", hasProfile: false, coins: 0, shifts: 0,
    activeJob: null, activeShiftId: null, nextShiftNumber: 1, paidShiftIds: [],
    hasDuckLamp: false, villagePosition: { ...LEGACY_POSITION },
    townPosition: { ...START_GRID }, worldMinutes: WORLD_START,
    computer: freshComputer(), mails: [],
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
    if (source.version !== 1 && source.version !== 2 && source.version !== 3) return fresh;
    const mails = (Array.isArray(source.mails) ? source.mails : []).filter((item): item is MailItem => {
      const data = record(item);
      return Number.isSafeInteger(data.id) && (data.id as number) >= 0 &&
        validMailKinds.includes(String(data.kind)) &&
        (data.jobId === null || validJob(data.jobId));
    });
    const pos = record(source.villagePosition);
    const town = record(source.townPosition);
    return {
      version: 3,
      locale: source.locale === "ar" ? "ar" : "en",
      hasProfile: source.hasProfile === true,
      coins: validNumber(source.coins),
      shifts: validNumber(source.shifts),
      activeJob: validJob(source.activeJob) ? source.activeJob : null,
      // Resume in town but never repeat an unfinished shift payout.
      activeShiftId: null,
      nextShiftNumber: Math.max(1, Math.floor(validNumber(source.nextShiftNumber, 1))),
      paidShiftIds: Array.isArray(source.paidShiftIds)
        ? source.paidShiftIds.filter((x): x is string => typeof x === "string").slice(-50) : [],
      hasDuckLamp: source.hasDuckLamp === true,
      villagePosition: {
        x: Math.min(935, Math.max(25, validNumber(pos.x, LEGACY_POSITION.x))),
        y: Math.min(540, Math.max(20, validNumber(pos.y, LEGACY_POSITION.y))),
      },
      townPosition: {
        x: Math.min(TOWN_GRID - 2, Math.max(1, validNumber(town.x, START_GRID.x))),
        y: Math.min(TOWN_GRID - 2, Math.max(1, validNumber(town.y, START_GRID.y))),
      },
      worldMinutes: Math.floor(validNumber(source.worldMinutes, WORLD_START)) % (1440 * 500),
      computer: parseComputer(source.computer),
      mails,
    };
  } catch { return fresh; }
}
export function loadSave(): SaveData {
  try { return parseSave(localStorage.getItem(STORAGE_KEY)); }
  catch { return freshSave(); }
}
export function persistSave(save: SaveData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); }
  catch { /* Storage blocked should not stop a cozy game. */ }
}
export function addMail(save: SaveData, kind: MailKind, jobId: JobId | null): MailItem[] {
  return [...save.mails, { id: (save.mails.at(-1)?.id ?? 0) + 1, kind, jobId }];
}
