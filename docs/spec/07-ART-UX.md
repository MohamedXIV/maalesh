# 07 — Art Direction, Interface and Accessibility

## Visual decision
**Approved perspective: 2D oblique 3/4**, not diamond isometric.

This means buildings expose useful front and side/roof information while player movement is intuitive on a mostly top-down X/Y ground plane. Favor a warm, cozy, charming village whose everyday routines are a funny contrast to ridiculous work.

## Still open
Whether final assets use clean illustration, soft hand-painted, HD pixel art or regular pixel art remains **undecided**. The prototype may use consistent geometric placeholders and limited simple animation. Do not commit the whole asset pipeline before a small movement/interior test.

## Art principles
- **Warm, inviting and playful.** Never make the village desolate, gray, dystopian or threatening.
- Readable silhouettes for villagers and job objects; show interactions without long text.
- Buildings should express the location's use: a tiny HR office, cheerful textile workshop, cluttered municipal office, chicken farm, cute starter apartment.
- Layer props and architectural detail for personality, but preserve walkable clarity.
- Animation can carry the joke: paper flutter, chicken wobble, overly formal HR gestures, dropping a thread.
- Keep one visual language across world, overlays, apartment and fake internet (even though interfaces have their own visual style).
- Avoid unlicensed / copyrighted art from existing games; references are for mood only.

## Scene design for oblique 3/4
- Walkable ground uses natural directional movement; don't present an isometric diamond coordinate system.
- Player depth sort from feet/world-y.
- Use clear collision footprints; don't collide with roofs just because roofs are tall.
- For interiors, fade/obscure foreground walls that block the player.
- Camera follows smoothly without inducing motion sickness; allow modest zoom if needed.
- Background, NPCs, particles and interface need clear visual hierarchy.

## UI identity
The faux recruiting portal should initially be *credible as a fictional website* but with a few deliberate oddities. It is not a real job service.

Potential screens:
- **Landing/sign-up:** bright friendly brand "maalesh." and a clearly fictional tagline or small disclaimer. Signup joke around "taking people into account"; a pretend local profile, no real password/identifier.
- **Job Board:** readable cards, employer, wage, playful description, apply action, clearly indicate playable vs coming soon.
- **Fake mail:** application acceptance and resignation, and some normal village messages. Mail looks like a simple email client, not a real provider login.
- **Game HUD:** spare, compact; money, job status, interaction hints, pause/quit.
- **Apartment faux computer:** React windows/pages for mail, jobs and future furniture store.
- **Work overlay:** strongly foreground the task while still feeling located in a workplace; quit is always visible.

The brand "Maalesh" and Arabic "معلش" are both useful; never translate the proper name mechanically as "Sorry.com".

## UI components and implementation
React should own HTML-based job board, fake mail, inventory and form-like minigames. Phaser owns interactive map and relevant physics. For precision overlay minigames, prefer SVG/canvas/React pointer handling or Phaser based on gameplay, not ideology.

Do not over-customize basic buttons and dialogs if a maintainable component library already exists; no specific UI library is currently a binding decision for Maalesh.

## Layout and interaction targets (proposed)
- Main content width adapts to desktop/laptop/mobile; no horizontal page scroll.
- Touch-friendly primary controls at least ~44 CSS px tall, wherever feasible.
- Body text legible; avoid tiny pale typography as the only source of information.
- Show current objective close to gameplay; let it be dismissed when learned.
- Language toggle reachable from the portal and in-game settings.
- Keyboard and touch movement, with clear tap-to-move option for the village.
- Modal opening captures focus; returning closes it and restores focus and game input.
- Pause world movement while typing, threading or reading mail.
- Save indicator can be subtle; avoid blocking animation while saving.

## Accessible minigames
Needle threading requires precision, so:
- The actual hit area may be more generous than the rendered needle eye.
- Do not force pixel-perfect input.
- Support drag/touch pointer as default, and arrow/keyboard or optional accessibility assistance.
- Avoid mandatory rapid clicking, flashing effects, screen shake and extremely short reaction windows.
- Provide success/try-again cues in text and visual animation (not color only).
- Allow exit/quit at any time.
- Respect reduced motion where feasible.

## Tone references without direct imitation
Picture a nice small cartoon village, colorful employer signage, friendly residents and cozy furniture. What is funny is what they ask you to *do*, not that everybody is miserable. Resist copying art, distinctive game UI layouts or characters from named references.

## Experience check
- The landing screen makes the game premise understandable in ~10 seconds.
- Within a short session, the player can experience one funny, skill-based task.
- Returning home should be appealing, not an inconvenience between games.
- Quitting a shift should be straightforward, not hidden behind confirmation dialogs.
- Comedy feels playful in both en and Egyptian Arabic.
