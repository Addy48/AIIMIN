---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-META
graph_role: leaf
note_type: NT-REPORT
tags:
  - type/report
  - domain/ops
  - status/living
---

# Vault consolidation — 2026-08-03

> Report for TASK 1: one source of truth. Every claim below was checked against the
> filesystem or the repo on 2026-08-03, not inferred.

---

## 1. Decision

**`DASHBOARD PROJECT/docs/knowledge/` is canonical. `~/Documents/AIIMIN VAULT` is retired.**

The founder expected this answer. It is correct, but not for the reason given in the brief.
The brief said both vaults were "edited recently" and therefore both live. They were not.

### Why docs/knowledge wins

1. **It holds the constitution.** Genesis P1–P9 (275 notes) lives only here. The other vault
   has no Genesis, no Constitution, no Governance, no Rule Index. A vault that cannot answer
   a constitutional question is not a candidate for source of truth.
2. **It is versioned.** In git, with history. The Documents vault was **not a git repository**
   — one `rm -rf` and it was gone, unrecoverable. (Verified: `git rev-parse` → *not a git
   repository*.)
3. **It is factually current.** The other one is not — see §2.
4. **It is what every boot file already points at.** `AGENTS.md`, `CLAUDE.md` and the
   `_manifest.json` all resolve into `docs/knowledge/`. Nothing points at `~/Documents`.

### Correction to the brief's recon

The brief recorded the Documents vault as "last edited 2026-08-02", implying active parallel
authoring. It was not authored — it was **bulk-touched**. 43 of its 46 notes carry the
identical mtime `2026-08-02 22:02`, the same minute as a sweep across `docs/knowledge/`.
Its actual authored content dates to **2026-07-04** (the three untouched files still carry
that date). It has been dead for a month; nothing has been written into it since.

This matters: the two vaults were never "both live and disagreeing". One was abandoned in
place and kept being opened. That is a cheaper problem than it looked.

---

## 2. Why the second vault had to go — verified contradictions

Not opinions. Each row was checked.

| It claims | Reality | How checked |
|---|---|---|
| **Clerk** is primary auth; roadmap is Clerk → Cognito (5 notes build on this) | **Better Auth**, OS-ID + PIN + Google | `grep -ril clerk frontend/src server api` → **0 matches** |
| Backend is `backend/`, schema is one `supabase_init.sql`, policy is "no migration files" | `server/` + `api/`; 48 numbered migrations | `backend/` does not exist · `supabase_init.sql` does not exist · `server/migrations/048_revoke_anon_waitlist_feedback.sql` does |
| HEAD `4e28b7a2` (2026-06-24), work uncommitted and unpushed | HEAD `941e7267`, branch `feat/drafting-table-prototype`, pushed | `git log` |
| Debug instrumentation `127.0.0.1:7876` must be stripped before push (blocker K1) | already gone | `grep -rl "127.0.0.1:7876\|#region agent log"` → **0 matches** |
| `#ff6b35` is the primary interactive accent | Drafting Table: steel `#749dc4` / `#416180`; `#ff6b35` is the single brand spark | [[08_DESIGN/Palette]], locked prototype |
| Gemini is *the* AI integration | multi-provider router: Groq · Gemini · OpenRouter · NVIDIA NIM · Kimi | `server/lib/aiChat.js` |
| Its Home's first link: `docs/knowledge/00-Command-Center.md` | file has not existed since the 2026-07-10 cutover | `ls` → no such file |

An agent that opened that vault first would have built on Clerk. That is the "double issues /
not on the same page" feeling, exactly.

### What it actually was

The same generation as `99_ARCHIVE/pre-brain-os-2026-07-10/` — hyphen taxonomy,
`00-Command-Center` as its hub. It was superseded by the same 2026-07-10 Brain-OS cutover.
The difference is that the pre-Brain-OS copy **was** archived and this one was not, so it
survived on disk looking alive.

---

## 3. The bigger finding the brief missed

Retiring the second vault was necessary but **not sufficient**. The canonical vault had its
own trust failure, and it was worse.

### The newest, most important documents were unreachable

`AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md` and `AIIMIN_APP_BUILD_AGENT_PLAN.md` — the two docs
the founder tells every new session to read first — had **zero inbound links** from anywhere
in the vault. The only references to them were inside their own folder.

An agent following the vault's own documented boot path
(`00_HOME → Current-Context → V1-Blueprint`) would **never reach them**. Every session
therefore depended on the founder pasting the paths by hand. That is why sessions kept
starting from different pictures.

### The documented boot path itself was stale

`15_MEMORY/Current-Context.md` — the second hop, marked `last_reviewed: 2026-08-02` — still
declared the current focus to be *"three Genesis full-app-potential Soft Monotone HTML
prototypes"* and pointed at `frontend/prototypes/personal-os/CLAUDE_MASTER_BOOT.md`. That
mission was finished and superseded by the Drafting Table prototype. The single note whose
whole job is "what is happening now" was describing last month's work.

### Structural audit (705 notes, 1872 wikilinks)

Measured before and after with the same checker (`.base`/`.canvas` targets indexed, so the
"after" column has no false positives; the "before" column's 86 included 10 of them).

| Metric | Before | After |
|---|---|---|
| **Broken wikilinks, living layer** | **14** | **5** — and all 5 are non-defects: one glob (`09_FEATURES/Mobile/*`) written as an illustration, four folder placeholders inside `_templates/`. |
| Broken wikilinks, total | 86 (10 false positives) | **67**, of which **62** are bare numeric cross-refs (`08`, `11`, `12`) inside the **FROZEN** `Roadmap/Program-V1-Obsidian-Knowledge-OS/` pack — see §6 item 3. |
| **Notes with no front-matter, living layer** | **4** — and they were the four master docs | **0** |
| Notes with no front-matter, total | 254 | 250 — **237 inside `Genesis/`, which is immutable and must not be touched**; 13 in cold archive. |
| Orphans (0 inbound), total | 341 of 705 | 342 of 755 — the count rose only because 46 archived notes were added. Composition: **197 Genesis leaves** (reached via their own pack indexes, by design), **51 cold archive**, 94 living leaves. |
| **Inbound links to `AIIMIN_MASTER_STATUS_AND_NEXT_STAGE`** | **0** | **10** |
| **Inbound links to `AIIMIN_APP_BUILD_AGENT_PLAN`** | **0** | **5** |

So the brief's front-matter concern was real but tiny — and it was concentrated exactly on
the four documents that mattered most, which is the same failure as the orphan problem. The
disease was never metadata across 700 notes. It was **the newest truth being unreachable
and unlabelled**.

---

## 4. What was done

Non-destructive. Nothing was deleted.

### Created

| File | Purpose |
|---|---|
| **[[00_ROUTING]]** | The "for X, read exactly this file" index the founder asked for. 48 links, all verified resolving. Includes an authority ladder, a **verified-facts** table (the things agents get wrong: auth, backend path, accent, no-Dashboard), a **cold — never cite** list, and an **unresolved — do not decide yourself** list. |
| [[11_BUGS/Waitlist-Count-Masking]] | The one live finding salvaged out of the retired vault. |
| [[99_ARCHIVE/documents-vault-2026-08-03/README]] | Shelf record with the contradiction table. |
| This report. |

### Rewritten

- **[[15_MEMORY/Current-Context]]** — now describes the real stage (vault · website · machine,
  app on hold), marks the prototype bake-off explicitly **closed** so no future session
  resumes it, and lists what is blocked on the founder.

### Edited

- **[[00_HOME]]** — agent line now routes through `00_ROUTING`; added a *Current stage* block
  linking the two master docs; added routing + status rows to *Start by job*.
- **[[17_NATIVE_APP_V2/00_INDEX]]** — master status and guardrails promoted to the top of the
  tracker table; added an on-hold warning.
- **[[99_ARCHIVE/README]]** — new shelf listed with its warning.
- **`AGENTS.md`** — `00_ROUTING.md` inserted as boot step 2.
- Six broken feature-hub links repointed to notes that exist (`09_FEATURES/Account`,
  `DevTools`, `Mobile` — the referenced `<Folder>/<Folder>.md` hubs were never written).
- Front-matter (`authority` · `status` · `owner` · `last_reviewed` · `lifecycle` ·
  `can_override_genesis` · `note_type`) added to the four master docs, which had none:
  `AIIMIN_MASTER_STATUS_AND_NEXT_STAGE`, `AIIMIN_APP_BUILD_AGENT_PLAN`,
  `DRAFTING_TABLE_TESTING_AND_PLAN`, `NEXT_CHAT_BRIEF`. The living layer is now at **100 %**.

### Archived

- `~/Documents/AIIMIN VAULT` → `99_ARCHIVE/documents-vault-2026-08-03/` (46 notes, rsync,
  byte-identity verified before modification). Every note then received
  `status: superseded`, `authority: none`, and a `> [!danger]` banner naming the Clerk error —
  so the archive stays harmless **even to an agent that finds it by grep** rather than by link.

### Merged / deleted

**Nothing merged. Nothing deleted.** After reading all 46 retired notes end to end, there was
one item worth carrying (§ the waitlist bug). The rest was either wrong, already covered by a
better note, or historical duplicate of [[16_DOCUMENTATION/Git-Timeline]] and the pre-Brain-OS
shelf. Merging wrong content into a correct vault would have re-created the problem.

---

## 5. Contradictions reconciled

Where Genesis speaks, Genesis wins; those are now stated once, in [[00_ROUTING]] § *Verified
facts*, and nowhere else contradicts them.

| Question | One answer | Authority |
|---|---|---|
| Auth | Better Auth, OS-ID + PIN + Google | code + [[02_ARCHITECTURE/Authentication]] |
| Backend layout | `server/` + `api/`, numbered migrations | code |
| Table access | via `/api/db` only; sessions do not populate Supabase RLS | [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §1.4 |
| Home surface | Today, capture-first. No Dashboard surface. | Genesis GOV-106 / GOV-165 |
| Accent | steel `#749dc4` / `#416180`; `#ff6b35` = one brand spark | Genesis P8 Visual → [[08_DESIGN/Palette]] (LOCKED) |
| `/m` role | capture only | [[02_ARCHITECTURE/Device-Tiers]] |

### Genesis does not cover these — founder must decide

1. **Life Score taxonomy.** Three live 5-dimension sets: Today (Body/Mental/Goals/Money/Sleep),
   Reports (Physical/Cognitive/Discipline/Financial/Emotional), prototype
   (Craft/Body/Order/Mind/Money/People). Blocks the score UI on both clients. **This is the
   one that keeps drifting — it needs an answer before TASK 2 touches Life Score.**
2. App stack — Drafting Table React promoted to `/m` first, or straight to native Android.
3. Voice scope — transcription-into-Capture first, or the full voice + English suite.

---

## 6. Awaiting founder approval

Nothing below has been done.

| # | Proposed | Why | Risk |
|---|---|---|---|
| **1** | **Delete `~/Documents/AIIMIN VAULT`** | Fully archived at `99_ARCHIVE/documents-vault-2026-08-03/`, byte-verified, now in git. Leaving it on disk is the entire root cause — it will be opened again. | None once committed. Recoverable from git forever. |
| **2** | **Rewrite the "Prototype mission (current)" block in `CLAUDE.md`** | It still points at `frontend/prototypes/personal-os/CLAUDE_MASTER_BOOT.md` — a mission that is finished. It is the first thing every session reads, so it is the highest-leverage stale doc left. Not touched without approval because it is the founder's own instruction file. | Low. Proposed replacement: boot to `00_HOME` → `00_ROUTING` → `Current-Context`, keep the monorepo table and the do-not-edit rules verbatim. |
| **3** | Fix the 62 numeric cross-refs (`08`, `11`, `12` written as bare wikilinks) in `Roadmap/Program-V1-Obsidian-Knowledge-OS/` | Only remaining real link rot. | Medium — that pack is marked **COMPLETE · FROZEN · PUBLISHED**. Editing frozen material needs a decision. Recommend leaving it. |
| **4** | Merge `Archive/` and `99_ARCHIVE/` into one cold shelf | Two parallel archive trees with byte-identical READMEs is itself a "which one is real" trap. | Low, but it rewrites archive paths. Cosmetic — recommend deferring until after TASK 2–5. |

---

## 7. Result

One vault. One entry point. One routing table that answers "for X, read exactly this file",
with the facts agents get wrong stated once and the questions nobody may answer alone marked
as the founder's. The document that says what is happening now says what is actually
happening now.

## Related

- [[00_ROUTING]] · [[00_HOME]] · [[15_MEMORY/Current-Context]]
- [[99_ARCHIVE/documents-vault-2026-08-03/README]]
- [[10_DECISIONS/2026-07-30-vault-operating-model]]
