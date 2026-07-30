---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/02_Vault_Architecture_Specification
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: ai-workspace
implementation: none
genesis_touch: forbidden
version: 1.0
---

# AI Workspace — Agent × Vault Interaction Design

**How AI agents load, navigate, resolve authority, and fail safely inside `docs/knowledge/`.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Design only — zero implementation** |
| Parents | [[02_Vault_Architecture_Specification]] · [[08_Founder_Workspace]] · [[03_Graph_Engineering_v1]] · [[06_Metadata_Migration_Plan]] · [[00_HOME]] · [[15_MEMORY/Current-Context]] |
| Companion | Human experience = [[08_Founder_Workspace]]; dashboards = [[04_Founder_Workspace_Dataview_Spec]] |
| Runtime today | Cursor rules + `AGENTS.md` + vault notes (this spec designs the **contract**, not new tooling) |
| Genesis / frozen | Read via envelope / indexes; **never** edit |

---

## 0. What AI Workspace is

**AI Workspace** = the operating contract for **any agent** (Cursor, Codex, Claude Code, future bots) that reads or writes AIIMIN knowledge.

It answers:

1. What do I load first?  
2. What is memory vs law vs today’s focus?  
3. Which program am I in?  
4. Who wins when notes conflict?  
5. How do I search without burning tokens?  
6. Which prompts apply?  
7. How do I navigate / use the graph?  
8. What do I do when blocked, drifted, or wrong?

**Not this doc:** Product in-app AI (Life OS intelligence features). That stays Feature / UXA / `06_AI` notes. This doc = **builder agents** working the vault + codebase.

**Success test:** Agent completes a scoped task without whole-repo scan, without Genesis edits, with correct SoT, and with proof-or-stop closeout — after a **deterministic boot**.

---

## 1. Principles

| ID | Principle | Consequence |
|----|-----------|-------------|
| AI1 | **Vault-first** | Prefer curated notes over raw repo grep |
| AI2 | **Boot before invent** | Home → Context before planning or coding |
| AI3 | **Token discipline** | Minimum notes; no “read everything to be safe” |
| AI4 | **Authority ladder** | Genesis > expression/frozen arch > eng > ops; `can_override_genesis: false` always |
| AI5 | **Context is today’s SoT** | Chat must not invent priorities that contradict Current-Context |
| AI6 | **Program scoping** | Active program notes bound the task; don’t mix Program 0 + V1 + Native unless Context says so |
| AI7 | **Proof-or-stop** | No done/fixed/shipped without same-turn evidence |
| AI8 | **Fail closed** | Ambiguity → `blocked` + ask Founder; don’t guess law |
| AI9 | **Same spine as Founder** | Agent boot mirrors human Home → Context → domain ([[08_Founder_Workspace]]) |
| AI10 | **Skills before freestyle** | Matching `SKILL.md` read before acting when skill applies |

---

## 2. Boot process

### 2.1 Mandatory boot sequence (every new chat / agent session)

```text
B0  Session start
B1  Read docs/knowledge/00_HOME.md                          (required)
B2  Read docs/knowledge/15_MEMORY/Current-Context.md        (required)
B3  If constitutional / IA / interaction / visual law:
      Read Maps of Content/Genesis.md (envelope)
      Then only needed Genesis entrypoints (P5/P8/P9…)
B4  If Context names Active program:
      Read program 00_INDEX (or listed Touch specs) — Program loading (§5)
B5  Load only task-relevant Feature / Arch / DB / API / Design notes
B6  Load only source files to change or verify
B7  If skill matches (≥1% chance): read SKILL.md before acting
B8  Announce skill briefly; then act
```

**Forbidden at boot:** whole-repo Glob/Grep “for context”; loading `99_ARCHIVE/` / fat AGENTS history; editing Genesis; treating Handoff-Latest as required unless Founder asked for paste pack.

### 2.2 Boot depth by task class

| Task class | Boot depth |
|------------|------------|
| Ops / docs / Program V1 design | B1–B2 + program Touch files |
| Feature change | B1–B2 + Feature MOC + related Eng/API/DB |
| UX / ceiling / `/m` | B1–B2 + Genesis envelope + UXA Publication / relevant frozen INDEX (read) |
| Auth / schema | B1–B2 + **stop** unless Founder explicitly asked |
| Bugfix | B1–B2 + systematic-debugging skill + minimal repro files |
| Deploy / ship | B1–B2 + Deploy notes + git workflow rules |

### 2.3 Boot outputs (agent internal checklist)

After boot, agent must be able to state (briefly, when relevant):

1. **Active program** (from Context)  
2. **Do not** constraints (from Context)  
3. **Touch** paths  
4. **Authority posture** (can I write? where?)  
5. **Next** Founder-facing action  

If any of 1–3 missing/stale → update Context as part of work (ops write) or ask Founder.

### 2.4 Re-boot triggers (mid-session)

| Trigger | Action |
|---------|--------|
| Topic change / milestone done / drift | 🚨 SWITCH CHAT; refresh Context before leaving |
| Founder points at new program | Re-read Context + program INDEX |
| Conflict with Genesis suspected | Envelope → entrypoint; do not continue product invention |
| Big vault/rule change just landed | Prefer new chat |

---

## 3. Context loading

### 3.1 Context layers (what “loading context” means)

| Layer | Source | When loaded | Token posture |
|-------|--------|-------------|---------------|
| L-RULE | Cursor always-on rules + slim `AGENTS.md` | Auto / session | Fixed; don’t re-dump |
| L-HOME | `00_HOME.md` | Every boot | Short; authority + blockers |
| L-NOW | `15_MEMORY/Current-Context.md` | Every boot | Short; program + Next + Do not + Touch |
| L-PROG | Active program INDEX / specs | If Context names program | Only listed artifacts |
| L-LAW | Genesis envelope + entrypoints | Constitutional tasks | Read-only; path-implied KL-LAW |
| L-ARCH | UXA / UXI indexes | UX / ceiling / expression tasks | Read-only frozen |
| L-DOM | Feature / Eng / Design / API / DB notes | Task-scoped | Only involved entities |
| L-MEM | `15_MEMORY` packs (Terminology, Business-Rules, …) | When language/rules needed | Prefer links over full paste |
| L-PROMPT | `14_PROMPTS/*` | When behavior governed by named prompt | Living SoT only |
| L-CODE | Repo files | After vault scope clear | Only change/verify set |
| L-CHAT | Current thread | Ongoing | Prefer SWITCH CHAT over stuffing |

### 3.2 Load vs cite vs open

| Verb | Meaning |
|------|---------|
| **Load** | Read into agent context this turn |
| **Cite** | Know path; open only if decision depends on it |
| **Open** | Read file because task requires content |

Agents **load** Home + Context; **cite** MOCs; **open** leaf SoT only as needed.

### 3.3 Anti-patterns

| Anti-pattern | Correct |
|--------------|---------|
| Grep entire `docs/knowledge` | Follow Home → Context → Touch |
| Re-read Genesis corpus | Envelope + one entrypoint |
| Load all Program V1 specs always | Only Touch / named Next items |
| Trust chat memory over Context | Context wins; update Context if Founder changed focus |
| Load Archive as SoT | Cold = provenance only |

---

## 4. Memory hierarchy

### 4.1 Hierarchy (highest trust → lowest)

```text
1. Genesis (law)                         — immutable; path docs/knowledge/Genesis/
2. Frozen expression packs               — UXA / UXI / Stage A certificates (read)
3. Living product/eng contracts          — Feature MOCs, Arch notes, ADRs (accepted)
4. Current-Context                       — today’s focus / Next / Do not / Touch
5. Home                                  — blockers, lens, navigation pointers
6. 15_MEMORY packs                       — compressed AI memory (Terminology, Personas…)
7. 14_PROMPTS                            — agent procedure prompts (living)
8. Program living specs                  — Roadmap/Program-* design docs
9. Dashboards / GES / derived views      — never SoT
10. Chat thread / Handoff-Latest paste   — ephemeral; Context supersedes
11. Archive / 99_ARCHIVE                 — historical only
```

### 4.2 Memory pack roles (`15_MEMORY`)

| Note | Role for agents |
|------|-----------------|
| **Current-Context** | Session handoff + today (required every boot) |
| Handoff-Latest | Optional paste pack **only if Founder asks** |
| Terminology / Product-Language | Naming consistency |
| Business-Rules | Ops constraints compressed |
| Personas | Audience / tone when relevant |
| Other packs | On-demand only |

### 4.3 Dual-layer writing

| Audience | Style |
|----------|-------|
| Human Feature / Architecture docs | Clear Obsidian prose |
| `15_MEMORY/*`, slim AGENTS | Caveman-compressed OK |
| Agent chat replies | Caveman (project rule) unless clarity exception |
| Genesis | Do not write |

### 4.4 Memory write-back rules

| Event | Write |
|-------|-------|
| Focus / program / Touch change | **Update Current-Context** (required) |
| Feature behavior change | Feature MOC + Changelog |
| Decision | ADR |
| Milestone / SWITCH CHAT | Context first; Handoff-Latest only on ask |
| Law discovery | **Never** write Genesis; living errata / ADR / envelope only |

---

## 5. Current Context (contract)

### 5.1 Why agents treat it as sacred

Current-Context is the **shared focus register** between Founder and agents. Chat is noisy; Context is durable for the next session.

### 5.2 Required sections (schema for agents)

| Section | Agent use |
|---------|-----------|
| **Date / Branch** | Freshness + git posture |
| **Active program** | Program loading root |
| **Status table** | What’s design vs shipped |
| **Next** | Ordered work; prefer #1 unless Founder overrides in-message |
| **Do not** | Hard session constraints |
| **Touch** | Default file allowlist for edits |

### 5.3 Resolution: Founder message vs Context

| Situation | Winner |
|-----------|--------|
| Founder explicit instruction this turn | Founder message (then update Context if focus shifts) |
| Ambiguous chat vs clear Context Next | Context Next |
| Chat invents new program | Reject; point at Context; ask |
| Context stale vs Home blockers | Prefer Context for focus; Home for launch blockers; reconcile in Context update |

### 5.4 Agent duties toward Context

1. Read at boot  
2. Obey Do not  
3. Prefer Touch paths  
4. Update when focus changes (before SWITCH CHAT)  
5. Never delete Do not silently  

---

## 6. Program loading

### 6.1 What a “program” is

A bounded Roadmap effort with INDEX + artifacts (e.g. Program V1 Obsidian Knowledge OS, Program 0 Product Readiness). Context **Active program** selects which stack loads.

### 6.2 Program load algorithm

```text
1. Read Active program name + wikilinks from Current-Context
2. Open program 00_INDEX (if exists)
3. Open only artifacts listed in Context Touch / Next
4. Do not load sibling programs unless bridging (cite Roadmap spine) or Founder asks
5. Respect program mode: design-only vs authorize-impl
```

### 6.3 Program V1 example (illustrative)

If Context says Program V1 + Touch `08_Founder_Workspace.md`:

- Load: Home, Context, `08_…` (and parents it cites only as needed)  
- Do **not** auto-load all of `01`–`07` unless task needs them  
- Design-only artifacts: `implementation: none` in FM → do not execute

### 6.4 Multi-program conflict

| Case | Behavior |
|------|----------|
| Context lists one active | That program only |
| Founder asks unrelated feature mid-Program-V1 | SWITCH CHAT; update Context |
| Need frozen UXA while in V1 | Read UXA INDEX as **dependency cite**, not “switch program” |

### 6.5 Program status vocabulary (for agents)

| Status in Context | Agent action |
|-------------------|--------------|
| COMPLETE (design) | Do not implement unless Founder authorizes named phase |
| NONE (impl) | Confirm no silent execution |
| UNTOUCHED (Genesis/frozen) | Hard constraint |

---

## 7. Authority resolution

### 7.1 Ladder (decisive)

```text
Genesis (P1–P9)
  > Expression hubs / Constitution / Governance / Interaction (must cite law)
  > Frozen UX Architecture / UX Intelligence (expression under P9 / evidence)
  > Accepted ADRs / Founder certificates
  > Living Feature + Engineering contracts
  > Current-Context / Home / Program ops specs
  > Dashboards / chat / archive
```

Nothing in layers below may set `can_override_genesis: true`.

### 7.2 Conflict table

| Conflict | Resolution |
|----------|------------|
| Feature note vs Genesis | Genesis wins; fix Feature or ADR |
| Feature vs UXA frozen | UXA wins for IA/ceilings; Feature must cite; no silent UXA edit |
| UXA vs Genesis P9 | Genesis wins; UXA is expression |
| Program V1 design vs Founder message “implement now” | Founder message wins for authorization; still no Genesis edit |
| Dashboard KPI vs Feature MOC | Feature MOC wins |
| Two living notes disagree | Prefer `lifecycle: living` + newer `last_reviewed` + parent MOC; else ask |
| Archive vs living | Living wins |
| Agent training prior vs vault | Vault wins |

### 7.3 Write authority matrix

| Path | Agent write? |
|------|----------------|
| `Genesis/**` | **Never** |
| `Roadmap/UX-Architecture/**`, `UX-Intelligence/**` | **Never** unless Founder ADR explicitly allows index-only |
| `15_MEMORY/Current-Context.md` | Yes (ops) |
| Feature / Eng / Program living | Yes when task requires + vault update rules |
| `14_PROMPTS` living | Yes when prompt work authorized |
| `Dashboards/**` | Yes for derived views; not product SoT |
| `Archive/**`, `99_ARCHIVE/**` | No (except rare provenance banners if asked) |
| Auth / DB schema code | Only if Founder explicitly asks |

### 7.4 Ceiling resolution (product)

| Ceiling | Source | Agent duty |
|---------|--------|------------|
| `/m` capture-only | Product locks + UXA | Never add analytics/tools to `/m` |
| Palette lock | `08_DESIGN/Palette` + rules | No new brand colors without ask |
| Navbar split lock | Product locks | Logo → `/brand`; wordmark → `/overview` |

---

## 8. Search order

### 8.1 Ordered search protocol

Agents search in this order — **stop when answer found**:

```text
S1  Current-Context (Touch / Next / Active program links)
S2  Home pointers (MOCs, blockers, Genesis MOC)
S3  Active program INDEX / Touch specs
S4  Domain MOC / Feature Index / Eng MOC (wikilinks)
S5  Named vault note via known path (Read)
S6  Narrow Grep/Glob inside one folder or entity
S7  Frozen pack 00_INDEX / Publication Record (read-only)
S8  Genesis envelope → single entrypoint
S9  Omnisearch-equivalent only if path unknown (still scoped)
S10 Whole-repo scan — ONLY if Founder explicitly requests
```

### 8.2 Search budgets

| Budget | Rule |
|--------|------|
| Default | ≤5 file Reads before asking or narrowing with Founder |
| Feature task | Feature MOC + ≤3 related notes + code touched |
| “Does X exist?” | Grep/Glob scoped; empty result = evidence for “not found” |
| Law question | Envelope first; never “search all Genesis” |

### 8.3 Tool choice

| Need | Tool |
|------|------|
| Known path | `Read` |
| Symbol in one area | `Grep` with path |
| Filename pattern | `Glob` scoped |
| Behavior contract | Vault Feature/Arch note before code archaeology |
| Runtime proof | Shell / tests — proof-or-stop |

---

## 9. Prompt retrieval

### 9.1 Living SoT

Canonical prompts: `docs/knowledge/14_PROMPTS/`.

Genesis supporting prompt copies = **historical only** — do not edit; do not prefer over living.

### 9.2 Retrieval order

```text
P1  Task implies named prompt (Proof-or-Stop, Chat-Handoff, Cursor-Rules)
P2  Read living note under 14_PROMPTS/
P3  Skills-Registry / matching .agents/skills/**/SKILL.md
P4  Always-on Cursor rules (already injected — don’t re-read full text unless amending rules)
P5  Never retrieve Genesis prompt duplicates as SoT
```

### 9.3 Prompt → situation map

| Situation | Prompt / skill |
|-----------|----------------|
| Claiming done/fixed/shipped | Proof-or-Stop |
| Long thread / topic change | Chat-Handoff + SWITCH CHAT banner |
| Which rules exist | Cursor-Rules index |
| Commit message | caveman-commit skill |
| Bug | systematic-debugging skill |
| UI design | frontend-design / design-taste + Palette |
| Auth change | better-auth skills **and** Founder explicit ask |

### 9.4 Prompt write-back

When changing agent procedure: update living `14_PROMPTS` + Cursor rule if always-on; mention in Context if it changes boot behavior; SWITCH CHAT after big rule change.

---

## 10. Workspace navigation (agent)

### 10.1 Navigation spine (same as Founder, agent-flavored)

```text
Home → Current-Context → (Genesis MOC if law) → Program INDEX → Domain MOC → Leaf SoT → Code
```

### 10.2 Hop budget

| Goal | Max hops from Home |
|------|-------------------:|
| Today’s Touch file | 2 (Home→Context→Touch) |
| Feature MOC | 3 |
| UXA Publication | 3 via Roadmap/UX Dashboard cite |
| Eng subsystem | 3 via Eng MOC |
| Genesis P5/P8/P9 entry | 2 via envelope |

If >4 hops needed, vault nav is broken — fix MOC/Context rather than scanning.

### 10.3 Dashboards for agents

Dashboards are **optional accelerators** after boot — not boot requirements.

| Use dashboard? | When |
|----------------|------|
| Yes | Founder asks vault health / open bugs / coverage |
| No | Implementing a Feature Touch path already named |
| Never | As authority over Genesis/Features |

### 10.4 Monorepo lane lock

Before code nav, resolve client from Context/task:

| Client | Path |
|--------|------|
| Web | `frontend/` (not mobile-only unless asked) |
| Capacitor `/m` | `frontend` mobile + android |
| Native V2 | `native-android/` + `server/routes/mobile.js` |

Never mix clients in one commit unless Founder asks.

---

## 11. Knowledge graph usage

### 11.1 How agents use the graph (logical)

Agents rarely need Obsidian GUI graph. They use **graph contracts**:

| Need | Use |
|------|-----|
| Parent of a note | `## Parent` / MOC / path default ([[03_Graph_Engineering_v1]]) |
| What to link when editing | E-parent + E-authority; E-see ≤5 |
| Discover related | MOC Children tables; Feature Index |
| Cluster bridges | Hub-mediated only (Feature ↔ UXA via Feature MOC) |
| Orphans | Living orphan = fix parent; Genesis orphan = ignore (envelope) |
| Colliding basenames | Path-qualified wikilinks |

### 11.2 Graph when editing living notes

Authoring checklist (from Graph Eng / Opt):

1. Confirm `note_type` / parent  
2. Ensure Parent link  
3. Ensure parent lists child if hub  
4. Authority cite if product/eng behavior  
5. Do not edit Genesis/frozen to “fix” graph  

### 11.3 GES / Graph Opt v2

Agents **do not** optimize GES unless Context/Touch says graph work. When doing graph work: follow [[07_Graph_Optimization_v2]] phases; never chase density with link salad.

### 11.4 Graph anti-patterns for agents

| Don’t | Do |
|-------|-----|
| Link every leaf to Home | Parent = domain hub |
| Bulk-link Genesis files | Envelope tables only |
| Treat backlink count as quality | Typed edges EQ-A/B |
| Open GV-FULL for every task | MOC + Context |

---

## 12. Failure handling

### 12.1 Failure classes

| Class | Example | Agent response |
|-------|---------|----------------|
| F-AUTH | Task needs Genesis change | Refuse; propose living errata/ADR |
| F-CEIL | Proposal breaks `/m` or palette | Refuse; cite ceiling |
| F-SCOPE | Whole-repo scan urge | Stop; use search order |
| F-AMB | Two SoTs conflict | Report conflict + ladder; ask |
| F-STALE | Context vs Founder message unclear | Ask which wins; offer Context update |
| F-PROOF | Want to say “fixed” without evidence | Run check or mark `blocked` |
| F-DRIFT | Wrong architecture / re-ask solved facts | SWITCH CHAT; refresh Context |
| F-SKILL | Skipped required skill | Back up; read skill; continue |
| F-TOOL | Sandbox/network block | Request permission or report `blocked` |
| F-IMPL | Design-only artifact, Founder didn’t authorize | Do not implement; remind design mode |

### 12.2 Status vocabulary (closeout)

Align proof-or-stop:

| Status | When |
|--------|------|
| `passed` | Required checks ran this turn; evidence cited |
| `failed` | Checks ran; bar not met |
| `blocked` | Cannot verify / need Founder / authority stop |
| `in progress` | Still working; no completion language |

### 12.3 Failure playbooks

**Authority stop**

```text
State constraint → cite path (Genesis MOC / UXA Publication / product lock)
→ offer legal alternative (living note / ADR / errata)
→ status blocked
```

**Missing context**

```text
Name missing fact → create/update correct vault note OR ask Founder
→ do not compensate with huge code reads
```

**Contradiction**

```text
Quote both sources (short) → apply ladder §7 → if still tied, ask Founder
```

**Chat bloat / drift**

```text
Update Current-Context → print SWITCH CHAT banner → stop stuffing thread
```

### 12.4 Never-fail-open

| Temptation | Fail closed |
|------------|-------------|
| “Just edit Genesis once” | No |
| “Schema tweak while here” | No unless asked |
| “Commit to save work” | No unless asked |
| “Tests probably pass” | Run or `blocked` |
| “Dashboard says X so ship X” | Verify SoT |

---

## 13. End-to-end session lifecycle

```text
BOOT (Home → Context → program/law as needed)
  → SKILL check
  → SEARCH order to SoT
  → AUTHORITY check (write matrix)
  → ACT (minimal files)
  → VAULT WRITE-BACK (Context / Feature changelog / ADR as required)
  → PROOF closeout (passed|failed|blocked)
  → if milestone/topic change: SWITCH CHAT
```

---

## 14. AI Workspace vs Founder Workspace

| | Founder Workspace ([[08]]) | AI Workspace (this) |
|--|---------------------------|---------------------|
| Actor | Human in Obsidian | Agent in Cursor/tools |
| Optimize | Clicks | Tokens + correctness |
| Today SoT | Current-Context | Same |
| Boot | Pins + Executive glance | Home + Context Reads |
| Capture | QuickAdd | Write notes via tools + templates rules |
| Graph | GV views | MOC/parent contracts |
| Failure | Review rituals | blocked + SWITCH CHAT + refuse law edits |

Shared spine is intentional (AI9).

---

## 15. Implementation sketch (not authorized)

| Phase | Work |
|-------|------|
| A0 | This contract accepted; linked from Home / AI Dashboard / `14_PROMPTS` |
| A1 | Optional `14_PROMPTS/AI-Workspace-Boot.md` one-pager mirroring §2 |
| A2 | Agent lint: warn if Touch ignored; warn if Genesis path write attempted |
| A3 | Dashboard AI lane widgets cite this note |
| A4 | Skills-Registry row for AI Workspace |

No new agent runtime required for A0–A1 — rules already approximate boot; this doc is the explicit OS.

---

## 16. Explicit non-actions (this deliverable)

- No Cursor rule file changes  
- No prompt rewrites  
- No Context structure migration  
- No Genesis / frozen edits  
- No commits  

---

## 17. Authority statement

AI Workspace is **operations**. Agents executing this contract cannot override Genesis. Convenience, token pressure, or “completeness” never justify whole-repo scans, law mutation, or proof-free completion claims.

---

## 18. Closeout

| Item | Status |
|------|--------|
| AI Workspace design | **COMPLETE** (design) |
| Implementation | **NONE** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend → optional A1 boot one-pager in `14_PROMPTS` → keep Context as handoff SoT.

---

**Stop.**
