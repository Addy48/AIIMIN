# Chapter 01 — Product Identity

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 01 — Product Identity |
| **Approval** | Founder Approved |
| **Last Modified** | 2026-07-22 |
| **Supersedes** | None |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 01
title: Product Identity
p8_version: P8 v1.0
status: FROZEN
governance_source: P7 Governance v1.0 (FROZEN)
architectural_question: "What is AIIMIN?"
```

---

## 1. Purpose

Establish the **stable, immutable answer** to: **What is AIIMIN?**

This chapter defines official product naming, category, canonical description, scope boundaries (what AIIMIN is and is not), brand identity laws, canonical terminology, and identity invariants. It is the root of the P8 dependency graph. Later chapters MUST reference this chapter for identity terms and MUST NOT redefine them.

This chapter does **not** define how AIIMIN behaves, how success is measured, how features are governed, or how identity law is amended. Those belong in later chapters (see §2 Scope — Excludes).

---

## 2. Scope

### Includes

- Official product name, short name, and canonical description
- Immutable category definition: Personal Life OS
- v1 product concept name and definition (Living Momentum OS)
- Product scope boundaries: AIIMIN IS / AIIMIN IS NOT
- Brand and identity laws (naming, lockup, reserved terminology, palette identity, forbidden aesthetic identities)
- Canonical terminology glossary (governance-defined terms only)
- Identity invariants (constitutional identity rules)
- Numbered canonical rules (`P8-R-###`) that encode identity only

### Excludes

| Topic | Deferred to | Former P8-R IDs (if any) |
|-------|-------------|---------------------------|
| Three existence outcomes; capture/coach/connect mission | Chapter 02 — Core Product Philosophy | P8-R-009, P8-R-010, P8-R-011 |
| Human Momentum behavioral philosophy (shame, sparring, Life Score honesty) | Chapter 02 — Core Product Philosophy | P8-R-007 |
| Capture-flow behavior (taxonomy-first prohibition as interaction law) | Chapter 06 — Capture System | P8-R-005 |
| Success and failure criteria | Chapter 02 — Core Product Philosophy | P8-R-026, P8-R-027 |
| Failure triggers as operational checklist | Chapter 24 — Implementation Constraints (Pending) | P8-R-028 |
| Feature intake and human-problem gate | Chapter 24 — Implementation Constraints (Pending) | P8-R-029, P8-R-030 |
| Amendment process and article supremacy | Chapter 24 — Implementation Constraints (Pending) | P8-R-031, P8-R-032 |
| Vault ship gate | Chapter 24 — Implementation Constraints (Pending) | P8-R-033 |
| One linking system schema/API | Chapter 05 — Core Objects & Data Model | P8-R-034 |
| Palette token values and contrast | Chapter 11 — Visual System | P8-R-035 (tokens) |
| Phone web `/m` ceiling enforcement | Chapter 13 — Platform Specifications | P8-R-036 |
| Export/delete formats and cascade | Chapter 15 — Privacy / Security | P8-R-037 |
| Journal analytics allowlists | Chapter 15 — Privacy / Security | P8-R-038 |
| Auth/schema change control | Chapter 24 — Implementation Constraints (Pending) | P8-R-039 |
| AI confidence bands and mixed-initiative implementation | Chapter 07 — AI Architecture | P8-R-017 |
| Life Score formula and XP roles | Chapter 08 — Surface Specifications | FB-P8-005 |
| Split lockup route wiring | Chapter 04 — Navigation | FB-P8-001 |

---

## 3. Canonical Product Identity

### Official product name

**AIIMIN**

### Official short name

**AIIMIN**

No alternate consumer-facing product name is canon. Sub-brands (e.g., Living Momentum OS) are concept labels, not replacements for the product name.

### Canonical description

AIIMIN is a **Personal Life OS** for one human under cognitive load: a system where intent is captured once, life is modeled as one connected graph, and intelligence is shared across surfaces — without turning life into data entry.

**Vision lock** (mandatory identity copy; MUST NOT be contradicted in product, marketing, or contributor-generated content):

> *Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.*

**Governance:** GOV-001, GOV-002, GOV-004, GOV-040, GOV-047

### Immutable definition of AIIMIN

| Dimension | Definition |
|-----------|------------|
| **Personal** | One human's life graph; not a network |
| **Life** | Whole person: execution, money, health, reflection, family, career |
| **OS** | Shared primitives, shared memory, shared intelligence across surfaces |
| **AI-first** | Intent expressed in natural language; structure is derived — not a chatbot as the product |

Clients (desktop web, phone web `/m`, native Android, future platforms) are **surfaces of one OS**, not separate products.

**Governance:** GOV-001, GOV-040, GOV-047

### Positioning

AIIMIN is positioned as a **Personal Life Operating System** — not a single-domain app, social product, clinical device, form builder, gamification casino, or generic chatbot.

Vertical domains (finance, health, family, discipline, sports, etc.) exist only as **surfaces within the Life OS**, not as the product identity.

**Governance:** GOV-001, GOV-005, GOV-006, GOV-007, GOV-008, GOV-009, GOV-047

### v1 product concept

**Living Momentum OS** is the locked v1 product concept:

> Intent Capture + Calm Contextual Today + Memory/Timeline compound, with Family/Finance/Documents as trusted pillars and AI as mixed-initiative coach — **never the home shell**.

**Governance:** GOV-162

### Official terminology (surrounding the product)

| Term | Role in identity |
|------|------------------|
| **Personal Life OS** | Product category |
| **Human Momentum** | Brand frame (see §5) |
| **Living Momentum OS** | v1 product concept name |
| **Vision lock** | Immutable tagline / north-star copy |
| **Today** | Daily operating surface (wordmark destination; route ID pending FB-P8-001) |
| **Brand book** | Identity education surface at `/brand` (logo mark destination) |

Full definitions: §6 Canonical Terminology.

---

## 4. Product Scope Boundaries

### AIIMIN IS

| Identity | Governance |
|----------|------------|
| A Personal Life OS for one human's whole life | GOV-001 |
| A product whose vision is *Capture once…* | GOV-002 |
| A system framed as **Human Momentum** | GOV-003 |
| An AI-first Life OS (NL intent → derived structure; not chatbot-as-product) | GOV-047 |
| **Living Momentum OS** at v1 | GOV-162 |
| One OS with shared primitives, memory, and intelligence across surfaces | GOV-040 |
| A product with non-negotiable palette identity until founder override | GOV-036 |
| A product with split brand lockup (mark → `/brand`; wordmark → Today) | GOV-012, GOV-039 |

### AIIMIN IS NOT

| Refused identity | Governance |
|------------------|------------|
| A social network, public feed, or public leaderboard | GOV-005 |
| A clinical mental health device, diagnostic tool, or AI therapist | GOV-006, GOV-050 |
| A single-domain app (finance-only, fitness-only, notes-only) wearing Life OS clothing | GOV-007 |
| A form builder disguised as productivity | GOV-008 |
| A product that blocks capture behind mode pickers, category interrogations, or vanity configuration | GOV-008 |
| A gamification casino optimizing for streaks and shame | GOV-009 |
| A purple SaaS clone, cream-terracotta editorial AI look, or GoodNotes handwriting PWA | GOV-010, GOV-037 |
| A product that sells or shares lifelog data | GOV-011 |
| A generic chatbot or chat-as-home product | GOV-047, GOV-136, GOV-162, GOV-165 |
| A Tasks-tab, Projects-board, or widget-dashboard primary product | GOV-165 |
| A redesign interchangeable with another brand after logo removal | GOV-010, GOV-037 |

Private sharing, if introduced, MUST NOT create a social-graph product and REQUIRES a separate founder decision (see EC-P8-001).

---

## 5. Brand & Identity Laws

### Naming

| Rule | Requirement |
|------|-------------|
| Product name | **AIIMIN** — all caps in official product identity contexts |
| Brand frame | **Human Momentum** — title case |
| Category | **Personal Life OS** or **Personal Life Operating System** |
| v1 concept | **Living Momentum OS** — title case |

### Human Momentum (brand frame)

Human Momentum is the official brand frame: precision, feedback loops, behavioral intelligence, data sovereignty, momentum engineering — **never shame theater**.

Behavioral expression of Human Momentum (coaching tone, Life Score honesty, sparring bounds) is defined in Chapter 02 — Core Product Philosophy.

**Governance:** GOV-003

### Capitalization

- **AIIMIN** — product name; not "Aiimin" or "aiimin" in official identity copy
- **Human Momentum**, **Living Momentum OS**, **Personal Life OS** — title case when used as proper nouns

### Logo / lockup constraints

| Element | Destination | Constraint |
|---------|-------------|------------|
| Logo mark | `/brand` | Brand book ≠ daily OS |
| Wordmark text | Today (daily OS) | Separate click target; MUST NOT unify with mark |

Implementations MUST NOT replace split lockup with mini-story chrome, unified click targets, or purple OAuth-style brand chrome.

**Governance:** GOV-012, GOV-039 · **Conflict:** CF-001 · **Founder block:** FB-P8-001

### Palette identity

Palette identity is non-negotiable until founder override. Token values live in `docs/knowledge/08_DESIGN/Palette.md`. New brand colors MUST NOT be introduced without explicit founder approval.

**Governance:** GOV-036 · **Detail:** Chapter 11 — Visual System

### Forbidden aesthetic identities

Forbidden product identities include: purple SaaS clone; cream-terracotta editorial AI look; GoodNotes handwriting PWA aesthetic; any redesign that belongs to another brand after removing the logo.

**Governance:** GOV-010, GOV-037 · **Detail:** Chapter 11 — Visual System

### Reserved terminology

The following terms are reserved with governance-defined meaning. They MUST NOT be repurposed:

| Reserved term | Chapter |
|---------------|---------|
| Personal Life OS | §6 |
| Human Momentum | §6 |
| Living Momentum OS | §6 |
| Vision lock | §6 |
| AI-first | §6 |
| Life graph / Connected graph | §6 |
| Surface | §6 |
| Primitive | §6 |
| Life entity | §6 |
| Today | §6 |
| Life Score | §6 (formula: FB-P8-005) |
| Mixed-initiative | §6 |

---

## 6. Canonical Terminology

One definition per term. Later chapters MUST reference this section, not redefine.

| Term | Canonical definition | Governance |
|------|---------------------|------------|
| **AIIMIN** | The product; a Personal Life OS for one human under cognitive load. | GOV-001 |
| **Personal Life OS** | Product category: Personal (one life graph, not a network) + Life (whole person) + OS (shared primitives, memory, intelligence across surfaces). | GOV-001 |
| **Human Momentum** | Brand frame: precision, feedback loops, behavioral intelligence, data sovereignty, momentum engineering — never shame theater. | GOV-003 |
| **Vision lock** | Immutable copy: *Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.* | GOV-002 |
| **Living Momentum OS** | v1 product concept: Intent Capture + Calm Contextual Today + Memory/Timeline compound, with Family/Finance/Documents as trusted pillars and AI as mixed-initiative coach — never the home shell. | GOV-162 |
| **AI-first** | Intent expressed in natural language; structure derived. Not chatbot-as-product. | GOV-047 |
| **Life graph** | One human's connected life data model; not a social network graph. | GOV-001 |
| **Connected graph** | One connected graph of goals, habits, money, calendar, body, mind, family, and work. Scope of required domain adoption is unresolved — FB-P8-004. | GOV-004 |
| **Life entity** | A unit in the one linking system for life entities. Named schema/API: Chapter 05 — Core Objects & Data Model. | GOV-019 |
| **Surface** | A client or UI context that presents shared OS primitives (desktop web, `/m`, native Android, etc.). Surfaces are not separate products. | GOV-040 |
| **Primitive** | A shared behavioral or data building block reused across surfaces (e.g., mood, theme, arc). One primitive, many surfaces. | GOV-020 |
| **Capture** | Recording life input as it happens; identity anchor of vision lock. Interaction doctrine: Chapter 06 — Capture System. | GOV-002 |
| **Today** | The daily operating surface; wordmark lockup destination. Route identifier pending FB-P8-001. | GOV-012, GOV-039 |
| **Brand book** | Identity education surface at `/brand`; logo mark destination. Not the daily OS. | GOV-012, GOV-039 |
| **Life Score** | Honest composite truth of life state; not vanity XP. Formula and inputs undefined — FB-P8-005. | GOV-009 |
| **Mixed-initiative** | AI as mixed-initiative layer — not chatbot-on-forms; not the home shell. Confidence-band thresholds: Chapter 07 — AI Architecture. | GOV-136 |

**Terms without governance definition (not in glossary):** Workspace, Object, AI Assistant, Momentum (standalone). Do not use these as canonical P8 terms until governance or a later chapter defines them.

---

## 7. Identity Invariants

Immutable identity rules defining what AIIMIN fundamentally is. Amendment requires founder process defined in Chapter 24 — Implementation Constraints (Pending).

| ID | Invariant | Governance |
|----|-----------|------------|
| INV-01 | AIIMIN MUST remain a Personal Life OS. | GOV-001 |
| INV-02 | AIIMIN MUST model one human's life graph; it MUST NOT become a network product. | GOV-001, GOV-005 |
| INV-03 | AIIMIN MUST remain one OS with shared primitives, memory, and intelligence across surfaces. | GOV-040 |
| INV-04 | AIIMIN MUST NOT become a social network, public feed, or public leaderboard. | GOV-005 |
| INV-05 | AIIMIN MUST NOT become a clinical device, diagnostic tool, or AI therapist. | GOV-006, GOV-050 |
| INV-06 | AIIMIN MUST NOT become a single-domain app wearing Life OS clothing. | GOV-007 |
| INV-07 | AIIMIN MUST NOT sell or share lifelog data. Aggregate scope undefined — FB-P8-018 (canonical; former FB-P8-003 merged). | GOV-011 |
| INV-08 | AIIMIN MUST remain AI-first (NL intent, derived structure) and MUST NOT collapse into a chatbot-as-product identity. | GOV-047 |
| INV-09 | AIIMIN v1 MUST remain **Living Momentum OS**; AI MUST NOT be the home shell. | GOV-162, GOV-136 |
| INV-10 | AIIMIN MUST preserve one linking system for life entities (graph integrity). Named implementation: Chapter 05 — Core Objects & Data Model. | GOV-019 |
| INV-11 | AIIMIN MUST preserve split brand lockup (mark `/brand`, wordmark Today). | GOV-012, GOV-039 |
| INV-12 | AIIMIN MUST preserve palette identity until founder override. | GOV-036 |
| INV-13 | Vision lock copy MUST NOT be contradicted. | GOV-002 |

---

## 8. Canonical Rules

### §8.1 — Category and positioning

**P8-R-001** — AIIMIN MUST be classified and marketed as a **Personal Life OS**. No client or feature proposal MAY reclassify AIIMIN as a single-domain app, social product, or chatbot wrapper.

**Referenced GOV IDs:** GOV-001

---

**P8-R-002** — Clients MUST be treated as **surfaces of one OS**, not separate products with divergent domain models.

**Referenced GOV IDs:** GOV-040

---

**P8-R-003** — Vertical modules MAY exist only as surfaces of the Life OS. A finance-only, fitness-only, or notes-only product identity MUST NOT ship.

**Referenced GOV IDs:** GOV-007

---

### §8.2 — Vision lock

**P8-R-004** — The mandatory vision lock copy is:

> *Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry.*

All official product, marketing, and in-product identity copy MUST NOT contradict this statement.

**Referenced GOV IDs:** GOV-002

---

### §8.3 — Brand frame (identity)

**P8-R-005** — AIIMIN's official brand frame is **Human Momentum**, defined as: precision, feedback loops, behavioral intelligence, data sovereignty, momentum engineering — **never shame theater**.

**Referenced GOV IDs:** GOV-003

---

### §8.4 — v1 product concept

**P8-R-006** — AIIMIN v1 product concept is **Living Momentum OS**, defined in §3 and §6.

**Referenced GOV IDs:** GOV-162

---

**P8-R-007** — The following product shapes are **outside v1 identity** and MUST NOT ship as primary product form:

- Chat-as-home / AI-native home shell
- Tasks tab or Projects board as primary IA
- Widget-dashboard or marketplace-style Today home

**Referenced GOV IDs:** GOV-162, GOV-165

---

**P8-R-008** — AI MUST NOT be the home shell. AI is a mixed-initiative layer; home identity remains calm contextual Today and memory/timeline compound per Living Momentum OS.

**Referenced GOV IDs:** GOV-136, GOV-162

---

### §8.5 — AI-first identity

**P8-R-009** — AIIMIN is **AI-first** only in this sense: user intent is expressed in natural language; structure is derived. AI-first MUST NOT be interpreted as chatbot-first.

**Referenced GOV IDs:** GOV-047

---

**P8-R-010** — A conversational surface MAY exist. Product identity MUST NOT collapse into a chat wrapper.

**Referenced GOV IDs:** GOV-047

---

### §8.6 — Scope boundaries (IS NOT)

**P8-R-011** — AIIMIN MUST NOT become a social network, public feed, or public leaderboard.

**Referenced GOV IDs:** GOV-005

---

**P8-R-012** — AIIMIN MUST NOT become a clinical mental health device, diagnostic tool, or AI therapist. Clinical claims MUST NOT appear in identity-facing copy (UI, store listings, marketing).

**Referenced GOV IDs:** GOV-006, GOV-050

---

**P8-R-013** — AIIMIN MUST NOT become a form builder disguised as productivity, nor a product that blocks capture behind mode pickers, category interrogations, or vanity configuration.

**Referenced GOV IDs:** GOV-008

---

**P8-R-014** — AIIMIN MUST NOT become a gamification casino that optimizes for streaks and shame. Life Score identity is honest composite truth, not vanity XP.

**Referenced GOV IDs:** GOV-009

*Life Score formula: FB-P8-005. XP role separation: Chapter 08 — Surface Specifications.*

---

**P8-R-015** — AIIMIN MUST NOT adopt forbidden aesthetic identities: purple SaaS clone; cream-terracotta editorial AI look; GoodNotes handwriting PWA aesthetic. A redesign interchangeable with another brand after logo removal is identity failure.

**Referenced GOV IDs:** GOV-010, GOV-037

---

**P8-R-016** — AIIMIN MUST NOT sell or share lifelog data. Scope of anonymized aggregates is undefined — FB-P8-018 (canonical; former FB-P8-003 merged).

**Referenced GOV IDs:** GOV-011

---

### §8.7 — Brand lockup

**P8-R-017** — Brand lockup MUST remain **split** with separate click targets: logo mark → `/brand`; wordmark text → Today. Click targets MUST NOT be unified. Brand book MUST NOT function as the daily OS.

**Referenced GOV IDs:** GOV-012, GOV-039

*Route ID: FB-P8-001. Detail: Chapter 04 — Navigation.*

---

**P8-R-018** — Implementations MUST NOT replace split lockup with mini-story chrome, unified click targets, or purple OAuth-style brand chrome.

**Referenced GOV IDs:** GOV-012, GOV-039

---

### §8.8 — Palette identity

**P8-R-019** — Palette identity is non-negotiable until founder override. New brand colors MUST NOT be introduced without explicit founder approval.

**Referenced GOV IDs:** GOV-036

*Token values: Chapter 11 — Visual System; `docs/knowledge/08_DESIGN/Palette.md`.*

---

## 9. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 01 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS category lock | Approved | Yes |
| GOV-002 | Vision lock — Capture once | Approved | Yes |
| GOV-003 | Brand frame — Human Momentum | Approved | Yes |
| GOV-004 | Three existence outcomes | Approved | Terminology only (Connected graph); detail → Ch 02 |
| GOV-005 | Refuse social network / public feed / leaderboard | Approved | Yes |
| GOV-006 | Refuse clinical / therapist claims | Approved | Yes |
| GOV-007 | Refuse single-domain Life OS clothing | Approved | Yes |
| GOV-008 | Refuse form-builder / capture blockers | Approved | Yes |
| GOV-009 | Refuse gamification casino; honest Life Score | Approved | Yes |
| GOV-010 | Refuse purple/cream clones and GoodNotes PWA | Approved | Yes |
| GOV-011 | Refuse sell/share lifelog data | Approved | Yes |
| GOV-012 | Split brand lockup (mark /brand, wordmark Today) | Needs Discussion | Yes |
| GOV-019 | One linking system for life entities | Approved | Yes |
| GOV-020 | One primitive, many surfaces | Approved | Yes |
| GOV-036 | Palette identity non-negotiable | Approved | Yes |
| GOV-037 | Forbidden aesthetics + brand-test | Approved | Yes |
| GOV-039 | Split lockup visual+IA law | Approved | Yes |
| GOV-040 | Shared primitives across surfaces | Approved | Yes |
| GOV-047 | AI-first means NL intent + derived structure | Approved | Yes |
| GOV-050 | No AI therapist / clinical framing | Approved | Yes |
| GOV-136 | AI is mixed-initiative layer | Approved | Yes |
| GOV-162 | Living Momentum OS v1 product concept lock | Approved | Yes |
| GOV-165 | Refuse Tasks tab, Projects board, widget dashboard as primary IA | Approved | Yes |

**Deferred to later chapters (valid in P7; not cited by Ch 01 rules):** GOV-013, GOV-014, GOV-016, GOV-017, GOV-018, GOV-021, GOV-022, GOV-023, GOV-024, GOV-025, GOV-041, GOV-042, GOV-043, GOV-044, GOV-045, GOV-048, GOV-049, GOV-061, GOV-068, GOV-085

**REC references (not canon):** REC-003 (FB-P8-001)

---

## 10. Dependencies

### Depends on

| Dependency | Role |
|------------|------|
| P7 Governance v1.0 (FROZEN) | Sole source of truth |
| `AIIMIN GENESIS/P5 Constitution/01_AIIMIN_CONSTITUTION.md` v3.0 | Articles I–III identity source |
| `AIIMIN GENESIS/P6 Prototype Studio/` | GOV-162 evidence |

### Required by

| Consumer | Relationship |
|----------|--------------|
| Chapter 02 — Core Product Philosophy | Mission outcomes, Human Momentum behavior, success/failure criteria |
| Chapter 05 — Core Objects & Data Model | Life entity, linking system |
| Chapter 03 — Information Architecture | Living Momentum shell; anti-primary-IA refusals |
| Chapter 06 — Capture System | Vision lock interaction expression |
| Chapter 07 — AI Architecture | AI-first implementation; mixed-initiative confidence bands |
| Chapter 04 — Navigation | Split lockup routes |
| Chapter 08 — Surface Specifications | Life Score; pillar surfaces |
| Chapter 11 — Visual System | Palette tokens; forbidden aesthetics QA |
| Chapter 13 — Platform Specifications | `/m` ceiling |
| Chapter 15 — Privacy / Security | Lifelog, export, journal |
| Chapter 24 — Implementation Constraints (Pending) | Amendment, feature intake, vault ship gate |

### Cross references

| Document | Path |
|----------|------|
| P8 Index | `00_INDEX.md` |
| P7 Master Governance | `../P7 Governance/01_P7_MASTER_GOVERNANCE.md` |
| P7 Decision Registry | `../P7 Governance/02_MASTER_DECISION_REGISTRY.json` |
| Palette (token values) | `docs/knowledge/08_DESIGN/Palette.md` |

---

## 11. Edge Cases

### EC-P8-001 — Private sharing without social network

**Condition:** User requests sharing a journal entry or metric with one other person.

**Expected behavior:** Sharing MUST NOT introduce public feeds, leaderboards, or social-graph discovery. Any private-share capability REQUIRES founder decision outside this chapter. Until then, treat as out of canon.

**Governance:** GOV-005

---

### EC-P8-002 — Native client vs phone web `/m` identity

**Condition:** Native Android offers richer surfaces than phone web `/m`.

**Expected behavior:** Native richness does not change AIIMIN's category identity as one Personal Life OS. Platform ceiling rules for `/m` are defined in Chapter 13 — Platform Specifications (GOV-013, GOV-041, GOV-085).

**Governance:** GOV-001, GOV-040

---

### EC-P8-003 — Connected graph without full domain adoption

**Condition:** User engages only a subset of life domains.

**Expected behavior:** Product identity does not require full-domain adoption on day one. Resolution of Connected graph scope: FB-P8-004; detail in Chapter 02 — Core Product Philosophy.

**Governance:** GOV-004, CF-011

---

### EC-P8-004 — Chat surface present but not home

**Condition:** Product includes conversational UI.

**Expected behavior:** Permitted when P8-R-009 and P8-R-010 are satisfied. Home/default landing MUST remain non-chat per GOV-162 and GOV-136.

**Governance:** GOV-047, GOV-136, GOV-162

---

### EC-P8-005 — Stylus input without GoodNotes identity

**Condition:** Input mode supports stylus handwriting.

**Expected behavior:** Permitted when product identity does not become GoodNotes handwriting PWA (GOV-010, CF-013). Identity test: after logo removal, the product MUST NOT read as a handwriting-notebook app.

**Governance:** GOV-010, CF-013

---

### EC-P8-006 — Vertical feature marketed as standalone app

**Condition:** Finance or fitness module marketed independently.

**Expected behavior:** Violates INV-06. Module MUST be positioned as a Life OS surface, not a standalone product identity.

**Governance:** GOV-007

---

## 12. Founder Decision Blocks

> **ADR-P8-001:** Canonical homes only. This chapter holds mirrors for FB-P8-001/002/004 and a merge stub for FB-P8-003. Decisions unchanged (Pending).

### FB-P8-001 — Today route identifier for wordmark lockup (MIRROR)

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-001 |
| **Canonical home** | Chapter 04 — Navigation |
| **Role in this chapter** | Mirror only — identity/lockup citation |
| **Status** | Pending Founder Decision (unchanged) |

Full block: Chapter 04 § Founder Decision Blocks. Conflict CF-001; REC-003.

---

### FB-P8-002 — Success metric measurement rigor (MIRROR)

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-002 |
| **Canonical home** | Chapter 02 — Core Product Philosophy |
| **Role in this chapter** | Mirror only |
| **Status** | Pending Founder Decision (unchanged) |

Full block: Chapter 02 §13.

---

### FB-P8-003 — Lifelog data commerce scope (MERGED)

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-003 |
| **Status** | Merged into **FB-P8-018** |
| **Canonical home** | Chapter 15 — Privacy & Security (`FB-P8-018`) |
| **Role in this chapter** | Mirror stub only — do not resolve separately |
| **Decision change** | None — same open question; single ID going forward |

Cite **FB-P8-018** for anonymized aggregates under lifelog non-commerce.

---

### FB-P8-004 — Connected graph vs optional domains (MIRROR)

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-004 |
| **Canonical home** | Chapter 02 — Core Product Philosophy |
| **Role in this chapter** | Mirror only |
| **Status** | Pending Founder Decision (unchanged) |

Full block: Chapter 02 §13.

---

### FB-P8-005 — Life Score formula canon pointer

| Field | Value |
|-------|-------|
| **Identifier** | FB-P8-005 |
| **Issue** | GOV-009 and GOV-068 assert honest Life Score vs celebratory XP but no formula, inputs, or surface contract exists in P7. |
| **Context** | Missing decision M-005. GOV-068 status: Needs Discussion. |
| **Why governance is insufficient** | Governance requires honest Life Score but does not define formula, inputs, or surface contract. |
| **Options** | (A) Point to existing vault/Product Bible formula as dependent canon. (B) Founder defines formula in new ADR before Chapter 08. (C) Defer Life Score to post-v1 — **conflicts with GOV-009 Approved status**. |
| **Recommendation** | Option B — founder ratifies formula before Chapter 08 ships. |
| **Impact** | Blocks Life Score UI, gamification surfaces, and coaching that references score honesty. |
| **Status** | Pending Founder Decision |

**Referenced GOV IDs:** GOV-009, GOV-068 · **Gap:** M-005

---

## Tracked conflicts (not resolved in this chapter)

| Conflict ID | Summary | Handling |
|-------------|---------|----------|
| CF-001 | Today vs `/overview` route ID | FB-P8-001 |
| CF-008 | ~60s / ~5 interactions measurability | FB-P8-002 → Ch 02 / Ch 14 |
| CF-011 | Connected graph assumes unified domains | FB-P8-004 → Ch 02 |
| CF-012 | Median ~5 vs power-user breadth | Chapter 02 (REC-013) |
| CF-013 | GoodNotes PWA risk via stylus revival | EC-P8-005 |
| CF-PS-001 | GOV-163 fixed phone nav vs GOV-097 free-pin | Chapter 04 |

---

## 13. Acceptance Criteria

Chapter 01 freeze verification — each item MUST be marked **PASS** or **FAIL**:

| # | Criterion | Verification method |
|---|-----------|---------------------|
| AC-01 | Body text answers only "What is AIIMIN?" with no philosophy, success metrics, feature governance, or implementation mechanics | Manual review: zero prohibited topics outside §2 Excludes references |
| AC-02 | Rules P8-R-001 through P8-R-019 exist sequentially with no gaps or duplicates | Automated: grep `P8-R-` yields exactly 19 unique IDs |
| AC-03 | Invariants INV-01 through INV-13 each cite at least one GOV ID from P7 registry | Cross-check §7 against §9 |
| AC-04 | Every P8-R rule cites at least one GOV ID listed in §9 | Cross-check §8 against §9 |
| AC-05 | No GOV ID in §9 is absent from P7 `02_MASTER_DECISION_REGISTRY.json` | Registry lookup |
| AC-06 | Five Founder Decision Blocks exist with Status = Pending Founder Decision | Count FB-P8-001…005 |
| AC-07 | §6 defines each canonical term exactly once | Glossary row count = unique terms |
| AC-08 | §2 Excludes table lists all deferred former P8-R IDs (005–039 except current 001–019 mapping) | Cross-check against v0.2 deferral map |
| AC-09 | Freeze header and footer present with correct counts | See Freeze Summary below |

---

## Changelog

### 2026-07-23 — Publication remediation (ADR-P8-001)

- **What:** Pointer corrections only (chapter numbers/titles/deps/terminology/excludes/invariants). FB-001/002/004 mirrored to canonical homes; FB-003 merged into FB-018. No doctrine or rule-body change.
- **Why:** Publication blockers 1–3.
- **Status:** shipped
- **Governance:** ADR-P8-001 Resolved

### 2026-07-22 — Frozen v1.0

- **What:** Freeze-quality normalization pass. Freeze header/footer. Rule/GOV/terminology/FB format audits. Acceptance criteria made testable.
- **Why:** Publication-ready freeze per founder review.
- **Status:** FROZEN
- **Governance:** unchanged

### 2026-07-22 — Structural revision (v0.2)

- **What:** Restructured to identity-only scope.
- **Status:** superseded by v1.0

### 2026-07-22 — Initial draft (v0.1)

- **What:** Chapter 01 Product Identity authored from P7 Governance v1.0.
- **Status:** superseded by v0.2

---

## Freeze Summary

**Status:** Frozen

**Canonical Rules:** 19

**Identity Invariants:** 13

**Referenced GOV IDs:** 23

**Founder Decision Blocks:** 5 entries (canonical FB-005; mirrors 001/002/004; merged 003→018) — ADR-P8-001

**Known Dependencies:**

- Chapter 02
- Chapter 05
- Chapter 13
- Chapter 15
- Chapter 24 (Pending)

**Architecture Review:** PASS

**Governance Traceability:** PASS

**Ready for Implementation:** YES
