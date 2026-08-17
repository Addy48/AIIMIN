# 13 — Open Questions

```yaml
purpose: Unresolved questions that block or shape future work. Evidence-backed only.
confidence: ★★★★☆
generated_from:
  - AIIMIN_KNOWLEDGE_CONTEXT/03_PRODUCT_DECISIONS.md
  - docs/knowledge/01_PRODUCT/Product.md
  - docs/knowledge/00_HOME.md
  - MASTER_PLAN.md
  - docs/knowledge/10_DECISIONS/*
  - docs/knowledge/17_NATIVE_APP_V2/*
  - docs/AIIMIN_PRODUCT_BIBLE/11_EXPERIMENTS.md
related_notes: [14_CONTRADICTIONS.md, 11_ROADMAP_HISTORY.md, 16_VALUABLE_IDEAS.md]
dependencies: [03_PRODUCT_DECISIONS.md]
consumers: Founder / PM / architecture agents
importance: ★★★★★
```

---

## P0 OPEN (LAUNCH / PRODUCT INTEGRITY)

| # | Question | Why open | Blocking? | Hints |
|---|----------|----------|-----------|-------|
| Q1 | When do GA4 + Sentry + LC-01..14 complete? | Listed blockers; no completion evidence | Launch | Home, Product.md |
| Q2 | Tester E2E / LC-12 done? | Explicitly pending | Launch | Product.md |
| Q3 | Flip `REACT_APP_WAITLIST_MODE=false` when? | Tied to go-live end Sep | GTM | Product.md |
| Q4 | Stripe live billing vs click-upgrade forever? | Click-upgrade shipped; Stripe env exists | Monetization | Personalization, click-upgrade spec |

---

## P1 OPEN (DOCTRINE → IMPLEMENTATION)

| # | Question | Why open | Hints |
|---|----------|----------|-------|
| Q5 | Onboarding 9→3 ship date? | E-02 proposed; Onboarding still life-mode gate | Bible 11, FUTURE framework |
| Q6 | Mood primitive schema design? | 5 surfaces; no single table cited | INFORMATION_GRAPH, kill list |
| Q7 | UrgeEvent migration timing? | ADR accepted; schema pending; need owner ask | ADR-Discipline |
| Q8 | `anchor_edges` migration timing? | ADR accepted; schema pending | ADR-Notes |
| Q9 | Discipline FE localStorage residual cleared? | MASTER_PLAN 0.5.1 PENDING; API hydrate partial | MASTER_PLAN, Discipline MOC |
| Q10 | Interaction telemetry taxonomy ship? | "proposed, not shipped" | Bible 11 |
| Q11 | Elite Intelligence paradigm pick? | 6 Design Lab directions; none chosen | Reports/Prototypes.md |
| Q12 | Today Design Lab prototype pick? | 6 prototypes | Typography.md |

---

## P2 OPEN (PLATFORM)

| # | Question | Why open | Hints |
|---|----------|----------|-------|
| Q13 | Capacitor sunset date vs native GA? | Parallel tracks | Monorepo, Capacitor MOC |
| Q14 | iOS native timeline? | Android-first; Phase 4 decision | Native 20_ROADMAP, Product Guide |
| Q15 | On-device LLM build vs buy? | Long-term idea; no ADR | Future Ideas |
| Q16 | Passkeys/WebAuthn vs PIN priority? | Kill list defers PIN; no ship date | kill list |
| Q17 | HealthKit/Google Fit passive import priority? | Kill→System; not shipped | Future Ideas |
| Q18 | Clerk fully purged from code+docs? | MASTER_PLAN/Progress still mention | Stale docs |

---

## P3 OPEN (NATIVE SCOPE TENSION)

| # | Question | Why open | Hints |
|---|----------|----------|-------|
| Q19 | Native P0 includes Practice/MCQ or Journal/Notes/Vault-first? | PRD vs Feature Selection conflict | `14_CONTRADICTIONS.md` |
| Q20 | Guest local-only mode (D9b)? | Proposal only | Native Index |
| Q21 | E2E encrypted journal path priority? | Roadmap theme; not MVP | Native PRD |
| Q22 | Native WORKFLOW ~92% vs IN_CONFLICT APIs — true readiness? | Tracker optimism | WORKFLOW-PLAN |

---

## P4 OPEN (KNOWLEDGE / RESEARCH)

| # | Question | Why open | Hints |
|---|----------|----------|-------|
| Q23 | AIIMIN name etymology / founding story? | Not in vault | Naming History gap |
| Q24 | Real user interviews ever recorded elsewhere? | Meetings folder empty | User Research |
| Q25 | Light canvas canonical `#f9f9f9` or `#EDE4D3`? | Doc conflict | Contradictions |
| Q26 | Life Score hard cap 0–98? | Product Guide cites; Bible formula unclear | Product Guide |

---

## RESOLUTION PROTOCOL

For each Q:
1. Prefer evidence in vault over memory
2. If schema involved → explicit owner ask
3. Update Feature MOC + Current-Context when answered
4. Append changelog; never rewrite history
