'use client';

import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { useSmoothScroll } from './SmoothScroll';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-ivory/10 bg-ink py-[clamp(3rem,8vh,5rem)]">
      <div className="edge mx-auto max-w-edge">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* DEMO wordmark */}
          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-label text-ivory">
              {siteConfig.brand.name}
            </p>
            <p className="label mt-3 text-champagne/35">{t.brand.tagline}</p>
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
                    data-cursor="button"
                    className="label text-champagne/60 transition-colors duration-200 hover:text-ivory"
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* DEMO contact details — placeholders only */}
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={siteConfig.contact.phoneHref}
              data-cursor="button"
              className="label text-champagne/60 transition-colors duration-200 hover:text-ivory"
            >
              {siteConfig.contact.phone}
            </a>
            <a
              href={siteConfig.contact.websiteHref}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="label text-champagne/60 transition-colors duration-200 hover:text-ivory"
            >
              {siteConfig.contact.website}
            </a>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-col gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-champagne/25">
            &copy; {year} {siteConfig.brand.name}. {t.ui.rights}
          </p>
          <p className="label text-champagne/25">
            {t.location.city}, {t.location.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
