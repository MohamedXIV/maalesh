# Maalesh — Town Life Sim Pivot (14 November 2026)

Status: **user-approved direction**, implemented incrementally. This document supersedes older *oblique village / website-with-canvas* assumptions in earlier docs; those were prototype interpretations, not final design commitments.

## 1. Corrected game premise

**Maalesh is a cheerful, open-town life simulation where ridiculous jobs are a delightful part of ordinary town life.** It is not a minigame portal wrapped in a Next.js website.

The player:
- inhabits the actual world as a resident, with freedom to explore/work/rest/socialize;
- walks between asphalt streets, side lanes, denser business blocks, apartment neighborhoods, parks and a semi-rural edge;
- uses proper establishments owned by people other than the Maalesh staffing agency;
- may have fun **without employment**;
- may quit any job at any time without punitive consequences;
- lives in a genuine spatial simulation with persistent place and basic clock, with richer daily routines added over time.

Keep the game visually bright and warmly humorous, not dark social commentary.

## 2. Spatial target and perspective

We will **test isometric 2D** (diamond projection) in the playable build. This is an experiment to evaluate feel and beauty before committing to final asset production.

- Render a navigable world, **not a small screenshot-size canvas** inside a card.
- Use one full-viewport Phaser world with a player-following camera.
- Define collision/navigation in logical world/grid coordinates, then project to isometric screen coordinates.
- Distinguish roads, alleys, courtyards, commercial blocks, residential spaces, parks and outer farms.
- Test occlusion/depth, movement mapping, touch navigation, zoom, camera tracking and memory/performance.
- Use placeholder vector art while comparing art styles. Do **not** claim placeholder buildings are final city art.
- Grow by neighborhoods/chunks; first slice need only be convincingly *larger than four buildings*.
- Interiors may have separate Phaser scenes while preserving exit/return positions.
- The town is a simulated place, not just a teleport menu with buildings painted on it.

**Known partial:** first isometric prototype uses a 52x52 logical tile area and simple color-coded surfaces. It is a navigation/design experiment, not a mature living city.

## 3. Game interface

Primary presentation: Phaser occupies the full screen. React should own:
- lean HUD, notifications, choices;
- specialized minigame overlays only when appropriate;
- actual computer OS, web UI and desktop apps **when the player uses a physical computer**.

No permanent giant job board, website navbar or sidebar obscuring the town. The agency exists as a place and conversation; working in a shop should begin from that shop, not from a remote global web button.

Pressing E / tapping a landmark visits a place. Keyboard and touch pathways should be equally real.

## 4. The computer is a game subsystem, not a decorative popup

Inspired by the **architectural boundaries** of the user's own repositories:
- https://github.com/MohamedXIV/away-message (OS software registry, faux InternetRouter, fake sites, generated-content schemas/cache)
- https://github.com/MohamedXIV/orionos (desktop/window management, virtual files/processes, network state, provider interfaces/validation)

We will not transplant those codebases wholesale or implement a complete real operating system. We do need a **believable simulated OS**, incrementally:
- desktop, windows, focus, move, minimize/restore/maximize/close, start menu and taskbar;
- first-class fake browser with multiple fictional sites and address/history;
- persistent faux files, notes, mock mail;
- strange small retro applications with **actions and state**, not disabled icons;
- a local freelance platform with real interactive remote micro-gigs;
- eventually installers, downloads, computer upgrades, virtual storage/RAM/network characteristics as gameplay warrants them.

**Local in-game Internet is fictional and can work offline.** Real connectivity matters only for optional external content generation. Avoid opening real internet domains in the faux browser by accident.

First OS slice: Voyager, Mailbox, Maalesh Jobs, OddJobs, My Computer, Notepad, RubberDuck.exe, AI Settings. This is not feature-complete computer simulation; resource management, real virtual file objects, executable installs and simulation of independent background processes come later.

## 5. Optional AI content: BYOK and offline baseline

The player is never required to bring an API key. All essential story, NPC interactions, minigames and fake websites must be authored or deterministically generated **offline**.

Optional provider-generated content only if:
1. the player's real browser is online;
2. the player enters **their own** API key (BYOK);
3. the player explicitly opts in;
4. the player requests the generation action, or later opts into a tightly bounded automatic mode.

Current first implementation supports optional Gemini-generated *fictional Town Bulletin* snippets. It must not alter world state, unlock jobs, invent persistent facts about NPCs or become required for any game progression.

**Key safety:**
- Keys remain in ephemeral browser memory and are cleared on reload. No localStorage, sessionStorage, game save, logs or client bundles.
- Keys are submitted over HTTPS to a bounded same-origin Next.js route **only when the player chooses Generate**.
- Server forwards to Google Gemini and returns validated, plain, length-bounded JSON text; no arbitrary model URLs and no remote HTML/JS.
- No built-in developer key. All requests are billed/rate-limited according to the user's own Google project. Never promise free unlimited usage.
- Input contains only safe fictional town context, no real personal details or private messages.
- A serverless in-memory limiter is only best effort, not a durable public abuse prevention system; revisit before wider publication.
- When offline, unavailable, out of quota or a key is missing, bundled content remains usable.
- Later provider adapters may support other models with the same contract and no use of live model text as simulation authority.

Do not mistake a real browser online status for an in-game service outage or vice versa. Their states are separate.

## 6. Jobs must be original, satisfying and absurd

Current two playable jobs: precision **Needle Threading** overlay and spatial **Paper Stabilization** work. Add a **freelance invoice sorting** micro-gig on the computer.

The 2026 viral literal-haystack-search trend reinforces a design lesson, not a feature request: **a preposterous premise with a clear satisfying physical interaction** can be surprisingly compelling. Do not clone another game's needle, haystack, visual assets or identical loop. Look for our own mechanics.

### Original job pitches to prototype (NOT commitments)
- **Official Shadow Repositioner**: a shop sign's shadow must align with chalk markers. Move lamps, umbrellas and props, then watch it drift. A gentle spatial puzzle with changing sunlight.
- **Municipal Pothole Portraitist**: decorate road potholes to look like harmless motifs before a publicity photo; choose which absurd shapes make pedestrians smile. Street-side precision painting, no stressful timer.
- **Complaint Envelope Untangler**: a desk is buried under color-coded apology letters addressed to the wrong recipients. Sort, stamp and correct them through a tactile overlay.
- **Department of Lost Buttons**: assemble unusual lost buttons into visually matching sets using texture, holes and color; each new garment provides different constraints. Precision matching, not haystack search.
- **Parking Line Cartographer**: repair faded absurdly crooked parking marks with a roller, then observe tiny cars attempt to use the spaces. Draw-and-test spatial minigame.
- **Official Bubble Counter**: monitor a soap factory machine making bubble clusters; tap them into bins of the right size before they drift together. Calm rhythm/physics, not twitch reflexes.
- **Freelance Document Misalignment Specialist**: fix crooked PDF-like pages on a simulated laptop screen, but each client provides a different definition of 'straight.'
- **Town Fountain Coin Auditor**: use a magnet and a sieve to sort wishes from coins, but the player chooses which objects are actually valuable. Different from a literal needle search.
- **Public Bench Warmth Inspector**: sit on benches throughout town, then rate their coziness. Neighborhood exploration + short amusing animation; no demanding minigame.

All proposed jobs must pass the **fun beyond the joke** test:
- Can the mechanic be understood in seconds?
- Does interaction have tactile feel, variation or an evolving consequence?
- Is it independently original enough to avoid being a reskin of a viral game?
- Does it fit a real employer and place in town?
- Does it play well with touch, mouse and appropriate accessibility alternatives?
- Can it be exited, including resignation, instantly without penalty?

## 7. Implementation and architecture roadmap

### Completed or experimental in the current feature branch
- Logical town grid with asphalt, side lanes, rural edge and isometric projection.
- Camera-follow fullscreen town prototype, basic collision/pathfinding and doorway interaction.
- Small repeat NPC barks/schedule positions (NOT complete NPC simulation).
- Home + paper office remain separate fullscreen gameplay scenes; needle overlay still focused.
- Save schema v3, preserving wallet/job status across previous versions.
- Faux operating system with a few real apps and basic multitasking.
- One playable freelance document-ordering gig; simulated money paid once.
- BYOK Gemini optional Town Bulletin, offline fallback authored posts.
- Automated unit tests for geometry, saving, work and optional generated-output validation.

### Next priorities
1. Validate lint, unit tests, Ink compile, TypeScript, production build and desktop/mobile browser gameplay.
2. Fix geometric/interaction polish: no stuck movement, correct roof occlusion, legible building interiors and scale.
3. Improve early-town atmosphere: sidewalks, crossroads, animated vehicles, NPC routes and meaningful non-work hangouts.
4. Refine home geometry and **real** worksite enter/exit semantics; store computer state as world simulation with file objects.
5. Expand a complete NPC/social routine before multiplying job cards.
6. Build one genuinely original job to test viral-friendly tactile gameplay.
7. Tighten resource limits and privacy before wider BYOK exposure.
8. Decide whether isometric wins after hands-on comparison to earlier oblique build.

### Explicit non-goals
No massive map today, real job applications, heavy rent and debt stress, multiplayer, real OS emulation, AI-generated authority over game economy, requirement to be online, or copying viral needle/haystack games.

## 8. Acceptance scenarios
- Player starts in a **fullscreen town** and moves without first joining a fake website.
- Buildings have real positions in a connected town; camera follows.
- Asphalt, side streets, park and countryside are visibly differentiated.
- Player can enter agency/home/work and return to same town position.
- Computer is reached from the home, and opens movable/minimizable apps and fake websites.
- Player completes invoice sorting for one wage exactly once; closes apps without penalties.
- Offline town bulletin remains readable without a key.
- Optional AI remains disabled on fresh install and never sends data automatically.
- Quitting mid-job preserves coins and keeps the same job open for reapplication.
- Existing v1/v2 save data migrates without lost wallet, email or employment.
- English / Egyptian Arabic don't break navigation or RTL UI.
