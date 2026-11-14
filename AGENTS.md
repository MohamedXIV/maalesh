# Maalesh — Agent guidelines

## Current direction update — 14 Nov 2026
**Read [docs/TOWN_LIFE_SIM_PIVOT.md](docs/TOWN_LIFE_SIM_PIVOT.md) first.** The user corrected the setting from 'small village' to **larger mixed town** (asphalt, streets, shops, suburbs, rural edge), asked to **test isometric**, and rejected a website/window-framed central game. **The primary product is a fullscreen spatial life sim; job websites and overlays are secondary in-world computer/workplace experiences.** Do not reintroduce an app-shell framing around Phaser.

The in-world home computer is a true evolving simulated OS/app environment with fake internet and a freelance-like platform, inspired by the user's away-message and orionos repositories. Keep its state/save/contracts independent from rendering; no copying those entire projects.

Optional dynamic AI content is a **BYOK, opt-in, online-only enhancement**. All core content works offline. User-owned keys are kept ephemeral, never logged or persisted, and server-proxied only on explicit generation. Remote output is validated flavor text, never authoritative gameplay state.

This overrides older references to a compact oblique village; consider the isometric view experimental until playtested. No game change should silently revert to the website-shell concept.

## Product identity
Maalesh (معلش) is a **cheerful, cozy, absurdist life sim**, not a misery, exploitation, or survival simulator. Maalesh is an employment agency connecting people to independently run town workplaces; it does not own every workplace. Jobs can be bizarre and low-paid as comedy, but the player should feel free and welcome.

- The player can **quit any job at any point**, including during a minigame, without penalties, guilt, reputation losses, or lost earned wages. Quitting is a valid and often funny choice. Reapplying may be allowed.
- Employment is only one part of life: the explorable open town, apartment, decoration, NPCs and leisure activities should stand on their own.
- Keep comedy situational and character-driven. Do not repeat internal design goals as player-facing slogans; avoid quips in every line.
- English first; Egyptian Arabic localization must recreate the joke, not mechanically translate puns. The brand remains **Maalesh**.
- The job portal, computer, email provider and all vacancies are explicitly **fictional**. Never request genuine resumes or impersonate real employers.

## Engineering principles
- Stack: Next.js App Router + React + TypeScript + Phaser 4, web-first and touch-friendly.
- React handles web portals, email, inventory and appropriate UI-based minigames. Phaser handles explorable spaces, visual gameplay and appropriate skill minigames.
- Do not force each job into one representation. Supported concepts include in-world interaction, overlay, UI/desk and dedicated scene. Let each new job choose the smallest suitable implementation.
- Keep job *content* and shared employment flow separate from job *implementation*. A new job should not require editing many unrelated systems.
- Prefer small, concrete interfaces over a speculative plugin engine. Keep code cohesive: neither monoliths nor excessive tiny files.
- Centralize tunable settings and shared rules. Avoid magic numbers scattered across scenes.
- Save locally first; no backend, authentication or monetization until a feature truly requires them.
- Maintain the project in playable increments, with a working vertical slice at each step.
- Don't add GitHub Actions or external services by default. Use branches and PRs for changes.
- Run typecheck, lint and build before declaring changes validated whenever dependencies are available.
