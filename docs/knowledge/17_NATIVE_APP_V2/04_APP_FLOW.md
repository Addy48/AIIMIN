# 04 — App Flow (states, transitions, loading)

> **Depends:** [[02_USER_JOURNEYS]] [[03_INFORMATION_ARCHITECTURE]] [[07_MOTION]]  
> **Status:** Complete draft · 2026-07-19

---

## 1. Cold start state machine

```
[Killed] → Splash
 Splash → {session?}
   no  → Welcome
   yes → {biometric?}
          yes → BiometricGate → Main | fail → AuthHub
          no  → Main
 Main → {force_update?} → ForceUpdate
 Main → {entitlement_stale?} → refresh background
```

**Splash:** show ≤600ms or until bootstrap (auth+config) finishes, whichever longer (cap 2.5s then Main with skeleton).

---

## 2. Auth flow

```
Welcome → AuthHub
AuthHub → EmailForm → Verify? → Onboarding? → Main
AuthHub → OAuth CustomTab → deep link return → Main | Pending | Error
AuthHub → PendingWaitlist (terminal until approved)
```

Loading: button spinners · Error: inline + retry · Success: crossfade to next.

---

## 3. Main tab transitions

| From → To | Animation | Duration |
|-----------|-----------|----------|
| Tab A → Tab B | Fade-through | 200–300ms |
| Journal → compose | Axis Y / fade | 300ms |
| Keep card → detail | Shared element | 400ms |
| Vault segment switch | Fade | 200ms |
| Push nested (More) | Shared axis X | 300ms |
| Pop + predictive back | Reverse axis | gesture |
| Sheet present | Scrim + spring up | 350ms |
| Sheet dismiss | Slide down | 250ms |
| Modal | Fade + scale 0.92→1 | 250ms |
| Voice recording | `voice_pulse` | continuous |

Respect reduced motion: opacity only.

---

## 4. Per-screen state matrix

Every feature screen implements:

| State | UI |
|-------|-----|
| InitialLoad | Skeleton matching layout |
| Ready | Content |
| Refreshing | Subtle top indicator, keep content |
| Empty | Illustration + 1 CTA |
| Error | Message + Retry |
| OfflineReady | Cached content + banner |
| OfflineBlocked | Explanation (AI, paywall refresh) |
| Saving | Disable double-submit, progress on CTA |
| SuccessPeak | Haptic + micro animation ≤800ms |

---

## 5. Background sync flow

```
App foreground → SyncEngine.pull(cursor)
Local write → enqueue Mutation → optimistic UI → push when online
App background → WorkManager expedited if dirty queue
```

Banner when `queue.length > 0` offline.

---

## 6. Focus session flow

```
Setup → Running ↔ Paused → Summary → Home
Running: ongoing notification; back confirms abandon
```

---

## 7. Purchase flow

```
GatedAction → Paywall → Store → EntitlementPoll → Unlocked | Failed
```

---

## 8. Exit flows

| Context | Behavior |
|---------|----------|
| Home + back | Soft “Leave AIIMIN?” once; then finish |
| Nested | Pop |
| Sheet | Dismiss |
| Auth | Stay in AuthStack |

---

## 9. Empty → first value choreography

Home empty → coachmark pulse on first habit row → user ticks → Peak → End card “You’re in.”

---

## 10. Animation inventory (names)

`tab_fade` · `push_axis` · `sheet_spring` · `peak_check` · `score_countup` · `streak_flame` · `skeleton_shimmer` · `banner_slide` · `paywall_rise`

Specs in [[07_MOTION]].

---

*Next: [[05_NATIVE_UX]]*
