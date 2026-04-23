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

// Layout & eager components
import MobileApp from './components/mobile/MobileApp';
import DashboardLayout from './components/layout/DashboardLayout';

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
const Skills = React.lazy(() => import('./pages/Skills'));
const Growth = React.lazy(() => import('./pages/Growth'));

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
  const { user, loading } = useAuth();
  if (loading) return <Fallback />;
  return <AppContent user={user} />;
}

function AppContent({ user }) {
  const location = useLocation();
  const isMobile = location.pathname === '/m';

  React.useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    const defaultVP = 'width=device-width, initial-scale=1, viewport-fit=cover';
    const mobileVP = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    meta.setAttribute('content', isMobile ? mobileVP : defaultVP);
    if (isMobile) {
      const block = (e) => { if (e.touches?.length > 1) e.preventDefault(); };
      document.addEventListener('touchmove', block, { passive: false });
      return () => { meta.setAttribute('content', defaultVP); document.removeEventListener('touchmove', block); };
    }
    return () => meta.setAttribute('content', defaultVP);
  }, [isMobile]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-base)' }}>
      <Routes>

        {/* ── Auth ── */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/overview" replace />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Navigate to={user ? '/overview' : '/login'} replace />} />

        {/* ── Authenticated shell ── */}
        <Route element={user ? <DashboardLayout user={user} /> : <Navigate to="/login" replace />}>
          <Route path="/overview" element={<Lazy><Overview user={user} /></Lazy>} />
          <Route path="/insights" element={<Lazy><Insights /></Lazy>} />
          <Route path="/calendar" element={<Lazy><CalendarPage /></Lazy>} />
          <Route path="/reports" element={<Lazy><ReportsPage /></Lazy>} />
          <Route path="/finance" element={<Lazy><Finance /></Lazy>} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
          <Route path="/skills" element={<Lazy><Skills /></Lazy>} />
          <Route path="/growth" element={<Lazy><Growth /></Lazy>} />
        </Route>

        {/* ── Mobile PWA ── */}
        <Route path="/m" element={user ? <MobileApp user={user} /> : <Navigate to="/login" replace />} />

        {/* ── Public legal ── */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to={user ? '/overview' : '/login'} replace />} />

      </Routes>

      {!isMobile && (
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
    </div>
  );
}

export default App;
