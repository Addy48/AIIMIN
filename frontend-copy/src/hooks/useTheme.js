import { useThemeContext } from '../context/ThemeContext';

/**
 * Backward-compatible shim.
 * All components can keep `import useTheme from '../hooks/useTheme'`.
 * Internally, it now delegates to ThemeContext (pure React data flow).
 */
export default function useTheme() {
    return useThemeContext();
}
