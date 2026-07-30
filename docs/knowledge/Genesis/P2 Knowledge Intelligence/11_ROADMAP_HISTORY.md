# 11 — Roadmap History

```yaml
purpose: Plans over time — what was promised, what drifted, what is current.
confidence: ★★★☆☆
generated_from:
  - MASTER_PLAN.md
  - AIIMIN_PROGRESS_SUMMARY.md
  - docs/knowledge/01_PRODUCT/Product.md
  - docs/knowledge/12_SPRINTS/*
  - docs/knowledge/17_NATIVE_APP_V2/20_ROADMAP.md
  - docs/AIIMIN_PRODUCT_BIBLE/14_FUTURE_IDEAS.md
  - docs/product-intelligence/FUTURE_AIMIN_FRAMEWORK.md
  - docs/knowledge/00_HOME.md
related_notes: [01_PRODUCT_HISTORY.md, 16_VALUABLE_IDEAS.md, 13_OPEN_QUESTIONS.md]
dependencies: [01_PRODUCT_HISTORY.md]
consumers: Planning agents
importance: ★★★★☆
```

---

## ROADMAP ARTIFACTS (CHRONOLOGICAL)

| Artifact | Date | Scope | Trust now |
|----------|------|-------|-----------|
| MASTER_PLAN.md | 2026-06-25 | 12-week sprints 0–6 | **Partial stale** (auth/color); sprint statuses mostly PENDING |
| AIIMIN_PROGRESS_SUMMARY.md | 2026-06-30 | Launch readiness snapshot | Stale auth refs; useful as mid-June lens |
| Waitlist launch ladder | 2026-07-06 | 4-phase GTM | Current GTM framing |
| Vault Brain OS plan | 2026-07-10 | Agent memory | Shipped |
| Product Bible future ideas | 2026-07-11 | 0–6 / 6–12 / 12+ mo ambient | Doctrine roadmap |
| Future AIIMIN Framework | 2026-07-11 | P0 automation | Planned |
| Craft Master Plan A–J | 2026-07-12–15 | Web craft | Local complete; ship-on-ask |
| UI Improvement Brief | 2026-07-18 | Launch polish P0–P4 | Local uncommitted honesty |
| Native 20_ROADMAP | 2026-07-19 | Phases 0–5 · 7–12 mo Android | Active native plan |
| Product.md LC-01..14 | ongoing | Launch runbook | Blockers open |
| Home current blockers | 2026-07-19 | GA4/Sentry/LC/tester E2E | Current |

---

## MASTER_PLAN SPRINT MAP (BASELINE — VERIFY)

| Sprint | Focus | Doc status |
|--------|-------|------------|
| 0 | Foundation | DONE |
| 0.5 | Discipline FE, legal, AI opt-out | PENDING |
| 1 | Journal modes + AI | PENDING |
| 2 | Goals↔Habits↔Focus | PENDING |
| 3 | Sports personalization | PENDING |
| 4 | Finance upgrade | PENDING |
| 5 | Growth + Overview widgets | PENDING |
| 6 | Lab + Family + polish | PENDING |

**Codex rule:** Many features advanced outside this sprint numbering. Prefer Feature MOCs + Current-Context over MASTER_PLAN status cells.

---

## LAUNCH ROADMAP (CURRENT)

| Milestone | Date / state |
|-----------|--------------|
| Tester registration close | 31 Jul 2026 |
| Go-live target | End Sep 2026 |
| Waitlist mode | Live when env true |
| LC-01..14 | Not complete |
| GA4 + Sentry | Blockers |
| Craft/UI polish | Local ahead of prod |

---

## NATIVE ROADMAP (CURRENT)

| Phase | Intent | Horizon |
|-------|--------|---------|
| 0 | Foundations / exit gates | 1–2w |
| 1 | Android Compose companion | 8–12w (in progress ~92% claimed) |
| 2 | Expanded features | 8–12w |
| 3 | Hardening | 6–10w |
| 4 | Broader release / iOS decision | 8–12w |
| Public Android | Estimate | ~7–12 months |

Source: `17_NATIVE_APP_V2/20_ROADMAP.md`

---

## DOCTRINE ROADMAP (COMPRESSION / AMBIENT)

### 0–6 months
Universal capture router · finance voice · mood sync · morning briefing · OAuth-first onboarding · OS theme sync · HealthKit sleep/steps

### 6–12 months
Receipt OCR · email parse placements · calendar intent · on-device mood · shared resume vault · weekly digest · biometric auth

### 12+ months
Ambient lifelogging · memory reconstruction · proactive nudges w/ consent · family wallet pass · multimodal capture · on-device LLM

Source: `14_FUTURE_IDEAS.md`

---

## COMPRESSION TARGETS (PERSISTENT)

| Flow | Current → Future |
|------|------------------|
| Finance tx | 8 → 2 |
| Onboarding | 45+ → 12 |
| Daily log | 7 → 1 |
| Goals create | 9 → 2 |
| Journal | 5 → 2 |
| Median daily interactions | 15 → 5 |

---

## DRIFT PATTERNS

| Pattern | Example |
|---------|---------|
| Plan written; features ship sideways | Craft/Native progress vs MASTER_PLAN PENDING |
| Local complete ≠ shipped | Craft A–J; UI brief |
| Doctrine ahead of schema | UrgeEvent / AnchorEdge ADRs pending migration |
| Dual mobile narrative clarified late | 2026-07-19 Device-Tiers |
