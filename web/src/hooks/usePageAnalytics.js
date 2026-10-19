import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hasAnalyticsConsent } from '../utils/consent';

function initGtag(gaId) {
  if (typeof window.gtag === 'function') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
}

/**
 * GA4 page_view on route change (LC-10).
 * No-op until the visitor has granted analytics consent.
 */
export function usePageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!gaId || !hasAnalyticsConsent()) return;
    initGtag(gaId);
  }, []);

  useEffect(() => {
    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!gaId || !hasAnalyticsConsent() || typeof window.gtag !== 'function') return;
    window.gtag('config', gaId, {
      page_path: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);
}

/** Fire custom GA4 events from feature actions. Silently ignored without consent. */
export function trackEvent(name, params = {}) {
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
