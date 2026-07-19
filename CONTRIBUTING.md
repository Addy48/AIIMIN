# Contributing to AIIMIN

Solo-maintained repo. These rules keep the **web Life OS**, **Capacitor shell**, and **native Android app** from entangling.

---

## Golden rule

> **One repo. Three clients. Never mix them in one commit.**

| Client | Directory | What belongs here |
|--------|-----------|-------------------|
| Web Life OS | `frontend/src/` (except `components/mobile/`) | Dashboard, Finance, Lab, Overview, … |
| Capacitor `/m` | `frontend/android/`, `frontend/src/components/mobile/` | WebView shell, PWA, touch targets |
| Native Android V2 | `native-android/` | Kotlin, Compose, Room, Gradle |
| Shared API | `server/`, `api/` | Route by namespace — don't bundle unrelated refactors |

---

## Branch strategy

```
main                          ← web + API production (Vercel + EC2)
feat/mobile-capture-capacitor ← Capacitor + /m (merge when /m ready on prod)
feat/native-android-v2        ← Kotlin app (optional; may live on mobile branch until split)
```

Ship order: **website to `main` first** → deploy → native/mobile branches rebase → merge when smoke-tested.

---

## Commit checklist

Before `git add`:

1. **Which client?** If more than one, split the commit.
2. **Vault updated?** Behavior changes need `docs/knowledge/` changelog.
3. **Secrets?** Never `.env`, keystores, `*.pem`, `local.properties`.
4. **Build artifacts?** Never `frontend/build/`, `native-android/**/build/`, `.gradle/`.
5. **Attribution?** No Co-authored-by tool trailers; no “developed with X” in docs.

---

## Commit message format

```
<type>(<scope>): <imperative summary>
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `build`, `test`

Examples:

```
feat(api): add mobile sync batch endpoint
feat(native): biometric gate on cold start
feat(frontend): overview week signals widget
docs(vault): monorepo client boundaries
```

---

## PR expectations

1. Scope = one client (or docs-only).
2. `npm run build` in `frontend/` passes for web changes.
3. `./gradlew :app:assembleDebug` passes for native changes.
4. Link vault note or changelog entry.

---

## Design locks

- Palette: dark `#1a1a1a`, cards `#2d2d2d`, accent `#ff6b35` — see `docs/knowledge/08_DESIGN/Palette.md`
- Navbar: logo → `/brand`, wordmark → `/overview` (split targets)
- Phone web `/m`: capture only (not the native app ceiling)
- No auth/schema changes without explicit owner approval

---

## Deep docs

- Architecture: `docs/knowledge/02_ARCHITECTURE/Monorepo.md`
- Agent entry: `AGENTS.md` → `docs/knowledge/00_HOME.md`
