import React from 'react';
import { LabCard } from './PrototypePrimitives';

const SHIPPED = [
  ['Themes', 'AIIMIN Dark / Light replaced the old four-theme experiment.'],
  ['Accent system', 'Orange is the action accent; green is reserved for completion and success.'],
  ['Navbar', 'Masthead layout, More overflow, unified brand click, and OS Online removal are live.'],
  ['Typography', 'Figtree owns app text and page titles; Bodoni stays with the wordmark.'],
  ['Brand chip', 'Light-mode logo chip now uses a softer paper-tone treatment.'],
];

const RETIRED_TABS = [
  'Navbar concepts',
  'Themes',
  'Accent system',
  'Logo & typography',
];

export default function ShippedDesignArchivePanel() {
  return (
    <div className="design-lab__panel">
      <LabCard
        title="Shipped design work"
        desc="These prototype tracks are no longer active decision pages. They are kept here as a compact archive so Design Lab stays focused on unfinished work."
        badge="Archive"
        badgeVariant="current"
      >
        <div className="archive-list">
          {SHIPPED.map(([title, desc]) => (
            <div key={title} className="archive-list__item">
              <span>Shipped</span>
              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </LabCard>

      <LabCard
        title="Cleared from active lab"
        desc="The old pages still exist in code for reference, but they are not shown as active tabs because the work is done."
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
