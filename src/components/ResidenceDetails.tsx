'use client';

/**
 * Residence popup. The page stays exactly where it is and is blurred back
 * (see `[data-page-shell]` in page.tsx); this panel scales up over it and owns
 * its own scroll. No route change, no full-page takeover.
 *
 * The gallery is swipeable: flick on touch, drag or arrow keys on desktop,
 * one photograph per view with a counter and dots.
 */

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Apartment } from '@/data/apartments';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { EASE, gsap, prefersReducedMotion, registerGsap } from '@/lib/animations';
import { useSmoothScroll } from './SmoothScroll';
import PhotoTour from './PhotoTour';

type Props = {
  residence: Apartment | null;
  initialView?: 'details' | 'photos';
  onClose: () => void;
};

export default function ResidenceDetails({ residence, initialView = 'details', onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showPhotoTour, setShowPhotoTour] = useState(false);
  const { lock, unlock, scrollTo } = useSmoothScroll();
  const { locale, t, residence: copy, status, price } = useLocale();

  const open = Boolean(residence);
  const previewImages = residence?.images.slice(0, 4) ?? [];
  const count = previewImages.length;

  /* ------------------------------------------------------------------ */
  /* Open                                                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!open) return;
    registerGsap();
    const el = root.current;
    if (!el) return;

    lock();
    el.scrollTop = 0;
    setActive(0);
    setShowPhotoTour(initialView === 'photos');
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1, pointerEvents: 'auto' });
      if (reduced) return;

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 })
        .fromTo(
          panel.current,
          { y: 28, scale: 0.985, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.4 },
          '-=0.12'
        );

      el.querySelectorAll<HTMLElement>('section').forEach((section) => {
        gsap.fromTo(
          section,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: EASE.expo,
            scrollTrigger: {
              trigger: section,
              scroller: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    }, el);

    return () => {
      ctx.revert();
      unlock();
    };
  }, [open, lock, unlock, initialView]);

  /**
   * Closing is synchronous on purpose. Gating the state change on a tween's
   * onComplete leaves the popup stuck open if the ticker ever stalls (a
   * backgrounded tab, a throttled device), and an instant dismiss reads as
   * faster anyway. The page behind un-blurs on its own CSS transition.
   */
  const close = useCallback(() => {
    const el = root.current;
    if (el) gsap.set(el, { autoAlpha: 0, pointerEvents: 'none', opacity: 1 });
    onClose();
  }, [onClose]);

  /* ------------------------------------------------------------------ */
  /* Gallery                                                            */
  /* ------------------------------------------------------------------ */
  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      const next = Math.min(Math.max(index, 0), count - 1);
      setActive(next);
      const el = track.current;
      if (el) {
        el.scrollTo({
          left: next * el.clientWidth,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }
    },
    [count]
  );

  /* Keep the counter in step with a finger swipe. */
  useEffect(() => {
    const el = track.current;
    if (!el || !open) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActive((prev) => (prev === index ? prev : index));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  /* Mouse drag, for desktop visitors who expect to pull the strip. */
  useEffect(() => {
    const el = track.current;
    if (!el || !open) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // native swipe already handles this
      down = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.scrollSnapType = 'none';
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = '';
      goTo(Math.round(el.scrollLeft / el.clientWidth));
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [open, goTo]);

  /* Escape closes; arrows move through the gallery. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') goTo(active + 1);
      if (e.key === 'ArrowLeft') goTo(active - 1);
    };
    window.addEventListener('keydown', onKey);
    root.current?.querySelector<HTMLButtonElement>('[data-detail-close]')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, goTo, active]);

  if (!residence) return null;

  const text = copy(residence);

  const labels = locale === 'el'
    ? {
        guests: 'ΕΠΙΣΚΕΠΤΕΣ', beds: 'ΚΡΕΒΑΤΙΑ', reviews: 'ΚΡΙΤΙΚΕΣ',
        hostedBy: 'ΟΙΚΟΔΕΣΠΟΤΗΣ', registration: 'ΑΡΙΘΜΟΣ ΜΗΤΡΩΟΥ',
        amenities: 'ΠΑΡΟΧΕΣ', extraServices: 'ΠΡΟΣΘΕΤΕΣ ΥΠΗΡΕΣΙΕΣ',
        importantNotes: 'ΣΗΜΑΝΤΙΚΕΣ ΣΗΜΕΙΩΣΕΙΣ',
        checkAvailability: 'ΕΛΕΓΧΟΣ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ ΣΤΟ AIRBNB',
      }
    : {
        guests: 'GUESTS', beds: 'BEDS', reviews: 'REVIEWS', hostedBy: 'HOSTED BY',
        registration: 'REGISTRATION', amenities: 'AMENITIES',
        extraServices: 'EXTRA SERVICES', importantNotes: 'IMPORTANT NOTES',
        checkAvailability: 'CHECK AVAILABILITY ON AIRBNB',
      };

  const spec: Array<{ k: string; v: string | number }> = [];
  if (residence.guests != null) spec.push({ k: labels.guests, v: residence.guests });
  if (residence.bedrooms != null) spec.push({ k: t.ui.bedrooms, v: residence.bedrooms });
  if (residence.beds != null) spec.push({ k: labels.beds, v: residence.beds });
  if (residence.bathrooms != null) spec.push({ k: t.ui.bathrooms, v: residence.bathrooms });
  if (residence.area) spec.push({ k: t.ui.area, v: residence.area });

  return (
    <div
      ref={root}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      role="dialog"
      aria-modal="true"
      aria-label={`${text.name} ${t.ui.detailAria}`}
      className="fixed inset-0 z-[80] h-svh touch-pan-y overflow-y-scroll overscroll-contain bg-ink/45 p-0 [scrollbar-color:#630000_transparent] [scrollbar-width:thin] sm:px-6 sm:py-8 md:px-10"
      style={{ visibility: 'hidden', opacity: 0 }}
    >
      {/* Click-away. The blur itself lives on the page shell behind. */}
      <button
        type="button"
        aria-label={t.ui.close}
        tabIndex={-1}
        onClick={close}
        className="fixed inset-0 h-full w-full cursor-default bg-ink/45"
      />

      <div
        ref={panel}
        className="relative z-[1] mx-auto min-h-full w-full max-w-7xl overflow-visible bg-ivory shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
      >
        {/* ------------------------------------------------ Gallery */}
        <div className="relative h-[48svh] min-h-[320px] bg-ink/10 sm:h-[58svh] sm:min-h-[460px] lg:h-[64svh]">
          <div
            ref={track}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {previewImages.map((img, i) => (
              <figure
                key={img.src}
                className="relative h-full w-full flex-none snap-center"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 64rem"
                  className="select-none object-contain"
                  draggable={false}
                  priority={i === 0}
                />
              </figure>
            ))}
          </div>

          {/* Status + counter */}
          <span className="label pointer-events-none absolute left-5 top-5 text-ivory drop-shadow">
            {status(residence)}
          </span>
          <span className="label pointer-events-none absolute bottom-5 left-5 text-ivory drop-shadow">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>

          {/* Chevrons */}
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label={t.ui.previousImage}
            className="label absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ivory/40 bg-ink/30 text-ivory backdrop-blur-sm transition-colors duration-200 hover:bg-burgundy disabled:opacity-0"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === count - 1}
            aria-label={t.ui.nextImage}
            className="label absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ivory/40 bg-ink/30 text-ivory backdrop-blur-sm transition-colors duration-200 hover:bg-burgundy disabled:opacity-0"
          >
            &rarr;
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {previewImages.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}`}
                aria-current={i === active}
                className={`h-1 transition-all duration-200 ${
                  i === active ? 'w-7 bg-ivory' : 'w-3 bg-ivory/45 hover:bg-ivory/70'
                }`}
              />
            ))}
          </div>

          {/* Close */}
          <button
            data-detail-close
            type="button"
            onClick={close}
            className="fixed right-4 top-4 z-[5] flex min-h-11 items-center gap-2 border border-burgundy bg-burgundy px-4 py-2 text-ivory backdrop-blur-md transition-colors duration-200 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy sm:right-10 sm:top-10 md:right-14 md:top-14"
          >
            <span aria-hidden className="text-base leading-none">
              &times;
            </span>
            <span className="label">{t.ui.close}</span>
          </button>

          {residence.photoSections && residence.photoSections.some((section) => section.images.length > 0) && (
            <button
              type="button"
              onClick={() => setShowPhotoTour(true)}
              className="label absolute bottom-4 right-4 border border-ivory/45 bg-ink/55 px-4 py-3 text-ivory backdrop-blur-sm transition-colors hover:bg-burgundy"
            >
              {locale === 'el' ? 'ΠΡΟΒΟΛΗ ΟΛΩΝ ΤΩΝ ΦΩΤΟΓΡΑΦΙΩΝ' : 'VIEW ALL PHOTOS'}
            </button>
          )}

          <div className="pointer-events-none absolute bottom-0 left-1/2 z-[2] -translate-x-1/2 translate-y-1/2 bg-ivory px-5 py-3 text-center shadow-sm">
            <span className="label whitespace-nowrap text-burgundy">
              {locale === 'el' ? 'ΚΥΛΗΣΤΕ ΓΙΑ ΟΛΕΣ ΤΙΣ ΛΕΠΤΟΜΕΡΕΙΕΣ ↓' : 'SCROLL FOR ALL DETAILS ↓'}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------ Detail */}
        <div className="px-6 pb-16 pt-16 sm:px-10 sm:pb-20 sm:pt-20 lg:px-[clamp(3.5rem,7vw,7rem)]">
          <div className="grid gap-8 border-b border-ink/15 pb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-4xl">
              {/* "RESIDENCE" reads as short-stay lodging (matches ΚΑΤΑΛΥΜΑ in Greek) —
                  wrong register for a sale, so this swaps to "PROPERTY" there. */}
              <p className="label mb-3 text-burgundy">
                {residence.salePrice != null ? t.nav.property : t.ui.residence} {residence.number} &mdash; {text.subtitle}
              </p>
              <h2 className="display text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.9] text-ink">{text.name}</h2>
              {/* Driven by the listing, never hardcoded — this popup renders
                  every residence in both collections. */}
              <p className="label mt-7 text-ink/45">
                {text.neighbourhood} &middot; {text.orientation}
              </p>
            </div>
            {residence.rent != null && <div className="text-left sm:text-right">
              <p className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-none text-ink">
                {price(residence.rent)}
              </p>
              <p className="label mt-2 text-ink/50">{t.ui.perMonth}</p>
            </div>}
            {residence.salePrice != null && <div className="text-left sm:text-right">
              <p className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-none text-ink">
                {price(residence.salePrice)}
              </p>
              <p className="label mt-2 text-ink/50">{t.ui.askingPrice}</p>
            </div>}
            {residence.listingUrl && (
              <a
                href={residence.listingUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${labels.checkAvailability} — ${text.name}`}
                className="group inline-flex min-h-14 items-stretch border-2 border-burgundy bg-burgundy text-left shadow-[0_10px_26px_rgba(99,0,0,0.18)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_34px_rgba(99,0,0,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
              >
                <span className="flex flex-col justify-center px-6 py-3">
                  <span className="block text-[9px] tracking-[0.22em] text-ivory/70">
                    {locale === 'el' ? 'ΖΩΝΤΑΝΕΣ ΗΜΕΡΟΜΗΝΙΕΣ & ΚΡΑΤΗΣΗ' : 'LIVE DATES & BOOKING'}
                  </span>
                  <span className="label mt-1 block text-ivory">{labels.checkAvailability}</span>
                </span>
                <span aria-hidden className="flex min-w-14 items-center justify-center border-l border-ivory/30 text-xl text-ivory transition-colors group-hover:bg-burgundy">↗</span>
              </a>
            )}
          </div>

          {spec.length > 0 && <dl className="grid grid-cols-2 border-b border-ink/15 md:grid-cols-4">
            {spec.map((row) => (
              <div key={row.k} className="border-r border-ink/15 px-4 py-8 first:pl-0 last:border-r-0 md:px-8">
                <dt className="label text-ink/45">{row.k}</dt>
                <dd className="mt-3 font-serif text-3xl font-light text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>}

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:gap-20">
            <section>
              <div className="mb-8 flex items-center gap-5">
                <span className="label text-burgundy">01</span>
                <div className="h-px flex-1 bg-ink/15" />
                <p className="label text-burgundy">{t.ui.description}</p>
              </div>
              <p className="max-w-3xl font-serif text-[clamp(1.45rem,2.4vw,2.15rem)] font-light leading-[1.42] text-ink/85">
                {text.description}
              </p>

              <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-ink/15 pt-8 sm:grid-cols-2">
                <div>
                  <dt className="label text-ink/45">{t.ui.availability}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {text.availableFrom}
                  </dd>
                </div>
                {residence.rating != null && <div>
                  <dt className="label text-ink/45">{labels.reviews}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {residence.rating.toFixed(1)} / 5 · {residence.reviewCount} {labels.reviews.toLowerCase()}
                  </dd>
                </div>}
                {residence.host && <div>
                  <dt className="label text-ink/45">{labels.hostedBy}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {residence.host}{residence.hostBadge ? ` · ${residence.hostBadge}` : ''}
                  </dd>
                </div>}
                {residence.registrationNumber && <div>
                  <dt className="label text-ink/45">{labels.registration}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {residence.registrationNumber}
                  </dd>
                </div>}
                {residence.minimumTermMonths != null && <div>
                  <dt className="label text-ink/45">{t.ui.minimumTerm}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {residence.minimumTermMonths} {t.ui.months}
                  </dd>
                </div>}
                {residence.yearBuilt != null && <div>
                  <dt className="label text-ink/45">{t.ui.yearBuilt}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {residence.yearBuilt}
                  </dd>
                </div>}
                {text.commonExpenses && <div>
                  <dt className="label text-ink/45">{t.ui.commonExpenses}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {text.commonExpenses}
                  </dd>
                </div>}
              </dl>
            </section>

            <aside className="bg-burgundy p-7 text-ivory sm:p-9">
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="label text-ivory">{t.ui.features}</p>
                <span className="label text-ivory/45">02</span>
              </div>
              <ul>
                {text.features.map((f) => (
                  <li
                    key={f}
                    className="label flex items-center justify-between border-b border-ivory/20 py-4 text-ivory/85"
                  >
                    {f}
                    <span aria-hidden className="text-ivory/45">
                      &mdash;
                    </span>
                  </li>
                ))}
              </ul>
              {!text.amenityGroups?.length && text.amenities && text.amenities.length > 0 && (
                <>
                  <p className="label mb-2 mt-8 text-ivory">{labels.amenities}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2">
                    {text.amenities.map((item) => (
                      <li key={item} className="label border-b border-ivory/20 py-3 text-ivory/70">{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {text.extraServices && text.extraServices.length > 0 && (
                <>
                  <p className="label mb-2 mt-8 text-ivory">{labels.extraServices}</p>
                  <ul>
                    {text.extraServices.map((item) => (
                      <li key={item} className="label border-b border-ivory/20 py-3 text-ivory/70">{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </aside>
          </div>

          {text.amenityGroups && text.amenityGroups.length > 0 && (
            <section className="mt-20 border-t border-ink/15 pt-10">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="label text-burgundy">03 · {labels.amenities}</p>
                  <h3 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-none text-ink">
                    {locale === 'el' ? 'Όλα όσα χρειάζεστε.' : 'Everything you need.'}
                  </h3>
                </div>
                <p className="label hidden text-ink/35 sm:block">{text.amenityGroups.length} {locale === 'el' ? 'ΚΑΤΗΓΟΡΙΕΣ' : 'CATEGORIES'}</p>
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {text.amenityGroups.map((group) => (
                  <div key={group.title} className="border-t border-burgundy/30 pt-5">
                    <h4 className="font-serif text-2xl font-light text-ink">{group.title}</h4>
                    <ul className="mt-3">
                      {group.items.map((item) => (
                        <li key={item} className="border-b border-ink/10 py-2 font-sans text-sm font-light leading-relaxed text-ink/65">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {text.importantNotes && text.importantNotes.length > 0 && (
            <section className="mt-20 border-y border-burgundy/20 bg-burgundy/[0.045] px-6 py-9 sm:px-10">
              <p className="label mb-6 text-burgundy">04 · {labels.importantNotes}</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {text.importantNotes.map((note) => (
                  <li key={note} className="font-sans text-sm font-light leading-relaxed text-ink/65">
                    <span aria-hidden className="mr-2 text-burgundy">—</span>{note}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/*
            CTA — a listing links out to Airbnb; without one (a sale, or a
            rental with no live listing yet) this closes the popup and
            scrolls the page to the contact section instead of dialling.
          */}
          <div className="mt-10 flex flex-col items-start gap-5 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={residence.listingUrl ?? '#contact'}
              target={residence.listingUrl ? '_blank' : undefined}
              rel={residence.listingUrl ? 'noreferrer' : undefined}
              onClick={
                residence.listingUrl
                  ? undefined
                  : (e) => {
                      e.preventDefault();
                      close();
                      scrollTo('#contact');
                    }
              }
              aria-label={residence.listingUrl ? `${labels.checkAvailability} — ${text.name}` : t.ui.contactUs}
              className="group inline-flex min-h-14 items-stretch border-2 border-burgundy bg-burgundy shadow-[0_10px_26px_rgba(99,0,0,0.18)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_34px_rgba(99,0,0,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
            >
              <span className="label flex items-center px-7 py-4 text-ivory">
                {residence.listingUrl ? labels.checkAvailability : t.ui.contactUs}
              </span>
              <span
                aria-hidden
                className="flex min-w-14 items-center justify-center border-l border-ivory/30 text-xl text-ivory transition-colors duration-200 group-hover:bg-burgundy"
              >
                {residence.listingUrl ? '↗' : '→'}
              </span>
            </a>

            {/* Phone, WhatsApp and email are the contact channels. */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <a
                href={siteConfig.contact.phoneHref}
                className="label border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-200 hover:border-burgundy hover:text-ink"
              >
                {siteConfig.contact.phone}
              </a>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="label inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-200 hover:border-burgundy hover:text-ink"
              >
                <Image src="/images/whatsapp_Logo.png" alt="" width={16} height={16} aria-hidden />
                {siteConfig.contact.whatsapp}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="label border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-200 hover:border-burgundy hover:text-ink"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
      {residence.photoSections && (
        <PhotoTour
          open={showPhotoTour}
          residenceName={text.name}
          sections={residence.photoSections}
          locale={locale}
          onClose={() => setShowPhotoTour(false)}
        />
      )}
    </div>
  );
}
