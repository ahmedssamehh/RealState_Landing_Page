/**
 * ---------------------------------------------------------------------------
 * LISTINGS — one index over both collections.
 * ---------------------------------------------------------------------------
 * Every real listing gets its own page at `/<collection>/<id>`. Listings still
 * marked `dataStatus: 'pending'` are left out, so a half-filled entry never
 * becomes an indexable URL.
 * ---------------------------------------------------------------------------
 */

import { apartments, type Apartment } from './apartments';
import { saleProperties } from './properties';
import { siteConfig } from './siteConfig';

export type Collection = 'rent' | 'sale';

const isPublished = (item: Apartment) => item.dataStatus !== 'pending';

export const collections: Record<Collection, Apartment[]> = {
  rent: apartments.filter(isPublished),
  sale: saleProperties.filter(isPublished),
};

export const listingPath = (collection: Collection, item: Apartment) =>
  `${siteConfig.routes[collection]}/${item.id}`;

export function findListing(collection: Collection, slug: string) {
  return collections[collection].find((item) => item.id === slug);
}

/** The collection a listing belongs to — for components that only hold the item. */
export function collectionOf(item: Apartment): Collection {
  return collections.sale.some((sale) => sale.id === item.id) ? 'sale' : 'rent';
}

/** Page path for a listing, or undefined when it has no page (pending data). */
export function listingPathFor(item: Apartment) {
  const collection = collectionOf(item);
  return findListing(collection, item.id) ? listingPath(collection, item) : undefined;
}

export const allListings = (Object.keys(collections) as Collection[]).flatMap((collection) =>
  collections[collection].map((item) => ({
    collection,
    item,
    path: listingPath(collection, item),
  }))
);
