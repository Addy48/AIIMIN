import { Capacitor } from '@capacitor/core';
import { isDarkTheme, THEME_DARK, THEME_LIGHT } from '../constants/themes';

export function isCapacitorNative() {
  return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
}

export function isCapacitorAndroid() {
  return isCapacitorNative() && Capacitor.getPlatform() === 'android';
}

/** System light/dark for first native launch + status bar. */
export function getSystemThemeId() {
  if (typeof window === 'undefined' || !window.matchMedia) return THEME_DARK;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_DARK
    : THEME_LIGHT;
}

export async function syncCapacitorChrome(themeId) {
  if (!isCapacitorNative()) return;
  const dark = isDarkTheme(themeId);
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Style.Dark = light icons (for dark bg); Style.Light = dark icons (for light bg)
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({
      color: dark ? '#1A1A1A' : '#EDE4D3',
    });
  } catch {
    // Status bar plugin optional at runtime
  }
}

let backNavigate = null;

/** Register React Router navigate for hardware back (Capacitor Android). */
export function setCapacitorBackNavigate(navigate) {
  backNavigate = navigate;
}

export async function initCapacitorShell() {
  if (!isCapacitorNative()) return;

  document.documentElement.dataset.capacitor = 'true';
  document.documentElement.dataset.deviceTier = 'phone';

  await syncCapacitorChrome(getSystemThemeId());

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    // Splash hide best-effort
  }

  try {
    const { App } = await import('@capacitor/app');
    await App.addListener('backButton', () => {
      const path = window.location.pathname;
      if (path === '/m' || path === '/m/') {
        App.exitApp();
        return;
      }
      if (path.startsWith('/m/') && backNavigate) {
        backNavigate('/m');
        return;
      }
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      App.exitApp();
    });
  } catch {
    // Back button optional
  }
}
