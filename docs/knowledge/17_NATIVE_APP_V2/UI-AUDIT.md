# Native Android — UI Audit (2026-07-19)

Full pass on `native-android/` screens. Fixes shipped in **v2.2.0-native**.

## Critical (fixed)

| Issue | Where | Fix |
|-------|-------|-----|
| PIN numpad hardcoded white — broken in dark mode | `PinComponents.kt` | Theme-aware surfaces + text |
| Auth headings hardcoded `Charcoal` — invisible/wrong in dark | `AuthScreen.kt` | `MaterialTheme.colorScheme` |
| Light `primary` was `AccentCalm` — FAB/button color drift | `Theme.kt` | `primary = Accent` (#ff6b35) |
| Journal `LazyColumn` brace bug — past entries nested wrong | `JournalScreen.kt` | Restructured items |
| Notes `SyncBanner` / grid indentation broken | `NotesScreen.kt` | Rewrite layout |
| Status bar / nav bar cutouts on sub-screens | Focus, Settings, Goals, Discipline | `ScreenChrome` insets |

## High (fixed)

| Issue | Where | Fix |
|-------|-------|-----|
| Bottom nav hardcoded `#F7F1E6` / `#1E1E1E` | `AiiminRoot.kt` | `surfaceVariant` |
| Habit chips 36dp + hardcoded border | `HomeScreen.kt` | 40dp + `outline` token |
| Life score arc hardcoded gray | `HomeScreen.kt` | Theme `outline` |
| Mixed `Button` vs `AiiminPrimaryButton` | Journal, Notes | Unified primary CTA |
| Note cards dark text on dark swatches | `NotesScreen.kt` | White text on colored cards |
| More grid tiles short touch targets | `MoreScreen.kt` | `height(108.dp)` |
| More title below profile — IA odd | `MoreScreen.kt` | Title first |

## Medium (fixed)

| Issue | Where | Fix |
|-------|-------|-----|
| Corporate auth copy | `AuthScreen.kt` | "Life OS" language |
| ALL CAPS "PAST ENTRIES" shouty | `JournalScreen.kt` | Sentence case |
| Discipline button awkward copy | `DisciplineUrgeScreen.kt` | "Logged — open toolkit" |
| Missing typography tokens | `Type.kt` | `labelSmall`, `bodySmall`, `titleSmall` |
| Vault unused animation imports | `VaultScreen.kt` | Removed |

## Open / needs founder

| Issue | Notes |
|-------|-------|
| EC2 `sync/batch` 404 | Push `mobile.js` + deploy |
| Play signed release | GitHub keystore secrets |
| Auth form still light-surface card on ivory — intentional brand | OK for welcome; form uses surface |
| Hilt / `presentation/` refactor | P3 deferred |
| Tablet / fold layouts | Not in V2 scope |

## Shared components added

- `ScreenChrome.kt` — `statusBarsPadding` + `navigationBarsPadding`
- `ScreenHeader.kt` — consistent title + subtitle

## Verify on device

1. Dark mode → Settings → System dark → PIN screen readable
2. Journal → save → past entries list below composer
3. More → Focus / Settings → no overlap with status bar
4. Notes → FAB orange matches brand
