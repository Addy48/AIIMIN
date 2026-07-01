import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
 */
export function usePageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!gaId) return;
    initGtag(gaId);
  }, []);

  useEffect(() => {
    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!gaId || typeof window.gtag !== 'function') return;
    window.gtag('config', gaId, {
      page_path: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);
}

/** Fire custom GA4 events from feature actions. */
export function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
