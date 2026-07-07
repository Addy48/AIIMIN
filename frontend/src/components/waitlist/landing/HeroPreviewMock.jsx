import React from 'react';

export default function HeroPreviewMock() {
  return (
    <div className="waitlist-hero-preview">
      <div className="hero-mock-dashboard" aria-label="Dashboard preview mockup">
        <div className="hero-mock-chrome">
          <span className="hero-mock-dot" />
          <span className="hero-mock-dot" />
          <span className="hero-mock-dot" />
        </div>
        <div className="hero-mock-body">
          <div className="hero-mock-sidebar">
            <span className="hero-mock-nav-item active" />
            <span className="hero-mock-nav-item" />
            <span className="hero-mock-nav-item" />
            <span className="hero-mock-nav-item" />
          </div>
          <div className="hero-mock-main">
            <div className="hero-mock-header">
              <span className="hero-mock-title" />
              <span className="hero-mock-pill" />
            </div>
            <div className="hero-mock-stats">
              <div className="hero-mock-stat-card"><span className="hero-mock-stat-value">82%</span><span className="hero-mock-stat-label">Life score</span></div>
              <div className="hero-mock-stat-card"><span className="hero-mock-stat-value">7.2h</span><span className="hero-mock-stat-label">Sleep</span></div>
              <div className="hero-mock-stat-card"><span className="hero-mock-stat-value">8/10</span><span className="hero-mock-stat-label">Logged</span></div>
            </div>
            <div className="hero-mock-chart-wrap">
              <p className="hero-mock-chart-y">Daily completion %</p>
              <div className="hero-mock-chart">
                {[68, 82, 74, 91, 78, 85, 88].map((h, i) => (
                  <span key={`bar-${i}`} className="hero-mock-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="hero-mock-chart-axis">Last 7 days</p>
            </div>
          </div>
        </div>
      </div>
      <p className="preview-caption">Your daily command layer — web Life OS today, native app en route.</p>
    </div>
  );
}
