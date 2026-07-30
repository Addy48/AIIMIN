---
authority: operations
derived_from: frontend/src/components/ui · kokonutui · charts · waitlist · nav · mobile · native Compose
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 05 — Component Inventory

Reusable clusters only. Not every page-local widget.

| Family | Components (evidence) | Variants | Usage | Duplicates / inconsistency | States | A11y | Reuse | DS candidate |
|--------|----------------------|----------|-------|----------------------------|--------|------|-------|--------------|
| Button | `ui/button.jsx` · ad-hoc `<button>` | shadcn-like + raw | Global | Many raw buttons bypass primitive | hover/disabled uneven | Mixed | Med | Yes |
| Card | `ui/card.jsx` · page cards | card / metric cards | Domains | HeroMetricCard · MetricTile overlap | loading uneven | Weak | Med | Yes |
| Input | `ui/input.jsx` · textarea | text/area | Forms | Waitlist custom inputs | error/success | Better on Login | High | Yes |
| Modal/Dialog | Modal · ConfirmDialog | modal/confirm | Global | drawer.jsx parallel | focus trap uneven | Partial | High | Yes |
| Drawer/Sheet | `ui/drawer.jsx` | drawer | Mobile-ish | Bottom sheets native separate | — | Partial | Med | Yes |
| Empty | EmptyState · EmptyIllustrations | illustration sets | Domains | Copy inconsistent | empty only | Partial | High | Yes |
| Skeleton | Skeleton.jsx | sizes | Pages | — | loading | OK | High | Yes |
| Alert | StatusAlert · LiveRegion | status | Forms | toast libs? | live | Good LiveRegion | Med | Yes |
| Nav chrome | Navbar · BrandLockup · BottomNav · MobileBottomNav · TabRail | desktop/mobile | Shell | Multiple bottom bars | active | Mixed | High | Yes |
| Command | CommandPalette | palette | Desktop | — | keyboard | Partial | High | Yes |
| Lists/Rows | TaskRow · HabitCircle | row/circle | Habits/goals | — | done | Weak | Med | Yes |
| Selectors | MoodSelector · DeadlinePicker · dropdown-menu | pickers | Journal/forms | — | — | Mixed | Med | Yes |
| Metrics | Metric · MetricTile · HeroMetricCard · AnimatedNumber | metric | Overview | Overlap 3 metric cards | — | Weak | Med | Merge→DS |
| Charts | `components/charts/*` (~90) | many chart types | Finance/Reports/Sports | Chart zoo | loading/empty uneven | Weak | Low–Med | Selective |
| KokonutUI | `kokonutui/*` (~45) | motion/demo | Scattered | Parallel aesthetic | — | Unknown | Low | Audit/KEEP subset |
| Waitlist | `waitlist/*` (~22) | landing only | Public | Isolated system | form states | Better than avg | Low (brand) | Marketing DS |
| Family menus | FamilyCardMenu | menu | Family | — | expanded | role=menu | Med | Yes |
| Focus room | FocusRoom locals + tablet CSS | timer | Focus | Platform CSS fork | session | Mixed | Low | Domain |
| Mobile capture | MobileCaptureApp sections | capture forms | `/m` | Desktop logger parallel | offline | Touch CSS | Med | Capture DS |
| Native Compose | Screens + shared UI kits | Material/Compose | Native | Web≠native vocab | full | Platform | High native | Native DS |
| Tip | FeatureTip · tooltip | tip | Onboarding-ish | — | — | Mixed | Med | Yes |
| Badge | badge.jsx | badge | Tags | — | — | OK | High | Yes |
| Desktop window | DesktopWindow | window chrome | Some pages | Unusual metaphor | — | Weak | Low | Review |

## Component debt themes

1. Primitive vs raw HTML button/input sprawl  
2. Metric card triplication  
3. Charts + kokonutui parallel visual languages  
4. Web vs native component divergence  
5. Empty/error not standardized across domains  

**DS candidates (priority):** Button, Input, Modal/Confirm, Empty, Skeleton, Nav chrome, Command, Badge, Status/LiveRegion.
