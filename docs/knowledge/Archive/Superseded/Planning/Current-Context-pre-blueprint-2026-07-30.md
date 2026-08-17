---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: context
note_type: NT-CONTEXT
migration_batch: W6
tags:
  - type/hub
  - domain/ops
  - status/living
---

# Current Context


> [!tip] Agent
> Boot: Home → this Context → only Touch paths. Proof-or-stop on claims.

> [!danger] Do not
> See Do not section below. Never edit Genesis or frozen UXA/UXI from here.


**Date:** 2026-07-30 · **Branch:** `main`

## Today

**V1 BLUEPRINT WRITTEN** — [[Roadmap/AIIMIN-V1-Blueprint]] (2663 lines, §0–§23). Single implementation source: IA, onboarding, all feature specs, Life Graph schema, API, AI, privacy TPA, sync, AWS target, web↔app unity, states/edge cases, tests, roadmap W0–W13, open decisions OD-01…16 + ADR-B1…B5. Backlog below stays the raw capture list; Blueprint is the structured version.

**V1 app brainstorm — ACTIVE** (not prototype-for-others; ship full v1). Founder: depth hero, monotone UI, health sync, money UPI, family vault, docs OS, calendar. Track here only — no new MD sprawl.

**Personal OS prototypes v5-opus — reference only** — five HTML directions; v1 builds real app (web + native), not demo shortcuts.

**Mobbin MCP** — wired (`user-Mobbin`); rule `aiimin-mobbin-mcp.mdc`. Use for design/brainstorm/flows. **Blocked:** account needs Mobbin paid plan (auth OK; searches return paywall).

### V1 master backlog (living — append only)

**Pillar A — Visual / eye comfort (user feedback: dark hurts; want monotone)**
- [ ] **Soft Dark skin** — not pure `#1a1a1a`/`#2d2d2d`; lift to warm gray stack (e.g. bg `#222326`, card `#2e3035`, border `#3a3d44`) — same accent `#ff6b35`, done `#10b981`
- [ ] **Monotone discipline** — one neutral ramp + accent + semantic green/red only; kill rainbow calendar/event chips in v1 or mute to gray + tiny accent dot
- [ ] **Contrast cap** — body text max ~87% white on dark; muted `#9ca3af` not harsh gray-on-gray
- [ ] **Dim mode** — optional extra step below dark (OLED-safe, lower blue)
- [ ] **Font scale** — Settings slider (small / default / large) — users ask this constantly
- [ ] **Reduced motion** — already spec'd; ship everywhere including depth hero

**Pillar B — Today hero: Depth / Human Momentum**
- [ ] Depth meter tied to execution minimum (habits + log + focus block)
- [ ] States: submerged → rising → surface → glide (streak week)
- [ ] Recovery path when sinking (micro-task, urge surfacing) — never guilt-only

**Pillar C — Health & body (native-first; web read-only)**
- [ ] **Health Connect** (Android): steps, distance (km), active minutes, sleep (if available)
- [ ] **Distance fallback** — if OEM gives steps only: `km ≈ steps × stride`; stride from height in profile or default 0.75m; show "estimated" badge
- [ ] **OnePlus / OEM** — read via Health Connect aggregator (not OnePlus SDK); document "install Health Connect + sync OEM health"
- [ ] **Screen time** — Android `UsageStatsManager` (permission + onboarding); daily total + top apps + vs yesterday; optional weekly cap nudge
- [ ] **Today widgets** — steps ring, km walked, screen time chip, sleep last night
- [ ] **Life Score domain** — wire Sleep + movement into score (already in model; finish pipeline)
- [ ] **Water / meds / mood** — quick log on Today (small things users miss)
- [ ] **Family health** — meds, allergies, vitals in vault (Pro)

**Pillar D — Money (India-first, privacy-first)**
- [ ] UPI SMS / notification parse (Android; opt-in scope)
- [ ] Bank statement PDF/CSV upload + AI categorize + user confirm queue
- [ ] Manual + Universal Logger routes
- [ ] Subscriptions tracker (Netflix, Spotify, EMIs)
- [ ] Split / household tagging (family member on tx)
- [ ] Bill due reminders
- [ ] Privacy: local parse option, delete import, never train on raw SMS copy
- [ ] **Lend & borrow ledger** — person-linked IOU: amount, date, reason, partial repayments, reminder nudges, link to Family contact + UPI tx auto-match when "received from X"
- [ ] **Debt you owe** — mirror side (borrowed from friend, CC outstanding as liability line)
- [ ] **Net position per person** — "Rahul owes you ₹2,400" rollup on Finance + Family person card
- [ ] **Formal loans** — bank EMI vs informal lend separate types; amortization for EMIs

**Pillar K — System brain (everything interlinked)**
- [ ] **Life Graph** — entities: Person, Event, Tx, Habit, Doc, Journal, FocusSession, VoiceSession, HealthDay; edges typed (paid_to, about, blocked_by, practiced_for)
- [ ] **Universal references** — any record can `@link` another (note → person → loan → calendar reminder)
- [ ] **Context threads** — tap any entity → "everything AIIMIN knows in context" timeline (not social feed)
- [ ] **Cross-domain triggers** — e.g. missed English habit + placement deadline → Today card; loan overdue + calendar nudge
- [ ] **One Life Score** — weights from graph activity, not siloed widgets
- [ ] **Logger routes graph** — "lent 500 to mom" → Lend ledger + Family person + optional calendar follow-up
- [ ] **Depth hero reads graph** — execution = habits + focus + voice drill + movement, not checkboxes only
- [ ] **Search = graph query** — "Rahul money" → txs + loans + docs + notes
- [ ] **Weekly insight = graph walk** — narrative across domains, cite sources (trust)

**Pillar L — English & voice (v1 flagship — elevate Lab Vocal Mastery, no corner cuts)**
*Existing seed:* `VocalMastery.jsx`, `SpeakingTopics.js`, `vocal_scorecard` AI — **promote from Lab experiment → core v1 module** (still under Lab route or own `/voice` — TBD)

**Modes**
- [ ] **Spark 60s** — random topic, timer, record, instant scorecard
- [ ] **Deep 3min** — structured: hook → 2 points → close; AI times sections
- [ ] **Debate** — AI takes opposite side, rebuttal rounds (exists — deepen)
- [ ] **Shadow** — listen to native clip → repeat → compare waveform/pace
- [ ] **Word of day** — new word + use in 30s sentence + AI checks usage
- [ ] **Accent drills** — phoneme packs (TH, V/W, stress patterns); minimal pairs; Indian-English → neutral professional target (user choice, not judgment)
- [ ] **Placement lane** — HR + technical prompts tied to Career kanban ("interview in 3 days" → daily drill plan)

**Scoring & feedback (full depth)**
- [ ] Transcript (on-device or server per privacy toggle)
- [ ] Metrics: WPM, filler count (um/like/actually), pause length, sentence length variance
- [ ] **Vocabulary lift** — words used vs CEFR band; suggest 3 upgrade words per session
- [ ] **Pronunciation flags** — highlight words from accent pack; replay clip
- [ ] AI scorecard: confidence, clarity, pace (exists) + grammar notes + one rewrite of best sentence
- [ ] **Session history** — streak, total minutes, topic coverage heatmap
- [ ] **Personal word bank** — words you struggled with → spaced repetition in Lab flashcards

**Habits & system links**
- [ ] Habit: "English 3min" counts toward Depth + Life Score + Discipline streak
- [ ] Calendar block: "Voice practice" before placement interview event
- [ ] Journal prompt post-session: "What felt hard?"
- [ ] Career: link session to company/application card
- [ ] Native: mic permission, background noise hint, Bluetooth mic OK

**Content**
- [ ] Expand `SpeakingTopics.js` — debate, daily, accent scenarios, "explain your project", storytelling
- [ ] Founder-curated **Indian professional English** track (meetings, email tone, standup update)
- [ ] Other languages: stub only ("coming") — English v1 complete first

**English proficiency system (Pillar L — rating & curriculum)**
- [ ] **AIIMIN English Index (AEI)** — single 0–100 + CEFR band (A1→C2) shown on profile + Voice home; not vanity — computed from sessions
- [ ] **Skill tree** — Speaking, Listening, Vocabulary, Grammar-in-speech, Fluency (WPM/pauses), Pronunciation (accent packs), Professional register
- [ ] **Per-skill level** — each branch 1–10 with clear "what unlocks next"
- [ ] **Placement test** — 10min onboarding optional: read aloud + 60s topic + 3min debate lite → baseline AEI + CEFR
- [ ] **What you know** — word bank size, topics covered heatmap, debate wins, HR prompts completed
- [ ] **What to learn next** — daily **prescription**: "Today: TH drill + 1 debate + 5 words from bank" (system picks gaps)
- [ ] **Gap analysis** — filler rate trending down, vocab band stuck B1 → push C1 words in sessions
- [ ] **Progress graph** — AEI over 30/90 days; milestone badges at CEFR boundaries (honest, no fake XP)
- [ ] **Goal modes** — placement / daily fluency / accent reduction / meeting English → changes curriculum weights
- [ ] **Read-only certificate export** — PDF "AEI 62 · B2 · 40h practice" for LinkedIn (optional, Pro)

**Pillar N — People (real contacts, one graph)**
- [ ] **Unified People** — not separate "Family" vs random; one contact model with roles: family, friend, colleague, lender, emergency
- [ ] **Import** — Android Contacts (READ_CONTACTS opt-in), Google People API (OAuth), manual add, vCard import
- [ ] **Merge** — dedupe by phone/email; "same person?" confirm UI
- [ ] **Person card** — photo/initials, phone, email, relationship, last interaction, linked: lends, txs, docs, calendar, notes
- [ ] **Quick actions** — call, WhatsApp deep link, add lend, log expense split, schedule follow-up (swipe row)
- [ ] **UPI match** — phone/name fuzzy match incoming SMS tx to contact
- [ ] **Birthday / anniversary** — from contacts or manual → calendar + Today nudge
- [ ] **Relationship ledger** — last called, last messaged (manual log or optional call log permission later)
- [ ] **Family vault** — subset of People flagged household + doc sharing rules
- [ ] **Privacy** — contacts never sold; sync encrypted; delete import; show exactly what's stored

**Pillar O — Motion-first UX + retention**
- [ ] **Gesture grammar** — swipe right = complete/done, left = snooze/archive, long-press = context menu, pull = refresh/sync
- [ ] **Bottom sheets** — edit lend, log habit, voice session result — not full page navigation for small actions
- [ ] **Horizontal carousels** — Today open loops, people owing money, next voice drills — thumb zone
- [ ] **Drag reorder** — habits, Today widgets, nav pins
- [ ] **Haptic + micro-motion** — habit check = tick + light haptic; depth rise = smooth 400ms Y shift
- [ ] **One-thumb native** — primary actions bottom 40% screen; no top-right-only destructive
- [ ] **Web desktop** — keep clicks + ⌘K; tablet gets swipe where natural
- [ ] **Continuous flows** — voice session → scorecard → word bank add → next drill without 4 page loads
- [ ] **Smart defaults** — resume last voice mode; pre-fill lend person from last tx

**Retention system (cross-cutting)**
- [ ] **Daily minimum** — 3 actions (habit + log + voice OR steps) → depth surface; streak visible but recovery-friendly
- [ ] **Weekly rhythm** — Monday insight, Sunday replay, mid-week lend/doc reminders
- [ ] **Streak freeze** — 1/month earned (Discipline) — reduces churn shame
- [ ] **Return hook** — push/email: "Rahul repayment due" / "AEI +2 this week" / "open loop: 1 tx" (calm, not casino)
- [ ] **Progress you can see** — AEI graph, km month, money saved, depth glide — reason to open even on bad habit day
- [ ] **Empty day salvage** — 60s Spark English still counts → user leaves with win
- [ ] **Widget** — Life Score + one tap habit + voice shortcut on home screen
- [ ] **Onboarding deposit** — baseline AEI test + import 3 contacts + one habit + one lend demo = system feels real day 1

**Pillar M — Out-of-box (v1 if ambitious)**
- [ ] **Life replay** — Sunday 90s auto-montage: steps, money, voice mins, depth arc (private, on-device render option)
- [ ] **Anticipation engine** — "Thursday you usually miss gym" from graph
- [ ] **Commitment contracts** — pledge ₹ to charity if habit broken (opt-in, serious mode)
- [ ] **Reverse calendar** — work backward from goal date (placement, exam, wedding)
- [ ] **Energy budget** — map focus blocks + screen time + sleep → "you have 2 deep slots left today"
- [ ] **Relationship ledger** — not just money: last called mom, last thank-you note (gentle, optional)
- [ ] **Inbox zero for life** — unified "open loops" queue: unconfirmed tx, unsigned doc, unreplied lend, unscored voice session
- [ ] **Scenario simulator** — "if I save ₹5k/mo + cut Swiggy" finance what-if tied to real tx patterns
- [ ] **Meeting prep card** — pulls calendar event + notes tagged #client + last txs if expense meeting
- [ ] **Walk & talk** — voice drill only unlocks when steps > 500 (tie movement + English)
- [ ] **Night debrief** — 3 questions voice journal; feeds insight + depth recovery
- [ ] **Copy tone rewriter** — paste WhatsApp/email → professional English (Lab utility)
- [ ] **Read aloud** — import note/article → TTS pace match challenge

**Pillar E — Family vault & doc safety**
- [ ] People, relationships, emergency contacts (existing — deepen)
- [ ] Doc types: ID, insurance, health, vehicle, school, property
- [ ] Expiry reminders + renewal calendar events
- [ ] Vault PIN / biometric on open (native)
- [ ] Household visibility matrix (who sees what)
- [ ] PAN/Aadhaar secure fields (show/hide, copy timeout)

**Pillar F — Documents OS**
- [ ] In-app: PDF view, DOCX read, XLSX table view
- [ ] Upload → vault; link to Family / Career resumes
- [ ] Share sheet → AIIMIN (receipt, PDF)
- [ ] OCR receipt → finance tx draft
- [ ] Google Drive watch (notes path exists — extend)

**Pillar G — Calendar**
- [ ] Google Calendar **two-way** sync (native + web)
- [ ] Sync status always visible; last sync time
- [ ] Conflict UI (keep Google / keep AIIMIN)
- [ ] Execution blocks from Focus → calendar
- [ ] Family shared calendar layer (v1: export ICS / shared Google cal link)

**Pillar H — Small things users feel missing (competitor + support patterns)**
- [ ] Global search (notes, tasks, tx, docs, journal)
- [ ] Undo on destructive actions
- [ ] Offline queue everywhere native touches
- [ ] Android home widget (log habit, life score)
- [ ] Snooze reminders (not just dismiss)
- [ ] Recurring habits/tasks clarity
- [ ] Timezone-aware calendar + travel
- [ ] Export all data (JSON/CSV) one tap
- [ ] Quiet hours for notifications
- [ ] Haptics on complete (native)
- [ ] Voice log / hands-free capture
- [ ] Pinch user nav (already spec — ship with personas)
- [ ] Empty states that teach one action
- [ ] Honest "last synced" on every sync'd domain

**Pillar I — Intelligence (tier-gated but v1 surfaces exist)**
- [ ] Weekly insight, journal AI, money categorize assist
- [ ] Cross-domain: "low steps + missed habits + late sleep" pattern card
- [ ] AI preview/confirm before writes (trust)
- [ ] **Graph-native insight** — every AI output cites linked records (see Pillar K)

**Pillar J — Platform**
- [ ] Web desktop = full OS
- [ ] Native = rich companion (health, SMS money, screen time, vault, calendar)
- [ ] `/m` = capture only (unchanged product lock)
- [ ] Widgets, biometrics, WorkManager sync (native ~92% — finish P0 gaps)

**Open decisions**
- Soft Dark tokens: Founder approve palette extension vs strict P8 lock
- iOS v1 scope: HealthKit + Screen Time API limits (read-only widgets may lag Android)
- SMS parsing legal copy + Play Store declaration
- English module route: `/lab` submodule vs top-level `/voice` (IA — user mental model "Learning")
- Voice audio storage: on-device only vs encrypted cloud replay (privacy)
- Accent target: neutral international vs US/UK pick list
- People vs Family IA: unified People hub with Family as filter vs keep `/family` route
- Google People API scope vs device contacts only on v1

**Deferred to post-v1 only if forced**
- Real-time multi-user family editing
- Full Excel/Word **editing**
- Social graph / public feeds

## HIGH PRIORITY — Privacy & trust (web + native one system)

**Problem:** `aiimin.in` (marketing + web OS on Vercel) and native app (Play Store) are different surfaces; **one** `user_id`, API (`api.aiimin.in`), Postgres (Supabase). Users must trust both; legal + technical must match.

### Adopt: Tiered Privacy Architecture (TPA) — recommended default

| Tier | Data | Default handling |
|------|------|------------------|
| **T0 Public** | Waitlist email, landing analytics (if any) | Minimal; consent banner before non-essential |
| **T1 Account** | Auth, OS-ID, tier, session | Better Auth; RLS; no ads |
| **T2 Life OS** | Habits, goals, calendar meta, finance structured | Cloud sync; encrypt at rest; export + wipe (exists: `/api/account/export`, `wipe-life-data`) |
| **T3 Sensitive** | Contacts, UPI/SMS raw, voice audio, health | **On-device process first**; cloud only opt-in; raw SMS never retained |
| **T4 Ultra** | Journal, vault docs, family IDs | Path to **E2E** (device keys); `encrypted_content` already on journal mobile |

### Architecture options (pick per domain — not one-size)

| Option | What | Pros | Cons | AIIMIN fit |
|--------|------|------|------|------------|
| **A Cloud-default** | All sync to API/DB | Simple; cross-device | Trust burden | T2 baseline (current) |
| **B Local-first** | Room/DataStore canonical; cloud backup | Privacy; offline | Sync conflict hard | T3 native SMS/contacts parse |
| **C On-device-only** | Never upload raw | Max trust | No web view of that data | SMS parse, optional voice |
| **D E2E** | Server stores ciphertext only | Journal/vault gold standard | Key loss = data loss; hard search/AI | T4 roadmap; journal seed exists |
| **E Hybrid TPA** | Classify per field | Best UX + trust story | Eng complexity | **RECOMMENDED v1** |

### Web vs app — unity rules

- [ ] **One privacy policy** — defines Services: website, web Life OS, native app, API
- [ ] **One account** — Settings on web = source of truth for export/delete/consent (native deep-links)
- [ ] **Consent registry** — server table: `user_id + scope + surface + granted_at` (contacts, SMS, health, voice_cloud, AI)
- [ ] **Marketing ≠ product** — waitlist cookies/analytics separate from logged-in app; no cross-site tracking
- [ ] **Play Data Safety + web `/privacy`** — must match actual native permissions (no policy drift)
- [ ] **OAuth scopes split** — login Google ≠ Calendar Google ≠ Contacts Google (separate connect buttons)
- [ ] **Permission rationale screens** — native before system dialog; web before OAuth

### Per-feature privacy options

**UPI / SMS money**
- O1 On-device parse → only structured tx uploaded
- O2 Server parse → raw discarded immediately after extract
- O3 Manual + statement upload only (no SMS)
- **v1 pick:** O1 default on Android; O3 always available

**Contacts / People**
- O1 Device contacts read → store hash + display name + user-selected links only
- O2 Google People API with minimal scope
- O3 Manual entry only
- **v1 pick:** O1 + O3; O2 optional; never sell/share; delete import wipes copies

**Voice / English**
- O1 Audio stays on device; transcript + scores only sync
- O2 Encrypted blob storage for replay
- O3 Cloud transcribe delete-after-session
- **v1 pick:** O1 default; O2 opt-in Pro

**AI / intelligence**
- O1 No training on user data (policy already claims — enforce in contracts)
- O2 Prompt minimization — send aggregates not raw journal
- O3 User "AI off" mode — rules-only insights
- O4 BYOK (bring own API key) elite optional
- **v1 pick:** O1 + O2; O3 toggle in Settings

**Health (steps, screen time)**
- O1 Daily aggregates only (steps, km, minutes) — no app-level upload
- O2 Full Health Connect sync
- **v1 pick:** O1 aggregates to server; detail stays on device

### Compliance targets

- [ ] **India DPDP** — purpose limitation, consent, grievance officer, data principal rights (access/delete)
- [ ] **Google API Limited Use** — already in Privacy.jsx; audit all Google scopes
- [ ] **Play Store** — Data safety form, sensitive permissions justification
- [ ] **GDPR-ready** — export, delete, lawful basis documented (even if India-first)
- [ ] **Legal review** — native doc 17 flagged; update Privacy/Security for v1 features (SMS, contacts, voice)

### User-facing trust (retention + honesty)

- [ ] **Privacy dashboard** in Settings — "What AIIMIN holds" per tier + last sync + size estimate
- [ ] **Per-domain toggles** — SMS, contacts, health, voice cloud, AI
- [ ] **Activity log** — "AIIMIN accessed calendar at 9:02" (no content)
- [ ] **Wipe life data** + **Delete account** — already API; surface prominently native + web
- [ ] **Plain-language** — `/brand` storage ledger updated for v1 data types
- [ ] **No dark patterns** on consent — reject = feature off, not broken app

### Open decisions (privacy)

- E2E journal v1 vs v1.1
- DPO / grievance contact legal entity
- GA4/Sentry — consent-first before launch (blocker in Home)
- Supabase region + EC2 region alignment (India latency + DPDP narrative)
- Voice audio retention TTL if O2 enabled

### Do not

- Claim E2E without key recovery UX
- Upload raw SMS/contacts to train models
- Single OAuth mega-scope for Google
- Different delete behavior web vs app


**Brain OS Implementation** · W0–W6 **vault/config executed**  
[[Roadmap/Brain-OS-Implementation/00_INDEX]] · evidence [[Roadmap/Brain-OS-Implementation/W6_Validation_Evidence]] · metrics [[Roadmap/Brain-OS-Implementation/06_Living_Metrics]]

| Item | Status |
|------|--------|
| Program V1 design | **COMPLETE · FROZEN · PUBLISHED** |
| Wave W0–W6 (agent vault/config) | **EXECUTED** — see validation evidence |
| Official GES ≥8.5 claim | **blocked** (directional proxy only) |
| Genesis / UXA / UXI | **UNTOUCHED** |
| Founder UI (trust plugins · save Founder workspace · hotkeys) | **remaining** |

## Next

1. Open Obsidian vault `docs/knowledge/` → trust/enable Community plugins (5 listed)  
2. Save workspace layout **Founder**; bind hotkeys per [[16_DOCUMENTATION/Obsidian-Hotkeys-KOS]]  
3. Smoke Dataview on [[Dashboards/01_Executive-Dashboard]] + `qa-bug` once  
4. Commit when Founder asks  

## Do not

- Rewrite frozen Program V1 · edit Genesis · bulk-edit UXA/UXI  
- Claim GES ≥8.5 / “all KPIs shipped” without [[06_Living_Metrics]] numbers  

## Touch

- `Roadmap/AIIMIN-V1-Blueprint.md` ← V1 implementation source
- `Roadmap/Brain-OS-Implementation/W6_Validation_Evidence.md`
- `Roadmap/Brain-OS-Implementation/06_Living_Metrics.md`
- `Dashboards/00_Founder-Workspace-Index.md`
- `Operations/Collision-Register.md`
