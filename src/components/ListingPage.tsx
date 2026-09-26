'use client';

/**
 * A listing's own page (`/rent/<id>`, `/sale/<id>`): the same detail panel the
 * collection pages open as a popup, rendered in normal document flow so every
 * listing has a real, shareable, crawlable URL. Framed by the chooser's header,
 * a breadcrumb back up the hierarchy, the listing's location and links across
 * to its sibling listings.
 */

import Image from 'next/image';
import Link from 'next/link';
import Footer from './Footer';
import LocaleToggle from './LocaleToggle';
import Logo from './Logo';
import ResidenceDetails from './ResidenceDetails';
import SmoothScroll from './SmoothScroll';
import { collections, findListing, listingPath, type Collection } from '@/data/listings';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';

const noop = () => {};

type Props = { collection: Collection; slug: string };

export default function ListingPage({ collection, slug }: Props) {
  const { t, residence: copy } = useLocale();
  const item = findListing(collection, slug);
  if (!item) return null;

  const text = copy(item);
  const siblings = collections[collection].filter((other) => other.id !== item.id);
  const collectionHref = siteConfig.routes[collection];
  const collectionLabel = collection === 'rent' ? t.chooser.rent.title : t.chooser.sale.title;
  const backLabel = collection === 'rent' ? t.ui.allRentals : t.ui.allSales;

  return (
    <SmoothScroll>
      <header className="edge mx-auto flex w-full max-w-edge items-center justify-between gap-6 py-6 sm:py-8">
        <Link href={siteConfig.routes.chooser} aria-label={siteConfig.brand.name} className="text-ink">
          <Logo mark="full" size={30} className="hidden sm:inline-flex" />
          <Logo mark="icon" size={28} className="sm:hidden" />
        </Link>
        <LocaleToggle tone="dark" />
      </header>

      <nav aria-label={t.ui.breadcrumb} className="edge mx-auto w-full max-w-edge pb-6">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <li>
            <Link href={siteConfig.routes.chooser} className="label text-ink/45 transition-colors hover:text-ink">
              {t.ui.home}
            </Link>
          </li>
          <li aria-hidden className="label text-ink/25">/</li>
          <li>
            <Link href={collectionHref} className="label text-ink/45 transition-colors hover:text-ink">
              {collectionLabel}
            </Link>
          </li>
          <li aria-hidden className="label text-ink/25">/</li>
          <li aria-current="page" className="label text-ink">
            {text.name}
          </li>
        </ol>
      </nav>

      <main id="main">
        <ResidenceDetails residence={item} variant="page" onClose={noop} />

        {/* ---------------------------------------------------- Location */}
        <section
          aria-labelledby="listing-location-heading"
          className="edge mx-auto w-full max-w-edge border-t border-ink/10 py-[clamp(4rem,10vh,7rem)]"
        >
          <div className="mb-8 flex items-center gap-6">
            <span className="h-px w-12 bg-ink/20" />
            <p className="label text-burgundy">{t.ui.theLocation}</p>
          </div>
          <div className="grid grid-cols-12 gap-y-8">
            <h2
              id="listing-location-heading"
              className="display col-span-12 text-[clamp(2.4rem,6vw,5rem)] text-ink lg:col-span-6"
            >
              {text.neighbourhood}
            </h2>
            <ul className="col-span-12 space-y-3 lg:col-span-5 lg:col-start-8">
              {text.proximity.map((line) => (
                <li
                  key={line}
                  className="border-b border-ink/10 pb-3 font-sans text-sm font-light leading-relaxed text-ink/65"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------ Across the collection */}
        <section
          aria-labelledby="listing-more-heading"
          className="edge mx-auto w-full max-w-edge border-t border-ink/10 py-[clamp(4rem,10vh,7rem)]"
        >
          <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
            <h2 id="listing-more-heading" className="label text-burgundy">
              {siblings.length > 0 ? t.ui.moreResidences : collectionLabel}
            </h2>
            <Link
              href={collectionHref}
              className="label border-b border-ink/25 pb-1 text-ink/70 transition-colors hover:border-burgundy hover:text-ink"
            >
              {backLabel} &rarr;
            </Link>
          </div>

          {siblings.length > 0 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
              {siblings.map((other) => {
                const otherText = copy(other);
                const cover = other.images[0];
                return (
                  <Link
                    key={other.id}
                    href={listingPath(collection, other)}
                    className="group relative block aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]"
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
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-burgundy transition-[width] duration-[700ms] ease-expo group-hover:w-full" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                      <p className="label text-ivory/70">{otherText.neighbourhood}</p>
                      <p className="display mt-1 text-[clamp(1.6rem,3vw,2.2rem)] text-ivory">{otherText.name}</p>
                      <p className="mt-1 font-sans text-xs font-light tracking-wide text-ivory/70">
                        {otherText.subtitle}
                      </p>
                      <span className="label mt-5 inline-flex w-fit items-center gap-2 border-b border-ivory/30 pb-1 text-ivory/85 transition-colors duration-200 group-hover:border-burgundy group-hover:text-ivory">
                        {t.ui.viewDetails}
                        <span aria-hidden>&rarr;</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
