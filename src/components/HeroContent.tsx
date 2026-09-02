'use client';

/**
 * Editorial column of the hero: eyebrow, headline, body, CTA.
 *
 * Both halves take optional copy overrides so the sales collection can reuse
 * the identical hero with its own words; left unset they fall back to the
 * rental copy in `content[locale]`.
 */

import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { useSmoothScroll } from './SmoothScroll';

export type HeroCopy = { eyebrow: string; headline: string[]; body: string };
export type HeroCtaCopy = { hero: string; scroll: string };

export function HeroLead({ copy }: { copy?: HeroCopy }) {
  const { t } = useLocale();
  const { eyebrow, headline, body } = copy ?? t.hero;

  return (
    <div className="max-w-xl">
      <p data-hero-fade className="label mb-6 text-burgundy">
        {eyebrow}
      </p>

      <h1 className="display text-ink">
        {headline.map((line) => (
          <span key={line} data-hero-line className="reveal-line">
            <span className="block text-[clamp(2.8rem,7vw,6.5rem)]">{line}</span>
          </span>
        ))}
      </h1>

      <div data-hero-fade className="my-8 h-px w-20 bg-burgundy" />

      <p
        data-hero-fade
        className="max-w-sm font-sans text-[0.95rem] font-light leading-relaxed text-ink/65"
      >
        {body}
      </p>

    </div>
  );
}

/** CTA + scroll cue. Separate so mobile can place the 3D above it. */
export default function HeroCta({
  cta,
  onNavigate,
  compact = false,
}: {
  cta?: HeroCtaCopy;
  /** Scrolls to an in-page anchor. Falls back to the plain smooth-scroll if the
   *  hero hasn't wired in its render-loop-aware version (see Hero.tsx). */
  onNavigate?: (target: string) => void;
  /** Desktop footer variant: the CTA sits beside the 360 controls, so the
   *  secondary scroll/location copy is omitted and no top margin is needed. */
  compact?: boolean;
}) {
  const { t } = useLocale();
  const { scrollTo } = useSmoothScroll();
  const c = cta ?? t.cta;
  const navigate = onNavigate ?? scrollTo;

  return (
    <div className={compact ? 'max-w-[22rem]' : 'max-w-xl'}>
      <a
        data-hero-fade
        href="#residences"
        onClick={(e) => {
          e.preventDefault();
          navigate('#residences');
        }}
        className={`group pointer-events-auto flex w-full items-center justify-between bg-burgundy transition-colors duration-200 hover:bg-burgundy-soft ${
          compact ? 'gap-5 px-7 py-4' : 'mt-10 gap-6 px-9 py-5'
        }`}
      >
        <span className="label text-ivory">{c.hero}</span>
        <span
          aria-hidden
          className="text-ivory transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
        >
          &rarr;
        </span>
      </a>

      {!compact && (
        <div data-hero-fade className="mt-12 hidden lg:block">
          <a
            href="#intro"
            onClick={(e) => {
              e.preventDefault();
              navigate('#intro');
            }}
            className="group pointer-events-auto inline-flex items-center gap-3"
            aria-label={c.scroll}
          >
            <span className="label text-ink/50 transition-colors duration-200 group-hover:text-ink">
              {c.scroll}
            </span>
            <span
              aria-hidden
              className="text-ink/50 transition-transform duration-300 ease-expo group-hover:translate-y-1"
            >
              &darr;
            </span>
          </a>
        </div>
      )}

      {/* Matches the location line style used elsewhere on the site. */}
      {!compact && (
        <p data-hero-fade className="label mt-10 text-ink/35 lg:hidden">
          {t.location.city}, {t.location.country} &mdash; {siteConfig.brand.established}
        </p>
      )}
    </div>
  );
}
