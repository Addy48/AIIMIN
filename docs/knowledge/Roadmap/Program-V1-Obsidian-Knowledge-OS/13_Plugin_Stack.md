---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/05_Vault_Automation_Layer_Spec
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: plugin-stack
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Plugin Stack — Production Obsidian Stack for AIIMIN KOS

**Evaluate · tier · recommend. Design only — no installs.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Design only — zero plugin install / enable** |
| Parents | [[05_Vault_Automation_Layer_Spec]] · [[04_Founder_Workspace_Dataview_Spec]] · [[12_Workspace_UX]] · [[11_Visual_Knowledge_Maps]] · [[08_Founder_Workspace]] · [[06_Metadata_Migration_Plan]] |
| Vault | `docs/knowledge/` |
| Baseline now | Community plugins **none in-repo**; core per `.obsidian/core-plugins.json` |
| Principle | **Few plugins, deep habit** (FW8 / A6) |

---

## 0. Tier definitions

| Tier | Meaning | Install bar |
|------|---------|-------------|
| **Core** | Bundled Obsidian plugins — enable/configure for KOS | Ship with app; toggle only |
| **Required** | Community (or must-enable core) without which production KOS cockpit fails | Install before Dashboards / capture production |
| **Optional** | Clear value; not blocking; add when habit exists | After Required stable |
| **Experimental** | Useful later or version-gated; may churn | Founder opt-in; easy rollback |
| **Rejected** | Do not install for AIIMIN vault | Documented anti-stack |

### Evaluation axes (every plugin)

| Axis | Question |
|------|----------|
| **Purpose** | What KOS job does it do? |
| **Risk** | Law/frozen writes, data loss, SoT forks, security |
| **Performance** | Cost on ~600+ note vault |
| **Maintenance** | Update burden, breakage, Founder time |
| **Dependencies** | What else must exist |
| **Alternatives** | Core / other plugin / convention |

---

## 1. Stack summary (production target)

### 1.1 Recommended production set

```text
CORE (on):   file-explorer, search, switcher, graph, backlink, outgoing-link,
             page-preview, templates, note-composer, command-palette,
             file-recovery, word-count, daily-notes, canvas*, bookmarks/workspaces (app)

REQUIRED:    Dataview · QuickAdd · Templater · Metadata Menu

OPTIONAL:    Omnisearch · Tasks · Advanced URI · Periodic Notes · Kanban · Buttons/Meta Bind

EXPERIMENTAL: Excalidraw · Bases (native) · Callout Manager · Style Settings (light)

REJECTED:    see §6 (Copilot-in-vault SoT, Calendar sprawl, Dataview dual-engines, etc.)
```

\*Canvas: **enable when** Visual Maps V0+ authorized ([[11]]); currently **off** in baseline.

### 1.2 Install order (when Founder authorizes)

| Step | Plugin / toggle | Why first |
|------|-----------------|-----------|
| 1 | Templates (core) + template content | Stop new FM debt |
| 2 | Dataview | Dashboards |
| 3 | Templater | Smart create |
| 4 | QuickAdd | Capture chords |
| 5 | Metadata Menu | Enum safety |
| 6 | Canvas (core on) | Maps |
| 7 | Omnisearch / Tasks / URI / … | Polish |

### 1.3 Hard constraints

- No plugin may auto-write `Genesis/**` or frozen UXA/UXI  
- No plugin becomes product requirements SoT  
- Prefer path denylists in Templater/QuickAdd  
- Keep community count **≤8** in production steady state (Required 4 + ≤4 Optional)

---

## 2. Core plugins (bundled)

Baseline from `core-plugins.json` noted. Recommendation = production target.

### 2.1 File explorer — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Browse folders; escape hatch ([[12]] — prefer Bookmarks) |
| **Risk** | Low; temptation to edit Genesis via tree |
| **Performance** | Fine at vault size |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | Bookmarks / Quick Switcher |

### 2.2 Global search — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Fallback find when Omnisearch absent |
| **Risk** | Low; noisy hits in Archive if not excluded mentally |
| **Performance** | OK; slower than Omnisearch index on large vaults |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | Omnisearch (Optional) |

### 2.3 Quick switcher — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Open note by name (hotkey) |
| **Risk** | Basename collisions → wrong note |
| **Performance** | Excellent |
| **Maintenance** | None |
| **Dependencies** | Path-qualified linking culture ([[03]]) |
| **Alternatives** | Omnisearch |

### 2.4 Graph view — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | GV-* orientation; GES work ([[07]]) |
| **Risk** | Low; hairball if filters wrong |
| **Performance** | Medium — use GV-DEFAULT / PERF-LITE; avoid GV-FULL daily |
| **Maintenance** | `graph.json` colorGroups when authorized |
| **Dependencies** | Filter discipline; optional FM later |
| **Alternatives** | Canvas maps ([[11]]); MOCs |

### 2.5 Backlinks — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Right sidebar inbound; graph SLO hygiene |
| **Risk** | Low |
| **Performance** | Fine |
| **Maintenance** | None |
| **Dependencies** | Good wikilinks |
| **Alternatives** | None equivalent |

### 2.6 Outgoing links — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Parent/authority check on edit ([[12]]) |
| **Risk** | Low |
| **Performance** | Fine |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | Local graph |

### 2.7 Tag pane — **Core · ON → demote use**

| Axis | Eval |
|------|------|
| **Purpose** | Tag browse |
| **Risk** | **Medium** — hex false tags (`#ff6b35`) until MD-03 hygiene |
| **Performance** | Fine |
| **Maintenance** | Collapse/hide until taxonomy live ([[06]]) |
| **Dependencies** | Closed tag taxonomy |
| **Alternatives** | YAML tags + Dataview; hide pane |

**Rec:** Keep plugin on; **don’t use as nav** until tags cleaned.

### 2.8 Page preview — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Hover preview links |
| **Risk** | Low |
| **Performance** | Low cost |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | Open note |

### 2.9 Templates — **Core · REQUIRED ENABLE (already on)**

| Axis | Eval |
|------|------|
| **Purpose** | Stamp FM + Parent stubs (REC-MD-02) |
| **Risk** | Low if Genesis paths excluded from template targets |
| **Performance** | Negligible |
| **Maintenance** | Template files in `_templates/` |
| **Dependencies** | KOS schema ([[06]]); folder `_templates` |
| **Alternatives** | Templater alone (worse without core baseline) |

### 2.10 Note composer — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Extract / merge notes |
| **Risk** | Medium if used inside frozen packs — discipline |
| **Performance** | Fine |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | Manual cut-paste |

### 2.11 Command palette — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Commands, workspace load, plugin actions |
| **Risk** | Low |
| **Performance** | Excellent |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | None |

### 2.12 Word count — **Core · KEEP ON (harmless)**

| Axis | Eval |
|------|------|
| **Purpose** | Writing feedback |
| **Risk** | None |
| **Performance** | Negligible |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | Off |

### 2.13 File recovery — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Recover snapshots |
| **Risk** | Low |
| **Performance** | Low background |
| **Maintenance** | None |
| **Dependencies** | None |
| **Alternatives** | git (repo-level) |

### 2.14 Daily notes — **Core · KEEP ON**

| Axis | Eval |
|------|------|
| **Purpose** | Optional daily journal; wire template to Context links |
| **Risk** | Medium if Daily becomes Product SoT |
| **Performance** | Fine; exclude from graph if noisy |
| **Maintenance** | Set template (currently empty string) |
| **Dependencies** | Daily template; graph filter |
| **Alternatives** | Context-only (no daily); Periodic Notes |

### 2.15 Canvas — **Core · ENABLE WHEN MAPS AUTHORIZED** (now off)

| Axis | Eval |
|------|------|
| **Purpose** | Visual Knowledge Maps ([[11]]) |
| **Risk** | Medium sprawl / shadow IA if undisciplined |
| **Performance** | Fine for Core-5 canvases; heavy canvases costlier |
| **Maintenance** | Budgets + Visual-Maps-Index |
| **Dependencies** | [[11]] catalog; note cards |
| **Alternatives** | Mermaid in notes; Excalidraw drafts |

### 2.16 Sync — **Core · KEEP OFF** (baseline)

| Axis | Eval |
|------|------|
| **Purpose** | Obsidian Sync |
| **Risk** | **High policy** — vault lives in git monorepo; dual sync fights |
| **Performance** | N/A if off |
| **Maintenance** | Billing + conflict |
| **Dependencies** | Obsidian account |
| **Alternatives** | git · iCloud carefully · Working Copy; **prefer git as SoT for this project** |

**Rec:** **Rejected for production** unless Founder deliberately leaves vault outside git sync path.

### 2.17 Markdown importer / Open with default app — **KEEP OFF**

Rare need; enable episodically.

### 2.18 Bookmarks & Workspaces — **Core app features · REQUIRED HABIT**

Not always listed in `core-plugins.json` the same way; treat as **Core UX required** per [[12]]: Bookmarks Core ≤10; workspaces `Founder` etc.

| Axis | Eval |
|------|------|
| **Purpose** | Cockpit nav + mode layouts |
| **Risk** | Bookmark sprawl |
| **Performance** | Negligible |
| **Maintenance** | Weekly prune |
| **Dependencies** | [[12]] |
| **Alternatives** | Starred (rejected dual system) |

### 2.19 Outline / Properties / etc.

Use Outline via right sidebar (core). Properties editor helpful with Metadata Menu — keep available if present in app version.

---

## 3. Required (community)

### 3.1 Dataview — **Required**

| Axis | Eval |
|------|------|
| **Purpose** | Founder Workspace dashboards; health KPIs; FM queries ([[04]]) |
| **Risk** | Medium — dashboards mistaken for SoT; DataviewJS complexity; query lag if unscoped |
| **Performance** | Medium — scope `FROM`/`WHERE`; avoid full-vault JS on every pane; path fallbacks OK |
| **Maintenance** | Medium — query churn when schema migrates; active community |
| **Dependencies** | FM backfill preferred ([[06]]); Dashboard folder; Derived headers |
| **Alternatives** | Curated static tables; Bases (Experimental); external scripts regenerating md |

**Verdict:** **Required** for production cockpit. Dataview-first (not Bases-first).

### 3.2 Templater — **Required**

| Axis | Eval |
|------|------|
| **Purpose** | Dynamic templates: date, prompts, folder move, parent wikilink |
| **Risk** | **High if misconfigured** — scripts writing Genesis/frozen; JS in vault |
| **Performance** | Low at create-time only |
| **Maintenance** | Medium — template scripts; security reviews of TP snippets |
| **Dependencies** | Core Templates content first; folder whitelist |
| **Alternatives** | Core Templates only (weaker); QuickAdd alone (limited) |

**Verdict:** **Required** after template rewrite. Guardrails mandatory (denylist Genesis/UXA/UXI).

### 3.3 QuickAdd — **Required**

| Axis | Eval |
|------|------|
| **Purpose** | One-chord capture (`qa-bug`, `qa-adr`, `qa-touch`, …) ([[08]][[12]]) |
| **Risk** | Medium — wrong folder macros; Touch append corrupting Context |
| **Performance** | Excellent |
| **Maintenance** | Low–medium — macro list |
| **Dependencies** | Templater recommended; templates; whitelist folders |
| **Alternatives** | Command palette + Templates; Buttons calling templates |

**Verdict:** **Required** for Founder UX click budgets.

### 3.4 Metadata Menu — **Required**

| Axis | Eval |
|------|------|
| **Purpose** | Enum UI for `authority`, `lifecycle`, `knowledge_layer`, `status`, `owner`, … |
| **Risk** | Medium — fileClasses forced onto Genesis; enum drift vs [[06]] |
| **Performance** | Low–medium (per-note UI) |
| **Maintenance** | Medium — preset sync with schema |
| **Dependencies** | Schema enums; Templates emitting same keys; Dataview consumers |
| **Alternatives** | Manual YAML; Linter; Properties core only |

**Verdict:** **Required** for sustainable FM after M0/M1. **Exclude Genesis** from fileClasses.

---

## 4. Optional

### 4.1 Omnisearch — **Optional (strongly recommended)**

| Axis | Eval |
|------|------|
| **Purpose** | Fast fuzzy search; exclude Archive/templates ([[12]]) |
| **Risk** | Low |
| **Performance** | **Better** than core search at scale (index) |
| **Maintenance** | Low; reindex occasional |
| **Dependencies** | Exclude list config |
| **Alternatives** | Core Global Search + Quick Switcher |

**Verdict:** Optional but high leverage after Required stack.

### 4.2 Tasks — **Optional**

| Axis | Eval |
|------|------|
| **Purpose** | Due/priority task queries; launch checklists |
| **Risk** | Medium — tasks become fake requirements SoT |
| **Performance** | Medium if querying whole vault |
| **Maintenance** | Medium — emoji/syntax dialect |
| **Dependencies** | Living ops notes; Daily Ops |
| **Alternatives** | Dataview task queries; plain checkboxes + Dashboard |

**Verdict:** Optional P2. Prefer Dataview tasks first; add Tasks if Founder wants native UX.

### 4.3 Advanced URI — **Optional**

| Axis | Eval |
|------|------|
| **Purpose** | Rich `obsidian://` create/append; Shortcuts/Raycast |
| **Risk** | Medium — append-to-Context abuse; URL encoding footguns |
| **Performance** | Negligible |
| **Maintenance** | Low–medium |
| **Dependencies** | Stable vault name; documented URI table |
| **Alternatives** | Basic `obsidian://open` (no plugin); Bookmarks |

**Verdict:** Optional P1–P2. Basic open links first (no plugin).

### 4.4 Periodic Notes — **Optional**

| Axis | Eval |
|------|------|
| **Purpose** | Weekly/monthly note cadence |
| **Risk** | Low–medium SoT creep |
| **Performance** | Fine |
| **Maintenance** | Low |
| **Dependencies** | Templates; graph exclude |
| **Alternatives** | Core Daily Notes + Friday section; Context only |

**Verdict:** Optional. Weekly P2; Monthly P3.

### 4.5 Kanban — **Optional**

| Axis | Eval |
|------|------|
| **Purpose** | 1–2 launch/sprint boards |
| **Risk** | **High SoT fork** if used as requirements DB |
| **Performance** | Fine for small boards |
| **Maintenance** | Medium — board drift |
| **Dependencies** | Cards link to notes; Roadmap Dashboard peer |
| **Alternatives** | Tasks lists; Sprint notes; Dashboard tables |

**Verdict:** Optional P2 — **max 1–2 boards**; never constitutional.

### 4.6 Buttons **or** Meta Bind — **Optional (pick one)**

| Axis | Eval |
|------|------|
| **Purpose** | In-note cockpit actions (open dashboard, QuickAdd) |
| **Risk** | Medium — unsafe commands; Meta Bind write fields into notes carelessly |
| **Performance** | Low |
| **Maintenance** | Medium |
| **Dependencies** | Dashboards; QuickAdd |
| **Alternatives** | Hotkeys + Bookmarks (often enough); Advanced URI links |

**Verdict:** Optional P2. Prefer **Buttons** for command triggers; avoid Meta Bind until FM stable. **Do not install both.**

### 4.7 Homepage / Custom Frames — **Optional → lean Reject**

| Axis | Eval |
|------|------|
| **Purpose** | Force open Context on startup |
| **Risk** | Low |
| **Performance** | Fine |
| **Maintenance** | Low |
| **Dependencies** | None |
| **Alternatives** | Workspace `Founder` startup ([[12]]) — **prefer workspace** |

**Verdict:** Prefer workspaces; Homepage plugin unnecessary if U0 done.

---

## 5. Experimental

### 5.1 Excalidraw — **Experimental**

| Axis | Eval |
|------|------|
| **Purpose** | Draft sketches in `17_EXPERIMENTS/` |
| **Risk** | **High** shadow-UXA if cited as architecture |
| **Performance** | Medium–heavy files |
| **Maintenance** | Medium |
| **Dependencies** | Draft banners; never replace frozen UXA |
| **Alternatives** | Paper; Mermaid; Canvas for curated maps |

**Verdict:** Experimental P3. Allowed only with [[11]] guardrails.

### 5.2 Obsidian Bases — **Experimental**

| Axis | Eval |
|------|------|
| **Purpose** | Native tables for Features/Bugs/ADRs |
| **Risk** | Dual query SoT vs Dataview Executive |
| **Performance** | Potentially better than DV for simple catalogs |
| **Maintenance** | Unknown maturity |
| **Dependencies** | App version; FM schema |
| **Alternatives** | Dataview (Required SoT for Founder Workspace v1) |

**Verdict:** Experimental. Use only for satellite catalogs; **Executive stays Dataview**.

### 5.3 Callout Manager — **Experimental**

| Axis | Eval |
|------|------|
| **Purpose** | Custom callout types matching Automation styleguide |
| **Risk** | Low |
| **Performance** | Negligible |
| **Maintenance** | Low |
| **Dependencies** | Callout convention (P0 without plugin) |
| **Alternatives** | Stock callouts (`important`, `warning`, …) |

**Verdict:** Experimental P3 — convention first.

### 5.4 Style Settings / Minimal theme kits — **Experimental**

| Axis | Eval |
|------|------|
| **Purpose** | Vault chrome readability |
| **Risk** | Low; don’t confuse with product palette lock |
| **Performance** | Low |
| **Maintenance** | Theme update breaks |
| **Dependencies** | Theme choice |
| **Alternatives** | Default theme |

**Verdict:** Experimental cosmetic — not KOS-critical.

### 5.5 Linter — **Experimental**

| Axis | Eval |
|------|------|
| **Purpose** | YAML/format consistency |
| **Risk** | **High** — mass format of Genesis/frozen if scope wrong |
| **Performance** | Batch cost |
| **Maintenance** | Rule tuning |
| **Dependencies** | Strict folder denylist |
| **Alternatives** | Metadata Menu + templates; scripted FM migration |

**Verdict:** Experimental only with **hard exclude** Genesis + UXA + UXI. Prefer migration scripts for FM.

### 5.6 Advanced Canvas / Canvas mindmap plugins — **Experimental → prefer Reject**

| Axis | Eval |
|------|------|
| **Purpose** | Extra canvas power |
| **Risk** | Dependency; sprawl |
| **Performance** | Variable |
| **Maintenance** | Higher |
| **Dependencies** | Core Canvas |
| **Alternatives** | Core Canvas per [[11]] |

**Verdict:** Reject for production; Experimental only if Core Canvas proven insufficient.

### 5.7 Copilot / Smart Connections / AI inside Obsidian — **Experimental → default Reject for SoT**

| Axis | Eval |
|------|------|
| **Purpose** | In-vault AI chat / embeddings |
| **Risk** | **Critical** — second memory vs Current-Context; secret leakage; contradicts [[09]][[10]] (Cursor/agents own AI) |
| **Performance** | Heavy indexing |
| **Maintenance** | High |
| **Dependencies** | API keys (never in vault) |
| **Alternatives** | Cursor / Claude Code / ChatGPT per Agent Workspace |

**Verdict:** **Rejected as production SoT**. Experimental only if Founder isolates to sandbox vault — not AIIMIN `docs/knowledge` production.

---

## 6. Rejected

### 6.1 Explicit reject list

| Plugin / class | Why rejected |
|----------------|--------------|
| **Obsidian Sync** (for this vault) | Git monorepo is SoT; sync conflicts |
| **Dual Stars + Bookmarks systems** | Nav fork ([[12]]) |
| **Calendar / Full Calendar as Product planner** | Roadmap/Context own planning; noise |
| **Notion-like databases as law** | Genesis/UXA remain SoT |
| **Multiple Kanban boards (>2)** | Fragmentation |
| **Buttons + Meta Bind together** | Overlap; pick one later |
| **Dataview + Bases both as Executive** | Dual derived SoT |
| **Advanced Canvas stack** | Prefer core |
| **In-vault Copilot / embedding AI as memory** | Breaks AI Workspace |
| **Auto Note Mover / reckless file movers** | Frozen/Genesis risk |
| **Mass tag generators** | Tag score collapse |
| **Publishing plugins to public web from vault** | Secrets / law exposure risk |
| **Git plugin that auto-commits** | Founder-only commit rule |
| **Community themes that restyle callouts into “pretty law”** | Authority confusion |

### 6.2 Rejected with rationale template

Each reject shares: **Purpose lure** vs **KOS harm** → safer alternative already in Core/Required/Optional.

---

## 7. Evaluation matrix (compact)

| Plugin | Tier | Purpose (short) | Risk | Perf | Maint | Deps | Alt |
|--------|------|-----------------|------|------|-------|------|-----|
| Templates | Core/Req habit | FM stamps | L | L | L | schema | Templater |
| Graph | Core | Topology | L | M | L | filters | Canvas |
| Backlinks/Outgoing | Core | Link hygiene | L | L | L | — | — |
| Daily notes | Core | Journal | M SoT | L | L | template | Context |
| Canvas | Core (on later) | Maps | M sprawl | L–M | M | [[11]] | Mermaid |
| Sync | Rejected* | Cloud sync | H | — | H | account | git |
| Dataview | **Required** | Dashboards | M | M | M | FM/path | Bases/static |
| Templater | **Required** | Smart create | H misconfig | L | M | whitelist | Core T |
| QuickAdd | **Required** | Capture | M | L | L–M | Templater | Palette |
| Metadata Menu | **Required** | Enums | M | L–M | M | schema | manual YAML |
| Omnisearch | Optional | Fast find | L | L(+) | L | excludes | Core search |
| Tasks | Optional | Task UX | M SoT | M | M | ops notes | DV tasks |
| Advanced URI | Optional | Deep links | M | L | L–M | vault name | open URI |
| Periodic Notes | Optional | Cadence | L–M | L | L | templates | Daily |
| Kanban | Optional | 1–2 boards | H SoT | L | M | note cards | Sprint md |
| Buttons | Optional | Cockpit clicks | M | L | M | QA/DV | hotkeys |
| Meta Bind | Optional/avoid dual | Field UI | M | L | M | FM | Metadata Menu |
| Excalidraw | Experimental | Draft draw | H shadow | M–H | M | Experiments | Canvas |
| Bases | Experimental | Native tables | M dual | ? | ? | app ver | Dataview |
| Callout Manager | Experimental | Custom callouts | L | L | L | style | stock |
| Linter | Experimental | Format | H mass | M | M | denylist | scripts |
| Vault AI/Copilot | Rejected | In-app AI | C | H | H | keys | Cursor crew |

\*Unless Founder explicitly changes sync architecture.

Risk: L low · M medium · H high · C critical.

---

## 8. Performance budget

| Rule | Target |
|------|--------|
| Community plugins production | ≤8 |
| Dataview panes open | ≤3 heavy dashboards at once |
| Graph | GV-DEFAULT / PERF-LITE daily |
| Canvas living | Core-5 (+standard as needed) |
| Startup | Workspace Founder < cold-open friction ([[12]]) |
| Mobile | Avoid Dataview-heavy + Excalidraw |

---

## 9. Security & authority

| Rule | Detail |
|------|--------|
| No API keys in vault | Plugins that need keys use OS secure storage / env outside git |
| No auto-edit Genesis | Templater/QuickAdd/Linter denylist |
| No plugin overrides law | Callouts + dashboards remain derived |
| Review Templater scripts | Treat as code |
| Commit/push | Never delegated to plugin automation |

---

## 10. Relationship to Program V1 artifacts

| Spec | Plugin demand |
|------|----------------|
| [[04]] Dashboards | Dataview Required |
| [[05]] Automation | Full catalog → this tiering |
| [[06]] Metadata | Metadata Menu + Templates |
| [[08]][[12]] Founder UX | QuickAdd · Omnisearch · workspaces |
| [[11]] Visual maps | Canvas core |
| [[09]][[10]] Agents | Reject in-vault AI memory |

---

## 11. Implementation sketch (not authorized)

| Phase | Stack action |
|------:|--------------|
| P0 | Template content; callout convention; Daily template path |
| P1 | Install Dataview · Templater · QuickAdd · Metadata Menu |
| P2 | Enable Canvas; Omnisearch; Advanced URI basic; optional Tasks/Kanban/Buttons |
| P3 | Excalidraw / Bases / Callout Manager if Founder opts |

Rollback: disable community plugin; dashboards fall back to curated tables ([[04]]).

---

## 12. Explicit non-actions (this deliverable)

- No community plugin installed  
- No core plugin toggles changed  
- No Templater/QuickAdd configs written  
- No Genesis / frozen edits  
- No commits  

---

## 13. Authority statement

Plugin Stack is **operations**. Plugins are accelerators. They cannot override Genesis, frozen packs, Current-Context, or Founder git/auth gates. A smaller correct stack beats a clever zoo.

---

## 14. Closeout

| Item | Status |
|------|--------|
| Plugin Stack design | **COMPLETE** (design) |
| Required community | Dataview · Templater · QuickAdd · Metadata Menu |
| Implementation | **NONE** |
| Baseline `.obsidian` | **UNCHANGED** |

**Next (Founder):** Accept / amend tiers → authorize **P0 templates** then **P1 Required four**.

---

**Stop.**
