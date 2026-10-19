import { needsConsentPrompt, writeConsent, readConsent, clearConsent } from './consent';

const VERSION = 'v1-2026-10-31';

beforeEach(() => localStorage.clear());

test('no prompt when no analytics are configured', () => {
  expect(needsConsentPrompt(null, { configured: false, version: VERSION })).toBe(false);
});

test('prompt when analytics are configured and the visitor has not chosen', () => {
  expect(needsConsentPrompt(null, { configured: true, version: VERSION })).toBe(true);
});

test('no prompt once the visitor chose under the current policy', () => {
  const record = { analytics: false, version: VERSION };
  expect(needsConsentPrompt(record, { configured: true, version: VERSION })).toBe(false);
});

test('prompt again only when the policy version changes', () => {
  const record = { analytics: true, version: 'v0-old' };
  expect(needsConsentPrompt(record, { configured: true, version: VERSION })).toBe(true);
});

test('writeConsent stores the choice with the policy version', () => {
  writeConsent(false, VERSION);
  expect(readConsent()).toMatchObject({ analytics: false, version: VERSION });
});

test('clearConsent forgets the choice so it can be made again', () => {
  writeConsent(true, VERSION);
  clearConsent();
  expect(readConsent()).toBeNull();
});
