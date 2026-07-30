---
authority: operations
derived_from: docs/knowledge scan 2026-07-25 · Program V1 Obsidian Knowledge OS
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: vault-deep-audit
audit_only: true
modifications: none
---

# Program V1 — Obsidian Vault Deep Audit Report

**Date:** 2026-07-25  
**Scope:** `docs/knowledge/` (entire Obsidian vault)  
**Mode:** **Audit only — zero fixes applied**  
**Method:** Filesystem inventory + frontmatter parse + wikilink graph resolve (Python)

---

## Executive verdict

Vault is a **strong constitutional nucleus** (Genesis 275 + published UX Architecture/Intelligence) sitting inside a **transitional dual folder system** with **weak graph glue**. Discoverability of law/roadmap is decent via Home/MOCs; **graph density, orphans, tags, and Dataview readiness are poor**. Engineering notes are thin relative to product law.

**Composite score: 5.3 / 10** (weighted).  
**Ready for Knowledge OS hardening:** Yes — after prioritized graph/metadata pass (see Top 100).  
**Ready to treat as polished Obsidian PKM:** No.

---

## Evidence snapshot (measured)

| Metric | Value |
|--------|------:|
| Markdown notes | **609** (includes this audit report) |
| Genesis | 275 |
| Roadmap | 108 |
| Archive + 99_ARCHIVE | 43 + 16 |
| Native V2 notes | 38 |
| Features | 32 |
| MOCs (`Maps of Content/`) | 11 |
| UX Architecture notes | 79 |
| UX Intelligence notes | 16 |
| Notes with YAML frontmatter block | **372 / 609 (61%)** |
| Notes with `authority` / `can_override_genesis` (or sibling) | **334 / 609 (55%)** |
| Notes with YAML `tags:` | **1** |
| Dataview / dataviewjs code blocks | **0** |
| Notes with ≥1 wikilink out | **242 / 609 (40%)** |
| Wikilink edges (approx) | **1352** |
| Edges per note | **2.22** |
| Approx orphans (no resolvable inbound) | **309 (~51%)** — Genesis **197** |
| Zero outbound (dead-end writers) | **367 (~60%)** |
| Both orphan + zero outbound | **251** |
| Duplicate basenames | **74** |
| Broken / unresolvable wikilink targets | **1** (`09_FEATURES/Mobile/*`) |
| Inline `#tags` | mostly **false positives** (hex colors) |
| Notes mentioning `FROZEN` | 101 |

---

## Scored dimensions (0–10)

Weights sum 100. Score = weighted mean.

| # | Dimension | Score | Weight | Weighted | Rationale |
|---|-----------|------:|-------:|---------:|-----------|
| 1 | Folder architecture | 6.0 | 8 | 0.48 | Dual system: numbered `00`–`17` + Genesis/Roadmap/Archive hubs; Stage B rename deferred |
| 2 | Graph connectivity | 4.0 | 8 | 0.32 | Only 40% notes outlink; Genesis mostly island (75/275 with outlinks) |
| 3 | Orphan notes | 2.5 | 7 | 0.18 | 309 orphans (~51%); Genesis 197; many Roadmap phase audits unlinked |
| 4 | Backlink quality | 5.0 | 6 | 0.30 | Links resolve in clusters; 71 basename collisions hurt Obsidian resolve |
| 5 | Metadata consistency | 5.5 | 7 | 0.39 | 55% full authority FM; 39% no FM; lifecycle mostly living/archive |
| 6 | MOC coverage | 7.0 | 6 | 0.42 | 11 MOCs cover major hubs; Founder MOC thin (1 outlink) |
| 7 | Hub coverage | 6.0 | 5 | 0.30 | Constitution/Governance/Interaction/Research/Founder hubs exist; Glossary/Rule/Invariant weak as singles |
| 8 | Dataview readiness | 2.0 | 5 | 0.10 | Zero queries; tags unusable; FM incomplete for queries |
| 9 | Tag consistency | 2.0 | 4 | 0.08 | No real taxonomy; `#ff6b35`-class noise |
| 10 | Naming conventions | 7.0 | 4 | 0.28 | No spaces in filenames; numbered discipline; folder spaces (`Maps of Content`) |
| 11 | Navigation depth | 7.0 | 3 | 0.21 | Mostly 2–4; 8 deep Genesis supporting paths |
| 12 | Vault discoverability | 6.5 | 6 | 0.39 | Home + Current-Context strong entry; graph browse weak |
| 13 | Knowledge duplication | 4.0 | 6 | 0.24 | Archive + 99_ARCHIVE + Genesis supporting copies of prompts/design |
| 14 | Dead ends | 3.5 | 4 | 0.14 | 366 zero-outbound notes |
| 15 | Graph clusters | 5.0 | 4 | 0.20 | Clear clusters (Genesis / Roadmap / Features) poorly bridged |
| 16 | Graph density | 4.0 | 4 | 0.16 | 2.22 edges/note — sparse for 609-node vault |
| 17 | Authority chains | 7.5 | 6 | 0.45 | Clear Genesis > Architecture expression; FM authority on half |
| 18 | Frozen artifact discoverability | 7.5 | 5 | 0.38 | UXA published on Home; FROZEN string common; phase indexes exist |
| 19 | Roadmap discoverability | 7.5 | 4 | 0.30 | Roadmap MOC + Home + Current-Context |
| 20 | Engineering discoverability | 4.0 | 4 | 0.16 | Frontend/AI = 1 note each; Eng MOC exists but thin folders |

**Weighted composite: ≈ 5.3 / 10**

### Score bands

| Band | Meaning |
|------|---------|
| 8–10 | Production Obsidian OS |
| 6–7 | Usable with gaps |
| 4–5 | Structural debt blocks PKM power |
| 0–3 | Critical failure |

---

## Dimension findings (detail)

### Folder architecture
- Parallel taxonomies: Brain-OS numbered folders (`01_PRODUCT`…`17_*`) vs post-migration hubs (`Genesis/`, `Roadmap/`, `Constitution/`, `Maps of Content/`).
- Dual archives: `Archive/` + `99_ARCHIVE/`.
- `_templates/` (9) present; Assets thin.

### Graph connectivity / density / clusters
- Density low (1.97).
- Genesis: 275 notes, only ~75 emit wikilinks — constitutional island.
- Roadmap UX Architecture well self-linked; many `90_*` audit notes still orphaned from MOCs.
- Clusters not bridged: Genesis ↛ Features; Engineering ↛ Genesis weakly.

### Orphans / dead ends / backlinks
- ~51% orphan (309); ~60% no outbound (367); 251 both.
- Basename collisions (74) degrade Obsidian resolve certainty.

### Metadata / tags / Dataview
- Half vault lacks full authority FM.
- Tags essentially absent; hex colors pollute `#` parse.
- Dataview not used — Knowledge OS automation blocked.

### MOC / hub
- 11 MOCs — good skeleton.
- Weak: Founder MOC (1 out), Research/Constitution hubs modest.
- Knowledge-Graph MOC only 2 inbound.

### Naming / depth
- Filenames clean (no spaces).
- Folder names with spaces OK for Obsidian, awkward for CLI.
- Deep Genesis supporting plans (depth 5+).

### Duplication
- Prompts duplicated: `14_PROMPTS/*` vs `Genesis/P2/.../prompts/*`.
- Design-Bible live stub + Archive superseded.
- Palette in `08_DESIGN` + Genesis P4 supporting.

### Authority chains
- Strength: `can_override_genesis: false` on ops notes; UX Architecture publication states non-amendment of P9.
- Weakness: inconsistent FM on Genesis internals / older notes.

### Frozen / roadmap / engineering discoverability
- **Roadmap / UX Architecture / Intelligence:** discoverable from Home + MOC + Context.
- **Engineering:** `05_FRONTEND` (1), `06_AI` (1), `07_DEPLOYMENT` (2) — under-documented vs Genesis mass.
- **Native:** 38 notes — better than web eng folders.

---

## Top 100 improvements (impact-ranked)

Impact = expected lift to composite Knowledge OS quality. **Do not implement in this audit.**

| Rank | Improvement | Primary dimensions | Impact |
|-----:|-------------|-------------------|--------|
| 1 | Wikilink every Genesis index/MOC to all P1–P9 phase indexes (hub→spoke) | Graph, orphans, frozen discoverability | Critical |
| 2 | Add inbound links from Genesis MOC + Home to all frozen certificates | Frozen discoverability, graph | Critical |
| 3 | Standardize frontmatter on **all** 608 notes (`authority`, `status`, `owner`, `lifecycle`, `can_override_genesis`) | Metadata, Dataview | Critical |
| 4 | Create Dataview dashboards: Living / Frozen / Orphans / By authority | Dataview, discoverability | Critical |
| 5 | Bridge Roadmap ↔ Genesis with bidirectional MOC links (expression vs law) | Authority, clusters | Critical |
| 6 | Link all UX-Architecture phase `00_INDEX` + certificates into Roadmap MOC + Knowledge-Graph | Roadmap, frozen | Critical |
| 7 | Reduce Genesis orphans: each Genesis note ≥1 inbound from its phase index | Orphans, Genesis cluster | Critical |
| 8 | Ensure every note has ≥1 outbound (related/parent/MOC) — kill dead ends | Dead ends | Critical |
| 9 | Resolve 71 duplicate basenames (rename or disambiguate paths in links) | Backlinks | Critical |
| 10 | Deduplicate prompts: single canonical `14_PROMPTS`; Genesis copies → stubs/redirects | Duplication | High |
| 11 | Unify archive policy: merge `Archive/` + `99_ARCHIVE/` or hard-rule which is live | Folders, duplication | High |
| 12 | Stage B semantic folder rename plan (ADR) — end dual taxonomy | Folders | High |
| 13 | Real tag taxonomy (`#type/moc`, `#status/frozen`, `#domain/...`) — stop hex false tags | Tags | High |
| 14 | Escape hex color literals that trigger `#` tag parse (code-format colors) | Tags | High |
| 15 | Expand Engineering MOC → every API/DB/Frontend/Deploy/AI note | Engineering discoverability | High |
| 16 | Grow `05_FRONTEND` beyond 1 note (routes map, shell, `/m`, account) | Engineering | High |
| 17 | Grow `06_AI` beyond 1 note (providers, logger, trust UX → Arch cite) | Engineering | High |
| 18 | Grow `07_DEPLOYMENT` (Vercel, EC2, Actions) with links to Launch | Engineering, roadmap | High |
| 19 | Feature MOC: every `09_FEATURES/*` entity linked from Features Index + Product MOC | MOC, Features | High |
| 20 | Changelog index Dataview across Features | Dataview, Features | High |
| 21 | Link Program 0 + UX Intelligence + UX Architecture as sequential Roadmap spine | Roadmap | High |
| 22 | Founder MOC expand (certificates, freeze, ADRs) | Hub, Founder | High |
| 23 | Knowledge-Graph MOC: inbound from Home + all MOCs (star hub) | MOC, discoverability | High |
| 24 | Interaction MOC already lists UXA — add State/Flows/Components deep links | Interaction, frozen | High |
| 25 | Constitution/Governance hubs: link every Rule/Invariant note | Hubs | High |
| 26 | Glossary MOC + inbound from Content/Terminology architecture | Hubs, UX | Medium |
| 27 | Rule Index + Invariant Index: convert to true MOCs with lists | Hubs | Medium |
| 28 | Research hub: link all research packs | Hub | Medium |
| 29 | Native V2: MOC + link from Architecture + Roadmap Native | Native, eng | High |
| 30 | Ensure Current-Context always links active + last published programs | Discoverability | High |
| 31 | Home “Start here” block: Home → Context → Genesis → Roadmap published | Nav | High |
| 32 | Orphan sweep: Archive notes only linked from Archive README | Orphans | Medium |
| 33 | Templates: enforce new-note template with FM + parent link | Metadata | High |
| 34 | Obsidian graph.json: color groups by `authority` / folder | Graph UX | Medium |
| 35 | Enable/document recommended community plugins (Dataview, Omnisearch) in vault README | Dataview | Medium |
| 36 | Vault README / `16_DOCUMENTATION` how-to: how to navigate Brain OS | Discoverability | Medium |
| 37 | Fix broken link `09_FEATURES/Mobile/*` in Intelligence Surface Inventory | Backlinks | Low |
| 38 | Replace alias-only links with path-qualified wikilinks where basename collides | Backlinks | High |
| 39 | UX-Architecture: MOC page listing all phase freezes + final certificates | Frozen | High |
| 40 | Link Phase audit `90_*` notes from phase indexes (many currently orphan) | Orphans, UXA | Medium |
| 41 | Program-0 index bidirectional with Operational-Priorities + Launch | Roadmap | Medium |
| 42 | Legal Index discoverability from Product + Home | Roadmap | Low |
| 43 | ADRs (`10_DECISIONS`) linked from Founder + Architecture MOCs | Authority | Medium |
| 44 | Bugs (`11_BUGS`) MOC + status Dataview | Dataview | Medium |
| 45 | Sprints (`12_SPRINTS`) linked from Current-Context when active | Discoverability | Medium |
| 46 | Meetings (`13_MEETINGS`) hub or archive rule | Folders | Low |
| 47 | Experiments (`17_EXPERIMENTS`) quarantine + link policy | Folders | Low |
| 48 | Assets folder policy already exists — link from Design MOC | Design | Low |
| 49 | Design MOC: Palette + Design-Bible stub + Genesis P5/P8 visual cites | Design, authority | Medium |
| 50 | Product MOC: Pricing, Launch, Waitlist, Business-Rules | Product | Medium |
| 51 | Database notes: one-table-one-note completeness check vs schema | Engineering | Medium |
| 52 | API notes: endpoint groups linked from Eng MOC | Engineering | Medium |
| 53 | Architecture notes (`02_ARCHITECTURE`) link Monorepo ↔ Native ↔ Web | Engineering | Medium |
| 54 | Memory pack (`15_MEMORY`) index of AI packs + Handoff policy | Discoverability | Medium |
| 55 | Manifest `_manifest.json` sync with Features + publish Dataview | Metadata | High |
| 56 | Validate every Feature entity has MOC + Changelog | Features | Medium |
| 57 | Cross-link UX Intelligence 00–15 from Features where evidenced | Clusters | Medium |
| 58 | Cross-link UX Architecture flows to Feature MOCs (Today, Capture…) | Clusters | Medium |
| 59 | Genesis internal path strings still say `AIIMIN GENESIS/` — ADR rewrite index | Authority debt | Medium |
| 60 | Stub `AIIMIN GENESIS/MOVED.md` (if outside vault) documented from Home | Discoverability | Low |
| 61 | Graph cluster legend doc (how to read vault graph) | Graph | Low |
| 62 | Minimum inbound degree SLO: ≥1 for living notes | Orphans | High |
| 63 | Minimum outbound degree SLO: ≥1 for living notes | Dead ends | High |
| 64 | Density target: ≥4 edges/note living corpus | Density | Medium |
| 65 | Exclude Archive from default graph (Obsidian filter) | Graph | Medium |
| 66 | Exclude `_templates` from orphan scoring / graph | Graph | Low |
| 67 | Publication badge callout standard on frozen packs | Frozen | Medium |
| 68 | “Consumer start” callout on UXA Publication Record (already) — mirror on Intelligence | Roadmap | Low |
| 69 | Program V1 tracking note for this audit (this file) linked from Roadmap MOC | Program | Medium |
| 70 | Consistency lint script: FM required fields CI | Metadata | High |
| 71 | Consistency lint: orphan report in CI | Orphans | High |
| 72 | Consistency lint: broken wikilinks CI | Backlinks | Medium |
| 73 | Naming lint: forbid duplicate basenames in living tree | Naming | High |
| 74 | Prefer `Pascal-Case` or `numbered_` consistently for new notes | Naming | Low |
| 75 | Rename folders with spaces only if Stage B (Maps of Content → Maps-of-Content) | Naming, Stage B | Medium |
| 76 | Interaction Architecture folder space vs MOC hyphen — unify | Naming | Medium |
| 77 | Ensure every Frozen certificate has backlink from parent phase index | Frozen | Medium |
| 78 | Ensure every Freeze Candidate historically closed to FROZEN status note | Frozen | Low |
| 79 | Map Program 0 residuals to Operational-Priorities explicitly | Roadmap | Medium |
| 80 | Launch plan discoverability from Home blockers | Roadmap | Medium |
| 81 | Waitlist feature ↔ Roadmap schedule links | Product | Low |
| 82 | Auth feature note ↔ Architecture FL-AUTH | Clusters | Medium |
| 83 | Mobile `/m` notes ↔ UXA ceilings BR-01 / D05 | Authority, mobile | High |
| 84 | Native WORKFLOW ↔ Phase 1 CS-DAY / FL-XDEV | Native | Medium |
| 85 | Palette note ↔ P8 Visual cite already — add Design MOC inbound count | Design | Low |
| 86 | Remove or clearly banner duplicate Cursor-Rules under Genesis supporting | Duplication | Medium |
| 87 | Archive provenance banners completeness check (migration debt) | Archive | Low |
| 88 | Obsidian workspace default open: Home + Current-Context + Knowledge-Graph | Discoverability | Medium |
| 89 | Daily notes config exists — decide use or disable to avoid noise | Obsidian config | Low |
| 90 | Templates path verified in `.obsidian/templates.json` | Templates | Low |
| 91 | Core plugins: confirm graph, backlinks, outline on | Obsidian | Low |
| 92 | Add “Authority ladder” note linked from Home | Authority | Medium |
| 93 | Add “How notes inherit Genesis” one-pager | Authority | Medium |
| 94 | Scorecard note: recompute vault health metrics quarterly | Process | Medium |
| 95 | Top orphan list by folder published as living Dataview | Orphans, Dataview | Medium |
| 96 | Link `_manifest.json` documentation for humans | Metadata | Low |
| 97 | Ensure Legal pages vault notes if any linked from Product | Product | Low |
| 98 | Meetings/Sprints empty-state policy (archive vs delete) | Folders | Low |
| 99 | After Stage B, regenerate graph colors + MOC paths | Folders | Medium |
| 100 | Re-audit after Top 20 done — target composite ≥7.5 | Process | High |

---

## Suggested score targets (post Top 20)

| Dimension | Now | Target |
|-----------|----:|-------:|
| Graph connectivity | 4.0 | 7.0 |
| Orphans | 2.5 | 7.0 |
| Dataview | 2.0 | 7.0 |
| Tags | 2.0 | 6.0 |
| Engineering discoverability | 4.0 | 7.0 |
| **Composite** | **5.3** | **≥7.5** |

---

## Explicit non-actions (this deliverable)

- No note edits beyond **creating this audit report file**
- No renames, no link repairs, no FM backfill, no Dataview install
- Genesis untouched
- UX Intelligence / UX Architecture frozen claims untouched

---

## Next (when Founder authorizes Program V1 execution)

1. Accept / amend this audit  
2. Execute Top 1–20 as Knowledge OS sprint  
3. Re-score  

---

**Audit status:** COMPLETE (read-only analysis)  
**Fixes:** NONE
