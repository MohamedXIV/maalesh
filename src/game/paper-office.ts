import Phaser from "phaser";
import type { Locale } from "@/lib/content";

const SIZE = { width: 960, height: 560 };
const SPEED = 185;
const PAPER_STORE = { x: 175, y: 379 };
const WORK_DESK = { x: 502, y: 326 };
const REQUEST_COUNT = 3;
const REACH = 85;

class PaperOfficeScene extends Phaser.Scene {
  private readonly locale: Locale;
  private readonly complete: () => void;
  private player?: Phaser.GameObjects.Container;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private actionKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private target: { x: number; y: number } | null = null;
  private carry = false;
  private seated = false;
  private requested = false;
  private sheets = 0;
  private finished = false;
  private prompt?: Phaser.GameObjects.Text;
  private status?: Phaser.GameObjects.Text;
  private papers?: Phaser.GameObjects.Container;

  constructor(locale: Locale, complete: () => void) {
    super({ key: "PaperOfficeScene" });
    this.locale = locale;
    this.complete = complete;
  }

  create(): void {
    const ar = this.locale === "ar";
    this.cameras.main.setBackgroundColor("#b4bdab");
    this.add.rectangle(480, 280, SIZE.width, SIZE.height, 0xece1c6);
    this.add.rectangle(480, 73, SIZE.width, 146, 0xe2d1b5);
    this.add.rectangle(480, 145, SIZE.width, 6, 0xab977b);
    for (let x = 0; x <= SIZE.width; x += 80) {
      this.add.line(x, 145, 0, 0, 0, 415, 0xd9cdb7, 0.38).setOrigin(0, 0);
    }

    this.add.rectangle(480, 65, 450, 90, 0xb7d6d3).setStrokeStyle(9, 0xa28f79);
    this.add.text(480, 65, ar ? "مكتب الملفات" : "PAPER CONTAINMENT DEPARTMENT", {
      color: "#365e59", fontSize: "20px", fontFamily: "Arial, sans-serif", fontStyle: "bold",
    }).setOrigin(0.5);

    this.add.rectangle(175, 400, 146, 135, 0xbe9a72).setStrokeStyle(4, 0x8b6e56);
    this.add.text(175, 459, ar ? "مخزن الورق" : "PAPER STORAGE", {
      color: "#4c4037", fontSize: "15px", fontStyle: "bold",
    }).setOrigin(0.5);
    for (let i = 0; i < 5; i++) {
      this.add.rectangle(173 + i * 4, 350 - i * 4, 90, 11, 0xfffdf3)
        .setStrokeStyle(1, 0xb4afa5);
    }
    this.add.rectangle(520, 319, 210, 100, 0xcda47d).setStrokeStyle(5, 0x906d55);
    this.add.rectangle(519, 277, 112, 18, 0xfffaf0).setStrokeStyle(2, 0xbeb9a9);
    this.add.text(510, 312, ar ? "مكتب رقم ١" : "DESK 01", {
      fontSize: "16px", color: "#6b503c", fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.circle(815, 306, 24, 0xf2cfa9).setStrokeStyle(3, 0xb49072);
    this.add.rectangle(815, 351, 55, 67, 0x779a97);
    this.add.text(818, 410, ar ? "الزميل" : "COLLEAGUE", { color: "#44655d", fontSize: "13px" }).setOrigin(0.5);
    // Moving fan blades and occasional paper wisps carry the slapstick.
    const fan = this.add.container(844, 164);
    fan.add([
      this.add.circle(0, 0, 30, 0xb7aaa0),
      this.add.rectangle(0, -28, 15, 70, 0xcad6d0),
      this.add.rectangle(0, 0, 70, 15, 0xcad6d0),
      this.add.circle(0, 0, 8, 0x64817d),
    ]);
    this.tweens.add({ targets: fan, angle: 360, duration: 2100, repeat: -1 });

    const player = this.add.container(290, 400);
    player.add([
      this.add.ellipse(0, 19, 37, 12, 0x66604d, 0.19),
      this.add.rectangle(0, 2, 26, 31, 0x548e94),
      this.add.circle(0, -23, 16, 0xffd7b0),
      this.add.arc(0, -29, 16, 190, 350, false, 0x705247),
      this.add.circle(-6, -22, 2, 0x3e4c49),
      this.add.circle(6, -22, 2, 0x3e4c49),
    ]);
    this.player = player;

    this.papers = this.add.container(0, 0);
    for (let i = 0; i < 4; i++) {
      const slip = this.add.rectangle(i * 4, -10 - i * 3, 36, 10, 0xfffcf2).setStrokeStyle(1, 0xc1b9a4);
      this.papers.add(slip);
    }
    this.papers.setVisible(false);
    this.prompt = this.add.text(480, 498, "", {
      color: "#365a54", fontFamily: "Arial, sans-serif", fontSize: "19px", fontStyle: "bold",
      backgroundColor: "#fefcf2", padding: { x: 18, y: 10 },
    }).setOrigin(0.5);
    this.status = this.add.text(28, 172, "", {
      color: "#365a54", fontFamily: "Arial, sans-serif", fontSize: "18px", fontStyle: "bold",
      backgroundColor: "#fff8e9", padding: { x: 12, y: 9 },
    });

    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key> | undefined;
    this.actionKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.seated || this.finished) {
        this.act();
        return;
      }
      this.target = { x: pointer.worldX, y: pointer.worldY };
      if (this.canAct()) {
        this.target = null;
        this.act();
      }
    });
    this.refreshLabels();

    this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: () => {
        if (this.finished || this.seated) return;
        const wisp = this.add.rectangle(620, Phaser.Math.Between(195, 410), 23, 14, 0xfffdf6);
        this.tweens.add({ targets: wisp, x: 45, angle: 35, alpha: 0, duration: 1750, onComplete: () => wisp.destroy() });
      },
    });
  }

  private near(point: { x: number; y: number }): boolean {
    return Boolean(this.player && Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y) < REACH);
  }

  private canAct(): boolean {
    if (this.finished) return false;
    if (this.seated) return this.requested;
    return this.near(this.carry ? WORK_DESK : PAPER_STORE);
  }

  private act(): void {
    if (!this.canAct()) return;
    if (this.seated) {
      this.requested = false;
      this.sheets += 1;
      this.refreshLabels();
      if (this.sheets >= REQUEST_COUNT) {
        this.finished = true;
        this.prompt?.setText(this.locale === "ar" ? "أنقذت الورق! 🥳" : "Paper saved. Somehow! 🥳");
        this.time.delayedCall(600, this.complete);
      } else {
        this.time.delayedCall(1300, () => {
          if (!this.finished) {
            this.requested = true;
            this.refreshLabels();
          }
        });
      }
      return;
    }
    if (!this.carry) {
      this.carry = true;
      this.papers?.setVisible(true);
    } else {
      this.carry = false;
      this.seated = true;
      this.player?.setPosition(WORK_DESK.x, WORK_DESK.y - 22);
      this.papers?.setVisible(false);
      this.time.delayedCall(1150, () => { this.requested = true; this.refreshLabels(); });
    }
    this.target = null;
    this.refreshLabels();
  }

  private refreshLabels(): void {
    const ar = this.locale === "ar";
    const status = ar ? "الورق اللي اتسلم" : "Sheets handed over";
    this.status?.setText(status + ": " + this.sheets + "/" + REQUEST_COUNT);
    this.prompt?.setText(
      this.finished ? (ar ? "عاش!" : "Nice work!") :
      this.seated
        ? (this.requested
            ? (ar ? "زميلك محتاج ورقة! اضغط E / Space أو المس الشاشة" : "Colleague needs a sheet — E / Space / Tap")
            : (ar ? "استنى طلب الزميل..." : "Waiting for another request..."))
        : this.carry
          ? (ar ? "روح المكتب واضغط E / Space عشان تقعد على الورق" : "Bring papers to the desk, then E / Space to sit")
          : (ar ? "قرب من المخزن واضغط E / Space" : "Approach paper storage and press E / Space")
    );
  }

  update(_time: number, delta: number): void {
    if (!this.player || this.finished) return;
    if ((this.actionKey && Phaser.Input.Keyboard.JustDown(this.actionKey)) ||
        (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey))) {
      this.act();
    }
    if (this.seated) return;
    let dx = 0, dy = 0;
    if (this.cursors?.left.isDown || this.wasd?.A.isDown) dx--;
    if (this.cursors?.right.isDown || this.wasd?.D.isDown) dx++;
    if (this.cursors?.up.isDown || this.wasd?.W.isDown) dy--;
    if (this.cursors?.down.isDown || this.wasd?.S.isDown) dy++;
    if (dx || dy) this.target = null;
    else if (this.target) {
      dx = this.target.x - this.player.x;
      dy = this.target.y - this.player.y;
      if (Math.hypot(dx, dy) < 7) { this.target = null; return; }
    }
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      const step = Math.min(length, SPEED * Math.min(delta, 50) / 1000);
      this.player.x = Phaser.Math.Clamp(this.player.x + dx / length * step, 28, SIZE.width - 28);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy / length * step, 190, SIZE.height - 55);
    }
    if (this.papers?.visible) {
      this.papers.setPosition(this.player.x + 20, this.player.y - 29);
    }
    // Reaching the tapped work spot automatically acts for touch users.
    if (this.target && this.canAct() && this.near(this.carry ? WORK_DESK : PAPER_STORE)) {
      this.act();
    }
  }
}

export function createPaperOfficeGame(parent: HTMLElement, locale: Locale, onComplete: () => void): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: SIZE.width,
    height: SIZE.height,
    backgroundColor: "#e5d9c5",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: new PaperOfficeScene(locale, onComplete),
    render: { antialias: true },
  });
}
