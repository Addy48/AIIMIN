---
authority: operations
derived_from: Roadmap/Brain-OS-Implementation/01_Execution_Backlog
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
note_type: NT-PROGRAM-LIVING
program: Brain-OS-Implementation
artifact: risk-register
migration_batch: W4
fm_source: script
implementation: none
genesis_touch: forbidden
---

# 03 — Risk Register

**Brain OS implementation risks — planning only**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | Planning |
| Design SoT | Frozen Program V1 |

---

## 0. Scale

| Level | Meaning |
|-------|---------|
| **C** | Critical — stop wave; may violate law/freeze |
| **H** | High — block wave exit |
| **M** | Medium — mitigate; continue with care |
| **L** | Low — monitor |

---

## 1. Register

| ID | Risk | Lvl | Domain | Trigger | Mitigation | Residual |
|----|------|:---:|--------|---------|------------|----------|
| R-01 | Accidental Genesis write via Templater/QuickAdd/Linter/script | C | Meta/Plugins | Misconfigured template path | Denylist `Genesis/**`; TPL-04 gate; dry-run scripts; V-GEN check | L if gated |
| R-02 | Bulk FM into UXA/UXI | C | Meta | “Make Dataview pretty” urge | Eligibility formula `06`; denylist; ADR-only | L |
| R-03 | Frozen pack relocate / rewrite “for orphans” | C | Graph/Nav | Orphan KPI pressure | Accept O-LAW/O-FROZEN; envelope-only (`07`) | L |
| R-04 | Redesign / rewrite frozen Program V1 specs mid-impl | H | Process | Spec disagreement | Cite only; living errata + ADR | L |
| R-05 | Dashboard / Kanban becomes requirements SoT | H | Dash/Auto | Founder edits queries as law | Derived headers; Context/Features remain SoT | M |
| R-06 | Template debt continues (W0 skipped) | H | Templates | Jump to plugins | Force W0 exit before W1 | L if ordered |
| R-07 | Wrong `authority`/`knowledge_layer` mass-applied | M | Meta | Blind path defaults | Soft-flag; 10% sample; Metadata Menu after | M |
| R-08 | Dataview performance / empty boards mid-migration | M | Dash | FM incomplete | Dual-read path fallbacks until G3 | L |
| R-09 | Plugin zoo / >8 community plugins | M | Plugins | Optional pile-on | Cap `13`; Rejected list | L |
| R-10 | Templater JS security / malicious snippet | H | Plugins | Unreviewed scripts | Treat as code; Founder review | M |
| R-11 | QuickAdd corrupts Current-Context Touch | M | Capture | Bad append macro | Careful `qa-touch`; test on copy line | M |
| R-12 | Graph hairball / lag after colorGroups | M | Graph | GV-FULL daily | GV-DEFAULT/PERF-LITE; orphans off | L |
| R-13 | Canvas sprawl / shadow UXA | H | Maps | Per-feature canvases | Budgets Core-5; cite Publication only (`11`) | M |
| R-14 | Hex escape breaks Palette meaning | M | Meta | Over-eager replace | Living non-Genesis only; wrap not delete | L |
| R-15 | Bookmark / workspace sprawl | L | UX | Too many pins | Cap 10 Core; prune weekly (`12`) | L |
| R-16 | Mobile overreach (edit law on phone) | M | UX | Convenience | Mobile = Context+inbox only | L |
| R-17 | Parallel agents overwrite same lane | H | Agent | Dual Cursor/CC | Agent lock (`10`); sequential waves | M |
| R-18 | False “implementation complete” / KPI claims | H | Process | Eager closeout | Proof-or-stop; live metrics note separate from frozen `91` | L |
| R-19 | Obsidian Sync fights git | H | Plugins | Enable Sync | Rejected in `13`; git SoT | L if obeyed |
| R-20 | In-vault AI as second memory | H | Plugins | Copilot install | Rejected; use Agent Workspace runtimes | L if obeyed |
| R-21 | Stage B rename during Brain OS | H | Arch | Folder confusion | Explicitly out of backlog | L |
| R-22 | Eng content stubs without `last_reviewed` | L | Nav | Thin folders | Allow `status: draft` + owner | L |
| R-23 | Collision renames break frozen links | H | Meta | Aggressive rename | Path-qualify living links; never rename Genesis/frozen | L |
| R-24 | `.obsidian` git churn / machine conflict | M | UX | Commit workspace.json carelessly | Prefer local chrome; Founder decide sync policy | M |

---

## 2. Risk by wave

| Wave | Top risks |
|------|-----------|
| W0 | R-06, R-01 (template paths), R-15 |
| W1 | R-01, R-10, R-11, R-09 |
| W2 | R-05, R-01 (envelope only living) |
| W3 | R-12, R-13 |
| W4 | R-02, R-07, R-08, R-01 |
| W5 | R-09, R-17, R-14, R-16 |
| W6 | R-18 |

---

## 3. Escalation

| If | Then |
|----|------|
| R-01/R-02/R-03 triggered | **Stop** · restore from git · incident note · Founder |
| R-05/R-13 process drift | Callout refresh · remove illicit SoT |
| R-18 | Retract claim · status `blocked`/`failed` |

---

## 4. Declaration

```text
RISK REGISTER — COMPLETE (planning)
Critical paths mitigated by denylist + wave gates
```
