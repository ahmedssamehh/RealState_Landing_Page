import { test, expect } from '@playwright/test';

const ORIGIN = 'https://gsluxuryresidence.gr';

test.describe('SEO', () => {
  // Next.js prints the bare origin without its trailing slash; for http(s)
  // `https://host` and `https://host/` are the same URL.
  for (const [path, canonical] of [
    ['/', ORIGIN],
    ['/rent', `${ORIGIN}/rent`],
    ['/sale', `${ORIGIN}/sale`],
  ] as const) {
    test(`${path} is indexable with its own canonical`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      expect(response?.headers()['x-robots-tag']).toBeUndefined();

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    });
  }

  test('homepage carries valid WebSite and LodgingBusiness JSON-LD', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const graph = JSON.parse(raw ?? '')['@graph'] as { '@type': string; name: string; url: string }[];

    const website = graph.find((node) => node['@type'] === 'WebSite');
    expect(website?.name).toBe('G.S Luxury Residence');
    expect(website?.url).toBe(`${ORIGIN}/`);
    expect(graph.some((node) => node['@type'] === 'LodgingBusiness')).toBe(true);
  });

  test('robots.txt allows crawling and points at the sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toContain('Allow: /');
    expect(body).not.toMatch(/Disallow: \/\s*$/m);
    expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  test('sitemap lists only the canonical public routes', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    const urls = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(urls).toEqual([`${ORIGIN}/`, `${ORIGIN}/rent`, `${ORIGIN}/sale`]);
  });
});
