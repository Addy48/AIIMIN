import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';
import MobileOfflineBanner from './MobileOfflineBanner';
import { installOfflineSyncListener } from '../../utils/offlineLogQueue';
import { setCapacitorBackNavigate } from '../../utils/capacitorEnv';
import toast from '../../utils/toast';
import SEO from '../common/SEO';
import '../../styles/mobileBottomNav.css';
import '../../styles/mobileTouchTargets.css';

/**
 * Phone web shell — capture, score glance, lite account.
 * Full Life OS on iPad / desktop only.
 */
export default function MobileShell() {
  const navigate = useNavigate();

  useEffect(() => {
    setCapacitorBackNavigate(navigate);
    return () => setCapacitorBackNavigate(null);
  }, [navigate]);

  useEffect(() => {
    return installOfflineSyncListener((count) => {
      toast.success(`Synced ${count} offline log${count === 1 ? '' : 's'}.`);
    });
  }, []);

  return (
    <div className="mobile-shell">
      <SEO
        title="Mobile Quick Capture"
        description="AIIMIN mobile telemetry capture shell."
        canonicalPath="/m"
        noIndex={true}
      />
      <MobileOfflineBanner />
      <Outlet />
      <MobileBottomNav />
    </div>
  );
}
