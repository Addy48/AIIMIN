import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileLiteAccount from '../mobile/MobileLiteAccount';

const mockSignOut = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'usr_abc12345xyz', email: 'tester@aiimin.in', full_name: 'Aaditya Dev' },
    signOut: mockSignOut,
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useThemeContext: () => ({
    theme: 'aiimin-dark',
    toggleTheme: mockToggleTheme,
  }),
}));

jest.mock('../../utils/api', () => ({
  apiGet: jest.fn((path) => {
    if (path === '/account/user-profile') {
      return Promise.resolve({
        full_name: 'Aaditya Dev',
        username: 'AADITYA1',
        tagline: 'Deep sovereign execution without bloat.',
      });
    }
    if (path === '/billing/status') {
      return Promise.resolve({ tier: 'explore', current_period_end: null });
    }
    return Promise.resolve({});
  }),
}));

jest.mock('../../utils/supabase', () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve({
          data: { total_xp: 4200, current_rank: 'Initiate' },
        }),
      }),
    }),
  }),
}));

import { apiGet } from '../../utils/api';

describe('MobileLiteAccount Drafting Table Console', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiGet.mockImplementation((path) => {
      if (path === '/account/user-profile') {
        return Promise.resolve({
          full_name: 'Aaditya Dev',
          username: 'AADITYA1',
          tagline: 'Deep sovereign execution without bloat.',
        });
      }
      if (path === '/billing/status') {
        return Promise.resolve({ tier: 'explore', current_period_end: null });
      }
      return Promise.resolve({});
    });
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders user identity, monogram avatar, and live enclave status', async () => {
    render(
      <MemoryRouter>
        <MobileLiteAccount />
      </MemoryRouter>
    );

    expect(screen.getByText('ENCLAVE // ONLINE')).toBeInTheDocument();
    expect(screen.getByText('Aaditya Dev')).toBeInTheDocument();
  });

  it('renders 1-tap OS-ID hardware plate and copies OS-ID to clipboard', async () => {
    render(
      <MemoryRouter>
        <MobileLiteAccount />
      </MemoryRouter>
    );

    const osIdEl = await screen.findByText('AADITYA1');
    expect(osIdEl).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /copy hardware os-id/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('AADITYA1');
    expect(await screen.findByText(/copied ✓/i)).toBeInTheDocument();
  });

  it('renders Native Android Companion APK console with direct binary download', async () => {
    render(
      <MemoryRouter>
        <MobileLiteAccount />
      </MemoryRouter>
    );

    expect(screen.getByText('Android Companion V2')).toBeInTheDocument();
    expect(screen.getByText('44.2 MB · 120Hz')).toBeInTheDocument();

    const downloadLink = screen.getByRole('link', { name: /download latest apk \(44\.2 mb\)/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', '/aiimin-v2-debug.apk');
    expect(downloadLink).toHaveAttribute('download', 'aiimin-v2-debug.apk');

    expect(screen.getByText('StrongBox TEE')).toBeInTheDocument();
    expect(screen.getByText('120Hz Compose')).toBeInTheDocument();
    expect(screen.getByText('Offline SQLite')).toBeInTheDocument();
    expect(screen.getByText('Zero Telemetry')).toBeInTheDocument();
  });

  it('renders ADB sideload box and allows copying ADB install command', async () => {
    render(
      <MemoryRouter>
        <MobileLiteAccount />
      </MemoryRouter>
    );

    expect(screen.getByText('adb install -r aiimin-v2-debug.apk')).toBeInTheDocument();
    const adbCopyBtn = screen.getByRole('button', { name: /copy adb install command/i });
    fireEvent.click(adbCopyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('adb install -r aiimin-v2-debug.apk');
  });

  it('renders Life Arc trajectory quotation from user profile', async () => {
    render(
      <MemoryRouter>
        <MobileLiteAccount />
      </MemoryRouter>
    );

    const arcText = await screen.findByText(/deep sovereign execution without bloat/i);
    expect(arcText).toBeInTheDocument();
  });

  it('renders tactile action buttons including theme toggle and 2-step sign out', async () => {
    render(
      <MemoryRouter>
        <MobileLiteAccount />
      </MemoryRouter>
    );

    const themeBtn = screen.getByRole('button', { name: /interface theme/i });
    fireEvent.click(themeBtn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    const signOutBtn = screen.getByRole('button', { name: /sign out of session/i });
    fireEvent.click(signOutBtn);
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(screen.getByText(/confirm sign out/i)).toBeInTheDocument();

    fireEvent.click(signOutBtn);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
