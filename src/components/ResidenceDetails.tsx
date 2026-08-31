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

type Props = {
  residence: Apartment | null;
  onClose: () => void;
};

export default function ResidenceDetails({ residence, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { lock, unlock } = useSmoothScroll();
  const { t, residence: copy, status, price } = useLocale();

  const open = Boolean(residence);
  const count = residence?.images.length ?? 0;

  /* ------------------------------------------------------------------ */
  /* Open                                                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!open) return;
    registerGsap();
    const el = root.current;
    if (!el) return;

    lock();
    setActive(0);
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
    }, el);

    return () => {
      ctx.revert();
      unlock();
    };
  }, [open, lock, unlock]);

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

  const spec = [
    { k: t.ui.area, v: residence.area },
    { k: t.ui.bedrooms, v: residence.bedrooms },
    { k: t.ui.bathrooms, v: residence.bathrooms },
    { k: t.ui.parking, v: residence.parking },
    { k: t.ui.aspect, v: text.orientation },
  ];

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${text.name} ${t.ui.detailAria}`}
      className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-6 md:p-10"
      style={{ visibility: 'hidden', opacity: 0 }}
    >
      {/* Click-away. The blur itself lives on the page shell behind. */}
      <button
        type="button"
        aria-label={t.ui.close}
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45"
      />

      <div
        ref={panel}
        className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden bg-ivory shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:max-h-[90svh]"
      >
        {/* ------------------------------------------------ Gallery */}
        <div className="relative shrink-0 bg-ink/10">
          <div
            ref={track}
            className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {residence.images.map((img, i) => (
              <figure
                key={img.src}
                className="relative aspect-[16/10] w-full flex-none snap-center sm:aspect-[2/1]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 64rem"
                  className="select-none object-cover"
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
            {residence.images.map((img, i) => (
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
            className="absolute right-4 top-4 flex items-center gap-2 border border-ivory/40 bg-ink/30 px-4 py-2 text-ivory backdrop-blur-sm transition-colors duration-200 hover:bg-burgundy"
          >
            <span aria-hidden className="text-base leading-none">
              &times;
            </span>
            <span className="label">{t.ui.close}</span>
          </button>
        </div>

        {/* ------------------------------------------------ Detail */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <div>
              <p className="label mb-3 text-burgundy">
                {t.ui.residence} {residence.number} &mdash; {text.subtitle}
              </p>
              <h2 className="display text-[clamp(2rem,5vw,3.4rem)] text-ink">{text.name}</h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-none text-ink">
                {price(residence.rent)}
              </p>
              <p className="label mt-2 text-ink/50">{t.ui.perMonth}</p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-y-6 border-y border-ink/15 py-7 md:grid-cols-5">
            {spec.map((row) => (
              <div key={row.k}>
                <dt className="label text-ink/45">{row.k}</dt>
                <dd className="mt-2 font-serif text-xl font-light text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="label mb-4 text-burgundy">{t.ui.description}</p>
              <p className="font-serif text-[clamp(1.05rem,1.5vw,1.35rem)] font-light leading-[1.55] text-ink/85">
                {text.description}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <dt className="label text-ink/45">{t.ui.availability}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {text.availableFrom}
                  </dd>
                </div>
                <div>
                  <dt className="label text-ink/45">{t.ui.minimumTerm}</dt>
                  <dd className="mt-2 font-sans text-sm font-light tracking-wide text-ink/80">
                    {residence.minimumTermMonths} {t.ui.months}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="label mb-4 text-burgundy">{t.ui.features}</p>
              <ul>
                {text.features.map((f) => (
                  <li
                    key={f}
                    className="label flex items-center justify-between border-b border-ink/15 py-3 text-ink/75"
                  >
                    {f}
                    <span aria-hidden className="text-burgundy">
                      &mdash;
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA — the enquiry form is gone, so this dials directly. */}
          <div className="mt-10 flex flex-col items-start gap-5 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={siteConfig.contact.phoneHref}
              className="group inline-flex items-center gap-4 bg-burgundy px-8 py-4 transition-colors duration-200 hover:bg-burgundy-soft"
            >
              <span className="label text-ivory">{t.cta.requestInformation}</span>
              <span
                aria-hidden
                className="text-ivory transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </a>

            {/* DEMO contact details — phone and email are the only channels */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <a
                href={siteConfig.contact.phoneHref}
                className="label border-b border-ink/25 pb-1 text-ink/70 transition-colors duration-200 hover:border-burgundy hover:text-ink"
              >
                {siteConfig.contact.phone}
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
    </div>
  );
}
