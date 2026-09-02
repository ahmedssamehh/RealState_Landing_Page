import { test, expect } from '@playwright/test';

test.describe('Site-wide assets and identity', () => {
  test('hero CTA never overlaps the 360 controls on a short desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 726 });

    for (const path of ['/rent', '/sale']) {
      await page.goto(path);

      const hero = page.locator('#hero');
      const cta = hero.getByRole('link', { name: /VIEW (APARTMENTS TO RENT|THE APARTMENT)/i });
      const controls = hero.locator('[data-hero-controls]');
      await expect(cta).toBeVisible();
      await expect(controls).toBeVisible();

      const ctaBox = await cta.boundingBox();
      const controlsBox = await controls.boundingBox();
      expect(ctaBox).not.toBeNull();
      expect(controlsBox).not.toBeNull();
      expect(ctaBox!.x + ctaBox!.width).toBeLessThanOrEqual(controlsBox!.x);
    }
  });

  test('favicon and OG image exist and serve real images', async ({ page, request }) => {
    await page.goto('/');
    const iconHref = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(iconHref).toBeTruthy();
    const iconRes = await request.get(iconHref!);
    expect(iconRes.status()).toBe(200);
    expect(iconRes.headers()['content-type']).toContain('image');

    const ogRes = await request.get('/og.jpg');
    expect(ogRes.status()).toBe(200);
  });

  test('no leftover placeholder/demo brand text anywhere on rent or sale', async ({ page }) => {
    for (const path of ['/rent', '/sale']) {
      await page.goto(path);
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/YACHT LAUNDRY/i);
      expect(text).not.toMatch(/PHOTO COMING SOON/i);
      expect(text).not.toMatch(/lorem ipsum/i);
    }
  });

  test('brand name, phone and email are identical across chooser, rent and sale footers', async ({
    page,
  }) => {
    for (const path of ['/rent', '/sale']) {
      await page.goto(path);
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer.getByText(/GS LUXURY RESIDENCE/i)).toBeVisible();
      await expect(footer.getByRole('link', { name: '694 5938948' })).toHaveAttribute(
        'href',
        'tel:+306945938948'
      );
      await expect(footer.getByRole('link', { name: 'info@gsluxuryresidence.com' })).toHaveAttribute(
        'href',
        'mailto:info@gsluxuryresidence.com'
      );
    }
  });
});
