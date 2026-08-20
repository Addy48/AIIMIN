---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: founder-workspace-dataview-spec
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Founder Workspace — Dataview Dashboard Specification v1.0

**AIIMIN Founder Workspace for Obsidian:** operational cockpit of derived views. Not law. Not a second Genesis.

| Field | Value |
|-------|-------|
| Date | 2026-07-25 |
| Parents | [[02_Vault_Architecture_Specification]] · [[03_Graph_Engineering_v1]] · [[01_Vault_Deep_Audit_Report]] |
| Mode | **Specification only — zero implementation** |
| Plugin | [Dataview](https://github.com/blacksmithgu/obsidian-dataview) (required at impl time) |
| Target folder (future) | `docs/knowledge/Dashboards/` |
| Graph role | `dashboard` ([[03_Graph_Engineering_v1#NT-DASHBOARD]]) |

---

## 1. Workspace purpose

Founder opens Obsidian to answer:

1. What is true today (ops)?
2. What is law vs expression vs frozen architecture?
3. Where is product / eng / design / AI risk?
4. What decisions are open?
5. Is the vault healthy enough to trust?

Dashboards **query and link**. They do not invent requirements. Header on every dashboard (mandatory at impl):

> **Derived view.** Edit sources, MOCs, and ADRs — not this query — except curated registry tables marked `curated: true`.

---

## 2. Hard constraints

| ID | Rule |
|----|------|
| D1 | No Dataview write into `Genesis/**` |
| D2 | No moves of frozen UX Architecture / UX Intelligence packs |
| D3 | Path filters for Genesis (`file.path`); do not require Genesis FM |
| D4 | Prefer FM fields from KOS schema when present; **fallback to path** until REC-MD-01 complete |
| D5 | Dashboards never set `can_override_genesis` |
| D6 | Max ~10 founder dashboards + 1 index (this set) — Vault Health embeds into Executive, not a separate Founder-facing product name |

---

## 3. Folder & navigation architecture (future layout)

```text
Dashboards/
  00_Founder-Workspace-Index.md          ← H0 for dashboards
  01_Executive-Dashboard.md
  02_Genesis-Dashboard.md
  03_UX-Dashboard.md
  04_Design-Dashboard.md
  05_Engineering-Dashboard.md
  06_AI-Dashboard.md
  07_Roadmap-Dashboard.md
  08_Risk-Dashboard.md
  09_Decisions-Dashboard.md
  10_Daily-Operations-Dashboard.md
  _widgets/                              ← optional embeddable query snippets (later)
```

### 3.1 Navigation contract

| From | To |
|------|-----|
| `00_HOME` | Workspace Index + Executive + Daily Ops |
| `15_MEMORY/Current-Context` | Daily Ops + Executive (active program) |
| `Maps of Content/00_Knowledge-Graph` | Workspace Index |
| `Maps of Content/Founder` | All dashboards |
| Each dashboard | Workspace Index · Executive · peer dashboards in §3.2 ring |
| Each dashboard | Domain MOC(s) it mirrors |

### 3.2 Dashboard relationship ring

```text
                    [Executive]
                   /    |     \
          [Daily Ops] [Risk] [Roadmap]
               |        |        |
          [Decisions]   +--------+
               |        |
     [Genesis] [UX] [Design] [Engineering] [AI]
           \______|______|________|________/
                      |
              [Workspace Index]
                      |
              Home · KG · Founder MOC
```

**Relationship types:**

| Relation | Meaning |
|----------|---------|
| R-drill | Executive widget → domain dashboard |
| R-source | Dashboard → MOC / INDEX / Context (SoT) |
| R-peer | Lateral nav between domain dashboards |
| R-alert | Risk / Ops surfaces items from other dashboards’ queries |
| R-law | Genesis / UX dashboards cite envelope + frozen indexes only |

---

## 4. Shared prerequisites

### 4.1 Frontmatter on every dashboard note

```yaml
---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: YYYY-MM-DD
can_override_genesis: false
knowledge_layer: KL-META
nav_role: dashboard
graph_role: dashboard
tags:
  - type/dashboard
  - domain/ops
dashboard_id: DB-EXEC   # etc.
---
```

### 4.2 Shared WHERE fragments

Use consistently (DataviewJS or DQL):

| Alias | Meaning |
|-------|---------|
| `NOT_COLD` | `!contains(file.path, "Archive") AND !contains(file.path, "99_ARCHIVE") AND !contains(file.path, "_templates")` |
| `NOT_GENESIS` | `!contains(file.path, "Genesis")` |
| `LIVING_FM` | `lifecycle != "frozen" AND lifecycle != "archive"` (when FM exists) |
| `PATH_ROAD_UXA` | `contains(file.path, "Roadmap/UX-Architecture")` |
| `PATH_ROAD_UXI` | `contains(file.path, "Roadmap/UX-Intelligence")` |

### 4.3 Widget anatomy

Each **widget** specifies:

- **ID** · **Title** · **Type** (table / list / count / callout / curated) · **Query** · **Empty state** · **Drill target** · **Depends on FM?**

### 4.4 Fallback policy

| If | Then |
|----|------|
| FM missing on living notes | Path-based LIST/TABLE still runs; show callout “FM coverage incomplete — REC-MD-01” |
| Dataview unavailable | Curated static tables only (Executive + Genesis + UX frozen registry) |
| Query returns Genesis deep orphans | Exclude from health/risk; show on Genesis Dashboard as informational only |

---

## 5. Workspace Index (`00_Founder-Workspace-Index`)

**Role:** H0 router for Founder Workspace. Not a heavy query surface.

### Widgets

| ID | Title | Type | Content |
|----|-------|------|---------|
| WX-01 | Cockpit map | curated links | All 10 dashboards |
| WX-02 | Boot | links | Home · Current-Context · Knowledge-Graph · Genesis MOC |
| WX-03 | Active program | curated / small DV | Read from Context manually until sync field exists |
| WX-04 | Plugin check | callout | “Requires Dataview enabled” |

### Queries

```dataview
TABLE dashboard_id AS ID, status, last_reviewed
FROM "Dashboards"
WHERE nav_role = "dashboard" OR contains(tags, "type/dashboard")
SORT file.name ASC
```

### Navigation / relationships

- Out: all dashboards, Home, KG, Founder MOC  
- In: Home, KG, Founder MOC, Current-Context  
- Graph: `NT-DASHBOARD` parent = this index  

---

## 6. Executive Dashboard (`01_Executive-Dashboard`)

**Question:** Founder’s one-screen company + vault state.

**Sources:** Current-Context, Home blockers, Roadmap MOC, Frozen registry, Risk rollup.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-EXEC-01 | Today | curated embed / links | Daily Ops |
| WX-EXEC-02 | Blockers | curated (from Home) | Daily Ops / Risk |
| WX-EXEC-03 | Authority strip | curated | Genesis · UX dashboards |
| WX-EXEC-04 | Program status | table | Roadmap |
| WX-EXEC-05 | Frozen packs | curated table | UX · Genesis |
| WX-EXEC-06 | Vault health KPIs | counts | Risk (vault) / Engineering |
| WX-EXEC-07 | Open decisions | list | Decisions |
| WX-EXEC-08 | Top risks | list | Risk |

### Queries

**Program status (path + FM fallback):**

```dataview
TABLE status, lifecycle, last_reviewed
FROM "Roadmap"
WHERE file.name = "00_INDEX" OR file.name = "01_Current_Status" OR contains(file.name, "Publication") OR contains(file.name, "Completion") OR contains(file.name, "Freeze")
SORT file.path ASC
```

**Open decisions:**

```dataview
LIST
FROM "10_DECISIONS"
WHERE status = "draft" OR status = "active" OR !status
SORT file.mtime DESC
LIMIT 10
```

**Vault health KPIs (DataviewJS recommended at impl):**

- Count files in vault excluding cold/templates  
- Count with `authority` field (`NOT_GENESIS`)  
- Count `lifecycle = "frozen"`  
- Count living notes with `length(file.outlinks) = 0` (exclude Genesis/cold)  

Pseudo:

```dataviewjs
// KPI cards: total living, FM coverage %, frozen count, zero-outbound living
// Exclude paths: Genesis, Archive, 99_ARCHIVE, _templates, Dashboards (optional)
```

**Empty states:** “No open decisions” · “FM backfill pending — KPIs path-only.”

### Navigation / relationships

- R-drill → all domain dashboards  
- R-source → Home, Current-Context, Roadmap MOC  
- Peer → Daily Ops, Risk  

---

## 7. Genesis Dashboard (`02_Genesis-Dashboard`)

**Question:** Is constitutional nucleus findable and correctly enveloped — without editing Genesis?

**Sources:** Genesis MOC (envelope), P5/P8/P9 entrypaths, Founder freeze certs, Expression hubs.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-GEN-01 | Envelope | curated links | Genesis MOC |
| WX-GEN-02 | P1–P9 entrypoints | curated table | Genesis paths (read-only) |
| WX-GEN-03 | Law file inventory | count/table by path | — |
| WX-GEN-04 | Expression bridges | list | Constitution / Interaction / Governance hubs |
| WX-GEN-05 | Freeze certificates (Founder) | list | Founder MOC |
| WX-GEN-06 | Warning | callout | “Do not edit Genesis from dashboard” |

### Queries

**Law inventory by top folder:**

```dataview
TABLE length(rows) AS notes
FROM "Genesis"
GROUP BY file.folder
SORT notes DESC
```

**Entrypoint existence check (curated list + DV file.exists pattern via LIST from known paths):**  
Prefer **curated table** of required entry files; Dataview `LIST FROM "Genesis/P5 Constitution"` etc. for presence.

**Expression hubs linking Genesis:**

```dataview
LIST
FROM "Constitution" OR "Governance" OR "Interaction Architecture" OR "Maps of Content"
WHERE contains(file.outlinks, [[Maps of Content/Genesis]]) OR contains(file.name, "Genesis")
```

(Impl may use weaker `contains(string(file.outlinks), "Genesis")`.)

### Navigation / relationships

- R-law → Genesis MOC only for edits  
- R-peer → UX Dashboard (expression under P9)  
- R-source → Constitution / Interaction MOCs  
- **No** drill that implies editing law leaves  

---

## 8. UX Dashboard (`03_UX-Dashboard`)

**Question:** Where is UX Intelligence / UX Architecture, freeze state, and D05/`/m` ceilings?

**Sources:** `Roadmap/UX-Architecture`, `Roadmap/UX-Intelligence`, Interaction MOC.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-UX-01 | Publication strip | curated | UXA `95_Publication_Record`, `00_INDEX` |
| WX-UX-02 | Phase indexes | table | Phase folders |
| WX-UX-03 | Certificates | table | Freeze/Completion/Audit |
| WX-UX-04 | Intelligence pack | table | UXI `00_INDEX` … `15_*` |
| WX-UX-05 | Product ceilings | curated callout | D05 · `/m` capture-only · Life Score seats |
| WX-UX-06 | Downstream consumers | curated | Design System · Motion · Eng · AI Arch (future) |

### Queries

```dataview
TABLE file.folder AS folder, status, lifecycle
FROM "Roadmap/UX-Architecture"
WHERE startswith(file.name, "00_") OR startswith(file.name, "90_") OR startswith(file.name, "91_") OR startswith(file.name, "92_") OR startswith(file.name, "93_") OR startswith(file.name, "94_") OR startswith(file.name, "95_") OR contains(file.name, "Certificate") OR contains(file.name, "INDEX")
SORT file.path ASC
```

```dataview
TABLE file.name AS note, status
FROM "Roadmap/UX-Intelligence"
SORT file.name ASC
```

```dataview
LIST
FROM "Roadmap/UX-Architecture" OR "Maps of Content"
WHERE contains(file.name, "Interaction") OR contains(lowercase(file.name), "score") OR contains(file.name, "Publication")
LIMIT 30
```

### Navigation / relationships

- R-source → UXA/UXI indexes (frozen) · Interaction MOC · Roadmap MOC  
- R-peer → Genesis (P9), Design, Engineering, Roadmap  
- R-alert → Risk (if `/m` score language appears in living notes — see Risk)  

---

## 9. Design Dashboard (`04_Design-Dashboard`)

**Question:** Palette lock, design SoT, duplication vs Archive Design-Bible, P8 cites.

**Sources:** `08_DESIGN`, Design MOC, Palette, Archive design stubs.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-DES-01 | Palette lock | curated + link | `08_DESIGN/Palette` |
| WX-DES-02 | Design notes | table | Design MOC |
| WX-DES-03 | Brand / navbar locks | curated | Product locks from Home |
| WX-DES-04 | Cold design | list | Archive Design-Bible |
| WX-DES-05 | Authority | links | Genesis MOC / P8 via envelope |
| WX-DES-06 | Stale review | table | `last_reviewed` aging |

### Queries

```dataview
TABLE status, lifecycle, last_reviewed
FROM "08_DESIGN"
SORT file.name ASC
```

```dataview
LIST
FROM "Archive" OR "99_ARCHIVE"
WHERE contains(lowercase(file.name), "design") OR contains(lowercase(file.name), "palette") OR contains(lowercase(file.name), "bible")
```

```dataview
TABLE last_reviewed, status
FROM "08_DESIGN"
WHERE !last_reviewed OR date(last_reviewed) < date(today) - dur(90 days)
```

### Navigation / relationships

- R-source → Design MOC · Palette · Genesis envelope  
- R-peer → UX · Engineering (implementation of visuals)  
- R-alert → Risk if living notes cite Archive Design-Bible as SoT  

---

## 10. Engineering Dashboard (`05_Engineering-Dashboard`)

**Question:** Build-layer coverage gaps (Frontend/AI/API/DB/Deploy/Native/Monorepo).

**Sources:** `02_`–`07_`, `17_NATIVE_APP_V2`, Engineering MOC, Architecture MOC.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-ENG-01 | Coverage matrix | curated + counts | Eng MOC |
| WX-ENG-02 | Folder note counts | table | paths |
| WX-ENG-03 | Native track | table | `17_NATIVE_APP_V2` |
| WX-ENG-04 | API / DB notes | table | `04_API`, `03_DATABASE` |
| WX-ENG-05 | Thin folders alert | list | folders with ≤2 notes |
| WX-ENG-06 | Monorepo pointer | link | `02_ARCHITECTURE/Monorepo` |
| WX-ENG-07 | Stale eng docs | table | aging |

### Queries

```dataview
TABLE length(rows) AS notes
FROM "02_ARCHITECTURE" OR "03_DATABASE" OR "04_API" OR "05_FRONTEND" OR "06_AI" OR "07_DEPLOYMENT" OR "17_NATIVE_APP_V2"
GROUP BY file.folder
SORT notes ASC
```

```dataview
TABLE status, last_reviewed
FROM "05_FRONTEND" OR "06_AI" OR "07_DEPLOYMENT"
SORT file.name ASC
```

```dataview
TABLE status, last_reviewed
FROM "17_NATIVE_APP_V2"
WHERE contains(file.name, "WORKFLOW") OR contains(file.name, "INDEX") OR contains(file.name, "STATUS")
SORT file.mtime DESC
```

**Coverage matrix (curated expected rows):** Monorepo · Overview · Frontend shell · `/m` ceiling · Account · API groups · Core tables · AI pipeline · Vercel · EC2 deploy · Native workflow — each linked or marked `GAP`.

### Navigation / relationships

- R-source → Engineering MOC · Architecture MOC  
- R-peer → AI · UX · Product Features (via Roadmap/Features later)  
- R-alert → Risk (coverage gaps)  

---

## 11. AI Dashboard (`06_AI-Dashboard`)

**Question:** AI product/docs readiness, prompts SoT, trust/confirm UX cites, logger/pipeline notes.

**Sources:** `06_AI`, `14_PROMPTS`, UXA AI confirm principles (cite only), Memory packs.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-AI-01 | AI notes | table | `06_AI` |
| WX-AI-02 | Prompts (living SoT) | table | `14_PROMPTS` |
| WX-AI-03 | Duplicate warning | callout | Genesis supporting prompts = historical only |
| WX-AI-04 | UX AI contracts | curated links | UXA AI confirm/correct (frozen cite) |
| WX-AI-05 | Agent memory | list | `15_MEMORY` packs |
| WX-AI-06 | Proof-or-Stop | link | `14_PROMPTS/Proof-or-Stop` |

### Queries

```dataview
TABLE status, last_reviewed, authority
FROM "06_AI"
SORT file.name ASC
```

```dataview
TABLE status, last_reviewed
FROM "14_PROMPTS"
SORT file.name ASC
```

```dataview
LIST
FROM "15_MEMORY"
WHERE file.name != "Current-Context"
SORT file.name ASC
```

```dataview
LIST
FROM "Roadmap/UX-Architecture"
WHERE contains(lowercase(file.name), "ai") OR contains(lowercase(file.name), "confirm")
LIMIT 20
```

### Navigation / relationships

- R-source → Eng MOC · Prompts · UXA cites  
- R-peer → Engineering · UX · Daily Ops (agent rules)  
- R-law → never treat prompts as Genesis  

---

## 12. Roadmap Dashboard (`07_Roadmap-Dashboard`)

**Question:** Program spine, statuses, what’s next, launch coupling.

**Sources:** `Roadmap/**`, Roadmap MOC, Operational-Priorities, Program 0, Program V1, Launch notes.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-RM-01 | Publication spine | curated sequence | Prog0 → UXI → UXA → V1 |
| WX-RM-02 | Program indexes | table | all `Roadmap/**/00_INDEX` |
| WX-RM-03 | Operational priorities | link + list | `Operational-Priorities` |
| WX-RM-04 | Program V1 artifacts | table | KOS specs |
| WX-RM-05 | Launch / Product Ready | links | Program 0 · Launch |
| WX-RM-06 | Stale roadmap notes | table | aging living only |

### Queries

```dataview
TABLE status, lifecycle, last_reviewed
FROM "Roadmap"
WHERE file.name = "00_INDEX" OR file.name = "01_Current_Status"
SORT file.path ASC
```

```dataview
TABLE artifact, status, last_reviewed
FROM "Roadmap/Program-V1-Obsidian-Knowledge-OS"
SORT file.name ASC
```

```dataview
TABLE status, last_reviewed
FROM "Roadmap"
WHERE !contains(file.path, "UX-Architecture") AND !contains(file.path, "UX-Intelligence") AND (lifecycle = "living" OR !lifecycle) AND (!last_reviewed OR date(last_reviewed) < date(today) - dur(30 days))
LIMIT 25
```

### Navigation / relationships

- R-source → Roadmap MOC · each program INDEX  
- R-peer → Executive · Risk · UX · Daily Ops  
- R-sequence → spine widgets  

---

## 13. Risk Dashboard (`08_Risk-Dashboard`)

**Question:** What can hurt launch, law, vault trust, or `/m` ceilings?

**Sources:** Bugs, Home blockers, thin eng folders, vault graph SLOs, living notes mentioning forbidden patterns, ADRs.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-RSK-01 | Product blockers | curated | Home · Daily Ops |
| WX-RSK-02 | Open bugs | table | `11_BUGS` |
| WX-RSK-03 | Vault hygiene risks | counts | zero-out living · missing FM |
| WX-RSK-04 | Coverage gaps | embed from Eng thin folders | Engineering |
| WX-RSK-05 | Ceiling violations watch | list search | UX |
| WX-RSK-06 | Authority risks | list | notes missing `can_override_genesis` outside Genesis |
| WX-RSK-07 | Cold cited as live | list | Design Dashboard cold |

### Queries

```dataview
TABLE status, last_reviewed
FROM "11_BUGS"
WHERE status != "closed" AND status != "resolved" AND status != "done"
SORT file.mtime DESC
```

```dataview
TABLE file.folder AS folder, length(file.outlinks) AS out
FROM "05_FRONTEND" OR "06_AI" OR "01_PRODUCT" OR "09_FEATURES" OR "Roadmap/Program-V1-Obsidian-Knowledge-OS"
WHERE length(file.outlinks) = 0 AND !contains(file.path, "Genesis")
SORT out ASC
LIMIT 40
```

```dataview
TABLE authority, can_override_genesis, status
FROM "01_PRODUCT" OR "09_FEATURES" OR "02_ARCHITECTURE" OR "Roadmap"
WHERE !contains(file.path, "UX-Architecture") AND (can_override_genesis = true OR (!authority AND !contains(file.path, "Genesis")))
LIMIT 40
```

**Ceiling watch (impl: DataviewJS full-text or Obsidian search embed):**  
Flag living notes (exclude frozen UXA/UXI) containing `/m/score` or “analytics on mobile” style phrases — **review queue**, not auto-delete.

### Navigation / relationships

- R-alert sink from Eng · Design · UX · Ops  
- R-drill → domain dashboards for mitigation  
- R-source → Home blockers · Bugs index  

---

## 14. Decisions Dashboard (`09_Decisions-Dashboard`)

**Question:** What ADRs exist, what’s open, what binds Founder?

**Sources:** `10_DECISIONS`, Founder hub/MOC, freeze certificates (as decided outcomes).

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-DEC-01 | All ADRs | table | `10_DECISIONS` |
| WX-DEC-02 | Open / draft | list | — |
| WX-DEC-03 | Founder certificates | list | `Founder/` |
| WX-DEC-04 | Recent decisions | list | mtime |
| WX-DEC-05 | Needs review | table | stale `last_reviewed` |
| WX-DEC-06 | Linkage gaps | list | ADRs with zero outlinks |

### Queries

```dataview
TABLE status, owner, last_reviewed, file.mtime AS modified
FROM "10_DECISIONS"
SORT file.mtime DESC
```

```dataview
LIST
FROM "10_DECISIONS"
WHERE status = "draft" OR status = "proposed" OR status = "open"
SORT file.mtime DESC
```

```dataview
TABLE status, last_reviewed
FROM "Founder"
WHERE contains(lowercase(file.name), "certificate") OR contains(lowercase(file.name), "freeze") OR contains(lowercase(file.name), "decision")
SORT file.name ASC
```

```dataview
LIST
FROM "10_DECISIONS"
WHERE length(file.outlinks) = 0
```

### Navigation / relationships

- R-source → Founder MOC · Decisions folder  
- R-peer → Risk · Roadmap · Genesis (constitutional ADRs)  
- Outbound ADRs should cite affected Feature/Eng (Graph NT-ADR)  

---

## 15. Daily Operations Dashboard (`10_Daily-Operations-Dashboard`)

**Question:** What do I (and agents) do today?

**Sources:** Current-Context, Home blockers, active program, sprints/meetings if any, prompts proof rule.

### Widgets

| ID | Title | Type | Drill |
|----|-------|------|-------|
| WX-OPS-01 | Current Context | embed / link | Context note |
| WX-OPS-02 | Do / Do not | curated mirror | Context |
| WX-OPS-03 | Touch list | links | Context Touch |
| WX-OPS-04 | Active program | links | Roadmap |
| WX-OPS-05 | Today’s blockers | curated | Home |
| WX-OPS-06 | Agent boot order | curated | Home → Context → MOC |
| WX-OPS-07 | Recent memory edits | table | `15_MEMORY` |
| WX-OPS-08 | Open sprints / meetings | table | if present |

### Queries

```dataview
TABLE file.mtime AS modified
FROM "15_MEMORY"
SORT file.mtime DESC
```

```dataview
TABLE status, last_reviewed
FROM "12_SPRINTS" OR "13_MEETINGS"
WHERE status = "active" OR status = "open" OR !status
SORT file.mtime DESC
LIMIT 15
```

```dataview
LIST
FROM "Roadmap"
WHERE contains(file.path, "Program-V1") OR contains(file.path, "Program-0")
WHERE file.name = "00_INDEX" OR contains(file.name, "Current") OR contains(file.name, "Specification") OR contains(file.name, "Audit")
SORT file.mtime DESC
LIMIT 12
```

**Note:** WX-OPS-01–05 stay **curated mirrors** of Current-Context to avoid dual SoT drift — dashboard links to Context as SoT; optional Dataview only for adjacent activity.

### Navigation / relationships

- R-source → Current-Context (primary) · Home  
- R-peer → Executive · Roadmap · Risk  
- First bookmark for daily Founder use  

---

## 16. Cross-dashboard query reuse map

| Shared concern | Primary dashboard | Also shown on |
|----------------|-------------------|---------------|
| Frozen UXA/UXI | UX | Executive, Genesis (cite), Roadmap |
| FM / outbound hygiene | Risk | Executive KPIs |
| Eng thin folders | Engineering | Risk |
| Open ADRs | Decisions | Executive |
| Context today | Daily Ops | Executive |
| Palette / cold design | Design | Risk |
| Prompts | AI | Daily Ops (agent) |
| P1–P9 entry | Genesis | Executive authority strip |

---

## 17. Implementation notes (when authorized — not now)

1. Install/enable Dataview; confirm in Workspace Index.  
2. Create `Dashboards/` files with frontmatter + widget headings + fenced queries.  
3. Wire nav links (Home, KG, Founder MOC, Context).  
4. Prefer DQL first; DataviewJS for KPI cards and orphan heuristics.  
5. After REC-MD-01, tighten WHERE clauses to `lifecycle` / `knowledge_layer`.  
6. Re-score vault audit Dataview readiness dimension.  
7. Still: no Genesis edits, no frozen moves.

### Acceptance tests (impl phase)

| Test | Pass criteria |
|------|----------------|
| Index lists 10 dashboards | DV table or curated complete |
| Executive opens without error | All queries parse |
| Genesis inventory | Count > 0 from `Genesis` path |
| UX lists Publication Record | Link resolves |
| Eng folder counts | `05_FRONTEND` / `06_AI` visible |
| Ops links Context | Click works |
| No file written under Genesis | git path check |

---

## 18. Explicit non-goals

- Implementing Dataview blocks in this deliverable  
- Replacing Home or Current-Context  
- Auto-amending Genesis or frozen architecture  
- Building a second product requirements system inside dashboards  

---

## 19. Closeout

| Item | Status |
|------|--------|
| Founder Workspace Dataview Spec v1.0 | **COMPLETE** (design) |
| Dashboards created on disk | **NONE** |
| Queries executed | **NONE** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend → authorize dashboard folder creation + Dataview enablement.
