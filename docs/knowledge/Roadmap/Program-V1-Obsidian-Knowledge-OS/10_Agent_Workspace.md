---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/09_AI_Workspace
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: agent-workspace
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Agent Workspace — Multi-Agent Operating Model

**How Cursor, Claude Code, Codex, ChatGPT, Gemini, and future agents share one vault + monorepo without trampling each other.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Design only — zero implementation** |
| Parents | [[09_AI_Workspace]] · [[08_Founder_Workspace]] · [[02_Vault_Architecture_Specification]] · [[02_ARCHITECTURE/Monorepo]] |
| Single-agent contract | [[09_AI_Workspace]] (boot, search, authority ladder, failure) — **this doc adds multi-agent roles** |
| Shared memory SoT | `docs/knowledge/15_MEMORY/Current-Context.md` |
| Genesis / frozen | No agent may edit |

---

## 0. Mission

Run **multiple AI runtimes** as one Founder-directed crew:

- Clear **ownership** (who may write what)
- Clean **handoffs** (who picks up next)
- Shared **authority** (law still wins)
- Identical **context loading** spine
- One **shared memory** (vault), not N chat memories
- Explicit **conflict resolution**
- Bounded **working folders**
- Mandatory **review** before merge / ship claims

**Success test:** Two agents never silently overwrite each other’s SoT; Founder can read Current-Context and know who owns what; proof-or-stop still holds across handoffs.

---

## 1. Principles (multi-agent)

| ID | Principle | Consequence |
|----|-----------|-------------|
| MA1 | **One vault, many runtimes** | All agents boot Home → Context; chat is ephemeral |
| MA2 | **Founder is sole commander** | Agents propose; Founder authorizes commits/pushes/impl phases |
| MA3 | **Single writer per lane** | No parallel writers on same working folder without explicit split |
| MA4 | **Handoff via vault, not lore** | Update Context (+ optional Handoff-Latest if asked) before switching runtime |
| MA5 | **No vendor SoT** | Cursor rules ≠ Claude memory ≠ ChatGPT threads — vault wins |
| MA6 | **Same AI Workspace contract** | Every runtime obeys [[09_AI_Workspace]] |
| MA7 | **Monorepo client isolation** | Web / Capacitor `/m` / Native never mixed in one agent commit |
| MA8 | **Review before trust** | Cross-agent claims need evidence or Founder/reviewer pass |
| MA9 | **Design vs implement split** | Design-capable agent ≠ implement-authorized without Context flag |
| MA10 | **Future agents join by role, not exception** | New runtime maps into Agent Registry (§2); no special Genesis rights |

---

## 2. Agent registry (roles)

### 2.1 Runtime catalog

| Agent ID | Runtime | Primary strengths | Default mode |
|----------|---------|-------------------|--------------|
| **A-CUR** | Cursor (IDE agent) | Repo edits, tools, rules injection, vault+code loops | **Implement + vault** (when authorized) |
| **A-CC** | Claude Code | Long CLI/agent loops, multi-file, terminal-heavy | **Implement** (lane-scoped) |
| **A-CDX** | Codex | Code generation / PR-oriented tasks | **Implement** (bounded PR) |
| **A-GPT** | ChatGPT | Reasoning, planning, drafting, critique | **Advise / draft** (no direct repo write unless tooling added) |
| **A-GEM** | Gemini | Broad analysis, multimodal, long-context read | **Advise / research synthesize** |
| **A-FUT** | Future agents | TBD | Must declare role in Context before write rights |

### 2.2 Capability matrix

| Capability | A-CUR | A-CC | A-CDX | A-GPT | A-GEM | A-FUT |
|------------|:-----:|:----:|:-----:|:-----:|:-----:|:-----:|
| Read vault | ✓ | ✓ | ✓ | ✓* | ✓* | ✓ |
| Write vault (living) | ✓ | ✓ | ✓ | △ | △ | role-gated |
| Edit Genesis / frozen | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Edit application code | ✓ | ✓ | ✓ | △ | △ | role-gated |
| Run tests / shell | ✓ | ✓ | ✓ | △ | △ | role-gated |
| Commit / push | Only if Founder asks | Same | Same | ✗ typical | ✗ typical | Same |
| Authorize product scope | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Design-only Program specs | ✓ | ✓ | △ | ✓ | ✓ | ✓ |
| Proof-or-stop closeout | ✓ | ✓ | ✓ | ✓ (claims) | ✓ (claims) | ✓ |

\*ChatGPT / Gemini often lack live vault FS — Founder pastes paths or uses connectors. Treat outputs as **drafts** until a write-capable agent or Founder lands them in vault.

**Legend:** ✓ = normal · △ = only with explicit bridge (paste / MCP / Founder applies) · ✗ = forbidden

### 2.3 Ownership by work type

| Work type | Primary owner | Secondary | Reviewer |
|-----------|---------------|-----------|----------|
| Vault Brain OS / Program V1 design | A-CUR or A-GPT/A-GEM (draft) | A-CC | Founder |
| Living vault update with code | A-CUR or A-CC | — | Founder (+ optional A-GPT critique) |
| Web frontend feature | A-CUR / A-CC / A-CDX | — | Founder; optional A-GEM UX critique |
| Capacitor `/m` | A-CUR / A-CC on mobile branch | — | Founder |
| Native Android | A-CUR / A-CC (Android skills) | — | Founder |
| API / server | A-CUR / A-CC / A-CDX | — | Founder |
| Constitutional interpretation | Read-only any | — | Founder; cite Genesis envelope |
| Planning / ADR draft | A-GPT / A-GEM / A-CUR | — | Founder accept |
| Security / threat review | A-CUR (review-security skill) or A-GPT | — | Founder |
| Commit message / PR body | Implementing agent | — | Founder ask to commit/PR |

**Owner** = may write in the assigned working folder. **Secondary** = may draft for owner. **Reviewer** = may not silently overwrite owner’s WIP.

---

## 3. Shared memory

### 3.1 Memory stack (all agents)

```text
Shared (durable)
  Genesis · Frozen packs · Living vault · Current-Context · ADRs · Feature changelogs

Per-runtime (ephemeral — NOT SoT)
  Cursor chat · Claude Code session · Codex thread · ChatGPT chat · Gemini chat

Optional paste
  15_MEMORY/Handoff-Latest.md  — only when Founder requests copy-paste pack
```

### 3.2 Shared memory rules

| Rule | Detail |
|------|--------|
| **SoT for today** | Current-Context only |
| **SoT for product behavior** | Feature MOC + Changelog (+ code) |
| **SoT for law** | Genesis |
| **Chat never promotes itself** | Insights must land in vault to survive handoff |
| **No parallel Context forks** | One file; last writer updates carefully (see conflicts) |
| **Secrets** | Never in vault or handoff packs |

### 3.3 What each runtime must write back

| Event | Write target | Who |
|-------|--------------|-----|
| Focus / program / Touch change | Current-Context | Active owner agent or Founder |
| Feature behavior change | Feature MOC + Changelog | Implementing agent |
| Decision | ADR | Planning or implementing agent |
| Cross-runtime handoff | Context (required); Handoff-Latest (if asked) | Outgoing agent |
| Design artifact complete | Program folder + Context status | Designing agent |

### 3.4 Read path for agents without FS

ChatGPT / Gemini (typical):

1. Founder pastes Home summary **or** instructs “read these paths” via a write-capable agent  
2. Or Founder pastes Current-Context + Touch excerpts  
3. Drafts return to Founder → A-CUR/A-CC applies to vault  

Never treat ChatGPT/Gemini memory of last week as Current-Context.

---

## 4. Context loading (multi-agent)

### 4.1 Universal boot (every runtime)

All agents follow [[09_AI_Workspace]] §2:

1. `00_HOME.md`  
2. `15_MEMORY/Current-Context.md`  
3. Program / law / domain as task requires  
4. Skills when applicable  

### 4.2 Runtime-specific injection

| Runtime | Extra boot notes |
|---------|------------------|
| **Cursor** | Always-on `.cursor/rules/*` + slim `AGENTS.md` already injected — still Read Home+Context |
| **Claude Code** | Project `CLAUDE.md` / skills if present — must not contradict vault; vault wins |
| **Codex** | Repo `AGENTS.md` + task brief — boot Home+Context before coding |
| **ChatGPT** | No auto-inject — Founder supplies Context excerpt or paths |
| **Gemini** | Same as ChatGPT unless connected to repo |
| **Future** | Declare in Agent Registry; must document how Home+Context are loaded |

### 4.3 Parallel session rule

If two write-capable agents run **at once**:

1. Context must list **Agent lock** (see §5)  
2. Each loads Context and **refuses** the other’s working folder  
3. Prefer sequential handoffs over true parallelism  

---

## 5. Ownership & working folders

### 5.1 Lane model

Ownership is **folder + client + program**, not “the whole repo.”

| Lane ID | Working folders (write) | Typical owner |
|---------|-------------------------|---------------|
| L-VAULT-OPS | `docs/knowledge/15_MEMORY/`, `00_HOME.md`, Program living specs, Dashboards | A-CUR |
| L-VAULT-FEAT | `docs/knowledge/09_FEATURES/<Entity>/` | Implementing agent for that feature |
| L-WEB | `frontend/` excl. mobile-only paths when web-only | A-CUR / A-CC / A-CDX |
| L-MOBILE | `frontend/src/components/mobile/`, `frontend/android/` | Mobile-branch agent |
| L-NATIVE | `native-android/`, `server/routes/mobile.js` | Native-branch agent |
| L-API | `server/` (non-mobile-exclusive), `api/` | API owner agent |
| L-DESIGN-DOCS | `docs/knowledge/08_DESIGN/` living | A-CUR / design task owner |
| L-PROMPTS | `docs/knowledge/14_PROMPTS/` | A-CUR (rules sync) |
| L-LAW | `Genesis/**` | **Nobody** |
| L-FROZEN | UXA / UXI paths | **Nobody** (read) |

### 5.2 Agent lock block (Context extension — design)

When multi-agent active, Current-Context gains:

```markdown
## Agent lock
| Lane | Owner agent | Since | Notes |
|------|-------------|-------|-------|
| L-WEB | A-CUR | 2026-07-26 | Feature X WIP |
| L-VAULT-OPS | A-CUR | 2026-07-26 | Program V1 specs |
```

**Rules:**

- Only lock owner writes that lane  
- Founder may clear/reassign locks  
- Stale locks (>48h with no Touch) → Founder prune  
- Advise-only agents (GPT/GEM) never take locks unless Founder grants write bridge  

### 5.3 Branch coupling

| Lane | Branch expectation |
|------|--------------------|
| L-WEB | `main` or feature branch |
| L-MOBILE | `feat/mobile-capture-capacitor` (typical) |
| L-NATIVE | native feature branch |
| L-VAULT-* | usually `main` with code, or same branch as related code |

Agent must state branch in closeout; must not commit wrong-client files into lane commit.

---

## 6. Handoffs

### 6.1 Handoff triggers

| Trigger | Action |
|---------|--------|
| Runtime switch (Cursor → Claude Code, etc.) | Outgoing updates Context; Founder opens new session on inbound |
| Lane complete | Clear Agent lock; set Next |
| Milestone / topic change | 🚨 SWITCH CHAT + Context update ([[09]] / chat-handoff rule) |
| Advise → Implement | GPT/GEM draft accepted → A-CUR/A-CC owns apply + proof |
| Implement → Review | Owner marks ready; reviewer runtime or Founder reviews |
| Blocked on authority | Context Do not + blocked status; stop |

### 6.2 Handoff packet (minimum)

Always in **Current-Context** (not only chat):

| Field | Content |
|-------|---------|
| Active program | Unchanged or updated |
| Done (this slice) | Paths + status |
| Still open | Ordered |
| Touch | Paths inbound may edit |
| Do not | Constraints |
| Agent lock | New owner / cleared lanes |
| Next action | Single clear step |

Optional: `Handoff-Latest.md` paste pack **only if Founder asks**.

### 6.3 Handoff protocol

```text
OUTGOING agent
  1. Proof closeout for its slice (passed|failed|blocked)
  2. Update Current-Context (Done / Open / Touch / locks)
  3. No “trust me it’s done” without evidence
  4. SWITCH CHAT banner if topic/runtime change

FOUNDER
  5. Skim Context
  6. Start inbound runtime with: read Home + Context

INCOMING agent
  7. Boot per AI Workspace
  8. Verify Touch + Agent lock names it as owner
  9. Continue — do not re-litigate closed Done without Founder ask
```

### 6.4 Cross-runtime handoff matrix

| From → To | Typical reason | Extra |
|-----------|----------------|-------|
| GPT/GEM → CUR/CC | Apply approved plan/draft | CUR verifies vault paths; don’t paste secrets |
| CUR → CC | Long autonomous impl | Same branch/lane; Context Touch |
| CC → CUR | Return to IDE polish / vault | CUR re-reads Context |
| CUR/CC → CDX | Bounded PR generation | CDX stays in lane; no vault law edits |
| Any → GPT/GEM | Critique / alternative design | Paste Context + diffs summary; no write lock |
| Any → Any | Conflict / confusion | Stop; Founder arbitrate |

---

## 7. Authority (multi-agent)

### 7.1 Authority layers (unchanged ladder)

Per [[09_AI_Workspace]] §7 — Genesis > frozen expression > ADRs > living contracts > Context > dashboards > chat.

**Multi-agent addendum:** No runtime’s system prompt or “memory” outranks vault.

### 7.2 Authorization tiers

| Tier | Who grants | Examples |
|------|------------|----------|
| T0 Law | Nobody (immutable) | Genesis edits |
| T1 Founder explicit | Founder message | Auth/schema, commit, push, impl phase |
| T2 Context Next | Context + prior Founder accept | Continue Program V1 design artifact |
| T3 Lane owner ops | Agent lock | Edit Touch files in lane |
| T4 Advise | Anyone | Drafts without write |

### 7.3 Authority conflicts between agents

| Case | Resolution |
|------|------------|
| CUR implements contrary to GPT plan Founder liked | Founder message / ADR wins; CUR reverts or amends |
| Two agents cite different Feature notes | Parent Feature MOC + `last_reviewed`; else Founder |
| Agent cites chat “we decided” | Invalid unless ADR or Context records it |
| Claude project instructions vs vault | Vault wins; report drift |

---

## 8. Conflict resolution

### 8.1 Conflict types

| Type | Example |
|------|---------|
| C-WRITE | Two agents edit same file |
| C-LANE | Agent writes outside lock |
| C-CLIENT | Mobile files in web commit |
| C-SO T | Chat vs Context vs Feature |
| C-CLAIM | “Shipped” without proof |
| C-DESIGN | Two design docs disagree |
| C-TOOL | Runtime can’t see vault |

### 8.2 Resolution algorithm

```text
1. Stop further writes on contested paths
2. Classify conflict type
3. Apply authority ladder / monorepo rules / Agent lock
4. Prefer vault evidence over chat
5. If still tied → Founder decision → ADR if lasting
6. Update Context locks + Next
7. Losing agent does not silently re-apply
```

### 8.3 File-level conflicts (git)

| Situation | Rule |
|-----------|------|
| Uncommitted WIP from A + B on same files | Founder picks surviving diff; other re-applies cleanly |
| Merge conflict | Human or single owner agent resolves; other waits |
| Force-push urge | Forbidden on main; warn Founder |

### 8.4 Claim conflicts

If agent B says A’s work is wrong:

1. B must cite evidence (test, Read, audit)  
2. A’s `passed` stands until B produces counter-evidence  
3. Founder adjudicates ship  

---

## 9. Review process

### 9.1 Review grades

| Grade | Meaning | Required for |
|-------|---------|--------------|
| R0 Self | Owner proof-or-stop closeout | Every slice |
| R1 Peer-agent | Second runtime critiques (no write) | Risky / large diffs |
| R2 Founder | Human accept | Commits, pushes, auth/schema, Genesis-adjacent, freeze |
| R3 Formal | ADR / certificate | Constitutional ops, vault freeze, program publish |

### 9.2 When review is mandatory before merge/ship

| Change | Min review |
|--------|------------|
| Living vault design-only note | R0 (+ Founder skim if program spine) |
| Feature behavior + code | R0 + R2 to commit |
| Auth / schema | R2 explicit ask + careful skill |
| Multi-lane same day | R0 each lane; R2 before combined ship |
| Advise draft applied by another agent | R0 on apply agent; R2 if production |
| Security-sensitive | R1 or review-security skill + R2 |

### 9.3 Review protocol (peer-agent)

```text
OWNER: Context says "Ready for review" + Touch paths + evidence links
REVIEWER (GPT/GEM/CUR read-only): boot Context → read Touch → critique
  - correctness, authority, ceilings, monorepo, proof gaps
REVIEWER writes: vault note under 11_BUGS or program review note OR Context comments
OWNER: fix or dispute with evidence
FOUNDER: R2 accept
```

Reviewer **does not** take Agent lock unless Founder reassigns.

### 9.4 Proof across handoffs

Incoming agent must **not** inherit `passed` from outgoing without:

- Re-running critical checks if environment differs, **or**  
- Founder accepts prior evidence as still valid  

Default: re-verify before claiming ship.

---

## 10. Operating patterns (playbooks)

### 10.1 Pattern: Plan → Build → Review

```text
A-GPT/A-GEM: draft plan / ADR (T4)
Founder: accept
A-CUR/A-CC: implement in lane (T1/T3)
A-GPT or Founder: R1/R2 review
Founder: commit ask
```

### 10.2 Pattern: Dual implement (rare)

Only when lanes **disjoint** (e.g. L-API + L-WEB) and Context shows two locks. Integrate at API contract note first.

### 10.3 Pattern: Vault-only crew

Program V1 design series: single owner A-CUR (or Founder-chosen); GPT/GEM optional critique; no parallel vault writers on same Program folder.

### 10.4 Pattern: Emergency hotfix

Founder names one owner + lane; all other agents advise-only until Context clears lock.

---

## 11. Future agents (A-FUT onboarding)

Checklist before write rights:

1. Add row to Agent Registry (§2)  
2. Map capabilities (read/write/test/commit)  
3. Document context loading method (FS / paste / MCP)  
4. Accept AI Workspace + this Agent Workspace  
5. Appear in Context Agent lock only after Founder grant  
6. No Genesis exceptions ever  

---

## 12. Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Three chats, three “sources of truth” | Context only |
| Cursor + Claude edit same Feature MOC | One lock |
| ChatGPT “remembers” launch plan | Write to Roadmap / Context |
| Codex PR mixes native + web | Split commits/lanes |
| Skip handoff “to go faster” | Mandatory Context update |
| Reviewer rewrites owner WIP | Critique note only |
| Agent commits unasked | Git workflow rule |
| Vendor attribution in vault/commits | Forbidden |

---

## 13. Relationship to sibling specs

| Spec | Role |
|------|------|
| [[09_AI_Workspace]] | Per-agent boot, search, authority, failure |
| [[08_Founder_Workspace]] | Human cockpit; Founder commands multi-agent |
| [[05_Vault_Automation_Layer_Spec]] | Plugins/templates — not agent crew |
| Monorepo | Client lanes L-WEB / L-MOBILE / L-NATIVE |
| Chat-Handoff / Proof-or-Stop | Cross-cutting rituals |

---

## 14. Implementation sketch (not authorized)

| Phase | Work |
|-------|------|
| MW0 | Accept this model; link from Home / AI Dashboard / `14_PROMPTS` |
| MW1 | Add optional `## Agent lock` section to Current-Context template |
| MW2 | One-pager `14_PROMPTS/Multi-Agent-Handoff.md` |
| MW3 | Founder habit: name owner agent in Next when dual runtime |
| MW4 | Optional Dashboard widget: active locks (derived) |

---

## 15. Explicit non-actions (this deliverable)

- No Context schema migration applied  
- No new prompt files created beyond this design note  
- No agent tooling / MCP / orchestration installed  
- No Genesis / frozen edits  
- No commits  

---

## 16. Authority statement

Agent Workspace is **operations**. No multi-agent convenience overrides Genesis, frozen packs, product locks, or Founder-only git/auth/schema gates. Shared memory is the vault — not the loudest chat.

---

## 17. Closeout

| Item | Status |
|------|--------|
| Multi-agent operating model | **COMPLETE** (design) |
| Implementation | **NONE** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend registry & locks → optional MW1 Context `Agent lock` section when multi-runtime days begin.

---

**Stop.**
