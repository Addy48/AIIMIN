import { Capacitor } from '@capacitor/core';

/**
 * Device tier for Life OS shell.
 * phone  → /m capture-only (native app coming)
 * tablet → full OS, touch-first (iPad incl. Split View)
 * desktop → full OS masthead
 *
 * iPad always tablet (even Split View <768). Phone UA always phone.
 */
export function detectDeviceTier() {
  if (typeof window === 'undefined') return 'desktop';

  if (Capacitor.isNativePlatform()) return 'phone';

  const ua = navigator.userAgent || '';
  const isIPad =
    /iPad/i.test(ua)
    || (navigator.platform === 'MacIntel' && Number(navigator.maxTouchPoints || 0) > 1);
  const isPhoneUA =
    /iPhone|iPod|Windows Phone|webOS|BlackBerry|Opera Mini/i.test(ua)
    || (/Android/i.test(ua) && /Mobile/i.test(ua));

  const w = window.innerWidth || 0;

  if (isIPad) return 'tablet';
  if (isPhoneUA) return 'phone';
  if (w < 768) return 'phone';
  if (w < 1100) return 'tablet';
  return 'desktop';
}

export function applyDeviceTierAttr(tier = detectDeviceTier()) {
  if (typeof document === 'undefined') return tier;
  document.documentElement.dataset.deviceTier = tier;
  return tier;
}

export function useDeviceTier() {
  const [tier, setTier] = useState(() => detectDeviceTier());

  useEffect(() => {
    const sync = () => setTier(applyDeviceTierAttr());
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  return {
    tier,
    isPhone: tier === 'phone',
    isTablet: tier === 'tablet',
    isDesktop: tier === 'desktop',
  };
}

export default useDeviceTier;
