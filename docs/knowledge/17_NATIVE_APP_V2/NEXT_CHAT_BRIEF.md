---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-HANDOFF
tags:
  - type/handoff
  - domain/build
  - status/active
---

# NEXT CHAT — Brief & Prompt

> Written 2026-08-03. Paste §2 into the new chat. §1 is the grounded recon so the next
> session starts from facts, not guesses.

---

## 1. RECON ALREADY DONE (facts — don't re-derive)

### 1.1 THE VAULT PROBLEM — root cause found: there are TWO vaults, not one

| | `/Users/aaditya/Documents/AIIMIN VAULT` | `DASHBOARD PROJECT/docs/knowledge/` |
|---|---|---|
| Files | **46** md | **704** md |
| Size | 204 KB | 32 MB |
| Taxonomy | `00-Home`, `01-Architecture`, `02-Features`… (hyphen) | `00_HOME`, `01_PRODUCT`, `02_ARCHITECTURE`… (underscore) |
| Contains Genesis / Constitution / Dashboards | ❌ no | ✅ yes |
| Contains the new master docs | ❌ no | ✅ yes |
| Version control | ❌ **not a git repo** — unversioned, unbacked-up | ✅ in git |
| Last edited | 2026-08-02 | 2026-08-03 |

**Only 8 filenames overlap** (`AIIMIN_PROGRESS_SUMMARY`, `Gamification`, `Git-Timeline`,
`Journal`, `Overview`, `Sports`, `Typography`, `Waitlist`) — so these are largely **different
content, both live, both edited recently**. That is exactly the "I don't trust the vault /
double issues / not on the same page" feeling: an agent reading one gets a partial or
contradictory picture, and nobody knows which is authoritative.

**This is the #1 task.** It must end with ONE source of truth.

### 1.2 THE MACBOOK — your diagnosis is wrong, and that matters

- **Storage is NOT the problem.** 58 GB free. Home total ≈ 38 GB (Library 30 G, Documents
  4 G, Desktop 3.7 G). A deep storage audit would find almost nothing.
- **The real cause: memory.** The machine has **8 GB RAM** and is running
  **2.93 GB of swap out of 4 GB (≈72 % used)**, with 440 M pageins. That is sustained memory
  pressure — which is exactly what "hanging" feels like.
- **Biggest consumers right now:** Claude desktop app (renderer 75 % CPU, main 43 %), WebKit
  53 %, WindowServer 29 %, plus Spotlight `mdworker`.

So the next session should run a **performance audit (memory/swap/login items/indexing/
runaway processes)**, and a storage pass only as a secondary cleanup. Doing a "very deep
storage audit" as asked would burn hours and fix nothing.

### 1.3 VERCEL — the most likely cause of the failed deploy
`vercel.json` uses `@vercel/static-build` with `distDir: frontend/build`, and the root build
script is:
```
cd frontend && node scripts/verify-production-env.mjs && npm run build
```
`verify-production-env.mjs` runs **before** the build and exits non-zero when a required env
var is missing. A missing/renamed env var in the Vercel project would fail the deploy before
CRA even starts. **Check that script's required list against the Vercel env first** — it's
the cheapest hypothesis. (Also note: Vercel CLI is **not installed** — `npm i -g vercel`.)

### 1.4 AWS
`aws-api` MCP is connected (profile `cursor-mcp`, region `ap-south-1`). Free-credit usage
needs Cost Explorer / billing APIs — the next session can query it directly through that MCP.

### 1.5 State carried in
- Prototype **complete**: `frontend/prototypes/AIIMIN-Drafting-Table.html` (self-contained;
  rebuild `node frontend/scripts/build-proto.mjs`), also `/proto/draft`.
- Branch `feat/drafting-table-prototype`, pushed. App build **on hold**.
- Fixed & committed: supabase-shim `.abortSignal` crash (was causing an ErrorBoundary remount
  loop on every authed page).
- Still open: **Journal + Notes broken** (not reproduced), Finance ₹0 contradiction, Life
  Score taxonomy drift, Weekly Pulse removal, full P2 untested-surface list.
- Read `AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md` and `AIIMIN_APP_BUILD_AGENT_PLAN.md`.

---

## 2. PASTE THIS INTO THE NEW CHAT

> I'm Aaditya, building **AIIMIN** — a Personal Life OS. Live site: aiimin.in (React 19/CRA
> + Node/Hono API + Supabase/Postgres + Better Auth with OS-ID+PIN). Repo:
> `/Users/aaditya/Desktop/DASHBOARD PROJECT`, branch `feat/drafting-table-prototype`.
> The mobile app build is **on hold** — the Drafting Table prototype is finished
> (`frontend/prototypes/AIIMIN-Drafting-Table.html`). Current stage: **make the knowledge
> base trustworthy, harden the website, and fix my machine.**
>
> **Read first (in order), then confirm you've read them:**
> 1. `docs/knowledge/17_NATIVE_APP_V2/NEXT_CHAT_BRIEF.md` ← recon is already done in §1, use
>    it, don't redo it
> 2. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md`
> 3. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` (guardrails — follow them)
>
> **Do these, in this order, one at a time. Verify each before moving on.**
>
> **TASK 1 — Make the vault a single source of truth (biggest priority).**
> I have two parallel knowledge bases: `/Users/aaditya/Documents/AIIMIN VAULT` (46 md, not in
> git) and `DASHBOARD PROJECT/docs/knowledge/` (704 md, in git, holds Genesis + the master
> docs). Different taxonomies, both edited recently, only 8 overlapping filenames. I don't
> trust it and I want it fixed properly.
> - Decide and tell me which one becomes canonical (I expect `docs/knowledge/` because it's
>   versioned and holds Genesis — but justify it), and what happens to the other. Nothing gets
>   deleted until I approve.
> - Reconcile contradictions between **Genesis, the master docs, and the older vault notes**
>   so there is exactly one answer to any question. Where two docs disagree, Genesis wins;
>   flag anything Genesis doesn't cover for me to decide.
> - Make it **token-efficient for AI agents**: a real entry point (`00_HOME`) → map-of-content
>   → leaf notes, each note with front-matter (status/owner/last-reviewed/authority), stable
>   headings, and an index that says "for X, read exactly this file" so an agent never has to
>   read the whole codebase or the whole vault.
> - Kill duplicates, stale notes and anything misleading. Produce a written report of what you
>   merged, archived and deleted.
> - Keep it working as an Obsidian vault (don't break links).
>
> **TASK 2 — Website: test, fix, complete.**
> Start with the known-open list in the master doc (§7): **Journal + Notes are broken and were
> never reproduced** — that's first; I'll log in for you when you need me (never ask for my
> PIN, I type it). Then Finance MTD ₹0 vs AI-insight contradiction, Life Score taxonomy drift,
> remove the Weekly Pulse from entry, Goals count mismatch. Then work the P2 untested-surface
> list and give me a pass/fail report. Fix root causes and re-check the repo for clashes.
>
> **TASK 3 — Vercel deploy failure.**
> My last deployment failed. Start from the hypothesis in the brief §1.3
> (`frontend/scripts/verify-production-env.mjs` failing on a missing env var before the build).
> Get the real error, fix it, and tell me what to set. Vercel CLI isn't installed.
>
> **TASK 4 — AWS free credits.**
> Use the `aws-api` MCP (profile `cursor-mcp`, ap-south-1). Tell me how much of my free
> credits are consumed, what's burning them, what's at risk of charging me, and what to shut
> off. Read-only — don't change any AWS resource without asking.
>
> **TASK 5 — MacBook performance (note: NOT a storage problem).**
> Per §1.2 of the brief: 58 GB free, but **8 GB RAM with ~72 % swap used** — the hanging is
> memory pressure, not disk. Do a real performance audit: memory hogs, swap, login items,
> background/launch agents, Spotlight indexing, browser/Electron footprint, runaway processes.
> Give me a ranked list of what to change with the actual impact of each. Then a secondary
> storage cleanup (caches, old builds, `node_modules`, Xcode/Android leftovers, Downloads).
> Tell me before removing anything.
>
> **Rules:** work one task at a time and verify with real output before saying it's done — no
> claims without evidence. Never type my PIN or any credential. No destructive action on the
> live account, AWS, or my files without asking first. The Drafting Table palette/typography
> is approved and locked. Genesis (`docs/knowledge/Genesis/P8 Master Specification`) is
> constitutional. Use caveman mode.
