import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { isLightTheme } from '../../constants/themes';
import { ArchBracketMark, pickMarkColors } from './archBracketMark';

/**
 * Theme-aware Arch Bracket logo mark.
 * Pass `isLight` to override (e.g. waitlist surface theme).
 */
export default function ThemedMark({
  size = 36,
  withChip = true,
  density = 'default',
  variant,
  isLight: isLightOverride,
  className,
  style,
}) {
  const { theme } = useThemeContext();
  const isLight = isLightOverride ?? isLightTheme(theme);

  return (
    <ArchBracketMark
      size={size}
      withChip={withChip}
      density={density}
      colors={pickMarkColors(isLight, { density, variant })}
      className={className}
      style={style}
    />
  );
}
