'use client';

/**
 * Lenis smooth scrolling, synchronised with the GSAP ScrollTrigger ticker.
 * Also exposes a small controller so overlays (residence detail, mobile menu)
 * can lock and release the page scroll without layout shift.
 */

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, gsap, registerGsap } from '@/lib/animations';
import { useReducedMotion } from '@/lib/useMediaQuery';

type ScrollApi = {
  lock: () => void;
  unlock: () => void;
  scrollTo: (target: string | HTMLElement | number) => void;
};

const ScrollContext = createContext<ScrollApi>({
  lock: () => {},
  unlock: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(ScrollContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();
  const [api, setApi] = useState<ScrollApi>({
    lock: () => {},
    unlock: () => {},
    scrollTo: () => {},
  });

  useEffect(() => {
    registerGsap();

    if (reduced) {
      setApi({
        lock: () => {
          document.documentElement.style.overflow = 'hidden';
        },
        unlock: () => {
          document.documentElement.style.overflow = '';
        },
        scrollTo: (target) => {
          const el =
            typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
          if (typeof el === 'number') window.scrollTo({ top: el });
          else el?.scrollIntoView();
        },
      });
      return;
    }

    const instance = new Lenis({
      // Short enough to feel immediate, smoothed just enough to stay elegant.
      duration: 0.7,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native inertia beats anything we can simulate on touch.
      syncTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1.1,
    });
    lenis.current = instance;

    instance.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setApi({
      lock: () => instance.stop(),
      unlock: () => instance.start(),
      scrollTo: (target) => instance.scrollTo(target as never, { offset: 0, duration: 0.8 }),
    });

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, [reduced]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
