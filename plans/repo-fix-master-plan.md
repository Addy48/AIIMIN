# Repo fix master plan — skills-driven

**Generated:** 2026-07-19  
**Evidence baseline:** `senior-fullstack` analyzer · `npm run build` exit 0 · `npm audit` 36 frontend vulns

Skills index: `docs/knowledge/16_DOCUMENTATION/Skills-Registry.md`

---

## Executive summary

| Area | Grade | Top action |
|------|-------|------------|
| Web build | ✅ Pass | Add CI workflow |
| Native CI | ✅ Exists | Keystore secrets for signed APK |
| Test coverage | 🔴 ~1% | correlation tests minimal; CRA audit dev-deps accepted |
| Docs | 🟢 90/100 | CHANGELOG + Skills registry + Monorepo |
| Git hygiene | 🟢 | verify script + gitignore |
| Security scan | 🟢 | RLS on mobile tables; mobile rate limits |
| Skills | 🟢 | Registry + manifest |
| Native CI | 🟡 | Fixed gradle JDK — push pending |

---

## P0 — Do now (this session)

| # | Task | Skill | Status |
|---|------|-------|--------|
| 1 | Skills registry + manifest | github, obsidian-bases | ✅ |
| 2 | `scripts/verify-repo.sh` | senior-fullstack, verification-before-completion | ✅ |
| 3 | Frontend CI on `main` | deployments-cicd | ✅ |
| 4 | `native-android/.gitignore` full | android-dev | ✅ |
| 5 | Gitignore: skill packs, `.codex`, `.claude-skills.json` | harden | ✅ |
| 6 | Exclude `.vercel/output` from quality scans | audit | ✅ |

---

## P1 — Next sprints

### Web (`frontend/`)

| Task | Skill |
|------|-------|
| `npm audit fix` (non-breaking) review | audit, harden |
| React Query error boundaries on new hooks | optimize |
| Overview / Finance empty states | impeccable, polish |
| Lighthouse pass on `/overview` | optimize, deployment-expert |
| Remove dead `SeedData` route when QA done | normalize |

### API (`server/`)

| Task | Skill |
|------|-------|
| RLS for `mobile_devices`, `mobile_idempotency` | supabase-postgres-best-practices | ✅ |
| Correlation cron monitoring | systematic-debugging | |
| `GET /dashboard/widgets` integration tests | senior-fullstack | |
| Rate limit audit on `/mobile/*` | harden | ✅ |

### Native (`native-android/`)

| Task | Skill |
|------|-------|
| GitHub keystore secrets → signed release | claude-android-ninja |
| Founder smoke: offline journal → desktop | systematic-debugging |
| Google OAuth return path | better-auth-best-practices |
| Modularize `feature:*` per WORKFLOW-PLAN | modularization |
| Baseline profile / startup | gradle-build-performance |

### Repo / docs

| Task | Skill |
|------|-------|
| Root CHANGELOG.md | github |
| GitHub topics + About section | github |
| Vault graph of features | graphify |
| Split commit guide kept current | caveman-commit |

---

## P2 — Quality bar

| Task | Skill |
|------|-------|
| 70% test coverage on `server/services/correlationService` | senior-fullstack |
| E2E smoke: login → overview → daily log | verification-before-completion |
| Play Store listing copy | github + mobile-app-ui-design |
| iPad TabRail device QA | design-taste-frontend |

---

## P3 — Deferred

- iOS native (KMP decision)
- Capacitor deprecation once native V2 ships
- Full marketing-skills pack (only `github` installed)
- LICENSE file (portfolio — document in README only)

---

## Monorepo commit rules (repeat)

```
Web only     → commit files under frontend/ + server/ (no native-android/)
Native only  → native-android/ + server/routes/mobile.js + 17_NATIVE_APP_V2/
Never mix    → see CONTRIBUTING.md
```

---

## Verification commands

```bash
bash scripts/verify-repo.sh           # full gate
cd frontend && npm run build          # web
cd native-android && ./gradlew :app:assembleDebug   # native
curl -s https://api.aiimin.in/api/health
curl -s https://api.aiimin.in/api/mobile/health
```

---

## Analyzer false positives

`code_quality_analyzer.py` flags `.vercel/output/` bundles — **ignore**. Re-run on:

```bash
python3 ~/.cursor/skills/senior-fullstack/scripts/code_quality_analyzer.py \
  frontend/src server --verbose
```
