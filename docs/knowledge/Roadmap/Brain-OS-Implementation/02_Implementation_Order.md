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
artifact: implementation-order
migration_batch: W4
fm_source: script
implementation: none
genesis_touch: forbidden
---

# 02 — Implementation Order

**Sequenced Brain OS execution — cite frozen Program V1; do not redesign.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Executed** (W0–W6 vault/config 2026-07-26) |
| Rule | Finish each wave exit gate before next; Founder authorize per wave |

---

## 0. Ordering principles

1. **Stop new debt before backfill** (templates → plugins → chrome → queries → graph polish → bulk FM)  
2. **Path-fallback dashboards before FM-primary**  
3. **Living hubs before leaf mass**  
4. **No Genesis / frozen UX writes in any wave**  
5. **Prove each wave** via [[04_Validation_Checklist]]  

---

## 1. Wave map

```text
W0 Foundations (templates + callouts + workspace chrome)
 → W1 Required plugins + capture
 → W2 Minimal cockpit (dashboards + nav hubs)
 → W3 Graph sight + maps
 → W4 Metadata backfill (hubs then leaves)
 → W5 Optional polish (Omnisearch, Tasks/Kanban, more maps)
 → W6 Measure + harden (GES/audit re-score, lint warn-only)
```

Aligns Program V1 phase IDs: U0 · P0/P1 · M0 · DB · G0 · V0/V1 · M1/M2 …

---

## 2. Wave detail

### Wave W0 — Foundations (authorize first)

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | TPL-04 | Confirm denylist policy written into template headers |
| 2 | META-01 · META-02 · META-03 | Template rewrite + daily template |
| 3 | TPL-01 | Callouts on living hubs |
| 4 | WS-01 · WS-02 | Founder workspace + Core bookmarks |
| 5 | NAV-03 | Confirm Roadmap ↔ Program V1 INDEX links |

**Exit:** New notes can stamp KOS FM; Founder opens Context in ≤2 clicks from cold start.  
**Program V1 cites:** `06` M0 · `12` U0 · `05` 0.1–0.4 · `13` P0  

---

### Wave W1 — Required plugins + capture

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | PLG-02 · PLG-03 | Install Dataview · Templater · QuickAdd · Metadata Menu |
| 2 | TPL-02 · TPL-03 | Templater whitelist + QuickAdd macros |
| 3 | META-04 · PLG-04 | Metadata Menu living fileClasses |
| 4 | WS-03 | Hotkeys for nav + capture |

**Exit:** `qa-bug` / `qa-adr` / `qa-touch` work; enums selectable; Dataview parses a test query.  
**Cites:** `13` P1 · `05` 1.3–1.5 · `08` capture · `12` U1  

---

### Wave W2 — Minimal cockpit + navigation hubs

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | DB-01 · DB-02 | Dashboards Index + Executive + Daily Ops (path fallbacks) |
| 2 | DB-04 | Link Home / KG / Context / Founder MOC |
| 3 | NAV-01 · NAV-02 | Genesis MOC envelope + KG star |
| 4 | NAV-04 | Navigation Spine note |
| 5 | WS-04 | Mode workspaces OPS/LAW/BUILD/DECIDE/HYGIENE |
| 6 | META-05 | Path→Layer living note |

**Exit:** Founder Workspace Index opens; Executive shows blockers/path tables; envelope lists P-entrypoints without touching Genesis files.  
**Cites:** `04` · `08` · `02` REC-NAV/HB · `12` U2  

---

### Wave W3 — Graph sight + visual maps

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | PLG-01 | Enable Canvas |
| 2 | GR-01 · GR-02 · GR-03 · GR-04 | graph.json + GV docs + Legend |
| 3 | NAV-05 · NAV-06 | Visual-Maps-Index + Core-3 canvases (KOS, Spine, Founder) |
| 4 | DB-03 (partial) | Risk + Roadmap dashboards useful for hygiene |

**Exit:** GV-DEFAULT colored; magazine test partially pass; maps lobby exists.  
**Cites:** `03` · `07` G0 · `11` V0–V1 · `13`  

---

### Wave W4 — Metadata backfill (living only)

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | META-06 | Dry-run report Founder accepts |
| 2 | META-07 | Hub FM apply + validate |
| 3 | META-08 | Leaf batches + samples |
| 4 | DB-05 | Prefer FM in queries; keep dual-read |
| 5 | META-12 | Collision register published |

**Exit:** Eligible hubs 100% core FM; eligible living ≥95% (Gate G1 intent). Genesis/UXA/UXI write count = 0.  
**Cites:** `06` M1–M2 · `04` D4  

---

### Wave W5 — Optional polish

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | PLG-05 | Omnisearch excludes |
| 2 | META-09 · META-10 · META-11 | Tags · hex · archive READMEs |
| 3 | NAV-07 · NAV-08 | More maps · eng depth as needed |
| 4 | PLG-06–09 | URI / Tasks or DV tasks / Kanban≤1 / Buttons |
| 5 | GR-05 · GR-06 · GR-07 | Living graph SLO + path-qualify |
| 6 | WS-05 · WS-06 · NAV-09 | Mobile pins · agent lock · AI boot prompt |

**Exit:** Optional stack within ≤8 community plugins; living orphan queue shrinking.  
**Cites:** `13` Optional · `07` G1–G3 · `11` V2+ · `10`  

---

### Wave W6 — Measure + harden

| Order | Backlog IDs | Work |
|------:|-------------|------|
| 1 | META-13 | Warn-only lint CI/script |
| 2 | — | Re-run vault audit scoring (`01` method) |
| 3 | — | Score GES (`07`) |
| 4 | — | Record results in living metrics note (not rewriting frozen `91`) |
| 5 | DB-03 remainder | Full dashboard set if not done |

**Exit:** Live metrics note; Founder decides G3 (FM-only WHERE) yes/no.  
**Cites:** `06` M4 · `07` · `01` · `91` targets  

---

## 3. Parallelism (safe)

| Can parallel | Cannot parallel |
|--------------|-----------------|
| NAV envelope work ‖ template rewrite (different files) | Bulk FM ‖ unfinished templates |
| Graph colorGroups ‖ dashboard markdown (after Dataview) | QuickAdd ‖ missing templates |
| Canvas Core-3 ‖ Omnisearch | Linter ‖ any wave without denylist |

---

## 4. Stop conditions (halt wave)

- Any write detected under `Genesis/` or frozen UXA/UXI  
- Template/QuickAdd creating notes in forbidden paths  
- Dashboard treated as product SoT in process  
- Community plugin count >8 without Founder exception  
- Proof-or-stop violation (claiming KPIs without measure)  

See [[03_Risk_Register]].

---

## 5. Declaration

```text
IMPLEMENTATION ORDER — EXECUTED (W0–W6 vault/config)
See W6_Validation_Evidence · 06_Living_Metrics
Founder UI remaining: trust plugins · save Founder workspace · bind hotkeys
```
