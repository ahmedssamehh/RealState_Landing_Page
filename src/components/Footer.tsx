'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/siteConfig';
import Logo from './Logo';
import { useLocale } from '@/lib/locale';
import { useSmoothScroll } from './SmoothScroll';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const { t } = useLocale();
  const year = new Date().getFullYear();
  /** "Athens apartments to rent" is wrong on the sale page — swap it there. */
  const onSaleRoute = usePathname()?.startsWith(siteConfig.routes.sale);
  const tagline = onSaleRoute ? t.sale.tagline : t.brand.tagline;

  return (
    <footer className="w-full border-t border-ivory/10 bg-ink py-[clamp(3rem,8vh,5rem)]">
      <div className="edge mx-auto max-w-edge">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo mark="stacked" size={72} />
            <p className="label mt-4 text-ivory/35">{tagline}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href);
                    }}
                    className="label text-ivory/60 transition-colors duration-200 hover:text-ivory"
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Phone and email are the only contact channels. */}
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={siteConfig.contact.phoneHref}
              className="label text-ivory/60 transition-colors duration-200 hover:text-ivory"
            >
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="label text-ivory/60 transition-colors duration-200 hover:text-ivory"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {/*
          Collection switch — the current collection as plain text, a link
          across to the other one, and the way back to the chooser. Which
          collection is "current" depends on the route, not just the rentals.
        */}
        <div className="mt-[clamp(2rem,5vh,3rem)] flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ivory/10 pt-8">
          <span className="label text-ivory">
            {onSaleRoute ? t.chooser.sale.title : t.chooser.rent.title}
          </span>
          <Link
            href={onSaleRoute ? siteConfig.routes.rent : siteConfig.routes.sale}
            className="label text-ivory/45 transition-colors duration-200 hover:text-ivory"
          >
            {onSaleRoute ? t.chooser.rent.title : t.chooser.sale.title}
          </Link>
          <Link
            href={siteConfig.routes.chooser}
            className="label text-ivory/45 transition-colors duration-200 hover:text-ivory"
          >
            {t.ui.allCollections}
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-ivory/25">
            &copy; {year} {siteConfig.brand.name}. {t.ui.rights}
          </p>
          <p className="label text-ivory/25">
            {t.location.city}, {t.location.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
