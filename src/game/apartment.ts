import Phaser from "phaser";
import type { Locale } from "@/lib/content";

const SIZE = { width: 960, height: 560 };
const WALK_SPEED = 160;
const INTERACT_RADIUS = 87;
const INTERACTIONS = {
  computer: { x: 714, y: 323 },
  bed: { x: 253, y: 326 },
} as const;
type Interaction = keyof typeof INTERACTIONS;

class ApartmentScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private key?: Phaser.Input.Keyboard.Key;
  private target: { x: number; y: number } | null = null;
  private pending: Interaction | null = null;
  private hint?: Phaser.GameObjects.Text;

  constructor(
    private readonly locale: Locale,
    private readonly hasLamp: boolean,
    private readonly onInteract: (name: Interaction) => void,
  ) {
    super({ key: "MaaleshApartment" });
  }

  private near(point: { x: number; y: number }): boolean {
    return Boolean(this.player && Phaser.Math.Distance.Between(
      this.player.x, this.player.y, point.x, point.y,
    ) <= INTERACT_RADIUS);
  }

  private activate(name: Interaction): void {
    this.pending = null;
    this.target = null;
    this.onInteract(name);
  }

  create(): void {
    const ar = this.locale === "ar";
    this.cameras.main.setBackgroundColor("#e6cfb5");
    // Exposed front wall, warm floor and objects viewed from above / 3-4.
    this.add.rectangle(480, 280, 960, 560, 0xf0dfcb);
    this.add.rectangle(480, 78, 960, 156, 0xf3e8d7);
    this.add.rectangle(480, 158, 960, 11, 0xbca78e);
    this.add.rectangle(480, 355, 960, 389, 0xd2aa80);
    for (let x = 50; x < 960; x += 105) {
      this.add.line(x, 173, 0, 0, 0, 390, 0xbf9672, .24).setOrigin(0, 0);
    }
    this.add.rectangle(438, 390, 310, 160, 0xf3c6ac).setStrokeStyle(5, 0xe8ae96);
    this.add.rectangle(438, 385, 250, 104, 0xf6dfc4).setStrokeStyle(2, 0xe4c4aa);
    this.add.rectangle(457, 94, 197, 103, 0x9ccddd).setStrokeStyle(10, 0xfdfaf1);
    this.add.line(457, 94, -90, 0, 90, 0, 0xffffff, .8).setLineWidth(4);
    this.add.rectangle(457, 94, 9, 98, 0xf8f8e7);
    this.add.ellipse(457, 65, 90, 23, 0xfffae4, .4);
    this.add.rectangle(248, 332, 240, 122, 0x9d765e).setStrokeStyle(3, 0x76574c);
    this.add.rectangle(254, 317, 218, 113, 0xf0e4ce).setStrokeStyle(3, 0xbeb8a8);
    this.add.rectangle(254, 284, 196, 46, 0x8bafa8);
    this.add.rectangle(186, 286, 48, 27, 0xfff9f0);

    this.add.rectangle(740, 311, 200, 104, 0xb08560).setStrokeStyle(4, 0x8d6b51);
    this.add.rectangle(750, 267, 113, 85, 0x435f68).setStrokeStyle(6, 0x52666a);
    this.add.rectangle(750, 267, 91, 61, 0x9cd1b0);
    this.add.text(750, 267, "m.", {
      fontSize: "34px", fontStyle: "bold", color: "#326d61",
    }).setOrigin(0.5);
    this.add.rectangle(751, 317, 112, 13, 0xf3ead6);
    this.add.rectangle(739, 393, 78, 37, 0x97ac9f);
    this.add.circle(735, 372, 15, 0xd4e5c8);
    this.add.circle(107, 188, 39, 0x8ebea0);
    this.add.circle(101, 187, 28, 0x6eaa88);
    this.add.rectangle(107, 226, 35, 44, 0xb87c56);
    this.add.rectangle(107, 237, 45, 18, 0xc68f69);

    if (this.hasLamp) {
      this.add.circle(610, 194, 48, 0xffd47f, .17);
      this.add.rectangle(610, 230, 7, 58, 0xb6a17d);
      this.add.ellipse(610, 199, 63, 48, 0xffd79c);
      this.add.ellipse(608, 188, 28, 17, 0xf3e78c);
      this.add.circle(598, 196, 2.5, 0x5b6254);
      this.add.circle(618, 196, 2.5, 0x5b6254);
      this.add.ellipse(608, 207, 14, 6, 0xe39a63);
      this.add.text(610, 265, ar ? "أباجورة البطة!" : "THE DUCK LAMP", {
        fontSize: "13px", color: "#67583b", fontStyle: "bold",
      }).setOrigin(0.5);
    }
    const avatar = this.add.container(472, 445);
    avatar.add([
      this.add.ellipse(0, 17, 36, 12, 0x5f5144, .22),
      this.add.rectangle(0, 1, 29, 34, 0x648f9a),
      this.add.circle(0, -25, 16, 0xffd4a9),
      this.add.arc(0, -32, 16, 190, 347, false, 0x60483f),
      this.add.circle(-6, -24, 2, 0x3e4c49),
      this.add.circle(6, -24, 2, 0x3e4c49),
    ]);
    this.player = avatar;
    this.hint = this.add.text(475, 516, "", {
      color: "#365f58", fontSize: "17px", fontStyle: "bold", fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff9e9", padding: { x: 16, y: 8 },
    }).setOrigin(.5);

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.key = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const point = { x: pointer.worldX, y: pointer.worldY };
      const selected = Object.entries(INTERACTIONS).find(([, p]) =>
        Phaser.Math.Distance.Between(p.x, p.y, point.x, point.y) < 115,
      );
      if (selected) {
        const name = selected[0] as Interaction;
        if (this.near(INTERACTIONS[name])) this.activate(name);
        else { this.pending = name; this.target = { ...INTERACTIONS[name] }; }
      } else {
        this.pending = null;
        this.target = point;
      }
    });
    this.refreshHint();
  }

  private refreshHint(): void {
    const ar = this.locale === "ar";
    if (this.near(INTERACTIONS.computer)) {
      this.hint?.setText(ar ? "E: افتح الكمبيوتر" : "E: Open pretend computer");
    } else if (this.near(INTERACTIONS.bed)) {
      this.hint?.setText(ar ? "E: استريح شوية" : "E: Take a break");
    } else {
      this.hint?.setText(ar ? "اتحرك بالأسهم أو المس المكان" : "WASD / Arrows / Tap to walk");
    }
  }

  update(_time: number, delta: number): void {
    if (!this.player) return;
    if (this.key && Phaser.Input.Keyboard.JustDown(this.key)) {
      if (this.near(INTERACTIONS.computer)) this.activate("computer");
      else if (this.near(INTERACTIONS.bed)) this.activate("bed");
    }
    let dx = 0, dy = 0;
    if (this.cursors?.left.isDown || this.wasd?.A.isDown) dx--;
    if (this.cursors?.right.isDown || this.wasd?.D.isDown) dx++;
    if (this.cursors?.up.isDown || this.wasd?.W.isDown) dy--;
    if (this.cursors?.down.isDown || this.wasd?.S.isDown) dy++;
    if (dx || dy) {
      this.target = null;
      this.pending = null;
    } else if (this.target) {
      dx = this.target.x - this.player.x;
      dy = this.target.y - this.player.y;
      if (Math.hypot(dx, dy) < 6) {
        this.target = null;
        if (this.pending) this.activate(this.pending);
      }
    }
    const len = Math.hypot(dx, dy);
    if (len) {
      const speed = Math.min(len, WALK_SPEED * Math.min(50, delta) / 1000);
      this.player.x = Phaser.Math.Clamp(this.player.x + dx / len * speed, 35, SIZE.width - 35);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy / len * speed, 210, SIZE.height - 38);
    }
    if (this.pending && this.near(INTERACTIONS[this.pending])) this.activate(this.pending);
    this.refreshHint();
  }
}

export type ApartmentInteraction = "computer" | "bed";
export function createApartmentGame(
  parent: HTMLElement,
  locale: Locale,
  hasLamp: boolean,
  onInteract: (name: ApartmentInteraction) => void,
): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO, parent, width: SIZE.width, height: SIZE.height,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: new ApartmentScene(locale, hasLamp, onInteract),
    render: { antialias: true },
  });
}
