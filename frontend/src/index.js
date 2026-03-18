import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DevContextProvider } from './context/DevContext';

// Global error log for admin console visibility
window.__AIIMIN_ERROR_LOG = window.__AIIMIN_ERROR_LOG || [];

const root = ReactDOM.createRoot(document.getElementById('root'));
document.documentElement.style.backgroundColor = '#0e100d';
root.render(
  <DevContextProvider>
    <App />
  </DevContextProvider>
);

reportWebVitals();
