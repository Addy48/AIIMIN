import React from 'react';

const BARS = [
  { h: 68, d: 'M' },
  { h: 82, d: 'T' },
  { h: 74, d: 'W' },
  { h: 91, d: 'T' },
  { h: 78, d: 'F' },
  { h: 85, d: 'S' },
  { h: 88, d: 'S' },
];

export default function HeroPreviewMock() {
  return (
    <div className="waitlist-hero-preview">
      <div className="hero-mock-dashboard" aria-label="Life OS daily board preview">
        <div className="hero-mock-chrome">
          <div className="hero-mock-dots" aria-hidden="true">
            <span className="hero-mock-dot hero-mock-dot--close" />
            <span className="hero-mock-dot hero-mock-dot--min" />
            <span className="hero-mock-dot hero-mock-dot--max" />
          </div>
          <div className="hero-mock-chrome-pills" aria-hidden="true">
            <span className="hero-mock-chrome-pill" />
            <span className="hero-mock-chrome-pill hero-mock-chrome-pill--accent" />
          </div>
        </div>
        <div className="hero-mock-body">
          <div className="hero-mock-sidebar" aria-hidden="true">
            <span className="hero-mock-nav-item active" />
            <span className="hero-mock-nav-item" />
            <span className="hero-mock-nav-item" />
            <span className="hero-mock-nav-item" />
          </div>
          <div className="hero-mock-main">
            <div className="hero-mock-header">
              <div className="hero-mock-title-block">
                <span className="hero-mock-eyebrow">Today</span>
                <span className="hero-mock-title-text">Daily execution</span>
              </div>
              <span className="hero-mock-pill">Synced</span>
            </div>
            <div className="hero-mock-stats">
              <div className="hero-mock-stat-card">
                <span className="hero-mock-stat-value">82%</span>
                <span className="hero-mock-stat-label">Life score</span>
              </div>
              <div className="hero-mock-stat-card">
                <span className="hero-mock-stat-value">7.2h</span>
                <span className="hero-mock-stat-label">Sleep</span>
              </div>
              <div className="hero-mock-stat-card">
                <span className="hero-mock-stat-value">8/10</span>
                <span className="hero-mock-stat-label">Logged</span>
              </div>
            </div>
            <div className="hero-mock-chart-wrap">
              <div className="hero-mock-chart-head">
                <p className="hero-mock-chart-y">Daily completion %</p>
                <p className="hero-mock-chart-axis">Last 7 days</p>
              </div>
              <div className="hero-mock-chart" role="img" aria-label="Sample completion bars for last 7 days">
                {BARS.map((bar) => (
                  <div key={bar.d + bar.h} className="hero-mock-bar-col">
                    <span className="hero-mock-bar" style={{ height: `${bar.h}%` }} />
                    <span className="hero-mock-bar-day">{bar.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="preview-caption">
        Web Life OS today · Android companion in closed testing ·{' '}
        <a href="/app">Status</a>
      </p>
    </div>
  );
}
