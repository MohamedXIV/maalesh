/** Spatial simulation uses a square logical grid; only rendering is isometric. */
export const TOWN_GRID = 52;
export const TILE_W = 80;
export const TILE_H = 40;
export const TOWN_ORIGIN = { x: 2100, y: 120 };
export type GridPosition = { x: number; y: number };
export type TownSurface = "road" | "lane" | "sidewalk" | "grass" | "rural" | "park";
export type TownLandmarkId =
  | "agency" | "home" | "workshop" | "office" | "cafe"
  | "market" | "farm" | "park" | "library" | "lampshop";

export interface TownLandmark {
  id: TownLandmarkId;
  at: GridPosition;
  door: GridPosition;
  height: number;
  color: number;
  roof: number;
  label: { en: string; ar: string };
}

export const LANDMARKS: readonly TownLandmark[] = [
  { id: "agency", at: { x: 20, y: 21 }, door: { x: 23, y: 21 }, height: 118, color: 0xffe1a8, roof: 0xd78b79, label: { en: "MAALESH AGENCY", ar: "شركة معلش" } },
  { id: "home", at: { x: 18, y: 33 }, door: { x: 21, y: 33 }, height: 130, color: 0xfbe8d2, roof: 0x7c9b9a, label: { en: "APARTMENTS", ar: "العمارات" } },
  { id: "workshop", at: { x: 33, y: 20 }, door: { x: 30, y: 20 }, height: 125, color: 0xeac6d0, roof: 0x9b7e97, label: { en: "THREAD & CO.", ar: "مصنع الملابس" } },
  { id: "office", at: { x: 33, y: 33 }, door: { x: 30, y: 33 }, height: 132, color: 0xf8e0b1, roof: 0x879ab4, label: { en: "FILING OFFICE", ar: "مكتب الملفات" } },
  { id: "cafe", at: { x: 17, y: 17 }, door: { x: 20, y: 17 }, height: 91, color: 0xd2b899, roof: 0x926c55, label: { en: "SUNNY CAFE", ar: "قهوة الشمس" } },
  { id: "market", at: { x: 34, y: 28 }, door: { x: 31, y: 28 }, height: 108, color: 0xb9cda8, roof: 0x829476, label: { en: "CORNER SHOP", ar: "بقالة الناصية" } },
  { id: "farm", at: { x: 43, y: 42 }, door: { x: 40, y: 42 }, height: 74, color: 0xe8c4a4, roof: 0xb68c65, label: { en: "SUNNY FARM", ar: "المزرعة" } },
  { id: "park", at: { x: 36, y: 40 }, door: { x: 33, y: 40 }, height: 12, color: 0xbacaaa, roof: 0x7baf86, label: { en: "POCKET PARK", ar: "جنينة صغيرة" } },
  { id: "lampshop", at: { x: 34, y: 14 }, door: { x: 31, y: 14 }, height: 110, color: 0xe9d6a0, roof: 0x8aa6b5, label: { en: "LIGHTING DEPOT", ar: "إدارة الإنارة" } },
  { id: "library", at: { x: 18, y: 40 }, door: { x: 21, y: 40 }, height: 110, color: 0xb5cdda, roof: 0x7292aa, label: { en: "TOWN LIBRARY", ar: "مكتبة البلد" } },
];

export const START_GRID: GridPosition = { x: 25, y: 24 };

export function projectIso(p: GridPosition): GridPosition {
  return {
    x: TOWN_ORIGIN.x + (p.x - p.y) * TILE_W / 2,
    y: TOWN_ORIGIN.y + (p.x + p.y) * TILE_H / 2,
  };
}
export function unprojectIso(p: GridPosition): GridPosition {
  const sx = (p.x - TOWN_ORIGIN.x) / (TILE_W / 2);
  const sy = (p.y - TOWN_ORIGIN.y) / (TILE_H / 2);
  return { x: (sx + sy) / 2, y: (sy - sx) / 2 };
}

export function townSurface(x: number, y: number): TownSurface {
  if (x >= 38 && y >= 34) return "rural";
  if (x >= 33 && x <= 40 && y >= 36 && y <= 45) return "park";
  if ((x >= 24 && x <= 28) || (y >= 24 && y <= 28)) return "road";
  if ((x >= 11 && x <= 12) || (y >= 38 && y <= 39)) return "lane";
  if ((x >= 22 && x <= 30) || (y >= 22 && y <= 30)) return "sidewalk";
  return "grass";
}

export function inTown(p: GridPosition): boolean {
  return p.x >= 1 && p.y >= 1 && p.x < TOWN_GRID - 1 && p.y < TOWN_GRID - 1;
}
export function isBlocked(p: GridPosition): boolean {
  const x = Math.round(p.x), y = Math.round(p.y);
  if (!inTown({ x, y })) return true;
  return LANDMARKS.some(landmark =>
    landmark.id !== "park" &&
    Math.abs(x - landmark.at.x) <= 1 &&
    Math.abs(y - landmark.at.y) <= 1
  );
}
export function canWalk(p: GridPosition): boolean {
  return !isBlocked(p);
}

/** Breadth-first route for taps; only called per destination, never per frame. */
export function findTownPath(from: GridPosition, to: GridPosition): GridPosition[] {
  const start = { x: Math.round(from.x), y: Math.round(from.y) };
  const goal = { x: Math.round(to.x), y: Math.round(to.y) };
  if (!canWalk(start) || !canWalk(goal)) return [];
  const key = (p: GridPosition) => p.x + "," + p.y;
  const first = key(start), last = key(goal);
  if (first === last) return [goal];
  const queue: GridPosition[] = [start];
  let index = 0;
  const parents = new Map<string, string | null>([[first, null]]);
  const positions = new Map<string, GridPosition>([[first, start]]);
  const dirs = [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }];
  while (index < queue.length) {
    const here = queue[index++];
    for (const d of dirs) {
      const next = { x: here.x + d.x, y: here.y + d.y };
      const nKey = key(next);
      if (parents.has(nKey) || !canWalk(next)) continue;
      parents.set(nKey, key(here));
      positions.set(nKey, next);
      if (nKey === last) {
        const path: GridPosition[] = [];
        let cursor: string | null = nKey;
        while (cursor && cursor !== first) {
          path.push(positions.get(cursor)!);
          cursor = parents.get(cursor) ?? null;
        }
        path.reverse();
        return path;
      }
      queue.push(next);
    }
  }
  return [];
}
export function nearestLandmark(p: GridPosition, radius = 2.4): TownLandmark | null {
  let nearest: TownLandmark | null = null;
  let distance = radius;
  for (const landmark of LANDMARKS) {
    const d = Math.hypot(p.x - landmark.door.x, p.y - landmark.door.y);
    if (d < distance) { distance = d; nearest = landmark; }
  }
  return nearest;
}
