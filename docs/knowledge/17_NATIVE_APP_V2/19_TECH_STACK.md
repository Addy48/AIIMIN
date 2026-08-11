# 19 — Tech Stack (justified)

> **Depends:** [[09_BACKEND]]–[[15_AI_SYSTEM]] · Skills synthesis  
> **Status:** Recommended lock for Phase 1 · 2026-07-19  
> Founder may amend before code.

---

## 1. Decision summary

| Area | Choice | Why | Rejected |
|------|--------|-----|----------|
| Mobile UI framework | **Kotlin + Jetpack Compose (Android-first)** | Platform quality, predictive back, widgets, skills depth, offline-first | Capacitor/WebView (fails native thesis); RN (possible later, slower path to M3 expressive); Flutter (hiring + feel) |
| iOS follow-on | SwiftUI **or** CMP — decide after Android beta | Learn once on Android | Dual day-one |
| Backend runtime | **Node 22 + existing Hono/Express on EC2** | Already production; don’t rewrite for vanity | Greenfield Go/Rust year-one |
| API | REST+JSON + optional SSE | Mobile-friendly; OpenAPI | GraphQL unless proven need |
| Database | **Supabase Postgres** | Existing SoT | Firebase DB |
| Auth | **Better Auth** + Google + Apple + passkeys roadmap | Existing | Auth0 cost |
| Local DB | **Room** | Offline SoT | ad-hoc SharedPreferences blobs |
| Net client | Retrofit+OkHttp | Android standard | Ktor-only until KMP |
| DI | Hilt+KSP | Ninja/Now-in-Android | Manual |
| Images | Coil | | |
| Prefs | DataStore | | |
| Push | **Decide:** FCM (pragmatic) vs non-Firebase | Zero-Firebase brand vs Play reality | Deferred lock D13 |
| Crash | **Sentry** | Already launch goal | Firebase Crashlytics optional |
| Analytics | PostHog or sparse GA4 | Privacy | Full ad stack |
| Payments | Stripe web + Play Billing + StoreKit | | |
| Feature flags | Simple server flags | | LaunchDarkly early |
| AI | Existing multi-provider gateway | | Single-vendor lock-in |
| Search | Postgres FTS → Meilisearch later | | |
| Cache | Upstash Redis | Existing | |
| CI | GitHub Actions | | |
| Store delivery | Play Console staged | | |
| Design | M3 + AIIMIN tokens | | |
| Motion | Compose animation + M3 tokens | Lottie sparingly | |
| Forms | Compose + validation | | |
| Testing | JUnit + Compose UI + fakes | | |
| Desktop web | React 19 existing | Separate product | |

---

## 2. Capacitor

**Allowed:** temporary internal demos only.  
**Forbidden as V2 product path.**

---

## 3. Push & Firebase tension

Human Momentum “zero Firebase spend” vs Android push. Options:

1. FCM-only free tier, no other Firebase products  
2. OneSignal/alternative  
3. No push in MVP (in-app + local notifications only)

**Recommendation:** local notifications for Focus/Ritual MVP; FCM when retention demands.

---

## 4. Why not “full rewrite backend”

Series-A story is dual-product UX + sync quality — not fashion stack. Evolve API with sync/idempotency/entitlements.

---

*Next: [[20_ROADMAP]]*
