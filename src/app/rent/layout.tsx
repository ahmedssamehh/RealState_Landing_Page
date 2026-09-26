import type { Metadata } from 'next';
import { content, siteConfig } from '@/data/siteConfig';
import { pageMetadata } from '@/lib/seo';

/**
 * Route-level SEO for the rental collection. The page itself is a client
 * component, so its metadata lives here.
 */
const { title, description } = content[siteConfig.defaultLocale].meta.rent;

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: siteConfig.routes.rent,
});

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
