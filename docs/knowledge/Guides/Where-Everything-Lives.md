---
authority: operations
derived_from: 10_DECISIONS/2026-07-30-repository-layout
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-META
graph_role: hub
note_type: NT-GUIDE
tags:
  - type/guide
  - status/living
---

# Where everything lives

> One map. Repo on the left of your mind, vault on the right, and the single wire between them.

## The one rule

**`docs/knowledge/` is the only place project truth is written.** Everything else either
points at it or is generated from it. If you find two copies of a fact, the copy in
`docs/knowledge/` wins and the other one is a bug.

This is already true of the repo. Every `docs/*.md` file is a **141–257 byte pointer stub**:

```
docs/AWS_SETUP.md   →   "Canonical document: knowledge/07_DEPLOYMENT/AWS_SETUP.md"
```

Same for `docs/product-intelligence/`, `docs/interaction-audit/`, `docs/AIIMIN_PRODUCT_BIBLE/`.
Their historical full copies are parked in `knowledge/Archive/Duplicates/`.

## Your vault

```
~/Documents/AIIMIN VAULT/
├── 00-Home.md                  generated · live status, regenerated each session
├── Reference/  ──────────────► SYMLINK to the repo's docs/knowledge/
│   └── (all notes · all links · full graph · under git)
├── My Notes/                   YOURS. never generated, never in the repo.
└── 99-Superseded-Originals/    your 2026-07-04 hand-written notes, kept for provenance
```

`Reference/` is **not a copy** — it is the same files on disk as the repo. Which means:

- Every wikilink resolves. Graph view and backlinks work across the whole vault.
- Anything you edit in `Reference/` edits the repo, and shows up in `git status`.
- Anything you write in `My Notes/` is outside the repository entirely — it cannot reach the
  public GitHub repo.

## Inside `Reference/` (= `docs/knowledge/`)

| Where | What |
|-------|------|
| **[[00_ROUTING]]** | the agent index — "for X, read exactly this file" |
| **`Guides/`** | these guides — written for you, not for agents |
| `Genesis/` | **the constitution. Immutable. Never edit.** P1–P9 |
| `15_MEMORY/` | Current-Context, handoffs, terminology, business rules |
| `01_PRODUCT/` · `Roadmap/` | what AIIMIN is · the V1 contract |
| `02_ARCHITECTURE/` `03_DATABASE/` `04_API/` `05_FRONTEND/` `06_AI/` | how it's built |
| `07_DEPLOYMENT/` | Vercel, EC2, AWS, runbooks |
| `08_DESIGN/` | palette and type — locked |
| `09_FEATURES/` | every shipped and partial feature |
| `10_DECISIONS/` | ADRs — the why |
| `11_BUGS/` | open bugs, QA runs, audits |
| `17_NATIVE_APP_V2/` | the app pack — status, guardrails, screen plan |
| `Dashboards/` | Obsidian Bases views |
| `Archive/` · `99_ARCHIVE/` | **cold. true once, false now. never cite.** |

## The repo

```
DASHBOARD PROJECT/
├── frontend/            React 19 web Life OS  ── live at aiimin.in
├── server/ + api/       Node/Hono API         ── api.aiimin.in on EC2
├── native-android-v3/   Kotlin + Compose      ── BEING BUILT
├── native-android/      old V2                ── reference only, never its ui/
├── docs/knowledge/      THE VAULT             ── canonical
├── docs/audit/          the repo + machine audit report
├── scripts/             incl. sync-personal-vault.mjs
└── deploy/              EC2 provisioning
```

**Never mix clients in one commit.** Web, Capacitor `/m`, and native are separate concerns.

## The wire between them

```
node scripts/sync-personal-vault.mjs
```

It creates the `Reference/` symlink, leaves `My Notes/` untouched, and regenerates `00-Home.md`.
A **Stop hook** in `.claude/settings.local.json` runs it at the end of any session, so the vault
follows the repo without you asking.

`--check` exits 3 if anything is stale. `--quiet` prints only on change.

## Things that are NOT truth

- `~/Documents/AIIMIN VAULT/99-Superseded-Originals/` — your 2026-07-04 notes. They say auth
  is **Clerk**. It isn't.
- `knowledge/Archive/` and `knowledge/99_ARCHIVE/` — cold storage, banner-marked.
- `frontend/prototypes/personal-os/` — the closed TIDE/RELAY/ATLAS bake-off.
- `v7-android-life-os.html` / `v7-build/` — frozen. Do not edit.

## See also

[[Guides/Start-Here]] · [[00_ROUTING]] · [[10_DECISIONS/2026-07-30-repository-layout]]
