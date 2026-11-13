import { getJob, type JobId } from "./content";
import { addMail, type SaveData } from "./save";

/** Pure commands: UI and Phaser scenes never change wallet or employment directly. */
export function createProfile(save: SaveData): SaveData {
  return save.hasProfile ? save :
    { ...save, hasProfile: true, mails: addMail(save, "welcome", null) };
}
export function applyForJob(save: SaveData, jobId: JobId): SaveData {
  const job = getJob(jobId);
  if (!save.hasProfile || save.activeJob || !job?.playable) return save;
  return { ...save, activeJob: jobId, mails: addMail(save, "hired", jobId) };
}
export function startShift(save: SaveData): SaveData {
  if (!save.activeJob || save.activeShiftId) return save;
  return {
    ...save,
    activeShiftId: "shift-" + save.nextShiftNumber,
    nextShiftNumber: save.nextShiftNumber + 1,
  };
}
export function cancelShift(save: SaveData): SaveData {
  return save.activeShiftId ? { ...save, activeShiftId: null } : save;
}
export function completeShift(save: SaveData, shiftId: string): SaveData {
  if (!save.activeJob || !save.activeShiftId || save.activeShiftId !== shiftId ||
      save.paidShiftIds.includes(shiftId)) return save;
  const job = getJob(save.activeJob);
  if (!job?.playable) return save;
  return {
    ...save,
    coins: save.coins + job.pay,
    shifts: save.shifts + 1,
    activeShiftId: null,
    paidShiftIds: [...save.paidShiftIds, shiftId].slice(-50),
    mails: addMail(save, "paid", save.activeJob),
  };
}
export function quitJob(save: SaveData): SaveData {
  if (!save.activeJob) return save;
  return {
    ...save,
    activeJob: null,
    activeShiftId: null,
    mails: addMail(save, "quit", save.activeJob),
  };
}
export const DUCK_LAMP_PRICE = 3;
export function buyDuckLamp(save: SaveData): SaveData {
  if (save.hasDuckLamp || save.coins < DUCK_LAMP_PRICE) return save;
  return { ...save, coins: save.coins - DUCK_LAMP_PRICE, hasDuckLamp: true };
}
