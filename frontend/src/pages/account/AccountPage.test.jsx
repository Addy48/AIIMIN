import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountPage from './AccountPage';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

jest.mock('./sections/DesignSection', () => () => <div>Design Lab Content</div>);

const mockProfile = {
  user_id: 'usr_test123',
  email: 'test@example.com',
  full_name: 'Aaditya Upadhyay',
  username: 'TESTUSER',
  tagline: 'Building the Life OS',
  location: 'Mumbai, India',
  favorite_sports: ['Cricket'],
  favorite_teams: { Cricket: ['India'] },
  subscription_tier: 'pro',
  current_period_end: '2026-10-31T00:00:00Z',
  tier: 'pro',
};

jest.mock('../../lib/auth-client', () => ({
  authClient: {
    useSession: () => ({
      data: {
        session: { id: 'test-session', token: 'mock-token' },
        user: {
          id: 'usr_test123',
          email: 'test@example.com',
          name: 'Aaditya Upadhyay',
          username: 'TESTUSER',
          emailVerified: true,
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

jest.mock('../../utils/supabase', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({
            data: {
              total_xp: 1200,
              current_rank: 2,
              longest_streak: 5,
              clean_streak: 3,
            },
          }),
        }),
      }),
    }),
  },
}));

function renderWithProviders(ui, initialRoute = '/account') {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          {ui}
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe('AccountPage and Sub-sections', () => {
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
        json: () => Promise.resolve(mockProfile),
      });
    });
  });

  test('renders AccountPage on profile section without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=profile');
    await waitFor(() => {
      expect(screen.getByText(/Identity profile/i)).toBeInTheDocument();
    });
  });

  test('renders PersonalizationSection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=personalization');
    await waitFor(() => {
      expect(screen.getAllByText(/Personalization/i).length).toBeGreaterThan(0);
    });
  });

  test('renders NotificationsSection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=notifications');
    await waitFor(() => {
      expect(screen.getAllByText(/Notifications/i).length).toBeGreaterThan(0);
    });
  });

  test('renders PrivacySection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=privacy');
    await waitFor(() => {
      expect(screen.getAllByText(/Privacy & Security/i).length).toBeGreaterThan(0);
    });
  });

  test('renders SubscriptionSection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=subscription');
    await waitFor(() => {
      expect(screen.getByText(/Upgrade or switch any time/i)).toBeInTheDocument();
    });
  });

  test('renders DataSection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=data');
    await waitFor(() => {
      expect(screen.getAllByText(/Data & Export/i).length).toBeGreaterThan(0);
    });
  });

  test('renders LegalSection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=legal');
    await waitFor(() => {
      expect(screen.getAllByText(/Legal/i).length).toBeGreaterThan(0);
    });
  });

  test('renders DesignSection without crash', async () => {
    renderWithProviders(<AccountPage />, '/account?section=design');
    await waitFor(() => {
      expect(screen.getByText(/Design Lab Content/i)).toBeInTheDocument();
    });
  });
});
