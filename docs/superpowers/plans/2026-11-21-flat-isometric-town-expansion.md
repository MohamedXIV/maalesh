# Flat Isometric Town Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Enlarge Maalesh's playable flat isometric town from 52×52 to 72×72, keep all existing places and saves playable, add scenic hill/treeline map borders, user-controlled zoom and a readable neutral-Mediterranean visual pass.

**Architecture:** Extend the existing deterministic logical grid without changing saved landmark positions. Keep navigation and camera-bound calculations in testable pure modules; let the existing Phaser scene project and draw the world. TownCanvas owns React-side mobile zoom buttons, while the scene owns its follow camera and wheel zoom.

**Tech Stack:** Existing Next.js 16, React 19, TypeScript 5.9, Phaser 4.2, Vitest 4; no new dependencies.

**Spec:** docs/superpowers/specs/2026-11-21-flat-isometric-town-expansion-design.md

## Global Constraints

- Keep top-down orthographic-style isometric view, not a street-level perspective or a website surrounding the game.
- TOWN_GRID is 72; all playable cells have elevation zero.
- Hills/trees belong only to non-walkable scenic perimeter beyond urban play.
- Preserve all 10 existing landmark IDs, door coordinates, START_GRID and saved townPosition coordinates without v4 migration.
- Preserve existing jobs, faux computer, BYOK isolation, English and Egyptian Arabic, touch controls, and offline baseline.
- No merge to main; work on feat/flat-isometric-town-expansion stacked on existing draft PR #4.
- Visual scene remains styled/generated, not a literal import of concept-art illustrations.

## Review Focus

1. A pre-existing v3 save at the old grid edge must recover to a walkable location rather than spawning in the new blocked border (Task 1).
2. Tap-to-walk on a decorative building or scenic hill must not route into a nonwalkable cell, and all original doors remain reachable (Tasks 1 and 4).
3. Very wide and tall screens at the minimum zoom must never reveal an unpainted void while the camera follows someone near the map edge (Task 2).
4. Mouse-wheel/zoom button changes, scene resizes, and language reinitialization must not silently break world-space pointer targets or reset an active manual zoom (Task 3).
5. Night overlay, modal-paused input, apartment exit, and NPC ordering/roof occlusion must still work after the scene grows (Tasks 3 and 4).

---

### Task 1: Expand deterministic town geometry and preserve saves

**Files:**
- Modify: src/game/town/town-model.ts
- Modify: src/game/town/town-model.test.ts
- Modify: src/lib/save.ts
- Modify: src/lib/save.test.ts (existing save tests, if present)

**Interfaces:**
- Retain projectIso(p: GridPosition): GridPosition, unprojectIso(p: GridPosition): GridPosition, townSurface(x: number, y: number): TownSurface, isBlocked(p: GridPosition): boolean, canWalk(p: GridPosition): boolean, findTownPath(from: GridPosition, to: GridPosition): GridPosition[].
- Export TOWN_GRID = 72 and TOWN_PERIMETER_MARGIN = 4.
- Add an explicitly flat town plaza surface and deterministic neighborhood road bands; no elevation coordinate or alternate movement model.

- [ ] **Step 1: Write failing tests** for TOWN_GRID = 72, new road blocks in the expanded area, exactly 10 unchanged original landmarks with walkable doors, shortest walkable routes from START_GRID to every door, and blocked x/y < 4 and > 67 scenic perimeter. Preserve the prior test cases for the agency, lanes, park and rural section.
- [ ] **Step 2: Run** npm test -- src/game/town/town-model.test.ts (expect new tests to fail on old 52×52 layout).
- [ ] **Step 3: Implement** centrally declared deterministic neighborhood geometry and surfaces in town-model.ts; keep all current landmark IDs and coordinates and ensure added streets connect to the old network. Prevent movement into the scenic perimeter and decoration obstacles only where intentionally collidable.
- [ ] **Step 4: Write failing save test** that parses a valid v3 save at a now-blocked edge coordinate, expecting fallback to START_GRID while preserving wallet, job and computer state.
- [ ] **Step 5: Update** parseSave's final town position handling to use canWalk after safe numeric parsing (do not bump save schema), then run npm test -- src/game/town/town-model.test.ts src/lib/save.test.ts (expect all passing).
- [ ] **Step 6: Commit** feat: expand walkable town geometry without save migration.

### Task 2: Scenic perimeter, viewport coverage, dynamic camera bounds

**Files:**
- Create: src/game/town/town-camera.ts
- Create: src/game/town/town-camera.test.ts
- Modify: src/game/town/town-scene.ts

**Interfaces:**
- Export type TownCameraRect = { x: number; y: number; width: number; height: number }.
- Export getTownRenderBounds(): TownCameraRect from town-camera.ts (world coordinates covering projected urban grid plus scenic buffer).
- Export getTownSafeCameraBounds(viewportWidth: number, viewportHeight: number, zoom: number): TownCameraRect or equivalent bounds helper; it must guarantee a viewport inside painted terrain when the followed player approaches any allowed edge.
- Export getTownZoom(base: number, userFactor: number): number (bounded zoom helper used by Task 3).

- [ ] **Step 1: Write failing tests** for nonempty render extents, a viewport containment invariant at 16:9 desktop, tall mobile and ultrawide layouts at the minimum supported zoom, plus finite bounds for tiny and huge valid viewports. Test the camera-safe rectangle corners against the render extent.
- [ ] **Step 2: Run** npm test -- src/game/town/town-camera.test.ts (expect fail before module exists).
- [ ] **Step 3: Implement** bounds derivation from TILE_W, TILE_H, TOWN_GRID and a visible scenic margin; keep all constants in one place. Favor a simple conservative camera inset/backing fill over complicated exact diamond-clamping math.
- [ ] **Step 4: Modify** TownScene.drawGround() and scenery drawing so the camera's entire legal viewport is painted. Add a nonwalkable tree/low-hill rim only outside the flat playable domain. Replace setBounds(0, 0, 4200, 2400) with derived bounds, updated on resize and zoom.
- [ ] **Step 5: Run** camera/model tests and manually inspect a scene with the player near each edge and several viewport shapes; no unpainted background or path beyond hills.
- [ ] **Step 6: Commit** feat: conceal town edges behind scenic perimeter and bounded camera.

### Task 3: Mouse and touch zoom while keeping navigation correct

**Files:**
- Modify: src/game/town/town-scene.ts
- Modify: src/components/town-canvas.tsx
- Modify: src/app/globals.css
- Modify: src/game/town/town-camera.test.ts

**Interfaces:**
- TownScene exposes public adjustZoom(direction: -1 | 1): void and public resetZoom(): void.
- Preserve TownScene.setClock() and setInputPaused().
- TownCanvas's internal scene controller includes adjustZoom and resetZoom; it can render town-zoom-controls without altering TownExperience's public props.
- Keep one userFactor in the scene, clamped in getTownZoom; resize preserves it.

- [ ] **Step 1: Write failing zoom tests** for lower/upper clamping, repeated wheel deltas and base zoom + user factor under resize; ensure zoom cannot create NaN or an invalid camera viewport.
- [ ] **Step 2: Run** npm test -- src/game/town/town-camera.test.ts (expect the new tests to fail).
- [ ] **Step 3: Implement** zoom bounds helper and TownScene.adjustZoom/resetZoom; recalculate camera safe bounds on zoom/resize, and leave player follow intact. Avoid a scroll-wheel handler that zooms the browser page.
- [ ] **Step 4: Wire** wheel zoom in scene and >=44px, accessible +/−/reset buttons into TownCanvas; add responsive CSS anchored away from HUD and modal overlays. Optional pinch zoom only if reliable without breaking touch-to-walk.
- [ ] **Step 5: Verify** manual zoom remains chosen through resize and pointer.worldX/worldY still routes to the expected grid tile. Validate play/pause and keyboard moves near scenery at both zoom extremes.
- [ ] **Step 6: Commit** feat: add controlled isometric zoom for desktop and touch.

### Task 4: Readable neutral-Mediterranean town visual pass and occlusion

**Files:**
- Create: src/game/town/town-decor.ts
- Create: src/game/town/town-decor.test.ts
- Modify: src/game/town/town-scene.ts
- Modify: src/app/globals.css only if needed for overlays

**Interfaces:**
- Export type TownDecoration = { kind: "tree" | "shrub" | "bench" | "awning" | "facade" | "lamp"; at: GridPosition; variant: number }.
- Export createTownDecorations(): readonly TownDecoration[]; deterministic from layout data, with no decoration blocking roads or named doors.
- Retain drawBuilding(place: TownLandmark) and visit interaction IDs. Scenic-only filler buildings have no glowing interaction doors.

- [ ] **Step 1: Write failing tests** for repeatable decoration output, correct bounds, empty paths near existing landmark doors, and no road-crossing obstruction.
- [ ] **Step 2: Run** npm test -- src/game/town/town-decor.test.ts (expect failure before module exists).
- [ ] **Step 3: Implement** modest reusable trees, benches, props and optional secondary facades with limited colors and geometry; iterate building window/roof/awning shapes and gray asphalt sidewalks so the layout reads as a real playable Mediterranean-neutral town.
- [ ] **Step 4: Add** player-near-building visibility rule for foreground roofs that would obscure the avatar, without making the landmark/entrance disappear.
- [ ] **Step 5: Verify** scene load/performance, readable entrances, player visibility behind buildings, and NPC sprites/depth at day and evening; run geometry/decor tests.
- [ ] **Step 6: Commit** feat: improve isometric town readability and building occlusion.

### Task 5: Full regression, documentation and draft PR handoff

**Files:**
- Modify: docs/TOWN_LIFE_SIM_PIVOT.md
- Modify: README.md if controls need documenting
- No changes to minigame/computer application logic unless a tested regression demands it

**Interfaces:**
- Preserve the existing public TownCanvasProps and TownCallbacks; no new gameplay service.
- Use the branch created from draft PR #4, and open a separate Draft PR targeted at feat/town-life-sim-isometric.

- [ ] **Step 1: Run** npm test (all tests must pass; report exact count).
- [ ] **Step 2: Run** npm run typecheck and npm run lint (exit 0, no errors).
- [ ] **Step 3: Run** npm run build, including Ink compilation (exit 0).
- [ ] **Step 4: Manual browser walk-through**: fresh save, legacy save, doors of agency/home/workshop/office, in-world computer, tap-to-walk, zoom +/−/wheel, resized desktop/touch viewport, near all edges, EN/AR, one quit-job scenario. State clearly if browser unavailable.
- [ ] **Step 5: Update** current pivot docs with changed layout, controls, flat-terrain/perimeter decisions, and verified limitations.
- [ ] **Step 6: Re-read** staged diff and tests, confirm no main merge or unrelated edits, commit the docs, and open a Draft PR with tested scope and limitations.

## Self-review

- Spec coverage: stages 1–4 cover size/layout, flat playable terrain, scenic hills and camera bounds, zoom, art, saves and interactions; Task 5 covers verification/PR.
- Existing scene APIs remain consistent; new helpers are pure and testable.
- No new dependencies or premature full 3D visual rework.
- Manual art/playability is not claimed by unit tests; browser checks are a separate explicit gate.
