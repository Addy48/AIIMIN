# 04 — Design History

```yaml
purpose: How AIIMIN visual/UX design evolved — survivors, deaths, locks.
confidence: ★★★★☆
generated_from:
  - DESIGN.md
  - docs/knowledge/08_DESIGN/Palette.md
  - MASTER_PLAN.md
  - docs/knowledge/09_FEATURES/Waitlist/Changelog.md
  - docs/knowledge/09_FEATURES/Typography/Typography.md
  - docs/knowledge/09_FEATURES/Reports/Prototypes.md
  - docs/knowledge/12_SPRINTS/Craft-Master-Plan-AJ.md
  - docs/knowledge/12_SPRINTS/UI-Improvement-Brief-2026-07-18.md
  - docs/knowledge/17_NATIVE_APP_V2/06_DESIGN_SYSTEM.md
  - PRODUCT.md
related_notes: [01_PRODUCT_HISTORY.md, 10_BRAND_HISTORY.md, 14_CONTRADICTIONS.md]
dependencies: [02_PRODUCT_PHILOSOPHY.md]
consumers: Design / frontend agents
importance: ★★★★★
```

---

## EVOLUTION ERAS

| Era | Design stance | Survived? |
|-----|---------------|-----------|
| Pre-lock (≤2026-06) | Feature UI accumulation; Clerk premium login redesign | Partial chrome only |
| MASTER_PLAN Phase 0 (2026-06-25) | Electric blue `#2563EB`, Outfit font "design overhaul" | **NO** — superseded |
| Palette lock | Dark Life OS + burnt orange accent | **YES — LOCKED** |
| Waitlist craft (Jul) | Modular landing; Familjen/Figtree/JetBrains; Nordic→Gradient Grove email | Landing yes; email themes churned |
| Brand detour (2026-07-17) | WaitlistBrand forest-green as `/brand` | **NO — reverted** |
| Human Momentum brand | Always-light ivory manifesto + ember cursor | **YES** |
| Craft Tracks A–J | Journal studio, ivory reports, typography tokens | Local; ship pending |
| Native M3 extension | Same tokens mapped to Material 3 roles | Active |

---

## LOCKED TOKENS (CURRENT)

| Token | Dark | Light |
|-------|------|-------|
| bg | `#1a1a1a` | `#EDE4D3` (Palette) / `#f9f9f9` (DESIGN.md — conflict) |
| cards | `#2d2d2d` | `#ffffff` |
| accent | `#ff6b35` | same (light alt `#E85A24` noted) |
| done | `#10b981` | same |
| muted | `#6b7280` | same |
| light body | — | `#14171A` |

**Authority:** `docs/knowledge/08_DESIGN/Palette.md` wins when conflict.

---

## WHAT CHANGED / WHY

| Change | Why | Status |
|--------|-----|--------|
| Blue → orange accent | Brand action signal; anti-generic SaaS | Locked |
| Leaf logo → Arch Bracket mark | Stronger identity (Editor Pick / Route Y) | Shipped |
| WaitlistBrand → Human Momentum | Brand is philosophy not waitlist skin | Shipped |
| Navbar split lockup | Brand book vs Today separation | Locked |
| Quick Capture tiles removed | One capture primitive (Universal Logger) | Craft J0=A |
| Journal studio redesign | Low-friction reflection surface | Craft B1 |
| Folio → Life OS Review visual | Reports as Life OS product | Naming + craft |
| Elite prototypes (6 paradigms) | Pick interactive Elite direction | Design Lab only |
| Typography token phase 1 | Metric components; scale consistency | Phase1 complete |
| Motion discipline | 150–250ms; opacity+transform; max 2–3 motions | DESIGN.md |
| ConfirmDialog over `window.confirm` | Branded destructive confirm | In progress (14 remain) |
| Ivory light canvas craft | Warm not sterile white | Craft Track I |

---

## SURVIVED IDEAS

- Dark-first product UI
- Orange accent as action
- Human Momentum manifesto structure
- Familjen Grotesk + Figtree + JetBrains Mono on brand/waitlist
- Free-pin navigation masthead
- Design Lab before production (Today prototypes, Elite paradigms)
- Native extends same palette into M3

---

## DISAPPEARED IDEAS

| Idea | Fate |
|------|------|
| Electric blue `#2563EB` + Outfit as system | Superseded by palette lock |
| WaitlistBrand forest-green `/brand` | Reverted 2026-07-17 |
| Campus strip (BITS/IIT) waitlist social | Removed |
| c1–c5 waitlist email theme experiments | Collapsed to Resend template |
| Quick Capture tile grid on Today | Removed |
| Sidebar-forced taxonomy | Rejected |
| Elite = longer PDF | Rejected |
| GoodNotes handwriting chrome | Rejected |
| Purple OAuth chrome | Explicit anti-pattern |
| Leaf logo | Replaced by Arch Bracket |

---

## DESIGN PRINCIPLES THAT SHAPED HISTORY

From `PRODUCT.md` + philosophy:
1. Capture cost low
2. Pattern language not shame
3. One linking system
4. Familiarity over novelty
5. Device-tier UI ceilings

---

## NATIVE DESIGN BRANCH

| Item | Detail |
|------|--------|
| System | Material 3 roles from locked AIIMIN tokens |
| Type | Figtree/Familjen + JetBrains for scores |
| Motion | Native motion language doc `07_MOTION.md` |
| UX kill list | Native-specific in `05_NATIVE_UX.md` |
| Diff from web | Rich companion IA (5 tabs), not capture-only |

---

## OPEN DESIGN CONFLICTS

See `14_CONTRADICTIONS.md`:
- Light bg `#f9f9f9` vs ivory `#EDE4D3`
- Light accent `#E85A24` vs `#ff6b35`
- MASTER_PLAN design section obsolete
