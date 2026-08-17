# 03 — Product Decisions

```yaml
purpose: Catalog of explicit product decisions with reason, tradeoff, status, validity.
confidence: ★★★★☆
generated_from:
  - docs/knowledge/10_DECISIONS/*
  - docs/AIIMIN_PRODUCT_BIBLE/*
  - docs/product-intelligence/things_aiimin_should_stop_asking.md
  - docs/product-intelligence/FUTURE_AIMIN_FRAMEWORK.md
  - PRODUCT.md
  - docs/knowledge/01_PRODUCT/*
  - docs/knowledge/02_ARCHITECTURE/*
  - docs/knowledge/08_DESIGN/Palette.md
related_notes: [12_DECISION_LOG.md, 14_CONTRADICTIONS.md, 15_OBSOLETE_IDEAS.md]
dependencies: [02_PRODUCT_PHILOSOPHY.md]
consumers: Agents before changing product behavior
importance: ★★★★★
```

---

## STATUS LEGEND

| Status | Meaning |
|--------|---------|
| `locked` | Requires explicit owner override |
| `shipped` | In production / documented as live |
| `accepted_pending` | ADR accepted; schema/FE incomplete |
| `planned` | Doctrine/kill-list; not shipped |
| `rejected` | Explicitly not to build |
| `stale` | Documented but superseded |

---

## A. LOCKED PRODUCT LOCKS

| ID | Decision | Reason | Tradeoff | Status | Still valid? | Sources |
|----|----------|--------|----------|--------|--------------|---------|
| D-PAL | Palette `#1a1a1a/#2d2d2d/#ff6b35/#10b981/#6b7280` | Brand identity | No decorative novelty | locked | YES | Palette.md, Principles |
| D-NAV | Logo→`/brand`; wordmark→`/overview` | Split brand vs Today | Cannot unify casually | locked | YES | Product Guide, Waitlist Changelog |
| D-MWEB | Phone web `/m` capture-only | Complexity + philosophy | No mobile web analytics | locked | YES (web only) | PRODUCT.md, Device-Tiers |
| D-CLIN | No clinical MH claims / AI therapist | Ethics + liability | Less "smart" MH marketing | locked | YES | Principles, Never-Build |
| D-AUTHASK | No auth/schema without explicit ask | Safety | Intelligence cannot migrate alone | locked | YES | Home, Bible Index |
| D-SECRET | No secrets in vault | Security | Env names only | locked | YES | Principles |
| D-VAULT | Vault ships with code | Institutional memory | Docs are part of done | locked | YES | Brain OS ADR |
| D-JENC | Journal body not in analytics | Privacy | Limits telemetry | locked | YES | Principles |
| D-EDGE | One linking system `anchor_edges` | Avoid parallel graphs | Reject second link table | locked/accepted | YES | ADR-Notes, ADR-Discipline |

---

## B. FORMAL ADRs

| ID | Decision | Reason | Tradeoff | Status | Still valid? | Supersedes | Related impl |
|----|----------|--------|----------|--------|--------------|------------|--------------|
| ADR-2026-07-10 | Vault Brain OS cutover | ~985k tokens/request; agent re-scans | Must keep Current-Context fresh | shipped | YES | Fat AGENTS / Command Center | `docs/knowledge/` structure |
| ADR-Notes | Source-grounded Notes; no canvas | Need refs + entity links; not GoodNotes | No handwriting/PDF annotate | accepted_pending | YES | GoodNotes clone path | OCR, Drive watch, notes routes |
| ADR-Disc | UrgeEvent model + pattern language | Urge surfing research; non-clinical | Schema migration; Overview copy change | accepted_pending | YES | Shame-streak / addiction score | discipline routes; FE hydrate partial |
| ADR-Disc-Priv | Urge notes excluded from AI without consent | Privacy | Less default urge coaching | accepted | YES | — | — |

---

## C. ARCHITECTURE / PLATFORM

| ID | Decision | Reason | Tradeoff | Status | Still valid? | Sources |
|----|----------|--------|----------|--------|--------------|---------|
| D-3CLI | Three clients, never mix commits | Independent release trains | Process overhead | shipped | YES | Monorepo.md |
| D-NAT | Native V2 ≠ `/m` capture ceiling | "Capture-only as native ceiling is product fraud" | Dual mobile story | documented | YES | Device-Tiers 2026-07-19 |
| D-CAP | Capacitor = legacy stopgap | Founder rejected as real app | Parallel maintain until native GA | shipped (legacy) | YES | Capacitor-Android.md |
| D-AUTH | Better Auth + Google OAuth | Replace Clerk | Migration cost | shipped | YES | Auth.md, Waitlist Changelog |
| D-MAIL | Resend for transactional email | Replace SES | Vendor lock | shipped | YES | Waitlist Changelog |
| D-LHS | Life Score API-first `/intelligence/lhs` | Truthful cross-device score | local fallback for guests | shipped | YES | Architecture Overview |
| D-DBW | Block writes on `/api/db` for goals/habits/daily_logs | Safety | Dedicated routes only | shipped | YES | Overview.md |
| D-INS | `/insights` → `/reports?tab=...` | Consolidate read surfaces | Route redirect | shipped | YES | Product Guide |

---

## D. FEATURE THESIS DECISIONS

| ID | Decision | Reason | Tradeoff | Status | Still valid? | Sources |
|----|----------|--------|----------|--------|--------------|---------|
| D-J0A | Today: Universal Logger only; remove Quick Capture tiles | Single capture primitive | Less visible shortcuts | shipped (local craft) | YES | Overview.md |
| D-NOTE | Notes = reference library not second journal | Product differentiation | No canvas | accepted | YES | Notes.md, ADR |
| D-REP | Elite = interactive web, not longer PDF | Product quality | More eng | planned/craft | YES | Reports/Prototypes.md |
| D-FOLIO | Rename Folio → Life OS Review | Brand clarity | Copy migration | shipped (naming) | YES | Reports.md |
| D-NAVFREE | Free-pin 1–12 masthead; no forced sidebar taxonomy | User ownership | Overflow More(N) | shipped | YES | Navigation.md |
| D-ONB | Life-mode preset gate; tour v2 8 stops | Activation | Compression still planned 9→3 | partial | YES | Onboarding.md |
| D-TIER | Explore < Core < Pro < Elite | Monetization shape | Feature locks | shipped | YES | Product Guide |
| D-WAIT | Waitlist mode when env true | Pre-launch GTM | Pending screen for public | shipped | YES | Product.md |
| D-PRICE | Core ₹29; founding Pro ₹49; Elite ₹79; complimentary Core at launch | Founding offer | Price history churn | current | YES | Waitlist.md |

---

## E. KILL / INFER PLANNED (NOT SHIPPED)

| ID | Decision | Reason | Tradeoff | Status | Still valid? | Sources |
|----|----------|--------|----------|--------|--------------|---------|
| K-FIN | Kill finance category dropdown; NLP infer | High ROI 85% conf | Need correction chip | planned P0 | YES | kill list |
| K-JMODE | Kill journal mode gate pre-capture | Blocks vent INT-166 | AI tags post-save | planned | YES | kill list, Never-Build |
| K-MOOD | Unify 5 mood surfaces → 1 primitive | Duplicate primitives | Migration | planned P0 | YES | kill list, Philosophy |
| K-ONB3 | Onboarding 9→3; defer PIN | Activation drop-off | Less upfront security ritual | planned P1 | YES | FUTURE framework |
| K-PAL | Command Palette universal router | One utterance many tables | High eng | planned P0 | YES | FUTURE framework |
| K-PRI | Kill goal priority dropdown | Infer behavior | Less explicit priority UI | planned | YES | Never-Build |

---

## F. EXPLICIT REJECTIONS

| ID | Rejected | Why | Status |
|----|----------|-----|--------|
| R-SOC | Social feed / public leaderboards | Not a network; anxiety | rejected |
| R-THER | AI therapist persona | Clinical liability | rejected |
| R-AUTOPOST | Automatic posting | User owns writes | rejected |
| R-JITAI | Proactive JITAI discipline nudges (A5) | Interruptibility / ethics | rejected/deferred |
| R-MED | Infer emergency meds/allergies | Safety — always ask | rejected |
| R-GOODNOTES | Handwriting canvas Notes | Wrong product | rejected |
| R-ELITEPDF | Elite as longer PDF only | Wrong product | rejected |
| R-CAPAPP | Capacitor as primary Play app | Founder reject | rejected |
| R-NATCAP | Capture-only native ceiling | Product fraud | rejected |
| R-SIDE | Forced sidebar nav taxonomy | Free-pin wins | rejected |

---

## G. STALE DOCUMENTS (DO NOT TREAT AS CURRENT DECISIONS)

| Doc | Stale claim | Current truth |
|-----|-------------|---------------|
| MASTER_PLAN.md | Clerk auth | Better Auth |
| MASTER_PLAN.md | Blue accent `#2563EB` | Orange lock |
| Bible 05 (partial) | No `/m` router | `/m` routes exist |
| AIIMIN_PROGRESS_SUMMARY.md | Clerk | Better Auth |

---

## RELATED DECISION CHAINS

```
D-PAL + D-NAV → brand lock
D-MWEB + D-NAT + D-CAP → mobile strategy triad
ADR-Notes + D-EDGE → Notes architecture
ADR-Disc + R-THER + R-JITAI → Discipline ethics
K-MOOD + Philosophy#3 → primitive unification program
ADR-2026-07-10 + D-VAULT → agent memory system
```
