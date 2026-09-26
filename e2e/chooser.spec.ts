import { test, expect } from '@playwright/test';

test.describe('Chooser ("/")', () => {
  test('loads with brand, headline and both tiles', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/G\.S Luxury Residence/i);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/G\.S Luxury Residence/i);
    await expect(page.getByRole('heading', { name: /HOW WOULD YOU\s*LIKE TO LIVE\?/i })).toBeVisible();

    const rentTile = page.getByRole('link', { name: /VIEW RENTALS/i });
    const buyTile = page.getByRole('link', { name: /VIEW SALES/i });
    await expect(rentTile).toHaveAttribute('href', '/rent');
    await expect(buyTile).toHaveAttribute('href', '/sale');

    await expect(page.getByText('RENT', { exact: true })).toBeVisible();
    await expect(page.getByText('BUY', { exact: true })).toBeVisible();

    // saleReady is true — the "coming soon" badge must not appear.
    await expect(page.getByText(/COMING SOON/i)).toHaveCount(0);
  });

  test('phone and WhatsApp links are correct, and there is no email', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: '694 593 8948' })).toHaveAttribute(
      'href',
      'tel:+306945938948'
    );
    await expect(page.getByRole('link', { name: '694 962 3100' })).toHaveAttribute(
      'href',
      'https://wa.me/306949623100'
    );
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test('RENT tile navigates to /rent, BUY tile navigates to /sale', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /VIEW RENTALS/i }).click();
    await expect(page).toHaveURL(/\/rent$/);

    await page.goto('/');
    await page.getByRole('link', { name: /VIEW SALES/i }).click();
    await expect(page).toHaveURL(/\/sale$/);
  });
});
