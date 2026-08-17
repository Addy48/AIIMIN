---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: metadata-migration-plan
implementation: none
genesis_touch: forbidden
frozen_bulk_fm: forbidden-unless-adr
---

# Program V1 — Metadata Migration Plan

**KOS frontmatter schema · note-type matrix · backfill · validation · Dataview readiness**

| Field | Value |
|-------|-------|
| Date | 2026-07-25 |
| Mode | **Design only — zero migration executed** |
| Parents | [[01_Vault_Deep_Audit_Report]] · [[02_Vault_Architecture_Specification]] · [[03_Graph_Engineering_v1]] · [[05_Vault_Automation_Layer_Spec]] |
| Related | [[04_Founder_Workspace_Dataview_Spec]] (query consumers) |
| Genesis | **Do not edit** — path-implied `KL-LAW` |
| Frozen packs | Prefer **no bulk FM rewrite**; inbound links + path fallbacks |

---

## 0. Mission & hard constraints

### 0.1 Mission

Make every **eligible** note machine-queryable under one closed schema so:

1. Dataview dashboards stop depending on path heuristics alone  
2. Templates / Metadata Menu / QuickAdd emit the same enums  
3. Graph Engineering `graph_role` and KOS `knowledge_layer` stay aligned  
4. New notes cannot recreate the audit gap (39% missing FM; tags score 2.0)

### 0.2 Non-negotiables (from Audit + Architecture)

| ID | Constraint | Migration consequence |
|----|------------|------------------------|
| C1 | Genesis immutable | **No** bulk FM write under `Genesis/**`. Path rule implies law. |
| C2 | Frozen stay put | **No** required bulk FM inside `Roadmap/UX-Architecture/**` or `Roadmap/UX-Intelligence/**`. Optional FM only via Founder ADR. Path + curated registries until then. |
| C3 | No Stage B rename | Folder path defaults remain the inheritance engine. |
| C4 | Authority ladder | Every written FM sets `can_override_genesis: false`. Never `true`. |
| C5 | Spec ≠ implement | This plan designs. Execution = separate Founder-authorized sprint. |

### 0.3 Audit baseline (evidence)

| Metric | Value |
|--------|------:|
| Markdown notes | ~609 |
| Notes with YAML FM | 372 / 609 (**61%**) |
| Notes with authority-ish FM | 334 / 609 (**55%**) |
| YAML `tags:` | **1** |
| Dataview blocks | **0** |
| Target after migration (living, non-Genesis) | See §12 Coverage targets |

---

## 1. Schema v1 — field catalog

### 1.1 Core required fields (written FM)

Apply to all notes **outside** `Genesis/` that are in scope for backfill (§5). Templates must emit the full core set.

```yaml
---
authority: <enum>
derived_from: <string | wikilink path>
status: <enum>
owner: <enum>
lifecycle: <enum>
last_reviewed: YYYY-MM-DD
can_override_genesis: false
knowledge_layer: <KL-*>
---
```

| Field | Type | Required? | Purpose |
|-------|------|-----------|---------|
| `authority` | enum | **Yes** (eligible notes) | Authority ladder label for Dataview / graph color |
| `derived_from` | string | **Yes** | Provenance — Genesis MOC path, pack INDEX, or parent program |
| `status` | enum | **Yes** | Work state (not lifecycle) |
| `owner` | enum | **Yes** | Accountability |
| `lifecycle` | enum | **Yes** | Living / frozen / archive — primary Dataview filter |
| `last_reviewed` | date `YYYY-MM-DD` | **Yes** | Staleness dashboards |
| `can_override_genesis` | boolean | **Yes** | Always `false` |
| `knowledge_layer` | enum `KL-*` | **Yes** | Epistemic role (KOS §4) |

### 1.2 Strongly recommended fields

| Field | Type | When required | Purpose |
|-------|------|---------------|---------|
| `graph_role` | enum | All hubs, dashboards, certificates, envelopes; recommended on leaves | Graph Engineering contracts / colorGroups |
| `nav_role` | enum | Boot, spine, hubs, indexes, dashboards | Navigation layer queries |
| `note_type` | enum `NT-*` | All eligible notes (after Phase M1 templates) | Ties FM to Graph NT contracts |
| `tags` | list (closed taxonomy) | Hubs, MOCs, dashboards, Feature MOCs first | Tag pane + `contains(tags,…)` |
| `program` | string | Program / Roadmap living notes | Roadmap board |
| `artifact` | string | Specs, audits, certificates, dashboards | Artifact registry |
| `dashboard_id` | enum `DB-*` | Dashboard notes only | Workspace Index |

### 1.3 Optional / type-specific fields

| Field | Applies to | Purpose |
|-------|------------|---------|
| `entity` | Feature MOCs / feature leaves | Manifest sync key |
| `feature` | Bugs, ADRs, eng leaves bound to a feature | Cross-board join |
| `severity` | Bugs | Severity boards (optional v1) |
| `decision_status` | ADRs | `proposed` / `accepted` / `superseded` (maps into `status` or parallel) |
| `supersedes` | Living stubs | Path to Archive / cold note |
| `migration_batch` | Notes touched by backfill | Rollback / audit trail (`M0`…`M4`) |
| `fm_source` | Backfilled notes | `template` \| `script` \| `manual` \| `inherited-path` |

### 1.4 Explicitly out of schema v1

| Do not add | Why |
|------------|-----|
| Freeform tags outside taxonomy | Tag score collapse |
| `can_override_genesis: true` | Forbidden |
| Per-note color / CSS classes as FM | Use `graph_role` + Obsidian graph.json |
| Secrets / tokens / env values | Vault rule |
| Duplicate body SoT into FM | Dashboards are derived |

---

## 2. Closed enums

### 2.1 `authority`

| Value | Meaning | Typical homes |
|-------|---------|---------------|
| `constitutional` | Law / sealed constitution cite surface | Expression hubs citing Genesis; **not** written inside Genesis under C1 |
| `expression` | Restatement / glossary / rule index | `Constitution/`, `Governance/`, `Glossary/` |
| `architecture` | UX / system architecture expression | UXA living mirrors; eng architecture notes |
| `operations` | Ops, roadmap living, memory, prompts, bugs, sprints | Default for Program V1 docs |
| `engineering` | Build notes | `02_`–`07_`, `03_DATABASE`, `04_API`, Native |
| `product` | Product + Features | `01_PRODUCT/`, `09_FEATURES/` |
| `research` | Research packs / experiments as research | `Research/`, experiments when research-flavored |
| `founder` | Founder certificates, freeze ops | `Founder/`, some ADRs |

**Genesis path implication:** treat as constitutional law; **do not write** FM to force the label.

### 2.2 `status`

| Value | Meaning |
|-------|---------|
| `active` | Current SoT / in use |
| `draft` | Incomplete; OK for stubs |
| `deprecated` | Still present; do not cite as primary |
| `superseded` | Replaced; prefer `supersedes` + Archive |
| `planned` | Stub promised by Eng MOC |
| `proposed` | ADR / decision awaiting accept |
| `open` | Bug / work item open |
| `closed` | Bug / work item closed |
| `resolved` | Bug resolved (alias of closed for queries) |
| `done` | Sprint / checklist complete |

**Dataview note:** Risk / Bugs boards treat `closed` \| `resolved` \| `done` as finished. Prefer one of those three for closed bugs going forward; accept legacy synonyms during migration.

### 2.3 `owner`

| Value |
|-------|
| `founder` |
| `eng` |
| `engineering` *(legacy synonym — normalize to `eng` on write)* |
| `product` |
| `design` |
| `ops` |
| `shared` |

**Normalization rule:** Scripts map `engineering` → `eng`. Templates emit `eng` only.

### 2.4 `lifecycle`

| Value | Meaning | Graph / Dataview |
|-------|---------|------------------|
| `living` | Editable SoT | In default health / orphan SLOs |
| `frozen` | Do not amend without ADR | Frozen Registry; exclude from living orphan queue |
| `archive` | Cold / superseded | Exclude from GV-DEFAULT + living queries |
| `sealed` | Alias for immutable law packs | Path-implied for Genesis; optional on expression of sealed status |

Prefer `frozen` for published packs; reserve `sealed` for documentation of Genesis/law only (path-implied).

### 2.5 `knowledge_layer` (`KL-*`)

| ID | Name |
|----|------|
| `KL-LAW` | Law |
| `KL-EXPR` | Expression |
| `KL-EVID` | Evidence |
| `KL-ARCH` | Architecture |
| `KL-PROG` | Program |
| `KL-PROD` | Product |
| `KL-BUILD` | Build |
| `KL-OPS` | Operations |
| `KL-DEC` | Decision |
| `KL-COLD` | Cold storage |
| `KL-META` | Meta (MOCs, templates, dashboards, manifest docs) |

### 2.6 `graph_role`

From [[03_Graph_Engineering_v1]]:

`boot` · `context` · `master-hub` · `domain-hub` · `struct-hub` · `index` · `leaf` · `certificate` · `dashboard` · `cold` · `template` · `law` · `envelope`

### 2.7 `nav_role`

`boot` · `spine` · `hub` · `index` · `leaf` · `crosswalk` · `dashboard` · `context`

### 2.8 `note_type` (`NT-*`)

| NT ID | Class |
|-------|-------|
| `NT-BOOT` | Home |
| `NT-CONTEXT` | Current Context |
| `NT-MASTER-HUB` | Knowledge-Graph MOC |
| `NT-DOMAIN-MOC` | H1 domain MOC |
| `NT-STRUCT-HUB` | Constitution / Governance / Interaction / Founder hubs |
| `NT-PACKAGE-INDEX` | `00_INDEX` / program index |
| `NT-FEATURE-MOC` | Feature entity MOC |
| `NT-FEATURE-LEAF` | Feature supporting / changelog page |
| `NT-ENG-LEAF` | Arch / API / DB / Frontend / AI / Deploy / Native |
| `NT-DESIGN-LEAF` | Palette / design living |
| `NT-ADR` | Decision / ADR |
| `NT-CERTIFICATE` | Freeze / completion / publication |
| `NT-FROZEN-LEAF` | Inside frozen packs (non-index) |
| `NT-LAW` | Genesis note (path-implied; no write) |
| `NT-ENVELOPE` | Genesis MOC |
| `NT-PROGRAM-LIVING` | Program living specs / audits |
| `NT-PROMPT` | `14_PROMPTS` |
| `NT-BUG` | Bug |
| `NT-SPRINT` | Sprint |
| `NT-MEETING` | Meeting |
| `NT-DASHBOARD` | Dashboard |
| `NT-COLD` | Archive |
| `NT-TEMPLATE` | `_templates/*` |
| `NT-MEMORY-PACK` | `15_MEMORY` packs (non-Context) |
| `NT-ERRATA` | Living errata for frozen packs |
| `NT-PRODUCT-LEAF` | Product non-feature leaf (`01_PRODUCT`) |
| `NT-DOC` | `16_DOCUMENTATION` how-to |
| `NT-MANIFEST-DOC` | Human docs for `_manifest.json` |
| `NT-EXPERIMENT` | `17_EXPERIMENTS` |

### 2.9 Tag taxonomy (closed)

YAML list only. Prefix required.

| Prefix | Allowed values (v1) |
|--------|---------------------|
| `type/` | `moc`, `hub`, `index`, `feature`, `adr`, `certificate`, `dashboard`, `runbook`, `prompt`, `changelog`, `bug`, `sprint`, `meeting`, `errata`, `envelope`, `template` |
| `domain/` | `genesis`, `roadmap`, `product`, `engineering`, `design`, `native`, `ops`, `research`, `founder` |
| `status/` | `living`, `frozen`, `archive`, `draft` |

**Ban:** Inline `#` + hex colors. Colors only in `` `code` `` or fenced blocks.

### 2.10 `dashboard_id`

Align with Architecture / Dataview specs:

`DB-HEALTH` · `DB-AUTH` · `DB-FROZEN` · `DB-ROAD` · `DB-FEAT` · `DB-ENG` · `DB-ORPHAN` · `DB-CONTEXT` · `DB-EXEC` · `DB-INDEX` · (+ Founder Workspace IDs as implemented)

---

## 3. Note-type → field matrix

Legend: **R** = required written · **S** = strongly recommended · **O** = optional · **P** = path-implied (do not write) · **—** = N/A / exempt

### 3.1 Core matrix

| Note type | authority | derived_from | status | owner | lifecycle | last_reviewed | can_override_genesis | knowledge_layer | graph_role | nav_role | note_type | tags | Extra |
|-----------|-----------|--------------|--------|-------|-----------|---------------|----------------------|-----------------|------------|----------|-----------|------|-------|
| NT-BOOT | R | R | R | R | R | R | R=`false` | R=`KL-META` | R=`boot` | R=`boot` | R | S | — |
| NT-CONTEXT | R | R | R | R | R | R | R | R=`KL-OPS` | R=`context` | R=`context` | R | S | — |
| NT-MASTER-HUB | R | R | R | R | R | R | R | R=`KL-META` | R=`master-hub` | R=`hub` | R | R | — |
| NT-DOMAIN-MOC | R | R | R | R | R | R | R | by domain | R=`domain-hub` | R=`hub` | R | R | — |
| NT-STRUCT-HUB | R | R | R | R | R | R | R | R=`KL-EXPR` (or DEC for Founder) | R=`struct-hub` | R=`hub` | R | R | — |
| NT-ENVELOPE | R | R | R | R | R | R | R | R=`KL-META` | R=`envelope` | R=`hub` | R | R | — |
| NT-PACKAGE-INDEX living | R | R | R | R | R=`living` | R | R | R=`KL-PROG` | R=`index` | R=`index` | R | S | `program` S |
| NT-PACKAGE-INDEX frozen | P/O | — | — | — | P=`frozen` | — | — | P=`KL-ARCH`/`KL-EVID` | P=`index` | — | P | — | No bulk write |
| NT-FEATURE-MOC | R=`product` | R | R | R | R | R | R | R=`KL-PROD` | R=`domain-hub` | R=`hub` | R | R | `entity` S |
| NT-FEATURE-LEAF | R=`product` | R | R | R | R | R | R | R=`KL-PROD` | S=`leaf` | S=`leaf` | R | S | `entity`/`feature` O |
| NT-ENG-LEAF | R=`engineering` | R | R | R | R | R | R | R=`KL-BUILD` | S=`leaf` | S=`leaf` | R | S | `feature` O |
| NT-DESIGN-LEAF | R=`operations` or product | R | R | R | R | R | R | R=`KL-BUILD` or META | S=`leaf` | S=`leaf` | R | S | — |
| NT-PRODUCT-LEAF | R=`product` | R | R | R | R | R | R | R=`KL-PROD` | S=`leaf` | S=`leaf` | R | S | — |
| NT-ADR | R=`founder` or eng | R | R | R | R | R | R | R=`KL-DEC` | S=`leaf` | S=`leaf` | R | R=`type/adr` | `decision_status` O |
| NT-CERTIFICATE living | R=`founder` | R | R | R | R | R | R | R=`KL-DEC` | R=`certificate` | S=`leaf` | R | R | `artifact` S |
| NT-CERTIFICATE frozen | — | — | — | — | P | — | — | P | P | — | P | — | No bulk write |
| NT-FROZEN-LEAF | — | — | — | — | P=`frozen` | — | — | P | P=`leaf` | — | P | — | Exempt |
| NT-LAW | P | P | P | P | P | P | P=`false` | P=`KL-LAW` | P=`law` | — | P=`NT-LAW` | — | **Never write** |
| NT-PROGRAM-LIVING | R=`operations` | R | R | R | R | R | R | R=`KL-PROG` | S | S | R | S | `program`,`artifact` S |
| NT-PROMPT | R=`operations` | R | R | R | R | R | R | R=`KL-OPS` | S=`leaf` | S=`leaf` | R | R=`type/prompt` | — |
| NT-BUG | R=`operations` | R | R | R | R | R | R | R=`KL-OPS` | S=`leaf` | S=`leaf` | R | R=`type/bug` | `feature`,`severity` O |
| NT-SPRINT | R=`operations` | R | R | R | R | R | R | R=`KL-OPS` | S=`leaf` | S=`leaf` | R | R=`type/sprint` | — |
| NT-MEETING | R=`operations` | R | R | R | R | R | R | R=`KL-OPS` | S=`leaf` | S=`leaf` | R | R=`type/meeting` | — |
| NT-DASHBOARD | R=`operations` | R | R | R | R=`living` | R | R | R=`KL-META` | R=`dashboard` | R=`dashboard` | R | R=`type/dashboard` | `dashboard_id` R |
| NT-COLD | O | O | O | O | R=`archive` if touched | O | R if touched | R=`KL-COLD` if touched | R=`cold` | — | R if touched | S=`status/archive` | Prefer README only |
| NT-TEMPLATE | R (template stamp) | R | R=`draft` or active | R | R=`living` | R | R | R=`KL-META` | R=`template` | — | R | R=`type/template` | Not queried as content |
| NT-MEMORY-PACK | R=`operations` | R | R | R | R | R | R | R=`KL-OPS` | S=`leaf` | S=`leaf` | R | S | — |
| NT-ERRATA | R=`operations` | R | R | R | R | R | R | R=`KL-PROG` | S=`leaf` | S=`leaf` | R | R=`type/errata` | — |
| NT-DOC | R=`operations` | R | R | R | R | R | R | R=`KL-OPS` | S=`leaf` | S=`leaf` | R | S | — |
| NT-EXPERIMENT | R=`research` or ops | R | R | R | R | R | R | R=`KL-OPS` or research | S=`leaf` | S=`leaf` | R | S | Quarantine policy |

### 3.2 Graph contract coupling (non-FM but migration-aware)

Metadata migration does **not** create wikilinks. Graph SLOs remain [[03_Graph_Engineering_v1]]. After FM exists, Health dashboard can join `note_type` + degree checks.

| Note type | Out SLO | In SLO | FM migration changes SLO? |
|-----------|---------|--------|---------------------------|
| Living hub/leaf | Yes | Yes | No — FM enables detection only |
| NT-LAW / NT-FROZEN-LEAF / NT-COLD / NT-TEMPLATE | No | No / entrypoints only | No |

---

## 4. Inheritance & defaults

### 4.1 Inheritance model

```text
Path prefix  →  default (authority, knowledge_layer, lifecycle, graph_role, owner)
        ↓
Note-type override  →  NT-* matrix (§3)
        ↓
Existing FM  →  preserve if valid; fill missing keys only
        ↓
Template / Metadata Menu  →  enforce on create/edit
```

**Rule:** Inheritance is **defaulting**, not continuous sync. Changing a folder default does not rewrite existing notes until a new migration batch.

### 4.2 Path → default table (living + cold; Genesis path-implied)

| Path prefix | authority | knowledge_layer | lifecycle default | graph_role default | owner default | note_type hint |
|-------------|-----------|-----------------|-------------------|--------------------|---------------|----------------|
| `Genesis/**` | *(constitutional)* | `KL-LAW` | sealed/frozen | `law` | founder | `NT-LAW` — **no write** |
| `Maps of Content/Genesis*` | operations | `KL-META` | living | `envelope` | founder | `NT-ENVELOPE` |
| `Maps of Content/**` | operations | `KL-META` | living | `domain-hub` / `master-hub` | founder | MOC types |
| `00_HOME.md` | operations | `KL-META` | living | `boot` | founder | `NT-BOOT` |
| `15_MEMORY/Current-Context.md` | operations | `KL-OPS` | living | `context` | founder | `NT-CONTEXT` |
| `15_MEMORY/**` | operations | `KL-OPS` | living | `leaf` | founder | `NT-MEMORY-PACK` |
| `Constitution/**` | expression | `KL-EXPR` | living | `struct-hub` / leaf | founder | `NT-STRUCT-HUB` / leaf |
| `Governance/**` | expression | `KL-EXPR` | living | `struct-hub` / leaf | founder | same |
| `Interaction Architecture/**` | expression | `KL-EXPR` | living | `struct-hub` / leaf | founder | same |
| `Glossary/**` | expression | `KL-EXPR` | living | `leaf` | founder | leaf |
| `Roadmap/UX-Architecture/**` | architecture | `KL-ARCH` | frozen | index/leaf/certificate | founder | frozen types — **no bulk write** |
| `Roadmap/UX-Intelligence/**` | research | `KL-EVID` | frozen | index/leaf | founder | same |
| `Roadmap/**` (other) | operations | `KL-PROG` | living | index/leaf | founder | `NT-PROGRAM-LIVING` / index |
| `01_PRODUCT/**` | product | `KL-PROD` | living | leaf | product | `NT-PRODUCT-LEAF` |
| `09_FEATURES/**` | product | `KL-PROD` | living | domain-hub / leaf | product / eng | Feature MOC/leaf |
| `02_ARCHITECTURE/**` … `07_DEPLOYMENT/**` | engineering | `KL-BUILD` | living | leaf | eng | `NT-ENG-LEAF` |
| `03_DATABASE/**` · `04_API/**` · `05_FRONTEND/**` · `06_AI/**` | engineering | `KL-BUILD` | living | leaf | eng | `NT-ENG-LEAF` |
| `08_DESIGN/**` | operations | `KL-BUILD` | living | leaf | design | `NT-DESIGN-LEAF` |
| `17_NATIVE_APP_V2/**` | engineering | `KL-BUILD` | living | leaf / index | eng | `NT-ENG-LEAF` / index |
| `10_DECISIONS/**` | founder / eng | `KL-DEC` | living | leaf | founder | `NT-ADR` |
| `Founder/**` | founder | `KL-DEC` | living / frozen by note | struct-hub / certificate | founder | hub / cert |
| `11_BUGS/**` | operations | `KL-OPS` | living | leaf | eng | `NT-BUG` |
| `12_SPRINTS/**` | operations | `KL-OPS` | living | leaf | founder | `NT-SPRINT` |
| `13_MEETINGS/**` | operations | `KL-OPS` | living | leaf | founder | `NT-MEETING` |
| `14_PROMPTS/**` | operations | `KL-OPS` | living | leaf | founder | `NT-PROMPT` |
| `16_DOCUMENTATION/**` | operations | `KL-OPS` | living | leaf | founder | `NT-DOC` |
| `17_EXPERIMENTS/**` | research / ops | `KL-OPS` | living | leaf | founder | `NT-EXPERIMENT` |
| `Dashboards/**` | operations | `KL-META` | living | `dashboard` | founder | `NT-DASHBOARD` |
| `Archive/**` | operations | `KL-COLD` | archive | `cold` | founder | `NT-COLD` |
| `99_ARCHIVE/**` | operations | `KL-COLD` | archive | `cold` | founder | `NT-COLD` |
| `_templates/**` | operations | `KL-META` | living | `template` | founder | `NT-TEMPLATE` |

### 4.3 `derived_from` defaults

| Note class | Default `derived_from` |
|------------|------------------------|
| Most living ops | `Genesis` or `Maps of Content/Genesis` |
| Feature / product | Parent Feature MOC or `01_PRODUCT` + UXA INDEX when behavior |
| Eng | `02_ARCHITECTURE/Overview` or Monorepo note |
| Expression hubs | Genesis P5 / P7 / P9 entry path strings |
| Program V1 notes | `Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification` |
| Dashboards | Dataview Spec path |
| Cold | Optional; often omit if untouched |

### 4.4 Preserve-vs-fill policy

| Existing key | Valid enum? | Action |
|--------------|-------------|--------|
| Present + valid | Yes | Keep |
| Present + invalid / synonym | No | Normalize per §2 (`engineering`→`eng`; map unknown `status` to closest + log) |
| Missing | — | Fill from path defaults |
| Conflicting with path (e.g. Feature under Features with `authority: operations`) | Soft conflict | Keep existing if in allowed set; flag in validation report for human review |
| `can_override_genesis: true` | Forbidden | Force `false` + **critical** alert |

### 4.5 Partial FM today

Templates already stamp a subset (`authority`, `owner`, `status`, `lifecycle`, `last_reviewed`, `can_override_genesis`) but often omit `knowledge_layer`, `graph_role`, `note_type`, `tags`. Migration = **additive fill**, not wholesale replace of body or valid keys.

---

## 5. Migration scope & eligibility

### 5.1 In scope (backfill writes allowed)

- All markdown under `docs/knowledge/` **except** exclusions below  
- Living hubs, MOCs, Features, Eng, Ops, Roadmap living (incl. Program V1)  
- Archive / `99_ARCHIVE` **only if** batch explicitly includes cold (optional Phase M3); default skip body of cold leaves, stamp READMEs only  
- `_templates/*` rewrite (Phase M0) — stamps for future notes  
- Future `Dashboards/**` created with full schema (not a backfill)

### 5.2 Out of scope / write-forbidden

| Path / class | Policy |
|--------------|--------|
| `Genesis/**` | **Never** write FM in this program |
| `Roadmap/UX-Architecture/**` | No bulk FM; path = `KL-ARCH` + `lifecycle: frozen` |
| `Roadmap/UX-Intelligence/**` | No bulk FM; path = `KL-EVID` + frozen |
| Other `lifecycle: frozen` packs without ADR | No bulk FM |
| Binary / assets / non-md | Skip |
| `.obsidian/**` | Config only; not note FM |

### 5.3 Eligibility formula

```text
eligible =
  is_markdown
  AND NOT under Genesis/
  AND NOT (under UX-Architecture/ OR UX-Intelligence/)   # unless Founder ADR
  AND NOT (optional skip: Archive/, 99_ARCHIVE/, _templates/ during content backfill)
```

Templates are updated in M0 but are not “content coverage” for Dataview KPIs.

---

## 6. Compatibility

### 6.1 Dual-read period (mandatory)

Until coverage gates pass, **all Dataview queries** keep path fallbacks ([[04_Founder_Workspace_Dataview_Spec]] D4):

| Preferred (post-migration) | Fallback (now → dual-read) |
|----------------------------|----------------------------|
| `lifecycle = "living"` | `NOT_COLD` + path not frozen packs |
| `knowledge_layer = "KL-PROD"` | `contains(file.path, "09_FEATURES") OR "01_PRODUCT"` |
| `graph_role = "dashboard"` | `FROM "Dashboards"` |
| `note_type = "NT-BUG"` | `FROM "11_BUGS"` |
| `lifecycle = "frozen"` | curated Frozen Registry table + path prefixes |

**Do not** remove path fallbacks until §12 Gate G3.

### 6.2 Synonym compatibility map

| Legacy / messy | Canonical |
|----------------|-----------|
| `owner: engineering` | `eng` |
| `status: done` (bugs) | keep; queries treat as closed |
| Missing `lifecycle` on active Feature | fill `living` |
| `authority: operations` on Feature | soft-flag; prefer `product` on next human edit |
| Body `#ff6b35` | not a tag; escape to code in living notes (MD-03) — separate from FM tags |

### 6.3 Plugin compatibility

| Surface | Expectation |
|---------|-------------|
| Dataview | Reads YAML; dual-read WHERE |
| Metadata Menu | fileClasses mirror §2 enums; **exclude** Genesis fileClass |
| Templates / Templater / QuickAdd | Emit core + `note_type` + `graph_role` |
| Bases (optional P3) | Same field names; no second schema |
| Obsidian graph.json | Colors by `authority` / path until FM dense; then optional FM-based groups |

### 6.4 Manifest compatibility

`_manifest.json` remains Feature entity SoT for code/docs sync. FM `entity` on Feature MOCs should match manifest keys when present. Migration does not rewrite JSON unless a later batch explicitly syncs (REC-MD-05).

### 6.5 Agent / Brain OS compatibility

- Home / Current-Context keep human-readable authority fields  
- Caveman compression stays in `15_MEMORY` **body** style; FM remains full English enum tokens  
- `can_override_genesis: false` unchanged everywhere written  

---

## 7. Validation

### 7.1 Validators (design — implement later)

| ID | Check | Severity | Scope |
|----|-------|----------|-------|
| V-REQ | Core keys present | error | eligible notes |
| V-ENUM | Values ∈ closed enums | error | eligible |
| V-COG | `can_override_genesis === false` | critical | any note with key present |
| V-DATE | `last_reviewed` parseable `YYYY-MM-DD` | error | eligible |
| V-KL | `knowledge_layer` matches path default **or** allowlist override | warn | eligible |
| V-NT | `note_type` consistent with path/name heuristics | warn | eligible |
| V-TAG | tags only closed prefixes/values | error | notes with tags |
| V-GEN | Zero FM writes detected under Genesis in migration log | critical | CI / script |
| V-FRZ | Zero bulk FM under UXA/UXI without ADR flag | critical | script |
| V-DASH | Dashboards have `dashboard_id` + `nav_role: dashboard` | error | `Dashboards/` |
| V-DUP | Soft-report basename collisions (link policy, not FM fail) | warn | vault |
| V-SAMPLE | Human review sample 10% of batch | gate | each batch |

### 7.2 Validation outputs

Each migration batch produces:

1. `migration_batch` stamp on touched notes  
2. Report markdown (living, under Program V1 or Dashboards): counts filled / skipped / normalized / conflicts  
3. Exit code: fail on critical (V-COG, V-GEN, V-FRZ)

### 7.3 Dry-run mode

Every scripted phase supports `--dry-run`: print planned YAML diffs; write nothing. Founder accepts dry-run report before apply.

---

## 8. Migration strategy

### 8.1 Principles

1. **Templates first** — stop new debt before backfill  
2. **Hubs before leaves** — Dataview + navigation gain fastest  
3. **Additive FM only** — do not rewrite note bodies in metadata batches  
4. **Path-implied law/frozen** — never “fix” orphans by editing Genesis/frozen FM  
5. **Batch + stamp + validate + sample** — no big-bang silent rewrite  
6. **Dual-read until Gate G3**

### 8.2 Tooling (future impl)

| Tool | Role |
|------|------|
| Python / Node FM script | Parse YAML, apply defaults, dry-run, report |
| git | Rollback unit = commit per batch (Founder commits) |
| Metadata Menu presets | Ongoing enum safety |
| Dataview Health widgets | Continuous coverage KPI |

### 8.3 Order of operations (logical)

```text
M0 Templates + styleguide enums
 → M1 Hub / MOC / Program / Home / Context stamp
 → M2 Living product + eng + ops leaves
 → M3 Optional cold README + hex-escape (living) + tags pass
 → M4 Tighten Dataview WHERE; lint warn-only CI
```

Hex escape (REC-MD-03) is **body** hygiene adjacent to metadata — schedule in M3, not mixed with FM YAML writes in the same unattended script without review.

---

## 9. Migration phases (execution plan — do not run yet)

Aligned with Automation Phase 1.7 (FM backfill) and KOS Phase B (Metadata foundation). **This document does not execute these phases.**

### Phase M0 — Schema lock + templates (P0)

| Step | Work | Writes |
|------|------|--------|
| M0.1 | Publish this plan; Founder accept/amend enums | This file only (done as design) |
| M0.2 | Rewrite `_templates/*` to full core + `knowledge_layer` + `graph_role` + `note_type` | Templates |
| M0.3 | Add templates: moc, dashboard, eng-leaf, errata, program, envelope-section | Templates |
| M0.4 | Metadata Menu fileClass draft (design file; install later per Automation) | Spec / preset file living |
| M0.5 | Path→layer map note (REC-KL-02) if not yet created | Living ops note |

**Exit:** New notes can be born correct. Genesis untouched.  
**Depends:** Founder authorize Automation Phase 0/1 template work.

### Phase M1 — Critical navigation surface (P0)

| Step | Work | Writes |
|------|------|--------|
| M1.1 | Dry-run backfill: Home, Current-Context, all `Maps of Content/*`, Constitution/Governance/Interaction hubs, Founder hubs, Roadmap MOC, Engineering/Product/Design MOCs | Report only |
| M1.2 | Apply M1.1 after Founder OK | Eligible hub FM |
| M1.3 | Program V1 + Program 0 living indexes/specs | FM |
| M1.4 | Validate V-REQ/V-ENUM/V-COG; 100% hubs sample | Report |

**Exit:** Boot + spine + H1 hubs queryable. Dashboards can filter hubs by `knowledge_layer`.  
**Coverage target:** 100% of H0–H2 living hubs.

### Phase M2 — Living corpus backfill (P0–P1)

| Step | Work | Writes |
|------|------|--------|
| M2.1 | Dry-run: `09_FEATURES`, `01_PRODUCT`, `02_`–`08_`, Native, `10_DECISIONS`, `11_`–`16_`, other living Roadmap | Report |
| M2.2 | Apply in folder batches (Features → Eng → Ops → remaining Roadmap living) | FM additive |
| M2.3 | Normalize `owner` / soft-flag authority conflicts | FM + report |
| M2.4 | 10% human sample per folder batch | Review |

**Exit:** Eligible living notes ≥ coverage Gate G1.  
**Skip:** Genesis, UXA, UXI, optional cold.

### Phase M3 — Tags, cold policy, hex hygiene (P1)

| Step | Work | Writes |
|------|------|--------|
| M3.1 | YAML tags on all hubs/MOCs/dashboards/Feature MOCs | tags |
| M3.2 | Archive README FM only (`lifecycle: archive`, `KL-COLD`) | READMEs |
| M3.3 | Living-note hex escape pass (non-Genesis) | Body wraps only |
| M3.4 | Optional: cold leaf FM skip remains default | — |

**Exit:** Tag pane usable for hubs; cold policy visible; hex false-tags reduced outside Genesis.

### Phase M4 — Dataview harden + lint (P1–P2)

| Step | Work | Writes |
|------|------|--------|
| M4.1 | Upgrade dashboard WHERE to prefer FM; keep fallbacks behind comment flag | Dashboards only |
| M4.2 | Warn-only CI: V-REQ, V-ENUM, V-COG, V-GEN | Scripts |
| M4.3 | Re-score audit metadata + Dataview dimensions | Audit note update |
| M4.4 | Gate G3 decision: remove path fallbacks only if Founder accepts | Spec amendment |

**Exit:** Continuous enforcement; Dataview readiness score target (§12).

### Phase map vs other Program V1 phases

| Metadata phase | KOS Arch phase | Automation phase |
|----------------|----------------|------------------|
| M0 | B (partial) | 0.2–0.3 |
| M1 | B | 1.7 start |
| M2 | B | 1.7 complete |
| M3 | E (hygiene) | after 1.5 Metadata Menu |
| M4 | E + DB queries | 1.1 / 3.4 |

---

## 10. Risk analysis

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | Accidental Genesis FM write | Med if script buggy | Critical (C1) | Path denylist; V-GEN; dry-run; no script default includes Genesis |
| R2 | Bulk FM inside frozen UXA/UXI | Med | High (C2) | Denylist; ADR gate; path fallbacks |
| R3 | Wrong `authority` / `knowledge_layer` from path defaults | High | Med | Soft-flag conflicts; 10% sample; Metadata Menu thereafter |
| R4 | Overwriting valid custom FM | Med | Med | Additive fill only; preserve valid enums |
| R5 | Dataview boards empty mid-migration | Med | Med | Dual-read path fallbacks until G3 |
| R6 | Tag taxonomy ignored; free tags return | Med | Med | V-TAG; Metadata Menu; template-only tags |
| R7 | Hex escape breaks Palette meaning | Low | Med | Only wrap bare `#RRGGBB` in living non-law notes; never Genesis |
| R8 | Basename collisions mis-attributed by Dataview | Med | Low | Path-qualified links separate track (REC-MD-04); FM does not fix |
| R9 | `status` enum sprawl breaks Bug queries | Med | Med | Synonym map; document closed set; normalize on write |
| R10 | Commit too large / hard rollback | Med | Med | One git commit per batch; `migration_batch` stamp |
| R11 | Agents treat FM as law | Low | High | Callouts + `authority` ladder; dashboards anti-SoT |
| R12 | Stage B rename later invalidates path defaults | Low (deferred) | Med | Path map note versioned; re-run defaults ADR when Stage B happens |

---

## 11. Rollback

### 11.1 Unit of rollback

**Preferred:** `git revert` of the batch commit that applied FM.

### 11.2 Procedure

1. Identify `migration_batch` value (e.g. `M2-features`)  
2. `git log --grep=M2-features` or commit hash from batch report  
3. Revert that commit (Founder)  
4. Re-enable dual-read if G3 had removed fallbacks  
5. Re-run validation report — eligible coverage should match pre-batch  

### 11.3 Partial rollback

If only a folder is wrong:

1. Restore those paths from pre-batch commit (`git checkout <hash> -- <paths>`)  
2. Do **not** revert unrelated successful hub stamps without cause  
3. Log errata in Program V1 note  

### 11.4 Non-rollback cases

| Change | Rollback? |
|--------|-----------|
| Genesis edits | Must not occur; if they did → immediate restore from git + incident note |
| Frozen pack FM without ADR | Restore immediately |
| Template-only M0 | Revert templates; no content data loss |
| Hex body wraps | Revert carefully; visual only |

### 11.5 Backup before apply

Before each apply batch: clean working tree or stash; Founder commit optional snapshot tag `vault-fm-pre-M2`.

---

## 12. Coverage targets & gates

### 12.1 Definitions

| Population | Definition |
|------------|------------|
| **P-all** | All md under `docs/knowledge/` |
| **P-eligible** | §5.1 / §5.3 |
| **P-hubs** | H0–H2 living hubs + domain MOCs + Home + Context + envelope |
| **P-living-leaves** | Eligible notes with `lifecycle: living` after fill (excl templates) |
| **P-genesis** | `Genesis/**` — coverage via path implication, not FM % |

### 12.2 Numeric targets

| Metric | Baseline (audit) | Gate G1 (after M1–M2) | Gate G2 (after M3) | Gate G3 (harden) |
|--------|----------------:|----------------------:|-------------------:|-----------------:|
| Eligible notes with full core FM | ~55% authority-ish | **≥ 95%** | **≥ 98%** | **≥ 99%** |
| P-hubs full core + `graph_role` + `note_type` | low | **100%** | 100% | 100% |
| YAML tags on hubs/MOCs/dashboards/Feature MOCs | ~0 | ≥ 80% | **100%** | 100% |
| Genesis FM write count | n/a | **0** | **0** | **0** |
| UXA/UXI bulk FM write count | n/a | **0** | **0** | **0** unless ADR |
| `can_override_genesis: true` count | should be 0 | **0** | **0** | **0** |
| Dataview readiness score (audit dim) | 2.0 | ≥ 5.0 | ≥ 6.5 | **≥ 7.0** |
| Metadata consistency score | 5.5 | ≥ 7.0 | ≥ 7.5 | ≥ 8.0 |
| Dual-read fallbacks | required | required | required | removable only if G3 + Founder |

### 12.3 Gate checklist

**G1 — Queryable living vault**

- [ ] M0 templates shipped  
- [ ] M1 hubs 100%  
- [ ] M2 eligible ≥ 95% core FM  
- [ ] V-GEN / V-FRZ / V-COG clean  
- [ ] Dry-run reports archived under Program V1  

**G2 — Taxonomy usable**

- [ ] Hub/MOC/dashboard/Feature MOC tags 100%  
- [ ] Hex escape pass on living non-Genesis (sample OK)  
- [ ] Archive READMEs stamped  

**G3 — FM-first Dataview**

- [ ] Health dashboard shows FM coverage ≥ 98% eligible  
- [ ] Founder accepts removal of path fallbacks (or keep forever — valid choice)  
- [ ] Warn-only lint in place  
- [ ] Re-audit Dataview dim ≥ 7.0  

---

## 13. Dataview readiness

### 13.1 Field → consumer map

| FM field | Primary consumers |
|----------|-------------------|
| `lifecycle` | Health, Orphan, Roadmap, Frozen Registry |
| `knowledge_layer` | Authority Map, Eng/Product boards |
| `authority` | Authority Map, Risk (missing authority) |
| `status` | Bugs, ADRs, Program boards, Eng drafts |
| `last_reviewed` | Staleness widgets (30d / 90d) |
| `owner` | Bugs / ADR accountability |
| `can_override_genesis` | Risk critical strip |
| `graph_role` / `nav_role` | Workspace Index, graph filters |
| `note_type` | Future typed boards; Bases |
| `tags` | `type/dashboard`, domain filters |
| `program` / `artifact` | Program V1 / Roadmap widgets |
| `dashboard_id` | Founder Workspace Index |

### 13.2 Readiness levels

| Level | Meaning | When |
|------|---------|------|
| L0 | No queries | Audit now |
| L1 | Path-only dashboards | Automation Phase 0.6 |
| L2 | Dual-read FM + path | After M1 |
| L3 | FM-primary, path fallback | After M2 |
| L4 | FM-only WHERE (optional) | After G3 |

**This plan’s design target:** reach **L3**; L4 optional.

### 13.3 What metadata migration does *not* do for Dataview

- Does not install Dataview  
- Does not create `Dashboards/`  
- Does not invent wikilinks for orphan SLOs  
- Does not score Genesis internal density  

Those remain Automation / Graph / Dashboard tracks.

---

## 14. Worked examples (illustrative — not applied)

### 14.1 Feature MOC (target)

```yaml
---
authority: product
derived_from: Maps of Content/Product
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: domain-hub
nav_role: hub
note_type: NT-FEATURE-MOC
entity: Calendar
tags:
  - type/moc
  - domain/product
  - status/living
---
```

### 14.2 Program V1 spec (target)

```yaml
---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-PROG
graph_role: leaf
nav_role: leaf
note_type: NT-PROGRAM-LIVING
program: Program-V1-Obsidian-Knowledge-OS
artifact: metadata-migration-plan
tags:
  - type/index
  - domain/roadmap
  - status/living
migration_batch: design-only
---
```

### 14.3 Genesis note (no write)

```text
Path: Genesis/P5 Constitution/...
Implied: knowledge_layer=KL-LAW, graph_role=law, lifecycle=sealed
Written FM: none (C1)
```

---

## 15. Explicit non-actions (this deliverable)

- No frontmatter backfill executed  
- No template rewrite executed  
- No plugin install  
- No Dataview queries added  
- No Genesis / frozen pack edits  
- No commits / pushes  

---

## 16. Authority statement

This plan is **operations / Program V1**. It cannot override Genesis. Path-implied law and frozen path rules outrank any convenience that would require editing sealed corpora.

---

## 17. Closeout

| Item | Status |
|------|--------|
| Metadata Migration Plan | **COMPLETE** (design) |
| Implementation | **NONE** |
| Genesis | **UNTOUCHED** |
| Frozen packs | **UNMOVED / unedited** |

**Next (Founder):** Accept / amend enums & phases → authorize **M0** (templates) with Automation Phase 0 → then M1 dry-run.

---

**Stop.**
