import { useThemeContext } from '../context/ThemeContext';
import { isDarkTheme, isLightTheme } from '../constants/themes';

/** Theme-aware color helpers — AIIMIN Dark / Light via CSS variables. */
export default function useThemeColors() {
  const { theme } = useThemeContext();
  const isDark = isDarkTheme(theme);
  const isLight = isLightTheme(theme);

  return {
    theme,
    isDark,
    isLight,
    base: 'var(--color-base)',
    surface1: 'var(--color-surface-1)',
    surface2: 'var(--color-surface-2)',
    surface3: 'var(--color-surface-3)',
    surface4: 'var(--color-surface-4)',
    border: 'var(--color-border)',
    borderLit: 'var(--color-border-lit)',
    text1: 'var(--color-text-1)',
    text2: 'var(--color-text-2)',
    text3: 'var(--color-text-3)',
    accent: 'var(--color-accent)',
    accentDim: 'var(--color-accent-dim)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    statusPillBg: 'var(--status-pill-bg)',
    heatmapEmpty: 'var(--heatmap-empty)',
    heatmapLow: 'var(--heatmap-low)',
    heatmapMed: 'var(--heatmap-med)',
    heatmapHigh: 'var(--heatmap-high)',
    heatmapMax: 'var(--heatmap-max)',
    focusFlow: 'var(--focus-flow-color)',
    focusFlowDark: 'var(--focus-flow-dark)',
    focusFlowLight: 'var(--focus-flow-light)',
    focusFlowBg: 'var(--focus-flow-bg)',
    focusRest: 'var(--focus-rest-color)',
    focusRestDark: 'var(--focus-rest-dark)',
    focusRestLight: 'var(--focus-rest-light)',
    focusRestBg: 'var(--focus-rest-bg)',
    focusRecovery: 'var(--focus-recovery-color)',
    focusRecoveryDark: 'var(--focus-recovery-dark)',
    focusRecoveryLight: 'var(--focus-recovery-light)',
    focusRecoveryBg: 'var(--focus-recovery-bg)',
    inputBg: 'var(--color-surface-3)',
    cardBg: 'var(--color-surface-2)',
    modalOverlay: isLight
      ? 'rgba(245, 243, 239, 0.88)'
      : 'rgba(20, 23, 26, 0.82)',
    modalCard: 'var(--color-surface-3)',
    activeTabColor: '#fff',
  };
}
