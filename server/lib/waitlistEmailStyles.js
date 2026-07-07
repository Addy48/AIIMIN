/** Shared light + dark (prefers-color-scheme) styles for waitlist emails */

export const LOGO_URL = 'https://aiimin.in/AIIMIN_logo.svg';

export const WAITLIST_EMAIL_DARK_CSS = `
:root { color-scheme: light dark; supported-color-schemes: light dark; }
@media (prefers-color-scheme: dark) {
  .wl-body, .wl-outer { background-color: #050505 !important; }
  .wl-frame { background-color: #0A0A0C !important; border-color: #2A2A2E !important; }
  .wl-header { border-bottom: 1px solid #2A2A2E !important; }
  .wl-brand { color: #EDE4D3 !important; }
  .wl-tag { color: #B9AF9E !important; }
  .wl-h1 { color: #EDE4D3 !important; }
  .wl-text { color: #B9AF9E !important; }
  .wl-text-strong { color: #EDE4D3 !important; }
  .wl-muted { color: #6B665C !important; }
  .wl-footer { color: #6B665C !important; border-top-color: #2A2A2E !important; }
  .wl-footer a { color: #4C9770 !important; }
  .wl-badge-count td { color: #BFE3CC !important; background-color: rgba(76,151,112,0.14) !important; border: 1px solid rgba(76,151,112,0.35) !important; border-radius: 20px !important; }
  .wl-hero td { background-color: #151417 !important; border-color: #2A2A2E !important; }
  .wl-hero-title { color: #4C9770 !important; }
  .wl-hero-sub { color: #B9AF9E !important; }
  .wl-box { border-color: #2A2A2E !important; }
  .wl-box-lbl td { background-color: #1B1A1E !important; color: #B9AF9E !important; border-bottom-color: #2A2A2E !important; }
  .wl-box-body td { color: #EDE4D3 !important; border-top-color: #2A2A2E !important; }
  .wl-box-body b { color: #4C9770 !important; }
  .wl-step-num { color: #4C9770 !important; }
  .wl-step-title { color: #EDE4D3 !important; }
  .wl-step-desc { color: #B9AF9E !important; }
  .wl-step-row { border-bottom-color: #2A2A2E !important; }
  .wl-divider { background-color: #2A2A2E !important; }
  .wl-sign { color: #B9AF9E !important; }
  .wl-sign-name { color: #EDE4D3 !important; }
  .wl-cta td { background-color: #2E6B4A !important; }
  .wl-cta a { color: #EFF7F1 !important; }
  .wl-osid td { background-color: #151417 !important; border-color: #2A2A2E !important; }
  .wl-osid-label { color: #B9AF9E !important; }
  .wl-osid-handle { color: #4C9770 !important; }
  .wl-osid-sub { color: #B9AF9E !important; }
  .wl-referral-title { color: #EDE4D3 !important; }
  .wl-referral-text { color: #B9AF9E !important; }
  .wl-referral-link { background-color: #151417 !important; border-color: #2A2A2E !important; color: #4C9770 !important; }
  .wl-section-lbl { color: #B9AF9E !important; }
}
`;

export function darkModeHeadBlock() {
  return `<meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style type="text/css">${WAITLIST_EMAIL_DARK_CSS}</style>`;
}
