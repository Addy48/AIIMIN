---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/95_Publication_Record
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
note_type: NT-PROGRAM-LIVING
program: Brain-OS-Implementation
artifact: execution-backlog
migration_batch: W4
fm_source: script
implementation: none
genesis_touch: forbidden
frozen_ux_touch: forbidden
---

# 01 — Execution Backlog

**Brain OS Final Obsidian Completion Pass — implementation-ready tasks only**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Planning only — zero execution** |
| Design SoT | Frozen [[Roadmap/Program-V1-Obsidian-Knowledge-OS/00_INDEX]] |
| Forbidden | Redesign architecture · edit Genesis · edit/move frozen UX Architecture / UX Intelligence |

---

## 0. Safety filter (every task must pass)

A task is **implementation-ready** only if:

1. Cited in frozen Program V1 (`01`–`13` / `90`–`95`)  
2. Touches **living** paths only (or local `.obsidian` config)  
3. Does **not** write `Genesis/**`  
4. Does **not** bulk-edit or move `Roadmap/UX-Architecture/**` or `Roadmap/UX-Intelligence/**`  
5. Does **not** require Stage B rename or auth/schema/code  
6. Has clear exit criteria  

**Deferred** (not ready / not safe yet): mass FM on frozen packs; Genesis envelope content completeness audit that edits Genesis; Linter without denylist; dual Bases+Dataview Executive; in-vault AI plugins.

---

## 1. Backlog by domain

### 1.1 Metadata preparation

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| META-01 | Rewrite `_templates/*` with KOS core FM + `knowledge_layer` + `graph_role` + `note_type` + `## Parent` stub | `06` M0.2 · `13` P0 · `05` 0.2 | Yes | P0 |
| META-02 | Add missing templates: moc, dashboard, eng-leaf, errata, program, changelog-stub | `06` M0.3 · `05` 0.3 | Yes | P0 |
| META-03 | Point Daily Notes at daily template (links to Context + Dashboards placeholder) | `05` · `13` · `12` | Yes | P0 |
| META-04 | Draft Metadata Menu fileClass presets (enums from `06`) — **exclude Genesis** | `06` · `13` | Yes | P1 |
| META-05 | Publish living Path→Layer map note (REC-KL-02) outside Genesis | `02` · `06` · `90` gap | Yes | P1 |
| META-06 | Dry-run FM backfill script plan for eligible living notes only | `06` M1–M2 | Yes (plan/script dry-run) | P1 |
| META-07 | Apply hub FM backfill (Home, Context, MOCs, living hubs) after dry-run OK | `06` M1 | Yes | P1 |
| META-08 | Living leaf FM backfill by folder batches + 10% sample | `06` M2 | Yes | P1–P2 |
| META-09 | YAML tags on hubs/MOCs/dashboards/Feature MOCs | `06` M3.1 | Yes | P2 |
| META-10 | Hex-escape pass on **living non-Genesis** notes only | `06` M3.3 | Yes | P2 |
| META-11 | Archive README FM stamp only (`KL-COLD`) | `06` M3.2 | Yes | P2 |
| META-12 | Basename collision register (living doc) — no frozen renames | `06` MD-04 · `03` | Yes | P2 |
| META-13 | Warn-only FM lint script (denylist Genesis/UXA/UXI) | `06` M4 · `13` Linter caution | Yes | P2 |

**Not ready:** Bulk FM inside UXA/UXI/Genesis.

---

### 1.2 Template readiness

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| TPL-01 | Callout styleguide applied to Home, Context, Genesis **MOC** (living), Roadmap MOC | `05` 0.1 · `08` | Yes | P0 |
| TPL-02 | Templater enabled + scripts with folder whitelist / Genesis denylist | `13` · `05` 1.3 | Yes | P1 |
| TPL-03 | QuickAdd macros: qa-bug, qa-adr, qa-feature, qa-eng, qa-inbox, qa-touch | `08` · `12` · `13` | Yes | P1 |
| TPL-04 | Verify templates never target Genesis or frozen pack paths | `05` · `09` | Yes | P0 gate |

---

### 1.3 Graph configuration readiness

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| GR-01 | Apply `graph.json` colorGroups per `03` §5.2 | `03` · `07` G0.1 · `13` | Yes | P1 |
| GR-02 | Set display defaults (orphans off, attachments off, arrows on, distances) | `03` §5.3 · `07` | Yes | P1 |
| GR-03 | Document GV-* search strings (DEFAULT, PERF-LITE, LAW, ARCH, PROD, BUILD, ORPHAN, …) | `03` · `07` · `12` | Yes | P1 |
| GR-04 | Create living Graph-Legend note + link from KG | `07` G0.3 | Yes | P1 |
| GR-05 | Living hub link SLO pass (envelope, MOCs) — **no Genesis edits** | `03` · `07` G1–G2 | Yes | P2 |
| GR-06 | Living orphan elimination batch (Features → Eng → Ops) | `07` G2 | Yes | P2 |
| GR-07 | Path-qualify colliding stems on living edit pass | `03` · `07` G3 | Yes | P2 |

**Not ready:** Editing Genesis for orphans; bulk frozen index rewrites without ADR.

---

### 1.4 Dashboard readiness

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| DB-01 | Create `Dashboards/` folder + `00_Founder-Workspace-Index` | `04` · `05` 0.6 | Yes | P1 |
| DB-02 | Executive + Daily Ops with path-fallback queries + Derived headers | `04` · `05` | Yes | P1 |
| DB-03 | Remaining domain dashboards (Genesis cite-path, UX, Design, Eng, AI, Roadmap, Risk, Decisions) | `04` | Yes | P1–P2 |
| DB-04 | Wire Home / KG / Founder MOC / Context links to Workspace Index | `04` · `08` | Yes | P1 |
| DB-05 | Tighten FM WHERE after META-07+ (keep dual-read until G3) | `04` D4 · `06` | Yes | P2 |

**Not ready:** Dataview queries that require writing Genesis FM.

---

### 1.5 Plugin configuration readiness

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| PLG-01 | Enable core Canvas when V0 authorized | `13` · `11` | Yes | P1 |
| PLG-02 | Install Required four: Dataview · Templater · QuickAdd · Metadata Menu | `13` P1 | Yes | P1 |
| PLG-03 | Configure Dataview (JS on if needed; document) | `04` · `13` | Yes | P1 |
| PLG-04 | Metadata Menu: fileClasses living-only | `13` · `06` | Yes | P1 |
| PLG-05 | Omnisearch + excludes Archive / 99_ARCHIVE / `_templates` | `13` · `12` | Yes | P2 |
| PLG-06 | Optional: Advanced URI basic open links table on Workspace Index | `05` · `13` | Yes | P2 |
| PLG-07 | Optional: Tasks **or** Dataview tasks (pick one path) | `13` · `05` | Yes | P2 |
| PLG-08 | Optional: Kanban ≤1 launch board | `13` · `05` | Yes | P2 |
| PLG-09 | Optional: Buttons (not Meta Bind yet) on Index/Executive | `13` | Yes | P2 |

**Rejected (do not schedule):** Obsidian Sync vs git; in-vault Copilot; Bases as second Executive; Linter without denylist; Advanced Canvas zoo.

---

### 1.6 Workspace readiness

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| WS-01 | Save Obsidian workspace `Founder` (Context main + Executive/Daily Ops split) | `12` U0 · `08` | Yes | P0 |
| WS-02 | Bookmarks Core ≤10 | `12` · `08` | Yes | P0 |
| WS-03 | Bind hotkey intent map (`nav.*` / `cap.*`) + document chords | `12` U1 | Yes | P1 |
| WS-04 | Create WS-OPS / LAW / BUILD / DECIDE / HYGIENE | `12` U2 | Yes | P1 |
| WS-05 | Mobile bookmark subset (Context · Home · Inbox · Capture) | `12` U4 | Yes | P2 |
| WS-06 | Optional Context `## Agent lock` section when multi-runtime | `10` MW1 | Yes | P2 |

---

### 1.7 Navigation readiness

| ID | Task | Cites | Safe? | Priority |
|----|------|-------|:-----:|:--------:|
| NAV-01 | Expand Genesis **MOC** envelope tables (living only) — P1–P9 entrypoints + certificates | `02` REC-NAV-03 · `03` NT-ENVELOPE · `08` | Yes | P0–P1 |
| NAV-02 | Knowledge-Graph MOC: inbound from Home + all domain MOCs; list dashboards/maps | `02` REC-HB-01 · `08` | Yes | P0–P1 |
| NAV-03 | Roadmap MOC spine already has Program V1 — verify bidirectional links to INDEX | `02` · Home done | Yes | P0 |
| NAV-04 | Navigation Spine note `Maps of Content/00_Navigation-Spine` | `02` REC-NAV-02 | Yes | P1 |
| NAV-05 | Visual-Maps-Index.md lobby | `11` V0 | Yes | P1 |
| NAV-06 | Core canvases KM-KOS · KM-PROG-SPINE · KM-FOUNDER (note cards only) | `11` V1 | Yes | P1–P2 |
| NAV-07 | KM-ARCH-CONSUME · KM-DEP-LAUNCH | `11` V2 | Yes | P2 |
| NAV-08 | Living Feature/Eng depth notes as needed (content, not Stage B) | `02` REC-NAV-05 | Yes | P2 |
| NAV-09 | AI Workspace boot one-pager under `14_PROMPTS` (optional) | `09` A1 | Yes | P2 |

---

## 2. Explicitly excluded from this backlog

| Exclusion | Why |
|-----------|-----|
| Edit Genesis internals | C1 / freeze |
| Move/edit frozen UXA/UXI bodies | C2 |
| Stage B semantic folder rename | C3 deferred ADR |
| Auth / schema / product code | Out of Brain OS chrome |
| Claim GES ≥8.5 / FM 99% without re-measure | Proof-or-stop |
| Redesign Program V1 frozen specs | ADR only |

---

## 3. Readiness declaration (planning)

All **P0/P1** tasks above are **implementation-ready** pending Founder authorize of [[02_Implementation_Order]].

```text
EXECUTION BACKLOG — COMPLETE (planning)
Safe task set identified · Forbidden paths excluded
```
