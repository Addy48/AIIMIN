import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Brand from './pages/Brand';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { useAuth } from './hooks/useAuth';
import './App.css';

const Footer = () => (
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
  </footer>
);

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      document.documentElement.style.backgroundColor = '#f5f0e8';
      document.body.style.backgroundColor = '#f5f0e8';
    }
  }, [user, loading]);

  if (loading) {
    document.documentElement.style.backgroundColor = '#f5f0e8';
    document.body.style.backgroundColor = '#f5f0e8';
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#e05c2a] border-t-[#c27814] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/auth/callback" element={<Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
