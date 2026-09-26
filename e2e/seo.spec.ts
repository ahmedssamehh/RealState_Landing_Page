import { test, expect, type APIRequestContext } from '@playwright/test';
import { allListings } from '../src/data/listings';

/**
 * Crawlability checks against the server-rendered HTML — what a crawler gets
 * before any JavaScript runs. Page lists come from the data, not from copy,
 * so adding a listing adds it to every check automatically.
 */

const ORIGIN = 'https://gsluxuryresidence.gr';
const PAGES = ['/', '/rent', '/sale', ...allListings.map((listing) => listing.path)];

/** Next.js prints the bare origin without its trailing slash; `https://host` and `https://host/` are the same URL. */
const canonicalFor = (path: string) => (path === '/' ? ORIGIN : `${ORIGIN}${path}`);

const all = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => m[1]);
const attr = (html: string, re: RegExp) => html.match(re)?.[1];

async function load(request: APIRequestContext, path: string) {
  const response = await request.get(path);
  return { response, html: await response.text() };
}

test.describe('SEO — every public page', () => {
  for (const path of PAGES) {
    test(`${path}: indexable, canonical, one H1, valid JSON-LD`, async ({ request }) => {
      const { response, html } = await load(request, path);
      expect(response.status()).toBe(200);
      expect(response.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex|nofollow/i);

      const robots = all(html, /<meta name="robots" content="([^"]*)"/g);
      expect(robots).toEqual(['index, follow']);

      const canonicals = all(html, /<link rel="canonical" href="([^"]*)"/g);
      expect(canonicals).toEqual([canonicalFor(path)]);
      expect(attr(html, /<meta property="og:url" content="([^"]*)"/)).toBe(canonicalFor(path));
      expect(attr(html, /<meta property="og:image" content="([^"]*)"/)).toMatch(/^https:\/\/gsluxuryresidence\.gr\//);

      expect(attr(html, /<title>([^<]+)<\/title>/)).toMatch(/G\.S Luxury Residence/);
      expect(attr(html, /<meta name="description" content="([^"]+)"/)?.length).toBeGreaterThan(50);

      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);

      const blocks = all(html, /<script type="application\/ld\+json">(.*?)<\/script>/g);
      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) expect(() => JSON.parse(block)).not.toThrow();

      // Every <img> carries an alt attribute (empty only for decorative icons).
      for (const img of all(html, /(<img\b[^>]*>)/g)) expect(img).toMatch(/\salt="/);
    });
  }

  test('titles and descriptions are unique across pages', async ({ request }) => {
    const titles: string[] = [];
    const descriptions: string[] = [];
    for (const path of PAGES) {
      const { html } = await load(request, path);
      titles.push(attr(html, /<title>([^<]+)<\/title>/) ?? '');
      descriptions.push(attr(html, /<meta name="description" content="([^"]+)"/) ?? '');
    }
    expect(new Set(titles).size).toBe(PAGES.length);
    expect(new Set(descriptions).size).toBe(PAGES.length);
  });

  test('no old-domain, localhost or preview URLs in any page', async ({ request }) => {
    for (const path of PAGES) {
      const { html } = await load(request, path);
      // The contact mailbox (info@…com) is a mailbox, not a URL — see siteConfig.
      expect(html.match(/(?<!@)(?:www\.)?gsluxuryresidence\.com/g), path).toBeNull();
      expect(html, path).not.toMatch(/https?:\/\/(localhost|127\.0\.0\.1)|vercel\.app|http:\/\/gsluxuryresidence/);
    }
  });

  test('every internal link resolves', async ({ request }) => {
    const targets = new Set<string>();
    for (const path of PAGES) {
      const { html } = await load(request, path);
      for (const href of all(html, /<a\b[^>]*\shref="(\/[^"#]*)/g)) targets.add(href || '/');
    }
    expect(targets.size).toBeGreaterThan(3);
    for (const target of targets) {
      const response = await request.get(target);
      expect(response.status(), target).toBeLessThan(400);
    }
  });

  test('unknown listing slugs are a real 404', async ({ request }) => {
    expect((await request.get('/rent/does-not-exist')).status()).toBe(404);
    expect((await request.get('/sale/does-not-exist')).status()).toBe(404);
  });
});

test.describe('SEO — structured data', () => {
  const graphOf = (html: string) =>
    all(html, /<script type="application\/ld\+json">(.*?)<\/script>/g).flatMap((block) => {
      const data = JSON.parse(block);
      return (data['@graph'] ?? [data]) as Record<string, unknown>[];
    });

  test('the site carries WebSite and business entities', async ({ request }) => {
    const graph = graphOf((await load(request, '/')).html);
    const website = graph.find((node) => node['@type'] === 'WebSite');
    expect(website?.name).toBe('G.S Luxury Residence');
    expect(website?.url).toBe(`${ORIGIN}/`);
    expect(graph.some((node) => node['@type'] === 'LodgingBusiness')).toBe(true);
    // No self-served ratings or reviews anywhere in the markup.
    expect(JSON.stringify(graph)).not.toMatch(/aggregateRating|"review"/);
  });

  for (const { path, item } of allListings) {
    test(`${path}: listing, accommodation and breadcrumb`, async ({ request }) => {
      const graph = graphOf((await load(request, path)).html);
      const types = graph.map((node) => node['@type']);
      expect(types).toContain('Apartment');
      expect(types).toContain('BreadcrumbList');
      expect(types).toContain(item.salePrice != null ? 'RealEstateListing' : 'WebPage');

      const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList')?.itemListElement as {
        item: string;
      }[];
      expect(crumbs[crumbs.length - 1]?.item).toBe(`${ORIGIN}${path}`);

      // Any @id reference resolves to an entity on the page.
      const defined = new Set(graph.map((node) => node['@id']).filter(Boolean));
      const refs = JSON.stringify(graph).match(/\{"@id":"[^"]+"\}/g) ?? [];
      for (const ref of refs) expect(defined.has(JSON.parse(ref)['@id'])).toBe(true);
    });
  }
});

test.describe('SEO — robots.txt and sitemap.xml', () => {
  test('robots.txt allows crawling and points at the sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toContain('Allow: /');
    expect(body).not.toMatch(/Disallow: \/\s*$/m);
    expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  test('sitemap is valid XML listing exactly the canonical public pages', async ({ request, page }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    const parsed = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      return {
        error: doc.getElementsByTagName('parsererror').length > 0,
        namespace: doc.documentElement.namespaceURI,
        locs: [...doc.getElementsByTagName('loc')].map((loc) => loc.textContent),
      };
    }, body);

    expect(parsed.error).toBe(false);
    expect(parsed.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
    expect(parsed.locs.sort()).toEqual(PAGES.map((path) => `${ORIGIN}${path}`).sort());
  });
});

/**
 * Production smoke test. Skipped unless PROD_BASE_URL is set, e.g.
 *   PROD_BASE_URL=https://gsluxuryresidence.gr npx playwright test e2e/seo.spec.ts
 */
test.describe('SEO — production', () => {
  const base = process.env.PROD_BASE_URL;
  test.skip(!base, 'set PROD_BASE_URL to run against the live site');

  test('public pages, robots and sitemap return 200 on the canonical host', async ({ request }) => {
    for (const path of [...PAGES, '/robots.txt', '/sitemap.xml']) {
      const response = await request.get(`${base}${path}`);
      expect(response.status(), path).toBe(200);
      expect(new URL(response.url()).host, path).toBe('gsluxuryresidence.gr');
    }
  });

  test('www and http variants redirect to https://gsluxuryresidence.gr', async ({ request }) => {
    for (const variant of ['https://www.gsluxuryresidence.gr/', 'http://gsluxuryresidence.gr/']) {
      const response = await request.get(variant);
      expect(response.status(), variant).toBe(200);
      expect(response.url(), variant).toBe(`${ORIGIN}/`);
    }
  });
});
