# 04 — User Journeys

## Purpose
Audit major end-to-end human journeys as connected experiences — not screens.

## Confidence
★★★★☆ — Product Bible journeys + friction INT IDs + live route behavior. Runtime timings not measured this pass.

## Evidence Sources
`09_USER_JOURNEY.md`; `friction.md`; `HUMAN_INTENT_GRAPH.md`; web/native source audits; Device-Tiers.

## Files Used
Onboarding, Login, Overview, Journal, Finance, Family, Discipline, Focus, Account, `/m`, native Auth/Home/Journal/Notes.

## Reasoning
Each journey lists current path, emotional arc, abandon points, confidence points, and five-year residue.

## Dependencies
[[02_USER_PERSONAS]] · [[03_INFORMATION_ARCHITECTURE]] · [[14_FRICTION_ANALYSIS]]

## Consumers
Activation redesign, daily loop craft, mobile continuity.

## Known Unknowns
Actual funnel completion rates (telemetry proposed).

---

## Journey index

| ID | Journey | Health |
|----|---------|--------|
| J01 | First contact → waitlist | Healthy (low friction) |
| J02 | Activation (auth → onboarding → first capture) | Critical friction |
| J03 | Opening app / morning planning | Fragmented |
| J04 | Returning user daily loop | Mixed (good cores, noisy shell) |
| J05 | Creating / managing tasks & goals | Heavy create; light execute |
| J06 | Managing life domains (habits/money/calendar) | Domain-dependent |
| J07 | Reading / writing notes | Asymmetric web vs native |
| J08 | Documents / family | High anxiety setup |
| J09 | AI conversations / smart log | Promising, trust-sensitive |
| J10 | Search | Weak / incomplete as OS search |
| J11 | Navigation | See [[05_NAVIGATION_AUDIT]] |
| J12 | Settings / customization | Dual homes |
| J13 | Notifications | Partial |
| J14 | Reviewing progress | Split Insights/Reports/Score |
| J15 | Subscription / tiers | Gate friction |
| J16 | Empty states | Uneven quality |
| J17 | Offline | Partial; native better signaled |
| J18 | Errors / loading / recovery | Toast-heavy |
| J19 | Exit / next day / next month | Weak re-entry design |

---

## J01 — First contact (waitlist)

**Path:** Land `/` → read hero “One screen. Every day.” → pricing/urgency → email submit.

**Emotions:** Curiosity → FOMO (31 Jul / Sep 2026) → mild commitment.

**Confidence:** Clear category pitch; Indian student framing in meta.

**Abandon:** Pricing confusion; “another habit app” skepticism; mobile users told desktop-first.

**Five-year residue:** If waitlist honesty holds (small waves), trust compounds. If hype &gt; product calm, cynicism.

---

## J02 — Activation

**Current path (desktop):**
1. Access granted → Login (Google or email/OS-ID)
2. PIN create/confirm (6-digit)
3. Verify email gate (“Confirm it to save data…”)
4. Onboarding 10 steps: name → OS-ID → PIN again → goals → Life Arc → habits → wake → life mode → baseline score 50 → “Entering Mission Control…”
5. Optional ProductTour (8 chapters)
6. Overview widgets

**Target (Bible):** OAuth → 3-step setup → first capture &lt;3 min.

**Abandon points (ranked):**
1. PIN memory + double PIN (login + onboarding)
2. Goal/habit multi-select decision fatigue (INT-011/012)
3. Life Arc blank page (INT-014)
4. Email verify context switch
5. Tour fatigue before capture

**Confidence points:** Privacy footer; baseline Life Score gives “you exist in the system.”

**Status:** Highest journey risk in the product.

---

## J03 — Morning planning

**Intent:** Know what to do today.

**Current:** Open Overview → ArcBanner → PulseCheck → Weekly Insight / Report card → Logger → Micro-task → Timeline → right-rail Score + Trajectory → mentally open Calendar/Habits/Goals.

**Cost:** 12+ interactions / 4 surfaces (`HUMAN_INTENT_GRAPH`).

**Missing product:** Morning briefing card (Bible target).

**Emotion:** Capable chaos — “lots of signal, no synthesized plan.”

**Delight if:** Logger + habit strip answer the day in &lt;60s.

**Abandon if:** Widget customize becomes the morning ritual.

---

## J04 — Returning daily loop

| Step | Best path | Friction path |
|------|-----------|---------------|
| Open | Today / native Home | Wrong device mental model |
| Wellbeing | Logger / passive future | DailyLog multi-metric (INT-099) |
| Reflect | Journal body | Mode + mood duplicates |
| Execute | Habit toggles | — |
| Close | None designed | Leave mid-widget |

**Protect:** Habit toggle (composite 12), journal mood-only (15), ⌘K logs.

---

## J05 — Tasks / goals / managing life

**Create goal:** 7-field modal (INT-265) — planning overhead.
**Execute habit:** excellent.
**Career pipeline:** CRM intake (INT-493) — student-critical but heavy.
**Calendar event:** 6-field modal; quick-add exists as faster path.

**Five-year:** Users who only create structure on desktop and execute on phone can thrive — if told. Users expecting full create on phone fail (native habit create missing).

---

## J06 — Notes & documents

| Platform | Write | Read/Edit | Mental model |
|----------|-------|-----------|--------------|
| Web Notes | Strong | Sources framing (tour: not second journal) | Reference library |
| Native Notes | FAB compose + draft autosave | Cards not tappable/editable | Broken Keep promise |
| Family docs | Upload + metadata | Vault retrieval | Crisis preparedness |

---

## J07 — Family management

**Setup:** Member add 10+ fields; emergency card 20+ (INT-023/024).
**Emotion:** Anxiety + duty; rare use but high stakes.
**Trust test:** Would you put emergency meds here? Bible says never infer — always ask. UX still fronts a wall instead of wizard.

**Use journey:** Export / wallet — less documented in UI prominence than setup.

---

## J08 — AI conversations / smart capture

**Surfaces:** ⌘K Smart AI Log; Universal Logger; Journal analyze; Lab vocal; Insights copy; ATS.

**Journey:** Free text/voice → wait (“Sorting…”) → routed artifacts → toast “Logged”.

**Trust hinge:** Misclassification destroys Logger confidence for years. Correction chips are mandatory (doctrine) — verify they feel first-class.

**Emotion:** Magic when right; betrayal when money/journal routed wrong.

---

## J09 — Search

Command Palette search filters actions/pages — **not** full personal knowledge search across journal/notes/docs.

Prototype has dedicated Search screen — production lacks OS-grade retrieval. Five-year users with dense archives will feel this gap acutely.

---

## J10 — Settings & customization

**Dual home:** `/account` (8 sections) and `/settings` (legacy-rich). Palette points to Settings for preferences.

**Customization:** Nav pins, persona presets, theme swatches (duplicated across Login/Settings/Account), Overview widget picker.

**Risk:** Customization becomes procrastination identity (“building my OS” vs living).

---

## J11 — Notifications & review

Monday Insight widget = calm coaching surface when present.
Reports/Patterns = review journey.
XP level-up modal = interruptive reward.

**Gap:** No strong “returning next month” digest journey shipped as notification-first experience (Bible lists weekly digest as target).

---

## J12 — Subscription

TierRouteGuard blocks ~8 routes with upgrade modal — same feeling repeated.
Account Subscription section = deliberate billing home.
GuestTour contradiction (“No subscriptions”) harms trust if seen.

---

## J13 — Empty / offline / error / recovery

| State | Quality |
|-------|---------|
| Notes/Finance/Family empties | Often actionable CTAs |
| Overview all-widgets-hidden | Clear recover copy |
| Native Home habits empty | Weak text-only; desktop dependency |
| Offline native | SyncBanner strong |
| Offline web `/m` | IndexedDB queue (Device-Tiers) |
| Errors | Toast-heavy Family; ErrorBoundary generic |
| Journal draft recovery | Partial; native journal lacks notes-like autosave |

---

## J14 — Exit → next day → next month

**Exit:** Little ritual; Focus abandon confirm is one of few intentional exits.
**Next day:** PulseCheck + Today — good hooks if not buried.
**Next month:** Life Score / Reports / Trajectory year % — analytical, not human re-onboarding.
**Risk:** Monthly returnee faces expert UI without “welcome back, here’s what matters.”

---

## Journey emotion map (summary)

```
Waitlist: hope
Auth/PIN: seriousness
Onboarding: homework
First capture: relief
Daily toggle: competence
Dense widgets: fatigue
Family setup: anxiety
Mis-routed AI log: distrust
Discipline urge tool: feeling understood
Brand read: respect
Phone defer-to-desktop: second-class
```

---

## Cross-link
[[14_FRICTION_ANALYSIS]] · [[09_EMOTIONAL_DESIGN]] · [[16_BEHAVIORAL_DESIGN]] · [[17_UX_OPPORTUNITIES]]
