import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Auth, public, & legal pages (Code-split for optimized initial bundle)
const Login = React.lazy(() => import('./pages/Login'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
import WaitlistLanding from './pages/WaitlistLanding';
import { WaitlistPendingScreen } from './components/waitlist/WaitlistQuickFeedback';
import WaitlistThemeSync from './components/waitlist/WaitlistThemeSync';
const Privacy = React.lazy(() => import('./pages/legal/Privacy'));
const Terms = React.lazy(() => import('./pages/legal/Terms'));
const DataDeletion = React.lazy(() => import('./pages/legal/DataDeletion'));
const Security = React.lazy(() => import('./pages/legal/Security'));
const About = React.lazy(() => import('./pages/legal/About'));
const Contact = React.lazy(() => import('./pages/legal/Contact'));
const Cookies = React.lazy(() => import('./pages/legal/Cookies'));
const AcceptableUse = React.lazy(() => import('./pages/legal/AcceptableUse'));
const Refunds = React.lazy(() => import('./pages/legal/Refunds'));
const AiDisclosure = React.lazy(() => import('./pages/legal/AiDisclosure'));
const Grievance = React.lazy(() => import('./pages/legal/Grievance'));
const Subprocessors = React.lazy(() => import('./pages/legal/Subprocessors'));
const LegalHub = React.lazy(() => import('./pages/legal/LegalHub'));
const Brand = React.lazy(() => import('./pages/Brand'));
const AndroidApp = React.lazy(() => import('./pages/AndroidApp'));
const EmptyStatePage = React.lazy(() => import('./pages/EmptyStatePage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Layout & lazy widgets
import DashboardLayout from './components/layout/DashboardLayout';
const FeedbackWidget = React.lazy(() => import('./components/FeedbackWidget'));
const ProductTour = React.lazy(() => import('./components/onboarding/ProductTour'));
const GuestTour = React.lazy(() => import('./components/onboarding/GuestTour'));

// Guest mode
// (Removed unused guest providers)

// Providers & utilities
import { useAuth } from './hooks/useAuth';
import { useAccessGate } from './hooks/useAccessGate';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppQueryProvider } from './context/QueryProvider';
import { AudioProvider } from './context/AudioContext';
import ErrorBoundary from './components/system/ErrorBoundary';
import ConsentBanner from './components/system/ConsentBanner';
import TierRouteGuard from './components/account/TierRouteGuard';
import EmailVerifiedGuard from './components/system/EmailVerifiedGuard';
import DeviceGate from './components/system/DeviceGate';
import { getPostAuthPath } from './utils/mobileEntry';
import './styles/deviceTiers.css';
import './styles/focusRoomTablet.css';

// Lazy-loaded Dashboard routes
const Overview = React.lazy(() => import('./pages/Overview'));
const MobileCaptureApp = React.lazy(() => import('./components/mobile/MobileCaptureApp'));
const MobileShell = React.lazy(() => import('./components/mobile/MobileShell'));
const MobileScorePage = React.lazy(() => import('./components/mobile/MobileScorePage'));
const MobileLiteAccount = React.lazy(() => import('./components/mobile/MobileLiteAccount'));
const Insights = React.lazy(() => import('./pages/Insights'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));

const Finance = React.lazy(() => import('./pages/Finance'));
const Settings = React.lazy(() => import('./pages/Settings'));
const LabFullPage = React.lazy(() => import('./pages/LabFullPage'));
const Placements = React.lazy(() => import('./pages/Placements'));
const SportsPage = React.lazy(() => import('./pages/Sports'));
const JournalPage = React.lazy(() => import('./pages/Journal'));
const HabitsPage    = React.lazy(() => import('./pages/Habits'));
const GoalsPage     = React.lazy(() => import('./pages/Goals'));
const IdentityPage  = React.lazy(() => import('./pages/Identity'));
const NotesPage     = React.lazy(() => import('./pages/Notes'));
const DisciplinePage= React.lazy(() => import('./pages/Discipline'));
const FocusRoom     = React.lazy(() => import('./pages/FocusRoom'));
const FamilyPage    = React.lazy(() => import('./pages/Family'));
const AccountPage   = React.lazy(() => import('./pages/account/AccountPage'));
const ReportsPage   = React.lazy(() => import('./pages/Reports'));
const SeedData      = React.lazy(() => import('./pages/SeedData'));
const DraftingTablePrototype = React.lazy(() => import('./prototypes/drafting-table'));
/* ── Suspense fallback ────────────────────────────────────────────────── */
const Fallback = () => (
  <div style={{ minHeight: '100vh', background: 'var(--color-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" />
  </div>
);
const Lazy = ({ children }) => <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;

/* Public surfaces that stay reachable while an account waits for waitlist approval. */
const PUBLIC_PATH_PREFIXES = [
  '/privacy',
  '/terms',
  '/contact',
  '/about',
  '/security',
  '/data-deletion',
  '/cookies',
  '/acceptable-use',
  '/refunds',
  '/ai-disclosure',
  '/grievance',
  '/subprocessors',
  '/legal',
  '/app',
  '/brand',
  '/proto',
  '/waitlist',
  '/empty',
];

/* ── Root App ─────────────────────────────────────────────────────── */
function App() {
  return (
    <ErrorBoundary label="Application">
      <ThemeProvider>
        <AppQueryProvider>
        <AuthProvider>
          <AudioProvider>
            <BrowserRouter>
              <AuthedApp />
            </BrowserRouter>
          </AudioProvider>
        </AuthProvider>
        </AppQueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AuthedApp() {
  const { user, session, loading } = useAuth();
  if (loading) return <Fallback />;
  return <AppContent user={user} session={session} />;
}

function AppContent({ user, session }) {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { canAccessApp, loading: accessLoading, isWaitlistMode } = useAccessGate();

  const showWaitlistAtRoot = !session || isWaitlistMode || (!canAccessApp && !accessLoading);
  const isProto = location.pathname.startsWith('/proto');

  const isPublicSurface =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    PUBLIC_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  const showPendingScreen = isWaitlistMode && isSignedIn && !canAccessApp && !accessLoading
    && !['/login', '/'].includes(location.pathname)
    && !isPublicSurface;

  if (accessLoading && isWaitlistMode) {
    return <Fallback />;
  }

  if (showPendingScreen) {
    return <WaitlistPendingScreen />;
  }

  return (
    <DeviceGate authed={!!session && canAccessApp}>
    <div style={{ minHeight: '100vh', background: 'var(--color-base)' }}>
      <WaitlistThemeSync />
      <Routes>

        {/* Waitlist landing at / for public visitors and always at /waitlist */}
        {showWaitlistAtRoot && (
          <Route path="/" element={<WaitlistLanding />} />
        )}
        <Route path="/waitlist" element={<WaitlistLanding />} />
        {/* Local visual QA only: seed-backed Reports modes never ship behind this route. */}
        <Route path="/reports-demo" element={
          process.env.NODE_ENV === 'development'
            ? <Lazy><ReportsPage /></Lazy>
            : <Navigate to="/reports" replace />
        } />

        {/* Auth */}
        <Route path="/login/*" element={
          isWaitlistMode && !canAccessApp
            ? <Lazy><Login /></Lazy>
            : (session ? <Navigate to={getPostAuthPath()} replace /> : <Lazy><Login /></Lazy>)
        } />
        <Route path="/auth/callback" element={<Lazy><AuthCallback /></Lazy>} />
        <Route path="/verify-email" element={session ? <Lazy><VerifyEmail /></Lazy> : <Navigate to="/login" replace />} />
        <Route path="/onboarding" element={
          isWaitlistMode && !canAccessApp && !accessLoading
            ? <Navigate to="/" replace />
            : (session ? <Lazy><Onboarding /></Lazy> : <Navigate to="/login" replace />)
        } />
        {!showWaitlistAtRoot && (
          <Route path="/" element={<Navigate to={canAccessApp && session ? getPostAuthPath() : '/login'} replace />} />
        )}

        {/* Phone web: capture-only shell (native app coming) */}
        <Route path="/m" element={
          session && canAccessApp
            ? <EmailVerifiedGuard><Lazy><MobileShell /></Lazy></EmailVerifiedGuard>
            : <Navigate to="/login" replace />
        }>
          <Route index element={<Lazy><MobileCaptureApp /></Lazy>} />
          <Route path="score" element={<Lazy><MobileScorePage /></Lazy>} />
          <Route path="account" element={<Lazy><MobileLiteAccount /></Lazy>} />
        </Route>

        {/* Authenticated shell — full Life OS (iPad + desktop) */}
        <Route element={
          isWaitlistMode && !canAccessApp && !accessLoading
            ? <Navigate to="/" replace />
            : (session
              ? <EmailVerifiedGuard><DashboardLayout user={user || { id: 'loading', full_name: 'Loading...', username: 'loading', isGuest: false }} /></EmailVerifiedGuard>
              : <Navigate to="/login" replace />)
        }>
          <Route path="/overview" element={<Lazy><Overview user={user || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }} /></Lazy>} />
          <Route path="/insights" element={<Lazy><Insights /></Lazy>} />
          <Route path="/calendar" element={<Lazy><CalendarPage /></Lazy>} />

          <Route path="/sports" element={<Lazy><TierRouteGuard label="Sports"><SportsPage /></TierRouteGuard></Lazy>} />
          <Route path="/journal" element={<Lazy><JournalPage /></Lazy>} />
          <Route path="/finance" element={<Lazy><TierRouteGuard label="Finance"><Finance /></TierRouteGuard></Lazy>} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
          <Route path="/lab" element={<Lazy><TierRouteGuard label="Lab"><LabFullPage /></TierRouteGuard></Lazy>} />
          <Route path="/forge" element={<Navigate to="/lab" replace />} />
          {/* Parked: Career/placements — deep-link only (web diet R4); not in nav */}
          <Route path="/placements" element={<Lazy><TierRouteGuard label="Placements"><Placements /></TierRouteGuard></Lazy>} />
          <Route path="/habits"     element={<Lazy><TierRouteGuard label="Habits"><HabitsPage /></TierRouteGuard></Lazy>} />
          <Route path="/goals"       element={<Lazy><TierRouteGuard label="Goals"><GoalsPage /></TierRouteGuard></Lazy>} />
          <Route path="/identity"    element={<Lazy><IdentityPage /></Lazy>} />
          <Route path="/notes"       element={<Lazy><NotesPage /></Lazy>} />
          <Route path="/discipline"  element={<Lazy><TierRouteGuard label="Discipline"><DisciplinePage /></TierRouteGuard></Lazy>} />
          <Route path="/focus"       element={<Lazy><TierRouteGuard label="Focus"><FocusRoom /></TierRouteGuard></Lazy>} />
          <Route path="/family"      element={<Lazy><TierRouteGuard label="Family"><FamilyPage /></TierRouteGuard></Lazy>} />
          <Route path="/account"     element={<Lazy><AccountPage /></Lazy>} />
          <Route path="/reports"     element={<Lazy><TierRouteGuard label="Reports"><ReportsPage /></TierRouteGuard></Lazy>} />
          {/* Parked: wipe/seed tool — localhost only */}
          <Route path="/seed-data" element={
            process.env.NODE_ENV === 'development'
              ? <Lazy><SeedData /></Lazy>
              : <Navigate to="/overview" replace />
          } />
        </Route>

        {/* ── Public legal & brand ── */}
        <Route path="/privacy" element={<Lazy><Privacy /></Lazy>} />
        <Route path="/terms" element={<Lazy><Terms /></Lazy>} />
        <Route path="/data-deletion" element={<Lazy><DataDeletion /></Lazy>} />
        <Route path="/security" element={<Lazy><Security /></Lazy>} />
        <Route path="/about" element={<Lazy><About /></Lazy>} />
        <Route path="/contact" element={<Lazy><Contact /></Lazy>} />
        <Route path="/cookies" element={<Lazy><Cookies /></Lazy>} />
        <Route path="/acceptable-use" element={<Lazy><AcceptableUse /></Lazy>} />
        <Route path="/refunds" element={<Lazy><Refunds /></Lazy>} />
        <Route path="/ai-disclosure" element={<Lazy><AiDisclosure /></Lazy>} />
        <Route path="/grievance" element={<Lazy><Grievance /></Lazy>} />
        <Route path="/subprocessors" element={<Lazy><Subprocessors /></Lazy>} />
        <Route path="/legal" element={<Lazy><LegalHub /></Lazy>} />
        <Route path="/brand" element={<Lazy><Brand /></Lazy>} />
        <Route path="/app" element={<Lazy><AndroidApp /></Lazy>} />
        <Route path="/empty" element={<Lazy><EmptyStatePage /></Lazy>} />
        {/* Parked: Drafting Table craft lock — not product */}
        <Route path="/proto/draft" element={<Lazy><DraftingTablePrototype /></Lazy>} />
        {/* Killed surface: old design-lab URL */}
        <Route path="/design-lab" element={<Navigate to="/account?section=design" replace />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Lazy><NotFound /></Lazy>} />

      </Routes>

      {!isProto && !location.pathname.startsWith('/reports-demo') && <ConsentBanner />}

      {/* Global Widgets — lazy wrapped, suppressed on public surfaces, prototypes, and phone capture surfaces */}
      <React.Suspense fallback={null}>
        {!isProto && !isPublicSurface && !location.pathname.startsWith('/m') && !location.pathname.startsWith('/reports-demo') && canAccessApp && location.pathname !== '/login' && user && !user.isGuest && <ProductTour />}
        {!isProto && !isPublicSurface && !location.pathname.startsWith('/m') && !location.pathname.startsWith('/reports-demo') && canAccessApp && location.pathname !== '/login' && user && !user.isGuest && <FeedbackWidget />}
        {!isProto && isWaitlistMode && location.pathname === '/' && <FeedbackWidget waitlistPublic />}
        {!isProto && !location.pathname.startsWith('/m') && !location.pathname.startsWith('/reports-demo') && !isWaitlistMode && !isPublicSurface && location.pathname !== '/login' && !session && (!user || user.isGuest) && <GuestTour />}
      </React.Suspense>
    </div>
    </DeviceGate>
  );
}

export default App;
