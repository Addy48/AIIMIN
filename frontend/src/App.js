import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

// Eagerly loaded Auth & public pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import DataDeletion from './pages/legal/DataDeletion';
import Security from './pages/legal/Security';
import About from './pages/legal/About';
import Contact from './pages/legal/Contact';
import Brand from './pages/legal/Brand';

// Layout & eager components
import DashboardLayout from './components/layout/DashboardLayout';
import FeedbackWidget from './components/FeedbackWidget';
import ProductTour from './components/onboarding/ProductTour';
import GuestTour from './components/onboarding/GuestTour';

// Guest mode
// (Removed unused guest providers)

// Providers & utilities
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/ClerkAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import ErrorBoundary from './components/system/ErrorBoundary';

// Lazy-loaded Dashboard routes
const Overview = React.lazy(() => import('./pages/Overview'));
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

const CLERK_PK = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

/* ── Root App ─────────────────────────────────────────────────────── */
function App() {
  return (
    <ErrorBoundary label="Application">
      <ClerkProvider publishableKey={CLERK_PK} afterSignOutUrl="/login">
        <ThemeProvider>
          <AuthProvider>
            <AudioProvider>
              <BrowserRouter>
                <AuthedApp />
              </BrowserRouter>
            </AudioProvider>
          </AuthProvider>
        </ThemeProvider>
      </ClerkProvider>
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
  // Basic check for mobile form factor removed, mobile now uses main layout

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-base)' }}>
      <Routes>

        {/* ── Auth ── */}
        <Route path="/login/*" element={session ? <Navigate to="/overview" replace /> : <Login />} />
        <Route path="/onboarding" element={session ? <Onboarding /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to={user ? '/overview' : '/login'} replace />} />

        {/* ── Authenticated shell ── */}
        <Route element={
          session ? <DashboardLayout user={user || { id: 'loading', full_name: 'Loading...', username: 'loading', isGuest: false }} /> : 
          <Navigate to="/login" replace />
        }>
          <Route path="/overview" element={<Lazy><Overview user={user || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }} /></Lazy>} />
          <Route path="/insights" element={<Lazy><Insights /></Lazy>} />
          <Route path="/calendar" element={<Lazy><CalendarPage /></Lazy>} />

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
          <Route path="/family"      element={<Lazy><FamilyPage /></Lazy>} />
          <Route path="/account"     element={<Lazy><AccountPage /></Lazy>} />
          <Route path="/reports"     element={<Lazy><ReportsPage /></Lazy>} />
          <Route path="/seed-data"   element={<Lazy><SeedData /></Lazy>} />
        </Route>

        {/* ── Public legal & brand ── */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/brand" element={<Brand />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to={user ? '/overview' : '/login'} replace />} />

      </Routes>

      {/* Global Widgets */}
      {location.pathname !== '/login' && user && !user.isGuest && <ProductTour />}
      {location.pathname !== '/login' && user && !user.isGuest && <FeedbackWidget />}
      {location.pathname !== '/login' && !session && (!user || user.isGuest) && <GuestTour />}
    </div>
  );
}

export default App;
