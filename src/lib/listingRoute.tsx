/**
 * Shared plumbing for the listing routes (`/rent/[slug]`, `/sale/[slug]`).
 * Every listing is prerendered at build time; any other slug is a 404.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import ListingPage from '@/components/ListingPage';
import { collections, findListing, listingPath, type Collection } from '@/data/listings';
import { siteConfig } from '@/data/siteConfig';
import { listingSocialImage, listingStructuredData, pageMetadata } from '@/lib/seo';

export type ListingParams = { params: { slug: string } };

export function listingStaticParams(collection: Collection) {
  return collections[collection].map((item) => ({ slug: item.id }));
}

export function listingMetadata(collection: Collection, slug: string): Metadata {
  const item = findListing(collection, slug);
  if (!item) return {};
  const text = item.i18n[siteConfig.defaultLocale];
  return pageMetadata({
    title: item.seo?.title ?? text.name,
    description: item.seo?.description ?? text.description,
    path: listingPath(collection, item),
    image: listingSocialImage(item),
  });
}

export function ListingRoute({ collection, slug }: { collection: Collection; slug: string }) {
  const item = findListing(collection, slug);
  if (!item) notFound();
  return (
    <>
      <JsonLd data={listingStructuredData(collection, item)} />
      <ListingPage collection={collection} slug={item.id} />
    </>
  );
}
