import React from 'react';
import useTheme from '../hooks/useTheme';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className={`fixed top-0 left-0 w-full h-[56px] z-50 px-6 flex flex-row items-center justify-between border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="text-accent font-bold text-lg">
                AIIMIN
            </div>
            <button
                onClick={toggleTheme}
                className={`text-sm px-3 py-1 rounded-md border border-gray-600 hover:border-accent hover:text-accent transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
                {theme === 'dark' ? '☀ Light' : '☾ Dark'}
            </button>
        </nav>
    );
};

export default Navbar;
