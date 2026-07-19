# 16 — Analytics Plan

> **Depends:** [[01_PRD]] [[02_USER_JOURNEYS]] [[08_FEATURES]]  
> **Status:** Complete draft · 2026-07-19  
> **Growth PM lens** · privacy-safe

---

## 1. Principles

- Consent before non-essential analytics  
- No raw journal/note bodies  
- Prefer first-party + privacy tools (e.g. PostHog self-host or GA4 with sparseness)  
- Crash separate (Sentry)  

---

## 2. Core events

| Event | Props (safe) |
|-------|----------------|
| `app_open` | platform, app_ver, cold/warm |
| `auth_success` | method |
| `auth_fail` | reason_code |
| `onboarding_complete` | persona |
| `home_view` | |
| `habit_tick` | |
| `habit_create` | |
| `goal_checkin` | |
| `journal_save` | mode |
| `note_save` | type |
| `focus_complete` | minutes_bucket |
| `urge_logged` | (no free text) |
| `money_quick_add` | |
| `calendar_event_create` | |
| `study_session_complete` | pack_id hash, n_q |
| `ai_route_confirm` | |
| `paywall_view` / `purchase_success` | product_id |
| `sync_error` | code |
| `notif_open` | channel |
| `search` | result_count bucket |
| `desktop_cta_tap` | |

---

## 3. Funnels

Install → auth → onboarding → first_tick → D1 open → D7 WARD≥3  
Paywall view → purchase  
Study start → complete  

---

## 4. Retention / activation

Activation: first habit tick or journal save or focus complete within 24h.  
North star: WARD (see PRD).

---

## 5. Session / screens

Screen views for Main tabs + key tools · session length buckets.

---

## 6. Crash / performance

Sentry: crash-free · ANR · cold start · breadcrumbs without PII.

---

## 7. Privacy

Opt-out · delete-with-account · India DPDP notice · no ads ID sale.

---

*Next: [[17_LEGAL/00_INDEX]]*
