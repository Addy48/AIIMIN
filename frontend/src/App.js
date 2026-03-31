import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Eagerly loaded Auth & public pages
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Brand from './pages/Brand';
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
import { MockDataProvider } from './providers/MockDataProvider';
import ErrorBoundary from './components/system/ErrorBoundary';
import './App.css';

// Lazy-loaded Dashboard routes
const Overview = React.lazy(() => import('./pages/Overview'));
const Systems = React.lazy(() => import('./pages/Systems'));
const Physical = React.lazy(() => import('./pages/systems/Physical'));
const Cognitive = React.lazy(() => import('./pages/systems/Cognitive'));
const Behavior = React.lazy(() => import('./pages/systems/Behavior'));
const Reflection = React.lazy(() => import('./pages/systems/Reflection'));
const Insights = React.lazy(() => import('./pages/Insights'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const ReportsPage = React.lazy(() => import('./pages/Reports'));
const Finance = React.lazy(() => import('./pages/Finance'));
const Settings = React.lazy(() => import('./pages/Settings'));

// /systems always redirects to the first sub-route
const LazySystemsIndex = () => <Navigate to="/systems/physical" replace />;

/* ── Suspense fallback ─────────────────────────────────────────────────── */
const Fallback = () => <div className="glass-panel" style={{ minHeight: '100vh' }} />;

/* ── Footer ────────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{
    padding: '60px 20px 40px',
    background: 'transparent',
    textAlign: 'center',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  }}>
    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
      Built for behavioral clarity. Designed for control.
    </p>
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/privacy" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Privacy Policy</Link>
      <Link to="/terms" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Terms of Service</Link>
      <Link to="/data-deletion" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Data Deletion</Link>
      <Link to="/security" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Security</Link>
      <Link to="/about" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>About</Link>
      <Link to="/contact" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Contact</Link>
    </div>
  </footer>
);

/* ── Root App ──────────────────────────────────────────────────────────── */
function App() {
  return (
    <ErrorBoundary label="Application">
      <ThemeProvider>
        <AuthProvider>
          <MockDataProvider>
            <BrowserRouter>
              <AuthedApp />
            </BrowserRouter>
          </MockDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

/* ── Auth gate (shows spinner while session resolves) ──────────────────── */
function AuthedApp() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Theme controlled via CSS variables + data-theme attribute elsewhere
  }, [user, loading]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <AppContent user={user} />;
}

/* ── Route tree ────────────────────────────────────────────────────────── */
function AppContent({ user }) {
  const location = useLocation();
  const isMobile = location.pathname === '/m';

  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) return;

    const defaultViewport = 'width=device-width, initial-scale=1, viewport-fit=cover';
    const mobileLockedViewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

    viewportMeta.setAttribute('content', isMobile ? mobileLockedViewport : defaultViewport);

    if (isMobile) {
      const blockGesture = (e) => e.preventDefault();
      const blockPinch = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); };
      document.addEventListener('gesturestart', blockGesture, { passive: false });
      document.addEventListener('gesturechange', blockGesture, { passive: false });
      document.addEventListener('touchmove', blockPinch, { passive: false });
      return () => {
        viewportMeta.setAttribute('content', defaultViewport);
        document.removeEventListener('gesturestart', blockGesture);
        document.removeEventListener('gesturechange', blockGesture);
        document.removeEventListener('touchmove', blockPinch);
      };
    }

    return () => { viewportMeta.setAttribute('content', defaultViewport); };
  }, [isMobile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>

        {/* ── Public / Auth ── */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/overview" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={user ? <Navigate to="/overview" replace /> : <Navigate to="/login" />} />

        {/* ── Authenticated shell ── */}
        <Route element={user ? <DashboardLayout user={user} /> : <Navigate to="/login" />}>

          <Route path="/overview" element={<React.Suspense fallback={<Fallback />}><Overview user={user} /></React.Suspense>} />

          <Route path="/systems" element={<React.Suspense fallback={<Fallback />}><Systems /></React.Suspense>}>
            <Route index element={<LazySystemsIndex />} />
            <Route path="physical" element={<React.Suspense fallback={<Fallback />}><Physical /></React.Suspense>} />
            <Route path="cognitive" element={<React.Suspense fallback={<Fallback />}><Cognitive /></React.Suspense>} />
            <Route path="behavior" element={<React.Suspense fallback={<Fallback />}><Behavior /></React.Suspense>} />
            <Route path="reflection" element={<React.Suspense fallback={<Fallback />}><Reflection /></React.Suspense>} />
          </Route>

          <Route path="/insights" element={<React.Suspense fallback={<Fallback />}><Insights /></React.Suspense>} />
          <Route path="/calendar" element={<React.Suspense fallback={<Fallback />}><CalendarPage /></React.Suspense>} />
          <Route path="/reports" element={<React.Suspense fallback={<Fallback />}><ReportsPage /></React.Suspense>} />
          <Route path="/finance" element={<React.Suspense fallback={<Fallback />}><Finance /></React.Suspense>} />
          <Route path="/settings" element={<React.Suspense fallback={<Fallback />}><Settings /></React.Suspense>} />

        </Route>

        {/* ── Mobile PWA ── */}
        <Route path="/m" element={user ? <MobileApp user={user} /> : <Navigate to="/login" />} />

        {/* ── Public pages ── */}
        <Route path="/brand" element={<Brand />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>

      {!isMobile && <Footer />}
    </div>
  );
}

export default App;
