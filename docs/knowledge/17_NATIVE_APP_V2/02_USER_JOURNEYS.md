# 02 — Complete User Journeys

> **Pack:** [[00_INDEX]] · **Depends:** [[01_PRD]] · [[00_FEATURE_SELECTION]]  
> **Status:** Complete draft · 2026-07-19  
> **Rule:** Every journey lists entry → screens → decisions → exits → failure/offline.

Legend: `→` step · `[decision]` · `{sheet}` · `⚡` system · `✗` exit

---

## 0. Journey index

| ID | Journey |
|----|---------|
| J01 | New user — install → first ritual |
| J02 | Returning user — cold start Home |
| J03 | Power user — multi-loop day |
| J04 | Offline day |
| J05 | Waitlisted / pending access |
| J06 | Expired / past-due subscription |
| J07 | Guest / local-only (if enabled) |
| J08 | Premium unlock mid-flow |
| J09 | Deleted / deleting account |
| J10 | Push notification entry |
| J11 | Deep link entry |
| J12 | Widget / shortcut entry |
| J13 | Habit tick loop |
| J14 | Goal check-in |
| J15 | Journal type + voice |
| J16 | Keep-style notes |
| J17 | Focus session |
| J18 | Discipline urge |
| J19 | Finance quick-add |
| J20 | Calendar agenda (lite) |
| J21 | Family document (priority) |
| J22 | Google Drive connect + import |
| J23 | Resume download |
| J24 | Auth variants |
| J25 | Sign out |
| J26 | Export / delete |
| J27 | Permissions (mic, notifs) |
| J28 | Sync conflict |
| J29 | Crash recovery |
| J30 | Continue on desktop |

---

## J01 — New user

**Entry:** Play/App Store install → launch  

1. Splash (brand) ≤600ms  
2. `[Has session?]` No → Welcome  
3. Welcome (3 cards max: Momentum · Privacy · Dual product) → Continue  
4. Auth hub: Email | Google | Apple(iOS)  
5. `[Waitlist gate?]`  
   - Pending → Pending screen (position, referral) ✗ open web  
   - Allowed → continue  
6. Onboarding: life mode / persona chips (reuse web concepts, fewer steps)  
7. Optional: enable notifications `{permission}` — Skip allowed  
8. Home empty-state CTA: “Complete today’s first tick”  
9. User ticks 1 habit or logs 1 field → Peak haptic + confetti lite  
10. Soft prompt: “Same data on aiimin.in desktop” → Dismiss  

**Exits:** Kill app mid-auth → resume Auth hub · Network fail on auth → retry + offline guest path if D9b  

**Acceptance:** First meaningful action <10 min.

---

## J02 — Returning user

**Entry:** Icon tap / biometric  

1. Splash → biometric if enabled  
2. Home with personalized strip (score, streak, next calendar item)  
3. `[Incomplete ritual?]` banner “Finish today”  
4. User scrolls Home → Track / Write / Tools as needed  

**Exit:** Back from Home → system exit confirm (Android predictive back) once/day soft  

---

## J03 — Power user day

Morning: Home glance → Focus 25m → Habits tick → Journal 3 lines → Work  
Commute: Note capture voice → optional MCQ 5Q if pack exists  
Night: Discipline check-in OR journal mode What Went Well → Score pulse  

**Exit:** Day complete card (End of Peak-End)

---

## J04 — Offline

1. ⚡ Connectivity lost → sticky banner  
2. Habit ticks, journal draft, note draft, expense draft, urge log → local Room queue  
3. Focus timer continues locally  
4. AI / sync-dependent actions → disabled with reason  
5. Reconnect → sync progress toast · conflict → J28  

---

## J05 — Waitlisted

Auth success → Pending · cannot enter Home · CTA share referral / open waitlist web · Sign out  

---

## J06 — Expired subscription

1. Enter app → Home read-mostly for free entitlements  
2. Gated action (e.g. Journal AI, advanced finance) → `{Paywall}`  
3. Restore purchases / manage on web · Resume  

---

## J07 — Guest (if D9b)

Local vault · migrate to account sheet · warn data loss if uninstall without migrate  

---

## J08 — Premium unlock

Paywall → Store purchase → ⚡ entitlement refresh → unlock · Failure → retry / contact  

---

## J09 — Account deletion

You → Data → Delete account → typed confirm → grace period note → tombstone · App resets to Welcome  

---

## J10 — Notification entry

| Notif type | Lands on |
|------------|----------|
| Ritual reminder | Home |
| Focus ended | Focus summary |
| Calendar soon | Calendar agenda |
| Streak risk | Habits |
| Sync error | You → Devices/Sync |

Tap while logged out → Auth → deep resume  

---

## J11 — Deep links

`aiimin://home` · `aiimin://habits` · `aiimin://journal/new` · `aiimin://focus` · `aiimin://notes/{id}` · `https://aiimin.in/app/...` verified  

Invalid → Home · Auth wall if needed  

---

## J12 — Widget / shortcut

Android widget Score/Habits · iOS Widget / App Shortcut “Log urge” / “Start focus” → cold start target screen  

---

## J13 — Habit tick

Home or Track → tap habit → optimistic UI + haptic → sync · Undo snackbar 5s · Fail → revert + error  

---

## J14 — Goal check-in

Track → Goals → open goal → update % or mark done → note optional → sync  

---

## J15 — Journal (type + voice first)

1. Journal tab → Compose (keyboard up) **or** Speak  
2. Type path: write → autosave draft → Save → peak  
3. Voice path: grant mic → record → waveform → transcript → edit → Save  
4. Deny mic → type-only banner  
**Offline:** queue audio+text  

---

## J16 — Keep notes

1. Notes tab → grid → `+` / empty card  
2. Quick compose: body, color, pin, checklist  
3. Long-press → pin/color/delete  
4. Search → open card (shared element)  
**Huge note:** preview + Open desktop  

---

## J17 — Focus · J18 — Urge · J19 — Money

(Unchanged; entry via More or Quick Add)

---

## J20 — Calendar lite

Home AgendaPeek → Agenda · Create sheet · **No** month grid path  

---

## J21 — Family document (priority)

Vault → Family → Documents → open/download/upload → biometric if locked  

---

## J22 — Drive

Vault → Drive → Connect → Folder pick → Sync status → Import to Keep or Family doc → Disconnect  

---

## J23 — Resume

Vault → Resumes → Preview → Download/Share · **No** placements board  

---

## J24–J30

Auth, sign out, export, permissions (mic!), sync conflict, crash, desktop CTA — as prior patterns.

---

## Cross-cutting states

Every primary screen: **Loading skeleton · Empty · Error retry · Offline · Success peak**

---

## Journey QA checklist

- [ ] Auth wall never dead-ends  
- [ ] Offline never silent-drops writes for P0 entities  
- [ ] Paywall never mid-save corrupt  
- [ ] Back stack predictable (Tools nested → Tools root → Home)  
- [ ] Deep link + cold start tested  

*Next: [[03_INFORMATION_ARCHITECTURE]]*
