import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useThemeColors from '../../hooks/useThemeColors';
import JournalMoodStrip from './JournalMoodStrip';

export default function WhatWentWellMode({ onSave, initialWins = [], readOnly = false }) {
  const c = useThemeColors();
  const [wins, setWins] = useState(
    initialWins.length
      ? initialWins
      : [
          { text: '', why: '', open: true },
          { text: '', why: '', open: false },
          { text: '', why: '', open: false },
        ]
  );
  const [mood, setMood] = useState(8);

  const update = (i, key, val) => {
    setWins((w) => w.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));
  };

  const toggle = (i) => setWins((w) => w.map((item, idx) => (idx === i ? { ...item, open: !item.open } : item)));

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h2 className="text-h2" style={{ color: c.text1, marginBottom: 8 }}>What Went Well</h2>
      <p className="text-sm" style={{ color: c.text2, marginBottom: 24 }}>Three good things today. Name them, then dig into why.</p>

      {wins.map((win, i) => (
        <div key={i} style={{ marginBottom: 16, padding: 16, borderRadius: 12, border: `1px solid ${c.border}`, background: c.cardBg }}>
          <label className="text-label" style={{ color: c.text3 }}>Win {i + 1}</label>
          <input
            value={win.text}
            onChange={(e) => update(i, 'text', e.target.value)}
            readOnly={readOnly}
            placeholder="Something that went right today"
            style={{ width: '100%', marginTop: 8, marginBottom: 10, padding: 12, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1 }}
          />
          <button type="button" onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: c.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
            {win.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Why did this happen?
          </button>
          {win.open && (
            <textarea
              value={win.why}
              onChange={(e) => update(i, 'why', e.target.value)}
              readOnly={readOnly}
              placeholder="What made this possible?"
              rows={2}
              style={{ width: '100%', marginTop: 8, padding: 12, borderRadius: 8, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1, resize: 'vertical' }}
            />
          )}
        </div>
      ))}

      <div style={{ marginBottom: 16 }}>
        <JournalMoodStrip value={mood} onChange={setMood} disabled={readOnly} />
      </div>

      {!readOnly && (
        <button
          type="button"
          className="btn-action"
          onClick={() => onSave?.({ wins, mood })}
          style={{ width: '100%', padding: 14, background: c.accent, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}
        >
          Save wins
        </button>
      )}
    </div>
  );
}
