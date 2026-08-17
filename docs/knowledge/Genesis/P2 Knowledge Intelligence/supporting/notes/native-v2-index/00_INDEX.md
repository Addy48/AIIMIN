# AIIMIN Native Application — Documentation Index

> **Status:** Phase 1 Compose **shipping** (`native-android/` v2.1.x)  
> **🔴 LIVE BUILD TRACKER (pin in sidebar):** [[WORKFLOW-PLAN]]  
> **Last updated:** 2026-07-19  
> **Owner:** Aaditya Upadhyay / AIIMIN

**Build note:** See [[CHANGELOG]] + [[WORKFLOW-PLAN]] — `./gradlew :app:assembleDebug` in `native-android/`. Capacitor `frontend/android/` is legacy, not V2.

---

## 0a. Build tracker (agents + founder)

| Doc | Purpose |
|-----|---------|
| **[[WORKFLOW-PLAN]]** | **Living task board** — P0–P3, screen checklist, session log |
| [[CHANGELOG]] | Shipped versions |
| [[15_MEMORY/Current-Context]] | Agent handoff (short) |

---

## 0. How to use this pack

1. Read this **Index** end-to-end.
2. Resolve **Missing Product Decisions** (Section 5) — blocking.
3. Generate documents **in order 01 → 20** (dependencies flow downward).
4. Each doc is the **source of truth** for its domain until superseded by dated ADR.
5. **No implementation code** until Document 20 (Roadmap) Phase 0 exit criteria pass and owner signs Phase 1.

Vault path: `docs/knowledge/17_NATIVE_APP_V2/`

Related legacy (do not treat as native spec):

- [[01_PRODUCT/AIIMIN-Product-Guide]] — website Life OS (V1)
- [[02_ARCHITECTURE/Device-Tiers]] — phone web `/m` capture (V1 mobile web)
- `plans/native-android-app.md` — interim eng sketch; **superseded by this pack** for product direction

---

## 1. Product thesis (locked for this pack)

| Surface | Role | Design center |
|---------|------|----------------|
| **Desktop / tablet web** | Productivity Life OS — dense, multitasking, keyboard | Dashboard, systems, analysis |
| **Native iOS + Android** | Companion: Journal voice+type · Keep notes · Vault (Family/Drive/Resumes) · Home ritual · lite tools | One-hand, offline, premium motion |
| **Backend** | Shared truth | Auth, data, sync, AI, billing |

**Rejected:** WebView of `aiimin.in/m` as “the app.”  
**Rejected:** Compressing desktop UI onto a phone.  
**Rejected:** “Mobile = data collection only” as the native product ceiling — that was a **temporary phone-web (`/m`) constraint**, not the native vision.  
**Rejected:** Treating MCQ/Practice as the whole app — those are **examples** of mobile-fit modules inside Tools/Write.  
**Required:** Feature selection via [[00_FEATURE_SELECTION]] (≥3 of one-hand / time-sensitive / glanceable / offline / ritual / frequency).  
**Required:** Native interaction patterns (platform conventions + AIIMIN motion language).

**Canonical plans:** [[00_MASTER_PLAN]] · [[00_FEATURE_SELECTION]] · [[00_SKILLS_SYNTHESIS]] · [[01_PRD]] · [[20_ROADMAP]]

---

## 2. Document catalog

| # | Document | Filename | Est. pages¹ | Complexity² | Depends on | Owner lens |
|---|----------|----------|-------------|-------------|------------|------------|
| 00 | **This Index** | `00_INDEX.md` | 8–12 | L | — | VP Product + Architect |
| 01 | Master PRD | `01_PRD.md` | 35–50 | XL | Decisions §5 | VP Product |
| 02 | Complete User Journeys | `02_USER_JOURNEYS.md` | 40–60 | XL | 01 | UX Director |
| 03 | Information Architecture | `03_INFORMATION_ARCHITECTURE.md` | 20–30 | L | 01, 02 | UX + Architect |
| 04 | App Flow (states & transitions) | `04_APP_FLOW.md` | 25–35 | L | 02, 03 | UX + Motion |
| 05 | Native Mobile UX | `05_NATIVE_UX.md` | 30–45 | XL | 03, 04 | UX Director |
| 06 | Design System | `06_DESIGN_SYSTEM.md` | 35–50 | XL | 05 | UX + Motion |
| 07 | Motion Design | `07_MOTION.md` | 25–40 | L | 06 | Motion Designer |
| 08 | Feature Documentation | `08_FEATURES.md` | 60–90 | XXL | 01–05 | VP Product + Eng |
| 09 | Backend Architecture | `09_BACKEND.md` | 40–55 | XL | 01, 08 | Staff Backend + Architect |
| 10 | Database Design | `10_DATABASE.md` | 35–50 | XL | 09 | Staff Backend |
| 11 | Authentication Design | `11_AUTHENTICATION.md` | 25–35 | L | 09, 10 | Security + Backend |
| 12 | Sync Architecture | `12_SYNC.md` | 30–40 | XL | 09–11 | Architect |
| 13 | Offline-First Architecture | `13_OFFLINE.md` | 20–30 | L | 12 | Staff Mobile + Architect |
| 14 | Security Document | `14_SECURITY.md` | 35–50 | XL | 09–13 | Security Engineer |
| 15 | AI System Design | `15_AI_SYSTEM.md` | 30–45 | XL | 08, 09 | Architect + Backend |
| 16 | Analytics Plan | `16_ANALYTICS.md` | 20–30 | L | 01, 02, 08 | Growth PM |
| 17 | Legal Pack | `17_LEGAL/` (multi-file) | 80–120 | XXL | 01, 14, 16 | Startup Lawyer + Privacy |
| 18 | Engineering Standards | `18_ENGINEERING.md` | 25–35 | L | 09, 19 | Staff Eng |
| 19 | Tech Stack | `19_TECH_STACK.md` | 25–40 | L | 09–15 | Architect (justify all) |
| 20 | Implementation Roadmap | `20_ROADMAP.md` | 20–30 | L | **all prior** | VP Product + Architect |

¹ **Page** ≈ ~400–500 words of dense Markdown (or equivalent tables/diagrams). Totals are design intent, not padding.  
² **L** = large · **XL** = very large · **XXL** = multi-session / multi-file.

### Pack totals (estimate)

| Metric | Estimate |
|--------|----------|
| Documents | 20 (+ legal subfolder ~15–20 policies) |
| Total pages | **~600–900** |
| Legal alone | **~80–120** pages |
| Authoring calendar (1 founding team, deep quality) | **3–6 weeks** sequential · **10–14 days** if parallelized by role |
| Implementation (post-docs, to public beta) | **See Doc 20** — provisional **6–12 months** to polished dual-platform V1 native |

---

## 3. Generation order & rules

```
00 Index (done)
 → 01 PRD
 → 02 Journeys
 → 03 IA
 → 04 App Flow
 → 05 Native UX
 → 06 Design System
 → 07 Motion
 → 08 Features
 → 09 Backend
 → 10 Database
 → 11 Auth
 → 12 Sync
 → 13 Offline
 → 14 Security
 → 15 AI
 → 16 Analytics
 → 17 Legal (can draft in parallel after 01+14+16 outline)
 → 18 Engineering
 → 19 Tech Stack (may draft skeleton earlier; finalize after 09–15)
 → 20 Roadmap (last)
```

**Consistency rules**

- Cross-link by document number (`[[17_NATIVE_APP_V2/01_PRD]]` style).
- Shared glossary lives in `00_GLOSSARY.md` (created with Doc 01).
- Palette tokens: AIIMIN brand lock remains baseline; Design System may **extend** (not invent random brand colors) — any new accent requires owner approval.
- Desktop V1 features may be **omitted, transformed, or deferred** on native — never “ported as-is” without a mobile job-to-be-done.
- Legal docs: production-quality prose; **`[LEGAL REVIEW REQUIRED]`** markers where counsel must sign off; company registration / addresses as structured placeholders only where identity facts unknown.

**Delivery cadence (chat)**

- One primary document per response (Legal may ship as index + N policy files).
- After each doc: short delta of open questions introduced; update this Index “Progress” table.

---

## 4. Implementation complexity (pre-code forecast)

| Domain | Complexity | Notes |
|--------|------------|-------|
| Dual-product IA (web OS ≠ mobile companion) | **Critical** | Hardest product problem; docs must nail this |
| True native UX (not Capacitor-of-website) | **Critical** | Stack choice in Doc 19 drives 6–12 mo timeline |
| Offline-first + multi-device sync | **Very high** | CRDT vs last-write-wins vs field-level merge — decide in 12/13 |
| Auth (passkeys, Apple, Google, biometrics) | **High** | Apple Sign In mandatory for iOS if Google offered |
| AI orchestration (cost + latency + safety) | **High** | Prompt injection & abuse in Doc 14/15 |
| Billing / subscriptions (Play + App Store + web) | **High** | Entitlement source of truth must be backend |
| Legal / DPDP / GDPR / CCPA | **High** | India-first users + EU/US later |
| Motion / premium feel | **Medium–High** | Talent + platform APIs; not a CSS transition port |
| Analytics privacy-safe | **Medium** | Consent architecture before GA4/Sentry defaults |
| Killing `/m` web or keeping it | **Product fork** | See Decision D1 |

**Provisional eng recommendation (to be confirmed in Doc 19 — not locked here)**

| Approach | When it wins | When it loses |
|----------|--------------|---------------|
| **Kotlin + Swift (two native UIs)** | Max platform quality, widgets, Live Activities, predictive back | Cost / speed; two codebases |
| **React Native / Expo** | One JS team, strong native modules, OTA | Motion ceiling vs pure native; discipline required |
| **Flutter** | One UI codebase, strong motion | Hiring, platform feel, plugin gaps |
| **Capacitor / WebView shell** | Fastest to “an icon” | **Fails thesis** — feels like website; reject as primary V2 |

Staff Mobile + Architect must **justify** final pick in Doc 19 against Series-A quality bar.

---

## 5. Missing product decisions (BLOCKING)

Owner must answer before Docs 01–08 freeze. Defaults below are **proposals**, not locks.

### D1 — What happens to phone web `/m`?

| Option | Meaning |
|--------|---------|
| **D1a** | Deprecate `/m` after native GA; web phone → marketing + “Get the app” |
| **D1b** | Keep `/m` as lightweight capture for users without install |
| **D1c** | Progressive Web App install as stopgap only |

**Proposal:** D1b through native beta; D1a at GA if retention proves install-first.

### D2 — Native scope vs “full Life OS”

| Option | Meaning |
|--------|---------|
| **D2a** | Capture-only (Today/Score/Account) — **REJECTED as fraud for native V2** |
| **D2b** | Near-parity desktop OS on phone — too dense; year-one suicide |
| **D2c (LOCKED proposal)** | **Rich companion:** Today + Practice (MCQ) + Revise (cheat sheets/flashcards) + You (journal/focus/discipline/goals) + Account — desktop keeps Lab graphs, Finance deep, Placements kanban |

**Proposal:** **D2c**. See [[00_MASTER_PLAN]] IA.

### D3 — Platforms for V1 native

| Option | Meaning |
|--------|---------|
| **D3a** | Android first, iOS +1 release |
| **D3b** | iOS + Android same release |
| **D3c** | iOS first (App Store narrative) |

**Proposal:** D3a (founder Android device + Play friction lower for India) **or** D3b if investor demo needs both.

### D4 — Monetization on mobile

| Option | Meaning |
|--------|---------|
| **D4a** | Same tiers as web (Core/Pro/Elite); Store billing + web entitlement sync |
| **D4b** | Mobile-only free companion; paid unlocks on web |
| **D4c** | Freemium mobile with hard caps |

**Proposal:** D4a with careful Store compliance + backend entitlement authority.

### D5 — AI on device vs cloud

| Option | Meaning |
|--------|---------|
| **D5a** | Cloud-only models (current direction) |
| **D5b** | On-device for sensitive summaries + cloud for heavy |
| **D5c** | User-selectable privacy mode |

**Proposal:** D5a for MVP; design Doc 15 for D5c hooks.

### D6 — Identity & region

| Fact needed | Why |
|-------------|-----|
| Legal entity name, address, country of incorporation | Legal pack |
| DPDP / GDPR lead market | Privacy docs |
| Support email / DPO contact | Legal + app stores |
| Age gate (13 / 16 / 18) | Children’s privacy, Stores |

### D7 — Data philosophy

| Option | Meaning |
|--------|---------|
| **D7a** | Cloud sync default; export/delete first-class |
| **D7b** | Local-first optional (hard mode) |
| **D7c** | E2E encryption for journal (keys on device) |

**Proposal:** D7a + path to D7c for journal/notes in V2 roadmap.

### D8 — Notifications & attention ethics

| Option | Meaning |
|--------|---------|
| **D8a** | Minimal: daily ritual reminder + streak risk only |
| **D8b** | Smart coaching pushes |
| **D8c** | User-authored schedules only |

**Proposal:** D8a/D8c hybrid — **no dark-pattern engagement pushes**. Brand: Human Momentum.

### D9 — Guest / anonymous

| Option | Meaning |
|--------|---------|
| **D9a** | No guest — auth required |
| **D9b** | Local-only guest with migrate-to-account |
| **D9c** | Guest with 7-day cloud trial |

**Proposal:** D9b for store conversion; clear migrate path.

### D10 — Cross-posting website features

Explicit kill / transform list required in Doc 01 (examples to challenge):

- Full Finance analytics charts → mobile: **spend capture + weekly pulse** only?
- Focus Room pomodoro → mobile: **Live Activity / Focus timer** native?
- Lab / causal graphs → **desktop only**?
- Placements kanban → **desktop / tablet only**?
- Command palette → mobile: **spotlight search sheet**?

---

## 6. Risks to the documentation program itself

| Risk | Mitigation |
|------|------------|
| Scope explosion (20 docs become novels) | Page budgets; “depth over breadth” tables; defer Future to appendices |
| Speculating stack before product | Tech Stack (19) after Features/Backend; Index keeps stack **provisional** |
| Legal docs treated as final counsel | Every policy stamped for attorney review |
| Reverting to `/m` Capacitor under schedule pressure | Explicit non-goal in PRD; Architecture review gate |
| Palette / brand drift | Design System extends locked tokens only with owner sign-off |
| Ignoring India DPDP while copying US templates | Privacy consultant pass on Doc 17 |

---

## 7. Progress tracker

| Doc | Status | Updated |
|-----|--------|---------|
| 00 Index | **Complete** | 2026-07-19 |
| 00 Feature selection | **Complete** | 2026-07-19 |
| 00 Skills synthesis | **Complete** | 2026-07-19 |
| 00 Master plan | **Complete** | 2026-07-19 |
| 01 PRD | **Draft** | 2026-07-19 |
| 02 User Journeys | **Complete** | 2026-07-19 |
| 03 IA | **Complete** | 2026-07-19 |
| 04 App Flow | **Complete** | 2026-07-19 |
| 05 Native UX | **Complete** | 2026-07-19 |
| 06 Design System | **Complete** | 2026-07-19 |
| 07 Motion | **Complete** | 2026-07-19 |
| 08 Features | **Complete** | 2026-07-19 |
| 09 Backend | **Complete** | 2026-07-19 |
| 10 Database | **Complete** | 2026-07-19 |
| 11 Auth | **Complete** | 2026-07-19 |
| 12 Sync | **Complete** | 2026-07-19 |
| 13 Offline | **Complete** | 2026-07-19 |
| 14 Security | **Complete** | 2026-07-19 |
| 15 AI | **Complete** | 2026-07-19 |
| 16 Analytics | **Complete** | 2026-07-19 |
| 17 Legal | **Complete draft** (counsel review) | 2026-07-19 |
| 18 Engineering | **Complete** | 2026-07-19 |
| 19 Tech Stack | **Complete** | 2026-07-19 |
| 20 Roadmap | **Complete** | 2026-07-19 |

---

## 8. Immediate next action

1. Founder: fill legal entity placeholders · accept Feature Selection · sign Phase 0.  
2. Optional: deepen any single doc on request (still docs-only).  
3. **No application code** until [[20_ROADMAP]] Phase 0 exit.

---

## 9. Sign-off

| Role | Sign-off meaning |
|------|------------------|
| VP Product | Scope, non-goals, prioritization |
| Principal Architect | Dual-product + sync feasibility |
| UX Director | Native-not-web bar |
| Security / Privacy | Threat + compliance bar before eng |
| Startup Lawyer | Legal pack usable after review |
| Founder | D1–D10 + budget/timeline |

**Founder sign-off on Index:** ☐ pending  

---

*This index is Document 00 of the AIIMIN Native Application V2 design pack.*
