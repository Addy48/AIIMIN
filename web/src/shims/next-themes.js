import { useThemeContext } from '../context/ThemeContext';
import { LIGHT_THEMES, THEME_DARK, THEME_LIGHT } from '../constants/themes';

function toSimpleTheme(themeId) {
  return LIGHT_THEMES.includes(themeId) ? 'light' : 'dark';
}

export function useTheme() {
  const { theme, setTheme } = useThemeContext();
  const simple = toSimpleTheme(theme);

  return {
    theme: simple,
    resolvedTheme: simple,
    systemTheme: simple,
    setTheme: (next) => {
      if (next === 'dark') setTheme(THEME_DARK);
      else if (next === 'light') setTheme(THEME_LIGHT);
      else setTheme(next);
    },
  };
}

export function ThemeProvider({ children }) {
  return children;
}
