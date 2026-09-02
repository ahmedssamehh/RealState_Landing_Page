import type { Metadata } from 'next';

/**
 * Route-level SEO for the sales collection. The page itself is a client
 * component (it owns the popup state), so its metadata lives here.
 *
 * `title` is a plain string rather than the root's `default`, so the root
 * template appends the brand name automatically.
 */
const title = 'Corner Apartment for Sale in Kallipoli, Piraeus';
const description =
  'A bright, corner and dual-aspect apartment for sale in Kallipoli, Piraeus, with owner-verified details, complete photo tours and viewings arranged directly with us.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
