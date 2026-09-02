'use client';

/**
 * Two real neighbourhoods, not one invented address. Each card is driven
 * directly by `apartments.ts` — the same neighbourhood name and proximity
 * facts shown here are the ones already verified against the Airbnb listing,
 * so there is nothing to keep in sync by hand and nothing to fabricate.
 */

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { apartments, type Apartment } from '@/data/apartments';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

export type LocationCopy = {
  index: string;
  label: string;
  headline: string[];
  body: string;
};

type Props = {
  /** The collection to map. Defaults to the rentals. */
  items?: Apartment[];
  /** Section copy override — used by the sales collection. */
  sectionCopy?: LocationCopy;
};

export default function LocationSection({ items = apartments, sectionCopy }: Props) {
  const root = useRef<HTMLElement>(null);
  const { t, residence: copy } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 74%' });
      revealFade(el.querySelectorAll('[data-loc-fade]'), { trigger: el, start: 'top 70%' });
    }, el);

    return () => ctx.revert();
  }, []);

  const { index, label, headline, body } = sectionCopy ?? t.location;

  return (
    <section
      ref={root}
      id="location"
      aria-labelledby="location-heading"
      className="relative w-full bg-ivory py-[clamp(5rem,14vh,10rem)]"
    >
      <div className="edge mx-auto max-w-edge">
        <div className="mb-[clamp(2.5rem,7vh,5rem)] flex items-center gap-6">
          <span className="label text-burgundy">{index}</span>
          <span className="h-px w-12 bg-ink/20" />
          <span className="label text-ink/50">{label}</span>
        </div>

        <div className="grid grid-cols-12 items-end gap-y-10">
          <h2 id="location-heading" className="display col-span-12 text-ink lg:col-span-7">
            {headline.map((line) => (
              <span key={line} className="reveal-line">
                <span className="block text-[clamp(2.6rem,8.5vw,7.5rem)]">{line}</span>
              </span>
            ))}
          </h2>
          <p
            data-loc-fade
            className="col-span-12 max-w-sm font-sans text-sm font-light leading-relaxed text-ink/60 opacity-0 lg:col-span-4 lg:col-start-9"
          >
            {body}
          </p>
        </div>

        {/* One card per real listing — no address, no pin, no invented distances. */}
        <div className="mt-[clamp(3rem,9vh,6rem)] grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {items.map((residence) => {
            const text = copy(residence);
            const cover = residence.images[0];

            return (
              <a
                key={residence.id}
                data-loc-fade
                href={residence.listingUrl}
                target={residence.listingUrl ? '_blank' : undefined}
                rel={residence.listingUrl ? 'noreferrer' : undefined}
                className="group relative block aspect-[4/3] w-full overflow-hidden opacity-0 sm:aspect-[16/10]"
              >
                {cover && (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
                  />
                )}

                {/* Grading so type stays legible over any photo */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-burgundy transition-[width] duration-[700ms] ease-expo group-hover:w-full" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <p className="label text-ivory/70">{residence.number}</p>
                  <p className="display mt-1 text-[clamp(1.6rem,3vw,2.2rem)] text-ivory">
                    {text.neighbourhood}
                  </p>
                  <p className="mt-1 font-sans text-xs font-light tracking-wide text-ivory/70">
                    {text.name}
                  </p>

                  <ul className="mt-4 space-y-1.5">
                    {text.proximity.map((line) => (
                      <li
                        key={line}
                        className="font-sans text-xs font-light leading-snug text-ivory/80"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>

                  {residence.listingUrl && (
                    <span className="label mt-5 inline-flex w-fit items-center gap-2 border-b border-ivory/30 pb-1 text-ivory/85 transition-colors duration-200 group-hover:border-burgundy group-hover:text-ivory">
                      {t.cta.viewOnAirbnb}
                      <span aria-hidden>↗</span>
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
