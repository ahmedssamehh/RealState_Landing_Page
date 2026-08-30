'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 76%' });
      revealFade(el.querySelectorAll('[data-cta-fade]'), { trigger: el, start: 'top 72%' });
    }, el);

    return () => ctx.revert();
  }, []);

  const { headline, note } = t.finalCta;

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="final-cta-heading"
      className="grain relative w-full bg-ink py-[clamp(6rem,20vh,14rem)]"
    >
      <div className="edge mx-auto max-w-edge">
        <p data-cta-fade className="label mb-[clamp(2rem,6vh,4rem)] text-champagne/50 opacity-0">
          {note}
        </p>

        <h2 id="final-cta-heading" className="display text-ivory">
          {headline.map((line) => (
            <span key={line} className="reveal-line">
              <span className="block text-[clamp(2.8rem,11vw,10rem)]">{line}</span>
            </span>
          ))}
        </h2>

        <div
          data-cta-fade
          className="mt-[clamp(3rem,9vh,6rem)] flex flex-col items-start gap-10 opacity-0 md:flex-row md:items-center md:justify-between"
        >
          <a
            href={siteConfig.contact.phoneHref}
            data-cursor="button"
            className="group relative inline-flex items-center gap-6 overflow-hidden bg-burgundy px-10 py-6 transition-colors duration-300 hover:bg-burgundy-soft"
          >
            {/* Slow ivory wipe on hover */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-ivory/10 transition-transform duration-[450ms] ease-expo group-hover:translate-x-0"
            />
            <span className="label relative text-ivory">{t.cta.final}</span>
            <span
              aria-hidden
              className="relative text-ivory transition-transform duration-300 ease-expo group-hover:translate-x-2"
            >
              &rarr;
            </span>
          </a>

          {/* DEMO contact details */}
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={siteConfig.contact.phoneHref}
              data-cursor="button"
              className="font-serif text-[clamp(1.5rem,3vw,2.4rem)] font-light text-ivory transition-colors duration-200 hover:text-champagne"
            >
              {siteConfig.contact.phone}
            </a>
            <a
              href={siteConfig.contact.websiteHref}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="label text-champagne/50 transition-colors duration-200 hover:text-ivory"
            >
              {siteConfig.contact.website}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
