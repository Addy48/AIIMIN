# Typography

## Current state

- Tokenized typography exists (`text-h*`, `text-body`, `text-label`)
- High-traffic sections now include Metric component usage in Overview and Finance
- Legacy `.text-caption` and `.text-data` classes now use font-scale-aware values
- Overview trajectory execution now uses a compact state-driven sidebar card with arc, ratio, rhythm dots, and progress rows
- Broader inline-size cleanup still remains for long-tail pages

## Key files

- `frontend/src/index.css`
- `frontend/src/styles/globals.css`
- `frontend/src/components/ui/Metric.jsx`
- `frontend/src/pages/Overview.jsx`
- `frontend/src/components/finance/FinanceOverview.jsx`

## Changelog

### 2026-07-04
- Moved: first-phase migration from fixed inline type to tokenized metric surfaces
- Why: ensure account text-scale control has visible impact on core dashboard pages
- Files: `frontend/src/components/ui/Metric.jsx`, `frontend/src/pages/Overview.jsx`, `frontend/src/components/finance/FinanceOverview.jsx`, `frontend/src/index.css`, `frontend/src/styles/globals.css`
- Status: phase 1 shipped

### 2026-07-04
- Changed: polished Overview trajectory execution widget with a live sun arc, execution ratio, week rhythm dots, and tighter progress rows
- Why: replace empty vertical space and direct DOM mutation with a clearer React-driven execution snapshot
- Files: `frontend/src/pages/Overview.jsx`, `frontend/src/components/ui/AnimatedNumber.jsx`
- Status: sidebar polish shipped

### 2026-07-04
- Changed: refined Overview first-page grid with an adaptive main column, sticky rail, responsive metric strip, and tighter weekly timeline spacing
- Why: keep the dashboard composition balanced when widgets are hidden or the trajectory execution card grows taller
- Files: `frontend/src/pages/Overview.jsx`
- Status: layout polish shipped

### 2026-07-04
- Changed: redesigned weekly insight card into a structured review with real weekly signals, shorter AI summary, next move, and explicit dismissal copy
- Why: avoid generic AI memo output and clarify that dismissing hides the card until the next Monday cycle
- Files: `frontend/src/components/overview/MondayInsight.jsx`, `frontend/src/services/aiService.js`
- Status: weekly review polish shipped

### 2026-07-04
- Changed: simplified Overview defaults by hiding redundant widgets (`Week in Numbers`, `Execution Window`, `Recent Wins`) and removed the Focus/Full density switch
- Why: reduce repeated data on the main page without asking users to manage another view mode
- Files: `frontend/src/components/overview/OverviewWidgetGrid.jsx`, `frontend/src/components/overview/MondayInsight.jsx`
- Status: simplified overview defaults shipped

### 2026-07-04
- Changed: added six full-page Today redesign prototypes to Account -> Design Lab
- Why: compare SaaS-ready first-page directions before changing the production Today dashboard
- Files: `frontend/src/pages/account/sections/design/TodayPagePrototypesPanel.jsx`, `frontend/src/pages/account/sections/DesignSection.jsx`, `frontend/src/pages/account/sections/design/designPrototypes.css`
- Status: prototype decision page shipped

### 2026-07-08
- Changed: recovered Jul 4 masthead navbar (BrandLockup, Sun/Moon icons, More overflow, nav pins via `useNavPreferences`), trajectory sun-arc with sunrise/sunset labels, overview sticky rail grid, mobile BottomNav wiring, and Lab reading module in sidebar
- Why: restore pre-waitlist localhost build state from chat transcripts after waitlist pivot reverted live surfaces
- Files: `frontend/src/components/Navbar.jsx`, `frontend/src/index.css`, `frontend/src/styles/tokens.css`, `frontend/src/pages/Overview.jsx`, `frontend/src/components/layout/DashboardLayout.jsx`, `frontend/src/pages/LabFullPage.jsx`
- Status: partial recovery shipped — masthead + trajectory + decentralization wiring live again
