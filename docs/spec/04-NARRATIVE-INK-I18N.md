# 04 — Writing, Humor, Dialogue, InkJS and Localization

## Narrative premise
There is no sinister mystery behind Maalesh, no secret employment conspiracy and no required main plot about defeating an evil corporation. The agency genuinely wants to find people *somewhere* to work; employers are independently operated, often slightly odd, and villagers can be kind, dry, exasperated or completely ordinary.

The story is built through **repeat encounters**: the same person at work, at a store, at a café, or unexpectedly attending another job. Small memory and situational comedy beat heavy exposition.

## Tone: what to write
- Warm, cheerful, dry, sometimes deadpan, occasionally slapstick.
- Deliver bureaucratic language **with a straight face** about harmless ridiculous tasks.
- Quiet moments have room to breathe; not every line should include a punchline.
- Avoid insults toward the player for being unemployed, failing, earning little or quitting.
- Avoid grim jokes about exploitation, homelessness, debt and real desperation.
- Avoid faux-deep slogans about living worlds, the player being unimportant, or rules being visible.
- English humor should make sense globally: concrete situations, timing, reversals and memorable NPC traits over obscure pop-culture references.
- Egyptian Arabic should be naturally Egyptian, not formal Arabic translated awkwardly. Adapt wordplay rather than forcibly mirroring the English.

## Maalesh as a voice
Their HR staff are polite, eager, sincere and slightly bizarre. Quitting is celebrated. Their word choice mixes standard recruiting language with unreasonably cheerful acceptance of resignation. Avoid making the agency a dark antagonist.

### Golden examples
English signup:
> We don't usually take people into account. But we'll make an exception for you.

Egyptian:
> إحنا أصلًا ما بنعملش حساب لحد. بس معلش، هنعملك حساب.

Acceptance subject:
> Unfortunately, You're Hired.

Acceptance email:
> After careful consideration, we regret to inform you that your application has been successful. Your first shift begins whenever you're ready. Sorry about that.

Resignation email:
> You did the right thing! 96.65% of our clients quit within the first week. We've found you something even better.

Egyptian resignation:
> أنت عملت الصح! 96.65% من عملائنا استقالوا في أول أسبوع. عندنا وظيفة أحسن هتعجبك.

These are samples, not boilerplate to repeat everywhere.

## Character archetypes (proposed)
- **Agency coordinator:** supportive, almost professionally incapable of making quitting feel bad.
- **Workshop foreperson:** takes needle work seriously because they genuinely love craft.
- **Farmer:** friendly, optimistic; chickens choose chaos.
- **Municipal clerk:** matter-of-fact even as papers whirl around the room.
- **Neighbor:** normal, affectionate, sometimes the funniest line is "oh, hey."
Give these names and nuances only after writing a few playable scenes.

## InkJS: agreed role
**Approved:** InkJS is the narrative/conversation framework. Use it for authored branching dialogue, interviews, HR conversations, recurring village events, employment conversations, optional choices and contextual barks where branching merits it.

**Not InkJS responsibilities:**
- wages and inventory math;
- physics, character movement, pathfinding or schedule simulation;
- authoritative employment state and save schema;
- API communication with Gemini;
- procedural world generation;
- freeform model text passed directly as script code.

Ink narrative is a **consumer of world facts** plus a **source of typed narrative intents**. Avoid two conflicting sources of truth.

## Suggested interaction contract
1. Simulation exposes a typed read-only context: current employer, shift count, conversation acquaintance level, recently resigned job ID, time bucket.
2. React/Phaser interaction starts an Ink story by stable story ID.
3. Ink runner generates current text, available choices, and optional tags/intents.
4. Player picks a choice; runner advances and returns structured intents.
5. Game validates and applies allowed intents (e.g. open job board, show email, set a harmless seen flag).
6. Save story state per ongoing story when needed; use stable external IDs.

Do not let arbitrary Ink story lines mutate coins or spawn uncontrolled jobs. Important game effects should be validated by TypeScript.

### Example of Ink (English source excerpt)
~~~ink
VAR met_hr_before = false

=== greeting ===
{met_hr_before:
    HR: Welcome back! How did the last job go?
- else:
    HR: Welcome to Maalesh! We don't usually make accounts for people.
}
~ met_hr_before = true
HR: But we can make an exception.

+ [Show me today's jobs.]
    HR: Excellent! One of them involves sitting down.
    # intent:open_job_board
    -> END
+ [Actually, I'll just take a walk.]
    HR: A fine career move.
    -> END
~~~
This illustrates separation: the tag is an intent *for the TypeScript adapter to parse and validate*. Do not assume any text after a colon is automatically a method call. Keep prose and effects distinct.

## Content packaging strategy (proposed)
- Author Ink sources in dedicated narrative modules organized by character/event, not one giant file.
- Compile Ink to JSON as a build/content step (rather than shipping a compiler into gameplay).
- Keep a locale-specific Ink asset when sentence order/branch structure needs transcreation.
- Cross-locale story IDs, effect tags and save-facing flags must remain stable.
- For small static mail, simple localized templates are okay; not every email needs Ink.
- Archive narrative schema/compiled-asset version with save migration if story structure changes.

## Localization system (approved language direction)
- English default locale: en.
- Egyptian Arabic locale: ar-EG (UI direction RTL).
- Write **localized adaptations**, especially for idioms: jokes should land, not map word-for-word.
- Proper brand name maalesh. is stable; local writing معلش is also supported.
- Some job titles may intentionally differ across locales if the comedic concept remains.
- Never concatenate word fragments to make translatable jokes.
- Track translation keys / story IDs independent of text.
- Support RTL at the document/panel level while keeping numeric forms, keyboard hints and email-like addresses readable.

## Humor review checklist
- Would this line still be funny if spoken sincerely by this character?
- Is this the same gag already in the previous three messages?
- Is the joke understandable without Egyptian cultural knowledge in EN?
- Is Arabic idiomatic rather than robotic?
- Is there a behavior or mechanic that could carry the gag instead of exposition?
- Does the joke avoid shaming the player for taking a break/quitting?
- Is it appropriate in context? A shop's quiet greeting needn't be a witty essay.

## Narrative testing
- Every Ink branch has a reachable endpoint.
- Choices don't deadlock mandatory progression or demand required employment.
- Tags/effects are whitelisted; unknown effects are logged and safely ignored.
- en and ar-EG stories retain matching key effects even if line counts differ.
- Save/reload mid-dialogue restores without repeating a payout.
- Quitting during any dialogue or overlay returns control safely.
