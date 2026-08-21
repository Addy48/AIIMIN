import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    try {
      const media = window.matchMedia(query);
      const handleChange = (event) => setMatches(event.matches);
      setMatches(media.matches);
      if (media.addEventListener) {
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
      }
      if (media.addListener) {
        media.addListener(handleChange);
        return () => media.removeListener(handleChange);
      }
    } catch {
      return undefined;
    }
    return undefined;
  }, [query]);

  return matches;
}
