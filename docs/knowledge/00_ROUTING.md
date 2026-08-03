---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-META
graph_role: router
note_type: NT-ROUTER
tags:
  - type/hub
  - domain/ops
  - status/living
---

# 00_ROUTING — for X, read exactly this file

> [!important] Contract
> This note exists so an agent **never scans the repo or the vault**. Find your job in the
> table, open the 1–3 files named, stop. If your job is not listed, go to [[00_HOME]] and
> say so — do not go exploring.

**Boot order (always):** [[00_HOME]] → **this note** → the 1–3 files your row names.
Constitutional questions only: → [[Maps of Content/Genesis]].

**Authority ladder (higher wins):** founder in chat → Genesis (`Genesis/`) → this vault's
living notes → the code. When a note and the code disagree, **the code is the fact and the
note is the bug** — fix the note and say so.

---

## A. Current state — read before any work

| Job | Read exactly |
|-----|--------------|
| **What is happening right now** | [[15_MEMORY/Current-Context]] |
| **Full status: web + prototype + what's left** | [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] |
| **Rules for how I must work (guardrails G1–G10)** | [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]] §0 |
| **I'm building the Android app** | [[15_MEMORY/Handoff-Native-App-Build]] |
| **I'm testing/fixing the website, Vercel, AWS or the Mac** | [[15_MEMORY/Handoff-Website-Hardening]] |
| Last session handoff | [[15_MEMORY/Handoff-Latest]] |
| Open founder decisions | [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §9 |

## A2. Human-readable guides

Written for the founder in plain language, but accurate and code-verified — use them when you
need orientation rather than a spec. They link down into the detail.

| Guide | Answers |
|-------|---------|
| [[Guides/Start-Here]] | what AIIMIN is · the three clients · the rules that don't bend |
| [[Guides/How-It-Works]] | auth · data isolation · Life Score maths · AI routing |
| [[Guides/Decisions-And-Why]] | what is locked, what is closed, what is still open |
| [[Guides/Whats-Broken-Right-Now]] | broken vs suspected vs never-tested |
| [[Guides/Where-Everything-Lives]] | repo + vault map, and the one-source rule |
| [[Guides/The-App-Build]] | native Android — tab map, build order, constraints |

## B. Product & law

| Job | Read exactly |
|-----|--------------|
| What AIIMIN is, in one read | [[01_PRODUCT/AIIMIN-Product-Guide]] |
| **Constitutional law** (IA, surfaces, one-job) | [[Maps of Content/Genesis]] → `Genesis/P8 Master Specification/00_INDEX.md` |
| V1 implementation contract (what ships) | [[Roadmap/AIIMIN-V1-Blueprint]] |
| What is prioritised now | [[Roadmap/Operational-Priorities]] |
| Vocabulary / naming | [[15_MEMORY/Terminology]] · [[15_MEMORY/Product-Language]] |
| Business rules | [[15_MEMORY/Business-Rules]] |

## C. Engineering

| Job | Read exactly |
|-----|--------------|
| System shape, one screen | [[02_ARCHITECTURE/Overview]] |
| **Which client am I touching** (web / `/m` / native) | [[02_ARCHITECTURE/Monorepo]] · [[02_ARCHITECTURE/Device-Tiers]] |
| Backend / API layout | [[02_ARCHITECTURE/Backend]] · [[04_API/Index]] |
| Frontend layout | [[02_ARCHITECTURE/Frontend]] · [[05_FRONTEND/Frontend-Map]] |
| Auth (how sessions actually work) | [[02_ARCHITECTURE/Authentication]] · [[09_FEATURES/Auth/Auth]] |
| Database tables & schema | [[03_DATABASE/Index]] · [[02_ARCHITECTURE/Database]] |
| AI provider routing / budget | [[02_ARCHITECTURE/AI-Pipeline]] · [[06_AI/Overview]] |
| Deploy / infra / AWS | [[07_DEPLOYMENT/Deploy]] · [[07_DEPLOYMENT/AWS_SETUP]] |
| A specific feature | [[09_FEATURES/Index]] → the one row you need |

## D. Design

| Job | Read exactly |
|-----|--------------|
| **Palette / type (LOCKED — do not redesign)** | [[08_DESIGN/Palette]] |
| Design doctrine | [[08_DESIGN/Design-Bible]] · [[Maps of Content/Design]] |
| Drafting Table prototype language | [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]] §1 "Design language" |

## E. Bugs & quality

| Job | Read exactly |
|-----|--------------|
| Known open bugs | [[11_BUGS/README]] · [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §7 |
| Untested surfaces (P2 list) | [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §7 P2 |
| Auth/DB security audit | [[11_BUGS/Audit-Auth-DB-2026-07-18]] |
| How to prove something works | [[14_PROMPTS/Proof-or-Stop]] |

## F. Decisions & history

| Job | Read exactly |
|-----|--------------|
| Why the vault is shaped this way | [[10_DECISIONS/2026-07-30-vault-operating-model]] |
| Why the repo is laid out this way | [[10_DECISIONS/2026-07-30-repository-layout]] |
| All decisions | [[Dashboards/09_Decisions-Dashboard]] |
| Historical material | [[Archive/README]] · [[99_ARCHIVE/README]] |

---

## Cold — never cite these

`Genesis/` is **constitutional and immutable**: read via [[Maps of Content/Genesis]], never edit.

`Archive/` and `99_ARCHIVE/` are **cold storage**. They contain notes that were true once and
are false now. Never quote them as current. In particular:

- `99_ARCHIVE/documents-vault-2026-08-03/` — the retired second vault. Says auth is **Clerk**.
  It is not. See [[99_ARCHIVE/documents-vault-2026-08-03/README]].
- `99_ARCHIVE/pre-brain-os-2026-07-10/` — pre-cutover snapshot, hyphen taxonomy.

## Verified facts an agent gets wrong most often

Checked against the repo 2026-08-03:

| Fact | Value |
|------|-------|
| Auth | **Better Auth** (OS-ID + PIN, Google). **Not Clerk** — 0 matches in code. |
| Backend path | `server/` + `api/`. There is **no** `backend/` directory. |
| Schema | numbered migrations in `server/migrations/` (048 as of 2026-08-03). There is **no** `supabase_init.sql`. |
| Table access | everything proxies through `/api/db`; Better Auth sessions do **not** populate Supabase RLS. Never direct PostgREST. |
| Accent | steel `#749dc4` (dark) / `#416180` (light). `#ff6b35` is the **single brand spark**, not the UI accent. |
| Home surface | Today, **capture-first**. There is **no Dashboard surface** (GOV-165). |
| Prototype | `frontend/prototypes/AIIMIN-Drafting-Table.html`; rebuild `node frontend/scripts/build-proto.mjs`; dev route `/proto/draft`. |

## Unresolved — do not pick one yourself

| Question | Where it blocks | Owner |
|----------|-----------------|-------|
| Voice scope — transcription-into-Capture first, or full suite | P3 | founder |
| AI keys — Groq · Gemini · OpenRouter (all free tier) not yet created | any AI feature | founder |

**Decided 2026-08-03 — do not re-litigate:**

- **App stack:** Kotlin + Jetpack Compose, native, Android-first, **from scratch** at
  `native-android-v3/`. `native-android/` (V2) is the old app — reference only for its
  API/sync layer, never its UI. → [[15_MEMORY/Handoff-Native-App-Build]]
- **Life Score taxonomy:** five dimensions, keys `physical · cognitive · discipline ·
  financial · emotional`, labelled **BODY · MIND · DISCIPLINE · MONEY · MOOD**. Computed
  server-side only (`server/services/lifeHealthEngine.js`); clients never recompute.
  → [[10_DECISIONS/2026-08-03-life-score-taxonomy]]

Full list: [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §9.
