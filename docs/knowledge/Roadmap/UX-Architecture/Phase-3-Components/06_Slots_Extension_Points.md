---
authority: operations
derived_from: Genesis C-5 · composition · Intelligence families
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Architecture-v1
phase: 3-components
---

# 06 — Slots and Extension Points

## Slot model (architectural — not CSS)

| Family | Required slots / regions | Optional extension |
|--------|--------------------------|--------------------|
| EmptyState | `icon/illustration` · `title` · `teach body` · `primary action` | secondary action |
| ConfirmDialog | `title` · `body` · `confirm` · `cancel` | typed-confirm field (peak stakes) |
| Modal | `header` · `body` · `footer actions` | — |
| Drawer | `header` · `body` | footer |
| Metric (merged) | `label` · `value` · `delta/context` | spark/mini viz slot (not third card family) |
| Nav masthead | `brand lockup` · `pins` · `utilities` | — |
| Command palette | `search` · `results` · `inline action` | voice (experimental) |
| Capture/Logger | `input` · `submit` · `chips` | attachments — no structure wizard slot blocking Catch |
| List row | `leading` · `primary text` · `meta` · `trailing action` | — |
| Alert/Live | `message` · `politeness` | action link |
| Chart host | `chart` · `loading` · `empty` · `error` | legend |

## Extension points

| ID | Extension | Rule |
|----|-----------|------|
| EX-01 | Domain may extend T4 rows | Must keep a11y name + done/error states |
| EX-02 | Domain may theme via tokens later (DS) | Must not fork behavioral contract |
| EX-03 | Native re-implements render | Must map to same slots/contracts |
| EX-04 | Charts selective add | Must use chart host slots for L/E/Err |
| EX-05 | KokonutUI | Extension only inside T9 audit gate — not default EX for shell |
| EX-06 | No extension that adds Structure Offer UI on `/m` | DH-42 · D05 |

## Anti-extension

New parallel Metric card · new Confirm · new Empty without teach · AI glow wrapper with no behavior.
