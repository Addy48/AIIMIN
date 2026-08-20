# 01 — Product History

```yaml
purpose: Chronological institutional timeline — milestones, pivots, redesigns, naming, architecture shifts.
confidence: ★★★★☆
generated_from:
  - MASTER_PLAN.md
  - AIIMIN_PROGRESS_SUMMARY.md
  - docs/knowledge/09_FEATURES/*/Changelog.md
  - docs/knowledge/10_DECISIONS/*
  - docs/knowledge/02_ARCHITECTURE/Changelog.md
  - docs/knowledge/02_ARCHITECTURE/Device-Tiers.md
  - docs/knowledge/99_ARCHIVE/pre-brain-os-2026-07-10/*
  - docs/AIIMIN_PRODUCT_BIBLE/00_INDEX.md
  - docs/knowledge/17_NATIVE_APP_V2/CHANGELOG.md
related_notes: [00_KNOWLEDGE_SUMMARY.md, 08_FEATURE_HISTORY.md, 11_ROADMAP_HISTORY.md, 09_NAMING_HISTORY.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Codex reconstructing "what happened when"
importance: ★★★★★
```

---

## PRE-LEDGER (EVIDENCE THIN)

| Period | Known | Confidence |
|--------|-------|------------|
| Pre-2026-06 | Product existed as multi-feature dashboard; Sports ESPN path by 2026-06-14 | ★★☆☆☆ |
| 2026-06-14 | Sports revamp → direct ESPN APIs | ★★★★☆ `99_ARCHIVE/.../Git-Timeline.md` |
| 2026-06-20 | Universal Logger; AI Finance Import; Clerk auth + premium login UI | ★★★★☆ same |
| 2026-06-24 | Guest bypass / Vercel rollback commits | ★★★☆☆ |

---

## TIMELINE (DENSE)

| Date | Event | Type | Sources |
|------|-------|------|---------|
| 2026-06-25 | `MASTER_PLAN.md` authored; Phase 0 foundation marked DONE (user_profile, design overhaul, discipline DB backend) | Plan | `MASTER_PLAN.md` |
| 2026-06-25 | Accent planned as electric blue `#2563EB` + Outfit — **later superseded** | Design pivot (obsolete) | `MASTER_PLAN.md` vs `08_DESIGN/Palette.md` |
| 2026-06-30 | Progress summary: ~92% code / ~75% launch-ready; Clerk still referenced | Snapshot | `AIIMIN_PROGRESS_SUMMARY.md` |
| ~2026-06 | Behavioral audit: punitive streaks, fake Insights gamification, localStorage over-reliance | Research | `audit.md` |
| 2026-07-05 | Clerk deleted; Better Auth path; waitlist conversion redesign | Auth pivot | `09_FEATURES/Waitlist/Changelog.md` |
| 2026-07-05–06 | Waitlist v2→v9 modular landing; pricing iterations; SES→Resend | Launch surface | same |
| 2026-07-07 | Personal OS tagline / OS-ID / founding perks; tester Elite by 31 Jul | Naming + GTM | same |
| 2026-07-08 | Recovery branch: pre-waitlist dashboard + waitlist auth; Arch Bracket mark replaces leaf | Architecture + Brand | Waitlist Changelog; archive Command Center |
| 2026-07-09 | North Star → Life Arc rename | Naming | `09_FEATURES/Account/Personalization.md` |
| 2026-07-10 | **Vault Brain OS cutover** — Approach A; archive pre-brain-os; slim AGENTS | Meta-architecture | `10_DECISIONS/2026-07-10-vault-brain-os.md` |
| 2026-07-11 | Product Intelligence Phases 2–8 + Product Bible complete | Doctrine | `AIIMIN_PRODUCT_BIBLE/00_INDEX.md` |
| 2026-07-11 | Interaction audit (578 INTs); click-upgrade celebration design | Research + UX | `docs/interaction-audit/`, superpowers specs |
| 2026-07-12 | Selfloop QA run (255 fixed / 29 wontfix locally) | Quality | `11_BUGS/QA-Run-2026-07-12.md` |
| 2026-07-12–15 | Craft program Tracks A–J (local complete, ship-on-ask) | Craft | `12_SPRINTS/Craft-*` |
| 2026-07-13 | ADR Notes source-grounded; ADR Discipline UrgeEvent | Product decisions | `10_DECISIONS/` |
| 2026-07-14 | Login QA Selfloop (47) | Quality | `11_BUGS/QA-Run-2026-07-14-Login.md` |
| 2026-07-17 | `/brand` WaitlistBrand detour → Human Momentum restored; navbar lockup LOCKED | Brand pivot | Waitlist Changelog |
| 2026-07-17–18 | Reports Folio → Life OS Review; Elite = web craft not longer PDF | Feature pivot | `09_FEATURES/Reports/` |
| 2026-07-18 | Canonical Product Guide shipped; phone shell P0 `/m/score` `/m/account`; UI Improvement Brief | Product + Mobile | Product Guide; Device-Tiers; UI brief |
| 2026-07-18 | Auth/DB audit; `/api/db` write restrictions emphasized | Security | `11_BUGS/Audit-Auth-DB-2026-07-18.md` |
| 2026-07-19 | Monorepo three-client docs; Native V2 pack 01–20 complete; native ≠ `/m` ceiling | Architecture | Monorepo; Device-Tiers; `17_NATIVE_APP_V2/` |
| 2026-07-19 | Family card menus; native APK 2.2.1-native; Capacitor labeled legacy | Feature + Mobile | Current-Context; Capacitor MOC |
| 2026-07-20 | HTML prototype Personal OS multi-screen (Downloads artifact) | Prototype | Current-Context |

---

## MAJOR PIVOTS

| Pivot | From | To | Why (evidence) |
|-------|------|----|----------------|
| Auth | Clerk (+ earlier Cognito mentions) | Better Auth + Google OAuth | Friction, ownership; Waitlist Changelog |
| Email | AWS SES | Resend | Waitlist Changelog |
| Design accent | Blue `#2563EB` (MASTER_PLAN) | Orange `#ff6b35` LOCKED | Brand consistency; Palette |
| Knowledge OS | Fat AGENTS / Command Center scan | Vault Brain OS | ~985k token waste |
| Notes thesis | GoodNotes / canvas competitor | Source-grounded reference library | ADR-Notes |
| Discipline thesis | Shame streaks / addiction theater | UrgeEvent + pattern language | ADR-Discipline |
| Mobile strategy | Capacitor WebView as app | Native Compose companion + `/m` stopgap | Founder reject; Native Index |
| Brand page | WaitlistBrand forest-green | Human Momentum always-light | 2026-07-17 revert |
| Today capture | Quick Capture tiles | Universal Logger only (J0=A) | Overview MOC |
| Reports | Folio PDF-centric Elite | Life OS Review + Elite web experience | Reports Prototypes |
| Insights | Separate route | Redirect into Reports tabs | Product Guide |

---

## ERA MODEL (FOR CODEX)

| Era | Approx | Dominant story |
|-----|--------|----------------|
| Dashboard build | ≤2026-06 | Feature accumulation; Clerk; sports; logger |
| Waitlist + auth rewrite | early Jul 2026 | GTM surface; Better Auth; pricing |
| Doctrine crystallization | 2026-07-10–11 | Brain OS + Product Bible + kill list |
| Craft + QA | 2026-07-12–18 | Local polish; Selfloop; ADRs |
| Dual-client clarity | 2026-07-19+ | Monorepo law; Native V2; `/m` vs native split |

---

## FUTURE ANCHORS (NOT YET HISTORY)

| Target | Meaning |
|--------|---------|
| 31 Jul 2026 | Tester registration close |
| End Sep 2026 | Go-live target |
| Launch+90d | WAC 60% north-star window |
| Native 7–12 mo | Public Android estimate (`20_ROADMAP.md`) |

---

## GAPS

- No formal meeting transcripts (`13_MEETINGS/` empty)
- Pre-June 2026 narrative mostly absent from vault
- `MASTER_PLAN` sprint statuses largely PENDING — do not treat as shipped timeline
