import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.documentElement.style.backgroundColor = '#0e100d';
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);

reportWebVitals();
