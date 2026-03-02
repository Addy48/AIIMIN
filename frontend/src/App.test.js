import { render, screen, act } from '@testing-library/react';
import App from './App';
import supabase from './utils/supabase';

// Mock Supabase client
jest.mock('./utils/supabase', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn()
    }
  }
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default onAuthStateChange mock that just returns an unsubscribe function
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    });
  });

  test('shows loading screen initially', async () => {
    // Return a promise that doesn't resolve immediately
    supabase.auth.getSession.mockReturnValue(new Promise(() => { }));

    render(<App />);
    expect(screen.getByText(/Loading AIIMIN/i)).toBeInTheDocument();
  });

  test('renders login screen when unauthenticated', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await act(async () => {
      render(<App />);
    });

    // Assert some login specific text exists
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  test('renders dashboard when authenticated', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'test-user-id', email: 'test@example.com' } } }
    });

    await act(async () => {
      render(<App />);
    });

    // Assert dashboard specific text exists
    expect(screen.getByText(/Here is your daily tracker/i)).toBeInTheDocument();
  });
});
