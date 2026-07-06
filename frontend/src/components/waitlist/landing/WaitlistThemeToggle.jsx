import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function WaitlistThemeToggle({ isLight, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`waitlist-theme-icon-btn ${className}`.trim()}
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      {isLight ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
    </button>
  );
}
