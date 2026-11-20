# Flat Isometric Town Expansion — Design Specification

Date: 2026-11-21
Status: Approved direction; implementation design for review
Base: `feat/town-life-sim-isometric` (draft PR #4)
Implementation branch: `feat/flat-isometric-town-expansion`

## Intent and why

Make Maalesh's existing fully playable isometric town moderately bigger, easier to read as a real connected town, and closer to the approved top-down-isometric reference images. The previous attractive Mediterranean panoramas were concept art rather than usable in-game camera views. The user approved the closer gameplay camera, a flat playable center, and perimeter hills/trees that hide the map's end rather than asking the player to climb hills.

This is one incremental playable-world change, not an overhaul of the game or replacement of working jobs, home, computer, saves, or interaction.

## Goals

1. Expand the 52×52 logical town to a proposed 72×72 grid: approximately 92% more tile area, while retaining a personable, small-town feel.
2. Establish a navigable flat core with discernible, connected central plaza, streets, commercial strip, residences, workshops, park and green fringe. Asphalt and side streets must connect naturally, with human-scale intersections, sidewalks and crossings.
3. Keep the top-down isometric camera and player-follow behavior the user explicitly approved; offer manual zoom in/out via mouse wheel and accessible on-screen controls for touch, optionally pinch if reliable.
4. No height changes in any walkable urban zone. Hills exist only in the non-playable surrounding scenic buffer with trees, to obscure the map limits. Combine art coverage and camera bounds so no visible void can appear at supported screen sizes and zoom levels.
5. Preserve all ten current landmarks, distinct interaction IDs, functional doors, existing jobs, simulated home computer, NPC conversations, time and local saves.
6. Move the rendering incrementally toward a culturally neutral, ordinary Mediterranean place: modest plaster/concrete apartments, mixed flat and tile roofs, balconies, storefronts and trees rather than an overt Egyptian or tourist-postcard stereotype.
7. Ensure character navigation, pointer-to-world routing, touch interaction, signage and roofs remain usable/readable at multiple zoom levels.

## Non-goals and anti-goals

- Not a 3D-engine conversion, rebuilt game architecture, or complete recreation of AI concept art.
- Not a full NPC life-simulation rewrite, traffic system, new jobs, or redesigned computer/OS.
- No dramatic elevation within the playable center, no roads over hills or walkable tiers.
- No empty decorative replacement for existing working destinations, no direct changes to `main`, and no automatic merge.
- No dependency installation or backend requirement just for the map expansion.

## Approaches considered

A. **Incrementally extend the current projected grid and Phaser scene (chosen).** Preserve existing game state and interaction structure; improve map geometry, scenic outer buffer, zoom and procedural/stylized props in independently testable stages. Less instantly photoreal than illustrations, but keeps a working game.

B. Replace existing town rendering and assets in a single large visual overhaul. Closer to concept art immediately, but would jeopardize navigation/interaction and delay a playable slice. Not chosen.

## Specific design decisions

- Proposed world size is 72×72 logical cells, retaining existing `GridPosition` coordinates, landmark IDs/doors and current saved town positions. Expansion is into additional surrounding districts, avoiding a save migration or surprise teleport. The playable city remains visually centered by layout rather than coordinate recentering.
- Keep `projectIso` / `unprojectIso` consistent inverses; grid remains the source of truth for movement/collision. New districts and roadway bands are deterministic, not random per reload.
- Define layout areas and style constants centrally; keep `townSurface(x, y)` deterministic and let walkability test explicit obstacles, including the non-playable perimeter. New secondary building shapes are scenic only until they have real interactions, and must not misleadingly display interactive door markers.
- Keep the flat street network entirely traversable; preserve all ten existing named destination doors and their route connectivity from `START_GRID`.
- Add a non-playable border/outer terrain band and decorative low hills/trees *outside* the valid walking region. The terrain rendering covers every pixel the camera could expose even at minimum zoom and extreme aspect ratios. Camera bounds are calculated from the projected town/scenic geometry rather than hardcoded for the previous 52×52 map.
- Set a moderate default zoom based on viewport, with a bounded manual zoom multiplier that is adjusted by wheel and touch controls; resizing must not unexpectedly reset the user's chosen zoom. Player-follow and interaction cursor world coordinates must remain correct after zoom.
- Improve roof/foreground visibility where practical without changing the camera angle; if a building obscures the avatar, fade its opaque roof or exterior while close.
- Use a small variety of reusable facade, roof, awning, balcony, vegetation, curb and crosswalk details. Aim for an actual legible game screenshot, not photoreal architecture.
- Keep all core gameplay playable offline; EN and Egyptian Arabic UI/control help remain coherent.

## Delivery stages

1. **Geometry and navigation:** 72×72 town layout, roads/sidewalks/plaza and reachable existing landmarks; pathfinding/blocked-perimeter tests.
2. **Camera and outer world:** scenic rim, dynamic camera bounds, stable responsive zoom, wheel/on-screen mobile controls; extreme-zoom/edge tests.
3. **Readable visual pass:** modest reusable Mediterranean-neutral building/road/tree details, clear entrances, roof occlusion behavior; browser playtest and regression verification.

Each stage must be independently testable, and the latest usable game should remain on the experimental branch. No merge without separate user request.

## Acceptance criteria

- Player starts in a fullscreen top-down isometric town and can traverse more than the earlier compact crossroads without a loading screen.
- All ten original landmarks are discoverable and their doors reachable by tap routing and keyboard movement.
- No walkable terrain elevation, no camera-visible void at tested minimum/maximum zoom and typical desktop/mobile aspect ratios, and no player path into scenic hills.
- Zoom wheel and visible touch buttons work, respect limits, keep focus on the character, and do not break tap-to-walk.
- Existing save coordinates, wallet, employment, interior transitions and fictional computer remain functional.
- The center reads as an everyday neutral Mediterranean town, not a rural postcard, while remaining performant and readable.
- Typecheck, unit tests, lint and production build pass; report any manual browser test gaps honestly.

## Open implementation discretion

The builder may decide exact painted/plaster colors, prop silhouettes, procedural detail density, and the final camera multiplier bounds after a responsive browser check. Preserve readability and performance over literal photo matching. Do not treat a concept illustration as a ready-to-use game map.
