# AIIMIN v4: Master Build Plan (single plan: fixes, engines, Raahi, plans, notifications, motion, release)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Load before each phase:** `claude-android-ninja` (Compose/Hilt/Room conventions) for all phases · `emil-design-eng`, `animate`, `overdrive` (restraint mode) for Phases 3, 4, 7 · `onboard` for Phase 6 · `polish`, `audit`, `adapt` for Phases 8 and 11 · `superpowers:systematic-debugging` for Phases 1 and 10 · `superpowers:verification-before-completion` before every "done".

**Goal:** Make AIIMIN v4 *true*, *clear* and *alive*. True means screen time matches what the phone says. Clear means plans, prices and limits are visible and enforced. Alive means the boot, logo, arc and day-to-night light feel like one instrument, the modules talk to each other, and the small details are right.

**Architecture:** Every new behaviour is a **pure Kotlin function with unit tests**, rendered by a thin Compose layer. That covers screen-time maths, the feature catalogue and gate, sky colour by minute, boot timeline progress and connection rules. Nothing new needs the network, a new permission or a new dependency, except the Baseline Profile module in Phase 3.

**Tech Stack:** Kotlin 2.3.21 · Compose BOM 2026.06.01 · Hilt 2.60.1 · Room 3.0.1 · Navigation3 1.1.5 · Play Billing 7.1.1 · Vico 3.3.1 · JUnit4 + Truth. Build: `./gradlew :app:assembleDebug`. Tests: `./gradlew testDebugUnitTest`.

**Inputs this plan is built on:** `~/Desktop/AIIMIN_PLAN.md` v4.1 (product law), `~/Desktop/AIIMIN-master-plan.md` v2.0 (companion, sky, research), `~/Desktop/AIIMIN-next-plan.md` (Tasks 1–6), `docs/COVERAGE.md`, and a code audit of `feat/native-v4` done on 14 Oct 2026. **Every finding below was read in the source code; none is a guess.**

---

## Read this first: the whole plan in plain words (about 5 minutes)

### Where the app stands today (checked on 14 Oct, not guessed)
- **Built:** almost every screen in the product plan exists (about 130 of 149), 95 automatic tests pass, and the core engines (score, streak, money, vault, sync client) work.
- **Feels unfinished because:**
  1. **Opening is slow.** On the emulator, opening Money, Plans or Score showed only the splash logo after 5 seconds, and Phone day and Notifications showed grey placeholder boxes. You see a blank app before you see your day.
  2. **The arc disappears at night.** After 23:00, Today shows a big empty band and a flat line (screenshot `today.png`).
  3. **Screen time doesn't match your phone.** Six separate reasons are listed in §1.1; the main one is that it counts a different "day" than Android does.
  4. **Plans do nothing.** Nothing is locked or unlocked, prices show "—", and the old plan names (Explore/Core/Elite) still live in the code and in the email the server sends ("Welcome to Core.").
  5. **Notifications are basic.** Meeting reminders can arrive late or never (the check runs every 30 minutes but only looks 15 minutes ahead), there's no daily limit, money shows on the lock screen, there are no buttons, and the same words repeat every day.
  6. **Too many boxes.** Cards with borders everywhere, two orange headings fighting, an orange badge pulling the eye.
  7. **Background work dies quietly.** Phones from Xiaomi, Samsung, Oppo and others kill background jobs, and nothing in the app notices or recovers.

### What we will build, in the order we'll build it

| # | What | What you'll notice | Days |
|---|---|---|---|
| 0 | **Safety + GitHub** | Secret scan, then everything committed and pushed to `Addy48/AIIMIN` (public), with a draft pull request | 0.5 |
| 1 | **Honest screen time** | Matches Android's Digital Wellbeing (midnight to midnight). One clear number, the app list adds up ("Other apps" row), pickups work without a lock, refreshes when you come back | 2 |
| 15 | **"Pulse", the central engine** | One heartbeat keeps Today, Phone day, the widget and notifications showing the *same* numbers. If the phone kills AIIMIN in the background, the next open heals it. A "How AIIMIN is running" page shows each job's last run. **Screens open with real content in under 1 second** (last snapshot shown instantly, then updated) | 3 |
| 16 | **Works on every phone** | AIIMIN detects your phone's maker and picks the right way to measure. Samsung/Xiaomi get a fix for missing events. Steps come from the best source (Samsung Health, Google Fit, the phone sensor). A 20-second "check against your phone" makes it exact. Each number shows Measured / Estimated. Phones that kill apps get step-by-step help | 3 |
| 13 | **First public APK** | Release-signed v4 beta on aiimin.in/app, served from GitHub Releases. The old v2 download is replaced; it installs beside the old app | 0.5 |
| 2 + 19 | **Plans you can see and try** | Free · Plus ₹49 · Pro ₹99 · Family ₹179, each with its **own emblem** (dot / arc / arc + sun / two arcs). Any plan can be switched **free during the beta**, and the features really unlock. Signed-in users get a **confirmation email with the right plan name** ("You're on Pro"). The website and server use the same four names. Billing comes later, with 14 days' notice; nobody is charged without subscribing | 4 |
| 14 | **Notifications people like** | A new engine that learns *your* times (the morning brief arrives when you usually wake). It goes quiet on things you ignore, sends max 4 nudges a day plus one evening summary, puts "Done", "Snooze" and "Mark paid" buttons on the pop-up, keeps the lock screen private, and has 8 categories you can switch off. **Witty, Zomato-style lines where it's safe** ("Plot twist: sleep", "Legs report: underused", "Your future self called"), seasonal packs (monsoon, Diwali, Holi, salary day, Monday), a Playful/Plain tone switch, and plain words for money and security. Reminders arrive on time with the screen off | 5 |
| 3 | **Opening animation** | The logo draws itself and the sun rises into place (under 1 second, no lag), then grows into Today's day arc. Only on a fresh start | 2 |
| 4 + 17 | **Living sky, timed to the real sun** | Soft light that follows *your* sunrise and sunset, worked out from the phone's time zone and country, **no location permission**: pre-dawn, dawn from the left, midday, golden hour, dusk from the right, moonlight. It changes over each minute so you never see a jump, and shifts with the seasons. **The arc is always visible, even at night** (with a moon) | 3 |
| 18 | **Raahi, the companion** | The green-hooded character you sent becomes **Raahi** ("traveller"), drawn in layers so it can blink, wave, think, read, cheer and sleep. It greets you in the assistant ("Morning. 3 minimums today, and a call at 14:30"), shows "thinking" while the assistant works, points the way on empty screens, and appears on playful notifications. On by default, with a switch to hide it | 5 |
| 12 | **Home-screen widget with Raahi** | Small: Raahi standing on today's arc (asleep at night) + "3 of 5 minimums". Medium: the arc with Raahi, your next item, minimums and a "+" for quick capture. Updates within 2 seconds of you ticking something. No money or documents on the home screen | 2 |
| 13 | **Second APK** | Everything above, on aiimin.in/app | 0.5 |
| 5 | **Modules talk to each other** | An expiring passport offers a renewal task, a bill due appears on Today, a late phone night is linked to short sleep, heavy spending is set beside a low mood. One suggestion at a time, each with "Why am I seeing this?" | 3 |
| 6 | **Reasons to come back (no guilt)** | First-week checklist, quiet celebrations for firsts, morning brief and evening close ritual, weekly review | 4 |
| 7 | **Transitions worth showing off** | The clock flies into the Score header, amounts fly into their detail, documents expand open, predictive back on every screen, the dock underline slides, numbers roll digit by digit, a soft pulse along the arc when you tick a minimum. All at 60 fps, checked frame by frame | 3 |
| 8 | **Design fixes** | Boxes flattened to clean sections, one orange thing per screen, ink badges, a sync dot replacing the unexplained cloud icon, placeholders shaped like the real content (and only if loading takes over 0.3 s), a refined dock "+", clock size by screen width | 2 |
| 9 | **Finish every half-built screen** | 13 screens: Focus finished, File to yesterday, Filters, Backups, Document versions, today-only override, Minimum detail, Invite, Proposal detail, two settings pages, Preview as, Emergency QR | 5 |
| 10 | **Money opens fast** | First number under 1.5 seconds | 1 |
| 11 | **Final checks + release** | Every test green, checks on your phone, release notes | 2 |

**Total:** about 58 working days of build effort, or roughly 8–10 weeks of steady work. The first public APK, with honest screen time, the central engine and fast opening, arrives after phases 0, 1, 15, 16 and 13 (about 9 working days).

### How you'll see progress (honest numbers)
- **Overall app progress** = weighted share of *all* the work needed for a finished v4, not just this plan. **Starting point: 55%.** That counts what's already built, but with full credit only for screens that work correctly; the bugs above reduce it. Each phase is worth the share shown in the "Progress weights" table (§2). When a phase's acceptance checks pass, its full share is added; partly done phases count the share of their *finished* tasks only.
- Every progress update in chat looks like: **"Overall 61% · Phase 1 done (6 of 6 tasks) · now Phase 15, task 15.1"**.
- **One thing at a time:** a task is finished, which means tests green, checked on the emulator and committed, before the next starts. Nothing is left half-done to come back to later.

### What needs you
1. Put the three signing passwords in `~/.gradle/gradle.properties` yourself (Phase 13). The agent never sees them.
2. Say "merge to main" when the preview link works; that publishes to aiimin.in.
3. Plug in your phone for the checks, and ideally borrow one Samsung or Xiaomi phone for an hour (Phase 16).
4. Approve the name **Raahi** or give another (one line to change).
5. The server email change touches the database (plan names). You asked for it, so it's in scope; it runs on a test database first if one exists.

---

## Locked decisions (owner, 14 Oct 2026)

| # | Decision |
|---|---|
| L-A | **Beta plans: prices visible, nothing billed.** Every plan shows its price. Anyone can "buy" any plan and switch tiers freely; no money moves, no Google Play sheet opens. Paid features unlock for real. Before billing ever starts, every beta user gets 14 days' notice in the app; nobody is ever charged without choosing to subscribe through Google Play. |
| L-B | **Screen time is midnight to midnight**, the same as Android Digital Wellbeing, for display and for the score. |
| L-C | **All four plans stay on offer** (Free, Plus, Pro, Family). Features keep being built; a feature not built yet is listed as "coming" under its plan, never hidden and never claimed as working. |
| L-D | **Build the home-screen widget now** (Phase 12). |
| L-E | **Commit the app to GitHub** (`git@github.com:Addy48/AIIMIN.git`, a **public** repo) on `feat/native-v4`, after a secret scan (Phase 0). |
| L-F | **Put the v4 APK on the live waitlist download page** (`aiimin.in/app`, `frontend/src/pages/AndroidApp.jsx`), replacing the v2.0.4 APK (Phase 13). |
| L-G | **Personal notification engine**, both phone pop-ups and in-app, for every user, learning on the phone only (Phase 14). |
| L-H | **Notifications overhaul with Zomato-level creativity**, kind and never guilt-driven; Playful/Plain tone switch (Phase 14 + additions). |
| L-I | **Screen time and steps adapt per phone maker**, with self-check against the phone (Phase 16). |
| L-J | **Living sky timed by the phone's time zone and country** (no location permission) (Phase 17). |
| L-K | **One central engine (Pulse)** keeps every surface in sync and heals killed background work (Phase 15). |
| L-L | **Mascot "Raahi"** (owner's green-hooded character) in the assistant, widget, empty states and notifications; on by default, can be hidden. Replaces PLAN §2.18 rule 8 and the master plan's "The Mark" (Phase 18). |
| L-M | **Plan names Free/Plus/Pro/Family with emblems everywhere; email on each plan change** with the correct plan name (Phase 19). |
| L-N | **Work rule:** finish each task fully (tests, emulator check, commit) before starting the next; progress reported as overall app % (§2). |

---

## 0. Ground rules (non-negotiable, same as next-plan, plus three)

- Project root `/Users/aaditya/Desktop/DASHBOARD PROJECT/app`, branch `feat/native-v4`, debug appId `in.aiimin.app.v4`.
- **Phase 0 commits the current working tree as a checkpoint first** (decision L-E). After that, every task commits only its own files with `git add <exact paths>`. Never `git stash` or `git checkout --` other files.
- Light theme only. Use tokens only (`Aiimin.colors`, `Aiimin.type`, `Aiimin.space`, `Motion`). No glass, no purple, no emoji, no confetti.
- `AppSettings.reduceMotion == true` means every animation in this plan jumps to its end state.
- Never `pm clear` and never uninstall on the owner's phone. Use `adb install -r` only.
- Privacy copy stays honest: synced data is plain text on aiimin.in today.
- **New rule N1:** never claim a feature works when it isn't built. Unbuilt features show "(coming)" from `Feature.shipped == false` (Phase 2). Nothing is billed during the beta (L-A).
- **New rule N2:** every number that a user can compare against Android settings (screen time, unlocks, steps) must state its source and window on screen.
- **New rule N3:** every animation has a frame budget. No composable started by this plan may cause a dropped frame on the emulator profile `AiiminLean`, checked with `adb shell dumpsys gfxinfo in.aiimin.app.v4 framestats`.

---

## 1. Audit findings (what is wrong today, with evidence)

### 1.1 Screen time: why it does not match Digital Wellbeing (the main complaint)

| # | Finding | Evidence (file:line) | Effect on the user |
|---|---|---|---|
| ST1 | **Wrong window.** Screen time is read over the *logical* day (`logical.startOf(day)` → `endOf(day)`). With a night-owl day ending at 04:00, Android's midnight-to-midnight day and AIIMIN's day cover different hours. | `core/data/.../device/DeviceRepository.kt:97-103` | Totals differ from Settings › Digital Wellbeing every day the owner uses the phone after midnight. |
| ST2 | **Hourly bars are wrapped.** `hourOf()` returns clock hours 0–23, so 00:00–04:00 *of the next morning* lands in slots 0–3, the same slots as the early hours of the day. The x-axis says "12a … 12a". | `UsageReader.kt:95-96`, `InfoScreens.kt:221-224` | Bars at the left edge are really "last night", so the chart contradicts itself. |
| ST3 | **The headline and the score count different things.** Today and Phone day show `screenMs` (all apps). The score signal and "Your personal limit" use `SCREEN_PERSONAL` (work apps excluded). | `TodayScreen.kt:631`, `InfoScreens.kt:210,218` | "2h 40m" on Today, a limit of "2h", yet the score says the owner is fine. It reads as a bug. |
| ST4 | **The app list doesn't add up.** The reader keeps the top 40, the screen shows the top 12 with `ms > 0`, and nothing shows the rest. | `UsageReader.kt:109`, `InfoScreens.kt:238` | The list sums to less than the headline, and users notice. |
| ST5 | **Unlocks read 0 on phones without a secure lock.** Only `KEYGUARD_HIDDEN` is counted, and it never fires with "None"/"Swipe" lock. | `UsageTimeline.kt:118-122` | "0 unlocks" on a phone used all day. |
| ST6 | **Stale numbers.** Phone day refreshes only on the "Re-measure" button. Today refreshes on VM init, not on resume. Nothing says when it was measured. | `MeViewModels.kt:142,149`, `TodayViewModel.kt:110` | The owner opens Digital Wellbeing, sees a bigger number, comes back, and AIIMIN still shows the old one. |
| ST7 | **The week bars count all apps** while the limit is personal. | `InfoScreens.kt:274` | Same problem as ST3. |
| ST8 | **Times use two zone sources.** `firstUnlockAt` is formatted with `ZoneId.systemDefault()`; the engine uses `clock.zone`. | `InfoScreens.kt:219` | Wrong after travel, until restart. |
| ST9 | **Focus distraction is counted with apps in all states.** `finish()` subtracts *every* other app's time, including the system dialer during a call. | `PlanRepositories.kt:358-361` | Focus minutes are lost for legitimate calls. |

**Decision for ST1 (locked, L-B):** screen time always uses the **calendar day** (midnight to midnight, the same as Android) for display *and* scoring. The footer says so. Logical-day users keep logical days for tasks, money and journal. Reason: people check screen time against the system number, so it has to match it.

### 1.2 Plans, prices and access

| # | Finding | Evidence | Effect |
|---|---|---|---|
| PL1 | **Nothing is gated.** `entitlement.plan` is read only to *display* the plan name. No feature, limit or chart range checks it. | grep of `ent.plan` / `entitlement`: only in `MeExtras.kt`, `MeViewModels.kt` | Plans are decoration. Free and Pro behave identically. |
| PL2 | **Prices are invisible.** While Play has no products (`StoreState.NotListed`), every paid block shows `—` for its price. | `MeExtras.kt:261-266` | "How much is Plus?" has no answer anywhere in the app. |
| PL3 | **Two plan systems exist.** The legacy `SubscriptionTier` (explore/core/pro/elite, ₹29/49/79 prices, `TierFeature`) still lives in `core:model` beside the v4.1 `Plan`. | `core/model/.../SubscriptionTier.kt` | Confusion for the next agent; risk of wiring the wrong one. |
| PL4 | **No launch gates.** `Plan.PRO` is offered for purchase even though Patterns, the monthly review PDF and smart rules aren't verified as shipped; only Family is marked "Coming soon". | `MeExtras.kt:258` | This breaks plan §13.6 ("we never sell what isn't built") and India's dark-patterns rules (bait and switch). |
| PL5 | **The differences aren't clear.** Blocks list 4–5 lines each; there's no "what you would gain" view tied to the owner's own usage; Compare is a sheet with no limits shown. | `MeExtras.kt:205-209`, plan §4.68 items 2, 5, 6 | The owner's complaint: "differences between plans are not clear". |
| PL6 | **No upgrade moments, no trial, no "your numbers vs limits".** | grep: no UP1/UP2 | Plan §13.4/§13.7 not built. |

### 1.3 Boot, logo, arc and motion

| # | Finding | Evidence |
|---|---|---|
| MO1 | Boot is the system splash (static launcher icon) cut straight to Today. There is no brand moment; `ready = true` flips on the first composition. | `MainActivity.kt:68-83`, `themes.xml` |
| MO2 | `BrandMark` is static. The v3 `AiiminSplash`/`AnimatedBrandMark` existed but lagged. Likely causes: (a) no Baseline Profile, so first-run JIT; (b) the animation ran while the whole Shell composed in the same frames; (c) paths were rebuilt every frame. | `app-v3-legacy/.../brand/BrandMark.kt:107-180` |
| MO3 | The day arc appears fully drawn. Its colour jumps in three steps (at 12:00 and 17:00). Nothing at night: `Horizons.at` has no night or dawn state. | `Palette.kt:172-183`, `Horizon.kt` |
| MO4 | The motion map (§2.15) is partly built. Push/pop and tab crossfade exist (`Shell.kt:264-277`). Not built: number tweens (score, money, XP), check-draw on complete, row collapse plus undo re-expand, new-item highlight wash, container transform for documents, digit-by-digit price change. | grep `animateIntAsState` / `AnimatedContent` usage |
| MO5 | There is no predictive-back preview on sub-screens (Android 14+ users expect it). | `Shell.kt` popTransitionSpec only |

### 1.4 Connections between modules

The event log (`EventChain`) is a single source of truth, but modules seldom *use each other*. A vault expiry doesn't offer a task. A bill due doesn't appear in the Now card. Late screen time isn't tied to the next morning's sleep. Spending isn't set beside the mood journal. Focus doesn't know which apps break focus (S9's "focus-breaking" toggle isn't built). This is the "interconnection logic" gap.

### 1.5 Unfinished surfaces (from `docs/COVERAGE.md`, 🟡/⬜)

T10 Focus finished · T12 Minimum detail · T13 File to yesterday · S5 today-only override · M6 Filters · V7 Info/versions · V11 Invite · V13 · V14/V15 server-wait access · V17 Preview as · A4 Proposal detail · C2 live transcript (*done in the last build, not yet tested on the phone*) · SE3 · SE5 · SE8 backups · EK2 QR code · plus all of PL6.

### 1.6 Micro-details found in the audit (fixed in Phase 8)

1. `PhoneDataCard` uses a boxed card (`RoundedCornerShape(14.dp)` + border), which breaks the "hairlines, not boxes" rule fixed elsewhere (`TodayScreen.kt:~660`).
2. `PlanBlock` and `StoreNote` are boxed too (`MeExtras.kt:241,250`).
3. Phone day stats use three equal-weight `Stat`s in two rows, six numbers with no hierarchy. The spec wants one hero number plus one sentence (§4.24).
4. Phone day empty state is a generic `EmptyState`; the spec has exact copy (§4.24 "Permission missing state").
5. App rows show the package suffix for duplicates (fixed), but there's no app icon; the spec says "the app's own icon".
6. Sleep "fell asleep / woke" uses `systemDefault` (ST8).
7. "Observed · counts fully toward your score" sits on Phone day even when *nothing* was observed.
8. `SectionHeader` top padding is 18 dp; spec §6 says 26 dp (next-plan Task 6).
9. Hero clock 68 sp overflows below 360 dp width (next-plan Task 6).
10. `Horizons.at(hour, dark)` keeps a `dark` branch for a theme that will not ship. Delete it in Phase 4.

---

## 2. Roadmap (order matters: truth, then clarity, then life)

| Phase | Name | Why this order | Size |
|---|---|---|---|
| 0 | Secret scan, checkpoint commit, push to GitHub | Safe baseline before any change; repo is public | 0.5 day |
| 1 | Screen time you can trust | The owner's top complaint; data bugs undermine everything else | 1.5–2 days |
| 2 | Plans, prices, limits, gates | Visible prices + real gating + legal safety | 3–4 days |
| 3 | Boot, logo and arc motion (lag-free) | First impression; reuses v3 idea, fixes its lag | 2 days |
| 4 | Living sky and time-of-day gradients | Identity; feeds Phases 3 and 6 | 1.5 days |
| 5 | Connections engine | "The app knows my life", the reason to keep using it | 3 days |
| 6 | Make it hard to put down (ethically) | First-week ladder, rituals, widgets, the Mark | 4–5 days |
| 7 | Transitions and interactions (motion map) | Feel | 2–3 days |
| 8 | Micro-detail pass | Finish | 1–2 days |
| 9 | Finish the 🟡 surfaces | Completeness | 4–6 days |
| 10 | Money cold start ≤1.5 s | Performance | 1 day |
| 11 | QA, phone verification, release | Ship | 1–2 days |
| 12 | Home-screen widget | Seen without opening the app | 2 days |
| 13 | Publish the APK on the live waitlist page | Put it in users' hands | 0.5 day |
| 14 | Notification engine: pop-ups + in-app, personal | Reasons to come back, without spam | 4–5 days |
| 15 | Central engine "Pulse" + instant first paint | Same numbers everywhere; no grey screens; heals killed jobs | 3 days |
| 16 | Adaptive screen time and steps per phone | Accurate on Samsung, Xiaomi, Pixel, Nothing… | 3 days |
| 17 | Sky timed to the real sun (zone + country) | Personal, seasonal light; arc visible at night | 1.5 days |
| 18 | Raahi companion | Character and warmth in the assistant, widget, empty states | 5 days |
| 19 | Plan emblems + plan-change emails | Plans feel real; confirmation by email | 1.5 days |

**Execution order (final):** 0 → 1 → 15 → 16 → 13 (APK 1) → 2 → 19 → 14 → 3 → 4 → 17 → 18 → 12 → 13 (APK 2) → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 13 (release). Phase 7's and Phase 14's "additions" sections are part of those phases.

### Progress weights (overall app %, honest method)

Baseline = **55%** (built surfaces and engines that already work; screens with the bugs in §1 aren't counted as finished). The remaining 45% is split by estimated effort:

| Phase | 0 | 1 | 15 | 16 | 13 | 2+19 | 14 | 3 | 4+17 | 18 | 12 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Weight % | 0.5 | 1.5 | 2.5 | 2.5 | 1 | 3 | 5 | 1.5 | 2.5 | 5 | 1.5 | 2.5 | 3.5 | 2.5 | 1.5 | 6 | 1 | 1.5 |

A phase's weight is earned task by task (equal share per task inside the phase). It is credited only when that task's tests pass, it's checked on the emulator, and it's committed. Each chat update reports: overall %, the phase, the task, and what was verified.

Phases 1–4 are written below at full task depth (code, tests, commands). Phases 5–11 have their file map, data model, rules and acceptance tests fixed here. Each one is expanded to the same step depth *in its own plan file* right before it starts (the writing-plans scope rule: one plan per subsystem), so code is never written against a codebase that has moved.

---

## Phase 0: Secret scan, checkpoint commit, push to GitHub

**Facts checked 14 Oct:** the repo root is `~/Desktop/DASHBOARD PROJECT`, remote `origin = git@github.com:Addy48/AIIMIN.git`, **public**, and `gh` is logged in as Addy48. The branch is `feat/native-v4` = `origin/feat/native-v4` = 6361c366, one commit ahead of `origin/main`. There are 113 changed or untracked paths, almost all under `app/`. Ignored and therefore safe: `aiimin.pem`, `*.tar.gz`, `mcp.json`, `app/*.keystore`, `app/local.properties`, `app/build/`. A regex scan of untracked app files for API keys, private keys and tokens found no literals.

### Task 0.1: Secret scan with a real tool

- [ ] **Step 1:** `brew install gitleaks` (or `docker run zricethezav/gitleaks`), then from the repo root run `gitleaks detect --source . --no-git -v --redact` and `gitleaks protect --staged` after staging. **Expected: no findings.** Any finding stops this phase: move the value to `local.properties`/`BuildConfig` from an ignored file and rotate the key.
- [ ] **Step 2:** Check that no personal data is staged: `git status --short | grep -Ei "\.(pdf|png|jpg|csv|db|sqlite|apk|jks|pem)$"`. **Expected:** only `app/screenshots/*.png` and `app/captures/*`. Open five at random and confirm they contain demo data only, not the owner's real money, documents or health. If unsure, add `app/captures/` to `app/.gitignore`.
- [ ] **Step 3:** Delete the empty stray file `app/aitui.sh` (0 bytes). The plan docs mention the owner's phone model, which is fine; they mention no personal numbers.

### Task 0.2: Checkpoint commit and push

- [ ] **Step 1:** `cd "$HOME/Desktop/DASHBOARD PROJECT" && git add app && git status --short | grep -v "^[AMDR] " ` → expect nothing outside `app/` is left unexplained (root-level changes, if any, are reviewed one by one before adding).
- [ ] **Step 2:** `git commit -m "feat(android): v4 native app checkpoint: in-app voice, sensor setup card, sync safeguards, plans, docs"`
- [ ] **Step 3:** `./gradlew -p app testDebugUnitTest` → green (95+). If red, fix forward in a new commit; never amend after pushing.
- [ ] **Step 4:** `git push origin feat/native-v4`. **Expected:** fast-forward from 6361c366.
- [ ] **Step 5:** Open a draft PR so the work is visible but not merged: `gh pr create --draft --base main --head feat/native-v4 --title "AIIMIN v4 native Android app" --body-file app/docs/superpowers/plans/2026-10-14-aiimin-v4-deep-improvement.md`. Merging to `main` waits for Phase 13, because **`main` deploys aiimin.in to production through Vercel.**

---

## Phase 1: Screen time you can trust

### File map
| File | Change |
|---|---|
| `core/sensing/src/main/kotlin/aiimin/core/sensing/logic/UsageTimeline.kt` | Add `screenOns`, `hourly` indexed from window start |
| `core/sensing/src/main/kotlin/aiimin/core/sensing/UsageReader.kt` | Secure-lock check, unlock fallback, window-relative hours |
| `core/sensing/src/main/kotlin/aiimin/core/sensing/logic/ScreenSummary.kt` | **Create.** Pure: headline choice, "other apps" row |
| `core/data/src/main/kotlin/aiimin/core/data/device/DeviceRepository.kt` | Calendar-day window for screen time |
| `feature/today/.../TodayScreen.kt`, `TodayViewModel.kt` | Honest headline + refresh on resume |
| `feature/me/.../InfoScreens.kt`, `MeViewModels.kt` | Phone day rebuilt per §4.24 |
| `core/data/.../plan/PlanRepositories.kt` | Focus distraction ignores calls |
| Tests: `core/sensing/src/test/kotlin/aiimin/core/sensing/UsageTimelineTest.kt`, `ScreenSummaryTest.kt` (create) | |

### Task 1.1: Screen-on fallback for unlocks

**Files:** Modify `UsageTimeline.kt`; Test `UsageTimelineTest.kt`

- [ ] **Step 1: Write the failing test** (append to `UsageTimelineTest`)

```kotlin
    @Test
    fun `screen-on events are counted so phones without a lock still show pickups`() {
        val r = run(listOf(
            Event(t(60), Kind.SCREEN_ON), Event(t(61), Kind.RESUMED, "yt", "Main"), Event(t(70), Kind.SCREEN_OFF),
            Event(t(120), Kind.SCREEN_ON), Event(t(120) + 400, Kind.SCREEN_ON), // debounced duplicate
            Event(t(130), Kind.SCREEN_OFF),
        ))
        assertThat(r.unlocks).isEqualTo(0)
        assertThat(r.screenOns).isEqualTo(2)
    }
```

- [ ] **Step 2: Run, expect FAIL** (`Unresolved reference: screenOns`)

Run: `./gradlew :core:sensing:testDebugUnitTest --tests '*UsageTimelineTest*'`

- [ ] **Step 3: Implement.** In `UsageTimeline.Result` add the field after `unlocks`:

```kotlin
        /** SCREEN_INTERACTIVE events in the window, debounced. Pickups on phones with no secure lock. */
        val screenOns: Int,
```

In `compute`, beside `var unlocks = 0`, add `var screenOns = 0; var lastScreenOn: Long? = null`. Replace `Kind.SCREEN_ON -> Unit` with:

```kotlin
                Kind.SCREEN_ON -> if (e.at in windowStart until windowEnd && (lastScreenOn == null || e.at - lastScreenOn!! >= UNLOCK_DEBOUNCE_MS)) {
                    screenOns++
                    lastScreenOn = e.at
                }
```

Pass `screenOns = screenOns,` in the `Result(...)` constructor.

- [ ] **Step 4: Run, expect PASS** (all existing tests too)
- [ ] **Step 5: Commit** `git add core/sensing && git commit -m "fix(sensing): count screen-on pickups for phones without a secure lock"`

### Task 1.2: Hourly bars indexed from window start (no wrap)

**Files:** Modify `UsageTimeline.kt`, `UsageReader.kt`; Test `UsageTimelineTest.kt`

- [ ] **Step 1: Failing test**

```kotlin
    @Test
    fun `hourly slots follow the window, so a window starting at 04:00 puts 04:00 in slot 0`() {
        val start = t(4 * 60)
        val r = UsageTimeline.compute(
            events = listOf(Event(start + t(10), Kind.RESUMED, "yt", "M"), Event(start + t(40), Kind.PAUSED, "yt", "M")),
            windowStart = start, windowEnd = start + day,
            counted = { true }, hourOf = { ((it / 3_600_000L) % 24).toInt() }, hourStart = { it - Math.floorMod(it, 3_600_000L) },
        )
        assertThat(r.hourlyMs[0]).isEqualTo(t(30))
        assertThat(r.hourlyMs.size).isEqualTo(24)
    }
```

- [ ] **Step 2: Run, expect FAIL** (slot 4 holds the time, not slot 0)
- [ ] **Step 3: Implement.** In `compute`, replace the hourly loop with:

```kotlin
        val slots = (((windowEnd - windowStart) + 3_599_999L) / 3_600_000L).toInt().coerceIn(1, 26) // 23/25 on DST days
        val hourly = LongArray(slots)
        for ((s, t) in all) {
            var c = s
            while (c < t) {
                val next = minOf(t, hourStart(c) + 3_600_000L)
                val slot = ((hourStart(c) - hourStart(windowStart)) / 3_600_000L).toInt().coerceIn(0, slots - 1)
                hourly[slot] += next - c
                c = if (next > c) next else t
            }
        }
```

Update the KDoc on `hourlyMs`: "slot 0 is the hour containing windowStart". `hourOf` becomes unused. Remove the parameter from `compute`, from the test helper `run(...)` and from `UsageReader`.

- [ ] **Step 4: Run all sensing tests, expect PASS**
- [ ] **Step 5: Commit** `fix(sensing): hourly screen time indexed from window start`

### Task 1.3: `ScreenSummary` (one source for the headline, counted time and the "Other apps" row)

**Files:** Create `core/sensing/src/main/kotlin/aiimin/core/sensing/logic/ScreenSummary.kt`; Test `core/sensing/src/test/kotlin/aiimin/core/sensing/ScreenSummaryTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.sensing

import aiimin.core.sensing.logic.ScreenSummary
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class ScreenSummaryTest {
    private val m = 60_000L

    @Test fun `other apps row makes the list add up to the total`() {
        val s = ScreenSummary.of(totalMs = 100 * m, personalMs = 100 * m, appMs = listOf(50 * m, 30 * m, 10 * m, 5 * m, 5 * m), shown = 3)
        assertThat(s.otherMs).isEqualTo(10 * m)
    }

    @Test fun `overlap never makes other negative`() {
        val s = ScreenSummary.of(totalMs = 60 * m, personalMs = 60 * m, appMs = listOf(40 * m, 40 * m), shown = 2)
        assertThat(s.otherMs).isEqualTo(0)
    }

    @Test fun `counted line appears only when work apps change the number`() {
        assertThat(ScreenSummary.of(100 * m, 100 * m, emptyList(), 0).countedLine).isNull()
        assertThat(ScreenSummary.of(100 * m, 70 * m, emptyList(), 0).countedLine).isEqualTo("1h 10m counted · 30m work")
    }

    @Test fun `pickups prefer unlocks on a secure phone and screen-ons otherwise`() {
        assertThat(ScreenSummary.pickups(secure = true, unlocks = 41, screenOns = 60)).isEqualTo(41 to "unlocks")
        assertThat(ScreenSummary.pickups(secure = false, unlocks = 0, screenOns = 60)).isEqualTo(60 to "pickups")
    }
}
```

- [ ] **Step 2: Run, expect FAIL** (`Unresolved reference: ScreenSummary`)
- [ ] **Step 3: Implement**

```kotlin
package aiimin.core.sensing.logic

/** What screen-time surfaces show, computed once so Today, Phone day and the score never disagree. */
data class ScreenSummary(val totalMs: Long, val personalMs: Long, val otherMs: Long, val countedLine: String?) {
    companion object {
        fun of(totalMs: Long, personalMs: Long, appMs: List<Long>, shown: Int): ScreenSummary {
            val listed = appMs.sortedDescending().take(shown).sum()
            val work = (totalMs - personalMs).coerceAtLeast(0)
            val counted = if (work < 60_000L) null else "${fmt(personalMs)} counted · ${fmt(work)} work"
            return ScreenSummary(totalMs, personalMs, (totalMs - listed).coerceAtLeast(0), counted)
        }

        fun pickups(secure: Boolean, unlocks: Int, screenOns: Int): Pair<Int, String> =
            if (secure) unlocks to "unlocks" else screenOns to "pickups"

        fun fmt(ms: Long): String {
            val min = ms / 60_000L
            return when {
                min < 1 -> "<1m"
                min < 60 -> "${min}m"
                min % 60 == 0L -> "${min / 60}h"
                else -> "${min / 60}h ${min % 60}m"
            }
        }
    }
}
```

- [ ] **Step 4: Run, expect PASS**
- [ ] **Step 5: Commit** `feat(sensing): ScreenSummary as the single screen-time presenter`

### Task 1.4: Calendar-day window + secure-lock flag + persisted pickups

**Files:** Modify `UsageReader.kt`, `DeviceRepository.kt`, `core/database/.../Entities.kt` (`DeviceDayEntity`), `AppDatabase.kt` (version bump + AutoMigration)

- [ ] **Step 1:** In `UsageReader`, add:

```kotlin
    fun isSecure(): Boolean = (context.getSystemService(Context.KEYGUARD_SERVICE) as android.app.KeyguardManager).isDeviceSecure
```

Add `val screenOns: Int` to `ScreenDay` and fill it with `screenOns = r.screenOns`. Change `apps = r.apps.take(40)` to `r.apps.take(60)`. The "Other" row is computed from the total, so 60 only widens the tap-able list.

- [ ] **Step 2:** In `DeviceDayEntity`, add `val pickups: Int? = null` and `val pickupsLabel: String? = null`. Bump `@Database(version = N+1)` and add `AutoMigration(from = N, to = N + 1)`. Read the current N in `AppDatabase.kt` (v2 per master plan §3, so 2 → 3).
- [ ] **Step 3:** In `DeviceRepository.refresh`, replace the screen read with a calendar window:

```kotlin
        // Screen time always uses the calendar day, the same window as Android's Digital Wellbeing (plan rule N2).
        val calStart = day.atStartOfDay(clock.zone).toInstant()
        val calEnd = day.plusDays(1).atStartOfDay(clock.zone).toInstant()
        val screen = runCatching { usage.read(calStart, calEnd, clock.zone, s.workApps, s.lateHour) }.getOrNull()
        val pick = screen?.let { aiimin.core.sensing.logic.ScreenSummary.pickups(usage.isSecure(), it.unlocks, it.screenOns) }
```

and in the `DeviceDayEntity(...)` call add `pickups = pick?.first ?: existing?.pickups, pickupsLabel = pick?.second ?: existing?.pickupsLabel,`. Inject `UsageReader` access the same way as the existing `usage` field.

- [ ] **Step 4:** `./gradlew :core:database:kspDebugKotlin :core:data:compileDebugKotlin`, expect BUILD SUCCESSFUL, and confirm a new schema JSON appears under `core/database/schemas/`.
- [ ] **Step 5:** `./gradlew testDebugUnitTest`, expect all green.
- [ ] **Step 6: Commit** `fix(device): screen time on the calendar day; persist pickups with their label`

### Task 1.5: Today shows the honest number and refreshes on resume

**Files:** Modify `TodayScreen.kt` (`PhoneBody`), `TodayViewModel.kt`

- [ ] **Step 1:** In `TodayViewModel`, add a throttled resume refresh:

```kotlin
    private var lastDeviceRefresh = 0L
    fun onResume() {
        val now = System.currentTimeMillis()
        if (now - lastDeviceRefresh < 60_000L) return
        lastDeviceRefresh = now
        viewModelScope.launch { runCatching { device.refreshRecent() } }
    }
```

- [ ] **Step 2:** In `TodayScreen` (top-level composable), add `LifecycleEventEffect(Lifecycle.Event.ON_RESUME) { vm.onResume() }`.
- [ ] **Step 3:** In `PhoneBody`, replace the three screen-time `Text`s with:

```kotlin
            val sum = d?.screenMs?.let { aiimin.core.sensing.logic.ScreenSummary.of(it, d.screenPersonalMs ?: it, emptyList(), 0) }
            Text("Screen time", style = Aiimin.type.caption)
            Text(sum?.let { aiimin.core.sensing.logic.ScreenSummary.fmt(it.totalMs) } ?: "—", style = Aiimin.type.numberSmall, modifier = Modifier.padding(top = 3.dp))
            Text(
                sum?.countedLine ?: d?.pickups?.let { "$it ${d.pickupsLabel ?: "unlocks"}" } ?: "Turn on screen time",
                style = Aiimin.type.caption,
            )
```

(If `:feature:today` does not depend on `:core:sensing`, move `ScreenSummary` to `core/model` instead. Check with `grep sensing feature/today/build.gradle.kts` before Step 3.)

- [ ] **Step 4:** Build, install on the emulator, open Today, then Settings › Digital Wellbeing. **Expected: the same total to within ±2 min.** Write down both numbers in the commit message.
- [ ] **Step 5: Commit** `fix(today): screen time headline matches Android; refresh on resume`

### Task 1.6: Phone day rebuilt per spec §4.24

**Files:** Modify `feature/me/.../InfoScreens.kt` (screen section), `MeViewModels.kt`

- [ ] **Step 1:** In the Phone day VM, add an `onResume()` with the same 60 s throttle as Task 1.5 calling `device.refresh(day.value)`. Wire it with `LifecycleEventEffect(ON_RESUME)` in the screen.
- [ ] **Step 2:** Replace the "Screen" `Panel { … }` block with a flat section (no Panel):

```kotlin
                SectionHeader("Screen")
                val total = data.screenMs
                if (total == null) {
                    Text(
                        "Turn on usage access to see your screen time. AIIMIN reads which apps were in front and for how long. The app list stays on your phone; only daily totals sync if backup is on.",
                        style = Aiimin.type.body,
                    )
                    AppButton("Open settings", { context.startActivity(vm.usageSettingsIntent()) }, compact = true, modifier = Modifier.padding(top = 10.dp))
                } else {
                    val apps = DeviceRepository.apps(data)
                    val sum = ScreenSummary.of(total, data.screenPersonalMs ?: total, apps.map { it.ms }, shown = 12)
                    Text(ScreenSummary.fmt(total), style = Aiimin.type.number) // the one hero number
                    Text(
                        listOfNotNull(sum.countedLine, data.pickups?.let { "$it ${data.pickupsLabel ?: "unlocks"}" }, data.lateScreenMs?.takeIf { it >= 60_000 }?.let { "${ScreenSummary.fmt(it)} after ${prefs?.lateHour ?: 23}:00" }).joinToString(" · "),
                        style = Aiimin.type.caption, modifier = Modifier.padding(top = 4.dp),
                    )
                    screenLimit?.let { Meter((((data.screenPersonalMs ?: total) / 60_000.0) / it).toFloat().coerceAtMost(1f), color = c.text, modifier = Modifier.padding(top = 10.dp)) }
                    val hourly = DeviceRepository.longs(data.screenHourly)
                    if (hourly.any { it > 0 }) Bars(hourly.map { it.toFloat() }, color = c.text, labels = listOf("12a", "6a", "12p", "6p", "12a"), description = "Screen time by hour", modifier = Modifier.padding(top = 14.dp))
                    Text("Updated ${Dates.ago(data.updatedAt)} · midnight to midnight, like Android's Digital Wellbeing", style = Aiimin.type.caption.copy(color = c.textFaint), modifier = Modifier.padding(top = 8.dp))
                }
```

If `Dates.ago` doesn't exist, add it to the `Dates` util: `fun ago(epochMs: Long): String { val m = (System.currentTimeMillis() - epochMs) / 60_000; return when { m < 1 -> "just now"; m < 60 -> "$m min ago"; else -> "${m / 60} h ago" } }`, with a unit test for each branch.

- [ ] **Step 3:** After the app `items(...)`, add the Other row:

```kotlin
                if (sum.otherMs >= 60_000) item { ListRow("Other apps", trailing = { Text(ScreenSummary.fmt(sum.otherMs), style = Aiimin.type.numberSmall) }) }
```

- [ ] **Step 4:** The week bars use `it.screenPersonalMs ?: it.screenMs` and the caption reads "Counted screen time". Show the "Observed" tag only if `total != null`.
- [ ] **Step 5:** Verify on the emulator: the app rows plus "Other apps" add up to the hero within ±1 min. Hour slot 0 is 00:00.
- [ ] **Step 6: Commit** `feat(phone-day): one hero number, list adds up, honest window line, refresh on resume`

### Task 1.7: Focus doesn't lose time to calls

**Files:** Modify `PlanRepositories.kt:358-361`

- [ ] **Step 1:** Replace the `distracted` line with:

```kotlin
        val dialers = setOf("com.google.android.dialer", "com.android.dialer", "com.android.incallui", "com.samsung.android.incallui", "com.nothing.dialer")
        val distracted = screen?.apps?.filter { it.pkg != context.packageName && it.pkg !in dialers && it.pkg !in s.focusAllowedApps }
            ?.sumOf { it.ms }?.div(60_000L)?.toInt() ?: 0
```

Add `val focusAllowedApps: Set<String> = emptySet()` to `AppSettings` and a key `focus_allowed_apps` (stringSet) in `SettingsStore`, following the `workApps` pattern exactly (lines 49/118). Read `val s = settings.current()` at the top of `finish`.

- [ ] **Step 2:** Build plus tests green. **Commit** `fix(focus): calls and allowed apps don't count as distraction`

**Phase 1 acceptance (run on the owner's phone after `adb install -r`):** (1) Today total = Digital Wellbeing ±2 min. (2) Phone day list + Other = hero. (3) Pickups show a non-zero number with whatever lock the phone uses. (4) Leaving the app for 2 minutes and returning updates the number.

---

## Phase 2: Plans, prices, limits, gates

**Decisions (locked, see L-A and L-C):**
- **D-P1 Prices always visible.** If Google Play returns prices, show those. Otherwise show the plan §13.2 prices: Plus ₹49/month or ₹449/year, Pro ₹99 or ₹899, Family ₹179 or ₹1,599. Each price carries a small line: "Beta: free for now. No payment is taken."
- **D-P2 Beta purchase = free tier switch.** "Continue with Pro" opens a confirmation sheet, not Google Play. The sheet says: "Pro is free during the beta. No payment is taken and no card is needed. We'll tell you at least 14 days before paid plans start, and you choose then." The button reads "Switch to Pro". The plan takes effect at once and can be changed any time, in both directions, from Plans or Your subscription.
- **D-P3 Features follow the plan for real.** Gates (Task 2.2) read the active plan, so switching to Free re-applies Free limits (soft mode: nothing already made is blocked, rule §13.5) and switching up lifts them. A feature still being built is listed with "(coming)" under its plan.
- **D-P4 When billing starts (later, separate plan):** set `BillingMode.PLAY` remotely or in a release. Beta plans then show "Your beta Pro ends on {date}" for 14 days, and afterwards drop to Free unless the person subscribes through Play. Nothing auto-charges, ever. This keeps to India's dark-pattern guidelines (no subscription trap, no drip pricing).
- **D-P5 Honesty on the server:** the beta plan is stored on the phone and synced as `plan_beta` in the profile (when signed in), so aiimin.in shows the same plan. Synced data stays plain text, as before.

### File map
| File | Change |
|---|---|
| `core/data/src/main/kotlin/aiimin/core/data/plan/FeatureCatalog.kt` | **Create.** Every feature × plan access + `shipped` |
| `core/data/src/main/kotlin/aiimin/core/data/plan/Gate.kt` | **Create.** `Gate.check(feature, used)` |
| `core/data/src/main/kotlin/aiimin/core/data/plan/PlayBilling.kt` | `Plan` gains planned prices + `complete` |
| `core/data/src/main/kotlin/aiimin/core/data/plan/BetaPlans.kt` | **Create.** Beta entitlement store + `BillingMode` |
| `core/data/src/main/kotlin/aiimin/core/data/settings/SettingsStore.kt` | `betaPlan`, `betaPlanSince` keys |
| `core/model/.../SubscriptionTier.kt` + its test + `core/model/bin/**` | **Delete** (legacy) |
| `feature/me/.../MeExtras.kt` | Plans screen rebuilt: usage headline, real prices, gain list, Compare table from the catalogue, "your numbers" |
| `core/designsystem/.../component/UpgradeSheet.kt` | **Create.** UP1 |
| `core/data/.../plan/UpgradeMoments.kt` | **Create.** Caps (1 per moment per 30 days, ≤1/day, blocked contexts) |
| Call sites | Family profile add · splits person add · chart range buttons · ledger create · browser link |

### Task 2.1: Feature catalogue (single source for screen, compare table, gates, store copy)

**Files:** Create `FeatureCatalog.kt`; Test `core/data/src/test/kotlin/aiimin/core/data/plan/FeatureCatalogTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.data.plan

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FeatureCatalogTest {
    @Test fun `free is never empty and safety is never paid`() {
        Feature.entries.filter { it.safety }.forEach { assertThat(it.free).isNotEqualTo(Access.No) }
    }

    @Test fun `a plan is complete only when every hero feature has shipped`() {
        val heroes = Feature.entries.filter { Plan.PLUS in it.heroFor }
        assertThat(Plan.PLUS.complete).isEqualTo(heroes.all { it.shipped })
    }

    @Test fun `higher plans never give less than lower ones`() {
        Feature.entries.forEach { f ->
            assertThat(f.plus.rank).isAtLeast(f.free.rank)
            assertThat(f.pro.rank).isAtLeast(f.plus.rank)
        }
    }

    @Test fun `free family profile limit is two`() {
        assertThat(Feature.FAMILY_PROFILES.free).isEqualTo(Access.UpTo(2))
    }
}
```

- [ ] **Step 2: Run, expect FAIL.** `./gradlew :core:data:testDebugUnitTest --tests '*FeatureCatalogTest*'`
- [ ] **Step 3: Implement**

```kotlin
package aiimin.core.data.plan

/** How much of a feature a plan gets. rank orders them so higher plans never give less. */
sealed class Access(val rank: Int) {
    data object No : Access(0)
    data class UpTo(val n: Int) : Access(1 + n.coerceAtMost(9_998))
    data class Months(val n: Int) : Access(1 + n)
    data object Yes : Access(10_000)
}

enum class FeatureGroup(val title: String) { DAY("Day"), MONEY("Money"), VAULT("Vault & family"), INSIGHT("Insight"), SYNC("Sync & storage"), SUPPORT("Support") }

/**
 * Plan §13.2 as code. The Plans screen, the Compare table and every gate read this; nothing else
 * may hard-code plan differences. [shipped] = built and passed its Part 17 tests on a real phone.
 */
enum class Feature(
    val title: String,
    val group: FeatureGroup,
    val free: Access, val plus: Access, val pro: Access, val family: Access,
    val shipped: Boolean,
    val heroFor: Set<Plan> = emptySet(),
    val safety: Boolean = false,
) {
    DAY_CORE("Today, tasks, calendar, focus, minimums, journal, notes", FeatureGroup.DAY, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    VOICE_CAPTURE("Voice capture", FeatureGroup.DAY, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    LIFE_SCORE("Life Score, streak, battery", FeatureGroup.INSIGHT, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    CHART_HISTORY("Chart history", FeatureGroup.INSIGHT, Access.Months(3), Access.Yes, Access.Yes, Access.Yes, shipped = true, heroFor = setOf(Plan.PLUS)),
    PATTERNS("Patterns: what goes with what", FeatureGroup.INSIGHT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    MONTHLY_REVIEW("Monthly review PDF", FeatureGroup.INSIGHT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    WEEKLY_DRAFTS("Weekly review drafts", FeatureGroup.INSIGHT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    LEDGERS("Ledgers", FeatureGroup.MONEY, Access.UpTo(1), Access.UpTo(3), Access.UpTo(3), Access.UpTo(3), shipped = true, heroFor = setOf(Plan.PLUS)),
    SPLIT_PEOPLE("People in splits", FeatureGroup.MONEY, Access.UpTo(3), Access.Yes, Access.Yes, Access.Yes, shipped = true),
    SMART_RULES("Smart categorisation rules", FeatureGroup.MONEY, Access.No, Access.No, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PRO)),
    CA_EXPORT("CSV export for your CA", FeatureGroup.MONEY, Access.No, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    VAULT_DOCS("Documents (always on your phone)", FeatureGroup.VAULT, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true),
    FAMILY_PROFILES("Family profiles", FeatureGroup.VAULT, Access.UpTo(2), Access.UpTo(6), Access.UpTo(6), Access.UpTo(6), shipped = true, heroFor = setOf(Plan.PLUS)),
    DOC_VERSIONS("Document versions", FeatureGroup.VAULT, Access.No, Access.Yes, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PLUS)),
    AUTO_BACKUP("Automatic weekly vault backup", FeatureGroup.VAULT, Access.No, Access.Yes, Access.Yes, Access.Yes, shipped = false, heroFor = setOf(Plan.PLUS)),
    EMERGENCY_CARD("Emergency card and expiry reminders", FeatureGroup.VAULT, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true, safety = true),
    TRUSTED_PEOPLE("Trusted people for emergency access", FeatureGroup.VAULT, Access.UpTo(1), Access.UpTo(1), Access.UpTo(3), Access.Yes, shipped = false, safety = true),
    MEMBER_PHONES("Each member on their own phone", FeatureGroup.VAULT, Access.No, Access.No, Access.No, Access.Yes, shipped = false, heroFor = setOf(Plan.FAMILY)),
    BROWSERS("Linked browsers on aiimin.in", FeatureGroup.SYNC, Access.UpTo(1), Access.UpTo(4), Access.UpTo(4), Access.UpTo(4), shipped = true),
    EXPORT_ALL("Export everything", FeatureGroup.SYNC, Access.Yes, Access.Yes, Access.Yes, Access.Yes, shipped = true, safety = true),
    PRIORITY_SUPPORT("Priority support", FeatureGroup.SUPPORT, Access.No, Access.No, Access.Yes, Access.Yes, shipped = true),
    ;

    fun accessFor(plan: Plan): Access = when (plan) { Plan.FREE -> free; Plan.PLUS -> plus; Plan.PRO -> pro; Plan.FAMILY -> family }
}
```

In `PlayBilling.kt`, inside `enum class Plan`, add:

```kotlin
    /** Plan §13.2 prices in whole rupees, shown whenever Play has no product (decision D-P1). */
    val plannedMonthlyInr: Int get() = when (this) { FREE -> 0; PLUS -> 49; PRO -> 99; FAMILY -> 179 }
    val plannedYearlyInr: Int get() = when (this) { FREE -> 0; PLUS -> 449; PRO -> 899; FAMILY -> 1599 }
    /** True when every hero feature is built. Drives the "Some features coming" note; never hides the plan (L-C). */
    val complete: Boolean get() = this == FREE || Feature.entries.filter { this in it.heroFor }.let { h -> h.isNotEmpty() && h.all { it.shipped } }
```

> **Engineer check before marking a feature `shipped = true`:** the owner opens it on the real phone and it works. `CHART_HISTORY`, `LEDGERS`, `FAMILY_PROFILES` and `CA_EXPORT` are marked `true` from COVERAGE ✅. Confirm `LEDGERS` (Household/Business) on the phone before the first sale.

- [ ] **Step 4: Run, expect PASS**
- [ ] **Step 5: Commit** `feat(plans): feature catalogue as the single source of plan differences`

### Task 2.2: Gate

**Files:** Create `Gate.kt`; Test `GateTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
class GateTest {
    @Test fun `third family profile on free is over the limit and names plus`() {
        val r = Gate.check(Plan.FREE, Feature.FAMILY_PROFILES, used = 2, soft = false)
        assertThat(r).isEqualTo(GateResult.OverLimit(limit = 2, liftedBy = Plan.PLUS))
    }
    @Test fun `soft mode lets it through but still reports`() {
        val r = Gate.check(Plan.FREE, Feature.FAMILY_PROFILES, used = 2, soft = true)
        assertThat(r).isEqualTo(GateResult.AllowedOnce(limit = 2, liftedBy = Plan.PLUS))
    }
    @Test fun `safety features are always allowed`() {
        assertThat(Gate.check(Plan.FREE, Feature.EMERGENCY_CARD, used = 99, soft = false)).isEqualTo(GateResult.Allowed)
    }
    @Test fun `chart range beyond 3 months on free names plus`() {
        assertThat(Gate.months(Plan.FREE, requested = 6)).isEqualTo(GateResult.OverLimit(limit = 3, liftedBy = Plan.PLUS))
        assertThat(Gate.months(Plan.PLUS, requested = 24)).isEqualTo(GateResult.Allowed)
    }
}
```

- [ ] **Step 2: Run, expect FAIL**
- [ ] **Step 3: Implement**

```kotlin
package aiimin.core.data.plan

sealed interface GateResult {
    data object Allowed : GateResult
    /** Soft limits (pre-launch): the action completes; the UI may show one quiet line. */
    data class AllowedOnce(val limit: Int, val liftedBy: Plan) : GateResult
    data class OverLimit(val limit: Int, val liftedBy: Plan) : GateResult
    data class NotInPlan(val liftedBy: Plan) : GateResult
}

object Gate {
    fun check(plan: Plan, f: Feature, used: Int = 0, soft: Boolean): GateResult {
        if (f.safety) return GateResult.Allowed
        val lifter = { need: (Access) -> Boolean -> Plan.entries.first { it.ordinal > plan.ordinal && need(f.accessFor(it)) } }
        return when (val a = f.accessFor(plan)) {
            Access.Yes -> GateResult.Allowed
            Access.No -> GateResult.NotInPlan(lifter { it != Access.No })
            is Access.UpTo -> if (used < a.n) GateResult.Allowed else {
                val up = lifter { it is Access.Yes || (it is Access.UpTo && it.n > a.n) }
                if (soft) GateResult.AllowedOnce(a.n, up) else GateResult.OverLimit(a.n, up)
            }
            is Access.Months -> GateResult.Allowed
        }
    }

    fun months(plan: Plan, requested: Int): GateResult = when (val a = Feature.CHART_HISTORY.accessFor(plan)) {
        is Access.Months -> if (requested <= a.n) GateResult.Allowed else GateResult.OverLimit(a.n, Plan.PLUS)
        else -> GateResult.Allowed
    }
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(plans): Gate with soft pre-launch limits`

### Task 2.3: Delete the legacy tier system

- [ ] **Step 1:** `grep -rn "SubscriptionTier\|TierFeature\|TierSoul" --include='*.kt' . | grep -v /build/` → expect only `core/model/.../SubscriptionTier.kt` and its test (verified 14 Oct).
- [ ] **Step 2:** `git rm core/model/src/main/kotlin/aiimin/core/model/SubscriptionTier.kt core/model/src/test/kotlin/aiimin/core/model/SubscriptionTierTest.kt` and `rm -rf core/model/bin` (stale IDE output; check `git ls-files core/model/bin` first, and only `git rm` it if tracked).
- [ ] **Step 3:** `./gradlew testDebugUnitTest` green. **Commit** `chore(model): remove legacy explore/core/pro/elite tiers`

### Task 2.4: Plans screen that answers "what does each plan cost and add, for me?"

**Files:** Modify `feature/me/.../MeExtras.kt` (`PlansScreen`, `PlanBlock`, `CompareSheet`), `PlansViewModel`

Layout (top to bottom, per §4.68, with the missing parts added):

1. **Usage headline.** The VM exposes `usage: StateFlow<PlanUsage>` with `documents`, `payments`, `familyProfiles`, `splitPeople`, `ledgers`, `browsers`, read from the existing DAOs' counts (add `@Query("SELECT COUNT(*) FROM …")` where missing). Copy: new user (documents + payments < 5): "AIIMIN is free for one person, for as long as you like. Plans add more people, all your history and more help." Otherwise: "You've saved {documents} documents and logged {payments} payments. Here's what each plan adds."
2. **Your numbers vs Free limits** (always shown for Free users, not only near a limit), one line per limited feature from the catalogue: "Family profiles 1 of 2 · People in splits 2 of 3 · Chart history 3 months · Linked browsers 1 of 1". When a line is at its limit, the plan that lifts it gets the tag "Lifts your profile limit".
3. **Monthly | Yearly** switch.
4. **Four blocks as flat sections** separated by hairlines (no boxes). Each block has: name + tag (`Your plan` / `Coming soon` / `Recommended`), promise, **price line**, hero line, and "**Adds over {previous plan}:**" computed from the catalogue diff, not hand-written. Price line rules:

```kotlin
fun priceLine(plan: Plan, pp: PlanPrices?, period: Period): String = when {
    plan == Plan.FREE -> "₹0 · forever"
    pp != null && BetaPlans.mode == BillingMode.PLAY -> if (period == Period.YEARLY) pp.yearly?.let { "${it.formatted}/year" + (pp.yearlySavingPct?.let { s -> " · save $s%" } ?: "") } ?: "—"
                  else pp.monthly?.formatted?.let { "$it/month" } ?: "—"
    period == Period.YEARLY -> "₹%,d/year · about ₹%d a month".format(plan.plannedYearlyInr, plan.plannedYearlyInr / 12)
    else -> "₹${plan.plannedMonthlyInr}/month"
}
```

   Under every paid price, while `BetaPlans.mode == BillingMode.BETA`, add the caption "Beta: free for now. No payment is taken." in `accentText`.

   And the gain list:

```kotlin
fun addsOver(plan: Plan): List<String> {
    val prev = Plan.entries.getOrNull(plan.ordinal - 1) ?: return emptyList()
    return Feature.entries.filter { it.accessFor(plan).rank > it.accessFor(prev).rank }.map { f ->
        when (val a = f.accessFor(plan)) {
            is Access.UpTo -> "${f.title}: up to ${a.n}"
            is Access.Months -> "${f.title}: ${a.n} months"
            else -> f.title
        } + if (!f.shipped) " (coming)" else ""
    }
}
```

   Put both in a new pure file `feature/me/.../PlanCopy.kt` with unit tests: one `priceLine` test per branch, plus `addsOver(Plan.PLUS)` contains "Family profiles: up to 6" and `addsOver(Plan.FREE)` is empty.
5. **Every plan is selectable** (L-C). A plan with `!plan.complete` shows the muted line "Some features are still being built and are marked (coming)." Remove the hard-coded `if (plan == Plan.FAMILY) Tag("Coming soon")` at `MeExtras.kt:258`.
6. **Compare plans** opens a full-screen table generated from `Feature.entries` grouped by `FeatureGroup`. It has a sticky header row (`Free | Plus | Pro | Family`) and a sticky first column; cells are "✓" (text glyph in ink, not an emoji), "Up to N", "N months", or "—". Unshipped rows read "coming" in `textFaint`. Horizontal scroll stays inside the table.
7. Trust block + FAQ (keep the current copy; add "Do you offer student pricing?" → "Not yet. When we do, it will be Pro at ₹49 a month, verified once a year.").
8. Sticky button: "Stay on {current}" until a plan is tapped, then "Continue with Pro · ₹99/month". In beta mode it opens the **Beta switch sheet** (Task 2.6) instead of `CheckoutSheet`, with the caption "Free during the beta. No payment is taken." Downgrades say "Switch to Free" and list what goes back to Free limits (from `Feature` diff), with "nothing is deleted".

- [ ] Steps: write the `PlanCopy` tests → fail → implement → pass → rebuild the screen → emulator check with `--es aiimin_go plans` (prices visible for all four plans in both periods, Compare scrolls, numbers block shows real counts) → commit `feat(plans): visible prices, gains over previous plan, compare table from catalogue, your numbers`.

### Task 2.5: Wire the gates at the five call sites + UP1 sheet + caps

**Call sites (find each with the grep shown, then wrap the action):**

| Action | Find | Feature | Upgrade moment # (§13.7) |
|---|---|---|---|
| Add family profile | `grep -rn "fun addPerson\|insertPerson" core/data feature/vault` | `FAMILY_PROFILES` | 3 |
| Add person to a split | `grep -rn "fun addSplit\|SplitPerson" core/data` | `SPLIT_PEOPLE` | 7 |
| Chart range 6M / 1Y / All | `grep -rn "\"6M\"\|\"1Y\"\|Range\." feature core/designsystem` | `Gate.months` | 5 |
| Create a ledger | `grep -rn "fun createLedger\|LedgerEntity(" core/data` | `LEDGERS` | 6 |
| Link a browser | `grep -rn "linkDevice\|LinkedDevices" core/data` | `BROWSERS` | 13 |

**`UpgradeMoments`** (pure, tested): `fun mayShow(moment: Int, now: Long, history: Map<Int, Long>, lastAnyAt: Long?, lastDismissAt: Long?, context: UiContext): Boolean`. It returns true only if: this moment has not been shown in the last 30 days, nothing was shown in the last 24 h, there was no dismissal in the last 24 h, and `context` is not in `setOf(ONBOARDING, CAPTURE, REVIEW_INBOX, FOCUS, JOURNAL, EMERGENCY)`. Write one test per condition (7 tests). History is stored in DataStore as a JSON map.

**UP1** (`UpgradeSheet.kt`): a half-height sheet with one reason line (from the table above, copy in §13.7), the plan + price line from Task 2.4, primary "See {Plan}" (→ Plans, scrolled to that block, highlighted not selected), and secondary "Not now" **at equal size and weight**. In soft mode (`GateResult.AllowedOnce`), the action completes first, then the sheet may show (if `mayShow`). In hard mode (`OverLimit`), the action doesn't complete and an inline note offers "Remove one · See Plus".

- [ ] Steps per call site: write a failing VM test that the gate is consulted (fake `Plan.FREE`, `used = limit`) → wire it → pass → commit per site. Then test `UpgradeMoments` (7 tests) → sheet → commit.

**Gate acceptance:** (1) Adding a 3rd family profile on Free completes and shows one quiet sheet at most once per 30 days. (2) The Compare table rows equal `Feature.entries.size`. (3) `grep -rn "SubscriptionTier"` finds nothing.

### Task 2.6: Beta plans (switch tiers freely, nothing billed)

**Files:** Create `core/data/src/main/kotlin/aiimin/core/data/plan/BetaPlans.kt`; Modify `PlayBilling.kt` (entitlement source), `SettingsStore.kt`, `MeExtras.kt` (switch sheet, Your subscription); Test `core/data/src/test/kotlin/aiimin/core/data/plan/BetaPlansTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.data.plan

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class BetaPlansTest {
    @Test fun `in beta the chosen plan wins when there is no Play purchase`() {
        assertThat(BetaPlans.effective(BillingMode.BETA, play = null, beta = Plan.PRO)).isEqualTo(Plan.PRO)
    }
    @Test fun `a real Play purchase always wins over a beta choice`() {
        assertThat(BetaPlans.effective(BillingMode.BETA, play = Plan.PLUS, beta = Plan.PRO)).isEqualTo(Plan.PLUS)
    }
    @Test fun `in Play mode a beta plan stays for the notice period then drops to free`() {
        val day = 86_400_000L
        assertThat(BetaPlans.effective(BillingMode.PLAY, null, Plan.PRO, playModeSince = 0, now = 13 * day)).isEqualTo(Plan.PRO)
        assertThat(BetaPlans.effective(BillingMode.PLAY, null, Plan.PRO, playModeSince = 0, now = 15 * day)).isEqualTo(Plan.FREE)
    }
    @Test fun `switching records the change and never needs a purchase token`() {
        val r = BetaPlans.switch(from = Plan.FREE, to = Plan.FAMILY, now = 42)
        assertThat(r.plan).isEqualTo(Plan.FAMILY); assertThat(r.since).isEqualTo(42); assertThat(r.charged).isFalse()
    }
}
```

- [ ] **Step 2: Run, expect FAIL.** `./gradlew :core:data:testDebugUnitTest --tests '*BetaPlansTest*'`
- [ ] **Step 3: Implement**

```kotlin
package aiimin.core.data.plan

/** BETA: plans are free and switchable (decision L-A). PLAY: Google Play billing is live. */
enum class BillingMode { BETA, PLAY }

data class BetaSwitch(val plan: Plan, val since: Long, val charged: Boolean = false)

object BetaPlans {
    /** Flip to PLAY in the release that starts billing; everyone gets NOTICE_DAYS first. */
    val mode: BillingMode = BillingMode.BETA
    const val NOTICE_DAYS = 14

    fun effective(mode: BillingMode, play: Plan?, beta: Plan?, playModeSince: Long = 0, now: Long = System.currentTimeMillis()): Plan {
        if (play != null && play != Plan.FREE) return play
        val chosen = beta ?: return Plan.FREE
        return when (mode) {
            BillingMode.BETA -> chosen
            BillingMode.PLAY -> if (now - playModeSince < NOTICE_DAYS * 86_400_000L) chosen else Plan.FREE
        }
    }

    fun switch(from: Plan, to: Plan, now: Long): BetaSwitch = BetaSwitch(to, now)
}
```

- [ ] **Step 4:** In `SettingsStore`, add `betaPlan: String? = null` and `betaPlanSince: Long? = null` to `AppSettings`, with keys `beta_plan` (string) and `beta_plan_since` (long), following the `workApps` pattern at lines 49/118. In `PlayBilling`, change the public `entitlement` flow to `combine(playEntitlement, settings.settings) { e, s -> e.copy(plan = BetaPlans.effective(BetaPlans.mode, e.plan.takeIf { e.purchaseToken != null }, s.betaPlan?.let { runCatching { Plan.valueOf(it) }.getOrNull() })) }`. Add `suspend fun switchBeta(to: Plan) { settings.update { it.copy(betaPlan = to.name, betaPlanSince = System.currentTimeMillis()) } }`.
- [ ] **Step 5:** Beta switch sheet in `MeExtras.kt`: the title "Switch to {plan}", the price struck through with "Free during the beta" beside it, three lines of what changes now (first 3 of `addsOver(plan)` for upgrades, or the Free limits that return for downgrades), the honest line from D-P2, a primary "Switch to {plan}" and a secondary "Not now" at equal weight. On confirm: `vm.switchBeta(plan)`, close, and show the toast "You're on {plan}. Free during the beta." Log the event `plan.beta_switch` (Tier.A, source "user") through the existing event log.
- [ ] **Step 6:** "Your subscription" (`SubscriptionScreen`) in beta mode shows "{Plan} · beta, free" and "Since {date}", with "Change plan" (→ Plans) and "Go back to Free". Hide "Manage or cancel in Google Play".
- [ ] **Step 7:** Tests green. Emulator: Free → Pro → Free → Family, checking Compare marks the current plan and the 3rd family profile gate respects each plan. **Commit** `feat(plans): beta plans switch freely with prices shown and no billing`

**Phase 2 acceptance (beta):** (1) Every plan shows a rupee price in both periods. (2) Any plan can be chosen and changed with no payment sheet. (3) Gates follow the chosen plan within one screen refresh. (4) No string anywhere says or implies a charge happened. Check with `grep -rn "charged\|payment successful" feature/`.

---

## Phase 3: Boot, logo and arc motion (lag-free)

**Design.** Total cold-start brand moment ≤ **900 ms**, skipped on warm starts and on reduce-motion.

| t (ms) | What moves | Easing |
|---|---|---|
| 0 | System splash (static mark on the sky-tinted paper, Phase 4 tint). It holds only until Compose draws its first frame | — |
| 0–380 | **Arch** strokes on (trim 0→1) from both feet to the top, the same 24-unit stroke as `BrandMark` | `Motion.enter` (0.23,1,0.32,1) |
| 120–520 | **Peak A** draws left foot → apex → right foot | `Motion.enter` |
| 300–600 | **Inner A** draws, alpha 0→0.85 | `Motion.standard` |
| 420–760 | **Sun** rises along the arch path from the left foot to its seat (256,240), scale 0.6→1.06→1 | spring(dampingRatio 0.62, stiffness 380) |
| 760–900 | Mark scales 1→0.92 and fades; Today's **DayHorizon draws its past arc 0→now** (reveal 0→1, 600 ms, starts at 700) so the arc seems to *become* the day line | `Motion.exit` / `Motion.enter` |

**Why v3 lagged, and the countermeasures (all required):**
1. **First-run JIT.** Add a Baseline Profile (`:baselineprofile` module), which covers cold start → Today → Money → Phone day.
2. **Composition in the same frames.** The boot overlay is drawn in a single `Canvas` with `drawWithCache`, and paths are built once per size. The Shell is composed **under** the overlay from frame 1, but Today's heavy children (charts, lists) wait behind `boot.done || frame >= 2` via a `LocalBootPhase` CompositionLocal.
3. **Main-thread I/O at start.** The `AiiminApplication.onCreate` work is audited with a startup trace: `adb shell am start -W -S -n in.aiimin.app.v4/aiimin.app.MainActivity` (TotalTime before/after) plus a Perfetto trace. DB open moves to `Dispatchers.IO` warm-up in `Application` (`appScope.launch(Dispatchers.IO) { db.openHelper.writableDatabase }`).
4. **Progress is a pure function** of elapsed ms (`BootTimeline.at(ms)`). Frames that drop skip ahead instead of stalling.

### File map
| File | Change |
|---|---|
| `core/designsystem/.../motion/BootTimeline.kt` | **Create.** Pure progress per part |
| `core/designsystem/.../component/BootMark.kt` | **Create.** Canvas renderer |
| `core/designsystem/.../component/Horizon.kt` | Add `reveal: Float = 1f` |
| `app/src/main/kotlin/aiimin/app/MainActivity.kt` | Overlay + cold/warm detection |
| `baselineprofile/` module, `settings.gradle.kts`, `app/build.gradle.kts`, `gradle/libs.versions.toml` | Baseline Profile |
| Test: `core/designsystem/src/test/kotlin/aiimin/designsystem/motion/BootTimelineTest.kt` | |

### Task 3.1: BootTimeline (pure)

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.designsystem.motion

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class BootTimelineTest {
    @Test fun `start is empty and end is complete`() {
        val a = BootTimeline.at(0); assertThat(a.arch).isEqualTo(0f); assertThat(a.sun).isEqualTo(0f)
        val z = BootTimeline.at(BootTimeline.TOTAL_MS); assertThat(z.arch).isEqualTo(1f); assertThat(z.exit).isEqualTo(1f)
    }
    @Test fun `parts start in order`() {
        assertThat(BootTimeline.at(100).peak).isEqualTo(0f)
        assertThat(BootTimeline.at(200).peak).isGreaterThan(0f)
        assertThat(BootTimeline.at(400).sun).isEqualTo(0f)
        assertThat(BootTimeline.at(500).sun).isGreaterThan(0f)
    }
    @Test fun `monotonic, never above 1`() {
        var prev = BootTimeline.at(0)
        for (ms in 10..BootTimeline.TOTAL_MS step 10) {
            val p = BootTimeline.at(ms)
            listOf(p.arch to prev.arch, p.peak to prev.peak, p.inner to prev.inner, p.exit to prev.exit).forEach { (n, o) -> assertThat(n).isAtLeast(o); assertThat(n).isAtMost(1f) }
            prev = p
        }
    }
    @Test fun `reduce motion is the final frame`() { assertThat(BootTimeline.at(0, reduceMotion = true)).isEqualTo(BootTimeline.at(BootTimeline.TOTAL_MS)) }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.designsystem.motion

/** Boot brand moment as a pure function of elapsed time (plan Phase 3). Sun is raw 0–1; the renderer applies its spring. */
object BootTimeline {
    const val TOTAL_MS = 900

    data class Frame(val arch: Float, val peak: Float, val inner: Float, val sun: Float, val exit: Float)

    private fun seg(ms: Int, from: Int, to: Int, ease: (Float) -> Float = ::enter): Float =
        ease(((ms - from).toFloat() / (to - from)).coerceIn(0f, 1f))

    /** cubic-bezier(0.23, 1, 0.32, 1) approximated by easeOutQuint, within 2% for UI use. */
    fun enter(t: Float): Float { val u = 1f - t; return 1f - u * u * u * u * u }

    fun at(ms: Int, reduceMotion: Boolean = false): Frame {
        val m = if (reduceMotion) TOTAL_MS else ms.coerceIn(0, TOTAL_MS)
        return Frame(
            arch = seg(m, 0, 380), peak = seg(m, 120, 520), inner = seg(m, 300, 600),
            sun = seg(m, 420, 760) { it }, exit = seg(m, 760, 900) { it * it },
        )
    }
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(motion): BootTimeline pure boot choreography`

### Task 3.2: BootMark renderer

**Files:** Create `core/designsystem/.../component/BootMark.kt`

- [ ] **Step 1: Implement** (geometry identical to `BrandMark`, so the static and animated marks never differ)

```kotlin
package aiimin.designsystem.component

import aiimin.designsystem.motion.BootTimeline
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Box
import kotlinx.coroutines.isActive

@Composable
fun BootMark(reduceMotion: Boolean, onDone: () -> Unit, modifier: Modifier = Modifier, size: Dp = 112.dp) {
    var ms by remember { mutableIntStateOf(if (reduceMotion) BootTimeline.TOTAL_MS else 0) }
    val sunSpring = remember { Animatable(0f) }
    LaunchedEffect(reduceMotion) {
        if (reduceMotion) { onDone(); return@LaunchedEffect }
        val t0 = withFrameMillis { it }
        while (isActive && ms < BootTimeline.TOTAL_MS) { ms = (withFrameMillis { it } - t0).toInt() }
        onDone()
    }
    val f = BootTimeline.at(ms, reduceMotion)
    LaunchedEffect(f.sun > 0f) { if (f.sun > 0f) sunSpring.animateTo(1f, spring(dampingRatio = 0.62f, stiffness = 380f)) }
    Box(
        modifier.size(size)
            .graphicsLayer { val s = 1f - 0.08f * f.exit; scaleX = s; scaleY = s; alpha = 1f - f.exit }
            .drawWithCache {
                val k = this.size.minDimension / 512f
                val arch = Path().apply { moveTo(80 * k, 384 * k); cubicTo(80 * k, 192 * k, 208 * k, 112 * k, 256 * k, 112 * k); cubicTo(304 * k, 112 * k, 432 * k, 192 * k, 432 * k, 384 * k) }
                val peak = Path().apply { moveTo(144 * k, 384 * k); lineTo(256 * k, 176 * k); lineTo(368 * k, 384 * k) }
                val inner = Path().apply { moveTo(192 * k, 368 * k); lineTo(256 * k, 272 * k); lineTo(320 * k, 368 * k) }
                val archM = PathMeasure().apply { setPath(arch, false) }
                val peakM = PathMeasure().apply { setPath(peak, false) }
                val innerM = PathMeasure().apply { setPath(inner, false) }
                val seat = Offset(256 * k, 240 * k)
                val out = Path()
                fun trim(m: PathMeasure, p: Float): Path { out.reset(); m.getSegment(0f, m.length * p, out, true); return out }
                val round = Stroke(24 * k, cap = StrokeCap.Round, join = StrokeJoin.Round)
                onDrawBehind {
                    if (f.arch > 0f) drawPath(trim(archM, f.arch), Color(0xFFD1D5DB), alpha = 0.9f, style = round)
                    if (f.peak > 0f) drawPath(trim(peakM, f.peak), Color(0xFF14171A), style = round)
                    if (f.inner > 0f) drawPath(trim(innerM, f.inner), Color(0xFF6B7280), alpha = 0.85f * f.inner, style = Stroke(18 * k, cap = StrokeCap.Round, join = StrokeJoin.Round))
                    if (f.sun > 0f) {
                        val along = archM.getPosition(archM.length * 0.5f * BootTimeline.enter(f.sun)) // left foot → crown
                        val c = Offset(along.x + (seat.x - along.x) * f.sun, along.y + (seat.y - along.y) * f.sun)
                        drawCircle(Color(0xFFFF6B35), radius = 28 * k * (0.6f + 0.4f * sunSpring.value), center = c)
                    }
                }
            },
    )
}
```

(The brand colours are literal here *on purpose*, because they are the logo's own geometry, matching `BrandMark.kt`. Add a comment saying so, so a later token sweep doesn't change them.)

- [ ] **Step 2:** Add an `@Preview` at `ms = 450` and at the final frame for the screenshot test. Run `./gradlew :core:designsystem:updateDebugScreenshotTest` (check the exact task name with `./gradlew :core:designsystem:tasks | grep -i screenshot`).
- [ ] **Step 3: Commit** `feat(brand): BootMark animated mark, single Canvas, cached paths`

### Task 3.3: Wire the boot overlay (cold start only) + arc reveal handoff

**Files:** `MainActivity.kt`, `Horizon.kt`, `TodayScreen.kt`

- [ ] **Step 1:** In `DayHorizon`, add the parameter `reveal: Float = 1f`. Draw the past arc to `start + ((now - start) * reveal)` and draw the sun only when `reveal >= 1f` (else at the reveal head, radius `8.dp * reveal`). Ticks fade in with `alpha = reveal`.
- [ ] **Step 2:** In `MainActivity`, add `private val coldStart = savedInstanceState == null && !BootState.shown` (a process-level `object BootState { var shown = false }`). In `setContent`, wrap the content:

```kotlin
            var booting by remember { mutableStateOf(coldStart) }
            Box(Modifier.fillMaxSize()) {
                CompositionLocalProvider(LocalBootDone provides !booting) { /* existing root content */ }
                if (booting) Box(Modifier.fillMaxSize().background(Aiimin.colors.base), contentAlignment = Alignment.Center) {
                    BootMark(reduceMotion = st?.reduceMotion == true, onDone = { BootState.shown = true; booting = false })
                }
            }
```

Define `val LocalBootDone = staticCompositionLocalOf { true }` in `core/designsystem/.../motion/BootTimeline.kt`.

- [ ] **Step 3:** In Today, `val bootDone = LocalBootDone.current`, then `val reveal by animateFloatAsState(if (bootDone) 1f else 0f, tween(600, delayMillis = 0, easing = Motion.enter))` and pass `reveal` into `DayHorizon`. If reduce-motion is on, pass `1f`.
- [ ] **Step 4:** Measure: `adb shell am start -W -S -n in.aiimin.app.v4/aiimin.app.MainActivity` three times (record TotalTime), then `adb shell dumpsys gfxinfo in.aiimin.app.v4 reset`, cold start, and `dumpsys gfxinfo … framestats`. **Expected: 0 janky frames during the first 1.2 s on `AiiminLean`.** If there are janky frames, do Task 3.4 first, then re-measure.
- [ ] **Step 5: Commit** `feat(boot): cold-start brand moment hands off into the day arc`

### Task 3.4: Baseline Profile (fixes the v3-style lag at the root)

- [ ] **Step 1:** Look up the current stable `androidx.benchmark` / `androidx.baselineprofile` version on developer.android.com (Jetpack releases) and add it to `gradle/libs.versions.toml` as `benchmark = "<version>"`, with libraries `androidx-benchmark-macro-junit4`, `androidx-profileinstaller` and plugin `androidx-baselineprofile`.
- [ ] **Step 2:** Create the module with Android Studio's "Baseline Profile Generator" template, or by hand: `baselineprofile/build.gradle.kts` using `com.android.test` + `androidx.baselineprofile`, `targetProjectPath = ":app"`, and a generator test:

```kotlin
@RunWith(AndroidJUnit4::class)
class StartupProfile {
    @get:Rule val rule = BaselineProfileRule()
    @Test fun generate() = rule.collect(packageName = "in.aiimin.app.v4") {
        pressHome(); startActivityAndWait()
        device.waitForIdle()
        listOf("money", "phoneday", "score").forEach { r ->
            device.executeShellCommand("am start -n in.aiimin.app.v4/aiimin.app.MainActivity --es aiimin_go $r"); device.waitForIdle()
        }
    }
}
```

- [ ] **Step 3:** In `app/build.gradle.kts`, add `implementation(libs.androidx.profileinstaller)` and `baselineProfile(project(":baselineprofile"))`. Run `./gradlew :app:generateBaselineProfile` on the `AiiminLean` emulator. Expect `app/src/main/generated/baselineProfiles/baseline-prof.txt`.
- [ ] **Step 4:** Re-measure TotalTime (expect ≥15% lower) and jank (0). **Commit** `perf: baseline profile for cold start and main screens`

**Phase 3 acceptance:** cold start shows the mark drawing itself and the arc growing into Today with 0 janky frames. A warm start (back, then reopen) shows no boot. Reduce motion shows the static result instantly.

---

## Phase 4: Living sky and time-of-day gradients

**Design.** One continuous function of the minute gives the sky tint, the light's position and the arc colours. There are no steps at 12:00 and 17:00 any more. The light is a **soft radial glow on the paper** (α ≤ 0.22, contrast verified in master plan C4: worst case textMuted 5.03:1). It is drawn behind the Today header (clock + arc) only, not behind the whole app, so lists stay paper-white and readable.

| Minute | Phase | Light from | Tint | α | Sun / arc |
|---|---|---|---|---|---|
| 0 (00:00) | Night | top-right (x 0.88, y −0.1) | moon `#8FA6C8` | 0.14 | sun becomes a hollow moon ring `#8FA6C8`, line `#3A3530` |
| 300 (05:00) | Pre-dawn | top-right → right | `#A9B4C2` (cool grey-blue, no purple) | 0.12 | ring |
| 360 (06:00) | Dawn | left (x 0.05, y 0.15) | `#FFB38A` | 0.18 | `#FF9A5C` |
| 480 (08:00) | Morning | top-left (0.12, −0.05) | `#FF9A5C` | 0.22 | `#FF8A4C` |
| 720 (12:00) | Midday | top-centre (0.5, −0.2) | `#FFE2B8` | 0.14 | `#FF6B35` |
| 1020 (17:00) | Golden | top-right (0.8, 0.0) | `#FF8A4C` | 0.20 | `#E8703F` |
| 1110 (18:30) | Dusk | right (0.95, 0.15) | `#E07A5F` | 0.18 | `#D8653E`, line `#3A3530` |
| 1230 (20:30) | Night | top-right (0.88, −0.1) | `#8FA6C8` | 0.14 | moon ring |
| 1440 | (= 0) | | | | |

Colour is interpolated in **linear RGB** between keyframes (sRGB lerp muddies orange→blue into grey-brown). Position is interpolated linearly. Under reduce-motion the sky still follows the time (it is a state, not an animation) but never animates between values. It recomputes once per minute.

### File map
| File | Change |
|---|---|
| `core/designsystem/.../theme/SkyClock.kt` | **Create.** Pure keyframes + interpolation |
| `core/designsystem/.../component/LivingSky.kt` | **Create.** Radial glow layer |
| `core/designsystem/.../theme/Palette.kt` | `Horizons.at` delegates to `SkyClock` (delete the `dark` branch) |
| `core/designsystem/.../component/Horizon.kt` | Moon ring at night |
| `feature/today/.../TodayScreen.kt` | `LivingSky` behind the header |
| `app/src/main/res/values/colors.xml` + `themes.xml` | Splash ground stays paper. The system splash can't be time-aware, so the Compose boot ground uses `SkyClock` |
| Test: `core/designsystem/src/test/kotlin/aiimin/designsystem/theme/SkyClockTest.kt` | |

> This **supersedes next-plan Tasks 1–2** (`SkyPhase` / `LivingSky`). It keeps their contract (pure maths first, drawing layer behind Today, reduce-motion) but adds dawn, golden hour, dusk and night, continuous arc colours and linear-RGB blending. Mark those next-plan tasks "superseded by deep-improvement Phase 4".

### Task 4.1: SkyClock

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.designsystem.theme

import com.google.common.truth.Truth.assertThat
import org.junit.Test
import kotlin.math.abs

class SkyClockTest {
    @Test fun `alpha never exceeds the contrast cap`() { for (m in 0 until 1440) assertThat(SkyClock.at(m).alpha).isAtMost(0.22f) }
    @Test fun `wraps at midnight`() { assertThat(SkyClock.at(0)).isEqualTo(SkyClock.at(1440)) }
    @Test fun `no visible jump between adjacent minutes`() {
        for (m in 0 until 1440) {
            val a = SkyClock.at(m); val b = SkyClock.at(m + 1)
            if (a.alpha > 0.01f && b.alpha > 0.01f) assertThat(abs(a.lightX - b.lightX)).isLessThan(0.02f) // x snaps sides only while the light is invisible
            assertThat(abs(a.alpha - b.alpha)).isLessThan(0.01f)
            assertThat(abs(a.tint.red - b.tint.red)).isLessThan(0.03f)
        }
    }
    @Test fun `morning light comes from the left, evening from the right`() {
        assertThat(SkyClock.at(8 * 60).lightX).isLessThan(0.3f)
        assertThat(SkyClock.at(18 * 60 + 30).lightX).isGreaterThan(0.7f)
    }
    @Test fun `night shows the moon`() { assertThat(SkyClock.at(23 * 60).isNight).isTrue(); assertThat(SkyClock.at(12 * 60).isNight).isFalse() }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.designsystem.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.colorspace.ColorSpaces
import androidx.compose.ui.graphics.lerp as colorLerp

@Immutable
data class Sky(val tint: Color, val alpha: Float, val lightX: Float, val lightY: Float, val horizon: Horizon, val isNight: Boolean)

/** Plan Phase 4: the light of the day as a continuous function of the minute. Pure; no clock reads. */
object SkyClock {
    private data class K(val min: Int, val tint: Long, val alpha: Float, val x: Float, val y: Float, val sun: Long, val line: Long, val night: Boolean)

    private val keys = listOf(
        K(0, 0xFF8FA6C8, 0.14f, 0.88f, -0.10f, 0xFF8FA6C8, 0xFF3A3530, true),
        K(300, 0xFFA9B4C2, 0.12f, 0.92f, 0.05f, 0xFFA9B4C2, 0xFF3A3530, true),
        K(360, 0xFFFFB38A, 0.18f, 0.05f, 0.15f, 0xFFFF9A5C, 0xFF1A1916, false),
        K(480, 0xFFFF9A5C, 0.22f, 0.12f, -0.05f, 0xFFFF8A4C, 0xFF1A1916, false),
        K(720, 0xFFFFE2B8, 0.14f, 0.50f, -0.20f, 0xFFFF6B35, 0xFF1A1916, false),
        K(1020, 0xFFFF8A4C, 0.20f, 0.80f, 0.00f, 0xFFE8703F, 0xFF1A1916, false),
        K(1110, 0xFFE07A5F, 0.18f, 0.95f, 0.15f, 0xFFD8653E, 0xFF3A3530, false),
        K(1230, 0xFF8FA6C8, 0.14f, 0.88f, -0.10f, 0xFF8FA6C8, 0xFF3A3530, true),
        K(1440, 0xFF8FA6C8, 0.14f, 0.88f, -0.10f, 0xFF8FA6C8, 0xFF3A3530, true),
    )

    private fun lin(a: Long, b: Long, t: Float): Color =
        colorLerp(Color(a).convert(ColorSpaces.LinearSrgb), Color(b).convert(ColorSpaces.LinearSrgb), t).convert(ColorSpaces.Srgb)

    fun at(minuteOfDay: Int): Sky {
        val m = Math.floorMod(minuteOfDay, 1440)
        val i = keys.indexOfLast { it.min <= m }.coerceAtMost(keys.size - 2)
        val a = keys[i]; val b = keys[i + 1]
        val t = (m - a.min).toFloat() / (b.min - a.min)
        val s = t * t * (3 - 2 * t) // smoothstep: no kinks at keyframes
        // Light position jumps sides at dawn; fade alpha through zero there so the jump is invisible.
        val sideFlip = a.x > 0.5f != b.x > 0.5f
        val alpha = if (sideFlip) (if (s < 0.5f) a.alpha * (1 - 2 * s) else b.alpha * (2 * s - 1)) else a.alpha + (b.alpha - a.alpha) * s
        val x = if (sideFlip) (if (s < 0.5f) a.x else b.x) else a.x + (b.x - a.x) * s
        val y = a.y + (b.y - a.y) * s
        val dotted = lin(0xFFD9CDBD, 0xFFD0C7BA, s)
        return Sky(lin(a.tint, b.tint, s), alpha, x, y, Horizon(lin(a.sun, b.sun, s), lin(a.line, b.line, s), dotted), if (s < 0.5f) a.night else b.night)
    }
}
```

> The light switches sides (night → dawn) by fading alpha through zero and snapping x at that instant, which is why the jump test skips minutes where alpha < 0.01.

- [ ] **Step 4: PASS. Step 5: Commit** `feat(theme): SkyClock continuous day-night light`

### Task 4.2: LivingSky layer + Horizon delegation + moon

- [ ] **Step 1:** Create `LivingSky.kt`:

```kotlin
@Composable
fun LivingSky(minute: Int, modifier: Modifier = Modifier) {
    val sky = remember(minute) { SkyClock.at(minute) }
    Canvas(modifier) {
        val center = Offset(size.width * sky.lightX, size.height * sky.lightY)
        drawRect(Brush.radialGradient(listOf(sky.tint.copy(alpha = sky.alpha), sky.tint.copy(alpha = 0f)), center = center, radius = size.maxDimension * 0.9f))
    }
}
```

- [ ] **Step 2:** In `Palette.kt`, replace the body of `Horizons.at(hour, dark)` with a new `fun at(minute: Int): Horizon = SkyClock.at(minute).horizon`. Update every caller (`grep -rn "Horizons.at" --include='*.kt' .`) to pass the minute of day. Delete the `dark` parameter.
- [ ] **Step 3:** In `DayHorizon`, add `night: Boolean = false`. When true, draw the sun as a ring: `drawCircle(horizon.sun, 7*dp, c, style = Stroke(2*dp))` plus a small paper-coloured offset disc for a crescent: `drawCircle(base, 6*dp, c + Offset(3*dp, -2*dp))`. Pass `base = Aiimin.colors.base`.
- [ ] **Step 4:** In Today, put the clock + arc header in a `Box`: `LivingSky(nowMinute, Modifier.matchParentSize())` first, then the existing header. `nowMinute` already ticks per minute in `TodayUi`. Verify with `grep -n nowMinute feature/today -r`.
- [ ] **Step 5:** Emulator check at 07:00, 12:00, 18:30, 23:00 (`adb shell cmd alarm set-time` is not permitted on all images; use the debug clock injection route `--es aiimin_clock HH:mm` if it exists, else add a debug-only override in `DayClock` behind `BuildConfig.DEBUG`). Take four screenshots into `screenshots/sky/`.
- [ ] **Step 6: Commit** `feat(today): living sky behind the header; moon at night; continuous arc colour`

### Task 4.3: Boot ground follows the sky

- [ ] In the Phase 3 overlay, replace `background(Aiimin.colors.base)` with `background(Aiimin.colors.base)` + `LivingSky(nowMinute, Modifier.fillMaxSize())`, so the boot overlay and Today's header share the same light and the handoff is seamless. **Commit** `feat(boot): boot ground shares the living sky`

**Phase 4 acceptance:** 4 screenshots show four distinct but quiet moods. All text passes AA (re-run the master plan C4 calculation if any colour changed). No step change at 12:00 or 17:00 while watching for 2 minutes either side with a debug clock.

---

## Phase 5: Connections engine ("the app knows my life")

**Principle:** every connection is (1) computed on the phone, (2) explainable in one sentence ("Why am I seeing this?"), (3) dismissible forever per rule, (4) never more than **one** connection in the Now card at a time (single-card rule), and (5) never invents data.

**Model** (`core/engine/src/main/kotlin/aiimin/core/engine/Connections.kt`, pure):

```kotlin
data class LinkInputs(
    val today: java.time.LocalDate,
    val nowMinute: Int,
    val docsExpiring: List<Pair<String, java.time.LocalDate>>,      // title, expiry
    val billsDue: List<Triple<String, Long, java.time.LocalDate>>, // payee, paise, due
    val lastNightLateScreenMin: Int?, val lastNightSleepMin: Int?,
    val focusBreakingAppsMinToday: Int,
    val spendTodayPaise: Long, val spendDailyMedianPaise: Long,
    val journalMoodToday: Int?,                                     // 1–5 or null
    val openTasksToday: Int, val minimumsLeft: Int,
    val dismissedRules: Set<String>,
)
data class Link(val rule: String, val priority: Int, val title: String, val why: String, val action: LinkAction)
sealed interface LinkAction { data class MakeTask(val title: String, val due: java.time.LocalDate) : LinkAction; data class Open(val route: String) : LinkAction; data object None : LinkAction }
object Connections { fun compute(i: LinkInputs): List<Link> /* sorted by priority desc, dismissed removed */ }
```

**Rules v1** (each a separate private function plus at least 2 unit tests: one fires, one doesn't):

| Rule id | Fires when | Card | Why line | Action |
|---|---|---|---|---|
| `doc.expiry.task` | doc expires in ≤30 days and no task with its title exists | "Passport expires 12 Nov" | "From your vault. Renewals take about 3 weeks." | MakeTask("Renew passport", expiry − 21 d) |
| `bill.due` | bill due in ≤3 days | "Electricity ₹1,240 due Thursday" | "From your recurring bills." | Open(money/bills) |
| `sleep.late.screen` | lastNight late screen ≥45 min **and** sleep < 6 h, shown before 11:00 only | "Late phone, short night" | "45 min on the phone after 23:00, 5h 40m asleep." | Open(phoneday) |
| `focus.breakers` | focus-breaking apps ≥60 min today and an open focus task exists | "Instagram took 1h 10m today" | "You marked it focus-breaking." | Open(focus setup) |
| `spend.mood` | spend today ≥ 2× median **and** mood ≤ 2 (only if both exist) | "A heavy day, in more ways than one" | "Spending was twice your usual on a low-mood day." | Open(money/today) |
| `evening.close` | after 20:30, minimums left > 0 | "Two minimums left" | "Ticking them keeps your streak." | Open(today/minimums) |

**Wiring:** `TodayViewModel` builds `LinkInputs` from the existing repositories. The Now card shows `Connections.compute(...).firstOrNull()` only if no higher-priority Now item exists. Long-press → "Don't show this kind again" adds the rule to `settings.dismissedRules`. Also needed: S9 App detail gets the "Count as focus-breaking" toggle (`settings.focusBreakingApps`, the same pattern as `workApps`), and `UsageTimeline` results are filtered by that set for `focusBreakingAppsMinToday`.

**Acceptance:** 12+ unit tests green. On the emulator with demo data, each rule appears on its trigger and disappears after the action or dismissal. Never two at once.

---

## Phase 6: Make it hard to put down, ethically

Grounded in master plan §8.5 (13 sources on companion psychology and ethics) and PLAN Part 10/12. **Banned:** streak-loss fear notifications, pay-to-repair, loot, fake scarcity, guilt copy.

| # | Mechanic | Why it works | Build |
|---|---|---|---|
| R1 | **First-week ladder** on Today: 5 steps, each one tap (turn on screen time · add one minimum · say one capture · save one document · set one money budget). It disappears after day 7 or when done | Goal-gradient effect; visible progress | `FirstRunCard` (next-plan Task 4) + `SetupChecklist` (PLAN §12.3) |
| R2 | **Firsts**, celebrated once, quietly: first score, first 7-day streak, first month review. One line + a ≤700 ms posture change of the Mark | Peak moments without confetti | PLAN §12.5 |
| R3 | **Morning brief, evening close.** Morning: Now card = plan my day (T2). Evening: the debrief (T3) with one reflection prompt and tomorrow's top three | A daily ritual is the strongest retention loop | T2/T3 exist; add the entry points from Phase 5 `evening.close` |
| R4 | **The Mark** (opt-in companion on the arc) per master plan §11–§15 | Liveness, identity, earned growth | master plan W2.4–W4 |
| R5 | **Home-screen widget** (OD3 → recommend *now*): the arc + next item + minimums left, using Glance 1.1.1 (already in the catalogue) | Being seen without opening the app is the biggest retention lever for daily tools | `app/src/main/kotlin/aiimin/app/widget/DayWidget.kt` |
| R6 | **Weekly review** every Sunday evening: a note built from real data, three lines, one chart | Reflection; makes the data feel worth giving | T17 exists; add notification NT (respect quiet hours) |
| R7 | **Notification hygiene**: max 3/day by default, each tied to a user-set thing; the "why did I get this" line in every notification | Trust stops uninstall | Audit against PLAN Part 7 |
| R8 | **Zero-to-value in 60 s**: onboarding ≤ 2 min, ends on Today with the arc already drawing (Phase 3 handoff) and a pre-filled first minimum suggestion | First session sets retention | O1–O10 audit |

Each row gets its own task file before building. Acceptance numbers (local counters only, no SDK; master plan §23): D1 return ≥ 60%, week-1 ladder completion ≥ 40%, notification-disable rate < 10%.

---

## Phase 7: Transitions and interactions (motion map, finished)

Audit the current state against PLAN §2.15. Each row is one task (pure spec + Compose change + emulator video via `adb shell screenrecord`):

| Moment | Current | Target | Where |
|---|---|---|---|
| Tab switch | crossfade ✅ | + content rises 8 dp; stagger lists on the first visit per session only | `Shell.kt:264` |
| Push/pop | slide ✅ | + previous screen dims to 0.94 alpha; **predictive back** (`PredictiveBackHandler`) scrubs the pop | `Shell.kt:272` |
| Sheet | spring ✅ | drag follows the finger; 0.5 velocity threshold | `Surfaces.kt` AppSheet |
| Item complete | none | check draws 150 ms (PathMeasure trim), strike-through, row collapses 200 ms after 600 ms | `ListRow`, minimums, tasks |
| Delete + Undo | toast only | row height collapses; Undo re-expands in place (`animateItem()` in LazyColumn) | all lists |
| New item | none | slides in at its position + 1.2 s accent wash at α 0.10 | lists |
| Numbers | static | score, money totals, XP tween 400 ms (`animateIntAsState` + tabular figures so width doesn't jitter) | Score, Money hero, XP |
| Price switch | static | digits roll (AnimatedContent per digit, slide up 6 dp) | Plans |
| Document open | push | container transform (SharedTransitionLayout) thumbnail → viewer | Vault V1→V2 |
| Press feedback | varies | every pressable scales to 0.97 in 90 ms, releases with a spring, plus `HapticFeedbackType.TextHandleMove` on toggles when haptics are on | `pressable` modifier |
| Mic listening | ✅ real level | keep; add a 120 ms ease on the level so bars don't flicker | `Voice.kt` |

Rules: animate only `graphicsLayer` properties (alpha, scale, translation) in lists. Never animate `height` inside a LazyColumn except through `animateItem`. Every duration ≤ 400 ms except the boot (900 ms) and the new-item wash (1.2 s, colour only).

---

## Phase 8: Micro-detail pass

Fix every item in §1.6, plus run `polish` and `audit` skills screen by screen with a checklist per screen:
- tap targets ≥ 48 dp · content descriptions on every icon button and chart · numbers in tabular figures · no text clipped at 0.9× and 1.3× text scale and at 360 dp width · no hard-coded colours (`grep -rn "Color(0x" feature/`) · hairlines not boxes (`grep -rn "RoundedCornerShape(1[24].dp)" feature/` → each one justified or flattened) · empty, loading, error, offline states present (PLAN §2.11) · copy follows §14.4 voice (no "Oops", no exclamation marks).

Output: `docs/audit/2026-10-micro-pass.md` with before/after screenshot pairs per screen.

---

## Phase 9: Finish the 🟡 surfaces

One task file each, in this order (value ÷ effort): **T10 Focus finished** → **T13 File to yesterday** → **M6 Filters** → **SE8 Backups** (completes Plus) → **V7 Info + document versions** (completes Plus) → **S5 today-only override** → **T12 Minimum detail** → **V11 Invite** → **A4 Proposal detail** → **SE3/SE5** → **V17 Preview as** → **EK2 QR** → **V14/V15 server-wait** (needs the server; last). For each: spec section in PLAN Part 4, acceptance tests in PLAN Part 17, flip the matching `Feature.shipped` when it ships.

---

## Phase 10: Money cold start ≤ 1.5 s

Follow next-plan Task 5 with `systematic-debugging`: read the existing `AIIMIN_T` timers (`MoneyViewModels.kt:45`) on a cold start, find the slowest stage (suspected: the `series` roll-up over all transactions on the main path, and Vico's first layout). Fixes, in order: (1) cache the month roll-up in a Room table updated on write; (2) show the hero number from that cache first and load the chart after; (3) build the Vico model off the main thread. Acceptance: first number ≤ 1.5 s, chart ≤ 2.5 s, on `AiiminLean` after a cold start, 3 runs.

---

## Phase 11: QA, phone verification, release

1. `./gradlew testDebugUnitTest` → all green; record the count (95 today plus everything this plan adds, ≈ 150).
2. Screenshot tests updated and reviewed.
3. Owner phone (Nothing Phone 2), `adb install -r` only: run the Phase 1 acceptance, voice capture by speaking (still unverified from the last build), plans screen, boot (cold + warm), sky at four times, and one connection rule.
4. Update `docs/COVERAGE.md` and `AIIMIN_PLAN.md` §11.1 build status, and mark next-plan Tasks 1–2 as superseded.
5. Release notes in plain language.

---

## Phase 12: Home-screen widget

**Design (two sizes, same visual language as Today):**
- **Small 2×2, "Arc":** the day arc with the sun or moon at now (from `SkyClock`), the sky tint as background at the same low alpha, and below it "3 of 5 minimums". Tap opens Today.
- **Medium 4×2, "Day":** the arc across the top. Below it, left: "Next · 14:30 Call with CA" (next timed task or event, else "Nothing timed"). Right: minimums "3/5" with five small segments, ink when done. A "+" button at the bottom right opens capture (`aiimin_go capture`). Tap anywhere else opens Today.
- Paper background `#F5F3EE`, ink text, Funnel Display numbers. No gradients beyond the sky tint, no shadows. Rounded corners follow the launcher (`android:widgetFeatures` / system radius on API 31+).
- **Privacy:** no money amounts, no document names, nothing from the vault on the home screen. A "Hide task titles on widget" switch in Appearance swaps titles for "1 task at 14:30".

**Technology:** Glance 1.1.1 is already in `libs.versions.toml` (`androidx-glance-appwidget`). Glance can't draw on a Canvas, so the arc is drawn by a pure function into a `Bitmap` with `android.graphics.Canvas`, using the same maths as `DayHorizon` (`y = 78 − 70·sin(πf)^1.3`), and shown with `Image(ImageProvider(bitmap))`. Bitmap at most 600×180 px to stay under the RemoteViews size limit.

**Updates:** `DayWidgetWorker` (WorkManager, periodic 30 min with a flex window, battery-friendly) moves the sun. An immediate `DayWidget().updateAll(context)` runs after a minimum tick, task done or capture save, called from the repositories' existing write paths through one `WidgetRefresher` interface in `core/data` (implemented in `:app`, so `core` doesn't depend on Glance).

### File map
| File | Change |
|---|---|
| `app/src/main/kotlin/aiimin/app/widget/ArcBitmap.kt` | **Create.** Pure-ish arc renderer (Android Canvas) |
| `core/engine/src/main/kotlin/aiimin/core/engine/WidgetSnapshot.kt` | **Create.** Pure: what the widget shows |
| `app/src/main/kotlin/aiimin/app/widget/DayWidget.kt` | **Create.** Glance UI, two sizes |
| `app/src/main/kotlin/aiimin/app/widget/DayWidgetReceiver.kt` | **Create.** `GlanceAppWidgetReceiver` |
| `app/src/main/kotlin/aiimin/app/widget/DayWidgetWorker.kt` | **Create.** Periodic refresh |
| `app/src/main/res/xml/day_widget_info.xml` | **Create.** Sizes, preview, resize |
| `app/src/main/res/layout/day_widget_preview.xml` | **Create.** Static preview for the picker |
| `app/src/main/AndroidManifest.xml` | Receiver entry |
| `app/build.gradle.kts` | `implementation(libs.androidx.glance.appwidget)` |
| `core/data/.../WidgetRefresher.kt` + Hilt binding in `:app` | Refresh hook |
| Test: `core/engine/src/test/kotlin/aiimin/core/engine/WidgetSnapshotTest.kt` | |

### Task 12.1: WidgetSnapshot (pure)

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.engine

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class WidgetSnapshotTest {
    @Test fun `next item is the first timed item after now`() {
        val s = WidgetSnapshot.of(nowMinute = 600, items = listOf(540 to "Gym", 870 to "Call with CA", 1200 to "Read"), minimumsDone = 3, minimumsTotal = 5, hideTitles = false)
        assertThat(s.nextLine).isEqualTo("Next · 14:30 Call with CA")
        assertThat(s.minimumsLine).isEqualTo("3 of 5 minimums")
    }
    @Test fun `hidden titles keep only the time`() {
        val s = WidgetSnapshot.of(600, listOf(870 to "Call with CA"), 0, 0, hideTitles = true)
        assertThat(s.nextLine).isEqualTo("1 task at 14:30")
        assertThat(s.minimumsLine).isNull()
    }
    @Test fun `nothing left today`() {
        assertThat(WidgetSnapshot.of(1300, listOf(540 to "Gym"), 5, 5, false).nextLine).isEqualTo("Nothing timed")
        assertThat(WidgetSnapshot.of(1300, emptyList(), 5, 5, false).minimumsLine).isEqualTo("All 5 minimums done")
    }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.core.engine

/** What the home-screen widget shows. Pure, no Android types (plan Phase 12). */
data class WidgetSnapshot(val nowMinute: Int, val nextLine: String, val minimumsLine: String?, val done: Int, val total: Int) {
    companion object {
        fun of(nowMinute: Int, items: List<Pair<Int, String>>, minimumsDone: Int, minimumsTotal: Int, hideTitles: Boolean): WidgetSnapshot {
            val next = items.filter { it.first > nowMinute }.minByOrNull { it.first }
            val clock = next?.let { "%02d:%02d".format(it.first / 60, it.first % 60) }
            val line = when {
                next == null -> "Nothing timed"
                hideTitles -> "1 task at $clock"
                else -> "Next · $clock ${next.second}"
            }
            val mins = when {
                minimumsTotal == 0 -> null
                minimumsDone >= minimumsTotal -> "All $minimumsTotal minimums done"
                else -> "$minimumsDone of $minimumsTotal minimums"
            }
            return WidgetSnapshot(nowMinute, line, mins, minimumsDone, minimumsTotal)
        }
    }
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(widget): WidgetSnapshot`

### Task 12.2: Arc bitmap

- [ ] **Step 1:** Create `ArcBitmap.kt`:

```kotlin
package aiimin.app.widget

import aiimin.designsystem.theme.SkyClock
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Path
import androidx.compose.ui.graphics.toArgb
import kotlin.math.PI
import kotlin.math.pow
import kotlin.math.sin

/** Today's arc drawn for RemoteViews, with the same curve as DayHorizon. Max 600×180 px. */
object ArcBitmap {
    fun draw(nowMinute: Int, widthPx: Int, heightPx: Int): Bitmap {
        val w = widthPx.coerceIn(120, 600); val h = heightPx.coerceIn(48, 180)
        val bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
        val c = Canvas(bmp)
        val sky = SkyClock.at(nowMinute)
        val k = h / 96f
        val base = 78 * k
        fun f(min: Int) = ((min - 420f) / 960f).coerceIn(0f, 1f)
        fun x(min: Int) = f(min) * w
        fun y(min: Int) = base - 70 * k * sin(PI * f(min)).pow(1.3).toFloat()
        val now = nowMinute.coerceIn(420, 1380)
        val line = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = sky.horizon.line.toArgb(); style = Paint.Style.STROKE; strokeWidth = 2.2f * k; strokeCap = Paint.Cap.ROUND }
        val path = Path().apply { moveTo(x(420), y(420)); var m = 420; while (m < now) { m = (m + 6).coerceAtMost(now); lineTo(x(m), y(m)) } }
        c.drawPath(path, line)
        val dot = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = sky.horizon.dottedFuture.toArgb() }
        var m = now; while (m < 1380) { c.drawCircle(x(m), y(m), 1.1f * k, dot); m += 12 }
        c.drawLine(0f, base, w.toFloat(), base, line.apply { strokeWidth = 1.5f * k })
        val sun = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = sky.horizon.sun.toArgb(); style = if (sky.isNight) Paint.Style.STROKE else Paint.Style.FILL; strokeWidth = 2 * k }
        c.drawCircle(x(now), y(now), 8 * k, sun)
        return bmp
    }
}
```

(Depends on Phase 4 `SkyClock`. If Phase 12 runs before Phase 4, use `Horizons.at(hour, false)` and change it to `SkyClock` when Phase 4 lands.)

- [ ] **Step 2:** Add a debug-only `@Preview`-free check: an instrumented test `ArcBitmapTest` in `app/src/androidTest` asserting the pixel at the sun's position is non-transparent at 12:00. Run `./gradlew :app:connectedDebugAndroidTest --tests '*ArcBitmapTest*'` on `AiiminLean`.
- [ ] **Step 3: Commit** `feat(widget): arc bitmap renderer`

### Task 12.3: Glance widget, receiver, manifest, worker

- [ ] **Step 1:** `app/build.gradle.kts`: `implementation(libs.androidx.glance.appwidget)`.
- [ ] **Step 2:** `DayWidget.kt`: `class DayWidget : GlanceAppWidget()` with `override val sizeMode = SizeMode.Responsive(setOf(DpSize(110.dp, 110.dp), DpSize(250.dp, 110.dp)))`. `provideGlance` reads through a Hilt `EntryPoint` (`@EntryPoint @InstallIn(SingletonComponent::class) interface WidgetEntry { fun today(): TodayRepository; fun settings(): SettingsStore; fun clock(): DayClock }`). Find the actual repository names with `grep -n "class .*Repository" core/data -r | grep -i "plan\|life\|task"`. It builds `WidgetSnapshot.of(...)`, then `provideContent { Content(snapshot, ArcBitmap.draw(...)) }`. Layout per the design above with `Column`/`Row`/`Text`/`Image`. Clicks: `actionStartActivity<MainActivity>(actionParametersOf(goKey to "today"))` and `"capture"`, where `goKey = ActionParameters.Key<String>("aiimin_go")`. Make sure `MainActivity.handle` reads the extra (it already handles `aiimin_go`).
- [ ] **Step 3:** `DayWidgetReceiver : GlanceAppWidgetReceiver() { override val glanceAppWidget = DayWidget() }`. Manifest:

```xml
<receiver android:name=".widget.DayWidgetReceiver" android:exported="true" android:label="AIIMIN day">
    <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE" /></intent-filter>
    <meta-data android:name="android.appwidget.provider" android:resource="@xml/day_widget_info" />
</receiver>
```

`res/xml/day_widget_info.xml`:

```xml
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="110dp" android:minHeight="110dp"
    android:targetCellWidth="4" android:targetCellHeight="2"
    android:resizeMode="horizontal|vertical"
    android:updatePeriodMillis="0"
    android:initialLayout="@layout/glance_default_loading_layout"
    android:previewLayout="@layout/day_widget_preview"
    android:description="@string/widget_day_description"
    android:widgetCategory="home_screen" />
```

Add `<string name="widget_day_description">Your day arc, next item and minimums</string>`.

- [ ] **Step 4:** `DayWidgetWorker` (`CoroutineWorker`): `DayWidget().updateAll(applicationContext)`. Enqueue it from `AiiminApplication.onCreate` with `PeriodicWorkRequestBuilder<DayWidgetWorker>(30, TimeUnit.MINUTES).build()` via `enqueueUniquePeriodicWork("day_widget", KEEP, …)`.
- [ ] **Step 5:** `WidgetRefresher` interface in `core/data` (`fun refresh()`) with an `:app` implementation calling `DayWidget().updateAll` on `appScope`. Call it from minimum tick, task complete and capture save. Find those with `grep -rn "fun tick\|fun complete\|fun save" core/data/src/main/kotlin/aiimin/core/data/plan core/data/src/main/kotlin/aiimin/core/data/ai`.
- [ ] **Step 6:** Add a "Hide task titles on widget" switch in Appearance (`settings.widgetHideTitles`).
- [ ] **Step 7: Verify on the emulator:** long-press home › Widgets › AIIMIN › add both sizes. Tick a minimum in the app → the widget updates within 2 s. Tap "+" → capture opens. Check `adb shell dumpsys batterystats` shows no wakeups beyond the 30-minute worker.
- [ ] **Step 8: Commit** `feat(widget): home-screen day widget in two sizes`

**Phase 12 acceptance:** both sizes render on the emulator and the owner's phone. Updates follow app actions within 2 s. Nothing financial or from the vault ever appears. With titles hidden, only times show.

---

## Phase 13: Publish the APK on the live waitlist page

**Facts checked 14 Oct:**
- The live page is `https://aiimin.in/app`, served from `frontend/src/pages/AndroidApp.jsx` (route in `frontend/src/App.js:291`).
- It links `/aiimin-v2-debug.apk`, a 46 MB file committed at `frontend/public/aiimin-v2-debug.apk`, and its copy says "v2.0.4", "~44.2 MB", "Android 15 (API 35)" in about 12 places.
- Vercel project `aiimin` builds `frontend/build` from the repo, and `main` is production.
- The v4 release build is minified with R8 but signed with the **debug key** (`app/app/build.gradle.kts:52`), appId `in.aiimin.app.v4`, version `4.0.0-alpha01`, targetSdk 37, minSdk 26.

**Decisions inside this phase:**
- **Sign with the release key.** `app/aiimin-release.keystore` exists and is ignored. The signing passwords are read from `~/.gradle/gradle.properties` (never the repo). A debug-signed APK can never be updated by a later release-signed one without uninstalling, so start right.
- **Host the file on GitHub Releases, not in git.** Every APK committed to `frontend/public` adds 50 MB to repo history forever. Instead, create a GitHub Release (public repo, so the download needs no login) and point the page at `https://github.com/Addy48/AIIMIN/releases/latest/download/aiimin.apk`. That URL always gives the newest release, so the page never needs editing per version. Remove the old 46 MB file from `frontend/public` (it stays in history; no history rewrite).
- **Keep the v4 app id** `in.aiimin.app` without the `.v4` suffix for the public release build, so it installs as the real app. **Check first:** if the owner's phone has v3 installed under `in.aiimin.app`, a differently signed v4 under the same id won't install over it. The page must then say "Uninstall the old AIIMIN app first" (the owner's v3 data isn't migrated; v4 is a fresh start). If unsure, keep `.v4` for this beta release. **Default chosen: keep `.v4` for the first public beta** (it installs beside v3, with zero risk to anyone's existing data), and drop the suffix at Play launch.

### Task 13.1: Release signing

- [ ] **Step 1:** Add to `~/.gradle/gradle.properties` (owner types the values; the agent never sees or prints them): `AIIMIN_STORE_PASSWORD=…`, `AIIMIN_KEY_ALIAS=…`, `AIIMIN_KEY_PASSWORD=…`. **The owner does this by hand.**
- [ ] **Step 2:** In `app/app/build.gradle.kts`:

```kotlin
    signingConfigs {
        create("release") {
            storeFile = rootProject.file("aiimin-release.keystore")
            storePassword = providers.gradleProperty("AIIMIN_STORE_PASSWORD").orNull
            keyAlias = providers.gradleProperty("AIIMIN_KEY_ALIAS").orNull
            keyPassword = providers.gradleProperty("AIIMIN_KEY_PASSWORD").orNull
        }
    }
```

In `buildTypes.release`: `signingConfig = if (providers.gradleProperty("AIIMIN_STORE_PASSWORD").isPresent) signingConfigs.getByName("release") else signingConfigs.getByName("debug")`.

- [ ] **Step 3:** Bump `versionCode = 5`, `versionName = "4.0.0-beta01"`.
- [ ] **Step 4:** `./gradlew -p app :app:assembleRelease` → `app/app/build/outputs/apk/release/app-release.apk`. Check: `$ANDROID_HOME/build-tools/*/apksigner verify --print-certs app-release.apk | head -3` shows the release certificate, **not** "Android Debug". Record size and SHA-256 (`shasum -a 256`).
- [ ] **Step 5:** Smoke test: `adb -s emulator-5554 install -r app-release.apk`, open it, go through onboarding, Today, Money, Phone day, Plans (switch to Pro and back), and the widget. R8 can strip reflection-based code (Hilt, kotlinx-serialization, Room), so any crash here means adding a `proguard-rules.pro` keep rule.
- [ ] **Step 6: Commit** `build: release signing from gradle properties; 4.0.0-beta01`

### Task 13.2: GitHub Release

- [ ] **Step 1:** `cp app/app/build/outputs/apk/release/app-release.apk /tmp/aiimin.apk`, then:

```bash
gh release create v4.0.0-beta01 /tmp/aiimin.apk --repo Addy48/AIIMIN --target feat/native-v4 --title "AIIMIN 4.0 beta 1" --notes-file app/docs/release/4.0.0-beta01.md
```

(Without `--prerelease`, so `releases/latest` resolves to it.) Write `app/docs/release/4.0.0-beta01.md` first: what's new in plain words (screen time that matches Android, voice inside the app, plans free during beta, and the widget if Phase 12 is done), SHA-256, size, "Android 8.0 or newer", "installs beside the older AIIMIN app".

- [ ] **Step 2:** `curl -sIL https://github.com/Addy48/AIIMIN/releases/latest/download/aiimin.apk | grep -i "^content-length\|^HTTP"` → expect a final `HTTP/2 200` and a length equal to the file size.

### Task 13.3: Update the waitlist page

**Files:** `frontend/src/pages/AndroidApp.jsx`, `frontend/public/aiimin-v2-debug.apk` (delete), `frontend/src/components/waitlist/landing/waitlistLandingData.js`, `frontend/src/components/mobile/MobileLiteAccount.jsx`, `frontend/src/pages/Settings.jsx` (all four reference `.apk`, per grep)

- [ ] **Step 1:** At the top of `AndroidApp.jsx`, add one source of truth and replace every hard-coded version, size, URL and API level with it:

```jsx
const APK = {
  url: 'https://github.com/Addy48/AIIMIN/releases/latest/download/aiimin.apk',
  file: 'aiimin.apk',
  version: '4.0 beta 1',
  sizeMb: 0, // fill from Task 13.1 Step 4, e.g. 38.6
  minAndroid: 'Android 8.0',
  sha256: '', // fill from Task 13.1 Step 4
};
const ADB_COMMAND = `adb install -r ${APK.file}`;
```

Then `grep -n "v2.0.4\|aiimin-v2-debug\|44.2\|~44\|API 35" frontend/src/pages/AndroidApp.jsx` and replace each hit with `{APK.version}`, `{APK.url}`, `{APK.sizeMb} MB`, `{APK.minAndroid}`. **Expected after: grep returns nothing.** Remove the `download=` attribute (cross-origin downloads ignore it; GitHub sends the right filename).
- [ ] **Step 2: Copy honesty fixes** on the same page: remove "cryptographically verified", "zero-day security patches" and "secure release mirror", which the build doesn't support. Replace with: "Signed by AIIMIN. Check the SHA-256 below against the release page." Show `APK.sha256` in a monospace line with a copy button. Add the plain line: "Plans are free during the beta. No payment is taken."
- [ ] **Step 3:** Update the other three files' `.apk` links to `APK.url`. Move `APK` to `frontend/src/config/apk.js` and import it in all four.
- [ ] **Step 4:** `git rm frontend/public/aiimin-v2-debug.apk`.
- [ ] **Step 5:** `cd frontend && npm test -- --watchAll=false MobileLiteAccount` (that test references the APK) and `npm run build` → success. `npx serve -s build` and open `/app` locally in the built-in browser: click download → GitHub serves `aiimin.apk`.
- [ ] **Step 6: Commit** `feat(web): waitlist app page serves the v4 beta APK from GitHub Releases`

### Task 13.4: Go live (needs the owner's explicit yes at this step)

- [ ] **Step 1:** Push `feat/native-v4`. Vercel builds a **preview** deployment for the branch. Get its URL with `gh pr checks` or from the Vercel dashboard, and test `/app` there on a real phone: download, install, open.
- [ ] **Step 2:** Merge to `main` (production): mark the draft PR ready and run `gh pr merge --merge`, **only after the owner confirms in chat**. Vercel deploys `aiimin.in`.
- [ ] **Step 3:** Verify live: `curl -s https://www.aiimin.in/app | grep -c "4.0 beta 1"` ≥ 1, and the download link resolves to a 200 from GitHub.
- [ ] **Step 4:** Later releases just repeat Task 13.1 Steps 3–5 + 13.2 with a new tag, and update `APK.version`/`sizeMb`/`sha256` (one file, one commit).

**Phase 13 acceptance:** a stranger on aiimin.in/app taps download on an Android phone, gets the v4 beta APK signed with the release key, installs it beside any older AIIMIN, and the page shows the right version, size and checksum.

---

## Phase 14: Notification engine (phone pop-ups + in-app), personal to each user

**What exists today (read in the code, 14 Oct):** `core/data/.../notify/NotificationRepository.kt` (186 lines). One `run()` function holds every rule. It's called by `MaintenanceWorker` every 30 minutes (`AiiminApplication.kt:56`) and when the app opens (`Shell.kt:157`). Stored in `NotificationEntity` (Room), shown in the in-app list (G2). There are 3 channels and quiet hours (22:00–07:00 default).

**What's wrong with it:**

| # | Problem | Evidence | Effect |
|---|---|---|---|
| NF1 | **Event reminders get missed.** The rule looks 15 minutes ahead, but the worker runs every 30 minutes. | `run()` "Events starting within 15 minutes" + 30-min worker | About half of "meeting in 10 minutes" alerts never arrive, or arrive late. |
| NF2 | **No daily cap.** Plan Part 7 says at most 4 system pop-ups a day; nothing counts them. | `emit()` | Busy days spam the owner. |
| NF3 | **Lock screen shows everything.** No `setVisibility(VISIBILITY_PRIVATE)` or `publicVersion`, so amounts and document names appear on the lock screen. | `post()` | Privacy breach against Part 7. |
| NF4 | **No buttons.** No "Done", "Snooze", "Mark paid". | `post()` | Every action needs opening the app. |
| NF5 | **Generic icon** `android.R.drawable.stat_notify_more`, no accent colour. | `post()` | Looks like spam, not AIIMIN. |
| NF6 | **Same text every time**, no personal timing, no learning. | all rules | Feels robotic; people turn notifications off. |
| NF7 | **3 coarse channels.** People can't turn off "money" without losing "reminders". | `ensureChannels` | All-or-nothing; uninstall risk. |
| NF8 | **Rules are untestable.** They live inside the repository and read DAOs and the clock directly. | `run()` | No unit tests for any notification today. |

### 14.1 How it works (design)

```
 data layer (once per run)          pure engine (core:engine, unit-tested)             delivery
 ┌───────────────────────┐   ┌────────────────────────────────────────────────┐   ┌──────────────────────┐
 │ NotifySnapshotBuilder │──▶│ Rules (Day, Money, Vault, Phone, Score, System) │   │ SystemPoster          │
 │ reads DAOs, settings, │   │      → List<Candidate>                          │──▶│  pop-up + buttons,    │
 │ clock, history        │   │ Copy   → picks a fresh, personal line per rule  │   │  private lock screen  │
 └───────────────────────┘   │ Personalizer → best minute, interest per rule   │   │ InAppInbox (G2)       │
                             │ Policy → POST_NOW / SCHEDULE(at) / IN_APP /      │   │ InAppBanner (open app)│
                             │          DIGEST / DROP, with caps & quiet hours  │   │ ExactAlarms (events,  │
                             └────────────────────────────────────────────────┘   │  reminders, focus)    │
                                                                                  └──────────────────────┘
```

- **Personal for every user, with no server and no tracking.** The phone learns from its own history: when the person usually opens each kind of notification, which ones they ignore, and when they first pick up the phone in the morning. That history lives in Room on the phone. Nothing is sent anywhere, so it works the same for every user from day one, and gets more personal over about 2 weeks.
- **Four outcomes per candidate:** pop up now · schedule an exact time · in-app only (inbox + Today card) · fold into the evening digest · drop.
- **Hard rules the engine can never break** (each one has a test): reminders the person set themselves are never capped or delayed. Emergency and security alerts ignore quiet hours and caps. At most 4 other pop-ups a day (the owner can set 2–6). No guilt copy. Nothing financial or from the vault on the lock screen unless the person turns that on.
- **Wit where it's safe:** low-stakes notifications (minimums, steps, focus done, weekly review, firsts) may be playful. Money due, security, emergency, sync and legal notices are always plain.

### 14.2 Channels (people can switch each one off in Android settings)

| Channel id | Name shown in Android | Importance | Holds |
|---|---|---|---|
| `aiimin_reminders` | Your reminders | HIGH | Task and event reminders, focus done (self-set, uncapped) |
| `aiimin_day` | Your day | DEFAULT | Morning brief, minimums, plan my day, steps nudge, wind-down |
| `aiimin_money` | Money | DEFAULT | Bills, budget pace, payments to review |
| `aiimin_vault` | Documents & family | HIGH | Expiry, backup, documents received |
| `aiimin_insights` | Insights | LOW | Weekly review, score ready, firsts, patterns |
| `aiimin_security` | Account & security | HIGH | New web link, emergency request, sync broken |
| `aiimin_focus` | Focus timer | LOW | The running session (already exists as `aiimin_focus`) |
| `aiimin_digest` | Evening summary | LOW | One grouped summary of everything folded |

The old ids `aiimin_important` and `aiimin_general` are deleted on upgrade with `nm.deleteNotificationChannel(...)`.

### 14.3 The catalogue (what people actually receive)

Each rule has 2–4 variants. The engine rotates them so the same words don't repeat on consecutive days. `{name}` is the first name, used in at most one notification a day. Titles ≤ 48 characters, bodies ≤ 110. "Pop-up" = system notification; "In-app" = inbox + Today card only.

**Day**

| Rule | When (default → personal) | Delivery | Variants (title / body) | Buttons |
|---|---|---|---|---|
| `day.brief` (opt-in, on by default after day 3) | 08:00 → median first unlock + 5 min (last 7 days, 06:00–11:00) | Pop-up | "Morning, {name}. Here's the shape of today" / "2 tasks, a call at 14:30, 4 minimums." · "Today in one breath" / "Call at 14:30. Everything else is yours." · "Light day ahead" / "Nothing timed. Four minimums, whenever suits." | Plan my day |
| `day.minimums` (NT5) | 20:00 → 90 min before median "last minimum ticked" time | Pop-up | "2 minimums left. Both fit before dinner" / "Tiny versions count." · "Still time for the small stuff" / "Read: 1 page. Walk: 5 minutes. That's it." · "One left. You know the one" / "Ticking it keeps your 12-day run going." | Done one · Open |
| `day.task.late` | 30 min after a timed task's time | In-app only (pop-up only if the person set a reminder) | "Still on for today?" / "{task}. Move it, or do it now." | Tomorrow · Done |
| `day.plan` (NT16, opt-in) | person's time | Pop-up | "Pick today's three" / "Takes a minute. The arc does the rest." | Plan |
| `day.capture.followup` | the date/time a capture mentioned | Pop-up (it is a self-set reminder) | "You said: 'call mom Sunday'" / "It's Sunday." · "Past you left a note" / "'{capture}'. Today's the day." | Done · Snooze 1h |
| `day.steps` (only if steps is an active intention) | 18:00 → 2 h before median sleep start, if under 70% of target | Pop-up | "{steps} steps so far" / "A 15-minute walk gets you to {target}." · "Legs report: underused" / "{gap} steps to go. One errand on foot does it." | Open |
| `day.winddown` (opt-in) | 15 min after the late hour, only if more than 30 min of screen time since then | Pop-up | "It's {time}. The phone will still be here tomorrow" / "{late} on screen since {lateHour}:00. Sleep counts toward Body." · "Night shift for your thumbs?" / "{late} after {lateHour}:00. Maybe one last thing, then bed." | Open |
| `day.event` (NT6) | exactly N minutes before (default 10), via exact alarm | Pop-up | "{event} in 10 minutes" / "At {time}{ · location}." | Join (if link) · Snooze 5m |
| `day.focus.done` (NT7) | planned end, via exact alarm | Pop-up | "45 minutes. {label} is a little more real" / "Finish to keep the minutes." · "Time. Nice work on {label}" / "Finish, or add 5 minutes." | Finish · +5 min |

**Money** (always plain, never witty about amounts)

| Rule | When | Delivery | Title / body | Buttons |
|---|---|---|---|---|
| `money.bill` (NT2) | 1 day before, at 10:00 → median money-screen open time | Pop-up | "Rent ₹18,000 is due tomorrow" / "Same as last month." | Mark paid · Open |
| `money.review` (NT3) | in the evening digest | Digest + in-app | "4 payments to review" / "About 20 seconds. Nothing is booked until you say so." | Review |
| `money.budget` (NT4) | at 80% and 100% of the month plan | Pop-up at 80%, in-app at 100% | "Food is at 80% of its plan" / "₹1,200 left for 11 days, about ₹109 a day." | Open |
| `money.source.quiet` (NT15) | no alerts from a bank for 7 days | Digest | "No HDFC alerts for 7 days" / "Is notification access still on?" | Check |
| `money.month.start` | 1st of the month, 09:00 | In-app | "New month, clean page" / "August closed at ₹31,200 spent. September plan is ready." | Open |

**Documents & family**

| Rule | When | Delivery | Title / body | Buttons |
|---|---|---|---|---|
| `vault.expiry` (NT1) | 90/30/7/0 days | 30, 7 and 0 days as pop-up; 90 in-app | "Passport expires in 30 days" / "Renewals take about 3 weeks. Today's a good day to start." · On the day: "Car insurance (Dad) expires today" / "Renew, then add the new copy." | Make a task · Snooze 1 week |
| `vault.backup` (NT23) | 14 and 30 days | Pop-up at 30, in-app at 14 | "Back up your vault" / "Last backup 15 days ago. Phones get lost; papers shouldn't." | Back up now |
| `vault.received` (NT12) | on arrival | Pop-up | "Dad sent 'Property tax 2026'" / "It's on this phone now." | Open |

**Insights and firsts** (playful allowed)

| Rule | When | Delivery | Title / body |
|---|---|---|---|
| `score.ready` (NT9) | first score appears | Pop-up | "Your first Life Score just landed" / "Built from 9 days of you. Tap to see why." |
| `score.weekly` (NT8) | Sunday → the person's most-opened weekend hour, 16:00–20:00 | Pop-up | "Your week, folded into one screen" / "5 minutes to close it and set up the next." · "Week 42: the highlights reel" / "Best day: Thursday. Want to know why?" |
| `first.streak7` | first 7-day run | In-app + one pop-up | "7 days in a row. Quietly impressive" / "No confetti. Just a nod." |
| `first.month` | 30 days of use | In-app | "A month of you, measured" / "Your first monthly view is ready." |
| `battery.low` (NT17) | battery state LOW, once per episode | Pop-up | "Rough patch. Start small" / "Today the tiny versions count double." |

**Account, plans, security** (always plain)

| Rule | When | Delivery | Title / body |
|---|---|---|---|
| `sec.link` (NT13) | new browser linked | Pop-up, ignores quiet hours | "aiimin.in linked on Chrome · Windows" / "Not you? Remove it now." (button: Remove) |
| `sec.emergency` (NT10) | request arrives | Pop-up, critical, ignores quiet hours and caps | "Arjun asked for emergency access" / "Medical and ID documents. Opens in 72 hours unless you decide." (Approve · Deny) |
| `sync.broken` (NT14) | sync failing over 10 min | In-app; pop-up after 24 h | "Changes aren't syncing" / "Sign in again to fix it." |
| `plan.beta` | after a beta plan switch, once | In-app | "You're on Pro, free during the beta" / "We'll tell you 14 days before paid plans start." |
| `plan.billing.notice` | D-P4: billing starts in 14 days | Pop-up + in-app | "Paid plans start on 1 Dec" / "Your Pro stays free until then. Nothing is charged unless you subscribe." |

**Never sent** (a test fails if any rule's copy contains these): "streak is about to end", "you'll lose", "don't lose", "we miss you", "last chance", "hurry", score drops, battery losses, comparisons with other people, and exclamation marks.

**Evening digest** (`digest`, default 21:00 → 30 min before median quiet-hours start): one grouped notification using `InboxStyle`, with title "Today, wrapped up" and up to 5 lines, e.g. "4 payments to review", "Your week is ready", "No HDFC alerts for 7 days". The body counts whatever was folded during the day. If nothing was folded, nothing is sent.

### 14.4 Personalisation rules (exact)

| Signal (all local) | Used for | Rule |
|---|---|---|
| Open/ignore history per rule (`NotifyLogEntity`: rule, shownAt, openedAt?, dismissedAt?, action?) | Interest | Interest = EWMA of opened (1) / ignored (0), α = 0.3, starting at 0.6. Below 0.2 after ≥ 3 shows: the rule drops to in-app only for 14 days, then gets one retry. "Fewer like this" sets it to 0 for 30 days. |
| Opened-at minutes per rule (last 30 days) | Timing | If ≥ 5 opens: target minute = median opened minute, clamped to the rule's window. Else the default. |
| First unlock time (`DeviceDayEntity.firstUnlockAt`, last 7 days) | Morning brief | Median + 5 minutes, clamped 06:00–11:00. Skip the day if the phone hasn't been unlocked by 11:00. |
| Sleep start (Health Connect) or quiet-hours start | Wind-down, steps, digest | Steps nudge ≤ 2 h before; digest 30 min before. |
| Active intentions (S5) | Relevance | Steps nudge only if steps is an intention; wind-down only if a screen limit exists. |
| Dismiss rate over 14 days | Volume | If > 60%, the daily cap drops by 1 (minimum 2) for the next 14 days, and the inbox says so: "We've sent fewer notifications because you dismissed most of them. Change it in Settings." |
| Plan / day mode | Day anchors | Logical-day users' "evening" is relative to their day end. |

### 14.5 File map

| File | Responsibility |
|---|---|
| `core/engine/src/main/kotlin/aiimin/core/engine/notify/Candidate.kt` | **Create.** Model: `Candidate`, `Kind`, `NotifyAction`, `Delivery` |
| `core/engine/.../notify/NotifyPolicy.kt` | **Create.** Decides delivery: caps, quiet hours, uncapped kinds |
| `core/engine/.../notify/Personalizer.kt` | **Create.** Interest EWMA, best minute, adaptive cap |
| `core/engine/.../notify/NotifyCopy.kt` | **Create.** Variants, rotation, `{name}` once a day, banned-words guard |
| `core/engine/.../notify/rules/DayRules.kt`, `MoneyRules.kt`, `VaultRules.kt`, `InsightRules.kt`, `SystemRules.kt` | **Create.** Snapshot → candidates |
| `core/engine/.../notify/NotifySnapshot.kt` | **Create.** Plain data the rules read |
| `core/data/.../notify/NotifySnapshotBuilder.kt` | **Create.** Fills the snapshot from DAOs and settings |
| `core/data/.../notify/NotificationRepository.kt` | **Rewrite** `run()` as build → rules → copy → policy → deliver; keep `all`, `unread`, `markAllRead`, `dismiss` |
| `core/data/.../notify/SystemPoster.kt` | **Create.** Channels, private lock screen, buttons, icon, digest group |
| `core/data/.../notify/ExactAlarms.kt` | **Create.** AlarmManager for events, reminders, focus |
| `app/src/main/kotlin/aiimin/app/notify/NotifyActionReceiver.kt` | **Create.** Done / Snooze / Mark paid / Finish without opening the app |
| `app/src/main/kotlin/aiimin/app/notify/AlarmReceiver.kt` | **Create.** Fires exact alarms |
| `core/database/.../Entities.kt`, `Daos.kt`, `AppDatabase.kt` | `NotifyLogEntity` + DAO; `NotificationEntity` gets `rule`, `kind`, `why` columns (AutoMigration) |
| `core/data/.../settings/SettingsStore.kt` | `notifyCap` (4), `digestMin` (21:00), `smartTiming` (true), `lockDetails` (false), `ruleMutes` (set), `briefOn`, `winddownOn` |
| `feature/me/.../SettingsScreens.kt` | SE5 Notifications page |
| `feature/me/.../InfoScreens.kt` or wherever G2 lives (`grep -rn "Route.Notifications" feature`) | Inbox redesign + "Why am I seeing this" + "Fewer like this" |
| `core/designsystem/.../component/InAppBanner.kt` | **Create.** Top banner while the app is open |
| `app/src/main/res/drawable/ic_stat_aiimin.xml` | **Create.** Monochrome arc + sun status-bar icon (24 dp, white on transparent) |
| `app/src/main/AndroidManifest.xml` | Receivers + `SCHEDULE_EXACT_ALARM` |
| Tests: `core/engine/src/test/kotlin/aiimin/core/engine/notify/*Test.kt` | Policy, Personalizer, Copy, each rule file |

### Task 14.1: Candidate model and NotifyPolicy

**Files:** Create `Candidate.kt`, `NotifyPolicy.kt`; Test `NotifyPolicyTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.engine.notify

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class NotifyPolicyTest {
    private fun c(rule: String, kind: Kind = Kind.NUDGE, at: Int = 600, priority: Int = 1) =
        Candidate(rule = rule, key = "$rule:1", kind = kind, atMinute = at, priority = priority, title = "t", body = "b", route = "today")
    private val ctx = PolicyContext(nowMinute = 600, quietFrom = 22 * 60, quietTo = 7 * 60, cap = 4, shownToday = 0, mutedRules = emptySet(), interest = emptyMap())

    @Test fun `self-set reminders ignore the cap`() {
        val d = NotifyPolicy.decide(listOf(c("day.event", Kind.REMINDER)), ctx.copy(shownToday = 9))
        assertThat(d.single().delivery).isEqualTo(Delivery.POST_NOW)
    }
    @Test fun `nudges stop at the cap and fold into the digest`() {
        val d = NotifyPolicy.decide(listOf(c("day.minimums")), ctx.copy(shownToday = 4))
        assertThat(d.single().delivery).isEqualTo(Delivery.DIGEST)
    }
    @Test fun `quiet hours hold nudges until morning but not emergencies`() {
        val night = ctx.copy(nowMinute = 23 * 60)
        val d = NotifyPolicy.decide(listOf(c("day.minimums"), c("sec.emergency", Kind.CRITICAL, at = 23 * 60)), night)
        assertThat(d.first { it.candidate.rule == "day.minimums" }.delivery).isEqualTo(Delivery.IN_APP)
        assertThat(d.first { it.candidate.rule == "sec.emergency" }.delivery).isEqualTo(Delivery.POST_NOW)
    }
    @Test fun `future candidates are scheduled at their minute`() {
        val d = NotifyPolicy.decide(listOf(c("day.event", Kind.REMINDER, at = 640)), ctx)
        assertThat(d.single().delivery).isEqualTo(Delivery.SCHEDULE); assertThat(d.single().atMinute).isEqualTo(640)
    }
    @Test fun `muted rules and low interest go in-app only`() {
        val d = NotifyPolicy.decide(listOf(c("day.steps"), c("day.brief")), ctx.copy(mutedRules = setOf("day.steps"), interest = mapOf("day.brief" to 0.1)))
        assertThat(d.map { it.delivery }).containsExactly(Delivery.IN_APP, Delivery.IN_APP)
    }
    @Test fun `highest priority wins the last slot`() {
        val d = NotifyPolicy.decide(listOf(c("day.steps", priority = 1), c("vault.expiry", priority = 2)), ctx.copy(shownToday = 3))
        assertThat(d.first { it.candidate.rule == "vault.expiry" }.delivery).isEqualTo(Delivery.POST_NOW)
        assertThat(d.first { it.candidate.rule == "day.steps" }.delivery).isEqualTo(Delivery.DIGEST)
    }
    @Test fun `in-app-only candidates never pop up`() {
        assertThat(NotifyPolicy.decide(listOf(c("money.month.start", Kind.INFO)), ctx).single().delivery).isEqualTo(Delivery.IN_APP)
    }
}
```

- [ ] **Step 2: Run, expect FAIL.** `./gradlew :core:engine:testDebugUnitTest --tests '*NotifyPolicyTest*'`
- [ ] **Step 3: Implement**

`Candidate.kt`:

```kotlin
package aiimin.core.engine.notify

/** REMINDER: set by the person (never capped). CRITICAL: emergency/security (ignores quiet + cap). NUDGE: capped. INFO: in-app only. DIGEST_ONLY: evening summary. */
enum class Kind { REMINDER, CRITICAL, NUDGE, INFO, DIGEST_ONLY }

enum class Delivery { POST_NOW, SCHEDULE, IN_APP, DIGEST, DROP }

data class NotifyAction(val id: String, val label: String)

data class Candidate(
    val rule: String,
    /** Dedupe key; the same key is never delivered twice. */
    val key: String,
    val kind: Kind,
    /** Minute of the logical day it should appear (≤ now = due). */
    val atMinute: Int,
    /** 0 low · 1 normal · 2 high · 3 critical. */
    val priority: Int,
    val title: String,
    val body: String,
    val route: String,
    val routeArg: String? = null,
    val actions: List<NotifyAction> = emptyList(),
    /** One plain sentence for "Why am I seeing this?". */
    val why: String = "",
    /** True if the text names money, documents or people: hidden on the lock screen. */
    val sensitive: Boolean = false,
)

data class Decision(val candidate: Candidate, val delivery: Delivery, val atMinute: Int = candidate.atMinute)
```

`NotifyPolicy.kt`:

```kotlin
package aiimin.core.engine.notify

data class PolicyContext(
    val nowMinute: Int,
    val quietFrom: Int, val quietTo: Int,
    val cap: Int,
    val shownToday: Int,
    val mutedRules: Set<String>,
    /** Personalizer interest 0–1 per rule; missing = neutral. */
    val interest: Map<String, Double>,
)

/** Plan Phase 14.1. Pure; every hard rule here has a test in NotifyPolicyTest. */
object NotifyPolicy {
    const val LOW_INTEREST = 0.2

    fun quiet(min: Int, from: Int, to: Int): Boolean = if (from <= to) min in from until to else min >= from || min < to

    fun decide(cands: List<Candidate>, ctx: PolicyContext): List<Decision> {
        var slots = (ctx.cap - ctx.shownToday).coerceAtLeast(0)
        return cands.sortedByDescending { it.priority }.map { c ->
            when {
                c.kind == Kind.CRITICAL -> Decision(c, Delivery.POST_NOW)
                c.kind == Kind.REMINDER -> if (c.atMinute > ctx.nowMinute) Decision(c, Delivery.SCHEDULE) else Decision(c, Delivery.POST_NOW)
                c.kind == Kind.INFO -> Decision(c, Delivery.IN_APP)
                c.kind == Kind.DIGEST_ONLY -> Decision(c, Delivery.DIGEST)
                c.rule in ctx.mutedRules || (ctx.interest[c.rule] ?: 1.0) < LOW_INTEREST -> Decision(c, Delivery.IN_APP)
                c.atMinute > ctx.nowMinute -> Decision(c, Delivery.SCHEDULE)
                quiet(ctx.nowMinute, ctx.quietFrom, ctx.quietTo) -> Decision(c, Delivery.IN_APP)
                slots > 0 -> { slots--; Decision(c, Delivery.POST_NOW) }
                else -> Decision(c, Delivery.DIGEST)
            }
        }
    }
}
```

> A scheduled NUDGE is re-checked by `decide` when its alarm fires (the cap and quiet hours may have changed), so `SCHEDULE` never bypasses the cap.

- [ ] **Step 4: PASS. Step 5: Commit** `feat(notify): candidate model and delivery policy with caps and quiet hours`

### Task 14.2: Personalizer

**Files:** Create `Personalizer.kt`; Test `PersonalizerTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.engine.notify

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class PersonalizerTest {
    private fun shown(rule: String, opened: Int?, day: Int = 0) = Shown(rule, day, opened)

    @Test fun `interest starts neutral and falls when ignored`() {
        assertThat(Personalizer.interest(emptyList())).isEqualTo(0.6)
        val ignored = List(5) { shown("day.steps", null, it) }
        assertThat(Personalizer.interest(ignored)).isLessThan(Personalizer.DEMOTE)
    }
    @Test fun `best minute is the median open time once there are five opens`() {
        val opens = listOf(480, 490, 500, 510, 900).mapIndexed { i, m -> shown("day.brief", m, i) }
        assertThat(Personalizer.bestMinute(opens, default = 480, window = 360..660)).isEqualTo(500)
    }
    @Test fun `too few opens keeps the default and the window clamps`() {
        assertThat(Personalizer.bestMinute(listOf(shown("x", 700)), 480, 360..660)).isEqualTo(480)
        val late = List(5) { shown("x", 800, it) }
        assertThat(Personalizer.bestMinute(late, 480, 360..660)).isEqualTo(660)
    }
    @Test fun `morning brief follows first unlock`() {
        assertThat(Personalizer.briefMinute(listOf(410, 420, 430, 425, 415))).isEqualTo(425)
        assertThat(Personalizer.briefMinute(emptyList())).isEqualTo(480)
    }
    @Test fun `cap drops by one when most notifications are dismissed`() {
        assertThat(Personalizer.cap(base = 4, dismissRate14d = 0.7)).isEqualTo(3)
        assertThat(Personalizer.cap(base = 2, dismissRate14d = 0.9)).isEqualTo(2)
        assertThat(Personalizer.cap(base = 4, dismissRate14d = 0.3)).isEqualTo(4)
    }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.core.engine.notify

/** One delivered pop-up: which rule, which day index, and the minute it was opened (null = ignored). */
data class Shown(val rule: String, val day: Int, val openedMinute: Int?)

/** Plan Phase 14.4. Learns from this phone's own history only. */
object Personalizer {
    const val START = 0.6
    const val ALPHA = 0.3
    const val DEMOTE = 0.2

    fun interest(history: List<Shown>): Double =
        history.sortedBy { it.day }.fold(START) { acc, s -> acc + ALPHA * ((if (s.openedMinute != null) 1.0 else 0.0) - acc) }

    fun bestMinute(history: List<Shown>, default: Int, window: IntRange): Int {
        val opens = history.mapNotNull { it.openedMinute }.sorted()
        if (opens.size < 5) return default.coerceIn(window)
        return opens[opens.size / 2].coerceIn(window)
    }

    fun briefMinute(firstUnlocks: List<Int>): Int {
        if (firstUnlocks.isEmpty()) return 480
        val s = firstUnlocks.sorted()
        return (s[s.size / 2] + 5).coerceIn(360, 660)
    }

    fun cap(base: Int, dismissRate14d: Double): Int = if (dismissRate14d > 0.6) (base - 1).coerceAtLeast(2) else base
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(notify): on-device personaliser for timing, interest and volume`

### Task 14.3: NotifyCopy (fresh, kind, never guilt)

**Files:** Create `NotifyCopy.kt`; Test `NotifyCopyTest.kt`

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.engine.notify

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class NotifyCopyTest {
    @Test fun `no variant in the catalogue breaks the voice rules`() {
        NotifyCopy.catalogue.forEach { (rule, variants) ->
            variants.forEach { v ->
                val text = (v.title + " " + v.body).lowercase()
                NotifyCopy.banned.forEach { b -> assertThat(text).doesNotContain(b) }
                assertThat(v.title).doesNotContain("!"); assertThat(v.body).doesNotContain("!")
                assertThat(v.title.length).isAtMost(48)
                assertThat(v.body.length).isAtMost(110)
            }
            assertThat(variants).isNotEmpty()
        }
    }
    @Test fun `variants rotate so consecutive days differ`() {
        val a = NotifyCopy.pick("day.minimums", dayIndex = 10, vars = mapOf("n" to "2"))
        val b = NotifyCopy.pick("day.minimums", dayIndex = 11, vars = mapOf("n" to "2"))
        assertThat(a).isNotEqualTo(b)
    }
    @Test fun `placeholders fill and the name is dropped when not allowed`() {
        val v = NotifyCopy.pick("day.brief", 0, mapOf("name" to "Aaditya", "summary" to "2 tasks"), useName = false)
        assertThat(v.title).doesNotContain("{"); assertThat(v.title).doesNotContain("Aaditya")
    }
    @Test fun `plain rules have exactly one sober variant`() {
        NotifyCopy.plainRules.forEach { assertThat(NotifyCopy.catalogue.getValue(it)).hasSize(1) }
    }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement** (the full catalogue from §14.3; shown here with the playful and plain patterns. The engineer copies every row of §14.3 into `catalogue` in the same shape.)

```kotlin
package aiimin.core.engine.notify

data class Copy(val title: String, val body: String)

/** Plan Phase 14.3. Voice: warm, brief, a little wry on low-stakes things, never guilt. */
object NotifyCopy {
    val banned = listOf("streak is about to end", "you'll lose", "you will lose", "don't lose", "we miss you", "last chance", "hurry", "dropped", "worse than")

    /** Money, security, emergency, sync and plan notices: one plain variant, no wit. */
    val plainRules = setOf("money.bill", "money.review", "money.budget", "sec.link", "sec.emergency", "sync.broken", "plan.billing.notice")

    val catalogue: Map<String, List<Copy>> = mapOf(
        "day.brief" to listOf(
            Copy("Morning, {name}. Here's the shape of today", "{summary}"),
            Copy("Today in one breath", "{summary}"),
            Copy("Your day, at a glance", "{summary} Plan it in a minute."),
        ),
        "day.minimums" to listOf(
            Copy("{n} minimums left. They fit before dinner", "Tiny versions count."),
            Copy("Still time for the small stuff", "{list}"),
            Copy("A few small things left", "Each one keeps your {streak}-day run going."),
        ),
        "day.steps" to listOf(
            Copy("{steps} steps so far", "A 15-minute walk gets you to {target}."),
            Copy("Legs report: underused", "{gap} steps to go. One errand on foot does it."),
        ),
        "day.winddown" to listOf(
            Copy("It's {time}. The phone will keep till morning", "{late} on screen since {lateHour}:00. Sleep counts toward Body."),
            Copy("Night shift for your thumbs?", "{late} after {lateHour}:00. One last thing, then bed."),
        ),
        "day.focus.done" to listOf(
            Copy("{min} minutes. {label} is a little more real", "Finish to keep the minutes."),
            Copy("Time. Nice work on {label}", "Finish, or add 5 minutes."),
        ),
        "day.capture.followup" to listOf(
            Copy("You said: '{capture}'", "{when}"),
            Copy("Past you left a note", "'{capture}'. Today's the day."),
        ),
        "vault.expiry" to listOf(Copy("{doc} expires {inDays}", "Renewals take about 3 weeks. Today's a good day to start."), Copy("{doc}: {inDays}", "Start the renewal now and add the new copy when it comes.")),
        "vault.backup" to listOf(Copy("Back up your vault", "Last backup {days} days ago. Phones get lost; papers shouldn't."), Copy("Your documents have one home", "Last backup {days} days ago. Give them a second one.")),
        "score.weekly" to listOf(Copy("Your week, folded into one screen", "5 minutes to close it and set up the next."), Copy("Week {week}: the highlights", "Best day: {bestDay}. Want to know why?")),
        "score.ready" to listOf(Copy("Your first Life Score just landed", "Built from {days} days of you. Tap to see why.")),
        "first.streak7" to listOf(Copy("7 days in a row. Quietly impressive", "No confetti. Just a nod.")),
        "battery.low" to listOf(Copy("Rough patch. Start small", "Today the tiny versions count double.")),
        "money.bill" to listOf(Copy("{bill} {amount} is due tomorrow", "Mark it paid when it's done.")),
        "money.review" to listOf(Copy("{n} payments to review", "About 20 seconds. Nothing is booked until you say so.")),
        "money.budget" to listOf(Copy("{category} is at {pct}% of its plan", "{left} left for {days} days, about {perDay} a day.")),
        "sec.link" to listOf(Copy("aiimin.in linked on {device}", "Not you? Remove it now.")),
        "sec.emergency" to listOf(Copy("{person} asked for emergency access", "{docs}. Opens in {hours} hours unless you decide.")),
        "sync.broken" to listOf(Copy("Changes aren't syncing", "Sign in again to fix it.")),
        "plan.billing.notice" to listOf(Copy("Paid plans start on {date}", "Your {plan} stays free until then. Nothing is charged unless you subscribe.")),
        // …every other rule in §14.3, same shape.
    )

    /** Rotates by day so the same words don't repeat; `{name}` is removed unless [useName]. */
    fun pick(rule: String, dayIndex: Int, vars: Map<String, String>, useName: Boolean = true): Copy {
        val list = catalogue.getValue(rule)
        val v = list[Math.floorMod(dayIndex + rule.hashCode(), list.size)]
        fun fill(s: String): String {
            var out = if (useName && vars["name"] != null) s else s.replace(", {name}", "").replace("{name}, ", "").replace("{name}", "")
            vars.forEach { (k, value) -> out = out.replace("{$k}", value) }
            return out.trim()
        }
        return Copy(fill(v.title), fill(v.body))
    }
}
```

> The `// …every other rule in §14.3` line is the engineer's copying instruction, not missing design: every remaining row's text is fixed in §14.3. The first test fails if any copied line breaks the voice rules.

- [ ] **Step 4: PASS. Step 5: Commit** `feat(notify): copy catalogue with rotation and voice guard`

### Task 14.4: Rules as pure functions (move the old `run()` logic out)

**Files:** Create `NotifySnapshot.kt` and the 5 rule files; Test one test file per rule file

`NotifySnapshot` (plain data, built in `core/data`):

```kotlin
package aiimin.core.engine.notify

import java.time.LocalDate

data class NotifySnapshot(
    val today: LocalDate, val nowMinute: Int, val dayIndex: Int, val firstName: String?,
    val docs: List<DocExpiry>, val lastBackupDaysAgo: Int?, val docCount: Int,
    val bills: List<BillDue>, val pendingPayments: Int,
    val budget: BudgetPace?,
    val events: List<EventSoon>, val lateTasks: List<String>, val captureFollowUps: List<Pair<String, Int>>,
    val minimumsLeft: Int, val minimumsLeftNames: List<String>, val streak: Int, val paused: Boolean,
    val batteryLow: Boolean,
    val steps: Int?, val stepsTarget: Int?, val stepsIsIntention: Boolean,
    val lateScreenMin: Int?, val lateHour: Int, val screenLimitSet: Boolean,
    val isSundayEvening: Boolean, val week: Int, val firstScoreJustReady: Boolean, val scoreDays: Int,
    val firstUnlocks7d: List<Int>,
    val briefOn: Boolean, val winddownOn: Boolean,
)
data class DocExpiry(val id: String, val title: String, val daysLeft: Long)
data class BillDue(val id: String, val title: String, val amountText: String, val dueInDays: Long)
data class BudgetPace(val category: String, val pct: Int, val leftText: String, val daysLeft: Int, val perDayText: String)
data class EventSoon(val id: String, val title: String, val startMinute: Int, val leadMin: Int)
```

Each rule file exposes `fun candidates(s: NotifySnapshot, best: (rule: String, default: Int, window: IntRange) -> Int): List<Candidate>`. Example, `DayRules.kt`:

```kotlin
package aiimin.core.engine.notify.rules

import aiimin.core.engine.notify.*

object DayRules {
    fun candidates(s: NotifySnapshot, best: (String, Int, IntRange) -> Int): List<Candidate> = buildList {
        s.events.forEach { e ->
            val c = NotifyCopy.pick("day.event", s.dayIndex, mapOf("event" to e.title, "lead" to "${e.leadMin}"))
            add(Candidate("day.event", "event:${e.id}", Kind.REMINDER, e.startMinute - e.leadMin, 2, c.title, c.body, "today", e.id,
                listOf(NotifyAction("snooze5", "Snooze 5m")), why = "You have this event in your calendar."))
        }
        if (s.minimumsLeft > 0 && !s.paused) {
            val at = best("day.minimums", 20 * 60, (18 * 60)..(22 * 60))
            val c = NotifyCopy.pick("day.minimums", s.dayIndex, mapOf("n" to "${s.minimumsLeft}", "list" to s.minimumsLeftNames.take(2).joinToString(". ") + ".", "streak" to "${s.streak}"))
            add(Candidate("day.minimums", "min:${s.today}", Kind.NUDGE, at, 2, c.title, c.body, "today", null,
                listOf(NotifyAction("done_one", "Done one"), NotifyAction("open", "Open")), why = "You set daily minimums and some are open."))
        }
        if (s.briefOn) {
            val at = Personalizer.briefMinute(s.firstUnlocks7d)
            val c = NotifyCopy.pick("day.brief", s.dayIndex, mapOf("name" to (s.firstName ?: ""), "summary" to "${s.minimumsLeft} minimums today."), useName = s.firstName != null)
            add(Candidate("day.brief", "brief:${s.today}", Kind.NUDGE, at, 1, c.title, c.body, "today", why = "Your morning brief, timed to when you usually pick up your phone."))
        }
        val target = s.stepsTarget
        if (s.stepsIsIntention && s.steps != null && target != null && s.steps < target * 0.7) {
            val c = NotifyCopy.pick("day.steps", s.dayIndex, mapOf("steps" to "%,d".format(s.steps), "target" to "%,d".format(target), "gap" to "%,d".format(target - s.steps)))
            add(Candidate("day.steps", "steps:${s.today}", Kind.NUDGE, best("day.steps", 18 * 60, (16 * 60)..(21 * 60)), 1, c.title, c.body, "body", why = "Steps is one of your intentions."))
        }
        if (s.winddownOn && s.screenLimitSet && (s.lateScreenMin ?: 0) >= 30) {
            val c = NotifyCopy.pick("day.winddown", s.dayIndex, mapOf("time" to "%02d:%02d".format(s.nowMinute / 60, s.nowMinute % 60), "late" to "${s.lateScreenMin}m", "lateHour" to "${s.lateHour}"))
            add(Candidate("day.winddown", "wind:${s.today}", Kind.NUDGE, s.nowMinute, 1, c.title, c.body, "phoneday", why = "You turned on wind-down nudges."))
        }
        s.captureFollowUps.forEach { (text, minute) ->
            val c = NotifyCopy.pick("day.capture.followup", s.dayIndex, mapOf("capture" to text.take(40), "when" to "It's time."))
            add(Candidate("day.capture.followup", "cap:${text.hashCode()}:${s.today}", Kind.REMINDER, minute, 2, c.title, c.body, "today", actions = listOf(NotifyAction("done", "Done"), NotifyAction("snooze60", "Snooze 1h")), why = "You asked AIIMIN to remind you."))
        }
    }
}
```

Tests per rule file follow this pattern (write ≥ 2 per rule: fires / doesn't fire):

```kotlin
class DayRulesTest {
    private val none: (String, Int, IntRange) -> Int = { _, d, _ -> d }
    private fun snap(minLeft: Int = 0, paused: Boolean = false, steps: Int? = null, intention: Boolean = false) = NotifySnapshot(
        today = java.time.LocalDate.of(2026, 10, 14), nowMinute = 600, dayIndex = 1, firstName = null,
        docs = emptyList(), lastBackupDaysAgo = null, docCount = 0, bills = emptyList(), pendingPayments = 0, budget = null,
        events = emptyList(), lateTasks = emptyList(), captureFollowUps = emptyList(),
        minimumsLeft = minLeft, minimumsLeftNames = listOf("Read", "Walk"), streak = 5, paused = paused, batteryLow = false,
        steps = steps, stepsTarget = 8000, stepsIsIntention = intention, lateScreenMin = null, lateHour = 23, screenLimitSet = false,
        isSundayEvening = false, week = 42, firstScoreJustReady = false, scoreDays = 0, firstUnlocks7d = emptyList(), briefOn = false, winddownOn = false,
    )
    @Test fun `minimums fire only when some are left and not paused`() {
        assertThat(DayRules.candidates(snap(minLeft = 2), none).map { it.rule }).contains("day.minimums")
        assertThat(DayRules.candidates(snap(minLeft = 2, paused = true), none).map { it.rule }).doesNotContain("day.minimums")
    }
    @Test fun `steps nudge needs the intention`() {
        assertThat(DayRules.candidates(snap(steps = 2000, intention = false), none).map { it.rule }).doesNotContain("day.steps")
        assertThat(DayRules.candidates(snap(steps = 2000, intention = true), none).map { it.rule }).contains("day.steps")
    }
}
```

`MoneyRules`, `VaultRules`, `InsightRules` and `SystemRules` port the existing `run()` logic one rule at a time, using the exact triggers in §14.3 (vault 90/30/7/0, backup 14/30 days, bill tomorrow and not AutoPay, budget 80/100, review count, Sunday weekly, battery low, first score, first 7-day run). Mark money amounts and document names `sensitive = true`.

- [ ] Steps: per rule file, failing tests → implement → pass → commit (`feat(notify): day rules`, `money rules`, …).

### Task 14.5: SystemPoster (private lock screen, buttons, icon, digest)

**Files:** Create `SystemPoster.kt`, `app/src/main/res/drawable/ic_stat_aiimin.xml`

- [ ] **Step 1:** Status-bar icon (white on transparent; Android tints it):

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
    <path android:strokeColor="#FFFFFFFF" android:strokeWidth="2" android:strokeLineCap="round" android:fillColor="#00000000" android:pathData="M3,18 C3,9 9,5 12,5 C15,5 21,9 21,18" />
    <path android:fillColor="#FFFFFFFF" android:pathData="M12,11.5 m-2.5,0 a2.5,2.5 0,1 1,5 0 a2.5,2.5 0,1 1,-5 0" />
</vector>
```

- [ ] **Step 2:** `SystemPoster.post(c: Candidate, lockDetails: Boolean)`:

```kotlin
    fun post(c: Candidate, id: String, lockDetails: Boolean) {
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return
        val channel = channelFor(c.rule)
        val open = PendingIntent.getActivity(context, c.key.hashCode(), launchIntent(c.route, c.routeArg, id), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val b = NotificationCompat.Builder(context, channel)
            .setSmallIcon(R.drawable.ic_stat_aiimin)
            .setColor(0xFFFF6B35.toInt())
            .setContentTitle(c.title).setContentText(c.body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(c.body))
            .setContentIntent(open).setAutoCancel(true)
            .setDeleteIntent(actionIntent(id, c, "dismissed"))
            .setCategory(if (c.kind == Kind.REMINDER) NotificationCompat.CATEGORY_REMINDER else NotificationCompat.CATEGORY_RECOMMENDATION)
            .setVisibility(if (c.sensitive && !lockDetails) NotificationCompat.VISIBILITY_PRIVATE else NotificationCompat.VISIBILITY_PUBLIC)
        if (c.sensitive && !lockDetails) {
            b.setPublicVersion(NotificationCompat.Builder(context, channel).setSmallIcon(R.drawable.ic_stat_aiimin).setColor(0xFFFF6B35.toInt())
                .setContentTitle("AIIMIN").setContentText("1 reminder").build())
        }
        c.actions.take(2).forEach { a -> b.addAction(0, a.label, actionIntent(id, c, a.id)) }
        runCatching { NotificationManagerCompat.from(context).notify(c.key.hashCode(), b.build()) }
    }
```

`channelFor(rule)` maps the prefix: `day.event|day.focus|day.capture` → reminders; `day.*` → day; `money.*` → money; `vault.*` → vault; `score.*|first.*|battery.*` → insights; `sec.*|sync.*|plan.*` → security. `actionIntent` builds a `PendingIntent.getBroadcast` to `NotifyActionReceiver` with extras `id`, `rule`, `key`, `action`, `arg`. `ensureChannels` creates the 8 channels from §14.2 and deletes `aiimin_important` and `aiimin_general`. Since `SystemPoster` is in `core/data` and the icon in `:app`, pass the icon resource id in through a Hilt-provided `@Named("notifyIcon") Int`.

- [ ] **Step 3:** Digest: `postDigest(lines: List<String>)` uses `InboxStyle` with title "Today, wrapped up", `setGroup("aiimin_digest")`, `setGroupSummary(true)`, channel `aiimin_digest`. Up to 5 lines plus "+N more" as summary text.
- [ ] **Step 4:** Emulator check: a sensitive notification on the lock screen shows only "AIIMIN · 1 reminder". Long-press a notification shows the per-channel switch with the new names. **Commit** `feat(notify): system poster with private lock screen, buttons, AIIMIN icon, digest`

### Task 14.6: Exact alarms for events, reminders, focus (fixes NF1)

**Files:** Create `ExactAlarms.kt`, `app/.../notify/AlarmReceiver.kt`; Modify manifest

- [ ] **Step 1:** Manifest: `<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />`, `<receiver android:name=".notify.AlarmReceiver" android:exported="false" />` and `<receiver android:name=".notify.NotifyActionReceiver" android:exported="false" />`. Also handle `ACTION_BOOT_COMPLETED` (add `RECEIVE_BOOT_COMPLETED`) to re-arm alarms after restart.
- [ ] **Step 2:** `ExactAlarms.schedule(key: String, atEpochMs: Long)`:

```kotlin
    fun schedule(key: String, atEpochMs: Long) {
        val am = context.getSystemService(AlarmManager::class.java)
        val pi = PendingIntent.getBroadcast(context, key.hashCode(), Intent(context, alarmReceiver).putExtra("key", key), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, atEpochMs, pi)
        else am.setWindow(AlarmManager.RTC_WAKEUP, atEpochMs - 60_000, 2 * 60_000, pi) // within ±1 min without the permission
    }
    fun cancel(key: String) { /* same PendingIntent with FLAG_NO_CREATE → am.cancel(it) */ }
```

Store scheduled keys in a small Room table `ScheduledNotifyEntity(key, atMs, payloadJson)` so `AlarmReceiver` can rebuild the candidate, re-run `NotifyPolicy.decide` for NUDGE kinds, and post.

- [ ] **Step 3:** When an event or task is created, edited or deleted, the repository calls `notifications.reschedule()`, which re-runs the rules for the next 24 h and syncs alarms (cancel removed keys, schedule new ones).
- [ ] **Step 4: Test (instrumented, emulator):** create an event 12 minutes ahead with a 10-minute lead, lock the screen, and confirm the notification arrives within ±1 minute of the target (`adb logcat -s AIIMIN_N`). **Commit** `fix(notify): exact alarms so event and focus reminders always arrive on time`

### Task 14.7: Action buttons without opening the app

**Files:** Create `app/.../notify/NotifyActionReceiver.kt`

- [ ] **Step 1:** `onReceive` uses `goAsync()` + an app-scope coroutine, an `EntryPoint` to repositories, and handles: `done` / `done_one` (marks the task or the next open minimum done and logs the event with source "notification"), `snooze5` / `snooze60` / `snooze1w` (`ExactAlarms.schedule` at now + n), `mark_paid` (bill paid), `finish` / `plus5` (focus), `remove` (unlink browser, then open SE2 to confirm), `dismissed` (writes `NotifyLogEntity.dismissedAt`). After the action, it cancels the notification and calls `WidgetRefresher.refresh()` (Phase 12).
- [ ] **Step 2:** Every open (`MainActivity.handle` with extra `aiimin.notify.id`) writes `openedAt` and `openedMinute` to `NotifyLogEntity`. That is the personaliser's only input.
- [ ] **Step 3:** Emulator: tap "Done one" on the minimums notification → the Today count drops by one without opening the app. **Commit** `feat(notify): act on notifications without opening the app`

### Task 14.8: In-app inbox and live banner

**Files:** G2 screen (find with `grep -rn "Route.Notifications" feature app`), Create `core/designsystem/.../component/InAppBanner.kt`

- [ ] **Inbox (G2):** grouped "Today" / "Earlier this week" / "Older". Each row: icon by channel, title, body, time ("14:30", "Yesterday"), unread dot. Swipe left to dismiss with Undo. Long-press opens a sheet with "Why am I seeing this?" (shows `why`), "Fewer like this" (adds to `ruleMutes` for 30 days, with an Undo toast) and "Notification settings". Empty state: "Nothing new. AIIMIN only speaks up when something is worth it." The top-bar bell shows the unread count when > 0.
- [ ] **Live banner:** while the app is in the foreground, `POST_NOW` decisions show as an `InAppBanner` instead of a system pop-up: it slides down from the top in 220 ms (`Motion.enter`), stays 4 s, swipes up to dismiss, and taps to open the route. At most one at a time; a second one queues. Reduce motion: fade only. The system notification is posted only if the app is in the background. Use `ProcessLifecycleOwner` to know.
- [ ] **Today integration:** `IN_APP` decisions of priority ≥ 1 feed the Phase 5 Now card through the same `Candidate` type (Connections become a 6th rule file, `ConnectionRules`), so there is exactly one engine deciding what speaks up.
- [ ] **Commit** `feat(notify): grouped inbox with why/fewer-like-this, live in-app banner`

### Task 14.9: Settings (SE5 Notifications)

- [ ] One page, flat sections:
  - **How many:** "Up to 4 a day" stepper 2–6, with the caption "Your own reminders and safety alerts are never limited."
  - **When:** quiet hours from/to · evening summary time · "Smart timing: learn when I usually open things" switch (default on).
  - **What:** one switch per channel group (mirrors the Android channels, with a deep link "Open in Android settings") · morning brief · wind-down nudges (off by default) · steps nudge.
  - **Lock screen:** "Show details on lock screen" (off by default).
  - **Muted:** the list of "Fewer like this" rules with Unmute.
  - **Test:** "Send a test notification" posts one `day.brief` sample now.
- [ ] **Commit** `feat(settings): notifications page with cap, timing, channels, lock-screen privacy`

### Task 14.10: Migrate and delete the old engine

- [ ] Rewrite `NotificationRepository.run()` as: `val snap = builder.build(); val cands = rules.flatMap { it(snap, best) }; val decisions = NotifyPolicy.decide(cands, ctx); deliver(decisions)`, where `deliver` inserts into `NotificationEntity` (dedupe by key, as now), then posts, schedules, or folds into the digest buffer. The digest is posted by the maintenance worker run nearest `digestMin`. Remove the old per-rule code.
- [ ] Run the whole suite: `./gradlew testDebugUnitTest` → green; count the new notify tests (expect ≥ 35).
- [ ] **Commit** `refactor(notify): repository delegates to the pure engine; old rules removed`

**Phase 14 acceptance (emulator, then the owner's phone for 3 days):**
1. An event with a 10-minute lead pops up within ±1 minute, with the screen off.
2. No more than 4 nudges on any day; extras appear in the evening summary.
3. The lock screen shows "AIIMIN · 1 reminder" for a bill, never the amount (unless the setting is on).
4. "Done one" on the minimums pop-up works without opening the app, and the widget updates.
5. After 5 mornings of opening the brief at about 07:10, it arrives at about 07:10 instead of 08:00.
6. "Fewer like this" on the steps nudge moves it to the inbox only.
7. Each of the 8 channels can be switched off in Android settings, and the others keep working.
8. `NotifyCopyTest` passes: no banned words, no exclamation marks, no over-length lines.

---

## Design critique (live v4 build on the emulator, 14 Oct 23:56; screenshots in `app/screenshots/critique-2026-10-14/`)

**Overall impression:** the bones are right: big confident clock, calm paper palette, honest copy. But three things make it feel unfinished: screens open slowly into grey placeholder boxes, the arc (the app's signature) disappears at night, and boxed cards everywhere fight the "instrument" look.

### Usability
| Finding (verified in screenshot) | Severity | Fix | Where in plan |
|---|---|---|---|
| **Cold start into any screen shows the splash logo or grey placeholder boxes for 5+ seconds** (`money.png`, `plans.png`, `score.png` still on the splash at 5 s; `phoneday.png`, `notifications.png` still grey boxes) | 🔴 Critical | Baseline Profile, DB warm-up off the main thread, cached first frame per screen, the central engine serving a ready snapshot | Tasks 3.4, 10, 15.3 |
| **Today arc not drawn after 23:00.** The header is a huge empty band with a flat line (`today.png`) | 🔴 Critical | Night arc: full solid arc + moon at the right foot; arc window follows the person's day, not fixed 07:00–23:00 | Task 17.3 |
| "Calibrating" still shown, though the repo says "Score in N days" (the installed build is older than the repo) | 🟡 Moderate | Rebuild + verify the stat line | Phase 0 / 13 |
| Cloud-with-slash icon in the top bar has no label or explanation | 🟡 Moderate | Replace it with the sync-state dot (§2.9) and a long-press tooltip "Not syncing: sign in"; hide it when sync is off by choice | Phase 8 |
| Orange badge "8" on the bell and black "6" on Money compete with the date for attention | 🟢 Minor | Badges: ink dot under 10 unread, number only on the inbox screen; accent reserved for the one action | Phase 8 |
| Assistant: four outlined boxes as suggestions, half the screen empty, no character | 🟡 Moderate | Raahi greets with a time-aware line and 3 suggestion chips from the person's real data; empty space becomes Raahi's corner | Phase 18 |

### Visual hierarchy
- **What draws the eye first:** the clock (correct), then the black "Debrief" button (correct), then the orange badge (wrong: it's noise).
- **Reading flow:** clock → empty band (broken at night) → card → stat line → card. Two boxed cards in a row read like an ad feed.
- **Emphasis:** "WRAP UP THE DAY" and "MEASURE YOUR DAY" use the same orange eyebrow, so two things claim to be most important.

### Consistency
| Element | Issue | Fix |
|---|---|---|
| Cards | `RoundedCornerShape(14.dp)` + border boxes on Today, Plans, StoreNote, PhoneDataCard; the spec says hairlines | Flatten to sections with a top hairline, keep **one** raised surface per screen (the Now card) |
| Eyebrows | Orange caps used for two competing sections | Orange eyebrow only on the Now card; others in `textMuted` |
| Dock | The centre "+" is a heavy black square, the only square on screen | Same size, 18 dp radius, ink, with a 1 dp inner highlight; presses scale to 0.96 with a spring |
| Skeletons | Full-width grey boxes don't match the layout they stand in for | Skeletons shaped like the real content (clock line, arc, rows), with a shimmer at 1.2 s per cycle, only after 300 ms (no flash on fast loads) |

### Accessibility
- **Contrast:** ink on paper is 13.7:1 ✅; muted caption ≈ 5:1 ✅; orange `#C24E20` eyebrow on paper ≈ 4.9:1 ✅; orange `#FF6B35` badge text on white is below 3:1 ❌ (move to an ink dot).
- **Touch targets:** dock items ✅ (~56 dp); top-bar icons ✅ 48 dp.
- **Readability:** the body at 16 sp with 1.45 line height is good. The 68 sp clock overflows below 360 dp width (Task 8).

### What works well
- The clock + greeting is distinctive and calm. Keep it.
- The copy is human and honest ("Close the day kindly", "They're read on this phone and never leave it").
- One clear primary button per card; secondary actions read as secondary.

### Priority design fixes (all added as tasks below)
1. **Speed of first paint** (Tasks 3.4, 10, 15.3): nothing else matters if the screen is grey for 5 s.
2. **The arc at every hour** (Task 17.3), plus the living sky behind it (Phases 4, 17).
3. **Flatten boxes, one raised Now card, one orange per screen** (Phase 8 checklist items D1–D8 below).
4. **Raahi in the assistant, widget, empty states and notifications** (Phase 18).

**Phase 8 design checklist additions:** D1 flatten boxed cards (list above) · D2 one orange per screen · D3 ink badges · D4 sync dot replaces the cloud icon · D5 content-shaped skeletons with a 300 ms delay · D6 dock "+" refinement · D7 night arc · D8 clock size steps 68/56/48 sp by width.

---

## Phase 15: Central engine "Pulse" (everything stays in sync, nothing goes stale)

**Problem (verified):** work is scattered. `MaintenanceWorker` runs every 30 min (`AiiminApplication.kt:56`), `SyncWorker` every 30 min (`TrashAndWork.kt:137`), Today refreshes device data in its ViewModel (`TodayViewModel.kt:110`), Phone day on a button, and notifications inside maintenance. Each screen builds its own state, so Today, Phone day, the widget and notifications can each show a different number. If a worker is killed by the phone's battery manager, nothing notices.

**Design: one heartbeat, one snapshot, one scheduler.**

```
               ┌────────────── Pulse (core:data, @Singleton) ───────────────┐
 minute tick ─▶│ 1. refresh sources that are due (device, health, money,    │
 app resume  ─▶│    vault expiry, sync) using each source's freshness rule  │
 data write  ─▶│ 2. build ONE LiveDay snapshot (StateFlow)                  │──▶ Today, Phone day, Score, Money hero
 worker run  ─▶│ 3. run engines on it in order: Score → Connections →      │──▶ Widget (Glance)
 boot/alarm  ─▶│    Notifications → Widget                                 │──▶ Notification engine
               │ 4. record a heartbeat per job; self-heal missed jobs       │──▶ Diagnostics screen
               └────────────────────────────────────────────────────────────┘
```

- **Freshness rules** (pure, tested): screen time 1 min while the app is open, 15 min in the background · steps 5 min / 30 min · sleep once after wake · money on write · vault expiry daily at 00:05 · sync 30 min or on write (debounced 20 s).
- **One WorkManager unique periodic job** `pulse` (15 min, flex 5, no network constraint) replaces `MaintenanceWorker` and calls `Pulse.beat(reason = WORKER)`. `SyncWorker` stays as its own job (network constraint), but Pulse triggers it on writes.
- **Heartbeat table** `PulseRunEntity(job, lastOkAt, lastError, runs, fails)`. On every beat, any job overdue by more than 2× its interval runs first, so a killed worker heals itself the next time the app opens or any alarm fires.
- **Diagnostics** (Me › About › "How AIIMIN is running"): each job with its last run ("Screen time · 2 min ago ✓", "Sync · failed 3 times · Sign in"), the phone profile from Phase 16, and a "Run everything now" button. This is what makes "not sitting dead" checkable.

### File map
| File | Change |
|---|---|
| `core/engine/src/main/kotlin/aiimin/core/engine/pulse/Freshness.kt` | **Create.** Pure due-rules |
| `core/data/src/main/kotlin/aiimin/core/data/pulse/Pulse.kt` | **Create.** Orchestrator + `liveDay: StateFlow<LiveDay>` |
| `core/data/src/main/kotlin/aiimin/core/data/pulse/LiveDay.kt` | **Create.** The snapshot type |
| `core/database/.../Entities.kt`, `Daos.kt`, `AppDatabase.kt` | `PulseRunEntity` + DAO (AutoMigration) |
| `app/src/main/kotlin/aiimin/app/AiiminApplication.kt` | Replace the MaintenanceWorker schedule with `PulseWorker` |
| `feature/today/.../TodayViewModel.kt`, `feature/me/.../MeViewModels.kt` | Read `pulse.liveDay` instead of building their own |
| `feature/me/.../InfoScreens.kt` | Diagnostics screen |
| Test: `core/engine/src/test/kotlin/aiimin/core/engine/pulse/FreshnessTest.kt` | |

### Task 15.1: Freshness rules (pure)

- [ ] **Step 1: Failing test**

```kotlin
package aiimin.core.engine.pulse

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class FreshnessTest {
    private val m = 60_000L
    @Test fun `screen time is due every minute in the foreground and every 15 in the background`() {
        assertThat(Freshness.due(Source.SCREEN, lastOk = 0, now = 61_000, foreground = true)).isTrue()
        assertThat(Freshness.due(Source.SCREEN, lastOk = 0, now = 10 * m, foreground = false)).isFalse()
        assertThat(Freshness.due(Source.SCREEN, lastOk = 0, now = 15 * m, foreground = false)).isTrue()
    }
    @Test fun `never-run sources are always due`() { assertThat(Freshness.due(Source.STEPS, lastOk = null, now = 1, foreground = false)).isTrue() }
    @Test fun `overdue twice the interval counts as unhealthy`() {
        assertThat(Freshness.unhealthy(Source.SYNC, lastOk = 0, now = 61 * m)).isTrue()
        assertThat(Freshness.unhealthy(Source.SYNC, lastOk = 0, now = 59 * m)).isFalse()
    }
    @Test fun `order runs sources before engines`() {
        assertThat(Freshness.order.indexOf(Source.SCREEN)).isLessThan(Freshness.order.indexOf(Source.SCORE))
        assertThat(Freshness.order.last()).isEqualTo(Source.WIDGET)
    }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.core.engine.pulse

enum class Source(val fgMs: Long, val bgMs: Long) {
    SCREEN(60_000, 15 * 60_000), STEPS(5 * 60_000, 30 * 60_000), SLEEP(6 * 3_600_000, 6 * 3_600_000),
    VAULT_EXPIRY(24 * 3_600_000, 24 * 3_600_000), SYNC(30 * 60_000, 30 * 60_000),
    SCORE(60_000, 15 * 60_000), CONNECTIONS(60_000, 15 * 60_000), NOTIFY(60_000, 15 * 60_000), WIDGET(60_000, 30 * 60_000),
}

/** Plan Phase 15. When each source/engine needs to run again. Pure. */
object Freshness {
    val order = listOf(Source.SCREEN, Source.STEPS, Source.SLEEP, Source.VAULT_EXPIRY, Source.SYNC, Source.SCORE, Source.CONNECTIONS, Source.NOTIFY, Source.WIDGET)

    fun due(s: Source, lastOk: Long?, now: Long, foreground: Boolean): Boolean =
        lastOk == null || now - lastOk >= if (foreground) s.fgMs else s.bgMs

    fun unhealthy(s: Source, lastOk: Long?, now: Long): Boolean = lastOk != null && now - lastOk > 2 * s.bgMs
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(pulse): freshness rules`

### Task 15.2: Pulse orchestrator + LiveDay

- [ ] **Step 1:** `LiveDay` holds what every surface needs: `date`, `nowMinute`, `sky: Sky` (Phase 17), `device: DeviceDayEntity?`, `screen: ScreenSummary?`, `stepsSource: StepSource` (Phase 16), `minimumsDone/Total`, `nextItem: Pair<Int,String>?`, `score: LifeView?`, `topConnection: Candidate?`, `unread: Int`, `mascot: MascotState` (Phase 18), `plan: Plan`.
- [ ] **Step 2:** `Pulse.beat(reason: Reason)`: a `Mutex`-guarded loop over `Freshness.order`. For each due source, call its runner (the existing `DeviceRepository.refresh`, `NotificationRepository.run`, `DayWidget().updateAll`, and so on) inside `runCatching`, then write `PulseRunEntity`. Rebuild `liveDay` once at the end (not per source), so screens never see half-updated state. Triggers: `ProcessLifecycleOwner` ON_START, a minute ticker while in the foreground (`while(isActive){ delay(60_000 - now%60_000); beat(TICK) }`), repository writes (`pulse.poke(Source.SCORE)`, debounced 500 ms), `PulseWorker`, `AlarmReceiver`, and `BOOT_COMPLETED`.
- [ ] **Step 3:** Move Today, Phone day, the widget and notifications to read `pulse.liveDay`. Delete their private refresh calls (`TodayViewModel.kt:110`, `MeViewModels.kt:142,149`). Phone day's "Re-measure" becomes `pulse.beat(MANUAL)`.
- [ ] **Step 4:** Instrumented check: `adb shell am kill in.aiimin.app.v4` (simulates an OEM kill), wait 31 min, open the app → Diagnostics shows each job ran within 5 s of opening, not "31 min ago".
- [ ] **Step 5: Commit** `feat(pulse): one orchestrator, one live snapshot, self-healing jobs`

### Task 15.3: First paint from the last snapshot (fixes the 5-second grey screens)

- [ ] **Step 1:** Persist the last `LiveDay` as JSON in a file (`filesDir/liveday.json`, written at most once a minute) and read it **synchronously before `setContent`** in a background-started `Application` coroutine, with `runBlocking` capped at 50 ms. Screens render this immediately with an "Updating…" hairline progress at the top, then swap to fresh values with the 400 ms number tween (Phase 7).
- [ ] **Step 2:** Each screen's ViewModel exposes `stateIn(..., initialValue = fromSnapshot(pulse.liveDay.value))`, never `null`. Skeletons show only when no snapshot exists (first launch), and only after 300 ms.
- [ ] **Step 3:** Measure: for each route, `am start -W -S ... --es aiimin_go <route>` then `screencap` at 1.0 s. **Expected: real content (not splash, not skeleton) at 1.0 s for today, money, phoneday, score, plans, notifications.** Save as `screenshots/critique-2026-10-14/after-*.png`.
- [ ] **Step 4: Commit** `perf: first paint from the last live snapshot; no grey screens on cold start`

---

## Phase 16: Screen time and steps that work on every phone

**Why one method can't work everywhere (facts):**
- **Usage events differ by maker.** Some Samsung/MIUI builds drop `ACTIVITY_PAUSED` for split-screen or floating windows. Some OEM launchers aren't returned by `CATEGORY_HOME` queries. `KEYGUARD_HIDDEN` doesn't fire without a secure lock (ST5). Android's own `UsageStatsManager.queryAndAggregateUsageStats` totals over-count on some builds (the reason Phase 1 uses events).
- **Steps live in different places.** Samsung phones write steps to Samsung Health (synced to Health Connect only if the user links them). Pixel and Nothing use Google Fit or the phone sensor. Xiaomi uses Mi Fitness. Some phones have no step-counter sensor at all. Health Connect may hold duplicate records from two apps.
- **Background limits.** Xiaomi, Oppo, Vivo, Realme, OnePlus and Samsung kill background work aggressively unless the app is exempted, so the 15-minute jobs simply stop.

**Design: a DeviceProfile picks a strategy per phone, then *checks itself*.**

1. **DeviceProfile** (pure function of `Build.MANUFACTURER`, `Build.BRAND`, `SDK_INT`, sensor list, installed health apps, Health Connect status, secure lock): it returns a `ScreenStrategy` and a `StepStrategy`.
2. **Screen strategies:** `EVENTS` (default, Phase 1) · `EVENTS_WITH_GAP_FILL` (for makers known to drop pauses: close any session open longer than 30 min with no interaction event, and cap it at the next SCREEN_OFF) · `AGGREGATE_CROSSCHECK` (also computes the OS aggregate; if the event total and the aggregate differ by more than 15% for 3 days, switch strategy and log it).
3. **Self-calibration (one-time, optional, 20 seconds):** Phone day › "Check against your phone". AIIMIN opens Settings › Digital Wellbeing (`Settings.ACTION_USAGE_ACCESS_SETTINGS` fallback), the person types the total they see, and AIIMIN stores the ratio. If it's off by more than 10%, it tries the other strategy on yesterday's events and keeps whichever matches. **Raw events are never altered**; only the strategy changes.
4. **Step strategies, in priority order:** Health Connect aggregate (`AggregateRequest(StepsRecord.COUNT_TOTAL)`, which removes overlaps across apps) → if absent, Health Connect records from the preferred origin (Samsung Health > Google Fit > Mi Fitness > others, using `dataOriginFilter`) → if Health Connect is unavailable, the phone step-counter sensor (Phase 1's `StepCounterMath`) → if there's no sensor, "Steps aren't available on this phone" (no fake number). The source is shown under the number: "from Samsung Health via Health Connect".
5. **Keep-alive guidance per maker:** a one-time card "Let AIIMIN measure in the background" with maker-specific steps and deep links (`Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, plus known component intents for MIUI autostart, ColorOS, Samsung "Never sleeping apps"), each wrapped in `runCatching` with the generic battery settings as fallback. Shown only if Pulse sees unhealthy jobs (Phase 15).
6. **Confidence label** on every measured number: "Measured" (strategy verified or calibrated) · "Estimated" (fallback strategy) · "Not measured".

### File map
| File | Change |
|---|---|
| `core/sensing/src/main/kotlin/aiimin/core/sensing/logic/DeviceProfile.kt` | **Create.** Pure strategy picker |
| `core/sensing/src/main/kotlin/aiimin/core/sensing/logic/GapFill.kt` | **Create.** Close runaway sessions |
| `core/sensing/src/main/kotlin/aiimin/core/sensing/UsageReader.kt` | Strategy switch + aggregate cross-check |
| `core/sensing/src/main/kotlin/aiimin/core/sensing/HealthReader.kt` | Aggregate + origin priority |
| `core/data/.../device/DeviceRepository.kt` | Store `strategy`, `confidence`, `stepsOrigin` |
| `feature/me/.../InfoScreens.kt` | "Check against your phone" flow, source line, confidence label |
| `feature/today/.../TodayScreen.kt` | Keep-alive card when Pulse reports unhealthy jobs |
| Tests: `DeviceProfileTest.kt`, `GapFillTest.kt` | |

### Task 16.1: DeviceProfile (pure)

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.sensing

import aiimin.core.sensing.logic.*
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class DeviceProfileTest {
    private fun p(maker: String, hc: Boolean = true, sensor: Boolean = true, apps: Set<String> = emptySet()) =
        DeviceProfile.pick(DeviceFacts(maker, sdk = 35, healthConnect = hc, stepSensor = sensor, healthApps = apps, secureLock = true))

    @Test fun `samsung and xiaomi get gap fill`() {
        assertThat(p("samsung").screen).isEqualTo(ScreenStrategy.EVENTS_WITH_GAP_FILL)
        assertThat(p("Xiaomi").screen).isEqualTo(ScreenStrategy.EVENTS_WITH_GAP_FILL)
        assertThat(p("Google").screen).isEqualTo(ScreenStrategy.EVENTS)
    }
    @Test fun `steps prefer health connect, then sensor, then nothing`() {
        assertThat(p("Nothing").steps).isEqualTo(StepStrategy.HEALTH_CONNECT_AGGREGATE)
        assertThat(p("Nothing", hc = false).steps).isEqualTo(StepStrategy.PHONE_SENSOR)
        assertThat(p("Nothing", hc = false, sensor = false).steps).isEqualTo(StepStrategy.UNAVAILABLE)
    }
    @Test fun `preferred origin follows installed health apps`() {
        assertThat(p("samsung", apps = setOf("com.sec.android.app.shealth", "com.google.android.apps.fitness")).preferredOrigin).isEqualTo("com.sec.android.app.shealth")
        assertThat(p("Google", apps = setOf("com.google.android.apps.fitness")).preferredOrigin).isEqualTo("com.google.android.apps.fitness")
    }
    @Test fun `aggressive killers need keep-alive guidance`() {
        assertThat(p("Xiaomi").needsKeepAlive).isTrue(); assertThat(p("Google").needsKeepAlive).isFalse()
    }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.core.sensing.logic

enum class ScreenStrategy { EVENTS, EVENTS_WITH_GAP_FILL, AGGREGATE_CROSSCHECK }
enum class StepStrategy { HEALTH_CONNECT_AGGREGATE, HEALTH_CONNECT_ORIGIN, PHONE_SENSOR, UNAVAILABLE }

data class DeviceFacts(val maker: String, val sdk: Int, val healthConnect: Boolean, val stepSensor: Boolean, val healthApps: Set<String>, val secureLock: Boolean)
data class Profile(val screen: ScreenStrategy, val steps: StepStrategy, val preferredOrigin: String?, val needsKeepAlive: Boolean)

/** Plan Phase 16. Picks how to measure on this phone. Pure; facts are read by the caller. */
object DeviceProfile {
    private val dropsPauses = setOf("samsung", "xiaomi", "redmi", "poco", "oppo", "realme", "vivo", "iqoo")
    private val killers = setOf("xiaomi", "redmi", "poco", "oppo", "realme", "vivo", "iqoo", "oneplus", "samsung", "huawei", "honor")
    val originPriority = listOf("com.sec.android.app.shealth", "com.google.android.apps.fitness", "com.xiaomi.wearable", "com.mi.health")

    fun pick(f: DeviceFacts): Profile {
        val m = f.maker.lowercase()
        val screen = if (m in dropsPauses) ScreenStrategy.EVENTS_WITH_GAP_FILL else ScreenStrategy.EVENTS
        val steps = when {
            f.healthConnect -> StepStrategy.HEALTH_CONNECT_AGGREGATE
            f.stepSensor -> StepStrategy.PHONE_SENSOR
            else -> StepStrategy.UNAVAILABLE
        }
        return Profile(screen, steps, originPriority.firstOrNull { it in f.healthApps }, m in killers)
    }
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(sensing): device profile picks measurement strategy per phone`

### Task 16.2: Gap fill for phones that drop pause events

- [ ] **Step 1: Failing test** (in `GapFillTest`):

```kotlin
    @Test fun `a session with no interaction for 30 minutes is cut at the last interaction plus 30`() {
        val m = 60_000L
        val cut = GapFill.cap(sessionStart = 0, sessionEnd = 120 * m, interactions = listOf(5 * m, 20 * m), limitMs = 30 * m)
        assertThat(cut).isEqualTo(50 * m)
    }
    @Test fun `active sessions are untouched`() {
        val m = 60_000L
        assertThat(GapFill.cap(0, 60 * m, listOf(10 * m, 35 * m, 58 * m), 30 * m)).isEqualTo(60 * m)
    }
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.core.sensing.logic

/** Phase 16: on phones that drop ACTIVITY_PAUSED, end a session 30 min after the last sign of use. */
object GapFill {
    fun cap(sessionStart: Long, sessionEnd: Long, interactions: List<Long>, limitMs: Long): Long {
        var last = sessionStart
        for (t in interactions.filter { it in sessionStart..sessionEnd }.sorted()) {
            if (t - last > limitMs) return last + limitMs
            last = t
        }
        return if (sessionEnd - last > limitMs) last + limitMs else sessionEnd
    }
}
```

"Interactions" are `USER_INTERACTION` (type 7), `SCREEN_INTERACTIVE` and any `ACTIVITY_RESUMED`. Add `Kind.INTERACTION` to `UsageTimeline`, map type 7 in `UsageReader.kindOf`, and apply `GapFill.cap` when closing each session if the profile says `EVENTS_WITH_GAP_FILL`. Add a timeline test: a missing pause on a Samsung-style stream no longer counts 2 h.

- [ ] **Step 4: PASS. Step 5: Commit** `fix(sensing): gap fill stops runaway sessions on phones that drop pause events`

### Task 16.3: Health Connect aggregate + origin priority

- [ ] In `HealthReader.steps(start, end)`: first `client.aggregate(AggregateRequest(setOf(StepsRecord.COUNT_TOTAL), TimeRangeFilter.between(start, end)))`. If that returns null or 0 and a `preferredOrigin` exists, read `StepsRecord`s with `dataOriginFilter = setOf(DataOrigin(preferredOrigin))` and sum them. Hourly buckets use `aggregateGroupByDuration(..., Duration.ofHours(1))`. Return `StepsResult(total, hourly, origin, strategy)`. Unit-test the origin pick with a fake reader (an interface `StepsSource` wrapping the client).
- [ ] **Commit** `feat(health): steps from the Health Connect aggregate with origin priority`

### Task 16.4: Self-check flow, confidence labels, keep-alive card

- [ ] Phone day: under the hero, "Measured · checked against your phone" / "Estimated · tap to check". The check sheet has a number field "What does your phone's Digital Wellbeing say for today?", a button "Open Digital Wellbeing", and Save. It stores `calibrationRatio`. If it's off by more than 10%, it re-runs yesterday with the alternate strategy and keeps the closer one (pure function `DeviceProfile.chooseByCalibration(eventsMs, altMs, userMs)`, with 3 tests).
- [ ] Keep-alive card on Today when `Pulse` reports an unhealthy job and `profile.needsKeepAlive`: "Your phone is pausing AIIMIN in the background", with maker-specific steps (Xiaomi: Autostart + Battery saver No restrictions; Samsung: Never sleeping apps; OnePlus/Oppo/Realme: Allow background activity) and a "Open settings" button with intent fallbacks.
- [ ] **Commit** `feat(sensing): self-check against the phone, confidence labels, keep-alive help`

**Phase 16 acceptance:** on the emulator plus at least 2 real phones of different makers (the owner's Nothing Phone 2 + one Samsung or Xiaomi from family): screen time within ±3% of Digital Wellbeing after the self-check, steps within ±2% of the source app, and Diagnostics shows jobs healthy after 24 h.

---

## Phase 17: Sky timed to the real sun where the person lives (no location permission)

**Idea:** the phone already knows its **time zone** (`ZoneId.systemDefault()`) and usually its **country** (`TelephonyManager.networkCountryIso`, then `simCountryIso`, then `Locale.getDefault().country`). That's enough to estimate sunrise and sunset to within about 20–40 minutes for most people, with **no location permission and no network**. The sky then follows the real, seasonal day: earlier dawn in June, later in December, and Delhi differs from Chennai.

**How:**
1. **Reference coordinates per time zone.** Ship a small table (`core/designsystem/src/main/resources/zone_coords.csv`, from the IANA `zone1970.tab` public-domain file: zone id → latitude, longitude; about 300 rows, ~10 KB). `Asia/Kolkata` → 22.57 N, 88.36 E is Kolkata, and India spans about ±10° of longitude around it, so the plan uses a **country-centroid override** for big single-zone countries (India 22.0 N 79.0 E; China 35.0 N 103.0 E). Country centroids come from a 250-row public-domain table in the same file format.
2. **Solar maths** (NOAA algorithm, pure Kotlin, about 60 lines): for a date, latitude and longitude, compute sunrise, sunset, solar noon, civil dawn and civil dusk (sun at −6°). Polar edge cases (no sunrise or sunset) clamp to fixed keyframes.
3. **SkyClock keyframes become relative to the sun:** night → civil dawn (pre-dawn) → sunrise (dawn) → sunrise + 2 h (morning) → solar noon (midday) → sunset − 1.5 h (golden) → sunset (dusk) → civil dusk + 30 min (night). Phase 4's fixed minutes become the **fallback** when nothing is known.
4. **Gradual by design:** the sky value is recomputed every minute (from Pulse), and the Today layer animates between consecutive values over 60 s (`animateColorAsState(tween(60_000, easing = LinearEasing))`), so no change is ever a visible step. Under reduce motion, the value updates per minute without the tween.
5. **Optional precision:** Settings › Appearance › "Sky follows: my time zone (default) · a city I choose". Choosing a city from the same table refines it. Still no location permission.

### File map
| File | Change |
|---|---|
| `core/designsystem/src/main/kotlin/aiimin/designsystem/theme/SolarClock.kt` | **Create.** NOAA sunrise/sunset |
| `core/designsystem/src/main/kotlin/aiimin/designsystem/theme/SkyPlace.kt` | **Create.** Zone/country → coordinates |
| `core/designsystem/src/main/resources/zone_coords.csv`, `country_centroids.csv` | **Create.** Public-domain tables |
| `core/designsystem/.../theme/SkyClock.kt` (Phase 4) | `at(minute, sun: SunTimes?)`, with keyframes relative to sun times |
| `core/designsystem/.../component/Horizon.kt` | Night arc (Task 17.3) |
| Tests: `SolarClockTest.kt`, `SkyPlaceTest.kt`, extend `SkyClockTest.kt` | |

### Task 17.1: SolarClock

- [ ] **Step 1: Failing tests** (reference values from the NOAA solar calculator, tolerance ±3 min):

```kotlin
package aiimin.designsystem.theme

import com.google.common.truth.Truth.assertThat
import org.junit.Test
import java.time.LocalDate
import java.time.ZoneId

class SolarClockTest {
    private fun minutes(t: java.time.LocalTime) = t.hour * 60 + t.minute
    @Test fun `new delhi on 21 june`() {
        val s = SolarClock.sun(LocalDate.of(2026, 6, 21), 28.61, 77.21, ZoneId.of("Asia/Kolkata"))!!
        assertThat(minutes(s.sunrise)).isWithin(3).of(5 * 60 + 24)
        assertThat(minutes(s.sunset)).isWithin(3).of(19 * 60 + 22)
    }
    @Test fun `new delhi on 21 december`() {
        val s = SolarClock.sun(LocalDate.of(2026, 12, 21), 28.61, 77.21, ZoneId.of("Asia/Kolkata"))!!
        assertThat(minutes(s.sunrise)).isWithin(3).of(7 * 60 + 10)
        assertThat(minutes(s.sunset)).isWithin(3).of(17 * 60 + 29)
    }
    @Test fun `civil dawn is before sunrise`() {
        val s = SolarClock.sun(LocalDate.of(2026, 3, 20), 19.08, 72.88, ZoneId.of("Asia/Kolkata"))!!
        assertThat(s.civilDawn).isLessThan(s.sunrise); assertThat(s.civilDusk).isGreaterThan(s.sunset)
    }
    @Test fun `polar day returns null`() { assertThat(SolarClock.sun(LocalDate.of(2026, 6, 21), 78.2, 15.6, ZoneId.of("Arctic/Longyearbyen"))).isNull() }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.designsystem.theme

import java.time.*
import kotlin.math.*

data class SunTimes(val civilDawn: LocalTime, val sunrise: LocalTime, val noon: LocalTime, val sunset: LocalTime, val civilDusk: LocalTime)

/** NOAA general solar position algorithm (plan Phase 17). Pure. Null when the sun doesn't rise or set that day. */
object SolarClock {
    private fun rad(d: Double) = d * PI / 180.0
    private fun deg(r: Double) = r * 180.0 / PI

    fun sun(date: LocalDate, lat: Double, lon: Double, zone: ZoneId): SunTimes? {
        val n = date.dayOfYear
        val g = 2 * PI / 365.0 * (n - 1 + 0.5)
        val eqTime = 229.18 * (0.000075 + 0.001868 * cos(g) - 0.032077 * sin(g) - 0.014615 * cos(2 * g) - 0.040849 * sin(2 * g))
        val decl = 0.006918 - 0.399912 * cos(g) + 0.070257 * sin(g) - 0.006758 * cos(2 * g) + 0.000907 * sin(2 * g) - 0.002697 * cos(3 * g) + 0.00148 * sin(3 * g)
        fun hourAngle(zenith: Double): Double? {
            val c = cos(rad(zenith)) / (cos(rad(lat)) * cos(decl)) - tan(rad(lat)) * tan(decl)
            return if (c < -1 || c > 1) null else deg(acos(c))
        }
        val offsetMin = zone.rules.getOffset(date.atTime(12, 0)).totalSeconds / 60.0
        val noonMin = 720 - 4 * lon - eqTime + offsetMin
        fun at(min: Double) = LocalTime.of(0, 0).plusSeconds((((min % 1440) + 1440) % 1440 * 60).roundToLong())
        val ha = hourAngle(90.833) ?: return null
        val haCivil = hourAngle(96.0) ?: ha
        return SunTimes(at(noonMin - 4 * haCivil), at(noonMin - 4 * ha), at(noonMin), at(noonMin + 4 * ha), at(noonMin + 4 * haCivil))
    }
}
```

- [ ] **Step 4: PASS** (if a reference value is off by more than 3 min, check the expected value against the NOAA calculator for that date and update the test, not the algorithm). **Step 5: Commit** `feat(sky): solar times from date, coordinates and zone`

### Task 17.2: SkyPlace (zone or country → coordinates)

- [ ] Tests: `SkyPlace.resolve(zone = "Asia/Kolkata", country = "IN")` → India centroid (22.0, 79.0). `resolve("Europe/London", "GB")` → the zone row (51.5, −0.12). `resolve("Etc/UTC", "")` → null (fallback keyframes). Unknown zone + known country → the country centroid. The implementation loads both CSVs lazily from resources (`javaClass.getResourceAsStream`) into maps. `bigCountries = setOf("IN","CN","US","RU","BR","AU","CA","ID")` prefer the country centroid unless the zone is specific (for example `America/Los_Angeles` beats the US centroid; `Asia/Kolkata` uses the India centroid). Country detection in `:app`: `TelephonyManager.networkCountryIso.ifBlank { simCountryIso }.ifBlank { Locale.getDefault().country }.uppercase()`, which needs no permission.
- [ ] **Commit** `feat(sky): place from time zone and country, no location permission`

### Task 17.3: SkyClock anchored to the sun + the night arc

- [ ] `SkyClock.at(minute, sun: SunTimes? = null)`: when `sun != null`, rebuild the key list with minutes `civilDawn-30 → night`, `civilDawn → pre-dawn`, `sunrise → dawn`, `sunrise+120 → morning`, `noon → midday`, `sunset-90 → golden`, `sunset → dusk`, `civilDusk+30 → night`. The colours, alphas and positions stay those of Phase 4. Add tests: in Delhi in December, 06:45 is still "pre-dawn" (alpha ≤ 0.12) while 06:45 in June is "morning". No jump bigger than the Phase 4 limits on any minute of 3 test dates.
- [ ] `DayHorizon` arc window = `[sunrise − 60, sunset + 180]` clamped to `[05:00, 23:59]` and extended to the person's day end if later. Past the window end: draw the full solid arc, a moon ring at the right foot, and the label "Tomorrow starts at {dayStart}". Before the window start: a dotted arc + moon at the left foot. Test with a debug clock at 23:56: the arc is visible (fixes the critique's critical bug).
- [ ] Pulse puts `sky` into `LiveDay`. Today's `LivingSky` animates between minute values with a 60 s tween.
- [ ] **Commit** `feat(sky): sky and arc follow real sunrise and sunset; arc visible at night`

---

## Phase 18: Raahi, the AIIMIN companion (mascot in the assistant, widget, empty states, notifications)

**The character** (reference: `app/docs/mascot/raahi-reference.webp`): a small figure in a deep-green leaf hood and scarf, with a cream round face, two oval eyes, rosy cheeks and a brown satchel. Mood: grounded, loyal, reliable. **Proposed name: Raahi** (Hindi/Urdu "traveller", someone who walks the road with you), from master-plan §10's shortlist. Short, easy to say in India, and it fits the satchel and the journey of a day. *The owner can rename it in one line (`MascotCopy.NAME`).*

**Rule change (owner decision, 14 Oct):** this replaces PLAN §2.18 rule 8 ("never mascots") and the master plan's "The Mark" (line-drawn, default off). Raahi is **on by default** in the assistant, widget and empty states, and can be turned off in Appearance ("Show Raahi"). Guardrails kept from the master plan: no confetti, no guilt, no Raahi on emergency, paywall or error screens; reduce motion = still poses.

**Colour:** the forest green is new to the palette. It's added as **mascot-only tokens** so the app UI stays orange/ink: `raahiHood #3E7A4E`, `raahiHoodShade #2F5E3C`, `raahiLeaf #5E9B5A`, `raahiFace #F6E7D7`, `raahiCheek #F2B8A0`, `raahiEye #1F1B18`, `raahiBag #A0663A`. Contrast isn't used for text, so there are no AA constraints, but the green on paper must stay identifiable (checked: ΔE > 40 from `#F5F3EE`).

**How it's drawn (decision):** recreate Raahi as **layered Compose vectors** (hood, face, eyes, cheeks, scarf, leaf tails, satchel, legs as separate paths) rather than shipping one picture. Why: the reference is a single 3D render, which can't blink, look around, sleep or wave. Vector layers can, at about 30 KB with no new library. The flat-vector style keeps the silhouette, colours and proportions (head ≈ 55% of height, eyes at 55% of face height, 0.18 face-width apart). Soft shading uses 2-stop radial fills inside the hood only (allowed here; it's the character, not UI chrome). The reference 3D render is used as-is on the website, the Play listing and onboarding page 1 (`res/drawable-nodpi/raahi_hero.webp`).

**Poses** (each one a set of layer transforms, not a new drawing):

| Pose | Body | Eyes | Extra | Used when |
|---|---|---|---|---|
| `IDLE` | standing, hood 1° sway (4 s loop) | open, blink every 3–6 s (120 ms) | — | default |
| `WAVE` | right hand up, 2 waves (900 ms) | happy (eyes become ^ arcs) | — | first open of the day, assistant greeting |
| `THINK` | head tilt 6°, hand at chin | look up-left | 3 dots above (assistant "working") | assistant generating |
| `READ` | holds a small paper from the satchel | look down | — | weekly review, documents |
| `WALK` | 2-frame step cycle, satchel bounce | open | — | progress (steps, sync running) |
| `CHEER` | small hop (6 dp, spring) | happy | — | minimum done, first score, streak 7 |
| `SLEEP` | sitting, hood pulled down | closed (curved lines) | "z" drifting (reduce motion: still) | night (after civil dusk + 2 h) and quiet hours |
| `REST` | sitting, satchel beside | half-closed | — | light day / paused |
| `POINT` | points to the side | look at the point | — | empty states ("start here") |

**MascotState resolver** (pure, in `core:engine`): inputs are `nowMinute`, sky phase, `minimumsDone/Total`, `paused`, `batteryLow`, `assistantBusy`, `lastEvent` (e.g. MIN_DONE at t). The output is a pose plus a one-line mood text. Rules: an assistant that's busy shows THINK. An event within 3 s plays its pose once, then returns to the base. Night shows SLEEP. Paused or low battery shows REST. All minimums done shows IDLE with happy eyes. Otherwise IDLE.

### Where Raahi appears

1. **Assistant (A1):**
   - **Header:** a 56 dp Raahi beside the title. On first open of the day, Raahi waves and greets by time and data: "Morning. 3 minimums today, and a call at 14:30." / "Evening. You kept 2 of 3. Want to close the day?"
   - **Messages:** while generating, Raahi shows THINK with the 3 dots instead of a spinner. Each assistant message gets a 20 dp Raahi avatar on the first message of a group.
   - **Suggestion chips:** the four boxed suggestions become 3 chips built from real data (e.g. "What's expiring soon?" only if something expires in ≤ 30 days; "Spent ₹… today?" only if no money was logged today). They are flat, hairline-bordered, horizontally scrolling.
   - **Voice:** Raahi's eyes follow the mic level (pupils grow 5% with the voice) while listening.
   - **Persona** (copy rules in `MascotCopy`): first person singular, short, warm, a little wry, never cute-speak, never guilt, never claims to feel things. Examples: "Done. I put lunch ₹250 and auto ₹120 under Food and Travel." · "I read your last 30 days of money for this." · "I'm not sure. Want me to look at last month too?"
2. **Widget (Phase 12 upgrade):** the small 2×2 shows Raahi (pose from `MascotState`) standing on the arc at the sun's position, plus "3 of 5". The medium 4×2 shows the arc with Raahi on it, next item, minimums and "+". Poses are pre-rendered to bitmaps by the same vector code (`MascotBitmap.draw(pose, sizePx)`), because Glance can't run Compose drawing. At night Raahi sleeps on the arc.
3. **Empty states:** Today first-run, Money with no payments, Vault with no documents, Score calibrating: Raahi in POINT or READ, plus one line and one action. Example, Vault: "Nothing here yet. Start with the one you always search for: Aadhaar, PAN or insurance." [Add a document]
4. **Notifications:** `setLargeIcon(MascotBitmap.draw(pose, 128))` on playful categories only (day, insights). Pose by rule: minimums → POINT, focus done → CHEER, weekly review → READ, wind-down → SLEEP. Never on money, security or emergency.
5. **Onboarding:** page 1 uses the hero render: "Hi, I'm Raahi. I'll walk your day with you." The last page has Raahi waving.
6. **Celebrations (firsts):** a 700 ms CHEER hop beside the item + one line. No confetti.

### File map
| File | Change |
|---|---|
| `core/designsystem/src/main/kotlin/aiimin/designsystem/mascot/RaahiGeometry.kt` | **Create.** Layer paths (from the reference) |
| `core/designsystem/.../mascot/Raahi.kt` | **Create.** `@Composable fun Raahi(pose, size, reduceMotion, lookAt, level)` |
| `core/designsystem/.../mascot/RaahiPose.kt` | **Create.** Pose → layer transforms (pure) |
| `core/engine/src/main/kotlin/aiimin/core/engine/mascot/MascotState.kt` | **Create.** Resolver (pure) |
| `core/engine/.../mascot/MascotCopy.kt` | **Create.** Name, greetings, persona lines |
| `app/src/main/kotlin/aiimin/app/widget/MascotBitmap.kt` | **Create.** Android Canvas renderer reusing `RaahiGeometry` (paths built with `android.graphics.Path` from the same numbers) |
| `core/designsystem/.../theme/Palette.kt` | Mascot tokens |
| `feature/assistant/.../AssistantScreens.kt` | Header, THINK, avatar, chips |
| `feature/*` empty states | Raahi + line + action |
| `core/data/.../notify/SystemPoster.kt` | Large icon for playful channels |
| `feature/me/.../SettingsScreens.kt` | "Show Raahi" switch |
| Tests: `MascotStateTest.kt`, `RaahiPoseTest.kt`, `MascotCopyTest.kt`, screenshot previews for all 9 poses | |

### Task 18.1: MascotState resolver (pure)

- [ ] **Step 1: Failing tests**

```kotlin
package aiimin.core.engine.mascot

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class MascotStateTest {
    private fun ctx(min: Int = 600, night: Boolean = false, done: Int = 0, total: Int = 3, paused: Boolean = false, busy: Boolean = false, event: MascotEvent? = null, eventAgoMs: Long = 0) =
        MascotInputs(min, night, done, total, paused, batteryLow = false, assistantBusy = busy, lastEvent = event, lastEventAgoMs = eventAgoMs)

    @Test fun `assistant busy beats everything`() { assertThat(MascotState.resolve(ctx(busy = true, night = true)).pose).isEqualTo(Pose.THINK) }
    @Test fun `a fresh event plays once`() {
        assertThat(MascotState.resolve(ctx(event = MascotEvent.MINIMUM_DONE, eventAgoMs = 500)).pose).isEqualTo(Pose.CHEER)
        assertThat(MascotState.resolve(ctx(event = MascotEvent.MINIMUM_DONE, eventAgoMs = 4_000)).pose).isEqualTo(Pose.IDLE)
    }
    @Test fun `night sleeps, pause rests`() {
        assertThat(MascotState.resolve(ctx(night = true)).pose).isEqualTo(Pose.SLEEP)
        assertThat(MascotState.resolve(ctx(paused = true)).pose).isEqualTo(Pose.REST)
    }
    @Test fun `all done is happy idle`() {
        val s = MascotState.resolve(ctx(done = 3, total = 3))
        assertThat(s.pose).isEqualTo(Pose.IDLE); assertThat(s.happy).isTrue()
    }
}
```

- [ ] **Step 2: FAIL. Step 3: Implement**

```kotlin
package aiimin.core.engine.mascot

enum class Pose { IDLE, WAVE, THINK, READ, WALK, CHEER, SLEEP, REST, POINT }
enum class MascotEvent { MINIMUM_DONE, FIRST_SCORE, STREAK_7, GREETING, REVIEW_OPEN }

data class MascotInputs(
    val nowMinute: Int, val night: Boolean, val minimumsDone: Int, val minimumsTotal: Int,
    val paused: Boolean, val batteryLow: Boolean, val assistantBusy: Boolean,
    val lastEvent: MascotEvent?, val lastEventAgoMs: Long,
)
data class MascotView(val pose: Pose, val happy: Boolean = false)

/** Plan Phase 18. Which pose Raahi shows. Pure. */
object MascotState {
    const val EVENT_WINDOW_MS = 3_000L
    fun resolve(i: MascotInputs): MascotView {
        if (i.assistantBusy) return MascotView(Pose.THINK)
        if (i.lastEvent != null && i.lastEventAgoMs < EVENT_WINDOW_MS) return MascotView(
            when (i.lastEvent) { MascotEvent.MINIMUM_DONE, MascotEvent.FIRST_SCORE, MascotEvent.STREAK_7 -> Pose.CHEER; MascotEvent.GREETING -> Pose.WAVE; MascotEvent.REVIEW_OPEN -> Pose.READ }, happy = true,
        )
        if (i.night) return MascotView(Pose.SLEEP)
        if (i.paused || i.batteryLow) return MascotView(Pose.REST)
        val allDone = i.minimumsTotal > 0 && i.minimumsDone >= i.minimumsTotal
        return MascotView(Pose.IDLE, happy = allDone)
    }
}
```

- [ ] **Step 4: PASS. Step 5: Commit** `feat(mascot): Raahi pose resolver`

### Task 18.2: Raahi geometry and renderer

- [ ] **Step 1:** Trace the reference into a 200×240 unit artboard. Use `impeccable-asset-producer` (or by hand in Figma/Inkscape), export **separate SVG paths per layer**, and save them as `app/docs/mascot/raahi-layers.svg` with ids: `hood-back`, `hood-front`, `face`, `cheek-l`, `cheek-r`, `eye-l`, `eye-r`, `scarf`, `leaf-tail-l`, `leaf-tail-r`, `cloak`, `arm-l`, `arm-r`, `leg-l`, `leg-r`, `bag`, `bag-strap`, `bag-clasp`. Acceptance for the trace: at 160 dp, side by side with the reference, the owner recognises it at a glance (silhouette, hood point, satchel on the left side, cheek blush).
- [ ] **Step 2:** `RaahiGeometry.kt`: each layer as `val hoodFront = PathParser().parsePathString("<d from svg>")` (Compose `PathParser`), plus the pivot points: neck (100, 150), right shoulder (128, 162), eye centres (82, 118) and (118, 118).
- [ ] **Step 3:** `RaahiPose.kt` (pure, tested): `fun transforms(pose: Pose, t: Float /*0..1 loop*/): LayerTransforms` returning rotations and offsets per layer (e.g. WAVE: `armR.rotation = -110f + 20f * sin(t * 4π)`, THINK: `head.rotation = 6f`, CHEER: `body.dy = -6f * hop(t)`), plus `eyes: EyeShape` (OPEN, HAPPY, CLOSED, HALF) and `blink: Float`. Tests: WAVE at t=0.25 raises the arm above the shoulder; SLEEP has closed eyes; every transform is within ±120°/±12 units (no limbs flying off).
- [ ] **Step 4:** `Raahi.kt`: `@Composable fun Raahi(pose: Pose, modifier: Modifier = Modifier, size: Dp = 56.dp, reduceMotion: Boolean, happy: Boolean = false, lookAt: Offset? = null, level: Float = 0f)`. A single `Canvas` with `drawWithCache` (paths cached per size), an infinite transition for the loop time (paused when `reduceMotion`), and blink via a `LaunchedEffect` random delay of 3–6 s. `graphicsLayer` only, no recomposition per frame (frame time is read inside the draw lambda). A `semantics { contentDescription = "Raahi, " + poseDescription }`.
- [ ] **Step 5:** `@Preview` for all 9 poses → screenshot tests. **Commit** `feat(mascot): Raahi drawn in layers with 9 poses`

### Task 18.3: Assistant integration
- [ ] The header greeting (`MascotCopy.greeting(nowMinute, minimumsLeft, nextItem)`, with 3 tests for morning/evening/nothing-planned), THINK while `vm.busy`, the avatar on the first message of each group, data-driven chips (pure `AssistantChips.from(snapshot)`, tested), and eyes following mic level. **Commit** `feat(assistant): Raahi greets, thinks and listens`

### Task 18.4: Widget, empty states, notifications, onboarding, setting
- [ ] `MascotBitmap.draw(pose, sizePx, happy)` reuses the same path strings with `android.graphics.Path` via `androidx.core.graphics.PathParser.createPathFromPathData`. The widget places Raahi on the arc at the sun's position. Empty states on Today, Money, Vault and Score use Raahi. `SystemPoster` adds the large icon on day/insight channels. Onboarding page 1 uses the hero render. Appearance gets "Show Raahi" (off → widget shows arc only, assistant shows the brand mark). **Commit** per surface.

**Phase 18 acceptance:** 9 poses render with no dropped frames (`gfxinfo`). The widget shows the right pose by time (asleep at 23:30). The assistant shows THINK while answering. Turning "Show Raahi" off removes it everywhere within one Pulse beat.

---

## Phase 19: Plan identity (names, emblems, prices) and emails on every plan change

**Names (final):** **Free · Plus · Pro · Family**, the same in the app, on the web, in emails and on the server (replacing explore/core/pro/elite everywhere).

**Emblems** (drawn from the brand arc, so they belong together; ink + one accent, 24/40 dp):

| Plan | Emblem | Meaning |
|---|---|---|
| Free | a single dot on a short baseline | your day, one point at a time |
| Plus | an arc over the baseline | your whole history (the full day arc) |
| Pro | the arc with the orange sun at its peak | insight lights it up |
| Family | two nested arcs over one baseline, sun on the outer | everyone under one sky |

Shown on the Plans blocks, the Compare table header, "Your subscription", the Me plan row, the beta switch sheet, and the email header. File: `core/designsystem/.../component/PlanEmblem.kt` (`@Composable fun PlanEmblem(plan: String, size: Dp)`, Canvas, `@Preview` ×4). For the email, the same shapes are exported as inline SVG strings from `server/lib/planEmblems.js`.

**Emails** (the previous app sent "Welcome to Core." through `server/services/billingService.js:213-224` → `server/lib/email.js` (Resend) → template `post_purchase` in `server/lib/emailTemplates.js:289`). The new behaviour:

| Event | Email | Subject | Body (plain, warm) |
|---|---|---|---|
| Upgrade (beta) | `plan_changed_up` | "You're on Pro" | Emblem · "Pro is on for your account. During the beta it's free, and no payment is taken." · the 3 things it adds (from the same catalogue) · "We'll email you at least 14 days before paid plans start." · button "Open AIIMIN" |
| Downgrade | `plan_changed_down` | "You're on Free" | Emblem · "You've moved to Free. Nothing was deleted. Anything above Free limits stays viewable and exportable." · button "See plans" |
| Side move | `plan_changed_side` | "You're on Family" | as for an upgrade, listing the differences |
| Billing notice (D-P4, later) | `billing_notice` | "Paid plans start on 1 Dec" | the date, the price for their plan, "nothing is charged unless you subscribe" |

Rules: one email per change, and at most one per 10 minutes per user (a person flicking between plans gets only the last state: the send is debounced with a 10-minute delayed job keyed by user). No email for local-only (signed-out) users; the app tells them "Sign in to get a confirmation email". Unsubscribe link for marketing doesn't apply (it's a transactional email), but the footer says why they got it.

### Task 19.1: Server: tier ids, catalogue, emails (Node, `server/`)

**Files:** `server/services/billingService.js`, `server/lib/emailTemplates.js`, `server/lib/planEmblems.js` (create), `server/routes/billing.js`, a migration under `supabase/migrations/` for profile values, tests `server/services/billingService.plan.test.js` (create)

- [ ] **Step 1: Failing tests** (the repo already has `*.test.js` next to services; use its runner: check `package.json` "test" script, likely `node --test` or vitest):

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TIERS, TIER_ORDER, normalizeTier, changeKind } from './billingService.js';
import { renderEmail } from '../lib/emailTemplates.js';

test('v4.1 tier ids and prices', () => {
  assert.deepEqual(TIER_ORDER, ['free', 'plus', 'pro', 'family']);
  assert.equal(TIERS.plus.price_inr, 49); assert.equal(TIERS.pro.price_inr, 99); assert.equal(TIERS.family.price_inr, 179);
});
test('old ids map to new ones', () => {
  assert.equal(normalizeTier('explore'), 'free'); assert.equal(normalizeTier('core'), 'plus');
  assert.equal(normalizeTier('elite'), 'pro'); assert.equal(normalizeTier('pro'), 'pro');
});
test('change kind', () => {
  assert.equal(changeKind('free', 'pro'), 'up'); assert.equal(changeKind('pro', 'free'), 'down'); assert.equal(changeKind('pro', 'pro'), 'none');
});
test('upgrade email names the plan, says no payment, never says Core', () => {
  const { subject, html } = renderEmail('plan_changed_up', { plan_id: 'pro', plan_name: 'Pro', adds: ['Patterns', 'Monthly review PDF', 'Weekly review drafts'], beta: true });
  assert.equal(subject, "You're on Pro");
  assert.match(html, /no payment is taken/i); assert.doesNotMatch(html, /Core|Elite|Explore/);
});
```

- [ ] **Step 2:** Run (`cd server && npm test -- billingService.plan`). Expect FAIL.
- [ ] **Step 3:** In `billingService.js`, set `TIER_ORDER = ['free','plus','pro','family']`, with `TIERS` entries `{ id, name, price_inr, price_inr_year, adds: [...] }` (49/449, 99/899, 179/1599; `adds` copied from the app's `Feature` catalogue diff). Add `normalizeTier(id)` (explore→free, core→plus, elite→pro), used by `getUserTier` and on input. Add `changeKind(a, b)` by rank. `isUpgradeOnlyMode()` returns false in beta, since downgrades are allowed (L-A). Replace the `post_purchase` block with `schedulePlanEmail(userId, oldTier, newTier)`, which inserts or updates a row in `plan_email_queue(user_id PK, old_tier, new_tier, due_at = now()+10min)`. Add a cron path `/api/cron/plan-emails` (every 5 min, hooked to the existing Vercel cron pattern in `vercel.json`, or the server's own scheduler if `api.aiimin.in` is a long-running Node process; check `server/index.js` for `setInterval` jobs) that sends due rows and deletes them.
- [ ] **Step 4:** In `emailTemplates.js`, add `plan_changed_up`, `plan_changed_down`, `plan_changed_side` and `billing_notice`, using the existing `legacyLayout` + `BRAND` + `escapeHtml` helpers, with the emblem SVG inline at 40 px in the header. Keep `post_purchase` as an alias to `plan_changed_up` for old callers.
- [ ] **Step 5:** Migration (`supabase/migrations/2026101501_plan_ids.sql`): `update user_profiles set subscription_tier = case subscription_tier when 'explore' then 'free' when 'core' then 'plus' when 'elite' then 'pro' else subscription_tier end;` plus `create table if not exists plan_email_queue (...)`. **This is a schema/data change. AGENTS.md requires explicit owner approval; the owner asked for plan emails on 14 Oct, so it's approved in scope. Still run it on a branch database first if Supabase branching is set up.** Also update the web `frontend/src` tier names (`grep -rn "explore\|'core'\|elite" frontend/src --include='*.js*'`) in the same PR, so the website shows Free/Plus/Pro/Family.
- [ ] **Step 6:** Tests pass. **Commit** `feat(billing): v4.1 plan ids, plan-change emails with debounce, legacy ids mapped`

### Task 19.2: App: call the server on switch, show emblems

- [ ] `BetaPlans` switch (Task 2.6): if signed in, also call `api.selectTier(plan.serverId)` (existing endpoint `POST billing/select-tier`, `AiiminApi.kt:121`), with `serverId` = `free|plus|pro|family`. On a network failure, keep the local switch and retry through a Pulse job `PLAN_SYNC` (Phase 15). On success, the toast says "You're on Pro. A confirmation email is on its way."
- [ ] `PlanEmblem` on every plan surface listed above. **Commit** `feat(plans): emblems everywhere; switching confirms by email when signed in`

**Phase 19 acceptance:** switching Free → Pro → Free on a signed-in test account produces exactly one email ("You're on Free", because of the 10-minute debounce, the last state wins), and Free → Pro alone produces "You're on Pro" with the Pro emblem. No email mentions Core, Elite or Explore. The website's plan names match the app.

---

## Phase 14 additions: notification creativity overhaul ("Zomato-level wit, AIIMIN-level kindness")

**What to borrow from the best (Zomato, Swiggy, Duolingo, CRED), and what not:**

| Their move | Ours | Never |
|---|---|---|
| Pop-culture and everyday-life references, short and punchy | Indian everyday life: chai, auto, monsoon, cricket season, Monday, salary day, festival weeks | Mocking the user, body or food shaming |
| Talks like a friend, not a system | First person from Raahi on playful channels ("Raahi here…" at most once a day) | Fake intimacy ("We miss you") |
| Timed to moments (lunch, payday) | Timed to *your* moments: wake, wind-down, the minute you usually tick minimums | Spam timing (every hour) |
| Rotates copy endlessly | ≥ 4 variants per playful rule, plus seasonal packs | Repeating the same line twice in 7 days |
| Guilt pressure (Duolingo owl) | **Rejected.** Gains only | "Your streak will die" |

**Personality dial** (Settings › Notifications › Tone): **Playful** (default) · **Plain**. Plain uses the first variant of every rule, rewritten neutrally (a separate `plain` field per rule). Money, security and emergency are always plain.

**Seasonal and moment packs** (`NotifyCopy.packs`, each active in a date window computed for the year, all optional, never more than 1 seasonal line a day):
- **Monsoon (Jun–Sep, India):** steps → "Rain check on the walk? 2,000 steps around the house counts too."
- **Diwali week:** money budget → "Festive week. Your plan has ₹4,200 left for gifts and sweets." Vault → "Before the cleaning spree: your warranty cards can live here."
- **Holi:** wind-down → "Colours tomorrow, sleep tonight."
- **Exam season (Feb–Mar), opt-in for students:** focus done → "45 minutes in. That chapter's a little less scary."
- **Salary day** (detected from a recurring credit on the 1st or last working day; only if money is used): "Salary's in. Want to set this month's plan before it sets itself?"
- **Monday morning:** brief → "Monday. Pick one thing to make the week easier."
- **Cricket match evenings** (no data needed, skipped by default; opt-in pack): wind-down → "Last over or last scroll? Either way, bed after."
- **New Year week:** weekly review → "A new year, an old you, both welcome. Your 2026 in one screen."

**More playful variants (added to §14.3; every line passes `NotifyCopyTest`):**

| Rule | New variants |
|---|---|
| `day.brief` | "Raahi here. Today looks doable" / "{summary}" · "Tea first. Then this" / "{summary}" · "Small day, big you" / "{summary}" |
| `day.minimums` | "The tiny-version hour" / "{list} Two minutes each." · "Your future self called" / "They said thanks in advance for {first}." · "Low effort, full credit" / "{n} left. The small versions count the same." |
| `day.steps` | "Your step count is shy today" / "{gap} more. A phone call on foot does it." · "The stairs are free" / "{gap} steps to go." |
| `day.focus.done` | "Focus mode: survived" / "{min} minutes on {label}. Finish to keep them." · "That was a proper session" / "{min} minutes. Water break?" |
| `day.winddown` | "Plot twist: sleep" / "{late} on screen since {lateHour}:00." · "The reels will wait" / "They always do. {late} after {lateHour}:00." |
| `vault.expiry` | "{doc} is on its last chapter" / "{inDays}. Renewal usually takes 3 weeks." |
| `vault.backup` | "Your papers would like a spare home" / "Last backup {days} days ago." |
| `score.weekly` | "Week {week}, reviewed by Raahi" / "One screen. Five minutes. Best day was {bestDay}." |
| `first.streak7` | "Seven. In a row." / "Quietly impressive. Raahi is nodding." |

**Test additions:** `no line repeats within 7 days` (simulate 14 days of `pick` per rule and assert no repeat within any 7-day window when the rule has ≥ 4 variants). `seasonal pack lines appear only inside their window`. `plain tone never uses a playful variant`.

---

## Phase 7 additions: transitions worth showing off

Everything in Phase 7 plus:
- **Shared-element continuity** (`SharedTransitionLayout` + `Modifier.sharedElement`): the Today clock shrinks into the Score header when you open Score; a Money hero amount flies into the transaction detail; a vault thumbnail expands to the viewer; a plan emblem flies from the Plans block into the switch sheet; Raahi in the assistant header becomes the Raahi avatar of the first reply.
- **Predictive back everywhere** (Android 14+): the previous screen scales from 0.92 and fades in as the finger drags, and the current screen follows the finger with a rounded corner (`PredictiveBackHandler` progress → `graphicsLayer`).
- **Dock:** the selected tab's icon morphs (outline → filled) over 180 ms, with a 2 dp ink underline that slides between tabs (`animateDpAsState` on its x, spring stiffness 500, damping 0.8).
- **Sheets:** content inside staggers in at 30 ms steps after the sheet settles; the scrim follows sheet height.
- **Numbers:** every changing number rolls per digit (slot-machine roll at 400 ms, tabular figures), including score, money, steps, screen time and plan price.
- **The arc:** when you tick a minimum, a 300 ms soft pulse runs along the solid arc from the left foot to the sun (alpha 0 → 0.25 → 0).
- **Global motion tokens** (`Motion.kt`): `springSnappy (0.8 damping, 500 stiffness)`, `springSoft (0.9, 200)`, `springBouncy (0.6, 380)` for Raahi only. Durations FAST 150, BASE 220, SLOW 300, SHOW 400. A lint test greps `tween(` in `feature/` and fails for durations over 400 outside an allowlist.
- **Frame budget proof:** record each transition with `adb shell screenrecord` + `dumpsys gfxinfo framestats`; the acceptance is 0 janky frames on `AiiminLean` for every transition listed.


---

## Self-review (done while writing)

- **Spec coverage (round 4, 15 Oct):** detailed summary at the top. Zomato-style notification creativity → Phase 14 additions. Screen time and steps per phone → Phase 16. Country/zone-timed gradual sky → Phase 17. Central synchronous engine → Phase 15. Widget with mascot → Phase 12 + 18.4. Mascot in the assistant → 18.3. Best transitions → Phase 7 + additions. Plan names, emblems, prices and emails → Phases 2 + 19. Pending work from earlier plans → Phase 9 + next-plan Tasks superseded by 3/4/17/18. Design fixes → design critique + Phase 8 D1–D8. Honest progress % and finish-one-thing rule → §2 Progress weights + L-N.
- **Spec coverage (round 3, 14 Oct):** quick-read summary at the top. Personal notification engine with pop-ups, in-app inbox, banner, witty but useful copy → Phase 14 (NF1–NF8 each fixed by Tasks 14.1–14.10).
- **Spec coverage (round 2, 14 Oct):** free beta plan switching with prices → D-P1…D-P5 + Task 2.6. Midnight-to-midnight → L-B, Task 1.4. Keep all plans → L-C, Task 2.4 items 5/8. Widget → Phase 12. GitHub commit → Phase 0. APK on the live waitlist → Phase 13.
- **Spec coverage (round 1):** screen-time mismatch → Phase 1 (ST1–ST9 each map to a task). Plan costs invisible → Task 2.4 D-P1. Differences unclear → Task 2.4 (gains over previous plan, compare table, your numbers). Access to features → Tasks 2.1/2.2/2.5. Unfinished app → Phase 9. Interconnection → Phase 5. Irresistible → Phase 6. Transitions/interactions → Phase 7. Boot/logo/arc animation + v3 lag → Phase 3. Gradients for day/evening/night → Phase 4. Minute details → §1.6 + Phase 8.
- **Placeholders:** Phases 5–11 are specified at rule and file level and explicitly expanded into their own task files before execution (scope rule); Phases 1–4 carry full code. Two lookups are deliberate and stated: the benchmark library version (Task 3.4) and the DB version number (Task 1.4).
- **Type consistency:** `ScreenSummary.of/pickups/fmt`, `Feature/Access/Plan.complete/plannedMonthlyInr`, `BetaPlans.effective/switch/mode`, `BillingMode`, `WidgetSnapshot.of`, `ArcBitmap.draw`, `Candidate/Kind/Delivery/Decision`, `NotifyPolicy.decide`, `PolicyContext`, `Personalizer.interest/bestMinute/briefMinute/cap`, `Shown`, `NotifyCopy.pick/catalogue/banned/plainRules`, `NotifySnapshot`, `Freshness/Source`, `DeviceProfile.pick/Profile/DeviceFacts/ScreenStrategy/StepStrategy`, `GapFill.cap`, `SolarClock.sun/SunTimes`, `SkyPlace.resolve`, `MascotState.resolve/MascotInputs/MascotView/Pose/MascotEvent`, `PlanEmblem`, `normalizeTier/changeKind`, `Gate.check/months`, `GateResult.*`, `BootTimeline.at/Frame/TOTAL_MS/enter`, `LocalBootDone`, `SkyClock.at/Sky`, and `Horizons.at(minute)` are used with the same signatures everywhere they appear.

## Remaining owner actions (only the owner can do these)

1. Put the three signing values in `~/.gradle/gradle.properties` (Task 13.1 Step 1). The agent never sees them.
2. Say "yes, merge to main" in chat when the preview page works (Task 13.4 Step 2), because that publishes to aiimin.in.
3. Plug in the phone for the Phase 1 and Phase 11 checks.
4. Approve the companion name **Raahi**, or give another.
