# Maalesh — current implementation roadmap

Read [Town Life Sim Pivot](TOWN_LIFE_SIM_PIVOT.md): this **supersedes** the old oblique/4-building village prototype assumption.

## Existing baseline (draft PRs #1 and #3)
- Fake Maalesh job board, local save, bilingual copy, Ink HR
- Needle threading overlay + Paper Stabilization Phaser worksite
- Home and duck lamp, supportive resignation, 9 passing employment tests

## Current experiment — fullscreen isometric town (stacked branch)
- 52x52 navigable logical map with roads/lane/park/rural edge; camera follow and tap navigation
- World interaction from walkable town to agency/home/workplace, with 4 basic NPCs
- Real-game HUD only; no always-on website/nav shell
- Retro home computer with windows/taskbar, fake browser, mail, notes, files, RubberDuck.exe
- Playable offline freelance invoice gig with one-time payout
- Opt-in Gemini BYOK town bulletin with authored offline content available by default
- Schema v3 migration, unit tests for geometry/computer/offline AI validity

## Required validation / next work
1. Build/typecheck/lint/tests + browser/mobile smoke tests of new branch.
2. Fix click navigation and building depth occlusion; better isometric art and true collision.
3. More city simulation: NPC paths, day cycle, opportunities to meet people, shops and persistent interior doors.
4. Refine computer processes/files/apps into independent simulation, not a skin.
5. Polish concrete jobs (paper and needle), then build one original satisfying new job.
6. Bring project docs and canonical PR chain together before any main merge.

## Keep postponed
Huge city, game economy punishment, mandatory rent, live AI dependency, multiplayer, auth/payments or fake services sending real email.
