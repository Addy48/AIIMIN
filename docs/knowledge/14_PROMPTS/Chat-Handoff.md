# Chat Handoff Prompt

Agents follow `.cursor/rules/aiimin-chat-handoff.mdc`.

## When SWITCH CHAT

- Topic change
- Milestone done
- Long/confused thread
- Agent drift
- After big vault/rule changes
- User says handoff / new chat

## Pack location

Latest pack: [[15_MEMORY/Handoff-Latest]]  
Also refresh: [[15_MEMORY/Current-Context]]

## Template

```text
AIIMIN handoff — paste as first message in new chat

Read first:
1. docs/knowledge/00_HOME.md
2. docs/knowledge/15_MEMORY/Current-Context.md
3. docs/knowledge/15_MEMORY/Handoff-Latest.md

Done this chat:
- …

Still open:
- …

Touch only if needed:
- …

Constraints:
- Vault-first. No whole-repo scan.
- Palette lock. Mobile /m = capture only.
- No auth/schema change unless I ask.
- Commit only if I ask.

Next action:
- …
```
