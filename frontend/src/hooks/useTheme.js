import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('aiimin-theme') || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.backgroundColor = '#0e100d';
            document.body.style.backgroundColor = '#0e100d';
        } else {
            root.classList.remove('dark');
            root.style.backgroundColor = '#f5f0e8';
            document.body.style.backgroundColor = '#f5f0e8';
        }
        localStorage.setItem('aiimin-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return { theme, toggleTheme };
}
