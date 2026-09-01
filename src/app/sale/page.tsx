'use client';

/**
 * ---------------------------------------------------------------------------
 * FOR SALE — placeholder
 * ---------------------------------------------------------------------------
 * A holding page so the second option on the chooser leads somewhere real
 * rather than nowhere. When the sales listings exist, replace the body of this
 * route with the collection and flip `siteConfig.saleReady` to true — that
 * removes the "coming soon" badge from the chooser as well.
 * ---------------------------------------------------------------------------
 */

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Logo from '@/components/Logo';
import LocaleToggle from '@/components/LocaleToggle';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { DURATION, EASE, gsap, prefersReducedMotion, registerGsap } from '@/lib/animations';

export default function SalePage() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const { sale } = t;

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets = '[data-sale-fade], [data-sale-line] > span';

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .fromTo(
          '[data-sale-line] > span',
          { yPercent: 112 },
          { yPercent: 0, duration: DURATION.slow, stagger: 0.07 }
        )
        .fromTo(
          '[data-sale-fade]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: DURATION.base, stagger: 0.06 },
          '-=0.45'
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="grain relative flex min-h-[100svh] w-full flex-col bg-ivory">
      <header className="edge mx-auto flex w-full max-w-edge items-center justify-between gap-6 py-6 sm:py-8">
        <Link
          href={siteConfig.routes.chooser}
          data-sale-fade
          aria-label={siteConfig.brand.name}
          className="text-ink opacity-0"
        >
          <Logo size={30} className="hidden sm:inline-flex" />
          <Logo size={28} iconOnly className="sm:hidden" />
        </Link>

        <span data-sale-fade className="opacity-0">
          <LocaleToggle tone="dark" />
        </span>
      </header>

      <div className="edge mx-auto flex w-full max-w-edge flex-1 flex-col justify-center py-[clamp(3rem,10vh,7rem)]">
        <p data-sale-fade className="label mb-6 text-burgundy opacity-0">
          {sale.eyebrow}
        </p>

        <h1 className="display text-ink">
          {sale.headline.map((line) => (
            <span key={line} data-sale-line className="reveal-line">
              <span className="block text-[clamp(2.1rem,7vw,5.5rem)]">{line}</span>
            </span>
          ))}
        </h1>

        <p
          data-sale-fade
          className="mt-9 max-w-md font-sans text-sm font-light leading-relaxed text-ink/60 opacity-0"
        >
          {sale.body}
        </p>

        {/* DEMO contact details — phone and email are the only channels */}
        <div
          data-sale-fade
          className="mt-10 flex flex-col items-start gap-6 opacity-0 sm:flex-row sm:items-center sm:gap-10"
        >
          <a
            href={siteConfig.contact.phoneHref}
            className="group inline-flex items-center gap-5 bg-burgundy px-9 py-5 transition-colors duration-200 hover:bg-burgundy-soft"
          >
            <span className="label text-ivory">{siteConfig.contact.phone}</span>
            <span
              aria-hidden
              className="text-ivory transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="border-b border-ink/25 pb-1 font-serif text-[clamp(1.1rem,2vw,1.4rem)] font-light text-ink/75 transition-colors duration-200 hover:border-burgundy hover:text-ink"
          >
            {siteConfig.contact.email}
          </a>
        </div>

        <Link
          href={siteConfig.routes.rent}
          data-sale-fade
          className="group mt-14 inline-flex items-center gap-4 opacity-0"
        >
          <span
            aria-hidden
            className="text-ink/50 transition-transform duration-300 ease-expo group-hover:-translate-x-1.5"
          >
            &larr;
          </span>
          <span className="label border-b border-ink/25 pb-1 text-ink/60 transition-colors duration-200 group-hover:border-burgundy group-hover:text-ink">
            {sale.back}
          </span>
        </Link>
      </div>
    </main>
  );
}
