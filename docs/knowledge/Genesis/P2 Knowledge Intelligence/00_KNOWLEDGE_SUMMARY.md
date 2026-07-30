# 00 — Knowledge Summary

```yaml
purpose: Machine entrypoint. Reconstruct WHY AIIMIN exists + how institutional memory is organized without reading full vault.
confidence: ★★★★★
generated_from:
  - docs/AIIMIN_PRODUCT_BIBLE/*
  - docs/product-intelligence/*
  - docs/knowledge/00_HOME.md
  - docs/knowledge/01_PRODUCT/*
  - PRODUCT.md
  - pass-2 extraction 2026-07-22
related_notes:
  - 01_PRODUCT_HISTORY.md
  - 02_PRODUCT_PHILOSOPHY.md
  - 19_KNOWLEDGE_GRAPH.md
  - 20_MANIFEST.md
dependencies: none (read first)
consumers: Codex, agents, new AI teams, Product Bible refresh
importance: ★★★★★
pass: 2/6
generated: 2026-07-22
corpus_files_audited: 208
```

---

## WHY AIIMIN EXISTS

| Claim | Evidence | Path |
|-------|----------|------|
| Single surface for capture → pattern → action | "Capture once. AIIMIN remembers, connects, and coaches — without turning life into data entry." | `docs/AIIMIN_PRODUCT_BIBLE/01_VISION.md` |
| Replace app-per-domain fragmentation | Spreadsheet era → app-per-domain → **user expresses intent; system structures** | same |
| Closed loop | "capture → score → insight → action" | `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md` |
| Anti-engagement product | Refuses ad tracking, data harvesting, streak shame, feature bloat | same |
| Brand frame | *Human Momentum* — infrastructure for momentum, not engagement dashboard | same |
| Audience | Students / early-career builders under high cognitive load | `PRODUCT.md` |

**One-line thesis for Codex:** AIIMIN is an AI-first personal Life OS that minimizes data-entry burden by routing human intent into a connected data graph, then coaching with honest metrics — never clinical diagnosis, never social network, never vanity analytics.

---

## IDENTITY SNAPSHOT

| Field | Value |
|-------|-------|
| Name | AIIMIN (pronounced *aim-in*) |
| Category | Personal Life OS |
| Owner | Aaditya Upadhyay |
| Brand philosophy | Human Momentum (9 pillars) |
| Tagline (product) | One screen. Every day. |
| Tagline (vision) | Capture once. AIIMIN remembers, connects, and coaches. |
| Primary surfaces | Desktop web Life OS · phone web `/m` capture · native Android companion |
| Backend | Node API `api.aiimin.in` · Supabase Postgres · Better Auth |
| Frontend host | Vercel |
| Palette accent | `#ff6b35` LOCKED |
| Launch target | End Sep 2026 · tester close 31 Jul 2026 |

---

## STRATEGIC PILLARS (CYCLE)

```
Frictionless Capture → Connected Data Graph → Actionable Intelligence → User Trust → Capture
```

---

## NON-NEGOTIABLES (TOP 12)

1. Capture beats configuration
2. Intent over interface
3. Mobile `/m` = capture only (phone web); native ≠ that ceiling
4. Palette LOCKED (`#1a1a1a` / `#2d2d2d` / `#ff6b35`)
5. No clinical mental-health claims
6. Journal body never in analytics
7. No auth/schema change without explicit owner ask
8. Vault ships with code
9. One linking system (`anchor_edges`) — no parallel graphs
10. Navbar: logo → `/brand`; wordmark → `/overview`
11. Sparring over sycophancy
12. Kill list is a feature (things never to ask/build)

Full set: `02_PRODUCT_PHILOSOPHY.md` · `docs/AIIMIN_PRODUCT_BIBLE/13_PRODUCT_PRINCIPLES.md`

---

## SUCCESS / FAILURE METRICS

| Type | Metric | Target / signal |
|------|--------|-----------------|
| North star | Weekly Active Capture (WAC) | 60% among activated @ launch+90d |
| Success | Daily capture time | <60s · median interactions ≤5 |
| Success | Life Score | Honest composite, not XP theater |
| Failure | High interaction cost | Median daily interactions stuck ~15 |
| Failure | Shame loops / diagnostic AI | Violates product identity |
| Failure | Capture-only native as final product | Called "product fraud" in Device-Tiers |

Source: `docs/AIIMIN_PRODUCT_BIBLE/12_METRICS.md`, `01_VISION.md`

---

## PRODUCT STATE (AS OF 2026-07-19 VAULT)

| Layer | State |
|-------|-------|
| Web Life OS | High code progress; waitlist gate; craft/UI polish local |
| Phone `/m` | Capture stopgap (Capacitor legacy) |
| Native Android V2 | Compose shipping ~92% per WORKFLOW-PLAN; APK 2.2.1-native |
| Launch blockers | GA4, Sentry, LC-01..14, tester E2E |
| Doctrine | Product Bible Phase 8 complete (2026-07-11) |
| Memory OS | Vault Brain OS cutover 2026-07-10 |

---

## CORPUS MAP (WHERE TRUTH LIVES)

| Need | Canonical path |
|------|----------------|
| Doctrine | `docs/AIIMIN_PRODUCT_BIBLE/` |
| Intelligence phases 2–7 | `docs/product-intelligence/` |
| Interaction audit | `docs/interaction-audit/` |
| Operational vault | `docs/knowledge/` |
| Product guide (features) | `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md` |
| Agent handoff | `docs/knowledge/15_MEMORY/Current-Context.md` |
| ADRs | `docs/knowledge/10_DECISIONS/` |
| Native PRD pack | `docs/knowledge/17_NATIVE_APP_V2/` |
| Stale plan (partial) | `MASTER_PLAN.md` (2026-06-25 — verify before trust) |
| Pre-Brain history | `docs/knowledge/99_ARCHIVE/pre-brain-os-2026-07-10/` |

---

## PACKAGE INDEX

| File | Role |
|------|------|
| `00_KNOWLEDGE_SUMMARY.md` | This file |
| `01_PRODUCT_HISTORY.md` | Chronology |
| `02_PRODUCT_PHILOSOPHY.md` | Beliefs / principles |
| `03_PRODUCT_DECISIONS.md` | Decision catalog |
| `04_DESIGN_HISTORY.md` | Design evolution |
| `05_ARCHITECTURE_HISTORY.md` | Arch evolution |
| `06_RESEARCH_INDEX.md` | Research bibliography map |
| `07_USER_RESEARCH.md` | Personas / testers / friction |
| `08_FEATURE_HISTORY.md` | Per-feature pivots |
| `09_NAMING_HISTORY.md` | Renames |
| `10_BRAND_HISTORY.md` | Brand surfaces |
| `11_ROADMAP_HISTORY.md` | Plans over time |
| `12_DECISION_LOG.md` | ADR + implicit decisions |
| `13_OPEN_QUESTIONS.md` | Unresolved |
| `14_CONTRADICTIONS.md` | Conflicts |
| `15_OBSOLETE_IDEAS.md` | Dead paths |
| `16_VALUABLE_IDEAS.md` | Unimplemented gold |
| `17_PRD_INDEX.md` | Spec inventory |
| `18_RESEARCH_GRAPH.md` | Research→rule edges |
| `19_KNOWLEDGE_GRAPH.md` | Note graph |
| `20_MANIFEST.md` | Package + corpus manifest |

---

## HOW CODEX SHOULD LOAD

1. This file
2. `02_PRODUCT_PHILOSOPHY.md` + `14_CONTRADICTIONS.md`
3. Task-specific: `08_FEATURE_HISTORY` / `05_ARCHITECTURE_HISTORY` / `10_BRAND_HISTORY`
4. Only then open vault source paths listed under `generated_from`
5. Prefer Product Bible + Product Guide over `MASTER_PLAN.md` when conflict

---

## PASS NOTES

| Field | Value |
|-------|-------|
| Pass | Knowledge Intelligence 2/6 |
| Method | Full vault audit + Product Bible + product-intelligence + interaction-audit |
| Mutations to vault notes | NONE |
| Output location | `AIIMIN_KNOWLEDGE_CONTEXT/` |
| Confidence overall | ★★★★☆ (high on doctrine; medium on pre-2026-06 history — thin git ledger) |
