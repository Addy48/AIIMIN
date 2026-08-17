# 16 — Component Blueprints

```yaml
document: Component Blueprints
version: 3.0
last_updated: 2026-07-22
rule: Behavior only — never styling
```

## Purpose

Define reusable component contracts: purpose, behavior, interaction, accessibility, motion, priority, states, relationships, constraints.

## Reasoning

Component Principles forbid snowflake duplicates. Blueprints are the behavioral API designers and engineers share before pixels.

## Evidence

Interaction patterns (optimistic toggle, Enter-to-save, chips, ConfirmDialog); BrandLockup lock; capture primitive unification; a11y principles.

## Schema

Each component: Purpose · Behavior · Interaction · Accessibility · Motion · Priority · States · Relationships · Constraints

Priority: P0 critical path · P1 common · P2 specialized

---

## CB-01 CaptureField / Universal Logger

| | |
|--|--|
| **Purpose** | Fast life capture entry |
| **Behavior** | Accepts text/voice; submits on Enter/primary; routes via intent when palette-linked |
| **Interaction** | Focus → type → submit; minimal required fields |
| **Accessibility** | Labelled; keyboard submit; voice has typed fallback |
| **Motion** | Instant ready; subtle success feedback after save |
| **Priority** | P0 |
| **States** | empty, typing, submitting, success, error, offline-queued |
| **Relationships** | Palette, chips, toasts, domain entities |
| **Constraints** | Must not gate on mode/category; must not delay behind animation |

## CB-02 CommandPalette

| | |
|--|--|
| **Purpose** | Universal find + intent router |
| **Behavior** | Opens on chord; ranks commands/entities; executes selection |
| **Interaction** | Open → query → highlight → Enter/click; Esc closes |
| **Accessibility** | Focus trap; aria combobox/listbox patterns; announce results count |
| **Motion** | Fast present/dismiss; no cinematic tax |
| **Priority** | P0 |
| **States** | closed, open-empty, querying, results, executing, error |
| **Relationships** | CaptureField, navigation, AI router |
| **Constraints** | Surprising irreversible writes forbidden without confirm |

## CB-03 InferenceChip / ChipGroup

| | |
|--|--|
| **Purpose** | Surface and correct inferred structure |
| **Behavior** | Shows inferred value; tap cycles/edits; confirm or dismiss |
| **Interaction** | Tap to change; optional confirm row for medium confidence |
| **Accessibility** | Named buttons; keyboard operable; state announced |
| **Motion** | Subtle appear; no carnival |
| **Priority** | P0 |
| **States** | suggested, confirmed, editing, rejected |
| **Relationships** | Capture flows, finance, mood, goals |
| **Constraints** | Required whenever silent auto-fill occurs |

## CB-04 ConfirmDialog

| | |
|--|--|
| **Purpose** | Branded confirmation for destructive/risky acts |
| **Behavior** | Blocks until confirm/cancel; typed confirm when extreme |
| **Interaction** | Primary destructive vs cancel; Esc = cancel |
| **Accessibility** | Focus trap; labelled title/body; restore focus |
| **Motion** | Short present; reduced-motion OK as instant |
| **Priority** | P0 |
| **States** | open, confirming, typed-mismatch, closed |
| **Relationships** | Delete flows, account, vault |
| **Constraints** | Replaces `window.confirm`; never silent |

## CB-05 HabitToggle

| | |
|--|--|
| **Purpose** | Honest completion of a habit |
| **Behavior** | Optimistic toggle; reconcile on failure; undo window optional |
| **Interaction** | Single tap/click; keyboard activatable |
| **Accessibility** | Switch/checkbox semantics; name includes habit |
| **Motion** | Tiny feedback; no confetti spam |
| **Priority** | P0 |
| **States** | incomplete, complete, pending-sync, error |
| **Relationships** | Today, Habits, XP, Life Score inputs |
| **Constraints** | Must stay lowest-friction execution control |

## CB-06 MoodPrimitive

| | |
|--|--|
| **Purpose** | Single mood capture/display primitive |
| **Behavior** | Capture mood once; many surfaces read it |
| **Interaction** | Optional post-capture; may be inferred then chipped |
| **Accessibility** | Clear value name; not color-only |
| **Motion** | Minimal |
| **Priority** | P0 |
| **States** | unset, set, inferred, edited |
| **Relationships** | Journal, Daily Log, Insights |
| **Constraints** | No parallel fifth picker family |

## CB-07 BrandLockup

| | |
|--|--|
| **Purpose** | Split brand navigation lockup |
| **Behavior** | Mark navigates to `/brand`; wordmark to Today/overview |
| **Interaction** | Separate hit targets; no unified click |
| **Accessibility** | Two distinct links with distinct names |
| **Motion** | None required |
| **Priority** | P0 |
| **States** | default, focus per target |
| **Relationships** | Navbar/masthead |
| **Constraints** | LOCKED split; no mini-story replacement |

## CB-08 NavShells (Masthead / TabRail / BottomNav)

| | |
|--|--|
| **Purpose** | Device-appropriate wayfinding |
| **Behavior** | Expose pinned destinations; honor free-pin; overflow honest |
| **Interaction** | Navigate; pin management in settings/overflow |
| **Accessibility** | nav landmark; current page indicated |
| **Motion** | Optional subtle active indicator |
| **Priority** | P0 |
| **States** | default, overflow-open, pinned-edit |
| **Relationships** | BrandLockup, pages |
| **Constraints** | Phone web shell must not expose analytics tools |

## CB-09 EmptyStateTeach

| | |
|--|--|
| **Purpose** | Teach next action when no data |
| **Behavior** | Explains absence + CTA + shortcut when relevant |
| **Interaction** | CTA triggers primary create/capture |
| **Accessibility** | Textual; CTA labelled |
| **Motion** | None required |
| **Priority** | P1 |
| **States** | visible |
| **Relationships** | All list/capture pages |
| **Constraints** | Ban generic “No data” voids |

## CB-10 FeedbackToast / InlineError

| | |
|--|--|
| **Purpose** | Communicates success/failure/sync |
| **Behavior** | Appear after events; dismissible; queue sane |
| **Interaction** | Optional action (undo/retry) |
| **Accessibility** | Live region polite/assertive by severity |
| **Motion** | Short; reduced-motion instant |
| **Priority** | P0 |
| **States** | info, success, error, sync-pending |
| **Relationships** | All writes |
| **Constraints** | Never include journal body content |

## CB-11 LifeScore

| | |
|--|--|
| **Purpose** | Honest composite mirror |
| **Behavior** | Displays score + pillar contribution; links to review |
| **Interaction** | Open detail; not editable vanity |
| **Accessibility** | Numeric text equivalent |
| **Motion** | Subtle update; no slot-machine churn |
| **Priority** | P1 |
| **States** | loading, ready, empty, error |
| **Relationships** | Reports, Today glance, habits/goals/finance inputs |
| **Constraints** | Must not become XP cosmetics |

## CB-12 BriefingCard

| | |
|--|--|
| **Purpose** | Morning/next-actions merge |
| **Behavior** | Aggregates calendar/habits/goals into actionable briefing |
| **Interaction** | Confirm items; jump to domain |
| **Accessibility** | Structured list; headings |
| **Motion** | Calm enter |
| **Priority** | P1 |
| **States** | loading, ready, partial, empty |
| **Relationships** | Today, Calendar, Goals, Habits |
| **Constraints** | One card story > many widgets |

## CB-13 ProgressiveWizard

| | |
|--|--|
| **Purpose** | High-stakes multi-step setup (e.g., Family emergency) |
| **Behavior** | Steps by stakes; saves progress; never dumps all fields |
| **Interaction** | Next/Back; save & exit |
| **Accessibility** | Step announced; errors per step |
| **Motion** | Step transition short |
| **Priority** | P1 |
| **States** | step-n, validating, saving, complete |
| **Relationships** | Family, onboarding variants |
| **Constraints** | Safety fields always ask; never infer meds/allergies |

## CB-14 Overlay (Modal / Drawer)

| | |
|--|--|
| **Purpose** | Focused task without full route |
| **Behavior** | Opens with task; Esc/close; returns focus |
| **Interaction** | Complete task or dismiss |
| **Accessibility** | Focus trap; labelled |
| **Motion** | Short; respect reduced motion |
| **Priority** | P1 |
| **States** | open, submitting, closed |
| **Relationships** | Forms, confirms, mobile sheets |
| **Constraints** | Not for Focus-period coaching |

## CB-15 FormFieldProgressive

| | |
|--|--|
| **Purpose** | Collect only needed fields as stakes rise |
| **Behavior** | Shows minimal set; reveals more on demand/AI miss |
| **Interaction** | Edit; validate inline |
| **Accessibility** | Labels, errors linked |
| **Motion** | Reveal short |
| **Priority** | P1 |
| **States** | default, focused, error, disabled |
| **Relationships** | Finance, goals, family |
| **Constraints** | Not a excuse to recreate 6-field finance as only path |

## CB-16 SearchResultsList

| | |
|--|--|
| **Purpose** | Ranked find results |
| **Behavior** | Groups by type; keyboard highlight |
| **Interaction** | Arrow/Enter select |
| **Accessibility** | listbox/option or equivalent |
| **Motion** | Minimal |
| **Priority** | P1 |
| **States** | empty, results, no-match |
| **Relationships** | Palette, Knowledge, Documents |
| **Constraints** | Ranking must prefer intent match over novelty |

## CB-17 SyncIndicator

| | |
|--|--|
| **Purpose** | Honest offline/outbox state (esp. native) |
| **Behavior** | Shows pending/failed/synced |
| **Interaction** | Retry on failure |
| **Accessibility** | Status text available |
| **Motion** | Non-blocking |
| **Priority** | P1 |
| **States** | synced, pending, error, offline |
| **Relationships** | CaptureField, native outbox |
| **Constraints** | Must not fake success |

## CB-18 RecommendationAction

| | |
|--|--|
| **Purpose** | Coaching that links to action |
| **Behavior** | Shows observation + CTA into calendar/habit/finance/etc. |
| **Interaction** | Accept jumps; dismiss |
| **Accessibility** | Clear CTA name |
| **Motion** | None required |
| **Priority** | P1 |
| **States** | suggested, accepted, dismissed |
| **Relationships** | Intelligence, Reports |
| **Constraints** | Non-clinical language; no Focus interrupt |

## CB-19 XPPulse (celebration)

| | |
|--|--|
| **Purpose** | Celebrate action without rewriting truth |
| **Behavior** | Small acknowledgment of XP events |
| **Interaction** | Passive or tap for detail |
| **Accessibility** | Optional; not required for task success |
| **Motion** | Rare, proportional |
| **Priority** | P2 |
| **States** | idle, pulse |
| **Relationships** | Habits, wins |
| **Constraints** | Never override Life Score meaning; no confetti addiction |

## CB-20 ThemeAppearanceControl

| | |
|--|--|
| **Purpose** | Appearance preference |
| **Behavior** | Prefer OS sync; allow override |
| **Interaction** | Select appearance |
| **Accessibility** | Radiogroup/select labelled |
| **Motion** | None |
| **Priority** | P2 |
| **States** | system, light, dark |
| **Relationships** | Settings |
| **Constraints** | One control family — not three pickers |

---

## Global component laws

1. New component requires a blueprint entry.
2. Duplicate primitive = reject or merge.
3. Styling changes do not require blueprint edits; behavior changes do.
4. Cross-platform twins share this contract.

## Dependencies

[[10_COMPONENT_PRINCIPLES]] · [[08_INTERACTION_PRINCIPLES]] · [[14_DESIGN_SYSTEM_SPECIFICATION]].

## Future impact

Watch/voice components will add modality blueprints but reuse Capture, Confirm, Chip, Feedback contracts.

## Tradeoffs

Upfront blueprint cost vs years of duplicate mood pickers. Choose blueprints.

## Known risks

- Blueprint rot if not updated when behavior ships.
- Over-cataloging one-off page chrome as “components.”

## Related sections

[[15_PAGE_BLUEPRINTS]] · [[18_NON_NEGOTIABLES]]
