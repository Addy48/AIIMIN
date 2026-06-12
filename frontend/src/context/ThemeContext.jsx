import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(
        () => localStorage.getItem('aiimin-theme') || 'dark'
    );
    const [forcedTheme, setForcedTheme] = useState(null);

    const activeTheme = forcedTheme || theme;

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', activeTheme);

        // Remove all previous classes and add the active one
        root.classList.remove('dark', 'normal', 'notion', 'internet');
        root.classList.add(activeTheme);

        // CSS variables handle backgrounds — remove any inline overrides
        root.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');
    }, [activeTheme]);

    // Only save to localStorage when the ACTUAL user preference changes
    useEffect(() => {
        localStorage.setItem('aiimin-theme', theme);
    }, [theme]);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState(prev => {
            const themes = ['dark', 'normal', 'notion', 'internet'];
            const nextIdx = (themes.indexOf(prev) + 1) % themes.length;
            return themes[nextIdx];
        });
    }, []);

    const value = { theme: activeTheme, setTheme, setForcedTheme, toggleTheme, userTheme: theme };

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
