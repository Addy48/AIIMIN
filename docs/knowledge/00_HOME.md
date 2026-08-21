---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-META
graph_role: boot
note_type: NT-BOOT
tags:
  - type/hub
  - domain/ops
  - status/living
migration_batch: W4
fm_source: script
---

# AIIMIN — Home


> [!important] Law
> Genesis is immutable. This Home is operations — `can_override_genesis: false`.

> [!abstract] Derived
> Dashboards, maps, and Bases are derived. The V1 Blueprint is implementation scope; Current Context is execution focus.


> **Agents:** Home → **[[00_ROUTING]]** (find your job, open only the files it names) → [[15_MEMORY/Current-Context]] for what's happening now. [[Maps of Content/Genesis]] only for constitutional work. Never whole-repo or whole-vault scan unless asked.

**Last updated:** 2026-08-20 · Simplification tracker: [[16_DOCUMENTATION/Simplification-Phase-Tracker]]

## Authority (non-negotiable)

| Layer | Location | Can override Genesis? |
|-------|----------|----------------------|
| **Genesis v1.0 (P1–P9)** | `Genesis/` | — (nucleus) |
| Constitution / IA / Interaction | P5 · P8 · P9 via [[Maps of Content/Genesis]] | **NO** |
| Frozen UX evidence / architecture | `Roadmap/UX-Intelligence/` · `Roadmap/UX-Architecture/` | **NO** |
| **V1 implementation contract** | [[Roadmap/AIIMIN-V1-Blueprint]] | **NO** |
| Engineering / Implementation | Numbered folders `01_`–`17_` (Stage A) | **NO** |
| Operations / Roadmap | Sprints, bugs, deploy, Current Context | **NO** |

Navigation: **Home → Current Context → Genesis (when needed) → V1 Blueprint → subsystem note → source**

## Project goal

Personal Life OS — daily metrics, money, calendar, focus, discipline, sports context, gamification. Owner: Aaditya Upadhyay.

## Current stage (2026-08-20)

Branch **`main`**. Native V3 = active companion app (`native-android-v3/`). Manus = prototype help only.

Drafting Table = **design lock**, not a third product.

**Now:** [[01_PRODUCT/Build-Next-Now]] (what to build) · [[01_PRODUCT/Massive-Upgrade-Research-Pack]] (full research) · [[01_PRODUCT/Phase-B-Prep-Spec]] (Phase B tickets) · [[01_PRODUCT/Owned-PR-Kit]] · [[01_PRODUCT/Stage1-Marketing-Ops-Plan]] (marketing calendar). Overhaul: [[01_PRODUCT/Complete-Overhaul-Pack]].

- **Living leftover list** → [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]]
- **Guardrails G1–G10** → [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]] §0
- **Master status (dated — verify vs Context)** → [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]]
- **Single vault** — `~/Documents/AIIMIN VAULT/Reference` symlinks here → [[16_DOCUMENTATION/VAULT-CONSOLIDATION-2026-08-03]]
- **Web diet R4** → [[16_DOCUMENTATION/Web-Surface-Diet-R4]]
- **Marketing skills catalog** → [[16_DOCUMENTATION/Stage1-Marketing-Skills-Catalog]]
- **Notifications Signal System** → [[09_FEATURES/Notifications/Signal-System]]

## Current version / lens

- Waitlist gate when `REACT_APP_WAITLIST_MODE=true`
- Go-live target: end Nov 2026; founding/tester registration closes **31 Oct 2026** (TARGET)
- Instagram / Reels: **Skip** Stage-1
- **Genesis v1.0 (P1–P9) COMPLETE** · immutable at `Genesis/`
- **Obsidian Vault Stage A FROZEN** · SoT `docs/knowledge/` · [[Founder/01_VAULT_FREEZE_CERTIFICATE]]
- **AIIMIN V1 Blueprint v1.0** · current implementation contract · [[Roadmap/AIIMIN-V1-Blueprint]]
- **Vault operating model** · Blueprint-first, compact handoff, stable paths · [[10_DECISIONS/2026-07-30-vault-operating-model]]
- **Program 0 (Product Readiness)** · [[Roadmap/Program-0-Product-Readiness/00_INDEX]] · priorities [[Roadmap/Operational-Priorities]]
- **Cold Roadmap (frozen evidence — not current stage)** → [[Maps of Content/Cold-Roadmap]]
- Native living pack (path still `17_NATIVE_APP_V2/`): [[17_NATIVE_APP_V2/V3-LEFTOVER-CHECKLIST]] · [[17_NATIVE_APP_V2/V3-COMPLETE-BUILD-SPEC]]
- Founder workspace: [[Dashboards/00_Founder-Workspace-Index]]

## Current blockers

- Final prod env (GA4, Sentry)
- Launch checklist LC-01..LC-14 verification
- Tester onboarding E2E

## Architecture (one screen)

- **Monorepo:** web Life OS · Capacitor `/m` (legacy capture) · **native V3** (current) · native V2 (reference only). Never mix clients in one commit. → [[02_ARCHITECTURE/Monorepo]]
- Frontend: React 19 + Tailwind — `frontend/`
- Native **current:** Kotlin Compose — `native-android-v3/`
- Native **old:** `native-android/` — sync/session/network reference only; never copy `ui/`
- Backend: Node — `server/` + `api/`
- DB: Supabase PostgreSQL · Auth: Better Auth + Google OAuth
- Host: Vercel + EC2 API (`api.aiimin.in`)
- Desktop = full OS; `/m` = capture-only; Native V3 = companion app
- Canonical paths stay top-level: [[10_DECISIONS/2026-07-30-repository-layout]]

Deep: [[02_ARCHITECTURE/Overview]] · [[Maps of Content/Architecture]] · [[16_DOCUMENTATION/Repository-Reorganization]]

## Important rules

1. Vault = source of truth. Genesis = constitutional nucleus inside vault.
2. Load order: Home → Current Context → V1 Blueprint → Genesis MOC (if constitutional) → subsystem note → only needed source.
3. Token discipline: no whole-repo scan unless user asks.
4. Palette LOCKED — [[08_DESIGN/Palette]] (derived from P8 Visual).
5. `/m` = data collection only.
6. No secrets in vault. No schema/auth changes without Founder ask.
7. Commit / push / PR only when Founder asks.
8. Proof-or-stop — [[14_PROMPTS/Proof-or-Stop]]
8b. Anti-lie (truth labels + receipts) — [[14_PROMPTS/Anti-Lie-Strategy]]
9. Numbered folders are frozen Stage A paths. Improve the operating layer; do not mass-rename linked folders.
10. Product scope belongs in the Blueprint or an accepted ADR, not Current Context.

## Start by job

| Job | Open |
|-----|------|
| **Anything at all — route me** | **[[00_ROUTING]]** |
| Continue current work | [[15_MEMORY/Current-Context]] |
| See full project status | [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] |
| Understand / build V1 | [[Roadmap/AIIMIN-V1-Blueprint]] |
| Check constitutional law | [[Maps of Content/Genesis]] |
| Find implementation notes | [[Maps of Content/Engineering]] |
| Make or inspect a decision | [[Dashboards/09_Decisions-Dashboard]] |
| Review active work | [[Dashboards/00_Founder-Workspace-Index]] |
| Inspect historical material | [[Archive/README]] · [[16_DOCUMENTATION/Completed-Work-Ledger]] |
| Vault too large / simplify | [[16_DOCUMENTATION/Vault-And-Repo-Simplification-Plan]] · [[16_DOCUMENTATION/Simplification-Phase-Tracker]] |
| Native app (V3) | [[Maps of Content/Native-App]] |

## Genesis (nucleus)

| Need | Path |
|------|------|
| **Genesis MOC** | [[Maps of Content/Genesis]] |
| Discovery archive | `Genesis/00_DISCOVERY_ARCHIVE.md` |
| P5 Constitution | `Genesis/P5 Constitution/00_EXECUTIVE_SUMMARY.md` |
| P7 Governance | `Genesis/P7 Governance/MASTER_GOVERNANCE_INDEX.md` |
| **P8 Master Spec v1.0** | `Genesis/P8 Master Specification/00_INDEX.md` |
| **P9 Interaction Architecture** | `Genesis/P9 Interaction Architecture/00_INDEX.md` |
| P6 Prototype | `Genesis/P6 Prototype Studio/Prototype/index.html` |
| Research (bible/intel/audit) | [[Maps of Content/Research]] |

Legacy Genesis stub folders at repo root (`AIIMIN_DESIGN_BIBLE/` etc.) were deleted 2026-08-14. Record: [[16_DOCUMENTATION/Completed-Work-Ledger]]. Duplicate full copies remain only in `Archive/Duplicates/` — **not** authority.

## Maps of Content

[[Maps of Content/00_Knowledge-Graph]] · [[Maps of Content/Genesis]] · [[Maps of Content/Interaction-Architecture]] · [[Maps of Content/Engineering]] · [[Maps of Content/Design]] · [[Maps of Content/Product]] · [[Maps of Content/Research]] · [[Maps of Content/Roadmap]] · [[Maps of Content/Founder]]

## Links

| Need | Path |
|------|------|
| Freeze certificate | [[Founder/01_VAULT_FREEZE_CERTIFICATE]] |
| Vault state | [[Founder/03_FINAL_VAULT_STATE]] |
| Current context | [[15_MEMORY/Current-Context]] |
| V1 Blueprint | [[Roadmap/AIIMIN-V1-Blueprint]] |
| Vault operating decision | [[10_DECISIONS/2026-07-30-vault-operating-model]] |
| Constitution hub | [[Constitution/00_Constitution-Hub]] |
| Interaction hub | [[Interaction Architecture/00_Interaction-Hub]] |
| Glossary | [[Glossary/00_Glossary]] |
| Rule index | [[Rule Index/00_Rule-Index]] |
| Features | [[09_FEATURES/Index]] |
| Deploy | [[07_DEPLOYMENT/Deploy]] |
| Skills | [[16_DOCUMENTATION/Skills-Registry]] |
| Manifest | `_manifest.json` |
