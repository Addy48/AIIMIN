/** Design lab tokens — isolated from live app themes for evaluation only */

export const ACCENT_ROLES = {
  brand: { label: 'Brand / Action', dark: '#FF6B35', light: '#E85A24', usage: 'Primary CTA, active nav, focus rings, logo ember' },
  success: { label: 'Completion', dark: '#10B981', light: '#1E5C3A', usage: 'Streaks, heatmap fills, gym yes, metric complete' },
  forest: { label: 'Forest brand', dark: '#23503B', light: '#23503B', usage: 'Avatar, placement hero cards, forest moments' },
  info: { label: 'Info / Focus mode', dark: '#3B82F6', light: '#1D4ED8', usage: 'Focus timer, links, calendar info' },
};

export const CURRENT_THEMES = {
  vercel: {
    id: 'vercel',
    label: 'Vercel Dark',
    status: 'retire',
    tokens: {
      '--proto-base': '#1a1a1a',
      '--proto-surface': '#2d2d2d',
      '--proto-elevated': '#343434',
      '--proto-border': '#3a3a3a',
      '--proto-text-1': '#EDEDED',
      '--proto-text-2': '#A1A1AA',
      '--proto-text-3': '#6B6B7B',
      '--proto-accent': '#10B981',
      '--proto-accent-dim': 'rgba(16, 185, 129, 0.12)',
      '--proto-success': '#10B981',
      '--proto-logo-bg': '#23503B',
      '--proto-nav-bg': 'color-mix(in srgb, #1a1a1a 85%, transparent)',
      '--proto-chip-fill': '#FFFFFF',
      '--proto-chip-stroke': '#B8C0CC',
    },
  },
  nordic: {
    id: 'nordic',
    label: 'Nordic Calm',
    status: 'retire',
    tokens: {
      '--proto-base': '#f9f9f9',
      '--proto-surface': '#ffffff',
      '--proto-elevated': '#FFFFFF',
      '--proto-border': '#e5e7eb',
      '--proto-text-1': '#1A1A1A',
      '--proto-text-2': '#4b5563',
      '--proto-text-3': '#6B7280',
      '--proto-accent': '#1E5C3A',
      '--proto-accent-dim': 'rgba(30, 92, 58, 0.08)',
      '--proto-success': '#10B981',
      '--proto-logo-bg': '#23503B',
      '--proto-nav-bg': 'color-mix(in srgb, #f9f9f9 85%, transparent)',
      '--proto-chip-fill': '#FFFFFF',
      '--proto-chip-stroke': '#9CA3AF',
    },
  },
  studio: {
    id: 'studio',
    label: 'Studio',
    status: 'retire',
    tokens: {
      '--proto-base': '#FFFFFF',
      '--proto-surface': '#FFFFFF',
      '--proto-elevated': '#F7F7F5',
      '--proto-border': '#E1E1E1',
      '--proto-text-1': '#37352F',
      '--proto-text-2': '#787774',
      '--proto-text-3': '#6B6963',
      '--proto-accent': '#000000',
      '--proto-accent-dim': 'rgba(0, 0, 0, 0.06)',
      '--proto-success': '#10B981',
      '--proto-logo-bg': '#23503B',
      '--proto-nav-bg': 'color-mix(in srgb, #FFFFFF 88%, transparent)',
      '--proto-chip-fill': '#FFFFFF',
      '--proto-chip-stroke': '#D4D4D4',
    },
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    status: 'retire',
    tokens: {
      '--proto-base': '#0A0D10',
      '--proto-surface': '#101419',
      '--proto-elevated': '#161B22',
      '--proto-border': '#21262D',
      '--proto-text-1': '#F0F6FC',
      '--proto-text-2': '#8B949E',
      '--proto-text-3': '#484F58',
      '--proto-accent': '#00F0FF',
      '--proto-accent-dim': 'rgba(0, 240, 255, 0.12)',
      '--proto-success': '#00FF88',
      '--proto-logo-bg': '#23503B',
      '--proto-nav-bg': 'color-mix(in srgb, #0A0D10 85%, transparent)',
      '--proto-chip-fill': '#FFFFFF',
      '--proto-chip-stroke': '#B8C0CC',
    },
  },
};

export const PROPOSED_THEMES = {
  'aiimin-dark': {
    id: 'aiimin-dark',
    label: 'AIIMIN Dark',
    status: 'proposed',
    desc: 'Personal control room. Warm ink on near-black. Orange action, green completion only.',
    tokens: {
      '--proto-base': '#14171A',
      '--proto-surface': '#1E2228',
      '--proto-elevated': '#262B33',
      '--proto-border': '#333942',
      '--proto-text-1': '#F0EDE8',
      '--proto-text-2': '#9CA3AF',
      '--proto-text-3': '#6B7280',
      '--proto-accent': '#FF6B35',
      '--proto-accent-dim': 'rgba(255, 107, 53, 0.12)',
      '--proto-success': '#10B981',
      '--proto-logo-bg': '#23503B',
      '--proto-nav-bg': '#14171A',
      '--proto-chip-fill': '#FFFFFF',
      '--proto-chip-stroke': '#B8C0CC',
      '--proto-shadow-focus': '0 0 0 2px rgba(255, 107, 53, 0.32)',
    },
  },
  'aiimin-light': {
    id: 'aiimin-light',
    label: 'AIIMIN Light',
    status: 'proposed',
    desc: 'Cool paper and ink. Editorial wordmark on calm neutral. Deeper orange for WCAG on white.',
    tokens: {
      '--proto-base': '#EDE4D3',
      '--proto-surface': '#FFFFFF',
      '--proto-elevated': '#F7F1E6',
      '--proto-border': '#D9CEB8',
      '--proto-text-1': '#14171A',
      '--proto-text-2': '#3F464E',
      '--proto-text-3': '#6B7280',
      '--proto-accent': '#E85A24',
      '--proto-accent-dim': 'rgba(232, 90, 36, 0.10)',
      '--proto-success': '#1E5C3A',
      '--proto-logo-bg': '#23503B',
      '--proto-nav-bg': '#F7F1E6',
      '--proto-chip-fill': '#F7F1E6',
      '--proto-chip-stroke': '#D9CEB8',
      '--proto-shadow-focus': '0 0 0 2px rgba(232, 90, 36, 0.22)',
    },
  },
};

export const NAV_PRIMARY = ['Today', 'Habits', 'Goals', 'Journal'];
export const NAV_MORE = ['Finance', 'Family', 'Calendar', 'Placement', 'Sports', 'Discipline', 'Focus', 'Lab'];
export const NAV_ALL = [...NAV_PRIMARY, ...NAV_MORE];

export const CHIP_VARIANTS = {
  editorDark: {
    label: 'Editor Pick (current dark)',
    chipFill: '#FFFFFF',
    chipStroke: '#B8C0CC',
    arch: '#D1D5DB',
    outer: '#14171A',
    inner: '#6B7280',
    dot: '#FF6B35',
  },
  editorLight: {
    label: 'Light nav chip (proposed)',
    chipFill: '#FAFAF8',
    chipStroke: '#D1D5DB',
    arch: '#D1D5DB',
    outer: '#14171A',
    inner: '#6B7280',
    dot: '#E85A24',
  },
  softPaper: {
    label: 'Soft paper (no halo)',
    chipFill: '#EDE4D3',
    chipStroke: '#D9CEB8',
    arch: '#9CA3AF',
    outer: '#14171A',
    inner: '#6B7280',
    dot: '#E85A24',
  },
};

export function tokensToStyle(tokens) {
  return Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k, v])
  );
}

export function isProtoDark(themeId) {
  return themeId === 'vercel' || themeId === 'midnight' || themeId === 'aiimin-dark';
}
