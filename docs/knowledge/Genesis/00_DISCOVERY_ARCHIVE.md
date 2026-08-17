# AIIMIN GENESIS — Discovery Archive

```yaml
archive: AIIMIN GENESIS
purpose: Complete Discovery archive for Genesis Phases 1–6
version: 1.0
date: 2026-07-22
status: canonical
```

## Structure

```text
AIIMIN GENESIS/
├── P1 Repository Intelligence/
├── P2 Knowledge Intelligence/
├── P3 UX Intelligence/
├── P4 Visual Intelligence/
├── P5 Constitution/
└── P6 Prototype Studio/
```

## Phase map

| Phase | Folder | Source package | Contents |
|-------|--------|----------------|----------|
| P1 | `P1 Repository Intelligence/` | `AIIMIN_DESIGN_CONTEXT` | Repo map, architecture, screens, APIs, debt, build |
| P2 | `P2 Knowledge Intelligence/` | `AIIMIN_KNOWLEDGE_CONTEXT` | Philosophy, decisions, research, PRD index + **supporting** Product Bible, product-intelligence, prompts, notes |
| P3 | `P3 UX Intelligence/` | `AIIMIN_UX_CONTEXT` | Journeys, friction, trust, a11y + **supporting** interaction-audit |
| P4 | `P4 Visual Intelligence/` | `AIIMIN_VISUAL_CONTEXT` | Identity, type, color, motion + **supporting** palette, logo-designs, brand SVGs |
| P5 | `P5 Constitution/` | `AIIMIN_DESIGN_BIBLE` | Constitution, philosophies, principles, blueprints, non-negotiables |
| P6 | `P6 Prototype Studio/` | `AIIMIN Prototype Studio` | Living Momentum docs + HTML prototype + **supporting** prior HTML, screenshots, reports prototypes, today variants |

## How to consume

1. Read this file.
2. Walk P1 → P6 in order (intelligence → law → prototype).
3. Open interactive prototype: `P6 Prototype Studio/Prototype/index.html`
4. Supporting subfolders are copies/archives; live product docs may still exist under `docs/knowledge/` and `docs/AIIMIN_PRODUCT_BIBLE/`.

## Pointers at old root paths

Empty former folders now contain only `MOVED.md` pointing here:

- `AIIMIN_DESIGN_CONTEXT/` → P1
- `AIIMIN_KNOWLEDGE_CONTEXT/` → P2
- `AIIMIN_UX_CONTEXT/` → P3
- `AIIMIN_VISUAL_CONTEXT/` → P4
- `AIIMIN_DESIGN_BIBLE/` → P5
- `AIIMIN Prototype Studio/` → P6

## Explicitly excluded (secrets / PII risk)

- `*.pem`, Google `client_secret*.json`
- User export JSON / transaction CSV from Downloads
- `.env*` values

## Inventory (2026-07-22)

**255 files** across P1–P6 (phase cores + supporting copies). Live `docs/knowledge/` Brain OS not relocated.
