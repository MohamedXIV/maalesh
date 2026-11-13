# Maalesh — Design & Implementation Bible
Version: 0.1 / 2026-11-13 / living reference
Status: APPROVED direction + explicitly identified proposals, not a claim of finished features.

## Read first
Maalesh (معلش) is a cheerful, cozy, single-player comedy life sim hiding behind a **fictional** job-placement portal. The player can find weird jobs, walk through a friendly open village, play different forms of minigames, decorate a home, meet neighbors, and resign whenever they want without consequences.

Core technology: **Next.js + React + TypeScript + Phaser 4**. Perspective: **oblique 3/4** (not isometric). Content/simulation logic is deterministic, modular and data-driven. **InkJS** is the narrative/conversation layer. Gemini is a **content-creation assistant** primarily used offline, not the authority controlling gameplay or a requirement to play.

## Documents
- [01 — Game vision and pillars](01-GAME-VISION.md): tone, rules, player loop, why the game is fun.
- [02 — World, home and villagers](02-WORLD-AND-LIFE.md): small open village, housing, NPC routines, progression.
- [03 — Jobs and minigames](03-JOBS-AND-MINIGAMES.md): employment lifecycle, presentation modes, job catalog, quitting.
- [04 — Writing, comedy and Ink](04-NARRATIVE-INK-I18N.md): characters, Ink integration, EN/Egyptian Arabic, sample copy.
- [05 — Technical architecture](05-TECHNICAL-ARCHITECTURE.md): responsibilities, state/save, job and narrative contracts.
- [06 — Gemini and content production](06-CONTENT-PIPELINE.md): prompts, validation, human review, costs/privacy.
- [07 — Art, UX and accessibility](07-ART-UX.md): oblique view, interface, control/readability targets.
- [08 — Delivery plan and acceptance tests](08-MVP-ROADMAP.md): thin slices, independent prototype, definition of done.
- [09 — Gemini Web build handoff](09-GEMINI-BUILD-BRIEF.md): **self-contained build brief** to paste into Gemini Web.

## Decisions (do not casually reinterpret)
1. Cheerful and playful, **not** bleak, dystopian, poverty-survival, punishing, grim workplace satire, or a gloomy anti-work manifesto.
2. The Maalesh agency connects applicants to **independently owned employers**; it does not own all village businesses.
3. The fake job board, mock sign-up, employers, email and internet are **unambiguously fictional**. Never solicit real resumes or credentials.
4. The village is intended to become **small, open and walkable**; outdoor travel belongs to gameplay. Interiors may load separately.
5. Visual perspective is **oblique 3/4**, with 2D art and readable directions; not a diamond isometric grid.
6. Not every job is physical or world-based: jobs can run in-world, as a focused overlay, as a UI/desk activity or in a separate scene.
7. **Unconditional, penalty-free resignation at any time** (including mid-shift). No fees, shame, bad reputation, blacklisting, lost previously earned wages, or forced wait.
8. Work is optional; the home, village and leisure should remain fun without a shift.
9. English-first with **Egyptian Arabic localization**. Recreate the joke for each culture rather than translating a pun literally.
10. Builds should remain incremental, playable, extensible and modest in scope. No speculative engine-within-an-engine.

## Scope vocabulary
- **Approved**: directly chosen during design conversations.
- **Proposed**: a useful design suggestion, subject to playtesting; never treat as canon.
- **Prototype**: scaffolding or a first implementation, not a shipped feature.

## Current repository caveat
At the time this brief was written, main contained only a tiny README and gitignore. A separate **draft PR #1** contains an experimental Next/Phaser foundation with job board, fake mail, geometric village and needle overlay. That prototype has **not been build-verified** and should not be conflated with fully implemented systems. This documentation is independently usable.

## For independent Gemini experiments
Start with [09-GEMINI-BUILD-BRIEF.md](09-GEMINI-BUILD-BRIEF.md) and use the other files to settle details. Build a **separate experiment**, not a rewrite of the canonical Maalesh project. Do not assume access to the GitHub repository; the build brief can stand alone.
