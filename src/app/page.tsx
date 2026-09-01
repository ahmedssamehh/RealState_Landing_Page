'use client';

/**
 * ---------------------------------------------------------------------------
 * ENTRY CHOOSER
 * ---------------------------------------------------------------------------
 * A profile-picker composition — centred title, two square tiles side by side,
 * labels beneath — rebuilt in the site's own language rather than borrowing
 * anyone else's palette or shapes.
 *
 * Each tile carries a line elevation instead of an avatar: the stacked
 * cantilevers of the rental villa, and a taller massing for the sales
 * collection. They draw themselves in on load (stroke-dashoffset), then fill
 * with burgundy on hover while the other tile recedes.
 *
 * Deliberately light: no 3D, no Lenis, no scroll machinery. This route is type
 * and two links, so entry is instant and the heavy hero bundle is not paid for
 * until the visitor asks for it.
 * ---------------------------------------------------------------------------
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Logo from '@/components/Logo';
import LocaleToggle from '@/components/LocaleToggle';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { DURATION, EASE, gsap, prefersReducedMotion, registerGsap } from '@/lib/animations';

type PanelKey = 'rent' | 'sale';

/* -------------------------------------------------------------------------- */
/* Tile artwork                                                               */
/* -------------------------------------------------------------------------- */
/*
 * Stroke-only elevations so a single `currentColor` inverts the whole drawing
 * when a tile fills. `pathLength={1}` normalises every stroke so one dash
 * length works for all of them regardless of real geometry.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
};

/** The rental villa: stacked, cantilevered, stepping back as it rises. */
function RentElevation() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      {/* slabs */}
      <path data-draw pathLength={1} d="M18 86h84" {...stroke} />
      <path data-draw pathLength={1} d="M22 64h74" {...stroke} />
      <path data-draw pathLength={1} d="M28 44h60" {...stroke} />
      {/* volumes */}
      <path data-draw pathLength={1} d="M26 86V66h68v20" {...stroke} />
      <path data-draw pathLength={1} d="M32 64V46h54v18" {...stroke} />
      <path data-draw pathLength={1} d="M40 44V30h38v14" {...stroke} />
      {/* glazing */}
      <path data-draw pathLength={1} d="M38 70v12M50 70v12M62 70v12M74 70v12" {...stroke} />
      <path data-draw pathLength={1} d="M44 50v10M58 50v10M72 50v10" {...stroke} />
      {/* ground */}
      <path data-draw pathLength={1} d="M10 98h100" {...stroke} />
    </svg>
  );
}

/** The sales collection: a taller, more vertical massing. */
function SaleElevation() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      {/* tower */}
      <path data-draw pathLength={1} d="M40 98V26h40v72" {...stroke} />
      {/* floor lines */}
      <path data-draw pathLength={1} d="M40 40h40M40 54h40M40 68h40M40 82h40" {...stroke} />
      {/* mullions */}
      <path data-draw pathLength={1} d="M53 26v72M67 26v72" {...stroke} />
      {/* crown + wing */}
      <path data-draw pathLength={1} d="M34 26h52" {...stroke} />
      <path data-draw pathLength={1} d="M80 74h16v24" {...stroke} />
      {/* ground */}
      <path data-draw pathLength={1} d="M10 98h100" {...stroke} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

export default function ChooserPage() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const [hovered, setHovered] = useState<PanelKey | null>(null);

  const { chooser } = t;

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const fades = '[data-choose-fade], [data-choose-line] > span, [data-choose-tile]';

      if (prefersReducedMotion()) {
        gsap.set(fades, { opacity: 1, y: 0, yPercent: 0, scale: 1 });
        gsap.set('[data-draw]', { strokeDasharray: 'none', strokeDashoffset: 0 });
        return;
      }

      // The elevations start undrawn and are inked in with the tiles.
      gsap.set('[data-draw]', { strokeDasharray: 1, strokeDashoffset: 1 });

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .fromTo(
          '[data-choose-line] > span',
          { yPercent: 112 },
          { yPercent: 0, duration: DURATION.slow, stagger: 0.07 }
        )
        .fromTo(
          '[data-choose-fade]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: DURATION.base, stagger: 0.06 },
          '-=0.45'
        )
        .fromTo(
          '[data-choose-tile]',
          { opacity: 0, y: 24, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: DURATION.base, stagger: 0.1 },
          '-=0.35'
        )
        .to(
          '[data-draw]',
          { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.035 },
          '-=0.3'
        );
    }, el);

    return () => ctx.revert();
  }, []);

  const tiles: {
    key: PanelKey;
    href: string;
    title: string;
    description: string;
    action: string;
    badge?: string;
    art: React.ReactNode;
  }[] = [
    {
      key: 'rent',
      href: siteConfig.routes.rent,
      title: chooser.rent.title,
      description: chooser.rent.description,
      action: chooser.rent.action,
      art: <RentElevation />,
    },
    {
      key: 'sale',
      href: siteConfig.routes.sale,
      title: chooser.sale.title,
      description: chooser.sale.description,
      action: chooser.sale.action,
      badge: siteConfig.saleReady ? undefined : chooser.sale.badge,
      art: <SaleElevation />,
    },
  ];

  return (
    <main ref={root} className="grain relative flex min-h-[100svh] w-full flex-col bg-ivory">
      {/* ------------------------------------------------------------ Head */}
      <header className="edge mx-auto flex w-full max-w-edge items-center justify-between gap-6 py-6 sm:py-8">
        <span data-choose-fade className="text-ink opacity-0">
          <Logo size={30} className="hidden sm:inline-flex" />
          <Logo size={28} iconOnly className="sm:hidden" />
        </span>

        <span data-choose-fade className="opacity-0">
          <LocaleToggle tone="dark" />
        </span>
      </header>

      {/* --------------------------------------------------------- Chooser */}
      <div className="edge mx-auto flex w-full max-w-edge flex-1 flex-col items-center justify-center py-[clamp(2rem,6vh,4rem)] text-center">
        <p data-choose-fade className="label mb-6 text-burgundy opacity-0">
          {chooser.eyebrow}
        </p>

        <h1 className="display text-ink">
          {chooser.headline.map((line) => (
            <span key={line} data-choose-line className="reveal-line">
              <span className="block text-[clamp(1.9rem,5.2vw,4rem)]">{line}</span>
            </span>
          ))}
        </h1>

        <p data-choose-fade className="label mt-6 text-ink/40 opacity-0">
          {chooser.note}
        </p>

        {/* Tiles */}
        <div
          className="mt-[clamp(2.5rem,7vh,4.5rem)] grid w-full max-w-[34rem] grid-cols-2 gap-5 sm:gap-10"
          onMouseLeave={() => setHovered(null)}
        >
          {tiles.map((tile) => {
            const dimmed = hovered !== null && hovered !== tile.key;

            return (
              <Link
                key={tile.key}
                href={tile.href}
                data-choose-tile
                aria-label={tile.action}
                onMouseEnter={() => setHovered(tile.key)}
                onFocus={() => setHovered(tile.key)}
                onBlur={() => setHovered(null)}
                className={`group flex flex-col items-center opacity-0 outline-none transition-opacity duration-300 ease-expo ${
                  dimmed ? 'sm:opacity-45' : ''
                }`}
              >
                {/* The tile itself */}
                <span
                  className="relative flex aspect-square w-full items-center justify-center overflow-hidden border border-ink/15 bg-ivory p-[14%] text-ink transition-[transform,background-color,border-color,color] duration-[450ms] ease-expo group-hover:-translate-y-1.5 group-hover:border-burgundy group-hover:bg-burgundy group-hover:text-ivory group-focus-visible:-translate-y-1.5 group-focus-visible:border-burgundy group-focus-visible:bg-burgundy group-focus-visible:text-ivory"
                >
                  {tile.art}

                  {tile.badge && (
                    <span className="label absolute left-0 right-0 top-3 text-[0.5rem] text-ink/40 transition-colors duration-300 group-hover:text-ivory/60 group-focus-visible:text-ivory/60">
                      {tile.badge}
                    </span>
                  )}
                </span>

                {/* Label beneath, as a picker does */}
                <span className="mt-5 block font-serif text-[clamp(1.05rem,2.2vw,1.5rem)] font-light leading-none text-ink">
                  {tile.title}
                </span>

                {/* Burgundy rule grows under the label on hover */}
                <span
                  aria-hidden
                  className="mt-2.5 block h-px w-0 bg-burgundy transition-[width] duration-[450ms] ease-expo group-hover:w-10 group-focus-visible:w-10"
                />

                <span className="mt-3 block max-w-[15rem] font-sans text-xs font-light leading-relaxed text-ink/50">
                  {tile.description}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* DEMO contact details — phone and email are the only channels */}
      <footer className="edge mx-auto flex w-full max-w-edge flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ink/10 py-6">
        <a
          data-choose-fade
          href={siteConfig.contact.phoneHref}
          className="label text-ink/55 opacity-0 transition-colors duration-200 hover:text-ink"
        >
          {siteConfig.contact.phone}
        </a>
        <a
          data-choose-fade
          href={`mailto:${siteConfig.contact.email}`}
          className="label text-ink/55 opacity-0 transition-colors duration-200 hover:text-ink"
        >
          {siteConfig.contact.email}
        </a>
      </footer>
    </main>
  );
}
