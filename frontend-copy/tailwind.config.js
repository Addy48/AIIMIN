/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Bridges to CSS token variables */
        base:     'var(--color-base)',
        surface:  'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        accent:   'var(--color-accent)',
        hero:     'var(--color-hero)',
        text: {
          1: 'var(--color-text-1)',
          2: 'var(--color-text-2)',
          3: 'var(--color-text-3)',
        },
        metric: {
          sleep: 'var(--color-sleep)',
          gym:   'var(--color-gym)',
          steps: 'var(--color-steps)',
          water: 'var(--color-water)',
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
        mono: ["'DM Mono'", "'SF Mono'", 'monospace'],
      },
      fontSize: {
        'hero':    ['56px', { lineHeight: '1',   fontWeight: '300' }],
        'metric':  ['28px', { lineHeight: '1',   fontWeight: '300' }],
        'heading': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'body':    ['13px', { lineHeight: '1.6', fontWeight: '300' }],
        'label':   ['10px', { lineHeight: '1',   fontWeight: '500' }],
        'subtext': ['11px', { lineHeight: '1.5', fontWeight: '300' }],
      },
      borderRadius: {
        DEFAULT: '0px',
        modal:   '8px',
        pill:    '9999px',
      },
      transitionTimingFunction: {
        aiimin: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        focus: '0 0 0 2px var(--color-accent)',
        none:  'none',
      },
    },
  },
  plugins: [],
};
