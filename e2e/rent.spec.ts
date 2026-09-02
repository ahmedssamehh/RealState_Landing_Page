import { test, expect } from '@playwright/test';

test.describe('Rent collection ("/rent")', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rent');
  });

  test('hero, nav and both residences render', async ({ page }) => {
    await expect(page).toHaveTitle(/Luxury Apartments for Rent in Athens/i);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'RENTALS' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'ABOUT' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'CONTACT' })).toBeVisible();

    await expect(page.locator('#hero').getByRole('heading', { name: /STAY AWAITS/i })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'GS Luxury Residence Plaka' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'GS Luxury Residence Voula' })).toBeVisible();
  });

  test('residence detail popup shows real Airbnb data and links out', async ({ page }) => {
    await page
      .getByRole('article')
      .filter({ hasText: 'GS Luxury Residence Plaka' })
      .getByRole('button', { name: /VIEW ALL DETAILS/i })
      .click();

    const dialog = page.getByRole('dialog', { name: /details/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'GS Luxury Residence Plaka' })).toBeVisible();
    await expect(dialog.getByText('RESIDENCE 01')).toBeVisible();
    await expect(dialog.getByText('00003634314')).toBeVisible(); // registration number

    // The same "check availability" link is repeated near the price and again
    // in the closing CTA row — either instance carries the same real href.
    const airbnbLink = dialog.getByRole('link', { name: /CHECK AVAILABILITY ON AIRBNB/i }).first();
    await expect(airbnbLink).toHaveAttribute('href', /airbnb\.com\/rooms\/1679830319630435744/);
    await expect(airbnbLink).toHaveAttribute('target', '_blank');

    // The full-screen click-outside backdrop is also labelled "CLOSE" for a11y
    // and sits behind the panel — [data-detail-close] is the actual visible button.
    await dialog.locator('[data-detail-close]').click();
    await expect(dialog).toBeHidden();
  });

  test('switching to Greek translates the hero and nav', async ({ page }) => {
    await page.getByRole('button', { name: 'ΕΛ' }).click();
    await expect(page.locator('#hero').getByRole('heading', { name: /Η ΔΙΑΜΟΝΗ/i })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'ΕΝΟΙΚΙΑΣΕΙΣ' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'ΣΧΕΤΙΚΑ' })).toBeVisible();
  });

  test('footer shows the rental tagline and correct collection switch', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText('ATHENS APARTMENTS TO RENT')).toBeVisible();
    await expect(footer.getByText('RENT', { exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'BUY' })).toHaveAttribute('href', '/sale');
    await expect(footer.getByRole('link', { name: '694 5938948' })).toHaveAttribute(
      'href',
      'tel:+306945938948'
    );
  });
});
