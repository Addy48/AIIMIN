# Proof-or-Stop

> Always-on anti–false-completion discipline for Cursor agents.

**Status:** shipped  
**Always-on rule:** `.cursor/rules/aiimin-proof-or-stop.mdc`  
**Stop hook:** `.cursor/hooks/proof-or-stop.py` (via `.cursor/hooks.json`)

## Purpose

Agents often claim `done` / `fixed` / `tests pass` from pattern completion, not from verified tool results. This stack makes **claims require same-turn evidence**, and nudges once via a Stop hook when closeout language lacks evidence markers.

## Layers

| Layer | What | Strength |
|-------|------|----------|
| Soft rule (always-on project) | `.cursor/rules/aiimin-proof-or-stop.mdc` | Every AIIMIN chat |
| Session inject | `sessionStart` hook → short PROOF-OR-STOP context | New chats get reminder even if rules flaky |
| Capture + Stop | `afterAgentResponse` saves text; `stop` nudges once if claim lacks evidence | Machine enforcement |
| User hooks | `~/.cursor/hooks.json` (optional Terminal install) | All projects on this Mac |
| Optional User Rules paste | [[Proof-or-Stop-USER-RULES]] → Cursor Settings → Rules → User Rules | Global soft rule in UI |

## Agent contract (summary)

1. Output is a **claim**, not lifecycle truth.
2. Completion language only with **same-turn** evidence (Read/Grep confirming edit, command exit 0, health URL, etc.).
3. Closeout shape: paths → evidence → `Status: passed|failed|blocked`.
4. Skipped / missing check = **not** pass → `blocked` or `failed`.

## Hook behavior

- `sessionStart`: injects short PROOF-OR-STOP additional_context.
- `afterAgentResponse`: caches last assistant text under `~/.cursor/hooks/state/`.
- `stop`: if `status=completed` and cached text is a bare success claim → one `followup_message`.
- Also tries `transcript_path` / `CURSOR_TRANSCRIPT_PATH` if cache empty.
- Fail-open on errors. `loop_limit: 1`.
- Installed at **project** (`.cursor/hooks.json`). User-global (`~/.cursor/hooks.json`) is optional — run Activate checklist Terminal block.

## Activate checklist

1. Reload Cursor window (Cmd+Shift+P → Developer: Reload Window).
2. Settings → Hooks — confirm `proof-or-stop.py` for sessionStart / afterAgentResponse / stop.
3. Optional global soft rule: paste `14_PROMPTS/Proof-or-Stop-USER-RULES.txt` into Settings → Rules → User Rules.
4. Prefer a **new chat** so sessionStart inject fires.

### Optional: machine-wide hooks (all projects on this Mac)

Cursor blocked agent write into `~/.cursor/`. Run this yourself in Terminal once:

```bash
mkdir -p "$HOME/.cursor/hooks/state"
cp "/Users/aaditya/Desktop/DASHBOARD PROJECT/.cursor/hooks/proof-or-stop.py" "$HOME/.cursor/hooks/proof-or-stop.py"
chmod +x "$HOME/.cursor/hooks/proof-or-stop.py"
cat > "$HOME/.cursor/hooks.json" <<'EOF'
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "command": "./hooks/proof-or-stop.py session" }],
    "afterAgentResponse": [{ "command": "./hooks/proof-or-stop.py capture" }],
    "stop": [{ "command": "./hooks/proof-or-stop.py stop", "loop_limit": 1 }]
  }
}
EOF
```

Then Reload Window again.

## Limits

- Does not prove the fix is *correct* — only that a done-claim has some evidence shape.
- Transcript format varies by Cursor version; if parsing fails, hook stays silent (fail-open).
- Semantic wrong fixes still need smoke / review.

## Related

- Index: [[Cursor-Rules]]
- Always-on index: `.cursor/rules/aiimin-always-index.mdc`
- Home rule list: [[00_HOME]]

## Changelog

### 2026-07-18 — Live activation (session + capture)
- **What:** Upgraded hook to sessionStart inject + afterAgentResponse capture + stop gate; state dir falls back to project/`/tmp` if home unwritable; User Rules paste file added. Machine-wide `~/.cursor` hooks = optional Terminal paste (agent cannot write there without approval).
- **Why:** User asked to activate for all chats and make fully live.
- **Files:** `.cursor/hooks/proof-or-stop.py`, `.cursor/hooks.json`, `docs/knowledge/14_PROMPTS/Proof-or-Stop-USER-RULES.txt`, `docs/knowledge/14_PROMPTS/Proof-or-Stop.md`
- **Status:** shipped (project); user-global hooks pending your Terminal paste
- **Notes:** Reload Cursor once; new chat for session inject.

### 2026-07-18 — Proof-or-Stop always-on + Stop hook
- **What:** Added always-on rule `aiimin-proof-or-stop.mdc`; Stop hook `proof-or-stop.py` + `hooks.json`; documented here; indexed in Cursor-Rules / always-index / Home.
- **Why:** Agents were claiming work complete without verification.
- **Files:** `.cursor/rules/aiimin-proof-or-stop.mdc`, `.cursor/hooks/proof-or-stop.py`, `.cursor/hooks.json`, `docs/knowledge/14_PROMPTS/Proof-or-Stop.md`, `docs/knowledge/14_PROMPTS/Cursor-Rules.md`, `.cursor/rules/aiimin-always-index.mdc`, `docs/knowledge/00_HOME.md`, `docs/knowledge/15_MEMORY/Current-Context.md`, `AGENTS.md`
- **Status:** shipped
- **Notes:** Hook is fail-open and loop-capped; tighten patterns later if false positives/negatives appear.
