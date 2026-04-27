import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

/**
 * DashboardLayout — Authenticated shell for all web pages.
 * Glass nav + ambient glow background. Content in glass cards.
 */
const DashboardLayout = ({ user }) => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--color-base)',
    paddingTop: 'var(--nav-height)',
    color: 'var(--color-text-1)',
  }}>
    <Navbar user={user} />
    <main style={{
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      padding: 'var(--space-5) var(--content-pad) 80px',
    }}>
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
