# 05 — Technical Architecture and Expandable Content Contracts

## Approved stack
- Next.js App Router and React (web application, fake portals, overlays).
- TypeScript strict mode across UI, game domain and Phaser integration.
- Phaser 4 for in-world real-time scenes, art, movement and certain minigames.
- InkJS for compiled authored branching narrative and choices.
- Browser-first, desktop and mobile; service worker/PWA is optional later.
- Local save first; backend accounts, cloud sync, realtime/multiplayer are **not** initial requirements.

Specific version bumps should be verified at implementation time; avoid hardcoding new external API claims into design.

## Responsibility boundaries

### React/Next.js
- Onboarding and fictional job applications.
- Faux desktop, job-board webpages, fake email and store/inventory UI.
- HUD, interaction prompts, modal overlays, locale switch, settings and accessibility options.
- Browser storage integration and route entry points.
- Optional server-only content tooling endpoint in dev/build contexts, not public gameplay by default.

### Phaser 4
- Village outdoor exploration with oblique 3/4 rendering and 2D movement.
- Workplace interactions and dedicated playable scenes.
- Light character animation, object movement, physics when needed.
- Camera, scene changes, world interactions and markers.

### Shared pure TypeScript domain
- Single authoritative game state and transactions: job lifecycle, wallet, inventory, quest/event flags and time state.
- Jobs as declarative metadata plus cohesive implementation modules.
- Event bus/typed callbacks between UI and scene — never a web of global mutation.
- Versioned save with migration/validation.
- Content localization lookup and safe narrative-effect reducer.

### InkJS
- Story progression and choices; compiled assets; controlled contextual intents.

### Optional Gemini (editor tooling)
- Batch offline candidate content generation, validation/review and translation drafts.
- Never a hard runtime dependency or client-side secret.

## Suggested modules (direction, not a mandated folder taxonomy)
~~~text
src/
  app/               # Next entry + layout
  components/        # React portals, fake desktop, HUD, overlays
  game/
    scenes/          # Phaser world, interiors, dedicated work scenes
    actors/          # player + NPC rendering/movement
    interactions/    # prompt & interaction adapters
  domain/
    jobs/            # state machines, registry, work modes
    economy/         # rewards, purchases, items
    world/           # positions, calendar and simple event flags
    narrative/       # Ink adapter, whitelisted effects
    save/            # schema, storage, migrations
  content/
    jobs/            # data and job-specific config
    characters/      # stable IDs / social profiles
    world/           # worksite landmarks, interactables
    locales/         # UI and job copy for en and ar-EG
    ink/             # source stories and compiled runtime JSON
  tools/             # optional AI-assisted draft generators, not shipped
~~~
Do **not** create dozens of empty files or micro-modules to match this diagram mechanically; evolve structure from real gameplay.

## Suggested domain types (illustrative)
~~~ts
type JobMode = "world" | "overlay" | "interface" | "scene";
type JobId = string;
type EmployerId = string;

type JobDefinition = {
  id: JobId;
  employerId: EmployerId;
  workplaceId: string;
  titleKey: string;
  descriptionKey: string;
  modes: readonly JobMode[];
  baseReward: number;
  playable: boolean;
};

type Employment =
  | { status: "unemployed" }
  | { status: "hired"; jobId: JobId }
  | { status: "working"; jobId: JobId; shiftId: string };

type JobOutcome =
  | { kind: "complete"; shiftId: string }
  | { kind: "quit"; reasonId?: string }
  | { kind: "cancel"; reasonId?: string };

type GameCommand =
  | { type: "job/apply"; jobId: JobId }
  | { type: "job/start"; jobId: JobId }
  | { type: "job/complete"; jobId: JobId; shiftId: string }
  | { type: "job/quit" }
  | { type: "world/teleportToInterior"; interiorId: string }
  | { type: "narrative/flag"; flagId: string };
~~~
These are *example contracts* for discussion. Choose an implementation that actually fits the codebase and avoids unnecessary ceremony.

## A clean job implementation
- Job metadata is data, not tangled conditionals in the job board component.
- A job implementation may be a React overlay component, a Phaser controller or a scene factory.
- Shared flow provides employment state, shift start, quit, reward event and Save API.
- The minigame receives only what it needs: initial settings, event callbacks, locale/accessibility options.
- The minigame does **not** directly mutate localStorage or player currency.
- The UI always has a global quit control while working.
- Special cases remain local to the job module, not global if/else chains across every screen.

## Concurrency and reward integrity
- Generate one stable shiftId on start.
- Complete shift only if jobId/shiftId match active shift.
- Record paid shift IDs or transaction IDs before applying payout (within one state transaction).
- A second completion event is a no-op.
- Quitting cancels the active shift and prevents late asynchronous completion from paying.
- No negative wallet changes on quitting.
- Persist state after accepted transactions; use safe recovery if storage is unavailable.

## React / Phaser lifecycle rules
- No Phaser imports that touch browser globals during SSR.
- Create Phaser instance after client mount; destroy and release listeners on unmount, including React Strict Mode.
- Phaser scene has an input focus strategy: stop movement keys while typing in fake mail or working in an overlay.
- On modal open, freeze/pause village input (and optionally simulation) without resetting player position.
- UI overlays use accessible HTML when possible; Phaser can render precise game elements as needed.
- Use devicePixelRatio-aware scalable canvas, with explicit virtual resolution and render scale.
- Return to the same scene/position after closing or quitting a job.

## World coordinates and oblique rendering
- Model movement in a conventional top-down X/Y plane, render environment as oblique 3/4.
- Use anchor points/feet for depth sort on Y, not center of tall buildings.
- Collision footprint and artwork silhouette are separate concerns.
- Make front walls/roof occlusion manageable; fade/remove walls when inside an interior.
- Do not use diamond-isometric transforms unless a separate decision explicitly changes the perspective.

## Save schema (proposed)
~~~ts
type PlayerSave = {
  schemaVersion: number;
  locale: "en" | "ar-EG";
  profile: { created: boolean };
  location: { mapId: string; x: number; y: number };
  economy: { coins: number; paidShiftIds: string[] };
  employment: Employment;
  furniture: { ownedIds: string[]; placements: Record<string, unknown> };
  worldFlags: Record<string, boolean>;
  knownNpcIds: string[];
  mail: { id: string; templateId: string; context: Record<string, string> }[];
  inkStates?: Record<string, string>;
};
~~~
Store only stable content IDs and serializable values. Never persist active Phaser objects/DOM pointers. Validate on load and migrate explicitly as features expand.

## Data content validation
- Stable ID uniqueness; every job references an existing workplace and employer.
- Every exposed localization key exists in both supported locales.
- Every listed playable job has a working implementation.
- Jobs marked coming soon do not offer a fake launch button.
- Rewards are valid non-negative amounts.
- Ink tags/intents are constrained to known effects.
- No production code relies on a Gemini API call to load content.
- Browser save tolerates storage denied/quota limits gracefully.

## Performance and testing
- Ship a small playable scene rather than heavy general simulation.
- Keep asset sizes in check, preload local worksite assets on demand.
- Unit tests: state transitions, quitting, idempotent pay, save validation, localization IDs and job registration.
- Integration tests: application -> mail -> village -> shift -> pay -> quit -> reapply.
- Manual desktop/mobile tests: focus, pointer capture, tap targets, memory leaks across repeated scene open/close.
- Never treat working source files as proof the build ran; check install, typecheck, lint and production build.

## Deliberately postponed
Realtime backend, multiplayer, cloud profile auth, full ECS/complex entity graphs, a giant plugin SDK, expensive server-generated dynamic dialogue, and a simulation that advances when the browser is completely closed.
