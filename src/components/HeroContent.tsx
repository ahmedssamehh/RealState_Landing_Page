'use client';

/** Editorial column of the hero: eyebrow, headline, body, CTA. */

import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { useSmoothScroll } from './SmoothScroll';

export function HeroLead() {
  const { t } = useLocale();
  const { eyebrow, headline, body } = t.hero;

  return (
    <div className="max-w-xl">
      <p data-hero-fade className="label mb-6 text-burgundy opacity-0">
        {eyebrow}
      </p>

      <h1 className="display text-ink">
        {headline.map((line) => (
          <span key={line} data-hero-line className="reveal-line">
            <span className="block text-[clamp(2.8rem,7vw,6.5rem)]">{line}</span>
          </span>
        ))}
      </h1>

      <div data-hero-fade className="my-8 h-px w-20 bg-burgundy opacity-0" />

      <p
        data-hero-fade
        className="max-w-sm font-sans text-[0.95rem] font-light leading-relaxed text-ink/65 opacity-0"
      >
        {body}
      </p>

    </div>
  );
}

/** CTA + scroll cue. Separate so mobile can place the 3D above it. */
export default function HeroCta() {
  const { t } = useLocale();
  const { scrollTo } = useSmoothScroll();

  return (
    <div className="max-w-xl">
      <a
        data-hero-fade
        href="#residences"
        onClick={(e) => {
          e.preventDefault();
          scrollTo('#residences');
        }}
        className="group pointer-events-auto mt-10 inline-flex items-center gap-6 bg-burgundy px-9 py-5 opacity-0 transition-colors duration-200 hover:bg-burgundy-soft"
      >
        <span className="label text-ivory">{t.cta.hero}</span>
        <span
          aria-hidden
          className="text-ivory transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
        >
          &rarr;
        </span>
      </a>

      <div data-hero-fade className="mt-12 hidden opacity-0 lg:block">
        <a
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#intro');
          }}
          className="group pointer-events-auto inline-flex items-center gap-3"
          aria-label={t.cta.scroll}
        >
          <span className="label text-ink/50 transition-colors duration-200 group-hover:text-ink">
            {t.cta.scroll}
          </span>
          <span
            aria-hidden
            className="text-ink/50 transition-transform duration-300 ease-expo group-hover:translate-y-1"
          >
            &darr;
          </span>
        </a>
      </div>

      {/* DEMO location line, matching the rest of the site */}
      <p data-hero-fade className="label mt-10 text-ink/35 opacity-0 lg:hidden">
        {t.location.city}, {t.location.country} &mdash; {siteConfig.brand.established}
      </p>
    </div>
  );
}
