import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Eagerly loaded Auth & public pages
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import DataDeletion from './pages/legal/DataDeletion';
import Security from './pages/legal/Security';
import About from './pages/legal/About';
import Contact from './pages/legal/Contact';
import Brand from './pages/legal/Brand';

// Layout & eager components
import MobileApp from './components/mobile/MobileApp';
import DashboardLayout from './components/layout/DashboardLayout';
import FeedbackWidget from './components/FeedbackWidget';
import ProductTour from './components/onboarding/ProductTour';
import GuestTour from './components/onboarding/GuestTour';

// Guest mode
import { GuestProvider } from './context/GuestContext';
import { GuestGateProvider } from './components/common/GuestGate';

// Providers & utilities
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/system/ErrorBoundary';

// Lazy-loaded Dashboard routes
const Overview = React.lazy(() => import('./pages/Overview'));
const Insights = React.lazy(() => import('./pages/Insights'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const ReportsPage = React.lazy(() => import('./pages/Reports'));
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
        <AuthProvider>
          <BrowserRouter>
            <AuthedApp />
          </BrowserRouter>
        </AuthProvider>
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
  const isMobileRoute = location.pathname === '/m';

  // Basic check for mobile form factor (used for smart default routing)
  const isMobileDevice = typeof window !== 'undefined' && (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768);

  React.useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    const defaultVP = 'width=device-width, initial-scale=1, viewport-fit=cover';
    const mobileVP = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    meta.setAttribute('content', isMobileRoute ? mobileVP : defaultVP);
    if (isMobileRoute) {
      const block = (e) => { if (e.touches?.length > 1) e.preventDefault(); };
      document.addEventListener('touchmove', block, { passive: false });
      return () => { meta.setAttribute('content', defaultVP); document.removeEventListener('touchmove', block); };
    }
    return () => meta.setAttribute('content', defaultVP);
  }, [isMobileRoute]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-base)' }}>
      <Routes>

        {/* ── Auth ── */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={isMobileDevice ? '/m' : '/overview'} replace />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Navigate to={user ? (isMobileDevice ? '/m' : '/overview') : '/guest'} replace />} />

        {/* ── Guest Mode specific route starts here ── */}
        <Route path="/guest" element={<Navigate to="/overview?guest=true" replace />} />

        {/* ── Authenticated / Guest shell ── */}
        <Route element={
          session ? <DashboardLayout user={user || { id: 'loading', full_name: 'Loading...', username: 'loading', isGuest: false }} /> : 
          <GuestProvider><GuestGateProvider><DashboardLayout user={{ id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }} /></GuestGateProvider></GuestProvider>
        }>
          <Route path="/overview" element={<Lazy><Overview user={user || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }} /></Lazy>} />
          <Route path="/insights" element={<Lazy><Insights /></Lazy>} />
          <Route path="/calendar" element={<Lazy><CalendarPage /></Lazy>} />
          <Route path="/reports" element={<Lazy><ReportsPage /></Lazy>} />
          <Route path="/sports" element={<Lazy><SportsPage /></Lazy>} />
          <Route path="/journal" element={<Lazy><JournalPage /></Lazy>} />
          <Route path="/finance" element={<Lazy><Finance /></Lazy>} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
          <Route path="/lab" element={<Lazy><LabFullPage /></Lazy>} />
          <Route path="/placements" element={<Lazy><Placements /></Lazy>} />
          <Route path="/habits"     element={<Lazy><HabitsPage /></Lazy>} />
          <Route path="/goals"       element={<Lazy><GoalsPage /></Lazy>} />
          <Route path="/identity"    element={<Lazy><IdentityPage /></Lazy>} />
          <Route path="/notes"       element={<Lazy><NotesPage /></Lazy>} />
          <Route path="/discipline"  element={<Lazy><DisciplinePage /></Lazy>} />
          <Route path="/focus"       element={<Lazy><FocusRoom /></Lazy>} />
        </Route>

        {/* ── Mobile PWA ── */}
        <Route path="/m" element={user ? <MobileApp user={user} /> : <Navigate to="/login" replace />} />

        {/* ── Public legal & brand ── */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/brand" element={<Brand />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to={user ? (isMobileDevice ? '/m' : '/overview') : '/guest'} replace />} />

      </Routes>

      {!isMobileRoute && (
        <footer style={{
          padding: '32px 24px',
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{ font: '500 10px/1 var(--font-mono)', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AIIMIN — Personal OS
          </span>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/data-deletion', 'Data Deletion'], ['/security', 'Security'], ['/about', 'About']].map(([to, label]) => (
              <Link key={to} to={to} style={{ font: '300 12px/1 var(--font-sans)', color: 'var(--color-text-3)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </footer>
      )}

      {/* Global Widgets */}
      {!isMobileRoute && user && !user.isGuest && <ProductTour />}
      {!isMobileRoute && user && !user.isGuest && <FeedbackWidget />}
      {!isMobileRoute && !session && (!user || user.isGuest) && <GuestTour />}
    </div>
  );
}

export default App;
