---
authority: engineering
derived_from: 11_BUGS · 17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-GUIDE
tags:
  - type/guide
  - status/living
---

# What's broken right now

> Honest status. **Broken** means reproduced or verified in code. **Suspected** means you
> reported it but nobody has reproduced it yet. **Untested** means nobody has ever exercised
> it — which is not the same as broken.

## Verified broken

### Waitlist count hides its own failures
`GET /api/waitlist/count` returns `{ count: 0 }` when the query fails, so an outage looks
identical to an empty waitlist. Confirmed at `server/routes/waitlist.js:177`.
Low severity, real. → [[11_BUGS/Waitlist-Count-Masking]]

### Public repo advertises the wrong auth
GitHub topics on `Addy48/AIIMIN` still include `clerk`. Clerk is gone — 0 matches in code.
Outward-facing and wrong. → audit report at `docs/audit/AIIMIN-AUDIT.html`

### RLS coverage is partial
11 `CREATE POLICY` statements against 62 user-scoped tables. Not exploitable today (nothing
reaches Postgres except through the scoped API) but the second safety layer is incomplete.
→ [[Guides/How-It-Works]] §2

## Suspected — reported, never reproduced

### Journal + Notes
You've reported both as broken. Routes exist, the pages load, the frontend API layer is
clean — so the failure is at interaction level, not routing.

**This is the top priority, and it needs you present to log in.** The protocol, deliberately
not a blind patch:
1. Log in (you type the PIN — never an agent).
2. Go to `/journal`, write a Free Write entry, press Save.
3. Capture three things: the failing network call and its status code, the component stack
   from the console, and the exact action that failed.
4. Same for `/notes` add-source.

→ [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §7 P0

### Finance shows ₹0 while the AI insight cites ₹65k
Two different time windows disagreeing. The fix is to reconcile the windows *and* show a real
empty state instead of a misleading `₹0`.

### Goals count mismatch — 9 vs 10.

## Fixed — don't re-fix

**The reminders remount loop.** `frontend/src/utils/supabase.js` is an API-backed shim, not a
real Supabase client, and it was missing `.abortSignal()`. The `family_reminders` fetch threw
on **every authed page load**; the ErrorBoundary caught it, remounted, re-ran the effect and
threw again — a loop that also hammered `/api/auth/get-session`. `abortSignal()` and `range()`
were added. Committed.

**The Life Score taxonomy drift** (47/49/54 across surfaces). Decided — one server-computed
set. → [[10_DECISIONS/2026-08-03-life-score-taxonomy]]

**Two contradicting vaults.** Consolidated.
→ [[16_DOCUMENTATION/VAULT-CONSOLIDATION-2026-08-03]]

## Never exercised — P2

Nobody has tested these even once. Not broken; simply unknown:

transactions add/edit/delete · journal save → history → export round-trip · habit toggle
persistence · goal create + milestones · a full focus session · Reports PDF download ·
Patterns and Skills tabs · search / command palette · personalization (life modes, nav pins) ·
subscription + billing UI · data export · the `/m` mobile shell · offline behaviour · theme on
every surface · keyboard and screen-reader pass · form validation edges (empty, oversized,
paste).

Working these into a pass/fail report is task C of
[[15_MEMORY/Handoff-Website-Hardening]].

## Also open

- **Vercel deploy failed.** Best hypothesis: `frontend/scripts/verify-production-env.mjs`
  exits non-zero on a missing env var *before* the build starts. Vercel CLI isn't installed.
- **Remove the Weekly Pulse** from the entry flow — rejected, still present.
- **The machine.** 8 GB RAM, 0.06 GB free, 3.09 GB compressor, 70% of swap used. This is
  memory pressure, not disk (56 GB free). → the audit report at `docs/audit/AIIMIN-AUDIT.html`

## See also

[[Guides/Start-Here]] · [[11_BUGS/README]] · [[15_MEMORY/Handoff-Website-Hardening]]
