# P9 Phase 1 — Interaction Foundation

```yaml
document: P9 Interaction Architecture — Phase 1
title: Interaction Foundation
version: P9 v0.2-remediated
status: FROZEN
freeze_date: 2026-07-23
freeze_certificate: P9_Phase1_Freeze_Certificate.md
supersedes: P9 v0.1 Foundation Draft
remediation_source: 02_Phase1_FOUNDER_REVIEW.md (PASS WITH REMEDIATION)
ratification: 03_Phase1_FREEZE_READINESS.md (PASS · APPROVE FREEZE)
confidence: High — FROZEN
parent: P8 Master Product Specification v1.0 (PUBLISHED — IMMUTABLE)
inherits:
  - P8 Ch 02 — Core Product Philosophy
  - P8 Ch 05 — Core Objects & Data Model
  - P8 Ch 06 — Capture System
  - P8 Ch 07 — AI Architecture
  - P8 Ch 09 — Interaction System (Exhale Interaction)
  - P8 Research RL-001…RL-004 (explanatory; not law)
forbids: screens · UI · color · typography · components · P8 redesign · ordinary amendment of this frozen doctrine
amendment: Founder ADR for P9 only
```

---

# Mission statement

AIIMIN interaction is the operating model for every exchange between a human under cognitive load and a Personal Life OS that catches life, connects memory, and coaches with honesty.

P8 already froze **what must be true** (Exhale Interaction, sacred spine, laws, non-negotiables).  
P9 Phase 1 defines **how the product behaves** as a complete interaction architecture — the foundation every future screen, flow, and client must implement without reinventing grammar.

---

# Constitutional posture

| Rule | Statement |
|------|-----------|
| **Inheritance** | P9 inherits P8 Chapter 09 Exhale Interaction and all frozen P8 interaction rules (`P8-R-139`…`P8-R-150`) |
| **Non-amendment** | P9 MUST NOT contradict P8. Conflict → P8 wins until Founder ADR |
| **Vocabulary lock** | **Catch** = interaction **verb** for receiving a Pulse. **Capture** = P8 Ch 06 system/pipeline **and** Ch 02 existence **outcome** — never an interaction object, never synonym of Catch. Session container = **Catch Session** (Object) |
| **Ontology law** | Every interaction concept has exactly one primary class: Verb · State · Object · Outcome · Signal (§0) |
| **Outcomes** | Every interaction MUST serve Relief (after catch), Clarity (after review), or Agency (after coaching) — P8 Ch 02 / Ch 09. Connect and Coach are existence **outcomes**, not peer grammar verbs |
| **Scope of this draft** | Philosophy · Layers · Objects · Grammar · Universal Rules · States · Principles only |

---

# 0. Ontology Law

Every interaction concept MUST declare exactly one **primary class**. It MAY reference other classes. It MUST NOT have two constitutional owners.

| Primary class | Meaning | Examples |
|---------------|---------|----------|
| **Verb** | Legal move in a sentence | Catch, Settle, Offer, Adjust, Act, Knock, Hand-back |
| **State** | Constitutional grammar position (what human/system are doing) | Idle, Catch, Offer, Veil, Hold, Drift |
| **Object** | Participant in sentences (behavioral thing) | Person, Pulse, Offer, Chip, Entity, Catch Session, Veil |
| **Outcome** | Existence or emotional result — not a peer grammar verb | Capture · Connect · Coach (Ch 02); Relief · Clarity · Agency |
| **Signal** | Runtime condition overlay (not constitutional grammar) | Loading, Thinking, Offline, Failed, Acknowledged, Partial, Conflict |

**Owner rule:** When a term appears in more than one column historically (P8 vocabulary), P9 assigns a **primary** class below. Secondary uses are referential only.

| Term | Primary class | Secondary (referential only) |
|------|---------------|------------------------------|
| Catch | Verb | State (during ingress) |
| Settle | Verb | Cross-layer **outcome** of truth landing — not a layer |
| Hold | State | — |
| Offer | Object | Verb (system proposes); State (during Offer) |
| Chip | Object | — |
| Veil | State | Object (protected scope instance) |
| Hand-back | Verb | Object (recovery window instance) |
| Knock | Verb | State (during Knock) |
| Review | Object (session) | Verb = enter Review session |
| Capture | Outcome (+ Ch 06 pipeline name) | **Never** Verb; **Never** Object |
| Connect | Outcome | Affirmed via Thread/Offer chips — not peer Verb |
| Coach | Outcome | Delivered via Knock — not peer Verb |
| Loading | Signal | Never Hold |
| Thinking | Signal | Never Settle gate |
| Acknowledged | Signal | Transient flash after true Settle only |

Conflict → primary class wins; Founder ADR to change primary.

---

# 1. Interaction Philosophy

## 1.1 Purpose of interaction

Interaction exists so one human can:

1. **Exhale life into the system** without becoming a data-entry clerk  
2. **See truth land** (Settle) or see honesty (Hold / Failed) without theater  
3. **Correct structure cheaply** after the fact  
4. **Act on connected memory** without losing sovereignty  
5. **Receive intelligence that knocks** — never hijacks  

Interaction is not engagement. Interaction is **momentum under load**.

## 1.2 Principles (philosophy layer)

These are philosophical commitments. Section 7 elevates them to constitutional interaction principles.

| Commitment | Meaning |
|------------|---------|
| **Exhale first** | Life enters before organization. Structure waits its turn |
| **Truth over theater** | Pending looks pending. Done looks done. Failure looks like failure |
| **Human sovereignty** | Offers and Knocks are dismissible without penalty |
| **Correctable intelligence** | Inference is provisional until Commit; never silent authority |
| **One Anchor** | One primary act per moment |
| **Dignity always** | Empty, error, offline, and recovery never shame |

## 1.3 Human-first behavior

Human-first means the human is the **subject** of the minimum valid sentence:

```text
Human · Catch · Pulse · Settle
```

| Obligation | Behavior |
|------------|----------|
| **Initiative default** | Human opens sessions; system does not open with coaching |
| **Authority default** | Human may dismiss, adjust, ignore, drift, hand-back |
| **Speed default** | Recoverable acts settle optimistically |
| **Attention default** | One focal decision at a time |
| **Privacy default** | High-stakes and safety/legal fields never inferred |

Human-first does **not** mean the system is passive forever. It means initiative is earned.

## 1.4 AI-first behavior

AI-first (P8 Ch 01 / Ch 07) means intelligence is a **core operating layer**, not a bolt-on chatbot.

| Obligation | Behavior |
|------------|----------|
| **Roles declare** | Every AI move states role: Router · Inferencer · Analyzer · Coach · Composer (Ch 07) |
| **Post-Settle structure** | Parser/Inferencer run after raw Settle — never as gate before Catch |
| **Offer posture** | Structure appears as Offers/Chips — visible, provisional, correctable |
| **Confidence honesty** | Confidence bands (P8 Ch 07) gate action: auto-fill with correction when permitted · confirm when uncertain · ask when blocked · never infer safety/legal |
| **Non-authority** | AI never silently applies structured mutation without Offer |
| **Not system of record** | Chat thread MUST NOT be the life record |

AI-first ≠ always talking. AI-first = always ready to understand, never eager to interrupt.

## 1.5 Mixed-initiative behavior

Mixed-initiative is the **contract between human-first and AI-first**.

| Who initiates | When allowed | Form |
|---------------|--------------|------|
| **Human** | Always | Catch · Recall · Act · Ask · Search · Review |
| **System (silent)** | After Settle | Parse · Link · Infer (infrastructure; no first-person speech) |
| **System (Knock)** | Interruptibility window open | Coach suggestion with provenance + single action or dismiss |
| **System (Clarifier)** | Only when blocked | One minimal question — never before first Settle |

**Hard bans:**

- System takes two focal turns in a row without human reply (INV-10)  
- Knock during Breath Catch or Veil  
- Re-knock of dismissed content in same session  
- AI as always-on companion personality  

## 1.6 Cognitive load philosophy

AIIMIN exists for a human **under cognitive load** (P8 Ch 01 / Ch 02).

| Rule | Statement |
|------|-----------|
| **Reduce at Catch** | Law of the Exhale — Pulse MUST reduce load the moment it is caught |
| **Tone by mode** | Breath (catch) · Scan (review) · Command (power) · Ritual (brand only) — no cross-contamination by default |
| **Defer decisions** | Infer then chip before asking (GOV-123 / GOV-126) |
| **Progressive disclosure** | Friction rises with stakes — not with vanity |
| **Latent discipline** | Threads and insights wait — no self-promotion to focal |

Cognitive load is the primary performance budget of interaction — above novelty.

## 1.7 Friction philosophy

Friction is a **designed cost**, not a default.

| Stakes | Friction form | After |
|--------|---------------|-------|
| Trivial | Act → Settle | Hand-back available |
| Recoverable | Optimistic Settle | Hand-back window |
| Medium bulk | Pause then Settle | Hand-back available |
| Destructive | Veil → Confirm → Settle | No Hand-back after Typed Veil |
| Peak / privacy | Typed Veil → Confirm → Settle | No Hand-back |

**Laws:**

- Recoverable acts MUST prefer Hand-back over Veil  
- Irreversible acts MUST NOT Settle without Veil  
- Fear copy on recoverable acts is forbidden  
- Generic system confirm for product destructive paths is forbidden  

## 1.8 Speed philosophy

| Priority | Rule |
|----------|------|
| **Time-to-Settle** | Sacred for Catch — ceremony-free; motion MUST NOT delay Settle |
| **Optimistic default** | Recoverable writes MAY commit immediately |
| **Certainty exception** | Irreversible · privacy of another · beyond undo · safety/legal |
| **Honest latency** | Hold is legal; fake Settle is not |
| **Accelerators** | Progressive enhancement only — Catch reachable without shortcuts |

Speed serves **relief**. Certainty serves **trust**. The stakes ladder decides which wins.

## 1.9 Trust philosophy

Trust is produced by **predictable honesty**, not by polish.

| Trust source | Interaction obligation |
|--------------|------------------------|
| **Durability honesty** | Settle ≠ Hold ≠ Failed — always distinct |
| **Provenance** | User can always answer: why did the system do that? |
| **Correctability** | Wrong inference is cheaper to fix than to prevent at ingress |
| **Sovereignty** | Dismiss without penalty |
| **Verb truth** | Same verb = same act on every surface |
| **No shame** | Empty / error / recovery preserve dignity |
| **No silent wrongness** | Auto-applied structure without Offer forbidden |

Long-term trust beats short-term engagement hacks (P8 optimize/avoid matrix).

---

# 2. Interaction Layers

The interaction stack is the **default ingress interaction path**. Layers are architectural — not screens.

```text
Layer 1  Human Intent
    ↓
Layer 2  Catch (Ingress)
    ↓
Layer 3  Understanding
    ↓
Layer 4  Decision
    ↓
Layer 5  Presentation (Attention)
    ↓
Layer 6  Execution
    ↓
Layer 7  Learning
```

**Settle is not a layer.** Settle is a **cross-layer outcome**: truth landed (or must transition to honest Hold / Failed). Any layer that mutates life truth MUST end in Settle, Hold, or Failed — never fake completion.

## 2.1 Scope of the full stack

The seven-layer path above is **mandatory for ingress** (Pulse entering life). It is **not** claimed as the linear order of every exchange.

Non-ingress interactions use **legal subsequences** of the same layers (and P8 contracts). They MUST NOT invent parallel stacks.

## 2.2 Legal subsequences (non-ingress)

| Class | Legal subsequence | Notes |
|-------|-------------------|-------|
| **Review** | Intent → Presentation (Orient) → Decision → Execution → Learning | Recall/Reflect; no Catch required unless new Pulse |
| **Knock** | Presentation → Decision → (Execution) → Learning | Only when interruptibility open; no Catch |
| **Hand-back** | Decision → Execution → Learning | Restores prior settled world; no new Catch |
| **Recall / Search** | Intent → Presentation (Orient) → (Decision → Execution)* | Blind mutation without Orient forbidden |
| **Clarifier Ask** | Presentation → Intent → Catch → … (rejoin ingress from Layer 2) | Only when blocked; never before first Settle of the parent ingress |
| **Offline recovery / Retry** | Decision → Execution → Learning | May re-enter Understanding if re-infer needed after Settle |
| **Veil confirm** | Decision → Execution | Closed interruptibility; Confirm → Settle or Cancel |

Ingress remains the only class that MUST traverse Layer 2 Catch before Understanding Offers.

## Layer contracts

### Layer 1 — Human Intent

| Field | Contract |
|-------|----------|
| **Job** | Notice that life is worth recording or retrieving |
| **Inputs** | Sensation, thought, obligation, query, interruption from life |
| **Outputs** | Intent signal (speak / type / command / select / open Recall) |
| **Owner** | Human |
| **Must not** | Require taxonomy, mode picker, or AI greeting before intent can start |

### Layer 2 — Catch (Ingress)

| Field | Contract |
|-------|----------|
| **Job** | Receive Pulse with ceremony-free raw persistence |
| **Inputs** | Intent expression (text, voice, ambient, local surface ingress) |
| **Outputs** | Settled Pulse **or** honest Hold (Settle/Hold = outcomes, not layers) |
| **Owner** | System Catch + human Anchor |
| **Sacred spine** | Notice → Catch → Settle is mandatory for every ingress |
| **Must not** | Gate on Offer, Knock, taxonomy, or performance theater |
| **Vocabulary** | This layer is **Catch**, not Capture. Capture names Ch 06 pipeline / Ch 02 outcome only |

### Layer 3 — Understanding

| Field | Contract |
|-------|----------|
| **Job** | Parse intent, route entities, infer structure, assemble context |
| **Inputs** | Settled Pulse + life graph + confidence bands (P8 Ch 07) |
| **Outputs** | Candidate Offers · Thread candidates · clarifier need (rare) |
| **Owner** | AI Router / Inferencer / Analyzer (silent infrastructure) |
| **Must not** | Speak as companion; apply structure silently; run before Settle on ingress |
| **Timing** | Always post-Settle for ingress; may assemble context on Review without new Catch |

### Layer 4 — Decision

| Field | Contract |
|-------|----------|
| **Job** | Choose what becomes life truth vs provisional vs blocked |
| **Inputs** | Offers · stakes · confidence · human Adjust / Commit / Dismiss |
| **Outputs** | Commit · Veil path · Clarifier · Dismiss · Drift |
| **Owner** | Human final authority; system proposes |
| **Must not** | Auto-commit irreversible acts; treat Hold as Commit |

### Layer 5 — Presentation (Attention)

| Field | Contract |
|-------|----------|
| **Job** | Allocate attention across Focal · Peripheral · Latent · Recalled |
| **Inputs** | Decision products + tone (Breath / Scan / Command / Ritual) |
| **Outputs** | What the human may notice without hunting |
| **Owner** | Interaction architecture (not visual design) |
| **Must not** | Split focal attention across two equal decisions; promote Latent during Catch or Veil |
| **Note** | “Presentation” means **attention allocation**, not layout or chrome. On Review subsequences, this layer often precedes Decision |

### Layer 6 — Execution

| Field | Contract |
|-------|----------|
| **Job** | Mutate life: complete, schedule, pay, archive, share, delete (and reserved Delegate when product allows) |
| **Inputs** | Affirmed Act + stakes ladder |
| **Outputs** | Settle · Hand-back window · Veil result · Failed · Conflict (outcomes / signals) |
| **Owner** | Human-initiated Act; system durability |
| **Must not** | Skip Veil on irreversible; skip Hand-back preference on recoverable |

### Layer 7 — Learning

| Field | Contract |
|-------|----------|
| **Job** | Remember connections, patterns, preferences; improve future Offers and Knocks |
| **Inputs** | Commits · dismissals · corrections · Reflect / Recall outcomes |
| **Outputs** | Better Threads · better confidence · quieter Knocks · personalization (Ch 18) |
| **Owner** | System memory + human correction signal |
| **Must not** | Punish dismissal; re-knock dismissed content same session; invent vanity engagement loops |

## Layer invariants

1. For ingress: Layers 2→3 order is sacred — Catch Settles before Understanding Offers  
2. Layer 5 never invents a second Anchor  
3. Layer 6 stakes climb only when Hand-back cannot restore prior world  
4. Layer 7 never overrides Layer 1 sovereignty  
5. Settle is a cross-layer outcome; Hold is a constitutional State; Failed is a Signal — never layers and never interchangeable with each other or with Loading

# 3. Primary Interaction Objects

Interaction objects are **things that participate in sentences**. They are not database tables and not UI components. Primary class = **Object** (§0) unless noted.

Life entities (P8 Ch 05) are the graph substrate. **Entity** is the sole constitutional graph Object. Domain kinds (Document, Event, Task, Journal, …) are **entity kinds** under Entity — not peer interaction objects and not competing owners.

## 3.1 Object catalog

### Person

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | The human subject of the life graph — sole sovereignty holder |
| **Lifecycle** | Onboard → Active → Adapt → Export/Delete (Ch 15 / Ch 20) |
| **Interaction responsibility** | Initiates Catch/Recall/Act; dismisses Offers/Knocks; owns Confirm on Veil |

### Intent

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | What the human means before full structure exists |
| **Lifecycle** | Notice → Express → Route → Resolve (or abandon via Drift) |
| **Interaction responsibility** | Drives Layer 1; MUST be catchable without taxonomy |

### Pulse

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Raw human expression before full structure — highest-fidelity ingress signal |
| **Lifecycle** | Notice → Catch → Settle|Hold → (Offer path) → Commit|Drift |
| **Interaction responsibility** | Focal content during Breath Catch; MUST Settle or honestly Hold |

### Catch Session

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Session container for one ingress: Pulse moves through ceremony-free raw save into Entity structure |
| **Lifecycle** | Open → Catch → Settle\|Hold → (Offer path) → Close |
| **Interaction responsibility** | Owns the ingress session boundary; implements Ch 06 pipeline behavior without naming Capture as an Object |
| **Vocabulary** | **Not** Capture. Capture remains Ch 06 pipeline name + Ch 02 Outcome only |

### Offer

| Field | Definition |
|-------|------------|
| **Primary class** | Object (primary); Verb/State secondary per §0 |
| **Purpose** | Provisional structure proposed after Settle |
| **Lifecycle** | Emit → Visible → Adjust*|Dismiss|Commit → Close |
| **Interaction responsibility** | Peripheral; dismissible; never silent auto-assign |

### Chip

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Atomic correction unit — one field or link |
| **Lifecycle** | Appear → Edit/Accept/Dismiss → Commit field |
| **Interaction responsibility** | Correction cheaper than forms; MUST NOT open multi-step maze |

### Anchor

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | The single primary action in a moment |
| **Lifecycle** | Declared for moment → Completed or superseded by legitimate state change |
| **Interaction responsibility** | Exactly one per moment; competing focals forbidden |

### Suggestion

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | AI coaching or insight unit presented via Knock (Coach **Outcome** payload) |
| **Lifecycle** | Eligible → Knock → Act|Dismiss → (session-closed if dismissed) |
| **Interaction responsibility** | Requires open window + provenance + single action; no same-session re-knock |

### Conversation

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Clarifier-only subordinate exchange — never system of record |
| **Lifecycle** | Open clarifier → Catch answer → Settle → Close |
| **Interaction responsibility** | NEVER opens session as companion; Composer drafts (if any) MUST Settle into Entity outside Conversation SoR |

### Reminder

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Time-bound attention request tied to an Entity |
| **Lifecycle** | Schedule → Fire → Act|Snooze|Dismiss → Settle |
| **Interaction responsibility** | Must earn attention; no nag loops |

### Thread

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Remembered connection between Entities (Connect **Outcome** realized as edge) |
| **Lifecycle** | Latent at ingress → Revealed in Recall/Reflect → Confirm|Dismiss link |
| **Interaction responsibility** | Latent during Catch; never demanded at ingress. Memory (Ch 07) is AI architecture — not a peer Object here |

### Notification

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Externalized attention claim (Ch 16) |
| **Lifecycle** | Qualify → Deliver → Open|Dismiss → Interact → Close |
| **Interaction responsibility** | Interruptibility + deserve-attention law; deep-link into grammar, not orphan chrome |

### Entity

| Field | Definition |
|-------|------------|
| **Primary class** | Object |
| **Purpose** | Canonical life-graph node (P8 Ch 05) — sole constitutional graph Object |
| **Lifecycle** | Raw → Structured → Active → Archive|Delete (behavioral; storage enum FB open) |
| **Interaction responsibility** | Object of Recall/Act/Archive/Delete; ownership always Person |
| **Entity kinds (not peer Objects)** | Document · Event · Task · Journal · Knowledge/Notes · and other Ch 05 classes — kinds under Entity only. No competing ownership with Entity |

### Review

| Field | Definition |
|-------|------------|
| **Primary class** | Object (session); Verb secondary = enter this session |
| **Purpose** | Human session of meaning-making over settled life |
| **Lifecycle** | Orient → Recall → Reflect → Act*|Complete → Settle |
| **Interaction responsibility** | Produces Clarity; Scan tone; Knocks may be quiet if window open |

### Hold

| Field | Definition |
|-------|------------|
| **Primary class** | State (not Object) — listed for lifecycle clarity only |
| **Purpose** | Honest pending — sync, inference, or durability incomplete |
| **Lifecycle** | Enter Hold → Resolve to Settle|Failed|Conflict → Exit |
| **Interaction responsibility** | MUST NOT wear Settle clothes; MUST NOT mean Loading |

### Veil

| Field | Definition |
|-------|------------|
| **Primary class** | State; Object secondary = protected-scope instance |
| **Purpose** | Protected scope for high-stakes confirm or focus |
| **Lifecycle** | Enter → Confirm|Cancel → Settle or return |
| **Interaction responsibility** | Closed interruptibility; Typed Veil at peak; no Hand-back after Typed confirm |

### Hand-back

| Field | Definition |
|-------|------------|
| **Primary class** | Verb; Object secondary = recovery-window instance |
| **Purpose** | Recovery without shame — undo/revert/correct |
| **Lifecycle** | Available window → Invoke → Prior world Settle |
| **Interaction responsibility** | Prefer over Veil for recoverable; no fear copy. Platform “Undo” maps here — not a separate constitutional Verb |

## 3.2 Object relationship (interaction view)

```text
Person owns Intent
Intent becomes Pulse
Pulse enters Catch Session via Catch
Catch produces Settle | Hold (outcomes)
Understanding emits Offer + Chip (+ latent Thread)
Decision yields Commit | Dismiss | Veil
Execution mutates Entity (by kind: Document, Event, Task, …)
Learning updates Thread eligibility + future Suggestion eligibility
Notification / Reminder re-enter via Orient → Act
Conversation (clarifier) is subordinate loop only
Capture = Outcome / Ch 06 pipeline name — never appears as Object
```

---

# 4. Interaction Grammar

Grammar defines **verbs** — the only legal moves — with owner, meaning, allowed transitions, and forbidden transitions.

Canonical P8 verbs remain authoritative. P9 does **not** invent new verbs. Existence outcomes (Capture · Connect · Coach) are **Outcomes** (§0), not peer Verbs. Platform Undo maps to Hand-back.

## 4.1 Sentence form (locked)

```text
[Subject] + [Verb] + [Object] + [Outcome]
```

Minimum valid ingress sentence:

```text
Human · Catch · Pulse · Settle
```

## 4.2 Verb catalog

### Catch

| Field | Value |
|-------|-------|
| **Owner** | System (receive) + Human (express) |
| **Meaning** | Receive Pulse with ceremony-free raw save intent |
| **Allowed from** | Idle · Notice · Orient (local ingress) · Command (catch-from-command) |
| **Allowed to** | Settle · Hold · Drift |
| **Forbidden to** | Offer · Knock · Commit-of-structure before Settle · Veil |
| **Notes** | Not synonym of Capture. Catch → Veil removed (undefined; high-stakes content uses Act → Veil after Settle) |

### Settle

| Field | Value |
|-------|-------|
| **Owner** | System truth + Human acknowledgment |
| **Meaning** | Truth landed or is honestly acknowledged as durable for this unit (cross-layer outcome expressed as Verb) |
| **Allowed from** | Catch · Adjust · Act · Confirm · Hand-back · Hold (when resolved) |
| **Allowed to** | Offer · Idle · Reflect · Orient · Complete · Hold (only when durability becomes pending after a prior Settle — honesty re-label) |
| **Forbidden** | Presenting while durability unknown without Hold |

### Offer

| Field | Value |
|-------|-------|
| **Owner** | System |
| **Meaning** | Propose provisional structure beside user material |
| **Allowed from** | Settle (ingress) · Orient (review structure) |
| **Allowed to** | Adjust · Commit · Dismiss · Idle |
| **Forbidden from** | Catch before Settle · Veil · as silent mutation |

### Adjust

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Correct one or more Chips |
| **Allowed from** | Offer · Orient · Correct |
| **Allowed to** | Commit · Offer · Dismiss · Settle (field) |
| **Forbidden to** | Open multi-step form maze for single-field correction |

### Commit

| Field | Value |
|-------|-------|
| **Owner** | Human (explicit only) |
| **Meaning** | Affirm structure or mutation as life truth |
| **Allowed from** | Adjust · Offer · Act (low stakes) |
| **Allowed to** | Settle · Hold |
| **Forbidden** | Irreversible Commit without Veil · Commit by Drift · silent Commit |

### Recall

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Retrieve by meaning / query |
| **Allowed from** | Idle · Reflect · Command |
| **Allowed to** | Orient · Catch (if recall becomes new pulse) |
| **Forbidden to** | Skip Orient into blind mutation |

### Orient

| Field | Value |
|-------|-------|
| **Owner** | System |
| **Meaning** | Situate recalled object + Threads in attention |
| **Allowed from** | Recall · Knock (context) · Notification open · Search |
| **Allowed to** | Act · Reflect · Adjust · Archive · Idle |
| **Forbidden** | Dumping unrelated focal decisions |

### Act

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Life mutation (complete, pay, schedule, status change, share, delete, …). System performance of an affirmed Act is internal to Act — not a separate Verb |
| **Allowed from** | Orient · Offer (suggested act) · Knock (accepted) · Command |
| **Allowed to** | Settle · Hand-back window · Veil · Failed |
| **Forbidden** | Irreversible Act→Settle without Veil |

### Knock

| Field | Value |
|-------|-------|
| **Owner** | System (Coach role) |
| **Meaning** | Respectful AI entry when window open — delivers Coach **Outcome** |
| **Allowed from** | Reflect · Orient · Scan review · Command (open window) |
| **Allowed to** | Dismiss · Act · Adjust (rare) |
| **Forbidden from** | Catch · Hold · Veil · Breath ingress |
| **Forbidden** | Re-knock dismissed content same session |

### Dismiss

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Refuse Offer or Knock without penalty |
| **Allowed from** | Offer · Knock · Reminder · Notification |
| **Allowed to** | Idle · prior focal state |
| **Forbidden** | System punishing dismissal (guilt, score harm, nag) |

### Hand-back

| Field | Value |
|-------|-------|
| **Owner** | Human invoke · System restore |
| **Meaning** | Undo/revert recoverable Settle without shame. Platform “Undo” MUST map here |
| **Allowed from** | Post-recoverable Settle (within window) |
| **Allowed to** | Prior state → Settle |
| **Forbidden after** | Typed Veil confirm · true irreversible |
| **Notes** | Undo is **not** a constitutional Verb |

### Veil

| Field | Value |
|-------|-------|
| **Owner** | System gate · Human confirm |
| **Meaning** | Protected high-stakes confirm or focus |
| **Allowed from** | Act (destructive/privacy) · peak stakes |
| **Allowed to** | Confirm→Settle · Cancel→prior |
| **Forbidden** | Knock inside Veil · fear copy on recoverable paths · entry directly from Catch |

### Confirm

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Explicit affirmation inside Veil / medium-confidence band (P8 Ch 07) |
| **Allowed from** | Veil · Offer when confidence band requires confirm |
| **Allowed to** | Settle |
| **Forbidden** | Soft-confirm for Typed Veil stakes |

### Drift

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Leave in-progress Pulse without silent discard; preserves Catch Session for later return via Catch or Orient — not a Commit |
| **Allowed from** | Catch · Offer (in-progress) |
| **Allowed to** | Hold safe · Idle |
| **Forbidden** | Silent discard of unsettled Pulse · Commit by Drift · undefined Resume verb |

### Reflect

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Review meaning, Threads, patterns |
| **Allowed from** | Orient · Complete · Idle |
| **Allowed to** | Knock (if eligible) · Act · Archive · Idle |
| **Forbidden** | Turning Reflect into gamified debt |

### Complete

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Terminal satisfaction for a unit of work — not gamification |
| **Allowed from** | Act · Orient |
| **Allowed to** | Settle · Idle · Reflect |
| **Forbidden** | Casino celebration as obligation |

### Correct

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Fix past settled truth with provenance preserved |
| **Allowed from** | Orient · Reflect |
| **Allowed to** | Adjust → Settle · Hand-back where applicable |
| **Forbidden** | Erasing provenance of what changed |

### Archive

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Remove from active attention; keep honest history |
| **Allowed from** | Orient · Reflect · Act |
| **Allowed to** | Settle · Restore |
| **Forbidden** | Disguising delete as archive |

### Delete

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Destructive removal |
| **Allowed from** | Orient · Settings privacy paths |
| **Allowed to** | Veil → Confirm → Settle |
| **Forbidden** | Optimistic Settle without Veil · fake undo after Typed Veil |

### Restore

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Return archived (or recoverable deleted-within-policy) to active |
| **Allowed from** | Orient (archived Entity) · Hand-back window where policy allows |
| **Allowed to** | Settle |
| **Forbidden** | Silent restore of privacy-sensitive scope without Confirm when required |

### Search

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Query for retrieval |
| **Allowed from** | Idle · Command |
| **Allowed to** | Recall → Orient |
| **Forbidden** | Using Search as clarifier substitute for Ask |

### Ask

| Field | Value |
|-------|-------|
| **Owner** | Human (answer) · System (clarifier question) |
| **Meaning** | Clarifier question/answer when blocked |
| **Allowed from** | Clarifier loop after parent ingress has Settled once · Blocked condition |
| **Allowed to** | Catch (answer as Pulse) · Settle |
| **Forbidden** | Ask before first Settle of parent ingress |

### Create

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Explicit construction when human chooses structure-aware entry — still subordinate to sacred spine |
| **Allowed from** | Orient · Command · local surface |
| **Allowed to** | Catch (raw expression MUST Catch→Settle first) · then Offer/Adjust/Commit |
| **Forbidden** | Create → Offer or Create → Settle of structure without Catch→Settle of raw Pulse · teaching Create as peer-primary ingress · replacing universal Catch |

### Share

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Export or send artifact via platform share contracts (Act specialization) |
| **Allowed from** | Orient · Entity contexts |
| **Allowed to** | Platform chrome · Settle · Veil if irreversible externalization |
| **Forbidden** | Reinvented share that fights OS chrome |

### Retry

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Re-attempt Failed / Conflict resolution |
| **Allowed from** | Failed · Conflict |
| **Allowed to** | Prior Act path · Settle · Hold |
| **Forbidden** | Infinite silent retry without user visibility |

### Review

| Field | Value |
|-------|-------|
| **Owner** | Human |
| **Meaning** | Enter Review Object/session for Clarity |
| **Allowed from** | Idle · Complete · Notification |
| **Allowed to** | Recall · Reflect · Act |
| **Forbidden** | Review that interrogates like ingress Catch |

## 4.2.1 Outcomes (not verbs)

| Outcome | Realized by | Forbidden |
|---------|-------------|-----------|
| **Capture** (existence) | Catch Session + Catch → Settle | Using Capture as Verb or Object |
| **Connect** (existence) | Thread Offer/chip · Adjust · Commit | Peer Verb “Connect” in sentences |
| **Coach** (existence) | Knock → Dismiss \| Act | Peer Verb “Coach” in sentences |
| **Relief · Clarity · Agency** | Emotional contract | Shipping interactions that produce none |

## 4.2.2 Reserved (not v1 grammar)

| Term | Status |
|------|--------|
| **Delegate** | Reserved — not a shipping Verb until product scope confirms; no Delegated feedback presupposition in v1 |
| **Execute** | Removed — internalized into Act |
| **Undo** | Platform synonym of Hand-back only |
| **Resume** | Removed — return from Drift via Catch or Orient only |

## 4.3 Forbidden sentence patterns (locked)

| Invalid | Why |
|---------|-----|
| Offer → Catch | Structure before raw save |
| Catch → Knock | AI in Breath window |
| Catch → Veil | Undefined; high-stakes uses Act → Veil after Settle |
| Knock → Veil | AI breaks protected focus |
| Catch → Perform → Settle | Ceremony before commit |
| Commit by Drift | Drift preserves; does not affirm |
| Create → structured Settle (no Catch) | Bypasses sacred spine |
| Hold disguised as Settle | Dishonest durability |
| Loading treated as Hold | Axis collapse |
| Two Anchors | Competing focals |
| Adjust → form maze | Chip law violated |
| Chat as system of record | Life record corruption |
| Connect/Coach as peer Verbs | Outcomes only |

---

# 5. Universal Interaction Rules

Rules below apply **everywhere** — every client, every tone, every entity — unless a Founder ADR creates a scoped exception.

## 5.1 Loading

- Loading is a **Signal** (runtime condition) only — never a constitutional State  
- Loading MUST NOT map to Hold  
- Loading MUST NOT use Settle acknowledgment  
- Critical Catch path: prefer local Settle then sync Hold over blocking wait that risks lost Pulse  
- Shell/context fetch = Loading; durability/inference pending = Hold; AI prep = Thinking  

## 5.2 Saving

- Ceremony-free on Catch (Enter/primary save)  
- Raw save precedes organization  
- Feedback mandatory — silent save forbidden  
- Optimistic allowed only when Hand-back exists  

## 5.3 Hand-back (platform Undo)

- Recoverable mistakes prefer Hand-back  
- Platform Undo MUST invoke Hand-back — Undo is not a separate constitutional Verb  
- Window must be usable without fear  
- Hand-back itself MUST NOT require secondary fear confirm  
- After Typed Veil confirm: no fake undo  

## 5.4 Back

- Platform back/gesture wins over reinvented back  
- Back MUST NOT silently discard unsettled Pulse — use Drift rules  
- Back from Veil = Cancel, not Confirm  

## 5.5 Cancel

- Cancel returns to prior settled world  
- Cancel of Veil abandons destructive Act  
- Cancel MUST NOT punish  

## 5.6 Confirmation

- Follow stakes ladder only  
- Confirm is for uncertainty or irreversibility — not for theater  
- Medium confidence (P8 Ch 07 bands) may require confirm before structured Settle  
- Peak privacy uses Typed Veil  

## 5.7 Destructive actions

- MUST enter Veil  
- MUST NOT use generic OS-only confirm as the product’s only gate when branded Veil is required (P8)  
- Typed Veil at peak / privacy  
- No Hand-back after Typed confirm  

## 5.8 Multi-select

- Multi-select is a **bulk Act** paragraph — one Anchor for the bulk operation  
- Medium bulk stakes: Pause before Settle  
- Mixed stakes in one selection: escalate to highest stake in set  
- Bulk delete ALWAYS Veil  

## 5.9 Empty state

- Every empty state MUST teach next legal verb (usually Catch or Recall)  
- MUST NOT shame, guilt, or fabricate fake data  
- Empty ≠ Failed ≠ Offline ≠ Loading  

## 5.10 Offline

- Offline is a first-class **Signal**  
- Catch MUST still attempt local Settle when platform allows  
- Sync pending = Hold, not Settle-of-remote  
- Conflicts surface as Conflict — never silent clobber without rules (Ch 14)  

## 5.11 Sync

- Sync honesty required (GOV-089 / Ch 14)  
- Remote success may upgrade Hold → Settle  
- Sync failure → Failed or Hold with Retry  
- Sync MUST NOT invent Offer spam  

## 5.12 Errors

- Errors are Failed or Blocked Signals with dignity  
- MUST offer Recovery path: Retry · Hand-back · Correct when legally available  
- MUST NOT blame the human for system failure  
- Error copy states what happened and what verb is legal next  

## 5.13 AI thinking

- Thinking is a **Signal** during Understanding / Coach prep  
- MUST NOT block Catch Settle  
- MUST NOT fake Settle of inference  
- MUST NOT be labeled Hold  
- Long thinking prefers peripheral indication over focal hijack  

## 5.14 AI confidence

- Confidence bands (P8 Ch 07) gate Offers and Acts  
- Uncertainty MUST be legible on Offers when uncertain  
- Safety/legal: never infer  
- High-confidence wrongness worse than low-confidence honesty  

## 5.15 Permission

- Permission prompts follow platform chrome  
- Product explains **why** before or with OS prompt when stakes high  
- Denied permission → Blocked with alternative Catch path when possible — not dead end without explanation  

## 5.16 Ownership

- Person owns life graph  
- AI never owns truth  
- Shared/family scopes (when product allows) escalate privacy stakes — Veil when another person’s data affected  

## 5.17 Feedback (universal)

- No interaction without feedback (GOV-077)  
- Feedback states truth using Settle · Hold · Failed · Review Required · Conflict · Offline — never fake Success  
- Transient **Acknowledged** Signal MAY flash only after true Settle  
- Motion may support feedback but MUST NOT replace it (Ch 12 bound)  

## 5.18 Focus and attention

- One Anchor per moment  
- Focus order follows grammar: Anchor → Pulse → Offers → secondary  
- Latent MUST NOT self-promote during Catch or Veil  

## 5.19 Accessibility (interaction quality)

- Accessibility is interaction quality — not a deferred audit (P8-R-148 / GOV-133)  
- Critical paths MUST remain operable without sole reliance on gesture-only or chord-only Catch or Veil (P8-R-147)  
- Settle, Hold, Failed, Conflict, and Blocked MUST be announcable as distinct truths where the platform supports announcements  
- Focus order and hit-target floors on critical paths are interaction obligations, not visual polish  

---

# 6. Interaction States

P9 defines a **dual-axis state model**:

1. **Constitutional states** — what grammar says the human/system are doing (P8 locked) — class **State**  
2. **Runtime Signals** — durability/network/initiative overlay — class **Signal**  

Both axes are required. Signals NEVER erase constitutional state truth. Loading NEVER equals Hold.

## 6.1 Constitutional states (P8 — immutable)

| State | Role |
|-------|------|
| Idle | Present; no active Pulse |
| Notice | Recognizes something worth recording |
| Catch | Pulse entering |
| Settle | Moment of truth acknowledgment (pairs with Settle Verb / cross-layer outcome) |
| Offer | Structure proposed |
| Adjust | Chip correction |
| Commit | Structure affirmed |
| Hold | Durability or inference pending — trust honesty only |
| Reflect | Meaning / Threads / patterns |
| Recall | Retrieve by meaning |
| Orient | Situate recalled object |
| Act | Life mutation |
| Knock | AI coaching presented |
| Veil | High-stakes protect |
| Complete | Terminal satisfaction |
| Correct | Fix past truth |
| Archive | Leave active attention |
| Hand-back | Recovery transient |
| Drift | Leave in-progress without silent discard |

**Sacred spine:** `Notice → Catch → Settle → (Offer → Adjust* → Commit)`

## 6.2 Distinguishing Hold · Partial · Failed · Conflict

| Term | Class | Definition |
|------|-------|------------|
| **Hold** | State | Truth not yet durable or inference not yet honest-complete; user must see pending — not done |
| **Partial** | Signal | Some fields/entities Settled; others still Holding — composition of truths, not a substitute for Hold |
| **Failed** | Signal | An Act, sync, or inference attempt ended unsuccessfully; recovery verbs apply |
| **Conflict** | Signal | Two competing truths need Decision; MUST NOT auto-clobber sovereignty |

## 6.3 Runtime Signals (overlay)

These may apply **during** constitutional states:

| Signal | Meaning | Typical pairs |
|--------|---------|---------------|
| **Normal** | No adverse overlay | Any |
| **Loading** | Fetching context / shell — **not Hold** | Idle · Orient · Recall |
| **Thinking** | AI Understanding/Coach prep — **not Hold**, not Settle gate | Post-Settle Offer prep · Reflect |
| **Acknowledged** | Transient flash **after true Settle only** | After Settle / Complete |
| **Warning** | Recoverable risk visible | Offer · Act · Sync |
| **Blocked** | Cannot proceed without human/system gate | Clarifier · Permission · Safety |
| **Offline** | No network; local rules active | Catch · Hold · Act (local) |
| **Conflict** | Competing truths need resolution | Sync · multi-device · concurrent edit |
| **Partial** | Mixed Settle/Hold across fields | Offer · Commit · Sync |
| **Review Required** | Medium-confidence or policy demands human review | Offer · Act |
| **Failed** | Act/sync/inference failed honestly | Any execution path |
| **Recovered** | Failed/Conflict resolved; truth restored | After Retry / Hand-back / merge |

**Removed:** Success (premature completion risk). **Acknowledged** replaces it and NEVER substitutes for Settle.

**Reserved / not v1:** Delegated Signal (awaits Delegate product scope).

## 6.4 Master composition rules

| Rule | Statement |
|------|-----------|
| **C1** | Every moment declares one constitutional state + one primary Signal |
| **C2** | Acknowledged NEVER replaces distinguishing Settle vs Hold |
| **C3** | Thinking NEVER occurs as a gate before first Catch Settle |
| **C4** | Offline + Catch MUST still honor local Settle\|Hold law |
| **C5** | Conflict MUST NOT auto-resolve against sovereignty without visible Decision |
| **C6** | Review Required is honest Offer/Hold posture — not shame |
| **C7** | Failed always exposes Retry or Hand-back or Correct when legally available |
| **C8** | Recovered returns to Normal + appropriate constitutional state |
| **C9** | Loading MUST NOT be labeled or treated as Hold |
| **C10** | Primary Signal is singular; Offline+Failed allowed only as Offline primary with Failed as secondary annotation — never two equal primaries |

## 6.5 Forbidden pairs (impossible / illegal combinations)

| Pair | Status | Why |
|------|--------|-----|
| Catch + Acknowledged | Forbidden | No completion flash before Settle |
| Catch + Thinking (as gate) | Forbidden | Thinking must not block Catch Settle |
| Catch + Veil | Forbidden | Use Act → Veil after Settle |
| Hold + Acknowledged | Forbidden | Pending is not done |
| Loading + Hold (as synonyms) | Forbidden | Axis collapse |
| Veil + Knock | Forbidden | Closed interruptibility |
| Veil + Thinking (focal) | Forbidden | No AI prep hijack inside Veil |
| Knock + Catch | Forbidden | Breath window closed |
| Settle (truth) + Failed (same unit, simultaneous primary) | Forbidden | Choose Failed or resolve to Hold then Failed — not both primary |
| Drift + Commit | Forbidden | Drift does not affirm |
| Review Required + Complete | Forbidden | Incomplete review is not Complete |
| Offline + remote-only Settle claim | Forbidden | Local Settle or Hold only |

## 6.6 State outcome mapping

| Human feels | Typical state pair |
|-------------|--------------------|
| Relief | Catch → Settle (+ Normal / Acknowledged) |
| Clarity | Orient/Reflect (+ Normal) |
| Agency | Knock → Act\|Dismiss (+ Normal) |
| Trust stress | Hold / Conflict / Failed — must stay honest, not decorative |

---

# 7. Interaction Principles

Constitutional-grade principles for every future surface. Downstream UX/Design/Engineering MUST cite these.

| ID | Principle | Statement |
|----|-----------|-----------|
| **IP-01 Predictability** | Same verb, same act, everywhere. No surprise mutations |
| **IP-02 Continuity** | Context survives navigation, Drift, and platform handoff; life is one graph |
| **IP-03 Reversibility** | Prefer Hand-back; climb to Veil only when irreversible |
| **IP-04 Honesty** | Settle, Hold, Failed, Conflict are distinct and legible |
| **IP-05 Minimal interruption** | Knocks earn attention; Breath and Veil windows stay closed |
| **IP-06 Progressive disclosure** | Reveal structure and friction by stakes — not by vanity |
| **IP-07 User authority** | Human dismisses, adjusts, ignores; AI proposes |
| **IP-08 AI transparency** | Provenance + confidence honesty on every Offer/Knock |
| **IP-09 Context preservation** | Orient before Act; Threads latent until recall/review |
| **IP-10 Attention respect** | One Anchor; Latent never self-promotes into Catch/Veil |
| **IP-11 Exhale first** | Catch → Settle before organization |
| **IP-12 Correction economy** | Chips beat forms; infer-then-correct beats interrogate-first |
| **IP-13 Dignity** | Empty, error, offline, recovery never shame |
| **IP-14 Platform body** | OS chrome wins for gestures/shells; AIIMIN wins for verbs/grammar |
| **IP-15 Outcome fidelity** | Ship only interactions that produce Relief, Clarity, or Agency |
| **IP-16 Operability** | Critical Catch/Veil/Settle/Hold/Failed paths remain operable without gesture-only or chord-only sole paths; truths announcable where platform allows (P8-R-147/148) |

### Principle precedence (when principles compete)

Inherit P8 Ch 09 §3.12 — condensed for P9 operators:

```text
P7 Governance
  → P8 frozen law
    → Human sovereignty
      → Truth (Settle/Hold/provenance/verb truth)
        → Catch reflex
          → Emotional contract (relief · clarity · agency)
            → Privacy / Veil
              → Interaction Decision Matrix (RL-004)
                → Language / Grammar research
```

Taste and competitor mimicry do not override this stack.

---

# Confidence

| Area | Confidence | Note |
|------|------------|------|
| Inheritance from P8 Ch 09 Exhale Interaction | **High** | Unchanged; remediations clarify only |
| Layer stack = ingress default + subsequences | **High** | W1 closed |
| Ontology law + Catch Session vocabulary | **High** | W3–W4 closed |
| Verb catalog (no outcome-verbs; no Execute/Undo/Resume) | **High** | W5–W6 closed |
| Dual-axis + forbidden pairs + Hold≠Loading | **High** | W7–W9 closed |
| Accessibility as interaction obligation | **High** | W10 closed |
| Deferred strategic product scope (Delegate, multi-select bans) | **Medium** | Explicitly unresolved FQs only |

**Interaction Integrity (post-remediation):** **92 / 100**  
**Phase Readiness (post-remediation):** **90 / 100**

---

# Founder Questions

Resolved by this remediation (removed from open list): FQ-6 Success→Acknowledged · FQ-7 Connect/Coach outcomes-only · FQ-8 Catch Session · FQ-9 Ontology law · FQ-10 ingress default layers · Create spine binding · Conversation clarifier-only · Catch→Veil removed · Commit-by-Drift forbidden · Resume removed · Delegate reserved · Loading≠Hold.

**Remaining unresolved strategic decisions only:**

| # | Question | Notes |
|---|----------|-------|
| FQ-1 | Confirm runtime Signal names (`Normal / Loading / Thinking / Acknowledged / …`) as official P9 vocabulary | Remediated model assumes yes; Founder may rename Signals without changing meanings |
| FQ-5 | Any Entity kinds where multi-select / bulk Act is forbidden entirely? | Deferred to Phase 2 after ratification — not blocking freeze of foundation |

---

# Potential interaction risks

| Risk | Why it matters | Mitigation in v0.2 |
|------|----------------|-------------------|
| **P8 dilution** | New vocabulary amends constitution | Non-amendment + Ontology law + Capture never Object |
| **Axis collapse** | Loading painted as Hold | C9 + §5.1 + §6.2 |
| **Catch/Capture synonym** | Breaks Ch 09 | Catch Session Object; Capture Outcome/pipeline only |
| **Chat SoR creep** | Conversation becomes life record | Clarifier-only Conversation |
| **Create as peer ingress** | Shadows Exhale | Create MUST Catch→Settle first |
| **Knock spam** | Trust collapse | Unchanged interruptibility laws |
| **Acknowledged misuse** | Fake Settle | Forbidden pairs + C2 |

---

# Recommendation

## FROZEN

Phase 1 frozen by `P9_Phase1_Freeze_Certificate.md` (2026-07-23).

This readiness document is historical. Authority = Freeze Certificate.

---

# READY FOR FINAL FOUNDER RATIFICATION

> **Superseded.** Freeze certificate issued. See `P9_Phase1_Freeze_Certificate.md`.

```text
Document : P9 Interaction Architecture — Phase 1 Interaction Foundation
Version  : P9 v0.2-remediated
Status   : FROZEN (certificate issued 2026-07-23)
Integrity: 93 / 100
Readiness: 95 / 100
```

---

## Change Log — v0.1 → v0.2-remediated

### W1 — Interaction Layers
| Field | Content |
|-------|---------|
| **Section** | §2 |
| **Before** | Seven-layer stack claimed for every meaningful exchange; Settle implied as Layer 2 output only |
| **After** | Stack = **default ingress path**; legal subsequences for Review / Knock / Hand-back / Recall / Clarifier / Retry / Veil; Settle = **cross-layer outcome**, not a layer |
| **Reason** | Founder W1 |

### W2 — Interaction Objects
| Field | Content |
|-------|---------|
| **Section** | §3 |
| **Before** | Document, Event, Task/Action as peer Objects beside Entity |
| **After** | Entity sole graph Object; Document/Event/Task/Journal/… = **entity kinds** under Entity |
| **Reason** | Founder W2 |

### W3 — Capture Ontology
| Field | Content |
|-------|---------|
| **Section** | §0 · §3 · posture |
| **Before** | Capture system object + Catch verb + Capture outcome |
| **After** | **Catch Session** Object; Capture = Outcome + Ch 06 pipeline name only; Catch = Verb |
| **Reason** | Founder W3 |

### W4 — Ontology Law
| Field | Content |
|-------|---------|
| **Section** | §0 (new) |
| **Before** | Implicit noun/verb/state overlap |
| **After** | Primary classes Verb · State · Object · Outcome · Signal; owner table |
| **Reason** | Founder W4 |

### W5 — Grammar Cleanup
| Field | Content |
|-------|---------|
| **Section** | §4 |
| **Before** | Connect/Coach/Execute/Undo peer verbs; Search/Ask glued; Create could Settle/Offer without Catch |
| **After** | Connect/Coach Outcomes only; Execute removed into Act; Undo = platform→Hand-back; Search≠Ask; Create MUST Catch→Settle first; Delegate reserved |
| **Reason** | Founder W5 |

### W6 — Transition Completeness
| Field | Content |
|-------|---------|
| **Section** | §4 Catch · Commit · Drift · forbidden table |
| **Before** | Catch→Veil rare; Commit-by-Drift; Resume undefined |
| **After** | Catch→Veil **removed**; Commit-by-Drift **forbidden**; Resume **removed** (return via Catch/Orient) |
| **Reason** | Founder W6 |

### W7 — Runtime Loading
| Field | Content |
|-------|---------|
| **Section** | §5.1 · §6 |
| **Before** | Loading maps to Hold or Thinking |
| **After** | Loading = Signal only; Hold = durability/trust State only; C9 |
| **Reason** | Founder W7 |

### W8 — State Model
| Field | Content |
|-------|---------|
| **Section** | §6.2–6.5 |
| **Before** | Dual-axis without forbid matrix; soft Hold/Partial/Failed/Conflict |
| **After** | Definitions table + forbidden pairs + C9/C10 |
| **Reason** | Founder W8 |

### W9 — Success State
| Field | Content |
|-------|---------|
| **Section** | §6.3 · §5.17 |
| **Before** | Success Signal |
| **After** | Success **removed**; **Acknowledged** after true Settle only |
| **Reason** | Founder W9 |

### W10 — Accessibility
| Field | Content |
|-------|---------|
| **Section** | §5.19 · IP-16 |
| **Before** | Focus order only |
| **After** | Universal rule + IP-16 operability/announcement obligations (no separate a11y subsystem) |
| **Reason** | Founder W10 |

### W11 — Philosophy Cleanup
| Field | Content |
|-------|---------|
| **Section** | §1.4 |
| **Before** | Numeric ≥70% / 40–70% / <40% bands in philosophy |
| **After** | Behavioral confidence honesty; bands cite P8 Ch 07 only |
| **Reason** | Founder W11 |

---

### 2026-07-23 — P9 Phase 1 FROZEN
- **What:** Official Freeze Certificate issued; Phase 1 interaction doctrine immutable without Founder ADR for P9
- **Why:** Final Founder Ratification PASS · Freeze Readiness APPROVE FREEZE
- **Files:** `P9_Phase1_Freeze_Certificate.md`, `01_Phase1_Interaction_Foundation.md`, `00_INDEX.md`
- **Status:** frozen
- **Notes:** Phase 2 authorized, not started. FQ-1 and FQ-5 intentionally deferred.

### 2026-07-23 — P9 v0.2-remediated
- **What:** Applied Founder remediations W1–W11 to Phase 1 Interaction Foundation
- **Why:** PASS WITH REMEDIATION → ready for final Founder ratification
- **Files:** `01_Phase1_Interaction_Foundation.md`
- **Status:** remediated — then frozen by certificate
- **Notes:** No P8 edits. No Phase 2. No redesign. No second review this pass.

### 2026-07-23 — P9 v0.1 Foundation Draft
- **What:** Created Interaction Foundation covering philosophy, seven-layer stack, interaction objects, verb grammar, universal rules, dual-axis states, and IP-01…IP-15 principles under immutable P8 v1.0
- **Why:** Post-constitution transition — Interaction Architecture begins; P8 remains sealed
- **Files:** `00_INDEX.md`, `01_Phase1_Interaction_Foundation.md`
- **Status:** superseded by v0.2-remediated
- **Notes:** No screens, UI, color, typography, or components. No P8 edits.
