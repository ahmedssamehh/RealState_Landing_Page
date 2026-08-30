'use client';

import { useEffect, useState } from 'react';

/** SSR-safe media query hook. Returns `false` until mounted. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
