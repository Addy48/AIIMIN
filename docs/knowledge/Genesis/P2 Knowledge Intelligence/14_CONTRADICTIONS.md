# 14 — Contradictions

```yaml
purpose: Documented conflicts between sources. Authority order + resolution state.
confidence: ★★★★★
generated_from:
  - MASTER_PLAN.md
  - DESIGN.md
  - docs/knowledge/08_DESIGN/Palette.md
  - docs/AIIMIN_PRODUCT_BIBLE/05_INTERACTION_MODEL.md
  - docs/knowledge/02_ARCHITECTURE/Device-Tiers.md
  - docs/knowledge/02_ARCHITECTURE/Monorepo.md
  - docs/knowledge/17_NATIVE_APP_V2/01_PRD.md
  - docs/knowledge/17_NATIVE_APP_V2/00_FEATURE_SELECTION.md
  - docs/knowledge/09_FEATURES/Reports/Reports.md
  - docs/interaction-audit/*
  - AIIMIN_PROGRESS_SUMMARY.md
related_notes: [03_PRODUCT_DECISIONS.md, 12_DECISION_LOG.md, 13_OPEN_QUESTIONS.md]
dependencies: [12_DECISION_LOG.md]
consumers: Codex before trusting any single doc
importance: ★★★★★
```

---

## AUTHORITY ORDER (REPEAT)

1. Owner explicit ask
2. Product locks (palette, `/m` web, auth/schema, navbar)
3. Formal ADRs
4. Product Bible + Product Guide (newer wins within)
5. Newest Feature changelog entry
6. MASTER_PLAN / June summaries (stale risk)

---

## CONTRADICTION REGISTER

| ID | Topic | Side A | Side B | Resolution | Still open? |
|----|-------|--------|--------|------------|-------------|
| C01 | Auth provider | MASTER_PLAN / Progress: Clerk | Auth/Waitlist: Better Auth | **B wins** | No (docs cleanup optional) |
| C02 | Accent color | MASTER_PLAN: `#2563EB` | Palette: `#ff6b35` | **B locked** | No |
| C03 | Light bg | DESIGN.md `#f9f9f9` | Palette ivory `#EDE4D3` | Prefer Palette; DESIGN claims Palette canonical | **Yes** — unify docs |
| C04 | Light accent | `#ff6b35` vs `#E85A24` | Both in Palette notes | Unclear which light surfaces use | Yes |
| C05 | Mobile capture-only | Universal "phone=capture" | Native rich companion | **Split intentional** — web `/m` only | No (must teach agents) |
| C06 | Separate mobile app | Bible Never-Build: avoid separate mobile app routes | Native+Capacitor clients exist | Trap = don't duplicate web routes; native intentional | No |
| C07 | `/m` exists? | Interaction audit 2026-07-11: no `/m` | Device-Tiers + Capacitor load `/m` | Audit outdated/missed DeviceGate | No |
| C08 | Bible 05 `/m` router | "No `/m` router; responsive+BottomNav" | Explicit `/m` routes | Device-Tiers newer | No |
| C09 | Onboarding step count | MASTER 8 · Bible journeys 9 · target 3 | Compression agreed; current count ambiguous | Direction clear; count unclear | Yes |
| C10 | Native P0 scope | PRD Practice/MCQ | Feature Selection Journal/Notes/Vault-first | Selection later revision; PRD unsettled | **Yes** |
| C11 | Elite Reports | Changelog "shipping" | Same: production shell not shipped | Elite still craft | Yes (status hygiene) |
| C12 | Craft/UI "DONE" | Items marked DONE | Explicitly local uncommitted | Honest: local≠prod | No |
| C13 | Launch readiness | High code progress | LC/GA4/Sentry open | ~75% June claim; blockers remain | Yes |
| C14 | Insights entity | Bible data graph separate Insights | Product Guide redirect to Reports | Consolidation in progress | Mild |
| C15 | Life Score range | Product Guide 0–98 | Bible formula no explicit cap | Unverified | Yes |
| C16 | Discipline streak thesis | June audit: punitive streaks bad | Product still shows streaks | Tension vs ADR pattern language | **Yes** |
| C17 | Telemetry | Bible: proposed not shipped | Some correlation/widgets shipped | Product-intel telemetry ≠ full funnel | Mild |
| C18 | Capacitor | Legacy not V2 | Still receiving P0 fixes | Parallel until native GA | Mild |
| C19 | Native progress | WORKFLOW ~92% / P3 100% | Also IN_PROGRESS / IN_CONFLICT | Tracker optimism | Yes |
| C20 | Waitlist prices | Historical ₹15/₹25 vs ₹29 | Waitlist.md table current | Use Waitlist.md | No |
| C21 | Schema ADRs | Accepted | Process: no schema without ask | Accepted ≠ migrated | No (process) |

---

## AGENT FAILURE MODES FROM CONTRADICTIONS

| Failure | Prevention |
|---------|------------|
| Build capture-only native | Read C05 + Device-Tiers |
| Reintroduce Clerk/blue accent | Read C01 C02 |
| Trust MASTER_PLAN sprint DONE cells | Prefer Feature MOCs |
| Add analytics to `/m` | Product lock |
| Migrate schema from kill list alone | C21 + auth/schema lock |
| Pick Elite PDF length as Elite | Reports Prototypes |

---

## SUPERSEDED-BUT-STILL-PRESENT DOCS

| Doc | Treat as |
|-----|----------|
| MASTER_PLAN.md design/auth sections | Historical |
| AIIMIN_PROGRESS_SUMMARY.md auth | Historical |
| Bible 05 mobile routing lines | Historical |
| Interaction audit `/m` absence claim | Historical |
| archive Command Center | Historical |
