import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Zap, Gauge, User, Smartphone } from 'lucide-react';
import { isCapacitorNative } from '../../utils/capacitorEnv';
import '../../styles/mobileBottomNav.css';

const APP_CTA_KEY = 'app_cta_seen';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.aiimin.app';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.navigator.standalone === true
    || window.matchMedia('(display-mode: standalone)').matches
  );
}

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [hideAppTab, setHideAppTab] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isStandalone() || isCapacitorNative() || localStorage.getItem(APP_CTA_KEY) === '1';
  });

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      window._deferredInstallPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleAppTab = useCallback(async () => {
    if (installPrompt || window._deferredInstallPrompt) {
      const prompt = installPrompt || window._deferredInstallPrompt;
      await prompt.prompt();
      await prompt.userChoice;
      setInstallPrompt(null);
      window._deferredInstallPrompt = null;
      localStorage.setItem(APP_CTA_KEY, '1');
      setHideAppTab(true);
      return;
    }
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    localStorage.setItem(APP_CTA_KEY, '1');
    setHideAppTab(true);
  }, [installPrompt]);

  const tabs = [
    {
      id: 'capture',
      label: 'Today',
      icon: Zap,
      to: '/m',
      active: location.pathname === '/m' || location.pathname === '/m/',
      action: () => navigate('/m'),
    },
    {
      id: 'score',
      label: 'Score',
      icon: Gauge,
      to: '/m/score',
      active: location.pathname === '/m/score',
      action: () => navigate('/m/score'),
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      to: '/m/account',
      active: location.pathname.startsWith('/m/account'),
      action: () => navigate('/m/account'),
    },
  ];

  if (!hideAppTab) {
    tabs.push({
      id: 'app',
      label: 'Get App',
      icon: Smartphone,
      to: null,
      active: false,
      action: handleAppTab,
    });
  }

  const tabWidth = tabs.length === 3 ? '33.33%' : '25%';

  return (
    <nav className="mobile-bottom-nav" aria-label="Phone navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            className={`mobile-bottom-nav__tab${tab.active ? ' mobile-bottom-nav__tab--active' : ''}`}
            style={{ width: tabWidth }}
            aria-label={tab.label}
            aria-current={tab.active ? 'page' : undefined}
            onClick={tab.action}
          >
            <Icon size={22} aria-hidden />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
