# AIIMIN — Product Intelligence Layer (Phase 2)

**Status:** Complete product intelligence pass  
**Date:** 2026-07-11  
**Source:** `docs/interaction-audit/fields.md`, `forms.md`, `friction.md`, `duplicate_patterns.md`, vault feature notes  
**Field count:** 94 documented fields (80 from master field table + 14 audit-discovered)

---

## Purpose

This document answers, for every user-facing field AIIMIN collects, why it exists, which product surfaces consume it, how important it is, whether AI can infer it, what passive signals could replace manual entry, engineering cost, privacy cost, and the recommended future interaction pattern.

**Consumers referenced throughout:** Overview/Today, Daily Log, Journal, Habits, Goals, Finance, Calendar, Family Vault, Focus/Pomodoro, Discipline, Notes, Insights, Reports, Life Score (teaser/marketing + future composite), Command Palette AI, Universal Logger, Gamification (XP/ranks/quests), Identity/Arc, Placements, Lab modules, Account/Settings, Waitlist.

**Importance scale (1–10):** 10 = product breaks without it; 1 = cosmetic or rarely used.

**AI infer %:** Estimated confidence that a well-instrumented AIIMIN could populate the field without asking, given current + near-term signals.

---

## Summary Matrix by Feature

| Feature | Fields | Avg Importance | Avg AI Infer % | Top Kill Candidates |
|---------|-------:|---------------:|---------------:|---------------------|
| Auth | 5 | 9.0 | 15% | — (security) |
| Onboarding | 6 | 7.5 | 55% | wakeTime, selectedHabits[] |
| Waitlist | 2 | 6.0 | 75% | name |
| Daily Log | 14 | 7.2 | 62% | mood, gym, learning_hours |
| Journal | 3+ | 8.5 | 70% | mood, mode fields |
| Habits | 5 | 7.0 | 35% | category, color, emoji |
| Goals | 6 | 8.0 | 45% | priority, pillar, title |
| Finance | 6 | 8.5 | 68% | category, type, date |
| Calendar | 5 | 7.5 | 55% | title, allDay, recurrence |
| Family | 10 | 6.5 | 25% | document.label |
| Placements | 8 | 6.0 | 50% | stage, application_date |
| Focus | 3 | 6.5 | 45% | rating, linked goalId |
| Discipline | 3 | 7.0 | 50% | intensity, replacement_habit |
| Notes | 2 | 5.5 | 65% | title |
| Account | 4 | 5.0 | 60% | location, bio |
| Settings | 3 | 4.5 | 75% | theme, pinnedNav[], persona |
| Feedback | 2 | 4.0 | 55% | category |
| Lab Addiction | 3 | 5.0 | 35% | intensity |
| Command Palette | 2 | 9.0 | 85% | — (capture is the point) |

---

## Auth

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| email | Identity anchor, recovery, waitlist correlation | Auth, Waitlist, Account, all API scoping | 10 | 15% (OAuth only) | OAuth profile email | Low | Medium (PII) | No | No | Partial (OAuth) | OAuth-first; email only on fallback path |
| password | Email auth credential | Auth | 9 | 0% | — | Low | High (secret) | No (if email auth kept) | No | No | Passkey/WebAuthn primary; password optional |
| confirmPassword | Prevent typo on signup | Auth | 7 | 0% | — | Low | Medium | Yes (with passkey) | No | No | Eliminate with magic link / passkey |
| PIN (4) | Fast re-auth on return visits | Auth, session guard | 8 | 0% | Biometric | Medium | Medium | Partial | No | No | OS biometric replaces PIN |
| PIN (6) | Onboarding security ritual | Onboarding | 7 | 0% | Biometric | Medium | Medium | Partial | No | No | Defer to Settings; biometric default |

---

## Onboarding

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| fullName | Display identity, personalization | Account, Navbar, Reports header, Family emergency card | 8 | 85% | OAuth name, email parse | Low | Low | No | Yes (post-OAuth) | Yes (OAuth) | Prefill silently; confirm only if empty |
| username | Unique handle, social future | Account, leaderboard (future) | 6 | 55% | Email local-part | Medium (availability API) | Low | Partial | Yes | No | Auto-suggest; skip if OAuth-only |
| selectedGoals[] | Bootstrap Goals pillar + Insights domains | Goals, Insights, Life Score, Onboarding persona | 8 | 60% | First-week behavior, journal NLP | Medium | Low | Partial | Yes | Yes (behavior) | Infer from first captures; offer edit |
| selectedHabits[] | Seed Habits page | Habits, Overview widgets, Gamification streaks | 7 | 55% | Goals mapping, calendar blocks | Medium | Low | Partial | Yes | Yes | Create habits from inferred routines |
| wakeTime | Morning briefing, habit reminders | Calendar suggestions, Focus scheduling (future) | 5 | 45% | First app open time, sleep log | Low | Low | Yes | Yes | Yes | Infer from 7-day open pattern |
| lifeArc | North-star identity statement | Identity page, ArcBanner, Insights narrative, Reports | 8 | 50% | Goals + journal themes over 2 weeks | Medium | Medium (personal) | No | Yes | Yes (AI draft) | AI drafts arc from captures; user edits once |

---

## Waitlist

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| email | Waitlist queue, confirmation email | Waitlist, Auth handoff | 9 | 90% | Browser autofill | Low | Medium | No | No | No | Single field submit |
| name | Personalize confirmation email | Waitlist email templates | 4 | 60% | OAuth if logged in | Low | Low | Yes | Yes | Partial | Optional collapsed field |

---

## Daily Log

*Includes fields from `fields.md` plus audit-discovered metrics from Daily Log MOC.*

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| mood | Emotional baseline for day | Overview, Insights, Life Score, Reports, Journal sync, Discipline context | 8 | 75% | Journal NLP, voice tone, typing speed | Medium | Medium | Partial | Yes | Yes | Infer from journal; mood strip optional confirm |
| sleep_hours | Recovery metric | Overview, Insights, Life Score, Reports | 7 | 70% | Wearable, phone idle, bedtime calendar | Medium | Low | Partial | Yes | Yes | HealthKit/Oura import; manual override |
| gym | Physical activity flag | Overview, Habits cross-check, Life Score, Reports | 6 | 50% | Calendar "gym" events, location, habit toggle | Low | Low | Partial | Yes | Yes | Infer from habit + calendar |
| learning_hours | Growth metric | Overview, Insights, Goals (learning pillar) | 6 | 65% | Focus timer duration, DSA logs | Medium | Low | Partial | Yes | Yes | Auto-sum from Focus sessions |
| breakfast | Nutrition rhythm (desktop) | Overview, Reports | 4 | 40% | Time-of-day log patterns | Low | Low | Yes | Yes | Partial | Remove from daily form; infer rarely |
| steps | Movement proxy | Overview, Reports | 5 | 85% | Phone/wearable pedometer | Medium | Low | Partial | Yes | Yes | Passive import default |
| water | Hydration tracking | Overview | 4 | 30% | — | Low | Low | Yes | Yes | No | Kill or smart-watch only |
| energy | Subjective vitality | Overview, Insights correlations | 6 | 60% | Sleep + mood model | Low | Low | Partial | Yes | Yes | Infer; tap only if wrong |
| brain_fog | Cognitive load signal | Overview, Discipline, Insights | 5 | 55% | Session abandon rate, typing errors | Medium | Medium | Partial | Yes | Yes | NLP from journal |
| headache | Health symptom | Overview, Reports | 4 | 40% | — | Low | Medium | Yes | Yes | No | Voice capture only when mentioned |
| wins | Positive events | Overview, Command Palette win log, Gamification XP | 7 | 70% | Journal sentiment, palette logs | Medium | Low | Partial | No | Yes | Unified win capture router |
| DSA | Coding practice count | Overview, Lab DSACounter, Goals | 6 | 80% | Lab session auto-log | Low | Low | Partial | Yes | Yes | Auto from Lab module |
| reset_counter | Discipline/clean streak | Overview, Discipline, Gamification | 7 | 60% | Discipline logs, habit failures | Medium | Medium | Partial | No | Yes | System-maintained streak |
| journal (link) | Cross-link daily reflection | Overview → Journal | 6 | 90% | Journal entry existence | Low | Low | Yes | No | Yes | Auto-link if journal saved |

---

## Journal

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| body | Primary reflective capture | Journal, Insights NLP, Life Score narrative, Reports excerpts, Command Palette routing | 10 | 0% (user content) | Voice STT | Low | High (encrypted) | No | No | No | Single capture bar; no mode gate |
| mood | Entry-level emotion | Journal, Daily Log sync, Insights, duplicate 5 surfaces | 7 | 80% | Sentiment NLP on body | Medium | Medium | Partial | Yes | Yes | Infer; show chip to correct |
| mode fields (CBT) | Structured therapeutic prompts | Journal structured modes, Insights tags | 5 | 55% | Sentiment + topic classification | High | High | Partial | Yes | Yes | AI applies CBT tags post-capture |

---

## Habits

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| name | Habit identity | Habits, Overview, Gamification streaks, Discipline replacement | 9 | 0% | — | Low | Low | No | No | No | Natural language create: "meditate 10m" |
| emoji | Visual scan aid | Habits list, Overview chips | 3 | 25% | Name semantics | Low | None | Yes | Yes | Yes | Auto-assign from name |
| category | Grouping/filter | Habits matrix, Insights | 4 | 60% | Name NLP ("run" → fitness) | Low | Low | Yes | Yes | Yes | Infer category silently |
| color | Visual differentiation | Habits UI | 2 | 20% | Category palette | Low | None | Yes | Yes | Yes | System palette from category |
| description | Context for future self | Habits detail, AI recommendations | 4 | 50% | Name expansion | Low | Low | Yes | Yes | Yes | AI-generated description optional |

---

## Goals

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| title | Goal identity | Goals, Focus link, Insights, Reports, Life Score | 9 | 30% | User must name intent | Low | Low | Partial | No | No | NL capture: "Ship AIIMIN by Sep" parses title |
| pillar | Life domain taxonomy (4 pillars) | Goals filter, Insights domain, Reports segmentation | 7 | 55% | Title NLP, journal themes | Low | Low | Partial | Yes | Yes | Infer pillar; show badge |
| priority | Sorting/attention | Goals sort, Command Palette suggestions | 5 | 50% | Deadline proximity, mention frequency | Low | Low | Yes | Yes | Yes | **Kill** — infer from behavior |
| targetDate | Deadline pressure | Goals, Calendar suggestions, Reports | 7 | 45% | Milestone dates, NLP "by Friday" | Medium | Low | Partial | Yes | Yes | Parse from natural language |
| why | Motivation anchor | Goals detail, Identity arc, Insights coaching | 6 | 50% | Title + journal | Low | Medium | Partial | Yes | Yes | AI drafts "why" from captures |
| milestones[].text | Progress decomposition | Goals progress %, Life Score, Reports | 7 | 65% | AI decomposition of goal title | Medium | Low | Partial | Yes | Yes | AI proposes milestones; user confirms |

---

## Finance

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| amount | Transaction value | Finance, Reports, Life Score (money pillar), Insights | 10 | 0% | Receipt OCR | Low | Medium | No | No | Partial (OCR) | Voice: "spent 450 on groceries" |
| type | Income vs expense | Finance charts, Reports, budgets | 8 | 70% | Sign, merchant type, NLP | Low | Low | Partial | Yes | Yes | Infer from phrasing |
| category | Budget segmentation | Finance, Reports, Insights spending patterns | 8 | 85% | Merchant NLP, note, history | Medium | Low | Partial | Yes | Yes | **Kill manual default** — confirm chip |
| account | Account attribution | Finance multi-account, net worth | 7 | 65% | Last-used account, merchant | Low | Low | Partial | Yes | Yes | Default last account |
| date | Temporal accuracy | Finance, Reports, tax export | 8 | 95% | Today default, SMS timestamp | Low | Low | Partial | No | Yes | Default today; change rare |
| note | Context/memo | Finance search, AI categorization | 5 | 60% | Receipt OCR, voice | Low | Medium | Partial | Yes | Yes | Optional voice tail on amount |

---

## Calendar

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| title | Event identity | Calendar, Overview today strip, Focus scheduling | 9 | 40% | NLP quick-add | Low | Low | Partial | No | Partial | Quick-add NL: "dentist 3pm" |
| start/end | Temporal bounds | Calendar, Habits time blocks, Reports time use | 9 | 55% | Duration defaults, NLP | Medium | Low | No | No | Partial | Infer end = start + 1h default |
| allDay | Full-day events | Calendar views | 5 | 70% | Missing time in NLP | Low | None | Partial | Yes | Yes | Infer when no time parsed |
| recurrence | Repeating events | Calendar, Habits rhythm | 6 | 30% | Habit patterns | Medium | Low | Partial | Yes | No | Ask only when pattern detected |
| color | Visual category | Calendar UI | 3 | 50% | Event type/pillar | Low | None | Yes | Yes | Yes | System color from inferred category |

---

## Family Vault

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| member.name | Identity | Family, emergency card | 9 | 0% | — | Low | Medium | No | No | No | Required once per member |
| member.relation | Relationship graph | Family, emergency card | 7 | 10% | — | Low | Low | No | No | No | Keep — legal/emergency context |
| member.DOB | Age calculations | Family, emergency | 6 | 5% | — | Low | Medium | Partial | Yes | No | Ask when adding dependent |
| member.blood_group | Medical emergency | Emergency card | 7 | 0% | — | Low | High (health) | No | Yes | No | Progressive disclosure emergency flow |
| member.phone | Contact | Emergency card | 7 | 40% | Contacts API (opt-in) | Medium | Medium | Partial | Yes | No | Import from contacts optional |
| document.file | Vault storage | Family docs | 8 | 0% | — | Medium | High | No | No | No | Upload required; metadata inferred |
| document.label | Doc findability | Family search | 5 | 70% | Filename, OCR | Low | Low | Partial | Yes | Yes | Auto-label from filename/OCR |
| emergency.contacts[] | Crisis reach | Emergency card export | 9 | 50% | Member phones | Medium | High | No | Yes | Partial | Pre-fill from members |
| emergency.meds[] | Medical safety | Emergency card | 8 | 10% | — | Low | High | No | Yes | No | Ask in emergency wizard only |
| emergency.allergies | Medical safety | Emergency card | 8 | 10% | — | Low | High | No | Yes | No | Same wizard; not onboarding |

---

## Placements / Career

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| company | Application identity | Placements pipeline, Reports | 8 | 20% | Email domain parse | Low | Low | No | No | Partial | Paste job URL → scrape company |
| role | Position title | Placements, ATS, Insights career | 8 | 55% | JD paste, email subject | Low | Low | Partial | Yes | Partial | Parse from JD |
| stage | Pipeline status | Placements kanban, Reports funnel | 7 | 40% | Email parse (interview invite) | Medium | Low | Partial | Yes | Yes | AI suggests stage moves |
| application_date | Timeline | Placements, Reports | 5 | 90% | Today default | Low | None | Partial | Yes | Yes | Default today |
| notes | Freeform context | Placements detail | 5 | 50% | AI from emails | Low | Medium | Partial | Yes | Yes | Voice note post-capture |
| link | Job posting URL | Placements, ATS fetch | 6 | 60% | Clipboard | Low | Low | Partial | Yes | Partial | Auto-detect clipboard URL |
| resume PDF | ATS analysis input | Lab ATS, Placements | 7 | 0% | — | Medium | High | No | No | No | Upload once; reuse |
| job description | ATS match | Lab ATS analyzer | 7 | 55% | URL fetch | Medium | Low | Partial | Yes | Partial | Fetch from link |

---

## Focus / Pomodoro

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| session rating | Subjective quality | Focus analytics, Insights | 5 | 45% | Duration, abandon rate | Low | Low | Yes | Yes | Partial | Optional 1-tap post-session |
| session notes | Reflection | Focus history, Journal routing | 4 | 50% | AI summary of session | Low | Medium | Yes | Yes | Yes | AI drafts from app focus context |
| linked goalId | Attribution | Goals progress, Life Score | 6 | 60% | Last active goal, calendar | Low | Low | Partial | Yes | Yes | Default to inferred active goal |

---

## Discipline

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| trigger | Urge context | Discipline logs, Insights patterns, replacement coaching | 8 | 45% | Time, location, mood, calendar gaps | Medium | High | No | No | Partial | Voice capture: "urge after meeting" |
| intensity | Urge strength 1–10 | Discipline analytics | 5 | 30% | — | Low | Medium | Yes | Yes | No | Optional; default mid if skipped |
| replacement_habit | Positive redirect | Habits link, coaching | 6 | 55% | Habit list, past success | Low | Low | Partial | Yes | Yes | Suggest top replacement habit |

---

## Notes

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| title | Note organization | Notes list, search | 4 | 85% | First line of body | Low | Low | Yes | Yes | Yes | **Kill** — derive from body |
| body | Content | Notes, Command Palette routing, search | 8 | 0% | — | Low | Medium | No | No | No | Inline capture; title auto |

---

## Account

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| displayName | Social display | Navbar, Reports, waitlist | 6 | 85% | OAuth, onboarding fullName | Low | Low | Partial | Yes | Yes | Sync from OAuth silently |
| location | Profile context | Account, future Insights | 3 | 50% | IP geo ( coarse ) | Low | Medium | Yes | Yes | Partial | Infer city; confirm once |
| bio | Profile narrative | Account | 3 | 45% | Journal/arc themes | Low | Medium | Yes | Yes | Yes | AI draft optional |
| avatar | Visual identity | Navbar, Account | 4 | 70% | OAuth picture | Low | Low | Partial | Yes | Yes | OAuth import default |

---

## Settings

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| theme | Light/dark preference | Global UI | 5 | 90% | OS `prefers-color-scheme` | Low | None | Partial | Yes | Yes | **System** — follow OS; override in settings |
| pinnedNav[] | Nav personalization | Navbar, BottomNav | 5 | 65% | Route visit frequency | Medium | None | Partial | Yes | Yes | Auto-pin top 5 visited routes |
| persona preset | Layout/widget preset | Account personalization, Overview widgets | 4 | 55% | Usage clusters | Medium | None | Partial | Yes | Yes | Infer persona; offer change |

---

## Feedback

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| message | User feedback content | Product feedback pipeline | 7 | 0% | — | Low | Medium | No | No | No | Free text required |
| category | Feedback routing | Feedback triage | 4 | 70% | Current page/route | Low | None | Yes | Yes | Yes | Infer from page context |

---

## Lab — Addiction Tracker

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| substance | Craving type | Lab analytics, Discipline cross-ref | 7 | 0% | — | Low | High | No | No | No | Required for logging |
| intensity | Craving strength | Lab trends | 4 | 25% | — | Low | Medium | Yes | Yes | No | Optional slider |
| trigger | Craving context | Discipline patterns, Insights | 6 | 45% | Time/mood/calendar | Medium | High | Partial | Yes | Partial | Shared trigger field with Discipline |

---

## Command Palette

| Field | Why exists? | Features that consume it | Importance | Could AI infer? | Passive signals | Engineering effort | Privacy cost | Remove completely? | Ask later? | Auto update? | Future interaction |
|-------|-------------|--------------------------|------------|-----------------|-----------------|-------------------|--------------|-------------------|------------|--------------|-------------------|
| ai_log text | Universal NL capture | Routes to journal/win/mood/task/finance via AI classifier | 10 | 50% (classification) | — | High | High | No | No | No | Primary AI-first input surface |
| win/note text | Quick structured capture | Overview wins, Notes, Journal | 8 | 0% | — | Low | Medium | Partial | No | No | Merge into ai_log single field |

---

## Cross-Feature Intelligence Rules

### Fields that must never be inferred without consent
- password, PIN digits, emergency meds/allergies, substance (addiction), member blood group

### Fields safe to infer silently (with correction chip)
- theme, date (finance), category (finance), mood, pillar, priority, habit category/color/emoji, note title

### Fields that should become system-maintained
- pinnedNav[], learning_hours (from Focus), DSA count (from Lab), reset_counter, steps, sleep (wearable)

### Highest ROI automation (importance × infer %)
1. Finance category (8 × 85%)
2. Command Palette ai_log routing (10 × 50% classification + 85% field elimination downstream)
3. Journal mood (7 × 80%)
4. Notes title (4 × 85%)
5. Settings theme (5 × 90%)

---

## Related Documents

- [[INFORMATION_GRAPH]] — entity relationships
- [[things_aiimin_should_stop_asking]] — kill/infer verdicts
- [[INTERACTION_COMPRESSION_SCORE]] — flow compression targets
- `docs/interaction-audit/fields.md` — source field inventory
