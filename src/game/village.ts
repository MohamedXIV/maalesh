import Phaser from "phaser";
import type { Locale } from "@/lib/content";

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 560;
const WALK_SPEED = 175;

class VillageScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private destination: { x: number; y: number } | null = null;

  constructor(private readonly locale: Locale) {
    super({ key: "MaaleshVillage" });
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#bbdbac");
    this.add.rectangle(480, 280, 960, 560, 0xbbdbac);

    // A tiny, intentionally geometric village proving the shared world scene.
    this.add.rectangle(480, 272, 960, 106, 0xe9d5ad);
    this.add.rectangle(482, 280, 116, 560, 0xe9d5ad);
    this.add.rectangle(480, 218, 960, 8, 0xd7bf93);
    this.add.rectangle(480, 325, 960, 8, 0xd7bf93);

    this.drawBuilding(222, 122, 184, 122, 0xffe3a7, 0xe9997b,
      this.locale === "ar" ? "مكتب معلش" : "MAALESH");
    this.drawBuilding(716, 116, 194, 126, 0xfff2d4, 0x9db2cf,
      this.locale === "ar" ? "البيت" : "YOUR HOME");
    this.drawBuilding(222, 428, 216, 136, 0xf5cec1, 0xa76f83,
      this.locale === "ar" ? "مصنع خيط وشركاه" : "THREAD & CO.");
    this.drawBuilding(718, 434, 208, 130, 0xf8e5ac, 0xd5a267,
      this.locale === "ar" ? "المزرعة" : "SUNNY FARM");

    for (let index = 0; index < 18; index += 1) {
      const x = 26 + (index * 137) % 902;
      const y = 26 + (index * 73) % 510;
      if (Math.abs(x - 480) < 84 || Math.abs(y - 272) < 82) continue;
      this.add.circle(x, y, 6, index % 2 === 0 ? 0xfdf8da : 0xf5a6ab);
      this.add.circle(x, y, 2, 0xdca66f);
    }

    this.add.ellipse(465, 286, 38, 14, 0x726f63, 0.18);
    const character = this.add.container(465, 273);
    character.add([
      this.add.ellipse(0, 15, 28, 10, 0x716858, 0.18),
      this.add.rectangle(0, 1, 24, 28, 0x5b8f9d),
      this.add.circle(0, -19, 14, 0xffd4a7),
      this.add.arc(0, -26, 15, 193, 347, false, 0x5b433b),
      this.add.circle(-5, -19, 1.7, 0x413d3b),
      this.add.circle(5, -19, 1.7, 0x413d3b),
    ]);
    this.player = character;

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.destination = { x: pointer.worldX, y: pointer.worldY };
    });
  }

  private drawBuilding(
    x: number, y: number, width: number, height: number,
    wallColor: number, roofColor: number, title: string,
  ): void {
    this.add.rectangle(x + 5, y + 9, width, height, 0x746452, 0.13);
    this.add.rectangle(x, y, width, height, wallColor).setStrokeStyle(3, 0xffffff, 0.65);
    this.add.rectangle(x, y - height / 2 + 13, width + 10, 35, roofColor);
    this.add.rectangle(x, y + 28, 36, 40, 0x8d7a73);
    this.add.rectangle(x - width / 3, y, 26, 25, 0xd1f2ed);
    this.add.rectangle(x + width / 3, y, 26, 25, 0xd1f2ed);
    this.add.text(x, y - 14, title, {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      fontStyle: "bold",
      color: "#35443c",
      backgroundColor: "#fffdf1",
      padding: { x: 8, y: 5 },
    }).setOrigin(0.5);
  }

  update(_time: number, delta: number): void {
    if (!this.player) return;
    let dx = 0;
    let dy = 0;

    if (this.cursors?.left.isDown || this.wasd?.A.isDown) dx -= 1;
    if (this.cursors?.right.isDown || this.wasd?.D.isDown) dx += 1;
    if (this.cursors?.up.isDown || this.wasd?.W.isDown) dy -= 1;
    if (this.cursors?.down.isDown || this.wasd?.S.isDown) dy += 1;

    if (dx !== 0 || dy !== 0) {
      this.destination = null;
    } else if (this.destination) {
      dx = this.destination.x - this.player.x;
      dy = this.destination.y - this.player.y;
      if (Math.hypot(dx, dy) < 5) {
        this.destination = null;
        return;
      }
    } else {
      return;
    }

    const distance = Math.hypot(dx, dy);
    const step = Math.min(distance, WALK_SPEED * Math.min(delta, 50) / 1000);
    this.player.x = Phaser.Math.Clamp(this.player.x + dx / distance * step, 25, WORLD_WIDTH - 25);
    this.player.y = Phaser.Math.Clamp(this.player.y + dy / distance * step, 30, WORLD_HEIGHT - 20);
  }
}

export function createVillageGame(parent: HTMLElement, locale: Locale): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: "#bbdbac",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: new VillageScene(locale),
    render: { antialias: true },
  });
}
