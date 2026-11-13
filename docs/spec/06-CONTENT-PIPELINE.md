# 06 — Gemini-Assisted Content Pipeline

## Why use Gemini?
To help author the *volume* and *variety* of Maalesh content: humorous job ads, brief emails, NPC dialogue drafts, employer reviews, furniture descriptions, fake website snippets and localized alternatives. Gemini is a collaborator, **not the game director**, not the trusted source of game state and not necessary to run the game.

## Strategy decisions
**Approved direction:** Gemini API can be used with a free tier where available; quota and model availability are variable and must be checked at time of use.

**Preferred mode:** offline/batch content authoring that produces reviewable files. Content ships with the game. This avoids quota exhaustion, unpredictable jokes, latency, API costs and internet dependence.

**Possible future mode:** optional runtime generation for peripheral flavor content only (faux town news or harmless emails), with deterministic prewritten fallback. Do not put narrative progression or gameplay completion behind it.

## Roles in the workflow
1. **Designer:** define a mechanic, job location, player interaction and tone constraints.
2. **Generator:** propose candidate data or Ink/dialogue in structured form.
3. **Schema validator:** reject malformed IDs, missing fields, unsupported modes, missing locales or unexpectedly long text.
4. **Editorial review:** retain the funny, playable and culturally sensible ideas; cut repetitive gags.
5. **Integration:** approved entries commit as game content; compare gameplay in both languages.
6. **Playtest:** ensure humor happens in play, not just a clever description.

## Great candidates for generation
- Listing title + absurd description + fake qualification bullet points.
- Three variants of a Maalesh email for acceptance, resignation and rehire.
- Short employer feedback, grounded in the player's actual action.
- Context-specific NPC barks: before first meeting, after a job, while at a café.
- Flavor product catalog for household items and their shop descriptions.
- Egyptian Arabic *transcreation* of an English joke, and reverse alternatives.

## Poor candidates
- Auto-implementing entire distinct minigame mechanics without design review.
- Generating whole uncontrolled quest graphs or economy parameters live.
- Runtime unmoderated conversation impersonating real employers.
- Pushing generated text to players without human review.
- Inventing exact fake world facts inconsistent with the content bible.
- Producing long repetitive UI narration about "a world that lives without you."

## Output schemas (illustrative)
A candidate batch should be small, tagged with model/prompt version and include source locale. Example:
~~~json
{
  "contentType": "job_listing",
  "candidateId": "cloud_counter_01",
  "employerId": "weather_kiosk",
  "modeSuggestion": "interface",
  "mechanic": "Track passing clouds and decide how to count overlapping shapes",
  "copy": {
    "en": {
      "title": "Cloud Counting Assistant",
      "description": "Count passing clouds. Briefly explain why one became two."
    },
    "ar-EG": {
      "title": "مساعد عدّ السحاب",
      "description": "عدّ السحاب اللي بيعدّي. وفسّر ليه السحابة دي بقت اتنين."
    }
  },
  "reviewStatus": "draft"
}
~~~
The generator **suggests** a mechanic. A programmer/design review decides how it actually works and whether it's fun.

## Prompt requirements
Always include:
- Maalesh identity: cheerful cozy comedy, fictional hiring, gently absurd jobs.
- Maalesh agency is friendly and independent from the businesses.
- English-first, international clarity; Egyptian Arabic adaptation for local release.
- No dark/depressing exploitation or financial survival horror.
- No insults or punishment for quitting; no shame in doing nothing.
- Situational, concise humor; do not flood every line with jokes.
- Small, observable mechanical premise, not merely a quirky title.
- Output strict requested schema; stable IDs; no real individuals or real employer impersonation.
- Avoid repetitive comedic patterns and stale AI phrases.
- Offer several **meaningfully different** concepts, not paraphrases.

## Ready-to-use authoring prompt
> You are an editorial assistant for a fictional cozy comedy life sim called Maalesh (معلش). Its fake employment agency accepts everyone, is sincerely supportive when workers quit, and places players with independent village businesses. The game has a warm open oblique-3/4 village, home decoration and short interactive minigames. Never make it bleak, cruel, punishing, darkly corporate or mean to unemployed players. Propose 8 NEW weird job concepts covering in-world, focused overlay, UI/desk and dedicated-scene gameplay. For each, provide employer type, one concrete fun player action, one evolving variation, and concise English + idiomatic Egyptian-Arabic job ad copy. Humor should come from action and character behavior. Return only JSON using the provided schema; no filler.

Tune example quantities and output tokens to model quotas.

## Ink drafting
Gemini can propose one short dialogue branch at a time. A script must:
- Respect canonical world state, stable character and event IDs.
- Use only whitelisted narrative tags or a JSON intermediary later converted to Ink.
- Avoid direct state mutation inside model-generated script.
- Compile successfully with Ink tooling.
- Have both EN and ar-EG adapted versions with equivalent gameplay effects.
- Survive review for factual consistency, writing quality and repetition.

## Security, privacy, and costs
- **Never ship a Gemini API key in the browser/client bundle.**
- For offline scripts, use local environment variables or server-side tool execution and do not commit .env files.
- If runtime generation is ever added, pass requests through a protected server endpoint with per-user/per-session limits, cache, retries and a strict cost budget.
- Treat model output as untrusted data; validate, escape and moderate before display; never eval model-supplied code.
- Never send real player CVs, email credentials, personal contacts or private messages to content-generation requests.
- Google free-tier quotas, retention/data-use terms and eligible models are subject to change; consult current policy before enabling. Do **not** promise a fixed zero-dollar runtime.
- Offline playable bundles use local approved content even if Gemini API is disabled or blocked.

## Editorial acceptance checklist
A generated job is accepted only if:
- A player can describe the action in a sentence.
- The joke does not require long explanation.
- It fits the village and has a plausible workplace.
- It adds a new interaction, not another reskin of an existing puzzle.
- It doesn't shame players who leave.
- Localization has natural speech, not literal jokes.
- It can be added incrementally with a small component/scene.
- It remains entertaining without AI calls at runtime.

## Provenance
If using generated content, keep a lightweight internal note (date, model, prompt revision and human editor), but don't expose the production machinery as in-game lore or interface slogans.
