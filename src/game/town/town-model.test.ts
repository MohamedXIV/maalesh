import { describe, expect, it } from "vitest";
import { canWalk, findTownPath, LANDMARKS, nearestLandmark, projectIso, START_GRID, townSurface, unprojectIso } from "./town-model";

describe("Town geometry and navigation", () => {
  it("round trips world and isometric rendering positions", () => {
    for (const point of [{ x: 1, y: 1 }, { x: 28.5, y: 14 }, { x: 49, y: 39 }]) {
      const result = unprojectIso(projectIso(point));
      expect(result.x).toBeCloseTo(point.x, 5);
      expect(result.y).toBeCloseTo(point.y, 5);
    }
  });
  it("has asphalt, side streets and a countryside, not just a rural village", () => {
    expect(townSurface(26, 10)).toBe("road");
    expect(townSurface(12, 18)).toBe("lane");
    expect(townSurface(46, 45)).toBe("rural");
    expect(townSurface(35, 38)).toBe("park");
  });
  it("keeps building collision separate from walkable entrances", () => {
    expect(canWalk(START_GRID)).toBe(true);
    for (const landmark of LANDMARKS) {
      if (landmark.id !== "park") expect(canWalk(landmark.at)).toBe(false);
      expect(canWalk(landmark.door)).toBe(true);
      expect(nearestLandmark(landmark.door)?.id).toBe(landmark.id);
    }
  });
  it("routes around buildings and reaches real workplaces", () => {
    for (const landmark of LANDMARKS) {
      const route = findTownPath(START_GRID, landmark.door);
      expect(route.length).toBeGreaterThan(0);
      expect(route.at(-1)).toEqual(landmark.door);
      expect(route.every(canWalk)).toBe(true);
    }
  });
  it("does not navigate into blocked buildings", () => {
    expect(findTownPath(START_GRID, LANDMARKS[0].at)).toEqual([]);
  });
});
