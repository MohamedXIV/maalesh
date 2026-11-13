import Phaser from "phaser";
import type { Locale } from "@/lib/content";

export type VillageDestination = "agency" | "home" | "workshop" | "office";
export type VillagePosition = { x: number; y: number };
export interface VillageCallbacks {
  onVisit: (place: VillageDestination) => void;
  onPosition: (position: VillagePosition) => void;
}

const WORLD = { width: 960, height: 560 };
const SPEED = 175;
const INTERACTION_RADIUS = 85;
const PLACES: { id: VillageDestination; x: number; y: number; door: VillagePosition; color: number; roof: number }[] = [
  { id: "agency", x: 225, y: 112, door: { x: 225, y: 207 }, color: 0xffe0a2, roof: 0xe9a185 },
  { id: "home", x: 721, y: 112, door: { x: 721, y: 207 }, color: 0xfff4df, roof: 0x9dbaa9 },
  { id: "workshop", x: 225, y: 433, door: { x: 225, y: 349 }, color: 0xf5cbc1, roof: 0x9d889d },
  { id: "office", x: 721, y: 433, door: { x: 721, y: 349 }, color: 0xf4e7bc, roof: 0x9bafd0 },
];
const BUILDING_NAMES: Record<VillageDestination, { en: string; ar: string }> = {
  agency: { en: "MAALESH HR", ar: "مكتب معلش" },
  home: { en: "YOUR HOME", ar: "البيت" },
  workshop: { en: "THREAD & CO.", ar: "مصنع الملابس" },
  office: { en: "PAPER OFFICE", ar: "مكتب الأوراق" },
};

class VillageScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private interactKey?: Phaser.Input.Keyboard.Key;
  private destination: VillagePosition | null = null;
  private pendingVisit: VillageDestination | null = null;
  private prompt?: Phaser.GameObjects.Text;
  private lastSync = 0;

  constructor(
    private readonly locale: Locale,
    private readonly startingPosition: VillagePosition,
    private readonly callbacks: VillageCallbacks,
  ) {
    super({ key: "MaaleshVillage" });
  }

  private distance(pos: VillagePosition): number {
    return this.player
      ? Phaser.Math.Distance.Between(this.player.x, this.player.y, pos.x, pos.y)
      : Infinity;
  }

  private visitNearby(): boolean {
    const near = PLACES.find(place => this.distance(place.door) < INTERACTION_RADIUS);
    if (!near) return false;
    this.pendingVisit = null;
    this.destination = null;
    this.callbacks.onVisit(near.id);
    return true;
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#bbdbac");
    this.add.rectangle(480, 280, WORLD.width, WORLD.height, 0xb5d9a7);
    // Sunlit paths connect destinations; everything stays on one walkable map.
    this.add.rectangle(480, 271, 960, 107, 0xe9d6b4);
    this.add.rectangle(477, 280, 118, 560, 0xe9d6b4);
    this.add.rectangle(480, 217, 960, 8, 0xdcc29b);
    this.add.rectangle(480, 327, 960, 7, 0xdcc29b);
    for (let i = 0; i < 60; i++) {
      const x = 22 + (i * 149) % 930;
      const y = 22 + (i * 61) % 523;
      if (Math.abs(x - 480) < 76 || Math.abs(y - 272) < 78) continue;
      if (Math.abs(x - 225) < 118 || Math.abs(x - 721) < 118) continue;
      this.add.circle(x, y, 5, i % 2 ? 0xf8ecb2 : 0xeaa7aa);
      this.add.circle(x, y, 1.8, 0xe7a66e);
    }

    PLACES.forEach(place => {
      const south = place.y > 280;
      const w = place.id === "agency" ? 178 : 197;
      const h = 126;
      this.add.rectangle(place.x + 6, place.y + 8, w, h, 0x5f7057, .18);
      this.add.rectangle(place.x, place.y, w, h, place.color).setStrokeStyle(4, 0xfffbef, .9);
      // Wide trapezoid-like roof for a 3/4 oblique silhouette.
      this.add.triangle(place.x, place.y - h / 2 + 7, -w / 2 - 11, 13, w / 2 + 11, 13, 0, -30, place.roof);
      const faceY = south ? place.y - 42 : place.y + 34;
      this.add.rectangle(place.x, faceY, 31, 40, 0x8c7060);
      this.add.rectangle(place.x - 59, place.y, 32, 28, 0xb9d9dd);
      this.add.rectangle(place.x + 58, place.y, 32, 28, 0xb9d9dd);
      this.add.text(place.x, place.y - 7, BUILDING_NAMES[place.id][this.locale], {
        color: "#3d564e", backgroundColor: "#fffdf2",
        fontFamily: "Arial, sans-serif", fontSize: "15px", fontStyle: "bold",
        padding: { x: 10, y: 5 },
      }).setOrigin(.5);
      this.add.circle(place.door.x, place.door.y, 14, 0x75a796, .45)
        .setStrokeStyle(2, 0xffffff, .8);
    });

    // The little village bench gives unemployed players somewhere pleasant to be.
    this.add.rectangle(479, 237, 80, 16, 0xa87854);
    this.add.rectangle(448, 252, 8, 32, 0x9b6f50);
    this.add.rectangle(510, 252, 8, 32, 0x9b6f50);
    this.add.text(480, 194, this.locale === "ar" ? "قعدة حلوة" : "A NICE BENCH", {
      color: "#628472", fontSize: "13px", fontFamily: "Arial, sans-serif",
    }).setOrigin(.5);

    const avatar = this.add.container(this.startingPosition.x, this.startingPosition.y);
    avatar.add([
      this.add.ellipse(0, 17, 34, 12, 0x5a5e4c, .16),
      this.add.rectangle(0, 2, 26, 33, 0x5a8e9d),
      this.add.circle(0, -21, 15, 0xffd3a6),
      this.add.arc(0, -29, 15, 190, 350, false, 0x60483f),
      this.add.circle(-6, -20, 2, 0x3e4541),
      this.add.circle(6, -20, 2, 0x3e4541),
    ]);
    this.player = avatar;

    this.prompt = this.add.text(475, 523, "", {
      color: "#3c6056", fontFamily: "Arial, sans-serif", fontSize: "16px",
      backgroundColor: "#fffdf2", padding: { x: 13, y: 7 },
    }).setOrigin(.5);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.interactKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const point = { x: pointer.worldX, y: pointer.worldY };
      const place = PLACES.find(p => Math.abs(point.x - p.x) < 112 && Math.abs(point.y - p.y) < 82);
      if (place) {
        if (this.distance(place.door) < INTERACTION_RADIUS) this.visitNearby();
        else {
          this.pendingVisit = place.id;
          this.destination = { ...place.door };
        }
      } else {
        this.pendingVisit = null;
        this.destination = point;
      }
    });
    this.refreshPrompt();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.syncPosition());
  }

  private syncPosition(): void {
    if (!this.player) return;
    this.callbacks.onPosition({ x: Math.round(this.player.x), y: Math.round(this.player.y) });
  }

  private refreshPrompt(): void {
    const near = PLACES.find(p => this.distance(p.door) < INTERACTION_RADIUS);
    const label = near ? BUILDING_NAMES[near.id][this.locale] : null;
    this.prompt?.setText(
      label
        ? (this.locale === "ar" ? "E للدخول: " : "E / Tap to visit: ") + label
        : (this.locale === "ar" ? "اتمشى براحتك • WASD / لمس" : "Take a stroll • WASD / Tap"),
    );
  }

  update(time: number, delta: number): void {
    if (!this.player) return;
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) this.visitNearby();
    let dx = 0, dy = 0;
    if (this.cursors?.left.isDown || this.wasd?.A.isDown) dx--;
    if (this.cursors?.right.isDown || this.wasd?.D.isDown) dx++;
    if (this.cursors?.up.isDown || this.wasd?.W.isDown) dy--;
    if (this.cursors?.down.isDown || this.wasd?.S.isDown) dy++;
    if (dx || dy) {
      this.destination = null;
      this.pendingVisit = null;
    } else if (this.destination) {
      dx = this.destination.x - this.player.x;
      dy = this.destination.y - this.player.y;
      if (Math.hypot(dx, dy) < 5) {
        this.destination = null;
        if (this.pendingVisit && this.distance(PLACES.find(p => p.id === this.pendingVisit)!.door) < INTERACTION_RADIUS) {
          this.visitNearby();
        }
      }
    }
    const len = Math.hypot(dx, dy);
    if (len) {
      const step = Math.min(len, SPEED * Math.min(50, delta) / 1000);
      this.player.x = Phaser.Math.Clamp(this.player.x + dx / len * step, 25, WORLD.width - 25);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy / len * step, 27, WORLD.height - 25);
    }
    if (this.pendingVisit && PLACES.some(p => p.id === this.pendingVisit && this.distance(p.door) < 8)) this.visitNearby();
    if (time - this.lastSync > 1200) {
      this.lastSync = time;
      this.syncPosition();
    }
    this.refreshPrompt();
  }
}

export function createVillageGame(
  parent: HTMLElement,
  locale: Locale,
  initial: VillagePosition,
  callbacks: VillageCallbacks,
): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO, parent, width: WORLD.width, height: WORLD.height,
    backgroundColor: "#b5d9a7",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: new VillageScene(locale, initial, callbacks),
    render: { antialias: true },
  });
}
