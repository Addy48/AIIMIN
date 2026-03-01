import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';
import './App.css';

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
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
