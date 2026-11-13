# 01 — Game Vision, Rules and Emotional Target

## One-sentence pitch
You apply for a ridiculous job on Maalesh, get hired suspiciously easily, discover why the agency apologized, and then enjoy an absurdly cheerful village life — working, quitting, decorating, socializing or doing absolutely nothing.

## Identity
- Working title: **maalesh. / معلش**
- Genre: **cozy comedic life simulation** + job minigame anthology within one connected world.
- Surface framing: **fake job-placement website**, a little strange but deliberately recognizable.
- Actual experience: **small open 2D village**, playable work and non-work activities, home progression, recurring characters.
- Target: **browser-first**, accessible on desktop and mobile; possible PWA later.
- Production reality: solo-developer-friendly; prioritize reusable systems and quality over map size.
- Languages: English first; Egyptian Arabic second from the start, not as an afterthought.

## The agency and its joke
Maalesh is an agency that places *people*, not money. Its staff are friendly and unexpectedly supportive of quitting. They connect the player with independently operated village employers. They are not a sinister corporation, and the game is not a trap. Their sincere enthusiasm conflicts with how absurd the listed jobs are.

Key brand beat:
- Arabic signup pun: "إحنا مش بنعمل حساب لحد... بس معلش، هنعملك حساب."
- English transcreation: "We don't usually take people into account. But we'll make an exception."
- English acceptance subject: "Unfortunately, You're Hired."
- Arabic acceptance: "معلش، للأسف اتقبلت معانا."
- After resigning: "You did the right thing! 96.65% of our clients quit within the first week. We have something better for you."

The percentage is **a fictional agency gag**, not a real-world statistic. Its exact 96.65% is intentionally overprecise.

## Emotional target
The player should feel:
1. Curious about which silly job to try.
2. Physically entertained by approachable, varied activities.
3. Comfortable wandering a nice village even when unemployed.
4. Amused by subtle bureaucratic absurdity and recurring characters.
5. Safe to experiment, take a break, leave a task or quit at any point.
6. Motivated by affection for home, neighbors, novelty and collectibles — **not** fear of bankruptcy or failure.

## Design pillars
### A. Freedom without punishment (approved)
Player may resign instantly in an office, at a farm, or within a minigame overlay. A silly exit animation or optional dialogue is fine, but may not prevent or delay the exit. A shift may be stopped with no paid reward for uncompleted optional work if its pay wasn't earned yet, but **never deduct existing currency**. Do not punish the player in employment eligibility or NPC relationship for resigning.

### B. The village is more than a menu (approved)
A physical neighborhood connects homes, employers, friends and errands. Jobs occur in places the player can revisit as a neighbor or customer. A chicken from a farm can later cause trouble outside the filing office; same NPCs recur throughout the day.

### C. Job mechanics fit the joke (approved)
Some jobs use movement; others use a precise overlay, form/desk puzzle or a specialized scene. A job can chain formats, e.g. take a cake order in-world, decorate it as an overlay, hand it over in-world. No demand that everything be a simulation with full character movement.

### D. Playfulness, not constant punchlines (approved)
A straightforward shopkeeper, a pleasant afternoon and a quietly silly bird are as valuable as a joke. The game should **show** the comedy via behaviors, props, timing, animations, player choice and consequences, not announce design principles to the player.

### E. Expandable without bloat (approved)
New jobs, scenes, NPC conversations, mail templates, objects and village blocks should be added as cohesive modules and data. Maintain a complete small game before scaling.

## Suggested player journey (proposed)
1. Arrive at a clearly fictional Maalesh recruiting portal.
2. Create a local **pretend** profile (no real identity or password).
3. Browse intriguing, genuinely absurd job ads.
4. Apply; receive a mock rejection-style acceptance email.
5. Enter the village, visit a worksite and try a brief shift.
6. Collect playful wages; optionally buy a small home item.
7. Quit whenever bored; get a warmly supportive HR response.
8. Walk home, interact with apartment items or meet a neighbor.
9. Return because there are more funny possibilities, not because of a mandatory daily checklist.

## Important non-goals
- No real job submissions, authentication masquerading as actual employers, or collecting CVs.
- No hard survival meters, eviction threat, punishing rent, debt traps, stamina grind or required daily attendance.
- No creepy conspiracy revealing Maalesh was evil.
- No multiplayer, procedurally generated giant city, or unlimited generative NPC chat as a launch dependency.
- No insistence that every NPC or mail must contain a joke.

## What makes a feature belong?
Ask: Does it increase playful agency, create an amusing *interaction*, or make village life more charming? If it only adds a stat, a mandatory chore or a novelty sentence without gameplay, defer it.

## Open decisions
Art production style (pixel, HD pixel, vector-painted or hand-painted), final village size, NPC count, optional fishing/cooking, exact time model, currency pacing, housing upgrades and whether employers have complicated social systems. These are **open**, not approved facts.
