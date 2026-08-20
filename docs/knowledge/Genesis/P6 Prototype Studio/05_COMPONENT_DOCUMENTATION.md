# 05 — Component Documentation

## Primitives

| Component | States | A11y |
|-----------|--------|------|
| Button primary | default, pressed, disabled | 44px min; focus ring accent |
| Button soft | default, pressed | Same |
| Chip | idle, selected, disabled | `aria-pressed` |
| Toggle | off, on | `role="switch"` |
| Text field | idle, focus, error | label association |
| Row | idle, pressed | button or link semantics |
| Card | static / interactive | Prefer static unless whole card acts |
| FAB | default, pressed | `aria-label="Capture"` |
| Sheet | closed, opening, open | focus trap; Esc closes |
| Drawer | closed/open | scrim dismiss |
| Toast | hidden/shown | polite live region |
| Progress bar | determinate | `aria-valuenow` |
| Skeleton | loading | hide from AT when replaced |
| PIN keypad | digit entry | announced count |
| Nav item | idle, active | `aria-current="page"` |
| Tab | idle, selected | tablist pattern |
| Empty state | — | heading + CTA |

## Composite

| Composite | Contains |
|-----------|----------|
| Habit row | check, title, streak meta |
| Tx row | category thumb, title, amount |
| Memory card | title, excerpt, time |
| AI message | avatar, bubble, chips |
| Pulse hero | ring + score + label |
| Capture sheet | grabber, actions grid, cancel |
| Settings group | inset rows |

## Motion per component

See `06_MOTION_DOCUMENTATION.md`. Default: 220ms transform/opacity.

## Do not

- Nested cards  
- Emoji as primary iconography  
- Different button radii per page  
- Hover-only affordances on touch
