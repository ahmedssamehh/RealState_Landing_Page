'use client';

/**
 * ---------------------------------------------------------------------------
 * LOADING SCREEN
 * ---------------------------------------------------------------------------
 * The sequence runs for a deliberate LOAD_DURATION_MS, with the villa from
 * the hero turning on a plinth while it does. The counter eases 0 -> 100 over
 * that window, so the pacing is the same on every machine.
 *
 * Readiness still has a veto: the number stops just short of 100 and waits if
 * the page genuinely is not ready yet. Three signals decide that:
 *
 *   dom     the document is parsed and interactive
 *   fonts   document.fonts.ready — the display face is the identity
 *   scene   the hero's 3D villa has drawn its first frame
 *
 * Deliberately NOT gated on `window.load`: that waits for every image on the
 * page, including the residence photography far below the fold, which held
 * the curtain down long after the hero was ready.
 *
 * A safety timeout releases the page if a signal never arrives (no WebGL,
 * blocked font) so the site can't be held hostage by the loader.
 *
 * The counter is driven by an interval with an elapsed-time easing, NOT by
 * requestAnimationFrame. rAF is throttled or suspended whenever the page is
 * not actively painting (background tab, occluded window, some embedded
 * views), which left the number frozen at 000 for as long as that lasted.
 * Timer-driven progress advances on wall-clock time, so the sequence always
 * takes the same length regardless of frame rate.
 * ---------------------------------------------------------------------------
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/locale';
import Logo from './Logo';

/** Kept out of the critical bundle; it shares HeroScene's chunk. */
const LoadingVilla = dynamic(() => import('./LoadingVilla'), {
  ssr: false,
  loading: () => null,
});
import { EASE, gsap, prefersReducedMotion, registerGsap } from '@/lib/animations';

type Props = {
  /** Called as the curtain starts to lift, so the hero can enter beneath it. */
  onComplete: () => void;
  /** True once HeroScene has rendered its first frame. */
  sceneReady: boolean;
};

/** How long the introduction runs before handing over to the site. */
const LOAD_DURATION_MS = 3000;

/** Where the counter waits if the page still isn't ready at the end. */
const HOLD_AT = 0.94;

/** Never hold the page longer than this, whatever the signals say. */
const SAFETY_MS = 6000;

const TICK_MS = 16;

/** Gentle ease so the count opens quickly and settles into 100. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const WEIGHTS = { dom: 0.2, fonts: 0.3, scene: 0.5 };

export default function LoadingScreen({ onComplete, sceneReady }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { t } = useLocale();

  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false);

  const signals = useRef({ dom: false, fonts: false, scene: false, forced: false });
  const done = useRef(false);

  /* Keep the scene signal in a ref the rAF loop can read. */
  useEffect(() => {
    signals.current.scene = sceneReady;
  }, [sceneReady]);

  /* Collect the real readiness signals. */
  useEffect(() => {
    let cancelled = false;

    document.fonts?.ready
      .then(() => {
        if (!cancelled) signals.current.fonts = true;
      })
      .catch(() => {
        signals.current.fonts = true;
      });
    // Older browsers without the font loading API shouldn't stall the bar.
    if (!document.fonts) signals.current.fonts = true;

    if (document.readyState !== 'loading') {
      signals.current.dom = true;
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          signals.current.dom = true;
        },
        { once: true }
      );
    }

    const safety = window.setTimeout(() => {
      signals.current.forced = true;
    }, SAFETY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
    };
  }, []);

  /* Drive the counter, then hand over. */
  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    /*
     * StrictMode runs effects twice in development. Without this guard the
     * second pass re-locked page scroll while `release` short-circuited on its
     * `done` ref, leaving <html> stuck at overflow:hidden after the curtain
     * lifted — the page loaded but could not be scrolled.
     */
    if (done.current) {
      document.documentElement.style.overflow = '';
      return;
    }

    const reduced = prefersReducedMotion();
    document.documentElement.style.overflow = 'hidden';

    let shown = 0;
    const startedAt = performance.now();
    let last = startedAt;

    const release = () => {
      // Unlock first and unconditionally: scroll must never depend on which
      // branch of this function runs.
      document.documentElement.style.overflow = '';
      if (done.current) return;
      done.current = true;

      // Hand the page over immediately. The curtain is decoration on top of
      // that, never a gate in front of it — GSAP runs on rAF, so tying the
      // reveal to the animation would strand the visitor behind a frozen
      // curtain in any context where painting is throttled.
      onComplete();

      if (reduced) {
        gsap.set(el, { autoAlpha: 0 });
        setHidden(true);
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        // hold on 100 for a beat so the number is legible
        .to(inner.current, { opacity: 0, y: -14, duration: 0.4, delay: 0.25 })
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'power3.inOut' }, '-=0.05')
        .set(el, { autoAlpha: 0 })
        .add(() => setHidden(true));

      // Whatever happens to the animation, the curtain comes down.
      window.setTimeout(() => {
        gsap.set(el, { autoAlpha: 0 });
        setHidden(true);
      }, 2000);
    };

    const tick = () => {
      const now = performance.now();
      const elapsed = now - startedAt;

      const s = signals.current;
      const ready = s.forced || (s.dom && s.fonts && s.scene);

      // Time drives the number; readiness only decides whether it may finish.
      const eased = easeOutCubic(Math.min(elapsed / LOAD_DURATION_MS, 1));
      const ceiling = ready ? 1 : HOLD_AT;
      shown = Math.max(shown, Math.min(eased, ceiling) * 100);

      setCount(Math.floor(shown));
      if (bar.current) bar.current.style.transform = `scaleX(${(shown / 100).toFixed(4)})`;

      if (ready && elapsed >= LOAD_DURATION_MS) {
        window.clearInterval(timer);
        setCount(100);
        if (bar.current) bar.current.style.transform = 'scaleX(1)';
        release();
      }
    };

    const timer = window.setInterval(tick, TICK_MS);
    tick();

    // Entrance for the mark itself
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .fromTo('[data-load-mark]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          '[data-load-tagline]',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.25'
        )
        .fromTo(
          '[data-load-villa]',
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.9 },
          '-=0.2'
        )
        .fromTo('[data-load-meter]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6');
    }, el);

    return () => {
      window.clearInterval(timer);
      document.documentElement.style.overflow = '';
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label={`${t.ui.loading} ${count}%`}
      aria-hidden={hidden}
      className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory"
      style={{ clipPath: 'inset(0% 0% 0% 0%)', pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <div ref={inner} className="edge flex w-full max-w-lg flex-col items-center">
        {/* DEMO brand mark — replace via siteConfig.brand */}
        <div data-load-mark className="text-ink opacity-0">
          <Logo size={44} />
        </div>

        <p data-load-tagline className="label mt-5 text-ink/55 opacity-0">
          {t.brand.tagline}
        </p>

        {/* The residence itself, turning while the page assembles */}
        <div
          data-load-villa
          className="pointer-events-none mt-2 h-[min(38vh,17rem)] w-full opacity-0"
        >
          <LoadingVilla />
        </div>

        <div data-load-meter className="w-full opacity-0">
          {/* The count itself is the hero of this screen */}
          <div className="mb-5 flex items-end justify-between">
            <span className="label text-ink/40">{t.ui.loading}</span>
            <span className="font-serif text-[clamp(3rem,9vw,5.5rem)] font-light leading-none tabular-nums text-ink">
              {count.toString().padStart(3, '0')}
            </span>
          </div>

          <div className="h-px w-full bg-ink/12">
            <span
              ref={bar}
              className="block h-px w-full origin-left bg-burgundy"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
