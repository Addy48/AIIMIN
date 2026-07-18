# Plan: Mobile / iPad / Waitlist OS Surfaces

**Branch**: feat/mobile-ipad-os
**Status**: Complete (local — device smoke + Play upload pending)

## P3+ polish (2026-07-19)

- [x] Post-auth redirect → `/m` on phone + Capacitor native
- [x] Android hardware back button (exit on Today, back to `/m` on sub-routes)
- [x] Offline banner in mobile shell + pending sync count
- [x] HTTPS-only network security config (no cleartext)

## Goal

Ship phone capture shell (Today / Score / Account / Get App), fix trust-breaking P0 UI bugs, and patch iPad nav overflow — without auth/schema changes.

## Acceptance Criteria

- [x] Waitlist primary CTAs use accent `#FF6B35`, not green
- [x] Phone `/m` uses 4-tab bottom nav (Today, Score, Account, Get App) — not Habits/Goals/Journal/Notes
- [x] `/m/score` shows Life Score + glance cards (read-only)
- [x] Phone account is lite stacked layout (no Design Lab / Personalization / Wipe)
- [x] Save Session CTA on `/m` uses `var(--color-accent)`
- [x] iPad masthead shows max 8 primary links + More below 1100px
- [x] Life Arc text ellipsizes; account tab strip has right fade on phone (if still used)
- [x] Finance/Career duplicates: already fixed — out of scope
- [x] Design Lab account tab: eliminated on phone lite account

## Slices

### Slice 1: Waitlist CTA accent fix (P0-1)

**Class**: Behavior change  
**Value**: User sees brand orange on conversion CTAs  
**Path**: waitlist CSS tokens → all `.waitlist-*-cta` buttons  
**Acceptance**: `--waitlist-cta` resolves to `#FF6B35`

### Slice 2: Phone capture shell + bottom nav (P0-2, P0-3, P1-2 partial)

**Class**: Behavior change  
**Value**: Phone user navigates capture-only OS via fixed bottom tabs  
**Path**: `MobileShell` → routes `/m`, `/m/score`, `/m/account` → `MobileBottomNav`  
**Acceptance**: No OS bottom nav on phone; Save button orange; DeviceGate redirects `/account` → `/m/account`

### Slice 3: iPad nav overflow patch (P0-4)

**Class**: Behavior change  
**Value**: iPad Safari at 820–1024px shows 8 nav items + More, not broken overflow  
**Path**: `Navbar.jsx` tablet cap at 8 primary items  
**Acceptance**: `data-device-tier=tablet` + width < 1100 → max 8 links in strip

### Slice 4: Account micro-fixes (P0-5/6/7)

**Class**: Behavior change  
**Value**: Location label readable; Life Arc truncates with ellipsis  
**Path**: `ProfileSection` + `subscriptionSection.css` + lite account  
**Acceptance**: No "LOCAT" clip; arc text uses line-clamp

## P2 shipped (2026-07-19)

- [x] Career kanban scroll-snap + indicator dots (arrows removed)
- [x] Overview two-panel layout @900px+ (stack below 900)
- [x] Mobile score delta copy + log streak badge
- [x] Waitlist urgency chip above CTA + honest testimonials disclaimer
- [x] Lab typing "Best with keyboard" chip on iPad
- [x] Focus Room 48px touch targets on tablet
- [x] Phone `/m` offline log queue (IndexedDB) + sync on reconnect
- [x] Phone water +/- 44px touch floor

## Deferred (P3+)

- Supabase Realtime Life Score (optional)

## P3 shipped (2026-07-19)

- [x] Capacitor 7 Android scaffold (`in.aiimin.app`)
- [x] Remote WebView `server.url` → `https://aiimin.in/m` (Option A)
- [x] Native phone tier + hide Get App tab + safe-area + no Firebase

## P1 shipped (2026-07-18)

- [x] Post-log desktop nudge on `/m`
- [x] PWA manifest + service worker (`manifest.json`, `sw.js`)
- [x] iPad `TabRail` left sidebar (768–1099px)
- [x] Waitlist form input brand styling + mobile body 15px
- [x] iPad pricing 2x2 grid (768–1099)
- [x] Launch phases horizontal stepper on desktop (901px+)

---
*Delete when complete.*
