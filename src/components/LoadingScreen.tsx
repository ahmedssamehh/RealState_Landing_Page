'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { EASE, prefersReducedMotion, registerGsap } from '@/lib/animations';

type Props = {
  /** Called the moment the curtain begins to lift, so the hero can enter under it. */
  onComplete: () => void;
};

/** Counter steps - deliberately uneven so the count feels mechanical, not linear. */
const STEPS = [0, 18, 43, 67, 84, 100];

/** Shown once per browser session; a second visit goes straight to the hero. */
const SEEN_KEY = 'yl.introSeen';

export default function LoadingScreen({ onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const { t } = useLocale();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const gsap = registerGsap();
    const el = root.current;
    if (!el) return;

    const reduced = prefersReducedMotion();

    // Never make a returning visitor sit through the intro again.
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable — show the intro */
    }

    if (seen || reduced) {
      setCount(100);
      setDone(true);
      gsap.set(el, { autoAlpha: 0 });
      onComplete();
      return;
    }

    document.documentElement.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const counter = { i: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          setDone(true);
        },
      });

      tl.fromTo(
        '[data-load-mark]',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: EASE.expo }
      )
        .fromTo(
          '[data-load-tagline]',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, ease: EASE.out },
          '-=0.25'
        )
        // Stepped percentage count
        .to(
          counter,
          {
            i: STEPS.length - 1,
            duration: 0.55,
            ease: 'power2.inOut',
            onUpdate: () => {
              const idx = Math.round(counter.i);
              setCount(STEPS[Math.min(idx, STEPS.length - 1)]);
            },
          },
          '-=0.3'
        )
        // Progress rule fills alongside the count
        .fromTo(
          '[data-load-bar]',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: 'power2.inOut' },
          '<'
        )
        .to('[data-load-inner]', { opacity: 0, duration: 0.25, ease: EASE.out })
        // Cinematic curtain lift
        .add(() => onComplete())
        .to(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.55,
          ease: 'power3.inOut',
        })
        .set(el, { autoAlpha: 0 });
    }, el);

    return () => {
      document.documentElement.style.overflow = '';
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={root}
      aria-hidden={done}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory"
      style={{ clipPath: 'inset(0% 0% 0% 0%)', pointerEvents: done ? 'none' : 'auto' }}
    >
      <div data-load-inner className="flex flex-col items-center">
        {/* DEMO wordmark - replace via siteConfig.brand.name */}
        <h2
          data-load-mark
          className="display text-center text-[clamp(2rem,7vw,5rem)] tracking-[0.06em] text-ink opacity-0"
        >
          {siteConfig.brand.name}
        </h2>
        <p data-load-tagline className="label mt-6 text-ink/55 opacity-0">
          {t.brand.tagline}
        </p>

        <div className="mt-16 flex w-[min(64vw,22rem)] flex-col gap-4">
          <div className="h-px w-full bg-ink/15">
            <div
              data-load-bar
              className="h-px w-full origin-left bg-burgundy"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="label text-ink/45">{t.ui.loading}</span>
            <span className="font-sans text-sm font-light tabular-nums tracking-wider2 text-ink">
              {count.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
