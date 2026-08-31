'use client';

/**
 * ---------------------------------------------------------------------------
 * LOADING SCREEN
 * ---------------------------------------------------------------------------
 * The counter tracks real readiness, not a timer, and the curtain never lifts
 * before it reaches 100. Three signals are weighted:
 *
 *   fonts   25%  document.fonts.ready — the display face is the whole identity
 *   scene   50%  the 3D villa has drawn its first frame
 *   page    25%  window load (images, chunks)
 *
 * The displayed number eases toward that target and creeps slightly so it
 * never looks frozen, but it can never overtake real progress. A safety
 * timeout releases the page if a signal never arrives (no WebGL, blocked
 * font, dead network) so the site can't be held hostage by the loader.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/locale';
import Logo from './Logo';
import { EASE, gsap, prefersReducedMotion, registerGsap } from '@/lib/animations';

type Props = {
  /** Called as the curtain starts to lift, so the hero can enter beneath it. */
  onComplete: () => void;
  /** True once HeroScene has rendered its first frame. */
  sceneReady: boolean;
};

/** Never hold the page longer than this, whatever the signals say. */
const SAFETY_MS = 7000;

const WEIGHTS = { fonts: 0.25, scene: 0.5, page: 0.25 };

export default function LoadingScreen({ onComplete, sceneReady }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { t } = useLocale();

  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false);

  const signals = useRef({ fonts: false, page: false, scene: false, forced: false });
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

    if (document.readyState === 'complete') {
      signals.current.page = true;
    } else {
      const onLoad = () => {
        signals.current.page = true;
      };
      window.addEventListener('load', onLoad, { once: true });
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

    const reduced = prefersReducedMotion();
    document.documentElement.style.overflow = 'hidden';

    let frame = 0;
    let shown = 0;

    const release = () => {
      if (done.current) return;
      done.current = true;
      document.documentElement.style.overflow = '';

      if (reduced) {
        gsap.set(el, { autoAlpha: 0 });
        setHidden(true);
        onComplete();
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        // hold on 100 for a beat so the number is legible
        .to(inner.current, { opacity: 0, y: -12, duration: 0.4, delay: 0.25 })
        .add(() => onComplete())
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power3.inOut' }, '-=0.1')
        .set(el, { autoAlpha: 0 })
        .add(() => setHidden(true));
    };

    const tick = () => {
      const s = signals.current;
      const target = s.forced
        ? 1
        : (s.fonts ? WEIGHTS.fonts : 0) +
          (s.scene ? WEIGHTS.scene : 0) +
          (s.page ? WEIGHTS.page : 0);

      /*
       * Ease toward the real figure, creeping slightly so it never looks
       * frozen, and never overtaking what has actually completed. Once every
       * signal is in, close the last stretch decisively rather than letting an
       * exponential tail crawl the final few percent.
       */
      const ceiling = target * 100;
      const complete = target >= 1;
      const pull = complete ? 0.2 : 0.08;
      const floor = complete ? 1.6 : 0.35;
      const step = Math.max((ceiling - shown) * pull, ceiling > shown ? floor : 0);
      shown = Math.min(shown + step, ceiling);

      const rounded = Math.floor(shown);
      setCount(rounded);
      if (bar.current) bar.current.style.transform = `scaleX(${(shown / 100).toFixed(4)})`;

      if (shown >= 99.4) {
        setCount(100);
        if (bar.current) bar.current.style.transform = 'scaleX(1)';
        release();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

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
        .fromTo('[data-load-meter]', { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.25');
    }, el);

    return () => {
      cancelAnimationFrame(frame);
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
          <Logo size={54} />
        </div>

        <p data-load-tagline className="label mt-6 text-ink/55 opacity-0">
          {t.brand.tagline}
        </p>

        <div data-load-meter className="mt-14 w-full opacity-0">
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
