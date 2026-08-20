---
authority: operations
derived_from: 10_DECISIONS/2026-07-30-vault-operating-model · Founder/01_VAULT_FREEZE_CERTIFICATE · 15_MEMORY/Current-Context
status: draft
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-PLAN
tags:
  - type/plan
  - domain/ops
  - status/draft
---

# Vault + Repo Simplification Plan (2026-08-20)

> Founder correction baked in: **Manus produced a prototype only.** The full AIIMIN product surfaces (web Life OS + native V3 app body) were built in this repo by Cursor/agent sessions with the founder — not by Manus as app owner. Treat `Handoff-Manus-Native-V3.md` as a *temporary external-helper brief*, not ownership truth.

This note is the deep plan. Genesis stays immutable. Stage A folder *names* stay frozen. We simplify by **diet, cold-storage, templates, and truth** — not by mass-renaming `01_`–`17_`.

---

## 0. Reality check (measured 2026-08-20)

| Metric | Value |
|--------|-------|
| Markdown notes in `docs/knowledge/` | **778** |
| Text bytes of `.md` | **~6.6 MB** (folder on disk ~28 MB with assets/obsidian) |
| Personal vault `~/Documents/AIIMIN VAULT` | Symlink `Reference/` → this tree; **48** md outside Reference (mostly superseded originals) |
| Genesis | **275** notes · **~3.4 MB** (~52% of vault text) |
| Roadmap | **140** notes · **~0.9 MB** |
| Archive + 99_ARCHIVE | **125** notes · **~1.5 MB** |
| Living engineering layer (01–17 excl. Genesis/Roadmap/Archive) | comparatively thin |
| Notes with YAML frontmatter | **521** |
| Notes without frontmatter | **257** (mostly Genesis supporting + some archives) |
| Fat monsters | Interaction audit ~497 KB × near-duplicate in Archive; Blueprint **3170 lines / 217 KB** |
| Stale substring hits | Clerk in **81** notes; `native-android/` in **49**; ON HOLD in **3** |
| Roadmap program indexes | Frontmatter still says `status: active` while body says COMPLETE · FROZEN |

**Founder feel:** “vault too too large” is real — mostly **constitutional corpus + finished Roadmap programs + duplicate supporting dumps**, not the living feature notes.

**Constraint loyalty (do not break):**

- Never edit `Genesis/` content without Founder ADR.
- Do not mass-rename Stage A numbered folders (ADR vault operating model).
- `docs/knowledge/` remains SoT; personal `My Notes/` stays private and untouched unless asked.

---

## 1. Correct ownership + product truth

| Claim | Truth |
|-------|-------|
| Manus built the full app | **False.** Manus = prototype help only. |
| Who built the app | Founder + Cursor agents in this monorepo (`frontend/`, `native-android-v3/`, `server/`). |
| Drafting Table | Design lock / prototype language — not a third product. |
| Capacitor `/m` | Capture-only phone web — not the native app. |
| `native-android/` | Old V2 — reference for sync/session/network only. |
| `native-android-v3/` | Current native product surface. |

**Doc debt from wrong framing:** rewrite Home / Monorepo / Master Status / Manus handoff banner so agents stop treating Manus as owner or mobile as ON HOLD.

---

## 2. Diagnosis — why it feels huge

### A. Three vaults pretending to be one graph

1. **Law (Genesis)** — must exist, must stay fat, must stay cold for daily work.
2. **History (Roadmap COMPLETE programs + Archive)** — still indexed as “active,” still in graph search.
3. **Living ops (Home, Context, Features, Deploy, Native V3 leftovers)** — what founder and agents need daily — drowned by (1)+(2).

### B. Duplicate weight

- `Archive/Duplicates/docs-interaction-audit/*` ≈ Genesis P3 supporting (~500 KB class files).
- Exact hash dupes are few (~67 KB wasted); **near-dupes** are the real bloat.
- Research MOC still deep-links into 100KB+ COMPLETE_* dumps.

### C. Metadata lies

- Roadmap `00_INDEX` frontmatter `status: active` on frozen programs.
- Home still says mobile ON HOLD.
- Folder `17_NATIVE_APP_V2/` holds V3 living docs — name lies.

### D. Note shape drift

- No enforced max length for living notes (Context ADR says &lt;120 lines; Home is 158; Blueprint is 3170).
- 257 notes lack standard frontmatter.
- Templates exist (`_templates/`) but many notes never adopted the section order.
- Callouts / authority blocks inconsistent.

### E. Repo drift (paired problem)

- Dirty worktree + 26 commits on feat branch ahead of `main`.
- EC2 hotfixes outside git.
- Migrations 040–052 local/untracked risk.
- Four client stories in docs vs reality.

---

## 3. Design principles for the diet (distill)

1. **Cold by default, hot by path** — agent boot never loads Genesis body or Roadmap program trees unless the job is constitutional.
2. **One living cockpit** — Home (short) · Routing · Current Context · Guides · Features Index.
3. **Beautify living notes; leave Genesis bytes alone** — beautification ≠ rewriting law.
4. **Archive is not delete** — move finished programs behind a Cold Index; keep git history.
5. **Template = contract** — every living MD has the same skeleton so Obsidian + agents parse it the same way.
6. **Size budgets** — living note &lt; ~120–200 lines; feature MOC &lt; ~150 lines; changelogs append-only but can roll yearly.

---

## 4. Target shape (after diet)

```text
ALWAYS HOT (founder daily + agent boot)
  00_HOME.md                    ≤80 lines, correct stage
  00_ROUTING.md
  15_MEMORY/Current-Context.md  ≤120 lines
  Guides/*                      6 plain-language notes
  09_FEATURES/Index.md + living MOCs
  02_ARCHITECTURE/Overview + Monorepo (truthful)
  07_DEPLOYMENT/* runbooks
  17_* native living pack       renamed *index* only (path may stay)

WARM (open when job matches)
  03_DATABASE · 04_API · 08_DESIGN · 10_DECISIONS
  16_DOCUMENTATION living how-tos
  Roadmap/AIIMIN-V1-Blueprint   (consider split: spine + appendices)

COLD (searchable, not in default graph)
  Genesis/                      immutable; open via MOC envelope only
  Roadmap/UX-* · Program-* · Brain-OS-*  (frozen → Cold Roadmap)
  Archive/ · 99_ARCHIVE/
  Genesis/**/supporting/**      optional: mark `graph_role: cold-corpus`

PRIVATE (never repo)
  ~/Documents/AIIMIN VAULT/My Notes/
```

**Optional Obsidian UX:** exclude Cold folders from Omnisearch default / Graph depth; keep Bases on living tags only (`status/living`).

---

## 5. Beautification + structure standard (every living MD)

### 5.1 Frontmatter (required on living notes)

```yaml
---
authority: operations | engineering | product | founder
derived_from: <wikilink or path>
status: active | draft | frozen | archived
owner: founder | eng
lifecycle: living | frozen | archived
last_reviewed: YYYY-MM-DD
can_override_genesis: false
knowledge_layer: KL-OPS | KL-BUILD | KL-PROD | KL-DEC | KL-META
graph_role: boot | hub | leaf | context
note_type: NT-*
tags:
  - type/...
  - domain/...
  - status/living   # or status/frozen | status/archived
---
```

### 5.2 Body skeleton (feature / eng leaf)

1. One-line job (blockquote)
2. **Current state** (3–6 bullets, truthful)
3. **Contracts** (routes, tables, env *names*)
4. **Files** (paths only)
5. **Related** (wikilinks)
6. Changelog → separate note or append section

### 5.3 Callout vocabulary (normalize)

| Callout | Use |
|---------|-----|
| `[!important]` | Law / do-not-break |
| `[!tip]` | Agent boot hint |
| `[!warning]` | Stale risk / drift |
| `[!abstract]` | Derived / non-authority |

### 5.4 Visual “beautification” (Obsidian, not rewrite)

- Consistent H1 = note title only (no emoji storms).
- Tables for matrices; lists for procedures.
- Mermaid only when it replaces a paragraph of topology.
- Strip duplicate “Last updated” lines that disagree with `last_reviewed`.
- Yearly changelog roll: `Changelog.md` → `Changelog-2026.md` when &gt; ~40 KB.

### 5.5 Compress only the AI memory layer

Use caveman-compress **only** on `15_MEMORY/*` packs meant for agents — **not** on Guides or Genesis. Human Guides stay full prose (project rule).

---

## 6. Workstreams (phased) — vault

### Phase V0 — Truth patches (1 session, no moves)

- Fix Home stage line (V3 active; Manus ≠ owner).
- Fix Monorepo client matrix (V3 current).
- Banner on `Handoff-Manus-Native-V3.md`: prototype helper, not ownership.
- Roadmap frozen programs: frontmatter `status: frozen` + `lifecycle: frozen`.
- Add this plan to Routing + Home “Start by job”.

### Phase V1 — Cold Roadmap (1–2 sessions)

- Create `Maps of Content/Cold-Roadmap.md` index.
- Retag UX-Architecture, UX-Intelligence, Program-V1-Obsidian, Brain-OS-Implementation as frozen.
- Remove them from default Founder Workspace / Active-Work Base queries.
- Keep publication records; stop citing as “current stage.”

### Phase V2 — Duplicate / supporting diet (1 session)

- Prefer Genesis path as canonical for supporting dumps.
- Replace Archive duplicate bodies with stub pointers (“canonical: Genesis/…”).
- Research MOC: link to *indexes*, not 500 KB COMPLETE files.

### Phase V3 — Native pack clarity (1 session)

- Keep path `17_NATIVE_APP_V2/` (frozen Stage A name) **or** add alias note `17_NATIVE_APP.md` that says “V3 living pack lives here.”
- Split living vs historical inside: `V3-LEFTOVER-CHECKLIST`, `Emulator-Workflow`, `V3-COMPLETE-BUILD-SPEC` = hot; old V2 WORKFLOW-PLAN / PRD = cold banner.
- Cap CHANGELOG / V3-BUILD-TRACKER via yearly roll.

### Phase V4 — Living note beautify (multi-session, template pass)

- Run feature MOCs through `_templates/feature-template.md` section order.
- Architecture leaves through `eng-leaf-template.md`.
- Enforce `last_reviewed` refresh when touched.
- Kill Clerk mentions in **living** notes only (archive may keep historical Clerk).

### Phase V5 — Blueprint split (optional, high value)

- `AIIMIN-V1-Blueprint.md` (217 KB / 3170 lines) → spine (≤400 lines) + `Blueprint/Appendices/*`.
- Authority stays one ADR pointer; agents load spine first.

### Phase V6 — Genesis access UX (no content edit)

- Strengthen Genesis MOC as only doorway.
- Optional: Obsidian exclusion of `Genesis/**/supporting/**` from graph.
- Founder “law bookshelf” dashboard that lists P5/P8/P9 indexes only.

---

## 7. Workstreams — repo (paired)

### Phase R0 — Truth Recon

Local | Git | Vercel | EC2 | migration head matrix.

### Phase R1 — Recover ghosts

Commit EC2-only patches (e.g. `note.delete`) into git before any hard reset.

### Phase R2 — Client kill list (ADR)

| Surface | Fate |
|---------|------|
| Web `frontend/` | Keep — Life OS |
| Native V3 | Keep — product app |
| Capacitor `/m` | Sunset when V3 capture proven |
| Native V2 | Archive branch / freeze |
| Drafting Table HTML | Design lock only |

### Phase R3 — Commit slices

Server+migrations · web legal · V3 · vault — never one mega PR.

### Phase R4 — Web surface diet

Ship / park / kill table for ~25 routes.

### Phase R5 — Secrets hygiene

Move `Secrets, Keys /` and PEM out of project Desktop folder (already gitignored).

---

## 8. More ways (idea backlog — pick later)

1. **Vault lint CI** — script fails if living note &gt; N lines, missing frontmatter, or `status: active` under Cold Roadmap.
2. **`graph_role: cold-corpus`** filter for Bases.
3. **Single “Surface Map” note** — web routes × native tabs × API namespaces.
4. **Quarterly vault weigh-in** — recount files; delete stubs; roll changelogs.
5. **Agent “max open files”** in Routing — hard cap 5.
6. **Founder mode vs Agent mode** Home — two short entry notes.
7. **Detach Archive from git LFS / orphan branch** if clone size hurts (only if needed).
8. **Obsidian appearance** — one CSS snippet for callouts + table density (beautify without content churn).
9. **Merge Guides into Home tabs** via Bases instead of more files.
10. **Kill empty shells** — `13_MEETINGS`, `17_EXPERIMENTS`, `Daily Notes` stay or get one README each.
11. **Personal vault** — leave `99-Superseded-Originals` but hide from Obsidian file explorer starred list.
12. **Proof tags** — `evidence: verified|inferred` on status claims (anti-lie).

---

## 9. What we will not do

- Edit Genesis corpus text.
- Mass-rename `01_`–`17_` folders.
- Move everything under `apps/`.
- Compress Guides or Genesis into caveman.
- Delete Roadmap frozen programs without Cold Index.
- Trust Master Status 2026-08-02 as current without V0 truth patches.

---

## 10. Recommended order (founder pick)

**Week 1:** V0 + R0 + R1 (truth)  
**Week 2:** V1 + V2 (cold + dupes) — biggest “vault feels smaller” win  
**Week 3:** V3 + V4 sample (native pack + 5 feature MOCs beautified)  
**Week 4:** R2–R4 (clients, commits, web diet)  
**Later:** V5 Blueprint split · V6 Genesis UX · vault lint CI  

---

## 11. Success criteria

| Signal | Pass |
|--------|------|
| Agent boot | Home + Routing + Context only; no Roadmap program dump |
| Founder open vault | Sees Guides + Context + Features first; Cold behind one index |
| Living note shape | Frontmatter + skeleton on all hot notes |
| Wrong ownership | Zero “Manus owns app” / “mobile ON HOLD” in hot notes |
| Local↔live | Recon matrix exists; no known EC2-only ghosts |
| Genesis | Byte-stable; still reachable via MOC |

---

## See also

- [[10_DECISIONS/2026-07-30-vault-operating-model]]
- [[Founder/01_VAULT_FREEZE_CERTIFICATE]]
- [[16_DOCUMENTATION/Completed-Work-Ledger]]
- [[Guides/Where-Everything-Lives]]
- [[00_ROUTING]]
