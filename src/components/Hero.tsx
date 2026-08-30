'use client';

import { useEffect, useRef } from 'react';
import HeroVisual from './HeroVisual';
import { siteConfig } from '@/data/siteConfig';
import { apartments } from '@/data/apartments';
import { useLocale } from '@/lib/locale';
import {
  DURATION,
  EASE,
  ScrollTrigger,
  prefersReducedMotion,
  registerGsap,
} from '@/lib/animations';

type Props = {
  /** Flips true when the loading screen has handed the page over. */
  ready: boolean;
};

export default function Hero({ ready }: Props) {
  const root = useRef<HTMLElement>(null);
  const scroll = useRef(0);
  const { t } = useLocale();

  /* Hero scroll progress (0-1), shared with the 3D rig and the fade-out. */
  useEffect(() => {
    const gsap = registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scroll.current = self.progress;
        },
      });

      if (!prefersReducedMotion()) {
        gsap.to('[data-hero-content]', {
          opacity: 0,
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: '60% top', scrub: true },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  /* Entrance choreography, held until the loading curtain lifts. */
  useEffect(() => {
    if (!ready) return;
    const gsap = registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set('[data-hero-line] > span, [data-hero-fade]', { yPercent: 0, opacity: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .fromTo(
          '[data-hero-visual]',
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: DURATION.cinematic }
        )
        .fromTo(
          '[data-hero-line] > span',
          { yPercent: 118 },
          { yPercent: 0, duration: DURATION.slow, stagger: 0.11 },
          '-=1.7'
        )
        .fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: DURATION.base, stagger: 0.09 },
          '-=1.1'
        );
    }, el);

    return () => ctx.revert();
  }, [ready]);

  const { headline, subline, eyebrow } = t.hero;

  return (
    <section
      ref={root}
      id="hero"
      aria-label="Introduction"
      className="grain relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      {/* 3D architecture / cinematic film */}
      <div data-hero-visual className="absolute inset-0 opacity-0">
        <HeroVisual scrollRef={scroll} />
      </div>

      {/* Cinematic grading over the visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_35%,transparent_20%,rgba(0,0,0,0.72)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />

      {/* Architectural grid lines */}
      <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 text-ivory" />

      {/* ---------------------------------------------------------------- */}
      {/* Editorial composition - deliberately asymmetric                   */}
      {/* ---------------------------------------------------------------- */}
      <div
        data-hero-content
        className="edge relative z-10 mx-auto flex h-full max-w-edge flex-col justify-end pb-[max(2.5rem,7vh)] pt-28"
      >
        <div className="grid grid-cols-12 items-end gap-y-10">
          {/* Headline */}
          <div className="col-span-12 lg:col-span-7">
            <p data-hero-fade className="label mb-8 text-champagne/70 opacity-0">
              {eyebrow} &mdash; {apartments.length.toString().padStart(2, '0')}
            </p>
            <h1 className="display text-ivory">
              {headline.map((line) => (
                <span key={line} data-hero-line className="reveal-line">
                  <span className="block text-[clamp(2.9rem,9vw,8.5rem)]">{line}</span>
                </span>
              ))}
            </h1>
          </div>

          {/* Supporting column, dropped low and to the right */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pb-4">
            <div data-hero-fade className="mb-6 h-px w-16 bg-burgundy opacity-0" />
            <p
              data-hero-fade
              className="max-w-xs font-sans text-sm font-light leading-relaxed tracking-wide text-champagne opacity-0"
            >
              {subline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <a
              data-hero-fade
              href="#residences"
              data-cursor="button"
              className="group mt-10 inline-flex items-center gap-4 border-b border-ivory/25 pb-3 opacity-0 transition-colors duration-200 hover:border-burgundy"
            >
              <span className="label text-ivory">{t.cta.hero}</span>
              <span
                aria-hidden
                className="text-ivory transition-transform duration-300 ease-expo group-hover:translate-x-2"
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>

        {/* Baseline: scroll cue + vitals */}
        <div className="mt-14 flex items-end justify-between border-t border-ivory/10 pt-6">
          <a
            data-hero-fade
            href="#intro"
            data-cursor="button"
            className="group flex items-center gap-3 opacity-0"
            aria-label={t.cta.scroll}
          >
            <span className="label text-champagne/60">{t.cta.scroll}</span>
            <span
              aria-hidden
              className="text-champagne/60 transition-transform duration-300 ease-expo group-hover:translate-y-1"
            >
              &darr;
            </span>
          </a>

          <div data-hero-fade className="hidden gap-12 opacity-0 sm:flex">
            <p className="label text-champagne/50">
              {t.location.city}, {t.location.country}
            </p>
            <p className="label text-champagne/50">{siteConfig.brand.established}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
