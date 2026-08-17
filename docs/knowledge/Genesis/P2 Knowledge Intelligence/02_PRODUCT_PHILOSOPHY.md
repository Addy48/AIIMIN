# 02 — Product Philosophy

```yaml
purpose: Machine-readable doctrine — beliefs, principles, non-negotiables, tradeoffs, AI/brand/user philosophies.
confidence: ★★★★★
generated_from:
  - docs/AIIMIN_PRODUCT_BIBLE/01_VISION.md
  - docs/AIIMIN_PRODUCT_BIBLE/02_PHILOSOPHY.md
  - docs/AIIMIN_PRODUCT_BIBLE/13_PRODUCT_PRINCIPLES.md
  - docs/AIIMIN_PRODUCT_BIBLE/15_THINGS_NEVER_TO_BUILD.md
  - docs/AIIMIN_PRODUCT_BIBLE/06_AI_MODEL.md
  - PRODUCT.md
  - docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md
related_notes: [00_KNOWLEDGE_SUMMARY.md, 03_PRODUCT_DECISIONS.md, 15_OBSOLETE_IDEAS.md, 18_RESEARCH_GRAPH.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Any agent making product/UX/AI decisions
importance: ★★★★★
```

---

## MISSION

Reduce life chaos by turning goals into daily behaviors inside one Life OS — capture once, remember connections, coach with honest data — without clinical claims or engagement dark patterns.

Evidence: `01_VISION.md`, `Product.md`, `AIIMIN-Product-Guide.md`

---

## VISION

| Element | Statement |
|---------|-----------|
| Vision | Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry. |
| Era claim | User expresses intent; system structures |
| Tagline | One screen. Every day. |
| Brand frame | Human Momentum |

---

## CORE BELIEFS (10)

| # | Belief | Implication |
|---|--------|-------------|
| 1 | Intent over interface | Do not force mode/pillar pickers before expression |
| 2 | Capture first, structure later | AI/defaults derive structure; always correctable |
| 3 | One primitive, many surfaces | No duplicate mood/arc/theme UIs |
| 4 | Progressive disclosure for stakes | Daily = zero setup; emergency vault = wizard |
| 5 | Mixed-initiative partnership | Act / suggest / ask by confidence |
| 6 | Read surfaces stay calm | Compress capture, not analysis |
| 7 | Mobile capture / desktop command | `/m` no analytics tools |
| 8 | Palette & identity sacred | One product feel |
| 9 | Sparring over sycophancy | Challenge habits with data |
| 10 | Ship intelligence with feature | Vault + telemetry + kill verdict with code |

Source: `02_PHILOSOPHY.md`

---

## NON-NEGOTIABLE PRINCIPLES (20)

### Product
1. Capture beats configuration
2. One utterance, many tables
3. Infer, then chip
4. Mobile captures; desktop commands
5. Life Score is honest

### Design
6. Palette locked
7. One mood primitive
8. Destructive actions confirm (ConfirmDialog)
9. Enter to save
10. Empty states teach shortcuts

### AI
11. No clinical claims
12. Journal encrypted; body not in analytics
13. Confidence-gated automation
14. Interruptibility respected (no Focus modals)
15. Export and delete always

### Engineering / process
16. Vault ships with code
17. No auth/schema without explicit ask
18. No secrets in vault
19. Telemetry privacy-first (hash PII; never log PIN)
20. Kill list is a feature

Source: `13_PRODUCT_PRINCIPLES.md`

---

## DESIGN PHILOSOPHY

| Rule | Detail |
|------|--------|
| Capture cost low | Intervene during urge, not only after |
| Pattern > shame | Pattern language over punitive streaks |
| One graph | AnchorEdge only |
| Familiarity > novelty | Design serves task |
| Device split | `/m` capture; desktop/tablet analytics |
| Anti-looks | No purple AI SaaS; no cream terracotta editorial AI; no broadsheet density; no GoodNotes PWA; no AI therapist |

Sources: `PRODUCT.md`, `DESIGN.md`

---

## ENGINEERING PHILOSOPHY

| Rule | Detail |
|------|--------|
| Monorepo, three clients | Web · Capacitor `/m` · Native — never mix commits |
| Vault Brain OS | Home → Context → Feature → Code; no whole-repo scan |
| API-backed truth | Prefer dedicated routes over localStorage-only |
| `/api/db` write locks | Goals/habits/daily_logs blocked on generic proxy |
| Solo-dev constraints | One feature at a time; M2 8GB memory awareness |
| No vendor attribution | No "built with" in docs/UI |

---

## AI PHILOSOPHY

| Role | Job |
|------|-----|
| Router | Intent → entity |
| Inferencer | Structure fields |
| Analyzer | Patterns |
| Coach | Non-clinical language |
| Composer | Summaries / digests |

| Confidence | Behavior |
|------------|----------|
| ≥70% | Auto-fill |
| 40–70% | Pre-fill + confirm chip |
| <40% | Minimal ask |
| Safety/legal | Never infer |

**Must not:** diagnose MH · auto-share journal · change auth/billing · block capture behind mode gates · invent finance transactions

Source: `06_AI_MODEL.md`

---

## BRAND PHILOSOPHY

| Item | Rule |
|------|------|
| Personality | Calm · precise · honest |
| Accent meaning | Orange = action; never shame chrome |
| Public brand | `/brand` Human Momentum manifesto (always light) |
| Nav lock | Mark → brand; wordmark → Today/overview |

Nine Human Momentum pillars (mapped in Product Guide §3): Absolute Precision, Feedback Loops, Behavioral Intelligence, Data Sovereignty, Momentum Engineering, Deep Mode State, Dimensional Analysis, Disciplined Growth, Adaptive Interventions.

---

## USER PHILOSOPHY

| Belief | Evidence |
|--------|----------|
| Users arrive with intents, not configuration desire | Philosophy #1 |
| High cognitive load audience | Students / early-career builders |
| Prefer practical coaching over vanity analytics | PRODUCT.md |
| Trust requires export/delete + encryption | Principles 12, 15 |
| Correction chips beat silent wrong automation | Infer-then-chip |

---

## ACCEPTED TRADEOFFS

| Tension | Resolution |
|---------|------------|
| Privacy vs inference | On-device where possible; chips |
| Power vs beginner | Command Palette + defaults |
| Gamification vs sincerity | XP celebrates; Life Score informs |
| Completeness vs speed | Infer + edit > ask upfront |
| Finance speed vs accuracy | Chip confirm default |
| Passive sensing vs privacy | Opt-in HealthKit; on-device prefer |

---

## SUCCESS METRICS (PHILOSOPHY-ALIGNED)

| Metric | Why it matches philosophy |
|--------|---------------------------|
| WAC | Value compounds from capture |
| Median interactions 15→5 | Intent > interrogation |
| Capture <60s | Frictionless capture pillar |
| Journal funnel >70% | Capture-first works |
| No diagnostic copy | Ethics boundary |

---

## FAILURE METRICS / ANTI-GOALS

| Failure | Why fatal |
|---------|-----------|
| Rising daily interaction count | Betrays compression thesis |
| Duplicate primitives proliferate | Breaks belief #3 |
| Clinical / therapist framing | Liability + identity break |
| Social feed / leaderboards | Not a network |
| Analytics on `/m` | Breaks device philosophy |
| Shame streak product | Anti Human Momentum |

---

## NEVER BUILD (PHILOSOPHY ENFORCEMENT)

See also `15_OBSOLETE_IDEAS.md`. Canonical: `15_THINGS_NEVER_TO_BUILD.md`

Gate questions before any feature:
1. Kill List?
2. Duplicate primitive?
3. Increases daily interactions?
4. Mobile stays capture-only?
5. Can AI infer instead?
