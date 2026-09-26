import type { Metadata } from 'next';
import { content, siteConfig } from '@/data/siteConfig';
import { pageMetadata } from '@/lib/seo';

/**
 * Route-level SEO for the sales collection. The page itself is a client
 * component (it owns the popup state), so its metadata lives here. Each
 * listing has its own page and metadata under `/sale/<id>`.
 */
const { title, description } = content[siteConfig.defaultLocale].meta.sale;

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: siteConfig.routes.sale,
});

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
