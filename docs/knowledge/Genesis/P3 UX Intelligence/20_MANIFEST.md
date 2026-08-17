# 20 — Manifest

## Purpose
Index the UX Intelligence package, evidence inventory, cross-links, and regeneration notes for future teams.

## Confidence
★★★★★ — File presence verified at generation.

## Evidence Sources
Package authorship 2026-07-22; upstream audits dated 2026-07-11–19; live site check 2026-07-22.

## Files Used
This directory; cited repos paths below.

## Reasoning
Manifest prevents orphan docs and documents confidence limits.

## Dependencies
None.

## Consumers
Agents, UX hires, Genesis Phase 4+.

## Known Unknowns
Whether later phases will relocate this folder under `docs/`.

---

## Package contents

| File | Status |
|------|--------|
| `00_EXECUTIVE_SUMMARY.md` | present |
| `01_FIRST_IMPRESSION.md` | present |
| `02_USER_PERSONAS.md` | present |
| `03_INFORMATION_ARCHITECTURE.md` | present |
| `04_USER_JOURNEYS.md` | present |
| `05_NAVIGATION_AUDIT.md` | present |
| `06_ATTENTION_FLOW.md` | present |
| `07_COGNITIVE_LOAD.md` | present |
| `08_TRUST_ANALYSIS.md` | present |
| `09_EMOTIONAL_DESIGN.md` | present |
| `10_MICROCOPY_AUDIT.md` | present |
| `11_ACCESSIBILITY.md` | present |
| `12_PLATFORM_CONTINUITY.md` | present |
| `13_AI_SLOP_ANALYSIS.md` | present |
| `14_FRICTION_ANALYSIS.md` | present |
| `15_DELIGHT_ANALYSIS.md` | present |
| `16_BEHAVIORAL_DESIGN.md` | present |
| `17_UX_OPPORTUNITIES.md` | present |
| `18_RISK_REGISTER.md` | present |
| `19_EXECUTIVE_SCORECARD.md` | present |
| `20_MANIFEST.md` | present |

---

## Upstream intelligence

| Package | Path | Used? |
|---------|------|-------|
| Knowledge Context | `AIIMIN_KNOWLEDGE_CONTEXT/` | Yes (full 00–20 + inventory present at finalize) |
| Product Intelligence | `docs/product-intelligence/` | Yes |
| Product Bible | `docs/AIIMIN_PRODUCT_BIBLE/` | Yes |
| Interaction Audit | `docs/interaction-audit/` | Yes |
| Repo Intelligence | — | **Not found** — discovery performed independently |
| Native UX pack | `docs/knowledge/17_NATIVE_APP_V2/` | Yes |
| Vault Home/Context | `docs/knowledge/00_HOME.md`, `15_MEMORY/Current-Context.md` | Yes |

---

## Primary evidence paths (non-exhaustive)

### Web
- `frontend/src/App.js`
- `frontend/src/constants/navItems.js`
- `frontend/src/pages/Overview.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Onboarding.jsx`
- `frontend/src/components/onboarding/ProductTour.jsx`
- `frontend/src/components/UniversalLogger.jsx` (path may vary — Logger component)
- `frontend/src/components/layout/BrandLockup.jsx`
- `frontend/src/components/mobile/*`

### Native
- `native-android/.../AiiminRoot.kt`
- `native-android/.../SyncBanner.kt`
- `native-android/.../WelcomeGate.kt`
- `native-android/.../HomeScreen.kt` / Journal / Notes

### Docs
- `docs/interaction-audit/friction.md`
- `docs/interaction-audit/COMPLETE_INTERACTION_AUDIT.md`
- `docs/AIIMIN_PRODUCT_BIBLE/09_USER_JOURNEY.md`
- `docs/product-intelligence/HUMAN_INTENT_GRAPH.md`
- `docs/knowledge/02_ARCHITECTURE/Device-Tiers.md`
- `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md`
- `docs/knowledge/08_DESIGN/Palette.md`

### Live / prototype
- `https://www.aiimin.in/` (200, waitlist SEO) — 2026-07-22
- `/Users/aaditya/prototype-chat/aiimin-prototype/index-opus.html`
- `/Users/aaditya/Downloads/aiimin new prototype.html`

---

## Stale sources to distrust until refreshed

- `docs/interaction-audit/navigation.md` §9 claiming `/m` not implemented
- Product Guide line “Native … not shipped” (APK 2.2.1-native exists per Current-Context)
- Brand lockup → overview-only notes in old audit

---

## Cross-link graph (simplified)

```
00 → all
01 ↔ 10 ↔ 13
03 ↔ 05 ↔ 12
04 ↔ 07 ↔ 14 ↔ 17
08 ↔ 09 ↔ 16
15 ↔ 13
18 ↔ 17 ↔ 19
20 indexes all
```

---

## Regeneration

Re-run when:
- Onboarding step count changes
- Today composition ships J0
- Native gains habit create / Practice-Revise
- Telemetry WAC goes live
- Prototype nouns merge with production

---

## Success criteria checklist

| Criterion | Met? |
|-----------|------|
| Important journeys audited | Yes — [[04_USER_JOURNEYS]] |
| Conclusions evidenced | Yes — citations throughout |
| Major friction documented | Yes — [[14_FRICTION_ANALYSIS]] |
| Opportunities prioritized | Yes — [[17_UX_OPPORTUNITIES]] |
| AI Slop completed | Yes — [[13_AI_SLOP_ANALYSIS]] |
| Platform continuity evaluated | Yes — [[12_PLATFORM_CONTINUITY]] |
| Attention analyzed | Yes — [[06_ATTENTION_FLOW]] |
| Cognitive load measured | Yes — [[07_COGNITIVE_LOAD]] |
| Reports cross-linked | Yes |
| Self-review performed | Yes — [[19_EXECUTIVE_SCORECARD]] |

---

## Status
`passed` — UX Intelligence Package v1 generated 2026-07-22.
