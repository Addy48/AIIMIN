
# Interaction Language

**Document type:** Architectural language definition (not specification)  
**Status:** Research — foundation for Chapters 09–12 rewrite  
**Date:** 2026-07-22  
**Inputs:** P7 Governance (law) · P8 Chapters 01–08 (frozen) · `Interaction_Layer_Pre-Design_Study.md` (research)  
**Constraint:** This document elevates interaction quality. It does not override governance or frozen chapters.

---

## What this is

Apple has deference and direct manipulation. Linear has cold speed. Raycast has intent-in-action-out. Things has calm temporal clarity. Figma has canvas sovereignty.

**AIIMIN has Exhale Interaction** — a language where life enters without ceremony, structure is offered not demanded, truth is never faked, and intelligence knocks before it speaks.

This document defines that language: its philosophy, vocabulary, grammar, models, laws, and state machine. Not components. Not screens. Not gesture catalogs. The **recognizable way AIIMIN converses with a human under load**.

---

## Interaction philosophy

### Name: Exhale Interaction

Most software asks the user to inhale — hold more context, make more choices, tolerate more chrome — before anything is saved. AIIMIN does the opposite. The user **exhales**: intent leaves the body, the system catches it, and cognitive load drops.

Exhale Interaction rests on three postures:

**Catch, don't interrogate.** The system's first move is to receive life as it arrives. Questions come after commit, as offers, never as gates.

**Offer, don't assign.** Structure is proposed beside the user's words — visible, editable, dismissible — never silently applied or buried in settings.

**Settle, don't perform.** When something is saved, pending, or failed, the interface tells the truth immediately. No theater. No fake instant. No shame.

Exhale Interaction serves the frozen emotional contract: **relief after capture**, **clarity after review**, **agency after coaching**. If an interaction does not move the user toward one of those three feelings, it does not belong in the language.

### How AIIMIN differs from reference languages

| Language | Core move | AIIMIN divergence |
|----------|-----------|-------------------|
| Apple | Defer to content | AIIMIN defers to **life moments**, not just content blocks |
| Linear | Opinionated speed | AIIMIN adds **warmth and correction** — speed without coldness |
| Raycast | Ephemeral command | AIIMIN commands **persist as life objects** |
| Figma | Sovereign canvas | AIIMIN sovereignty is **the human's life record**, not a artboard |
| Things | Calm temporal lists | AIIMIN spans **whole life domains** with one chip grammar |
| ChatGPT | Thread as interface | AIIMIN attaches intelligence to **objects**, not messages |

---

## The AIIMIN feel

### Thirty-second test

Someone opens AIIMIN tired, mid-day, on whatever device they have. Within thirty seconds they should feel:

**Caught.** Not judged. Not facing a blank workspace. Something is ready to receive them.

**Light.** One obvious thing to do. No competing primaries. No dashboard guilt.

**Safe.** Whatever they do can be undone or corrected. The product does not trap them.

**Honest.** If something is still syncing, it looks like it. If AI is guessing, it looks like a guess.

They should **not** feel: rushed into setup, lectured by a coach, lost in a chat thread, or impressed by motion that delays saving.

### Emotional signature (explicit)

| Feel | Yes / No | Meaning |
|------|----------|---------|
| **Calm** | Yes | Low chrome in capture; breathing room in review |
| **Fast** | Yes | Commit is immediate; structure is async to reflex |
| **Confident** | Yes | User knows what happened and what they can fix |
| **Invisible** | Partially | Chrome recedes; **truth never** becomes invisible |
| **Protected** | Yes | High-stakes acts are gated; life data is treated as precious |
| **Directed** | Sparingly | One anchor per moment — not a tour guide, not a nag |

**One sentence:** AIIMIN feels like **a competent friend who catches what you say, writes it down honestly, and only speaks up when you have room to listen**.

---

## Interaction vocabulary

The language has **nouns** (things that exist in interaction), **verbs** (actions the user or system takes), and **tones** (how interaction presents). These terms are architectural — they will appear in Chapters 09–12 and in product copy discipline.

### Nouns

**Anchor** — The single primary action in a moment. Everything else is secondary to the anchor. There is never more than one anchor per view.

**Pulse** — A unit of captured intent: the raw human signal before full structure. A pulse may be text, voice, photo, or structured logger input. Pulses always enter the same convergence path.

**Offer** — Structure the system proposes after a pulse: inferred fields, links, categories, dates, entities. Offers are visible and provisional until settled or adjusted.

**Chip** — The atomic correction unit. One chip = one offered field or link the user can tap to adjust, confirm, or dismiss. Chips are the universal correction vocabulary across all life domains.

**Settle** — The moment truth lands: saved locally, acknowledged, or honestly marked pending. Settle is a state, not a celebration.

**Hold** — Honest pending: sync, inference, or durability not yet complete. Hold never masquerades as settle.

**Thread** — A connection the system remembers between life objects. Threads appear in review and retrieval; they do not block capture.

**Recall** — Retrieval of past life by meaning (entity, time, intent) rather than by folder coordinates.

**Knock** — A respectful AI entry: coaching, suggestion, or insight presented only when the interruptibility window is open.

**Veil** — Protected cognitive state (focus, deep capture, modal confirm) where knocks and secondary chrome do not enter.

**Hand-back** — Recovery affordance: undo, revert, or correct without shame copy.

**Drift** — Non-destructive navigation away from an in-progress pulse; drafts may persist; nothing is silently discarded.

### Verbs (canonical)

| Verb | User or system | Meaning |
|------|----------------|---------|
| **Catch** | System | Receive pulse with ceremony-free save |
| **Offer** | System | Propose structure beside user material |
| **Adjust** | User | Change one chip without reopening a form |
| **Settle** | System | Confirm durability or honest hold |
| **Recall** | User | Find life by meaning |
| **Knock** | System | Present AI when window open |
| **Dismiss** | User | Reject offer or knock without penalty |
| **Hand back** | System | Restore prior state after recoverable act |
| **Anchor** | Design | Declare the one hero action |
| **Veil** | System / user | Enter protected focus or confirm scope |

Verbs MUST stay consistent across web, native, and desktop (frozen primitive contract).

### Tones

**Breath** — Capture tone. Minimal chrome, maximum focus. The interface holds its breath with the user.

**Scan** — Review tone. Calm, scannable, no urgency theater.

**Command** — Power tone. Higher density permitted for palette, search, triage.

**Ritual** — Brand tone. Expressive, sparse hero — only on brand surfaces.

Tone is chosen by **cognitive mode**, not by component skin.

---

## Interaction grammar

Grammar is how nouns and verbs compose into valid sentences. Invalid sentences are interaction bugs.

### Valid sentences

**Catch → Settle → Offer → Adjust***  
User pulses. System settles raw save immediately. Structure appears as offers. User adjusts chips optionally. This is the default life loop.

**Catch → Settle**  
User pulses. System settles. No offers required. Valid and complete.

**Recall → Orient → Act**  
User recalls past life. System orients in context. User acts (adjust, complete, archive). Review grammar.

**Knock → Dismiss | Adjust | Act**  
System knocks when window open. User dismisses, adjusts an offer, or acts on suggestion. Never forced.

**Anchor + Breath**  
Every capture view: one anchor, breath tone. No secondary primary.

**Veil + Confirm → Settle | Hand back**  
High-stakes path: veil lifts only for confirm; then settle or hand back. No window.confirm.

### Invalid sentences (grammar violations)

**Offer → Catch** — Structure before raw save. Forbidden.

**Knock → Veil** — AI breaks protected focus. Forbidden.

**Catch → Perform → Settle** — Animation or onboarding before commit. Forbidden.

**Adjust → Form maze** — Chip correction opens multi-step wizard. Forbidden unless stakes require veil.

**Settle → Hold disguised** — Success chrome while pending. Forbidden.

**Two Anchors** — Competing primaries. Forbidden.

**Recall → Graph homework** — User must organize before seeing value. Forbidden at ingress.

Grammar is how AIIMIN stays recognizable: the same sentences in finance, journal, habits, and family.

---

## Interaction hierarchy

Hierarchy is **what wins when signals conflict**.

```
Human sovereignty
    ↓
Truth (settle / hold honesty)
    ↓
Catch reflex (ceremony-free save)
    ↓
Emotional contract (relief · clarity · agency)
    ↓
Anchor (one primary per moment)
    ↓
Platform convention (back, share, biometrics)
    ↓
Tone (breath · scan · command · ritual)
    ↓
Acceleration (keyboard · palette · logger)
```

When in doubt: **sovereignty and truth beat speed; speed beats chrome; chrome never beats catch**.

Secondary tools, AI knocks, and decorative motion sit **below** acceleration — they may never block the layers above.

---

## User attention model

Attention is a finite resource. AIIMIN budgets it in **layers**:

**Focal attention** — One anchor, one pulse field, one confirm gate. Only focal elements receive primary visual weight.

**Peripheral attention** — Offers, chips, secondary actions. Visible but quieter. Discovered by glance, not by hunt.

**Latent attention** — Threads, knocks, insights waiting for review surfaces or open interruptibility windows. Not shown during veil or breath capture.

**Recalled attention** — Activated during recall and orient moments. Higher information density permitted in command tone.

### Attention rules

The user should never split focal attention between two decisions of equal weight.

Peripheral elements may not animate into focal without user intent.

Latent elements may not promote themselves to focal (no engagement hacks).

Recalled attention returns to breath when the user returns to capture.

---

## Interruption model

### Interruptibility window

A **window** is open when the user is not in veil, not in breath catch, and not in a high-stakes confirm. Windows vary by surface (frozen Ch 08) but the language is uniform:

| State | Window |
|-------|--------|
| Breath capture | Closed |
| Veil / confirm | Closed |
| Scan review | Open (quiet knocks only) |
| Command / palette | Open |
| Focus / protected | Closed |

### Knock eligibility

A knock MUST pass all checks:

- Interruptibility window is open
- Knock has provenance (why now, what entity, what confidence)
- Knock has a single suggested action or dismiss
- Knock does not duplicate a latent insight already visible

Failed checks → knock stays latent.

### Interruption cost

Every interruption has a cost measured in **attention seconds** and **trust units**. A knock that wastes either is a language violation. Coaching that arrives during breath capture costs trust that may not return.

---

## Correction model

**Correction is always cheaper than prevention.**

Prevention asks upfront: "What category? What date? What project?" Correction says: "I think this — tap if wrong."

### Chip discipline

One chip, one field or link. Chips are tappable, keyboard-reachable, and screen-reader named.

Adjusting a chip MUST NOT clear unrelated offers.

Dismissing a chip is neutral — no "are you sure?" for recoverable inference.

High-confidence wrongness is worse than low-confidence honesty. Offers show uncertainty when uncertain.

### Correction vs confirm

| Situation | Language |
|-----------|----------|
| Wrong category guess | Adjust chip |
| Wrong entity link | Adjust chip |
| Recoverable delete | Hand back |
| Irreversible delete | Veil + confirm |
| Privacy export | Veil + confirm |

Correction never uses fear copy. Confirm never uses generic system dialogs.

---

## Confirmation model

Confirmations exist on a **stakes ladder**:

**Settle** — Default. Optimistic commit. Hand-back available.

**Pause** — Brief inline acknowledgment for medium stakes (e.g., bulk adjust). Still recoverable.

**Veil** — Branded gate for destructive or irreversible acts. Clear consequence language.

**Typed veil** — Peak stakes (account deletion, mass export). User must type to prove intent.

The ladder climbs only when hand-back cannot restore the prior world.

Fear is not a confirmation strategy. Recoverable acts use hand-back, not veil.

---

## Trust model

Trust is built from **legibility**, **recoverability**, and **provenance**.

**Legibility** — The user always knows what state they are in: catching, holding, settled, offering, correcting.

**Recoverability** — Hand-back exists for recoverable mistakes. Undo window preferred over pre-emptive fear.

**Provenance** — Every offer and knock shows why: inferred from pulse, linked to entity, confidence band visible.

**Durability honesty** — Hold looks like hold. Settle looks like settle. Never the reverse.

**Verb truth** — Save means saved. Delete means deleted. Syncing means not yet durable everywhere.

Trust compounds over years. One fake settle destroys more than ten slow holds.

---

## AI interaction model

AIIMIN AI is **mixed-initiative**, not conversational default.

### Roles in interaction (not architecture)

AI appears as:

**Parser** — Turns pulse into offers silently after settle.

**Linker** — Proposes threads between entities as chips.

**Coach** — Knocks with one suggestion when window open.

**Clarifier** — Asks **one** question only when inference cannot proceed and Kill List allows.

AI never appears as:

- Chat thread as system of record
- Always-on companion panel
- Authority that applies structure without offers
- Nag loop optimizing engagement

### AI sentences

**Parser:** Catch → Settle → Offer  
**Coach:** Knock → (Dismiss | Act)  
**Clarifier:** One question → Catch (never before first settle)

### Sovereignty invariant

The human may always: dismiss, adjust, hand back, or ignore. AI suggestions that remove any of these are invalid.

---

## Keyboard philosophy

Keyboard is **acceleration**, not citizenship.

Every essential path — especially catch — MUST work without chords.

Palette and logger are express lanes for users who learn them.

Shortcuts are discoverable progressively (hints, not mandatory onboarding calls).

Chords never replace visible anchors on breath surfaces.

Platform-standard shortcuts (undo, save where applicable) are respected.

Keyboard focus order follows grammar: anchor → pulse → offers → secondary.

---

## Touch philosophy

Touch is **honest target, platform gesture**.

Platform back, share sheet, and system biometrics win over custom gestures.

Touch targets on critical paths meet accessibility floors.

Swipe may complete low-stakes acts when hand-back exists; swipe must not be the only path for catch or veil.

Breath capture on phone favors thumb reach and single-field focus.

Touch and pointer share the same grammar; only density and target size change.

---

## Discoverability philosophy

**Obvious defaults, earned depth.**

Day one: anchor visible, catch obvious, settle honest.

Week one: chips, hand-back, recall discovered through use.

Month one: palette, logger, chords accelerate without documentation pilgrimage.

Discoverability NEVER introduces setup tax before first catch.

Empty states teach the next valid sentence ("Pulse what happened") — never shame.

Power features live in command tone, not on breath surfaces.

---

## Progressive mastery philosophy

Mastery is **organizational and accelerative**, not configurational.

Beginners and experts share the same UI. Experts do not get a different product — they get faster routes.

Mastery layers:

**Reflex** — Catch and settle without thought.

**Adjustment** — Chips become muscle memory.

**Recall** — Jump by meaning, not browse.

**Command** — Palette/logger as second language.

No layer is required to use the layer below. No onboarding call. No plugin maze.

Mastery rewards competence delight (JetBrains) not streak delight (Superhuman).

---

## Design laws

Timeless laws of Exhale Interaction. Not UI rules. Not P8 rule numbers. Violations are language crimes.

**Law of the Exhale**  
A pulse must reduce cognitive load the moment it is caught — never increase it.

**Law of the Anchor**  
One moment, one primary action. Two anchors is a design failure.

**Law of Settle**  
The user always knows whether truth has landed, is holding, or failed.

**Law of the Offer**  
Structure may appear only after catch settles — never as prerequisite.

**Law of the Chip**  
Correction must be cheaper than the form it replaces.

**Law of the Hand-back**  
Recoverable mistakes are undone, not feared.

**Law of the Veil**  
Irreversible acts earn a branded gate — never a browser dialog.

**Law of the Knock**  
Every interruption must earn its attention cost and arrive only through an open window.

**Law of Sovereignty**  
Every system offer and every AI knock may be dismissed without penalty.

**Law of Provenance**  
The user can always answer: why did the system do that?

**Law of Honest Hold**  
Pending must never wear the clothes of done.

**Law of Breath and Scan**  
Capture breathes; review scans; command compacts; brand rituals — never cross-contaminate by default.

**Law of Platform Body**  
Gestures and shells follow the OS; verbs and grammar follow AIIMIN.

**Law of the Thread**  
Connection is revealed in recall and review — never demanded at ingress.

**Law of Verb Truth**  
The same verb means the same act everywhere in the product.

**Law of Latent Discipline**  
Insights wait their turn. The product does not promote anxiety to focal attention.

**Law of Dignity**  
Empty, error, and recovery states never shame the human.

---

## Interaction state machine

The canonical journey of life through AIIMIN. States are **interaction states**, not database enums. Transitions are valid grammar sentences.

### States

| State | Description | Dominant tone |
|-------|-------------|---------------|
| **Idle** | User present; no active pulse | Scan or breath |
| **Notice** | User recognizes something worth recording | Breath |
| **Catch** | Pulse in flight; entering convergence | Breath |
| **Settle** | Raw save acknowledged or honestly held | Breath |
| **Offer** | Structure proposed as chips | Breath → scan |
| **Adjust** | User correcting one or more chips | Scan |
| **Commit** | User affirms structure (explicit or by drift) | Scan |
| **Hold** | Durability or inference pending | Honest hold |
| **Reflect** | User reviews meaning, threads, patterns | Scan |
| **Recall** | User searches or navigates by meaning | Command |
| **Orient** | System situates recalled object in context | Scan |
| **Act** | User takes life action (complete, pay, schedule) | Scan or command |
| **Knock** | AI coaching or insight presented | Scan (quiet) |
| **Veil** | High-stakes confirm or protected focus | Veil |
| **Complete** | Terminal satisfaction for a unit of life work | Scan |
| **Correct** | User fixes past settled truth | Scan + hand-back |
| **Archive** | User removes from active attention without lying about history | Scan |
| **Hand-back** | Recovery transient; returns to prior state | Neutral |

### Canonical transition map

```text
                    ┌─────────┐
                    │  Idle   │
                    └────┬────┘
                         │ notice
                         ▼
                    ┌─────────┐
         ┌─────────│  Catch  │─────────┐
         │         └────┬────┘         │
         │ drift        │ settle       │ veil (stakes)
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐    ┌─────────┐
    │  Drift  │   │ Settle  │    │  Veil   │
    └────┬────┘   └────┬────┘    └────┬────┘
         │             │              │
         │             ├──── hold ────┤
         │             ▼              │
         │        ┌─────────┐         │
         │        │  Hold   │         │
         │        └────┬────┘         │
         │             │ resolved     │
         │             ▼              ▼
         │        ┌─────────┐    settle / hand-back
         └───────►│  Offer  │◄────────┘
                  └────┬────┘
                       │ adjust*
                       ▼
                  ┌─────────┐
                  │ Adjust  │
                  └────┬────┘
                       │ commit
                       ▼
                  ┌─────────┐     knock (window open)
                  │ Commit  │──────────────────┐
                  └────┬────┘                  ▼
                       │                ┌─────────┐
                       │                │  Knock  │
                       │                └────┬────┘
                       │                     │ dismiss / act
                       ▼                     ▼
                  ┌─────────┐            ┌─────────┐
                  │Reflect  │◄───────────│   Act   │
                  └────┬────┘            └─────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Recall  │──►│ Orient  │   │Complete │
    └────┬────┘   └────┬────┘   └─────────┘
         │             │
         │             ├──► Correct ──► hand-back
         │             │
         │             └──► Archive
         │
         └──────────────────────────────► Idle
```

### Loop summary

**Ingress loop:** Notice → Catch → Settle → (Offer → Adjust* → Commit)

**Honesty loop:** Settle ↔ Hold until resolved

**Review loop:** Reflect → Recall → Orient → Act | Complete | Correct | Archive

**AI loop:** Knock ⊂ (Reflect | Orient) when window open

**Protection loop:** Veil → Settle | Hand-back

**Recovery loop:** Any recoverable state → Hand-back → prior state

Catch and Settle are the **sacred spine**. Every other state is optional in a given session but must remain grammatically valid.

### State invariants

Catch may not transition to Offer before Settle (raw save first).

Knock may not enter from Catch, Hold, or Veil.

Complete is satisfaction, not gamification — no casino without proportional stakes.

Archive is honest removal from active attention, not silent delete without recovery path where governance requires.

Correct always preserves provenance of what changed.

---

## Recognizability test

AIIMIN interaction is working when:

A user describes their session without UI nouns: *"I exhaled, it caught it, fixed the date chip, forgot about it, recalled it Tuesday."*

A designer can name invalid flows using grammar, not taste.

An engineer can map states to Chapter 09 without inventing parallel vocab.

A tired human catches a pulse in six seconds and feels **lighter** — not faster alone, **lighter**.

---

## Relationship to Chapters 09–12

| Chapter | Encodes from this document |
|---------|---------------------------|
| **09 — Interaction System** | Grammar, hierarchy, models, state machine, laws (as interaction invariants) |
| **10 — Component System** | Nouns as component families (Chip, Anchor, Veil, etc.) — contracts only |
| **11 — Visual System** | Tones (breath, scan, command, ritual) as density and token modes |
| **12 — Motion System** | Settle/hold/knock motion sentences — never before catch settles |

This document is the **foundation**. Chapters 09–12 are the **codification**. Governance remains the **law**.

---

## Changelog

**2026-07-22** — Initial Interaction Language. Synthesized from pre-design study and frozen P8 operational model. No P8 rules. Not frozen.

---

*End of Interaction Language. Do not freeze. Do not generate P8 rules from this document without explicit authoring pass.*
