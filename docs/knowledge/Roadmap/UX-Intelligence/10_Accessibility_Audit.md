---
authority: operations
derived_from: Login a11y · mobileTouchTargets · LiveRegion · brand reduced-motion · FeatureTip · focus styles
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 10 — Accessibility Audit

**Scope:** Product UX readiness scan — not WCAG certification. Evidence from code patterns.

## Findings

| Area | Reality | Evidence | Severity |
|------|---------|----------|----------|
| Contrast | Dark palette generally OK; accent on dark watch | Palette locks · hardcoded mobile | Med |
| Touch targets | Mobile CSS enforces targets | `mobileTouchTargets.css` · focusRoomTablet | Good `/m`; desktop uneven |
| Keyboard | Login PIN · Onboarding · CommandPalette strong | Login.jsx aria · key handlers | Partial product-wide |
| Screen reader | Some aria-labels/roles | Waitlist · Login · FamilyCardMenu · LiveRegion | Incomplete elsewhere |
| Focus order | Modals/drawers variable | Modal/ConfirmDialog | Trap uneven |
| Dynamic text | AnimatedNumber · live regions | LiveRegion.jsx | Sparse use |
| Reduced motion | Brand page respects | `brandPage.css` prefers-reduced-motion | **Not global app default** |
| Semantic hierarchy | Mixed h1/h2 discipline | Pages vary | Med |
| Icon-only controls | Common in nav | Navbar · mobile bottom | Label gaps |
| Forms | Waitlist/Login better | aria-label on fields | Domain forms weaker |
| Charts | Visual-only risk | charts/* | High for SR |
| Native | Platform a11y | Compose | Separate track |

## Known issues (register seeds)

1. Reduced motion not app-wide  
2. Charts lack text alternatives  
3. Icon buttons missing names in places  
4. Focus trap inconsistent on overlays  
5. Overview density hard for cognitive load (related, not classic a11y)  
6. Guest/tier lock announcements unclear  

## Readiness

| Track | Status |
|-------|--------|
| Auth / waitlist | Relatively stronger |
| Core desktop domains | Partial |
| Charts / kokonutui | Weak |
| `/m` touch | Stronger targets |
| Native | Platform-dependent; not audited here in depth |

**Verdict for UX Architecture:** Accessibility is **partial**. Needs dedicated pass before GA; not blocking Intelligence package.
