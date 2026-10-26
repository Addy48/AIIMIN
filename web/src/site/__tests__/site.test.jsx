import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WaitlistPage from '../WaitlistPage';
import AppPage from '../AppPage';
import BrandPage from '../BrandPage';
import { PLANS, FOUNDING } from '../../marketing/plans';
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
    expect(screen.getAllByText(`₹${p.monthly.toLocaleString('en-IN')}`).length).toBeGreaterThan(0);
    expect(screen.getByText(`or ₹${p.yearly.toLocaleString('en-IN')} a year`)).toBeInTheDocument();
  });
});

test('plans lead with value: yearly toggle, founding half price for the first 251, and no "free" pitch', () => {
  const { container } = wrap(<WaitlistPage />);
  expect(FOUNDING.seats).toBe(251);
  expect(screen.getAllByText('₹49.50').length).toBeGreaterThan(0); // Pro, founding, monthly
  fireEvent.click(screen.getByRole('button', { name: /Yearly/ }));
  expect(screen.getAllByText('₹899').length).toBeGreaterThan(0);
  expect(screen.getAllByText('₹449.50').length).toBeGreaterThan(0); // Pro, founding, yearly
  expect(container.textContent).toContain('first 251 testers');
  expect(container.textContent).not.toMatch(/Free during the beta|free beta|Is it really free|No card, no catch/i);
});

test('after joining, a founding signup sees its seat number', async () => {
  global.fetch = jest.fn((url) => Promise.resolve({
    ok: true, status: 200,
    json: () => Promise.resolve(String(url).endsWith('/count') ? { count: 3 } : { referral_code: 'MEERA1', position: 42, founding: true, founding_seats: 251 }),
  }));
  wrap(<WaitlistPage />);
  const [input] = screen.getAllByLabelText('Email address');
  fireEvent.change(input, { target: { value: 'meera@example.com' } });
  fireEvent.submit(input.closest('form'));
  await waitFor(() => expect(screen.getAllByText('#42').length).toBeGreaterThan(0));
  expect(screen.getAllByText(/of 251/).length).toBeGreaterThan(0);
});

test('the hero walks one day through four real screens', () => {
  const { container } = wrap(<WaitlistPage />);
  const imgs = container.querySelectorAll('.s-dayhero .s-phone__screen img');
  expect(imgs).toHaveLength(4);
  const rail = screen.getByRole('group', { name: 'One sample day' });
  fireEvent.click(rail.querySelectorAll('button')[3]);
  expect(container.querySelector('.s-dayhero').dataset.phase).toBe('night');
  expect(imgs[3].getAttribute('alt')).toMatch(/night/);
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
