# 03 — Jobs, Play Modes, Workflows and Resignation

## The employment cycle
Find a job -> read the absurd description -> apply instantly -> receive hilariously apologetic acceptance -> visit the relevant workplace -> start one or more shifts -> receive fictional wages -> leave, repeat or quit. The user can also just enjoy village life.

Maalesh mediates hiring. Each employer retains its own space, people and personality. A job listing does **not** imply Maalesh owns the workplace.

## Supported job presentation modes (approved)
1. **In-world:** walk and manipulate objects in a village/workplace (chickens, delivery, doors, paperwork).
2. **Focused overlay:** short precision or logic minigame that opens above the world (thread a needle, align objects, match fabric swatches).
3. **UI/desk:** primarily React interface work (sorting forms, stamps, scheduling, fake spreadsheets, phone call choices).
4. **Dedicated scene:** specialized Phaser work scene too complex for a tiny overlay but not necessarily a fully navigable interior (assembly line, shop counter).

A single job can optionally combine multiple modes. Never design an enormous framework that forces simple minigames to implement unused abstractions.

## Approved: unconditional resignation
The **Quit** action must always be available while a job is active, **including inside overlays**. If the player is mid-puzzle, the game exits immediately without penalties; no multi-minute animation or forced confirmation. The player is allowed to reapply or choose something else.

Example comedic optional lines (not mandatory exit gates):
- "You know what? Sit on your own papers."
- "Thread it yourself."
- Maalesh HR: "You did the right thing. 96.65% of our clients quit during week one. We've got another opening."

The agency's mail follows asynchronously **in game terms** (immediately or next inbox refresh), not a real background job.

## Proposed job specification
Each job should define:
- stable ID, employer ID, worksite ID, content localization IDs;
- play mode(s), implementation reference, complexity tag;
- eligibility: default open; any special prerequisites should be charming, not punitive;
- completion and payout rules, defined in game systems;
- start/complete/quit event hooks; optional Ink node IDs;
- retry and accessibility alternatives for precision tasks.

The central system owns employment state, saved rewards and transitions. Mechanics are owned locally by that job. Finishing a shift can pay **exactly once**; opening a UI or spamming a callback must not duplicate money.

## Concrete job concepts

### 1. Paper Stabilization Officer — in-world (approved example)
Employer: municipal filing office.
Core: carry stacks of loose paper from storage, sit on piles so fans don't scatter them, get up occasionally to hand sheets to colleagues.
Escalation options: ceiling fan, drafts through windows, visitors needing one sheet from the bottom. A shift is intentionally short. Avoid endless holding one button with no interesting tradeoff.
Quitting joke: step away, papers flutter everywhere; no financial damage or employer hostility toward the player.

### 2. Chicken Reconciliation Officer — in-world (approved example)
Employer: Sunny Side Farm.
Core: round up runaway chickens into the coop; chickens show varied but legible reactions.
Options: some follow you, some run, some perch; regroup without combat or violence.
End: funny chicken count and wage; no harsh failure timer.

### 3. Needle Threading Associate — focused overlay (approved example)
Employer: garment workshop.
Core: position a thread tip through a needle eye in a close-up overlay.
Input: mouse drag and touch drag; larger forgiving target or assist mode for accessibility.
Progression: three successful threads make one small paid shift. Variations: needle size, gentle fan movement, colored threads. Do not make the base task frustrating or require near-pixel-perfect clicks.
Comedy option: supervisor eventually produces an absurdly thick thread. Keep jokey extremes optional; not every shift needs escalation.
One task can be complete in under a minute; another job can last longer.

### 4. Queue Stand-In — in-world or desk interface (proposed)
Employer: errands agency. Core: stand in a slow moving queue for a client, preserve your place amid politely pushy NPCs; the client arrives at the funniest possible moment.
Accessibility: avoid a mechanically tedious real-time wait; compress time.

### 5. Automatic Door Assistant — in-world or dedicated scene (proposed)
Employer: a store with a broken automatic door. Core: open/close it by hand, interpret approaching visitors, avoid bumping anyone. The joke is the obviously unnecessary human job.

### 6. Executive Umbrella Holder — in-world (proposed)
Employer: a nervous manager. Core: keep a movable umbrella over the boss; the boss stops and turns unpredictably. Rain and slapstick, no misery.

### 7. Sock Pairing Technician — focused overlay (proposed)
Employer: the same garment workshop. Core: visually pair near-identical socks; occasional odd socks create gentle choices.

### 8. Stamp Alignment Auditor — UI/desk (proposed)
Employer: municipal office. Core: stamp forms within target boundaries while contradictory instructions arrive.

### 9. Puddle Inspector — in-world or overlay (proposed)
Employer: local council. Core: find, photograph or measure puddles, file a report about suspiciously dry areas. No real-world occupational claims.

### 10. Professional Cloud Counter — UI or in-world (proposed)
Employer: weather kiosk. Core: watch moving clouds, keep a count, make amusing judgement calls when clouds merge.

### 11. Cake Decorator — mixed mode (proposed)
Employer: bakery. Core: talk to customer in-world, open overlay for icing pattern, deliver finished order. Good test of job composition.

### 12. Shelf Alignment Specialist — focused overlay (proposed)
Employer: grocery. Core: align canned goods so their labels point forward while shoppers disturb the arrangement.

These are **ideas**, not a pledge to build every job. Favor a few that differ in interaction and reuse common systems.

## How a shift should feel (proposed)
- Clear objective in one short sentence, with a visible way to stop.
- Minimal tutorial; allow learning through action.
- Fun within the first 10–20 seconds.
- Some variation in subsequent shifts; no mandatory escalating grind.
- Reward and feedback are positive even if the job is absurd.
- Short shift targets such as 30 seconds to 3 minutes for overlays and 2–6 minutes for in-world activities are **playtest starting points**, not strict limits.

## Job lifecycle state sketch
~~~text
UNEMPLOYED
  -> apply -> HIRED (active job)
  -> start -> WORKING
WORKING -> complete -> HIRED + payout
WORKING -> quit -> UNEMPLOYED + friendly HR mail
HIRED   -> quit -> UNEMPLOYED + friendly HR mail
~~~
Quitting doesn't erase money already earned. Switching jobs may be implemented as resign + apply in a friendly two-step flow.

## Criteria for creating a new job
1. Is the core interaction enjoyable rather than a one-line pun?
2. Which of the four play modes is simplest?
3. Is the worksite a real part of the village?
4. Does the task work on mouse, touch and keyboard/accessible alternative where reasonable?
5. Can it be exited immediately?
6. Is there at least one variation or charming reaction?
7. Can the job be plugged in with localized copy and one cohesive module?
