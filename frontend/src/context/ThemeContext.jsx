import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const DEFAULT_PREFS = {
    currentTheme: 'vercel',
    defaultLightTheme: 'nordic',
    defaultDarkTheme: 'vercel'
};

const LIGHT_THEMES = ['nordic', 'studio'];
const DARK_THEMES = ['vercel', 'midnight'];

export function ThemeProvider({ children }) {
    const [prefs, setPrefs] = useState(() => {
        try {
            const stored = localStorage.getItem('aiimin-theme-prefs');
            if (stored) {
                return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
            }
            // Fallback for legacy key
            const legacyTheme = localStorage.getItem('aiimin-theme');
            if (legacyTheme) {
                const mappedTheme = legacyTheme === 'normal' ? 'nordic' : 
                                  legacyTheme === 'notion' ? 'studio' : 
                                  legacyTheme === 'internet' ? 'midnight' : 
                                  legacyTheme === 'dark' ? 'vercel' : 'vercel';
                                  
                const isLight = LIGHT_THEMES.includes(mappedTheme);
                return {
                    currentTheme: mappedTheme,
                    defaultLightTheme: isLight ? mappedTheme : 'nordic',
                    defaultDarkTheme: !isLight ? mappedTheme : 'vercel'
                };
            }
            return DEFAULT_PREFS;
        } catch (err) {
            return DEFAULT_PREFS;
        }
    });

    const [forcedTheme, setForcedTheme] = useState(null);

    const activeTheme = forcedTheme || prefs.currentTheme;

    // Apply the active theme to DOM instantly
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', activeTheme);

        // Remove all previous classes and add the active one
        root.classList.remove('dark', 'normal', 'notion', 'internet', 'nordic', 'studio', 'vercel', 'midnight');
        root.classList.add(activeTheme);

        // CSS variables handle backgrounds — remove any inline overrides
        root.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');
    }, [activeTheme]);

    // Persist to localStorage whenever preferences change
    useEffect(() => {
        localStorage.setItem('aiimin-theme-prefs', JSON.stringify(prefs));
    }, [prefs]);

    const setTheme = useCallback((newTheme) => {
        setPrefs(prev => {
            const isLight = LIGHT_THEMES.includes(newTheme);
            return {
                ...prev,
                currentTheme: newTheme,
                ...(isLight ? { defaultLightTheme: newTheme } : { defaultDarkTheme: newTheme })
            };
        });
    }, []);

    const setDefaultLightTheme = useCallback((newTheme) => {
        setPrefs(prev => ({ ...prev, defaultLightTheme: newTheme }));
    }, []);

    const setDefaultDarkTheme = useCallback((newTheme) => {
        setPrefs(prev => ({ ...prev, defaultDarkTheme: newTheme }));
    }, []);

    const toggleTheme = useCallback(() => {
        setPrefs(prev => {
            const isCurrentlyLight = LIGHT_THEMES.includes(prev.currentTheme);
            return {
                ...prev,
                currentTheme: isCurrentlyLight ? prev.defaultDarkTheme : prev.defaultLightTheme
            };
        });
    }, []);

    const value = { 
        theme: activeTheme, 
        userTheme: prefs.currentTheme,
        defaultLightTheme: prefs.defaultLightTheme,
        defaultDarkTheme: prefs.defaultDarkTheme,
        setTheme, 
        setDefaultLightTheme,
        setDefaultDarkTheme,
        setForcedTheme, 
        toggleTheme 
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
