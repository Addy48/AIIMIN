# P9 Phase 3 — Initiative & Attention

```yaml
document: P9 Interaction Architecture — Phase 3
title: Initiative & Attention Law
version: P9 Phase 3 v0.2-founder-patched
status: FROZEN
freeze_date: 2026-07-25
freeze_certificate: 13_Phase3_FREEZE_CERTIFICATE.md
date: 2026-07-25
authorized_by: 09_Phase2_FREEZE_CERTIFICATE.md
execution_package: 10_Phase3_EXECUTION_PACKAGE.md
founder_review: 11_Phase3_FOUNDER_REVIEW.md (PATCH REQUIRED)
founder_patch: F1 (IA-02 split) · F2 (Hold full Closed) · F3 (canonical window defaults)
freeze_readiness: 12_Phase3_FREEZE_READINESS.md (PASS · APPROVE FREEZE)
inherits:
  - P8 Master Product Specification v1.0 (PUBLISHED — IMMUTABLE)
  - P9 Phase 1 Interaction Foundation v0.2-remediated (FROZEN)
  - P9 Phase 2 Interaction Flows v0.3-founder-patched (FROZEN)
forbids: redefine Phase 1 · redefine Phase 2 Flows/FC · new Flow IDs · screens · UI · navigation · components · typography · motion · APIs · schemas · model algorithms · implementation
owns: initiative authority · interruptibility windows · attention hierarchy · urgency/interruptiveness · clarification timing · notification interaction depth · reminder eligibility · silence · anti-nag · pacing · attention recovery · human authority over interruptions
rule_family: IA-01…IA-69 · IA-INV-01…08 (does not renumber IP-* · FC-* · P8-R-* · INV-*)
```

---

# Mission

Define **when** the system may claim attention, interrupt, wait, clarify, notify, remind, defer, or remain silent — under frozen Phase 1 grammar and frozen Phase 2 Flow sequences.

This phase answers: *When may initiative and attention lawfully fire?*  
Not: *What Verb/State/Signal is?* (Phase 1)  
Not: *What sequence of interaction events is legal?* (Phase 2)  
Not: *What UI is shown?* (future UX)

Phase 1 and Phase 2 are **immutable**. Phase 3 **inherits** them. Phase 3 does **not** redefine them.

---

# Ownership boundary

| Layer | Owns | Phase 3 may |
|-------|------|-------------|
| **P8 Constitution** | Exhale · Knock grammar · Notification stewardship (Ch 16) · INV-* | **Reference only** |
| **Interaction Law (Phase 1 — FROZEN)** | Ontology · verbs · states · Signals · principles · layer contracts | **Reference only** |
| **Interaction Flows (Phase 2 — FROZEN)** | Flow classes · legal sequences · FC-01…FC-10 · F-* openings | **Reference only** — cite Flow IDs; never rewrite sequences |
| **Initiative & Attention (Phase 3 — this doc)** | When initiative may fire · interruptibility windows · attention hierarchy · urgency/interruptiveness · notification interaction depth · reminder eligibility · silence · anti-nag · pacing · recovery attention · human interrupt authority | **Define** |
| **Cross-surface (Phase 4 — future)** | Desktop · native · `/m` · command · ambient binding | Cite Phase 3; not invent initiative law |
| **UX / Visual / Engineering (future)** | Surfaces · tokens · APIs · delivery media | Express / implement; not invent attention law |

**Reject from Phase 3:** screens, components, settings chrome, typography, motion, navigation layouts, new Flow taxonomy, grammar inventing, AI model behavior, algorithms, APIs, platform OS behavior beyond citing F-PERMISSION nest.

---

# 0. Inheritance lock

## 0.1 Frozen law Phase 3 MUST preserve

| Invariant | Source | Phase 3 obligation |
|-----------|--------|-------------------|
| Exhale Interaction | P8 Ch 09 · Phase 1 | No initiative that gates Catch or demands structure before Settle |
| Sacred Catch spine | P8 · Phase 1 · Phase 2 F-INGRESS | Notice → Catch → Settle before Offer path |
| Catch ≠ Capture | Phase 1 Ontology | Capture = Outcome only; Catch = Verb; Catch Session = Object |
| Settle doctrine / F1 | Phase 2 F1 | Offer never from Hold-only; Hold → Drift/Failed/Idle → no Offer |
| Hold honesty | Phase 1 · P8 | Hold ≠ Settle · Hold ≠ Loading |
| Loading ≠ Hold | Phase 1 dual-axis · FC-04 | Signals overlay States |
| Mixed initiative | Phase 1 · Phase 2 §5 | Human Decision authority; System Knock/Clarifier gated |
| F2 structure Knock ban | Phase 2 F-STRUCTURE | No unsolicited Knock during active Offer/Adjust |
| Ontology / Grammar / FC | Phase 1 · Phase 2 | Reference only; no renumber; no rewrite |
| F-DELEGATE reserved | Phase 2 FC-08 | No Delegated initiative until Founder unreserves |
| Forbidden transitions | Phase 1 §4.3 · FC-10 | Remain illegal under every initiative rule |

## 0.2 Conflict order

```text
P8 > Phase 1 FROZEN > Phase 2 FROZEN > Phase 3 (this draft)
```

## 0.3 No parallel stacks

Every Phase 3 initiative MUST resolve into an existing Phase 2 Flow opening or a legal F-INTERRUPT-NEST at a parent-declared interruption point. Phase 3 MUST NOT invent peer F-* IDs.

---

# 1. Terms (operational — not new Ontology classes)

| Term | Meaning | Primary class owner |
|------|---------|---------------------|
| **Initiative** | Who may open an attention claim or Flow segment | Phase 3 policy; Verbs remain Phase 1 |
| **Interruptibility window** | Open · Quiet-open · Closed — whether Knock / interruptive notice may enter | Phase 3 + P8 §3.10 |
| **Attention claim** | Any system attempt to take Focal or interruptive Peripheral attention | Phase 3; Notice (P8 Ch 16) |
| **Silence** | Lawful non-claim — system waits or communicates without interruptive attention | Phase 3 · P8-R-238 |
| **Deferral** | Hold notice until window open or human elects review | Phase 3 · P8 Ch 16 |
| **Digest** | Batched calm summary — not interrogation | P8-R-239 |
| **Quiet Knock** | Coach via F-KNOCK that remains Peripheral — not a second Anchor | Phase 3 · P8 Scan review |
| **Focal Knock** | Coach via F-KNOCK that becomes the single Anchor until Dismiss/Act | Phase 3 · INV-01 |
| **Urgency class** | Interruptiveness band for a notice (not product metric pressure) | Phase 3 operationalizes P8-R-236 |
| **Ordinary suppressible** | Interruptive class person may refuse without losing Capture/Connect/Coach core | P8-R-249 |
| **Non-suppressible precedence** | Trust-integrity / irreversible-harm notices ordinary mute MUST NOT extinguish | P8-R-251 (class list remains FB-P8-021/022) |

---

# 2. Initiative Authority

| ID | Rule |
|----|------|
| **IA-01** | **Human initiative is default.** Human MAY open Catch, Recall, Search, Review, Act, Create, Bulk, Drift, Hand-back, and Error recovery choice per Phase 2 §5 without System permission. |
| **IA-02** | **System silent overlays — two cases.** **(A) Ingress Understanding:** Understanding / Offer-preparation Thinking / Thread latency MAY run **only after** lawful ingress Settle — never as Catch Settle gate (Phase 1 · Phase 2 F1 · FC-05). **(B) Parent-Flow overlays:** Loading · Thinking · Hold (constitutional honesty) · other lawful Signal overlays on non-ingress or post-Settle parent Flows (e.g. F-RECALL · F-REVIEW · F-LONG) inherit the **parent Flow** and MUST obey dual-axis law (Loading ≠ Hold; Thinking ≠ Settle gate; Signals overlay States — Phase 1 · FC-04). Case B does **not** broaden Knock / Clarifier / Delegate initiative (IA-03…IA-07). |
| **IA-03** | **System Knock initiative** MAY open **only** F-KNOCK, and **only** when interruptibility permits (IA-10…IA-16) and Knock Timing (IA-24…IA-29) is satisfied. |
| **IA-04** | **System Clarifier initiative** MAY open **only** F-CLARIFIER when Blocked after parent ingress has Settled at least once (Phase 2 · Phase 1 Ask). |
| **IA-05** | **Platform initiative** MAY surface F-PERMISSION chrome, share chrome, and back/Undo→Hand-back mapping — never as Coach Knock substitute. |
| **IA-06** | **Notification delivery** is not itself a Knock. Opening a notification enters F-NOTIFICATION → Orient → child Flow (Phase 2). Coach content inside a notice MUST still obey Knock / Clarifier law when it becomes interaction. |
| **IA-07** | **Reserved:** F-DELEGATE / Delegated Signal MUST NOT appear as initiative until Founder unreserve (FC-08). |
| **IA-08** | System MUST NOT open a second focal Flow segment while one Anchor is active (FC-01 · INV-01 · INV-10). |

---

# 3. Interruptibility Windows

## 3.1 Window values

| Window | Meaning |
|--------|---------|
| **Closed** | No Knock · no interruptive notice · no Clarifier parade · Latent MUST NOT self-promote |
| **Quiet-open** | Quiet Knock / peripheral notice MAY enter if other IA rules pass; Focal Knock forbidden |
| **Open** | Quiet or Focal Knock MAY enter if other IA rules pass; still one Anchor |

## 3.2 Canonical window map

| Condition | Window | Cites |
|-----------|--------|-------|
| Breath Catch (Pulse in flight) | **Closed** | P8 · INV-06 · Phase 1 |
| Hold (durability/inference pending as constitutional State) | **Closed** (Knock **and** interruptive notice U2/U3) · U0 Silent + recovery honesty (IA-58) remain lawful | Phase 1 Knock Forbidden-from Hold · IA-INV-02 · Founder F2 |
| Veil / Confirm | **Closed** | P8 · Phase 1 · F-VEIL |
| Active F-STRUCTURE Offer/Adjust (unsolicited Coach) | **Closed** for Knock | Phase 2 F2 |
| Thinking as Catch Settle gate | **Forbidden** (not a window — illegal) | Phase 1 C3 |
| Post-Settle · structure Settled / Dismissed / Idle | **Quiet-open** | Founder F3 · Phase 2 F-STRUCTURE Knock policy |
| Scan Review session | **Quiet-open** | P8 §3.10 · FQ-P3-01 default |
| Command / palette | **Open** | P8 §3.10 · Founder F3 |
| Protected focus (human-declared or Veil-class protection) | **Closed** | P8 §3.10 |
| Failed / Conflict claiming honesty | See §13 — honesty focus ≠ Coach Knock | Phase 2 F-ERROR · F-CONFLICT |

| ID | Rule |
|----|------|
| **IA-10** | Interruptive Coach Knock MUST NOT enter while window is **Closed**. |
| **IA-11** | Deferrable notice MUST wait for **Open** / **Quiet-open** or human-elected review (P8-R-240). |
| **IA-12** | While window is **Quiet-open**, Focal Knock is forbidden; Quiet Knock only. |
| **IA-13** | Window Closed during Catch/Hold/Veil/active Adjust MUST NOT be overridden by “high confidence,” streaks, or engagement recovery. |
| **IA-14** | F-INTERRUPT-NEST MAY open a child only at parent-declared interruption points (FC-02). Nesting Knock into Catch/Veil/active Adjust remains forbidden. |
| **IA-15** | Clarifier is not a Knock. Clarifier MAY fire under IA-30…IA-34 even when Coach Knock is closed — **only** if Blocked after first Settle and never during Breath Catch as a gate before first Settle. |
| **IA-16** | Loading Signal NEVER opens or closes interruptibility by pretending to be Hold. |

---

# 4. Attention Hierarchy

| Layer | Content | Rule |
|-------|---------|------|
| **Focal** | One Anchor — Pulse field, Veil gate, Focal Knock, or Decision | Single primary (INV-01 · IP-10 · FC-01) |
| **Peripheral** | Offers, Chips, Quiet Knock, secondary actions | Visible; must not equal Focal weight |
| **Latent** | Threads, pending Knocks, deferred notices | MUST NOT self-promote during Catch/Veil/Closed windows |
| **Recalled** | Orient context, ranked results | Higher density OK in Command/Review — still one Anchor for Decision |

| ID | Rule |
|----|------|
| **IA-17** | Exactly one Focal Anchor per moment. Two equal focals forbidden. |
| **IA-18** | Latent MUST NOT self-promote into Focal during Catch, Hold, Veil, or Closed windows (INV-09 · IP-10). |
| **IA-19** | Peripheral Offers remain dismissible; peripheral MUST NOT silently mutate life (INV-07 · Offer posture). |

---

# 5. Urgency & Interruptiveness

Operational bands for Phase 3. Concrete worthiness class lists remain P8 FB-P8-021/022 — Phase 3 freezes **behavior**, not the deferred taxonomy.

| Band | Interruptiveness | Lawful use |
|------|------------------|------------|
| **U0 Silent** | None | State knowable without attention claim (P8-R-238) |
| **U1 Deferred / Digest** | None now | Wait for open window or elected review; Digest = calm summary (P8-R-237 · P8-R-239) |
| **U2 Quiet** | Peripheral | Quiet Knock / peripheral notice when Quiet-open or Open |
| **U3 Focal interruptive** | Focal | Single Anchor Knock or interruptive notice when Open; must deserve attention (P8-R-234) |
| **U4 Trust / harm precedence** | May exceed ordinary mute | Only for trust-integrity or irreversible-harm-to-stated-commitments precedence (P8-R-251) — class list not invented here |

| ID | Rule |
|----|------|
| **IA-20** | Urgency MUST reflect consequence to life obligations or trust integrity — never streak, vanity, or growth theater (P8-R-236). |
| **IA-21** | Lower band MUST be preferred when it suffices (P8-R-237). |
| **IA-22** | Every U2/U3 interruption MUST deserve attention and serve ≥1 existence Outcome Capture · Connect · Coach (P8-R-234 · FC-06). |
| **IA-23** | Escalation U1→U2→U3 MUST require real stakes and quieter insufficiency — never engagement recovery (P8-R-241). |

---

# 6. Knock Timing (Coach via F-KNOCK)

Extends Phase 2 F-KNOCK. Does **not** rewrite F-KNOCK legal sequence.

| ID | Rule |
|----|------|
| **IA-24** | Knock MAY fire only when: interruptibility permits (IA-10…IA-16) · provenance present · single suggested action or Dismiss · content not already visible as duplicate Latent · not dismissed earlier this session (Phase 1 · Phase 2 · P8). |
| **IA-25** | Knock MUST NOT fire during Catch · Hold · Veil · Breath ingress · **active F-STRUCTURE Offer/Adjust** (Phase 2 F2). |
| **IA-26** | After structure Settled · Dismissed · or Idle, Knock MAY fire if window Open/Quiet-open and IA-24 holds. |
| **IA-27** | Dismiss ends that Suggestion’s session claim; re-knock of dismissed content same session forbidden (INV-03 · P8). |
| **IA-28** | System MUST NOT take two focal turns without human reply (INV-10). Quiet Knock that becomes Focal counts as a focal turn. |
| **IA-29** | Knock MUST NOT nest Veil directly; Act enters F-ACT which owns Veil if stakes require (Phase 2 F-KNOCK). |

---

# 7. Clarifier Timing (F-CLARIFIER)

| ID | Rule |
|----|------|
| **IA-30** | Clarifier MAY open only when Blocked Signal is true **and** parent ingress has Settled at least once. |
| **IA-31** | Clarifier is **one** minimal question — then Catch (answer as Pulse) → Settle → rejoin parent (Phase 2 F-CLARIFIER). Multi-question interrogation parade forbidden. |
| **IA-32** | Clarifier MUST NOT run before first Settle as a Catch gate (Exhale · Phase 1). |
| **IA-33** | Conversation Object remains clarifier-only — never system of record (Phase 1). |
| **IA-34** | Human MAY refuse; remain Blocked with dignity — no shame, no Knock-as-substitute for truth. |

---

# 8. Notification Interaction Law

Deepens thin Phase 2 F-NOTIFICATION (FQ-P2-03 ownership). Delivery media / vendors remain Engineering. P8 Ch 16 stewardship remains supreme.

| ID | Rule |
|----|------|
| **IA-35** | A notification is a **Notice** (P8 Ch 16). It MUST deserve attention if interruptive (P8-R-234) and MUST deep-link into grammar via F-NOTIFICATION → Orient → legal child Flow — never orphan chrome (Phase 2). |
| **IA-36** | While interruptibility is Closed, interruptive notification MUST NOT enter; defer or silent/digest instead (P8-R-240 · IA-11). |
| **IA-37** | Opening a notification is Human initiative into F-NOTIFICATION. Dismiss ends present claim without penalty (P8-R-242). |
| **IA-38** | After Dismiss/Deferral, matter MAY persist for elected review and MUST NOT re-interrupt by default (P8-R-243). |
| **IA-39** | Notification MUST NOT become a Knock-spam loop: scheduled pushes that re-open F-KNOCK for dismissed Coach content same session are forbidden. |
| **IA-40** | Private reflection body MUST NEVER appear in interruptive notice (P8-R-245). |
| **IA-41** | Notice assertions about life-graph state MUST be honest (P8-R-248). Fake urgency forbidden (P8-R-247). |
| **IA-42** | Ordinary interruptive notice is suppressible without losing Capture/Connect/Coach core (P8-R-249). Non-suppressible precedence follows P8-R-251 without Phase 3 inventing the class list. |

---

# 9. Reminder Eligibility

| ID | Rule |
|----|------|
| **IA-43** | Reminder MAY claim interruptive attention only when interruptibility permits and deserve-attention holds; otherwise Silent / Deferred / Digest. |
| **IA-44** | Reminder re-entry MUST Orient into grammar (Phase 1) — Act · Review · Recall · or Idle — not orphan alarm chrome. |
| **IA-45** | Reminder MUST NOT punish Snooze/Dismiss with guilt, score harm, or dark re-prompt in the same attention episode (P8-R-242 · INV-03). |
| **IA-46** | Reminder MUST NOT carry private reflection body or fake urgency. |

---

# 10. Silence Doctrine

| ID | Rule |
|----|------|
| **IA-47** | Silence is lawful default when no deserve-attention claim exists, when window is Closed for the intended band, or when U0/U1 suffices. |
| **IA-48** | System MUST remain silent rather than invent initiative: no Always-On companion chatter; no engagement nags; no Offer-before-Settle “help”; no Delegate creep. |
| **IA-49** | Prefer U0/U1 over interruptive bands whenever silent or deferred modes suffice (reinforces IA-21 · P8-R-237). |

---

# 11. Anti-nag & Anti-spam

| ID | Rule |
|----|------|
| **IA-50** | Interruptive notice MUST NOT be designed, ranked, or timed to optimize engagement, retention theater, or addictive return (P8-R-244 · P8-R-034 cite). |
| **IA-51** | Same Suggestion / same dismissed Coach content MUST NOT re-Knock same session. |
| **IA-52** | Digest MUST NOT demand input as interrogation (P8-R-239). |
| **IA-53** | Clarifier parade (serial Asks) forbidden — one minimal question per Blocked episode unless new Blocked arises after human reply. |
| **IA-54** | Notification cadence MUST prefer lower urgency bands; volume-over-time MUST NOT manufacture urgency (P8-R-236 · P8-R-244). |

---

# 12. Conversational Pacing

| ID | Rule |
|----|------|
| **IA-55** | After any System focal turn (Focal Knock · Clarifier Ask · focal recovery Decision prompt), System MUST wait for Human reply before another focal System turn (INV-10). |
| **IA-56** | Quiet Peripheral updates (Thread latency, Offer refresh post-Settle) MUST NOT steal Focal Anchor. |
| **IA-57** | Thinking overlay MAY prepare Quiet/Focal Knock only when window will be lawful — Thinking MUST NOT gate first Catch Settle. |

---

# 13. Attention Recovery

| ID | Rule |
|----|------|
| **IA-58** | Failed / Conflict / Offline honesty MAY claim Focal attention to state truth and name legal next Verb — this is **recovery attention**, not Coach Knock. |
| **IA-59** | Recovery attention MUST NOT disguise Failed as Settle, or substitute Knock for truth (Phase 2 F-ERROR). |
| **IA-60** | After Recovered, interruptibility returns to the parent Flow’s window map — no bonus Coach spam. |
| **IA-61** | Hand-back attention is Human-invoked recovery (F-HANDBACK) — System MUST NOT fear-confirm recoverable Hand-back. |

---

# 14. Human Authority over Interruptions

| ID | Rule |
|----|------|
| **IA-62** | Human MAY Dismiss any Offer or Knock without penalty (INV-03 · Law of Sovereignty). |
| **IA-63** | Human MAY refuse ordinary interruptive notice classes without losing core Capture/Connect/Coach capability (P8-R-249). |
| **IA-64** | Human MAY elect review of deferred/persistent matters; System MUST NOT re-interrupt by default after Dismiss (P8-R-243). |
| **IA-65** | Human owns Confirm on Veil and all Decision-layer Acts — System never Confirms for the human. |
| **IA-66** | Interruptive notice MUST NOT require immediate response as condition of preserving rights, data, or core capability (P8-R-250). |

---

# 15. Latent / Peripheral Promotion

| ID | Rule |
|----|------|
| **IA-67** | Threads remain Latent at ingress; reveal in Recall/Reflect — never demanded at Catch (INV-09). |
| **IA-68** | Pending Knock eligibility stays Latent while window Closed; MUST NOT flash Focal to bypass Closed. |
| **IA-69** | Peripheral → Focal promotion requires Human Act/Orient/Accept or lawful Focal Knock under Open window — never silent self-promotion. |

---

# 16. Forbidden Initiative Patterns

| Pattern | Status | Why |
|---------|--------|-----|
| Knock during Catch / Hold / Veil / Breath | **Forbidden** | INV-06 · Phase 1 · Phase 2 |
| Unsolicited Knock during active F-STRUCTURE Adjust | **Forbidden** | Phase 2 F2 |
| Offer / structure initiative before Settle | **Forbidden** | Exhale · F1 |
| Clarifier before first Settle | **Forbidden** | Phase 1 · Phase 2 |
| Two system focal turns without human reply | **Forbidden** | INV-10 |
| Notification orphan chrome | **Forbidden** | Phase 2 F-NOTIFICATION |
| Knock spam via notification loops | **Forbidden** | IA-39 · Phase 2 |
| Engagement / streak manufactured urgency | **Forbidden** | P8-R-236 · IA-20 |
| Fake urgency / deception / coercion for compliance | **Forbidden** | P8-R-247 |
| Private reflection in interruptive notice | **Forbidden** | P8-R-245 |
| Always-on companion chat as SoR | **Forbidden** | Phase 1 Conversation law |
| Silent Delegate / shipping Delegated Signal | **Forbidden** | FC-08 · IA-07 |
| Loading labeled as Hold to force deferral theater | **Forbidden** | Dual-axis |
| Latent self-promotion into Catch/Veil | **Forbidden** | IP-10 · IA-18 |

---

# 17. Master Invariants (Phase 3)

| ID | Statement |
|----|-----------|
| **IA-INV-01** | Initiative never invents grammar or Flow topology. |
| **IA-INV-02** | Closed windows are absolute against Coach Knock and interruptive notice. |
| **IA-INV-03** | One Anchor; Latent never self-promotes into Closed contexts. |
| **IA-INV-04** | Deserve-attention + existence Outcome required for interruptive claims. |
| **IA-INV-05** | Human Dismiss/sovereignty always available for ordinary claims. |
| **IA-INV-06** | Silence and deferral are first-class lawful modes. |
| **IA-INV-07** | Recovery honesty ≠ Coach initiative. |
| **IA-INV-08** | Conflict order P8 > Phase 1 > Phase 2 > Phase 3 always. |

---

# 18. Assumptions

1. Phase 1 and Phase 2 frozen text remain complete for grammar and Flow legality.  
2. P8 Ch 16 remains supreme for notice stewardship; Phase 3 operationalizes interaction timing/depth only.  
3. FB-P8-021/022 worthiness class lists stay deferred — Phase 3 does not invent them.  
4. FQ-P2-03 resolved as Phase 3 ownership of notification interaction depth; Phase 2 F-NOTIFICATION sequence stays frozen.  
5. FQ-P2-01 · FQ-P2-02 · FQ-P2-04 · FQ-P2-05 remain intentionally deferred outside Phase 3 default scope.  
6. Phase 4 will bind surfaces without changing IA windows.  
7. UX expresses Focal/Peripheral/Latent; Phase 3 owns the law, not layout.

---

# 19. Founder Notes (non-blocking)

| ID | Note | Freeze impact if unanswered |
|----|------|------------------------------|
| **FQ-P3-01** | Confirm Quiet-open default for Scan Review vs allowing Focal Knock in Review when Open | Non-blocking — canonical default = Quiet-open for Review · Open for Command · Quiet-open post-structure (F3) |
| **FQ-P3-02** | Any ordinary interruptive classes Founder wants pre-listed before FB-P8-021 lands | Non-blocking — P8 obligation stands without class list |
| **FQ-P3-03** | Reminder vs Notification Object boundary labels in product vocabulary | Non-blocking — behaviors distinct; labels may rename |
| **FQ-1** (Phase 1) | Signal display names | Labels only |
| **FQ-P2-01…02 · 04…05** | Carried deferred from Phase 2 | Outside Phase 3 default |

---

# 20. Confidence

| Area | Confidence | Note |
|------|------------|------|
| Inheritance / non-redefinition | **High** | Cite-only posture |
| Interruptibility map vs Phase 2 F2 | **High** | Adjust closed restated |
| Hold full Closed (F2) | **High** | Knock + interruptive notice |
| Silent overlay split (F1) | **High** | Ingress vs parent-Flow cases |
| Canonical window defaults (F3) | **High** | No attention budget |
| Knock / Clarifier timing | **High** | Bound to F-KNOCK · F-CLARIFIER |
| Notification depth (FQ-P2-03) | **High** | Ch 16 + F-NOTIFICATION |
| Urgency bands vs FB taxonomy | **Medium-High** | Behavior frozen; class list deferred |
| Reminder eligibility | **High** | Aligns Reminder Object + notice law |
| Surface binding | **N/A** | Phase 4 |

| Metric | Score |
|--------|-------|
| **Interaction Architecture Integrity** | **94 / 100** |
| **Phase Readiness** | **93 / 100** |

---

# 21. Stop

```text
Document : P9 Interaction Architecture — Phase 3 Initiative & Attention
Version  : v0.2-founder-patched
Status   : FROZEN
Freeze   : 13_Phase3_FREEZE_CERTIFICATE.md (2026-07-25)
Date     : 2026-07-25
Inherits : Phase 1 FROZEN · Phase 2 FROZEN · P8 v1.0 IMMUTABLE
Founder  : F1 · F2 · F3 applied (11_Phase3_FOUNDER_REVIEW.md)
Rules    : IA-01…IA-69 · IA-INV-01…08 (IP-* · FC-* · P8-R-* · INV-* untouched)
Stop     : Phase 3 FROZEN · Phase 4 authorized separately
```

---

## Founder Change Log — v0.1 → v0.2-founder-patched

### F1 — IA-02 System silent overlay split

| Field | Content |
|-------|---------|
| **Section** | §2 · IA-02 |
| **Before** | Silent overlays only after ingress Settle (over-constrained Recall/Review Loading) |
| **After** | Case A: Understanding/Offer-prep after ingress Settle only. Case B: parent-Flow Loading/Thinking/Hold overlays inherit parent Flow + dual-axis; no Knock/Clarifier/Delegate broaden |
| **Reason** | Founder Review F1 |

### F2 — Hold full Closed

| Field | Content |
|-------|---------|
| **Section** | §3.2 Hold row |
| **Before** | Hold = Closed for Knock only |
| **After** | Hold = Closed for Knock **and** interruptive notice (U2/U3); U0 Silent + IA-58 recovery honesty remain lawful |
| **Reason** | Founder Review F2 |

### F3 — Canonical window defaults

| Field | Content |
|-------|---------|
| **Section** | §3.2 Post-Settle / Review / Command rows · FQ-P3-01 note |
| **Before** | Post-Settle Open or Quiet-open “per attention budget” |
| **After** | Post-structure Quiet-open · Scan Review Quiet-open · Command Open — no attention budget |
| **Reason** | Founder Review F3 |

---

## Changelog

### 2026-07-25 — P9 Phase 3 v0.2-founder-patched
- **What:** Founder patch F1 (IA-02 split), F2 (Hold full Closed for Knock + interruptive notice), F3 (canonical window defaults; remove attention budget)
- **Why:** Founder Review PATCH REQUIRED (`11_Phase3_FOUNDER_REVIEW.md`)
- **Files:** `05_Phase3_Initiative_and_Attention.md`
- **Status:** founder patched — READY FOR FREEZE READINESS
- **Notes:** No redesign. No renumber. No new rules. No Phase 1/2 edits. No Freeze Readiness this pass.

### 2026-07-25 — P9 Phase 3 v0.1 Foundation Draft
- **What:** Defined Initiative & Attention Law: initiative authority, interruptibility windows, attention hierarchy, urgency bands, Knock/Clarifier timing, notification interaction depth, reminder eligibility, silence, anti-nag, pacing, recovery attention, human interrupt authority, forbidden patterns, Phase 3 invariants
- **Why:** Phase 2 freeze certificate authorized Phase 3; execution package `10_Phase3_EXECUTION_PACKAGE.md`
- **Files:** `05_Phase3_Initiative_and_Attention.md`
- **Status:** superseded by v0.2-founder-patched
- **Notes:** No Phase 1/2 edits. No new Flows. No UI. No Freeze Readiness. No certificate.
