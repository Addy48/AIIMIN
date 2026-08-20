---
name: web-app-testing
description: >
  Enforce prototype/UI structural uniqueness with Playwright. Screenshot tabs,
  extract DOM structural signatures, pairwise-diff them, and fail the build when
  similarity crosses a threshold. Use for product / Drafting Table screens when
  founder asks for unique skeletons. The v7 personal-os HTML tree was deleted
  2026-08-14 (see docs/knowledge/16_DOCUMENTATION/Completed-Work-Ledger.md).
---

# Web App Testing — Structural Signature Gate

## When to use

- Founder asks for unique skeletons per tab / screen
- "Header + stat + list" banned for more than one screen
- Visual claims must be proof-or-stop (screenshots + measurable diff)

## Note (2026-08-14)

`frontend/prototypes/personal-os/` including `v7-build/build_v7.py` is gone. Do not run those paths. If a skeleton gate is needed, point it at a living surface (`frontend/prototypes/AIIMIN-Drafting-Table.html` or the native/web app) and update this skill first.

## Hard contract (v7 five tabs)

| Tab | Required `data-skeleton` | Ordered `data-sig` |
|-----|--------------------------|--------------------|
| Today | `TIME_BLOCK_TIMELINE` | header → ambient_depth → timeblock_timeline → trailer |
| Capture | `COMPOSER_STAGE` | header → composer_stage → mode_rail → destination_tiles |
| Money | `SPEND_CHART` | header → period_strip → spend_viz → alert_pills |
| Practice | `MASTERY_HEAT` | header → streak_banner → heat_calendar → skill_orbit |
| More | `SEARCH_DIRECTORY` | header → search_field → soft_group_index |

Rules:

1. No two tabs share the same `data-skeleton`.
2. No two tabs share the same ordered `data-sig` sequence.
3. Pairwise Jaccard similarity of component-type bags must be **≤ 0.42**.
4. Banned pattern `header + stat_block + list` may appear on **at most one** tab.
5. Money must expose chart viz (week-bars / donut), not a progress-bar category list as primary.
6. Today must expose `.tb-block` timeline, not `.habit` checklist as primary.
7. Practice must expose `.heat` / mastery heat, not a primary `.c-row` room list.

## Run

```bash
# from repo root — rebuild first
python3 frontend/prototypes/personal-os/v7-build/build_v7.py

# gate (Playwright)
node .agents/skills/web-app-testing/scripts/tab-skeleton-gate.mjs
```

Artifacts land in:

`frontend/prototypes/personal-os/v7-build/gates/artifacts/`

- `tab-<name>.png` — full device screenshot per tab
- `signatures.json` — extracted signatures + pairwise matrix
- `gate-report.md` — pass/fail summary

Exit **0** = pass. Exit **1** = reject build.

## Thresholds (do not soften without founder ask)

```text
MAX_JACCARD = 0.42
MAX_SEQ_EQUAL = forbidden (exact sequence match = fail)
BANNED_HSL_MAX = 1
```

## Agent workflow

1. Restate skeletons in chat **before** markup edits.
2. Patch tab roots with `data-skeleton` + ordered `data-sig`.
3. Rebuild HTML.
4. Run this gate.
5. If fail: redesign the colliding tab, rebuild, re-run. Do **not** claim passed without exit 0.
6. Update vault / ANTI_LIE with gate exit + signature matrix snippet.

## Anti-cheat

- Screenshots alone ≠ pass.
- Self-described signatures ≠ pass.
- Gate must extract from live DOM via Playwright.
- Skipped Playwright run = **blocked**, not passed.
