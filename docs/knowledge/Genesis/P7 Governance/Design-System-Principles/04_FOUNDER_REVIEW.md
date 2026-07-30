# 04 — Founder Review Packet

```yaml
document: Founder Review Packet
artifact: Design System Principles (Visual Language Principles)
phase: P7
source: AIIMIN GENESIS/P5 Constitution/07_VISUAL_LANGUAGE_PRINCIPLES.md
source_alias: 07_DESIGN_SYSTEM_PRINCIPLES.md → 07_VISUAL_LANGUAGE_PRINCIPLES.md
governance_trio: AIIMIN GENESIS/P7 Governance/Design-System-Principles/
date: 2026-07-22
purpose: Decision packet only — minimize founder review time
```

> Not documentation. Not new governance. No new GOV/REC IDs. Decide and mark.

---

## Artifact

`07_VISUAL_LANGUAGE_PRINCIPLES.md` v3.0 (FROZEN)  
Governed under `00_GOVERNANCE_STANDARD.md`  
Trio: `01_GOVERNANCE_REPORT.md` · `02_GOVERNANCE_DECISIONS.json` · `03_GOVERNANCE_INDEX.md`

---

## Summary

Design System Principles extract visual identity law that Constitution / Non-Negotiables / IA left incomplete as citeable role matrices (color semantics, type jobs, composition, dual appearance, density modes, native token extension, icon-word rule).

**8 new GOV** (104–111). **17 existing GOV reused** (no duplicates). **7 REC** pending. **1 Needs Discussion** (GOV-107 light canvas + contrast floors). **No hard contradiction** with Constitution, Non-Negotiables, or IA — conflicts are token-debt / incompleteness flags.

---

## Governance Score

**79 / 100**

Strong identity + evidence; weak until ivory vs `#f9f9f9` ADR and token SoT named.

---

## New GOV Decisions

| ID | Title | Status | Cost |
|----|-------|--------|------|
| GOV-104 | Semantic color roles — orange acts; green completes; neutrals dominate | Approved | Medium |
| GOV-105 | Typography role matrix — Bodoni / Familjen / Figtree / JetBrains | Approved | Medium |
| GOV-106 | Composition over collage — one story; cards for interaction only | Approved | Medium |
| GOV-107 | Contrast floors — body on ivory ≥4.5:1; dark without neon glow | Needs Discussion | High |
| GOV-108 | Light and dark are one identity system | Approved | Medium |
| GOV-109 | Density matches cognitive mode — Capture / Command / Review / Brand | Approved | High |
| GOV-110 | Native extends tokens — M3 maps meaning; no cousin brand | Approved | High |
| GOV-111 | Iconography supports wayfinding — critical actions keep words | Approved | Low |

---

## Existing GOV Decisions Reused

GOV-012, GOV-028, GOV-029, GOV-032, GOV-036, GOV-037, GOV-038, GOV-039, GOV-040, GOV-071, GOV-073, GOV-076, GOV-081, GOV-085, GOV-087, GOV-090, GOV-091  
*(17 unique — VL items mapped to prior canon; no re-mint)*

---

## REC Items

| ID | Title | Priority |
|----|-------|----------|
| REC-034 | Ratify Approved VL GOVs as citeable visual canon | P0 |
| REC-035 | ADR: ivory `#EDE4D3` vs cool `#f9f9f9`; sync product-locks | P0 |
| REC-036 | Type-role companion under design-token SoT (with REC-020) | P0 |
| REC-037 | Visual QA gates (composition / cards / orange-green / density) | P0 |
| REC-038 | Android M3 ↔ AIIMIN token meaning audit | P0 |
| REC-039 | Confirm GOV-107 closes GOV-071 specificity gap | P1 |
| REC-040 | Next: 14_DESIGN_SYSTEM_SPECIFICATION or 09_MOTION | P0 |

---

## Conflicts

| ID | Meaning | Action for founder |
|----|---------|-------------------|
| CF-VL-001 | Ivory `#EDE4D3` vs `#f9f9f9` light canvas debt | Decide via REC-035; Palette.md wins |
| CF-VL-002 | VL-7 lockup restates GOV-012/039; route bind still open | Keep REC-003; do not re-mint lockup |
| CF-VL-003 | GOV-071 vague vs GOV-107 numeric floors | Confirm complementarity (REC-039) |
| CF-VL-004 | Token SoT still unnamed (GOV-073) | Keep REC-020 + REC-036 |
| CF-VL-005 | Marketing freelancers banned looks risk | REC-037 on landing/brand |
| CF-VL-006 | Over-carding dashboard habit | REC-037 |
| CF-VL-007 | Density modes vs open GOV-095 intents | Density stands; align labels later |

---

## Needs Discussion

GOV-107

---

## Most Important Decisions

1. **GOV-104** — Orange acts / green completes / neutrals dominate  
2. **GOV-105** — Type role matrix (four jobs)  
3. **GOV-107** — Contrast floors + light canvas ADR *(blocking light ship clarity)*  
4. **GOV-106** — One composition; cards for interaction only  
5. **GOV-109** — Density-by-mode  
6. **GOV-110** — Native M3 extends meaning, no cousin brand  
7. **GOV-108** — One identity across light/dark  
8. **GOV-111** — Critical actions keep words  

---

## Founder Decisions Required

### GOV-107 — Contrast floors + light canvas

| Field | Content |
|-------|---------|
| **Decision ID** | GOV-107 |
| **Current Proposal** | Body `#14171A` on ivory ≥4.5:1; dark hierarchy without neon glow; ivory `#EDE4D3` is light canvas per VL/Palette authority; `#f9f9f9` is debt not option. |
| **Alternatives** | **A)** Adopt ivory + ≥4.5:1; update product-locks to ivory. **B)** Keep cool `#f9f9f9` as Life OS light bg; treat VL ivory as brand-only. **C)** Defer light ship; keep GOV-071 vague until Accessibility Principles pass. |
| **Pros** | A: matches VL + Palette authority language. B: less churn on existing web CSS. C: buys time. |
| **Cons** | A: product-locks + CSS churn. B: dual light canvases = continued debt (violates VL-1 debt rule). C: blocks light craft. |
| **Recommended Option** | **A** — ivory as Life OS light canvas; sync locks; close contrast numeric gap. |
| **Impact if delayed** | Light mode and a11y QA stay ambiguous; token drift continues. |
| **Required Before** | Light-mode ship / Visual QA. |

---

## Potential Risks

| Domain | Risk |
|--------|------|
| **Architectural** | Dual light canvases (CF-VL-001) → two products feel. |
| **Architectural** | Native cousin brand without GOV-110 audit. |
| **UX** | Over-carding Today despite GOV-106. |
| **UX** | Density mode mismatch after GOV-095 intent rename. |
| **Engineering** | Type jobs without SoT (GOV-073 open) → Inter creep returns. |
| **Product** | Marketing landing reintroduces banned looks. |
| **Accessibility** | GOV-071 stays vague if GOV-107 not ratified. |

---

## Recommended Ratification

### APPROVE WITH CHANGES

**Justification:** Extraction clean — Approved GOVs (104–106, 108–111) should stand as citeable visual canon. Do **not** reject. Do **not** mint more GOV/REC in this pass.

**Required changes before calling this artifact “closed”:**

1. Decide **GOV-107** (recommend: ivory + ≥4.5:1; sync product-locks).  
2. Confirm **REC-039**: GOV-107 closes GOV-071 numeric gap (GOV-071 may stay open for operable-capture WCAG details).  
3. Choose next visual P7 artifact (**REC-040**): Design System Spec vs Motion (Page Blueprints still open from IA).

Until GOV-107 marked, treat light-canvas ADR as **blocking for light-mode ship**, not as rejected law.

---

## Founder sign-off (fill in)

| Field | Value |
|-------|-------|
| Decision | ☐ APPROVE · ☐ APPROVE WITH CHANGES · ☐ REJECT |
| Date | |
| Notes | |
| GOV-107 choice | A / B / C |
| Next artifact | Design System Spec / Motion / Page Blueprints / Other: ___ |
