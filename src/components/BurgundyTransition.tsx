'use client';

/** Full-width burgundy interlude used as a visual pause between chapters. */

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { gsap, prefersReducedMotion, registerGsap, revealLines } from '@/lib/animations';

export default function BurgundyTransition() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 80%' });

      if (!prefersReducedMotion()) {
        // The rule draws itself across the section as it passes.
        gsap.fromTo(
          '[data-transition-rule]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 60%', scrub: true },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const { headline, body } = t.transition;

  return (
    <section
      ref={root}
      aria-label="Interlude"
      className="grain relative w-full overflow-hidden bg-burgundy py-[clamp(6rem,20vh,14rem)] text-ivory"
    >
      <div className="edge mx-auto max-w-edge">
        <div data-transition-rule className="mb-[clamp(3rem,8vh,6rem)] h-px w-full origin-left bg-ivory/30" />

        <h2 className="display">
          {headline.map((line) => (
            <span key={line} className="reveal-line">
              <span className="block text-[clamp(2.8rem,10vw,9rem)]">{line}</span>
            </span>
          ))}
        </h2>

        <p className="mt-[clamp(2.5rem,6vh,4rem)] max-w-md font-sans text-sm font-light leading-relaxed tracking-wide text-ivory/70">
          {body}
        </p>
      </div>
    </section>
  );
}
