# 19 — Knowledge Graph
```yaml
purpose: Machine graph of important vault notes — classification, scores, relations.
confidence: ★★★★☆
generated_from:
  - curated from 208-doc corpus audit 2026-07-22
  - not a rewrite of notes; extraction layer only
related_notes: [20_MANIFEST.md, 00_KNOWLEDGE_SUMMARY.md, 17_PRD_INDEX.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Codex note routing
importance: ★★★★★
```

## SCORING KEY
| Field | Meaning |
|-------|---------|| Importance | Impact if ignored |
| Confidence | Evidence quality in note |
| Freshness | Recency / not stale |
| Design relevance | UI/brand impact |
| Engineering relevance | System impact |
| Historical importance | Timeline value |

## NODE TABLE
| Title | Path | Category | Status | Imp | Conf | Fresh | Design | Eng | Hist | Summary | Validity |
|-------|------|----------|--------|-----|------|-------|--------|-----|------|---------|----------|
| AIIMIN Product Bible Index | `docs/AIIMIN_PRODUCT_BIBLE/00_INDEX.md` | Documentation | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | Doctrine entry for AI-first Life OS | 2026-07-11 |
| Vision | `docs/AIIMIN_PRODUCT_BIBLE/01_VISION.md` | Vision | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | Capture-once Life OS vision and pillars | 2026-07-11 |
| Philosophy | `docs/AIIMIN_PRODUCT_BIBLE/02_PHILOSOPHY.md` | Mission | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★★ | 10 core beliefs and design tensions | 2026-07-11 |
| Human Problems | `docs/AIIMIN_PRODUCT_BIBLE/03_HUMAN_PROBLEMS.md` | Research | current | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | 10 human problems mapped to features | 2026-07-11 |
| Information Model | `docs/AIIMIN_PRODUCT_BIBLE/04_INFORMATION_MODEL.md` | Architecture | current | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | Entity layers and duplicate primitives | 2026-07-11 |
| Interaction Model | `docs/AIIMIN_PRODUCT_BIBLE/05_INTERACTION_MODEL.md` | Research | partially_stale | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | 578-interaction audit summary | 2026-07-11 |
| AI Model | `docs/AIIMIN_PRODUCT_BIBLE/06_AI_MODEL.md` | Engineering | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | AI roles, confidence bands, must-nots | 2026-07-11 |
| Automation Rules | `docs/AIIMIN_PRODUCT_BIBLE/07_AUTOMATION_RULES.md` | Engineering | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | Infer vs ask vs never ask | 2026-07-11 |
| Data Graph Bible | `docs/AIIMIN_PRODUCT_BIBLE/08_DATA_GRAPH.md` | Architecture | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | ER and Life Score formula | 2026-07-11 |
| User Journey Bible | `docs/AIIMIN_PRODUCT_BIBLE/09_USER_JOURNEY.md` | Research | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | Intent journeys current→target | 2026-07-11 |
| Research Bible | `docs/AIIMIN_PRODUCT_BIBLE/10_RESEARCH.md` | Research | current | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★☆☆ | Bibliography summary | 2026-07-11 |
| Experiments Bible | `docs/AIIMIN_PRODUCT_BIBLE/11_EXPERIMENTS.md` | Experiment | proposed | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ | Proposed A/B E-01..E-08 | 2026-07-11 |
| Metrics Bible | `docs/AIIMIN_PRODUCT_BIBLE/12_METRICS.md` | Planning | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | ★★★☆☆ | WAC north star and funnels | 2026-07-11 |
| Product Principles | `docs/AIIMIN_PRODUCT_BIBLE/13_PRODUCT_PRINCIPLES.md` | Mission | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★★ | 20 non-negotiable principles | 2026-07-11 |
| Future Ideas | `docs/AIIMIN_PRODUCT_BIBLE/14_FUTURE_IDEAS.md` | Roadmap | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | Ambient capture roadmap | 2026-07-11 |
| Never Build | `docs/AIIMIN_PRODUCT_BIBLE/15_THINGS_NEVER_TO_BUILD.md` | Planning | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ | Anti-patterns and traps | 2026-07-11 |
| Complete Product Intelligence | `docs/product-intelligence/COMPLETE_PRODUCT_INTELLIGENCE.md` | Reference | current | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | Merged phases 2-8 handoff | 2026-07-11 |
| Product Intelligence Layer | `docs/product-intelligence/PRODUCT_INTELLIGENCE_LAYER.md` | Research | current | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | 94-field infer/kill matrix | 2026-07-11 |
| Information Graph | `docs/product-intelligence/INFORMATION_GRAPH.md` | Architecture | current | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | Data-first entity graph | 2026-07-11 |
| Human Intent Graph | `docs/product-intelligence/HUMAN_INTENT_GRAPH.md` | Research | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | Intent taxonomy and flows | 2026-07-11 |
| Kill List | `docs/product-intelligence/things_aiimin_should_stop_asking.md` | Planning | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | Kill/Infer/System/Keep verdicts | 2026-07-11 |
| Future AIIMIN Framework | `docs/product-intelligence/FUTURE_AIMIN_FRAMEWORK.md` | Roadmap | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | Automation matrix and agent checklist | 2026-07-11 |
| Research Foundations | `docs/product-intelligence/RESEARCH_FOUNDATIONS.md` | Research | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | 10 academic domains→rules | 2026-07-11 |
| Compression Score | `docs/product-intelligence/INTERACTION_COMPRESSION_SCORE.md` | Research | current | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ | Per-flow compression targets | 2026-07-11 |
| Complete Interaction Audit | `docs/interaction-audit/COMPLETE_INTERACTION_AUDIT.md` | Research | partially_stale | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | Full interaction audit merge | 2026-07-11 |
| Friction Audit | `docs/interaction-audit/friction.md` | Research | current | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | Friction heatmap scores | 2026-07-11 |
| Home | `docs/knowledge/00_HOME.md` | Documentation | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★☆☆☆ | ★★★★☆ | ★★★★★ | Agent entrypoint and blockers | 2026-07-19 |
| Current Context | `docs/knowledge/15_MEMORY/Current-Context.md` | Journal | current | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | Live handoff memory | 2026-07-19 |
| Product Guide | `docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md` | Documentation | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★★ | Canonical web product guide | 2026-07-18 |
| Product Snapshot | `docs/knowledge/01_PRODUCT/Product.md` | Documentation | current | ★★★★★ | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | Waitlist LC env snapshot | 2026-07-19 |
| Palette | `docs/knowledge/08_DESIGN/Palette.md` | Design | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★★ | Locked color tokens | 2026-07-15 |
| Architecture Overview | `docs/knowledge/02_ARCHITECTURE/Overview.md` | Architecture | current | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | ★★★★☆ | System overview and constraints | 2026-07-19 |
| Monorepo | `docs/knowledge/02_ARCHITECTURE/Monorepo.md` | Architecture | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★☆☆☆ | ★★★★★ | ★★★★★ | Three-client commit law | 2026-07-19 |
| Device Tiers | `docs/knowledge/02_ARCHITECTURE/Device-Tiers.md` | Architecture | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★★ | Phone/tablet/desktop/native ceilings | 2026-07-19 |
| AI Pipeline | `docs/knowledge/02_ARCHITECTURE/AI-Pipeline.md` | Architecture | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | ★★★☆☆ | AI routes and providers | 2026-07-18 |
| Frontend Arch | `docs/knowledge/02_ARCHITECTURE/Frontend.md` | Architecture | current | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ | React stack and pages | 2026-07-18 |
| Deploy | `docs/knowledge/07_DEPLOYMENT/Deploy.md` | Documentation | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★☆☆☆☆ | ★★★★★ | ★★★☆☆ | Deploy procedures | 2026-07-19 |
| ADR Vault Brain OS | `docs/knowledge/10_DECISIONS/2026-07-10-vault-brain-os.md` | Architecture | accepted | ★★★★★ | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★★★ | Vault cutover decision | 2026-07-10 |
| ADR Notes SourceGrounded | `docs/knowledge/10_DECISIONS/ADR-Notes-SourceGrounded.md` | Architecture | accepted_pending | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★★☆ | Notes reference library ADR | 2026-07-13 |
| ADR Discipline UrgeEvent | `docs/knowledge/10_DECISIONS/ADR-Discipline-UrgeEvent.md` | Architecture | accepted_pending | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | UrgeEvent non-clinical model | 2026-07-13 |
| Features Index | `docs/knowledge/09_FEATURES/Index.md` | Documentation | current | ★★★★☆ | ★★★★★ | ★★★★★ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | Feature MOC index | 2026-07-19 |
| Waitlist | `docs/knowledge/09_FEATURES/Waitlist/Waitlist.md` | Implementation | shipped | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | Waitlist gate and GTM | 2026-07-17 |
| Waitlist Changelog | `docs/knowledge/09_FEATURES/Waitlist/Changelog.md` | Journal | current | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | Dense brand/auth history | 2026-07-17 |
| Auth | `docs/knowledge/09_FEATURES/Auth/Auth.md` | Implementation | shipped | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★★ | ★★★★☆ | Better Auth login gates | 2026-07-18 |
| Overview | `docs/knowledge/09_FEATURES/Overview/Overview.md` | Implementation | shipped | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | Today/Universal Logger | 2026-07-15 |
| Journal | `docs/knowledge/09_FEATURES/Journal/Journal.md` | Implementation | in_progress | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | Journal studio craft | 2026-07-15 |
| Notes | `docs/knowledge/09_FEATURES/Notes/Notes.md` | Implementation | local | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | OCR Drive Notes | 2026-07-18 |
| Discipline | `docs/knowledge/09_FEATURES/Discipline/Discipline.md` | Implementation | planned | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ | Discipline urge redesign | 2026-07-13 |
| Reports | `docs/knowledge/09_FEATURES/Reports/Reports.md` | Implementation | partial | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | Tiered reports product | 2026-07-18 |
| Reports Prototypes | `docs/knowledge/09_FEATURES/Reports/Prototypes.md` | Prototype | design_lab | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★☆☆☆ | ★★★☆☆ | Elite Design Lab paradigms | 2026-07-18 |
| Navigation | `docs/knowledge/09_FEATURES/Navigation/Navigation.md` | Implementation | shipped | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | Free-pin masthead | 2026-07-15 |
| Onboarding | `docs/knowledge/09_FEATURES/Onboarding/Onboarding.md` | Implementation | shipped | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | Life-mode gate and tour | 2026-07-15 |
| Capacitor Android | `docs/knowledge/09_FEATURES/Mobile/Capacitor-Android.md` | Implementation | legacy | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | Legacy /m WebView shell | 2026-07-19 |
| Family | `docs/knowledge/09_FEATURES/Family/Family.md` | Implementation | shipped | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ | Household vault | 2026-07-19 |
| Native Index | `docs/knowledge/17_NATIVE_APP_V2/00_INDEX.md` | Documentation | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★★ | ★★★★★ | Native pack entry + D1-D9 | 2026-07-19 |
| Native Feature Selection | `docs/knowledge/17_NATIVE_APP_V2/00_FEATURE_SELECTION.md` | Planning | locked | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | Website→native inclusion + tabs | 2026-07-19 |
| Native PRD | `docs/knowledge/17_NATIVE_APP_V2/01_PRD.md` | Draft | draft | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | Master native PRD v0.2 | 2026-07-19 |
| Native IA | `docs/knowledge/17_NATIVE_APP_V2/03_INFORMATION_ARCHITECTURE.md` | Architecture | complete | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | 5-tab screen hierarchy | 2026-07-19 |
| Native UX | `docs/knowledge/17_NATIVE_APP_V2/05_NATIVE_UX.md` | Design | complete | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | Native interaction patterns | 2026-07-19 |
| Native Design System | `docs/knowledge/17_NATIVE_APP_V2/06_DESIGN_SYSTEM.md` | Design | draft | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ | M3 token mapping | 2026-07-19 |
| Native Roadmap | `docs/knowledge/17_NATIVE_APP_V2/20_ROADMAP.md` | Roadmap | current | ★★★★☆ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ | Phases 0-5 Android plan | 2026-07-19 |
| Native Workflow Plan | `docs/knowledge/17_NATIVE_APP_V2/WORKFLOW-PLAN.md` | Planning | active | ★★★★★ | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★★★ | ★★★☆☆ | Live P0-P3 tracker | 2026-07-19 |
| Craft Master Plan | `docs/knowledge/12_SPRINTS/Craft-Master-Plan-AJ.md` | Planning | local_complete | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | Web craft tracks A-J | 2026-07-15 |
| UI Improvement Brief | `docs/knowledge/12_SPRINTS/UI-Improvement-Brief-2026-07-18.md` | Planning | local | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | Screenshot polish P0-P4 | 2026-07-18 |
| PRODUCT.md | `PRODUCT.md` | Mission | current | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ | Concise product register | 2026-07-14 |
| DESIGN.md | `DESIGN.md` | Design | current_conflict | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★★ | ★★★☆☆ | ★★★☆☆ | Visual system summary | 2026-07-14 |
| MASTER_PLAN.md | `MASTER_PLAN.md` | Roadmap | stale_partial | ★★★☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | June 12-week plan | 2026-06-25 |
| Progress Summary | `AIIMIN_PROGRESS_SUMMARY.md` | Archive | stale | ★★☆☆☆ | ★★☆☆☆ | ★★☆☆☆ | ★☆☆☆☆ | ★★☆☆☆ | ★★★★☆ | June readiness snapshot | 2026-06-30 |
| audit.md | `audit.md` | Research | historical | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★☆☆☆ | ★★★★☆ | June behavioral critique | 2026-06 |
| Pre-Brain Archive README | `docs/knowledge/99_ARCHIVE/pre-brain-os-2026-07-10/README.md` | Archive | archive | ★★☆☆☆ | ★★★☆☆ | ★☆☆☆☆ | ★☆☆☆☆ | ★☆☆☆☆ | ★★★★☆ | Archive pointer | 2026-07-10 |
| Git Timeline Archive | `docs/knowledge/99_ARCHIVE/pre-brain-os-2026-07-10/06-History/Git-Timeline.md` | Archive | archive | ★★☆☆☆ | ★★☆☆☆ | ★☆☆☆☆ | ★☆☆☆☆ | ★☆☆☆☆ | ★★★☆☆ | Sparse early git ledger | 2026-07-04 |
| Brain OS Spec | `docs/superpowers/specs/2026-07-10-vault-brain-os-design.md` | Documentation | approved | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★☆☆☆☆ | ★★★☆☆ | ★★★★☆ | Brain OS design spec | 2026-07-10 |

## RELATION EDGES (IMPORTANT)
| From | Rel | To |
|------|-----|----|
| Vision | grounds | Philosophy |
| Philosophy | codifies | Product Principles |
| Product Principles | enforces | Never Build |
| Research Foundations | feeds | Philosophy |
| Research Foundations | feeds | AI Model |
| Kill List | feeds | Never Build |
| Kill List | feeds | Future AIIMIN Framework |
| Complete Interaction Audit | summarized_in | Interaction Model |
| Human Intent Graph | drives | User Journey Bible |
| Information Graph | aligns | Information Model |
| Product Guide | implements | Vision |
| PRODUCT.md | compresses | Product Guide |
| Palette | locks | DESIGN.md |
| ADR Vault Brain OS | creates | Home |
| Home | requires | Current Context |
| Monorepo | defines | Device Tiers |
| Device Tiers | clarifies | Capacitor Android |
| Device Tiers | clarifies | Native Index |
| Native Index | contains | Native PRD |
| Native Feature Selection | may_conflict | Native PRD |
| ADR Notes SourceGrounded | governs | Notes |
| ADR Discipline UrgeEvent | governs | Discipline |
| Waitlist Changelog | records | Auth |
| Waitlist Changelog | records | Palette |
| Reports Prototypes | explores | Reports |
| Craft Master Plan | polishes | Journal |
| MASTER_PLAN.md | superseded_in_part_by | Product Guide |
| Metrics Bible | measures | Vision |
| Future Ideas | extends | Future AIIMIN Framework |

## CATEGORY COUNTS (THIS GRAPH)
| Category | Count |
|----------|-------|
| Architecture | 12 |
| Implementation | 11 |
| Research | 11 |
| Documentation | 8 |
| Planning | 7 |
| Design | 4 |
| Roadmap | 4 |
| Archive | 3 |
| Mission | 3 |
| Engineering | 2 |
| Journal | 2 |
| Draft | 1 |
| Experiment | 1 |
| Prototype | 1 |
| Reference | 1 |
| Vision | 1 |

## COVERAGE NOTE

Curated **72** high-signal nodes from **208** markdown files under `docs/` (+ root product docs). Full path inventory: `_source_inventory.txt` and `20_MANIFEST.md`.

Empty / template-only (no institutional content beyond stubs):
- `docs/knowledge/13_MEETINGS/`
- `docs/knowledge/17_EXPERIMENTS/`
