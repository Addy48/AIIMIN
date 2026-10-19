import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { AudioProvider } from '../../context/AudioContext';
import { AppQueryProvider } from '../../context/QueryProvider';

// Pages
import Overview from '../Overview';
import Settings from '../Settings';
import WaitlistLanding from '../WaitlistLanding';
import Login from '../Login';
import Brand from '../Brand';
import AndroidApp from '../AndroidApp';
import Journal from '../Journal';
import Discipline from '../Discipline';
import FocusRoom from '../FocusRoom';
import Goals from '../Goals';
import Habits from '../Habits';
import Identity from '../Identity';
import Insights from '../Insights';
import LabFullPage from '../LabFullPage';
import Notes from '../Notes';
import Placements from '../Placements';
import Reports from '../Reports';
import Sports from '../Sports';
import Finance from '../Finance';
import CalendarPage from '../CalendarPage';
import Family from '../Family';
import SeedData from '../SeedData';

// Legal pages
import About from '../legal/About';
import AcceptableUse from '../legal/AcceptableUse';
import AiDisclosure from '../legal/AiDisclosure';
import Contact from '../legal/Contact';
import Cookies from '../legal/Cookies';
import DataDeletion from '../legal/DataDeletion';
import Grievance from '../legal/Grievance';
import LegalHub from '../legal/LegalHub';
import Privacy from '../legal/Privacy';
import Refunds from '../legal/Refunds';
import Security from '../legal/Security';
import Subprocessors from '../legal/Subprocessors';
import Terms from '../legal/Terms';

jest.mock('../../lib/auth-client', () => ({
  authClient: {
    useSession: () => ({
      data: {
        session: { id: 'test-session', token: 'mock-token' },
        user: {
          id: 'usr_test123',
          email: 'test@example.com',
          name: 'Test User',
          username: 'TESTUSER',
          emailVerified: true,
          provider: 'google',
        },
      },
      isPending: false,
      refetch: jest.fn(),
    }),
    changePassword: jest.fn().mockResolvedValue({}),
    changeEmail: jest.fn().mockResolvedValue({}),
  },
  changePassword: jest.fn().mockResolvedValue({}),
  changeEmail: jest.fn().mockResolvedValue({}),
  signIn: { social: jest.fn(), email: jest.fn() },
  signUp: { email: jest.fn() },
  signOut: jest.fn().mockResolvedValue({}),
}));

// Mock framer-motion to avoid initPrefersReducedMotion calling window.matchMedia
// in jsdom where matchMedia mock returns undefined from framer-motion's internal scope.
// Pages using motion components still render — just without animation.
jest.mock('framer-motion', () => {
  const React = require('react');
  const passThrough = (displayName) => {
    const Comp = React.forwardRef(({ children, ...rest }, ref) => {
      // Strip motion-specific props to avoid unknown DOM attribute warnings
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
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn(), set: jest.fn() }),
    useMotionValue: (initial) => ({ get: () => initial, set: jest.fn(), onChange: jest.fn() }),
    useTransform: () => ({ get: jest.fn() }),
    useSpring: (val) => val,
    useInView: () => false,
    useScroll: () => ({ scrollY: { get: jest.fn() }, scrollYProgress: { get: jest.fn() } }),
    useReducedMotion: () => false,
    useMotionTemplate: jest.fn(),
    motionValue: (initial) => ({ get: () => initial, set: jest.fn() }),
    animate: jest.fn(),
    stagger: jest.fn(),
    m: new Proxy({}, { get: (_, prop) => passThrough(`m.${prop}`) }),
    LazyMotion: ({ children }) => children,
    domAnimation: {},
    domMax: {},
  };
});

jest.mock('../../utils/pdfUtils', () => ({
  extractTextFromPDF: jest.fn().mockResolvedValue(''),
}));

jest.mock('@react-pdf/renderer', () => ({
  Document: () => null,
  Page: () => null,
  Text: () => null,
  View: () => null,
  StyleSheet: { create: () => ({}) },
  pdf: () => ({ toBlob: jest.fn() }),
}));

jest.mock('../../utils/supabase', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [] }),
          maybeSingle: () => Promise.resolve({
            data: {
              total_xp: 1200,
              current_rank: 2,
              longest_streak: 5,
              clean_streak: 3,
            },
          }),
        }),
        order: () => Promise.resolve({ data: [] }),
        single: () => Promise.resolve({ data: {} }),
      }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    }),
  },
}));

function renderWithAllProviders(ui, initialRoute = '/') {
  return render(
    <ThemeProvider>
      <AppQueryProvider>
        <AuthProvider>
          <AudioProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
              {ui}
            </MemoryRouter>
          </AudioProvider>
        </AuthProvider>
      </AppQueryProvider>
    </ThemeProvider>
  );
}

describe('All Pages Deep Rendering Test Suite', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      const urlStr = String(url);
      if (urlStr.includes('billing/status')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ tier: 'pro', current_period_end: '2026-10-31T00:00:00Z' }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          user_id: 'usr_test123',
          email: 'test@example.com',
          full_name: 'Test User',
          username: 'TESTUSER',
          tagline: 'Life OS User',
          location: 'Mumbai, India',
          subscription_tier: 'pro',
        }),
      });
    });
  });

  test('renders Overview without crash', () => {
    expect(() => renderWithAllProviders(<Overview />)).not.toThrow();
  });

  test('renders Settings without crash', () => {
    expect(() => renderWithAllProviders(<Settings />)).not.toThrow();
  });

  test('renders WaitlistLanding without crash', () => {
    expect(() => renderWithAllProviders(<WaitlistLanding />)).not.toThrow();
  });

  test('renders Login without crash', () => {
    expect(() => renderWithAllProviders(<Login />)).not.toThrow();
  });

  test('renders Brand page without crash', () => {
    expect(() => renderWithAllProviders(<Brand />)).not.toThrow();
  });

  test('renders AndroidApp page without crash', () => {
    expect(() => renderWithAllProviders(<AndroidApp />)).not.toThrow();
  });

  test('renders Journal page without crash', () => {
    expect(() => renderWithAllProviders(<Journal />)).not.toThrow();
  });

  test('renders Discipline page without crash', () => {
    expect(() => renderWithAllProviders(<Discipline />)).not.toThrow();
  });

  test('renders FocusRoom page without crash', () => {
    expect(() => renderWithAllProviders(<FocusRoom />)).not.toThrow();
  });

  test('renders Goals page without crash', () => {
    expect(() => renderWithAllProviders(<Goals />)).not.toThrow();
  });

  test('renders Habits page without crash', () => {
    expect(() => renderWithAllProviders(<Habits />)).not.toThrow();
  });

  test('renders Identity page without crash', () => {
    expect(() => renderWithAllProviders(<Identity />)).not.toThrow();
  });

  test('renders Insights page without crash', () => {
    expect(() => renderWithAllProviders(<Insights />)).not.toThrow();
  });

  test('renders LabFullPage without crash', () => {
    expect(() => renderWithAllProviders(<LabFullPage />)).not.toThrow();
  });

  test('renders Notes page without crash', () => {
    expect(() => renderWithAllProviders(<Notes />)).not.toThrow();
  });

  test('renders Placements page without crash', () => {
    expect(() => renderWithAllProviders(<Placements />)).not.toThrow();
  });

  test('renders Reports page without crash', () => {
    expect(() => renderWithAllProviders(<Reports />)).not.toThrow();
  });

  test('renders Sports page without crash', () => {
    expect(() => renderWithAllProviders(<Sports />)).not.toThrow();
  });

  test('renders Finance page without crash', () => {
    expect(() => renderWithAllProviders(<Finance />)).not.toThrow();
  });

  test('renders CalendarPage without crash', () => {
    expect(() => renderWithAllProviders(<CalendarPage />)).not.toThrow();
  });

  test('renders Family page without crash', () => {
    expect(() => renderWithAllProviders(<Family />)).not.toThrow();
  });

  test('renders SeedData page without crash', () => {
    expect(() => renderWithAllProviders(<SeedData />)).not.toThrow();
  });

  test('renders all Legal pages without crash', () => {
    expect(() => renderWithAllProviders(<About />)).not.toThrow();
    expect(() => renderWithAllProviders(<AcceptableUse />)).not.toThrow();
    expect(() => renderWithAllProviders(<AiDisclosure />)).not.toThrow();
    expect(() => renderWithAllProviders(<Contact />)).not.toThrow();
    expect(() => renderWithAllProviders(<Cookies />)).not.toThrow();
    expect(() => renderWithAllProviders(<DataDeletion />)).not.toThrow();
    expect(() => renderWithAllProviders(<Grievance />)).not.toThrow();
    expect(() => renderWithAllProviders(<LegalHub />)).not.toThrow();
    expect(() => renderWithAllProviders(<Privacy />)).not.toThrow();
    expect(() => renderWithAllProviders(<Refunds />)).not.toThrow();
    expect(() => renderWithAllProviders(<Security />)).not.toThrow();
    expect(() => renderWithAllProviders(<Subprocessors />)).not.toThrow();
    expect(() => renderWithAllProviders(<Terms />)).not.toThrow();
  });
});
