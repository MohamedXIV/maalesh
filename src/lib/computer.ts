import type { SaveData } from "@/lib/save";

export interface ComputerSave {
  notes: string;
  completedGigs: string[];
  duckHonks: number;
  browserHistory: string[];
  savedBulletins: string[];
}

export const WEBSITE_ROUTES = [
  { host: "maalesh.jobs", title: "Maalesh Careers", app: "jobs" },
  { host: "oddjobs.gig", title: "OddJobs Freelancer Market", app: "freelance" },
  { host: "town.bbs", title: "The Town Noticeboard", app: "bulletin" },
  { host: "help.pc", title: "Computer Help", app: "help" },
] as const;

export type WebApp = (typeof WEBSITE_ROUTES)[number]["app"];
export type GigId = "invoices";
export const FREELANCE_GIGS = [{
  id: "invoices" as const,
  label: { en: "Arrange four invoices", ar: "رتب أربع فواتير" },
  client: { en: "Very Serious Accounting", ar: "حسابات جد جدًا" },
  description: {
    en: "They printed the invoices in the wrong order. Make the numbers ascend.",
    ar: "طبعوا الفواتير بترتيب ملخبط. رتب أرقامها من الأصغر للأكبر.",
  },
  initial: [29, 4, 16, 12],
  pay: 3,
}];

export function freshComputer(): ComputerSave {
  return {
    notes: "Dear diary,\nToday I was offered a job involving a chair.\n",
    completedGigs: [], duckHonks: 0, browserHistory: ["maalesh.jobs"], savedBulletins: [],
  };
}

export function parseComputer(value: unknown): ComputerSave {
  const raw = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
  return {
    notes: typeof raw.notes === "string" ? raw.notes.slice(0, 4000) : freshComputer().notes,
    completedGigs: Array.isArray(raw.completedGigs)
      ? [...new Set(raw.completedGigs.filter((x): x is string => typeof x === "string"))].slice(-60)
      : [],
    duckHonks: typeof raw.duckHonks === "number" && Number.isFinite(raw.duckHonks)
      ? Math.max(0, Math.floor(raw.duckHonks)) : 0,
    browserHistory: Array.isArray(raw.browserHistory)
      ? raw.browserHistory.filter((x): x is string => typeof x === "string").slice(-20)
      : ["maalesh.jobs"],
    savedBulletins: Array.isArray(raw.savedBulletins)
      ? raw.savedBulletins.filter((x): x is string => typeof x === "string").map(x => x.slice(0, 600)).slice(-8)
      : [],
  };
}

export function resolveFakeWebsite(address: string): WebApp | null {
  const clean = address.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0];
  return WEBSITE_ROUTES.find(route => route.host === clean)?.app ?? null;
}

export function appendComputerHistory(save: SaveData, host: string): SaveData {
  if (!resolveFakeWebsite(host)) return save;
  return {
    ...save,
    computer: {
      ...save.computer,
      browserHistory: [...save.computer.browserHistory.filter(x => x !== host), host].slice(-20),
    },
  };
}

export function finishFreelanceGig(save: SaveData, id: GigId, order: readonly number[]): SaveData {
  const gig = FREELANCE_GIGS.find(job => job.id === id);
  if (!gig || save.computer.completedGigs.includes(id) ||
    order.length !== gig.initial.length ||
    order.some((n, i) => n !== [...gig.initial].sort((a, b) => a - b)[i])) return save;
  return {
    ...save,
    coins: save.coins + gig.pay,
    computer: {
      ...save.computer,
      completedGigs: [...save.computer.completedGigs, id],
    },
  };
}

export function honkDuck(save: SaveData): SaveData {
  return {
    ...save,
    computer: { ...save.computer, duckHonks: save.computer.duckHonks + 1 },
  };
}
