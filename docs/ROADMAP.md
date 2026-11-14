# Maalesh — living roadmap (implementation track)

The **full Design Bible** is maintained in `docs/spec` on main. Keep the playable build aligned with approved decisions.

## Milestone 0 — foundational slice (draft PR #1)
- Next.js / React / Phaser 4 bootstrap
- Fictional recruitment portal, first fake mail, English/Arabic
- Geometric village, needle threading overlay, local save
- Penalty-free resignation

## Milestone 1 — first complete day (stacked work)
- Real job transaction reducer with one-time payouts and v1->v2 save migration
- Two *genuinely interactive* modes: needle threading overlay; paper stabilization in-world
- Four-location walkable oblique-3/4 village with doors, movement and saved position
- Cozy apartment with fake computer and first duck-lamp decoration
- Short InkJS HR dialogue using authored/compiled Ink sources in both languages
- Domain regression tests for pay/quit/reapply/migration
- Mobile tapping and accessible exits

### Remaining before considering it validated
- npm install, compile Ink, lint, typecheck, test, production build
- Real browser walkthrough and mobile UX pass
- Verify that Phaser canvases mount/unmount reliably and door interactions feel natural
- Polish text tone, collision and gamepad/touch assistance if needed
- Replace only the most noticeable placeholder visual issues

## Next content milestones
- More expressive Paperweight Operator variants (fans, characters asking for specific sheets)
- NPC dialogue with persistent story memory and relationships
- A few named villagers, simple routines, cozy leisure gameplay
- Physical/interior workplace refinements
- Functional decoration placement and housing upgrades
- One chicken gathering job and another desk/overlay job

## Non-goals now
Live Gemini API at runtime, large city, multiplayer, production authentication, real job services, punishments for unemployment, heavy economic grinding.
