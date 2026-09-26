import type { MetadataRoute } from 'next';
import { allListings } from '@/data/listings';
import { siteConfig } from '@/data/siteConfig';
import { absoluteUrl } from '@/lib/seo';

/**
 * Served at /sitemap.xml. Only real, public, canonical routes: the three
 * collection pages plus one page per published listing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { chooser, rent, sale } = siteConfig.routes;
  return [chooser, rent, sale, ...allListings.map((listing) => listing.path)].map((path) => ({
    url: absoluteUrl(path),
  }));
}
