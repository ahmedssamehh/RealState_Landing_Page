/**
 * ---------------------------------------------------------------------------
 * SEO HELPERS
 * ---------------------------------------------------------------------------
 * Every canonical URL, Open Graph block and JSON-LD node is built here from
 * `siteConfig.seo.url`, so the site can only ever declare one origin.
 *
 * Next.js replaces (does not merge) a parent's `openGraph` / `twitter` object
 * when a route defines its own, so `pageMetadata` always returns the complete
 * block — image, site name and URL included.
 * ---------------------------------------------------------------------------
 */

import type { Metadata } from 'next';
import { content, siteConfig } from '@/data/siteConfig';

/** Absolute URL on the canonical origin. `absoluteUrl('/')` keeps the trailing slash. */
export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.seo.url).toString();
}

const meta = content[siteConfig.defaultLocale].meta;

type PageSeo = {
  /** Full title for social cards; the <title> gets the brand via the root template. */
  title: string;
  description: string;
  path: string;
  /** Set for the homepage, whose title already carries the brand. */
  absoluteTitle?: boolean;
};

export function pageMetadata({ title, description, path, absoluteTitle = false }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.brand.name}`;
  const image = {
    url: siteConfig.seo.ogImage,
    width: 1200,
    height: 630,
    alt: siteConfig.brand.name,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      url,
      siteName: siteConfig.brand.name,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [siteConfig.seo.ogImage],
    },
  };
}

/**
 * Site-wide structured data: the WebSite (drives the site name shown in
 * Google results) and the business behind it. Only facts published on the
 * site are stated — no ratings, prices, hours, coordinates or street address.
 */
export function structuredData() {
  const home = absoluteUrl('/');
  const businessId = `${home}#business`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        name: siteConfig.brand.name,
        alternateName: siteConfig.brand.alternateNames,
        url: home,
        inLanguage: ['en', 'el'],
        publisher: { '@id': businessId },
      },
      {
        '@type': 'LodgingBusiness',
        '@id': businessId,
        name: siteConfig.brand.name,
        alternateName: siteConfig.brand.alternateNames,
        url: home,
        description: meta.description,
        telephone: siteConfig.contact.phoneHref.replace('tel:', ''),
        logo: absoluteUrl(siteConfig.seo.logo),
        image: absoluteUrl(siteConfig.seo.ogImage),
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteConfig.seo.address.locality,
          addressRegion: siteConfig.seo.address.region,
          addressCountry: siteConfig.seo.address.country,
        },
        areaServed: { '@type': 'City', name: siteConfig.seo.areaServed },
      },
    ],
  };
}
