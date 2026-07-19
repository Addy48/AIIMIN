# Skills install + synthesis (Native V2)

> **Date:** 2026-07-19  
> **Purpose:** Prove skills were loaded; extract non-negotiables into product/eng plans.  
> **Code:** none.

---

## 1. Install status

| Source | Status | Location |
|--------|--------|----------|
| Android skills suite (compose, UX, data-layer, modularization, coroutines, retrofit, …) | **Installed** | `.agents/skills/*` (local dev only — not shipped product) |
| Android production checklist skill | **Installed** | `.agents/skills/` |
| Now-in-Android modular layout skill | **Installed** | `.agents/skills/` |
| Mobile UI design skill | **Installed** | `.agents/skills/mobile-app-ui-design` |
| Marketing / launch skills | **Partial** | strategies subset as needed |
| R8 analyzer CLI | **Blocked** — CLI not on PATH | Use Gradle R8 docs + mapping files instead |

**Note:** Capacitor WebView-of-`/m` is **rejected** for V2 (offline-first native UI, not a browser chrome).

---

## 2. Product correction (founder signal)

**“Mobile = data collection only” is fraud for a Life OS.**

Mobile is a **primary daily surface**. Capture is one job among many:

| Job | Mobile expression (redesigned, not compressed) |
|-----|--------------------------------------------------|
| Capture | Today ritual, habit taps, urge log, spend quick-add |
| Practice | MCQ / Tech Simulator sessions (from Lab — mobile-native quiz UX) |
| Revise | Cheat sheets, flash cards, linked notes, spaced review |
| Reflect | Journal lite + voice-to-text; mood |
| Execute | Goals check-in, quests, discipline toolkit |
| Focus | Native timer + notification / Live Activity (not desktop Focus Room chrome) |
| Glance | Life Score, streaks, week pulse |
| Account | Theme, billing status, export, sign out |

Desktop keeps **density, multitasking, Lab graphs, Finance deep analytics, Placements kanban, Command Palette**.

---

## 3. Synthesis — Mobile App UI Design (`ceorkm`)

**Process:** Context → structure (thumb zone, F-pattern) → visual (60/30/10, 8-pt grid) → Peak-End emotion → polish (44×44, empty/loading/error/success).

**AIIMIN mapping:**

| Principle | Native AIIMIN |
|-----------|---------------|
| One primary action / screen | Today: complete ritual; Practice: answer card; Revise: next sheet |
| Thumb zone CTAs | Bottom nav + FAB sparingly (Practice Start, Log Urge) |
| Peak-End | Peak = streak save / MCQ streak / goal check; End = day summary card |
| Anti-patterns | No desktop dashboard compression; no CTA outside thumb; no blank search |

**Industry feel:** Duolingo for practice loops; Linear for calm density on secondary screens; Nothing for motion restraint; Apple HIG for navigation grammar — **inspiration, not clone**.

---

## 4. Synthesis — Android skills suite (`rcosteira79`)

| Skill | Non-negotiable for AIIMIN |
|-------|---------------------------|
| **android-dev** | MVVM + MVI UiState/Effect; Channel for one-shot effects; Hilt/KSP; feature modules don’t depend on each other; Retrofit Android-only |
| **compose** | Three phases; state low; M3 motion tokens; predictive back / shared elements for premium |
| **android-ux** | ≥48dp targets; M3 tokens not hardcoded hex; reduced motion; Nav Bar icon+label; tonal elevation |
| **android-data-layer** | Repository = error boundary; Room local SoT; sealed DataError |
| **modularization** | Default `internal`; public only cross-module |
| **datastore** | Typed prefs (theme, onboarding, ritual reminders) |
| **kotlin-flows / coroutines** | No LiveData; structured concurrency |
| **paging** | Notes/revise lists, MCQ history |
| **coil-compose** | Avatars, cheat sheet images |
| **gradle-build-performance** | KSP not kapt; config cache |

---

## 5. Synthesis — Android production checklist

Treat as **production checklist bible**:

- Navigation3 + adaptive (phone/tablet/fold)
- Edge-to-edge + predictive back
- Offline-first sync (`android-data-sync`)
- Security: Credential Manager, pinning, Play Integrity, biometrics
- Notifications ethical channels (ritual, not spam)
- Play CI: AAB, staged rollout, R8 mapping
- Performance: Baseline Profiles, startup budget, Play Vitals
- Pre-release UI states: empty / loading / error / offline / permissions

**Stack implication:** Prefer **Kotlin + Compose (Android-first)** or **Compose Multiplatform** over Capacitor for Series-A native quality. Capacitor remains at best a stopgap — not V2.

---

## 6. Synthesis — Now-in-Android modular layout

```
app/ → feature/*/api|impl → core/{data,database,network,model,ui,designsystem,datastore,testing}
```

Offline-first · UDF · Flow · feature modules · testable interfaces.

---

## 7. Synthesis — Marketing / launch skills

Relevant to native launch (not vanity social spam):

| Skill area | Use for AIIMIN |
|------------|----------------|
| **strategies/launch** | Waitlist → Play/App Store conversion narrative |
| **strategies/brand** | Human Momentum vs productivity-shame competitors |
| **copywriting** | Onboarding, empty states, store listing |
| **entity-seo / local-seo** | Web funnel; store ASO separate |
| Platform posts | Optional growth; never dark-pattern push inside app |

ASO keywords (draft): life OS, habit tracker India, student productivity, MCQ practice, daily score — finalize in Doc 16/20.

---

## 8. Engineering recommendation (Staff Mobile + Architect)

### Recommended path (provisional — lock in Doc 19)

1. **Android V1:** Kotlin, Jetpack Compose, Hilt, Room, Retrofit/OkHttp → `api.aiimin.in`, modular Now-in-Android layout.  
2. **iOS V1.1:** SwiftUI **or** Compose Multiplatform shared UI — decide after Android beta learning.  
3. **Reject as V2 primary:** Capacitor wrapping website / `/m`.

### Module sketch (mobile)

```
:app
:core:model | network | database | data | datastore | designsystem | ui | common | testing
:feature:auth | today | habits | goals | journal | notes | practice | revise
           | focus | discipline | score | account | sync | ai
```

### Sync

- Room = source of truth on device  
- WorkManager sync + conflict policy (Doc 12)  
- Optimistic UI for habit ticks / MCQ answers / journal drafts  

---

## 9. What this changes in the doc pack

| Old (fraud) | New |
|-------------|-----|
| Phone = capture only | Phone = **daily Life companion** (capture + practice + revise + execute + glance) |
| 3 tabs forever | **Primary tabs + Practice / Practice secondary** for Practice, Revise, Focus, Discipline |
| Capacitor remote `/m` | True native Compose app |
| Desktop features “later maybe” | Explicit **redesign list** per feature (not port) |

---

## 10. Next docs in pack

1. `00_INDEX.md` — updated thesis (this correction)  
2. `01_PRD.md` — full PRD with rich mobile scope  
3. Continue 02→20  

*Skills stay loaded under `.agents/skills/` for implementation phase.*
