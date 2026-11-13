# maalesh. — معلش

**Unfortunately, you're hired.** 😅

Maalesh is a cheerful, fictional job-placement portal that leads into a cozy, absurdist village life sim. Get hired for ridiculous jobs, play their bite-sized minigames, decorate your little home, explore the village, or quit whenever you like. Maalesh will support your decision.

> This is a **video game**. The jobs, employers, applications and emails are fictional.

## Tech

- **Next.js 16 + React 19 + TypeScript** — fake job portal, mail, UI and overlays
- **Phaser 4** — explorable scenes and in-world gameplay
- **Local browser storage** — save the small prototype; no account or backend required
- **English first**, with initial Egyptian Arabic copy and right-to-left layout

## Run

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run typecheck
npm run lint
npm run build
```

## Foundation prototype

The starter slice includes a clearly fictional job portal, pretend sign-up, mock HR inbox, a Phaser village sandbox and a needle-threading overlay minigame. It is an **early prototype**, not the complete game. The other advertised jobs are placeholders, not fake playable features. Save data stays in your browser.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md). Agent conventions are in [AGENTS.md](AGENTS.md).

## Principle

**You can walk away from any job.** There is no punishment for quitting. The game must be enjoyable even when the player isn't working.
