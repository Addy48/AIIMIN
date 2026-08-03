---
authority: operations
derived_from: Genesis · 17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-HANDOFF
tags:
  - type/handoff
  - domain/build
  - status/active
---

# Handoff — Native Android app V3, from scratch, screen by screen

> Paste §3 into a new chat. §1–2 are grounded recon and the stack decision — do not re-derive.

## 1. Founder decisions (2026-08-03, locked)

- **Build from scratch.** `native-android/` (V2) is the **old app**. Its design is superseded —
  the Drafting Table language landed after it was written. Not to be extended.
- **Stack: Kotlin + Jetpack Compose**, native, Android-first. Chosen over Expo/RN and Compose
  Multiplatform for the native ceiling — real gestures, haptics, no webview, full control of
  the Drafting Table look. No corner cutting.
- **Old app kept as reference only.** 40 hand-written Kotlin files stay on disk at
  `native-android/`. Its **build caches were deleted** (420 MB → 38 MB). Read its
  `sync/`, `session/`, `security/` and `data/network/` for the API contract that already works
  against prod — **do not copy any `ui/`**.
- New project path: **`native-android-v3/`**. V2 is retired once V3 reaches parity.

## 2. Constraints that shape the build

- **The machine is 8 GB RAM with ~70 % of swap in use.** Android Studio + Gradle daemon +
  emulator together will not fit comfortably. Configure `gradle.properties` for a small heap,
  prefer `assembleDebug` + `adb install` on a **physical phone** over an emulator, and push
  release builds to the GitHub Actions runner that already exists.
- **There is no Android emulator MCP** in this environment (the simulator MCP is iOS-only).
  Verification is `./gradlew` output + `adb` + screenshots, or the founder installs and looks.
- **Life Score taxonomy — DECIDED 2026-08-03, the Score screen is unblocked.** Five
  dimensions, keys `physical · cognitive · discipline · financial · emotional`, labelled
  **BODY · MIND · DISCIPLINE · MONEY · MOOD**. Read `GET /intelligence/lhs`; the client
  **never** recomputes the score. → [[10_DECISIONS/2026-08-03-life-score-taxonomy]]

### Design source of truth

`frontend/prototypes/AIIMIN-Drafting-Table.html` — the finished 10-screen prototype, opens
offline in a browser. Tokens: `frontend/src/prototypes/drafting-table/tokens.css`.

Port these to a Compose theme exactly — **palette and type are founder-approved and LOCKED**:

| Token | Dark | Light |
|---|---|---|
| bg | `#15171a` | Industry sheet (see tokens.css `[data-theme="light"]`) |
| surface | `#1c1f23` | |
| text | `#e4e5e7` | |
| **accent** | `#749dc4` | `#416180` |
| hairline / rule | `#26292e` / `#353a41` | |
| muted | `#8b9098` | |
| danger | `#e8735c` | |
| brand spark | `#ff6b35` — **the peak-A brand node only**, never a UI accent | |

Type: **Barlow Condensed** (chrome/headings) · **Barlow** (body) · **JetBrains Mono**
(every numeral). Square corners; radius on buttons only. Spacing scale is 3.4 px based.

## 3. Paste this into the new chat

> I'm Aaditya, building **AIIMIN** — a Personal Life OS. Live web app at aiimin.in (React 19 +
> CRA, Node/Hono API, Supabase/Postgres, Better Auth with OS-ID + PIN). Repo:
> `/Users/aaditya/Desktop/DASHBOARD PROJECT`.
>
> **I want the Android app built from scratch, in Kotlin + Jetpack Compose, one screen at a
> time — you build a screen, verify it, commit it, then move to the next one on your own.
> Never scaffold several screens at once. No corner cutting.**
>
> **Read first, in order, then confirm you've read them:**
> 1. `docs/knowledge/00_ROUTING.md` — the "for X, read exactly this file" index
> 2. `docs/knowledge/15_MEMORY/Handoff-Native-App-Build.md` — §1 and §2 are decided; use them, don't redo them
> 3. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md` — guardrails G1–G10, follow them literally
> 4. `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md` §3 — each screen written as a build unit (one job → contents → data → done-when)
> 5. `docs/knowledge/Maps of Content/Genesis.md` → `Genesis/P8 Master Specification/` — constitutional
>
> **Use the Android skills that are installed** — invoke `claude-android-ninja` (and
> `claude-android-skill` for architecture) before writing code. Don't freestyle the setup.
>
> **Stack — decided, don't re-litigate:** Kotlin + Compose, Android-first, from scratch at
> `native-android-v3/`. I want the modern proper setup, not a tutorial project:
> Gradle **version catalog** (`gradle/libs.versions.toml` — the old app had none), Kotlin 2.x
> with the Compose compiler plugin, **Hilt** DI, **Room 3** (KSP, SQLiteDriver, Flow/suspend
> DAOs), **Navigation3**, DataStore for prefs, WorkManager for the offline queue, Retrofit or
> Ktor with kotlinx.serialization, Coil, multi-module by feature, MVVM/UDF with immutable UI
> state, and real tests (unit + Compose UI). Material3 is the substrate only — the visual
> language is mine, not Material's.
>
> **The old app `native-android/` is reference only.** Its design is superseded — **do not copy
> anything from its `ui/`**. Do read its `sync/`, `session/`, `security/` and
> `data/network/ApiModels.kt`: that API contract already works against production, and
> re-deriving it wastes a day.
>
> **Design is locked.** Match `frontend/prototypes/AIIMIN-Drafting-Table.html` — open it and
> look at it before building any screen. Tokens are in
> `frontend/src/prototypes/drafting-table/tokens.css`; port them to a Compose theme exactly.
> Accent is steel `#749dc4` dark / `#416180` light. `#ff6b35` is the single brand spark on the
> peak-A mark and nothing else. Barlow Condensed for chrome, Barlow for body, JetBrains Mono
> for **every numeral**. Square corners, hairline borders. Don't redesign colours or type;
> craft, layout and motion are open.
>
> **Build order — finish each completely before starting the next:**
> 0. **Foundation** — project, version catalog, theme (both dark and light), typography, the
>    brand peak-A mark, base components (surfaces, buttons, empty states), the 5-tab shell
>    **DAY · MONEY · CAPTURE · LAB · CONFIG**, navigation, and a debug build that installs.
> 1. **Capture** — the trust surface, build this most carefully of all. Free text → AI parse →
>    editable chips (amount · category · merchant · people · mood · duration) → **SETTLE**
>    commits with an UNDO toast, or **DRIFT** holds it uncommitted. Nothing writes without an
>    explicit Settle. A wrong parse must be correctable in ≤2 taps. Offline queues into Hold.
> 2. **Today, capture-first** — the capture composer and the one-small-thing micro-task lead;
>    Life Score and the read grid sit *below*. Genesis GOV-106/GOV-165: Today is not a
>    dashboard, and there is no Dashboard surface.
> 3. **Money** — Overview (safe-to-spend, spend bar, categories) · Budgets · Ledger.
> 4. **Config** — brand hero · OS-ID · XP/rank · Life Arc · life modes · sync state · prefs · data.
> 5. **OS-ID** — part-number card, spec (8 chars, uppercase, max 4 digits, one lifetime revision).
> 6. **Onboarding, 6 steps** — welcome · sign in · claim OS-ID · set Arc · pick ~5 daily
>    minimums · first capture. **No Weekly Pulse** (rejected), no tour stacked on the first screen.
> 7. **Journal** — Free Write / CBT / Morning Pages / Weekly Review, 1–5 mood, saved history.
> 8. **Lab** — correlations (ρ, q, n) + scatter + one plain-English line per pair.
> 9. **Live Score** — rail + ladder, "what moved the number", settle the day. The taxonomy is
>    **decided**: five dimensions, keys `physical · cognitive · discipline · financial ·
>    emotional`, shown as **BODY · MIND · DISCIPLINE · MONEY · MOOD**. Read the figure from
>    `GET /intelligence/lhs` — **never recompute it on the client**, or the phone and the web
>    will disagree. See `docs/knowledge/10_DECISIONS/2026-08-03-life-score-taxonomy.md`.
>
> **Per screen, this exact loop — don't skip a step:**
> state the screen's ONE job → build it → `cd native-android-v3 && ./gradlew :app:assembleDebug`
> → show me the **real** build output → verify it renders (adb screenshot, or tell me to
> install and I'll look) → note the evidence in the build tracker → commit with a clear
> message → say what's next → **start the next screen without waiting for me**. Only stop if
> you're genuinely blocked or a step says to ask me.
>
> **Machine warning:** I'm on 8 GB RAM with swap already ~70 % full. Don't run an emulator
> alongside Gradle — tune `gradle.properties` for a small heap and target my physical phone
> over `adb`. If a build is going to be heavy, say so first.
>
> **Rules:** data goes through `/api/*` with the session cookie — never direct PostgREST,
> never a client-supplied user id; any new table needs both `USER_SCOPED_TABLES` and an RLS
> policy in the same migration. Never type my PIN or any credential — I type it. No
> destructive action on my real account or data without asking. Genesis is constitutional;
> every surface declares one job. **Evidence before claims — no "done" without real build
> output.** Use caveman mode.

## Related

- [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]] · [[17_NATIVE_APP_V2/WORKFLOW-PLAN]]
- [[15_MEMORY/Handoff-Website-Hardening]] · [[00_ROUTING]]
