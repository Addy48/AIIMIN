# Chapter 04 — Navigation

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 04 — Navigation |
| **Subsystem** | Batch 2 — Information Model (with Ch 03, Ch 05) |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | P8 v0.1-draft |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 04
title: Navigation
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 02 — Core Product Philosophy (FROZEN v1.0)
  - Chapter 03 — Information Architecture (FROZEN v1.0)
architectural_question: "How does a user move through AIIMIN?"
```

---

## 1. Purpose

Define how users **move** through AIIMIN: global navigation, routing, deep links, context switching, platform shells, and navigation invariants.

This chapter owns movement mechanics only. It MUST NOT define screen layouts, widgets, object schemas, or motion.

---

## 2. Scope

### Includes

- Global navigation model (desktop and mobile)
- Routing and deep-link invariants
- Hierarchy traversal and breadcrumbs philosophy
- Context switching (tabs, sidebar regions)
- Brand lockup routing (Chapter 01)
- Phone shell and overflow ("More") model
- First-run navigation entry
- Capture FAB as shell affordance (placement only)
- Navigation invariants and canonical rules `P8-R-065`…
- No duplicate navigation principle

### Excludes

| Topic | Owner chapter |
|-------|---------------|
| IA topology, layers, intents definition | Chapter 03 — Information Architecture |
| Entity types, links | Chapter 05 — Core Objects & Data Model (cross-ref via Ch 03) |
| Capture sheet internals | Chapter 06 — Capture System (future) |
| Component primitives | Chapter 10 — Component System |

---

## 3. Canonical Model

### 3.1 Navigation vs information

**Navigation** is how users traverse IA regions. IA defines *where* information lives; navigation defines *how* users reach it.

Routes MUST respect IA regions and layers (Chapter 03). Entity intake contract for deep links: Chapter 05 §3.6 (`P8-R-088`). Routes MUST NOT invent parallel information regions.

**Governance:** GOV-075, GOV-095

### 3.2 No duplicate navigation

Each destination MUST have **one primary navigation path** per platform shell. Duplicate nav entries to the same destination MUST NOT ship.

**Governance:** GOV-075

*Conflict with free-pin model: FB-P8-011.*

### 3.3 Brand lockup routing (frozen)

From Chapter 01 (FROZEN):

| Target | Route |
|--------|-------|
| Logo mark | `/brand` |
| AIIMIN wordmark | `/overview` (Today) |

Split click targets MUST NOT be unified without explicit founder decision.

**Governance:** Product lock (Chapter 01) · *Today route naming: FB-P8-001*

### 3.4 Today / overview entry

The primary daily entry surface is reached via wordmark navigation. Governance references Today/overview as the daily spine; exact route string may differ by client if deep-link equivalent is preserved.

**Governance:** GOV-012, GOV-039 · **FB-P8-001**

### 3.5 Intent-driven routing

Routes SHOULD align with intent taxonomy (Chapter 03 §3.3). Command palette and search MAY jump intents to destinations once FB-P8-010 resolves.

**Governance:** GOV-095, GOV-099

### 3.6 Desktop navigation model

Desktop provides persistent global navigation exposing IA primary regions (Chapter 03 §3.9). Settings routes to penalty-box region (Chapter 03 §3.5).

**Governance:** GOV-098, GOV-100

### 3.7 Mobile / phone shell

Phone web (`/m`) navigation is **capture-biased** per device ceiling — not a full desktop IA mirror.

Native app navigation MAY exceed phone-web ceiling per platform governance.

**Governance:** GOV-013, GOV-041, GOV-163

*Fixed bottom nav item set: FB-P8-011 (GOV-163 Needs Discussion).*

### 3.8 "More" overflow

Secondary destinations on constrained shells overflow into **More** — not duplicate primary tabs.

**Governance:** GOV-168

### 3.9 Capture FAB (shell placement)

A primary **capture FAB** (or equivalent) MAY anchor the mobile shell as the fastest path to capture intents. FAB placement is navigation; capture sheet behavior is deferred to Chapter 06.

**Governance:** GOV-170

### 3.10 First-run entry

First-run MUST route users into the product without dead-end auth or empty shells. Entry path MUST reach actionable capture or Today surface.

**Governance:** GOV-166

### 3.11 Deep links

Deep links MUST resolve to stable routes that respect the entity intake contract (Chapter 05 §3.6) and device ceiling. Links to unavailable regions on a platform MUST degrade gracefully with explicit unavailable state.

**Governance:** GOV-103, GOV-013

### 3.12 Back stack and region path

Hierarchy traversal MUST preserve **back** semantics consistent with IA region path (Chapter 03 §3.9) — not arbitrary history stacks.

### 3.13 Context switching

Tabs and sidebar selection switch **IA context** without duplicating nav entries (GOV-075). Switching context MUST NOT lose in-progress capture without confirm where governance requires.

**Governance:** GOV-075, GOV-015

### 3.14 Command palette / palette spine

A command palette MAY provide intent-fast navigation on desktop. Palette scope and spine routes are not fully defined in governance.

**Governance:** GOV-099 · **FB-P8-012**

---

## 4. Canonical Rules

### §4.1 — Primary paths

**P8-R-065** — Each IA destination MUST have exactly **one primary navigation path** per platform shell.

**Referenced GOV IDs:** GOV-075

---

**P8-R-066** — Duplicate navigation entries to the same destination MUST NOT ship.

**Referenced GOV IDs:** GOV-075

---

### §4.2 — Brand and Today

**P8-R-067** — Logo mark MUST route to `/brand`; AIIMIN wordmark MUST route to Today/overview equivalent.

**Referenced GOV IDs:** Chapter 01 §5, GOV-012

---

**P8-R-068** — Today/overview MUST remain the daily entry spine reachable from wordmark navigation.

**Referenced GOV IDs:** GOV-012, GOV-039, FB-P8-001

---

### §4.3 — Platform shells

**P8-R-069** — Phone web (`/m`) navigation MUST respect capture-biased device ceiling; full desktop IA mirror MUST NOT ship on `/m`.

**Referenced GOV IDs:** GOV-013, GOV-041

---

**P8-R-070** — Secondary destinations on constrained shells MUST overflow to **More**, not additional primary tabs beyond governed shell set.

**Referenced GOV IDs:** GOV-168, GOV-163

---

**P8-R-071** — Capture FAB MAY anchor mobile shell; it MUST route to capture intent, not arbitrary features.

**Referenced GOV IDs:** GOV-170

---

### §4.4 — Intents and settings

**P8-R-072** — Routes MUST align with intent taxonomy; orphan routes outside intents require founder ADR.

**Referenced GOV IDs:** GOV-095

---

**P8-R-073** — Settings MUST be reachable as penalty-box navigation, not embedded in primary life-work tabs.

**Referenced GOV IDs:** GOV-100

---

### §4.5 — Entry and deep links

**P8-R-074** — First-run navigation MUST reach actionable product surfaces without dead ends.

**Referenced GOV IDs:** GOV-166

---

**P8-R-075** — Deep links MUST respect the entity intake contract (Chapter 05 §3.6) and device ceiling.

**Referenced GOV IDs:** GOV-103, GOV-013

---

**P8-R-076** — Deep links to unavailable platform regions MUST degrade gracefully with explicit unavailable state.

**Referenced GOV IDs:** GOV-013, GOV-041

---

### §4.6 — Context and palette

**P8-R-077** — Context switches MUST NOT duplicate primary nav entries for the same destination.

**Referenced GOV IDs:** GOV-075

---

**P8-R-078** — Destructive navigation away from in-progress work MUST confirm where governance requires.

**Referenced GOV IDs:** GOV-015

---

**P8-R-079** — Command palette routes MUST NOT bypass device ceiling or IA contracts.

**Referenced GOV IDs:** GOV-099, GOV-013

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 04 |
|--------|-------|--------------|---------------|
| GOV-012 | Today as daily spine | Approved | Yes |
| GOV-013 | Device ceiling | Approved | Yes |
| GOV-015 | Destructive confirm | Approved | Yes |
| GOV-039 | Overview/Today behavior | Approved | Yes |
| GOV-041 | Mobile device ceiling | Approved | Yes |
| GOV-075 | No duplicate navigation | Approved | Yes |
| GOV-095 | Intent taxonomy | Approved | Yes |
| GOV-099 | Command palette spine | Needs Discussion | Yes |
| GOV-100 | Settings penalty box | Approved | Yes |
| GOV-163 | Phone shell nav items | Needs Discussion | FB-P8-011 |
| GOV-166 | First-run entry | Approved | Yes |
| GOV-168 | More overflow | Approved | Yes |
| GOV-170 | Capture FAB | Approved | Yes |
| GOV-103 | Entity IA contract | Approved | Yes |

---

## 6. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| Chapter 01 — Product Identity | Brand lockup routes, `/m` ceiling |
| Chapter 02 — Core Product Philosophy | Capture-first entry behavior |
| Chapter 03 — Information Architecture | IA regions, intents, Settings placement |

### Cross references

| Document | Role |
|----------|------|
| Chapter 05 — Core Objects & Data Model | Entity intake contract for deep links (`P8-R-088`) |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Surface chapters | Route contracts |
| Capture chapter | FAB → capture route |

---

## 7. Edge Cases

### EC-P8-401 — Same destination in tab bar and sidebar

**Condition:** Money appears in bottom nav and sidebar primary.

**Expected behavior:** Violates P8-R-066 unless one is secondary overflow (More).

**Governance:** GOV-075

---

### EC-P8-402 — Deep link to desktop-only region on `/m`

**Condition:** User opens analytics deep link on phone web.

**Expected behavior:** Graceful unavailable per P8-R-076; not silent 404.

**Governance:** GOV-013, GOV-041

---

### EC-P8-403 — Unified brand click target

**Condition:** Design merges logo and wordmark navigation.

**Expected behavior:** Rejected without founder ADR — violates P8-R-067 and Chapter 01 lock.

---

## 8. Founder Decision Blocks

### FB-P8-001 — Today route canonical name

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-001 |
| **Issue** | Governance references Today/overview; production uses `/overview` vs `/today`. |
| **Context** | Wordmark navigation, deep links, cross-client parity. |
| **Why governance is insufficient** | GOV-012/039 name behavior not canonical path string. |
| **Options** | (A) Canonical `/overview` with `/today` redirect. (B) Canonical `/today`. (C) Client-specific with link-equivalence table. |
| **Recommendation** | Option A — matches current web production and Chapter 01 brand lockup. |
| **Impact** | Blocks deep-link docs and Android parity. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-012, GOV-039 · **Also in:** Chapter 01 §8

---

### FB-P8-011 — Phone shell primacy (fixed nav vs free-pin)

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-011 |
| **Issue** | GOV-163 proposes fixed phone nav set; GOV-097 proposes user free-pin; both tension with GOV-075 no-duplicate. |
| **Context** | CF-PS-001, CF-IA-001, REC-077. |
| **Why governance is insufficient** | GOV-163 Needs Discussion; models conflict. |
| **Options** | (A) Fixed primary tabs + More overflow (GOV-163/168). (B) User-pinned primaries with cap (GOV-097). (C) Hybrid — fixed capture + Today, pin others. |
| **Recommendation** | Option C — preserves capture bias and GOV-075. |
| **Impact** | Blocks native shell and `/m` nav implementation. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-163, GOV-097, GOV-075, GOV-168 · **REC:** REC-077

---

### FB-P8-012 — Command palette scope

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-012 |
| **Issue** | GOV-099 Needs Discussion — palette spine routes undefined. |
| **Context** | Desktop power-user navigation. |
| **Why governance is insufficient** | Palette approved in principle; scope open. |
| **Options** | (A) Intents + recent entities only. (B) Full route jump list. (C) Defer palette. |
| **Recommendation** | Option A — aligns with GOV-095. |
| **Impact** | Blocks desktop palette ship. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-099, GOV-095

---

## 9. Acceptance Criteria

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Answers navigation question without layouts/widgets | Scope audit |
| AC-02 | Rules P8-R-065 through P8-R-079 sequential | grep count = 15 |
| AC-03 | Every rule cites GOV ID from §5 | Cross-check |
| AC-04 | Brand lockup matches frozen Ch 01 | Diff |
| AC-05 | FB-P8-001, FB-P8-011, FB-P8-012 present | Count = 3 |
| AC-06 | No IA topology redefinition | Boundary audit vs Ch 03 |
| AC-07 | Freeze header and footer present | See Freeze Summary |
| AC-08 | Depends only on Ch 03 (not Ch 05) in dependency chain | Dependency audit |

---

## 10. Founder ADR Required

| Field | Value |
|-------|-------|
| **ADR** | ADR-P8-001 |
| **Reason (historical)** | At freeze, Chapter 01 §2 deferred split lockup route wiring to "Chapter 07 — Navigation". Canonical owner is **Chapter 04**. Frozen text was not to be edited silently. |
| **Resolution** | ADR-P8-001 completed 2026-07-23. Pointer migration finished. Ch 01/02/15 references synchronized. No constitutional doctrine changed. |
| **Status** | Resolved (2026-07-23) |

---

## Changelog

### 2026-07-23 — Publication metadata sync (ADR-P8-001)

- **What:** Chapter-local ADR-P8-001 status set to Resolved. Historical rationale retained. No rule or doctrine change.
- **Status:** shipped

### 2026-07-22 — Frozen v1.0 (Subsystem Batch 2)

- **What:** Architecture review pass. Nav/IA boundary fixes. Freeze header/footer. ADR-P8-001 logged.
- **Status:** FROZEN

### 2026-07-22 — Initial draft (Batch 2)

- **What:** Chapter 04 Navigation; P8-R-065…079.
- **Status:** superseded

---

## Freeze Summary

**Status:** Frozen

**Subsystem:** Batch 2 — Information Model (Ch 03–05)

**Canonical Rules:** 15 (P8-R-065…079)

**Referenced GOV IDs:** 14

**Founder Decision Blocks:** 3 (FB-P8-001, FB-P8-011, FB-P8-012)

**Known Dependencies:**

- Chapter 01 — Product Identity
- Chapter 02 — Core Product Philosophy
- Chapter 03 — Information Architecture

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES (pending open Founder Decision Blocks)
