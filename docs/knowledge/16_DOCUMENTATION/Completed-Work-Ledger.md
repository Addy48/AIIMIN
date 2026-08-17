---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-14
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-DOC
tags:
  - type/documentation
  - domain/ops
  - status/living
---

# Completed-Work Ledger

One place for work that is **finished, abandoned, or moved out**. After a cluster is written here, its plan / “currently doing” / duplicate status files are deleted from the repo folder.

Living truth for *what is in progress now* stays in [[15_MEMORY/Current-Context]]. Constitutional law stays in `Genesis/` (never deleted). Feature contracts stay under `09_FEATURES/`.

**This pass:** 2026-08-14 folder cleanup. Nothing here is a license to re-open the bake-off, V2 UI, or Clerk.

---

## How to use

When a unit of work ships or is abandoned:

1. Add a row below (what, depth, living replacement).
2. Delete the satellite plans, session briefs, and duplicate status notes.
3. Do not copy Genesis or living feature MOCs into this file.

---

## 2026-08-14 — Folder cleanup

### Mess-menu extractor — moved out (not deleted)

- **What:** One-off WhatsApp Private image OCR pipeline (ADB pull → Apple Vision OCR → `output/mess_menu_history.xlsx`). Hostel mess menus, not AIIMIN product.
- **Depth:** Full pipeline: `source/` (~2,400 JPGs, 681 MB), vendored numpy/scipy (142 MB), confirmed crops, SQLite index, Excel/CSV/HTML reports. Work was already run; reports exist under `output/`.
- **Moved to:** `~/Desktop/mess-menu-extractor` (outside this repo).
- **Why not keep here:** Different purpose. Inflated the Dashboard Project folder by ~859 MB and was never git-tracked.
- **Do not:** Recreate it inside this repo. If mess data is needed in-app later, import the workbook — do not copy the photo corpus back.

### V3 APK retention — last two only

- **Policy (already in `native-android-v3/dist/README.md`):** keep `aiimin-v3-current.apk` + `aiimin-v3-previous.apk`. Promote with `bash scripts/promote-v3-apk.sh`.
- **This pass:** promoted 2026-08-14 `app-debug.apk` (62 MB) to current; previous becomes the 2026-08-08 build. Deleted the 2026-08-06 dist APK, the 2026-07-19 Capacitor debug APK, and the 2026-07-19 V2 `app-release-2.2.1-native.apk`.
- **Also deleted (local media, not source):** `native-android-v3/dist/device-shots/`, `device-screenshots/`, `debug-shots/`, Gradle `build/` trees under V3 and Capacitor `frontend/android/app/build/`. Rebuild with Gradle when needed. Compose screenshot-test goldens under `app/src/screenshotTestDebug/` **kept**.

### Personal OS HTML bake-off — closed, then deleted

- **What:** TIDE / RELAY / v2–v8 HTML prototypes plus Claude/Codex boot packs at `frontend/prototypes/personal-os/`.
- **Depth:** Multiple full-app HTML shells (v4 five directions, v5 opus, v6 calm density, v7 frozen Life OS + `v7-build/`, v8 Soft Monotone seed), Python rebuild scripts, anti-lie notes, MCP/boot prompts. TIDE and RELAY were built; ATLAS never was.
- **Outcome:** Abandoned as the design mission. Living visual lock is `frontend/prototypes/AIIMIN-Drafting-Table.html` + `frontend/src/prototypes/drafting-table/`.
- **Deleted:** the entire `frontend/prototypes/personal-os/` tree (tracked v4/v5 plus untracked v6–v8).
- **Do not:** Resume TIDE/RELAY/ATLAS or edit v7. Do not treat Blueprint’s old `personal-os` HTML path as a file that still exists.

### Root Genesis stubs — deleted

- **What:** `AIIMIN GENESIS/`, `AIIMIN Prototype Studio/`, `AIIMIN_DESIGN_BIBLE/`, `AIIMIN_DESIGN_CONTEXT/`, `AIIMIN_KNOWLEDGE_CONTEXT/`, `AIIMIN_UX_CONTEXT/`, `AIIMIN_VISUAL_CONTEXT/` — each was a `MOVED.md` pointing at the vault.
- **Depth:** Pointers only. Real corpus is `docs/knowledge/Genesis/` (immutable).
- **Deleted:** those seven stub folders.

### `docs/*.md` compatibility pointers — deleted

- **What:** 141–257 byte “Moved/Archived” stubs at `docs/AWS_SETUP.md`, `AWS_MIGRATION_MASTER_PLAN.md`, `CHAT-HANDOFF.md`, `CODEBASE-AUDIT-2026-07-08.md`, `GOOGLE-CLOUD-OAUTH-SETUP.md`, `LOCAL-CHROME.md`, `MIGRATION-BETTER-AUTH.md`, `MOBILE_PRD.md`, `PRODUCTION_GAP_REPORT.md`, `PRODUCTION_VERIFICATION.md`, `RECOVERY-2026-07-08.md`, `google-oauth-review.md`, `interaction-telemetry.md`, plus stub READMEs under `docs/AIIMIN_PRODUCT_BIBLE/`, `docs/product-intelligence/`, `docs/interaction-audit/`.
- **Canonical now:**

| Topic | Living path |
|-------|-------------|
| AWS setup / migration | `docs/knowledge/07_DEPLOYMENT/` |
| Better Auth migration / Google OAuth | `docs/knowledge/09_FEATURES/Auth/` |
| Local Chrome | `docs/knowledge/16_DOCUMENTATION/LOCAL-CHROME.md` |
| Telemetry | `docs/knowledge/06_AI/interaction-telemetry.md` |
| Old session audits / Mobile PRD | `docs/knowledge/99_ARCHIVE/repository-docs-2026-07/` |
| Product bible / intelligence / interaction audit (full copies) | Genesis P2/P3 supporting + `Archive/Duplicates/` |

### July 2026 `plans/` — executed, then deleted

- **What:** `commit-push-plan-2026-07-19.md`, `uncommitted-inventory-2026-07-19.md`, `repo-fix-master-plan.md`, `mobile-commit-split.md`, `mobile-ipad-os.md` (marked complete), `native-android-app.md` (superseded by the native pack).
- **Depth:** One-day repo hygiene and commit-split sketches. Native product direction moved to `17_NATIVE_APP_V2/` then V3 spec.
- **Deleted:** the `plans/` directory.
- **Living:** [[02_ARCHITECTURE/Monorepo]] (never mix clients in one commit) · [[17_NATIVE_APP_V2/V3-COMPLETE-BUILD-SPEC]]

### Vault Brain OS sprint (2026-07-10) — done

- **What:** Cutover to Project Brain OS, slim `AGENTS.md`, seed feature notes.
- **Depth:** Folder scaffold, Home/Memory, architecture/product/design/deploy seeds, Auth/DailyLog/Gamification MOCs, templates, ADR, rules, manifest. Marked complete in Sprint-Current (all tasks checked).
- **Deleted after this ledger:** `12_SPRINTS/Craft-Master-Plan-AJ.md`, `Craft-Program-Master-Status.md`, `Craft-Status-Report-2026-07-15.md`, `UI-Improvement-Brief-2026-07-18.md`, `protocol-shots/` (local PNG dump). `Sprint-Current.md` reduced to a pointer here + Current Context.
- **Living:** this vault. Do not re-run the cutover.

### Native V2 planning pack — superseded by V3 spec

- **What:** Session/plan files for the V2 Compose app and the 2026-08-03 website/prototype recon.
- **Depth:** `00_MASTER_PLAN`, `00_FEATURE_SELECTION`, `00_SKILLS_SYNTHESIS` were planning/proof-of-skills (no code). `NEXT_CHAT_BRIEF` and `DRAFTING_TABLE_TESTING_AND_PLAN` were 2026-08-02/03 session artifacts. Doctrine files `02_USER_JOURNEYS`, `03_INFORMATION_ARCHITECTURE`, `05_NATIVE_UX`, `06_DESIGN_SYSTEM`, `07_MOTION` were already one-paragraph stubs pointing at Genesis P8/P9 (full text in `Archive/Superseded/Native-V2-Doctrine/`).
- **Deleted:** those files listed above.
- **Kept on purpose:** `01_PRD.md` (product thesis), engineering notes `04` and `08`–`20`, living V3 trackers (`V3-COMPLETE-BUILD-SPEC`, leftover checklist, build tracker, agent plan, master status, Play Store, changelog, workflow, emulator, craft execution, device E2E, personalization).
- **Living spec for the app being built:** [[17_NATIVE_APP_V2/V3-COMPLETE-BUILD-SPEC]]

### One-off local junk — deleted

- `docs/superpowers/` — old Superpowers design specs (Drafting Table already shipped).
- `docs/placement/` — TCS NQT study HTML; **not product**. Moved to `~/Desktop/placement-tcs/`.
- `docs/audit/` — local audit HTML.
- `laptop-disk-audit-2026-07-19.html`, `.tmp-storage-audit/` — machine disk probes.

### Root report prototypes — deleted

- **What:** `prototypes/reports/` — visual gallery of Snapshot/Standard/Deep report skins (Spec Light, Consulting Navy, etc.).
- **Depth:** Static HTML/CSS/JS selection gallery only. Not wired to production reports.
- **Deleted:** `prototypes/`.

---

## Intentionally kept (do not “clean” these)

| Keep | Why |
|------|-----|
| `docs/knowledge/Genesis/` | Immutable constitution |
| `docs/knowledge/99_ARCHIVE/` and `Archive/` | Cold provenance (Clerk-era notes are **false now**; do not cite) |
| Living numbered vault `01_`–`17_` feature/arch notes | Contracts, not leftover plans |
| `frontend/prototypes/AIIMIN-Drafting-Table.html` | Locked design language |
| `native-android/` source | V2 reference for `sync/` / `session/` / `security/` / `data/network` only — never its `ui/` |
| `native-android-v3/` source + screenshot-test goldens | Current app |
| `frontend/src`, `server/`, `api/`, `deploy/` | Production |
| `PRODUCT.md`, `DESIGN.md`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` | Agent/human entry |
| `Secrets, Keys /`, `*.pem`, `.env*` | Local secrets (gitignored). Do not commit. Prefer moving secrets off this folder later. |
| `node_modules/`, `frontend/node_modules/` | Regenerable; needed to run the app |

V2 **source** is still here. Deleting `native-android/` is a separate founder call (tag/branch then remove).

---

## Disk vs git (this folder, 2026-08-14 before pass)

- Folder on disk was **4.8 GB**. Git-tracked tree was **~41 MB**.
- Almost all weight was local: `frontend/node_modules` (~1.8 GB), mess-menu (~859 MB), V3 Gradle/APK/shots (~500 MB+), root `node_modules` (~370 MB). Markdown count (~990 files) is mostly the vault by design — deleting Genesis or living feature notes would not shrink the folder in a way that matters and would destroy the Brain.

---

## Changelog

### 2026-08-14 — Completed-work ledger + folder cleanup
- **What:** Documented finished/abandoned clusters; removed satellite plans, closed prototypes, stub pointers, extra APKs, and local junk. Moved mess-menu and TCS placement files off this repo.
- **Why:** Founder asked to keep the Dashboard Project folder optimized without losing the record of what was done.
- **Files:** this note; see deletions listed above
- **Status:** shipped (local working tree; commit only if founder asks)
- **Notes:** Genesis and `99_ARCHIVE` not deleted.
