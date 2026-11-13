# Early architecture notes

- **src/app**: Next.js entry, metadata and global styles.
- **src/components**: React shell, fictional job board / inbox, village canvas host and overlay minigame.
- **src/game**: Phaser-specific scenes and browser game startup. Load only on the client.
- **src/lib**: shared typed content definitions, lightweight localization and versioned browser save.

## Jobs
A job has an ID, localized content, presentation mode, reward, place and availability. The shared flow handles hiring, resignation and payment. A job-specific component or scene owns its mechanics.

Four anticipated presentation modes:
1. `world` — acts within the explorable village/workplace
2. `overlay` — focused precision/puzzle game above the world
3. `interface` — React UI or pretend desktop work
4. `scene` — dedicated Phaser work area

These are descriptions, **not** four separate engines. Implement only what a playable job needs.

## Save boundaries
Prototype saves to localStorage with a schema version and validation. Data should include player progression, never transient pointer or modal state. Upgrade strategy and cloud sync can be designed when required.

## Phaser + React
Never instantiate Phaser during server rendering. Mount a game into a React-owned container; destroy it on unmount to avoid duplicate canvases in Strict Mode. Keep UI overlays in React. Avoid global mutable game singletons.

## UI and writing
In-game text must be understandable as comedy without deep Egyptian cultural knowledge. Egyptian Arabic can use original local jokes. Keep a friendly, lightly bureaucratic tone with variety, rather than making every control sarcastic.
