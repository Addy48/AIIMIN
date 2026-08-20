---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: graph-engineering-v1
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Graph Engineering v1.0

**Obsidian graph as engineered system — not accidental link residue.**

| Field | Value |
|-------|-------|
| Date | 2026-07-25 |
| Parent | [[02_Vault_Architecture_Specification]] · [[01_Vault_Deep_Audit_Report]] |
| Mode | **Specification only — zero implementation** |
| Scope | Global graph · local graph · backlinks · color · filter · note-type contracts |
| Genesis | Immutable — envelope links only; no required edits inside `Genesis/` |
| Frozen packs | Stay put — prefer living → frozen inbound; no required frozen rewrites |

Aligns with KOS REC-GR-* and hub tiers H0–H4.

---

## 0. Engineering goals

| Goal | Target |
|------|--------|
| Readable global clusters | 7 named clusters visible with color groups |
| Living note connectivity | ≥95% living notes have ≥1 in + ≥1 out |
| Hub clarity | H0/H1 nodes visually larger via degree, not fake size hacks |
| Law safety | No graph rule forces Genesis or frozen mutation |
| Local graph usefulness | Depth/filter standards per note type |
| Backlink trust | Path-qualified links for colliding basenames |

---

## 1. Note relationship model

### 1.1 Edge vocabulary (canonical)

Edges are **logical**. Obsidian stores undirected/out-link facts; authors encode type by **link placement + section heading**.

| Code | Name | Direction (authoring) | Strength | Section label (recommended) |
|------|------|----------------------|----------|------------------------------|
| E-parent | Parent | Leaf → Hub/Index | Required | `## Parent` |
| E-child | Child | Hub/Index → Leaf | Required on hubs | `## Children` or table |
| E-authority | Authority | Any living → Law gateway or frozen Arch/Intel index | Required when domain touches product behavior | `## Authority` |
| E-sequence | Sequence | Program A → Program B | Optional spine | `## Sequence` |
| E-peer | Sibling / peer | Leaf ↔ Leaf same parent | Optional (1+ when class requires) | `## Siblings` / `## Related` |
| E-freeze | Freeze cite | Living hub → certificate | Required on Founder/Roadmap hubs | `## Freeze registry` |
| E-supersedes | Supersedes | Living → Archive | When replacing cold SoT | `## Supersedes` |
| E-bridge | Cross-cluster | Hub ↔ Hub or Feature ↔ Arch | Controlled set | `## Bridges` |
| E-see | Weak see-also | Any → Any | Max 5; never substitutes E-parent | `## See also` |

**Forbidden:** Orphan “link salad” with no section semantics. **Forbidden:** Living note claiming authority over Genesis.

### 1.2 Relationship axioms

1. **Single parent (living):** Exactly one primary `E-parent` per living leaf (except Home, which has none).
2. **Hub fan-out:** Every H1–H3 hub maintains explicit `E-child` list for its owned set (may be incomplete for Genesis internals — see NT-LAW).
3. **Authority upward:** Product/Eng/Architecture expression cite Law via Genesis MOC or named P5/P8/P9 entry — never invent law in the edge.
4. **Frozen preference:** Living notes link **into** frozen `00_INDEX` / certificates; frozen notes are not required to link out.
5. **Cold isolation:** Archive notes receive `E-supersedes` from living replacements; cold notes do not parent living notes.
6. **Path-qualified when ambiguous:** If basename collides, wikilink must include path.

### 1.3 Graph role enum (`graph_role`)

| Role | Typical notes | Global graph intent |
|------|---------------|---------------------|
| `boot` | Home | Always visible entry |
| `context` | Current-Context | Ops focal; small cluster |
| `master-hub` | Knowledge-Graph MOC | Star of MOCs |
| `domain-hub` | Domain MOCs | Cluster centers |
| `struct-hub` | Constitution/Governance/Interaction hubs | Expression bridges |
| `index` | `00_INDEX`, Feature Index, manifests | Pack / folder routers |
| `leaf` | Most entity notes | Peripheral |
| `certificate` | Freeze / completion / publication | Satellite of index |
| `dashboard` | Future Dashboards/* | Derived; low authority |
| `cold` | Archive | Hidden by default filter |
| `template` | `_templates/*` | Hidden |
| `law` | `Genesis/**` | Visible in Law cluster; no edit SLO |
| `envelope` | Genesis MOC | Living stand-in for law navigation |

---

## 2. Cluster architecture

### 2.1 Named clusters (global graph)

| Cluster ID | Name | Path / membership | Center (hub) | Allowed bridges |
|------------|------|-------------------|--------------|-----------------|
| C-LAW | Law | `Genesis/**` | [[Maps of Content/Genesis]] (envelope, outside cluster) | → C-EXPR only via envelope |
| C-EXPR | Expression | `Constitution/`, `Governance/`, `Interaction Architecture/`, `Glossary/`, Rule/Invariant indexes | Struct hubs + Constitution/Interaction MOCs | → C-LAW (cite), → C-ARCH (cite) |
| C-ARCH | Architecture & Evidence | `Roadmap/UX-Architecture/**`, `Roadmap/UX-Intelligence/**` | Pack `00_INDEX` notes | → C-EXPR, → C-PROD (flows↔features) |
| C-PROG | Programs & Ops Roadmap | Other `Roadmap/**`, `Operations/` | Roadmap MOC | → all (orchestration) |
| C-PROD | Product & Features | `01_PRODUCT/**`, `09_FEATURES/**` | Product MOC · Feature MOCs | → C-ARCH, → C-BUILD, → C-EXPR |
| C-BUILD | Engineering & Native | `02_`–`08_` (excl pure Design if preferred), `03_DATABASE`, `04_API`, `05_FRONTEND`, `06_AI`, `07_DEPLOYMENT`, `17_NATIVE_APP_V2/**` | Engineering MOC · Architecture MOC | → C-PROD, → C-ARCH, → C-LAW (via envelope) |
| C-DESIGN | Design | `08_DESIGN/**`, Design MOC | Design MOC | → C-LAW (P8 cite via envelope), → C-ARCH |
| C-OPS | Operations & Memory | `15_MEMORY/**`, `11_BUGS`, `12_SPRINTS`, `13_MEETINGS`, `14_PROMPTS`, `16_DOCUMENTATION`, `Founder/**` (ops certs), Program V1 living | Current-Context · Founder MOC | → C-PROG |
| C-COLD | Cold | `Archive/**`, `99_ARCHIVE/**` | Archive READMEs | ← living `E-supersedes` only |
| C-META | Meta | `Maps of Content/**`, `_templates/**`, future `Dashboards/**`, `_manifest` docs | Home · Knowledge-Graph | → all hubs |

**Design note:** C-LAW nodes may appear sparse internally (accepted). Visual “Law” presence = envelope + colored Genesis paths.

### 2.2 Cluster adjacency (intended)

```text
C-META (Home / KG)
   ├── C-LAW (Genesis paths) ← envelope from Genesis MOC
   ├── C-EXPR
   ├── C-ARCH (frozen UXA / UXI)
   ├── C-PROG
   ├── C-PROD ←→ C-BUILD
   ├── C-DESIGN
   ├── C-OPS
   └── C-COLD (filtered out by default)
```

### 2.3 Bridge budget

Cross-cluster `E-bridge` edges should be **hub-mediated**, not leaf-to-leaf sprawl.

| From | To | Bridge owners |
|------|-----|---------------|
| C-PROD | C-ARCH | Feature MOC ↔ UXA flow / phase index |
| C-BUILD | C-PROD | Eng note ↔ Feature MOC |
| C-BUILD | C-ARCH | Eng MOC ↔ UXA `00_INDEX` |
| C-EXPR | C-LAW | Struct hub ↔ Genesis MOC / P5·P8·P9 entry |
| C-PROG | C-ARCH | Roadmap MOC ↔ Publication Record / Intelligence INDEX |
| C-OPS | C-PROG | Current-Context ↔ active program INDEX |

**Anti-pattern:** Every feature leaf linking five Genesis deep files. Use Feature MOC + Genesis MOC.

---

## 3. Hub hierarchy (graph topology)

| Tier | Role | Degree intent | Notes |
|------|------|---------------|-------|
| H0 | Boot + Master | Very high fan-out | `00_HOME`, `Maps of Content/00_Knowledge-Graph` |
| H1 | Domain MOC | High fan-out | Genesis, Roadmap, Engineering, Product, Design, Architecture, Research, Founder, Interaction-Architecture, Constitution |
| H2 | Structural hub | Medium–high | `Constitution/00_*`, `Governance/00_*`, `Interaction Architecture/00_*`, `Founder/00_*` |
| H3 | Package / folder index | Medium | `00_INDEX`, Feature Index, Native WORKFLOW index |
| H4 | Entity MOC | Medium | `09_FEATURES/<Entity>/` MOC |
| L | Leaf | Low (2–6 out) | Default |
| X | Certificate | Low out; inbound from H2/H3 | Freeze / completion / publication |
| D | Dashboard | Out to sources; not parent of law | Derived |

**Hierarchy rule:** Child may link parent; parent must list child (living). Skip-level parent (leaf → H0) allowed only for boot references, not as primary parent.

---

## 4. Backlink strategy

### 4.1 Principles

| Principle | Rule |
|-----------|------|
| Resolve | Prefer `[[path/without/md\|Label]]` when stem collides |
| Semantics | Backlinks gain meaning from **who** links + **section** |
| Inbound SLO | Living leaf: ≥1 inbound from parent index/MOC |
| Outbound SLO | Living leaf: ≥1 outbound to parent |
| Hub backlinks | H1 must be linked from Knowledge-Graph + Home (or KG alone + Home→KG) |
| Law | Do not require Genesis notes to gain new backlinks via self-edit; envelope creates **navigational** backlinks to entrypoints only |
| Frozen | Living hubs create inbound to frozen indexes/certificates; internal frozen backlink gaps accepted (KOS REC-GR-05) |
| Quality over quantity | Cap `E-see` at 5 |

### 4.2 Backlink quality grades

| Grade | Meaning |
|-------|---------|
| A | Path-qualified + correct cluster + section-typed |
| B | Resolves uniquely; section missing |
| C | Ambiguous basename |
| F | Broken / glob / wrong target |

**v1 bar for new living edits:** Grade A or B only.

### 4.3 Backlink ownership

| Note type | Who is responsible for inbound |
|-----------|--------------------------------|
| Living leaf | Parent hub/index author |
| H1 MOC | Knowledge-Graph + Home maintainer |
| Frozen index | Living Roadmap / Interaction / Founder hubs |
| Genesis entrypoint | Genesis MOC envelope |
| Cold | Living superseding note only |

---

## 5. Graph coloring strategy

Obsidian `colorGroups` use **search queries** (path/tag). Current vault: `colorGroups: []` — this spec defines target groups.

### 5.1 Color tokens (aligned to AIIMIN palette intent)

| Token | Hex | Use |
|-------|-----|-----|
| accent | `#ff6b35` | Law / Genesis |
| done | `#10b981` | Frozen architecture & evidence |
| hub | `#3b82f6` | MOCs / meta hubs (blue = navigation, not brand chrome) |
| product | `#f59e0b` | Product / features |
| build | `#8b5cf6` | Engineering / native (distinct from brand purple OAuth — graph-only) |
| design | `#ec4899` | Design |
| ops | `#6b7280` | Ops / memory / prompts |
| program | `#14b8a6` | Living roadmap programs |
| cold | `#374151` | Archive (usually filtered out) |
| expr | `#a78bfa` | Expression hubs |

*Graph colors are analytical, not product UI. Product UI palette lock unchanged.*

### 5.2 Target `colorGroups` (implementation later)

Order = paint order (first match wins in Obsidian — put more specific first).

| Priority | Query (Obsidian search) | Color | Cluster |
|---------:|-------------------------|-------|---------|
| 1 | `path:_templates` | cold | hide via filter preferably |
| 2 | `path:99_ARCHIVE` OR `path:Archive` | `#374151` | C-COLD |
| 3 | `path:Genesis` | `#ff6b35` | C-LAW |
| 4 | `path:Roadmap/UX-Architecture` | `#10b981` | C-ARCH |
| 5 | `path:Roadmap/UX-Intelligence` | `#059669` | C-ARCH |
| 6 | `path:Maps of Content` | `#3b82f6` | C-META |
| 7 | `path:Constitution` OR `path:Governance` OR `path:Interaction Architecture` OR `path:Glossary` OR `path:Rule Index` OR `path:Invariant Index` | `#a78bfa` | C-EXPR |
| 8 | `path:09_FEATURES` OR `path:01_PRODUCT` | `#f59e0b` | C-PROD |
| 9 | `path:17_NATIVE_APP_V2` OR `path:02_ARCHITECTURE` OR `path:03_DATABASE` OR `path:04_API` OR `path:05_FRONTEND` OR `path:06_AI` OR `path:07_DEPLOYMENT` | `#8b5cf6` | C-BUILD |
| 10 | `path:08_DESIGN` | `#ec4899` | C-DESIGN |
| 11 | `path:Roadmap` | `#14b8a6` | C-PROG |
| 12 | `path:15_MEMORY` OR `path:14_PROMPTS` OR `path:11_BUGS` OR `path:12_SPRINTS` OR `path:Founder` OR `path:16_DOCUMENTATION` | `#6b7280` | C-OPS |

Optional later: tag-based groups (`tag:#status/frozen`) after metadata backfill.

### 5.3 Display defaults (global)

| Setting | v1 value | Why |
|---------|----------|-----|
| showTags | false | Tags not ready; hex noise |
| showAttachments | false | Focus notes |
| hideUnresolved | true | Already on |
| showOrphans | false (default view) | Use Orphan dashboard / filter view instead |
| showArrow | true | Direction of authoring outlinks |
| centerStrength | 0.4–0.55 | Keep hubs from collapsing |
| linkDistance | 220–280 | Read labels |

---

## 6. Graph filtering strategy

### 6.1 Saved views (logical — implement as search strings)

| View ID | Name | Search / filter | When to use |
|---------|------|-----------------|-------------|
| GV-DEFAULT | Operating graph | `-path:_templates -path:Archive -path:99_ARCHIVE` | Daily |
| GV-LAW | Law + envelope | `path:Genesis OR file:(Genesis) OR path:"Maps of Content/Genesis"` | Constitutional work |
| GV-ARCH | Frozen architecture | `path:Roadmap/UX-Architecture OR path:Roadmap/UX-Intelligence` | Downstream consumers |
| GV-PROD | Product surface | `path:09_FEATURES OR path:01_PRODUCT OR path:"Maps of Content/Product"` | Feature work |
| GV-BUILD | Engineering | path queries for eng folders + Engineering MOC | Implementation |
| GV-FULL | Everything | empty search, orphans on | Rare audits |
| GV-ORPHAN | Orphan hunt | showOrphans true + living path excludes | KOS hygiene |
| GV-COLD | Cold only | `path:Archive OR path:99_ARCHIVE` | Provenance |

### 6.2 Filter rules

1. **Default never includes** `_templates`, `Archive`, `99_ARCHIVE`, `Daily Notes` (if noisy).
2. **Genesis** included in GV-DEFAULT as colored cluster (envelope still primary nav).
3. **Attachments off** unless debugging Assets.
4. **Tags off** until tag taxonomy live.
5. Agents: do not “browse full graph”; use GV-* intent + MOCs.

---

## 7. Local graph standards

| Note type class | Depth | Incoming | Outgoing | Filter extras | Purpose |
|-----------------|------:|:--------:|:--------:|---------------|---------|
| Boot / master-hub | 2 | on | on | exclude cold/templates | See MOC ring |
| Domain / struct hub | 2 | on | on | exclude cold | Cluster neighborhood |
| Package index | 2 | on | on | stay in pack path | Pack integrity |
| Feature MOC | 2 | on | on | optional Arch path | Feature system |
| Living leaf | 1 | on | on | none | Immediate parent/peers |
| Certificate | 1 | on | on | none | Who freezes what |
| Dashboard | 1–2 | on | on | none | Sources only |
| Law (Genesis) | 1 | on | on | path Genesis | Inspect only; do not “fix” via local graph |
| Cold | 1 | on | on | cold path | Provenance |

**Local graph force:** Prefer higher repel on hubs so children do not cover labels.

**Standard workflow:** Open note → Local graph depth per table → confirm Parent/Children visible → then edit links.

---

## 8. Note type contracts

Each type defines: **Graph role** · **Required outbound** · **Required inbound** · **Parent rules** · **Child rules** · **Sibling rules**.

Exempt from living SLOs unless noted: `NT-LAW`, `NT-COLD`, `NT-TEMPLATE`, and frozen internals under `NT-FROZEN-LEAF`.

---

### NT-BOOT — Home (`00_HOME`)

| Field | Contract |
|-------|----------|
| Graph role | `boot` |
| Required outbound | Current-Context; Knowledge-Graph MOC; Genesis MOC; Roadmap MOC; Engineering MOC; active program INDEX (≤5) |
| Required inbound | None required (root). Recommend: Knowledge-Graph → Home |
| Parent rules | No parent |
| Child rules | Must not list all vault children; only spine |
| Sibling rules | None |

---

### NT-CONTEXT — Current Context

| Field | Contract |
|-------|----------|
| Graph role | `context` |
| Required outbound | Home; active program INDEX/spec; Touch paths as wikilinks |
| Required inbound | From Home |
| Parent rules | Parent = Home |
| Child rules | No children |
| Sibling rules | Optional link to prior handoff note if exists |

---

### NT-MASTER-HUB — Knowledge-Graph MOC

| Field | Contract |
|-------|----------|
| Graph role | `master-hub` |
| Required outbound | Home; **every** domain MOC; struct hubs list; Dashboards index (when exists); Cold README pointers |
| Required inbound | From Home; from each domain MOC (bidirectional) |
| Parent rules | Parent = Home |
| Child rules | Children = all H1 MOCs |
| Sibling rules | Peer to Home only in boot sense |

---

### NT-DOMAIN-MOC — H1 MOC

| Field | Contract |
|-------|----------|
| Graph role | `domain-hub` |
| Required outbound | Home or Knowledge-Graph; primary struct/package indexes of domain; ≥1 authority (Genesis MOC or Arch INDEX as applicable) |
| Required inbound | From Knowledge-Graph; ≥1 from Home spine **or** via KG |
| Parent rules | Parent = Knowledge-Graph (primary) |
| Child rules | Must link owned H2/H3/H4 set (living). Genesis MOC lists entrypoints only (envelope), not all 275 law files |
| Sibling rules | Link 1–3 peer MOCs used in same workflows |

---

### NT-STRUCT-HUB — Constitution / Governance / Interaction / Founder hubs

| Field | Contract |
|-------|----------|
| Graph role | `struct-hub` |
| Required outbound | Domain MOC; Genesis entrypoints (P5/P7/P9 as relevant); related frozen Arch INDEX if interaction |
| Required inbound | From matching domain MOC |
| Parent rules | Parent = matching H1 MOC |
| Child rules | Indexes, certificates, key expression notes |
| Sibling rules | Peer expression hubs (Constitution ↔ Governance ↔ Interaction) |

---

### NT-PACKAGE-INDEX — `00_INDEX` / program index

| Field | Contract |
|-------|----------|
| Graph role | `index` |
| Required outbound | Parent Roadmap/domain MOC (living indexes). **Frozen indexes:** no new required outbound (C2) |
| Required inbound | From Roadmap MOC or domain MOC (living → frozen OK) |
| Parent rules | Living: parent = Roadmap or Program hub. Frozen: logical parent = Roadmap MOC via inbound only |
| Child rules | Living: list phases/children. Frozen: existing children stand; living MOC may mirror key children |
| Sibling rules | Sequence links to prior/next program INDEX |

---

### NT-FEATURE-MOC — Feature entity MOC

| Field | Contract |
|-------|----------|
| Graph role | `domain-hub` (H4) |
| Required outbound | Product MOC or Features Index; Changelog; ≥1 Eng or Arch cite if behavior exists; `/m` ceiling note if mobile-touching |
| Required inbound | From Features Index / Product MOC |
| Parent rules | Parent = Features Index or Product MOC |
| Child rules | Entity notes, changelog, API/DB pointers |
| Sibling rules | Related features (max 5) |

---

### NT-FEATURE-LEAF — Feature supporting note / changelog entry page

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Feature MOC (E-parent) |
| Required inbound | From Feature MOC |
| Parent rules | Exactly one Feature MOC |
| Child rules | None (changelog append-only text OK without child links) |
| Sibling rules | Optional peer feature leaves |

---

### NT-ENG-LEAF — Architecture / API / DB / Frontend / AI / Deploy / Native note

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Engineering MOC or folder index; Monorepo or Overview when system-level; related Feature MOC if feature-bound |
| Required inbound | From Engineering MOC or parent index |
| Parent rules | One eng parent hub/index |
| Child rules | Subpages only if split intentionally |
| Sibling rules | Peer eng notes in same subsystem (1+) |

---

### NT-DESIGN-LEAF — Palette / design living notes

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Design MOC; Genesis MOC or P8 Visual cite via envelope (not deep unsupported copies) |
| Required inbound | From Design MOC |
| Parent rules | Design MOC |
| Child rules | None required |
| Sibling rules | Optional |

---

### NT-ADR — Decision / ADR

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Decisions index or Founder MOC; affected Feature/Eng notes; Genesis MOC if constitutional impact (ADR only — still cannot edit Genesis) |
| Required inbound | From Decisions index / Founder hub |
| Parent rules | `10_DECISIONS` index or Founder |
| Child rules | None |
| Sibling rules | Related ADRs |

---

### NT-CERTIFICATE — Freeze / completion / publication

| Field | Contract |
|-------|----------|
| Graph role | `certificate` |
| Required outbound | **Frozen:** none new. **Living certs:** parent Founder/program index |
| Required inbound | From Founder MOC and/or Roadmap MOC and/or package INDEX (living links in) |
| Parent rules | Logical parent = package index; enforced by inbound |
| Child rules | None |
| Sibling rules | Peer certificates in same pack (optional living list) |

---

### NT-FROZEN-LEAF — Notes inside frozen packs (non-index)

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | **None** (do not edit to satisfy SLO) |
| Required inbound | **None required**; nice-to-have via living mirror lists |
| Parent rules | Logical parent = frozen package index (may already exist) |
| Child rules | N/A |
| Sibling rules | N/A |
| Graph role note | Accepted orphans inside pack |

---

### NT-LAW — Genesis note

| Field | Contract |
|-------|----------|
| Graph role | `law` |
| Required outbound | **None** (C1 — do not edit Genesis for graph) |
| Required inbound | **Entrypoints only** must be listed on Genesis MOC (living). Deep law files: no inbound SLO |
| Parent rules | Internal Genesis structure unchanged |
| Child rules | Unchanged |
| Sibling rules | Unchanged |
| Envelope | All graph obligations fall on `NT-ENVELOPE` |

---

### NT-ENVELOPE — Genesis MOC (living law gateway)

| Field | Contract |
|-------|----------|
| Graph role | `envelope` |
| Required outbound | Home; Knowledge-Graph; all P1–P9 entry indexes; key freeze certificates **paths**; Expression hubs |
| Required inbound | From Home; Knowledge-Graph; Constitution/Interaction/Governance MOCs |
| Parent rules | Parent = Knowledge-Graph / Home spine |
| Child rules | Entrypoints + certificates only (not full 275) |
| Sibling rules | Peer domain MOCs |

---

### NT-PROGRAM-LIVING — Program V1 / Program 0 living notes

| Field | Contract |
|-------|----------|
| Graph role | `index` or `leaf` |
| Required outbound | Roadmap MOC; program `00_INDEX`; related frozen packs for sequence |
| Required inbound | From Roadmap MOC; from Current-Context when active |
| Parent rules | Roadmap MOC |
| Child rules | Specs, audits, phase notes in program folder |
| Sibling rules | Sequence to adjacent programs |

---

### NT-PROMPT — Agent prompt note (`14_PROMPTS`)

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Prompts index or Engineering/Docs MOC; Home or Proof-or-Stop as relevant |
| Required inbound | From prompts index |
| Parent rules | `14_PROMPTS` index (create if missing) |
| Child rules | None |
| Sibling rules | Related prompts |
| Note | Do not delete Genesis supporting copies; living SoT is `14_PROMPTS` |

---

### NT-BUG / NT-SPRINT / NT-MEETING

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Folder index or Current-Context if active; related Feature/Eng |
| Required inbound | From folder index |
| Parent rules | `11_BUGS` / `12_SPRINTS` / `13_MEETINGS` index |
| Child rules | None |
| Sibling rules | Optional |

---

### NT-DASHBOARD — Dashboard note

| Field | Contract |
|-------|----------|
| Graph role | `dashboard` |
| Required outbound | Knowledge-Graph; source MOCs queried; anti-SoT disclaimer targets Home |
| Required inbound | From Knowledge-Graph; Home |
| Parent rules | Dashboards index |
| Child rules | None (queries, not children) |
| Sibling rules | Peer dashboards |

---

### NT-COLD — Archive note

| Field | Contract |
|-------|----------|
| Graph role | `cold` |
| Required outbound | None required |
| Required inbound | Optional from living `E-supersedes` |
| Parent rules | Archive README |
| Child rules | None |
| Sibling rules | None |
| Filter | Hidden in GV-DEFAULT |

---

### NT-TEMPLATE — `_templates/*`

| Field | Contract |
|-------|----------|
| Graph role | `template` |
| Required outbound | None |
| Required inbound | None |
| Parent rules | Templates folder only |
| Child rules | N/A |
| Sibling rules | N/A |
| Filter | Always excluded from operating graph |

---

### NT-MEMORY-PACK — `15_MEMORY` AI packs (non-Context)

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Current-Context or Memory index; Home |
| Required inbound | From Memory index / Context when relevant |
| Parent rules | Memory index |
| Child rules | None |
| Sibling rules | Peer packs |

---

### NT-ERRATA — Living errata for frozen packs

| Field | Contract |
|-------|----------|
| Graph role | `leaf` |
| Required outbound | Frozen pack INDEX (cite); Roadmap MOC; states “does not amend frozen text” |
| Required inbound | From Roadmap MOC |
| Parent rules | Roadmap MOC |
| Child rules | None |
| Sibling rules | None |

---

## 9. Compliance matrix (quick)

| Type | Out SLO | In SLO | Edit Genesis? | Edit frozen? |
|------|---------|--------|---------------|--------------|
| Living leaf/hub | Yes | Yes | No | No |
| Envelope | Yes | Yes | No | No |
| Law | No | Entrypoints via envelope | No | No |
| Frozen leaf | No | No | No | No |
| Frozen index | No new | Yes (from living) | No | No unless ADR |
| Cold / template | No | No | No | No |

---

## 10. Authoring checklist (per living note edit)

1. Set / confirm `graph_role` (optional FM) and knowledge layer.
2. Add `## Parent` with exactly one primary parent link.
3. Ensure parent lists this note under Children (if hub).
4. Add Authority link if behavior/product/eng.
5. Path-qualify colliding stems.
6. Cap See also ≤5.
7. Open local graph at prescribed depth; confirm parent visible.
8. Do not edit Genesis or frozen packs to “fix” the graph.

---

## 11. Implementation mapping (future — not now)

| Artifact | Action when Founder authorizes |
|----------|--------------------------------|
| `.obsidian/graph.json` | Apply colorGroups + default filter search |
| Living MOCs / hubs | Satisfy NT-* contracts |
| `Dashboards/DB-HEALTH` | Query violations of Out/In SLO |
| Lint script | Flag living notes missing E-parent |

**This v1 document does not modify `graph.json` or notes.**

---

## 12. Versioning

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-07-25 | Initial Graph Engineering from audit + KOS architecture |

Amendments require Founder accept. Graph Engineering cannot override Genesis.

---

## 13. Closeout

| Item | Status |
|------|--------|
| Graph Engineering v1.0 | **COMPLETE** (design) |
| Implementation | **NONE** |
| Genesis / frozen | **UNTOUCHED** |
