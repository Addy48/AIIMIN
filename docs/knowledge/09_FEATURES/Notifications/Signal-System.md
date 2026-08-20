---
authority: product
derived_from: Genesis P9 Ph3 · UX-Architecture Attention · Native-Notification-Voice · Massive-Upgrade W11
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: moc
note_type: NT-FEATURE-MOC
tags:
  - type/moc
  - domain/notifications
  - status/living
---

# Notifications — Signal System (MOC)

> **Job:** One taxonomy for **web in-app**, **marketing site**, and **native** notifications — Hold/Knock law first, growth second.  
> **Voice (native copy):** [[Native-Notification-Voice]]  
> **UX law:** [[Roadmap/UX-Architecture/Phase-2-Interaction/06_Attention_and_Interruptions]]  
> **Research:** Knock registry W11 in [[Massive-Upgrade-Research-Pack]]  
> **Marketing:** Must not promise engagement drip — [[Marketing-Claims-Ledger]] FORBID

## 1. Attention classes (product language)

| Class | Definition | Surfaces |
|-------|------------|----------|
| **Ambient** | Non-blocking status | Web sync/offline chip |
| **Notice** | Deserves attention; clear action | Web notification center |
| **Knock** | Interruptive initiative | Native local (FCM later) |
| **Site toast** | Ephemeral marketing-site feedback | Cookie, form success/error |
| **Email** | Owned lifecycle | Confirm, founding, invite |

## 2. Surface rules

### 2.1 Web in-app (Life OS)

- Center states: **empty · unread · actioned · offline**.  
- Every Notice: title · one sentence · one CTA · deep link.  
- Respect Focus / Hold — no Knock-class during Hold.  
- No journal body in any notification payload.  
- Digest preference > vanity drip (IX-9).

### 2.2 Marketing site (`/`, `/brand`, `/app`)

- Allowed: cookie consent, form validation, success (“You’re in”).  
- **Forbidden:** fake social-proof popups, exit-intent guilt, fake urgency modals (`popups` skill = Skip here).

### 2.3 Native Android V3

- Runtime: local WorkManager cadence; **FCM PARK** until local Knocks proven.  
- Quiet hours default **22:30–07:00** Asia/Kolkata (user override in Config).  
- Channels + caps + witty voice: [[Native-Notification-Voice]].  
- Config screen already exposes KNOCKS · quiet hours — keep as single control plane.

### 2.4 Email

- Confirm waitlist · founding reminder · invite/tester.  
- Max cadence Stage-1: no daily product spam.  
- Align copy with FOUNDING/TARGET tags.

## 3. Build order (eng)

| Priority | Work | Status |
|----------|------|--------|
| P0 | This contract + native voice (docs) | **Now** |
| P1 | Web notification center redesign (D16) | Spec → eng ticket Day 12 |
| P2 | Knock type registry shared IDs web↔native | Phase D / W11 |
| P3 | Digest / streak-freeze notices | W11 |
| P4 | FCM remote Knocks | PARK |

## 4. Content masking

| May include | Must never include |
|-------------|--------------------|
| Generic minimum reminder | Journal body / private note text |
| Step/screen coaching (native voice) | Medical diagnosis · debt shame |
| Sync fail | Shame streaks · “you failed” |

## 5. Related files

- Native: `native-android-v3/` knock + Config Notifications  
- Web: `frontend` notifications components (immature — REDESIGN)  
- Changelog: [[09_FEATURES/Notifications/Changelog]]

### Changelog

### 2026-08-20 — Signal System MOC
- **What:** Cross-surface taxonomy; site toast limits; eng build order; link native voice.
- **Why:** Founder — in-app / site / mobile notifications as real company craft, not manipulation.
- **Files:** this note · Native-Notification-Voice (existing)
- **Status:** shipped-docs
