import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('aiimin-theme') || 'dark'
    );

    // Apply theme to DOM whenever it changes
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // CSS variables handle backgrounds — remove any inline overrides
        root.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');

        localStorage.setItem('aiimin-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    const value = { theme, setTheme, toggleTheme };

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
