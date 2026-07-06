import React from 'react';
import { useAccessGate } from '../hooks/useAccessGate';
import WaitlistBrand from './WaitlistBrand';
import SystemBrand from './legal/Brand';

/**
 * /brand routes waitlist visitors to the forest-green waitlist brand page (theme-synced with /).
 * Authenticated app users and non-waitlist builds get the OAuth/system brand page.
 */
export default function BrandRoute() {
  const { isWaitlistMode, canAccessApp, loading } = useAccessGate();

  if (loading && isWaitlistMode) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (isWaitlistMode && !canAccessApp) {
    return <WaitlistBrand />;
  }

  return <SystemBrand />;
}
