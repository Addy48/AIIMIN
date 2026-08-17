
# Interaction Grammar

**Document type:** Architectural grammar (not specification)  
**Status:** Research — compositional layer atop Interaction Language  
**Date:** 2026-07-22  
**Continues from:** `Interaction_Language.md` (vocabulary, laws, state machine)  
**Constraint:** Does not override P7 governance or frozen P8 Chapters 01–08. Does not modify any P8 chapter.

---

## What grammar is

Interaction Language names the words: Pulse, Chip, Settle, Knock, Veil.

**Interaction Grammar names how words combine into meaning.**

Grammar is not UI. Not components. Not layouts. It is the **compositional logic** every surface must obey so that capture in finance feels the same as capture in journal, and delete in family feels the same as archive in documents — because they are the same *kind of sentence*, differently dressed.

If Interaction Language is the dictionary, Interaction Grammar is the syntax book.

---

## The canonical interaction sentence

Every user interaction in AIIMIN is expressible as a **sentence** with fixed parts of speech:

```text
[Subject] + [Intent] + [Act] + [Object] + [Outcome]
```

| Part | Who / what | Role |
|------|------------|------|
| **Subject** | Human or system | Who initiates |
| **Intent** | Verb from language | What kind of move |
| **Act** | The moment's grammar class | How the move composes |
| **Object** | Life entity, pulse, or recall target | What life is touched |
| **Outcome** | Settle, Hold, Hand-back, Veil result | What truth results |

### Minimum valid sentence (atomic)

The shortest grammatically complete interaction:

```text
Human · Catch · Ingress · Pulse · Settle
```

"I said something. The system caught it. Truth landed (or honestly held)."

No offers required. No AI. No confirm. This sentence must always be legal.

### Expanded default sentence (ingress)

```text
Human · Catch · Ingress · Pulse · Settle
System · Offer · Structure · Entity-chips · Peripheral
Human · Adjust* · Correction · Chip · Commit
System · Settle · Durability · Entity · Settle | Hold
```

Adjust is optional (zero or more). Offer may be empty. Settle at the end is mandatory truth.

### Review sentence

```text
Human · Recall · Retrieval · Query · Orient
System · Orient · Context · Entity + Threads · Scan
Human · Act · Mutation · Field | Status · Settle | Hand-back
```

### Destructive sentence

```text
Human · Act · Destruct · Entity · Veil
Human · Confirm · Irreversible · Entity · Settle
System · Archive · Honest-removal · Entity · Settle
```

Hand-back available only before Veil confirms. After Veil confirms, grammar closes — no fake undo.

### AI sentence

```text
System · Knock · Coaching · Suggestion + Provenance · Dismiss | Act
```

Knock is never the subject of the user's first sentence in a session. Parser runs as subordinate clause after Settle, not as opening line.

---

## The canonical interaction paragraph

A **paragraph** is a coherent sequence of sentences toward one human goal without breaking truth or sovereignty.

### Structure

```text
Opening (orient | anchor)
Body (one or more sentences of same tone)
Closing (settle | hand-back | drift to idle)
```

### Ingress paragraph (capture session)

```text
Anchor: breath tone, one hero
  → Catch → Settle                    [mandatory spine]
  → Offer → Adjust* → Commit          [optional body]
  → Settle | Hold                     [honest close]
  → Drift | Idle                      [release]
```

**Rule:** A paragraph may not end on Hold disguised as Settle. Closing must be truthful.

### Review paragraph (evening scan)

```text
Anchor: scan tone
  → Recall → Orient
  → Act | Complete | Correct | Archive  [one or more, same entity context]
  → Settle | Hand-back
  → Reflect | Idle
```

**Rule:** A review paragraph may increase density (command recall → scan orient) but must not introduce a second anchor mid-paragraph.

### Command paragraph (palette / search)

```text
Anchor: command tone
  → Recall (query) → Orient (results)
  → Act (jump | mutate | catch-from-command)
  → Settle
  → Idle
```

**Rule:** Command paragraphs may compress multiple recall sentences; they may not skip Settle on mutations.

### Invalid paragraph

```text
Catch → Offer → [modal wizard] → Settle   ← Offer before Settle on raw pulse
Catch → Knock → Settle                    ← Knock in breath window
Act → Settle → Veil                       ← Confirm after irreversible settle
```

---

## The canonical interaction conversation

A **conversation** is a multi-paragraph exchange between human and system over time — minutes, days, or years. AIIMIN is not a chat thread; conversation is **object-centric**, not message-centric.

### Conversation shape

```text
Session A:  [Ingress paragraph]     → object O₁ exists
Session B:  [Review paragraph]      → human recalls O₁
Session C:  [Knock paragraph]       → system suggests link to O₂ (window open)
Session D:  [Correction paragraph]  → human adjusts chip on O₁
```

Messages do not accumulate as the record. **Objects and provenance** accumulate. The conversation is the history of valid paragraphs applied to life entities.

### Human ↔ System turn-taking

| Turn | Who | Valid opening |
|------|-----|---------------|
| First | Human | Catch, Recall, Act (low-stakes) |
| First | System | Never Knock, never Offer before human Catch in same breath |
| Reply | System | Offer, Hold, Knock (if window open), Hand-back |
| Reply | Human | Adjust, Dismiss, Act, Confirm, Drift |

System may not take two focal turns in a row (e.g., Knock → Knock) without human dismiss or act between.

### Long-horizon conversation

Over months, the conversation reads:

```text
Many Catch paragraphs → graph threads thicken
Occasional Review paragraphs → clarity
Rare Knock paragraphs → agency when invited
Rare Veil paragraphs → protection at stakes
```

The product should feel like a **journal that organizes itself**, not a group chat with an AI.

---

## Canonical interruption

An **interruption** is any system-initiated focal shift while the human did not request it.

### Valid interruption (grammatical)

```text
Precondition: window OPEN ∧ human NOT in Veil ∧ human NOT in Catch
Form: Knock(subject, provenance, single-action | dismiss)
Cost: ≤ one focal unit of attention
Exit: Dismiss | Act | Adjust (one chip)
```

### Invalid interruption

| Pattern | Violation |
|---------|-----------|
| Knock during Catch | Breath window closed |
| Knock during Veil | Protected state |
| Knock → Knock | Double system focal turn |
| Banner → modal → coach | Interruption cascade |
| Notification → deep link → form | Uninvited paragraph |
| "Helpful" tooltip on first pulse | Latent promoted to focal |

### Interruption as clause, not paragraph

A valid Knock is a **single clause** inserted into an open review or orient paragraph — never its own multi-step flow unless human Acts into it.

---

## Canonical correction

Correction is the grammar of **fixing without restarting**.

### Form

```text
Offer(fieldᵢ) → Adjust(chipᵢ) → Commit(fieldᵢ) → Settle
```

One chip per field. Adjust does not re-open Catch unless human explicitly re-pulses.

### Correction without Offer (retroactive)

```text
Recall → Orient → Correct(chipᵢ) → Settle → Hand-back available (if recoverable)
```

Used when fixing past settled truth. Provenance records what changed.

### Correction stack

Multiple fields = multiple chips in **parallel**, not wizard steps:

```text
Offer → [chip_date, chip_category, chip_entity] → Adjust* → Commit → Settle
```

Invalid: `Adjust → form page 1 → form page 2 → Settle`

### Correction vs rejection

| Human move | Grammar |
|------------|---------|
| Tap chip, change value | Adjust |
| Dismiss chip | Dismiss (neutral) |
| Undo last commit | Hand-back |
| Delete entity | Act → Destruct → Veil (if irreversible) |

Dismiss is not failure. Grammar does not punish Dismiss.

---

## Canonical confirmation

Confirmation is grammar for **stakes**, not for everyday acts.

### Stakes ladder (compositional)

| Stakes | Sentence form | Hand-back after? |
|--------|---------------|------------------|
| Trivial | Act → Settle | Yes |
| Recoverable | Act → Settle → Hand-back window | Yes |
| Medium bulk | Act → Pause → Settle | Yes |
| Destructive | Act → Veil → Confirm → Settle | No |
| Peak / privacy | Act → Typed Veil → Confirm → Settle | No |

### Confirmation sentence template

```text
Human · Act · Destruct · Object · Veil
System · State · Consequence · Plain-language · Focal
Human · Confirm | Hand-back · Sovereignty · — · Settle | Prior
```

**Forbidden:** Confirm before Act on recoverable mutations. Confirm spam ("Are you sure?" after every chip). Generic browser confirm.

---

## Canonical AI intervention

AI intervenes only as **subordinate clauses** to human-led paragraphs.

### Parser (silent, mandatory after Catch)

```text
Catch → Settle → [Parser: Offer*]
```

Parser never speaks in first person. Parser produces chips, not chat bubbles.

### Linker (during Offer or Orient)

```text
Offer → [Linker: thread-chip?]
Orient → [Linker: related-entities?]
```

Linker proposes connections; human Adjusts or Dismisses.

### Coach (Knock)

```text
IF window_open AND provenance_clear AND single_action:
  Knock → Dismiss | Act
ELSE:
  latent (no focal intervention)
```

### Clarifier (last resort)

```text
IF inference_blocked AND kill_list_allows:
  ONE question → Catch → Settle → Offer
ELSE:
  settle raw + offer partial
```

Clarifier may ask **one** question. Clarifier may not run before first Settle on a pulse.

### AI anti-roles (ungrammatical)

- Opening chat without Catch
- Auto-commit without Offer visibility
- Coaching during breath
- Confidence theater (fluent wrongness)
- Perpetual sidebar companion

---

## Canonical recovery

Recovery is grammar for **restoring prior truth without shame**.

### Hand-back sentence

```text
Human · Undo | Revert · Recovery · Prior-state · Settle
```

### When Hand-back is legal

After recoverable Act, Adjust, or Commit — within undo window.

After mistaken Dismiss of chip — re-Offer if inference still valid.

After Drift from pulse — restore draft pulse.

### When Hand-back is illegal

After Typed Veil confirmed.

After explicit Archive with governance-mandated retention.

After human Dismiss of Knock (do not re-knock same content in same session).

### Recovery paragraph

```text
Act → Settle → [user regrets]
Hand-back → Prior → Settle
```

No lecture. No "Are you sure you want to undo?" on Hand-back itself.

---

## Canonical irreversible action

Irreversible grammar is intentionally **slow and focal**.

### Sentence

```text
Human · Act · Irreversible · Object · Veil
System · Disclose · Consequence · Scope · Focal
Human · Confirm · Typed? · — · Settle
System · Archive · Honest · Object · Settle (no Hand-back)
```

### Properties

Consequence stated in plain language before confirm.

Scope explicit (what deletes, exports, or propagates).

Veil blocks all Knocks and secondary anchors.

Motion may orient inside Veil; never before Veil opens.

After Settle, grammar does not pretend reversibility.

---

## Canonical waiting state

Waiting is **Hold** — honest, legible, non-theatrical.

### Sentence

```text
System · Hold · Pending · Reason · Hold-surface
Human · Wait | Drift | Act-on-other · — · —
System · Resolve · Durability | Inference · Object · Settle | Fail-honest
```

### Hold types

| Hold | Reason shown | User can |
|------|--------------|----------|
| Sync hold | "Syncing…" | Drift, other paragraphs |
| Inference hold | "Understanding…" | Drift; raw pulse already Settled |
| Durability hold | "Saving…" | Wait briefly; never fake Settle |

### Invalid waiting

Progress bar at 100% while still holding.

Success toast during Hold.

Blocking entire app for non-critical hold.

Animated "AI thinking" glow as identity.

---

## Canonical uncertainty state

Uncertainty is **visible low confidence**, not hidden guesswork.

### Sentence

```text
System · Offer · Uncertain · Chip(soft) + provenance · Peripheral
Human · Adjust | Dismiss | Ignore · — · Commit | Drift
```

### Grammar rules

Uncertain offers use softer chip posture (language doc: peripheral attention).

Provenance required: "Guessed from…" / "Low confidence"

High-confidence wrong chip is worse than low-confidence honest chip.

Uncertainty never blocks Catch → Settle.

Clarifier only when inference cannot proceed at all — not for every uncertain field.

---

## Canonical completion

Completion is **terminal satisfaction for a unit of life work** — not gamification.

### Sentence

```text
Human · Act · Complete · Unit · Settle
System · Acknowledge · Proportional · Brief · Scan (not casino)
```

### Valid completion

Mark habit done.

Close journal entry.

Reconcile transaction.

Archive resolved item.

### Invalid completion

Streak explosion on calm review surface.

Forced celebration after every Catch.

Completion that opens upsell or engagement modal.

Completion without Settle (fake done).

### Completion vs Archive

| Move | Meaning |
|------|---------|
| Complete | Unit fulfilled; may remain visible in history |
| Archive | Removed from active attention; honest history |

Both end paragraphs. Neither reopens Knock without new human Recall.

---

## Universal patterns

Every domain expresses the **same grammar**. Surface jobs differ (frozen Ch 08); sentences do not.

### Capture (all domains)

```text
Human · Catch · Ingress · Pulse · Settle
System · Offer · Structure · Domain-chips · Peripheral
```

Finance pulse, journal pulse, family pulse — same spine. Domain only changes which chips Parser offers.

### Rename

```text
Human · Recall → Orient · Entity
Human · Act · Rename · Field · Settle
[optional Adjust chip if inferred rename wrong first]
```

Inline or chip — never modal rename wizard for single field.

### Delete

```text
Recoverable: Act · Soft-delete · Entity · Settle → Hand-back
Irreversible: Act · Destruct · Entity · Veil → Confirm → Settle
```

### Search / Recall

```text
Human · Recall · Query · Intent · Orient
System · Orient · Results · Ranked-entities · Command|Scan
Human · Act · Jump · Entity · Orient (review paragraph begins)
```

### Organize

```text
Human · Recall → Orient · Entity
System · Offer · Thread-chips · Relations · Peripheral
Human · Adjust | Dismiss · — · Commit · Settle
```

Organize is **Offer + Adjust**, not drag-to-folder homework at ingress.

### AI Suggestion

```text
System · Knock · Coaching · Suggestion+provenance · Dismiss|Act
```

Never: AI Suggestion → Catch (AI does not pulse for user).

### Review (Today, timeline, inbox)

```text
Human · Reflect · Scan · Surface · —
System · Orient · Threads · Context · Peripheral
Human · Act | Complete | Recall · — · Settle
```

### Journal

```text
Catch → Settle → Offer(mood?, tags?, links?) → Adjust* → Commit
Reflect paragraph for re-read: Recall → Orient → Correct*
```

### Calendar (scheduling acts)

```text
Catch("lunch Friday") → Settle → Offer(date-chip, entity-chip) → Adjust* → Commit
Recall → Orient → Act(reschedule) → Offer(new-date-chip) → Adjust → Settle
```

Fantastical grammar generalized — chips, not form.

### Documents

```text
Catch(attachment|note) → Settle → Offer(type, links) → Adjust*
Recall → Orient → Act(open|annotate|archive)
```

### Family

```text
Catch → Settle → Offer(person-chip, relation-chip) → Adjust*
Act · Destruct · shared-entity · Veil (higher stakes, privacy)
```

### Finance

```text
Catch → Settle → Offer(amount-chip, category-chip, account-chip) → Adjust*
Recall → Orient → Act(reconcile|recategorize) → Adjust → Settle
Veil for irreversible transfers / exports.
```

### Pattern table (at a glance)

| Domain | Ingress sentence | Review sentence | Stakes sentence |
|--------|------------------|-----------------|-----------------|
| Capture | Catch → Settle → Offer* | — | — |
| Rename | Orient → Act → Settle | Correct | — |
| Delete | — | Act | Veil if irreversible |
| Search | Recall → Orient | — | — |
| Organize | Offer → Adjust | Recall → Orient | — |
| AI | — | Knock | — |
| Journal | Catch paragraph | Reflect paragraph | Veil rare |
| Calendar | Catch + date chips | Orient → Act | Veil rare |
| Documents | Catch + link chips | Recall → Orient | Veil on purge |
| Family | Catch + person chips | Orient | Veil on shared delete |
| Finance | Catch + money chips | Orient → reconcile | Veil on export/delete |

---

## Interaction rhythm

Grammar breathes. Rhythm is **when the interface inhales, exhales, and stays silent**.

### Exhale (release load)

**When:** Catch, Settle, Hand-back, Dismiss, Complete (proportional)

**Interface:** Chrome drops. Focal count drops. User feels lighter.

**Duration:** Immediate at Settle. No performative delay.

### Inhale (gather attention)

**When:** Veil, Typed Veil, Clarifier's one question, Orient on high-stakes recall

**Interface:** Focal tightens. Consequence plain. One decision.

**Duration:** Short as stakes allow. Never inhale before raw Settle on pulse.

### Silence (no system focal turn)

**When:** Breath Catch, Hold (honest), user Adjusting chips, user Drifting, latent threads

**Interface:** System does not speak. Parser may work invisibly after Settle. No Knock.

**Duration:** Default state. Silence is respect.

### AI wait

Parser waits **after** Settle, never before.

Linker waits for Offer or Orient context.

Coach waits for window open + human in Reflect or Orient — not Idle on breath surface.

Clarifier waits until Parser cannot proceed.

### AI knock

One knock per focal episode. Knock includes provenance + single action + dismiss.

Knock never chains to second knock without human turn.

### AI disappear

After Dismiss — AI absent for that suggestion in session.

After Act — AI returns only via new human Recall or new object context.

During Catch, Veil, Hold — AI invisible at focal layer.

Parser is not "AI presence" — it is infrastructure. User feels caught, not coached.

---

## Interaction tension

Tension is **intentional attention pressure** — where grammar speeds up or slows down.

### Where attention rises

Opening Veil (stakes clear).

Typed Veil (peak consequence).

Clarifier's single question (blocking inference only).

Orient on irreversible recall (delete, export, shared family data).

Command recall with many results (user chose density).

### Where attention relaxes

After Settle on Catch (exhale).

Scan review surfaces (threads peripheral).

Chip Adjust (one field, low stakes).

Hand-back (recovery without shame).

Idle after Complete (proportional ack, then quiet).

### Where grammar intentionally slows

Irreversible Act (Veil ladder).

Privacy-affecting mutations (family, finance export).

Bulk destructive scope (pause → veil).

First-time peak-stakes only — not every session.

### Where grammar intentionally accelerates

Catch → Settle (reflex).

Optimistic commit with Hand-back (recoverable).

Palette/logger jump (command paragraph).

Repeat Adjust on familiar chips (mastery).

Swipe-complete on low-stakes with Hand-back (touch).

### Tension mistake

Constant high tension (dashboard anxiety).

Constant low tension with hidden stakes (silent wrongness).

Accelerating into Veil without Orient (surprise delete).

Slowing Catch with onboarding (inhale before exhale).

---

## Interaction mistakes

Behavioral anti-patterns AIIMIN grammar **rejects**. Not implementation notes — **ungrammatical life**.

### Interruption and attention

**Interruption cascades** — banner → toast → modal → coach in one episode.

**Knock stacking** — multiple AI focal turns without human reply.

**Notification hijack** — push opens form, not Orient.

**Latent promotion** — engagement insight animates to focal during breath.

**Focus theft** — secondary chrome steals anchor during Catch.

### Confirmation and fear

**Confirmation spam** — confirm on every delete, chip dismiss, or navigation.

**Fear copy on recoverable acts** — "Are you sure?" when Hand-back exists.

**Pre-confirm** — asking before Act on trivial mutations.

**Browser veil** — `window.confirm` breaks branded grammar.

### Modal and flow pathology

**Modal addiction** — every Act opens full-screen interrupt.

**Form maze** — Adjust opens multi-page wizard.

**Offer before Catch** — taxonomy gate before raw save.

**Schema homework** — organize-before-value, graph-before-pulse.

**Setup paragraph** — onboarding blocks first Catch sentence.

### AI pathology

**Premature AI** — coach speaks before Settle.

**Chat as record** — conversation thread replaces objects.

**Auto-assign** — structure applied without visible Offer.

**Confidence theater** — fluent wrongness, hidden uncertainty.

**Companion panel** — always-visible AI sidebar.

**Clarifier storms** — more than one question per blocked inference.

**Re-knock after dismiss** — same suggestion returns same session.

### Motion and performance

**Motion before certainty** — animate before Settle.

**Perform → Settle** — celebration or transition blocks commit.

**Progress theater** — fake progress, 100% while holding.

**AI breathing glow** — idle animation as product identity.

**Casino completion** — streaks, confetti on calm surfaces.

### Truth and trust

**Settle disguising Hold** — success while syncing.

**Silent mutation** — system changed entity without provenance.

**Verb lies** — "Saved" when Hold, "Deleted" when soft-delete recoverable.

**Irreversible pretense** — Hand-back after Typed Veil.

### Density and tone

**Command tone on breath** — dashboard widgets on capture.

**Breath tone on command** — hiding power when user invoked palette.

**Brand ritual on product** — hero spacing on logger.

**Shame empty states** — guilt as engagement.

**Reward loops** — streaks, points, nagging incomplete counts.

### Organization pathology

**Folder-first recall** — user must file before find.

**Graph homework at ingress** — link entities before first Settle.

**Drag-only organize** — no chip, no Hand-back path.

**Duplicate primitives** — rename in finance ≠ rename in journal grammatically.

### Platform and sovereignty

**Gesture reinvention** — custom back when system back exists.

**Chord-only catch** — keyboard required for pulse.

**Icon-only critical verbs** — save, delete, capture without text or name.

**Two anchors** — competing primaries in one moment.

**Dismiss penalty** — friction after rejecting Offer or Knock.

---

## Grammar validation

Before any interaction design ships, it must pass:

**Sentence test** — Can you write the flow as one valid sentence?

**Paragraph test** — Does it open and close with truthful Settle or Hand-back?

**Conversation test** — Are objects accumulating, not chat messages?

**Breath test** — Did Catch exhale before inhale?

**Domain test** — Is finance the same grammar as journal with different chips?

**Knock test** — Did AI wait for window, provenance, single action?

**Mistake scan** — Does it trigger any rejected pattern above?

---

## Relationship to Interaction Language and P8

| Document | Role |
|----------|------|
| `Interaction_Language.md` | Vocabulary, laws, state machine, feel |
| `Interaction_Grammar.md` (this) | Composition, rhythm, tension, universal patterns |
| P8 Ch 09–12 (future) | Codification into interaction, component, visual, motion systems |

Grammar does not create P8 rules. Grammar informs the rewrite of Chapters 09–12 when founder approves.

---

## Changelog

**2026-07-22** — Initial Interaction Grammar. Continues Interaction Language. No P8 chapters modified. Not frozen.

---

*End of Interaction Grammar.*
