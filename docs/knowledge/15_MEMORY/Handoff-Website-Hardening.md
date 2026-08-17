---
authority: operations
derived_from: 17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-HANDOFF
tags:
  - type/handoff
  - domain/ops
  - status/active
---

# Handoff — website hardening · Vercel · AWS · machine

> Paste §2 into a new chat. This is TASK 2–5 from the 2026-08-03 brief, split off so the
> native app build can run in parallel in its own chat.

## 1. Recon (verified 2026-08-03 — do not re-derive)

- **Vercel:** `vercel.json` uses `@vercel/static-build`, `distDir: frontend/build`. Root build
  script is `cd frontend && node scripts/verify-production-env.mjs && npm run build`. That
  verifier runs **before** the build and exits non-zero on a missing required env var — the
  cheapest explanation for the failed deploy. Vercel CLI is **not installed**
  (`npm i -g vercel`).
- **AWS:** `aws-api` MCP connected, profile `cursor-mcp`, region `ap-south-1`. Free-credit
  usage needs Cost Explorer / billing APIs. *(That MCP is end-of-development — migration
  guide: `https://github.com/awslabs/mcp/blob/main/src/aws-api-mcp-server/MIGRATION.md`.)*
- **Machine:** **not a storage problem.** 58 GB free. 8 GB RAM running ~2.93 GB of 4 GB swap
  (~72 %), 440 M pageins — sustained memory pressure. Top consumers: Claude desktop
  (renderer 75 % CPU), WebKit, WindowServer, Spotlight `mdworker`.
- **Already fixed, do not redo:** the API-backed supabase shim lacked `.abortSignal()`, which
  threw on every authed page load and caused an ErrorBoundary remount loop that also hammered
  `/api/auth/get-session`. `abortSignal()` and `range()` added and committed.
- **New, verified open:** `GET /api/waitlist/count` masks errors as `{ count: 0 }` —
  `server/routes/waitlist.js:177`. → [[11_BUGS/Waitlist-Count-Masking]]

## 2. Paste this into the new chat

> I'm Aaditya, building **AIIMIN** — a Personal Life OS. Live site aiimin.in (React 19/CRA +
> Node/Hono API + Supabase/Postgres + Better Auth with OS-ID+PIN). Repo:
> `/Users/aaditya/Desktop/DASHBOARD PROJECT`, branch `feat/drafting-table-prototype`. The
> native Android app is being built in a **separate chat** — don't touch `native-android/`.
> Your job is the website, the deploy, AWS and my machine.
>
> **Read first, in order, then confirm:**
> 1. `docs/knowledge/00_ROUTING.md`
> 2. `docs/knowledge/15_MEMORY/Handoff-Website-Hardening.md` — §1 recon is done, use it
> 3. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md` §7 (what's left)
> 4. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` §0 (guardrails)
>
> **One task at a time. Verify each with real output before moving on.**
>
> **TASK A — Journal + Notes are broken.** Highest priority, and never reproduced. I'll log in
> for you when you need me — **never ask for my PIN, I type it.** Protocol: log in → `/journal`
> → write a Free Write → Save. Capture (a) the failing network call and status, (b) the
> component stack from the console, (c) the exact action that failed. Same for `/notes`
> add-source. Root-cause it. **Do not blind-patch.** Then grep the repo for the same pattern
> to confirm nothing else clashes.
>
> **TASK B — the rest of the known-open list.** Finance MTD ₹0 contradicting the AI insight
> (reconcile the windows, show a real empty state instead of ₹0) · **Life Score taxonomy —
> already decided, just apply it:** relabel the Today grid to the five canonical dimensions
> (keys `physical · cognitive · discipline · financial · emotional`, shown as BODY · MIND ·
> DISCIPLINE · MONEY · MOOD); "Goals" and "Sleep" stop being dimensions — Goals is a feature,
> Sleep is a base metric under BODY. Read
> `docs/knowledge/10_DECISIONS/2026-08-03-life-score-taxonomy.md` first · remove the Weekly Pulse (WHO-5) from
> the entry flow and never stack it with the tour · Goals count mismatch (9 vs 10) ·
> `GET /api/waitlist/count` masking errors as `{count: 0}` at `server/routes/waitlist.js:177`.
>
> **TASK C — the P2 untested surfaces**, from §7 of the master status: transactions
> add/edit/delete · journal save→history→export round-trip · habit toggle persistence · goal
> create + milestones · a full focus session · Reports PDF download + Patterns/Skills tabs ·
> search/command palette · personalization · billing UI · data export · `/m` shell · offline ·
> theme on every surface · keyboard + screen-reader pass · form validation edges. Give me a
> written pass/fail report.
>
> **TASK D — Vercel.** My last deploy failed. Start from the hypothesis that
> `frontend/scripts/verify-production-env.mjs` exited non-zero on a missing env var before the
> build began. Get the **real** error, fix it, and tell me exactly what to set. CLI isn't
> installed (`npm i -g vercel`).
>
> **TASK E — AWS free credits.** Use the `aws-api` MCP (profile `cursor-mcp`, ap-south-1).
> How much of my free credits are consumed, what's burning them, what's about to charge me,
> what should I shut off. **Read-only — change nothing without asking.**
>
> **TASK F — MacBook performance.** It is **not** storage (58 GB free). It's memory: 8 GB RAM,
> ~72 % of swap in use. Audit memory hogs, swap, login items, launch agents, Spotlight
> indexing, Electron/browser footprint, runaway processes. Give me a ranked list with the real
> impact of each. Storage cleanup second (caches, old builds, `node_modules`, Xcode/Android
> leftovers, Downloads) — **tell me before removing anything.**
>
> **Rules:** verify with real output before saying anything is done — no claims without
> evidence. Never type my PIN or any credential. No destructive action on the live account, on
> AWS, or on my files without asking first. Genesis
> (`docs/knowledge/Genesis/P8 Master Specification`) is constitutional. The Drafting Table
> palette and typography are locked. Use caveman mode.

## Related

- [[15_MEMORY/Handoff-Native-App-Build]] · [[11_BUGS/Waitlist-Count-Masking]] · [[00_ROUTING]]
