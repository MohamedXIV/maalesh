import { describe, it, expect } from "vitest";
import { freshSave, parseSave } from "./save";
import {
  applyForJob, buyDuckLamp, cancelShift, completeShift, createProfile,
  DUCK_LAMP_PRICE, quitJob, startShift,
} from "./employment";

describe("Maalesh employment contract", () => {
  it("welcomes a fictional applicant only once", () => {
    const saved = createProfile(freshSave());
    expect(saved.hasProfile).toBe(true);
    expect(saved.mails).toHaveLength(1);
    expect(createProfile(saved)).toEqual(saved);
  });

  it("supports applying for both currently playable job types", () => {
    for (const id of ["needle", "paperweight"] as const) {
      const hired = applyForJob(createProfile(freshSave()), id);
      expect(hired.activeJob).toBe(id);
      expect(hired.mails.at(-1)?.kind).toBe("hired");
    }
  });

  it("rejects unfinished jobs and switching without resigning", () => {
    const started = applyForJob(createProfile(freshSave()), "needle");
    expect(applyForJob(started, "chickens")).toBe(started);
    expect(applyForJob(started, "paperweight")).toBe(started);
  });

  it("awards exactly one paycheck even if completion fires twice", () => {
    const hired = applyForJob(createProfile(freshSave()), "paperweight");
    const shift = startShift(hired);
    const id = shift.activeShiftId!;
    const paid = completeShift(shift, id);
    expect(paid.coins).toBe(3);
    expect(paid.shifts).toBe(1);
    expect(completeShift(paid, id)).toBe(paid);
    expect(paid.mails.filter(mail => mail.kind === "paid")).toHaveLength(1);
  });

  it("quits instantly during a shift with zero loss or blacklist", () => {
    const hired = applyForJob(createProfile(freshSave()), "needle");
    const finished = completeShift(startShift(hired), "shift-1");
    const duringSecond = startShift(finished);
    const quit = quitJob(duringSecond);
    expect(quit.activeJob).toBeNull();
    expect(quit.activeShiftId).toBeNull();
    expect(quit.coins).toBe(finished.coins);
    expect(quit.mails.at(-1)?.kind).toBe("quit");
    expect(completeShift(quit, duringSecond.activeShiftId!)).toBe(quit);
    expect(applyForJob(quit, "needle").activeJob).toBe("needle");
  });

  it("allows leaving an unfinished shift without resigning", () => {
    const shift = startShift(applyForJob(createProfile(freshSave()), "paperweight"));
    const after = cancelShift(shift);
    expect(after.activeJob).toBe("paperweight");
    expect(after.activeShiftId).toBeNull();
    expect(after.coins).toBe(0);
  });

  it("can buy exactly one duck lamp, never spending twice", () => {
    const saved = { ...freshSave(), coins: DUCK_LAMP_PRICE + 1 };
    const purchased = buyDuckLamp(saved);
    expect(purchased.coins).toBe(1);
    expect(purchased.hasDuckLamp).toBe(true);
    expect(buyDuckLamp(purchased)).toBe(purchased);
  });
});

describe("save migration and validation", () => {
  it("migrates the old v1 local save", () => {
    const old = JSON.stringify({
      version: 1, locale: "ar", hasProfile: true, activeJob: "needle",
      coins: 6, shifts: 2, mails: [{ id: 1, kind: "welcome", jobId: null }],
    });
    const next = parseSave(old);
    expect(next.version).toBe(2);
    expect(next.hasProfile).toBe(true);
    expect(next.activeJob).toBe("needle");
    expect(next.coins).toBe(6);
    expect(next.hasDuckLamp).toBe(false);
    expect(next.activeShiftId).toBeNull();
  });

  it("rejects corrupt and unsupported saves safely", () => {
    expect(parseSave("broken")).toEqual(freshSave());
    expect(parseSave('{"version":999}')).toEqual(freshSave());
  });
});
