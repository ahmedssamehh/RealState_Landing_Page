import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/siteConfig';
import { absoluteUrl } from '@/lib/seo';

/**
 * Served at /sitemap.xml. Only the real, public, canonical routes — add a
 * route here when it is added to `siteConfig.routes`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { chooser, rent, sale } = siteConfig.routes;
  return [chooser, rent, sale].map((path) => ({ url: absoluteUrl(path) }));
}
