# AIIMIN Native Application — Master Product Requirements Document (PRD)

> **Document:** 01 · **Pack:** [[17_NATIVE_APP_V2/00_INDEX]]  
> **Status:** Draft v0.2 — rich mobile thesis (capture-only rejected)  
> **Date:** 2026-07-19  
> **Owners:** VP Product (draft) · Founder sign-off required  
> **Related:** [[00_MASTER_PLAN]] · [[00_SKILLS_SYNTHESIS]] · [[01_PRODUCT/AIIMIN-Product-Guide]] (website V1)

---

## 1. Vision

AIIMIN Native is the **daily companion** for Human Momentum: the place you open with one hand to **practice, revise, capture, focus, and feel your score** — while the website remains the **command center** for dense life systems.

We do not ship a website in a WebView.  
We do not ship a single “log your day” screen and call it an app.  
We ship a **redesigned mobile product** that shares truth with desktop.

---

## 2. Mission

Make disciplined students and early-career builders in India (then globally) **compound daily** through rituals and learning loops that feel premium, private, and honest — on the device they actually touch every hour.

---

## 3. Core philosophy

1. **Two products, one backend** — Desktop optimizes for systems; mobile for momentum.  
2. **Redesign, don’t compress** — Every feature earns a mobile job-to-be-done or dies on phone.  
3. **Capture is necessary, not sufficient** — Practice (MCQ), Revise (cheat sheets / flashcards), Execute (habits/goals/discipline/focus), Glance (score) are first-class.  
4. **Peak-End emotion** — Completing a session or a day must feel like winning without shame.  
5. **Privacy as brand** — Behavioural archive is the user’s; no ad harvesting.  
6. **Native interaction grammar** — Sheets, haptics, predictive back, widgets — not hover and command palette.  
7. **Honesty over vanity analytics** — Scores reflect logged truth.

---

## 4. Target users

### Primary

- **Indian students & early professionals** under cognitive load (exams, placements, first jobs)  
- Already understand AIIMIN web or waitlist; phone is primary daily device  

### Secondary

- Founders / builders who want ritual + practice without opening a laptop  
- Athletes / discipline-focused users (urge toolkit on the go)  

### Not primary (yet)

- Enterprise teams  
- Clinical mental-health patients (Discipline is not therapy — legal disclaimer)  

---

## 5. Primary personas

| Persona | Need on mobile | Success look like |
|---------|----------------|-------------------|
| **Aarav, 21, GATE / placements** | MCQ practice between classes; cheat sheets on metro; habit ticks at night | 5 Practice sessions/week + Today complete |
| **Isha, 24, junior SWE** | Journal + focus timer + goals check-in | Streak + Focus minutes logged |
| **Kabir, 19, waits for desktop** | Still needs phone for capture + revise | Install converts waitlist → D7 retention |
| **Meera, power user** | All loops + AI explain on wrong MCQ | Uses Today + Practice + Revise daily |

---

## 6. Pain points

- Fragmented study apps vs life apps — context dies between them  
- Desktop Life OS unused on the commute  
- “Mobile version” that is just a form (insulting)  
- Shame-based streak apps  
- Offline failure on metro / campus Wi‑Fi  
- Practice content trapped in Lab desktop UI  

---

## 7. Jobs To Be Done (JTBD)

When I have 8 minutes on my phone, I want to **run one meaningful loop** (practice cards, revise a sheet, tick habits, log urge, start focus) so I feel **momentum**, not guilt.

When I sit at my desk, I want the **same truth** on the big screen so I can plan systems.

When I’m offline, I want **progress saved** and synced later without fear.

---

## 8. North star metric

**Weekly Active Ritual Days (WARD):** days per week with ≥1 meaningful native action (Today complete **or** Practice session ≥5 Q **or** Revise ≥10 cards **or** Focus ≥15 min).

Secondary: D7 retention, Practice sessions/user/week, Life Score active domains.

---

## 9. Product principles

1. Thumb-first  
2. One primary action per screen  
3. Offline-capable by default for core loops  
4. Shared identity with web; never fork user data models casually  
5. Premium motion without blocking input  
6. Accessibility (TalkBack, 48dp, contrast) non-optional  
7. No engagement dark patterns  
8. Feature ships only if it reinforces momentum (Human Momentum pillars)

---

## 10. Success metrics

| Stage | Metric | Target (provisional) |
|-------|--------|----------------------|
| Activation | Time-to-first Today complete or Practice session | < 10 min post-install |
| Engagement | WARD | ≥ 4 |
| Learning | Practice sessions / week | ≥ 3 among student persona |
| Retention | D7 / D30 | TBD after beta baseline |
| Quality | Crash-free sessions | ≥ 99.5% |
| Trust | Export/delete completion | Supportable < 72h |

---

## 11. Business goals

- Convert waitlist → installed native users  
- Increase daily open rate vs web-only  
- Support founding pricing (Core/Pro/Elite) via Store + web entitlement sync  
- Prove dual-product narrative for fundraising (Series A readiness of product, not just docs)  

---

## 12. Non-goals

- Replacing desktop Life OS  
- Shipping Capacitor `/m` wrap as “V2”  
- Full Finance / Lab / Placements parity on phone in year one  
- Clinical claims for Discipline  
- Ad-supported free tier that sells behavioural data  
- Building iOS and Android day-one if it destroys quality (Android-first allowed)

---

## 13. Feature prioritization

### P0 — MVP
Auth · Home · Habits ticks · Score · Sync/offline · Account · **Journal (type+voice)** · **Notes Keep-style**

### P1 — V1 beta
**Vault: Family docs (priority) + Drive connect/import + Resumes download** · Goals lite · Focus · Discipline · Calendar agenda lite · Quick Add · Entitlements  

### P2 — V2
Money quick-add · AI route · Widgets · Push · biometric doc reveal · STT quality polish  

### P3 — Later / desktop-only on phone
Placements kanban · Calendar month OS · Finance analytics · Lab/MCQ primary · Sports · deep Family finance tables  

---

## 14. MVP definition (acceptance)

User can install Android app, sign in with existing AIIMIN account, complete Today ritual online/offline, see Score, and find data on website after sync — **without** loading `aiimin.in/m` as the shell.

---

## 15. V1 definition

MVP (Home + Journal voice/type + Keep notes) + Vault (Family docs, Drive, Resumes) + Goals/Focus/Discipline + Agenda lite + store-ready + crash reporting.

---

## 16. V2 definition

V1 + money pulse + AI route + widgets + stronger offline + passkeys + biometric vault.

---

## 17. Future roadmap (themes)

- Cross-device Live Activities / tiles  
- Shared family accountability (careful privacy)  
- University content packs  
- E2E encrypted journal vault  

---

## 18. Risks

| Risk | Mitigation |
|------|------------|
| Scope greed → mediocre app | Hard P0/P1 gates; kill desktop ports |
| Capacitor temptation under time pressure | Architecture review gate; Doc 19 |
| Sync conflicts | Field-level LWW + user resolve for journal |
| MCQ content thin | Seed from Lab Tech Simulator; editorial pipeline |
| Firebase vs zero-Firebase lock | Explicit Doc 19 decision |
| Legal/DPDP | Doc 17 before public beta |
| “Capture-only” mental model in team | This PRD + Master Plan |

---

## 19. Dependencies

- Existing API + Better Auth  
- Life Score engine  
- Lab MCQ bank (or new practice service)  
- Notes content for revise  
- Design System (Doc 06) before pixel push  
- Entitlement service for tier gates  

---

## 20. Acceptance criteria (product)

- [ ] Native shell is not remote `/m`  
- [ ] ≥3 primary loops beyond capture (Practice, Revise, Execute/Glance) in V1  
- [ ] Desktop and mobile share user id and core entities  
- [ ] Offline Today + Practice answers queue  
- [ ] Accessibility audit pass on P0 screens  
- [ ] Store Data safety form accurate  
- [ ] Founder can complete Aarav persona path on device  

---

## 21. Edge cases

- Waitlisted user opens app → honest pending state, not silent fail  
- Entitlement expired mid-Practice → finish session read-only explain, paywall after  
- Conflict: habit ticked offline + deleted on web → resurrect vs drop policy (Doc 12)  
- Empty MCQ bank topic → empty state CTA “Browse topics”  
- Biometric fail → passcode / password fallback  
- Large note cheat sheet → paginated reader, not desktop editor  

---

## 22. Open questions

See Index D1–D14. Critical: push provider, iOS timing, Practice gating by tier, `/m` retirement date.

---

## 23. Glossary seed

| Term | Meaning |
|------|---------|
| **WARD** | Weekly Active Ritual Days |
| **Today ritual** | Native home checklist loop |
| **Practice** | MCQ / drill sessions |
| **Revise** | Cheat sheets + flashcards + spaced review |
| **Life OS (desktop)** | Dense web product |
| **Companion (native)** | Mobile V2 product |

---

## 24. Sign-off

| Role | ☐ |
|------|---|
| Founder | |
| VP Product | |
| UX Director | |
| Staff Mobile | |
| Architect | |

---

*Next document: [[02_USER_JOURNEYS]] — every journey including Practice, Revise, offline, deep links, widgets.*
