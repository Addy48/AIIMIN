import { useEffect, useState } from 'react';
import { regionForCountry, regionFromTimeZone } from '../marketing/plans';

const KEY = 'aiimin.region';

/**
 * The visitor's price region. Starts with a time-zone guess (no network), then asks /api/geo, which reads the
 * country from the visitor's connection, so a VPN changes it. A region the visitor picks by hand wins for the visit.
 */
export default function useRegion() {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (saved?.region) return saved;
    } catch { /* storage blocked */ }
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* old browser */ }
    return { region: regionFromTimeZone(tz), country: null, source: 'timezone' };
  });

  useEffect(() => {
    if (state.source !== 'timezone' || typeof fetch !== 'function') return undefined;
    let live = true;
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = setTimeout(() => ctl?.abort(), 3000);
    fetch('/api/geo', { signal: ctl?.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!live || !d?.country) return;
        const next = { region: regionForCountry(d.country), country: d.country, source: 'network' };
        setState(next);
        try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { live = false; clearTimeout(timer); ctl?.abort(); };
  }, [state.source]);

  const choose = (region) => {
    const next = { region, country: state.country, source: 'chosen' };
    setState(next);
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
  };
  return { ...state, choose };
}
