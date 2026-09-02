import { test, expect } from '@playwright/test';

test.describe('Sale collection ("/sale")', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sale');
  });

  test('hero, nav (PROPERTY, not RENTALS) and the listing render', async ({ page }) => {
    await expect(page).toHaveTitle(/Corner Apartment for Sale in Kallipoli, Piraeus/i);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'PROPERTY' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'RENTALS' })).toHaveCount(0);

    await expect(page.getByRole('heading', { name: /ROOM TO/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kallipoli Corner Apartment' })).toBeVisible();
    await expect(page.getByText('€250,000')).toBeVisible();
  });

  test('detail popup shows the sale specification and a "contact us" CTA, not an Airbnb link', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /VIEW ALL DETAILS/i }).click();

    const dialog = page.getByRole('dialog', { name: /details/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('PROPERTY 01')).toBeVisible();
    await expect(dialog.getByText('ASKING PRICE')).toBeVisible();
    await expect(dialog.getByText('YEAR BUILT')).toBeVisible();
    const dialogText = await dialog.innerText();
    expect(dialogText).toContain('1972');
    expect(dialogText).toMatch(/35.?.?50/); // common expenses

    await expect(dialog.getByRole('link', { name: /AIRBNB/i })).toHaveCount(0);

    const contactLink = dialog.getByRole('link', { name: /CONTACT US/i }).first();
    await expect(contactLink).toHaveAttribute('href', '#contact');
  });

  test('the full photo tour includes a bathroom section (16 real photos)', async ({ page }) => {
    await page.getByRole('button', { name: /VIEW ALL DETAILS/i }).click();
    await page.getByRole('button', { name: /VIEW ALL PHOTOS/i }).click();

    const tour = page.getByRole('dialog', { name: /photo tour/i });
    await expect(tour).toBeVisible();
    await expect(tour.getByText(/16 PHOTOS/i)).toBeVisible();
    await expect(
      tour.getByRole('navigation', { name: /sections/i }).getByRole('button', { name: 'Bathroom', exact: true })
    ).toBeVisible();
  });

  test('switching to Greek shows the Piraeus listing copy', async ({ page }) => {
    await page.getByRole('button', { name: 'ΕΛ' }).click();
    await expect(page.getByRole('heading', { name: /ΧΩΡΟΣ ΓΙΑ ΤΟ/i })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'ΑΚΙΝΗΤΟ' })).toBeVisible();
  });

  test('footer shows the sale tagline and correct collection switch (BUY current, RENT links out)', async ({
    page,
  }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByText('RESIDENCES FOR SALE · ATHENS & PIRAEUS')).toBeVisible();
    await expect(footer.getByText('APARTMENTS TO RENT')).toHaveCount(0);
    await expect(footer.getByText('BUY', { exact: true })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'RENT', exact: true })).toHaveAttribute('href', '/rent');
  });
});
