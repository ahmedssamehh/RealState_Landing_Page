'use client';

/**
 * ---------------------------------------------------------------------------
 * LOCALE + CURRENCY
 * ---------------------------------------------------------------------------
 * One provider drives both switches. Components call `useLocale()` and read
 * `t` (the whole content tree for the active language), `residence()` for a
 * translated apartment, and `price()` to format an amount in the active
 * currency.
 *
 * Both choices persist in localStorage and are restored after mount, so the
 * first server-rendered paint always matches the default locale (no hydration
 * mismatch).
 * ---------------------------------------------------------------------------
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  content,
  siteConfig,
  type Content,
  type CurrencyCode,
  type Locale,
} from '@/data/siteConfig';
import type { Apartment, ApartmentCopy } from '@/data/apartments';
import { LOCALES } from '@/data/siteConfig';
import { ScrollTrigger, registerGsap } from './animations';

const STORAGE_KEYS = { locale: 'yl.locale', currency: 'yl.currency' } as const;

type LocaleApi = {
  locale: Locale;
  currency: CurrencyCode;
  setLocale: (next: Locale) => void;
  setCurrency: (next: CurrencyCode) => void;
  /** Content tree for the active language. */
  t: Content;
  /** Translated copy for a residence. */
  residence: (apartment: Apartment) => ApartmentCopy;
  /** Localised status label ("AVAILABLE" / "ΔΙΑΘΕΣΙΜΗ"). */
  status: (apartment: Apartment) => string;
  /** Formats a base-currency amount in the active currency. */
  price: (amount: number) => string;
};

const LocaleContext = createContext<LocaleApi | null>(null);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}

function isLocale(value: string | null): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

function isCurrency(value: string | null): value is CurrencyCode {
  return value === 'EUR' || value === 'USD';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(siteConfig.defaultLocale);
  const [currency, setCurrencyState] = useState<CurrencyCode>(siteConfig.currency.default);

  /* Restore the visitor's previous choices after mount. */
  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem(STORAGE_KEYS.locale);
      const savedCurrency = window.localStorage.getItem(STORAGE_KEYS.currency);
      if (isLocale(savedLocale)) setLocaleState(savedLocale);
      if (isCurrency(savedCurrency)) setCurrencyState(savedCurrency);
    } catch {
      /* Storage can be unavailable (private mode) — defaults are fine. */
    }
  }, []);

  /* Keep <html lang> honest for assistive tech and search engines. */
  useEffect(() => {
    const match = LOCALES.find((l) => l.code === locale);
    document.documentElement.lang = match?.htmlLang ?? 'en';
  }, [locale]);

  /* Translated copy changes text length, which moves every scroll trigger. */
  useEffect(() => {
    registerGsap();
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEYS.locale, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEYS.currency, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LocaleApi>(() => {
    const t = content[locale];

    /** Formats a monthly rent (or any base-currency amount). */
    const price = (amount: number) => {
      const { rates, roundTo } = siteConfig.currency;
      const converted = amount * (rates[currency] ?? 1);
      // Converted rents are indicative — never imply false precision.
      const rounded =
        currency === siteConfig.currency.base
          ? converted
          : Math.round(converted / roundTo) * roundTo;
      return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-GB', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(rounded);
    };

    return {
      locale,
      currency,
      setLocale,
      setCurrency,
      t,
      residence: (apartment) => apartment.i18n[locale],
      status: (apartment) =>
        apartment.status === 'DETAILS_PENDING'
          ? locale === 'el'
            ? 'ΑΝΑΜΟΝΗ ΣΤΟΙΧΕΙΩΝ'
            : 'DETAILS PENDING'
          : t.status[apartment.status],
      price,
    };
  }, [locale, currency, setLocale, setCurrency]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
