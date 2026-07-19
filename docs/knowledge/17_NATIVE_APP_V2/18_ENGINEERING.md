# 18 — Engineering Documentation

> **Depends:** [[09_BACKEND]] [[19_TECH_STACK]] · android-dev / Ninja / Now-in-Android skills  
> **Status:** Complete draft · 2026-07-19

---

## 1. API standards

- Base `https://api.aiimin.in/api/v1` (version when breaking)  
- JSON · UTC ISO8601 · UUID ids  
- Auth: Bearer / session cookie  
- Errors: `{ error: { code, message } }`  
- `Idempotency-Key` on mutating mobile writes  
- `X-App-Version`, `X-Platform`  
- Pagination: cursor  
- OpenAPI spec published internally  

---

## 2. Mobile folder structure

```
android/
  app/
  feature/*/api|impl
  core/{model,network,database,data,datastore,designsystem,ui,common,testing}
ios/   (later)
shared/ (if CMP)
```

Web remains `frontend/` — **no** Capacitor as V2 primary.

---

## 3. Architecture

UDF · MVVM + UiState/Effect Channel · Repository error boundary · offline-first Room.

---

## 4. Coding standards

Kotlin official style · Detekt · no hardcoded colors · `internal` by default · Compose stability awareness · no secrets in repo.

---

## 5. Naming

`FooScreen` · `FooViewModel` · `FooUiState` · `FooEffect` · `FooRepository` · `FooEntity`

---

## 6. State management

Single UiState per screen · effects for one-shots · DataStore for prefs · Room for entities.

---

## 7. Testing

Unit (VM/domain) · Repository fakes · Compose UI tests P0 · Screenshot optional · Instrumented smoke · API contract tests.

---

## 8. CI/CD

PR: lint + unit + assembleDebug  
Main: assembleRelease + Play internal track  
Signing secrets in CI vault  
Staged rollout 10%→100%  
Mapping.txt archived for R8  

---

## 9. Feature flags

Remote config or simple entitlements + flags table · kill switches for AI/study.

---

## 10. Monitoring / rollback

Sentry · Play Vitals · rollback via Play previous release · API feature flag disable.

---

## 11. Web eng note

Desktop web continues CRA/React pipeline; shared contracts via OpenAPI — no shared UI codebase required for V1 Android.

---

*Next: [[19_TECH_STACK]]*
