# AIIMIN — Duplicate Interaction Patterns

## Section 4 — Repeated Patterns

| Pattern | Occurrences | Surfaces | User cost | Consolidation opportunity |
|---------|------------:|----------|-----------|---------------------------|
| Mood 1–10 picker | 5+ | JournalCapture, CommandPalette, DailyLogForm, MoodTracker, Discipline | Re-learn same scale | Single mood primitive + sync |
| PIN numpad entry | 3 | Login 4-digit, Onboarding 6-digit, Login verify | Different lengths confuse | Unified PIN/biometric |
| Theme swatch picker | 3 | Login, Settings, Account/Personalization | Repeat preference | Once at onboarding; OS sync |
| Destructive confirm dialog | 18 | Habits, Goals, Notes, Finance, Family, Settings, Focus, Placements, Admin | Same anxiety pattern | Branded ConfirmDialog migration (partial done) |
| `window.confirm` native | 14 | Finance, Family, Notes, Settings, Focus, Placements | Inconsistent UX | Migrate to ConfirmDialog |
| Date picker / calendar day | 12+ | Calendar, PersonalCalendar, Habits matrix, Journal heatmap, Finance date | Multiple calendar UIs | Shared date primitive |
| Free-text quick capture | 6 | Journal, CommandPalette win/note/AI, UniversalLogger, Notes, QuickCapture | Multiple entry points | Unified capture router |
| Voice input / mic | 4 | JournalCapture, CommandPalette voice, VocalMastery, AI log | Different STT behaviors | Shared voice pipeline |
| File upload | 6 | Family docs, Profile avatar, Placements resume, ATS, Resume archive, kokonutui demo | Repeated pick-file flow | Shared upload component |
| Tab bar section switch | 10+ | Finance, Family, Account, Calendar views, Lab modules | Navigation pattern OK | — |
| Inline Enter-to-save | 8 | CommandPalette, Notes, Calendar quick-add, Week tasks, UniversalLogger | Consistent — good | Document in onboarding |
| Goal/habit chip multi-select | 2 | Onboarding goals, Onboarding habits | Same interaction | Could merge step |
| Persona / layout preset | 2 | Onboarding implied, PersonalizationSection | Re-configure layout | Infer from behavior |
| Tier upgrade gate | 8 routes | TierRouteGuard on insights, finance, lab, habits, goals, etc. | Same blocked feeling | Single upgrade surface |
| Empty state CTA | 15+ | Most list pages | "Create first X" | Template empty states |
| Search/filter field | 6 | CommandPalette, Placements role filter, Insights domain, Reports period | Different filter UX | — |
| Post-save toast | 20+ | Most forms | Feedback OK | — |
| Streak / gamification pop | 3 | XP modal, habit streak, rank ladder | Reward overlap | Coordinate celebrations |
| Arc / life statement editor | 3 | Onboarding, Identity, Profile ArcBanner | Same content edited in 3 places | Single source of truth |
| Email verification wait | 2 | VerifyEmail page, EmailVerifiedGuard | Blocking | Magic link auto-verify |

---

## Pattern Frequency Chart

```
Mood picker          ████████ 5
Date/calendar        ████████████ 12
Destructive confirm  ██████████████████ 18
Theme picker         ███ 3
PIN entry            ███ 3
Voice/mic            ████ 4
File upload          ██████ 6
Quick capture text   ██████ 6
```
