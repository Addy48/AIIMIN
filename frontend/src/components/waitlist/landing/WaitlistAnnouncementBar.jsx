import React from 'react';
import { Sparkle, ShieldCheck, Rocket, Tag } from '@phosphor-icons/react';

const ANNOUNCEMENTS = [
  { badge: 'LAUNCH', text: 'Targeting November 2026', icon: Rocket, accent: '#ff6b35' },
  { badge: 'FOUNDING RATE', text: 'Pro locked at ₹49/mo for waitlist members', icon: Tag, accent: '#749dc4' },
  { badge: 'TESTER REWARD', text: '12 months Elite complimentary for active testers', icon: Sparkle, accent: '#10b981' },
  { badge: 'SECURITY', text: 'AES-256 hardware keystore · Zero cloud telemetry', icon: ShieldCheck, accent: '#749dc4' },
  { badge: 'CUTOFF', text: 'Tester registration closes 31 October 2026', icon: Rocket, accent: '#ff6b35' },
];

export default function WaitlistAnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="waitlist-announcement-bar" role="region" aria-label="Announcements">
      <div className="waitlist-announcement-bar-inner">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="waitlist-announcement-item">
              <span className="announcement-badge" style={{ color: item.accent, borderColor: `color-mix(in srgb, ${item.accent} 35%, transparent)` }}>
                {item.badge}
              </span>
              <Icon size={13} weight="fill" style={{ color: item.accent, flexShrink: 0 }} />
              <span className="announcement-text">{item.text}</span>
              <span className="announcement-sep" aria-hidden="true">//</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
