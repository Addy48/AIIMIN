import React from 'react';

const MOOD_OPTIONS = [
  { value: 2, emoji: '😞', label: 'Low' },
  { value: 4, emoji: '😕', label: 'Off' },
  { value: 6, emoji: '😐', label: 'Okay' },
  { value: 8, emoji: '🙂', label: 'Good' },
  { value: 10, emoji: '😄', label: 'Great' },
];

export default function JournalMoodStrip({ value, onChange, disabled = false }) {
  return (
    <div className="journal-mood-strip">
      <span className="journal-mood-strip__label">Mood</span>
      {MOOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          title={`${option.label} (${option.value}/10)`}
          disabled={disabled}
          onClick={() => onChange?.(option.value)}
          className={`journal-mood-strip__btn ${value === option.value ? 'journal-mood-strip__btn--selected' : ''}`}
        >
          {option.emoji}
        </button>
      ))}
    </div>
  );
}
