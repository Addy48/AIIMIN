import React, { useState } from 'react';
import useTheme from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('Log');

    const tabs = ['Log', 'Streaks', 'Money', 'Calendar', 'Reports'];

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <nav className={`fixed top-0 left-0 w-full h-[56px] z-50 px-6 flex flex-row items-center justify-between border-b backdrop-blur-md ${theme === 'dark' ? 'bg-[rgba(10,10,15,0.8)] border-[var(--border)]' : 'bg-[rgba(255,255,255,0.8)] border-gray-200'}`}>
            <div className="flex items-center gap-6 md:gap-10">
                <div className="text-[var(--accent)] font-bold text-lg tracking-tight">
                    AIIMIN
                </div>
                <div className="hidden md:flex items-center gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === tab
                                    ? 'bg-[var(--accent-dim)] text-[var(--accent)]'
                                    : 'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-card-hover)]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className={`text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] border hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer ${theme === 'dark' ? 'border-[var(--border)] text-[var(--text-2)] bg-[var(--bg-card)]' : 'border-gray-300 text-gray-600 bg-white'}`}
                >
                    {theme === 'dark' ? '☀ Light' : '☾ Dark'}
                </button>
                <button
                    onClick={signOut}
                    title="Sign Out"
                    className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm shadow-sm hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                    {userInitial}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
