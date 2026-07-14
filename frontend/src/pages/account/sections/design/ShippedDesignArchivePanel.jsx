import React from 'react';
import { LabCard } from './PrototypePrimitives';

/** Honest status — avoids calling prototypes "Shipped" when they are not live in production pages. */
const ARCHIVE = [
  {
    status: 'Partial',
    title: 'Themes',
    desc: 'constants/themes.js defines AIIMIN Dark / Light. Full CSS + ThemeContext wiring was completed during recovery — verify in Personalization.',
  },
  {
    status: 'Partial',
    title: 'Accent system',
    desc: 'Orange action accent exists on aiimin-dark/light token blocks. Legacy vercel/nordic themes still use green until you switch theme.',
  },
  {
    status: 'Prototype',
    title: 'Navbar',
    desc: 'Masthead, More overflow, and OS Online removal are in Navbar prototypes — live Navbar.jsx may still differ. See Navbar concepts tab.',
  },
  {
    status: 'Prototype',
    title: 'Typography',
    desc: 'Figtree + Bodoni plan documented here. Global tokens.css still loads Inter + Playfair until typography ship is finished.',
  },
  {
    status: 'Partial',
    title: 'Brand chip',
    desc: 'Light-mode logo chip treatment exists on BrandLockup; confirm against live navbar/brand components.',
  },
];

const RETIRED_TABS = [
  'Navbar concepts',
  'Themes',
  'Accent system',
  'Logo & typography',
];

const STATUS_STYLE = {
  Shipped: { color: 'var(--color-success)', label: 'Shipped' },
  Partial: { color: 'var(--color-warning, #FACC15)', label: 'Partial' },
  Prototype: { color: 'var(--color-text-3)', label: 'Prototype' },
  Planned: { color: 'var(--color-info)', label: 'Planned' },
};

export default function ShippedDesignArchivePanel() {
  return (
    <div className="design-lab__panel">
      <LabCard
        title="Design archive (honest status)"
        desc="Tracks removed from active tabs. Status reflects what is actually live in production routes — not aspirational labels."
        badge="Archive"
        badgeVariant="current"
      >
        <div className="archive-list">
          {ARCHIVE.map(({ status, title, desc }) => {
            const meta = STATUS_STYLE[status] || STATUS_STYLE.Prototype;
            return (
              <div key={title} className="archive-list__item">
                <span style={{ color: meta.color }}>{meta.label}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LabCard>

      <LabCard
        title="Cleared from active lab"
        desc="Reference panels kept in code but hidden from tabs while decisions are frozen or moved to production work."
        badge="Cleaned"
        badgeVariant="proposed"
      >
        <div className="retired-tabs">
          {RETIRED_TABS.map((tab) => (
            <span key={tab}>{tab}</span>
          ))}
        </div>
      </LabCard>
    </div>
  );
}
