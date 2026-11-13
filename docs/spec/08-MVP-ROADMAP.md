# 08 — Incremental Roadmap, Independent Prototype & Acceptance Tests

## Delivery philosophy
Build a **thin, genuinely playable vertical slice**, evaluate whether it feels good, then expand. A small coherent experience is worth more than 100 placeholder job cards or an unused abstraction layer.

Two parallel tracks:
- **Canonical Maalesh:** planned main implementation by the project's developer and ChatGPT, with reviewable branches/PRs.
- **Gemini Web experiment:** independent implementation to test ideas and speed. It must not silently replace or merge into canonical Maalesh.

Both tracks use the **same design decisions**, but may differ in code quality, exact art and prototyping shortcuts. Treat them as experiments to compare, not as automatic source merges.

## Existing foundation status (2026-11-13)
- Public GitHub repository: https://github.com/MohamedXIV/maalesh
- main at this writing: initial README/gitignore only.
- **Draft PR #1**: Next.js/React/Phaser 4 scaffold, fake jobs/mail, EN/AR toggle, geometric walkable village, needle overlay, local save, quit path.
- This is a **prototype proposal**, not merged and not build-verified. Do not assume its systems are production-complete.

## Canonical milestones (proposed sequence)

### M0 — technical + tonal foundation
- Install and verify working Next/Phaser integration.
- Fictional recruiting portal with a pretend profile.
- Local save, English + Egyptian Arabic, first fake mail flow.
- One little world scene and one overlay minigame.
- Always-available quit without penalty.
**Done when:** a clean checkout builds and a player can apply, play, leave and reapply.

### M1 — first complete day
- Real apartment scene with fake computer and simple decoration.
- A completed **in-world** Paperweight Operator work loop.
- Small world-worksite movement and scene transition.
- InkJS used for an actual branching encounter with validated effects.
- Player returns home and buys/places one item.
**Done when:** a session flows through portal -> village -> work -> home -> fun outside work, not just job selection.

### M2 — first living block
- A recognizable village block with agency, home, office and textile workshop.
- A few recurring NPCs and basic time-dependent presence.
- One more job (e.g. chickens) with a different kind of action.
- One leisure interaction that doesn't require employment.
- Mobile touch UX and accessibility tested.
**Done when:** each location has a recognizable reason to revisit.

### M3+ — grow by content packs
Add jobs, new overlays, locations, recurring stories, furniture, fake websites, and relaxed activities after testing actual retention and comedy. Expand the village in blocks rather than promising a giant open world from day one.

## Gemini experiment recommended scope
Gemini Web should make a **polished, standalone browser prototype**, not attempt a full game in one pass. Include:
1. Fictional colorful Maalesh onboarding/job board.
2. Mock HR email for hire and quit with the key jokes.
3. Walkable **oblique 3/4** village block and at least three recognizable buildings.
4. A cozy starter room and an interactable faux computer.
5. **Needle-threading overlay** as one genuinely playable job.
6. **One contrasting in-world job**, ideally Paper Stabilization Officer (simple but interactive), if the environment supports it.
7. Local persistence and an unconditional quit action.
8. English-first with Egyptian Arabic mode (or bilingual copy for the entire loop).
9. InkJS-powered short HR interaction if feasible, compiled and tested.
10. A non-work interaction: sit on a bench, pet a neighbor's animal, or rearrange a lamp.

Do not substitute pure HTML mockups, decorative buttons or empty minigames for actual gameplay. If scope is constrained, deliver a **fully working single-job loop** over five unplayable job cards.

## How to judge both builds
The most important question: **Is it fun to play and inhabit?**

Proposed acceptance scenarios:

| ID | Scenario | Expected |
|---|---|---|
| T01 | Launch fresh game | Clearly fictional, cheerful, readable onboarding |
| T02 | Create pretend profile | No personal credentials needed; save persists |
| T03 | Apply to needle job | Hired promptly; mock HR acceptance mail shown |
| T04 | Enter village | Walk reliably with keyboard and tap-to-move |
| T05 | Begin overlay work | Thread input has readable target and feedback |
| T06 | Complete short shift | Pay exactly once; balance persists on reload |
| T07 | Quit mid-overlay | Immediate return, no coins deducted, no blacklist |
| T08 | Reapply after quitting | Job available again; HR sends support email |
| T09 | Enjoy village without job | Movement/non-work interaction always works |
| T10 | Switch locale | English and Egyptian Arabic readable; RTL sane |
| T11 | Close/reopen browser | Profile, wallet, job status and location recover |
| T12 | Open/close game repeatedly | No duplicate Phaser instances/listeners |
| T13 | Open on mobile | Touch controls/overlay usable without zoom traps |
| T14 | Trigger completion twice | Only one payout |
| T15 | Break AI connection | Full game remains playable offline from bundled content |
| T16 | Compare user-facing writing | No constant explanations of design intentions; jokes vary |

## Performance/quality gates
- npm install completes in standard networked environment.
- TypeScript check, lint and production build pass.
- No obvious console errors in normal loops.
- Stable position restoration when returning from overlays/interiors.
- No mandatory accounts, servers or Gemini API calls to play.
- No sensitive personal info entered or sent.
- Buttons labeled "play" actually play something.

## Scope and risk ledger
- **Content explosion:** many unique jobs each requiring new game code -> mitigate with distinct but reusable activity primitives, add a job only after playtesting one.
- **Art production cost:** open village + interiors -> start with small coherent neighborhood and placeholder art.
- **Ink narrative complexity:** branching trees becoming huge -> use small character scenes, reusable flags and short arcs.
- **Localization humor drift:** direct literal translations -> transcreate, review with native speaker.
- **AI text sameness:** repetitive slogans -> human editorial pass and nonverbal comedy.
- **Mobile difficulty:** precision/controls -> forgiving hit areas, fallback input.
- **Job fatigue:** repetitive grinding -> variety, short shifts, no work requirement.
- **Scope ambiguity:** "open village" taken to mean unlimited map -> one connected district first.

## Features to defer intentionally
Cloud account sync, payment processing, online job listings, actual email sending, live Gemini NPC dialogue, multiplayer, giant property markets, complex rent/eviction or survival systems, full-fledged city traffic sim.

## Handoff policy
When comparing Gemini Web and canonical builds, capture **screenshots, mechanics that worked, fun moments, confusing UX and technical lessons**. Reimplement ideas in the canonical architecture as needed; don't wholesale overwrite stable source with generated code.
