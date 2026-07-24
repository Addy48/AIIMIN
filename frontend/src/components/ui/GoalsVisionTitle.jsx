import React from 'react';

/**
 * Display title with Playfair italic ampersand — matches editorial Goals & Vision lockup.
 */
export default function GoalsVisionTitle({ className = '' }) {
  return (
    <span className={`goals-vision-title ${className}`.trim()}>
      <span className="goals-vision-title__word">Goals</span>
      <span className="goals-vision-title__amp" aria-hidden="true">&</span>
      <span className="goals-vision-title__word">Vision</span>
    </span>
  );
}
