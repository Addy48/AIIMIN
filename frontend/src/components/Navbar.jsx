import React from 'react';
import useTheme from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ user, activeTab, onTabChange }) => {
    const { theme, toggleTheme } = useTheme();
    const { signOut } = useAuth();

    const tabs = ['Log', 'Streaks', 'Money', 'Calendar', 'Reports'];

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '52px',
            zIndex: 99999,
            backgroundColor: theme === 'light' ? '#faf7f2' : 'rgba(14,16,13,0.92)',
            borderBottom: theme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '52px', display: 'flex', alignItems: 'center', gap: '16px' }}>

                {/* LEFT */}
                <div style={{ fontSize: '17px', fontWeight: 900, background: 'linear-gradient(135deg, #c27814, #e05c2a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                    AIIMIN
                </div>

                {/* CENTER */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '4px' }} className="hidden sm:flex">
                    {tabs.map(tab => {
                        const tabKey = tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tabKey)}
                                className={`px-[14px] py-[5px] rounded-[var(--r-full)] text-[13px] font-medium cursor-pointer transition-all duration-[var(--t-fast)] ${activeTab === tabKey
                                    ? 'bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--border-accent)]'
                                    : 'text-[var(--text-2)] bg-transparent border border-transparent hover:text-[var(--text-1)] hover:bg-[var(--bg-elevated)]'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="ml-auto sm:ml-0">
                    <button
                        onClick={toggleTheme}
                        className="w-[32px] h-[32px] rounded-[var(--r-md)] bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] cursor-pointer flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[var(--accent-glow)] transition-all duration-[var(--t-fast)]"
                    >
                        {theme === 'dark' ? '☀' : '☾'}
                    </button>

                    <div className="w-[1px] h-[18px] bg-[var(--border)] hidden sm:block"></div>

                    <div className="relative group/profile z-50">
                        <button
                            className="w-[30px] h-[30px] rounded-[var(--r-full)] cursor-pointer transition-transform duration-[var(--t-fast)] group-hover/profile:scale-105 flex items-center justify-center border-none p-0 overflow-hidden text-[12px] font-bold text-white"
                            style={!user?.user_metadata?.avatar_url ? { background: 'linear-gradient(135deg, #c27814, #e05c2a)' } : {}}
                        >
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                userInitial
                            )}
                        </button>

                        <div className="absolute top-[100%] right-0 pt-3 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 min-w-[220px] pointer-events-none group-hover/profile:pointer-events-auto">
                            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-md)] p-4 shadow-[var(--shadow-md)] flex flex-col gap-2">
                                <div className="text-[14px] font-bold text-[var(--text-1)]">
                                    {user?.user_metadata?.full_name || 'AIIMIN User'}
                                </div>
                                <div className="text-[12px] text-[var(--text-3)] mb-1">
                                    {user?.email}
                                </div>
                                <div className="h-[1px] bg-[var(--border)] w-full"></div>
                                <div className="text-[11px] text-[var(--text-2)] mt-1 flex justify-between">
                                    <span>Joined</span>
                                    <span className="font-semibold text-[var(--text-1)]">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={signOut}
                        title="Sign Out"
                        className="px-[10px] py-[4px] rounded-[var(--r-sm)] text-[12px] text-[var(--text-3)] bg-transparent border-none cursor-pointer hover:text-[var(--danger)] hover:bg-[var(--danger-dim)] transition-all duration-[var(--t-fast)]"
                    >
                        Sign out
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
