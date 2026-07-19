# Plan: AIIMIN Native Android App (proper shell)

**Branch**: `feat/native-android-app`  
**Status**: Active — awaiting owner lock on Decision A/B/C before Slice 1 code  
**Date**: 2026-07-19  
**Related**: [[09_FEATURES/Mobile/Capacitor-Android]] · [[02_ARCHITECTURE/Device-Tiers]] · `plans/mobile-commit-split.md`

---

## The mistake (current)

| What we did | Why it feels shit |
|-------------|-------------------|
| Capacitor `server.url` → `https://www.aiimin.in/m` | APK is a browser chrome around the **phone web** page |
| Same React `/m` shell as Safari/Chrome | No app identity — splash then website login/waitlist |
| Updates = Vercel only | “Native app” never owns its UI or offline story |

**Truth:** `/m` = **phone web capture** (browser).  
**Native app** = separate product surface. Same APIs. Different shell, chrome, navigation, polish.

---

## Goal (one sentence)

Ship an Android app that opens as **AIIMIN native capture** — branded splash → native-owned UI → real API — **not** a WebView of `aiimin.in/m`.

---

## Product locks (still true)

- Palette LOCKED (`#1a1a1a` / `#2d2d2d` / `#ff6b35` / `#10b981` / `#6b7280` + light ivory)
- **Phone data collection only** — no full Life OS (Finance analytics, Focus Room, Lab, etc.) on phone v1 unless Decision C unlocks it
- No auth/schema changes without explicit ask
- Zero Firebase
- Website `/m` can remain for browser users — must not drive the APK

---

## Decisions (OWNER MUST LOCK)

### Decision A — Runtime model

| Option | Meaning | Pros | Cons |
|--------|---------|------|------|
| **A1 — Bundled Capacitor (recommended)** | Remove `server.url`. Load local `webDir` build inside WebView. API → `api.aiimin.in` | Real app feel, offline shell, ship UI with APK, still React speed | UI updates need new APK (or staged OTA later) |
| **A2 — Remote WebView but `/native` URL** | Still remote, different route than `/m` | Fast Vercel updates | Still “website in a box”; feels wrong |
| **A3 — Kotlin/Compose rewrite** | True native UI | Max native | Months; duplicate all capture UI; reject for v1 |

**Recommend: A1.**

### Decision B — Route namespace

| Option | Routes | Notes |
|--------|--------|-------|
| **B1 (recommended)** | Native: `/n`, `/n/score`, `/n/account`, `/n/login` · Web phone: keep `/m/*` | Clean split; DeviceGate never confuses them |
| **B2** | Reuse `/m/*` but only when `Capacitor.isNativePlatform()` | Faster; forever couples web+native UI debt |

**Recommend: B1.**

### Decision C — Scope of native v1

| Option | Tabs / surfaces | Notes |
|--------|-----------------|-------|
| **C1 (recommended)** | Today (log) · Score · Account · (optional Plan glance) | Matches product lock; ship quality |
| **C2** | C1 + Habits quick-toggle + Goals check-in | Slightly wider; still capture |
| **C3** | Full Life OS on phone | Breaks Device-Tiers lock; multi-month; do **not** start without new ADR |

**Recommend: C1.** If you want “full app” = polish depth on C1, not C3.

---

## Target architecture (A1 + B1 + C1)

```
┌─────────────────────────────────────────┐
│  Android (Capacitor 7)                  │
│  Splash · StatusBar · Back · Safe area  │
│  ┌───────────────────────────────────┐  │
│  │ Bundled React (webDir=build)      │  │
│  │ Entry: /n/login → /n              │  │
│  │ Shell: NativeShell (not MobileShell)│ │
│  │ Today · Score · Account           │  │
│  └───────────────────────────────────┘  │
│           │ HTTPS                       │
│           ▼                             │
│     api.aiimin.in (existing)            │
└─────────────────────────────────────────┘

Browser phone: aiimin.in/m  (unchanged capture web)
Desktop/iPad: full Life OS (unchanged)
```

### Native vs `/m` (hard split)

| | Phone web `/m` | Native `/n` |
|--|----------------|-------------|
| Load | Vercel | Bundled in APK |
| Chrome | Mobile web + optional “Get App” | App chrome only |
| Login | Site login / waitlist | Native login screen (same Better Auth API) |
| Nav | `MobileBottomNav` | `NativeBottomNav` (3 tabs, no Get App) |
| Offline | Optional queue | First-class queue + banner |
| Feel | Website | App (safe-area, haptics, transitions) |

Shared: `DailyLogForm` core logic, life-score hooks, API clients, auth session — extracted, not copy-pasted forever.

---

## UX spec (native v1)

### First open
1. Brand splash (`#1A1A1A` + AIIMIN mark) ≤600ms  
2. If no session → `/n/login` (email/Google same as web; no waitlist landing hero)  
3. If session → `/n` Today  

### Today (`/n`)
- One job: log today  
- Hero: date + short line (“What happened today”)  
- `DailyLogForm` touch-optimized (≥44px)  
- Save → toast + optional haptic  
- Offline: queue + banner (“Saved on device · sync when online”)

### Score (`/n/score`)
- Life score number + 7-day spark  
- Streak / delta glance only — **no** Insights/Lab  

### Account (`/n/account`)
- Profile chip, theme toggle (follow system + manual)  
- Sign out  
- Link: “Open full AIIMIN on desktop” (external browser)  
- Version + build number  

### System
- Hardware back: tab → Today; Today → exit confirm / exit  
- DayNight status/nav bars match palette  
- No desktop OS routes reachable in native (hard redirect to `/n`)

---

## Acceptance criteria (feature-level)

- [ ] APK does **not** load `aiimin.in/m` (no `server.url` to `/m`)
- [ ] Cold start shows branded splash then native shell or native login
- [ ] Unauthed user never sees waitlist marketing as the app home
- [ ] Authed user lands `/n` with Today / Score / Account only
- [ ] Log save works online against `api.aiimin.in`
- [ ] Offline save queues; reconnect syncs (banner + toast)
- [ ] Browser `/m` still works independently
- [ ] Palette + capture-only lock respected
- [ ] Device proof: `adb logcat` shows local capacitor origin (not `Loading app at https://www.aiimin.in/m`)

---

## Slices (PR-sized)

### Slice 0: Lock decisions + vault ADR
**Class**: Horizontal (unblocks all)  
**Value**: Owner locks A/B/C; vault records native ≠ `/m`  
**Done when**: This plan Decisions section filled; ADR in `10_DECISIONS/`; Current-Context updated  
**No product code until Slice 0 done.**

### Slice 1: Kill remote `/m` wrap — bundled boot
**Class**: Behavior change  
**Actor**: Phone user opens AIIMIN APK  
**Trigger**: Launch  
**Observable**: App loads **bundled** UI at `/n` (or `/n/login`), not `www.aiimin.in/m`  
**Path**: `capacitor.config.json` remove `server.url` → build → sync → APK → WebView `capacitor://` / `https://localhost` assets → `App.js` native entry redirect  
**AC** (confirm before code):
- [ ] `server.url` gone from production config
- [ ] Logcat: no `Loading app at https://www.aiimin.in/m`
- [ ] Native entry redirects to `/n` (placeholder OK)
**Evidence**: adb install + logcat line  
**Skills**: N/A mutation — alternate: logcat + config read

### Slice 2: NativeShell walking skeleton
**Class**: Behavior change  
**Observable**: Three tabs render; no Get App; safe-area padding; brand header  
**Path**: `NativeShell` + `NativeBottomNav` + routes `/n` `/n/score` `/n/account`  
**AC**:
- [ ] Tabs switch without leaving app
- [ ] `/m` components untouched (web still works)
- [ ] Native cannot navigate to `/overview` etc.

### Slice 3: Native login (session → `/n`)
**Class**: Behavior change  
**Observable**: Login in-app; success → Today; fail → error  
**Path**: `/n/login` using existing Better Auth client; waitlist gate policy for native TBD (see Open questions)  
**AC**:
- [ ] No marketing waitlist as home
- [ ] Post-auth → `/n` not `/overview` / `/m`

### Slice 4: Today capture (real log save)
**Class**: Behavior change  
**Observable**: Save today log via API; success toast  
**Path**: Reuse `DailyLogForm` inside native Today page; API same as web  
**AC**:
- [ ] Online save persists
- [ ] Touch targets ≥44px

### Slice 5: Score + Account native pages
**Class**: Behavior change  
**Observable**: Score glance + account sign-out work  
**Path**: Port from `MobileScorePage` / `MobileLiteAccount` into `/n/*` with native chrome  
**AC**:
- [ ] Score shows real life-score data when authed
- [ ] Sign out returns to `/n/login`

### Slice 6: Offline queue first-class
**Class**: Behavior change  
**Observable**: Airplane mode save → banner; online → sync toast  
**Path**: Existing `offlineLogQueue` + native banner always on  
**AC**: device proof offline→online

### Slice 7: Native polish pass
**Class**: Behavior change (feel)  
**Observable**: Splash, haptics on save, theme follow system, back stack correct, launcher icons already brand  
**Path**: `@capacitor/haptics`, StatusBar sync, transition CSS  
**AC**: side-by-side checklist vs `/m` web — native clearly different

### Slice 8: Vault + Play checklist
**Class**: Docs  
**Done when**: Capacitor-Android.md rewritten (bundled, not Option A remote `/m`); Device-Tiers updated; Play AAB checklist still valid

---

## Explicit non-goals (v1)

- Full Life OS on phone (Finance deep, Focus, Lab, Calendar month, …)
- iOS Capacitor (Android first)
- Push notifications / Firebase
- Replacing Better Auth
- Killing `/m` web (keep for browser)

---

## Open questions (answer with Decision A/B/C)

1. **Waitlist on native?** Block non-allowlisted users with a simple “You’re on the list” screen, or allow your account always?
2. **Google OAuth in WebView** often breaks — prefer in-app browser / Custom Tabs for Google only?
3. **Ship name**: keep package `in.aiimin.app`?

---

## Pre-build checklist

1. Owner replies: **A1/A2/A3**, **B1/B2**, **C1/C2/C3** (+ waitlist/OAuth notes)
2. Agent writes ADR + updates Current-Context (Slice 0)
3. Confirm Slice 1 AC → only then code Slice 1
4. Device proof each slice before next
5. Commit only when asked; mobile branch separate from website dumps

---

## Why not “just make `/m` prettier in the APK”

Because the product bug is **identity**, not CSS. As long as the APK loads the website `/m`, every waitlist/login/marketing change on Vercel becomes the “app.” Native must own entry, chrome, and offline — or it stays a bookmark.

---

*Delete this file when native v1 (Slices 0–8) complete.*
