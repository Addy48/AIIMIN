# Contributing to AIIMIN

AIIMIN is built by a small team. These rules keep the Android app, the website and the API from tangling.

## One area per change

| Area | Folder | What belongs there |
|---|---|---|
| Android app | `android/` | Kotlin, Compose, Room, Gradle |
| Website and web app | `web/` (except `web/android/`, `web/src/components/mobile/`) | Pages, components, styles |
| Phone web shell | `web/android/`, `web/src/components/mobile/` | Capacitor WebView shell, `/m` |
| API | `server/`, `api/` | Routes, services, migrations |
| Hosting | `deploy/`, `vercel.json`, `.github/workflows/` | Servers, CI |

A commit or pull request touches one area. Docs-only changes are fine on their own.

## Branches

- `main` is production: every merge publishes aiimin.in and redeploys the API.
- Work happens on a branch (`feat/…`, `fix/…`, `chore/…`) and reaches `main` through a pull request.

## Before you commit

1. **One area?** If not, split the commit.
2. **Secrets?** Never commit `.env`, keystores, `*.pem`, `local.properties` or tokens. Run `gitleaks protect --staged --redact`.
3. **Build output?** Never commit `web/build/`, `android/**/build/` or `.gradle/`.
4. **Hooks (optional):** `git config core.hooksPath .githooks` strips tool trailers from commit messages.

## Commit messages

```
<area>: <what changed, in plain words>
```

Examples:

```
Android: bank SMS filters and past-message import
Website: Android download points at the GitHub release
Server: read the CricAPI key from CRICAPI_KEY
```

## Pull requests

1. One area, with a short "what" and "why".
2. Web changes: `cd web && npm run build` and the Jest suite pass.
3. Android changes: `cd android && ./gradlew :app:assembleDebug testDebugUnitTest` passes.
4. No auth or database schema changes without the owner's approval.
