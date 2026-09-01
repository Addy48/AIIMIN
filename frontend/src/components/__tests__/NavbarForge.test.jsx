import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock framer-motion to avoid animation issues in JSDOM
jest.mock('framer-motion', () => {
  const React = require('react');
  const passThrough = (displayName) => {
    const Comp = React.forwardRef(({ children, ...rest }, ref) => {
      const {
        animate, initial, exit, variants, transition, whileHover, whileTap,
        whileInView, whileFocus, whileDrag, drag, dragConstraints,
        dragElastic, dragMomentum, layoutId, layout, onAnimationStart,
        onAnimationComplete, onUpdate, onDragStart, onDrag, onDragEnd,
        viewport, style, ...domProps
      } = rest;
      return React.createElement('div', { ref, style, ...domProps }, children);
    });
    Comp.displayName = displayName;
    return Comp;
  };
  return {
    __esModule: true,
    motion: new Proxy({}, {
      get: (_, prop) => passThrough(`motion.${prop}`),
    }),
    AnimatePresence: ({ children }) => children,
  };
});

jest.mock('../../hooks/useNotifications', () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    fetchAll: jest.fn(),
    markRead: jest.fn(),
    markAllRead: jest.fn(),
    dismiss: jest.fn(),
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useThemeContext: () => ({
    theme: 'drafting-table',
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    signOut: jest.fn(),
  }),
}));

jest.mock('../../hooks/useDeviceTier', () => ({
  useDeviceTier: () => ({
    isTablet: false,
  }),
}));

jest.mock('../notifications/NotificationBell', () => {
  const React = require('react');
  return function MockNotificationBell() {
    return React.createElement('div', { 'data-testid': 'notification-bell' });
  };
});

jest.mock('../brand/BrandLockup', () => {
  const React = require('react');
  return function MockBrandLockup() {
    return React.createElement('div', { 'data-testid': 'brand-lockup' });
  };
});

describe('Navbar Forge Group Integration', () => {
  const mockUser = { id: 'usr_test', full_name: 'Test Engineer', username: 'TESTER', role: 'user' };

  beforeEach(() => {
    localStorage.clear();
  });

  test('renders Forge link in primary strip when forge is pinned', () => {
    localStorage.setItem(
      'aiimin-nav-prefs',
      JSON.stringify({
        pinnedIds: ['overview', 'habits', 'forge'],
        activeIds: ['overview', 'habits', 'forge'],
        bottomNavEnabled: true,
      })
    );

    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Navbar user={mockUser} />
      </MemoryRouter>
    );

    const forgeLink = screen.getByRole('link', { name: /Forge/i });
    expect(forgeLink).toBeInTheDocument();
    expect(forgeLink).toHaveAttribute('href', '/lab');
  });

  test('opens flyout and displays Skill Lab and Sports Arena on hover/click when pinned', () => {
    localStorage.setItem(
      'aiimin-nav-prefs',
      JSON.stringify({
        pinnedIds: ['overview', 'habits', 'forge'],
        activeIds: ['overview', 'habits', 'forge'],
        bottomNavEnabled: true,
      })
    );

    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Navbar user={mockUser} />
      </MemoryRouter>
    );

    const forgeLink = screen.getByRole('link', { name: /Forge/i });
    fireEvent.mouseEnter(forgeLink);

    expect(screen.getByText('Skill Lab')).toBeInTheDocument();
    expect(screen.getByText('Sports Arena')).toBeInTheDocument();

    const labLink = screen.getByRole('menuitem', { name: /Skill Lab/i });
    const sportsLink = screen.getByRole('menuitem', { name: /Sports Arena/i });
    expect(labLink).toHaveAttribute('href', '/lab');
    expect(sportsLink).toHaveAttribute('href', '/sports');
  });

  test('renders Forge grouped heading and sublinks inside More menu when unpinned', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Navbar user={mockUser} />
      </MemoryRouter>
    );

    const moreBtn = screen.getByRole('button', { name: /More/i });
    fireEvent.click(moreBtn);

    expect(screen.getByText('Skill Lab')).toBeInTheDocument();
    expect(screen.getByText('Sports Arena')).toBeInTheDocument();
  });

  test('opens mobile drawer and displays Forge group with sublinks', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <Navbar user={mockUser} />
      </MemoryRouter>
    );

    const menuButton = screen.getByLabelText(/Toggle menu/i);
    fireEvent.click(menuButton);

    expect(screen.getAllByText('Skill Lab').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sports Arena').length).toBeGreaterThan(0);
  });
});
