# maalesh. — معلش

**Unfortunately, you're hired.** 😂

**Maalesh is a cheerful, fullscreen town-life sim.** Walk through city blocks, asphalt roads, side streets and a rural edge; try strange jobs, resign any time, have a nice evening, or spend your salary on a duck lamp. The Maalesh agency is a fictional recruitment service connecting players with independently owned workplaces.

**This is a video game, not an actual employment service.** The jobs and websites are entirely fictional. No passwords or resumes required.

## Current prototype (experimental isometric branch)

- Start as a character in a **fullscreen Phaser 4 isometric town**; move WASD/arrows, tap destinations and press E near places.
- Distinct neighborhoods with asphalt, side streets and a rural/park edge; camera follows player.
- Walk to Maalesh recruitment agency to open HR's InkJS dialogue and apply.
- Try **Needle Threading** (overlay) or **Paper Stabilization** (workplace scene), quit freely without losing previous earnings.
- Explore a home, buy a duck lamp, and use its **retro computer**.
- On computer: real multitasking window shell, browser with fake local domains, mail, notepad, file explorer, RubberDuck.exe and **oddjobs.gig** freelance invoice-sorting contract.
- Offline fictional content works without any real internet or AI key.
- **Optional** Gemini content only if player opts in, adds their own key and explicitly requests a new small town bulletin. Key held in memory, not persisted. Provider calls pass through a bounded Next.js server route; quotas/charges depend on the player's own provider account.
- English & Egyptian Arabic and versioned local saves.

The art, scale, NPC routines and computer OS depth are **early prototypes**, not the final town. The isometric perspective is an experiment; compare after hands-on playtesting.

## Stack

Next.js 16, React 19, TypeScript, Phaser 4.2.1, InkJS, local save. No hosted database or actual account system.

## Local development

Requires Node.js 20.9+ and network for initial dependencies:

~~~bash
npm install
npm run dev
~~~

Build and tests:
~~~bash
npm run lint
npm test
npm run typecheck
npm run build
~~~

Ink source is compiled automatically before dev/build. Only one route, \`/\`, is needed: the town is the game.

## Source of truth

- [Town pivot and implementation boundaries](docs/TOWN_LIFE_SIM_PIVOT.md) — **most recent user-approved direction**
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Agent rules](AGENTS.md)
- Design Bible and Gemini Web independent prototype documents are available separately under the documentation PR; some earlier perspective/size details are superseded by the Town Pivot.

## Player freedom

No penalties or shame for quitting or being unemployed. Every job can use the best-fitting format (world, focused overlay, UI/desk, dedicated scene). Add features gradually and make sure they're actually fun to play.
