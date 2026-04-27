import React, { useState } from 'react';

/**
 * HabitCircle — 48px circle for habit tracking.
 * Spec: uncompleted = gray outline, completed = teal stroke + 10% fill + checkmark.
 * Tap animation: checkmark draws (120ms) → background fades in (150ms). Total 270ms.
 * Label below: 10px mono, gray.
 */
const HabitCircle = ({
  id,
  label,
  completed,
  onToggle,    // fn(id)
}) => {
  const [localDone, setLocalDone] = useState(completed);
  const [animStep, setAnimStep] = useState(completed ? 2 : 0);
  // animStep: 0 = idle, 1 = checkmark drawing, 2 = fully done

  const handleTap = () => {
    if (localDone) {
      setLocalDone(false);
      setAnimStep(0);
      onToggle?.(id);
      return;
    }

    setAnimStep(1); // start checkmark draw
    setTimeout(() => {
      setLocalDone(true);
      setAnimStep(2); // fill background
      onToggle?.(id);
    }, 120);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
    }}
    onClick={handleTap}
    >
      {/* Circle */}
      <div style={{
        width: 'var(--circle-habit)',
        height: 'var(--circle-habit)',
        borderRadius: '50%',
        border: `1.5px solid ${localDone ? 'var(--color-accent)' : 'var(--color-text-3)'}`,
        background: localDone
          ? 'var(--color-accent-dim)'
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `background var(--dur-normal) var(--ease), border-color var(--dur-fast) var(--ease)`,
      }}>
        {animStep >= 1 && (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path
              d="M2 7L7 12L16 2"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="24"
              strokeDashoffset={animStep >= 1 ? '0' : '24'}
              style={{
                transition: `stroke-dashoffset var(--dur-fast) var(--ease)`,
              }}
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <span style={{
        font: '500 10px/1 var(--font-mono)',
        color: localDone ? 'var(--color-accent)' : 'var(--color-text-2)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        maxWidth: '52px',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: `color var(--dur-enter) var(--ease)`,
      }}>
        {label}
      </span>
    </div>
  );
};

export default HabitCircle;
