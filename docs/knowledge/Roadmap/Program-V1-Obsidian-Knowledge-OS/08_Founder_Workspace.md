---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: founder-workspace
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Founder Workspace — Complete Experience Design

**How the Founder operates AIIMIN from Obsidian in the fewest clicks.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Design only — zero implementation** |
| Parents | [[02_Vault_Architecture_Specification]] · [[04_Founder_Workspace_Dataview_Spec]] · [[05_Vault_Automation_Layer_Spec]] · [[03_Graph_Engineering_v1]] · [[07_Graph_Optimization_v2]] |
| Scope | Full Founder experience: boot, rhythms, domains, capture, search, decide, execute |
| Not this doc | Widget/query inventory — that stays [[04_Founder_Workspace_Dataview_Spec]] |
| Genesis / frozen | Untouched; cite via envelope and indexes only |

---

## 0. What this is

**Founder Workspace** = the complete operating experience for Aaditya as Founder inside `docs/knowledge/`.

It is **not**:

- A folder of dashboards (dashboards are one surface)
- A second Genesis
- A PM tool that replaces Roadmap / ADRs / Features
- An agent dump that replaces Current-Context

It **is**:

- A **boot contract** (what opens, in what order)
- A **click budget** for every recurring job
- **Daily / weekly / monthly** rhythms
- **Domain lanes** (law, architecture, product, eng, AI, research, execution)
- **Capture → decide → execute → review** loops
- Navigation, search, and graph habits that keep cognitive load low

**Success test:** Founder answers “What matters today?” and reaches the correct SoT in **≤2 clicks** from cold start, **≤1 click** from warmed workspace.

---

## 1. Design principles

| ID | Principle | Consequence |
|----|-----------|-------------|
| FW1 | **Minimum clicks** | Every job has a defined click budget (≤3). Extra hops = design failure. |
| FW2 | **One SoT per fact** | Context for today; Home for blockers/authority; ADRs for decisions; Features for product; Genesis for law. Dashboards only derive. |
| FW3 | **Surfaces ≠ sources** | Workspace Index / Executive / Daily Ops link out; never become law. |
| FW4 | **Lane discipline** | Product, eng, AI, architecture, research use different entry notes — no mega-page. |
| FW5 | **Capture must parent** | QuickAdd/Templater always stamps parent + FM; no orphan inbox forever. |
| FW6 | **Law is read-only** | Constitutional work opens envelope → entrypoints; never edit Genesis from Workspace flows. |
| FW7 | **Agents share boot** | Human and agent use same Home → Context → domain path. |
| FW8 | **Few plugins, deep habit** | Templates, Dataview, QuickAdd, Omnisearch (or core search), optional Templater — not a zoo. |

### 1.1 Click budget legend

| Budget | Meaning |
|--------|---------|
| **0-click** | Already open / pinned / daily note auto |
| **1-click** | Single link, hotkey, QuickAdd, or bookmark |
| **2-click** | Index → target |
| **3-click** | Index → domain surface → SoT (maximum for routine jobs) |
| **Fail** | >3 for a routine job — redesign |

---

## 2. Experience architecture

### 2.1 Layer cake

```text
┌─────────────────────────────────────────────────────────────┐
│ L0  BOOT        Workspace layout · pins · hotkeys           │
├─────────────────────────────────────────────────────────────┤
│ L1  ORIENT      Home · Current-Context · Executive (glance) │
├─────────────────────────────────────────────────────────────┤
│ L2  NAVIGATE    Knowledge-Graph · Domain MOCs · GV views    │
├─────────────────────────────────────────────────────────────┤
│ L3  SURFACE     Dashboards (derived) · Graph · Search       │
├─────────────────────────────────────────────────────────────┤
│ L4  SOURCE      Features · Eng · ADRs · Roadmap · Prompts   │
├─────────────────────────────────────────────────────────────┤
│ L5  LAW         Genesis envelope → P5/P8/P9 entrypoints     │
└─────────────────────────────────────────────────────────────┘
```

Founder lives in **L0–L3**. Deep work happens in **L4**. Constitutional checks drop to **L5** and return.

### 2.2 Primary surfaces (experience, not only dashboards)

| Surface | Role | Click from boot |
|---------|------|-----------------|
| **Current-Context** | Today’s truth (SoT for focus) | 0–1 (pinned) |
| **Home** | Authority + blockers + program lens | 1 |
| **Executive** | Derived cockpit glance | 1 |
| **Daily Ops** | Context mirror + tasks + touch | 1 |
| **Knowledge-Graph MOC** | Map of maps | 1–2 |
| **Workspace Index** | Dashboard router | 1–2 |
| **Domain MOCs** | Product / Eng / Roadmap / Design / Founder | 2 |
| **Domain dashboards** | Derived boards per [[04_…]] | 2 from Index / 1 from Executive drill |
| **Capture palette** | QuickAdd | 1 (hotkey) |
| **Search** | Omnisearch / core | 1 (hotkey) |
| **Graph GV-DEFAULT** | Spatial orientation | 1 (hotkey / leaf) |

### 2.3 Recommended Obsidian layout (design)

**Startup workspace name:** `Founder`

| Pane | Default note | Why |
|------|--------------|-----|
| Left (main) | Current-Context | Always know today |
| Right tab A | Executive **or** Daily Ops | Glance / ops |
| Right tab B | Active program INDEX or Touch target | Deep work |
| Left sidebar | File explorer filtered or starred | Rare |
| Right sidebar | Backlinks + Outline | Link hygiene |
| Optional bottom / leaf | Local graph depth per note class | When editing links |

**Pinned (star / bookmarks bar):** Context · Home · Executive · Daily Ops · Knowledge-Graph · Genesis MOC · Workspace Index · Active Program INDEX.

**Hotkeys (logical — bind at impl):**

| Action | Intent |
|--------|--------|
| Open Context | Orient |
| Open Executive | Glance |
| Open Daily Ops | Execute today |
| QuickAdd palette | Capture |
| Omnisearch / search | Find |
| Open KG | Navigate map |
| Toggle GV-DEFAULT | Spatial |
| New ADR / Bug / Feature | Capture typed |

---

## 3. Startup (cold start → ready)

### 3.1 60-second boot ritual

| Step | Action | Clicks | Outcome |
|-----:|--------|-------:|---------|
| 1 | Open Obsidian → workspace `Founder` loads | 0 | Layout restored |
| 2 | Read Current-Context (Today / Next / Do not / Touch) | 0 | Focus locked |
| 3 | Skim Executive blockers + risks strip | 1 | Threats visible |
| 4 | If Touch nonempty → open first Touch link | 1 | Work starts |
| 5 | Else → Daily Ops tasks / active program | 1 | Work starts |

**Total to first productive note:** ≤ **2 clicks** after vault open.

### 3.2 Agent-aligned boot (same truth)

When starting a Cursor/agent session, Founder still treats vault as SoT:

1. Agents read Home → Context (mandatory)  
2. Founder confirms Context Touch matches what agent will do  
3. If mismatch → **edit Context first** (1 note), then instruct agent  

**Anti-pattern:** Chat invents priorities while Context says otherwise.

### 3.3 Startup modes

| Mode | When | Open instead of Executive |
|------|------|---------------------------|
| **Ops** | Build / launch day | Daily Ops + Context |
| **Law** | Constitutional question | Genesis MOC (envelope) |
| **Ship UX** | Downstream consumer of UXA | UX Dashboard → Publication Record |
| **Build** | Implementation | Eng Dashboard → Monorepo / Feature MOC |
| **Decide** | Stuck / ADR needed | Decisions Dashboard → new ADR capture |
| **Hygiene** | Vault debt day | Risk + GV-ORPHAN |

Mode switch = **1 click** from Workspace Index “mode chips” (curated links) or bookmark folder `Modes/`.

---

## 4. Daily workflow

### 4.1 Daily loop (canonical)

```text
Orient (Context) → Glance (Executive) → Capture inbox → Execute (Touch/tasks)
    → Decide if blocked → Update Context → Close
```

### 4.2 Timeboxed day shape

| Block | Duration | Surface | Click budget |
|-------|----------|---------|--------------|
| Orient | 2–5 min | Context → Executive | ≤2 |
| Capture flush | 5 min | QuickAdd → process Inbox | ≤1 per capture |
| Deep work 1 | 45–90 min | Feature/Eng/Program SoT | 1 from Touch |
| Mid check | 3 min | Daily Ops / Risk strip | ≤1 |
| Deep work 2 | 45–90 min | Same or next Touch | 1 |
| Closeout | 5–10 min | Update Context · Home blockers if changed | 1–2 |

### 4.3 Daily jobs → paths (min clicks)

| Job | Path | Clicks |
|-----|------|-------:|
| Know today’s focus | Context (pinned) | 0 |
| See blockers | Home **or** Executive strip | 1 |
| Open active program | Context link | 1 |
| Log a bug | QuickAdd `qa-bug` | 1 |
| Log a decision stub | QuickAdd `qa-adr` | 1 |
| Append Touch item | QuickAdd `qa-touch-context` | 1 |
| Check vault health | Executive KPI / Risk | 1–2 |
| Ask “is this law?” | Genesis MOC | 1 |
| Ask “what did UXA freeze?” | UX Dashboard → Publication | 2 |
| Hand off to agent | Context already correct | 0 (then chat) |

### 4.4 Daily closeout checklist

- [ ] Context **Today / Next / Do not / Touch** accurate  
- [ ] New notes have Parent (local graph glance if edited links)  
- [ ] No secrets in vault notes  
- [ ] If blockers changed → Home blockers updated  
- [ ] Inbox empty or deferred with parent  

---

## 5. Weekly workflow

### 5.1 Weekly loop

```text
Review week outcomes → Roadmap spine health → Risk sweep → Decision queue
    → Eng/Product coverage glance → Graph/GES light check → Plan next week in Context
```

### 5.2 Weekly ceremony (≤30 min)

| Step | Surface | Clicks | Output |
|-----:|---------|-------:|--------|
| 1 | Roadmap Dashboard — spine + active programs | 1–2 | What’s sequencing |
| 2 | Risk Dashboard — bugs + hygiene + ceilings | 1–2 | Top 3 risks |
| 3 | Decisions — open/proposed ADRs | 1–2 | Close or schedule |
| 4 | Engineering — thin folders alert | 1–2 | Doc debt pick |
| 5 | Product / Features Index — stale `last_reviewed` | 2 | One feature hygiene |
| 6 | Write **next week** into Context | 1 | SoT updated |
| 7 | Optional: Weekly note (Periodic) linking Context | 1 | Archive trail |

### 5.3 Weekly jobs → paths

| Job | Path | Clicks |
|-----|------|-------:|
| Program status | Roadmap Dashboard | 1–2 |
| Launch coupling | Program 0 INDEX via Roadmap | 2 |
| Open ADRs | Decisions Dashboard | 1–2 |
| Bug triage | Risk → Bugs table → bug note | ≤3 |
| Feature freshness | Features Board / Features Index | 2 |
| Vault orphans (living) | GV-ORPHAN or Risk hygiene | 1–2 |
| Agent prompt hygiene | AI Dashboard → `14_PROMPTS` | 2 |

### 5.4 Weekly anti-patterns

- Rewriting frozen UXA because a weekly review “found gaps” → use living errata / new program  
- Treating Kanban as requirements SoT  
- Skipping Context update after the ceremony  

---

## 6. Monthly workflow

### 6.1 Monthly loop

```text
Authority & freeze integrity → Product/launch posture → Architecture consumption
    → Eng depth vs Genesis mass → AI/agent rules → Vault GES + audit dims
    → Founder certificates / ADR hygiene → Reset Operational Priorities
```

### 6.2 Monthly ceremony (≤90 min)

| Domain | Surface | Question | Clicks |
|--------|---------|----------|-------:|
| Law | Genesis Dashboard / envelope | Entrypoints complete? Certificates listed? | ≤2 |
| Architecture | UX Dashboard | Downstream still citing Publication Record? | ≤2 |
| Product | Product MOC + Features + Program 0 | Launch / waitlist / pricing posture | ≤3 |
| Engineering | Eng Dashboard + Monorepo | Coverage gaps closing? | ≤2 |
| AI | AI Dashboard + Proof-or-Stop | Prompts canonical? Dual copies confused? | ≤2 |
| Research | Research hub / UXI | Evidence still frozen & findable? | ≤2 |
| Graph | GV-DEFAULT + GES scorecard | GES trending to ≥8.5? | ≤2 |
| Ops | Home + Operational-Priorities | Priorities match reality? | ≤2 |

### 6.3 Monthly outputs (write living only)

1. Context: monthly themes in Next  
2. Optional ADR if strategy changed  
3. Operational-Priorities touch if launch posture shifted  
4. GES / vault health note update (derived)  
5. **Never** amend Genesis or frozen packs in this ritual  

---

## 7. Reviews

### 7.1 Review types

| Review | Cadence | Owner surface | Produces |
|--------|---------|---------------|----------|
| Daily closeout | Daily | Context | Accurate Touch |
| Weekly ops | Weekly | Roadmap + Risk + Decisions | Next-week Context |
| Monthly strategic | Monthly | Multi-domain | Priorities + optional ADR |
| Program gate | Per program phase | Program INDEX | Accept/amend/authorize |
| Freeze / publish | Rare | Founder MOC + certificates | Living links in; no frozen edit |
| Vault health | Quarterly + after KOS sprints | Risk + GES | Score tables |
| Feature review | When shipping | Feature MOC + Changelog | Changelog append |
| ADR review | When deciding | Decisions + ADR note | Status change |

### 7.2 Review click rule

Every review starts from **one** entry surface (bookmark or Index chip). Gathering evidence may add ≤2 clicks to SoT. If a review needs a scavenger hunt, add a curated table to the entry surface — do not train the Founder to browse folders.

### 7.3 Decision review specifically

```text
Decisions Dashboard → open ADR → accept/reject/supersede → link affected Feature/Eng
    → update Context if blocks work → done
```

Budget: **≤3 clicks** to the ADR body from cold.

---

## 8. Navigation

### 8.1 Navigation spine (human)

```text
Boot pins
  → Context (today)
  → Home (authority/blockers) 
  → Knowledge-Graph (map)
  → Domain MOC or Dashboard (lane)
  → Leaf SoT
```

Agents: Home → Context → (Genesis MOC if law) → domain notes only.

### 8.2 Two-click guarantee map

| Destination | From pin/hotkey | Intermediate |
|-------------|-----------------|--------------|
| Any H1 MOC | KG | 1 click on KG |
| Any dashboard | Workspace Index **or** Executive drill | ≤1 |
| Genesis entrypoint | Genesis MOC | 1 |
| UXA Publication | UX Dashboard or Roadmap spine | ≤2 |
| Feature entity | Features Index / Product MOC | ≤2 |
| Eng subsystem | Engineering MOC | ≤2 |
| Active program spec | Context Touch / link | 1 |
| Prompt SoT | AI Dashboard or Prompts index | ≤2 |

### 8.3 Navigation anti-patterns

| Don’t | Do |
|-------|-----|
| Scroll file tree for Features | Features Index / Product MOC |
| Open random Genesis deep file | Envelope tables |
| Use Archive Design-Bible as living | Palette + Design MOC |
| Duplicate Home content into Executive | Link Home blockers |
| Keep 20 pins | ≤10 pins (FW1) |

### 8.4 Graph as navigation (optional lane)

| Intent | View |
|--------|------|
| Where am I in vault? | GV-HUB-RING |
| Feature system | GV-FEATURE / GV-PROD |
| Law gravity | GV-LAW |
| Hygiene | GV-ORPHAN |
| Daily spatial | GV-DEFAULT or GV-PERF-LITE |

Graph is **orientation**, not primary click path for known jobs.

---

## 9. Capture

### 9.1 Capture doctrine

1. **Hotkey → type → parent stamped → correct folder**  
2. Inbox allowed for ≤24h; then parent or delete  
3. Never capture into Genesis / frozen packs  
4. Capture is cheap; classification is mandatory  

### 9.2 Capture palette (QuickAdd design)

| ID | Creates | Parent default | Folder |
|----|---------|----------------|--------|
| `qa-inbox` | Fleeting note | Inbox index | `Operations/Inbox/` or `15_MEMORY/Inbox/` (choose one at impl) |
| `qa-touch` | Append line to Context Touch | Context | Context file |
| `qa-bug` | Bug note | Bugs index | `11_BUGS/` |
| `qa-adr` | ADR stub | Decisions index | `10_DECISIONS/` |
| `qa-feature` | Feature MOC stub | Features Index | `09_FEATURES/<Entity>/` |
| `qa-eng` | Eng leaf | Engineering MOC | Eng folder prompt |
| `qa-changelog` | Changelog stub under feature | Feature MOC | Feature folder |
| `qa-errata` | Living errata | Roadmap MOC | Roadmap living |
| `qa-meeting` | Meeting note | Meetings index | `13_MEETINGS/` |
| `qa-sprint` | Sprint note | Sprints index | `12_SPRINTS/` |

**Click budget:** **1** (hotkey + select) to empty editor in right place.

### 9.3 Capture → process

| State | Action | Max age |
|-------|--------|---------|
| Inbox | Promote via Templater move + parent, or kill | 24h |
| Stub `status: draft` | Fill or mark planned | 7d |
| ADR `proposed` | Weekly decision review | until closed |

### 9.4 Mobile / away-from-desk

If Obsidian mobile used: **only** `qa-inbox` + `qa-touch`. Process on desktop. No architecture drafting on mobile capture.

---

## 10. Search

### 10.1 Search ladder (fastest first)

| Tier | Tool | Use when |
|------|------|----------|
| 1 | Pins / hotkeys | Known surfaces |
| 2 | Context / Home links | Today + authority |
| 3 | KG + MOC tables | Domain browsing |
| 4 | Omnisearch / core search | Known phrase, file name |
| 5 | Dataview dashboard tables | Sets (“all open bugs”) |
| 6 | Graph GV-* | Spatial / orphan / cluster |
| 7 | Agent in Cursor | Code + vault together (not vault-only scavenger) |

### 10.2 Search click budgets

| Need | Method | Clicks |
|------|--------|-------:|
| Open known note name | Omnisearch → Enter | 1 |
| All open bugs | Risk Dashboard | 1–2 |
| Palette lock | Design Dashboard or Design MOC | 1–2 |
| P9 entry | Genesis MOC table | 1–2 |
| “Who supersedes Design-Bible?” | Search `supersedes` / Design Dashboard cold | ≤2 |

### 10.3 Search hygiene

- Prefer path-qualified links so search + graph resolve agree  
- Ban relying on hex `#ff6b35` as tags  
- Omnisearch exclude `Archive`, `99_ARCHIVE`, `_templates` by default (impl)  

---

## 11. Decision making

### 11.1 Decision ladder

```text
Is it law? → Genesis (read) — cannot decide against it in Workspace
Is it frozen architecture? → Cite UXA/UXI — change only via new program / ADR + errata
Is it product/eng ops? → ADR or Feature changelog
Is it today’s focus? → Context only (not an ADR)
```

### 11.2 Decision flow (min clicks)

| Step | Action | Clicks |
|------|--------|-------:|
| 1 | Open Decisions Dashboard | 1 |
| 2 | QuickAdd `qa-adr` if new | 1 |
| 3 | Fill ADR: context, options, decision, links to Feature/Eng/Genesis MOC | in-note |
| 4 | Set `status: proposed` → weekly review or decide now | 0 |
| 5 | On accept: link children; update Context if it unblocks work | 1 |

### 11.3 Decision surfaces

| Surface | Role |
|---------|------|
| `10_DECISIONS/*` | SoT |
| Decisions Dashboard | Queue / stale / linkage gaps |
| Founder certificates | Freeze / vault ops decisions |
| Executive open-decisions widget | Glance only |

### 11.4 What never goes in an ADR

- Temporary Touch items  
- Bug fixes (use Bugs + changelog)  
- Replacing Genesis text  

---

## 12. Execution

### 12.1 Execution model

```text
Context Next/Touch  →  concrete note (Feature/Eng/Program)  →  code/deploy outside vault
    →  vault update (changelog / Context)  →  done
```

Vault executes **knowledge work**. Product execution (code, deploy) happens in repo/IDE; vault records contracts and outcomes.

### 12.2 Execution click paths

| Job | Path | Clicks |
|-----|------|-------:|
| Continue active program | Context → program note | 1 |
| Ship feature docs | Features Index → Feature MOC → Changelog | ≤3 |
| Close bug | Risk/Bugs → bug note → status | ≤3 |
| Launch checklist | Program 0 / Daily Ops tasks | ≤2 |
| Deploy note | Deploy docs via Eng Dashboard | ≤2 |
| Update “what I’m doing” | Context only | 1 |

### 12.3 Execution boards (ops only)

| Board | Allowed use |
|-------|-------------|
| Daily Ops tasks | Today’s checkboxes |
| Launch Kanban (optional) | Program 0 execution tracking |
| Sprint note | Timeboxed eng/docs work |

**Forbidden:** Kanban as IA/requirements SoT (Automation A-anti-pattern).

### 12.4 Proof-or-stop inside Workspace

Before claiming “done” in Context or changelogs: evidence same turn (vault proof-or-stop culture). Executive/Daily Ops may link Proof-or-Stop prompt — **1 click**.

---

## 13. Domain lanes

Each lane: **Entry (1 click)** · **SoT** · **Derived surface** · **Typical jobs** · **Click budget**.

### 13.1 Research

| | |
|--|--|
| **Entry** | Research hub MOC **or** UX Intelligence INDEX via Roadmap spine |
| **SoT** | `Roadmap/UX-Intelligence/**` (frozen evidence) + living research notes |
| **Derived** | UX Dashboard (Intel strip) |
| **Jobs** | Find evidence · cite in Feature/ADR · do not rewrite Intel |
| **Budget** | ≤2 to INDEX; ≤3 to a specific Intel note from spine |

### 13.2 Architecture (UX / system expression)

| | |
|--|--|
| **Entry** | UX Dashboard **or** UXA `00_INDEX` / Publication Record |
| **SoT** | Frozen `Roadmap/UX-Architecture/**` under P9; expression hubs |
| **Derived** | UX + Genesis (cite) + Roadmap spine |
| **Jobs** | Consume flows · ceilings (`/m`) · D05 · downstream Design/Motion/Eng |
| **Budget** | **1–2** to Publication Record; never edit frozen in flow |
| **Change path** | New program + living errata + ADR — not Workspace “tweak” |

### 13.3 Product

| | |
|--|--|
| **Entry** | Product MOC / Features Index |
| **SoT** | `01_PRODUCT/**`, `09_FEATURES/**`, Business-Rules memory |
| **Derived** | Features Board / Product widgets on Executive |
| **Jobs** | Feature state · changelog · pricing/launch notes · waitlist |
| **Budget** | ≤2 to Feature MOC; ≤3 to changelog |
| **Ceilings** | Mobile `/m` capture-only — cite UXA; 1 click from UX Dashboard ceilings callout |

### 13.4 Engineering

| | |
|--|--|
| **Entry** | Engineering MOC **or** Eng Dashboard |
| **SoT** | `02_`–`07_`, API, DB, Native, Monorepo |
| **Derived** | Eng Dashboard coverage matrix |
| **Jobs** | Find subsystem note · spot thin folders · link Feature ↔ Eng |
| **Budget** | ≤2 to subsystem; Monorepo **1–2** |
| **Rule** | Three clients — never mix commit advice in one note without Monorepo cite |

### 13.5 AI

| | |
|--|--|
| **Entry** | AI Dashboard |
| **SoT** | `06_AI/**`, `14_PROMPTS/**` (living), `15_MEMORY` packs, UXA AI contracts (frozen cite) |
| **Derived** | AI Dashboard |
| **Jobs** | Prompt edit · Proof-or-Stop · provider map · agent handoff via Context |
| **Budget** | ≤2 to prompt SoT |
| **Rule** | Genesis supporting prompts = historical; do not edit Genesis copies |

### 13.6 Law / Constitution (read lane)

| | |
|--|--|
| **Entry** | Genesis MOC (envelope) |
| **SoT** | `Genesis/**` |
| **Derived** | Genesis Dashboard |
| **Jobs** | Open P5/P8/P9 entry · confirm non-override · cite in ADR |
| **Budget** | ≤2 to entrypoint |
| **Forbidden** | Workspace automation writing Genesis |

### 13.7 Design

| | |
|--|--|
| **Entry** | Design MOC / Design Dashboard |
| **SoT** | `08_DESIGN/Palette` (+ living design notes) |
| **Derived** | Design Dashboard |
| **Jobs** | Confirm palette lock · brand navbar lock · avoid Archive bible |
| **Budget** | **1–2** to Palette |

### 13.8 Founder / ops certificates

| | |
|--|--|
| **Entry** | Founder MOC |
| **SoT** | `Founder/**`, freeze certificates (living links) |
| **Derived** | Decisions / Genesis freeze lists |
| **Jobs** | Vault freeze integrity · program authorization records |
| **Budget** | ≤2 |

---

## 14. Cross-cutting job catalog (cheat sheet)

| Job | First click | Second | Third (if needed) |
|-----|-------------|--------|-------------------|
| Start day | Context | Executive | Touch target |
| End day | Context | — | — |
| Capture thought | QuickAdd inbox | — | Process later |
| File bug | QuickAdd bug | — | — |
| Decide | Decisions / qa-adr | ADR body | Context if unblocks |
| Check law | Genesis MOC | P-entry | — |
| Check UX freeze | UX Dashboard | Publication | — |
| Build feature | Features Index | Feature MOC | Eng note |
| Eng gap | Eng Dashboard | Thin folder | New eng leaf capture |
| AI rule | AI Dashboard | Proof-or-Stop | — |
| Launch | Roadmap / Program 0 | Checklist | Daily Ops task |
| Vault sick? | Risk / Executive KPI | GV-ORPHAN | Fix parent links |
| Teach vault | GV-HUB-RING | KG | — |
| Research cite | Roadmap spine | UXI INDEX | Note |
| Weekly plan | Roadmap + Risk | Context write | — |
| Monthly posture | Mode: Monthly chip | Lane tour | Context / Priorities |

---

## 15. Minimum-click operating contract

### 15.1 Hard rules

1. **Pinned ≤10** — Context, Home, Executive, Daily Ops, KG, Genesis MOC, Workspace Index, Active Program, one lane pin (Eng **or** Product), Search/QuickAdd via hotkey not pin.  
2. **No job >3 clicks** without a redesign ticket in Program V1 / ops.  
3. **Context is the only daily SoT** for focus — Executive must not fork “today.”  
4. **One capture hotkey** opens palette; typed macros do the rest.  
5. **Dashboards never edit themselves into SoT** — Founder edits sources.  
6. **Law/frozen:** read paths only from Workspace.  

### 15.2 Warm vs cold

| State | Definition | Expectation |
|-------|------------|-------------|
| Cold | Obsidian just opened | ≤2 clicks to productive SoT |
| Warm | `Founder` workspace already up | ≤1 click to any routine job via pin/hotkey |
| Deep | Inside a Feature/Eng note | Local graph + backlinks; escape via KG pin |

---

## 16. Relationship to dashboards

| This doc (`08`) | Dataview Spec (`04`) |
|-----------------|----------------------|
| Experience, rhythms, click budgets, lanes | Widget IDs, queries, folder layout |
| When to open a surface | What renders on that surface |
| Capture / search / decide / execute | Derived tables only |

**Impl order suggestion:** Experience pins + Context hygiene can land before all 10 dashboards. Dashboards amplify glance; they do not define the Founder day.

---

## 17. Implementation sketch (not authorized now)

| Phase | Experience work |
|-------|-----------------|
| W0 | Bookmarks/pins + `Founder` workspace layout + hotkey map doc |
| W1 | QuickAdd palette + Inbox policy + Context touch macro |
| W2 | Workspace Index mode chips + Executive/Daily Ops (from `04`) |
| W3 | Domain lane pins verified ≤2-click map |
| W4 | Weekly/Monthly ceremony notes (templates) linking surfaces |
| W5 | Omnisearch excludes + Graph views linked from Index |

Depends on Automation Phase 0–1 and optional Metadata M0 for clean stamps.

---

## 18. Risks

| Risk | Mitigation |
|------|------------|
| Executive becomes second Context | FW2; Executive links Context, no duplicate Today prose |
| Pin sprawl | Cap 10; quarterly prune |
| Inbox rot | 24h rule; Weekly flush |
| Dashboard soothsaying | Derived headers; edit sources |
| Too many plugins | FW8; Omnisearch optional |
| Founder bypasses Context for chat | Agent boot + SWITCH CHAT discipline |

---

## 19. Explicit non-actions (this deliverable)

- No workspace JSON / hotkeys applied  
- No QuickAdd / dashboard creation  
- No pin changes in `.obsidian`  
- No Genesis / frozen edits  
- No commits  

---

## 20. Authority statement

Founder Workspace is **operations**. It cannot override Genesis. Minimum-click convenience never justifies writing law, relocating frozen packs, or treating derived dashboards as product requirements.

---

## 21. Closeout

| Item | Status |
|------|--------|
| Founder Workspace experience design | **COMPLETE** (design) |
| Dashboard query spec | Separate — [[04_Founder_Workspace_Dataview_Spec]] |
| Implementation | **NONE** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend click budgets & lanes → authorize **W0** (pins + workspace layout) and/or dashboard Phase 0.

---

**Stop.**
