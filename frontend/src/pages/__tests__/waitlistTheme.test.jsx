import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AppQueryProvider } from '../../context/QueryProvider';
import { AuthProvider } from '../../context/AuthContext';
import { AudioProvider } from '../../context/AudioContext';
import WaitlistLanding from '../WaitlistLanding';

jest.mock('../../lib/auth-client', () => ({
  authClient: {
    useSession: () => ({ data: null, isPending: false, refetch: jest.fn() }),
  },
  signIn: { social: jest.fn(), email: jest.fn() },
  signUp: { email: jest.fn() },
  signOut: jest.fn().mockResolvedValue({}),
}));

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

describe('Waitlist Theme Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ count: 128 }),
    });
  });

  test('toggles theme correctly between dark and light', async () => {
    render(
      <ThemeProvider>
        <AppQueryProvider>
          <AuthProvider>
            <AudioProvider>
              <MemoryRouter initialEntries={['/waitlist']}>
                <WaitlistLanding />
              </MemoryRouter>
            </AudioProvider>
          </AuthProvider>
        </AppQueryProvider>
      </ThemeProvider>
    );

    const initialTheme = document.documentElement.getAttribute('data-theme');
    const initialStorage = localStorage.getItem('aiimin-waitlist-theme');
    console.log('TEST INITIAL:', { initialTheme, initialStorage });

    expect(initialTheme).toBe('aiimin-dark');
    expect(initialStorage).toBe('aiimin-dark');

    const toggleBtns = screen.getAllByRole('button', { name: /switch to (light|dark) mode/i });
    expect(toggleBtns.length).toBeGreaterThanOrEqual(2); // Topbar and footer

    // 1st click -> switch to light mode
    await act(async () => {
      fireEvent.click(toggleBtns[0]);
    });

    const themeAfter1 = document.documentElement.getAttribute('data-theme');
    const storageAfter1 = localStorage.getItem('aiimin-waitlist-theme');
    expect(themeAfter1).toBe('aiimin-light');
    expect(storageAfter1).toBe('aiimin-light');

    // 2nd click via footer toggle -> switch back to dark mode
    await act(async () => {
      fireEvent.click(toggleBtns[toggleBtns.length - 1]);
    });

    const themeAfter2 = document.documentElement.getAttribute('data-theme');
    const storageAfter2 = localStorage.getItem('aiimin-waitlist-theme');
    expect(themeAfter2).toBe('aiimin-dark');
    expect(storageAfter2).toBe('aiimin-dark');
  });

  test('normalizes legacy "nordic" alias to "aiimin-light"', async () => {
    localStorage.setItem('aiimin-waitlist-theme', 'nordic');

    render(
      <ThemeProvider>
        <AppQueryProvider>
          <AuthProvider>
            <AudioProvider>
              <MemoryRouter initialEntries={['/waitlist']}>
                <WaitlistLanding />
              </MemoryRouter>
            </AudioProvider>
          </AuthProvider>
        </AppQueryProvider>
      </ThemeProvider>
    );

    const theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('aiimin-light');
    expect(localStorage.getItem('aiimin-waitlist-theme')).toBe('aiimin-light');
  });

  test('normalizes legacy "vercel" alias to "aiimin-dark"', async () => {
    localStorage.setItem('aiimin-waitlist-theme', 'vercel');

    render(
      <ThemeProvider>
        <AppQueryProvider>
          <AuthProvider>
            <AudioProvider>
              <MemoryRouter initialEntries={['/waitlist']}>
                <WaitlistLanding />
              </MemoryRouter>
            </AudioProvider>
          </AuthProvider>
        </AppQueryProvider>
      </ThemeProvider>
    );

    const theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('aiimin-dark');
    expect(localStorage.getItem('aiimin-waitlist-theme')).toBe('aiimin-dark');
  });
});
