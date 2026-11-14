import Phaser from "phaser";
import type { Locale } from "@/lib/content";
import {
  canWalk, findTownPath, LANDMARKS, nearestLandmark, projectIso,
  START_GRID, TILE_H, TILE_W, TOWN_GRID, townSurface, unprojectIso,
  type GridPosition, type TownLandmark, type TownLandmarkId,
} from "./town-model";

export interface TownCallbacks {
  onVisit: (id: TownLandmarkId) => void;
  onPosition: (position: GridPosition) => void;
  onChat: (text: string) => void;
}

type Citizen = {
  id: string; name: { en: string; ar: string };
  daytime: GridPosition; evening: GridPosition; outfit: number;
  avatar?: Phaser.GameObjects.Container;
};
const CITIZENS: Citizen[] = [
  { id: "mira", name: { en: "Mira", ar: "ميرا" }, daytime: { x: 23, y: 20 }, evening: { x: 23, y: 31 }, outfit: 0xb47ba2 },
  { id: "salim", name: { en: "Salim", ar: "سليم" }, daytime: { x: 31, y: 33 }, evening: { x: 28, y: 36 }, outfit: 0x658e79 },
  { id: "nora", name: { en: "Nora", ar: "نورا" }, daytime: { x: 21, y: 17 }, evening: { x: 22, y: 25 }, outfit: 0xe2a76b },
  { id: "fadi", name: { en: "Fadi", ar: "فادي" }, daytime: { x: 40, y: 40 }, evening: { x: 37, y: 35 }, outfit: 0x7296b3 },
];
const CHAT = {
  en: {
    mira: "I'm from Maalesh. No, don't worry — this isn't an interview.",
    salim: "Do you think the papers would stay put if we asked them nicely?",
    nora: "The cafe's open. We have tea, biscuits and several opinions.",
    fadi: "The chickens held a meeting. I'm not invited.",
  },
  ar: {
    mira: "أنا من معلش. لا متقلقش، دي مش مقابلة شغل.",
    salim: "تفتكر الورق هيفضل مكانه لو طلبنا منه بالذوق؟",
    nora: "القهوة مفتوحة. عندنا شاي وبسكوت وآراء كتير.",
    fadi: "الفراخ عاملة اجتماع. وماعزمتنيش.",
  },
};
const SURFACE_COLORS: Record<ReturnType<typeof townSurface>, number> = {
  road: 0x777f85, lane: 0x989898, sidewalk: 0xd7cbbb,
  grass: 0xb3d3a5, rural: 0xc3d8a1, park: 0x8fc89e,
};

class TownScene extends Phaser.Scene {
  private readonly start: GridPosition;
  private readonly callback: TownCallbacks;
  private readonly locale: Locale;
  private readonly citizens: Citizen[] = CITIZENS.map(person => ({ ...person, daytime: { ...person.daytime }, evening: { ...person.evening } }));
  private playerGrid: GridPosition;
  private avatar?: Phaser.GameObjects.Container;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private interact?: Phaser.Input.Keyboard.Key;
  private waypoints: GridPosition[] = [];
  private pending: TownLandmarkId | null = null;
  private hint?: Phaser.GameObjects.Text;
  private overlay?: Phaser.GameObjects.Rectangle;
  private lastSync = 0;
  private pausedInput = false;
  private clock = 8 * 60;

  constructor(locale: Locale, start: GridPosition, callback: TownCallbacks) {
    super({ key: "TownScene" });
    this.locale = locale;
    this.start = canWalk(start) ? start : START_GRID;
    this.playerGrid = { ...this.start };
    this.callback = callback;
  }

  private screen(p: GridPosition): GridPosition { return projectIso(p); }

  private drawGround(): void {
    const g = this.add.graphics().setDepth(-10000);
    for (let y = 0; y < TOWN_GRID; y++) {
      for (let x = 0; x < TOWN_GRID; x++) {
        const p = this.screen({ x, y });
        const color = SURFACE_COLORS[townSurface(x, y)];
        const polygon = [
          { x: p.x, y: p.y - TILE_H / 2 }, { x: p.x + TILE_W / 2, y: p.y },
          { x: p.x, y: p.y + TILE_H / 2 }, { x: p.x - TILE_W / 2, y: p.y },
        ];
        const variation = (x * 37 + y * 11) % 11 === 0 && color === SURFACE_COLORS.grass;
        const vertices = polygon.map(point => new Phaser.Math.Vector2(point.x, point.y));
        g.fillStyle(variation ? 0xaad09a : color, 1);
        g.fillPoints(vertices, true);
        g.lineStyle(1, color === SURFACE_COLORS.road ? 0x879099 : 0xffffff, 0.12);
        g.strokePoints(vertices, true);
        if (townSurface(x, y) === "road" && ((x === 26 && y % 4 === 0) || (y === 26 && x % 4 === 0))) {
          g.fillStyle(0xf4de92, 0.85);
          g.fillEllipse(p.x, p.y, 14, 3);
        }
      }
    }
  }

  private polygon(points: { x: number; y: number }[], color: number, depth: number): void {
    const shape = this.add.graphics().setDepth(depth);
    const vertices = points.map(point => new Phaser.Math.Vector2(point.x, point.y));
    shape.fillStyle(color, 1);
    shape.fillPoints(vertices, true);
    shape.lineStyle(1.5, 0xffffff, 0.18);
    shape.strokePoints(vertices, true);
  }

  private drawBuilding(place: TownLandmark): void {
    if (place.id === "park") {
      const p = this.screen(place.at);
      this.add.ellipse(p.x, p.y, 148, 74, 0x69b189).setDepth(p.y - 10);
      this.add.circle(p.x - 25, p.y - 60, 35, 0x72aa72).setDepth(p.y);
      this.add.rectangle(p.x, p.y - 2, 70, 9, 0xa57d5b).setDepth(p.y + 2);
      return;
    }
    const { x, y } = this.screen(place.at);
    const h = place.height;
    const back = [
      { x: x - 86, y: y - h - 15 }, { x, y: y - h + 25 },
      { x, y: y + 27 }, { x: x - 86, y: y - 13 },
    ];
    const front = [
      { x, y: y - h + 25 }, { x: x + 86, y: y - h - 15 },
      { x: x + 86, y: y - 13 }, { x, y: y + 27 },
    ];
    const roof = [
      { x, y: y - h - 61 }, { x: x + 86, y: y - h - 15 },
      { x, y: y - h + 25 }, { x: x - 86, y: y - h - 15 },
    ];
    this.polygon(back, place.color, y + 3);
    this.polygon(front, place.color, y + 5);
    this.polygon(roof, place.roof, y + 7);
    this.add.rectangle(x + 37, y - 18, 26, 36, 0x8b7769).setDepth(y + 10);
    this.add.rectangle(x - 36, y - 29, 25, 27, 0xb8dae1).setDepth(y + 10);
    this.add.text(x, y - h - 16, place.label[this.locale], {
      fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#344d48",
      fontStyle: "bold", backgroundColor: "#fff9ea",
      padding: { x: 7, y: 5 },
    }).setOrigin(0.5).setDepth(y + 12);
    const door = this.screen(place.door);
    this.add.ellipse(door.x, door.y + 3, 43, 16, 0xf9e5b5, 0.9)
      .setStrokeStyle(2, 0xffffff, 0.75).setDepth(door.y - 1);
  }

  private drawDecorations(): void {
    for (let i = 0; i < 160; i++) {
      const grid = { x: 2 + ((i * 31) % 47), y: 2 + ((i * 17) % 47) };
      if (townSurface(grid.x, grid.y) === "road" ||
        townSurface(grid.x, grid.y) === "lane" ||
        LANDMARKS.some(l => Math.hypot(grid.x-l.at.x, grid.y-l.at.y) < 4)) continue;
      const p = this.screen(grid);
      if (i % 4 === 0) {
        this.add.rectangle(p.x, p.y - 15, 7, 29, 0x927b60).setDepth(p.y);
        this.add.circle(p.x, p.y - 36, 20, i % 8 === 0 ? 0x709e72 : 0x89b67e).setDepth(p.y+1);
      } else {
        this.add.circle(p.x, p.y - 5, 4.2, i % 2 ? 0xfff2bd : 0xf0a4a6).setDepth(p.y - 3);
      }
    }
  }

  private makeCitizen(name: string, at: GridPosition, outfit: number): Phaser.GameObjects.Container {
    const p = this.screen(at);
    const actor = this.add.container(p.x, p.y);
    actor.add([
      this.add.ellipse(0, 6, 22, 8, 0x424d43, .16),
      this.add.rectangle(0, -12, 19, 25, outfit),
      this.add.circle(0, -32, 12, 0xf2c8a3),
      this.add.arc(0, -39, 12, 190, 350, false, 0x63544c),
    ]);
    actor.add(this.add.text(0, 19, name, { fontSize: "11px", color: "#43564b", backgroundColor: "#fff9e7" }).setOrigin(.5));
    actor.setDepth(p.y + 4);
    return actor;
  }

  private refreshCitizenSchedule(): void {
    const hour = (this.clock % 1440) / 60;
    for (const citizen of this.citizens) {
      if (!citizen.avatar) continue;
      const next = hour < 18 && hour >= 7 ? citizen.daytime : citizen.evening;
      const target = this.screen(next);
      this.tweens.killTweensOf(citizen.avatar);
      this.tweens.add({
        targets: citizen.avatar, x: target.x, y: target.y,
        duration: 1200, ease: "Sine.easeInOut",
        onUpdate: () => { citizen.avatar?.setDepth(citizen.avatar.y + 4); },
      });
    }
    if (this.overlay) this.overlay.setAlpha(hour > 20 || hour < 6 ? 0.24 : hour > 17 ? 0.1 : 0);
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#b8d9c1");
    this.drawGround();
    this.drawDecorations();
    for (const landmark of LANDMARKS) this.drawBuilding(landmark);
    for (const npc of this.citizens) npc.avatar = this.makeCitizen(npc.name[this.locale], npc.daytime, npc.outfit);

    const spot = this.screen(this.playerGrid);
    this.avatar = this.makeCitizen("", this.playerGrid, 0x5f91ae);
    this.avatar.setPosition(spot.x, spot.y);
    this.cameras.main.startFollow(this.avatar, true, .12, .12);
    this.cameras.main.setBounds(0, 0, 4200, 2400);
    this.resizeView();
    this.scale.on("resize", this.resizeView, this);
    this.cursor = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.interact = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => this.click(pointer));
    this.overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x20385a)
      .setOrigin(0).setScrollFactor(0).setDepth(90000).setAlpha(0).disableInteractive();
    this.hint = this.add.text(0, 0, "", {
      fontFamily: "Arial, sans-serif", fontSize: "17px", fontStyle: "bold",
      backgroundColor: "#fff7e7", color: "#355d54", padding: { x: 14, y: 9 },
    }).setOrigin(.5).setDepth(95000).setScrollFactor(0);
    this.resizeView();
    this.refreshCitizenSchedule();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.syncPosition();
      this.scale.off("resize", this.resizeView, this);
    });
  }

  public setInputPaused(value: boolean): void {
    this.pausedInput = value;
    this.waypoints = [];
    this.pending = null;
  }
  public setClock(minutes: number): void {
    if (Math.floor(this.clock / 60) !== Math.floor(minutes / 60)) {
      this.clock = minutes;
      this.refreshCitizenSchedule();
    } else this.clock = minutes;
  }

  private resizeView(): void {
    const w = this.scale.width, h = this.scale.height;
    this.cameras.main.setZoom(Phaser.Math.Clamp(Math.min(w / 1000, h / 640), .65, 1.55));
    this.hint?.setPosition(w / 2, h - 43);
    this.overlay?.setSize(w, h);
  }

  private click(pointer: Phaser.Input.Pointer): void {
    if (this.pausedInput) return;
    const point = { x: pointer.worldX, y: pointer.worldY };
    const tapped = LANDMARKS.find(place => {
      const p = this.screen(place.at);
      return Math.abs(p.x - point.x) < 100 && point.y > p.y - place.height - 65 && point.y < p.y + 65;
    });
    this.pending = tapped?.id ?? null;
    const goal = tapped?.door ?? unprojectIso(point);
    this.waypoints = findTownPath(this.playerGrid, goal);
    if (tapped && Math.hypot(this.playerGrid.x-goal.x, this.playerGrid.y-goal.y) < 1.9) this.tryInteract();
  }

  private tryInteract(): void {
    if (this.pausedInput) return;
    const candidate = nearestLandmark(this.playerGrid, 2);
    if (candidate) {
      this.waypoints = [];
      this.pending = null;
      this.syncPosition();
      this.callback.onVisit(candidate.id);
      return;
    }
    for (const npc of this.citizens) {
      const spot = npc.avatar;
      if (!spot || !this.avatar) continue;
      if (Phaser.Math.Distance.Between(spot.x, spot.y, this.avatar.x, this.avatar.y) < 90) {
        this.callback.onChat(CHAT[this.locale][npc.id as keyof typeof CHAT.en]);
        return;
      }
    }
  }

  private syncPosition(): void {
    this.callback.onPosition({ x: Math.round(this.playerGrid.x * 100) / 100, y: Math.round(this.playerGrid.y * 100) / 100 });
  }

  update(time: number, delta: number): void {
    if (!this.avatar || this.pausedInput) return;
    if (this.interact && Phaser.Input.Keyboard.JustDown(this.interact)) this.tryInteract();
    let dx = 0, dy = 0;
    const up = this.cursor?.up.isDown || this.keys?.W.isDown;
    const down = this.cursor?.down.isDown || this.keys?.S.isDown;
    const left = this.cursor?.left.isDown || this.keys?.A.isDown;
    const right = this.cursor?.right.isDown || this.keys?.D.isDown;
    if (up) { dx -= 1; dy -= 1; }
    if (down) { dx += 1; dy += 1; }
    if (left) { dx -= 1; dy += 1; }
    if (right) { dx += 1; dy -= 1; }
    if (dx || dy) { this.waypoints = []; this.pending = null; }
    else if (this.waypoints.length) {
      const next = this.waypoints[0];
      dx = next.x - this.playerGrid.x;
      dy = next.y - this.playerGrid.y;
    }
    const magnitude = Math.hypot(dx, dy);
    if (magnitude) {
      const step = 3.7 * Math.min(delta, 50) / 1000;
      const distance = Math.min(step, magnitude);
      const moveX = dx / magnitude * distance, moveY = dy / magnitude * distance;
      const next = { x: this.playerGrid.x + moveX, y: this.playerGrid.y + moveY };
      if (canWalk(next)) this.playerGrid = next;
      else if (canWalk({ x: next.x, y: this.playerGrid.y })) this.playerGrid.x = next.x;
      else if (canWalk({ x: this.playerGrid.x, y: next.y })) this.playerGrid.y = next.y;
      else { this.waypoints = []; this.pending = null; }
      const screen = this.screen(this.playerGrid);
      this.avatar.setPosition(screen.x, screen.y);
      this.avatar.setDepth(screen.y + 5);
      if (this.waypoints.length &&
        Math.hypot(this.playerGrid.x-this.waypoints[0].x, this.playerGrid.y-this.waypoints[0].y) < .14) {
        this.playerGrid = this.waypoints.shift()!;
        if (!this.waypoints.length && this.pending) this.tryInteract();
      }
    }
    if (time - this.lastSync > 2500) { this.lastSync = time; this.syncPosition(); }
    const near = nearestLandmark(this.playerGrid, 2);
    this.hint?.setText(near
      ? (this.locale === "ar" ? "E للدخول: " : "E / Tap: ") + near.label[this.locale]
      : (this.locale === "ar" ? "مدينة معلش · WASD / لمس · E للتفاعل" : "Maalesh Town · WASD / Tap · E to interact"));
  }
}

export function createTownGame(
  parent: HTMLElement, locale: Locale, initial: GridPosition,
  callbacks: TownCallbacks, initialClock = 8 * 60,
) {
  const scene = new TownScene(locale, initial, callbacks);
  const game = new Phaser.Game({
    type: Phaser.AUTO, parent, width: Math.max(parent.clientWidth, 640),
    height: Math.max(parent.clientHeight, 380),
    backgroundColor: "#afc8ad",
    scale: { mode: Phaser.Scale.RESIZE, width: Math.max(parent.clientWidth, 640), height: Math.max(parent.clientHeight, 380) },
    scene,
    render: { antialias: true },
  });
  const onReady = () => scene.setClock(initialClock);
  game.events.once(Phaser.Core.Events.READY, onReady);
  return { game, scene };
}
