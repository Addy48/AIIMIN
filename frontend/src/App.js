import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import useTheme from './hooks/useTheme';
import './App.css';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark bg-bgDark min-h-screen' : 'bg-bgLight min-h-screen'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
