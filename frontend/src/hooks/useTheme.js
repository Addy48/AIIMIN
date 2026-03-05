import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('aiimin-theme') || 'dark';
    });

    useEffect(() => {
        const handleThemeChange = (e) => setTheme(e.detail);
        window.addEventListener('aiimin-theme-change', handleThemeChange);
        return () => window.removeEventListener('aiimin-theme-change', handleThemeChange);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        // Remove any previously injected inline background — CSS vars handle it.
        root.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');
        localStorage.setItem('aiimin-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        window.dispatchEvent(new CustomEvent('aiimin-theme-change', { detail: nextTheme }));
    };

    return { theme, toggleTheme };
}
