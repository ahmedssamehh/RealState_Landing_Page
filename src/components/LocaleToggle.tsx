'use client';

/**
 * Language (EN / ΕΛ) and currency (€ / $) switches.
 * Deliberately typographic: two small letterspaced pairs divided by a hairline,
 * the active option in ivory, the inactive one recessed.
 */

import { CURRENCIES, LOCALES } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';

type Props = {
  /** 'bar' sits in the navigation; 'stacked' is used inside the mobile menu. */
  variant?: 'bar' | 'stacked';
  /** 'light' for ivory type on a dark ground, 'dark' for ink on ivory. */
  tone?: 'light' | 'dark';
  className?: string;
};

export default function LocaleToggle({ variant = 'bar', tone = 'light', className = '' }: Props) {
  const { locale, currency, setLocale, setCurrency, t } = useLocale();

  const active_ = tone === 'dark' ? 'text-ink' : 'text-ivory';
  const idle = tone === 'dark' ? 'text-ink/40 hover:text-ink' : 'text-ivory/50 hover:text-ivory';

  const option = (active: boolean) =>
    `label px-1 py-0.5 transition-colors duration-200 ${active ? active_ : idle}`;

  return (
    <div
      className={`flex shrink-0 items-center ${
        variant === 'stacked' ? 'gap-5' : 'gap-2.5 md:gap-4'
      } ${className}`}
    >
      {/* Language */}
      <div className="flex items-center gap-1" role="group" aria-label={t.ui.language}>
        {LOCALES.map((l, i) => (
          <span key={l.code} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className={tone === 'dark' ? 'text-ink/25' : 'text-ivory/30'}>
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => setLocale(l.code)}
              aria-pressed={locale === l.code}
              lang={l.htmlLang}
              className={option(locale === l.code)}
            >
              {l.label}
            </button>
          </span>
        ))}
      </div>

      <span
        aria-hidden
        className={`hidden h-3 w-px sm:block ${tone === 'dark' ? 'bg-ink/20' : 'bg-ivory/25'}`}
      />

      {/* Currency */}
      <div className="flex items-center gap-1" role="group" aria-label={t.ui.currency}>
        {CURRENCIES.map((c, i) => (
          <span key={c.code} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className={tone === 'dark' ? 'text-ink/25' : 'text-ivory/30'}>
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => setCurrency(c.code)}
              aria-pressed={currency === c.code}
              aria-label={c.label}
              className={`${option(currency === c.code)} text-xs leading-none sm:text-sm`}
            >
              {c.symbol}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
