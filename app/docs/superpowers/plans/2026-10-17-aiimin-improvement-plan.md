# AIIMIN improvement plan: every screen, the companion, and what to build next

17 Oct 2026. One file to read and react to. It is based on:
- screenshots of every screen on the emulator at your phone's text size (1.15×);
- the raw usage events from your Nothing Phone 2;
- two research reports written today (full detail and every source link):
  - `03-plans/research-2026-10-17/01-mascot-and-today-surface.md`: the companion, Today and the "+" sheet, about 18 apps compared;
  - `03-plans/research-2026-10-17/02-screens-vs-top-apps.md`: all nine screens against about 50 top apps, with exact layouts in dp.

**How to answer:** reply with a ✓ or ✗ against the numbered decisions in §8, or just write "do it all". Then I build in the order in §7.

---

## 1. Fixed today (on your phone now)

| You reported | Cause | Fix |
|---|---|---|
| Screen time 2 h 23 m vs phone 1 h 54 m | The Clock app's charging screensaver (`DreamActivity`) starts **after** the screen turns off. AIIMIN counted it (18 min today), plus call screens behind the proximity sensor | Time now only counts while the screen is on. Replayed on your real events: **113 min vs your phone's 114 min** |
| "2042 unlocks" | The stored count is 42 (your phone also says 42). The number ran into the screen-time figure in the old cramped stat line | The stat line is rebuilt as three columns, value over label; nothing runs together |
| "Focus" splitting into "FOC / US" | Your phone uses 1.15× text; the line was built for 1.0× | Three equal columns that always fit: score, minimums, focus |
| "Later" stacked vertically in the keep-alive card | Three buttons squeezed into one row | Main button full width; "What's running" and "Later" share the row below |
| "Plan tomorrow" showing as "Plan" | Button labels were clipped | Labels shrink a step at large text instead of being cut, for every button in the app |
| Voice text written over "Spent 240 on lunch…" | The example didn't hide while listening | The example hides as soon as you speak |
| Logo animation without the name | — | **AIIMIN** in Bodoni Moda Bold (your website's brand face), then "One screen, every day." |
| "1 pickups", "Re-m" cut off on Phone day | Plural bug; footer row too tight | Fixed |

Also done on 17 Oct:
- **Visual fixes:** nothing runs under the clock anymore; there are no repeated notifications; Settings lists every page; Vault tools show as a grid.
- **Bank messages by month:** past bank SMS can be brought in from a month you pick.
- **Onboarding:** a new welcome page.

---

## 2. What's wrong across the whole app (the six root problems)

Fixing these six makes more difference than redesigning any single screen.

1. **Orange does about nine jobs:** section labels, links ("See all", "Edit", "Turn on", "All tasks"), warnings, badges, the bells on minimums, the Emergency chip. Top apps (Copilot, Linear, Things) give their accent at most two jobs.
   **Rule:** orange means only **"now" or "needs you"**. Links become ink with a ›, and section labels become ink at 60%.
2. **Boxes on boxes.** Bordered cards sit on a page that already has dividing lines, and Review even fakes a stacked-deck shadow.
   **Rule:** group with space and one soft tone; a single card is allowed per screen, for the one thing to act on.
3. **Too many type sizes:** about nine on Today alone. Copilot and Things use about five.
   **Rule:** one 7-role scale used everywhere:
   - Display 40 (one per screen, numbers)
   - Title 28 (screen title)
   - Headline 17 (row emphasis)
   - Body 15
   - Label 12 caps (section names)
   - Caption 13
   - Numbers: Funnel with tabular figures
4. **Fixed columns clip text:** a 40dp time column next to long task names, "Emergency c…", "Late-night screen time starts" squeezed beside its chips.
   **Rule:** at 1.15× and above, side details drop **below** the title instead of squeezing it. Every row is tested at 1.0×, 1.15× and 1.3×.
5. **Headers carry four or five icons** (sync cloud, search, assistant, bell, +). Things, Structured and Apple Journal use one or two.
   **Rule:** search (which also opens the assistant) plus the bell. Sync state moves to Me.
6. **Too much on each screen.** Today has eleven sections with no single order. Top apps order a home screen by **time** (now, later, tonight), not by feature, and hide empty sections completely.

---

## 3. Screen by screen: what top apps do, and what AIIMIN becomes

The exact layouts (heights in dp, type roles, spacing on an 8dp grid) are in research file 02. Here's the decision-level summary.

### Today (home)
- **Now:** a big clock, the day arc, the wrap-up card, a stat line that repeats the card, a second card ("Measure your day"), Later today with a "task" label on every row, the same item repeated three times, minimums with camera icons, a pinned note, battery, screen time and sleep, and a "Recent" log.
- **Learn from:**
  - **Things 3:** one list, split into Today and This Evening.
  - **Sunsama:** the evening ritual appears once as a banner, then leaves.
  - **Google At a Glance:** one context line, not a list.
  - **Apple Fitness:** three goals as small segments with numbers.
  - **Todoist:** overdue items fold into one row.
  - **Tiimo:** no red, no guilt.
- **Becomes:**
  1. Header: day + date, plus search and bell.
  2. **Clock, slightly smaller (56sp), with Raahi Mini beside it** (decision 1).
  3. One context line: "Next · Call the CA · 4:30" by day, "Wrap up your day · 2 min" after your day ends. This is the only orange thing on the screen.
  4. Day arc, kept as AIIMIN's signature but slimmer (72dp).
  5. Minimums as three segments with "1 of 3 kept" (this replaces both the stat line and the card headline).
  6. **Today** list with a fixed time gutter and no "task" labels, a folded "From yesterday · 4" row, and an "Evening" section with an inline "+ Add for evening".
  7. **At a glance**, one line per area, hidden when empty: "Spent ₹540 · 2 to review", "Passport renews in 41 days", "Journal: not yet".
  8. Pinned note, two lines.
- **Removed:**
  - the duplicate stat line;
  - the "Recent" log (moves to Activity);
  - the permanent "Measure your day" card, which becomes one dismissible line, then lives in Me › Phone data;
  - score and battery, which move to the header line and to Me.

### "+" quick capture
- **Now:** a 29sp input, three buttons and a separate review step. The example text overlapped your speech (fixed today).
- **Learn from:**
  - **Google Keep:** the keyboard or mic is live the moment the sheet opens.
  - **Todoist:** parsed pieces show inline as chips before saving.
  - **Superhuman and Raycast:** typing also searches commands.
  - **Apple Journal:** suggestions show while the field is empty.
- **Becomes:**
  1. Field focused on open, with the mic on the right; long-press "+" opens straight into voice.
  2. **Live chips** as you type or speak: `₹240 · Food · Expense` and `Call Ravi · 5 PM · Task`. Tap a chip to edit it, swipe it to drop it. The button reads "Save 2 items", and an "Undo" toast replaces the separate review step.
  3. Six quick types, used when you're not typing: Task · Expense · Note · Minimum · Journal · Scan document.
  4. Up to three suggestions while the field is empty, for example "Review 2 bank SMS" or "Mark Walk done".
  5. **Every feature reachable by typing its name:** "budget" opens Budget, "emergency" opens the emergency card. This is how AIIMIN shows all its features without cluttering Today.

### Money
- **Now:**
  - two pill bars stacked (ledger and range);
  - the new chart (good) but a crowded page under it;
  - Review: 14 category chips with "Other" preselected even for a cinema payment, plus a fake card stack.
- **Learn from:**
  - **Copilot and Monarch:** pace line plus range tabs under the chart.
  - **CRED Charcoal:** a calm money area with offers kept separate.
  - **Splitwise and YNAB:** review as a list.
  - **Revolut:** an "Everyone" picker for ledgers.
- **Becomes:**
  1. Ledger picker as one small "Personal ▾" in the header.
  2. Chart.
  3. Range tabs under the chart.
  4. "Needs you · 6 to review" row.
  5. Biggest payments.
  6. Accounts, moved into Money settings.
  - **Review becomes a list:** the category is guessed (food apps → Food, cinemas → Fun), there's a "Confirm all 6" button, and the raw SMS sits behind "Show message".

### Vault
- **Now:**
  - seven person chips;
  - an "All 1" count next to "6 documents";
  - the "Me" filter doesn't apply to Expiring soon;
  - a strange capsule icon on document rows.
- **Learn from:**
  - **Apple Wallet and Google Wallet:** documents as clean cards.
  - **1Password and Bitwarden:** one "Everyone ▾" picker instead of chips.
  - **DigiLocker:** document types as list rows.
- **Becomes:**
  1. Header: Vault plus "Everyone ▾".
  2. Search.
  3. **Emergency card pinned row** (the only orange here).
  4. One "Needs attention" row ("Car insurance renews in 12 days").
  5. Recently opened as a horizontal strip of document cards.
  6. Document types as list rows (Insurance 2 · ID 3 · Vehicle 1 …).
  7. Vault tools (the grid shipped today).

### Me and Settings
- **Now:** Me is about 30 rows and repeats Settings.
- **Learn from:**
  - **Apple Settings (iOS 18):** search first.
  - **Revolut and Telegram:** a one-row profile plus shortcut tiles.
  - **Linear:** plain group names with explanations moved into footers.
- **Becomes:**
  - **Me:** profile row, three tiles (Score · Streak · Battery), Workspace (Notes, Journal, Calendar, Goals, Weekly review), You (Phone day, Body, Patterns, Family, Emergency card), and one "Settings" row.
  - **Settings:** search on top, then eight groups: Account, Plan, Notifications, Phone data, Money, Assistant, Look, Privacy & data.

### Notifications (inbox and phone pop-ups)
- **Now:**
  - repeats (fixed today);
  - copy like "0-day streak carries on";
  - every row is the same; there are no actions.
- **Learn from:**
  - **GitHub and Slack:** one row per topic that updates instead of stacking.
  - **Linear:** swipe to dismiss or snooze.
  - **Swiggy, Zomato and Duolingo:** short, specific push copy with one action.
- **Becomes:**
  - grouped by Today / Earlier, one row per topic, swipe actions, and "Mark paid / Done / Snooze" right on the row;
  - the full engine from the master plan (Phase 14): it learns your times, sends at most 4 nudges a day plus one evening summary, keeps the lock screen private, writes witty lines where it's safe and plain ones for money;
  - a rewrite table of every message is in research file 02, §5.

### Onboarding
- **Now:** ten steps, four permission asks on one page, and the first useful moment comes at step 8.
- **Learn from:**
  - **Duolingo and Finch:** one question per screen.
  - **Opal:** an instant report from your phone ("you picked up your phone 42 times today").
  - **Headspace:** calm pacing.
- **Becomes seven screens, about 60 seconds:**
  1. Hello (Raahi waves).
  2. Your day (wake and sleep times draw the arc).
  3. Up to three minimums.
  4. **Try capture** with "spend 240 on lunch and call Ravi at 5", which shows the two chips. This is the "aha" moment.
  5. Bank SMS, optional, with a plain explanation before the system prompt.
  6. How chatty Raahi should be (Full / Quiet / Off).
  7. Done: Raahi shrinks into its spot beside the clock.
  - Name and date of birth move to step 1's second half; one permission per screen.

### Phone day and Score
- **Phone day:**
  - **Learn from:** Apple Screen Time, Digital Wellbeing, Opal and Oura.
  - **Becomes:**
    - a stat trio (Screen time · Unlocks · Notifications);
    - hourly bars with a "usual" band;
    - top apps with "Other apps" (done);
    - "Checked against your phone" (done);
    - one "Connect steps and sleep" row instead of three sections of dashes.
- **Score:**
  - already the strongest screen;
  - needs a palette fix (no blue band, no green deltas) and Oura-style contributor bars.

---

## 4. The companion (Raahi)

**Recommendation: "Raahi Mini", a character, not a pet** (full reasoning in research file 01).

**Why not a pet:**
- Pets (Finch, Habitica) run on care loops, where neglect makes the pet sad.
- A study of Habitica found harmful side effects for every participant.
- That breaks AIIMIN's no-guilt rule.

**Why Raahi:**
- You drew and named it.
- "Raahi" (traveller) fits "raah" (path), and the day arc is a path.
- Its green hood is exactly AIIMIN's existing "done" green (#2F6B4F), so it adds no new colour.

**What it looks like on Today:**
- A flat two-tone glyph, **28dp**, to the right of the clock on the AM/PM baseline: a green hood, a cream face and two ink eye-pills, with no mouth.
- At 28dp it reads as a silhouette, the way Nothing OS icons do.
- Tap it for a small sheet with one hello line, today's summary, and "Talk" (opens "+" in voice).

**Where the full-size Raahi appears:**
- onboarding;
- empty screens ("Nothing to review. Raahi is resting.");
- the end-of-day close;
- the home-screen widget (a static pose).

**States:**

| State | When | What it does |
|---|---|---|
| Waking | First open after your wake time | Opens its eyes, 0.6 s, once a day |
| Idle | Default | Blinks every 6–12 s, barely moves; static with Reduce motion |
| Thinking | "+" is parsing what you said | Looks up-right, until the parse returns |
| Noticing | First capture of the day, new bank SMS | One nod, at most once an hour |
| Settle | All minimums done, inbox empty, journal saved | Happy eyes "^ ^" for 1.2 s, at most twice a day |
| Sleeping | 30 min before your sleep time | Eyes closed, a tiny "z" |

There are deliberately **no sad, hungry or disappointed states.** If nothing got done, Raahi simply goes to sleep on time.

**Hard rules:**
- **Animations:** at most 3 a day.
- **Speech:** one line per app open at most.
- **Notifications:** none from Raahi by default.
- **Tips:** a type of tip disappears after you dismiss it twice (the Clippy lesson).
- **Settings:** Full / Quiet / Off, with **Quiet as the default**. Long-press it for "Hide for today".

**Build:**
- **Today glyph:** plain Compose drawing (no new library, a screenshot test per state).
- **Onboarding and celebration:** one Rive file, used only if it adds under ~1.5 MB to the app; otherwise Lottie.
- **Never** put the 3D render on Today; it's for the Play Store and marketing.

**Alternatives if you don't want a character:**
- **B, "The Sun":** the arc's orange dot gets two eyes and rides the arc (Headspace's Dot idea).
- **C, "Raahi walks the arc":** Raahi replaces the dot and walks along today's path (a later experiment).

---

## 5. Showing all features without clutter

**Where each feature lives:**
1. **Today shows one line per area, only when it has something to say.** Money, Vault and Journal each get at most one line in "At a glance". Empty means hidden.
2. **The "+" sheet is the doorway to everything:** capture by voice or text, the six quick types, and **type any feature's name to open it**. This is the Superhuman and Raycast pattern, and it scales to every feature without adding a single button.
3. **The bottom bar stays four tabs plus "+"** (Today · Money · Vault · Me).
4. **Me is the map:** every tool sits in four clear groups, and Settings has search.

**When features show:**
- New features appear first as one suggestion in "+" ("Try: scan a document into the Vault").
- After that, they live in Me.

---

## 6. Screen-time engine: status and the rest of the work

**Done:**
- calendar-day window;
- debounced unlocks;
- screen-ons for phones with no lock;
- per-maker gap fill;
- Digital Wellbeing's own time excluded;
- the screen-on rule from today;
- the self-check against your phone.

**Next, so it stays right on every phone:**
1. **Nightly self-audit.** Once a day, compare AIIMIN's total with the phone's own daily summary. If they differ by more than 5% for 3 days, re-check which method fits this phone and say so in "How AIIMIN is running".
2. **More system screens to ignore:** lock-screen widgets, the always-on display, charging screensavers on other makers (Samsung "Clock style", MIUI). They're detected by class names like `*Dream*` and `*Ambient*`.
3. **On your phone:** keep the debug event export for one more week, then remove it.
4. **Steps:** your 2,326 steps match your phone to within ±2. Steps were also "not visible" for you on Today: the Health Connect permission prompt shows on Today until it's granted. **Open Me › Phone data and tap "Steps and sleep" once.**

---

## 7. Build order (after you answer §8)

Each item ends with a build on your phone.

| # | Work | Days |
|---|---|---|
| 1 | **Global design pass:** the 7-role type scale, the orange rule, cards → space, collapsing header, side details drop below titles at large text, header icons 2 max. Every screen tested at 1.0×, 1.15× and 1.3× | 2 |
| 2 | **Today rebuilt** as in §3 (clock + Raahi Mini slot, context line, minimum segments, one list, At a glance) | 2 |
| 3 | **"+" sheet rebuilt:** live chips, quick types, suggestions, type-to-open any feature | 2 |
| 4 | **Raahi Mini** (Compose glyph, six states, Quiet default, settings) + **onboarding in 7 screens** | 3 |
| 5 | **Money and Review list**, **Vault** layout | 2 |
| 6 | **Me + Settings with search**, **notifications inbox** with actions | 1.5 |
| 7 | **Notification engine** (master plan Phase 14) | 4 |
| 8 | **Plans screen** with prices and free beta switching (Phase 2 rest), plan emails (Phase 19) | 3 |
| 9 | Living sky, home-screen widget with Raahi, transitions, remaining screens, final checks | rest of master plan |
| 10 | **Last:** release-signed APK on aiimin.in | 0.5 |

---

## 8. Decisions for you

1. **Companion:** Raahi Mini beside the clock (recommended) / The Sun on the arc / none.
2. **Raahi's default:** Quiet (recommended) / Full / Off.
3. **Today's clock and arc:** keep them but slimmer (recommended) / remove them like Things does (research file 02 suggests this, but they're AIIMIN's signature).
4. **Hinglish lines for Raahi** ("Suprabhat"): yes / no.
5. **Rive for the onboarding Raahi** (adds ~1–1.5 MB): yes / Lottie instead.
6. **Tagline under the logo:** "One screen, every day." (set now), or another.
7. **Public APK app id:** separate beta id beside your dev build (recommended) / keep `.v4`.

The raw research, with sources, is in `03-plans/research-2026-10-17/`. This plan is also in the repo at `01-repo/app/docs/superpowers/plans/2026-10-17-aiimin-improvement-plan.md`.
