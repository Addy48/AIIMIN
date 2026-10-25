import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WaitlistPage from '../WaitlistPage';
import AppPage from '../AppPage';
import BrandPage from '../BrandPage';
import { PLANS } from '../../marketing/plans';
import { isPublicSurfacePath, shouldShowWaitlistAccessFallback } from '../publicRoutes';

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

test('waitlist mobile previews form a swipe gallery and keep Raahi clear of the hero phone', () => {
  const { container } = wrap(<WaitlistPage />);
  expect(container.querySelectorAll('.s-moment-gallery .s-device')).toHaveLength(3);
  expect(screen.getByText('Swipe to see 3 sample screens')).toBeInTheDocument();
  expect(container.querySelector('.s-hero__stage .s-hero__raahi')).toBeNull();
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
  expect(screen.getAllByText('Get early access').length).toBeGreaterThanOrEqual(2);
});

test('/app labels the sample screen gallery as swipeable', () => {
  wrap(<AppPage />);
  expect(screen.getByText('Swipe to see all four screens')).toBeInTheDocument();
});

test('public routes do not flash the waitlist access fallback while access state loads', () => {
  ['/','/waitlist','/app','/brand','/privacy'].forEach((path) => {
    expect(isPublicSurfacePath(path)).toBe(true);
    expect(shouldShowWaitlistAccessFallback(path, true, true)).toBe(false);
  });
  expect(shouldShowWaitlistAccessFallback('/settings', true, true)).toBe(true);
});

test('no public page uses retired claims', () => {
  [<WaitlistPage />, <AppPage />, <BrandPage />].forEach((ui) => {
    const { container, unmount } = wrap(ui);
    expect(container.textContent).not.toMatch(/SQLCipher|CRDT|OPERATOR|Life OS|v2\.0\.4/);
    unmount();
  });
});

test('/brand leads with Raahi, keeps a press kit and quotes real prices', () => {
  const { container } = wrap(<BrandPage />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Walk your day with Raahi.');
  expect(container.querySelector('a[download][href="/logo-symbol.svg"]')).not.toBeNull();
  expect(container.querySelector('a[download][href="/AIIMIN_logo_dark.svg"]')).not.toBeNull();
  expect(screen.getByRole('button', { name: /Copy short description/ })).toBeInTheDocument();
  expect(container.textContent).toContain(`₹${PLANS.find((p) => p.id === 'plus').monthly} a month`);
  expect(container.querySelectorAll('main main')).toHaveLength(0);
});

test('when the sign-up list is unreachable, the form offers email instead', async () => {
  const before = global.fetch;
  global.fetch = jest.fn(() => Promise.reject(new TypeError('Failed to fetch')));
  try {
    localStorage.clear();
    const { container } = wrap(<WaitlistPage />);
    const form = container.querySelector('#join');
    fireEvent.change(form.querySelector('input'), { target: { value: 'meera@example.com' } });
    fireEvent.submit(form);
    await waitFor(() => expect(form.querySelector('[role=alert] a[href^="mailto:support@aiimin.in"]')).not.toBeNull());
  } finally {
    global.fetch = before;
  }
});
