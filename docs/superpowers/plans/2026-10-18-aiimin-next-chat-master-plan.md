# AIIMIN — master plan for the next chat (start here)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use `- [ ]`. Read §0 completely before touching anything. Work **one task at a time**: test → emulator check → commit, then the next. Report progress as **overall app %**.

**Goal:** Make AIIMIN's Android app and its three web pages feel finished and premium.
- **Top priority:** features you can actually find; they're hidden in Settings today.
- **Second:** an exhaustive audit and fix of every app screen, visual first, then logic.
- **New money feature:** name the place you paid, make your own category, say what you bought; AIIMIN remembers it next time.
- **Research:** the 10 UI libraries the owner listed, for components and motion we can use on the web and copy as patterns in the app.

**Architecture:**
- Research runs first, using agent-reach plus the built-in browser. Its output is written to files.
- Fixes come from a numbered issue log, so nothing is "fixed" without a before/after screenshot.
- App work happens in `01-repo/app` (Kotlin/Compose); web work in `01-repo/frontend` (React 19).
- Both stay on branch `feat/native-v4` until the owner says "merge to main".

**Tech stack:**
- **App:** Kotlin 2.3, Compose BOM 2026.06, Hilt, Room 3 (DB v5), Navigation3, WorkManager.
- **Web:** React 19 + Tailwind, framer-motion/motion (already installed), Lenis + GSAP + React Bits (planned).
- **Back end:** Node `server/`, Supabase, Vercel.

---

## 0. Context for a fresh chat (everything you need, with paths)

### 0.1 Where things are
| What | Path |
|---|---|
| Everything AIIMIN | `~/Desktop/aiimin/` (numbered folders; see `README.md`) |
| **Code (git)** | `~/Desktop/aiimin/01-repo` (GitHub `Addy48/AIIMIN`, public, branch **`feat/native-v4`**, draft PR #7; `main` = live aiimin.in) |
| Android app | `01-repo/app/` (debug appId `in.aiimin.app.v4`) |
| Website | `01-repo/frontend/` (React; `src/pages/WaitlistLanding.jsx`, `AndroidApp.jsx`, `Brand.jsx`; routes in `src/App.js`) |
| Server | `01-repo/server/` (Node, `api.aiimin.in`) |
| Obsidian hub | `~/Desktop/aiimin/02-AIIMIN VAULT/` |
| Status (live vs local, progress, log) | `~/Desktop/aiimin/STATUS.md` |
| Hand-over summary | `~/Desktop/aiimin/CONTEXT.md` |
| **This plan** | `01-repo/docs/superpowers/plans/2026-10-18-aiimin-next-chat-master-plan.md` (copy in `03-plans/current/`) |
| App master build plan (phases, weights) | `01-repo/app/docs/superpowers/plans/2026-10-14-aiimin-v4-deep-improvement.md` |
| App improvement plan (screens vs top apps, Raahi, 7 decisions) | `03-plans/current/AIIMIN-improvement-plan-2026-10-17.md` |
| Research behind it | `03-plans/research-2026-10-17/01-mascot-and-today-surface.md`, `02-screens-vs-top-apps.md` |
| Web plan (/waitlist, /app, /brand) incl. the v2 owner answers | `01-repo/docs/superpowers/plans/2026-10-17-waitlist-m-brand-revamp.md` |
| APK verification (17 Oct) | `07-app-versions/apk-builds/VERIFICATION-2026-10-17.md` |
| Skills library (662 skills) | `~/Desktop/skills-library/` (`INDEX.md`; categories UI-Design, Marketing, Product, Research …) |
| Secrets (never commit) | `~/Desktop/aiimin/11-secrets/` |

### 0.2 Devices and commands
- **Owner's phone:** Nothing Phone 2, adb serial `9597fdea`, text scale **1.15×**, PIN lock. Installs: `adb install -r` **only**; never uninstall or `pm clear`.
- **Emulator:** `AiiminLean` (`emulator-5554`). Font scale is set to 1.15 to match the phone. Start it headless:
  `~/Library/Android/sdk/emulator/emulator -avd AiiminLean -no-window -no-audio -no-boot-anim -gpu swiftshader_indirect &`
- **Demo data on the emulator:** `adb shell am start -n in.aiimin.app.v4/aiimin.app.MainActivity --es aiimin_demo load`
- **Open any screen:** `... --es aiimin_go <route>`. Routes: `money inbox budget payments accounts splits recurring payees vault family backups kits emergency me notes note journal calendar focus minimums battery signals score why patterns body phoneday goals weekly debrief planday plantomorrow upcoming notifications activity search settings account sync plans subscription devices moneysettings appearance language help about running privacy trash conflicts captures moodyear assistant`
- **App tests:** `cd 01-repo/app && ./gradlew testDebugUnitTest`
- **Debug APK:** `./gradlew :app:assembleDebug`
- **Release APK** (8 GB Mac, skip lint):
  `./gradlew :app:assembleRelease -x lintVitalAnalyzeRelease -x lintVitalReportRelease -x lintVitalRelease`
- **If Gradle errors with "located outside the root directory"**, the cache still has an old path: `./gradlew --stop; find . -maxdepth 3 -type d -name build | xargs rm -rf; rm -rf .gradle/configuration-cache`
- **Local website + API:** `cd 01-repo && npm run dev`, or double-click `~/Desktop/aiimin/Launch AIIMIN.command`. Web is on `http://localhost:3000`, API on `:3001`.
  - Local runs with `WAITLIST_MODE=false` (the full app); live runs it `true` (the waitlist).
  - **Local uses the same Supabase database as live.**
- **Before every commit:** `gitleaks protect --staged --redact`.

### 0.3 Rules (owner's, non-negotiable)
- One task at a time; tests + emulator check + commit before the next.
- Progress is reported as an overall app %. Current: **≈ 66%**.
- No fake numbers on the website (the owner asked for an inflated waitlist count; the plan uses an honest seats-left counter instead).
- Never type the owner's OS-ID or PIN into live services; the owner signs in himself.
- No schema or auth changes without the owner's OK (the new money fields in §3 are requested by the owner, so they're allowed with a migration and tests).
- Merging to `main` publishes aiimin.in, so only on "merge to main".
- No tool-vendor attribution in commits or docs; credits read "AIIMIN team", contact support@aiimin.in (owner to confirm the mailbox).
- APK to the website **last**, after all app work.

### 0.4 State on 18 Oct
- **Done:**
  - **Measuring:** screen time matches Android (screen-on rule, 113 vs 114 min on the owner's phone); Pulse engine; per-maker measuring and self-check; bank SMS import by month.
  - **Screens:** the Money pace chart; the Settings hub; Vault tools grid; notification de-duplication; OS-ID in capitals; "at 5" = 5 PM; the capture review above the keyboard.
  - **Opening and onboarding:** logo animation + Bodoni wordmark + "One screen, every day."; new onboarding welcome page.
  - **Organisation:** feature catalogue/gates; the `aiimin` folder reorganised.
- **Owner's verdict:** many visual and logic problems are still visible on his phone that we haven't found. **Features are hidden in Settings.** Finding them is now priority 1.
- **Waiting on the owner:**
  - the 7 decisions in the app improvement plan §8 (owner said Raahi = yes);
  - signing passwords;
  - the support mailbox.
- **Running when this chat ended:** the local website (`npm run dev`) was started from this chat and is shown in the built-in browser pane at `http://localhost:3000`.

---

## 1. Order of work

| # | Workstream | Why first | Days |
|---|---|---|---|
| 1 | **Find-ability audit + fixes** (§2) | The owner's top complaint: features exist but can't be reached | 2 |
| 2 | **Exhaustive screen audit, visual then logic** (§4), fix in severity order | The owner sees problems we don't | 3–4 |
| 3 | **Name the place / my category / what I bought** (§3) | Concrete daily pain in Money | 2 |
| 4 | **UI library research** (§5), then apply to the app (patterns) and web (components) | Feeds 2, 5 and 6 | 1 research + ongoing |
| 5 | App improvement plan items: Today rebuild, "+" sheet, Raahi Mini, 7-screen onboarding (`AIIMIN-improvement-plan-2026-10-17.md` §7) | Needs 1 and 2 done to avoid redoing them | 8–10 |
| 6 | Web: /waitlist, /app, /brand (web plan + v2) | Uses the new screenshots from 2 and 5 | 7–8 |
| 7 | Remaining master-plan phases (notifications engine, plans/billing UI, sky, widget, transitions, QA) then **APK on the website** | | rest |

---

## 2. Priority 1 — make every feature findable (stop hiding things in Settings)

**Target rule:** every feature is reachable **within 2 taps from Today**, or **by typing its name in one place**. Settings holds settings only, not features.

### 2.1 Research (agent-reach + browser, ~3 h)
- How top apps expose many features:
  - Apple Settings search;
  - Google app shortcuts (launcher long-press);
  - Things Quick Find;
  - Notion and Arc command bar;
  - Todoist quick add;
  - CRED/Revolut home tiles;
  - Samsung/Nothing "Customise home".
- Output: `06-research/findability-2026-10/notes.md` with 10 patterns, each with a source link.
- **Skills:** UI-Design/`interaction-design`, `better-layout`, `interface-review`; Product/`ux-researcher-designer`; own `critique`/`impeccable`.

### 2.2 Inventory (no code)
- [ ] **Task 2.2.1** Build `04-docs/audits/findability-2026-10.md`: a table of all 58 routes (§0.2 list). Columns:
  - route;
  - feature name in plain words;
  - every current way to reach it;
  - taps from Today;
  - found via search? (Y/N);
  - verdict.
- [ ] **Task 2.2.2** Mark each feature as Core (daily), Weekly or Rare. Core must be ≤ 1 tap, Weekly ≤ 2, Rare ≤ 2 or search.

### 2.3 Fixes (each one: tests where logic exists, an emulator screenshot, a commit)
- [ ] **Task 2.3.1 — Search finds features, not just content.**
  - Where: the `Route.Search` screen (`feature/me` or `app/ui`; find it with `grep -rn "Route.Search ->" app/src feature`).
  - Change: add a "Go to" section built from one registry, `core/designsystem/.../nav/FeatureIndex.kt`, with entries `FeatureEntry(title, keywords, route, icon)` for all routes. Typing "budget", "emergency", "screen time" or "backup" shows them at the top.
  - Unit test: `FeatureIndex.match("emerg")` returns the Emergency card first.
- [ ] **Task 2.3.2 — "+" sheet type-to-open:** the same `FeatureIndex` powers suggestions in the capture sheet when the text isn't a capture ("open budget").
- [ ] **Task 2.3.3 — Today "At a glance" tiles** (Money, Vault, Journal; each hidden when empty): one tap into each area (improvement plan §3 Today item 7).
- [ ] **Task 2.3.4 — Launcher shortcuts** (`res/xml/shortcuts.xml` + `<meta-data android:name="android.app.shortcuts">` in the manifest):
  - Capture;
  - Review payments;
  - Emergency card;
  - Phone day.
  - Deep links already exist through the `aiimin_go` extra.
- [ ] **Task 2.3.5 — Me reorganised** into 4 groups (Workspace, Insights, Family & papers, Account) with a search row at the top; Settings keeps only true settings.
- [ ] **Task 2.3.6 — Header:** at most 2 icons (search, bell); the sync state moves into Me.
- **Acceptance:** re-run the inventory table. Every Core feature ≤ 1 tap, every other feature ≤ 2 taps or found by search; screenshot proof per row.

---

## 3. Money — name the place, make a category, say what you bought (owner's example)

**Owner's story:** "I paid ₹20 at Sanchy. It's a grocery store, I bought a chocolate. Next time the SMS parsing should recognise Sanchy and Grocery automatically, and I only type what I bought."

### 3.1 What exists today (verified in code)
- `PayeeRuleEntity(key, category, ledger, updatedAt, label, alwaysAsk, hits)` in `app/core/database/.../Entities.kt:172`:
  - rules are keyed by the UPI handle and the cleaned name;
  - `MoneyRepository.capture()` applies them; `remember()` stores them.
- Categories are a fixed list: `MoneyRepository.SPEND` (`core/data/.../money/MoneyRepository.kt:34`), with 14 names and no custom ones.
- `TxnEntity` has `note`; `TxnDraftEntity` has no place/item fields.
- The review card is `ReviewCardBody` in `feature/money/.../ReviewInbox.kt:190`. It has category chips and a "Remember" checkbox, but no way to rename the payee, add a category, or say what you bought.

### 3.2 Research (agent-reach, ~2 h)
- How these apps rename merchants, create rules and custom categories, and learn from them:
  - Copilot Money ("rename merchant" + rules);
  - Monarch, YNAB (payee rename);
  - Indian apps: axio/Walnut, CRED, Fi, Jupiter, Paytm (SMS-based);
  - Splitwise and Spendee (custom categories).
- Output: `06-research/money-merchants-2026-10/notes.md`.
- **Skills:** Product/`competitive-teardown`; Marketing/`form-cro` (short forms); UI-Design/`better-writing`.

### 3.3 Design
- **Review card fields, top to bottom:**
  1. Amount + direction.
  2. **"Paid to"**: a text field prefilled with the best name: the rule's `label`, else the cleaned SMS name ("SANCHY ENTERPRISES" → "Sanchy Enterprises"), else the UPI handle. The owner types "Sanchy".
  3. **Category chips**: the most-used first, plus **"+ New"**, which opens a sheet with a name and an icon picker of 12 icons; saved as a custom category.
  4. **"What did you buy?"**: an optional note, with chips for this place's past notes ("Chocolate", "Milk").
  5. **"Remember Sanchy as Grocery"**: on by default.
  6. Confirm. The keyboard's Done also confirms.
- **Next time the same UPI handle or name arrives:**
  - the draft shows "Sanchy · Grocery" already filled, at confidence 0.95;
  - the cursor goes straight to "What did you buy?";
  - one tap confirms.
- **Manage later:** Money settings → "Places & rules" lists the learned places (rename, change category, always ask, forget), and "Categories" lists the custom ones (rename, archive).

### 3.4 Data changes (Room v5 → v6, AutoMigration)
- `PayeeRuleEntity`: add `@ColumnInfo(defaultValue = "") val place: String = ""` (the display name the owner chose; `label` stays for old data) and `@ColumnInfo(defaultValue = "") val lastNotes: String = ""` (JSON, the last 5 notes).
- New `CategoryEntity(@PrimaryKey id: String, name: String, icon: String, kind: String /* out|in */, archived: Boolean = false, createdAt: Long)` + `CategoryDao`.
- `TxnDraftEntity`: add `@ColumnInfo(defaultValue = "") val place: String = ""` and `val note: String = ""`.
- `MoneyRepository.settle(draftId, category, ledger, title, learn)` gains `place: String?` and `note: String?`. The note is written to `TxnEntity.note`, the place to `title`. `remember()` stores `place` and appends the note to `lastNotes`.
- Category list for the chips: `SPEND` + non-archived custom categories, sorted by use count (a query over `txns` grouped by category, last 90 days).

### 3.5 Tasks (TDD)
- [ ] **3.5.1** Test in `core/data/src/test/.../MoneyMemoryTest.kt`. Settling a draft with place "Sanchy", category "Grocery" and note "Chocolate" means the next `capture()` of an SMS from the same UPI handle yields a draft with `title == "Sanchy"`, `category == "Grocery"` and `confidence >= 0.95`. Run it; it fails; implement it; it passes; commit.
- [ ] **3.5.2** Test: a custom category "Pet" appears in `categories()` and survives an app restart (Room in-memory DB test); archived categories are hidden. Implement `CategoryEntity`/`CategoryDao` + v6 migration + schema JSON; commit.
- [ ] **3.5.3** Review card UI (fields from §3.3) in `ReviewInbox.kt` + a "New category" sheet. Emulator: send a test SMS (`adb emu sms send VMHDFCBK "Rs.20.00 debited from A/c XX4421 to VPA sanchy@ybl on 18-10-26. UPI Ref 6291..."`), name it Sanchy / Grocery / Chocolate, then send a second SMS and confirm the prefill. Screenshots; commit.
- [ ] **3.5.4** The same fields when adding or editing a payment by hand (`Route.Txn` detail) and in the capture review ("spent 20 at Sanchy on chocolate" → place Sanchy, note chocolate).
- [ ] **3.5.5** Money settings → "Places & rules" and "Categories" screens.
- **Acceptance:** the owner's Sanchy flow works on his phone; the second payment needs only the item typed.

---

## 4. Priority 2 — exhaustive audit of every screen (visual first, then logic)

### 4.1 Method
- **Device matrix (emulator):**
  - 1080×2412 at font scale **1.0, 1.15, 1.3**;
  - plus a narrow profile (720×1600, 320 dpi ≈ 360dp wide) at 1.15;
  - light theme (the only designed theme).
- **For each of the 58 routes:** capture the top, middle and bottom scroll positions and every sheet/dialog it opens. That's about 250 screenshots in `04-docs/audits/app-audit-2026-10/shots/<route>-<scale>-<n>.png`.
- **Visual checklist** (taken from the skills; every screenshot is checked against all of it):
  - text clipped, wrapped badly or overlapping;
  - content under the status bar or nav bar;
  - touch targets under 48dp;
  - inconsistent margins (not 16/20dp);
  - misaligned baselines or icons;
  - more than one orange element;
  - boxes inside boxes;
  - more than 5 type sizes;
  - contrast under AA;
  - empty states that say nothing;
  - placeholder text left in;
  - wrong plurals;
  - truncated numbers;
  - buttons of unequal width in a row;
  - jumping layouts while loading.
  - **Skills:** UI-Design/`baseline-ui`, `better-layout`, `better-typography`, `better-ui`, `interface-review`, `wcag-audit-patterns`, `mobile-android-design`, `screen-reader-testing`; own `critique`, `audit`, `polish`, `harden`, `typeset`, `arrange`.
- **Logic journeys** (run end to end, checking that data is right):

  | # | Journey |
  |---|---|
  | 1 | Onboarding fresh install |
  | 2 | Capture text and voice |
  | 3 | Bank SMS → review → confirm → Money totals |
  | 4 | Budget pace line vs totals |
  | 5 | Vault add document → expiry reminder |
  | 6 | Minimums tick → score → streak next day |
  | 7 | Focus session with a call |
  | 8 | Phone day vs Digital Wellbeing |
  | 9 | Notifications de-dup and actions |
  | 10 | Settings toggles persisting after restart |
  | 11 | Sign-in/up screen (no real submit) |
  | 12 | Day rollover at midnight (emulator clock) |
  | 13 | Offline behaviour |
  | 14 | Back navigation from every screen (no dead ends, no lost input) |

  - **Skills:** Testing-Quality skills from the library; own `superpowers:systematic-debugging` for every bug.
- **Owner's phone pass** (with the owner, phone unlocked): screen record a walk-through (`adb shell screenrecord`) and compare it with the emulator; real data finds what demo data hides.

### 4.2 Issue log
- [ ] **4.2.1** Create `04-docs/audits/app-audit-2026-10/ISSUES.md`. One row per issue:
  - ID;
  - screen/route;
  - scale;
  - severity (S1 broken/wrong data, S2 clipped/overlapping/unreadable, S3 inconsistent, S4 polish);
  - description;
  - screenshot path;
  - fix commit;
  - after-screenshot.
- [ ] **4.2.2** Fix order: all S1, then S2, then S3, then S4. Each fix gets a commit, and the after-screenshot is added to the log. Nothing is marked fixed without the after-screenshot.
- **Acceptance:** zero S1/S2 open at any font scale on the matrix; the owner's phone walk-through shows none.

---

## 5. UI library research — components and motion for the web and the app

Owner's list: 21st.dev, shadcn/ui, Aceternity UI, Shadcnblocks, Magic UI, v0, HeroUI, daisyUI, Origin UI, React Bits.

### 5.1 How we'll look at them
- **Built-in browser:** live demos, screenshots, a motion check at 60 fps.
- **agent-reach:** GitHub repos (license, stars, React 19/Tailwind compatibility, issues), changelogs, Reddit/X opinions.
- **Login-only parts** (v0 generation, Shadcnblocks paid blocks, React Bits Pro, Aceternity Pro) are **not** accessed. We only note them; the owner decides whether to buy.
- **Output:** `06-research/ui-libraries-2026-10/<site>.md` + `summary.md` (adopt / adapt / avoid).

### 5.2 Per site: what to look for, and how it could be used
| Site | What it is | Look for (web) | Pattern to bring to the app (Compose) | Notes to verify |
|---|---|---|---|---|
| **21st.dev** | Community registry of React/Tailwind components (shadcn-style install), plus "Magic" AI component MCP | Hero sections, pricing, waitlist forms, testimonials, number tickers | Card and list densities, empty states | License per component; install through the shadcn CLI |
| **shadcn/ui** | Base components (Radix + Tailwind) you copy into the repo; registry + blocks | Form, Input OTP (PIN), Dialog/Sheet, Command (cmdk), Sonner toasts, Tabs, Accordion (FAQ) | **Command palette → the "+" type-to-open**; toast + undo; sheet patterns | Needs Tailwind + path aliases; check it works with our CRA/Tailwind setup (Task 5.3.1) |
| **Aceternity UI** | Motion-heavy marketing components (Framer Motion) | Spotlight, text reveal, sticky scroll reveal (for the /app "day story"), bento grid, card hover | Bento grid for Today "At a glance"; text reveal on the opening | Heavy effects: performance budget on phones |
| **Shadcnblocks** | Ready marketing sections built on shadcn | Waitlist hero, feature grid, pricing, FAQ, footer blocks | — | Some blocks are paid; use free ones as layout references |
| **Magic UI** | Animated components (MIT) | Number ticker (seats-left counter), marquee (screens strip), shimmer button, animated beam, bento, "safari/iphone" device mockups | Number ticker → animated counters in the app (Money total, steps); shimmer → skeletons | MIT; check the motion library version |
| **v0 (Vercel)** | AI generator of React/shadcn UI | Fast first drafts of the three web pages from our copy | — | Needs an owner account; optional |
| **HeroUI** (ex-NextUI) | Full React component library on Tailwind | Inputs, OTP, date pickers, toasts | Form states and validation copy | It's a whole library; probably too much next to shadcn; evaluate only |
| **daisyUI** | Tailwind plugin with semantic classes and themes | Theme tokens idea (light/dark parity) | Token naming | Not needed if shadcn is chosen; use as a reference |
| **Origin UI** | Copy-paste shadcn-style components, very strong on inputs | **OS-ID input with live format, PIN/OTP input, password strength, file upload, steppers** | PIN field styling, steppers for onboarding | Best fit for the waitlist form |
| **React Bits** | 215+ animated components (MIT + Commons Clause) | SplitText headline, scroll reveal, one subtle background for /brand, circular gallery for screenshots | SplitText-style word reveal on onboarding titles (Compose port) | No reselling of components; fine for our site |

### 5.3 Tasks
- [ ] **5.3.1** Check `frontend/package.json` and the Tailwind config, then decide the base: shadcn registry (recommended) vs copy-paste only. Record the decision in the web plan.
- [ ] **5.3.2** For each site: up to 5 candidates per page section (waitlist hero, form, social proof/seats, feature story, pricing/perks, FAQ, footer, brand hero, downloads). Each gets a screenshot, a license and a size estimate.
- [ ] **5.3.3** App: list up to 10 motion/component patterns to port to Compose (command palette, number ticker, undo toast, bento tiles, text reveal, skeleton shimmer, segmented progress, OTP field, sticky header collapse, card stack), with where each goes in the app.
- [ ] **5.3.4** Pick final components with the **motion budget**: web phone LCP < 2.5 s, extra JS < 45 KB gzip on /app; app at 60 fps, nothing animating forever, reduced motion respected.

---

## 6. Skills used across this plan (read each SKILL.md before its task)
- **Research:**
  - agent-reach (project-scoped: `01-repo/.agents/skills/agent-reach`, run `agent-reach doctor --json` first);
  - Research/`market-research`, `product-research`, `deep-research`;
  - Product/`competitive-teardown`, `ux-researcher-designer`, `research-summarizer`;
  - Business-Growth/`competitive-landscape`.
- **App UI:**
  - UI-Design/`mobile-android-design`, `baseline-ui`, `better-layout`, `better-typography`, `better-colors`, `better-ui`, `better-writing`, `interaction-design`, `interface-review`, `wcag-audit-patterns`, `screen-reader-testing`, `apple-design` (motion feel), `emil-design-eng`, `animate`, `fixing-motion-performance`;
  - own skills: `impeccable`, `critique`, `audit`, `polish`, `harden`, `clarify`, `distill`, `quieter`, `claude-android-ninja`, `claude-android-skill`.
- **Web:**
  - UI-Design/`design-taste-frontend`, `high-end-visual-design`, `frontend-design`, `responsive-design`, `fixing-metadata`, `tailwind-design-system`;
  - Marketing/`page-cro`, `signup-flow-cro`, `form-cro`, `copywriting`, `copy-editing`, `brand-guidelines`, `seo-audit`, `schema-markup`, `aeo`, `analytics-tracking`, `ab-test-setup`, `launch-strategy`, `referral-program`, `pricing-strategy`;
  - Content-Docs/`avoid-ai-writing`.
- **Process:**
  - superpowers `systematic-debugging`, `test-driven-development`, `verification-before-completion`, `subagent-driven-development`;
  - caveman for terse chat.

---

## 7. Definition of done for this plan
1. **Findability table:** every Core feature ≤ 1 tap, the rest ≤ 2 taps or search, with proof screenshots.
2. **Issue log:** zero S1/S2 at font scales 1.0, 1.15 and 1.3 and at 360dp width; the owner's phone walk-through is clean.
3. **Sanchy flow:** works on the owner's phone; the second payment needs only the item.
4. **UI library summary:** written and the picks made; at least 5 Compose pattern ports done in the app.
5. **Release:** a release APK installed on the owner's phone; STATUS.md logged; progress % updated.

## 8. First three moves in the new chat
1. Read §0. Run `git -C ~/Desktop/aiimin/01-repo status -sb` (expect `feat/native-v4`), start the emulator, check `adb devices`.
2. Start the local website if it's not running (`npm run dev` in `01-repo`) and show `http://localhost:3000` in the browser pane.
3. Begin Task 2.2.1 (the findability inventory).
