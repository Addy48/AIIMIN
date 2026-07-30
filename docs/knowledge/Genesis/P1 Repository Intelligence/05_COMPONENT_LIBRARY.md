---
Purpose: Document reusable frontend components — folders, exports, variants/states where known, reuse notes, dependencies, screens.
Confidence: 0.85 (inventory complete; prop-level detail partial; reuse counts sampled)
Generated From: frontend/src/components/** glob; design agent inventory; Grep samples
Dependencies: [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md), [09_DESIGN_SYSTEM.md](09_DESIGN_SYSTEM.md)
Consumers: Design/system passes; Codex UI work
Last Updated: 2026-07-22
Pass: 1/6
---

# 05 — Component Library

**Scope:** `frontend/src/components/` — **342** `.jsx` files across **40** folders (+ root files).

Reuse counts: **sampled** via content search (not full import graph). Where unknown → `reuse: unknown`.

Native Compose components are **out of scope** for prop tables this pass; see `native-android/.../ui/components/` and [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md).

---

## Folder sizes (jsx count)

| Count | Folder |
|------:|--------|
| 45 | `kokonutui/` (vendor effects) |
| 33 | `charts/` (+ heatmap/tooltip sub) |
| 27 | `ui/` |
| 21 | root components |
| 20 | `lab/` |
| 15 | `waitlist/landing/` |
| 13 | `dashboard/` |
| 12 | `journal/`, `calendar/` |
| 11 | `finance/` |
| 9 | `growth/` |
| 8 | `system/`, `overview/` |
| 7 | `layout/`, `mobile/`, `account/` |
| ≤6 | remaining feature folders |
| 0 | `career/`, `notes/` (**empty directories**) |

---

## Primitives — `ui/`

| Component | Variants / notes | States | Key props (factual from exports) | Reuse | Used on |
|-----------|------------------|--------|----------------------------------|-------|---------|
| `Button` (`button.jsx`) | `buttonVariants` (CVA/shadcn-style) | default/disabled | standard button props | unknown | scattered |
| `Input`, `Textarea` | — | — | — | unknown | forms |
| `Card*` | Header/Footer/Title/Description/Content | — | — | unknown | many |
| `Badge` | `badgeVariants` | — | — | unknown | chips |
| `Modal` | — | open/close | — | unknown | pages |
| `ConfirmDialog` | — | confirm/cancel | via `utils/confirm.jsx` | Lab flashcards + confirm util | Lab |
| `drawer` | Radix/vaul-style | — | — | unknown | sheets |
| `dropdown-menu`, `tooltip` | Radix | — | — | unknown | nav/UI |
| `EmptyState` | + `EmptyIllustrations` | empty | title/body/illustration | Habits/Goals/Finance/Sports patterns | feature pages |
| `Skeleton*` | Card/Row/Chart | loading | — | unknown | loading UIs |
| `Metric`, `MetricTile`, `HeroMetricCard` | — | — | — | MetricTile hits in Family/Sports | dashboards |
| `HabitCircle` | — | complete/incomplete | — | Habits + overview | habits |
| `TaskRow` | — | done | — | tasks | overview/tasks |
| `MoodSelector` | moods | — | — | journal/daily | |
| `AnimatedNumber` | — | — | — | metrics | |
| `LiveRegion` | a11y | — | — | system | |
| `FeatureTip`, `StatusAlert` | — | — | — | onboarding/errors | |
| `DeadlinePicker`, `TimePicker` (root) | — | — | — | forms | |
| `DesktopWindow`, `PlacementStrip`, `GoalsVisionTitle`, `Numpad` (`common/`) | — | — | — | specialized | |

---

## Layout & chrome

| Component | Purpose | Screens |
|-----------|---------|---------|
| `DashboardLayout` | App shell | All dashboard routes |
| `Navbar` | Masthead | Desktop/tablet |
| `TabRail` | Tablet rail | Tablet |
| `BottomNav` | Narrow non-phone | Tablet narrow |
| `PageHeader`, `PageWrapper` | Page chrome | Many pages |
| `Sidebar` | **Unused orphan** | none |
| `InstallPrompt` | PWA | shell |
| `BrandLockup`, `ThemedMark`, `Wordmark`, `ArcMark`, `ArcLockup` | Brand | Navbar, waitlist, brand |
| `archBracketMark.js` | SVG mark system | brand assets |

---

## Design shipped wrappers — `design/`

| Export group | Role |
|--------------|------|
| `ShippedUI` | Loaders, primary button, beams background |
| `ShippedMotion` | Stagger, hover lift, spring amount, page variants |
| `ShippedCharts` | Chart loading + sleep/finance chart wrappers |
| `ShippedSubNav` | Sub-nav strip |
| `SafeRender` | Safe boundary |

---

## System

DeviceGate · CommandPalette · ErrorBoundary · EmailVerifiedGuard · ArcGuard · GlobalMusicPlayer · SystemOverviewStrip · DashboardSections (Overview/Physical/Cognitive/Behavior/Financial/Reflection/Insights/Reports/Settings panels)

---

## Feature component map (by domain)

Cross-link features → [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md).

| Domain | Key components |
|--------|----------------|
| Overview | CommandCenter, OverviewWidgetGrid, WeekInNumbers, MondayInsight, YourReportCard, YearlyHabitMatrix, PulseCheckModal, DayOneCard |
| Dashboard | UniversalLogger (=QuickCapture), SystemHealth(+Rings), StatCard, WeekRows, DesktopXPBar, DailyQuote, DayArchetypes, ExpandedStatPanel, ToggleSwitch, SystemBottleneckCard |
| Habits | HabitsWidget, HabitManager, HabitsPage, StreakAnalytics, ChainWall, HabitStackPanel |
| Journal | JournalEditor, Capture, WriteCanvas, ReadView, Sidebar, MoodStrip, MoodHeatmap, CBT/FreeWrite/MorningPages/WeeklyReview/WWW modes |
| Calendar | Week/Month/Day/Agenda views, Toolbar, Sidebar, Heatmap, EventCard, EventModal, MetricMonthGrid, CalendarShared |
| Finance | FinanceOverview/Analytics/Budgets/Transactions/Accounts/Wealth, EntryForm, FinancialHealthScore, SIPPlanner, SubscriptionAudit, WhatIfSimulator |
| Money | MoneyOverview/Accounts/Add/Lending tabs + MoneyShared; root `MoneyManager.jsx` |
| Discipline | TriggerModal (**unmounted**), UrgeSurfOverlay, UrgeOutcomeSheet (**unmounted**), ReplacementHabitLinker |
| Growth | GrowthNodes, CausalNodeAnalysis, LifeScorePanel/Radar, DailyIntention, OneBetterNudge, PerformanceDeltaHub, SideQuests, WeeklyLifeReview |
| Reports | IvorySnapshot, PatternsPanel, SkillTreePanel, ReportPreviewModal (**unmounted**), PDFReportGenerator (root) |
| Waitlist | Form, ThemeSync, FoundingPerks, HeroAside, SocialProof, QuickFeedback+Pending, landing sections |
| Mobile | MobileCaptureApp, Shell, BottomNav, LiteAccount, ScorePage, OfflineBanner, DesktopNudge |
| Onboarding | ProductTour, GuestTour, PostPurchaseModal (**unmounted**) |
| Account | AccountModal (**unmounted**), PlanStatusChip, FeatureGate, TierRouteGuard, TierUpgradeCelebration, AdminPanel/Console |
| Notifications | NotificationBell, NotificationPanel |
| Settings | NavPinEditor |
| Profile | ArcBanner, ArcEditor |
| Gamification | RankLadder, LevelUpModal (**unmounted**), XPGainToast |
| Focus/Pomodoro | DeepWorkChart, PostSessionReflection (**unmounted**), PomodoroTimer, Presets, Reflection |
| Family | FamilyRecordDetails, FamilyCardMenu, EmergencyCard |
| Placements | ApplicationIntakeModal, ResumeArchiveModal |
| Sports | MatchPreview, SportsNewsStrip |
| Sleep | SleepCharts, SleepHelpers; root SleepAnalytics |
| Daily log | FloatingSaveButton, ToggleCard; root DailyLogForm |
| Identity | IdentityStack, IdentityTrajectory, AspirationMeters, PhaseTagger |
| Lab | 19 modules (DecisionMatrix, TypingTest, ThePit, …) |
| Charts | Line/Area + loading, Heatmap system, Grid, ChartLoadingLabel |
| Icons | DumbbellIcon, gemini |
| Root analytics widgets | MomentumBar, Streaks, WinsEngine, InsightEngine, WeeklyReport, YearlyHeatmap, ResetsTracker, MoodTracker, DSACounter, SessionStats, PersonalCalendar, FeedbackWidget, Logo* |

---

## Vendor — `kokonutui/` (45)

Decorative loaders, beams, glitch text, bento, morphic nav, AI brand icons, smooth drawer/tab, mouse-effect cards, assorted buttons. **Not** the canonical product design system; used selectively (e.g. waitlist/marketing effects).

---

## Props documentation gap

This pass does **not** exhaustively list PropTypes/TypeScript props (most files are JS without TS interfaces). For implementation, open the component file. Passes 2–6 may deepen prop contracts.

## Cross-references

- Tokens → [09_DESIGN_SYSTEM.md](09_DESIGN_SYSTEM.md)
- Dead components → [11_TECHNICAL_DEBT.md](11_TECHNICAL_DEBT.md)
