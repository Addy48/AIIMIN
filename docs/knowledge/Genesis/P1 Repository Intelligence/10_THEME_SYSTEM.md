---
Purpose: Explain theme switching, variables, dark/light modes, tokens, consistency facts.
Confidence: 0.94
Generated From: ThemeContext.jsx; constants/themes.js; tokens.css; WaitlistThemeSync; useWaitlistSurfaceTheme; capacitorEnv.js
Dependencies: [09_DESIGN_SYSTEM.md](09_DESIGN_SYSTEM.md)
Consumers: Any theme/UI work
Last Updated: 2026-07-22
Pass: 1/6
---

# 10 — Theme System

## Canonical theme IDs

| ID | Constant | Role |
|----|----------|------|
| `aiimin-dark` | `THEME_DARK` | Canonical dark |
| `aiimin-light` | `THEME_LIGHT` | Canonical light |

Defined in `frontend/src/constants/themes.js`.

## Legacy alias map (`normalizeThemeId`)

| Input | Maps to |
|-------|---------|
| `dark`, `vercel`, `midnight`, `internet` | `aiimin-dark` |
| `light`, `normal`, `nordic`, `studio`, `notion` | `aiimin-light` |

## Persistence

| Key | Shape | Role |
|-----|-------|------|
| `aiimin-theme-prefs` | JSON `{ currentTheme, defaultLightTheme, defaultDarkTheme }` | Primary |
| `aiimin-theme` | string | Legacy; migrated on read |
| `aiimin-waitlist-theme` | `nordic` \| `vercel` | Waitlist `/` and `/brand` only |

## DOM application (`ThemeContext` effect)

1. `document.documentElement.setAttribute('data-theme', activeTheme)`
2. Remove legacy classes: `dark`, `normal`, `notion`, `internet`, `nordic`, `studio`, `vercel`, `midnight`, `aiimin-dark`, `aiimin-light`
3. Add class = active theme ID
4. Clear inline `background-color` on `html`/`body`
5. `syncCapacitorChrome(activeTheme)` when native WebView

CSS variables resolve from `tokens.css` blocks matching `data-theme`.

## API (`useThemeContext` / `useTheme` shim)

| Method | Behavior |
|--------|----------|
| `setTheme(id)` | Set current; update default for that side |
| `toggleTheme()` | Swap between defaultLight and defaultDark |
| `setForcedTheme(id\|null)` | Override (Login forces light/`normal`; waitlist forces nordic/vercel) |
| `setDefaultLightTheme` / `setDefaultDarkTheme` | Pref defaults |

## Waitlist exception

On `/` and `/brand` in waitlist mode: `WaitlistThemeSync` + `useWaitlistSurfaceTheme` force stored waitlist theme (`nordic` or `vercel`), **not** canonical `aiimin-*`.

## Toggle UI locations

- `Navbar.jsx`
- `MobileLiteAccount.jsx`
- `WaitlistThemeToggle` (waitlist-specific)

## Color usage consistency (factual)

- Product locks and always-on rules cite dark `#1a1a1a` / cards `#2d2d2d` / accent `#ff6b35`.
- `aiimin-dark` token block uses base `#14171A` and accent `#FF6B35`.
- Light accent may be `#E85A24` in CSS while lock cites `#ff6b35`.
- Success/muted shared: `#10b981` / `#6b7280`.

These are **coexisting facts**, not resolved here.

## Native Android theme

Separate Compose/DataStore theme under `native-android/.../ui/theme` — not the web `ThemeContext`. Aligns to same brand colors per native design docs; implementation details in `17_NATIVE_APP_V2`.

## Cross-references

- Token values → [09_DESIGN_SYSTEM.md](09_DESIGN_SYSTEM.md)
- Conflicts → [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md)
