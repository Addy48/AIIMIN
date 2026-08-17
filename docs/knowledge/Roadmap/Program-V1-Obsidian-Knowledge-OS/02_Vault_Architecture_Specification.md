---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/01_Vault_Deep_Audit_Report
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: vault-architecture-specification
implementation: none
genesis_touch: forbidden
frozen_moves: forbidden-unless-necessary
---

# Program V1 — Vault Architecture Specification

**Knowledge Operating System (KOS) design for `docs/knowledge/`**

| Field | Value |
|-------|-------|
| Date | 2026-07-25 |
| Based on | [[01_Vault_Deep_Audit_Report]] (composite **5.3 / 10**) |
| Mode | **Specification only — zero implementation** |
| Genesis | **Do not change** (no edit, rename, move, or delete inside `Genesis/`) |
| Frozen packs | **Do not move** unless a recommendation marks *necessary* and Founder ADR approves |

---

## 1. Purpose

Redesign the vault from “foldered document dump with strong law” into a **Knowledge Operating System**: layered authority, navigable hubs, queryable metadata, intentional graph, and operational dashboards — without mutating constitutional or frozen corpora.

Target after full execution (future work): composite vault health **≥ 7.5 / 10**.

---

## 2. Hard constraints (non-negotiable)

| ID | Constraint | Consequence for this design |
|----|------------|------------------------------|
| C1 | **Genesis immutable** | No recommendations may require editing, moving, or renaming files under `Genesis/`. Orphan/density gaps inside Genesis are solved by **external envelope** (MOCs, hubs, Home, Roadmap spines) and optional later Founder ADR — not by this spec’s default migration. |
| C2 | **Frozen stay put** | UX Architecture v1.0, UX Intelligence v1.0, Stage A vault freeze certificates, and other `lifecycle: frozen` / FROZEN packs remain at current paths. Prefer **inbound links from living notes**; do not relocate folders. |
| C3 | **No Stage B rename now** | Numbered `01_`–`17_` folders remain Stage A shape. Semantic rename is deferred ADR, not part of KOS v1. |
| C4 | **Authority ladder** | Genesis > Constitution/IA expression > Engineering > Implementation > Roadmap/ops. Nothing sets `can_override_genesis: true`. |
| C5 | **Spec ≠ implement** | This document designs. Execution requires Founder authorization and a separate implementation sprint. |

---

## 3. Target operating model

```text
┌─────────────────────────────────────────────────────────────┐
│ L0  ENTRY     Home · Current-Context · Knowledge-Graph MOC  │
├─────────────────────────────────────────────────────────────┤
│ L1  LAW       Genesis (immutable nucleus)                   │
│ L2  EXPRESSION Constitution · Interaction · Governance hubs │
│ L3  PROGRAM   Roadmap frozen packs + living programs        │
│ L4  PRODUCT   Product · Features · Design · Decisions       │
│ L5  BUILD     Architecture · Eng · DB · API · Native · AI   │
│ L6  OPS       Memory · Bugs · Sprints · Deploy · Docs       │
│ L7  COLD      Archive · 99_ARCHIVE · templates (non-graph)  │
└─────────────────────────────────────────────────────────────┘
         ↑ navigation / hubs / metadata / graph / dashboards
```

**Principle:** Folders store; **layers operate**. Physical tree may stay dual (numbered + hubs). Logical KOS is six cross-cutting layer systems below.

---

## 4. Knowledge Layers

Knowledge Layers classify **what a note is for** (epistemic role), independent of folder path.

### 4.1 Layer catalog

| Layer ID | Name | Role | Primary homes (unchanged paths) | Lifecycle default |
|----------|------|------|----------------------------------|-------------------|
| KL-LAW | Law | Immutable constitutional corpus | `Genesis/` | frozen / sealed |
| KL-EXPR | Expression | Restatements, hubs, glossaries that **cite** law | `Constitution/`, `Governance/`, `Interaction Architecture/`, `Glossary/`, Rule/Invariant indexes | living (must not invent law) |
| KL-EVID | Evidence | Discovery / intelligence packages (read-only product reality) | `Roadmap/UX-Intelligence/` | frozen |
| KL-ARCH | Architecture | UX / system architecture that expresses P9 under DH | `Roadmap/UX-Architecture/` | frozen (v1.0) |
| KL-PROG | Program | Living roadmaps, readiness, KOS itself | `Roadmap/*` (non-frozen), `Operations/` | living |
| KL-PROD | Product | Pricing, launch, feature entities | `01_PRODUCT/`, `09_FEATURES/` | living |
| KL-BUILD | Build | Eng maps, schema notes, API, frontend, AI, native | `02_`–`08_`, `17_NATIVE_APP_V2/`, `04_API/`, `03_DATABASE/` | living |
| KL-OPS | Operations | Context, prompts, bugs, sprints, deploy runbooks | `15_MEMORY/`, `14_PROMPTS/`, `11_BUGS/`, `07_DEPLOYMENT/`, `16_DOCUMENTATION/` | living |
| KL-DEC | Decision | ADRs, Founder certificates | `10_DECISIONS/`, `Founder/` | living / frozen by note |
| KL-COLD | Cold storage | Superseded, pre-Brain-OS, provenance | `Archive/`, `99_ARCHIVE/` | archive |
| KL-META | Meta | MOCs, templates, manifest, dashboards | `Maps of Content/`, `_templates/`, `_manifest.json`, future `Dashboards/` | living |

### 4.2 Recommendations — Knowledge Layers

#### REC-KL-01 — Assign `knowledge_layer` to every living + frozen note (external of Genesis optional-FM policy)

- **Reason:** Audit: 39% notes lack reliable FM; Dataview and dashboards cannot classify corpus. Layer ID is the primary query key for KOS.
- **Impact:** Enables all Dashboard Layers; cuts mis-navigation; supports orphan SLOs by layer.
- **Risk:** FM noise on sealed Genesis files if applied inside Genesis (violates C1).
- **Migration Strategy:** (1) Backfill `knowledge_layer` on all notes **outside** `Genesis/`. (2) For Genesis: **do not edit**; treat path `Genesis/**` as implied `KL-LAW` in dashboards via path rule. (3) Document path→layer mapping in this spec + Dashboard note.
- **Dependencies:** REC-MD-01 (frontmatter schema); Dataview or equivalent query surface.

#### REC-KL-02 — Publish path→layer mapping table as living ops note

- **Reason:** Dual folder taxonomy (numbered + hubs) confuses agents; mapping is cheaper than Stage B rename.
- **Impact:** Agent load order stays short; Stage B can stay deferred.
- **Risk:** Mapping drifts if new top-level folders appear without update.
- **Migration Strategy:** Add `Roadmap/Program-V1-…/03_Path_Layer_Map.md` (future impl) linked from Home + Knowledge-Graph MOC; update on any new root folder.
- **Dependencies:** REC-NAV-01; Home edit (ops, allowed).

#### REC-KL-03 — Cold-storage policy: single logical archive, two physical roots OK

- **Reason:** Audit: `Archive/` + `99_ARCHIVE/` duplicate mental model.
- **Impact:** Clearer KL-COLD; graph filters exclude cold by default.
- **Risk:** Moving files breaks links; **unnecessary** under C2/C3 if only policy needed.
- **Migration Strategy:** **Do not merge folders now.** Designate: `99_ARCHIVE/` = pre-Brain-OS dump; `Archive/` = post-migration superseded. Document in Path Layer Map. Optional later consolidate only with Founder ADR + link rewrite.
- **Dependencies:** REC-GR-04 (graph exclude cold).

#### REC-KL-04 — Deduplicate prompts via canonical pointer (no Genesis delete)

- **Reason:** Audit: `14_PROMPTS/*` vs Genesis P2 supporting copies.
- **Impact:** Single SoT for living agent prompts; less collision.
- **Risk:** Touching Genesis copies violates C1.
- **Migration Strategy:** Living SoT = `14_PROMPTS/`. Add banner on living prompts: “Genesis copy is historical supporting — do not edit Genesis.” Do **not** delete or stub inside Genesis. Optional Archive note listing duplicate basenames.
- **Dependencies:** REC-MD-03 (tags/type); Engineering/Product MOCs.

#### REC-KL-05 — Feature notes inherit KL-PROD; Architecture notes cite KL-ARCH / KL-LAW

- **Reason:** Clusters (Features ↔ UXA ↔ Genesis) poorly bridged.
- **Impact:** Authority-safe cross-links; eng/product discoverability.
- **Risk:** Features inventing IA without cite → authority leak.
- **Migration Strategy:** Template requires `derived_from` / wikilink to UXA or Genesis MOC; lint later.
- **Dependencies:** REC-HB-03; feature template update.

---

## 5. Navigation Layers

Navigation Layers define **how humans and agents move**, not what notes mean.

### 5.1 Layer catalog

| Nav ID | Name | Depth | Contract |
|--------|------|-------|----------|
| NV-0 | Boot | 0 | Always: `00_HOME` → `15_MEMORY/Current-Context` |
| NV-1 | Spine | 1 | Home authority table + Genesis MOC + Roadmap MOC + Engineering MOC |
| NV-2 | Hub ring | 2 | Domain MOCs + Constitution/Interaction/Governance/Research/Founder hubs |
| NV-3 | Index | 3 | Package `00_INDEX`, phase indexes, Feature Index, manifests |
| NV-4 | Leaf | 4+ | Entity notes, audits, certificates, tables, endpoints |
| NV-X | Crosswalk | any | Bidirectional bridges: Law↔Expression↔Architecture↔Feature↔Build |

**SLO (target):** Every **living** leaf reachable in ≤4 hops from Home. Every **frozen pack** reachable in ≤3 hops. Genesis leaves may remain deep internally; **envelope** guarantees pack entrypoints ≤2 hops.

### 5.2 Recommendations — Navigation Layers

#### REC-NAV-01 — Canonical boot contract (already partial; harden)

- **Reason:** Audit discoverability 6.5; agents sometimes skip Context.
- **Impact:** Token discipline; correct “today” focus.
- **Risk:** Home bloat if every program listed.
- **Migration Strategy:** Keep Home slim: Active programs (max 5) + Authority table + links to MOCs. Detail stays in Current-Context.
- **Dependencies:** Current-Context hygiene (ops).

#### REC-NAV-02 — Knowledge spine note (living) listing NV-0…NV-4

- **Reason:** Dual taxonomy needs one navigation story without Stage B.
- **Impact:** New agents/humans learn vault in one screen.
- **Risk:** Duplicate of Home — mitigate by Home linking spine, spine not repeating product blockers.
- **Migration Strategy:** Create `Maps of Content/00_Navigation-Spine.md` (impl later); link from Home + `00_Knowledge-Graph`.
- **Dependencies:** REC-HB-01.

#### REC-NAV-03 — External Genesis envelope (no Genesis edits)

- **Reason:** Audit: Genesis ~197 orphans; C1 forbids fixing via internal links.
- **Impact:** Law discoverability without mutating nucleus.
- **Risk:** Envelope becomes stale vs Genesis tree growth.
- **Migration Strategy:** Expand **only** `Maps of Content/Genesis.md` + Constitution/Interaction/Governance hubs to list all P1–P9 entry indexes and freeze certificates **by path**. Quarterly “envelope sync” checklist. No writes under `Genesis/`.
- **Dependencies:** REC-HB-02; Founder review of certificate list.

#### REC-NAV-04 — Roadmap spine: Program 0 → UX Intelligence → UX Architecture → Program V1

- **Reason:** Sequential programs hard to see as chain; audit Top 21.
- **Impact:** Roadmap discoverability; onboarding of downstream Design/Motion/Eng.
- **Risk:** Implies false dependency that blocks parallel work — label “sequence of publication,” not “serial lock.”
- **Migration Strategy:** Update `Maps of Content/Roadmap.md` with ordered spine + status badges; link each `00_INDEX` / Publication Record. **Do not move** frozen folders.
- **Dependencies:** Existing Roadmap MOC; REC-HB-04.

#### REC-NAV-05 — Engineering depth expansion (content, not folder move)

- **Reason:** Audit eng discoverability 4.0; Frontend/AI = 1 note each.
- **Impact:** Build layer usable for implementation programs.
- **Risk:** Docs drift from code — require `last_reviewed` + file pointers.
- **Migration Strategy:** Add notes under existing `05_FRONTEND/`, `06_AI/`, `07_DEPLOYMENT/`, `04_API/`, `03_DATABASE/` (new leaves OK). Link from Engineering MOC. No Stage B.
- **Dependencies:** REC-HB-05; eng templates.

#### REC-NAV-06 — Dead-end SLO for living notes

- **Reason:** Audit: ~60% zero outbound.
- **Impact:** Graph density; fewer traps.
- **Risk:** Spammy “see also” links of low quality.
- **Migration Strategy:** Rule: every new/edited **living** note must include Parent (MOC/index) + Related (≥1). Exempt: KL-COLD, KL-LAW (Genesis), pure certificates already linked from index. Lint script later.
- **Dependencies:** REC-MD-01; REC-GR-01.

---

## 6. Hub Layers

Hubs are **high fan-out / high fan-in** notes that stabilize the graph.

### 6.1 Hub taxonomy

| Hub tier | Examples | Duty |
|----------|----------|------|
| H0 Master | `00_HOME`, `Maps of Content/00_Knowledge-Graph` | Global orientation |
| H1 Domain MOC | Genesis, Roadmap, Engineering, Product, Design, Architecture, Research, Founder, Interaction-Architecture | Domain fan-out |
| H2 Structural hub | `Constitution/00_*`, `Governance/00_*`, `Interaction Architecture/00_*`, `Founder/*` | Expression / founder ops |
| H3 Package index | `Roadmap/UX-Architecture/00_INDEX`, Program indexes | Pack navigation (frozen stay) |
| H4 Entity MOC | `09_FEATURES/<Entity>/` MOCs | Feature fan-out |

### 6.2 Recommendations — Hub Layers

#### REC-HB-01 — Promote Knowledge-Graph MOC to H0 peer of Home

- **Reason:** Audit: only ~2 inbound; underused as graph legend.
- **Impact:** Central star for MOC ring; dashboard entry.
- **Risk:** Competing with Home — Home stays authority+blockers; KG = map of maps.
- **Migration Strategy:** Add inbound from Home + every domain MOC; KG lists all MOCs + hub folders + dashboard links.
- **Dependencies:** REC-NAV-02; REC-DB-01.

#### REC-HB-02 — Genesis MOC as sole editable law gateway

- **Reason:** C1; envelope pattern.
- **Impact:** One place Founder maintains law navigation.
- **Risk:** MOC grows huge — use tables by P1–P9, not prose dumps.
- **Migration Strategy:** Structured tables: Entrypoint / Certificate / Related Expression hub. Sync checklist quarterly.
- **Dependencies:** REC-NAV-03.

#### REC-HB-03 — Feature hub completeness

- **Reason:** Features weakly tied to Architecture/Intelligence.
- **Impact:** Product↔Architecture cluster bridge.
- **Risk:** Wrong cites invent requirements.
- **Migration Strategy:** Each Feature MOC links: Product MOC, related UXA flow (if any), `/m` ceiling if mobile-touching, Eng notes. Expand Features Index.
- **Dependencies:** REC-KL-05; `_manifest.json`.

#### REC-HB-04 — Frozen pack hubs: link **to** indexes, never relocate

- **Reason:** C2; frozen discoverability already 7.5 — preserve.
- **Impact:** Stable URLs for agents; publication remains SoT.
- **Risk:** Living notes drift from frozen text — stamp `derived_from` + “Architecture does not replace P9.”
- **Migration Strategy:** Roadmap MOC + Interaction MOC + Home already cite; strengthen Founder MOC with freeze certificate list. **No folder moves.**
- **Dependencies:** REC-NAV-04.

#### REC-HB-05 — Engineering MOC becomes H1 build router

- **Reason:** Thin eng folders; Native healthier than web eng docs.
- **Impact:** Eng discoverability toward 7+.
- **Risk:** MOC lists vapor notes — create stubs with `status: planned` or write real content.
- **Migration Strategy:** Engineering MOC sections: Web · API · DB · AI · Deploy · Native · Monorepo. Each row → note or “TBD stub.”
- **Dependencies:** REC-NAV-05.

#### REC-HB-06 — Founder / Research / Glossary / Rule / Invariant hub pass

- **Reason:** Audit: Founder MOC thin; Glossary/Rule/Invariant weak singles.
- **Impact:** Hub coverage score lift.
- **Risk:** Fake glossaries inventing P9 terms.
- **Migration Strategy:** Expand Founder MOC outbound; Glossary/Rule/Invariant become true indexes listing notes **or** clearly point at Genesis P5/P7/P9 entrypoints without copying law.
- **Dependencies:** REC-HB-02; expression discipline.

#### REC-HB-07 — Dual-archive README hubs

- **Reason:** Cold storage confusion.
- **Impact:** Accidental use of superseded Design-Bible reduced.
- **Risk:** None if README-only.
- **Migration Strategy:** Ensure each archive root has README stating purpose + “do not cite as living SoT.” Link from KG MOC under KL-COLD.
- **Dependencies:** REC-KL-03.

---

## 7. Metadata Layers

Metadata Layers make the vault **machine-queryable**.

### 7.1 Schema (KOS v1)

Required on all notes **outside** `Genesis/` (and recommended on new living notes):

```yaml
---
authority: constitutional | expression | architecture | operations | engineering | product | research | founder
derived_from: <wikilink or Genesis path string>
status: active | draft | deprecated | superseded
owner: founder | eng | product | …
lifecycle: living | frozen | archive
last_reviewed: YYYY-MM-DD
can_override_genesis: false
knowledge_layer: KL-*   # see §4
nav_role: boot | spine | hub | index | leaf | crosswalk | dashboard   # optional
---
```

Optional:

```yaml
tags:
  - type/moc
  - domain/roadmap
  - status/frozen
program: <id>
artifact: <id>
```

**Genesis policy:** Path implies `knowledge_layer: KL-LAW`. Do not bulk-edit Genesis FM under C1. Dashboards use `file.path` filters.

### 7.2 Tag taxonomy (closed set v1)

| Prefix | Values (v1) |
|--------|-------------|
| `type/` | `moc`, `hub`, `index`, `feature`, `adr`, `certificate`, `dashboard`, `runbook`, `prompt`, `changelog` |
| `domain/` | `genesis`, `roadmap`, `product`, `engineering`, `design`, `native`, `ops`, `research` |
| `status/` | `living`, `frozen`, `archive`, `draft` |

**Ban:** Inline `#` + hex colors. Colors live in `` `code` `` or YAML only.

### 7.3 Recommendations — Metadata Layers

#### REC-MD-01 — Frontmatter backfill outside Genesis

- **Reason:** Audit metadata 5.5; 55% authority-ish only.
- **Impact:** Dataview readiness; CI lint possible.
- **Risk:** Wrong `authority` labels; mitigate with path defaults table.
- **Migration Strategy:** Scripted backfill by folder defaults; human review sample 10%. Skip `Genesis/**`. Skip binary/assets.
- **Dependencies:** Path→layer map; template update.

#### REC-MD-02 — Templates enforce schema

- **Reason:** New notes recreate debt.
- **Impact:** Stops regression.
- **Risk:** Template friction — keep fields minimal required set.
- **Migration Strategy:** Update `_templates/*` + add `moc-template`, `dashboard-template`. Obsidian templates path already configured.
- **Dependencies:** REC-MD-01.

#### REC-MD-03 — Real tags; neutralize hex false tags

- **Reason:** Audit tags score 2.0; hex ``#ff6b35`` noise.
- **Impact:** Tag pane usable; Dataview `contains(tags,…)`.
- **Risk:** Mass search-replace of colors could break Palette docs — only wrap hex in backticks / code fences.
- **Migration Strategy:** (1) Introduce YAML tags on hubs/MOCs first. (2) Pass to escape bare hex in living non-Genesis notes. (3) **Do not** edit Genesis Palette supporting files.
- **Dependencies:** Design MOC; Palette living note in `08_DESIGN/`.

#### REC-MD-04 — Basename collision register

- **Reason:** 74 duplicate basenames; backlink ambiguity.
- **Impact:** Reliable `[[path/qualified]]` linking.
- **Risk:** Renames break unqualified links — prefer **path-qualified wikilinks** over renames inside frozen/Genesis.
- **Migration Strategy:** Publish collision register; require path-qualified links for colliding stems; rename **only** living non-frozen duplicates when safe. Never rename Genesis or frozen UXA/UXI files.
- **Dependencies:** REC-GR-02.

#### REC-MD-05 — `_manifest.json` as Feature metadata mirror

- **Reason:** Manifest already entity index; underused for KOS.
- **Impact:** Feature completeness checks.
- **Risk:** Manifest/code drift.
- **Migration Strategy:** Document fields; Dataview or script compares `09_FEATURES` folders ↔ manifest keys.
- **Dependencies:** REC-HB-03.

#### REC-MD-06 — CI / lint hooks (optional later)

- **Reason:** Audit Top 70–73.
- **Impact:** Prevents score regression after KOS hardening.
- **Risk:** Noisy CI — start warn-only.
- **Migration Strategy:** Scripts: required FM keys; orphan living notes; broken wikilinks; duplicate basename warn. Not part of first human pass.
- **Dependencies:** REC-MD-01, REC-GR-01.

---

## 8. Graph Layers

Graph Layers define **edge types and density policy**.

### 8.1 Edge typology (logical)

| Edge type | Meaning | Example |
|-----------|---------|---------|
| E-parent | Leaf → index/MOC | Feature note → Feature MOC |
| E-child | Index → children | UXA `00_INDEX` → phase folders (already) |
| E-authority | Expression/Build → Law/Arch | Feature → Genesis MOC or UXA flow |
| E-sequence | Program spine | Intel → Architecture → Design System |
| E-see | Weak related | Peer features |
| E-supersedes | Living → archive | Design stub → Archive Design-Bible |
| E-freeze | Hub → certificate | Founder MOC → freeze cert |

**Density targets (living corpus only):**

| Metric | Now (approx) | Target |
|--------|-------------:|-------:|
| Edges / note | 2.2 | ≥ 4.0 |
| Living notes with ≥1 inbound | low | ≥ 95% |
| Living notes with ≥1 outbound | ~40% overall | ≥ 95% living |
| Genesis internal density | low | **unchanged** (C1); envelope covers entrypoints |

### 8.2 Cluster map (desired)

```text
[Genesis LAW] --envelope--> [Expression hubs] --cite--> [UXA / UXI frozen]
        \                        |                        |
         \                       v                        v
          \---------------> [Product / Features] <--> [Engineering / Native]
                                      |
                                      v
                              [Roadmap programs / Ops]
```

### 8.3 Recommendations — Graph Layers

#### REC-GR-01 — Living-note degree SLO

- **Reason:** Orphans 309; dead ends 367.
- **Impact:** Largest composite score lift after metadata.
- **Risk:** Low-value link spam.
- **Migration Strategy:** Batch by folder (Features, Roadmap living, Eng, MOCs). Each note: parent + one authority or peer. Exempt Genesis + cold. Frozen packs: **prefer linking from living hubs into pack `00_INDEX` / certificates** rather than editing frozen internals (C2).
- **Dependencies:** REC-NAV-06; REC-HB-*.

#### REC-GR-02 — Path-qualified wikilinks for collisions

- **Reason:** Backlink quality 5.0.
- **Impact:** Correct graph resolve in Obsidian.
- **Risk:** Longer links — acceptable.
- **Migration Strategy:** When editing a living note, upgrade ambiguous `[[Index]]`-style links. No mass rewrite inside Genesis/frozen.
- **Dependencies:** REC-MD-04.

#### REC-GR-03 — Cross-cluster bridges (authority-safe)

- **Reason:** Clusters poorly bridged.
- **Impact:** Graph clusters score; eng/product use architecture.
- **Risk:** Treating UXA as law — always label expression under P9.
- **Migration Strategy:** Standard bridge set: Features↔UXA flows; Eng↔Monorepo; Native↔UXA FL-XDEV cites; Roadmap↔Genesis MOC. Implement as MOC tables first.
- **Dependencies:** REC-HB-03, REC-HB-05, REC-NAV-04.

#### REC-GR-04 — Graph filters: exclude cold + templates

- **Reason:** Archive noise dilutes graph UX.
- **Impact:** Readable clusters.
- **Risk:** Hiding useful provenance — keep Archive reachable from KG under Cold.
- **Migration Strategy:** Document Obsidian graph filter groups by path prefix; optional `graph.json` color by `authority` once FM backfilled.
- **Dependencies:** REC-MD-01; REC-KL-03.

#### REC-GR-05 — Frozen internal orphan acceptance

- **Reason:** Many UXA phase audit notes may lack inbound; editing frozen for hygiene is optional and risky.
- **Impact:** Honest SLO; avoid unnecessary frozen edits.
- **Risk:** Auditors score orphans high — mitigate by H3 indexes listing `90_*` files **from living Roadmap MOC** or by one allowed Founder ADR to patch frozen indexes only if necessary.
- **Migration Strategy:** Default: living Roadmap/Interaction MOCs list freeze certificates + phase indexes. **Necessary move:** never. **Necessary edit:** only if Founder ADR allows index-only link lists inside frozen pack.
- **Dependencies:** C2; Founder ADR process.

#### REC-GR-06 — Broken link fix (living only)

- **Reason:** One broken target `09_FEATURES/Mobile/*` glob.
- **Impact:** Clean resolve.
- **Risk:** Low.
- **Migration Strategy:** Replace glob with concrete Feature links or Features Index in the living Intelligence note **only if** that note is considered amendable; if Intelligence is frozen evidence, fix via living errata note that points at correct paths — **do not edit frozen Intelligence unless Founder ADR**.
- **Dependencies:** C2; UX Intelligence freeze policy.

---

## 9. Dashboard Layers

Dashboards are **query views** (Dataview or generated markdown) — not another knowledge dump.

### 9.1 Dashboard catalog

| Dash ID | Name | Question answered |
|---------|------|-------------------|
| DB-HEALTH | Vault Health | Orphans, degree, FM coverage (living) |
| DB-AUTH | Authority Map | Notes by `authority` / `knowledge_layer` |
| DB-FROZEN | Frozen Registry | All frozen packs + certificates (path list) |
| DB-ROAD | Roadmap Board | Programs by status |
| DB-FEAT | Features Board | Entities, changelog freshness |
| DB-ENG | Engineering Board | Coverage gaps (Frontend/AI/Deploy…) |
| DB-ORPHAN | Orphan Queue | Living orphans prioritized |
| DB-CONTEXT | Today | Mirrors Current-Context + open blockers |

**Home rule:** Home links to dashboards; dashboards do not replace Home.

### 9.2 Recommendations — Dashboard Layers

#### REC-DB-01 — Create `Dashboards/` living folder (new, non-frozen)

- **Reason:** Dataview readiness score 2.0; zero queries today.
- **Impact:** Operational KOS surface; Founder sees vault health.
- **Risk:** Folder sprawl — keep ≤8 dashboards v1.
- **Migration Strategy:** Add `docs/knowledge/Dashboards/` with index + Dataview queries. Link from Home, KG MOC, Current-Context. **No moves** of existing packs.
- **Dependencies:** Dataview plugin (or static regenerated md via script if plugin undesired); REC-MD-01.

#### REC-DB-02 — Vault Health dashboard first

- **Reason:** Ties audit metrics to continuous ops.
- **Impact:** Composite score becomes managed KPI.
- **Risk:** Path-based Genesis “orphans” alarm falsely — exclude `Genesis/**` and cold from orphan queue.
- **Migration Strategy:** Queries: missing FM; living zero-out; living zero-in; duplicate stems register embed.
- **Dependencies:** REC-DB-01; REC-GR-01.

#### REC-DB-03 — Frozen Registry (path-based, no frozen edits)

- **Reason:** Frozen discoverability maintenance.
- **Impact:** One screen for certificates + pack roots.
- **Risk:** Manual list staleness — prefer Dataview `lifecycle: frozen` OR curated table maintained in living note.
- **Migration Strategy:** Curated table initially (UXA, UXI, Stage A certs, Program 0 freezes). Upgrade to FM query after backfill.
- **Dependencies:** REC-HB-04; REC-MD-01.

#### REC-DB-04 — Engineering coverage dashboard

- **Reason:** Eng discoverability 4.0.
- **Impact:** Makes gaps visible (1-note folders).
- **Risk:** Pressure to write empty stubs — allow `status: draft` with owner.
- **Migration Strategy:** Table of expected eng topics vs existing notes; link Engineering MOC.
- **Dependencies:** REC-HB-05; REC-NAV-05.

#### REC-DB-05 — Features + Roadmap boards

- **Reason:** Product/roadmap already relatively discoverable; dashboards lock habit.
- **Impact:** Launch ops + feature hygiene.
- **Risk:** Low.
- **Migration Strategy:** Dataview by `domain/product`, `domain/roadmap`; changelog `last_reviewed` aging.
- **Dependencies:** REC-MD-01; REC-MD-05.

#### REC-DB-06 — Dashboard ≠ Source of Truth

- **Reason:** Prevent query views from becoming parallel law.
- **Impact:** Authority hygiene.
- **Risk:** Founder edits dashboards instead of MOCs.
- **Migration Strategy:** Each dashboard header: “Derived view. Edit sources/MOCs, not this query, except curated registry tables.”
- **Dependencies:** REC-DB-01.

---

## 10. Recommendation index (all IDs)

| ID | Layer | Title | Priority |
|----|-------|-------|----------|
| REC-KL-01 | Knowledge | Path-implied Genesis; FM layers elsewhere | P0 |
| REC-KL-02 | Knowledge | Path→layer map note | P0 |
| REC-KL-03 | Knowledge | Dual-archive policy (no merge) | P1 |
| REC-KL-04 | Knowledge | Prompt canonicalization without Genesis delete | P1 |
| REC-KL-05 | Knowledge | Feature cite Architecture/Law | P1 |
| REC-NAV-01 | Navigation | Harden boot contract | P0 |
| REC-NAV-02 | Navigation | Navigation spine MOC | P0 |
| REC-NAV-03 | Navigation | Genesis external envelope | P0 |
| REC-NAV-04 | Navigation | Roadmap publication spine | P0 |
| REC-NAV-05 | Navigation | Engineering depth notes | P1 |
| REC-NAV-06 | Navigation | Living dead-end SLO | P0 |
| REC-HB-01 | Hub | Knowledge-Graph as H0 peer | P0 |
| REC-HB-02 | Hub | Genesis MOC gateway | P0 |
| REC-HB-03 | Hub | Feature hub completeness | P1 |
| REC-HB-04 | Hub | Frozen pack link-in only | P0 |
| REC-HB-05 | Hub | Engineering MOC router | P1 |
| REC-HB-06 | Hub | Founder/Glossary/Rule/Invariant | P2 |
| REC-HB-07 | Hub | Archive READMEs | P2 |
| REC-MD-01 | Metadata | FM backfill outside Genesis | P0 |
| REC-MD-02 | Metadata | Templates enforce schema | P0 |
| REC-MD-03 | Metadata | Tag taxonomy + hex escape | P1 |
| REC-MD-04 | Metadata | Basename collision register | P1 |
| REC-MD-05 | Metadata | Manifest sync | P2 |
| REC-MD-06 | Metadata | Lint/CI warn-only | P2 |
| REC-GR-01 | Graph | Living degree SLO | P0 |
| REC-GR-02 | Graph | Path-qualified links | P1 |
| REC-GR-03 | Graph | Cross-cluster bridges | P0 |
| REC-GR-04 | Graph | Exclude cold from default graph | P1 |
| REC-GR-05 | Graph | Accept frozen internal orphans | P0 |
| REC-GR-06 | Graph | Broken link / Intelligence errata | P2 |
| REC-DB-01 | Dashboard | `Dashboards/` folder | P0 |
| REC-DB-02 | Dashboard | Vault Health | P0 |
| REC-DB-03 | Dashboard | Frozen Registry | P0 |
| REC-DB-04 | Dashboard | Engineering coverage | P1 |
| REC-DB-05 | Dashboard | Features + Roadmap boards | P1 |
| REC-DB-06 | Dashboard | Dashboard anti-SoT rule | P0 |

**P0 count:** 18 · **P1:** 12 · **P2:** 6 · **Total recommendations:** 36 (each with Reason / Impact / Risk / Migration / Dependencies).

---

## 11. Phased execution map (design only — do not run yet)

| Phase | Name | Includes | Genesis touch | Frozen moves |
|------:|------|----------|---------------|--------------|
| A | Envelope + Spine | NAV-01–04, HB-01–02–04, KL-02, DB-01–03 | None | None |
| B | Metadata foundation | MD-01–02, DB-02 queries | None | None |
| C | Living graph | GR-01–03, NAV-06, HB-03–05 | None | None |
| D | Build & product depth | NAV-05, KL-04–05, DB-04–05 | None | None |
| E | Hygiene | MD-03–06, GR-04–06, HB-06–07, KL-03 | None | None only if ADR |

**Suggested success gate:** Re-run audit scoring; composite ≥ 7.0 after Phase C, ≥ 7.5 after Phase E.

---

## 12. Explicit non-goals

- Editing, moving, or renaming anything under `Genesis/`
- Relocating UX Architecture / UX Intelligence / other frozen packs
- Stage B semantic folder rename
- Replacing Genesis or P9 with UX Architecture
- Implementing Dataview/plugins in this deliverable
- Committing / pushing

---

## 13. Authority statement

This specification is **operations / Program V1**. It cannot override Genesis. Downstream implementation must keep `can_override_genesis: false` and treat frozen architecture as expression under P9 Design Hierarchy.

---

## 14. Closeout

| Item | Status |
|------|--------|
| Vault Architecture Specification | **COMPLETE** (design) |
| Implementation | **NONE** |
| Genesis | **UNTOUCHED** |
| Frozen packs | **UNMOVED** |

**Next (Founder):** Accept / amend this spec → authorize Phase A implementation sprint.
