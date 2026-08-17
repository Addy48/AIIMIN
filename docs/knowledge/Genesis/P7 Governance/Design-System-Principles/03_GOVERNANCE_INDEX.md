# 03 — Design System Principles Governance Index

```yaml
document: Design System Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-104 | Semantic color roles — orange acts; green completes; neutrals dominate | Visual — Color Semantics | Approved | High | Medium | GOV-036, GOV-037, GOV-081, GOV-003 | VL-1 — Color is identity, not decoration; VL-1 — Color is identity, not decoration — table |
| GOV-105 | Typography role matrix — Bodoni / Familjen / Figtree / JetBrains | Visual — Typography Roles | Approved | High | Medium | GOV-090, GOV-003, GOV-037 | VL-3 — Typography has jobs (not a font buffet); VL-3 — Typography has jobs (not a font buffet) — table |
| GOV-106 | Composition over collage — one story; cards for interaction only | Visual — Composition | Approved | High | Medium | GOV-076, GOV-091, GOV-038, GOV-029 | Known risks; VL-4 — Composition over dashboard collage |
| GOV-107 | Contrast floors — body on ivory ≥4.5:1; dark without neon glow | Visual — Contrast | Needs Discussion | High | High | GOV-071, GOV-036, GOV-073, GOV-056 | Known risks; VL-1 — Color is identity, not decoration; VL-1 — Color is identity, not decoration — table; VL-2 — Contrast is non-negotiable |
| GOV-108 | Light and dark are one identity system | Visual — Dual Appearance | Approved | High | Medium | GOV-036, GOV-073, GOV-104 | VL-8 — Light and dark are one system |
| GOV-109 | Density matches cognitive mode — Capture / Command / Review / Brand | Visual — Density Modes | Approved | High | High | GOV-028, GOV-029, GOV-032, GOV-095 | VL-9 — Density matches cognitive mode — table |
| GOV-110 | Native extends tokens — Material 3 maps meaning; no cousin brand | Visual — Native Token Extension | Approved | High | High | GOV-040, GOV-073, GOV-085, GOV-104 | Future impact; VL-10 — Native extends tokens, does not invent a cousin brand |
| GOV-111 | Iconography supports wayfinding — critical actions keep words | Visual — Iconography | Approved | High | Low | GOV-087, GOV-071, GOV-056 | VL-6 — Iconography serves recognition |

## Existing GOV referenced (no new ID)

| VL item | Existing GOV | Note |
|---------|--------------|------|
| VL-1 (palette lock + anti-clone + drift + dead accents) | GOV-036, GOV-037, GOV-073, GOV-081 | Palette identity / forbidden looks / token drift debt / dead accent bans — semantic orange/green elevated in GOV-104 |
| VL-2 (contrast requirement core) | GOV-071 | Critical-path contrast asserted; numeric floors elevated in GOV-107 |
| VL-3 (Inter/buffet ban) | GOV-090 | Ban Inter-as-identity + unemployed buffet; named role matrix elevated in GOV-105 |
| VL-4 (Today anti-clutter + anti glass-grid) | GOV-076, GOV-091 | Today anti-widget + no glass-grid-only personality; one-composition/cards-for-interaction elevated in GOV-106 |
| VL-5 (atmosphere / anti trend costumes) | GOV-037, GOV-038 | Forbidden aesthetics + decoration-must-not-confuse cover purple mesh / glassmorphism / cream-terracotta costumes |
| VL-6 (emoji/color-only) | GOV-087 | Emoji not IA + no color-only critical status; icons-keep-words elevated in GOV-111 |
| VL-7 (split lockup) | GOV-012, GOV-039 | Split mark→/brand wordmark→Today already constitution+visual law — no new ID |
| VL-8 (token identity / Palette authority) | GOV-036, GOV-073 | Palette non-negotiable + drift-is-debt; one-system light/dark elevated in GOV-108 |
| VL-9 (capture/review calm anchors) | GOV-028, GOV-029, GOV-032 | Capture-first / calm read / progressive disclosure; density-by-mode matrix elevated in GOV-109 |
| VL-10 (shared primitives + ceilings) | GOV-040, GOV-073, GOV-085 | Shared primitives / token alignment / native≠/m ceiling; M3 cousin-brand ban elevated in GOV-110 |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-034 | Ratify Approved VL GOVs (104–106, 108–111) as citeable visual canon | P0 | Pending Founder | GOV-104, GOV-105, GOV-106, GOV-108, GOV-109, GOV-110, GOV-111 |
| REC-035 | Founder ADR: light canvas ivory `#EDE4D3` vs cool `#f9f9f9` — Palette.md wins; sync product-locks | P0 | Pending Founder | GOV-107, GOV-036, GOV-073, GOV-104 |
| REC-036 | Publish type-role token companion under design-token SoT (with REC-020) | P0 | Pending Founder | GOV-105, GOV-090, GOV-073 |
| REC-037 | Add Visual QA gates: one-composition, cards-for-interaction, orange/green semantics, density-by-mode | P0 | Pending Founder | GOV-104, GOV-106, GOV-109, GOV-037 |
| REC-038 | Run Android Material 3 ↔ AIIMIN token meaning audit | P0 | Pending Founder | GOV-110, GOV-073, GOV-040, GOV-104 |
| REC-039 | Founder confirm GOV-107 contrast floors close GOV-071 specificity gap | P1 | Pending Founder | GOV-107, GOV-071 |
| REC-040 | Next P7 artifact: 14_DESIGN_SYSTEM_SPECIFICATION (tokens/contracts) or 09_MOTION_PRINCIPLES | P0 | Pending Founder | GOV-104, GOV-105, GOV-110, GOV-073 |

## Quick filters

### Needs Discussion

- GOV-107 — Contrast floors — body on ivory ≥4.5:1; dark without neon glow

### High cost

- GOV-107 — Contrast floors — body on ivory ≥4.5:1; dark without neon glow
- GOV-109 — Density matches cognitive mode — Capture / Command / Review / Brand
- GOV-110 — Native extends tokens — Material 3 maps meaning; no cousin brand

### Conflicts

- CF-VL-001 — Token conflict — light canvas
- CF-VL-002 — Complementary Needs Discussion (not contradiction)
- CF-VL-003 — Complementary Needs Discussion (not contradiction)
- CF-VL-004 — Incomplete — token SoT unnamed
- CF-VL-005 — Known risk — marketing banned looks
- CF-VL-006 — Known risk — over-carding
- CF-VL-007 — Dependency on open IA intent
