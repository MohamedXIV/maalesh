# 02 — Village, Home, Routine and Progression

## Spatial concept (approved)
A compact **open, walkable village** seen in oblique 3/4. Outdoors should feel connected; this is not a collection of jobs in a selection menu. Small interiors can use independent Phaser scenes or room instances while preserving a coherent map and position.

### First neighborhood (proposed, not final map)
- Maalesh recruitment office with a comically earnest HR representative.
- Tiny starter room/apartment with bed, desk and fake computer.
- Thread & Co. garment workshop (needle threading, sock sorting, sewing station).
- Municipal filing office (Paper Stabilization Officer).
- Sunny Side Farm (chicken-gathering).
- Convenience shop for simple purchases and household items.
- Café/seating area for neighbor encounters.
- Small path/park/pond for optional leisure later.

A player should be able to walk between these in a short session. Buildings retain their real location and identity. If a job uses a popup overlay, the player still first visits or otherwise selects the authentic worksite; overlay gameplay should not erase the sense of place.

### ASCII conceptual geography (NOT a final map)
~~~text
 [FARM] -- lane -- [PARK / POND] ------- [CAFE]
    |                                  |
 [WORKSHOP] -- [VILLAGE SQUARE] -- [JOB AGENCY]
    |                                  |
 [GROCERY] ---- residential lane ---- [HOME]
~~~
The geometry is subject to production, navigation and readability testing.

## The apartment
The starter home is tiny but warm and interactable. Player can sleep/rest, use a fake desktop, purchase/rearrange small decorations, and return between jobs. A larger studio could be earned/unlocked later.

**Approved:** player has a room/home; cosmetics/upgrade potential; fake computer/internet; pleasant life outside work.

**Proposed implementation slices:**
- One-room interior with visible bed, table, chair, window and computer.
- One functional interaction: use computer to open React-powered faux web desktop.
- One simple furniture purchase/placement loop.
- Later: sleep/lighting, cosmetic customization, cooking, visitor interactions, studio upgrade.

Avoid building an advanced housing grid system at the start. Choose a handful of pre-authored placement slots or intuitive placement constrained by collisions, then test whether players need free placement.

## NPCs and connected stories
Start with few **distinct** NPCs, not 100 wandering placeholders. Use recurring names, jobs, preferences, short schedules and believable reactions.
- Maalesh HR agent: supportive, serious about nonsensical jobs; not secretly malicious.
- Garment foreperson: earnest and gently eccentric; the factory job remains silly.
- Farm owner: friendly; chickens are the actual source of chaos.
- Café employee: grounded conversational anchor.
- Neighbor: friendly familiar face, may offer leisure interactions.

These are proposed archetypes, not final named characters or personalities.

An NPC should have:
- Stable ID and role.
- Home/work or anchor points.
- Optional time blocks (work/rest/travel) where relevant.
- Dialogue through InkJS or small structured barks.
- Context flags exposed by the simulation, not duplicated authority.
- Memory of meaningful events **when funny/useful**, but no resignation punishments.

## Daily life and time
A time-of-day atmosphere can create warmth and schedule variety. **Do not make time another punishment system.** There need not be a strict 24h timer in early versions.

Suggested (proposed):
- Day/night visuals and occasional timed appearances after the first vertical slice.
- Job activities can run as short self-contained shifts without hard deadlines.
- An optional sleep/rest interaction advances time without forced performance.
- Shopkeepers may offer greetings at different times; don't deadlock essential services.

## Economy and progression
The economy exists primarily to afford charming choices: lamp, rug, plant, duck-shaped object, clothing, apartment improvement. Fictional salaries may be tiny for humor but progression should **feel generous enough to be fun**.

Hard rules:
- Quit causes no fines, no negative reputation or job locks.
- Previously earned rewards persist.
- Failing a minigame can be retried or abandoned without punitive debt.
- Unemployment is an equally valid play state.

Proposed:
- Coins earned for completed shifts/optional tasks.
- Optional decorative catalog or simple physical shop.
- New employers/new games unlocked by discovery, friendships or time, not only grinding.
- No rent at prototype stage; if later included, make it non-threatening and cosmetic, never eviction.

## Cross-system vignettes
These are examples of **showing** a connected world, not quest requirements:
- You spend the morning gathering chickens. Later, one is perched outside the municipal office.
- You resign from paperwork duty; the manager is seen buying ice cream, also relieved.
- You read a shop review online, later encounter its author by chance in the café.
- A neighbor comments on a ridiculous lamp you bought, not your employment status.

## Scope boundaries
A compact neighborhood, a small apartment and a few consistent schedules will outperform a giant empty map. The first playable slice can use geometric placeholder buildings. Full NPC schedules, pathfinding and elaborate furniture placement are separate milestones.

## World acceptance criteria
- Player can walk outdoors with keyboard and touch without confusing diagonal movement.
- Landmark locations are recognizable and linked to job descriptions.
- Transition from outdoor world to one workplace and home feels coherent.
- Returning from overlays restores world position and control.
- There is at least one pleasant activity or interaction outside work in the vertical slice.
