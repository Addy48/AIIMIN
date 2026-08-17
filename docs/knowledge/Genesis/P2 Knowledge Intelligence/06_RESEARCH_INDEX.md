# 06 — Research Index

```yaml
purpose: Index of all research corpora, domains, and how they feed product rules.
confidence: ★★★★★
generated_from:
  - docs/product-intelligence/RESEARCH_FOUNDATIONS.md
  - docs/AIIMIN_PRODUCT_BIBLE/10_RESEARCH.md
  - docs/AIIMIN_PRODUCT_BIBLE/11_EXPERIMENTS.md
  - docs/product-intelligence/*
  - docs/interaction-audit/*
  - audit.md
related_notes: [07_USER_RESEARCH.md, 18_RESEARCH_GRAPH.md, 17_PRD_INDEX.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Research / PM / AI design agents
importance: ★★★★☆
```

---

## RESEARCH CORPORA

| Corpus | Path | Date | Type | Importance |
|--------|------|------|------|------------|
| Research Foundations | `docs/product-intelligence/RESEARCH_FOUNDATIONS.md` | 2026-07-11 | Academic→product synthesis | ★★★★★ |
| Bible Research summary | `docs/AIIMIN_PRODUCT_BIBLE/10_RESEARCH.md` | 2026-07-11 | Condensed bibliography | ★★★★☆ |
| Interaction Audit | `docs/interaction-audit/` | 2026-07-11 | 578-interaction empirical audit | ★★★★★ |
| Product Intelligence Layer | `docs/product-intelligence/PRODUCT_INTELLIGENCE_LAYER.md` | 2026-07-11 | 94-field matrix | ★★★★★ |
| Information Graph | `docs/product-intelligence/INFORMATION_GRAPH.md` | 2026-07-11 | Entity graph | ★★★★★ |
| Human Intent Graph | `docs/product-intelligence/HUMAN_INTENT_GRAPH.md` | 2026-07-11 | Intent taxonomy | ★★★★★ |
| Kill List | `docs/product-intelligence/things_aiimin_should_stop_asking.md` | 2026-07-11 | Infer/Kill/Keep | ★★★★★ |
| Compression Score | `docs/product-intelligence/INTERACTION_COMPRESSION_SCORE.md` | 2026-07-11 | Flow compression | ★★★★☆ |
| Future Framework | `docs/product-intelligence/FUTURE_AIMIN_FRAMEWORK.md` | 2026-07-11 | Automation matrix | ★★★★☆ |
| Complete merge | `docs/product-intelligence/COMPLETE_PRODUCT_INTELLIGENCE.md` | 2026-07-11 | Handoff dump | ★★★★☆ |
| Behavioral audit | `audit.md` | ~2026-06 | Internal critique | ★★★☆☆ |
| Selfloop QA | `docs/knowledge/11_BUGS/QA-Run-*` | 2026-07-12/14 | QA empirical | ★★★☆☆ |
| Screenshot UI brief | `12_SPRINTS/UI-Improvement-Brief-2026-07-18.md` | 2026-07-18 | Visual audit | ★★★☆☆ |
| Native skills synthesis | `17_NATIVE_APP_V2/00_SKILLS_SYNTHESIS.md` | 2026-07-19 | Native UX research pack | ★★★★☆ |

---

## ACADEMIC DOMAINS (PHASE 7)

| # | Domain | Key names | AIIMIN implication |
|---|--------|-----------|-------------------|
| 1 | Mixed-initiative UI | Horvitz, Maes, Shneiderman | Confidence bands; correction chips |
| 2 | Personal informatics | Li, Epstein, Consolvo | Capture stages; post-structure |
| 3 | Lifelogging | MyLifeBits, ethics of forgetting | Journal/Notes/export/delete |
| 4 | Interruptibility | Iqbal, Fogarty, Myers | No Focus interruption |
| 5 | Passive sensing | HealthKit / Google Research | Kill→System for sleep/steps |
| 6 | Digital phenotyping | Torous, Mohr, Insel/RDoC | No diagnostic claims |
| 7 | UIST input | Wobbrock et al. | Voice/palette efficiency |
| 8 | Agentic AI | ReAct-style | Multi-table writes from one utterance |
| 9 | Behavior change / habits | (synthesis) | Pattern language not shame |
| 10 | Privacy / consent | Exposure-notification style consent | Opt-in passive; journal privacy |

Full citations: `RESEARCH_FOUNDATIONS.md`

---

## EMPIRICAL PRODUCT RESEARCH (NON-ACADEMIC)

| Study | Finding | Actioned? |
|-------|---------|-----------|
| Interaction audit friction | Onboarding 6.8, Family 6.5, Finance 5.8 high; Journal capture 3.8 better | Kill list + compression targets |
| Field matrix 94 fields | Many inferrable; duplicates (mood×5) | P0 mood unify planned |
| June behavioral audit | Punitive streaks demotivate; fake Insights XP domains | Partial — tension open |
| Selfloop QA | Hundreds of defects; production lag | Local fixes; ship pending |
| 38-screenshot pass | Launch polish P0–P4 | UI brief |

---

## PROPOSED EXPERIMENTS (NOT RUN)

From `11_EXPERIMENTS.md` E-01..E-08 (A/B proposed, telemetry mostly not shipped):
- Onboarding compression
- Finance infer chips
- Journal mode removal
- Palette adoption
- Mood unification
- Others listed in Bible 11

**Status:** Proposed ≠ validated. Do not cite as results.

---

## RESEARCH → RULE PIPELINE

```
Academic domain → RESEARCH_FOUNDATIONS implication
      ↓
Product Intelligence Phase (field/intent/kill)
      ↓
Product Bible principle / never-build
      ↓
ADR or planned P0
      ↓
Implementation (often pending)
```

Graph edges: `18_RESEARCH_GRAPH.md`
