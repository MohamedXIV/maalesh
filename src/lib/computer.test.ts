import { describe, it, expect } from "vitest";
import { freshSave, parseSave } from "./save";
import { appendComputerHistory, finishFreelanceGig, freshComputer, honkDuck, resolveFakeWebsite } from "./computer";

describe("Fictional computer is offline-first and saveable", () => {
  it("serves only locally registered pretend websites", () => {
    expect(resolveFakeWebsite("https://maalesh.jobs/")).toBe("jobs");
    expect(resolveFakeWebsite("oddjobs.gig")).toBe("freelance");
    expect(resolveFakeWebsite("google.com")).toBeNull();
  });
  it("pays for the actual sorted-invoice interaction exactly once", () => {
    const start = freshSave();
    expect(finishFreelanceGig(start, "invoices", [29, 4, 16, 12])).toBe(start);
    const done = finishFreelanceGig(start, "invoices", [4, 12, 16, 29]);
    expect(done.coins).toBe(3);
    expect(done.computer.completedGigs).toEqual(["invoices"]);
    expect(finishFreelanceGig(done, "invoices", [4, 12, 16, 29])).toBe(done);
  });
  it("stores and reloads pretend browser history and duck honks", () => {
    let save = honkDuck(freshSave());
    save = appendComputerHistory(save, "oddjobs.gig");
    const restored = parseSave(JSON.stringify(save));
    expect(restored.computer.duckHonks).toBe(1);
    expect(restored.computer.browserHistory.at(-1)).toBe("oddjobs.gig");
  });
  it("uses offline content by default", () => {
    expect(freshComputer().savedBulletins).toEqual([]);
    expect(freshSave().computer.completedGigs).toEqual([]);
  });
});
