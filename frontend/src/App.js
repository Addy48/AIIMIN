import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import useTheme from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={theme === 'dark' ? 'dark min-h-screen bg-[var(--bg-primary)] flex items-center justify-center' : 'min-h-screen bg-[#f9f9f9] flex items-center justify-center'}>
        <div className="w-8 h-8 border-4 border-[var(--accent-dim)] border-t-[var(--accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark min-h-screen bg-[var(--bg-primary)] text-[var(--text-1)]' : 'min-h-screen bg-[#f9f9f9] text-gray-900'}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
