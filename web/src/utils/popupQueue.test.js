import {
  requestPopup,
  releasePopup,
  activePopup,
  subscribePopups,
  resetPopupsForTests,
} from './popupQueue';

beforeEach(() => resetPopupsForTests());

test('first request gets the slot', () => {
  requestPopup('consent', 1);
  expect(activePopup()).toBe('consent');
});

test('second request waits while another popup is showing', () => {
  requestPopup('tour', 10);
  requestPopup('consent', 1);
  expect(activePopup()).toBe('tour');
});

test('a showing popup is never pre-empted by a higher priority one', () => {
  requestPopup('consent', 1);
  requestPopup('tour', 10);
  expect(activePopup()).toBe('consent');
});

test('releasing hands the slot to the highest priority waiter', () => {
  requestPopup('feedback-nudge', 0);
  requestPopup('consent', 1);
  requestPopup('tour', 10);
  releasePopup('feedback-nudge');
  expect(activePopup()).toBe('tour');
  releasePopup('tour');
  expect(activePopup()).toBe('consent');
  releasePopup('consent');
  expect(activePopup()).toBeNull();
});

test('a waiter that gives up before its turn never shows', () => {
  requestPopup('tour', 10);
  requestPopup('consent', 1);
  releasePopup('consent');
  releasePopup('tour');
  expect(activePopup()).toBeNull();
});

test('requesting twice does not queue a duplicate', () => {
  requestPopup('tour', 10);
  requestPopup('tour', 10);
  releasePopup('tour');
  expect(activePopup()).toBeNull();
});

test('subscribers hear every change of the active popup', () => {
  const seen = [];
  const off = subscribePopups((id) => seen.push(id));
  requestPopup('tour', 10);
  requestPopup('consent', 1);
  releasePopup('tour');
  releasePopup('consent');
  off();
  requestPopup('tour', 10);
  expect(seen).toEqual(['tour', 'consent', null]);
});
