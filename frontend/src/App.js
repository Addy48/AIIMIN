import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Brand from './pages/Brand';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import DataDeletion from './pages/legal/DataDeletion';
import GoogleCompliance from './pages/legal/GoogleCompliance';
import Security from './pages/legal/Security';
import About from './pages/legal/About';
import Contact from './pages/legal/Contact';
import MobileApp from './components/mobile/MobileApp';
import { useAuth } from './hooks/useAuth';
import './App.css';

const Footer = () => (
  // ... omitting unmodified footer ...
  <footer style={{
    padding: '60px 20px 40px',
    background: 'transparent',
    textAlign: 'center',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  }}>
    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
      Built for behavioral clarity. Designed for control.
    </p>
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/privacy" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Privacy Policy</Link>
      <Link to="/terms" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Terms of Service</Link>
      <Link to="/data-deletion" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Data Deletion</Link>
      <Link to="/google-api-compliance" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Google API Compliance</Link>
      <Link to="/security" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Security</Link>
      <Link to="/about" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>About</Link>
      <Link to="/contact" style={{ fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>Contact</Link>
    </div>
  </footer>
);

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Background is controlled exclusively via CSS variables + data-theme attribute.
    // No inline style overrides needed here.
  }, [user, loading]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent user={user} loading={loading} />
    </BrowserRouter>
  );
}

function AppContent({ user }) {
  const location = useLocation();
  const isMobile = location.pathname === '/m';

  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) return;

    const defaultViewport = 'width=device-width, initial-scale=1, viewport-fit=cover';
    const mobileLockedViewport = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

    viewportMeta.setAttribute('content', isMobile ? mobileLockedViewport : defaultViewport);

    // Block iOS gesture zoom (pinch + double-tap)
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

    return () => {
      viewportMeta.setAttribute('content', defaultViewport);
    };
  }, [isMobile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/m" element={user ? <MobileApp user={user} /> : <Navigate to="/login" />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/google-api-compliance" element={<GoogleCompliance />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!isMobile && <Footer />}
    </div>
  );
}

export default App;
