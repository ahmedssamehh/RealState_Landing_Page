'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Apartment } from '@/data/apartments';
import { useLocale } from '@/lib/locale';
import { useSmoothScroll } from './SmoothScroll';
import { gsap, registerGsap, revealFade, revealImage } from '@/lib/animations';

type Props = {
  residence: Apartment;
  /** Alternates the editorial layout: image left on even indices, right on odd. */
  index: number;
  onOpen: (residence: Apartment) => void;
  onOpenPhotos: (residence: Apartment) => void;
};

export default function Residence({ residence, index, onOpen, onOpenPhotos }: Props) {
  const root = useRef<HTMLElement>(null);
  const { locale, t, residence: copy, status, price } = useLocale();
  const { scrollTo } = useSmoothScroll();
  const [photo, setPhoto] = useState(0);
  /**
   * Only photographs the visitor has actually reached are mounted. The first
   * one loads with the card; the rest are fetched the moment they are first
   * shown, so a four-photo card still costs one image on load.
   */
  const [seen, setSeen] = useState<number[]>([0]);
  const photoCount = residence.images.length;
  const text = copy(residence);
  const figure = useRef<HTMLDivElement>(null);

  const flipped = index % 2 === 1;
  const canExplore = residence.dataStatus !== 'pending';
  const canViewAllPhotos = Boolean(residence.photoSections?.some((section) => section.images.length > 0));
  const labels = locale === 'el'
    ? { guests: 'ΕΠΙΣΚΕΠΤΕΣ', beds: 'ΚΡΕΒΑΤΙΑ', availability: 'ΔΙΑΘΕΣΙΜΟΤΗΤΑ', details: 'ΠΡΟΒΟΛΗ ΟΛΩΝ ΤΩΝ ΛΕΠΤΟΜΕΡΕΙΩΝ' }
    : { guests: 'GUESTS', beds: 'BEDS', availability: 'AVAILABILITY', details: 'VIEW ALL DETAILS' };

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (figure.current) revealImage(figure.current, el);
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

  const open = () => canExplore && onOpen(residence);
  const openPhotos = () => canExplore && onOpenPhotos(residence);

  /** Arrows and dots must not open the detail popup. */
  const step = useCallback(
    (dir: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setPhoto((p) => {
        const next = (p + dir + photoCount) % photoCount;
        setSeen((prev) => (prev.includes(next) ? prev : [...prev, next]));
        return next;
      });
    },
    [photoCount]
  );

  return (
    <article
      ref={root}
      aria-labelledby={`${residence.id}-title`}
      className="relative border-t border-ink/10 bg-ivory py-[clamp(4rem,9vh,7rem)]"
    >
      <div className="grid grid-cols-12 items-center gap-y-10 lg:gap-x-[clamp(2rem,5vw,6rem)]">
        {/* -------------------------------------------------- Image */}
        <div
          className={`col-span-12 lg:col-span-7 ${
            flipped ? 'lg:order-2 lg:col-start-6' : 'lg:order-1'
          }`}
        >
          {/* The whole plate opens the residence; the arrows and dots below
              switch photographs without leaving the page. */}
          <div className="group relative w-full">
            <button
              type="button"
              onClick={open}
              disabled={!canExplore}
              aria-label={`${t.ui.viewAria} ${text.name}`}
              className="relative block w-full cursor-pointer overflow-hidden text-left disabled:cursor-default"
            >
              <div
                ref={figure}
                className="relative aspect-[4/5] w-full overflow-hidden bg-ink/10 sm:aspect-[16/10] lg:aspect-[4/3]"
              >
                <div className="absolute inset-0">
                  {residence.images.map((img, i) =>
                    seen.includes(i) ? (
                      <Image
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className={`object-contain transition-opacity duration-300 ${
                          i === photo ? 'opacity-100' : 'opacity-0'
                        }`}
                        priority={index === 0 && i === 0}
                        loading={index === 0 && i === 0 ? undefined : 'lazy'}
                      />
                    ) : null
                  )}
                </div>

                {/* Grading + hover veil */}
                <div className="pointer-events-none absolute inset-0 bg-ink/10 transition-colors duration-500 group-hover:bg-ink/20" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/5" />
                {/* Burgundy accent, drawn on hover */}
                <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-burgundy transition-[width] duration-[500ms] ease-expo group-hover:w-full" />

                {/* Status marker */}
                <span className="label absolute left-6 top-6 text-ivory">{status(residence)}</span>

              </div>
            </button>

            {/* Photo switcher */}
            {photoCount > 1 && canExplore && (
              <>
                <button
                  type="button"
                  onClick={step(-1)}
                  aria-label={t.ui.previousImage}
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/45 bg-ink/45 text-ivory backdrop-blur-sm transition-[background-color,opacity] duration-300 hover:bg-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <span aria-hidden>&larr;</span>
                </button>
                <button
                  type="button"
                  onClick={step(1)}
                  aria-label={t.ui.nextImage}
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/45 bg-ink/45 text-ivory backdrop-blur-sm transition-[background-color,opacity] duration-300 hover:bg-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <span aria-hidden>&rarr;</span>
                </button>

                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  {residence.images.map((img, i) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhoto(i);
                        setSeen((prev) => (prev.includes(i) ? prev : [...prev, i]));
                      }}
                      aria-label={`${t.ui.photo} ${i + 1}`}
                      aria-current={i === photo}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === photo ? 'w-6 bg-ivory' : 'w-1.5 bg-ivory/50 hover:bg-ivory/80'
                      }`}
                    />
                  ))}
                </div>
                {canViewAllPhotos && <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openPhotos();
                  }}
                  className="label absolute bottom-5 right-5 z-[3] min-h-12 border border-burgundy bg-burgundy px-5 text-ivory shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
                >
                  {locale === 'el' ? 'ΠΡΟΒΟΛΗ ΟΛΩΝ ΤΩΝ ΦΩΤΟΓΡΑΦΙΩΝ' : 'VIEW ALL PHOTOS'}
                </button>}
              </>
            )}
          </div>
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
            {residence.guests != null && <div>
              <dt className="label text-ink/45">{labels.guests}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">{residence.guests}</dd>
            </div>}
            {residence.area && <div>
              <dt className="label text-ink/45">{t.ui.area}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">{residence.area}</dd>
            </div>}
            <div>
              <dt className="label text-ink/45">{t.ui.level}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">{text.level}</dd>
            </div>
            {residence.bedrooms != null && <div>
              <dt className="label text-ink/45">{t.ui.bedrooms}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">
                {residence.bedrooms}
              </dd>
            </div>}
            {residence.bathrooms != null && <div>
              <dt className="label text-ink/45">{t.ui.bathrooms}</dt>
              <dd className="mt-2 font-serif text-2xl font-light text-ink">
                {residence.bathrooms}
              </dd>
            </div>}
          </dl>

          {/* Price leads the card — a monthly rent for a letting, the asking
              price for a sale. A residence carries one or the other. */}
          {residence.rent != null && <div data-res-fade className="mt-8 flex items-baseline gap-3 opacity-0">
            <span className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light text-ink">
              {price(residence.rent)}
            </span>
            <span className="label text-ink/50">{t.ui.perMonth}</span>
          </div>}
          {residence.salePrice != null && <div data-res-fade className="mt-8 flex items-baseline gap-3 opacity-0">
            <span className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light text-ink">
              {price(residence.salePrice)}
            </span>
            <span className="label text-ink/50">{t.ui.askingPrice}</span>
          </div>}
          <div data-res-fade className="mt-6 border-t border-ink/15 pt-5 opacity-0">
            <p className="label text-burgundy">{labels.availability}</p>
            <p className="label mt-2 text-ink/55">{text.availableFrom}</p>
          </div>
          {canExplore && (
            <div data-res-fade className="mt-7 grid w-full gap-3 opacity-0">
              {residence.listingUrl && (
                <a
                  href={residence.listingUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${locale === 'el' ? 'Έλεγχος διαθεσιμότητας στο Airbnb' : 'Check availability on Airbnb'} — ${text.name}`}
                  className="group inline-flex min-h-16 w-full items-stretch border-2 border-burgundy bg-burgundy shadow-[0_10px_26px_rgba(99,0,0,0.16)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_34px_rgba(99,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  <span className="flex flex-1 flex-col justify-center px-5 py-3">
                    <span className="block text-[9px] tracking-[0.24em] text-ivory/65">
                      {locale === 'el' ? 'ΖΩΝΤΑΝΕΣ ΗΜΕΡΟΜΗΝΙΕΣ & ΚΡΑΤΗΣΗ' : 'LIVE DATES & BOOKING'}
                    </span>
                    <span className="label mt-1 block text-ivory">
                      {locale === 'el' ? 'ΕΛΕΓΧΟΣ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ ΣΤΟ AIRBNB' : 'CHECK AVAILABILITY ON AIRBNB'}
                    </span>
                  </span>
                  <span aria-hidden className="flex min-w-14 items-center justify-center border-l border-ivory/25 text-xl text-ivory transition-colors duration-200 group-hover:bg-burgundy">↗</span>
                </a>
              )}
              {/* A sale has no live booking link — this scrolls to the contact section instead. */}
              {!residence.listingUrl && residence.salePrice != null && (
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#contact');
                  }}
                  aria-label={`${t.ui.contactUs} — ${text.name}`}
                  className="group inline-flex min-h-16 w-full items-stretch border-2 border-burgundy bg-burgundy shadow-[0_10px_26px_rgba(99,0,0,0.16)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_34px_rgba(99,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  <span className="flex flex-1 flex-col justify-center px-5 py-3">
                    <span className="block text-[9px] tracking-[0.24em] text-ivory/65">
                      {t.ui.viewingEnquiries}
                    </span>
                    <span className="label mt-1 block text-ivory">{t.ui.contactUs}</span>
                  </span>
                  <span aria-hidden className="flex min-w-14 items-center justify-center border-l border-ivory/25 text-xl text-ivory transition-colors duration-200 group-hover:bg-burgundy">→</span>
                </a>
              )}
              <button
                type="button"
                onClick={open}
                aria-haspopup="dialog"
                aria-label={`${labels.details} — ${text.name}`}
                className="group inline-flex min-h-14 w-full items-center justify-between border border-ink/25 bg-ivory px-5 py-4 text-left transition-[border-color,background-color] duration-300 hover:border-ink hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
              >
                <span className="label text-ink transition-colors group-hover:text-ivory">{labels.details}</span>
                <span aria-hidden className="text-lg text-burgundy transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
