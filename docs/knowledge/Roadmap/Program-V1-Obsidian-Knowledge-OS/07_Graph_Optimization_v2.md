---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/03_Graph_Engineering_v1
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: graph-optimization-v2
implementation: none
genesis_touch: forbidden
version: 2.0
parent_spec: graph-engineering-v1
---

# Graph Optimization v2.0

**From functional graph → expressive, measurable, world-class Obsidian graph.**

| Field | Value |
|-------|-------|
| Date | 2026-07-25 |
| Mode | **Design only — zero implementation** |
| Parent | [[03_Graph_Engineering_v1]] (contracts remain law for edges/NT) |
| Also reads | [[01_Vault_Deep_Audit_Report]] · [[02_Vault_Architecture_Specification]] · [[06_Metadata_Migration_Plan]] |
| Genesis | Immutable — envelope + path color only |
| Frozen packs | Link-in from living; no required internal graph rewrites |

---

## 0. Why v2 exists

**v1** made the graph *engineerable*: edge vocabulary, NT contracts, named clusters, colorGroups, GV filters, local-depth table, living SLOs.

**Problem:** That still yields a **functional but flat** graph — sparse living mesh (~2.2 edges/note), ~51% orphans (many law-internal), hubs not visually dominant, edge semantics invisible in the global view, no single **score** to manage toward excellence.

**v2** optimizes **expressiveness**: what a Founder or agent *sees and trusts* in under 10 seconds, with KPIs that can be scored quarterly.

| Layer | Owns |
|-------|------|
| Graph Engineering v1 | What must link · who owns inbound · what must not be edited |
| Graph Optimization v2 | How clusters read · hub prominence · edge/backlink quality grades at scale · orphan elimination strategy · performance · readability physics · saved views · **Graph Expressiveness Score (GES)** |

**Non-goal:** Replace NT contracts. Extend them with measurable quality.

---

## 1. Vision — world-class bar

A world-class Obsidian vault graph for AIIMIN means:

1. **Clusters resolve in ≤3 seconds** at GV-DEFAULT (color + spatial separation, not hairball).  
2. **Hubs read as hubs** (degree + position), leaves as satellites — without fake plugins.  
3. **Living corpus** is almost fully parented; orphans are *intentional* (law deep / frozen audit / cold) and excluded from living KPIs.  
4. **Edges carry intent** (section-typed); backlinks Grade A/B ≥90% on living edits.  
5. **Local graph** answers “where am I?” in one glance per note class.  
6. **Performance** stays snappy on ~600–1000 notes with Genesis included as colored mass.  
7. **One score (GES)** tracks progress like vault audit composite — target **≥ 8.5 / 10**.

### 1.1 Audit baseline (v2 start)

| Metric | Audit (approx) | World-class living target |
|--------|---------------:|--------------------------:|
| Edges / note (whole vault) | 2.22 | Living ≥ **4.5**; whole vault ≥ **3.5** (Genesis sparse OK) |
| Orphans (no inbound) | ~51% | Living orphans **≤ 5%**; law orphans **accepted** if entrypoints enveloped |
| Zero outbound | ~60% | Living **≤ 5%** |
| colorGroups | empty | **12** path groups painted |
| Saved views | informal | **≥ 12** named GV-* |
| Backlink Grade A/B (new links) | unknown | **≥ 90%** living |
| GES | not scored | **≥ 8.5** |

---

## 2. Graph Expressiveness Score (GES)

### 2.1 Purpose

Single **0–10** composite, recomputed after each optimization sprint. Separate from vault audit composite (5.3) but feeds dimensions 2, 3, 4, 16 of that audit.

### 2.2 Formula

```text
GES = Σ (dimension_score_i × weight_i) / Σ weights
```

Each dimension scored **0–10**. Weights sum **100**.

### 2.3 Dimension catalog

| ID | Dimension | Weight | What “10” looks like |
|----|-----------|-------:|----------------------|
| D1 | Cluster visibility | 14 | 10 named clusters visually separable under GV-DEFAULT; legend known |
| D2 | Hub prominence | 12 | All H0–H1 in top 5% degree; Home/KG/envelope unmistakable |
| D3 | Edge quality | 14 | ≥85% living edges section-typed (E-*); E-see ≤5/note; bridge budget respected |
| D4 | Backlink quality | 12 | ≥90% living resolvable links Grade A/B; broken = 0; collisions path-qualified |
| D5 | Orphan elimination (living) | 14 | Living inbound/outbound SLO ≥95%; intentional orphans catalogued |
| D6 | Graph performance | 8 | GV-DEFAULT open <1.5s; no lag pan/zoom on Founder hardware; filters exclude cold/templates |
| D7 | Graph readability | 12 | Labels readable at default zoom; low edge crossings at hub ring; force settings documented |
| D8 | Local graph standards | 8 | 100% note classes have depth SOP; spot-check pass ≥90% |
| D9 | Graph views coverage | 6 | ≥12 GV views documented + used; GV-DEFAULT = daily habit |

**Weights sum = 100.**

### 2.4 Scoring rubrics (measurable)

#### D1 — Cluster visibility (0–10)

| Score | Criteria |
|------:|----------|
| 0–2 | No colorGroups; hairball; clusters not nameable |
| 3–4 | Partial colors; 2–3 blobs only |
| 5–6 | Full path colorGroups; clusters muddy (bridges too dense / cold included) |
| 7–8 | Clusters separable; legend exists; cold/templates filtered in default |
| 9–10 | Founder blind-test: name ≥8/10 clusters correctly from screenshot; bridge edges ≤ budget |

**KPI inputs:** `# colorGroups` · `% notes matching a color query` · `# cross-cluster leaf-leaf bridges` · blind-test score.

#### D2 — Hub prominence (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | Hubs degree ≈ leaves; KG thin inbound |
| 4–6 | H1 linked but not top-degree |
| 7–8 | H0–H1 all in top decile degree; envelope degree ≥ entrypoint count |
| 9–10 | Hub ring readable: Home ↔ KG ↔ domain MOCs form visible star; leaf/hub degree ratio ≥ 4× median |

**KPI inputs:** degree rank of Home, KG, Genesis MOC, each H1 · median leaf out-degree.

#### D3 — Edge quality (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | Link salad; no sections |
| 4–6 | Parent often present; other E-* rare |
| 7–8 | ≥70% living notes have `## Parent`; hubs have Children tables |
| 9–10 | ≥85% living edges in typed sections; E-bridge only on hubs; E-see capped; authority edges present on product/eng leaves |

**KPI inputs:** `% notes with ## Parent` · `% hubs with Children` · `avg E-see count` · `# leaf-leaf cross-cluster edges`.

#### D4 — Backlink quality (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | Many broken / glob / ambiguous |
| 4–6 | Mostly resolve; collisions unaddressed |
| 7–8 | Collision register + path-qualify on edit; broken ≤3 living |
| 9–10 | ≥90% Grade A/B on living corpus sample (n≥100); broken living = 0 |

**KPI inputs:** broken count · `% path-qualified among colliding stems` · sample grade mix.

#### D5 — Orphan elimination living (0–10)

| Score | Criteria |
|------:|----------|
| 0–2 | Living orphans >30% |
| 3–4 | 15–30% |
| 5–6 | 5–15% |
| 7–8 | ≤5% living orphan **or** dead-end |
| 9–10 | ≤2% living orphan **and** dead-end; intentional orphan registry complete |

**Population:** Exclude `Genesis/**`, `_templates/**`, `Archive/**`, `99_ARCHIVE/**`, and (by policy) `NT-FROZEN-LEAF` internals from **living orphan KPI**. Report Genesis/frozen orphans separately as informational.

**KPI inputs:** living in-degree=0 count · living out-degree=0 count · intentional registry size.

#### D6 — Graph performance (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | Full vault + orphans + attachments; unusable lag |
| 4–6 | Usable but GV-FULL painful; default includes cold |
| 7–8 | GV-DEFAULT smooth; cold/templates off; attachments off |
| 9–10 | Documented budgets; optional “Genesis collapsed” view for speed; open+settle ≤1.5s |

**KPI inputs:** node count in GV-DEFAULT · filter checklist · subjective lag grade (Founder) · optional timing.

#### D7 — Graph readability (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | Labels unreadable; black edge soup |
| 4–6 | Colors help; still tangled hub center |
| 7–8 | Force params tuned; arrows on; linkDistance ≥220; hub ring clear |
| 9–10 | Screenshot passes “magazine graph” test: spine + clusters + bridges only |

**KPI inputs:** settings checklist · Founder readability rating 1–5 ×2.

#### D8 — Local graph standards (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | No SOP; depth random |
| 4–6 | Table exists (v1); rarely followed |
| 7–8 | SOP in authoring checklist; spot-check ≥70% |
| 9–10 | Spot-check ≥90%; local graph confirms Parent before commit of link edits |

**KPI inputs:** spot-check pass rate (n≥20 notes across classes).

#### D9 — Graph views coverage (0–10)

| Score | Criteria |
|------:|----------|
| 0–3 | Only default |
| 4–6 | ≤5 views documented |
| 7–8 | ≥10 views; DEFAULT + LAW + ARCH + PROD + BUILD + ORPHAN |
| 9–10 | ≥12 views including BRIDGE, HUB-RING, FEATURE-SYSTEM, PERF-LITE; Workspace Index links them |

**KPI inputs:** count of documented GV-* · presence of required set.

### 2.5 Band labels

| GES | Band | Meaning |
|----:|------|---------|
| 9.0–10 | World-class | Expressive, trusted, teachable |
| 8.0–8.9 | Excellent | Daily usable as cockpit |
| 7.0–7.9 | Strong | Functional + emerging expression |
| 5.0–6.9 | Functional | v1 contracts; weak expression |
| <5.0 | Weak | Audit-like hairball / orphans |

**Program V1 target after optimization sprints:** **GES ≥ 8.5**. Stretch: **≥ 9.0**.

### 2.6 Scoring cadence

| When | Action |
|------|--------|
| Design accept | Record **GES baseline estimate** (below) |
| After colorGroups + GV-DEFAULT | Re-score D1, D6, D7, D9 |
| After living hub/leaf SLO pass | Re-score D2, D3, D5 |
| After collision + path-qualify pass | Re-score D4 |
| Quarterly | Full GES + vault audit composite |

### 2.7 Estimated baseline GES (pre-impl, from audit + v1 design-only)

| Dim | Est. now | Notes |
|-----|--------:|-------|
| D1 | 2.5 | No colors applied |
| D2 | 4.0 | Home exists; KG thin |
| D3 | 3.5 | Some links; weak typing |
| D4 | 5.0 | Mostly resolve; collisions |
| D5 | 2.5 | Living orphans high |
| D6 | 5.0 | Vault size OK; filters not set |
| D7 | 3.0 | Unstyled hairball |
| D8 | 4.0 | Spec exists; unused |
| D9 | 2.0 | Views designed, not saved |

**Estimated GES ≈ 3.4 / 10** (functional floor once v1 *implemented* would rise ~5–6 before v2 polish).

---

## 3. Cluster visibility

### 3.1 Visibility principles

1. **Color = cluster membership** (path query), not authority alone.  
2. **Filter = cognitive load** — cold/templates never in GV-DEFAULT.  
3. **Bridges are few and hub-owned** — leaf–leaf cross-cluster edges destroy cluster gestalt.  
4. **Law mass is a feature** — orange Genesis blob OK if envelope (blue hub) is obvious.  
5. **Legend note** — living `Maps of Content/Graph-Legend` (impl later) mirrors color table.

### 3.2 Cluster separation budget

| Rule | Limit |
|------|------:|
| Max intentional `E-bridge` edges between any two clusters | 12 (hub-mediated) |
| Max leaf–leaf cross-cluster edges (living) | **0** preferred; ≤5 vault-wide warn |
| Max `E-see` per living note | 5 |
| Min intra-cluster edges per living note | 1 (parent) |

### 3.3 Cluster “signature” nodes (must be visible)

| Cluster | Signature (must be high-degree / central) |
|---------|-------------------------------------------|
| C-META | Home, Knowledge-Graph |
| C-LAW | Genesis MOC (envelope — living) + visible Genesis color mass |
| C-EXPR | Constitution / Interaction / Governance hubs |
| C-ARCH | UXA `00_INDEX`, UXI `00_INDEX`, Publication Record (inbound from living) |
| C-PROG | Roadmap MOC, active Program INDEX |
| C-PROD | Product MOC, Features Index |
| C-BUILD | Engineering MOC, Monorepo |
| C-DESIGN | Design MOC, Palette |
| C-OPS | Current-Context, Founder MOC |
| C-COLD | Archive README only (filtered out of default) |

### 3.4 Visibility acceptance test

Founder opens GV-DEFAULT, zooms to fit:

- [ ] ≥6 distinct color regions  
- [ ] Blue hub ring recognizable  
- [ ] Orange law mass peripheral or clustered, not mixed into product amber  
- [ ] No grey archive cloud  
- [ ] Can point to Product vs Build vs Arch without opening notes  

---

## 4. Hub prominence

### 4.1 Prominence model

Obsidian sizes nodes by **degree**. Therefore prominence = **engineered degree**, not CSS.

| Tier | Target degree band (living graph, GV-DEFAULT) | Mechanism |
|------|-----------------------------------------------|-----------|
| H0 | Top 1–3 nodes | Fan-out to all H1 + Context + dashboards |
| H1 | Top ~15 nodes | Children tables complete + KG bidirectional |
| H2–H3 | Mid-high | Package lists complete |
| H4 Feature MOC | Mid | Entity children + Feature Index |
| Leaf | Low (2–6 out) | Parent + authority/peer — no spam |

### 4.2 Anti-patterns that kill prominence

| Anti-pattern | Fix |
|--------------|-----|
| Every leaf links Home | Remove; parent is H1–H4 only |
| Hub lists nothing (outbound only from leaves) | Require Children tables (E-child) |
| KG not linked from each MOC | Bidirectional H1 ↔ KG |
| Dashboards link everything | Dashboards cite sources; not second KG |
| Duplicate MOC stubs | One H1 per domain |

### 4.3 Hub prominence checklist (per H1)

1. Listed on Knowledge-Graph  
2. Links back to Knowledge-Graph + Home (or via KG)  
3. Lists owned H2/H3/H4 children  
4. ≥1 authority / envelope cite  
5. Degree rank verified after link pass  

### 4.4 Envelope special case

Genesis MOC must outrank deep law files in **living** degree. Deep Genesis files may have zero living inbound — **accepted**. Entrypoints (P1–P9 indexes, key certificates) must appear on envelope Children/table.

---

## 5. Edge quality

### 5.1 Quality model

Edge quality = **typed + resolvable + budgeted + authority-safe**.

| Grade | Definition |
|-------|------------|
| EQ-A | In typed section (`## Parent` etc.) + path-qualified if needed + correct cluster |
| EQ-B | Typed section + unique resolve; path optional |
| EQ-C | Naked body link; resolves |
| EQ-D | Ambiguous basename |
| EQ-F | Broken / glob / wrong target |

**v2 living bar:** new/edited edges **EQ-A or EQ-B only**. Corpus target: ≥85% of living notes’ outlinks EQ-A/B.

### 5.2 Section → edge code (enforcement)

Unchanged from v1 vocabulary; v2 adds **lintable heading set**:

`## Parent` · `## Children` · `## Authority` · `## Sequence` · `## Siblings` · `## Related` · `## Freeze registry` · `## Supersedes` · `## Bridges` · `## See also`

**Rule:** Links outside these sections still count for Obsidian degree but score as EQ-C in GES D3 sampling.

### 5.3 Edge budgets (v2 hard)

| Edge type | Budget |
|-----------|--------|
| E-parent | Exactly 1 primary per living leaf |
| E-child | Hub must list owned living set (may paginate by table) |
| E-authority | 1–3 per product/eng/feature note |
| E-bridge | Hub-only; see §3.2 |
| E-see | ≤5 |
| E-sequence | Spine notes only |
| E-freeze | Founder/Roadmap hubs |

### 5.4 Expressiveness upgrade — “semantic density”

Aim not only more edges, but **higher fraction of EQ-A**. Prefer one Parent + one Authority over five See-also.

**Living density target:** ≥4.5 edges/note **and** EQ-A/B ≥85%. Density without typing ≠ world-class.

---

## 6. Backlink quality

### 6.1 Relationship to edge quality

Outbound EQ grade of A→B becomes inbound backlink quality for B. Optimize at **authoring** time.

### 6.2 v2 backlink KPIs

| KPI | Target |
|-----|-------:|
| Living broken wikilinks | **0** |
| Colliding basename links that are path-qualified | **≥95%** of links to colliding stems |
| Sample Grade A+B (n=100 living) | **≥90%** |
| Hub inbound from correct owner (KG/Home/parent) | **100%** H1 |

### 6.3 Collision strategy (expressiveness)

1. Maintain Basename Collision Register (from REC-MD-04).  
2. On any living edit touching a colliding stem → upgrade to `[[path/Note\|Label]]`.  
3. Never rename Genesis/frozen to “fix” collisions.  
4. Prefer disambiguating **labels** that show cluster (`Calendar (Feature)` vs path alone).

### 6.4 Backlink reading standard

When using Backlinks pane:

| Context | Trust |
|---------|-------|
| Link from Parent / Children section | High — structural |
| Link from Authority | High — cite |
| Link from See also | Low — optional |
| Link from Dashboard | Derived — not SoT |
| Link from Archive | Provenance only |

Document this on Graph-Legend (impl later).

---

## 7. Orphan elimination

### 7.1 Orphan classes (do not treat alike)

| Class | Definition | v2 policy |
|-------|------------|-----------|
| O-LIVE | Living note, in-degree 0 | **Eliminate** via parent hub list + E-parent |
| O-DEAD | Living note, out-degree 0 | **Eliminate** via E-parent (+ authority if needed) |
| O-BOTH | Living both | Priority P0 queue |
| O-LAW | Genesis, no inbound | **Accept**; envelope entrypoints only |
| O-FROZEN | Frozen leaf, no inbound | **Accept** by default; living mirror lists optional |
| O-COLD | Archive | **Accept**; filter out |
| O-TEMPLATE | Templates | **Accept**; filter out |
| O-INTENT | Explicitly quarantined (experiments) | Registry + parent Experiments index |

### 7.2 Living orphan elimination algorithm (design)

```text
1. Build eligible living set (exclude law/cold/templates/frozen-leaf policy)
2. For each O-LIVE/O-DEAD/O-BOTH:
   a. Infer parent from path (Feature folder → Feature MOC; eng folder → Eng MOC; etc.)
   b. Add E-parent on note
   c. Add E-child on parent hub
   d. If product/eng behavior: add E-authority to envelope or Arch INDEX
3. Recompute; queue remainder for human (ambiguous parent)
4. Publish intentional registry for leftovers (O-INTENT)
```

**Forbidden:** Editing Genesis to clear O-LAW. **Forbidden:** Bulk-editing frozen packs to clear O-FROZEN without ADR.

### 7.3 Frozen / law orphan communication

Dashboards must **not** alarm on O-LAW / O-FROZEN as if living failure. Split widgets:

- Living Orphan Queue  
- Informational: Genesis without inbound (count only)  
- Informational: Frozen leaves without inbound (count only)

### 7.4 Elimination targets

| Population | Now (approx) | Target |
|------------|-------------:|-------:|
| Living orphan (in=0) | high | ≤5% → stretch ≤2% |
| Living dead-end (out=0) | high | ≤5% → stretch ≤2% |
| O-BOTH | 251 overall (mixed) | Living O-BOTH → **0** preferred |
| Genesis orphans | ~197 | Unchanged internally; entrypoints on envelope **100%** |

---

## 8. Graph performance

### 8.1 Budgets

| Budget | Limit | Rationale |
|--------|------:|-----------|
| Nodes in GV-DEFAULT | ≤ ~550 (exclude cold/templates; include Genesis) | Readable + smooth |
| Nodes in GV-PERF-LITE | ≤ ~280 | Drop Genesis deep mass; keep envelope + living |
| Attachments in any daily view | 0 | Noise |
| Tags rendered | 0 until taxonomy clean | Hex false tags |
| Orphans shown | 0 in DEFAULT | Use GV-ORPHAN |
| Concurrent graph tabs | ≤2 recommended | CPU |

### 8.2 Performance views

| View | Node strategy |
|------|----------------|
| GV-DEFAULT | Living + Genesis color mass; no cold/templates |
| GV-PERF-LITE | `-path:Genesis` + envelope file + all living hubs/leaves needed for work |
| GV-FULL | Rare; expect slower |
| GV-LAW | Genesis + envelope only |

### 8.3 Physics presets (readability ∩ performance)

| Preset | centerStrength | repelForce | linkDistance | Use |
|--------|----------------|------------|--------------|-----|
| P-OPERATE | 0.45 | medium-high | 250 | GV-DEFAULT |
| P-HUB | 0.35 | high | 280 | Hub ring inspection |
| P-PACK | 0.5 | medium | 200 | Single pack (ARCH/PROD) |
| P-LITE | 0.5 | medium | 220 | GV-PERF-LITE |

Document exact Obsidian numeric fields at impl time; values above are design targets.

### 8.4 Perf acceptance

- Pan/zoom GV-DEFAULT: no multi-second freeze on Founder machine  
- Switching GV-DEFAULT ↔ GV-PROD: <1s filter apply feel  
- Optional: disable Global Graph during heavy Dataview dashboard sessions  

---

## 9. Graph readability

### 9.1 Readability checklist

| Setting | World-class value |
|---------|-------------------|
| showArrow | true |
| hideUnresolved | true |
| showOrphans | false (DEFAULT) |
| showAttachments | false |
| showTags | false → true only after MD tag taxonomy |
| Text opacity | High enough to see hubs; not max black soup |
| Node size scale | Default; rely on degree |
| Animate | Optional off if jank |

### 9.2 Visual hierarchy (what eye should hit first)

```text
1. Home + Knowledge-Graph (META blue)
2. Domain MOC ring
3. Bridges to Arch green / Law orange / Product amber
4. Leaf clouds within clusters
5. Genesis mass as “law gravity,” not primary navigation
```

### 9.3 Magazine test (qualitative gate for D7≥9)

Screenshot GV-DEFAULT at fit. Ask:

1. Where is Today’s ops focal? (Context near Home)  
2. Where is law?  
3. Where is shipped architecture?  
4. Where do features live?  
5. What should I open to navigate? (KG)

If any answer is “unclear,” readability fails — fix hubs/filters/bridges before adding more leaf edges.

### 9.4 Anti-hairball rules

1. No new leaf–leaf cross-cluster links.  
2. Cap See-also.  
3. Prefer MOC tables over spraying peers.  
4. Dashboards do not become mega-hubs (outlinks to sources OK; don’t parent the vault).  
5. Exclude cold always in DEFAULT.

---

## 10. Local graph standards (v2)

v1 table remains baseline. v2 adds **pass/fail SOP** and **expressiveness intents**.

### 10.1 Extended local graph matrix

| Note class | Depth | In | Out | Filter | Pass if visible |
|------------|------:|:--:|:---:|--------|-----------------|
| Boot / master-hub | 2 | ✓ | ✓ | −cold −templates | All H1 neighbors |
| Domain / struct hub | 2 | ✓ | ✓ | −cold | Parent KG + children sample |
| Package index | 2 | ✓ | ✓ | pack path | Phase children |
| Feature MOC | 2 | ✓ | ✓ | optional Arch | Feature leaves + Product/Features Index |
| Living leaf | 1 | ✓ | ✓ | none | Parent hub |
| Certificate | 1 | ✓ | ✓ | none | Index / Founder inbound |
| Dashboard | 1 | ✓ | ✓ | none | Index + 1 source MOC |
| Envelope | 2 | ✓ | ✓ | none | Home/KG + P-entrypoints |
| Law (Genesis) | 1 | ✓ | ✓ | Genesis | Inspect only |
| Bridge review | 2 | ✓ | ✓ | two cluster paths | Only hub bridges |

### 10.2 Local graph authoring ritual

Before finishing a living note edit that changes links:

1. Open Local Graph at prescribed depth.  
2. Confirm Parent node present.  
3. If hub: confirm ≥1 child visible.  
4. If Feature/Eng: confirm Authority target visible or listed.  
5. If tangle: reduce See-also / fix wrong parent.

### 10.3 Local vs global responsibility

| Question | Use |
|----------|-----|
| Is my parent correct? | Local depth 1 |
| Is my cluster healthy? | Local depth 2 or GV-PROD/BUILD |
| Is vault expressive? | GV-DEFAULT + GES |
| Am I creating a bridge leak? | Local + check cluster of targets |

---

## 11. Graph views (v2 catalog)

### 11.1 Required views (≥12)

| View ID | Name | Filter / search (design) | Primary GES dims |
|---------|------|--------------------------|------------------|
| GV-DEFAULT | Operating | −templates −Archive −99_ARCHIVE; orphans off | D1 D6 D7 |
| GV-PERF-LITE | Fast operate | DEFAULT + −path:Genesis (+ keep Genesis MOC file) | D6 |
| GV-HUB-RING | Navigation star | Maps of Content + Home + Context + key struct hubs | D2 D7 |
| GV-LAW | Law + envelope | Genesis + Genesis MOC | D1 |
| GV-ARCH | Frozen arch/evidence | UXA + UXI paths | D1 |
| GV-PROD | Product | Features + Product + Product MOC | D1 D5 |
| GV-BUILD | Engineering | Eng folders + Native + Eng MOC | D1 D5 |
| GV-DESIGN | Design | 08_DESIGN + Design MOC | D1 |
| GV-PROG | Programs | Roadmap living (−UXA −UXI) + Roadmap MOC | D1 |
| GV-OPS | Ops | Memory + Bugs + Sprints + Prompts + Founder | D1 |
| GV-BRIDGE | Bridges only | MOCs + UXA INDEX + Genesis MOC + Feature MOCs (tighten at impl) | D3 |
| GV-ORPHAN | Orphan hunt | orphans on; living paths; −Genesis −cold −templates | D5 |
| GV-FEATURE | Feature system | One feature folder + Feature MOC + related Arch (session) | D8 |
| GV-FULL | Audit all | empty; orphans on | rare |
| GV-COLD | Cold | Archive paths | rare |

### 11.2 View usage policy

| Role | Default view |
|------|----------------|
| Daily Founder | GV-DEFAULT or GV-PERF-LITE |
| Link hygiene sprint | GV-ORPHAN → then cluster GV-* |
| Constitutional | GV-LAW |
| Feature build | GV-PROD or GV-FEATURE |
| Teaching vault | GV-HUB-RING |
| GES screenshot | GV-DEFAULT @ fit |

### 11.3 Workspace Index integration

Founder Workspace (Dataview Spec) should link GV-* as **obsidian URI or instruction callouts** (impl later). Graph views are part of cockpit, not hidden lore.

---

## 12. Optimization playbook (design phases — do not run yet)

Depends on Graph Engineering v1 + Metadata M0/M1 for durable FM; can start visual layers earlier.

### Phase G0 — Sight (expressiveness unlock)

| Step | Work | GES lift |
|------|------|----------|
| G0.1 | Apply colorGroups from v1 §5 | D1 |
| G0.2 | Apply GV-DEFAULT filter + display defaults | D6 D7 D9 |
| G0.3 | Create Graph-Legend note + link from KG | D1 D9 |
| G0.4 | Save GV-HUB-RING, GV-LAW, GV-ARCH, GV-PROD, GV-BUILD, GV-ORPHAN | D9 |

**Exit:** Magazine test partially pass; estimated GES ≥5.0.

### Phase G1 — Hub star

| Step | Work | GES lift |
|------|------|----------|
| G1.1 | KG ↔ all H1 bidirectional | D2 |
| G1.2 | Home spine complete (v1 NT-BOOT) | D2 |
| G1.3 | Envelope entrypoint tables complete | D2 D5 (law entry) |
| G1.4 | Children tables on H1/H2 | D2 D3 |

**Exit:** Hub ring obvious; GES ≥6.5.

### Phase G2 — Living mesh

| Step | Work | GES lift |
|------|------|----------|
| G2.1 | Orphan elimination algorithm on Features → Eng → Ops → Roadmap living | D5 |
| G2.2 | Enforce ## Parent on living leaves | D3 |
| G2.3 | Authority cites on Feature/Eng | D3 |
| G2.4 | Bridge budget audit; remove leaf–leaf leaks | D1 D3 |

**Exit:** Living SLO ≥95%; GES ≥7.5.

### Phase G3 — Precision

| Step | Work | GES lift |
|------|------|----------|
| G3.1 | Collision register + path-qualify pass | D4 |
| G3.2 | Broken living links → 0 | D4 |
| G3.3 | Local graph spot-check ritual in authoring checklist | D8 |
| G3.4 | GV-PERF-LITE + GV-BRIDGE + remaining views | D6 D9 |
| G3.5 | Force preset documentation (P-OPERATE etc.) | D7 |

**Exit:** GES ≥8.5 (world-class band entry).

### Phase G4 — Sustain

| Step | Work |
|------|------|
| G4.1 | Quarterly GES + intentional orphan registry review |
| G4.2 | Warn-only lint: living missing Parent; bridge leaks |
| G4.3 | Re-screenshot magazine test after major programs |

---

## 13. Measurement system

### 13.1 Automated inputs (future scripts)

| Metric | Source |
|--------|--------|
| Degree / orphan / density | Wikilink resolve script (audit method) |
| Section typing rate | Heading + link proximity parse |
| Broken links | Resolve failures |
| Color coverage | path query membership |
| Path-qualify rate | Link syntax parse vs collision register |

### 13.2 Manual inputs

| Metric | Method |
|--------|--------|
| Blind cluster naming | Founder 10-cluster quiz |
| Magazine test | Pass/fail |
| Local graph spot-check | n=20 checklist |
| Perf feel | 1–5 lag rating |

### 13.3 Scorecard artifact (impl later)

Living note: `Dashboards/` or Program V1 `90_GES_Scorecard.md` with latest GES table + date. Not SoT for links — derived KPI.

---

## 14. Risks & constraints

| Risk | Mitigation |
|------|------------|
| Chasing density → link spam | EQ grades + E-see cap + bridge budget |
| “Fixing” Genesis orphans | O-LAW acceptance; envelope only |
| Editing frozen for orphan KPIs | O-FROZEN acceptance; living mirrors |
| Perf collapse with Genesis in DEFAULT | GV-PERF-LITE; budgets |
| Graph colors confused with product UI purple | Document graph-only tokens; palette lock unchanged |
| Dashboards inflate degree wrongly | NT-DASHBOARD: sources only |
| GES gamed by trivial links | Require typed sections for D3 credit |

---

## 15. Compatibility with Program V1 siblings

| Spec | Relationship |
|------|----------------|
| Graph Engineering v1 | Contracts + edge vocabulary — **normative** |
| Metadata Migration | `graph_role` / `note_type` enable typed queries; not required for G0 colors |
| Dataview Spec | Orphan/Health dashboards consume living orphan KPIs |
| Automation | Phase 2.1 graph.json aligns with G0 |
| Vault Architecture | REC-GR-* satisfied by G1–G2 |

---

## 16. Explicit non-actions (this deliverable)

- No `graph.json` edits  
- No wikilink batch  
- No orphan elimination executed  
- No Genesis / frozen edits  
- No plugin changes  
- No commits  

---

## 17. Authority statement

Graph Optimization v2 is **operations**. It cannot override Genesis. Expressiveness never justifies mutating law or frozen packs. Living envelope + filters + hub engineering are the only legal path to a beautiful Law cluster.

---

## 18. Closeout

| Item | Status |
|------|--------|
| Graph Optimization v2.0 | **COMPLETE** (design) |
| GES definition | **COMPLETE** (target ≥8.5) |
| Implementation | **NONE** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend GES weights → authorize **G0** (colorGroups + GV-DEFAULT + legend) after or with Automation graph step.

---

**Stop.**
