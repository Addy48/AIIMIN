# Mobile vs website — commit split guide

**Rule:** Never one commit/PR mixing website refactors with mobile/Capacitor ship.

Website work on `main` stays separate. Mobile ships on branch `feat/mobile-capture-capacitor` (suggested).

## Commit A — Mobile-only (new files, safe to add wholesale)

```
frontend/capacitor.config.json
frontend/android/                    # except build/ outputs (gitignored)
frontend/scripts/cap-android-build.sh
frontend/public/sw.js                # PWA for /m — mobile-adjacent
frontend/src/registerServiceWorker.js
frontend/src/components/mobile/
frontend/src/components/layout/TabRail.jsx
frontend/src/styles/tabRail.css
frontend/src/styles/mobile*.css
frontend/src/styles/careerKanban.css   # iPad polish — optional in B
frontend/src/styles/focusRoomTablet.css
frontend/src/utils/capacitorEnv.js
frontend/src/utils/mobileEntry.js
frontend/src/utils/offlineLogQueue.js
docs/knowledge/09_FEATURES/Mobile/
plans/mobile-ipad-os.md
plans/mobile-commit-split.md
```

## Commit B — Shared hooks (minimal; review diff line-by-line)

Only mobile-routing / tier / shell wiring. **Exclude** correlation, daily-logs refactor, Discipline, Finance page, etc.

```
frontend/src/App.js                  # /m routes, getPostAuthPath redirects only
frontend/src/index.js                # initCapacitorShell + SW register
frontend/src/hooks/useDeviceTier.js
frontend/src/components/system/DeviceGate.jsx
frontend/src/components/layout/DashboardLayout.jsx
frontend/src/components/Navbar.jsx   # TABLET_NAV_CAP only
frontend/src/components/DailyLogForm.jsx  # enableOfflineQueue prop only
frontend/src/components/mobile/MobileCaptureApp.jsx  # if not in A
frontend/src/pages/Login.jsx         # getPostAuthPath only
frontend/src/pages/AuthCallback.jsx
frontend/src/pages/Onboarding.jsx
frontend/src/context/AuthContext.jsx # only if Capacitor OAuth patch
frontend/package.json                # @capacitor/* + cap: scripts only
frontend/package-lock.json
.gitignore                           # android build artifacts
```

## Do NOT include in mobile commits

```
server/**                            # API / correlation / goals — website
frontend/src/hooks/useDailyLogsQuery.js
frontend/src/hooks/useFinanceQuery.js
frontend/src/pages/Discipline.jsx
frontend/src/components/growth/**
frontend/src/pages/SeedData.jsx        # stays for QA per owner
docs/knowledge/02_ARCHITECTURE/Overview.md  # unless mobile-only note
```

## Ship order

1. Merge website fixes to `main` + deploy Vercel (no mobile routes yet OK)
2. Branch `feat/mobile-capture-capacitor` from updated `main`
3. Commit A then B on branch
4. `npm run build` + `npm run cap:build:android`
5. Device smoke → merge mobile branch → deploy frontend
6. Play Store AAB from same branch tag

## Verify production after mobile deploy

```bash
curl -sSL https://aiimin.in/ | grep -o 'main\.[a-z0-9]*\.js' | head -1
# then grep bundle for MobileShell — must be >0
```
