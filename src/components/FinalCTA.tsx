'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

/**
 * Closing section. A full-bleed burgundy panel — the largest statement of the
 * accent colour on the site — carrying the headline and the only two contact
 * channels there are. No button and no form: the phone number and the email
 * address are themselves the actions.
 */
export type FinalCtaCopy = { headline: string[]; note: string };

export default function FinalCTA({ copy }: { copy?: FinalCtaCopy }) {
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

  const { headline, note } = copy ?? t.finalCta;

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="final-cta-heading"
      className="grain relative w-full bg-burgundy py-[clamp(5rem,16vh,11rem)] text-ivory"
    >
      <div className="edge mx-auto max-w-edge">
        <p data-cta-fade className="label mb-[clamp(2rem,6vh,4rem)] text-ivory/55 opacity-0">
          {note}
        </p>

        <h2 id="final-cta-heading" className="display text-ivory">
          {headline.map((line) => (
            <span key={line} className="reveal-line">
              <span className="block text-[clamp(2.6rem,10vw,9rem)]">{line}</span>
            </span>
          ))}
        </h2>

        {/* The two channels, given equal editorial weight. */}
        <dl className="mt-[clamp(3rem,10vh,6rem)] grid grid-cols-1 gap-px border-t border-ivory/20 sm:grid-cols-2">
          {/* Phone and email are the only contact channels. */}
          <div data-cta-fade className="border-b border-ivory/20 py-8 opacity-0 sm:border-b-0 sm:pr-10">
            <dt className="label text-ivory/45">{t.ui.telephone}</dt>
            <dd className="mt-4">
              <a
                href={siteConfig.contact.phoneHref}
                className="group inline-flex items-baseline gap-4 font-serif text-[clamp(1.6rem,4vw,3rem)] font-light leading-none text-ivory"
              >
                <span className="border-b border-transparent pb-1 transition-colors duration-200 group-hover:border-ivory/60">
                  {siteConfig.contact.phone}
                </span>
                <span
                  aria-hidden
                  className="text-lg transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
                >
                  &rarr;
                </span>
              </a>
            </dd>
          </div>

          <div data-cta-fade className="py-8 opacity-0 sm:border-l sm:border-ivory/20 sm:pl-10">
            <dt className="label text-ivory/45">{t.ui.email}</dt>
            <dd className="mt-4">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group inline-flex items-baseline gap-4 font-serif text-[clamp(1.3rem,3vw,2.2rem)] font-light leading-none text-ivory"
              >
                <span className="border-b border-transparent pb-1 transition-colors duration-200 group-hover:border-ivory/60">
                  {siteConfig.contact.email}
                </span>
                <span
                  aria-hidden
                  className="text-lg transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
                >
                  &rarr;
                </span>
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
