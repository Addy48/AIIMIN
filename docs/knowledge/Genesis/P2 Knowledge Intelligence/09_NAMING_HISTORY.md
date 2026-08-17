# 09 — Naming History

```yaml
purpose: All renames and naming philosophy — product, features, metrics, brand terms.
confidence: ★★★★☆
generated_from:
  - docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md
  - docs/knowledge/09_FEATURES/Waitlist/Changelog.md
  - docs/knowledge/09_FEATURES/Reports/Reports.md
  - docs/knowledge/09_FEATURES/Account/Personalization.md
  - docs/knowledge/09_FEATURES/Overview/Overview.md
  - docs/knowledge/17_NATIVE_APP_V2/01_PRD.md
  - PRODUCT.md
related_notes: [10_BRAND_HISTORY.md, 01_PRODUCT_HISTORY.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Copy / brand / docs agents
importance: ★★★★☆
```

---

## PRODUCT NAME

| Term | Notes | Confidence |
|------|-------|------------|
| **AIIMIN** | Stable product name | ★★★★★ |
| Pronunciation | *aim-in* | ★★★★★ Product Guide |
| Etymology / rename origin | **Not documented in vault** | ★☆☆☆☆ gap |

---

## POSITIONING NAMES

| Term | History | Status |
|------|---------|--------|
| Personal Life OS | Canonical category | current |
| Personal OS | Waitlist v8 tagline under AIIMIN | historical / overlapping |
| Life OS | Dominant later positioning | current |
| Human Momentum | Brand philosophy frame | current |
| Dashboard | Informal / early | informal only |

---

## FEATURE / SURFACE RENAMES

| Old | New | When | Source |
|-----|-----|------|--------|
| North Star (profile tagline) | Life Arc | 2026-07-09 | Personalization.md |
| Folio | Life OS Review | 2026-07-18 | Reports.md |
| Insights (standalone) | Reports tabs (`/insights` redirect) | ~2026-07 | Reports.md / Product Guide |
| Command Center (vault) | Vault Brain OS / Home | 2026-07-10 | Brain OS ADR |
| Wealth | Finance (internal recovery note) | 2026-07-08 | archive Command Center |
| Today / Overview | Route `/overview`; copy "Today" | ongoing | Overview.md |
| WaitlistBrand | Human Momentum `/brand` | 2026-07-17 revert | Waitlist Changelog |
| Leaf logo | Arch Bracket mark | 2026-07-08 | Waitlist Changelog |

---

## IDENTIFIERS & TIERS

| Name | Meaning | Status |
|------|---------|--------|
| OS-ID | 8-char handle; waitlist reserve + login | current |
| Explore / Core / Pro / Elite | Tier ladder | current |
| WARD | Weekly Active Ritual Days (native north star) | native PRD |
| WAC | Weekly Active Capture (web doctrine north star) | Bible metrics |
| AnchorEdge | Unified linking primitive name | ADR |
| UrgeEvent | Discipline event model name | ADR |

---

## NATIVE IA NAMES

| Tab | Role |
|-----|------|
| Home | Companion home |
| Journal | Capture reflection |
| Notes | Reference |
| Vault | Secure/family-adjacent storage concepts |
| More | Overflow |

Source: Feature Selection 2026-07-19

---

## NAMING PHILOSOPHY (INFERRED FROM PRACTICE + LOCKS)

| Rule | Evidence |
|------|----------|
| Prefer honest operational names over theater | Life Score vs vanity XP |
| Brand philosophy named separately from product | Human Momentum ≠ AIIMIN |
| Avoid clinical naming | No therapist / diagnosis labels |
| India-readable clarity | OS-ID, ₹ pricing, en-IN |
| Rename when product thesis changes | Folio→Life OS Review; North Star→Life Arc |

**Caution:** Rules above are synthesized from patterns; no dedicated Naming ADR exists.
