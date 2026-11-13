# Maalesh — Agent guidelines

## Product identity
Maalesh (معلش) is a **cheerful, cozy, absurdist life sim**, not a misery, exploitation, or survival simulator. Maalesh is an employment agency connecting people to independently run village workplaces; it does not own every workplace. Jobs can be bizarre and low-paid as comedy, but the player should feel free and welcome.

- The player can **quit any job at any point**, including during a minigame, without penalties, guilt, reputation losses, or lost earned wages. Quitting is a valid and often funny choice. Reapplying may be allowed.
- Employment is only one part of life: the small open village, apartment, decoration, NPCs and leisure activities should stand on their own.
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
