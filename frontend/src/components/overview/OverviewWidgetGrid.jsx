import React, { useState, useEffect } from 'react';
import { LayoutGrid, Eye, EyeOff } from 'lucide-react';

const WIDGETS_KEY = 'aiimin_overview_widgets';
const WIDGETS_VERSION_KEY = 'aiimin_overview_widgets_version';
const WIDGETS_VERSION = '2026-07-04-simplified-today';
const WIDGETS_CHANGE_EVENT = 'aiimin-overview-widgets-changed';
const REDUNDANT_DEFAULT_OFF = new Set(['week_numbers', 'countdown', 'wins']);

const DEFAULT_WIDGETS = [
  { id: 'monday_insight', label: 'Weekly Insight', default: true },
  { id: 'week_numbers', label: 'Week in Numbers', default: false },
  { id: 'quick_capture', label: 'Quick Capture', default: true },
  { id: 'countdown', label: 'Execution Window', default: false },
  { id: 'wins', label: 'Recent Wins', default: false },
  { id: 'micro_task', label: 'Micro Task', default: true },
  { id: 'timeline', label: 'Command Timeline', default: true },
  { id: 'logger', label: 'Universal Logger', default: true },
  { id: 'command_center', label: 'Command Center', default: true },
  { id: 'trajectory', label: 'Trajectory', default: true },
];

function loadWidgetPrefs() {
  const defaults = Object.fromEntries(DEFAULT_WIDGETS.map((w) => [w.id, w.default]));
  try {
    const saved = JSON.parse(localStorage.getItem(WIDGETS_KEY) || 'null');
    const version = localStorage.getItem(WIDGETS_VERSION_KEY);
    if (saved && typeof saved === 'object') {
      if (version !== WIDGETS_VERSION) {
        const migrated = { ...defaults, ...saved };
        REDUNDANT_DEFAULT_OFF.forEach((id) => { migrated[id] = false; });
        localStorage.setItem(WIDGETS_VERSION_KEY, WIDGETS_VERSION);
        return migrated;
      }
      return { ...defaults, ...saved };
    }
  } catch { /* ignore */ }
  localStorage.setItem(WIDGETS_VERSION_KEY, WIDGETS_VERSION);
  return defaults;
}

export function applyOverviewWidgetPreset(widgetPrefs) {
  if (!widgetPrefs || typeof widgetPrefs !== 'object') return;
  const defaults = Object.fromEntries(DEFAULT_WIDGETS.map((w) => [w.id, w.default]));
  const next = { ...defaults, ...widgetPrefs };
  localStorage.setItem(WIDGETS_KEY, JSON.stringify(next));
  localStorage.setItem(WIDGETS_VERSION_KEY, WIDGETS_VERSION);
  window.dispatchEvent(new CustomEvent(WIDGETS_CHANGE_EVENT, { detail: next }));
}

export function useOverviewWidgets() {
  const [prefs, setPrefs] = useState(loadWidgetPrefs);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    localStorage.setItem(WIDGETS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    const sync = (event) => {
      if (event?.detail) setPrefs(event.detail);
      else setPrefs(loadWidgetPrefs());
    };
    window.addEventListener(WIDGETS_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(WIDGETS_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isVisible = (id) => prefs[id] !== false;
  const toggle = (id) => setPrefs((p) => ({ ...p, [id]: !isVisible(id) }));
  const allHidden = DEFAULT_WIDGETS.every((w) => prefs[w.id] === false);

  const Picker = () => (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      <button
        type="button"
        onClick={() => setShowPicker((s) => !s)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 14px', borderRadius: '10px',
          border: '1px solid var(--color-border)', background: 'var(--color-surface)',
          color: 'var(--color-text-2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}
      >
        <LayoutGrid size={14} /> Customize widgets
      </button>
      {showPicker && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 50, marginTop: '8px',
          padding: '12px', borderRadius: '12px', minWidth: '220px',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        }}>
          {DEFAULT_WIDGETS.map((w) => {
            const visible = isVisible(w.id);
            return (
            <button
              key={w.id}
              type="button"
              onClick={() => toggle(w.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                padding: '8px 10px', borderRadius: '8px', border: 'none',
                background: visible ? 'var(--color-accent-dim)' : 'transparent',
                color: 'var(--color-text-1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                marginBottom: '4px',
              }}
            >
              {w.label}
              {visible ? <Eye size={14} /> : <EyeOff size={14} style={{ opacity: 0.4 }} />}
            </button>
          );})}
        </div>
      )}
    </div>
  );

  return { isVisible, allHidden, Picker };
}

export default useOverviewWidgets;
