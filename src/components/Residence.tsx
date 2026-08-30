'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Apartment } from '@/data/apartments';
import { useLocale } from '@/lib/locale';
import { gsap, parallax, registerGsap, revealFade, revealImage } from '@/lib/animations';

type Props = {
  residence: Apartment;
  /** Alternates the editorial layout: image left on even indices, right on odd. */
  index: number;
  onOpen: (residence: Apartment) => void;
};

export default function Residence({ residence, index, onOpen }: Props) {
  const root = useRef<HTMLElement>(null);
  const { t, residence: copy, status, price } = useLocale();
  const text = copy(residence);
  const figure = useRef<HTMLDivElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);

  const flipped = index % 2 === 1;

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (figure.current) revealImage(figure.current, el);
      if (imageWrap.current) parallax(imageWrap.current, el, 10);
      revealFade(el.querySelectorAll('[data-res-fade]'), { trigger: el, start: 'top 72%' });
      gsap.fromTo(
        el.querySelector('[data-res-number]'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 78%' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const open = () => onOpen(residence);

  return (
    <article
      ref={root}
      aria-labelledby={`${residence.id}-title`}
      className={`relative py-[clamp(4rem,12vh,9rem)] ${
        flipped ? 'bg-champagne' : 'bg-ivory'
      }`}
    >
      <div className="grid grid-cols-12 items-center gap-y-10 lg:gap-x-[clamp(2rem,5vw,6rem)]">
        {/* -------------------------------------------------- Image */}
        <div
          className={`col-span-12 lg:col-span-7 ${
            flipped ? 'lg:order-2 lg:col-start-6' : 'lg:order-1'
          }`}
        >
          <button
            type="button"
            onClick={open}
            data-cursor="view"
            aria-label={`${t.ui.viewAria} ${text.name}`}
            className="group relative block w-full overflow-hidden text-left"
          >
            <div
              ref={figure}
              className="relative aspect-[4/5] w-full overflow-hidden bg-ink/10 sm:aspect-[16/10] lg:aspect-[4/3]"
            >
              <div ref={imageWrap} className="absolute inset-[-6%]">
                <Image
                  src={residence.images[0].src}
                  alt={residence.images[0].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-[600ms] ease-expo group-hover:scale-[1.05]"
                  priority={index === 0}
                />
              </div>

              {/* Grading + hover veil */}
              <div className="pointer-events-none absolute inset-0 bg-ink/20 transition-colors duration-300 group-hover:bg-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              {/* Burgundy accent, drawn on hover */}
              <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-burgundy transition-[width] duration-[500ms] ease-expo group-hover:w-full" />

              {/* Status marker */}
              <span className="label absolute left-6 top-6 text-ivory">{status(residence)}</span>
            </div>
          </button>
        </div>

        {/* -------------------------------------------------- Detail column */}
        <div
          className={`col-span-12 lg:col-span-4 ${
            flipped ? 'lg:order-1 lg:col-start-2' : 'lg:order-2 lg:col-start-9'
          }`}
        >
          <span
            data-res-number
            aria-hidden
            className="display block text-[clamp(4rem,11vw,9rem)] leading-none text-transparent opacity-0 [-webkit-text-stroke:1px_rgba(0,0,0,0.28)]"
          >
            {residence.number}
          </span>

          <h3
            id={`${residence.id}-title`}
            data-res-fade
            className="display mt-4 text-[clamp(2rem,4.2vw,3.4rem)] text-ink opacity-0"
          >
            {text.name}
          </h3>
          <p data-res-fade className="label mt-4 text-burgundy opacity-0">
            {text.subtitle}
          </p>

          <p
            data-res-fade
            className="mt-8 max-w-sm font-sans text-sm font-light leading-relaxed text-ink/65 opacity-0"
          >
            {text.description}
          </p>

          {/* Vitals */}
          <dl
            data-res-fade
            className="mt-10 grid grid-cols-2 gap-y-6 border-t border-ink/15 pt-8 opacity-0 sm:grid-cols-4 lg:grid-cols-2"
          >
            <div>
              <dt className="label text-ink/45">{t.ui.area}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">{residence.area}</dd>
            </div>
            <div>
              <dt className="label text-ink/45">{t.ui.level}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">{text.level}</dd>
            </div>
            <div>
              <dt className="label text-ink/45">{t.ui.bedrooms}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">
                {residence.bedrooms}
              </dd>
            </div>
            <div>
              <dt className="label text-ink/45">{t.ui.bathrooms}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">
                {residence.bathrooms}
              </dd>
            </div>
          </dl>

          {/* Rent leads the card — this is a letting, not a sale. */}
          <div data-res-fade className="mt-8 flex items-baseline gap-3 opacity-0">
            <span className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light text-ink">
              {price(residence.rent)}
            </span>
            <span className="label text-ink/50">{t.ui.perMonth}</span>
          </div>
          <p data-res-fade className="label mt-3 text-ink/50 opacity-0">
            {text.availableFrom}
          </p>

          <button
            type="button"
            onClick={open}
            data-cursor="button"
            className="group mt-9 inline-flex items-center gap-4 border-b border-ink/25 pb-3 transition-colors duration-200 hover:border-burgundy"
          >
            <span data-res-fade className="label text-ink opacity-0">
              {t.cta.viewResidence}
            </span>
            <span
              aria-hidden
              className="text-ink transition-transform duration-300 ease-expo group-hover:translate-x-2"
            >
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
