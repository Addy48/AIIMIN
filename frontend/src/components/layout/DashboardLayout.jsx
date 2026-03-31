import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';

/**
 * DashboardLayout — Layout shell for all authenticated pages.
 * - Navbar fixed at top (edge-to-edge glass)
 * - Sidebar shown only on /systems/* routes
 * - Content area with max-width 1400px
 */
const DashboardLayout = ({ user }) => {
    const location = useLocation();
    const isSystemsRoute = location.pathname.startsWith('/systems');

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            backgroundImage: 'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(212,175,55,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(212,175,55,0.03) 0%, transparent 60%)',
            paddingTop: '80px',
            color: 'var(--text-1)',
        }}>
            <Navbar user={user} />

            <div style={{
                display: 'flex',
                maxWidth: 'var(--max-width)',
                margin: '0 auto',
                padding: '0 var(--container-px)',
            }}>
                {/* Sidebar — only on Systems pages */}
                {isSystemsRoute && (
                    <aside style={{ width: '72px', flexShrink: 0 }}>
                        <Sidebar />
                    </aside>
                )}

                {/* Main Content Area */}
                <main style={{
                    flex: 1,
                    minWidth: 0,
                    padding: isSystemsRoute ? '24px 0 120px 32px' : '24px 0 120px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--section-gap)',
                }}>
                    <Outlet />
                </main>
            </div>

            <style>{`
                html { scroll-behavior: smooth; }
                @media (max-width: 768px) {
                    aside { display: none !important; }
                    main { padding-left: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
