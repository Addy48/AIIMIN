import React, { useState } from 'react';

/**
 * MoodSelector — "Today I feel [word]" with 5 dot selector.
 * Spec: 5 dots representing mood 1-5, selected dot = teal.
 * Selected word replaces [word] inline.
 */

const MOOD_WORDS = ['depleted', 'low', 'okay', 'good', 'sharp'];

const MoodSelector = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(null);

  const displayIndex = hovered !== null ? hovered : (value ? value - 1 : null);
  const displayWord = displayIndex !== null ? MOOD_WORDS[displayIndex] : null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '12px 0',
    }}>
      {/* "Today I feel [word]" */}
      <span style={{
        font: '300 13px/1 var(--font-sans)',
        color: 'var(--color-text-2)',
        fontStyle: 'italic',
        whiteSpace: 'nowrap',
      }}>
        Today I feel{' '}
        <span style={{
          color: displayWord ? 'var(--color-text-1)' : 'var(--color-text-3)',
          fontStyle: 'normal',
          transition: `color var(--dur-fast) var(--ease)`,
          minWidth: '60px',
          display: 'inline-block',
        }}>
          {displayWord || '___'}
        </span>
      </span>

      {/* 5 dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {MOOD_WORDS.map((word, i) => {
          const isSelected = value === i + 1;
          const isHovered = hovered === i;

          return (
            <button
              key={word}
              title={word}
              aria-label={`Mood: ${word}`}
              onClick={() => onChange?.(i + 1)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isSelected
                  ? 'var(--color-accent)'
                  : isHovered
                  ? 'var(--color-text-2)'
                  : 'var(--color-text-3)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: `background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)`,
                transform: isSelected || isHovered ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
