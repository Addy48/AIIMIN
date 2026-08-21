---
authority: operations
derived_from: Genesis
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-08-21
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-PROMPT
migration_batch: W4
fm_source: script
---
# Cursor Rules & Deep-Execution Governance (Agent Prompts)

## North Star

**Deep thinking is mandatory. Excessive planning artifacts are not.**

Authoritative rule: `.cursor/rules/aiimin-deep-execution.mdc`  
Primary outcome: Transform from *“Plan extensively → create phase files → partially execute → more plans”* into:  
**Understand deeply → investigate broadly → determine complete outcome → execute end-to-end → verify with evidence → document only durable truth.**

Plans, phase docs, roadmaps, and audit reports are **not deliverables** and do not equal progress. Prefer code + tests + one authoritative note.

---

## Operating Principles (19 Rules)

1. **Deep reasoning without excessive planning artifacts:** Internally determine goal, end state, affected surfaces, dependencies, consequences, reuse candidates, Genesis constraints, failure modes, and verification bar.
2. **No plan-explosion rule:** Do not create a new planning file when an existing issue can be handled directly. Search before creating. Prefer updating existing authoritative docs.
3. **Complete the whole feature:** Treat tasks as end-to-end system changes across frontend, backend, DB, API, auth, state, caching, analytics, errors, loading/empty states, responsiveness, security, perf, migrations, and tests in the same task.
4. **“What would complete look like?” gate:** Evaluate against real user expectation tomorrow. UI exists / build passes / 1 endpoint works ≠ complete.
5. **Repository investigation depth:** Targeted Grep/Glob/Read along dependency paths before editing. Search existing impls, dead code, stale plans, schemas, routes, contracts. Aimless repo dumps are banned.
6. **Use best available tools:** Terminal, code search, skills, MCPs (VP0, Better Auth, Supabase), browser/agent-browser, web research, scripts, tests, DB queries.
7. **Skills are execution playbooks:** Identify, read, follow, and execute with matching skills. Never invent duplicate mini-plans.
8. **Reuse before invent:** Search for existing components, utils, services, hooks, DB functions, schemas, design tokens, scripts.
9. **Clean as you go:** Safely delete or fix obsolete, duplicate, misleading, or contradictory material discovered within task scope.
10. **Documentation must represent reality:** Documentation is downstream of implementation. Document real contracts, never imagined future systems. One authoritative doc beats five overlapping ones.
11. **No artificial phases:** Internal steps ≠ phase files. Formal phases only when explicitly asked or hard release boundaries exist.
12. **Dependency-aware execution:** Trace full stack (`DB → Migration → Server → API → Validation → Client → UI → Tests → Docs`).
13. **Defensive implementation:** Handle invalid input, missing data, duplicate actions, network/DB failure, permissions, loading/empty/stale states, concurrency, retries, rollback, mobile responsiveness, security, perf.
14. **Verification must be real:** Mandatory same-turn evidence (exit 0, read-backs, health checks, live fetch, test suites). No manufactured receipts.
15. **Stop only when task is actually complete:** No "main part done, rest later" when the rest is required for the outcome.
16. **When to ask user:** Infer from architecture, Genesis, code, conventions, and prior decisions. Ask only for consequential product choices that cannot be safely inferred.
17. **Anti-bureaucracy rule:** Ask: *“Does this artifact create durable value after implementation is finished?”* If NO → do not create. If YES → update existing authoritative doc.
18. **Consolidated governance architecture:** Unified, non-overlapping rule set in `.cursor/rules/`.
19. **Execution-first delivery:** Every task delivers working code, verified behavior, and synchronized durable documentation.

---

## Always-On Rule Files (`.cursor/rules/`)

All `alwaysApply: true`:

| File | Job |
|------|-----|
| `aiimin-always-index.mdc` | Index + north-star pointer |
| `aiimin-deep-execution.mdc` | **Execution spine** — e2e finish, dependency trace, 19 governance principles, no plan explosion |
| `vault-brain-os.mdc` | Load order: Home → Context → docs → code |
| `obsidian-vault-documentation.mdc` | Durable vault truth after ship; anti-bureaucracy |
| `aiimin-token-discipline.mdc` | Targeted investigation OK; no dumps / plan files |
| `aiimin-product-locks.mdc` | Palette, mobile `/m`, auth/schema, secrets, slim AGENTS |
| `aiimin-git-workflow.mdc` | Commit/PR/push only on ask; EC2 API deploy on push |
| `aiimin-communication.mdc` | Concise, sparring, ask only when needed |
| `caveman-always.mdc` | Terse chat; vault human docs stay clear prose |
| `use-skills-always.mdc` | Skills = playbooks; execute directly |
| `aiimin-chat-handoff.mdc` | Loud 🚨 SWITCH CHAT; **Current-Context.md** = handoff |
| `aiimin-proof-or-stop.mdc` | No done/fixed/shipped without same-turn evidence — [[Proof-or-Stop]] |
| `aiimin-anti-lie.mdc` | 7× Anti-Lie — [[Anti-Lie-Strategy]] |
| `aiimin-pre-ship-10x.mdc` | 5× inspect + 5× anti-lie before push/deploy — [[Pre-Ship-10x-Gate]] |
| `aiimin-vp0-mcp.mdc` | VP0 MCP for design / flows / UI research — Mobbin retired |

**Stop hook:** `.cursor/hooks/proof-or-stop.py` (wired in `.cursor/hooks.json`, `loop_limit: 1`)  
**Reliability log:** [[15_MEMORY/Reliability-Log]] (Anti-Lie §7)

---

## Default Load Order

1. `docs/knowledge/00_HOME.md`
2. `docs/knowledge/00_ROUTING.md`
3. `docs/knowledge/15_MEMORY/Current-Context.md`
4. Only relevant feature/arch/DB/API notes
5. Source files for the change **and** their dependency path
6. Update durable vault notes after reality exists in code

## Never

- Aimless whole-repo dump (targeted dependency search is required)
- Secrets in vault or git
- Plan/phase/roadmap files as substitute for finishing
- Fat `AGENTS.md`
- Commit/push/PR without explicit ask
- “Main part done; rest later” when rest is required for the outcome
