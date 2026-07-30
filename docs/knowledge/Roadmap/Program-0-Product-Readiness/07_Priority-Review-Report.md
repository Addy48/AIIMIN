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

# 07 — Priority Review Report

Register: [[Roadmap/Operational-Priorities]]

| # | Priority | Relevance | Status | Blockers | Dependencies | Sequencing advice |
|---|----------|-----------|--------|----------|--------------|-------------------|
| 1 | GA4 + Sentry | High — launch truth | Blocked | Missing/unverified env | Vercel/EC2 secrets | **Do first** among launch ops |
| 2 | LC-01…14 | High | Open | Time, prod access | P1 partly | After P1 hooks exist |
| 3 | Tester E2E | High | Open | Invites, OAuth URLs | Allowlist scripts, P4 | Parallel with P2 |
| 4 | Auth & access gate | High | Active | Drift in allowlist/env | Better Auth, waitlist | Continuous; smoke each deploy |
| 5 | Capture-surface quality | High for retention | Active | Craft debt | UX Arch | UX Arch owns design; eng implements |
| 6 | Sync & offline | Medium–High | Partial | Native parity, calendar edge cases | Google OAuth calendar, mobile.js | Engineering program |
| 7 | Post-P9 UX Arch gate | High (next program) | Ready | Founder go-ahead | Program 0 done | **Start after Program 0 accept** |
| 8 | Founding / Waitlist window | High GTM | Scheduled | UI copy lag; LC/email | P1–P3 | Close **31 Aug 2026**; go-live still end Sep |

## Sequencing recommendation

```text
Now (parallel tracks):
  Track A — Launch ops: P1 → P2 → P3 → P8 messaging
  Track B — Design: P7 UX Architecture (then Design System)

Then: Engineering (P6 heavy) → Implementation → Sep go-live (P8 flip waitlist mode)
```

## Improvements

- Keep this register as single ops source of truth (stop scattering dates only in Home).  
- Append Waitlist changelog for 31 Aug.  
- Do not add Priority 9 unless Founder justifies from materials.
