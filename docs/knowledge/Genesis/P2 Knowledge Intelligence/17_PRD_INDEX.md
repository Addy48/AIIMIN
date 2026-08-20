# 17 — PRD Index

```yaml
purpose: Inventory of PRDs, specs, and doctrine docs with status for Codex routing.
confidence: ★★★★☆
generated_from:
  - docs/knowledge/17_NATIVE_APP_V2/**
  - docs/knowledge/01_PRODUCT/**
  - docs/AIIMIN_PRODUCT_BIBLE/**
  - docs/superpowers/**
  - docs/knowledge/12_SPRINTS/**
  - docs/product-intelligence/**
related_notes: [06_RESEARCH_INDEX.md, 11_ROADMAP_HISTORY.md, 19_KNOWLEDGE_GRAPH.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Agents selecting which spec to obey
importance: ★★★★★
```

---

## CLASSIFICATION

| Class | Meaning |
|-------|---------|
| `doctrine` | Product Bible / principles |
| `prd` | Requirements |
| `spec` | Design/implementation spec |
| `plan` | Sprint/roadmap |
| `intel` | Research intelligence |
| `moc` | Feature living doc |

---

## CANONICAL PRODUCT DOCS

| Path | Class | Purpose | Status | Importance |
|------|-------|---------|--------|------------|
| `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md` | prd | Full web Life OS guide | canonical-shipped | ★★★★★ |
| `docs/knowledge/01_PRODUCT/Product.md` | moc | Snapshot + LC + waitlist | current | ★★★★★ |
| `PRODUCT.md` | doctrine | Concise register | current | ★★★★★ |
| `DESIGN.md` | spec | Visual system | current (light bg conflict) | ★★★★☆ |

---

## PRODUCT BIBLE (DOCTRINE PACK)

| Path | Purpose | Status |
|------|---------|--------|
| `docs/AIIMIN_PRODUCT_BIBLE/00_INDEX.md` | Index | Phase 8 complete 2026-07-11 |
| `01_VISION.md` | Vision | current |
| `02_PHILOSOPHY.md` | Beliefs | current |
| `03_HUMAN_PROBLEMS.md` | Problem map | current |
| `04_INFORMATION_MODEL.md` | Info model | current |
| `05_INTERACTION_MODEL.md` | Interaction summary | partially stale on `/m` |
| `06_AI_MODEL.md` | AI behavior | current |
| `07_AUTOMATION_RULES.md` | Infer/ask | current |
| `08_DATA_GRAPH.md` | ER/Life Score | current |
| `09_USER_JOURNEY.md` | Journeys | current |
| `10_RESEARCH.md` | Research summary | current |
| `11_EXPERIMENTS.md` | Proposed A/B | proposed |
| `12_METRICS.md` | WAC + funnels | current |
| `13_PRODUCT_PRINCIPLES.md` | 20 principles | current |
| `14_FUTURE_IDEAS.md` | Ambient roadmap | current |
| `15_THINGS_NEVER_TO_BUILD.md` | Anti-patterns | current |

---

## NATIVE V2 PACK

| Path | Class | Purpose | Status |
|------|-------|---------|--------|
| `17_NATIVE_APP_V2/00_INDEX.md` | index | Entry + decisions D1–D9 | active |
| `00_MASTER_PLAN.md` | plan | Native thesis | active |
| `00_FEATURE_SELECTION.md` | prd | Inclusion matrix + 5-tab IA | locked rev 2026-07-19 |
| `00_SKILLS_SYNTHESIS.md` | intel | Skills→native | complete |
| `01_PRD.md` | prd | Master native PRD | draft v0.2; sign-off pending |
| `02_USER_JOURNEYS.md` | spec | Journeys | complete |
| `03_INFORMATION_ARCHITECTURE.md` | spec | Screen hierarchy | complete revised |
| `04_APP_FLOW.md` | spec | State machine | complete |
| `05_NATIVE_UX.md` | spec | UX + kill list | complete revised |
| `06_DESIGN_SYSTEM.md` | spec | M3 tokens | complete draft |
| `07_MOTION.md` | spec | Motion | complete |
| `08_FEATURES.md` | spec | Per-feature native | complete |
| `09_BACKEND.md`–`19_TECH_STACK.md` | spec | Eng stack docs | complete |
| `20_ROADMAP.md` | plan | Phases 0–5 | complete |
| `17_LEGAL/*` | legal | Policies | draft; LEGAL REVIEW REQUIRED |
| `WORKFLOW-PLAN.md` | plan | Live P0–P3 tracker | active |
| `CHANGELOG.md` | moc | Native doc changelog | active |

---

## SUPERPOWERS SPECS

| Path | Purpose | Status |
|------|---------|--------|
| `docs/superpowers/specs/2026-07-10-vault-brain-os-design.md` | Brain OS design | approved |
| `docs/superpowers/plans/2026-07-10-vault-brain-os.md` | Implementation plan | shipped |
| `docs/superpowers/specs/2026-07-11-click-upgrade-celebration-design.md` | Tier upgrade UX | shipped per spec |

---

## SPRINT / CRAFT PLANS

| Path | Purpose | Status |
|------|---------|--------|
| `12_SPRINTS/Sprint-Current.md` | Current sprint pointer | active |
| `12_SPRINTS/Craft-Master-Plan-AJ.md` | Tracks A–J | local complete |
| `12_SPRINTS/Craft-Status-Report-2026-07-15.md` | Status | snapshot |
| `12_SPRINTS/Craft-Program-Master-Status.md` | Master status | snapshot |
| `12_SPRINTS/UI-Improvement-Brief-2026-07-18.md` | Launch polish | local honesty |

---

## PRODUCT INTELLIGENCE SPECS

| Path | Purpose | Status |
|------|---------|--------|
| `COMPLETE_PRODUCT_INTELLIGENCE.md` | Merged handoff | 2026-07-11 |
| `PRODUCT_INTELLIGENCE_LAYER.md` | Field matrix | current |
| `INFORMATION_GRAPH.md` | Entities | current |
| `HUMAN_INTENT_GRAPH.md` | Intents | current |
| `things_aiimin_should_stop_asking.md` | Kill list | current |
| `FUTURE_AIMIN_FRAMEWORK.md` | Automation | current |
| `RESEARCH_FOUNDATIONS.md` | Bibliography | current |
| `INTERACTION_COMPRESSION_SCORE.md` | Compression | current |

---

## ADRs AS MINI-PRDS

| Path | Purpose | Status |
|------|---------|--------|
| `10_DECISIONS/2026-07-10-vault-brain-os.md` | Memory OS | accepted shipped |
| `10_DECISIONS/ADR-Notes-SourceGrounded.md` | Notes architecture | accepted_pending |
| `10_DECISIONS/ADR-Discipline-UrgeEvent.md` | Discipline architecture | accepted_pending |

---

## ROOT PLANS (USE CAREFULLY)

| Path | Purpose | Trust |
|------|---------|-------|
| `MASTER_PLAN.md` | 12-week build plan | stale sections |
| `AIIMIN_PROGRESS_SUMMARY.md` | June readiness | stale auth |

---

## ROUTING RULES FOR CODEX

| Task | Read first |
|------|------------|
| Why / principles | Bible 01–02–13–15 |
| Web feature behavior | Product Guide + Feature MOC |
| Native feature | Feature Selection → PRD → IA |
| Kill a field | kill list + Never-Build |
| Visual | Palette + DESIGN + Brand History |
| Agent process | Brain OS ADR + Home + Current-Context |
