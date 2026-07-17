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

Load order? Vault updated? Palette lock? Mobile capture-only? Auth/schema untouched without ask? Token discipline held?
