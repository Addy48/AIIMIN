---
authority: operations
derived_from: Genesis
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-PROMPT
migration_batch: W4
fm_source: script
---
# Cursor Rules (agent prompts)

## Always-on rule files (`.cursor/rules/`)

All `alwaysApply: true`:

| File | Job |
|------|-----|
| `aiimin-always-index.mdc` | Index of all always-on rules |
| `vault-brain-os.mdc` | Load order: Home → Context → docs → code |
| `obsidian-vault-documentation.mdc` | Vault before done |
| `aiimin-token-discipline.mdc` | No whole-repo scan; minimal context |
| `aiimin-product-locks.mdc` | Palette, mobile, auth/schema, secrets |
| `aiimin-git-workflow.mdc` | Commit/PR/push only on ask |
| `aiimin-communication.mdc` | Concise, sparring, design/EEG |
| `caveman-always.mdc` | Terse chat |
| `use-skills-always.mdc` | Skills before acting |
| `aiimin-chat-handoff.mdc` | Loud 🚨 SWITCH CHAT; **Current-Context.md** = handoff (no paste pack unless asked) |
| `aiimin-proof-or-stop.mdc` | No done/fixed/shipped without same-turn evidence — [[Proof-or-Stop]] |
| `aiimin-anti-lie.mdc` | 7× Anti-Lie — truth labels, receipts, independent verify — [[Anti-Lie-Strategy]] |
| `aiimin-vp0-mcp.mdc` | VP0 MCP (`vp0` / `npx -y vp0-mcp`) for design, prototyping, flows, UI research — Mobbin retired |

**Stop hook:** `.cursor/hooks/proof-or-stop.py` (wired in `.cursor/hooks.json`, `loop_limit: 1`)
**Reliability log:** [[15_MEMORY/Reliability-Log]] (Anti-Lie §7)

## Default load

1. `docs/knowledge/00_HOME.md`
2. `docs/knowledge/15_MEMORY/Current-Context.md`
3. Only relevant feature/arch/DB/API notes
4. Only source files for the change
5. Update vault before done

## Never

- Whole-repo scan unless user explicitly asks
- Secrets in vault
- Skip vault update on behavior change
- Fat `AGENTS.md`
- Commit/push/PR without explicit ask

## Caveman

- Chat: caveman full
- Vault human docs: clear prose
- AI packs in `15_MEMORY`: compressed

## Review checklist

Load order? Vault updated? Palette lock? Mobile capture-only? Auth/schema untouched without ask? Token discipline held? Proof-or-stop evidence on closeout? Anti-lie truth labels + receipt when claiming completion?
