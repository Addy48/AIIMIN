/** Canonical AIIMIN themes — one dark, one light */

export const THEME_DARK = 'aiimin-dark';
export const THEME_LIGHT = 'aiimin-light';

export const THEME_META = [
  {
    id: THEME_DARK,
    label: 'AIIMIN Dark',
    desc: 'Control room - warm ink on near-black',
    preview: { bg: '#14171A', surface: '#1E2228', accent: '#FF6B35', text: '#F0EDE8' },
  },
  {
    id: THEME_LIGHT,
    label: 'AIIMIN Light',
    desc: 'Cool paper and ink - editorial calm',
    preview: { bg: '#F5F3EF', surface: '#FFFFFF', accent: '#E85A24', text: '#14171A' },
  },
];

export const LEGACY_THEME_ALIASES = {
  dark: THEME_DARK,
  vercel: THEME_DARK,
  midnight: THEME_DARK,
  internet: THEME_DARK,
  light: THEME_LIGHT,
  normal: THEME_LIGHT,
  nordic: THEME_LIGHT,
  studio: THEME_LIGHT,
  notion: THEME_LIGHT,
};

export const LIGHT_THEMES = [THEME_LIGHT];
export const DARK_THEMES = [THEME_DARK];

export const normalizeThemeId = (themeId) => {
  if (!themeId) return THEME_DARK;
  return LEGACY_THEME_ALIASES[themeId] || themeId;
};

export const isDarkTheme = (themeId) => DARK_THEMES.includes(normalizeThemeId(themeId));
export const isLightTheme = (themeId) => LIGHT_THEMES.includes(normalizeThemeId(themeId));
