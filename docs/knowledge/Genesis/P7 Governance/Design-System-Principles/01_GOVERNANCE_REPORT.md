# 01 — Design System Principles Governance Report

```yaml
document: Design System Principles Governance Report
phase: P7
standard: AIIMIN GENESIS/P7 Governance/00_GOVERNANCE_STANDARD.md
standard_version: 1.0
source: AIIMIN GENESIS/P5 Constitution/07_VISUAL_LANGUAGE_PRINCIPLES.md
source_alias: 07_DESIGN_SYSTEM_PRINCIPLES.md → 07_VISUAL_LANGUAGE_PRINCIPLES.md
source_version: 3.0
source_status: FROZEN
governance_date: 2026-07-22
gov_ids_new: GOV-104…GOV-111
gov_ids_referenced: GOV-001…GOV-103 (prior; not re-minted)
```

> Machine-readable twin: `02_GOVERNANCE_DECISIONS.json` · Index: `03_GOVERNANCE_INDEX.md` · Standard: `../00_GOVERNANCE_STANDARD.md`

**Filename note:** Requested artifact label `07_DESIGN_SYSTEM_PRINCIPLES.md` does not exist as a file. Governed frozen source is P5 **`07_VISUAL_LANGUAGE_PRINCIPLES.md`** (Visual Language Principles = design-system principles layer). Source **not modified**. Constitution, Non-Negotiables, IA Principles, and Governance Standard **not modified**. New GOV IDs only for genuinely new canon; duplicates reference existing GOV IDs.

---

## 1. Artifact Overview

| Field | Value |
|-------|-------|
| Source | `07_VISUAL_LANGUAGE_PRINCIPLES.md` v3.0 FROZEN |
| Structure | Principles VL-1…VL-10 + Future impact + Tradeoffs + Known risks |
| New canonical GOV | GOV-104…GOV-111 (8) |
| Existing GOV referenced | 17 unique IDs from prior registry (no re-mint) |
| Recommendations | REC-034…REC-040 (7) — not canon |
| Conflicts flagged | CF-VL-001…CF-VL-007 |
| Needs Discussion | GOV-107 |
| Governance score | **79 / 100** |

**Separation law:** Canonical Decisions ≠ Governance Recommendations.

### Existing GOV references (duplicates — do not re-mint)

| VL item | Existing GOV | Note |
|---------|--------------|------|
| VL-1 (palette lock + anti-clone + drift + dead accents) | `GOV-036`, `GOV-037`, `GOV-073`, `GOV-081` | Palette identity / forbidden looks / token drift debt / dead accent bans — semantic orange/green elevated in GOV-104 |
| VL-2 (contrast requirement core) | `GOV-071` | Critical-path contrast asserted; numeric floors elevated in GOV-107 |
| VL-3 (Inter/buffet ban) | `GOV-090` | Ban Inter-as-identity + unemployed buffet; named role matrix elevated in GOV-105 |
| VL-4 (Today anti-clutter + anti glass-grid) | `GOV-076`, `GOV-091` | Today anti-widget + no glass-grid-only personality; one-composition/cards-for-interaction elevated in GOV-106 |
| VL-5 (atmosphere / anti trend costumes) | `GOV-037`, `GOV-038` | Forbidden aesthetics + decoration-must-not-confuse cover purple mesh / glassmorphism / cream-terracotta costumes |
| VL-6 (emoji/color-only) | `GOV-087` | Emoji not IA + no color-only critical status; icons-keep-words elevated in GOV-111 |
| VL-7 (split lockup) | `GOV-012`, `GOV-039` | Split mark→/brand wordmark→Today already constitution+visual law — no new ID |
| VL-8 (token identity / Palette authority) | `GOV-036`, `GOV-073` | Palette non-negotiable + drift-is-debt; one-system light/dark elevated in GOV-108 |
| VL-9 (capture/review calm anchors) | `GOV-028`, `GOV-029`, `GOV-032` | Capture-first / calm read / progressive disclosure; density-by-mode matrix elevated in GOV-109 |
| VL-10 (shared primitives + ceilings) | `GOV-040`, `GOV-073`, `GOV-085` | Shared primitives / token alignment / native≠/m ceiling; M3 cousin-brand ban elevated in GOV-110 |

---

## 2. CANONICAL DECISIONS

Only new decisions supported by Visual Language / Design System Principles (Confidence High or Medium). Binding when Status is Approved.

### Canonical Visual Decisions

### GOV-104 — Semantic color roles — orange acts; green completes; neutrals dominate

| Field | Value |
|-------|-------|
| Category | Visual — Color Semantics |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Color roles are identity law, not decoration: Action/accent `#ff6b35` acts; Done `#10b981` completes — never invert. Neutrals dominate the majority of pixels. Decorative purple/cyan/rainbow is identity leak. No new brand colors without founder approval. Accent never means shame.

**Reason:** Principle VL-1 — Color is identity, not decoration. Elevates semantic role law beyond GOV-036 lock statement.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration
  - **Quote:** Orange acts; green completes — never invert.
- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration
  - **Quote:** Neutrals should dominate the majority of pixels. Decorative purple/cyan/rainbow = identity leak.
- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration
  - **Quote:** No new brand colors without founder approval. Accent never means shame.
- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration — table
  - **Quote:** Action | `#ff6b35` | Primary action / Human Momentum ember
- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration — table
  - **Quote:** Done | `#10b981` | Completion truth

**Depends On:** `GOV-036`, `GOV-037`, `GOV-081`, `GOV-003`

**Blocks:** Design System, Visual QA Checklist, Android Theme, Website Brand, Component Tokens

**Referenced By:** P8, Design System, Android Build, Website, Desktop, Accessibility

**Implementation Impact:** Token maps and components must preserve orange=action / green=done semantics across web, native, brand. No shame-coded accent usage. Founder gate for any new brand hue.

### GOV-105 — Typography role matrix — Bodoni / Familjen / Figtree / JetBrains

| Field | Value |
|-------|-------|
| Category | Visual — Typography Roles |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Typography has jobs, not a font buffet: Bodoni Moda = wordmark/manifesto display (brand lockup & `/brand` only); Familjen Grotesk = ritual/display headlines; Figtree = product body/UI; JetBrains Mono = measure (scores, money, timers, OS IDs). Platform defaults may appear in native system chrome; controlled product surfaces prefer declared jobs.

**Reason:** Principle VL-3 — Typography has jobs. Elevates positive role matrix beyond GOV-090 ban list.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-3 — Typography has jobs (not a font buffet) — table
  - **Quote:** Wordmark / manifesto display | Bodoni Moda | Brand lockup & `/brand` only
- **Articles:** _n/a_
  - **Sections:** VL-3 — Typography has jobs (not a font buffet) — table
  - **Quote:** Ritual / display headlines | Familjen Grotesk | Brand moments, key OS headlines
- **Articles:** _n/a_
  - **Sections:** VL-3 — Typography has jobs (not a font buffet) — table
  - **Quote:** Product body / UI | Figtree | Nav, buttons, page titles, body
- **Articles:** _n/a_
  - **Sections:** VL-3 — Typography has jobs (not a font buffet) — table
  - **Quote:** Measure | JetBrains Mono | Scores, money, timers, OS IDs
- **Articles:** _n/a_
  - **Sections:** VL-3 — Typography has jobs (not a font buffet)
  - **Quote:** Platform defaults may appear in native system chrome; controlled product surfaces prefer declared jobs.

**Depends On:** `GOV-090`, `GOV-003`, `GOV-037`

**Blocks:** Typography Spec, Design System, Brand Surfaces, Android Typography, Website

**Referenced By:** P8, Design System, Android Build, Website, Desktop

**Implementation Impact:** Ship type tokens with these four jobs. Do not invent fifth brand identity face without founder. Keep Bodoni off daily product chrome except brand lockup.

### GOV-106 — Composition over collage — one story; cards for interaction only

| Field | Value |
|-------|-------|
| Category | Visual — Composition |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** First viewport of branded/marketing surfaces must read as one composition. Product Today: one primary capture story, not a widget flea market. Cards exist for interaction containers, not for looking “designed.”

**Reason:** Principle VL-4 — Composition over dashboard collage.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-4 — Composition over dashboard collage
  - **Quote:** First viewport of branded/marketing surfaces: one composition.
- **Articles:** _n/a_
  - **Sections:** VL-4 — Composition over dashboard collage
  - **Quote:** Product Today: one primary capture story, not a widget flea market.
- **Articles:** _n/a_
  - **Sections:** VL-4 — Composition over dashboard collage
  - **Quote:** Cards exist for interaction containers, not for looking “designed.”
- **Articles:** _n/a_
  - **Sections:** Known risks
  - **Quote:** Over-carding product UI under dashboard habit.

**Depends On:** `GOV-076`, `GOV-091`, `GOV-038`, `GOV-029`

**Blocks:** Today Layout, Landing/Brand Pages, Page Blueprints, Visual QA

**Referenced By:** P8, Design System, Website, Desktop, Android Build

**Implementation Impact:** Layout reviews reject collage first-viewports and decorative card grids. Today keeps one primary capture story.

### GOV-108 — Light and dark are one identity system

| Field | Value |
|-------|-------|
| Category | Visual — Dual Appearance |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Medium |
| Canon Class | canonical |

**Decision:** Light and dark are two appearances of one identity. Brand manifesto may be always-light. Product dark tokens must not be casually rewritten during light-mode craft. Resolve conflicts via Palette.md authority.

**Reason:** Principle VL-8 — Light and dark are one system.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-8 — Light and dark are one system
  - **Quote:** Two appearances; one identity.
- **Articles:** _n/a_
  - **Sections:** VL-8 — Light and dark are one system
  - **Quote:** Brand manifesto may be always-light.
- **Articles:** _n/a_
  - **Sections:** VL-8 — Light and dark are one system
  - **Quote:** Product dark tokens are not to be casually rewritten during light craft.
- **Articles:** _n/a_
  - **Sections:** VL-8 — Light and dark are one system
  - **Quote:** Resolve conflicts via Palette.md authority.

**Depends On:** `GOV-036`, `GOV-073`, `GOV-104`

**Blocks:** Light Mode Craft, Theme Architecture, Brand Manifesto Surfaces

**Referenced By:** P8, Design System, Website, Desktop, Android Build

**Implementation Impact:** Theme PRs must prove both appearances keep role meaning. Brand always-light is allowed; product dark rewrite during light craft requires founder/Palette ADR.

### GOV-110 — Native extends tokens — Material 3 maps meaning; no cousin brand

| Field | Value |
|-------|-------|
| Category | Visual — Native Token Extension |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Native extends AIIMIN tokens; it does not invent a cousin brand. Material 3 roles map from AIIMIN tokens. Platform behaviors may differ; color meaning must not. New platforms (watch, car, AR) inherit token meaning first, pixel recipes second.

**Reason:** Principle VL-10 — Native extends tokens, does not invent a cousin brand; Future impact.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-10 — Native extends tokens, does not invent a cousin brand
  - **Quote:** Material 3 roles map from AIIMIN tokens.
- **Articles:** _n/a_
  - **Sections:** VL-10 — Native extends tokens, does not invent a cousin brand
  - **Quote:** Platform behaviors may differ; color meaning must not.
- **Articles:** _n/a_
  - **Sections:** Future impact
  - **Quote:** New platforms (watch, car, AR) inherit token meaning first, pixel recipes second.

**Depends On:** `GOV-040`, `GOV-073`, `GOV-085`, `GOV-104`

**Blocks:** Android Theme Mapping, Cross-Client Visual Parity, Future Platforms

**Referenced By:** P8, Android Build, Design System, Website, Desktop

**Implementation Impact:** Android M3 mapping audit required. Reject native-only brand palettes that break Action/Done/Muted meaning.

### GOV-111 — Iconography supports wayfinding — critical actions keep words

| Field | Value |
|-------|-------|
| Category | Visual — Iconography |
| Status | Approved |
| Priority | P1 |
| Confidence | High |
| Implementation Cost | Low |
| Canon Class | canonical |

**Decision:** Icons support wayfinding; they do not replace words for critical actions. Emoji is not IA (already GOV-087).

**Reason:** Principle VL-6 — Iconography serves recognition.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-6 — Iconography serves recognition
  - **Quote:** Icons support wayfinding; they do not replace words for critical actions.
- **Articles:** _n/a_
  - **Sections:** VL-6 — Iconography serves recognition
  - **Quote:** Emoji is not IA.

**Depends On:** `GOV-087`, `GOV-071`, `GOV-056`

**Blocks:** Icon System, Critical Action UX, Accessibility Labels

**Referenced By:** P8, Design System, Android Build, Desktop, Accessibility

**Implementation Impact:** Destructive/save/capture critical controls retain visible text (or accessible name equivalent). Icons alone insufficient for critical actions.


### Canonical UX Decisions

### GOV-109 — Density matches cognitive mode — Capture / Command / Review / Brand

| Field | Value |
|-------|-------|
| Category | Visual — Density Modes |
| Status | Approved |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Visual density must match cognitive mode: Capture = low chrome, high focus; Command/power = higher density allowed; Review = calm, scannable; Brand = expressive, sparse hero.

**Reason:** Principle VL-9 — Density matches cognitive mode.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-9 — Density matches cognitive mode — table
  - **Quote:** Capture | Low chrome, high focus
- **Articles:** _n/a_
  - **Sections:** VL-9 — Density matches cognitive mode — table
  - **Quote:** Command / power | Higher density allowed
- **Articles:** _n/a_
  - **Sections:** VL-9 — Density matches cognitive mode — table
  - **Quote:** Review | Calm, scannable
- **Articles:** _n/a_
  - **Sections:** VL-9 — Density matches cognitive mode — table
  - **Quote:** Brand | Expressive, sparse hero

**Depends On:** `GOV-028`, `GOV-029`, `GOV-032`, `GOV-095`

**Blocks:** Page Blueprints, Component Density Tokens, Today Layout, Command Surfaces, Brand Pages

**Referenced By:** P8, Design System, Desktop, Android Build, Website, IA

**Implementation Impact:** Blueprints and components declare density mode. Do not apply Brand sparse-hero density to Capture, or Command density to Review by default.


### Canonical Accessibility Decisions

### GOV-107 — Contrast floors — body on ivory ≥4.5:1; dark without neon glow

| Field | Value |
|-------|-------|
| Category | Visual — Contrast |
| Status | Needs Discussion |
| Priority | P0 |
| Confidence | High |
| Implementation Cost | High |
| Canon Class | canonical |

**Decision:** Light mode body `#14171A` on ivory must remain ≥4.5:1. Dark mode must preserve readable hierarchy without neon glow crutches. Conflicting light canvas values (`#EDE4D3` ivory vs cool `#f9f9f9`) are debt — Palette.md arbitrates; not parallel options.

**Reason:** Principle VL-2 — Contrast is non-negotiable; VL-1 canvas debt note. Elevates numeric floors beyond GOV-071 generic critical-path contrast.

**Evidence:**

- **Articles:** _n/a_
  - **Sections:** VL-2 — Contrast is non-negotiable
  - **Quote:** Light mode body `#14171A` on ivory must remain ≥4.5:1.
- **Articles:** _n/a_
  - **Sections:** VL-2 — Contrast is non-negotiable
  - **Quote:** Dark mode must preserve readable hierarchy without neon glow crutches.
- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration — table
  - **Quote:** Canvas | Dark `#1a1a1a` / Light ivory `#EDE4D3` (Palette authority) | Place
- **Articles:** _n/a_
  - **Sections:** VL-1 — Color is identity, not decoration
  - **Quote:** Conflicting token sources (`:root` forest green, cool `#f9f9f9`, void black) are **debt**, not options — Palette.md arbitrates.
- **Articles:** _n/a_
  - **Sections:** Known risks
  - **Quote:** Document drift between `#f9f9f9` and ivory — Palette.md wins.

**Depends On:** `GOV-071`, `GOV-036`, `GOV-073`, `GOV-056`

**Blocks:** Accessibility Spec, Light Mode Ship, Visual QA, Token SoT

**Referenced By:** P8, Accessibility, Design System, Android Build, Website, Desktop

**Implementation Impact:** Founder must ratify light canvas authority (ivory vs `#f9f9f9`) and contrast QA gates. Until then treat ≥4.5:1 body contrast as provisional canon with open canvas conflict.


---

## 3. GOVERNANCE RECOMMENDATIONS

**NOT CANON.** Pending Founder. Do not cite as law until ratified.

### REC-034 — Ratify Approved VL GOVs (104–106, 108–111) as citeable visual canon

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** Design System Principles pass extracts durable visual law; Approved items need founder cite authority.
- **Impact:** Agents/PRs cite GOV-IDs for palette semantics, type jobs, composition, density, native mapping, icons.
- **Risk:** Medium if delayed — visual drift continues as taste debate.
- **Related GOV:** `GOV-104`, `GOV-105`, `GOV-106`, `GOV-108`, `GOV-109`, `GOV-110`, `GOV-111`

### REC-035 — Founder ADR: light canvas ivory `#EDE4D3` vs cool `#f9f9f9` — Palette.md wins; sync product-locks

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** CF-VL-001 / GOV-107 — VL and product always-on locks disagree on light bg.
- **Impact:** Closes token debt; unblocks light-mode ship + GOV-107.
- **Risk:** High if skipped — dual light canvases ship as “options.”
- **Related GOV:** `GOV-107`, `GOV-036`, `GOV-073`, `GOV-104`

### REC-036 — Publish type-role token companion under design-token SoT (with REC-020)

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-105 names families/jobs; SoT still unnamed (GOV-073 / REC-020).
- **Impact:** One file owns Bodoni/Familjen/Figtree/JetBrains mapping across clients.
- **Risk:** Medium — unemployed fonts return without SoT.
- **Related GOV:** `GOV-105`, `GOV-090`, `GOV-073`

### REC-037 — Add Visual QA gates: one-composition, cards-for-interaction, orange/green semantics, density-by-mode

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** Operationalize GOV-104/106/109 + Known risks (marketing freelancers / over-carding).
- **Impact:** PR/visual review checklist blocks collage Today and banned looks on landing.
- **Risk:** Low process cost; High drift if skipped.
- **Related GOV:** `GOV-104`, `GOV-106`, `GOV-109`, `GOV-037`

### REC-038 — Run Android Material 3 ↔ AIIMIN token meaning audit

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** GOV-110 requires M3 map without cousin brand.
- **Impact:** Native theme parity proof; catches cousin palettes early.
- **Risk:** High if delayed — two-product feel (also CF-IA-003).
- **Related GOV:** `GOV-110`, `GOV-073`, `GOV-040`, `GOV-104`

### REC-039 — Founder confirm GOV-107 contrast floors close GOV-071 specificity gap

- **Priority:** P1
- **Status:** Pending Founder
- **Reason:** GOV-071 Needs Discussion; VL-2 supplies ≥4.5:1 + anti-neon — complementary not contradiction.
- **Impact:** Accessibility bar becomes citeable numbers.
- **Risk:** Medium — a11y stays vague without confirmation.
- **Related GOV:** `GOV-107`, `GOV-071`

### REC-040 — Next P7 artifact: 14_DESIGN_SYSTEM_SPECIFICATION (tokens/contracts) or 09_MOTION_PRINCIPLES

- **Priority:** P0
- **Status:** Pending Founder
- **Reason:** VL principles depend on Design System Spec for token contracts; motion next in visual stack. Page Blueprints still open from IA.
- **Impact:** Continues build-without-reread completeness for visual stack.
- **Risk:** Low.
- **Related GOV:** `GOV-104`, `GOV-105`, `GOV-110`, `GOV-073`

---

## 4. Conflicts

Flagged only — **not** auto-resolved. Prior governance unchanged.

| Conflict ID | Type | Detail | Recommendation |
|-------------|------|--------|----------------|
| CF-VL-001 | Token conflict — light canvas | VL-1 locks light canvas ivory `#EDE4D3` (Palette authority) while product always-on locks and some docs still cite cool `#f9f9f9`. Source itself calls this debt. Not auto-resolved. | REC-035. Palette.md ADR; update product-locks if ivory wins. |
| CF-VL-002 | Complementary Needs Discussion (not contradiction) | VL-7 restates split lockup as sacred; Constitution GOV-012 still Needs Discussion (route bind Today≡/overview). GOV-039 already Approved visual+IA law. No new lockup GOV minted. | Keep REC-003. Do not re-open lockup geometry. |
| CF-VL-003 | Complementary Needs Discussion (not contradiction) | GOV-071 asserts critical-path contrast without numbers; GOV-107 supplies ≥4.5:1 and anti-neon. Do not auto-close GOV-071. | REC-039. |
| CF-VL-004 | Incomplete — token SoT unnamed | VL-1/8/10 require Palette.md arbitration and cross-client meaning; GOV-073 still Needs Discussion and REC-020 SoT unnamed. | Keep REC-020 + REC-036. |
| CF-VL-005 | Known risk — marketing banned looks | Known risks: Marketing freelancers introducing banned looks “just for landing.” Touches GOV-037/010; composition law GOV-106. | REC-037 Visual QA on landing/brand. |
| CF-VL-006 | Known risk — over-carding | Known risks: Over-carding product UI under dashboard habit. GOV-106 + GOV-091 address; enforcement still process-gap. | REC-037. |
| CF-VL-007 | Dependency on open IA intent | GOV-109 density modes map to Capture/Command/Review/Brand; Command/Review alignment with five IA intents (GOV-095 Needs Discussion) is incomplete. | Keep REC-028; density modes stay valid even if intent names shift. |

---

## 5. Missing Decisions

| Gap ID | Missing | Why | Next |
|--------|---------|-----|------|
| M-VL-001 | Founder ADR light canvas ivory vs `#f9f9f9` | GOV-107 / CF-VL-001 | REC-035 |
| M-VL-002 | Named design-token SoT + type-role companion | GOV-073 / GOV-105 | REC-020 + REC-036 |
| M-VL-003 | Visual QA checklist operationalization | GOV-104/106/109 Known risks | REC-037 |
| M-VL-004 | Android M3 token mapping audit | GOV-110 | REC-038 |
| M-VL-005 | Design System Specification contracts (space scale values, elevation, motion bands) | VL Dependencies cite 14_DESIGN_SYSTEM_SPECIFICATION | Govern 14_DESIGN_SYSTEM_SPECIFICATION |
| M-VL-006 | Motion principles for atmosphere vs decoration boundary | VL Related sections cite 09_MOTION | Govern 09_MOTION_PRINCIPLES |

---

## 6. Questions for Founder

1. Approve light canvas as ivory `#EDE4D3` (Palette) and retire cool `#f9f9f9` as Life OS light bg (REC-035)?
2. Confirm GOV-107 ≥4.5:1 + anti-neon closes GOV-071 numeric gap (REC-039)?
3. Ratify type role matrix Bodoni/Familjen/Figtree/JetBrains as sole brand jobs (GOV-105)?
4. Brand manifesto always-light: keep as exception under GOV-108?
5. Density mode labels: keep Capture/Command/Review/Brand or rename to match five IA intents after GOV-095?
6. Native M3: audit now before Play Console scale (REC-038)?
7. Next artifact: 14_DESIGN_SYSTEM_SPECIFICATION, 09_MOTION_PRINCIPLES, or Page Blueprints (REC-040)?

---

## 7. Dependency Graph Summary

### Highest fan-in (from new GOV-104…111)

| GOV ID | Count | Title (if known) |
|--------|-------|------------------|
| GOV-036 | 3 | Palette identity non-negotiable |
| GOV-073 | 3 | Cross-client token meaning aligned; drift is debt |
| GOV-037 | 2 | Forbidden aesthetics + brand-test |
| GOV-003 | 2 | Brand frame — Human Momentum |
| GOV-029 | 2 | Read surfaces stay calm |
| GOV-071 | 2 | Critical-path contrast and operable capture |
| GOV-056 | 2 | Cognitive accessibility under load |
| GOV-104 | 2 | Semantic color roles |
| GOV-081 | 1 | Dead accent revival ban |
| GOV-090 | 1 | No Inter-as-brand-identity; no unemployed font buffet |
| GOV-076 | 1 | Today anti-clutter |
| GOV-091 | 1 | No identical glass-card grids |
| GOV-038 | 1 | Decoration must not confuse |
| GOV-028 | 1 | Capture first, structure later |
| GOV-032 | 1 | Progressive disclosure by stakes |
| GOV-095 | 1 | Primary IA intents |
| GOV-040 | 1 | Shared primitives across surfaces |
| GOV-085 | 1 | Capacitor not primary; native not /m ceiling |
| GOV-087 | 1 | No emoji-as-IA; no color-only critical status |

### Extreme / High cost (new)

| GOV ID | Title | Cost | Blocks |
|--------|-------|------|--------|
| GOV-107 | Contrast floors — body on ivory ≥4.5:1; dark without neon glow | High | Accessibility Spec, Light Mode Ship, Visual QA |
| GOV-109 | Density matches cognitive mode — Capture / Command / Review / Brand | High | Page Blueprints, Component Density Tokens, Today Layout |
| GOV-110 | Native extends tokens — Material 3 maps meaning; no cousin brand | High | Android Theme Mapping, Cross-Client Visual Parity, Future Platforms |

### Needs Discussion

| GOV ID | Title |
|--------|-------|
| GOV-107 | Contrast floors — body on ivory ≥4.5:1; dark without neon glow |

---

## 8. Final Governance Score

| Dimension | Score (/10) |
|-----------|-------------|
| Identity clarity | 9 |
| Enforceability | 8 |
| Cross-platform readiness | 8 |
| AI readiness | 5 |
| Conflict hygiene | 8 |
| Metric rigor | 8 |
| Amendment process | 8 |
| Completeness for build-without-reread | 7 |
| Traceability / evidence | 9 |
| Machine-readability | 9 |

### Final Governance Score: **79 / 100**

Visual Language / Design System Principles supply semantic color, type jobs, composition, dual-appearance, density modes, native token extension, and icon-word rules missing as citeable canon. GOV-107 Needs Discussion until ivory vs `#f9f9f9` ADR. No hard contradiction with Constitution/NN/IA; conflicts flagged only. AI readiness low — visual stack not AI law.

---

## Evidence (process)

- Source read: `07_VISUAL_LANGUAGE_PRINCIPLES.md` v3.0 FROZEN (alias label Design System Principles)
- Cross-ref: Constitution + Non-Negotiables + IA Principles + MASTER_DECISION_REGISTRY
- Untouched: Constitution/, Non-Negotiables/, IA-Principles/, 00_GOVERNANCE_STANDARD.md
- New GOV: GOV-104…GOV-111
- Validation: continuous IDs, schema, dup GOV, dup decision, broken deps/refs, evidence — see closeout
