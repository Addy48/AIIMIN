import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConsentBanner from './ConsentBanner';
import { readConsent } from '../../utils/consent';
import { releasePopup, requestPopup, resetPopupsForTests } from '../../utils/popupQueue';

const renderAt = (path = '/waitlist') => render(
  <MemoryRouter initialEntries={[path]}>
    <ConsentBanner />
  </MemoryRouter>,
);

beforeEach(() => {
  process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST';
  localStorage.clear();
  resetPopupsForTests();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  delete process.env.REACT_APP_GA_MEASUREMENT_ID;
});

test('does not appear on page load', () => {
  renderAt();
  expect(screen.queryByText(/anonymous usage stats/i)).toBeNull();
});

test('appears once the visitor has been reading for a while', () => {
  renderAt();
  act(() => { jest.advanceTimersByTime(12000); });
  expect(screen.getByText(/anonymous usage stats/i)).toBeInTheDocument();
});

test('appears early when the visitor scrolls a page that scrolls inside its own container', () => {
  renderAt();
  const scroller = document.createElement('div');
  document.body.appendChild(scroller);
  Object.defineProperty(scroller, 'scrollTop', { value: 500 });
  act(() => { scroller.dispatchEvent(new Event('scroll')); });
  expect(screen.getByText(/anonymous usage stats/i)).toBeInTheDocument();
  scroller.remove();
});

test('never appears when no analytics are configured', () => {
  delete process.env.REACT_APP_GA_MEASUREMENT_ID;
  renderAt();
  act(() => { jest.advanceTimersByTime(60000); });
  expect(screen.queryByText(/anonymous usage stats/i)).toBeNull();
});

test('waits while another popup is showing, then takes its turn', () => {
  act(() => { requestPopup('tour', 10); });
  renderAt();
  act(() => { jest.advanceTimersByTime(12000); });
  expect(screen.queryByText(/anonymous usage stats/i)).toBeNull();
  act(() => { releasePopup('tour'); });
  expect(screen.getByText(/anonymous usage stats/i)).toBeInTheDocument();
});

test('"No thanks" closes it and remembers the choice', () => {
  renderAt();
  act(() => { jest.advanceTimersByTime(12000); });
  fireEvent.click(screen.getByRole('button', { name: 'No thanks' }));
  expect(screen.queryByText(/anonymous usage stats/i)).toBeNull();
  expect(readConsent()).toMatchObject({ analytics: false });
});

test('stays away on sign-in pages', () => {
  renderAt('/login');
  act(() => { jest.advanceTimersByTime(12000); });
  expect(screen.queryByText(/anonymous usage stats/i)).toBeNull();
});
