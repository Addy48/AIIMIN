---
authority: operations
derived_from: Roadmap/Brain-OS-Implementation/02_Implementation_Order
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
note_type: NT-PROGRAM-LIVING
program: Brain-OS-Implementation
artifact: validation-checklist
migration_batch: W4
fm_source: script
implementation: none
genesis_touch: forbidden
---

# 04 — Validation Checklist

**Prove each Brain OS wave — planning template; run at execution time**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Executed** — results in [[W6_Validation_Evidence]] |
| Rule | No wave “done” without evidence same turn (proof-or-stop) |

---

## 0. Global invariants (every wave)

| # | Check | Pass if |
|---|-------|---------|
| G1 | Genesis writes this wave | **0** files under `Genesis/` modified |
| G2 | UXA/UXI bulk edits | **0** (unless Founder ADR) |
| G3 | `can_override_genesis: true` introduced | **0** |
| G4 | Secrets in vault | **0** |
| G5 | Frozen Program V1 design specs rewritten | **0** (cite only) |
| G6 | Community plugins count | ≤8 unless Founder exception |

---

## 1. Wave W0 — Foundations

| # | Check | Evidence |
|---|-------|----------|
| W0.1 | New feature/bug/ADR template includes core FM + Parent stub | Read template file |
| W0.2 | Daily Notes template path nonempty + links Context | Read `daily-notes.json` + template |
| W0.3 | Callouts on Home / Context / Genesis MOC / Roadmap MOC | Grep/Read |
| W0.4 | Workspace `Founder` exists; Context in main pane | Founder confirm / screenshot |
| W0.5 | Bookmarks Core ≤10 and include Context · Home · KG · Genesis MOC | Count |
| W0.6 | Cold start → Context ≤2 clicks | Founder time trial |
| W0.7 | Global G1–G6 | Pass |

**W0 exit:** all W0.* + G1–G6  

---

## 2. Wave W1 — Plugins + capture

| # | Check | Evidence |
|---|-------|----------|
| W1.1 | Dataview · Templater · QuickAdd · Metadata Menu installed/enabled | Plugin list |
| W1.2 | Test Dataview query on living path returns rows or empty-safe | Dashboard test note |
| W1.3 | Templater cannot create under `Genesis/` (denylist test) | Attempt blocked / config Read |
| W1.4 | `qa-bug` lands in `11_BUGS` with FM | Create test note |
| W1.5 | `qa-adr` lands in `10_DECISIONS` | Test |
| W1.6 | `qa-touch` appends safely to Context | Diff Context |
| W1.7 | Metadata Menu enums match `06` closed sets | Preset Read |
| W1.8 | Hotkeys `nav.context` + `cap.palette` work | Founder confirm |
| W1.9 | Global G1–G6 | Pass |

**W1 exit:** all W1.* + G1–G6  

---

## 3. Wave W2 — Cockpit + nav hubs

| # | Check | Evidence |
|---|-------|----------|
| W2.1 | `Dashboards/00_Founder-Workspace-Index` exists + Derived header | Read |
| W2.2 | Executive + Daily Ops open without query crash | Open in Obsidian |
| W2.3 | Path fallbacks work pre-FM | Query result |
| W2.4 | Home + KG + Context link to Workspace Index | Wikilink resolve |
| W2.5 | Genesis MOC lists P1–P9 entrypoints (living envelope) | Read MOC |
| W2.6 | KG lists domain MOCs bidirectional | Sample links |
| W2.7 | Navigation Spine note exists | Read |
| W2.8 | Mode workspaces load (at least OPS + LAW) | Founder confirm |
| W2.9 | Global G1–G6 | Pass |

**W2 exit:** all W2.* + G1–G6  

---

## 4. Wave W3 — Graph + maps

| # | Check | Evidence |
|---|-------|----------|
| W3.1 | `graph.json` colorGroups nonempty / match `03` | Read config |
| W3.2 | GV-DEFAULT excludes Archive + templates | Filter string |
| W3.3 | Graph-Legend note linked from KG | Link |
| W3.4 | Canvas enabled | core-plugins |
| W3.5 | Visual-Maps-Index + ≥3 Core canvases with note cards | Files exist |
| W3.6 | Canvases do not paste Genesis body law | Spot-check |
| W3.7 | Partial magazine test (clusters color-separable) | Founder blind glance |
| W3.8 | Global G1–G6 | Pass |

**W3 exit:** all W3.* + G1–G6  

---

## 5. Wave W4 — Metadata backfill

| # | Check | Evidence |
|---|-------|----------|
| W4.1 | Dry-run report accepted before apply | Report path |
| W4.2 | Hubs 100% core FM | Script/count |
| W4.3 | Eligible living ≥95% core FM | Script/count |
| W4.4 | Genesis FM write count | **0** |
| W4.5 | UXA/UXI bulk FM write count | **0** |
| W4.6 | `can_override_genesis: true` count | **0** |
| W4.7 | 10% human sample logged | Sample sheet |
| W4.8 | Dual-read still present in dashboards | Query Read |
| W4.9 | Collision register published (living) | Note exists |
| W4.10 | Global G1–G6 | Pass |

**W4 exit:** Gate G1 intent + G1–G6  

---

## 6. Wave W5 — Optional polish

| # | Check | Evidence |
|---|-------|----------|
| W5.1 | Omnisearch excludes cold/templates | Config |
| W5.2 | Community plugin count ≤8 | Count |
| W5.3 | Kanban boards ≤2 if any | Count |
| W5.4 | Living orphan/dead-end rates improved vs baseline (directional) | Script vs `01` |
| W5.5 | No rejected plugins installed | Plugin list |
| W5.6 | Global G1–G6 | Pass |

**W5 exit:** selected optionals verified + G1–G6  

---

## 7. Wave W6 — Measure + harden

| # | Check | Evidence |
|---|-------|----------|
| W6.1 | Living metrics note updated (not frozen `91`) | Note + date |
| W6.2 | Vault composite / Dataview dim / GES recorded | Numbers + method |
| W6.3 | Warn-only lint runs without writing Genesis | Lint output |
| W6.4 | No false “shipped KPIs” without numbers | Closeout status |
| W6.5 | Global G1–G6 | Pass |

**W6 exit:** measured baselines for next program · G1–G6  

---

## 8. Domain readiness matrix (planning target)

| Domain | Ready to execute when | Validation section |
|--------|----------------------|--------------------|
| Metadata preparation | W0 templates done | W0 + W4 |
| Template readiness | META-01–03 + TPL-04 | W0–W1 |
| Graph configuration | W1 Dataview optional; W3 primary | W3 |
| Dashboard readiness | W1 Dataview | W2 |
| Plugin configuration | Founder authorize W1 | W1 |
| Workspace readiness | W0 chrome | W0 + W2 |
| Navigation readiness | W2 hubs + W3 maps | W2–W3 |

---

## 9. Execution declaration

Checklists defined and **run** 2026-07-26. Full log: [[W6_Validation_Evidence]].

```text
VALIDATION CHECKLIST — EXECUTED
See W6_Validation_Evidence · GES≥8.5 not claimed
```
