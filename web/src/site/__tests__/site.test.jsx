import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WaitlistPage from '../WaitlistPage';
import AppPage from '../AppPage';
import BrandPage from '../BrandPage';
import { PLANS } from '../../marketing/plans';

const wrap = (ui) => render(<HelmetProvider><MemoryRouter>{ui}</MemoryRouter></HelmetProvider>);

beforeAll(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.scrollTo = () => {};
});
beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn((url) => Promise.resolve({
    ok: true, status: 200,
    json: () => Promise.resolve(String(url).endsWith('/count') ? { count: 3 } : { referral_code: 'MEERA1' }),
  }));
});

test('waitlist sends the email only, and nothing to analytics', async () => {
  window.gtag = jest.fn();
  wrap(<WaitlistPage />);
  const [input] = screen.getAllByLabelText('Email address');
  fireEvent.change(input, { target: { value: ' Meera@Example.com ' } });
  fireEvent.submit(input.closest('form'));
  await waitFor(() => expect(screen.getAllByText(/You are in/).length).toBeGreaterThan(0));
  const post = global.fetch.mock.calls.find(([, o]) => o?.method === 'POST');
  expect(JSON.parse(post[1].body)).toEqual({ email: 'meera@example.com', source: 'site_v4' });
  expect(window.gtag).not.toHaveBeenCalled();
});

test('a small waitlist count is not shown', async () => {
  wrap(<WaitlistPage />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  expect(screen.queryByText(/people waiting/)).toBeNull();
});

test('site prices are the app ladder', () => {
  wrap(<WaitlistPage />);
  PLANS.filter((p) => p.monthly).forEach((p) => {
    expect(screen.getByText(`₹${p.monthly.toLocaleString('en-IN')}`)).toBeInTheDocument();
    expect(screen.getByText(`or ₹${p.yearly.toLocaleString('en-IN')} a year`)).toBeInTheDocument();
  });
  expect(screen.getByText('Beta: free for now. No payment is taken.')).toBeInTheDocument();
});

test('/app links no APK until a checksum exists', () => {
  const { container } = wrap(<AppPage />);
  expect(container.querySelector('a[href$=".apk"]')).toBeNull();
  expect(screen.getByText('Get the beta')).toBeInTheDocument();
});

test('no public page uses retired claims', () => {
  [<WaitlistPage />, <AppPage />, <BrandPage />].forEach((ui) => {
    const { container, unmount } = wrap(ui);
    expect(container.textContent).not.toMatch(/SQLCipher|CRDT|OPERATOR|Life OS|v2\.0\.4/);
    unmount();
  });
});
