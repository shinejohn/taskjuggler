import { test, expect } from '@playwright/test';

test('scanner-web homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Scanner|TaskJuggler/i);
});

test('can login with test credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@taskjuggler.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  // Wait for redirect after login
  await page.waitForURL(/\/(dashboard|sites)/);
});
