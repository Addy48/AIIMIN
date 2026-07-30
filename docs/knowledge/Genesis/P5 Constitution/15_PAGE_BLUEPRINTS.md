# 15 — Page Blueprints

```yaml
document: Page Blueprints
version: 3.0
last_updated: 2026-07-22
rule: Architecture only — never UI mockups
```

## Purpose

Define the architectural contract for every major surface: purpose, mindset, actions, hierarchy, components, success/failure — so screens can change while roles cannot.

## Reasoning

Page sprawl and duplicate primitives were major findings of the interaction audit. Blueprints force each surface to declare its job. Names include Genesis titles and shipped aliases.

## Evidence

Human Problems; User Journeys; Navigation decisions; Device ceilings; Feature thesis decisions; Interaction friction heatmap.

## Shared blueprint schema

Each page uses:

Purpose · Primary objective · User mindset · Primary actions · Secondary actions · Expected emotions · Information hierarchy · Required components · Optional components · Success criteria · Failure criteria · Device notes · Related

Plus meta block: Purpose/Reasoning/Evidence already covered globally; each page adds Tradeoffs / Risks where distinct.

---

## P-01 Today (Overview)

| Field | Contract |
|-------|----------|
| **Purpose** | Daily command center: orient + capture + next actions |
| **Primary objective** | User completes meaningful capture/execution without tourism |
| **User mindset** | “What matters now?” |
| **Primary actions** | Capture via Universal Logger; confirm briefing; habit toggles |
| **Secondary actions** | Jump to domain; open palette; glance Life Score |
| **Expected emotions** | Clarity, relief, momentum |
| **Information hierarchy** | 1) Capture/briefing 2) Today’s execution 3) Signals 4) Deep links |
| **Required components** | Capture/Logger, BrandLockup/nav, HabitToggle set, Feedback |
| **Optional components** | LifeScore glance, briefing card, limited widgets |
| **Success** | Capture <60s path exists; one primary action obvious |
| **Failure** | Widget flea market; Quick Capture tile grid returns; analytics overload on first paint |
| **Device** | Full on desktop/tablet; phone web uses `/m` instead |

## P-02 Mobile Capture (`/m`)

| Field | Contract |
|-------|----------|
| **Purpose** | In-the-wild data collection only |
| **Primary objective** | Log life events fast with one thumb |
| **User mindset** | “Get this in before I forget / while urge is hot” |
| **Primary actions** | Log journal/note/habit/spend/etc. per capture tools |
| **Secondary actions** | Minimal account/status |
| **Expected emotions** | Speed, safety, no FOMO for missing charts |
| **Information hierarchy** | Capture tools → confirmation → done |
| **Required** | Capture controls, feedback, auth gate as needed |
| **Optional** | Lightweight history of today’s captures |
| **Success** | No analytics/insights/pomodoro/tools |
| **Failure** | Shipping desktop review tools “because phone is powerful” |
| **Device** | Phone web only ceiling; native ≠ this ceiling |

## P-03 Knowledge (Notes)

| Field | Contract |
|-------|----------|
| **Purpose** | Source-grounded reference library linked to life graph |
| **Primary objective** | Find/save durable knowledge without journaling here |
| **User mindset** | “What do I know / where is that reference?” |
| **Primary actions** | Search, open, capture note/reference, link entity |
| **Secondary actions** | Tag, attach source, OCR label (future) |
| **Expected emotions** | Orientation, trust in sources |
| **Hierarchy** | Search/find → item → links/metadata |
| **Required** | Search, note item, empty teach state |
| **Optional** | Graph/link panel, import |
| **Success** | Distinct from Journal; no handwriting canvas religion |
| **Failure** | Second journal; GoodNotes clone; canvas-as-identity |

## P-04 Documents

| Field | Contract |
|-------|----------|
| **Purpose** | File artifacts storage and retrieval (IDs, PDFs, vault docs) |
| **Primary objective** | Retrieve the right file under time pressure |
| **User mindset** | “I need this document now” |
| **Primary actions** | Upload, find, open, share/export appropriately |
| **Secondary actions** | Label, OCR assist, attach to family member |
| **Expected emotions** | Preparedness, calm under urgency |
| **Hierarchy** | Find → document → actions → metadata |
| **Required** | File list/find, upload, confirm destructive delete |
| **Optional** | Preview, labels, family linkage |
| **Success** | Fast retrieval; clear ownership |
| **Failure** | Mixing Documents with Notes prose editor as one mush |

## P-05 Family

| Field | Contract |
|-------|----------|
| **Purpose** | Care infrastructure and emergency readiness |
| **Primary objective** | Maintain people + critical info without daily friction wall |
| **User mindset** | Setup: careful. Emergency: urgent clarity |
| **Primary actions** | View member essentials; progressive emergency wizard; docs access |
| **Secondary actions** | Edit fields, wallet export, permissions |
| **Expected emotions** | Responsibility, readiness — never social performativity |
| **Hierarchy** | People → critical essentials → documents → deep fields |
| **Required** | Member surfaces, progressive wizard, ConfirmDialog, docs hooks |
| **Optional** | Tabs for domains; card menus |
| **Success** | Progressive disclosure; never infer meds/allergies |
| **Failure** | 65-field wall; social network features; silent medical inference |

## P-06 Finance

| Field | Contract |
|-------|----------|
| **Purpose** | Capture spending/income and understand money patterns |
| **Primary objective** | Log money with minimal decisions; review calmly |
| **User mindset** | Capture: haste. Review: curiosity without shame |
| **Primary actions** | NL/log transaction; confirm chips; scan budgets |
| **Secondary actions** | Edit category; reports deep-link |
| **Expected emotions** | Control, honesty |
| **Hierarchy** | Capture → recent → budgets/signals → deep analysis |
| **Required** | Capture path, chips, list, confirm destructive |
| **Optional** | Charts (review mode), rules |
| **Success** | Not stuck on 6-field-only path; no invented txs |
| **Failure** | Category dropdown as only path; shame copy |

## P-07 AI / Intelligence

| Field | Contract |
|-------|----------|
| **Purpose** | Mixed-initiative intelligence: route, infer, analyze, coach, compose |
| **Primary objective** | Deliver actionable understanding without chatbot cosplay |
| **User mindset** | “Help me see and act” |
| **Primary actions** | Run/refresh insight; accept/edit suggestions; jump to action |
| **Secondary actions** | Provider/debug for power users (not default) |
| **Expected emotions** | Clarity, partnership |
| **Hierarchy** | Outcome → evidence → actions → controls |
| **Required** | Coaching blocks with action links; chips; confidence-aware UI |
| **Optional** | Lab tools entry (secondary) |
| **Success** | Non-clinical; interruptibility respected |
| **Failure** | Decorative AI; therapist persona; blocking capture |

## P-08 Timeline / Calendar

| Field | Contract |
|-------|----------|
| **Purpose** | Chronology for planning and memory |
| **Primary objective** | Place commitments in time; see what happened |
| **User mindset** | Plan ahead / reconstruct when |
| **Primary actions** | Quick-add event; reschedule; open day |
| **Secondary actions** | Link goal/focus; NL time parse |
| **Expected emotions** | Order, anticipatory calm |
| **Hierarchy** | Time canvas → event → details |
| **Required** | Calendar surface, quick-add, feedback |
| **Optional** | Agenda list, conflicts |
| **Success** | Not a social feed; planning merges with briefing elsewhere |
| **Failure** | Engagement infinite scroll; duplicate planners |

## P-09 Settings

| Field | Contract |
|-------|----------|
| **Purpose** | Rare preferences, account, privacy, billing gates |
| **Primary objective** | Change durable configuration safely |
| **User mindset** | Deliberate, low frequency |
| **Primary actions** | Update prefs; security; export/delete |
| **Secondary actions** | Theme OS sync; nav pins; integrations |
| **Expected emotions** | Control, safety |
| **Hierarchy** | Account/privacy → preferences → dangerous zone |
| **Required** | ConfirmDialog/typed confirm; export/delete paths |
| **Optional** | Advanced labs flags (hidden from casual) |
| **Success** | No daily capture parked here |
| **Failure** | Junk drawer; dark pattern upgrade loops |

## P-10 Search / Command Palette

| Field | Contract |
|-------|----------|
| **Purpose** | Universal find + intent routing |
| **Primary objective** | One utterance → correct entity/action |
| **User mindset** | “Do the thing / find the thing” |
| **Primary actions** | Type/speak; select route; Enter to execute |
| **Secondary actions** | Preview; recent |
| **Expected emotions** | Power, flow |
| **Hierarchy** | Input → ranked intents/results → execute |
| **Required** | Palette, keyboard submit, clear results semantics |
| **Optional** | AI log routing confidence display |
| **Success** | First-class IA spine |
| **Failure** | Power-user only secret; slow; surprising writes |

## P-11 Profile / Identity

| Field | Contract |
|-------|----------|
| **Purpose** | Self-authorship: who I am becoming (Life Arc, profile) |
| **Primary objective** | Maintain coherent identity inputs for coaching/graph |
| **User mindset** | Reflective, occasional |
| **Primary actions** | Edit arc/profile essentials |
| **Secondary actions** | Pillars, persona presets |
| **Expected emotions** | Agency, continuity |
| **Hierarchy** | Identity summary → editable essentials → deep |
| **Required** | Single Life Arc source; save feedback |
| **Optional** | Composer assists |
| **Success** | One arc editor primitive |
| **Failure** | Three arc editors; public profile performance |

## P-12 Journal

| Field | Contract |
|-------|----------|
| **Purpose** | Reflection capture |
| **Primary objective** | Write now; structure later |
| **User mindset** | Vent / reflect / process |
| **Primary actions** | Write/save; optional mood after or inferred |
| **Secondary actions** | Analyze, tag, link |
| **Expected emotions** | Relief, privacy |
| **Hierarchy** | Capture surface → history → enrichment |
| **Required** | Capture field, save, privacy-safe feedback |
| **Optional** | Analysis panel post-save |
| **Success** | No mode gate before write |
| **Failure** | CBT/mode walls; body in analytics; five mood pickers |

## P-13 Goals

| Field | Contract |
|-------|----------|
| **Purpose** | Direction and decomposition |
| **Primary objective** | Set direction and connect to execution |
| **User mindset** | Aspiring, planning |
| **Primary actions** | Create/edit goal; review milestones |
| **Secondary actions** | Link habits/calendar; AI propose milestones |
| **Expected emotions** | Direction without overwhelm |
| **Hierarchy** | Active goals → milestones → links |
| **Required** | Goal list/detail, save, empty teach |
| **Optional** | NL create, priority inference (no mandatory dropdown) |
| **Success** | Connected to habits/time |
| **Failure** | Orphan goals; priority ritual theater |

## P-14 Habits

| Field | Contract |
|-------|----------|
| **Purpose** | Recurring commitments |
| **Primary objective** | Honest complete/skip with minimal friction |
| **User mindset** | Execute |
| **Primary actions** | Toggle done |
| **Secondary actions** | Create/edit; review streaks as info |
| **Expected emotions** | Competence |
| **Hierarchy** | Today habits → manage library |
| **Required** | HabitToggle, feedback |
| **Optional** | NL create |
| **Success** | Toggle remains best-in-class low friction |
| **Failure** | Shame streak weapons; create modal obesity |

## P-15 Focus

| Field | Contract |
|-------|----------|
| **Purpose** | Protected deep work |
| **Primary objective** | Start/stop session; keep world out |
| **User mindset** | Concentrate |
| **Primary actions** | Start, pause, complete |
| **Secondary actions** | Link goal; reflection after |
| **Expected emotions** | Depth, protection |
| **Hierarchy** | Timer/session → linked context → after |
| **Required** | Session controls; interruptibility lock (no coaching modals mid-focus) |
| **Optional** | Soft completion note |
| **Success** | Protected state honored |
| **Failure** | Mid-focus AI interruptions; tools smuggled onto `/m` |

## P-16 Discipline

| Field | Contract |
|-------|----------|
| **Purpose** | Pattern-aware urge/habit tooling (non-clinical) |
| **Primary objective** | Log context and choose replacement actions |
| **User mindset** | Stressed / urge / recovery |
| **Primary actions** | Quick log; pick replacement |
| **Secondary actions** | Review patterns |
| **Expected emotions** | Agency without shame |
| **Hierarchy** | Quick capture → patterns → settings/consent |
| **Required** | Fast log; consent for AI on urge notes |
| **Optional** | Insights links |
| **Success** | Pattern language; no therapist |
| **Failure** | Addiction score; JITAI harassment |

## P-17 Reports (Review)

| Field | Contract |
|-------|----------|
| **Purpose** | Calm consumption of derived intelligence |
| **Primary objective** | Answer “how am I doing?” across time |
| **User mindset** | Reflective review |
| **Primary actions** | Change period; drill into domain; act on recommendation |
| **Secondary actions** | Export review |
| **Expected emotions** | Clarity, honesty |
| **Hierarchy** | Summary → pillars → details → actions |
| **Required** | Period controls, Life Score/aggregates, empty teach |
| **Optional** | Elite interactive depth (not PDF-length theater) |
| **Success** | Consolidated read surface |
| **Failure** | Duplicate Insights app; vanity charts only |

## P-18 Lab

| Field | Contract |
|-------|----------|
| **Purpose** | Power/experimental tools |
| **Primary objective** | Advanced work without becoming the homepage |
| **User mindset** | Explorer / power user |
| **Primary actions** | Launch a tool with clear purpose |
| **Secondary actions** | Configure tool |
| **Expected emotions** | Capability |
| **Hierarchy** | Tool list with purpose → tool |
| **Required** | Clear tool purpose labels |
| **Optional** | ATS etc. |
| **Success** | Not the only entry for basics; not 14-module carnival as default path |
| **Failure** | Choice overload as primary IA |

## P-19 Placements

| Field | Contract |
|-------|----------|
| **Purpose** | Career pipeline tracking |
| **Primary objective** | Track applications with low CRM pain |
| **User mindset** | Job search logistics |
| **Primary actions** | Add via URL/paste; move stage; open detail |
| **Secondary actions** | Resume vault shared with ATS |
| **Expected emotions** | Organization |
| **Hierarchy** | Pipeline → application → artifacts |
| **Required** | Pipeline, add flow, confirm deletes |
| **Optional** | ATS link, email-parse future |
| **Success** | Shared resume primitive |
| **Failure** | Duplicate resume uploads as religion |

## P-20 Brand

| Field | Contract |
|-------|----------|
| **Purpose** | Human Momentum manifesto and identity book |
| **Primary objective** | Communicate philosophy and identity |
| **User mindset** | Curious / aligned |
| **Primary actions** | Read, scroll sections; exit to product |
| **Secondary actions** | Legal/compliance sections as part of book |
| **Expected emotions** | Trust, aspiration |
| **Hierarchy** | Brand hero → pillars → systems → policies |
| **Required** | Brand composition rules; always-light manifesto OK |
| **Optional** | Motion presence (budgeted) |
| **Success** | Brand test passes without nav |
| **Failure** | Mini-story replacing lockup; purple OAuth cosplay |

## P-21 Onboarding

| Field | Contract |
|-------|----------|
| **Purpose** | Activation to first capture |
| **Primary objective** | Time-to-value minutes, not schema education |
| **User mindset** | Tentative |
| **Primary actions** | Auth; minimal preset; first capture |
| **Secondary actions** | Defer PIN/security ritual |
| **Expected emotions** | Welcome without interrogation |
| **Hierarchy** | Identity → light preset → capture |
| **Required** | Short path; teach empty/shortcut |
| **Optional** | Tour stops (compressed) |
| **Success** | Toward 3-step spirit; first capture fast |
| **Failure** | 9-step wall; wake-time trivia gates |

## P-22 Sports / Health context (when present)

| Field | Contract |
|-------|----------|
| **Purpose** | Contextual health/sports signals as life OS inputs |
| **Primary objective** | Review and light capture without becoming fitness-only app |
| **User mindset** | Body context |
| **Primary actions** | View signals; confirm imports |
| **Secondary** | Opt-in sensors |
| **Emotions** | Informed |
| **Success** | Opt-in; non-clinical |
| **Failure** | Dominating IA; shame body scoring |

---

## Cross-page laws

1. Every page declares device ceiling.
2. New page proposal must kill or merge an overlapping page role.
3. Capture pages never require review-page density.
4. Review pages never require capture-page urgency chrome.

## Dependencies

[[06_INFORMATION_ARCHITECTURE_PRINCIPLES]] · [[13_NAMING_LANGUAGE]] · [[16_COMPONENT_BLUEPRINTS]].

## Future impact

Blueprints are the acceptance tests for redesigns: if purpose/hierarchy change, amend Bible; if only pixels change, leave blueprint.

## Tradeoffs

Many pages documented increases maintenance. Fewer ambiguous pages is the point.

## Known risks

- Blueprint names vs route path drift — keep aliases in Naming Language.
- Lab absorbing features that belong on Today.

## Related sections

[[16_COMPONENT_BLUEPRINTS]] · [[18_NON_NEGOTIABLES]] · [[19_EXECUTIVE_SCORECARD]]
