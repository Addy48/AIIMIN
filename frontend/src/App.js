import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Eagerly loaded Auth & public pages
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';
import VerifyEmail from './pages/VerifyEmail';
import WaitlistLanding from './pages/WaitlistLanding';
import { WaitlistPendingScreen } from './components/waitlist/WaitlistQuickFeedback';
import WaitlistThemeSync from './components/waitlist/WaitlistThemeSync';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import DataDeletion from './pages/legal/DataDeletion';
import Security from './pages/legal/Security';
import About from './pages/legal/About';
import Contact from './pages/legal/Contact';
import Brand from './pages/Brand';
import SystemBrand from './pages/legal/Brand';

// Layout & eager components
import DashboardLayout from './components/layout/DashboardLayout';
import FeedbackWidget from './components/FeedbackWidget';
import ProductTour from './components/onboarding/ProductTour';
import GuestTour from './components/onboarding/GuestTour';

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
import TierRouteGuard from './components/account/TierRouteGuard';
import EmailVerifiedGuard from './components/system/EmailVerifiedGuard';
import DeviceGate from './components/system/DeviceGate';
import './styles/deviceTiers.css';

// Lazy-loaded Dashboard routes
const Overview = React.lazy(() => import('./pages/Overview'));
const MobileCaptureApp = React.lazy(() => import('./components/mobile/MobileCaptureApp'));
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
const AccountPage   = React.lazy(() => import('./pages/AccountPage'));
const ReportsPage   = React.lazy(() => import('./pages/Reports'));
const SeedData      = React.lazy(() => import('./pages/SeedData'));
/* ── Suspense fallback ────────────────────────────────────────────────── */
const Fallback = () => (
  <div style={{ minHeight: '100vh', background: 'var(--color-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" />
  </div>
);
const Lazy = ({ children }) => <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>;

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

  const showWaitlistAtRoot = isWaitlistMode && !canAccessApp && !accessLoading;

  const showPendingScreen = isWaitlistMode && isSignedIn && !canAccessApp && !accessLoading
    && !['/login', '/'].includes(location.pathname)
    && !location.pathname.startsWith('/privacy')
    && !location.pathname.startsWith('/terms')
    && !location.pathname.startsWith('/contact')
    && !location.pathname.startsWith('/about')
    && !location.pathname.startsWith('/security')
    && !location.pathname.startsWith('/data-deletion')
    && !location.pathname.startsWith('/brand');

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

        {/* Waitlist landing at / for public visitors */}
        {showWaitlistAtRoot && (
          <Route path="/" element={<WaitlistLanding />} />
        )}

        {/* Auth */}
        <Route path="/login/*" element={
          isWaitlistMode && !canAccessApp
            ? <Login />
            : (session ? <Navigate to="/overview" replace /> : <Login />)
        } />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/verify-email" element={session ? <VerifyEmail /> : <Navigate to="/login" replace />} />
        <Route path="/onboarding" element={
          isWaitlistMode && !canAccessApp && !accessLoading
            ? <Navigate to="/" replace />
            : (session ? <Onboarding /> : <Navigate to="/login" replace />)
        } />
        {!showWaitlistAtRoot && (
          <Route path="/" element={<Navigate to={canAccessApp && session ? '/overview' : '/login'} replace />} />
        )}

        {/* Phone web: capture-only shell (native app coming) */}
        <Route path="/m" element={
          session && canAccessApp
            ? <EmailVerifiedGuard><Lazy><MobileCaptureApp /></Lazy></EmailVerifiedGuard>
            : <Navigate to="/login" replace />
        } />

        {/* Authenticated shell — full Life OS (iPad + desktop) */}
        <Route element={
          isWaitlistMode && !canAccessApp && !accessLoading
            ? <Navigate to="/" replace />
            : (session
              ? <EmailVerifiedGuard><DashboardLayout user={user || { id: 'loading', full_name: 'Loading...', username: 'loading', isGuest: false }} /></EmailVerifiedGuard>
              : <Navigate to="/login" replace />)
        }>
          <Route path="/overview" element={<Lazy><Overview user={user || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }} /></Lazy>} />
          <Route path="/insights" element={<Lazy><TierRouteGuard label="Insights"><Insights /></TierRouteGuard></Lazy>} />
          <Route path="/calendar" element={<Lazy><CalendarPage /></Lazy>} />

          <Route path="/sports" element={<Lazy><TierRouteGuard label="Sports"><SportsPage /></TierRouteGuard></Lazy>} />
          <Route path="/journal" element={<Lazy><JournalPage /></Lazy>} />
          <Route path="/finance" element={<Lazy><TierRouteGuard label="Finance"><Finance /></TierRouteGuard></Lazy>} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
          <Route path="/lab" element={<Lazy><TierRouteGuard label="Lab"><LabFullPage /></TierRouteGuard></Lazy>} />
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
          <Route path="/seed-data"   element={<Lazy><SeedData /></Lazy>} />
        </Route>

        {/* ── Public legal & brand ── */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/brand/system" element={<SystemBrand />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/design-lab" element={<Navigate to="/account?section=design" replace />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to={showWaitlistAtRoot && !session ? '/' : (user ? '/overview' : '/login')} replace />} />

      </Routes>

      {/* Global Widgets */}
      {canAccessApp && location.pathname !== '/login' && user && !user.isGuest && <ProductTour />}
      {canAccessApp && location.pathname !== '/login' && user && !user.isGuest && <FeedbackWidget />}
      {isWaitlistMode && location.pathname === '/' && <FeedbackWidget waitlistPublic />}
      {!isWaitlistMode && location.pathname !== '/login' && !session && (!user || user.isGuest) && <GuestTour />}
    </div>
    </DeviceGate>
  );
}

export default App;
