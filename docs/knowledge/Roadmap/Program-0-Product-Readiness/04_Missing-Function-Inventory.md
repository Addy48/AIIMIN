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

# 04 — Missing Function Inventory

Sources: Features Index statuses, Product/Master Plan history (stale), Launch Plan, Native WORKFLOW. **No invented features.**

| Item | Status | Dependencies | Recommended approach |
|------|--------|--------------|----------------------|
| GA4 custom events (waitlist signup) | Planned / unverified | `REACT_APP_GA_MEASUREMENT_ID`, LC-10 | Wire + verify in prod |
| Sentry | Planned / unverified | DSN env, LC-09 | Configure + smoke error |
| LC-01…14 production proofs | Checklist open | Prod access, time | Runbook in Product.md |
| Tester invite E2E | Partial | `invite-tester-auth.mjs`, allowlist, OAuth URLs | Manual LC-12 path |
| Waitlist founding close copy (31 Aug) | Docs updated; UI may lag | WaitlistLanding modules | Update UI strings |
| Status page (LC-11) | Planned | Hosting | Minimal status surface |
| Journal studio craft B1 | Partial | Journal page/components | Finish or cut scope before UX Arch |
| Discipline urge redesign | Planned | discipline API, P9 urge flows | Design under P9 Phase 2/3 |
| AI features opt-out (Settings) | Historic Master Plan pending | user_profiles | Confirm if still required vs shipped Account |
| Legal links in Account footer | Historic pending; legal routes exist | AccountPage | Verify links live |
| Sports personalization (favorites/news) | Historic P1/P2 plan | sports API | Defer post-launch unless Founder asks |
| Overview widget grid drag-drop | Historic plan | Overview | UX Arch decide keep/kill |
| Stripe live billing | Stub without keys | Stripe env | Launch Plan Phase 4 |
| Cognito migration | Deferred explicitly | Launch Plan Phase 5 | Do not start |
| Native P3 remaining | Nearly done (~92%) | WORKFLOW-PLAN | Finish P3 then align to P8 platforms |
| Offline full P8 parity | Partial | native sync, P8 Ch14 | Engineering program |
| Puppeteer PDF monthly reports | Deferred | Launch Plan | Post-launch |
| Design-lab / seed-data routes | Dev surfaces | App.js `/design-lab`, `/seed-data` | Gate or exclude from prod UX Arch |

## Placeholder / stub signals

- Billing “stub mode without Stripe” (historical Progress Summary) — treat as intentional until env set.  
- Re-engagement email “stub” in Launch Plan LC-07 — verify Resend paths.  
- Native doctrine stubs (IA/UX) — superseded; not missing features, **do not implement from Archive**.
