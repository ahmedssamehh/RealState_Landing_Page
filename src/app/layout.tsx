import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, EB_Garamond, Inter } from 'next/font/google';
import { content, siteConfig } from '@/data/siteConfig';
import { LocaleProvider } from '@/lib/locale';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, structuredData } from '@/lib/seo';
import './globals.css';

/**
 * Display face. Cormorant Garamond carries the brand but ships no Greek
 * glyphs, so EB Garamond — the closest Garamond with a Greek cut — sits
 * directly behind it in the stack. The browser resolves per glyph: Latin
 * renders in Cormorant, Greek in EB Garamond, with no switching logic.
 */
const display = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
});

const displayGreek = EB_Garamond({
  subsets: ['greek', 'latin'],
  weight: ['400', '500'],
  variable: '--font-display-greek',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * SEO — served in the default language. The in-page language switch is a
 * client-side preference, so the crawled metadata stays deterministic; if the
 * project later needs indexed Greek pages, move the locale into the route
 * (/el) and generate metadata per segment.
 */
const meta = content[siteConfig.defaultLocale].meta;
const homeSeo = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: siteConfig.routes.chooser,
  absoluteTitle: true,
});

/*
 * Root defaults double as the homepage metadata (`/` is a client component).
 * `/rent` and `/sale` override title, canonical, Open Graph and Twitter in
 * their own layouts, so the homepage canonical is never inherited.
 */
export const metadata: Metadata = {
  ...homeSeo,
  metadataBase: new URL(siteConfig.seo.url),
  title: {
    default: meta.title,
    template: `%s | ${siteConfig.brand.name}`,
  },
  applicationName: siteConfig.brand.name,
  keywords: ['private residences', 'luxury apartments', 'architecture', 'property'],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteConfig.defaultLocale}
      className={`${display.variable} ${displayGreek.variable} ${body.variable}`}
    >
      {/* Ivory is the page surface; ink is the type. */}
      <body className="bg-ivory text-ink antialiased">
        <JsonLd data={structuredData()} />
        {/* Language and currency are shared by every route. */}
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
