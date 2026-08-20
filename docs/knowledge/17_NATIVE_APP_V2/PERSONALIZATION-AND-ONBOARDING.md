---
authority: operations
derived_from: Genesis · 17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN
status: proposed
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-PLAN
tags:
  - type/plan
  - domain/product
  - status/open
---

# Personalisation — how AIIMIN becomes a different OS for each person

> Companion to [[10_DECISIONS/2026-08-03-life-score-options]]. That note decides
> what the number means; this one decides how we learn enough about a person to
> compute it, and what the app does differently for them afterwards.

## 1. The problem, stated properly

> "I may log walking, but someone who codes 24/7 — why will he walk? But we can
> give him a warning of less than 5k steps."

That sentence contains the whole design. There are two different objects and the
current app conflates them:

| Object | Belongs to | Example | Consequence of failing it |
|---|---|---|---|
| **Pursuit** | the person | "walk 8 km", "ship a feature", "read 20 pages" | you chose it; missing it costs score |
| **Floor** | the body / the ledger | "at least 5,000 steps", "at least 6 h sleep", "don't exceed the budget" | non-negotiable; breaching it raises a **warning**, and warnings are not the same as a low score |

A coder never has "walk" as a pursuit. He still has 5,000 steps as a **floor**,
because that is physiology, not preference. Pursuits are chosen; floors are
assigned from body facts and can be argued with but not deleted.

**This single split is the mechanism that makes the OS different per person
without making it arbitrary.**

## 2. Archetypes — the seed, not the cage

An archetype is a starting bundle of instruments + floors + minimums, proposed
at calibration and immediately editable. It is a fast path out of the cold-start
problem, and it is thrown away the moment real data exists.

Working set (extend freely — the AI proposes, the user confirms):

| Archetype | Load pattern | Instruments seeded | Floors that matter most |
|---|---|---|---|
| **Maker / builder** (codes, writes, designs) | long seated deep-work blocks | CRAFT · MIND · BODY · MONEY | steps ≥ 5k, sitting ≤ 90 min unbroken, sleep ≥ 6.5 h, eye breaks |
| **Student / exam** | study blocks, exam seasons | MIND · LEARNING · ORDER · BODY | sleep ≥ 7 h, one walk, revision spacing |
| **Athlete / physical** | training load, recovery | BODY · RECOVERY · MIND · MONEY | rest days, protein/water, sleep debt |
| **Operator / founder** | fragmented, meetings, money | MONEY · CRAFT · PEOPLE · RECOVERY | runway, unprocessed captures, one full day off |
| **Caregiver / family-led** | other people's schedules | PEOPLE · BODY · ORDER · MONEY | own sleep, own meals, time alone |
| **Recovering / rebuilding** | low capacity by design | RECOVERY · BODY · MIND | sleep window, no streak pressure at all |

Nobody is one archetype. The calibration proposes one, shows why, and the user
drags instruments in and out. Archetype is stored as a *label on the seed*, not
as a permanent class.

## 3. Calibration — the new onboarding

Not "onboarding" — **calibration**. The word matters: onboarding is something
done *to* a user; calibration is an instrument being set up *for* them.

Research constraint we are designing against: **~80% of mobile users churn
within three days**, and personalised flows are reported at +30–50% activation
versus generic ones. So calibration must produce a visibly personal result
inside the first session, and must never feel like a form.

### The steps

| # | Screen | One job | What is different from today |
|---|---|---|---|
| 1 | **Welcome** | say what this is in one line | brand lockup, peak-A, one promise, BEGIN |
| 2 | **Sign in** | get an identity | OS-ID + PIN or Google (never agent-typed) |
| 3 | **Claim OS-ID** | own your identifier | 8 chars, live availability, alternates |
| 4 | **"Tell me about your days"** | learn the person in one sentence | **new — the whole idea.** One free-text line → Groq → an editable proposal |
| 5 | **The proposal** | confirm what we heard | archetype + instruments + minimums + floors as **chips you correct**, identical language to Capture |
| 6 | **Body basics** | set the floors honestly | height (cm ⇄ ft/in), weight (kg ⇄ lb), age, optional. Skippable. Framed as calibration, never judgement |
| 7 | **Instruments** | choose what this OS measures | pick 4–6 of 8, pre-ticked from step 5 |
| 8 | **Your floors** | agree the non-negotiables | each floor shown with its number and a "why", each one adjustable, each one refusable |
| 9 | **Arc** | one line of direction | pre-filled with the AI's suggestion, always editable |
| 10 | **First capture** | reach the loop | guided capture → offer → settle → land on Today with the day already started |

Steps 4+5 replace three or four form screens with one sentence and one
correction pass. **It is the same interaction the whole app is built on** —
write freely, get an offer, correct the chips, settle — so calibration teaches
the app while doing something useful. That is the strongest argument for this
design and the reason it should not be replaced by dropdowns.

### Step 4 in detail

The user types one line. Examples that must work:

- *"I code 10–14 hours a day, sleep badly, order in too much, want to fix my back and save money."*
- *"Final year student, exams in November, I run 5 km most mornings."*
- *"Two kids, freelance design work, no time for myself, spending is out of control."*

Groq returns a **strict JSON schema** object:

```jsonc
{
  "archetype": "maker",
  "confidence": 0.82,
  "instruments": ["CRAFT", "BODY", "MIND", "MONEY"],
  "minimums": [                       // pursuits — chosen, scored
    { "label": "One deep-work block", "unit": "block", "target": 1 },
    { "label": "Log spends",          "unit": "count", "target": 1 }
  ],
  "floors": [                         // physiology / ledger — warned, not scored
    { "key": "steps",  "op": ">=", "value": 5000, "why": "sedentary work day" },
    { "key": "sleep",  "op": ">=", "value": 6.5,  "why": "you said you sleep badly" },
    { "key": "sitting","op": "<=", "value": 90,   "why": "back pain risk" }
  ],
  "arc_suggestion": "Build something that outlives the sprint — without wrecking the body that builds it.",
  "risks": ["back pain", "delivery spend", "sleep debt"]
}
```

Server route `POST /api/onboarding/calibrate`, session cookie, going through the
existing AI pipeline (`server/lib/aiChat.js` already has Groq wired, with the
per-provider daily cap in `apiUsageService.js`). Groq's structured-output mode
with `strict: true` and constrained decoding guarantees the schema, so the
client never parses free text. One call per user, one retry, and a **rule-based
fallback** — if the AI is unavailable, the archetype picker appears as six
cards and calibration still completes. **The AI is an accelerator here, never a
dependency.**

### Body basics and units

- Store **canonical SI**: `height_cm` (numeric), `weight_kg` (numeric).
- Display in the user's chosen unit; the toggle is a control, not a setting
  buried elsewhere. `ft/in → cm = (ft·12 + in)·2.54`, `lb → kg = lb·0.45359237`.
  Round on display only, never on store.
- Derived floors: step floor, sitting-break interval, hydration, sleep window.
  Every derived number shows its "why" and can be overridden.
- **No BMI verdict.** A number that calls a person overweight in their first
  session is how a personal OS becomes an app they delete. Body facts calibrate
  floors; they never produce a judgement.

## 4. What personalisation changes *after* calibration

Personalisation that stops at onboarding is a questionnaire. These are the
places the OS must actually differ per person:

1. **Instrument set** — which 4–6 dimensions exist for this user at all.
2. **Score weights** — mode-conditioned, seeded from what they told us.
3. **Capture presets** — the six tiles on Capture should be *their* six. A maker
   gets DEEP WORK, EXPENSE, NOTE; a caregiver gets PERSON, EXPENSE, MOOD.
4. **Parse vocabulary** — merchant and category dictionaries learn from what this
   person actually logs (their gym, their canteen, their cab app).
5. **Time-of-day surfaces** — Today at 08:00 leads with intent, at 22:00 with the
   settle. Same screen, different lead.
6. **Floors and warnings** — the 5k-steps warning exists only for people whose
   body facts and work pattern imply it.
7. **Empty states** — they should name the thing *this* person hasn't done.
8. **Notifications** — at most one a day, and it is the floor breach, not a
   streak reminder. (See §5 on why streaks are a trap.)

## 5. What the last five years of UX research say (2021 → 2026), and what we do about it

The problem you named — research done years ago that never made it into the
modern interface — is fixable by writing the finding and the implementation on
the same line. So:

| Finding | Where it comes from | What AIIMIN does |
|---|---|---|
| ~80% of mobile users churn inside 3 days; first session decides everything | mobile onboarding analytics, 2025 | Calibration must produce a personal artefact (their instruments, their floors) inside session one |
| Personalised onboarding: +30–50% activation, materially better D30 | SaaS onboarding studies, 2025–26 | §3 exists |
| Adaptive flows beat static ones — speed up for the fast, slow down for the unsure | onboarding research, 2025 | Step 4 lets a verbose person say everything at once and a terse person tap an archetype card |
| Gamification richness is an **S-curve**: past the second inflection point extra mechanics *increase* burnout and abandonment | Frontiers, 2025 | Hard cap on mechanics: XP and rank stay ambient, **no streak counters, no badges, no leaderboard** |
| Badge complexity → "gamification burnout" → abandonment (n=1,188) | Koivisto & Hamari | as above |
| Streaks drive **introjected** (guilt/shame) regulation, not intrinsic | SDT literature on mHealth | Never punish a break. A missed day lowers *confidence*, not worth. "Days present" is shown as a quiet count, never as a thing to protect |
| Autonomy · competence · relatedness predict continued mHealth use | SDT + mHealth SEM studies | Autonomy: everything editable, everything refusable. Competence: attribution — always show what moved the number. Relatedness: deliberately deferred (no social features yet) |
| Composite scores are unvalidated black boxes across the whole industry | wearable composite-score review, 2025 | Full attribution and a visible confidence band is our differentiator |
| Personal baselines (14–21 days) beat population norms | Fitbit/Garmin/Oura/Polar/WHOOP convergence | Score normalises against the user's own 28-day robust baseline |
| Proactive support at onboarding: 62% vs 34% activation | 2025 onboarding data | The AI proposal *is* the proactive support — it does the work instead of asking the user to |

**Interface consequences** (the part that usually gets lost between research and
code):

- **Progressive disclosure over tours.** No overlay tour stacked on the first
  screen (this was already a rejected pattern in the web app). Each surface
  teaches itself through its own empty state.
- **Motion carries meaning, not decoration.** Press = 110 ms squeeze + one
  haptic tick (already built). Screen enter = 280 ms rise with a 40 ms stagger.
  Figures count up over ~600 ms because a number that snaps looks like a value
  that was always there. Everything collapses under reduce-motion.
- **The number is never the first thing.** Genesis GOV-106: Today is
  capture-first. The score sits below the fold on purpose.
- **Warnings are quiet and specific.** "3,100 steps · your floor is 5,000" with
  one action. Not a red badge.
- **Nothing writes without a Settle.** Already the law on Capture; it extends to
  every surface.

## 6. Capture — fixing "the log feels forced"

Concrete changes, in order of impact:

1. **Open focused.** Landing on Capture puts the cursor in the composer and
   raises the keyboard. Right now it waits to be tapped, which is what makes it
   feel like a form.
2. **Presets become personal and contextual.** Six tiles, ordered by what this
   person logs at this hour. The four unbuilt ones stop occupying prime space.
3. **The empty screen should not show two empty states.** When there is nothing
   held and nothing settled, collapse both into one quiet line: *"Nothing yet
   today. Write the first line."*
4. **The offer should arrive, not appear.** Chips fade + rise in with a 40 ms
   stagger, 200 ms, once — so the parse reads as the app thinking rather than a
   layout jump.
5. **Settle should feel like a commit.** Button press → chips collapse into the
   settled row with a short shared-axis motion → toast rises. One medium haptic
   on Settle, one light on Drift.
6. **Voice first, not sixth.** For a person who logs while walking, the sixth
   tile is the wrong place for the fastest input. Voice moves to the composer
   as an inline control once the voice line exists.
7. **Let the composer breathe.** Placeholder rotates through examples drawn from
   *their* archetype (a maker sees "shipped the parser, 3 h deep work"; a
   student sees "revised chapter 4, 90 min").

## 7. What this costs, in screens

New or reworked surfaces implied by everything above:

| Screen | State |
|---|---|
| Welcome · Sign in · Claim OS-ID | specified, not built |
| **Tell me about your days** (AI calibration) | new |
| **The proposal** (correct the chips) | new |
| **Body basics** (units, floors) | new |
| **Instruments** (pick 4–6) | new |
| **Your floors** (agree the non-negotiables) | new |
| Arc · First capture | specified, not built |
| Today (capture-first) | next in the build order |
| Score (state + trajectory + attribution + confidence) | blocked on the §7 decision in the options note |

That is 10 calibration screens instead of 6. It is the right trade: calibration
is the only place where a personal OS gets to *become* personal, and every
screen after it is cheaper because of what was learned here.

## 8. Open questions for the founder

1. **Instruments** — approve the canonical 8 (`BODY MIND CRAFT MONEY PEOPLE
   ORDER RECOVERY LEARNING`) or amend the list?
2. **Floors vs pursuits** — approve the split in §1? Everything else rests on it.
3. **Groq at calibration** — one AI call per new user, cheap, with a rule-based
   fallback. Approve?
4. **Streaks** — confirm we ship *no* streak counter. This contradicts most
   competitor apps and it is a deliberate, research-backed choice.
5. **Body facts** — collect height/weight at all? It sharpens floors materially,
   and it is the most personal data the app will hold.

## Related

- [[10_DECISIONS/2026-08-03-life-score-options]] · [[17_NATIVE_APP_V2/V3-BUILD-TRACKER]]
- [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]] §3.1 (the 6-step flow this supersedes)
