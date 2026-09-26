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
 *
 * Structured data states only what the page itself shows. Airbnb ratings are
 * displayed on the site but deliberately not marked up: they are third-party
 * reviews, which Google does not accept as the business's own review markup.
 * ---------------------------------------------------------------------------
 */

import type { Metadata } from 'next';
import type { Apartment, ResidenceImage } from '@/data/apartments';
import { listingPath, type Collection } from '@/data/listings';
import { content, siteConfig } from '@/data/siteConfig';

/** Absolute URL on the canonical origin. `absoluteUrl('/')` keeps the trailing slash. */
export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.seo.url).toString();
}

const meta = content[siteConfig.defaultLocale].meta;
const home = absoluteUrl('/');
const ids = {
  website: `${home}#website`,
  business: `${home}#business`,
};

type SocialImage = { url: string; alt: string; width?: number; height?: number };

const defaultImage: SocialImage = {
  url: siteConfig.seo.ogImage,
  width: 1200,
  height: 630,
  alt: siteConfig.brand.name,
};

type PageSeo = {
  /** Page title; the brand is appended unless `absoluteTitle` is set. */
  title: string;
  description: string;
  path: string;
  /** Set for the homepage, whose title already carries the brand. */
  absoluteTitle?: boolean;
  image?: SocialImage;
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image = defaultImage,
}: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.brand.name}`;

  return {
    // Always absolute: a string title in an intermediate layout (e.g. /rent)
    // cancels the root template for its children, so the brand is appended here.
    title: { absolute: fullTitle },
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
      images: [image.url],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Site-wide entities                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The WebSite (drives the site name shown in Google results) and the business
 * behind it, on every page so other nodes can reference them by @id. Only
 * facts published on the site are stated — no ratings, prices, hours,
 * coordinates or street address.
 */
export function structuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': ids.website,
        name: siteConfig.brand.name,
        alternateName: siteConfig.brand.alternateNames,
        url: home,
        inLanguage: ['en', 'el'],
        publisher: { '@id': ids.business },
      },
      {
        '@type': 'LodgingBusiness',
        '@id': ids.business,
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

/* -------------------------------------------------------------------------- */
/* Breadcrumbs                                                                */
/* -------------------------------------------------------------------------- */

export type Crumb = { name: string; path: string };

/** Schema names for the collection pages, in the default locale. */
export const collectionCrumbs: Record<Collection, Crumb> = {
  rent: { name: 'Apartments for Rent', path: siteConfig.routes.rent },
  sale: { name: 'Property for Sale', path: siteConfig.routes.sale },
};

const homeCrumb: Crumb = { name: 'Home', path: siteConfig.routes.chooser };

export function breadcrumbList(trail: Crumb[], id?: string) {
  return {
    '@type': 'BreadcrumbList',
    ...(id && { '@id': id }),
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** JSON-LD for a collection page (`/rent`, `/sale`): its place in the hierarchy. */
export function collectionStructuredData(collection: Collection) {
  return {
    '@context': 'https://schema.org',
    ...breadcrumbList([homeCrumb, collectionCrumbs[collection]]),
  };
}

/* -------------------------------------------------------------------------- */
/* Listing pages                                                              */
/* -------------------------------------------------------------------------- */

/** Every photograph of a listing, carousel first, without repeats. */
export function listingImages(item: Apartment): ResidenceImage[] {
  const all = [...item.images, ...(item.photoSections ?? []).flatMap((s) => s.images)];
  return all.filter((img, i) => all.findIndex((other) => other.src === img.src) === i);
}

/**
 * Social cards need a format every platform accepts; AVIF/WebP are not. Fall
 * back to the site card when a listing has no JPEG/PNG photograph.
 */
export function listingSocialImage(item: Apartment): SocialImage {
  const photo = listingImages(item).find((img) => /\.(jpe?g|png)$/i.test(img.src));
  return photo ? { url: photo.src, alt: photo.alt } : defaultImage;
}

/** Amenity groups that describe the setting or the paperwork, not the home. */
const NON_AMENITY_GROUPS = new Set(['Location', 'Listing highlights', 'Running costs', 'Building', 'Interior']);

export function listingStructuredData(collection: Collection, item: Apartment) {
  const url = absoluteUrl(listingPath(collection, item));
  const text = item.i18n[siteConfig.defaultLocale];
  const images = listingImages(item).map((img) => absoluteUrl(img.src));
  const accommodationId = `${url}#accommodation`;
  const breadcrumbId = `${url}#breadcrumb`;
  const areaM2 = item.area ? Number.parseFloat(item.area) : undefined;

  const amenities = [
    ...new Set(
      (text.amenityGroups ?? [])
        .filter((group) => !NON_AMENITY_GROUPS.has(group.title))
        .flatMap((group) => group.items)
    ),
  ];

  const accommodation = {
    '@type': 'Apartment',
    '@id': accommodationId,
    name: text.name,
    description: text.description,
    url,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: item.street,
      addressLocality: text.neighbourhood,
      addressRegion: 'Attica',
      addressCountry: 'GR',
    },
    numberOfBedrooms: item.bedrooms,
    numberOfBathroomsTotal: item.bathrooms,
    occupancy:
      item.guests != null ? { '@type': 'QuantitativeValue', maxValue: item.guests } : undefined,
    floorSize:
      areaM2 && Number.isFinite(areaM2)
        ? { '@type': 'QuantitativeValue', value: areaM2, unitCode: 'MTK' }
        : undefined,
    yearBuilt: item.yearBuilt,
    amenityFeature: amenities.length
      ? amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true }))
      : undefined,
    sameAs: item.listingUrl ? [item.listingUrl] : undefined,
  };

  const page = {
    '@id': `${url}#webpage`,
    url,
    name: item.seo?.title ?? text.name,
    description: item.seo?.description ?? text.description,
    inLanguage: siteConfig.defaultLocale,
    isPartOf: { '@id': ids.website },
    about: { '@id': accommodationId },
    breadcrumb: { '@id': breadcrumbId },
    primaryImageOfPage: images[0],
  };

  const listingPage =
    collection === 'sale' && item.salePrice != null
      ? {
          '@type': 'RealEstateListing',
          ...page,
          offers: {
            '@type': 'Offer',
            price: item.salePrice,
            priceCurrency: siteConfig.currency.base,
            availability: item.status === 'AVAILABLE' ? 'https://schema.org/InStock' : undefined,
            businessFunction: 'http://purl.org/goodrelations/v1#Sell',
            itemOffered: { '@id': accommodationId },
            seller: { '@id': ids.business },
          },
        }
      : { '@type': 'WebPage', ...page, publisher: { '@id': ids.business } };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      listingPage,
      accommodation,
      breadcrumbList(
        [homeCrumb, collectionCrumbs[collection], { name: text.name, path: listingPath(collection, item) }],
        breadcrumbId
      ),
    ],
  };
}

/** Serialise for a <script type="application/ld+json">, so no value can close the tag. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
