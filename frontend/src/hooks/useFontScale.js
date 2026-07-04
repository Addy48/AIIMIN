import { useEffect, useMemo, useState } from 'react';

export const FONT_SCALE_PRESETS = {
  small: { px: '13px', ratio: '0.93' },
  normal: { px: '15px', ratio: '1' },
  large: { px: '17px', ratio: '1.12' },
};

export const normalizeFontScale = (value) => (FONT_SCALE_PRESETS[value] ? value : 'normal');

export const applyFontScaleToRoot = (scale) => {
  const normalized = normalizeFontScale(scale);
  const preset = FONT_SCALE_PRESETS[normalized];
  document.documentElement.style.setProperty('--font-scale-base', preset.px);
  document.documentElement.style.setProperty('--font-scale-ratio', preset.ratio);
  document.documentElement.style.fontSize = preset.px;
  localStorage.setItem('aiimin-font-scale', normalized);
  return normalized;
};

export function useFontScale(profileFontScale, onPersist) {
  const initial = useMemo(
    () => normalizeFontScale(localStorage.getItem('aiimin-font-scale') || profileFontScale || 'normal'),
    [profileFontScale],
  );
  const [fontScale, setFontScale] = useState(initial);

  useEffect(() => {
    const fromProfile = normalizeFontScale(profileFontScale || localStorage.getItem('aiimin-font-scale') || 'normal');
    setFontScale(fromProfile);
    applyFontScaleToRoot(fromProfile);
  }, [profileFontScale]);

  const setAndPersist = async (nextScale) => {
    const normalized = applyFontScaleToRoot(nextScale);
    setFontScale(normalized);
    if (typeof onPersist === 'function') {
      await onPersist(normalized);
    }
  };

  return { fontScale, setFontScale: setAndPersist };
}
