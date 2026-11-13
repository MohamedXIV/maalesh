# GEMINI WEB — BUILD BRIEF (SELF-CONTAINED)
# Maalesh / معلش — playable independent prototype
This is an **instruction brief for an AI coding assistant**, not a prompt for an AI writing a synopsis. Create a runnable/playable game experience from this specification. Read all sections before coding, then execute the smallest complete vertical slice. This file stands alone if you cannot access the GitHub repository.

## 0. Your mission and output
Create a **standalone experimental** web game called **maalesh.**: a charming and funny fictional job-placement portal leading into a 2D cozy village life sim where absurd jobs are minigames. The goal is a **real playable prototype**, not a static mockup or narrative pitch.

Use **Next.js + React + TypeScript + Phaser 4**. Add **InkJS** for at least one authored branching dialogue if practical, without blocking the core slice. Favor working gameplay and good UX over quantity of content. The experiment must remain isolated from the canonical project (no overwriting or force-pushing to the Maalesh main repo).

Where working in a code-capable environment, produce source code, a working dev command and a proof of running behavior. If your current interface cannot create or execute code, output a clean, copy-ready project file tree and complete implementation steps and be explicit about limitations.

## 1. Identity — do not get this wrong
- **Cheerful cozy comedy**, not grim, dystopian, cynical, depressing or punishment-heavy.
- **Maalesh** is a *human employment agency* connecting the player to independent local employers; it does not own every business.
- The recruiting website, applications, emails, employers and currency are entirely **fictional**. State this clearly. Never collect real CVs, passwords, credentials or sensitive info.
- The game **starts as a fake job board** and expands into an explorable, friendly 2D village.
- Perspective must be **oblique 3/4**. Do **NOT** use diamond isometric or a pure side-view platformer.
- Jobs have diverse gameplay formats: some in-world, some focused overlays, others React desk interfaces or dedicated scenes.
- The player can **QUIT ANY JOB ANY TIME, INCLUDING DURING A MINIGAME**, immediately, with **zero** penalty, no deduction, no negative reputation, no lost existing wages and no lockout. The HR agency warmly supports the decision.
- Work is optional. The village and apartment should still be enjoyable.
- English default; provide Egyptian Arabic (ar-EG) localization/RTL. Avoid literal translation of puns.
- No multiplayer, real email infrastructure, hard survival meters, eviction, grim poverty simulator, or a major conspiracy.

## 2. Player-facing tone and opening
Brand: **maalesh.**
Suggested tagline: **"Employment solutions. Unfortunately."**
Optional fictional-game label: "A cozy comedy game. No real jobs available."

The sign-up form should be *pretend* — a button or nickname, no real user authentication. Use the central pun:
- EN: "We don't usually take people into account. But we'll make an exception."
- AR: "إحنا أصلًا ما بنعملش حساب لحد. بس معلش، هنعملك حساب."

On applying for the first job, show a mock email:
Subject: **"Unfortunately, You're Hired."**
Body: "After careful consideration, we regret to inform you that your application has been successful. Your shift begins whenever you feel ready. Sorry about that."
AR subject: **"معلش، للأسف اتقبلت معانا"**.

After quitting, send:
"**You did the right thing! 96.65% of our clients quit within the first week. We have a better opening for you.**"
This 96.65% is intentionally silly fictional marketing copy, not real data.

Be funny through *events, visible behavior, characters and physics* as well as occasional writing. Do not make every line a joke, and do not paste declarations like "the world lives without you" into the game.

## 3. Screens and flow (make every button functional)
### Screen A: fictional recruitment portal
- Warm, distinctive, mobile-responsive visual identity.
- Mock profile creation. Job cards display name, independent employer, absurd task, fake pay and "Apply" button.
- At least **Needle Threading Associate** is actually playable; unimplemented jobs must be marked "Coming Soon".
- "Inbox" and "Enter Village" controls should work, not be ornamental.

### Screen B: fake email / computer
- A functional mock inbox with accepted, quit and shift payment messages.
- No external email service, login, contact collection or sending.
- Prefer React-based faux desktop UI inside the apartment, with job portal and inbox apps.
- Persist mock mails in local save.

### Screen C: village (Phaser 4)
- Small but welcoming walkable **oblique 3/4** space with 3–6 recognizable landmarks.
- At minimum show agency, home, garment workshop and an office/farm.
- Character movement with WASD/arrows and intuitive mobile tap-to-move.
- Interact with landmarks; opening a minigame or entering room preserves world state.
- Oblique layers/feet-based depth sorting, clear collisions or blocked areas.
- One optional non-work interaction such as sitting on a bench, petting a friendly animal or chatting with a neighbor.

### Screen D: starter home
- Small cozy room, not luxury or grim poverty.
- Interactable faux computer, bed or furniture.
- If feasible, let the player buy and place one inexpensive decorative item with fictional coins.
- Returning home should be something the player wants to do, not an obligatory penalty phase.

### Screen E: actual mini-games
**Required first job: Needle Threading Associate**, at the garment factory. This is a **focused overlay minigame**, not a full physical sewing machine. Player drags/moves the tip of colored thread through the needle eye; clear feedback; three successes finish a paid shift. Make targets forgiving on mobile. Keyboard accessibility is a plus.

**Strong second job if feasible: Paper Stabilization Officer**, at a municipal office. This is an **in-world** minigame: carry a stack of loose paper and sit on it to stop drafts, while NPCs occasionally ask for a sheet. Keep it physically funny and short. If this would destabilize the slice, make a small but complete in-world alternative and label limitations.

Other **idea cards**, not required implementations: rounding up chickens, standing in a queue for clients, manually opening a broken automatic door, sorting socks, stamping paperwork, umbrella holding, counting clouds.

## 4. Jobs, payments and quit
A job is accepted from the agency, performed at an employer worksite, paid after a short shift, and can be quit at any point. Only one active job is needed initially. Avoid forcing the user to finish a task to exit. A button marked **"I QUIT!"** should work even inside a precise overlay. Close/cancel without resigning may be a separate action.

A shift gets one stable ID. A completion may credit fictional coins **once only**. Quitting clears employment/shift and preserves previously earned balance; no reputation penalty. Player can reapply immediately and continue having fun.

## 5. Technology boundaries
- Next.js App Router / React: portal, fake desktop/mail, HUD, React overlays, locale and local save.
- Phaser 4: village world, player movement, world interactions, physics/slapstick and dedicated action minigames.
- InkJS: authored dialogue/choices, e.g. short conversation with the HR representative; compile Ink to JSON and safely route only approved effect tags. Narrative does not own currency or movement.
- Shared typed TypeScript state: jobs, coins, inventory, flags, event outcomes and save validation.
- Use browser localStorage with a schema version and safe recovery. No backend or account integration required.
- Dynamically load Phaser on client mount, clean it up on unmount, and avoid SSR crashes.
- Pause village movement input when dialog/overlay is open.
- No client-side Gemini API key. Game should run entirely with bundled content.
- Do not build a speculative plugin framework; keep new jobs as small cohesive content + gameplay modules.

## 6. Content authoring and localization
Include EN + idiomatic Egyptian Arabic localized UI/copy for the complete implemented loop, including RTL for the portal/mail. Adapt the joke, don't literally translate it. Character behavior may be funny without any text. Maalesh HR is cheerful and sincere, never a malicious villain.

**InkJS suggested first interaction:** HR greets the player; if already met, they remember; two choices: show jobs / enjoy the village. Game handles the resulting intents through a typed adapter. Narrative branching must never hide a mandatory exit.

Gemini API may help generate **draft candidate content offline**, not create unpredictable runtime core dialogue. If you use generation, review, validate, localize and bundle the accepted data. No quota assumptions. The playable game must not depend on a live model response.

## 7. Visual and interaction quality
- Think warm cartoon village, welcoming sunlight, flowers and playful signage.
- Oblique 3/4 buildings, readable character movement and distinct workplace silhouettes.
- Keep UI stylish but usable, no fake non-clickable buttons.
- Needles/paper/chickens should be visually clear. Avoid decorative backgrounds obscuring interaction.
- Responsive desktop and touch mobile; avoid tiny precision hotspots.
- Accessible visible quit; no mandatory timed inputs or long unskippable conversations.
- Some quiet pleasant interactions, not wall-to-wall punchlines.
- Do not copy proprietary sprites or screens from other games.

## 8. Build sequence
1. Scaffold Next.js/React/TS/Phaser 4 with reliable client-only Phaser boot.
2. Make fake profile, jobs, mail and durable local state.
3. Add a **walkable** oblique village.
4. Make Needle Threading genuinely interactive with immediate quit and one-time payout.
5. Wire village/worksite/back/home transitions; add at least one non-work interaction.
6. Add second contrasting job if time permits.
7. Add a small InkJS dialogue and EN/ar-EG localization of the end-to-end loop.
8. Polish layout, touch and empty/failure states. Test production build.
**Do not jump ahead to giant content catalogs before step 4 works.**

## 9. Final smoke tests you must perform
- No browser crash on first load; UI says fictional game.
- Pretend signup -> apply -> acceptance email -> village -> minigame -> reward.
- Can quit **while dragging the thread**: exit immediately, no penalty.
- Can reapply after quitting. HR sends the reassuring mail.
- Can wander freely while unemployed.
- Coins aren't paid twice after double click or save reload.
- Browser refresh restores profile, money and intended location/job status.
- Arabic UI text and direction work, and controls still respond.
- Touch works on narrow viewport; keyboard arrows/WASD work on desktop.
- No warnings about Phaser duplicate scene instances or missing game canvas after navigation.
- If optional InkJS/second job cannot be finished, report precisely what is real vs placeholder.

## 10. Deliverables
Provide the **playable code**, brief run instructions, any available local/demo URL you genuinely verified, a concise architecture map, and short notes on functionality and limits. If you cannot run code in this environment, state so; never pretend you tested it. Mark experimental branches or project copies distinct from canonical Maalesh.

## 11. Developer source / independent-track warning
Canonical project: https://github.com/MohamedXIV/maalesh
This is a second implementation for idea comparison and user experimentation. Do **not** rewrite, force-push to, or merge into the canonical main branch. The user will compare this experiment with a separate main implementation later.

## 12. Definition of success
Someone can click into the make-believe job site, be delighted by the absurd acceptance, walk around a cozy little village, genuinely play a miniature job, resign without consequences, receive a supportive email and then happily do something else. That is the heart of Maalesh.
