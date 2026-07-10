# 2026-07-10 — Switch vault to Project Brain OS

## Why

Cursor usage showed ~985k average tokens per request. Agents re-scanned the repo and reused fat context. Thin docs were not enough. Need an operating system for AI + human memory.

## Alternatives

1. Keep Command-Center + AGENTS.md fat dump
2. Evolve folders in place without rename
3. Full cutover to numbered Brain OS (chosen)

## Pros

- Curated load path (Home → Context → Feature → Code)
- Dual-layer: readable Obsidian + caveman AI packs
- Clear place for ADRs, bugs, sprints, prompts

## Cons

- Migration cost once
- Must keep Current Context fresh or brain goes stale

## Implementation

- New tree under `docs/knowledge/`
- Archive old vault to `99_ARCHIVE/pre-brain-os-2026-07-10/`
- Slim `AGENTS.md`
- Cursor rules: `vault-brain-os.mdc` + updated vault documentation rule

## Files affected

- `docs/knowledge/**`
- `.cursor/rules/*`
- `AGENTS.md`
- `docs/superpowers/specs/2026-07-10-vault-brain-os-design.md`

## Future improvements

- Auto-generate architecture/API stubs from codebase
- Per-endpoint API pages as needed
- Daily context snapshot habit

## Follow-up (same day)

All standing rules from the cutover compliance list were encoded as additional `alwaysApply: true` Cursor rules:

- `aiimin-always-index.mdc`
- `aiimin-token-discipline.mdc`
- `aiimin-product-locks.mdc`
- `aiimin-git-workflow.mdc`
- `aiimin-communication.mdc`

Plus existing: `vault-brain-os`, `obsidian-vault-documentation`, `caveman-always`, `use-skills-always`.
