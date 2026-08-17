---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: vault-automation-layer-spec
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Vault Automation Layer Specification v1.0

**Obsidian automation for AIIMIN Knowledge OS** — create, classify, query, and operate notes without mutating Genesis or relocating frozen packs.

| Field | Value |
|-------|-------|
| Date | 2026-07-25 |
| Parents | [[02_Vault_Architecture_Specification]] · [[03_Graph_Engineering_v1]] · [[04_Founder_Workspace_Dataview_Spec]] · [[01_Vault_Deep_Audit_Report]] |
| Mode | **Design only — zero plugin install / zero template rewrite in this deliverable** |
| Vault path | `docs/knowledge/` |
| Current baseline | Core **Templates** on (`_templates/`); **Daily Notes** on (`Daily Notes/`); **Canvas** core plugin **off**; community plugins **not** specified in-repo yet |

---

## 1. Principles

| ID | Principle |
|----|-----------|
| A1 | Automate **living** corpus; never auto-edit `Genesis/**` |
| A2 | Never auto-move or bulk-rewrite frozen UX Architecture / UX Intelligence |
| A3 | Prefer **metadata + Dataview** over duplicating SoT into boards |
| A4 | Every new note from automation must satisfy Graph Engineering parent/outbound SLOs |
| A5 | Automation outputs are operations — `can_override_genesis: false` always |
| A6 | Few plugins well-configured beat plugin zoo |
| A7 | URI / Buttons / QuickAdd = speed for Founder; Templates / Metadata = correctness for agents |

---

## 2. Capability catalog

For each capability: **Purpose** · **Where it applies** · **Why it improves AIIMIN** · **Implementation priority** · **Dependencies**.

Priority scale: **P0** (block KOS) · **P1** (Founder cockpit) · **P2** (ops polish) · **P3** (optional / later) · **Defer** (explicitly not now).

---

### 2.1 Templates (core Obsidian)

| Field | Spec |
|-------|------|
| **Purpose** | Stamp required frontmatter, Parent stub, Authority stub, and section skeleton so new notes enter the graph correctly. |
| **Where it applies** | `_templates/` — extend existing feature/bug/ADR/API/DB/sprint/meeting/experiment/entity templates; add: `moc-template`, `dashboard-template`, `eng-leaf-template`, `program-note-template`, `errata-template`, `changelog-stub`. |
| **Why it improves AIIMIN** | Audit: metadata ~55%, dead ends ~60%. Templates are cheapest fix for regression. Aligns REC-MD-02 and NT-* contracts. |
| **Implementation priority** | **P0** |
| **Dependencies** | KOS FM schema ([[02_Vault_Architecture_Specification]]); Graph note types ([[03_Graph_Engineering_v1]]); core Templates already pointed at `_templates`. |

**Rules:** Templates must not target Genesis paths. Insert `## Parent` with placeholder wikilink. Include `knowledge_layer` + `graph_role` defaults by template kind.

---

### 2.2 Templater

| Field | Spec |
|-------|------|
| **Purpose** | Dynamic insertion: date, folder-aware defaults, prompt for parent MOC, auto-title, cursor placement, optional file move into correct living folder. |
| **Where it applies** | Same `_templates/` as Templater scripts; Founder “New Feature / New ADR / New Bug” flows; **not** Genesis; **not** frozen pack paths. |
| **Why it improves AIIMIN** | Core Templates cannot prompt for parent or set path-qualified links. Templater enforces Graph Engineering “exactly one parent” at create-time. |
| **Implementation priority** | **P1** (after core template content rewrite) |
| **Dependencies** | Community plugin Templater; solid core Templates first (P0); folder conventions (Stage A numbered paths). |

**Guardrails:** Disable any Templater command that writes under `Genesis/` or `Roadmap/UX-Architecture/` / `Roadmap/UX-Intelligence/`. Whitelist create roots: `09_FEATURES`, `10_DECISIONS`, `11_BUGS`, `12_SPRINTS`, `Dashboards` (when exists), `Roadmap/Program-*` living, eng folders.

---

### 2.3 Dataview

| Field | Spec |
|-------|------|
| **Purpose** | Query living metadata and paths into Founder Workspace dashboards and vault health KPIs. |
| **Where it applies** | Future `Dashboards/**` per [[04_Founder_Workspace_Dataview_Spec]]; optional embeds on MOCs (read-only lists); never as SoT. |
| **Why it improves AIIMIN** | Audit Dataview readiness **2.0**. Turns KOS + Graph SLOs into visible Founder metrics. Powers Executive / Risk / Eng / Roadmap boards. |
| **Implementation priority** | **P0** (plugin) · **P1** (full 10 dashboards) |
| **Dependencies** | Dataview plugin; FM backfill outside Genesis (REC-MD-01) for rich filters; path fallbacks until then; Dashboard spec. |

**Guardrails:** Header “Derived view” on every dashboard. Genesis queried by `file.path` only.

---

### 2.4 Tasks

| Field | Spec |
|-------|------|
| **Purpose** | Inline `- [ ]` tasks with due/priority; Dataview or Tasks plugin queries for open work. |
| **Where it applies** | Daily Ops / Current-Context mirrors; Program 0 launch checklist living notes; sprint notes; **not** Genesis; avoid putting constitutive requirements only in tasks. |
| **Why it improves AIIMIN** | Launch blockers (LC-01..LC-14), tester onboarding, and Program V1 impl checklists need trackable work without Jira. |
| **Implementation priority** | **P2** |
| **Dependencies** | Optional Tasks community plugin **or** Dataview task queries; Daily Ops dashboard; discipline to keep tasks in living ops notes. |

**Guardrails:** Product law stays in Genesis/UXA; tasks only track **execution**. Sync mentally with Home blockers — Context remains narrative SoT for “what matters today.”

---

### 2.5 Kanban

| Field | Spec |
|-------|------|
| **Purpose** | Visual board for sprint/launch cards (Backlog → Doing → Blocked → Done). |
| **Where it applies** | One board under `12_SPRINTS/` or `Operations/` for launch; optional Program V1 impl board; **not** for constitutional artifacts. |
| **Why it improves AIIMIN** | Founder-friendly view of launch/eng execution; complements Roadmap Dashboard without replacing Roadmap MOC. |
| **Implementation priority** | **P2** |
| **Dependencies** | Kanban community plugin; Tasks or plain cards; Roadmap Dashboard relationship (R-peer). |

**Guardrails:** Cards link to vault notes (ADRs, bugs, features). Board is ops UI, not requirements DB. Max **1–2** boards to avoid fragmentation.

---

### 2.6 Periodic Notes

| Field | Spec |
|-------|------|
| **Purpose** | Daily / weekly / monthly note cadence beyond core Daily Notes. |
| **Where it applies** | `Daily Notes/` (already); optional `Periodic Notes/Weekly`, `Monthly` under ops — **or** keep weekly as section inside Friday daily. |
| **Why it improves AIIMIN** | Founder journaling + “what shipped / blocked” rhythm feeds Daily Ops and Executive without bloating Current-Context. |
| **Implementation priority** | **P2** (Daily already on) · Weekly **P2** · Monthly **P3** |
| **Dependencies** | Periodic Notes plugin **or** stick to core Daily Notes + Templater daily template; wire daily template to Context / Dashboard links. |

**Current gap:** `daily-notes.json` has `"template": ""` — P0/P1 should set daily template once written.

**Guardrails:** Periodic notes are KL-OPS; never become product SoT. Exclude from default graph (Graph filter) if noisy.

---

### 2.7 Metadata Menu

| Field | Spec |
|-------|------|
| **Purpose** | Controlled field enums (authority, lifecycle, knowledge_layer, status, owner) with UI selectors — prevent FM drift. |
| **Where it applies** | All living notes outside Genesis; especially MOCs, Features, Roadmap living, Eng leaves, Dashboards. |
| **Why it improves AIIMIN** | Makes REC-MD-01 sustainable; Dataview queries stay valid; agents/humans pick from closed sets ([[02_Vault_Architecture_Specification]] tag/FM enums). |
| **Implementation priority** | **P1** |
| **Dependencies** | Metadata Menu plugin; frozen field preset file; Templates emitting same keys; Dataview. |

**Guardrails:** Do not force Metadata Menu fileClasses onto Genesis notes. Presets must include `can_override_genesis: false` default.

---

### 2.8 QuickAdd

| Field | Spec |
|-------|------|
| **Purpose** | One-chord capture: New Bug, New ADR, New Feature stub, Append to Current-Context Touch, Capture inbox → process later. |
| **Where it applies** | Founder keyboard workflows; mobile Obsidian if used; macros calling Templater. |
| **Why it improves AIIMIN** | Reduces friction so vault stays updated during build sprints; raises living note creation rate with correct parents. |
| **Implementation priority** | **P1** |
| **Dependencies** | QuickAdd plugin; Templater (recommended); template set; whitelist folders. |

**Suggested captures (impl later):** `qa-feature` · `qa-bug` · `qa-adr` · `qa-eng-leaf` · `qa-inbox` · `qa-touch-context` (append link line to Current-Context — careful, ops only).

---

### 2.9 Buttons

| Field | Spec |
|-------|------|
| **Purpose** | In-note clickable actions: “Open Executive Dashboard,” “Create child from template,” “Toggle status.” |
| **Where it applies** | Workspace Index · Executive · Daily Ops · Feature MOCs; **not** Genesis / frozen packs. |
| **Why it improves AIIMIN** | Founder Workspace becomes cockpit, not wiki hike. Speeds R-drill between dashboards. |
| **Implementation priority** | **P2** |
| **Dependencies** | Buttons plugin (or Meta Bind); Dashboards exist; optional QuickAdd/Templater commands. |

**Guardrails:** Buttons must call safe commands only (open note, QuickAdd whitelist). No button that mass-edits vault.

---

### 2.10 Bases (Obsidian Bases)

| Field | Spec |
|-------|------|
| **Purpose** | Native structured views over notes (where Obsidian Bases is available) — alternative/complement to Dataview tables for Features, Bugs, ADRs. |
| **Where it applies** | `09_FEATURES`, `11_BUGS`, `10_DECISIONS` living catalogs; **only if** Founder’s Obsidian version supports Bases stably. |
| **Why it improves AIIMIN** | Lower plugin surface for tabular ops; good for Feature entity tracking beside `_manifest.json`. |
| **Implementation priority** | **P3** (where appropriate) — use **if** native Bases covers need; else Dataview remains SoT for Founder Workspace. |
| **Dependencies** | Obsidian app version with Bases; FM schema; do not duplicate Dashboard SoT — pick one primary query engine per surface. |

**Rule:** Founder Workspace v1 remains **Dataview-first**. Bases = optional parallel for Feature/Bug catalogs, not a second Executive.

---

### 2.11 Canvas

| Field | Spec |
|-------|------|
| **Purpose** | Spatial maps for program spines, cluster architecture teaching, launch dependency maps. |
| **Where it applies** | `Maps of Content/` or `Operations/Canvas/`; one **Roadmap Spine** canvas; one **KOS Cluster** canvas; avoid per-feature canvas sprawl. |
| **Why it improves AIIMIN** | Graph Engineering clusters + Roadmap spine are spatial; Canvas teaches agents/humans faster than prose alone. Core Canvas currently **off** — enable when used. |
| **Implementation priority** | **P2** |
| **Dependencies** | Enable core Canvas; cards link to real notes (UXA INDEX, Genesis MOC, Program specs); Graph Engineering cluster IDs as labels. |

**Guardrails:** Canvas is illustration + navigation, not law. Max ~3 living canvases in v1. No Genesis content rewritten onto canvas as replacement.

---

### 2.12 Excalidraw

| Field | Spec |
|-------|------|
| **Purpose** | Freeform diagrams (IA sketches, flow drafts, whiteboard). |
| **Where it applies** | `17_EXPERIMENTS/` or `Operations/Drawings/` for **draft** UX/eng thinking; promote outcomes into vault notes / UXA only via Founder ADR if frozen domain. |
| **Why it improves AIIMIN** | Fast ideation before formal Architecture programs; keeps scribbles out of Genesis. |
| **Implementation priority** | **P3** |
| **Dependencies** | Excalidraw plugin; clear “draft ≠ published architecture” banner; link from Experiments MOC if any. |

**Guardrails:** Excalidraw must not become shadow UX Architecture. Published IA stays in frozen UXA / Genesis P9.

---

### 2.13 Callouts

| Field | Spec |
|-------|------|
| **Purpose** | Standard semantic callouts: law, frozen, ceiling, derived, danger, inbox. |
| **Where it applies** | All living hubs, dashboards, Feature MOCs, ADRs; Home/Context; **envelope** notes. Avoid noisy callouts inside deep eng leaves. |
| **Why it improves AIIMIN** | Instant authority signaling (law vs ops vs derived). Prevents treating dashboards/Kanban as Genesis. Supports `/m` ceiling visibility. |
| **Implementation priority** | **P0** (convention) — no plugin required |
| **Dependencies** | Written callout styleguide (this spec §3); templates include correct callouts; optional Callout Manager **P3**. |

#### Callout styleguide (v1)

| Callout | Use |
|---------|-----|
| `[!important] Law` | Points at Genesis / cannot override |
| `[!success] Frozen` | Frozen pack cite (UXA/UXI/certs) |
| `[!warning] Ceiling` | `/m` capture-only, D05, palette lock |
| `[!abstract] Derived` | Dashboard / Dataview / Bases view |
| `[!danger] Do not` | Explicit forbidden actions |
| `[!tip] Envelope` | Genesis MOC navigation |
| `[!faq] Agent` | Boot order / proof-or-stop reminders |

---

### 2.14 URI workflows

| Field | Spec |
|-------|------|
| **Purpose** | `obsidian://` links to open vault notes, Advanced URI actions (new from template, append), deep links from Notion/Linear/Apple Notes/iOS Shortcuts. |
| **Where it applies** | Founder bookmarks; iOS Shortcut “Open Daily Ops”; README / AGENTS pointer; optional Raycast scripts. |
| **Why it improves AIIMIN** | Shrinks time-to-Context and time-to-Executive; agents/docs can link `obsidian://open?vault=...&file=...` for humans. |
| **Implementation priority** | **P1** (basic open links) · **P2** (Advanced URI create/append) |
| **Dependencies** | Stable vault name; Advanced URI plugin for rich actions; documented URI table in Workspace Index. |

**v1 URI map (document at impl — values depend on local vault name):**

| Action | Intent |
|--------|--------|
| Open Home | Boot |
| Open Current-Context | Daily SoT |
| Open Executive Dashboard | Cockpit |
| Open Genesis MOC | Law envelope |
| Open UXA Publication Record | Frozen UX |
| QuickAdd Feature | Capture |

**Guardrails:** Never URI-trigger deletes or Genesis writes. Vault name must be documented once (Founder machine).

---

## 3. Capability interaction map

```text
QuickAdd / URI / Buttons
        ↓
   Templater + Templates  →  correct FM + Parent (Graph SLO)
        ↓
 Metadata Menu            →  enum-safe edits
        ↓
 Living notes  ←——→  Dataview / Bases  →  Dashboards
        ↓
 Tasks / Kanban / Periodic →  execution surfaces (ops only)
        ↓
 Canvas / Excalidraw       →  spatial / draft (non-law)
        ↓
 Callouts                  →  authority UX everywhere
```

---

## 4. What not to automate

| Anti-pattern | Why |
|--------------|-----|
| Auto-link every Genesis file | C1; envelope only |
| Bulk FM write into Genesis | Forbidden |
| Kanban as requirements SoT | Law/architecture elsewhere |
| Excalidraw replaces UXA | Frozen pack is SoT |
| Daily notes as Product Roadmap | Use Roadmap MOC |
| Buttons mass-refactor | Too risky |
| Plugin for every itch | Violates A6 |

---

## 5. Phased implementation roadmap

Aligned with KOS phases; **design only here — do not execute until Founder authorizes.**

### Phase 0 — Foundations (P0) · ~1–2 sessions

| Step | Work | Caps |
|------|------|------|
| 0.1 | Callout styleguide applied to Home, Context, Genesis MOC, Roadmap MOC (living only) | Callouts |
| 0.2 | Rewrite/extend `_templates/*` with KOS FM + Parent + graph_role | Templates |
| 0.3 | Add missing templates (MOC, dashboard, eng-leaf, errata, program) | Templates |
| 0.4 | Point Daily Notes at new daily template (links to Context + Dashboards placeholder) | Periodic/Daily |
| 0.5 | Install/enable **Dataview** | Dataview |
| 0.6 | Create `Dashboards/00_Founder-Workspace-Index` + Executive + Daily Ops (minimal queries) | Dataview |

**Exit:** New living notes can be stamped correctly; Founder has 2 live dashboards; Genesis untouched.

### Phase 1 — Cockpit + capture (P0–P1) · ~2–4 sessions

| Step | Work | Caps |
|------|------|------|
| 1.1 | Remaining 8 dashboards per Dataview Spec | Dataview |
| 1.2 | Wire Home / KG / Founder MOC / Context nav | Dataview · Callouts |
| 1.3 | Install **Templater**; migrate key templates | Templater |
| 1.4 | Install **QuickAdd**; 5 capture macros | QuickAdd |
| 1.5 | Install **Metadata Menu**; fileClasses for living types | Metadata Menu |
| 1.6 | Document basic `obsidian://` open links on Workspace Index | URI |
| 1.7 | FM backfill outside Genesis (script or batched) | Metadata · Dataview |

**Exit:** Founder Workspace usable daily; captures enforce parents; queries use FM where present.

### Phase 2 — Graph + spatial (P1–P2) · ~2 sessions

| Step | Work | Caps |
|------|------|------|
| 2.1 | Apply `graph.json` colorGroups + GV-DEFAULT filter ([[03_Graph_Engineering_v1]]) | (graph config) |
| 2.2 | Enable Canvas; Roadmap Spine + KOS Cluster canvases | Canvas |
| 2.3 | Advanced URI create/append + Shortcuts doc | URI |
| 2.4 | Buttons on Workspace Index / Executive / Daily Ops | Buttons |
| 2.5 | Living hub link SLO pass (envelope, MOCs) — no Genesis edits | (manual/graph) |

**Exit:** Graph readable; cockpit clickable; spine visible on Canvas.

### Phase 3 — Execution surfaces (P2) · ~1–2 sessions

| Step | Work | Caps |
|------|------|------|
| 3.1 | Tasks convention + optional Tasks plugin; launch checklist as tasks | Tasks |
| 3.2 | Single Launch Kanban board linked to Program 0 | Kanban |
| 3.3 | Weekly Periodic Note template (or Friday section) | Periodic Notes |
| 3.4 | Risk/Eng dashboard alerts tuned from real use | Dataview |

**Exit:** Launch execution visible beside constitutional SoT.

### Phase 4 — Optional depth (P3) · as needed

| Step | Work | Caps |
|------|------|------|
| 4.1 | Bases for Features/Bugs **if** native fit; else skip | Bases |
| 4.2 | Excalidraw in Experiments with draft banners | Excalidraw |
| 4.3 | Callout Manager / cosmetic plugins | Callouts |
| 4.4 | Lint scripts (orphan/FM) in repo CI | (outside Obsidian) |

**Exit:** Only adopt what Founder actually uses for 2+ weeks.

---

## 6. Priority summary matrix

| Capability | Priority | Phase |
|------------|----------|-------|
| Templates (core) | P0 | 0 |
| Callouts (convention) | P0 | 0 |
| Dataview | P0→P1 | 0–1 |
| Templater | P1 | 1 |
| QuickAdd | P1 | 1 |
| Metadata Menu | P1 | 1 |
| URI (basic → Advanced) | P1→P2 | 1–2 |
| Buttons | P2 | 2 |
| Canvas | P2 | 2 |
| Tasks | P2 | 3 |
| Kanban | P2 | 3 |
| Periodic Notes (weekly+) | P2–P3 | 3 |
| Bases | P3 | 4 |
| Excalidraw | P3 | 4 |

---

## 7. Success metrics (post-impl)

| Metric | Target |
|--------|--------|
| New living notes with valid FM | ≥95% |
| New living notes with E-parent | ≥95% |
| Dataview readiness (audit dimension) | ≥7.0 |
| Founder time-to-Context | ≤2 clicks / 1 URI |
| Plugins enabled | Prefer ≤8 community plugins in v1 |
| Genesis files modified by automation | **0** |

---

## 8. Explicit non-goals (this deliverable)

- Installing plugins  
- Editing `_templates`  
- Creating Dashboards  
- Changing `.obsidian` config  
- Touching Genesis or frozen packs  

---

## 9. Closeout

| Item | Status |
|------|--------|
| Automation Layer Spec v1.0 | **COMPLETE** (design) |
| Phased roadmap | **Phases 0–4** defined |
| Implementation | **NONE** |

**Next (Founder):** Accept / amend → authorize **Phase 0** (templates + callouts + Dataview + minimal dashboards).
