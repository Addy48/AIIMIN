import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  THEME_DARK,
  THEME_LIGHT,
  LIGHT_THEMES,
  DARK_THEMES,
  normalizeThemeId,
  isLightTheme,
} from '../constants/themes';

const ThemeContext = createContext(null);

const DEFAULT_PREFS = {
  currentTheme: THEME_DARK,
  defaultLightTheme: THEME_LIGHT,
  defaultDarkTheme: THEME_DARK,
};

export function ThemeProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem('aiimin-theme-prefs');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PREFS,
          ...parsed,
          currentTheme: normalizeThemeId(parsed.currentTheme),
          defaultLightTheme: normalizeThemeId(parsed.defaultLightTheme || THEME_LIGHT),
          defaultDarkTheme: normalizeThemeId(parsed.defaultDarkTheme || THEME_DARK),
        };
      }
      const legacyTheme = localStorage.getItem('aiimin-theme');
      if (legacyTheme) {
        const mappedTheme = normalizeThemeId(legacyTheme);
        const isLight = isLightTheme(mappedTheme);
        return {
          currentTheme: mappedTheme,
          defaultLightTheme: isLight ? mappedTheme : THEME_LIGHT,
          defaultDarkTheme: !isLight ? mappedTheme : THEME_DARK,
        };
      }
      return DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  const [forcedTheme, setForcedTheme] = useState(null);
  const activeTheme = normalizeThemeId(forcedTheme || prefs.currentTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', activeTheme);
    root.classList.remove(
      'dark', 'normal', 'notion', 'internet', 'nordic', 'studio', 'vercel', 'midnight',
      THEME_DARK, THEME_LIGHT,
    );
    root.classList.add(activeTheme);
    root.style.removeProperty('background-color');
    document.body.style.removeProperty('background-color');
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('aiimin-theme-prefs', JSON.stringify(prefs));
  }, [prefs]);

  const setTheme = useCallback((newTheme) => {
    const normalized = normalizeThemeId(newTheme);
    setPrefs((prev) => {
      const isLight = LIGHT_THEMES.includes(normalized);
      return {
        ...prev,
        currentTheme: normalized,
        ...(isLight ? { defaultLightTheme: normalized } : { defaultDarkTheme: normalized }),
      };
    });
  }, []);

  const setDefaultLightTheme = useCallback((newTheme) => {
    setPrefs((prev) => ({ ...prev, defaultLightTheme: normalizeThemeId(newTheme) }));
  }, []);

  const setDefaultDarkTheme = useCallback((newTheme) => {
    setPrefs((prev) => ({ ...prev, defaultDarkTheme: normalizeThemeId(newTheme) }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPrefs((prev) => {
      const isCurrentlyLight = LIGHT_THEMES.includes(normalizeThemeId(prev.currentTheme));
      return {
        ...prev,
        currentTheme: isCurrentlyLight ? prev.defaultDarkTheme : prev.defaultLightTheme,
      };
    });
  }, []);

  const value = {
    theme: activeTheme,
    userTheme: normalizeThemeId(prefs.currentTheme),
    defaultLightTheme: normalizeThemeId(prefs.defaultLightTheme),
    defaultDarkTheme: normalizeThemeId(prefs.defaultDarkTheme),
    setTheme,
    setDefaultLightTheme,
    setDefaultDarkTheme,
    setForcedTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return ctx;
}

export default ThemeContext;
