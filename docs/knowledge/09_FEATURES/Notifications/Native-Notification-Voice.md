---
authority: product
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: shipping
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PRODUCT
graph_role: feature
note_type: NT-PLAN
tags:
  - type/plan
  - domain/notifications
  - status/draft
---

# Native notification voice — case plan

> Copy source for native Knocks. Tone: Zomato / Swiggy energy — witty, lightly sarcastic, never cruel, never shame-spiral, never body-police, never money-shame. Runtime: local WorkManager 15m (FCM = later).

## Voice rules (non-negotiable)

1. **One job per ping** — no stack of three scolds in one tray.
2. **Optional by channel** — every case has an off switch in Config.
3. **No guilt Olympics** — tease the behaviour, never the person.
4. **No health panic** — steps / screen are coaching, not ER.
5. **No caste / gender / body / income digs.** Ever.
6. **Quiet hours** respect (default 22:30–07:00 Asia/Kolkata unless user sets).
7. **Frequency caps** — max 1 of same case per day unless critical (sync fail).
8. Title ≤ 42 chars. Body ≤ 90 chars. No emoji spam (0–1 max, and only if it earns it).

## Channel map

| Channel id | Purpose | Default |
|------------|---------|---------|
| `day.evening` | Incomplete minimums / day close | On |
| `day.morning` | Soft open | Off (opt-in) |
| `body.steps` | Mid / near / hit | On |
| `body.screen` | Ceiling approach / breach | On |
| `body.still` | Long seated (optional) | Off |
| `lab.english` | Spark nudge | On if Core+ |
| `money.pulse` | Burn pace (never “you’re broke”) | Off until Core+ |
| `sync.hold` | Pending / session | On |
| `agenda.soon` | Next event | On if agenda exists |
| `notes.park` | Stale parked note | Off |
| `score.week` | Weekly LHS whisper | Off |

---

## Cases + sample copy

### 1. Evening — minimums unfinished (`day.evening`) · 20:30–21:30
**Trigger:** ≥1 SHOW_UP minimum still open · not quiet hours  
**Cap:** 1/day

| Variant | Title | Body |
|---------|-------|------|
| A | Your day left the chat | Three ticks still waiting. Ghost them or finish them — either is a choice. |
| B | Plot twist: unfinished | The minimums didn’t complete themselves. Shocking, we know. |
| C | Soft close available | Not a lecture. Just a door. Tap if you want it shut clean. |

### 2. Morning — soft open (`day.morning`) · 07:30–09:00 · opt-in
**Trigger:** App not opened yesterday evening · opt-in on

| Variant | Title | Body |
|---------|-------|------|
| A | Day sheet’s warm | No agenda speech. Just open if you want the board. |
| B | Fresh page energy | Yesterday’s score stayed home. Today’s still hiring. |

### 3. Steps — halfway (`body.steps`) · once when ≥50% of goal
| Variant | Title | Body |
|---------|-------|------|
| A | Halfway isn’t nothing | {n} steps. The couch has opinions. You’re winning the argument. |
| B | Legs clocked in | Mid-goal. Keep walking like the elevator’s broken. |

### 4. Steps — near miss (`body.steps`) · ≥90% and not hit · once
| Variant | Title | Body |
|---------|-------|------|
| A | So close it hurts (nicely) | {left} steps left. The goal can taste the drama. |
| B | Final boss: sidewalk | Almost there. Don’t let the last {left} ghost you. |

### 5. Steps — goal hit (`body.steps`)
| Variant | Title | Body |
|---------|-------|------|
| A | Goal clocked | {n} steps. The shoes send their regards. |
| B | Movement: filed | Target hit. Sit if you want — you earned the chair. |

### 6. Screen — approaching ceiling (`body.screen`) · 85% of ceil
| Variant | Title | Body |
|---------|-------|------|
| A | Screen’s getting clingy | {left} left before the ceiling. Maybe blink once for science. |
| B | Glow budget low | You’re dating the pixels again. Cute. Budget’s not. |

### 7. Screen — over ceiling (`body.screen`) · once past 100%
| Variant | Title | Body |
|---------|-------|------|
| A | Ceiling called. It lost | Over by {over}. No fine. Just a mirror. |
| B | Doomscroll: overtime | Past the line you set. The line is still your friend. |

### 8. Still / sedentary (`body.still`) · opt-in · ≥90 min seated while day active
| Variant | Title | Body |
|---------|-------|------|
| A | Chair loyalty program | 90 minutes. Standing is free and mildly rebellious. |
| B | Blood flow called | It wants a short walk and a better story later. |

### 9. English Spark (`lab.english`) · Core+ · 18:00–20:00 if 0 sessions today
| Variant | Title | Body |
|---------|-------|------|
| A | 60 seconds of bravery | Spark’s waiting. The prompt doesn’t bite. Much. |
| B | Mouth gym open | One drill. Then you can go back to typing heroically. |

### 10. Money pulse (`money.pulse`) · opt-in · daily spend > 80% of burn target
| Variant | Title | Body |
|---------|-------|------|
| A | Burn rate’s spicy | Day’s budget is sweating. Not judging — just math. |
| B | Ledger side-eye | Pace is hot. Check Money if you want the receipts. |

**Banned:** “broke”, “irresponsible”, “waste”, merchant shaming.

### 11. Sync held (`sync.hold`) · pending ≥5 for ≥30m or lastError set
| Variant | Title | Body |
|---------|-------|------|
| A | Graph’s in the lobby | {n} writes waiting. Open Config · Sync when the line’s friendly. |
| B | Outbox doing cardio | Still queued. Not lost — just patient. |

### 12. Agenda soon (`agenda.soon`) · 15m before start
| Variant | Title | Body |
|---------|-------|------|
| A | In 15: {title} | Calendar didn’t forget. Neither should you. |
| B | Coming up | {title}. Shoes optional. Being there isn’t. |

### 13. Parked note aging (`notes.park`) · opt-in · pinned note untouched ≥3 days
| Variant | Title | Body |
|---------|-------|------|
| A | That note still exists | “{title}” is collecting dust. Open, pin harder, or let it go. |
| B | Thought in storage | You parked it. Want it back on the windshield? |

### 14. Weekly LHS whisper (`score.week`) · Sunday 10:00 · opt-in
| Variant | Title | Body |
|---------|-------|------|
| A | Week’s number landed | Life Score {n}. Tap Score if you’re curious — not obligated. |
| B | Quiet report card | Server did the math. You can peek or ignore. Both valid. |

### 15. Empty capture day (`day.evening` sibling) · 21:00 · 0 settles + 0 ticks
| Variant | Title | Body |
|---------|-------|------|
| A | Blank day sheet | Nothing logged. Rest day or reboot day — you decide the label. |
| B | Silence on the wire | No captures. If that’s intentional, respect. If not, one line fixes it. |

### 16. Streak protect (`day.evening`) · habit streak ≥3 and tonight’s tick missing
| Variant | Title | Body |
|---------|-------|------|
| A | Streak’s watching | Day {n} streak. One tick keeps the lore intact. |
| B | Chain wants a link | Not pressure — continuity. Tick if you still want the story. |

---

## Delivery tech (when building)

- Android: `NotificationManager` channels matching table above.
- Schedule: WorkManager + exact where needed (agenda).
- Copy pick: random A/B/C per case · seed by `userId+date+case` for stability same day.
- Deep links: Day / Money / English / Config Sync / Notes / Score.
- Analytics: only channel + case id — never body text in logs.

## Founder decisions needed

1. Morning channel default Off — confirm.
2. Money pulse default Off — confirm.
3. Sedentary default Off — confirm.
4. Any case to kill before engineering.

## Changelog

### 2026-08-13 — Native Knocks shipping (local)
- **What:** Channels + evaluator + WorkManager 15m + Config Notifications screen + tray copy from this plan. FCM token not required this APK.
- **Why:** Founder leftover spec Track B.
- **Files:** `core/data/knock/*`, `app/knock/*`, `NotificationsScreen.kt`, `KnockEvaluatorTest.kt`
- **Status:** partial — unit tests green · assembleDebug green · **device unverified**
- **Notes:** Quiet hours default 22:30–07:00 Asia/Kolkata. POST_NOTIFICATIONS on first On.

### 2026-08-08 — First voice plan
- **What:** Full case matrix + sample copy + channel defaults + bans
- **Why:** Founder asked for witty Zomato/Swiggy-style notification plan before build
- **Files:** this note
- **Status:** draft
- **Notes:** No runtime notifications shipped yet

---

## Structure (Phase V4)

> Added 2026-08-20 so every living feature MOC shares the same skeleton. Fill stubs when next touching this feature.

## Current state

Status / scope / last meaningful change. Update when behavior changes.

## Why this exists

One job this feature serves for the user.

## Contracts

Routes, tables, env names (no secret values).

## Files

Frontend / backend / native paths.

## Related

- [[09_FEATURES/Index|Features Index]]
- [[15_MEMORY/Current-Context]]

