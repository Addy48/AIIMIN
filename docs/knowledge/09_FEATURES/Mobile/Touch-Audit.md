# Mobile touch audit (capture shell)

**Standard:** 44px minimum tap targets (WCAG 2.5.5). Capacitor native: 48px for primary nav + actions.

## Pass matrix

| Surface | Control | Before | After | Status |
|---------|---------|--------|-------|--------|
| Bottom nav tabs | `MobileBottomNav` | 44px min, 56px bar | 48px min, 60px bar | pass |
| Daily log inputs/buttons | `DailyLogForm` in `.mobile-capture` | generic 44px rule | enforced | pass |
| Water +/- buttons | `.daily-log-water-btn` | 34px inline | 44px `!important` in shell | pass |
| Save session | submit / floating save | 46px | 48px on shell | pass |
| Lite account actions | `.mobile-lite-account__action` | 48px | 52px on Capacitor | pass |
| Legal links | footer Privacy/Terms | 12px text only | 44px tap box | pass |
| Desktop nudge | link + dismiss | dismiss 44px, link thin | both 44px+ | pass |
| Score nudge link | external desktop link | thin | 44px inline-flex | pass |
| Offline banner | read-only | N/A | N/A | pass |
| Mood/toggle chips | capture form | variable | `[role=button]` 44px | pass |

## CSS source

`frontend/src/styles/mobileTouchTargets.css` — imported in `MobileShell.jsx`.

## Not in scope (full OS / website)

iPad TabRail, Focus Room tablet rules, waitlist landing, account page mobile tabs — separate website/iPad passes.

## Device verify checklist

1. Bottom nav — all tabs easy thumb tap
2. Water +/- — no mis-taps
3. Save session — full width button comfortable
4. Account actions — theme / sign out / manage plan
5. Hardware back — Today exits, sub-routes return to Today
