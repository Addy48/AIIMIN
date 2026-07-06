import React from 'react';

export default function MobilePreviewMock() {
  return (
    <div className="mobile-preview-mock" aria-label="Mobile logging preview mockup">
      <div className="mobile-mock-header">
        <span className="mobile-mock-ring" />
        <span className="mobile-mock-streak">🔥 12</span>
      </div>
      <div className="mobile-mock-rows">
        {['Sleep', 'Gym', 'Mood', 'Steps', 'Focus'].map((label) => (
          <div key={label} className="mobile-mock-row">
            <span className="mobile-mock-label">{label}</span>
            <span className="mobile-mock-check" />
          </div>
        ))}
      </div>
      <div className="mobile-mock-save">Save day</div>
    </div>
  );
}
