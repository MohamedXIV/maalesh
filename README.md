# maalesh. — معلش

**Unfortunately, you're hired.** 😅

Maalesh is a cheerful cozy comedy life sim that begins as a completely fictional job placement website. Apply for absurd work, actually play the minigames, explore a small oblique-3/4 village, visit your cozy room, or resign at absolutely any time without penalties.

> **This is a video game, not a job board.** No real applications, resumes, identity details or employment are involved.

## Technologies

- **Next.js 16 / React 19 / TypeScript** for fictional websites, fake mail and UI.
- **Phaser 4.2.1** for the village, apartment and in-world jobs.
- **InkJS 2.4** for authored branching NPC/HR dialogue, compiled before dev/build.
- **Local browser save** only; no backend, account registration, Gemini API or recurring costs.
- **English** and **Egyptian Arabic** from the initial prototype.

## Getting started

Requires Node.js 20.9+ and internet access for the first dependency installation.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The `predev` script compiles the authored English and Arabic Ink files into `public/ink`. `prebuild` performs the same action for production.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## What is playable in the current prototype

1. Create a **pretend account**, with no actual personal details.
2. Apply for **Needle Threading Associate** (React precision overlay) or **Paper Stabilization Officer** (in-world Phaser job).
3. Read absurdly apologetic acceptance and payment messages in fake mail.
4. Explore the small **oblique-3/4 village** with arrows/WASD or touch. Walk near a building and press **E**, or tap it.
5. Visit your cozy apartment, open a fake computer, rest, buy a **duck lamp** after earning 3 coins.
6. At the agency, have a short InkJS-powered HR conversation.
7. **Quit either job even mid-task**; no fine, blacklist, or loss of earned coins. Reapply whenever you like.

The in-world paper job is intentionally simple: pick up paper at storage, carry it to the desk, sit on it, hand over three requested sheets, and collect a paycheck. The starter room and village use geometric placeholder artwork. The chicken job and richer NPC schedules are **not implemented** yet.

**Prototype caveat:** this feature branch needs an npm install / typecheck / lint / browser smoke test in an environment with package registry access before merge. Repository file existence alone does not prove it builds or runs.

## Design docs and agent guidance

- [Design Bible](docs/spec/00-INDEX.md)
- [Game vision](docs/spec/01-GAME-VISION.md)
- [Jobs and minigames](docs/spec/03-JOBS-AND-MINIGAMES.md)
- [Technical architecture](docs/spec/05-TECHNICAL-ARCHITECTURE.md)
- [Milestone acceptance checks](docs/spec/08-MVP-ROADMAP.md)
- [Agent rules](AGENTS.md)

Some documents live on main while gameplay is built on a feature branch; merge and sync documentation before release.

## Project constraints

- Maalesh is a friendly independent employment **agency**, not the owner of all village businesses.
- **No mandatory work or economic survival pressure.**
- Playful situational writing, not a joke in every sentence.
- Ink stories emit only whitelisted intents; TypeScript owns job state, pay and persistence.
- Not every job uses character movement: overlays, UI puzzles and dedicated scenes are equally valid.
- Content stays extensible through game data and cohesive modules. No giant speculative plugin framework.

For the independent Gemini Web experiment, follow [the self-contained brief](docs/spec/09-GEMINI-BUILD-BRIEF.md) from main and **do not overwrite this implementation**.
