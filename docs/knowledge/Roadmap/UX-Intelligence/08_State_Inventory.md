---
authority: operations
derived_from: EmptyState · Skeleton · ErrorBoundary · MobileOfflineBanner · TierRouteGuard · sync banners · Features
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
program: UX-Intelligence-v1
---

# 08 — State Inventory

Per major feature: L=Loading E=Empty Err=Error Off=Offline P=Permission N=No data S=Syncing C=Conflict AI=AI processing Ok=Success F=Fail D=Draft A=Archived Del=Deleted R=Recoverable U=Unsupported

Legend: ● present · ○ partial/weak · — missing · ? unknown

| Feature | L | E | Err | Off | P | N | S | C | AI | Ok | F | D | A | Del | R | U | Gaps |
|---------|---|---|-----|-----|---|---|---|---|----|----|---|---|---|-----|---|---|------|
| Waitlist | ● | — | ● | ○ | — | — | — | — | — | ● | ● | — | — | — | — | — | Offline weak |
| Auth/Login | ● | — | ● | ○ | ● | — | — | — | — | ● | ● | — | — | — | ○ | — | Recovery |
| Onboarding | ● | — | ● | — | — | — | — | — | — | ● | ● | ○ | — | — | — | — | Draft resume |
| Overview | ● | ○ | ○ | ○ | — | ○ | ○ | — | ○ | ● | ○ | — | — | — | — | — | Empty teach; conflict |
| Habits | ● | ● | ○ | — | — | ● | ○ | — | — | ● | ○ | — | — | ○ | — | — | Offline |
| Goals | ● | ● | ○ | — | — | ● | ○ | — | — | ● | ○ | ○ | ○ | ○ | — | — | Archive UX |
| Journal | ● | ● | ○ | ○ | — | ● | ○ | — | ○ | ● | ○ | ○ | — | ○ | ○ | — | Conflict/AI |
| Notes | ● | ● | ○ | ○ | — | ● | ○ | — | — | ● | ○ | ○ | — | ○ | ○ | — | Recover |
| Finance | ● | ● | ○ | — | tier | ● | ○ | — | — | ● | ○ | — | — | ○ | — | — | Offline |
| Family | ● | ● | ○ | — | tier | ● | ○ | — | — | ● | ○ | — | — | ○ | — | — | Perm denied copy |
| Calendar | ● | ● | ● | ○ | OAuth | ● | ● | ○ | — | ● | ● | — | — | — | — | — | Conflict |
| Placements | ● | ● | ○ | — | tier | ● | — | — | — | ● | ○ | — | ○ | ○ | — | — | — |
| Sports | ● | ● | ○ | ○ | tier | ● | ● | — | — | ● | ○ | — | — | — | — | U? | Cache fail |
| Discipline | ● | ○ | ○ | — | — | ○ | ○ | — | — | ● | ○ | — | — | — | — | — | Empty teach |
| Focus | ● | ○ | ○ | — | — | — | — | — | — | ● | ○ | — | — | — | — | — | Interrupt |
| Lab | ● | ○ | ○ | — | tier | ○ | — | — | — | ● | ○ | — | — | — | — | — | Experimental |
| Reports | ● | ○ | ○ | — | tier | ○ | — | — | — | ● | ○ | — | — | — | — | — | Empty |
| Insights | ● | ○ | ○ | — | — | ○ | — | — | ○ | ○ | ○ | — | — | — | — | — | Many gaps |
| Account | ● | — | ● | — | — | — | ○ | — | — | ● | ● | — | — | Del? | — | — | Billing |
| `/m` capture | ● | ○ | ● | ● | — | ○ | ● | — | — | ● | ● | — | — | — | ○ | — | Conflict |
| Native sync | ● | ○ | ● | ● | bio | ○ | ● | ○ | — | ● | ● | — | — | — | ○ | — | Conflict UI |
| Notifications | ○ | ○ | ○ | — | push? | ○ | — | — | — | ○ | ○ | — | — | — | — | — | Immature |
| Tier lock | — | — | — | — | ● | — | — | — | — | — | — | — | — | — | — | ● | Upgrade CTA |

## Cross-cutting primitives

| State | Primitive | Coverage |
|-------|-----------|----------|
| Loading | Skeleton | Many pages |
| Empty | EmptyState | Partial domains |
| Fatal error | ErrorBoundary | App shell |
| Offline | MobileOfflineBanner · SyncBanner | `/m`/native stronger than desktop |
| Success/Fail | StatusAlert · toasts | Uneven |

**Largest missing states:** Conflict, Recoverable delete, universal Offline desktop, AI processing clarity, Draft resume onboarding.
