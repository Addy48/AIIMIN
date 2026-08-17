---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
note_type: NT-PROGRAM-LIVING
program: Program-0-Product-Readiness
migration_batch: W4
fm_source: script
---

# 02 — Schedule Update Summary

## Change

| Item | Before | After |
|------|--------|-------|
| **Priority 8 — Founding Members / Waitlist registration close** | 31 July 2026 | **31 August 2026** |
| Public go-live target | End September 2026 | End September 2026 (unchanged) |

## Documents updated (ops only)

- [[Roadmap/Operational-Priorities]]
- [[00_HOME]]
- [[01_PRODUCT/Product]]
- [[01_PRODUCT/AIIMIN-Product-Guide]] (ops launch lines)
- [[09_FEATURES/Waitlist/Waitlist]]
- [[15_MEMORY/Business-Rules]]
- `deploy/LAUNCH-PLAN.md`
- Waitlist changelog append
- This Program 0 pack

**Not updated:** Genesis corpus (immutable). Historical changelog entries that *record* the old date remain historical.

## Impact

| Dimension | Assessment |
|-----------|------------|
| **Expected impact** | +31 days for tester invites, E2E, LC checklist, founding perk messaging honesty |
| **Dependencies** | Tester E2E (P3), LC-01…14 (P2), GA4/Sentry (P1), Resend email health, allowlist scripts |
| **Risks** | Compressed Sep go-live window (~30 days after close) |
| **Opportunities** | Room for Program 0 → UX Architecture kickoff without sacrificing founding cohort; better QA depth; Resend key rotation / LC work without July panic |

## Messaging

Waitlist UI copy updated to **31 August** in:

- `frontend/src/components/waitlist/WaitlistForm.jsx`
- `frontend/src/components/waitlist/WaitlistHeroAside.jsx`
- `frontend/src/components/waitlist/WaitlistQuickFeedback.jsx`
- `frontend/src/components/waitlist/landing/waitlistLandingData.js`
- `frontend/src/pages/WaitlistLanding.jsx`
