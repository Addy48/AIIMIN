---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/03_Graph_Engineering_v1
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: visual-knowledge-maps
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Visual Knowledge Maps — Vault Visual Layer

**Spatial teaching + navigation layer for AIIMIN Knowledge OS — Canvas-first, graph-complement, never law.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Design only — zero Canvas files created** |
| Parents | [[03_Graph_Engineering_v1]] · [[07_Graph_Optimization_v2]] · [[05_Vault_Automation_Layer_Spec]] · [[08_Founder_Workspace]] · [[02_Vault_Architecture_Specification]] |
| Tooling | Obsidian **Canvas** (primary) · Global Graph GV-* (orientation) · Excalidraw (draft only) |
| Genesis / frozen | Cards **link to** entrypoints; never rewrite law onto canvas as SoT |

---

## 0. Mission

Make the vault **visually teachable** in under a minute:

- Founder sees program spine, clusters, dependencies without folder archaeology  
- Agents get a spatial index that matches Graph Engineering clusters  
- Maps stay **derived / navigational** — notes and Genesis remain SoT  

**Success test:** Founder opens Knowledge Maps index → reaches correct SoT note in **≤2 clicks**; map never contradicts Home / Context / frozen Publication Records.

---

## 1. Principles

| ID | Principle | Consequence |
|----|-----------|-------------|
| VK1 | **Maps ≠ SoT** | Every canvas header: “Derived view. Edit linked notes.” |
| VK2 | **Cards link real notes** | Prefer note cards over plain text blobs |
| VK3 | **Few living canvases** | Core set small; optional maps gated (see budgets) |
| VK4 | **Color = cluster language** | Align with Graph color tokens ([[03]] / [[07]]) — analytical, not product UI chrome |
| VK5 | **No Genesis rewrite** | Canvas may point at Genesis MOC / P-entrypoints; do not paste law onto cards |
| VK6 | **No frozen shadow IA** | UXA/UXI stay SoT; maps cite Publication / INDEX only |
| VK7 | **Excalidraw = draft** | Whiteboards live in Experiments; promote outcomes into notes/Canvas |
| VK8 | **Graph + Canvas cooperate** | Graph = organic degree; Canvas = curated story |
| VK9 | **One job per map** | No mega-canvas that mixes law + features + launch |
| VK10 | **Index is the lobby** | All maps linked from one living index (and KG / Founder Workspace) |

---

## 2. Canvas strategy

### 2.1 Role of each visual medium

| Medium | Role | Use when |
|--------|------|----------|
| **Canvas** | Curated spatial story with note cards | Teaching spines, clusters, dependencies, Founder cockpit maps |
| **Global Graph (GV-*)** | Live organic topology | Hygiene, cluster visibility, orphan hunt ([[07]]) |
| **Local Graph** | Note neighborhood | Authoring Parent/Children check |
| **Excalidraw** | Disposable sketch | Pre-architecture ideation only |
| **Mermaid in notes** | Inline small diagrams | Single-note explanation; not vault-wide map catalog |
| **Dashboards** | Query tables | Counts/queues — not spatial maps ([[04]]) |

### 2.2 Folder layout (future)

```text
docs/knowledge/
  Maps of Content/
    00_Knowledge-Graph.md          ← already H0 map-of-maps (prose)
    Visual-Maps-Index.md           ← lobby for all canvases (living)
  Operations/
    Canvas/                        ← preferred home for .canvas files
      KM-KOS-Clusters.canvas
      KM-Roadmap-Spine.canvas
      …
  17_EXPERIMENTS/
    Drawings/                      ← Excalidraw drafts only
```

**Alternative (acceptable):** store canvases under `Maps of Content/Canvas/` if Founder prefers one hub. Pick one root at impl; do not duplicate.

### 2.3 Canvas anatomy (standard)

Every living canvas includes:

| Zone | Content |
|------|---------|
| **Title card** | Map ID · name · “Derived · not SoT” |
| **Legend** | Color → cluster / meaning |
| **Primary story** | Left→right or hub→spoke layout |
| **Exit links** | Home · Context · KG · Visual-Maps-Index |
| **Authority footer** | “Genesis immutable · Frozen packs stay put” |

### 2.4 Card rules

| Card type | Rule |
|-----------|------|
| Note card | Preferred — open note on click |
| Group | Cluster or phase boundary |
| Text / arrow | Typed meaning (see §2.5) |
| Media / image | Rare; brand assets only if needed |
| Text-only card | Allowed for labels (“C-LAW”, “Phase G0”) — keep short |

### 2.5 Edge semantics on Canvas (visual)

| Stroke / label | Meaning | Maps to graph |
|----------------|---------|---------------|
| Solid thick | Parent / spine sequence | E-parent / E-sequence |
| Solid thin | Child / membership | E-child |
| Dashed | Cite / authority | E-authority |
| Dotted | Soft related | E-see |
| Double / labeled BRIDGE | Cross-cluster | E-bridge |
| Red / warning | Do not / ceiling | Product lock callout |

### 2.6 Color tokens (canvas groups)

Reuse graph analytical colors ([[03]] §5.1):

| Token | Hex | Visual meaning |
|-------|-----|----------------|
| Law | `#ff6b35` | Genesis / envelope |
| Arch/Evidence | `#10b981` | UXA / UXI |
| Meta/Hub | `#3b82f6` | MOCs / Home / KG |
| Product | `#f59e0b` | Features / Product |
| Build | `#8b5cf6` | Eng / Native (graph-only purple) |
| Design | `#ec4899` | Design |
| Ops | `#6b7280` | Memory / prompts / bugs |
| Program | `#14b8a6` | Living roadmap programs |
| Expr | `#a78bfa` | Constitution / Governance / Interaction |
| Cold | `#374151` | Archive (rarely on living maps) |
| Decision | `#eab308` | ADRs / Founder certs (map accent) |
| Risk | `#ef4444` | Blockers / ceilings (sparingly) |

Product UI palette lock unchanged — these are **map chrome**.

### 2.7 Budgets (anti-sprawl)

| Class | Max living canvases | Rule |
|-------|--------------------:|------|
| **Core (P0)** | **5** | Always maintained |
| **Standard (P1)** | **+6** | Create when domain active |
| **Optional (P2)** | **+N** | One per need; prune quarterly |
| Feature-level canvases | **0 default** | Use Feature map template only for complex systems; prefer Feature MOC |
| Excalidraw | Unlimited drafts | Must not be cited as architecture SoT |

**Automation v1 said ~3 canvases** — that remains the **minimum viable** set (KOS Clusters + Roadmap Spine + one more). This spec expands the **catalog**; impl may still ship Core-5 first.

### 2.8 Lifecycle

| Status | Meaning |
|--------|---------|
| `living` | Maintained; linked from Visual-Maps-Index |
| `draft` | Experiments / Excalidraw |
| `superseded` | Card points to replacement; file archived or cold |
| `frozen-cite` | Map only cites frozen INDEX — map itself stays living |

Update trigger: program publish, cluster redesign, launch posture change, quarterly prune.

### 2.9 Plugin posture

| Plugin | Status in design |
|--------|------------------|
| Core Canvas | Enable when first Core map created |
| Excalidraw | Optional P3 — Experiments only |
| Advanced Canvas / community | Defer — avoid dependency |

---

## 3. Map catalog overview

| Map ID | Name | Class | Primary audience |
|--------|------|-------|------------------|
| KM-INDEX | Visual Maps Index (md) | Lobby | All |
| KM-KOS | Knowledge OS Clusters | Core · Knowledge Map | Founder · Agents |
| KM-PROG-SPINE | Program / Roadmap Spine | Core · Roadmap | Founder |
| KM-DEP-LAUNCH | Launch / Ship Dependencies | Core · Dependency | Founder · Eng |
| KM-ARCH-CONSUME | Architecture Consumption | Core · Architecture | Design · Eng · Product |
| KM-FOUNDER | Founder Cockpit Map | Core · Founder | Founder |
| KM-FEAT-SYS | Feature System Map | Standard · Feature | Product · Eng |
| KM-DEC | Decision / ADR Map | Standard · Decision | Founder |
| KM-LEARN | Learning / Onboarding Map | Standard · Learning | New agents · Founder |
| KM-MONOREPO | Monorepo Client Map | Standard · Architecture | Eng |
| KM-AGENT | Multi-Agent Lanes Map | Optional · Founder/AI | Multi-runtime days |
| KM-GRAPH-LEGEND | Graph Legend Spatial | Optional | Graph hygiene |
| KM-PROG-\* | Per-program maps | Optional | Active program only |

---

## 4. Knowledge Maps

**Purpose:** Teach “what the vault is” as epistemic layers + graph clusters.

### 4.1 KM-KOS — Knowledge OS Clusters (Core)

| Field | Spec |
|-------|------|
| **Story** | C-META center → C-LAW / C-EXPR / C-ARCH / C-PROG / C-PROD / C-BUILD / C-DESIGN / C-OPS; C-COLD dimmed or off-canvas |
| **Cards** | Home · KG · Genesis MOC (envelope) · domain MOCs · UXA INDEX · UXI INDEX · Roadmap MOC · Eng MOC · Product MOC · Context |
| **Not on map** | Individual Genesis deep files; Archive dumps |
| **Pairs with** | GV-HUB-RING · GV-DEFAULT · Graph-Legend note |
| **Update when** | New H1 MOC; cluster ID change |

### 4.2 Knowledge Map rules

1. Label groups with cluster IDs (`C-LAW`…) from [[03]].  
2. Bridges only along allowed adjacency.  
3. Envelope card visually distinct (Meta blue) sitting *beside* Law orange mass — not inside Genesis folder rewrite.  

### 4.3 Optional KM-GRAPH-LEGEND

Spatial twin of Graph-Legend prose: color chips + “what GV-DEFAULT hides.” One screen. Optional if KM-KOS legend suffices.

---

## 5. Program maps

**Purpose:** Show program packages as nodes with status — not task boards.

### 5.1 KM-PROG-SPINE — Publication / Program Spine (Core)

| Field | Spec |
|-------|------|
| **Story** | Left→right: Program 0 → UX Intelligence → UX Architecture → Program V1 → (future Design System / Motion / Eng programs) |
| **Cards** | Each program `00_INDEX` · Publication / Completion records · Operational-Priorities · active Program V1 specs folder |
| **Status chips** | living / frozen / design-complete / impl-none (text labels on groups) |
| **Edges** | E-sequence (thick); cite edges to Genesis MOC (dashed) |
| **Update when** | New program published or V1 phase authorized |

### 5.2 KM-PROG-\* — Per-program maps (Optional)

Create **only** for active complex programs (e.g. Program V1):

| Card groups | Content |
|-------------|---------|
| Inputs | Audit · constraints |
| Design artifacts | `01`…`11` specs as note cards |
| Gates | Founder accept / authorize phases |
| Non-goals | Genesis untouched · no impl |

**Budget:** At most **one** active per-program canvas at a time unless Founder expands.

### 5.3 Program map anti-patterns

- Duplicating entire Program 0 checklist as sticky notes (use Tasks / Daily Ops)  
- Editing frozen program internals via canvas  

---

## 6. Architecture maps

**Purpose:** Show how expression architecture is **consumed** — not redraw P9/UXA.

### 6.1 KM-ARCH-CONSUME — Architecture Consumption (Core)

| Field | Spec |
|-------|------|
| **Story** | Genesis P9 (via envelope) → UXA Publication → downstream Design / Motion / Eng / Native / Product Features |
| **Cards** | Genesis MOC · UXA `00_INDEX` · `95_Publication_Record` · UXI INDEX · Design MOC · Eng MOC · Native WORKFLOW · sample Feature MOCs |
| **Ceilings callout** | `/m` capture-only · palette lock · navbar split (Risk-colored text cards) |
| **Forbidden** | Recreating flow diagrams that belong inside frozen UXA |

### 6.2 KM-MONOREPO — Three Clients (Standard)

| Field | Spec |
|-------|------|
| **Story** | Web · Capacitor `/m` · Native V2 as separate lanes sharing Auth/API/DB |
| **Cards** | Monorepo note · frontend · mobile paths · native-android · server · Deploy |
| **Edges** | Shared backend (solid); “never mix commit” warnings (red labels) |
| **Pairs with** | L-WEB / L-MOBILE / L-NATIVE in [[10_Agent_Workspace]] |

### 6.3 Architecture map discipline

| Do | Don’t |
|----|-------|
| Link Publication Record | Copy frozen phase audits onto canvas |
| Show consumer → INDEX | Invent new IA on canvas |
| Cite envelope for law | Deep-link 50 Genesis files |

---

## 7. Dependency maps

**Purpose:** Make “what blocks what” spatial for ship / build.

### 7.1 KM-DEP-LAUNCH — Launch Dependencies (Core)

| Field | Spec |
|-------|------|
| **Story** | Blockers → Program 0 / LC checklist → Waitlist → Prod env (GA4/Sentry) → Tester onboarding → Go-live |
| **Cards** | Home blockers · Program 0 INDEX · Operational-Priorities · Launch-related Feature notes · Deploy docs |
| **Edges** | Hard dependency (thick); soft (dotted) |
| **Update** | When Home blockers or launch posture changes |

### 7.2 Other dependency map patterns (Optional)

| Variant | When |
|---------|------|
| Feature ↔ API ↔ DB | Complex feature shipping |
| Native ↔ mobile API | Native track |
| Vault KOS G0→G3 / M0→M4 | Program V1 impl authorization |

**Rule:** Prefer one Launch dep map globally; feature deps live on Feature maps or Mermaid in Feature MOC.

---

## 8. Roadmaps

**Purpose:** Time / sequence orientation — distinct from Kanban execution.

### 8.1 Relationship

| Artifact | Job |
|----------|-----|
| KM-PROG-SPINE | Sequence of **publications / programs** |
| Roadmap MOC + Dashboard | Lists + status queries |
| Launch Kanban (Automation) | Execution cards |
| KM-DEP-LAUNCH | Dependency geometry |

Do **not** maintain three conflicting timelines. Spine canvas = narrative sequence; Dashboard = query; Kanban = tasks.

### 8.2 Roadmap visual rules

1. Time flows left→right or top→bottom consistently.  
2. Frozen packs marked green (done/published), living teal.  
3. “Now” marker = group highlight tied to Current-Context active program.  
4. No dates invented on canvas — dates live in notes.

---

## 9. Learning maps

**Purpose:** Onboard Founder (refresh) and agents (first session) without reading 600 notes.

### 9.1 KM-LEARN — Vault Learning Path (Standard)

| Field | Spec |
|-------|------|
| **Story** | Boot path: Home → Context → Genesis MOC → Roadmap spine → Eng/Product MOC → Touch |
| **Cards** | Same as AI Workspace boot ([[09]]) + Founder Workspace pins ([[08]]) |
| **Branches** | “If law question” · “If feature build” · “If launch” · “If vault hygiene” |
| **Audience** | New chat agents; Founder teaching |
| **Update** | When boot contract changes |

### 9.2 Learning map vs AI Workspace

KM-LEARN is the **spatial twin** of [[09_AI_Workspace]] boot + search ladder. Prose remains normative; map is mnemonic.

---

## 10. Feature maps

**Purpose:** Show a feature as a small system — MOC hub + eng + arch cites.

### 10.1 Default: no per-feature canvas

Most features: **Feature MOC + local graph** enough.

### 10.2 KM-FEAT-SYS — Cross-feature System Map (Standard)

One vault-level map:

| Field | Spec |
|-------|------|
| **Story** | Features Index hub with spokes to major entities (Auth, Calendar, Discipline, Goals, Journal, Notes, Reports, Sports, Waitlist, Mobile `/m`, Native…) |
| **Cards** | Features Index · Product MOC · each Feature MOC (not every changelog) |
| **Edges** | Peer related (max sparse); bridges to UXA flows where cited |
| **Ceilings** | Mobile-touching features dashed to `/m` ceiling card |

### 10.3 Optional per-feature canvas

Only if Feature MOC declares `complexity: high` (future FM) **and** Founder asks:

- Groups: UX cite · API · DB · Frontend · Native · Changelog  
- Still link UXA INDEX — do not redraw frozen flows  

**Budget:** ≤3 living per-feature canvases vault-wide.

---

## 11. Decision maps

**Purpose:** See decision landscape — open vs accepted vs constitutional impact.

### 11.1 KM-DEC — Decisions Map (Standard)

| Field | Spec |
|-------|------|
| **Story** | Founder / Decisions index center → ADR cards clustered by status (proposed / accepted / superseded) |
| **Cards** | `10_DECISIONS` notes · Founder certificates · link to Genesis MOC if constitutional |
| **Edges** | ADR → affected Feature/Eng (dashed cite) |
| **Pairs with** | Decisions Dashboard ([[04]]) |
| **Not** | Full ADR body on canvas |

### 11.2 Decision map hygiene

Superseded ADRs dimmed or in “Cold decisions” group. Open/proposed near center for weekly review ([[08]]).

---

## 12. Founder maps

**Purpose:** Cockpit spatialization — minimum-click Founder Workspace as a map.

### 12.1 KM-FOUNDER — Founder Cockpit (Core)

| Field | Spec |
|-------|------|
| **Story** | Center: Current-Context · around: Home · Executive · Daily Ops · KG · Genesis MOC · Workspace Index · Active Program · Capture/Search labels |
| **Cards** | Pins from [[08]] (≤10) as note cards |
| **Edges** | Boot arrows (Context→Executive→Touch) |
| **Modes** | Side groups: Ops · Law · Ship UX · Build · Decide · Hygiene (mode chips as groups linking surfaces) |
| **Update** | When pin set or active program changes |

### 12.2 Optional KM-AGENT — Multi-Agent Lanes

Spatial twin of [[10_Agent_Workspace]] lanes:

- Groups: L-WEB · L-MOBILE · L-NATIVE · L-VAULT-OPS · L-API  
- Cards: Agent lock owners (text) · Monorepo note  
- Use only on multi-runtime weeks  

### 12.3 Founder map rule

KM-FOUNDER must not become a second Current-Context. Context note remains SoT for Today/Next/Do not/Touch.

---

## 13. Visual-Maps-Index (lobby)

Living markdown (not canvas):

| Section | Content |
|---------|---------|
| Core maps | Links to 5 Core canvases |
| Standard | Feature / Decision / Learning / Monorepo |
| Optional | Active only |
| How to read | VK principles + “maps ≠ SoT” |
| Related | KG · Graph-Legend · Dashboards Index · Founder Workspace |

Linked from: Home · Knowledge-Graph MOC · Founder Workspace Index · AI Dashboard (optional).

---

## 14. Maintenance & quality

### 14.1 Definition of done (per map)

- [ ] Title + Derived banner  
- [ ] Legend  
- [ ] All primary cards are real notes (or labeled intentionally)  
- [ ] Linked from Visual-Maps-Index  
- [ ] No Genesis body pasted  
- [ ] No frozen IA redraw  
- [ ] Colors match token table  
- [ ] Exit links to Home/Context/KG  

### 14.2 Quarterly prune

1. Remove optional maps unused 90 days  
2. Fix broken note cards  
3. Align spine with Roadmap MOC  
4. Confirm Launch dep map vs Home blockers  

### 14.3 Agent usage

Agents: prefer **opening linked notes** from map cards over treating canvas JSON as SoT. Boot still Home→Context ([[09]]). Maps are accelerators after boot.

---

## 15. Phased rollout (design — do not execute)

| Phase | Maps | Notes |
|------:|------|-------|
| V0 | Visual-Maps-Index (md) + enable Canvas plugin | Lobby only |
| V1 | KM-KOS · KM-PROG-SPINE · KM-FOUNDER | Minimum teaching set |
| V2 | KM-ARCH-CONSUME · KM-DEP-LAUNCH | Architecture + launch |
| V3 | KM-FEAT-SYS · KM-DEC · KM-LEARN · KM-MONOREPO | Standard set |
| V4 | Optional KM-AGENT · KM-PROG-V1 · per-feature (rare) | As needed |
| V5 | Excalidraw experiments policy enforced | Draft lane |

Aligns with Automation Phase 2.2 (Canvas) but expands catalog beyond two canvases.

---

## 16. Risks

| Risk | Mitigation |
|------|------------|
| Canvas sprawl | Budgets · quarterly prune · Index gate |
| Shadow architecture | VK6 · cite Publication only |
| Stale “Now” marker | Tie to Context; weekly Founder glance |
| Color ≠ graph colors | Shared token table |
| Agents cite canvas as law | AI Workspace: maps after boot; notes win |
| Duplicate Roadmap timelines | §8.1 ownership split |

---

## 17. Explicit non-actions (this deliverable)

- No `.canvas` files created  
- No Canvas plugin toggled  
- No Excalidraw install  
- No Genesis / frozen edits  
- No commits  

---

## 18. Authority statement

Visual Knowledge Maps are **operations / derived navigation**. They cannot override Genesis, frozen UX Architecture / Intelligence, or living Feature SoT. Beauty never justifies inventing law on a canvas.

---

## 19. Closeout

| Item | Status |
|------|--------|
| Visual Knowledge Maps design | **COMPLETE** (design) |
| Implementation | **NONE** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend Core-5 catalog → authorize **V0–V1** (Index + KOS + Spine + Founder maps) with Automation Canvas enablement.

---

**Stop.**
