import React, { useState } from 'react';
import './design/designPrototypes.css';
import OverviewPanel from './design/OverviewPanel';
import UILibraryPanel from './design/UILibraryPanel';
import PersonalizationPrototypesPanel from './design/PersonalizationPrototypesPanel';
import TodayPagePrototypesPanel from './design/TodayPagePrototypesPanel';
import ShippedDesignArchivePanel from './design/ShippedDesignArchivePanel';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'today-page', label: 'Today page prototypes' },
  { id: 'personalization', label: 'Personalization prototypes' },
  { id: 'ui-library', label: 'UI library' },
  { id: 'archive', label: 'Shipped archive' },
];

const PANELS = {
  overview: OverviewPanel,
  'today-page': TodayPagePrototypesPanel,
  personalization: PersonalizationPrototypesPanel,
  'ui-library': UILibraryPanel,
  archive: ShippedDesignArchivePanel,
};

export default function DesignSection() {
  const [tab, setTab] = useState('overview');
  const Panel = PANELS[tab];

  return (
    <div className="design-lab" style={{ maxWidth: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <p className="text-label" style={{ color: 'var(--color-text-3)', marginBottom: 6 }}>Account</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Design Lab</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', maxWidth: 640, lineHeight: 1.65 }}>
          Active prototypes and experiments only. Finished navbar, theme, accent, logo, and typography work
          has been moved into the shipped archive.
        </p>
      </div>

      <nav className="design-lab__tabs" aria-label="Design lab sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`design-lab__tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <Panel />
    </div>
  );
}
