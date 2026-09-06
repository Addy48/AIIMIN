import React from 'react';
import {
  Compass,
  ChartBar,
  Wallet,
  Lightning,
  ShieldCheck,
  CheckCircle,
} from '@phosphor-icons/react';

const BARS = [
  { h: 68, d: 'M' },
  { h: 82, d: 'T' },
  { h: 74, d: 'W' },
  { h: 91, d: 'T' },
  { h: 78, d: 'F' },
  { h: 85, d: 'S' },
  { h: 88, d: 'S' },
];

const DIMENSIONS = [
  { name: 'BODY', pct: '88%', color: '#22c55e' },
  { name: 'MIND', pct: '82%', color: '#749dc4' },
  { name: 'DISCIPLINE', pct: '90%', color: '#ff6b35' },
  { name: 'MONEY', pct: '78%', color: '#749dc4' },
  { name: 'MOOD', pct: '84%', color: '#94a3b8' },
];

export default function HeroPreviewMock() {
  return (
    <div className="waitlist-hero-preview">
      <div className="hero-mock-dashboard" aria-label="Life OS daily command center preview">
        <div className="hero-mock-chrome">
          <div className="hero-mock-dots" aria-hidden="true">
            <span className="hero-mock-dot hero-mock-dot--close" />
            <span className="hero-mock-dot hero-mock-dot--min" />
            <span className="hero-mock-dot hero-mock-dot--max" />
          </div>
          <div className="hero-mock-chrome-cmd" aria-hidden="true">
            <span>⌘K</span>
            <span className="hero-mock-chrome-search">Jump to Today, Money, Family, Score...</span>
          </div>
          <div className="hero-mock-chrome-status">
            <span className="hero-mock-pill">● SERVER LHS: LIVE</span>
          </div>
        </div>

        <div className="hero-mock-body">
          <div className="hero-mock-sidebar" aria-hidden="true">
            <div className="hero-mock-nav-item active" title="Today">
              <Compass size={13} weight="duotone" />
            </div>
            <div className="hero-mock-nav-item" title="Score">
              <ChartBar size={13} />
            </div>
            <div className="hero-mock-nav-item" title="Money">
              <Wallet size={13} />
            </div>
            <div className="hero-mock-nav-item" title="Focus">
              <Lightning size={13} />
            </div>
            <div className="hero-mock-nav-item" title="Family">
              <ShieldCheck size={13} />
            </div>
          </div>

          <div className="hero-mock-main">
            <div className="hero-mock-header">
              <div className="hero-mock-title-block">
                <span className="hero-mock-eyebrow">Today Execution</span>
                <span className="hero-mock-title-text">Optimal Rhythm · 88% Depth</span>
              </div>
              <span className="hero-mock-badge-done">3/3 MINIMUMS DONE</span>
            </div>

            <div className="hero-mock-dimensions-strip" aria-label="5D Life Score dimensions">
              {DIMENSIONS.map((dim) => (
                <div key={dim.name} className="hero-mock-dim-chip">
                  <span className="hero-mock-dim-name" style={{ color: dim.color }}>{dim.name}</span>
                  <span className="hero-mock-dim-val">{dim.pct}</span>
                </div>
              ))}
            </div>

            <div className="hero-mock-stats">
              <div className="hero-mock-stat-card">
                <span className="hero-mock-stat-value">84</span>
                <span className="hero-mock-stat-label">Life Score</span>
              </div>
              <div className="hero-mock-stat-card">
                <span className="hero-mock-stat-value">7.4h</span>
                <span className="hero-mock-stat-label">Sleep (Restful)</span>
              </div>
              <div className="hero-mock-stat-card">
                <span className="hero-mock-stat-value">3.5h</span>
                <span className="hero-mock-stat-label">Deep Focus</span>
              </div>
            </div>

            <div className="hero-mock-split-grid">
              <div className="hero-mock-loops-col">
                <p className="hero-mock-col-title">Daily Verified Loops</p>
                <div className="hero-mock-loop-item">
                  <CheckCircle size={13} weight="fill" color="#22c55e" />
                  <span>45m Gym Workout</span>
                </div>
                <div className="hero-mock-loop-item">
                  <CheckCircle size={13} weight="fill" color="#22c55e" />
                  <span>3.5h Deep Code (DSA)</span>
                </div>
                <div className="hero-mock-loop-item">
                  <CheckCircle size={13} weight="fill" color="#749dc4" />
                  <span>₹420 Lent Rahul (Linked)</span>
                </div>
              </div>

              <div className="hero-mock-chart-wrap">
                <div className="hero-mock-chart-head">
                  <p className="hero-mock-chart-y">7-Day Consistency</p>
                  <p className="hero-mock-chart-axis">Baseline: Optimal</p>
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
      </div>
      <p className="preview-caption">
        Desktop Life OS Command Center · Android companion in closed testing ·{' '}
        <a href="/app">Status</a>
      </p>
    </div>
  );
}
