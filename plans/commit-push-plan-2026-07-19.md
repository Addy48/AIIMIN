# Commit & push plan — 2026-07-19

**180 uncommitted paths on `main`.** Split: **website first** (merge + deploy), **mobile second** (branch). Never mix.

Inventory: `plans/uncommitted-inventory-2026-07-19.md`

---

## Pre-flight

```bash
cd frontend
npm run build          # must exit 0
cd ../server && npm test  # if you have tests for correlation services
```

**Before mobile commit:** `capacitor.config.json` must use `https://aiimin.in/m` (not LAN dev).  
**Dev phone test later:** `npm run cap:dev:phone` (patches config temporarily).

---

## Phase 1 — Website on `main` (4 commits, then push)

### W1 — API + correlation engine

```bash
git add \
  api/index.js \
  server/jobs/correlationEngine.js \
  server/middleware/rateLimiter.js \
  server/routes/account.js server/routes/cron.js server/routes/dailyLogs.js \
  server/routes/dashboard.js server/routes/db.js server/routes/intelligence.js \
  server/routes/wealth.js server/routes/journal.js \
  server/services/apiUsageService.js \
  server/services/correlationService.js server/services/correlationService.test.js \
  server/services/intelligenceReportService.js server/services/intelligenceReportService.test.js \
  server/services/lifeScoreDisplay.js \
  server/services/wealthAiImportService.js server/services/wealthImportHelpers.js \
  server/services/wealthSpreadsheetImportService.js \
  server/migrations/048_revoke_anon_waitlist_feedback.sql
git commit -m "$(cat <<'EOF'
feat(api): correlation engine, journal route, wealth import services

EOF
)"
```

### W2 — Frontend data layer + shared hooks

```bash
git add \
  frontend/src/api/correlations.js frontend/src/api/dailyLogs.js \
  frontend/src/api/goals.js frontend/src/api/habits.js frontend/src/api/journal.js \
  frontend/src/hooks/useCorrelationsQuery.js frontend/src/hooks/useDailyLogsQuery.js \
  frontend/src/hooks/useLifeScore.js frontend/src/hooks/useOverviewWeekSignals.js \
  frontend/src/hooks/useDailyStats.js frontend/src/hooks/useDashboardPrefetch.js \
  frontend/src/hooks/useNotifications.js frontend/src/hooks/useReadinessScore.js \
  frontend/src/utils/enumLabels.js frontend/src/utils/formatDate.js \
  frontend/src/utils/lifeScoreEngine.js \
  frontend/src/hooks/useFinance.js   # deleted — stage deletion explicitly if needed
```

If `useFinance.js` is deleted: `git add frontend/src/hooks/useFinance.js` (stages deletion).

```bash
git commit -m "$(cat <<'EOF'
refactor(frontend): daily logs + correlation query hooks and API modules

EOF
)"
```

### W3 — Website pages + UI (exclude mobile-only files)

Stage **only** website surfaces — see inventory `WEBSITE_FRONTEND` section. **Exclude:**

- `frontend/src/components/mobile/**`
- `frontend/src/components/layout/TabRail.jsx`
- `frontend/src/styles/mobile*.css`, `tabRail.css`, `careerKanban.css`, `focusRoomTablet.css`
- `frontend/src/utils/capacitorEnv.js`, `mobileEntry.js`, `offlineLogQueue.js`
- `frontend/public/sw.js`, `registerServiceWorker.js`
- `frontend/capacitor.config.json`, `frontend/android/`
- `App.js`, `DeviceGate.jsx`, `index.js` (mobile branch)
- **`SeedData.jsx`** — keep if modified; do not delete

```bash
git add frontend/src/components frontend/src/pages frontend/src/context \
  frontend/src/services frontend/src/styles frontend/src/index.css \
  frontend/craco.config.js frontend/public/index.html \
  scripts/seed-realistic-life.mjs
# Review: git diff --cached --stat
git commit -m "$(cat <<'EOF'
feat(frontend): overview, finance, journal, discipline, and account polish

EOF
)"
```

### W4 — Vault + rules

```bash
git add docs/knowledge/ .cursor/rules/aiimin-always-index.mdc AGENTS.md .gitignore
git commit -m "$(cat <<'EOF'
docs(vault): feature changelogs, LifeScore, deploy notes, proof-or-stop

EOF
)"
```

### Push website + deploy

```bash
git push origin main
```

- Vercel auto-deploys frontend
- **EC2 API:** GitHub Action `deploy-api.yml` or `bash ~/AIIMIN/deploy/github-ec2-deploy.sh`
- Verify: `curl -s https://api.aiimin.in/api/health`

---

## Phase 2 — Mobile branch (after W1–W4 on main)

```bash
git checkout -b feat/mobile-capture-capacitor
```

### M1 — Mobile-only (Commit A)

Per `plans/mobile-commit-split.md` — all new mobile files + vault Mobile/ + plans.

```bash
git add frontend/capacitor.config.json frontend/android/ \
  frontend/scripts/cap-android-build.sh frontend/scripts/cap-android-dev-phone.sh \
  frontend/public/sw.js frontend/src/registerServiceWorker.js \
  frontend/src/components/mobile/ frontend/src/components/layout/TabRail.jsx \
  frontend/src/styles/mobile*.css frontend/src/styles/tabRail.css \
  frontend/src/styles/careerKanban.css frontend/src/styles/focusRoomTablet.css \
  frontend/src/utils/capacitorEnv.js frontend/src/utils/mobileEntry.js \
  frontend/src/utils/offlineLogQueue.js \
  docs/knowledge/09_FEATURES/Mobile/ plans/mobile-ipad-os.md plans/mobile-commit-split.md
git commit -m "$(cat <<'EOF'
feat(mobile): Capacitor Android shell, PWA, offline queue, touch targets

EOF
)"
```

### M2 — Shared wiring (Commit B)

Line-by-line review. Only mobile routing / tier / shell.

```bash
git add frontend/src/App.js frontend/src/index.js \
  frontend/src/hooks/useDeviceTier.js \
  frontend/src/components/system/DeviceGate.jsx \
  frontend/src/components/layout/DashboardLayout.jsx \
  frontend/src/components/Navbar.jsx \
  frontend/src/components/DailyLogForm.jsx \
  frontend/src/pages/Login.jsx frontend/src/pages/AuthCallback.jsx \
  frontend/src/pages/Onboarding.jsx \
  frontend/package.json frontend/package-lock.json frontend/public/manifest.json \
  .gitignore
git commit -m "$(cat <<'EOF'
feat(mobile): /m routes, device gate, Capacitor init, tablet nav cap

EOF
)"
```

### M3 — Build + push branch

```bash
cd frontend && npm run build && npm run cap:build:android
git push -u origin feat/mobile-capture-capacitor
```

Device smoke in **other chat** → merge mobile PR → deploy frontend again.

Post-deploy verify:

```bash
curl -sSL https://aiimin.in/ | grep -o 'main\.[a-z0-9]*\.js' | head -1
# grep that bundle for MobileShell — must match
```

---

## Do NOT commit (optional / junk)

- `laptop-disk-audit-2026-07-19.html` — local audit artifact
- `.agents/skills/codebase-architecture/`, `planning/` — unless you want them
- `plans/uncommitted-inventory-2026-07-19.md`, `plans/commit-push-plan-2026-07-19.md` — planning docs (add to W4 or separate `docs:` commit if useful)

---

## This chat — done vs other chat

| Item | Status |
|------|--------|
| Touch audit CSS + vault | done |
| Uncommitted inventory | done |
| Dev APK + manifest cleartext fix | done |
| `capacitor.config.json` restored to prod URL | done |
| Phone USB install + smoke | **other chat** |
| Play Store AAB | deferred |
| Website commits W1–W4 | **pushed to `main`** |
| Mobile commits M1–M2 | **pushed to `feat/mobile-capture-capacitor`** |
