import React, { useState, useEffect } from 'react';
import { apiGet } from '../../utils/api';

const SystemHealth = () => {
  const [dbStatus, setDbStatus] = useState({ label: 'Database Sync', status: 'Checking...', color: '#F59E0B' });
  const [cacheStatus, setCacheStatus] = useState({ label: 'Local Cache', status: 'Checking...', color: '#F59E0B' });
  const [networkStatus, setNetworkStatus] = useState({ label: 'Network Uplink', status: 'Checking...', color: '#F59E0B' });
  
  useEffect(() => {
    let mounted = true;
    
    const runChecks = async () => {
      // Network Check
      if (navigator.onLine) {
        const start = performance.now();
        try {
          await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
          const latency = Math.round(performance.now() - start);
          if (mounted) setNetworkStatus({ label: 'Network Latency', status: `${latency}ms`, color: latency < 100 ? '#10B981' : '#F59E0B' });
        } catch (e) {
          if (mounted) setNetworkStatus({ label: 'Network Uplink', status: 'Connected', color: '#10B981' });
        }
      } else {
        if (mounted) setNetworkStatus({ label: 'Network Uplink', status: 'Offline', color: '#EF4444' });
      }

      // DB Check via authenticated API (Better Auth — not Supabase RLS)
      try {
        const start = performance.now();
        await apiGet('/health');
        const latency = Math.round(performance.now() - start);
        if (mounted) setDbStatus({ label: 'Database Latency', status: `${latency}ms`, color: latency < 300 ? '#10B981' : '#F59E0B' });
      } catch (e) {
        if (mounted) setDbStatus({ label: 'Database Sync', status: 'Broken', color: '#EF4444' });
      }
      
      // Cache Check
      try {
        let total = 0;
        for (let x in localStorage) {
          if (localStorage.hasOwnProperty(x)) {
            total += ((localStorage[x].length + x.length) * 2);
          }
        }
        const kb = (total / 1024).toFixed(1);
        if (mounted) setCacheStatus({ label: 'Local Storage', status: `${kb} KB used`, color: '#10B981' });
      } catch (e) {
        if (mounted) setCacheStatus({ label: 'Local Storage', status: 'Failed', color: '#EF4444' });
      }
    };
    
    runChecks();
    const int = setInterval(runChecks, 15000);
    
    const handleOnline = () => { if (mounted) setNetworkStatus({ label: 'Network Uplink', status: 'Connected', color: '#10B981' }) };
    const handleOffline = () => { if (mounted) setNetworkStatus({ label: 'Network Uplink', status: 'Offline', color: '#EF4444' }) };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      mounted = false;
      clearInterval(int);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const overallStatus = (dbStatus.color === '#10B981' && cacheStatus.color === '#10B981' && networkStatus.color === '#10B981') ? 'OPTIMAL' : 'DEGRADED';
  const overallColor = overallStatus === 'OPTIMAL' ? '#10B981' : '#EF4444';

  const items = [dbStatus, cacheStatus, networkStatus];

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '24px', padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '20px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient overlay */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
        background: `radial-gradient(circle at top right, ${overallColor}22, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          System Diagnostics
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: overallColor }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: overallColor, boxShadow: `0 0 12px ${overallColor}`, animation: overallStatus === 'OPTIMAL' ? 'pulse 2s infinite' : 'pulse-fast 1s infinite' }} />
          {overallStatus}
        </div>
      </div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i !== items.length - 1 ? '14px' : '0', borderBottom: i !== items.length - 1 ? '1px dashed var(--color-border)' : 'none' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)' }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: item.color, background: `${item.color}15`, padding: '4px 10px', borderRadius: '12px', border: `1px solid ${item.color}30` }}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse-fast {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SystemHealth;
