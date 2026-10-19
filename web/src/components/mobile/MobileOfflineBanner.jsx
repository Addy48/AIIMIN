import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { getPendingLogCount } from '../../utils/offlineLogQueue';
import '../../styles/mobileOfflineBanner.css';

export default function MobileOfflineBanner() {
  const [offline, setOffline] = useState(
    () => typeof navigator !== 'undefined' && !navigator.onLine,
  );
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const refreshPending = () => {
      getPendingLogCount().then(setPending).catch(() => {});
    };
    const onOnline = () => {
      setOffline(false);
      refreshPending();
    };
    const onOffline = () => {
      setOffline(true);
      refreshPending();
    };

    refreshPending();
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (!offline && pending === 0) return null;

  return (
    <div className="mobile-offline-banner" role="status" aria-live="polite">
      <WifiOff size={14} aria-hidden />
      <span>
        {offline
          ? 'Offline — logs save locally and sync when you reconnect'
          : `${pending} log${pending === 1 ? '' : 's'} waiting to sync`}
      </span>
    </div>
  );
}
