# P9 Phase 2 — Interaction Flows

```yaml
document: P9 Interaction Architecture — Phase 2
title: Interaction Flows
version: P9 Phase 2 v0.3-founder-patched
status: FROZEN
freeze_date: 2026-07-25
freeze_certificate: 09_Phase2_FREEZE_CERTIFICATE.md
date: 2026-07-25
supersedes: P9 Phase 2 v0.2-structurally-patched
founder_review: 07_Phase2_FOUNDER_REVIEW.md (PASS WITH REMEDIATION)
founder_patch: F1 (Hold→Offer closed) · F2 (no unsolicited Knock during active F-STRUCTURE)
structural_patch: 05_Phase2_STRUCTURAL_READINESS.md (S1 · S2)
structural_regate: 06_Phase2_STRUCTURAL_REGATE.md (PASS)
freeze_readiness: 08_Phase2_FREEZE_READINESS.md (PASS · APPROVE FREEZE)
inherits: P9 Phase 1 Interaction Foundation v0.2-remediated (FROZEN)
phase1_freeze_certificate: P9_Phase1_Freeze_Certificate.md
parent_constitution: P8 Master Product Specification v1.0 (PUBLISHED — IMMUTABLE)
forbids: redefine Phase 1 · screens · UI · navigation layouts · components · typography · motion · APIs · schemas · implementation
owns: legal interaction-event sequences · flow classes · entry/interrupt/recovery/exit contracts
```

---

# Mission

Define **how interactions FLOW** — which sequences of interaction events may legally occur.

This phase answers: *What sequence of interaction events may legally occur?*  
Not: *What UI is shown?*

Phase 1 is **immutable**. Phase 2 **inherits** Ontology, Grammar, Layers, Universal Rules, States, Principles, and Philosophy. Phase 2 does **not** redefine them.

---

# Ownership boundary

| Layer | Owns | Phase 2 may |
|-------|------|-------------|
| **Interaction Law (Phase 1 — FROZEN)** | Ontology · verbs · states · Signals · principles · layer contracts · universal rules | **Reference only** |
| **Interaction Flow (Phase 2 — this doc)** | Flow classes · legal event sequences · entry/exit · interruption points · recovery paths · composition of flows | **Define** |
| **UX Architecture (future)** | Surface jobs · when a flow is offered on a surface · composition density | Cite flows; not invent grammar |
| **Visual Design (future)** | Tokens · layout · motion expression of States/Signals | Express; not invent sequences |
| **Engineering (future)** | APIs · persistence · sync engines · device transport | Implement; not invent interaction law |

**Reject from Phase 2:** screens, components, buttons, typography, navigation layouts, animations, engineering APIs, data models, implementation logic.

---

# 0. What a Flow is

A **Flow** is a named, legal sequence of Phase 1 Verbs / States / Signals that moves a human and the system from an **entry condition** to an **exit condition** without inventing new grammar.

| Term | Meaning |
|------|---------|
| **Flow** | Ordered interaction-event sequence under Phase 1 law |
| **Flow class** | Category of Flows sharing entry/initiative pattern |
| **Step** | One Verb or State transition (or Signal overlay) inside a Flow |
| **Interrupt point** | Step where another Flow may legally suspend, nest, or divert |
| **Recovery path** | Legal continuation after Failed · Conflict · Drift · Offline · Hand-back |
| **Exit** | Terminal condition: Idle · Complete · Settled world · Dismissed Knock · Cancelled Veil · preserved Drift |

Flows compose Phase 1 **legal subsequences**. They MUST NOT create parallel stacks.

---

# 1. Flow anatomy (required fields)

Every canonical Flow MUST declare:

| Field | Required content |
|-------|------------------|
| **ID** | Stable flow identifier (`F-*`) |
| **Class** | Taxonomy class (§2) |
| **Inherits** | Phase 1 subsequence / spine reference |
| **Entry conditions** | States/Signals/initiative that may open the Flow |
| **Legal sequence** | Ordered Verbs/States (Signals as overlays only) |
| **Interruption points** | Where nesting/suspension is legal; where forbidden |
| **Recovery paths** | Failed · Conflict · Drift · Offline · Hand-back continuations |
| **Exit conditions** | How the Flow ends legally |
| **Ownership** | Human / System / Mixed; which Phase 1 layer owns each segment |
| **Forbidden** | Explicit illegal shortcuts for this Flow |
| **Outcome served** | **Primary (required for shipping Flows):** at least one of Relief · Clarity · Agency. **Secondary (optional):** Trust · Honesty · Continuity · existence Outcomes (Capture · Connect · Coach) — only when a primary triad Outcome is also named |

---

# 2. Flow taxonomy

## 2.1 Coverage map

| Class | Flow IDs | Initiative |
|-------|----------|------------|
| **Ingress** | F-INGRESS-FIRST · F-INGRESS-REPEAT · F-STRUCTURE | Human |
| **Retrieval** | F-RECALL · F-SEARCH | Human |
| **Review** | F-REVIEW | Human |
| **Mutation** | F-ACT · F-VEIL · F-CREATE · F-BULK | Human |
| **AI-initiated** | F-KNOCK | System (Coach Outcome) |
| **Clarification** | F-CLARIFIER | System Ask → Human answer |
| **Deferred / interrupted** | F-DRIFT · F-INTERRUPT-NEST | Human or System (legal only) |
| **Recovery** | F-HANDBACK · F-ERROR · F-CONFLICT | Human (+ System restore) |
| **Continuity** | F-OFFLINE · F-LONG · F-CROSSDEVICE | Mixed |
| **Gate** | F-PERMISSION · F-NOTIFICATION | Mixed |
| **Reserved** | F-DELEGATE | Reserved — not shipping v1 |

**F-CREATE classification (canonical):** **Mutation.** Sequence still obligates Catch → Settle before structure (ingress hybrid *behavior* documented on the Flow — not a second taxonomy class). See §3.9.

First vs repeat ingress share the **same legal spine**. They differ only in Learning context (cold vs prior Threads/Offers) — not in grammar.

---

# 3. Canonical Flows

## 3.1 F-INGRESS-FIRST — First Catch Session

| Field | Contract |
|-------|----------|
| **Class** | Ingress |
| **Inherits** | Phase 1 sacred spine · Layer stack Layers 1→7 |
| **Entry** | Idle or Notice · Human Intent · no active Catch Session · Learning cold |
| **Legal sequence** | **Settle path:** Notice → Catch → Settle → (Thinking Signal overlay)* → Offer* → Adjust* → Commit* → Settle \| Hold → Learning → Idle \| Drift. **Hold path:** Notice → Catch → Hold → resolve → Settle → then Offer path above. Hold that resolves to Drift \| Failed \| Idle produces **no Offer**. Hold MUST NOT gate Offer. |
| **Interruption points** | After Settle: clarifier may open (F-CLARIFIER). Knock **forbidden** during Breath Catch · Hold · Veil. Knock only after Settle when interruptibility window open **and** not during active F-STRUCTURE Offer/Adjust (F-KNOCK · §3.3). Drift legal from Catch or in-progress Offer (F-DRIFT). Veil **forbidden** from Catch. |
| **Recovery** | Hold → sync/resolve → Settle (Offer path then legal); Hold → Drift \| Failed \| Idle → **no Offer**; Failed → F-ERROR; Offline during Catch → F-OFFLINE |
| **Exit** | Settled Pulse (Relief) · honest Hold (no Offer while Holding) · Drift-preserved Catch Session · Idle |
| **Ownership** | L1 Human · L2 Catch mixed · L3 System silent · L4 Human authority · L5 attention · L6 if Act follows · L7 System+Human signal |
| **Forbidden** | Offer before Settle · Offer while Hold unresolved · Offer after Hold→Drift/Failed/Idle · Knock in Catch · Knock during active F-STRUCTURE Offer/Adjust · Create replacing Catch · taxonomy gate |
| **Outcome** | **Primary:** Relief · **Secondary:** Capture existence |

| Field | Contract |
|-------|----------|
| **Class** | Ingress |
| **Inherits** | Identical legal sequence to F-INGRESS-FIRST |
| **Entry** | Same as first · Learning has prior Commits/Dismissals/Threads |
| **Legal sequence** | Same spine as F-INGRESS-FIRST |
| **Difference** | Offers/Threads may be higher quality; still provisional; still dismissible; still post-Settle (never post-Hold-only) |
| **Interruption / Recovery / Exit / Forbidden** | Same as F-INGRESS-FIRST (including Hold→Offer ban · no unsolicited Knock during active structure) |
| **Outcome** | **Primary:** Relief · **Secondary:** Capture |

## 3.3 F-STRUCTURE — Post-Settle structure paragraph

| Field | Contract |
|-------|----------|
| **Class** | Ingress (body) |
| **Inherits** | Offer → Adjust* → Commit |
| **Entry** | Parent ingress has **Settled** once (not Hold-only) · Offer emitted or empty |
| **Legal sequence** | Offer → Adjust* → Commit → Settle \| Hold · or Dismiss → Idle/prior |
| **Interruption points** | Dismiss anytime · Drift from in-progress Offer · Clarifier if blocked mid-structure (rare). **Unsolicited Knock forbidden during active Offer/Adjust/structure work** (interruptibility closed for Coach). After structure Settled · Dismissed · or Idle, Knock may open only if interruptibility window open (F-KNOCK) — still never during Catch · Hold · Veil. |
| **Recovery** | Hand-back after recoverable Commit (F-HANDBACK) · Failed → F-ERROR |
| **Exit** | Structure Settled · Offer dismissed · Drift |
| **Ownership** | L3 propose · L4 Human · L5 peripheral Offers |
| **Forbidden** | Silent auto-assign · Adjust → form maze · Commit by Drift · **unsolicited Knock during active Adjust/structure** · entering structure from Hold without Settle |
| **Outcome** | **Primary:** Clarity · **Secondary:** Capture structure · Connect when Thread chips Commit |
| **Knock policy (canonical)** | Knock remains legal only after Settle and only when the interaction window is open. During active Adjust/Structure work: **no unsolicited Knock**. Compatible with Phase 1 Knock Forbidden-from Catch · Hold · Veil · Breath ingress — does not reopen those windows. |

## 3.4 F-RECALL — Recall → Orient

| Field | Contract |
|-------|----------|
| **Class** | Retrieval |
| **Inherits** | Phase 1 Recall subsequence |
| **Entry** | Idle · Reflect · Command · Human Intent to retrieve |
| **Legal sequence** | Intent → Recall → Orient → (Act \| Reflect \| Adjust \| Archive \| Idle)* |
| **Interruption points** | After Orient: F-ACT · F-REVIEW · F-KNOCK if window open · new Catch if recall becomes Pulse (rejoins F-INGRESS) |
| **Recovery** | Loading Signal during fetch ≠ Hold · Failed fetch → F-ERROR · Conflict on entity → F-CONFLICT |
| **Exit** | Idle · Act exit · Review continue · Catch Session opened |
| **Ownership** | L1 Human · L5 Orient · L4/L6 if Act |
| **Forbidden** | Blind mutation without Orient · treating Search as Ask |
| **Outcome** | **Primary:** Clarity |

## 3.5 F-SEARCH — Search retrieval

| Field | Contract |
|-------|----------|
| **Class** | Retrieval |
| **Inherits** | Search Verb → Recall → Orient |
| **Entry** | Idle · Command |
| **Legal sequence** | Search → Recall → Orient → (same as F-RECALL tails) |
| **Interruption / Recovery / Exit** | Same family as F-RECALL |
| **Ownership** | Human initiate · System Orient |
| **Forbidden** | Using Search as clarifier (Ask) |
| **Outcome** | **Primary:** Clarity |

## 3.6 F-REVIEW — Review session

| Field | Contract |
|-------|----------|
| **Class** | Review |
| **Inherits** | Phase 1 Review subsequence · Review Object |
| **Entry** | Idle · Complete · Notification open · Human enters Review |
| **Legal sequence** | Intent → Orient → Recall* → Reflect* → (Act \| Complete \| Archive \| Correct)* → Settle* → Idle |
| **Interruption points** | Quiet F-KNOCK if interruptibility open · F-ACT · F-HANDBACK · new F-INGRESS if Pulse arises |
| **Recovery** | Failed Act → F-ERROR · Conflict → F-CONFLICT |
| **Exit** | Idle · Complete · Drift not applicable unless nested Catch opened |
| **Ownership** | Human session owner · System Orient/Threads latent→revealed |
| **Forbidden** | Review that interrogates like Catch · Complete + Review Required simultaneous |
| **Outcome** | **Primary:** Clarity · **Secondary:** Agency if Act |

## 3.7 F-ACT — Life mutation

| Field | Contract |
|-------|----------|
| **Class** | Mutation |
| **Inherits** | Act Verb · stakes ladder |
| **Entry** | Orient · Offer suggested act · Knock accepted · Command |
| **Legal sequence (recoverable)** | Act → Settle → (Hand-back window) |
| **Legal sequence (destructive / peak)** | Act → F-VEIL → Confirm → Settle · or Cancel → prior |
| **Interruption points** | Before Settle: Cancel/Back · During Veil: Cancel only (Knock forbidden) · After Settle: F-HANDBACK if recoverable |
| **Recovery** | Failed → F-ERROR · Conflict → F-CONFLICT · Offline local Act → F-OFFLINE |
| **Exit** | Settle · Cancel · Failed (with recovery offered) |
| **Ownership** | L4 Decision · L6 Execution · Human authority |
| **Forbidden** | Irreversible Settle without Veil · Catch → Veil |
| **Outcome** | **Primary:** Agency · **Secondary:** Clarity |

## 3.8 F-VEIL — High-stakes confirm

| Field | Contract |
|-------|----------|
| **Class** | Mutation (gate) |
| **Inherits** | Veil State · Confirm Verb · Protection contract |
| **Entry** | Act at destructive / privacy / peak stakes |
| **Legal sequence** | Veil → Confirm → Settle · or Veil → Cancel → prior |
| **Interruption points** | **None for Knock · Thinking focal · new Catch** — window closed |
| **Recovery** | Cancel only before Confirm · **no Hand-back after Typed Veil Confirm** |
| **Exit** | Settle (irreversible path) · prior world (Cancel) |
| **Ownership** | System gate · Human Confirm |
| **Forbidden** | Knock inside Veil · fear copy on recoverable paths · soft-confirm at Typed Veil |
| **Outcome** | **Primary:** Agency · **Secondary:** Trust / sovereignty protection |

## 3.9 F-CREATE — Structure-aware entry (subordinate)

| Field | Contract |
|-------|----------|
| **Class** | Mutation |
| **Ingress hybrid (behavior)** | Sequence MUST Catch → Settle before structure — hybrid *behavior*, not a taxonomy class (§2.1) |
| **Inherits** | Create Verb bound to sacred spine |
| **Entry** | Orient · Command · local surface · Human chooses structure-aware entry |
| **Legal sequence** | Create intent → **Catch → Settle** (raw Pulse) → then F-STRUCTURE. Catch → Hold → resolve → Settle → then F-STRUCTURE. Hold → Drift \| Failed \| Idle → **no Offer / no F-STRUCTURE**. |
| **Interruption / Recovery** | Same as ingress after Catch begins (Hold→Offer ban · F-STRUCTURE Knock policy) |
| **Exit** | Same as F-INGRESS / F-STRUCTURE |
| **Ownership** | Human · must not replace universal Catch teaching |
| **Forbidden** | Create → structured Settle without Catch→Settle · Create as peer-primary ingress · Offer/structure from Hold-only |
| **Outcome** | **Primary:** Relief · **Secondary:** Capture |

## 3.10 F-BULK — Multi-select bulk Act

| Field | Contract |
|-------|----------|
| **Class** | Mutation |
| **Inherits** | Phase 1 §5.8 multi-select rules |
| **Entry** | Orient with multi-entity selection · one Anchor for bulk operation |
| **Legal sequence** | Select set → Act (bulk) → [Pause if medium bulk] → Settle · or escalate to F-VEIL if highest stake in set requires |
| **Interruption points** | Cancel before Settle · Veil if destructive bulk |
| **Recovery** | Hand-back if recoverable bulk · Failed partial → Partial Signal + F-ERROR/F-CONFLICT as needed |
| **Exit** | Settle · Cancel · Veil result |
| **Ownership** | Human · L6 |
| **Forbidden** | Two Anchors · silent mixed-stake downscale · bulk delete without Veil |
| **Open** | FQ-5 kind bans (which Entity kinds forbid bulk) — until answered, universal rules apply to all kinds |
| **Outcome** | **Primary:** Agency |

## 3.11 F-KNOCK — AI-initiated Coach Outcome

| Field | Contract |
|-------|----------|
| **Class** | AI-initiated |
| **Inherits** | Knock Verb · Coach Outcome · interruptibility model |
| **Entry** | Interruptibility window **open** · provenance present · single suggested action or dismiss · not dismissed earlier this session · **not** during active F-STRUCTURE Offer/Adjust |
| **Legal sequence** | Knock → Dismiss \| Act → (F-ACT if Act) → Learning |
| **Interruption points** | Human may Dismiss · Human may Act into F-ACT · **must not** nest Veil from Knock directly |
| **Recovery** | Dismiss ends · Failed Act → F-ERROR |
| **Exit** | Dismiss · Act completed · session closed for that Suggestion |
| **Ownership** | System Coach role · Human authority on Dismiss/Act |
| **Forbidden** | Knock during Catch · Hold · Veil · Breath ingress · **active F-STRUCTURE Offer/Adjust (unsolicited)** · re-knock dismissed content same session · two system focal turns without human reply |
| **Outcome** | **Primary:** Agency · **Secondary:** Coach existence |

## 3.12 F-CLARIFIER — Blocked Ask loop

| Field | Contract |
|-------|----------|
| **Class** | Clarification |
| **Inherits** | Ask Verb · Clarifier contract |
| **Entry** | Blocked Signal · parent ingress has Settled **at least once** · confidence/safety requires ask |
| **Legal sequence** | Ask (one minimal question) → Catch (answer as Pulse) → Settle → rejoin F-STRUCTURE or prior Decision |
| **Interruption points** | Drift of answer Catch · Offline |
| **Recovery** | Failed → F-ERROR · refuse → remain Blocked with dignity |
| **Exit** | Settled answer · return to parent Flow |
| **Ownership** | System question · Human answer · Conversation Object clarifier-only |
| **Forbidden** | Ask before first Settle of parent ingress · Conversation as system of record · multi-question interrogation parade |
| **Outcome** | **Primary:** Clarity · **Secondary:** Unblock toward Capture truth |

## 3.13 F-DRIFT — Deferred ingress leave

| Field | Contract |
|-------|----------|
| **Class** | Deferred / interrupted |
| **Inherits** | Drift Verb |
| **Entry** | Catch or in-progress Offer · Human leaves without silent discard |
| **Legal sequence** | Drift → Hold-safe preservation of Catch Session → Idle |
| **Return path** | Later Catch or Orient on preserved session — **not** a Resume Verb · **not** Commit by Drift |
| **Interruption points** | N/A (Drift is the interrupt) |
| **Recovery** | Preservation failure → Failed with dignity · Offline preserve local |
| **Exit** | Idle with preserved Catch Session · or loss declared Failed |
| **Ownership** | Human · Catch Session Object |
| **Forbidden** | Silent discard · Commit by Drift · inventing Resume Verb |
| **Outcome** | **Primary:** Relief · **Secondary:** Continuity without false Settle |

## 3.14 F-INTERRUPT-NEST — Legal nested divert

| Field | Contract |
|-------|----------|
| **Class** | Deferred / interrupted |
| **Inherits** | One Anchor · INV-10 · interruptibility |
| **Entry** | Parent Flow at declared interruption point |
| **Legal sequence** | Suspend parent (preserve state) → child Flow (e.g. F-PERMISSION · F-HANDBACK · quiet F-KNOCK) → return to parent or exit parent |
| **Interruption points** | Only where parent Flow lists them |
| **Recovery** | Child Cancel returns to parent · child Failed may Fail parent segment |
| **Exit** | Parent resumed · or parent abandoned via Drift rules if ingress |
| **Ownership** | Mixed · child must not steal second Anchor |
| **Forbidden** | Nesting Knock into Catch/Veil · system taking two focal turns · infinite nest depth without Settle/Dismiss |
| **Outcome** | **Primary:** Agency · **Secondary:** Continuity |

## 3.15 F-HANDBACK — Recovery without shame

| Field | Contract |
|-------|----------|
| **Class** | Recovery |
| **Inherits** | Hand-back Verb · Recovery contract |
| **Entry** | Post-recoverable Settle within Hand-back window · platform Undo maps here |
| **Legal sequence** | Hand-back → prior world → Settle |
| **Interruption points** | None required · Veil-closed paths ineligible |
| **Recovery** | Hand-back Failed → remain in post-Settle world · offer Retry of Hand-back once visibly |
| **Exit** | Prior Settled world restored |
| **Ownership** | Human invoke · System restore · L6 |
| **Forbidden** | Fear confirm on Hand-back · fake Hand-back after Typed Veil Confirm |
| **Outcome** | **Primary:** Agency · **Secondary:** Trust |

## 3.16 F-ERROR — Failed path

| Field | Contract |
|-------|----------|
| **Class** | Recovery |
| **Inherits** | Failed Signal · Retry Verb · dignity rules |
| **Entry** | Act/sync/inference Failed |
| **Legal sequence** | Failed → (Retry \| Hand-back \| Correct \| Idle with truth stated) |
| **Interruption points** | Human may open F-RECALL for context · not Knock as substitute for truth |
| **Recovery** | Retry → prior Act path · Recovered Signal on success |
| **Exit** | Recovered · accepted Failed with legal next Verb named · Correct path |
| **Ownership** | System reports · Human chooses recovery Verb |
| **Forbidden** | Shame · silent infinite retry · disguising Failed as Settle |
| **Outcome** | **Primary:** Clarity · **Secondary:** Honesty |

## 3.17 F-CONFLICT — Competing truths

| Field | Contract |
|-------|----------|
| **Class** | Recovery |
| **Inherits** | Conflict Signal · Decision layer |
| **Entry** | Sync/multi-device/concurrent edit Conflict |
| **Legal sequence** | Conflict → visible Decision (human chooses / confirms merge policy) → Settle \| Hold · not silent clobber |
| **Interruption points** | Veil if choice is irreversible destructive |
| **Recovery** | Failed decision apply → F-ERROR |
| **Exit** | Settled chosen truth · or Hold if unresolved |
| **Ownership** | Human sovereignty · System presents Conflict |
| **Forbidden** | Auto-resolve against sovereignty without visible Decision |
| **Outcome** | **Primary:** Clarity · **Secondary:** Trust |

## 3.18 F-OFFLINE — Offline continuity

| Field | Contract |
|-------|----------|
| **Class** | Continuity |
| **Inherits** | Offline Signal · Catch local Settle preference |
| **Entry** | Offline Signal true during Catch/Act/sync |
| **Legal sequence** | Offline + Catch → local Settle \| Hold → later sync may Hold→Settle or Conflict |
| **Interruption points** | Same as parent Flow · Loading ≠ Hold |
| **Recovery** | Sync Failed → F-ERROR · Conflict → F-CONFLICT |
| **Exit** | Local Settled truth · Hold pending remote · Recovered when sync completes |
| **Ownership** | Catch Session · durability honesty |
| **Forbidden** | Claiming remote Settle while Offline · Loading labeled Hold · silent clobber on reconnect |
| **Outcome** | **Primary:** Relief · **Secondary:** Trust |

## 3.19 F-LONG — Long-running operation overlay

| Field | Contract |
|-------|----------|
| **Class** | Continuity |
| **Inherits** | Thinking · Hold · Loading separation |
| **Entry** | Parent Flow requires extended Understanding, sync, or durability wait |
| **Legal sequence** | Parent State unchanged in grammar · overlay Signal: Thinking (AI prep) or Hold (durability/inference pending) or Loading (shell/fetch) — **never interchange** |
| **Interruption points** | Parent interrupt rules still apply · Thinking must not gate first Catch Settle |
| **Recovery** | Timeout → Failed or Hold with truth · Retry |
| **Exit** | Overlay clears → parent continues |
| **Ownership** | Signal overlay · parent Flow owns grammar State |
| **Forbidden** | Fake Settle · Thinking as Catch gate · Loading as Hold |
| **Outcome** | **Primary:** Clarity · **Secondary:** Honesty |

## 3.20 F-CROSSDEVICE — Cross-device continuation

| Field | Contract |
|-------|----------|
| **Class** | Continuity |
| **Inherits** | Continuity principle IP-02 · Offline/Conflict/Hold · Catch Session preservation |
| **Entry** | Human continues on another client · prior Catch Session or Entity truth exists |
| **Legal sequence** | Orient to preserved session/Entity → (continue F-STRUCTURE \| F-ACT \| F-INGRESS new Pulse) · sync Signals: Hold · Conflict · Partial as needed |
| **Interruption points** | F-CONFLICT · F-PERMISSION · F-OFFLINE |
| **Recovery** | Conflict Decision · Failed sync → F-ERROR |
| **Exit** | Settled continued work · Drift preserved · Idle |
| **Ownership** | Person owns graph · clients are bodies · verbs identical (Phase 1 Law of Verb Truth) |
| **Forbidden** | Device-specific verb meanings · silent discard of other-device unsettled Pulse · inventing second graph |
| **Outcome** | **Primary:** Agency · **Secondary:** Continuity · Trust |
| **Note** | Transport/sync engines are Engineering; Phase 2 owns only interaction-event legality |

## 3.21 F-PERMISSION — Permission gate

| Field | Contract |
|-------|----------|
| **Class** | Gate |
| **Inherits** | Phase 1 §5.15 · Blocked Signal |
| **Entry** | Platform permission required for intended Verb (e.g. voice Catch, share) |
| **Legal sequence** | Blocked → explain why → platform permission chrome → granted → resume parent · or denied → Blocked with alternative Catch path when possible |
| **Interruption points** | Parent suspended via F-INTERRUPT-NEST |
| **Recovery** | Denied → alternative legal Verb path · not dead end without explanation |
| **Exit** | Parent resumed · or abandoned with dignity |
| **Ownership** | Platform chrome · product why · Human grant/deny |
| **Forbidden** | Invented permission UI fighting OS · silent fail |
| **Outcome** | **Primary:** Agency · **Secondary:** Trust · Continuity |

| Field | Contract |
|-------|----------|
| **Class** | Gate |
| **Inherits** | Notification Object · deserve-attention · deep-link into grammar |
| **Entry** | Notification delivered · Human opens or dismisses |
| **Legal sequence** | Open → Orient → (F-ACT \| F-REVIEW \| F-RECALL \| F-INGRESS if Pulse) · or Dismiss → Idle |
| **Interruption points** | After Orient per child Flow |
| **Recovery** | Stale notification → Orient honesty · Failed open → F-ERROR |
| **Exit** | Child Flow exit · Dismiss |
| **Ownership** | Notification Object · then human-owned child Flow |
| **Forbidden** | Orphan chrome outside grammar · Knock spam via notification loops · nag |
| **Outcome** | **Primary:** Agency or Clarity (depending on child Flow) |

## 3.23 F-DELEGATE — Reserved (not shipping)

| Field | Contract |
|-------|----------|
| **Class** | Reserved |
| **Status** | **Not a v1 shipping Flow** — Phase 1 reserved Delegate Verb |
| **Entry / sequence** | Undefined until Founder product scope confirms |
| **Forbidden until unreserved** | Shipping Delegated Signal · silent AI delegation · treating Delegate as legal Verb in sentences |
| **Outcome** | N/A |

---

# 4. Flow composition rules

| ID | Rule |
|----|------|
| **FC-01** | One focal Flow segment per moment · one Anchor (Phase 1 INV-01) |
| **FC-02** | Child Flows only at parent-declared interruption points (F-INTERRUPT-NEST) |
| **FC-03** | Ingress is the only class that MUST traverse Catch before Understanding Offers |
| **FC-04** | Signals overlay States · Signals never replace States |
| **FC-05** | Settle remains cross-layer outcome inside every Flow that mutates truth |
| **FC-06** | Existence Outcomes Capture/Connect/Coach are realized by Flows — never as peer Verbs |
| **FC-07** | Every **shipping** Flow MUST name at least one **primary** triad Outcome (Relief · Clarity · Agency). Secondary Outcomes (Trust · Honesty · Continuity · Capture · Connect · Coach · other) MAY appear **only when** a primary triad Outcome is also named. Reserved Flows (F-DELEGATE) are exempt until unreserved |
| **FC-08** | Reserved Flows MUST NOT ship |
| **FC-09** | Flow IDs are stable references for UX Architecture / Engineering — not screen names |
| **FC-10** | Illegal sentence patterns (Phase 1 §4.3) remain illegal inside every Flow |

---

# 5. Initiative matrix

| Initiative | Legal Flow openings |
|------------|---------------------|
| **Human** | F-INGRESS-* · F-RECALL · F-SEARCH · F-REVIEW · F-ACT · F-CREATE · F-BULK · F-DRIFT · F-HANDBACK · F-ERROR recovery choice |
| **System silent** | Understanding after Settle · Thinking/Hold/Loading overlays · Thread latency |
| **System Knock** | F-KNOCK only |
| **System clarifier** | F-CLARIFIER only when Blocked after first Settle |
| **Platform** | F-PERMISSION chrome · share chrome · back/Undo→Hand-back |

---

# 6. Assumptions

1. Phase 1 FROZEN text is complete interaction law for Flow legality.  
2. UX Architecture will bind Flows to surfaces later without changing sequences.  
3. Cross-device transport fidelity is Engineering; interaction legality is F-CROSSDEVICE.  
4. FQ-5 unresolved ⇒ F-BULK applies universally until Founder bans specific Entity kinds.  
5. F-DELEGATE remains non-shipping until explicit unreserve.  
6. Notification taxonomy depth beyond re-entry grammar belongs to P8 Ch 16 + future Phase 3 initiative work — Phase 2 owns only F-NOTIFICATION event sequence.  
7. “First” vs “repeat” is Learning-context only — not two grammars.  
8. Offer path requires Settle — Hold alone never produces Offer (F1).  
9. Unsolicited Knock is closed during active F-STRUCTURE Offer/Adjust; Knock still only after Settle when window open (F2).

---

# 7. Unresolved Founder Questions

Intentionally deferred only (F1 · F2 resolved by this patch):

| ID | Question | Impact |
|----|----------|--------|
| **FQ-P2-01** | Confirm F-BULK kind bans (inherits Phase 1 FQ-5) — which Entity kinds forbid multi-select entirely? | Scopes F-BULK |
| **FQ-P2-02** | Is F-CROSSDEVICE in Phase 2 sufficient, or must Phase 4 own all multi-client continuation? | Boundary with Phase 4 |
| **FQ-P2-03** | Should F-NOTIFICATION deepen in Phase 3 (initiative) and stay thin here? | Default recommendation: thin here |
| **FQ-P2-04** | Any additional Flow class missing for family/shared-privacy Acts beyond Veil stakes? | Coverage |
| **FQ-P2-05** | Unreserve F-DELEGATE for a later v1 slice, or keep reserved through launch? | Shipping scope |
| **FQ-1** (Phase 1 deferred) | Signal display names | Labels only; Flows use meanings |

---

# 8. Confidence

| Area | Confidence | Note |
|------|------------|------|
| Inheritance / non-redefinition of Phase 1 | **High** | Reference-only posture |
| Ingress Settle→Offer spine (F1) | **High** | Hold→Offer closed |
| Structure Knock policy (F2) | **High** | No unsolicited Knock during active Adjust |
| Offline / Conflict / Error / Long overlays | **High** | Dual-axis preserved |
| Cross-device Flow (interaction-only) | **Medium-High** | Eng boundary explicit |
| Bulk kind policy | **Medium** | FQ-P2-01 open |
| Delegation | **High as reserved** | Non-shipping clear |
| Coverage completeness vs unknown product scopes | **Medium-High** | FQ-P2-04 open |

| Metric | Score |
|--------|-------|
| **Interaction Architecture Integrity** | **94 / 100** |
| **Phase Readiness** | **93 / 100** |

---

# 9. Stop

```text
Document : P9 Interaction Architecture — Phase 2 Interaction Flows
Version  : v0.3-founder-patched
Status   : FROZEN
Freeze   : 09_Phase2_FREEZE_CERTIFICATE.md (2026-07-25)
Date     : 2026-07-25
Inherits : Phase 1 FROZEN (v0.2-remediated)
Founder  : F1 · F2 applied (07_Phase2_FOUNDER_REVIEW.md)
Prior    : S1 · S2 structural · re-gate PASS · freeze readiness PASS
Stop     : Phase 2 FROZEN · Phase 3 authorized separately
```

---

## Founder Change Log — v0.2-structurally-patched → v0.3-founder-patched

### F1 — Hold → Offer sequence closed

| Field | Content |
|-------|---------|
| **Section** | §3.1 F-INGRESS-FIRST · §3.2 F-INGRESS-REPEAT · §3.9 F-CREATE · §6 Assumptions #8 |
| **Before** | `Settle \| Hold → (Thinking) → Offer*` readable as Hold→Offer |
| **After** | Explicit Settle path: Catch → Settle → Offer*. Hold path: Catch → Hold → resolve → Settle → Offer*. Hold → Drift \| Failed \| Idle → no Offer. Forbidden: Offer while Hold unresolved / after Hold exit without Settle |
| **Reason** | Founder Review F1 — Settle doctrine |

### F2 — No unsolicited Knock during active F-STRUCTURE

| Field | Content |
|-------|---------|
| **Section** | §3.3 F-STRUCTURE · §3.1 interruption · §3.11 F-KNOCK · §6 Assumptions #9 |
| **Before** | F-STRUCTURE interruption silent on Knock; F-KNOCK Forbidden omitted active structure |
| **After** | Canonical policy: Knock only after Settle when window open; **no unsolicited Knock during active Offer/Adjust/structure**. F-KNOCK Entry/Forbidden updated. Phase 1 Catch/Hold/Veil bans unchanged |
| **Reason** | Founder Review F2 — mixed-initiative predictability |

---

## Structural Change Log — v0.1 → v0.2-structurally-patched

### S1 — FC-07 Outcome Consistency
| Field | Content |
|-------|---------|
| **Section** | §1 anatomy Outcome field · §3 Outcome rows · §4 FC-07 |
| **Before** | FC-07 required triad map; several Flows listed only Trust/Honesty/Continuity/Unblock without primary triad |
| **After** | **Approach B:** FC-07 requires primary triad on every shipping Flow; secondary Outcomes allowed only with a primary present. All shipping Flow Outcomes updated to Primary / Secondary form. F-DELEGATE remains N/A (reserved) |
| **Reason** | Structural readiness S1 |

### S2 — F-CREATE Classification
| Field | Content |
|-------|---------|
| **Section** | §2.1 · §3.9 |
| **Before** | Taxonomy: Mutation only; Flow Class: “Mutation / Ingress hybrid” |
| **After** | Canonical Class = **Mutation**. Ingress hybrid documented as *behavior* note (§2.1 + §3.9 field) — not a second taxonomy class |
| **Reason** | Structural readiness S2 |

---

## Changelog

### 2026-07-25 — P9 Phase 2 v0.3-founder-patched
- **What:** Founder patch F1 (Hold→Offer closed; Settle-required Offer path) and F2 (no unsolicited Knock during active F-STRUCTURE Offer/Adjust; F-KNOCK Entry/Forbidden aligned)
- **Why:** Founder Review PASS WITH REMEDIATION (`07_Phase2_FOUNDER_REVIEW.md`)
- **Files:** `04_Phase2_Interaction_Flows.md`
- **Status:** founder patched — READY FOR FREEZE READINESS
- **Notes:** No redesign. No new Flows. No taxonomy/FC change. No Phase 1 edits. No Freeze Readiness this pass. No Phase 3.

### 2026-07-25 — P9 Phase 2 v0.2-structurally-patched
- **What:** Applied structural patches S1 (FC-07 approach B + Outcome rows) and S2 (F-CREATE = Mutation + hybrid behavior note)
- **Why:** Structural Readiness Gate NOT READY → patch only
- **Files:** `04_Phase2_Interaction_Flows.md`
- **Status:** superseded by v0.3-founder-patched
- **Notes:** No redesign. No new Flows. No Phase 1 edits. No Founder Review this pass.

### 2026-07-23 — P9 Phase 2 v0.1 Foundation Draft
- **What:** Defined interaction-flow architecture: anatomy, taxonomy, canonical Flows F-INGRESS through F-DELEGATE (reserved), composition rules, initiative matrix
- **Why:** Phase 1 frozen; Phase 2 authorized to define legal interaction-event sequences
- **Files:** `04_Phase2_Interaction_Flows.md`, `00_INDEX.md`
- **Status:** superseded by v0.2-structurally-patched
- **Notes:** No Phase 1 edits. No screens/UI/nav/visual/eng. No review this pass.
