import { Page, expect } from '@playwright/test';

/**
 * Login helper function
 */
export async function login(
  page: Page,
  email: string = 'test@taskjuggler.com',
  password: string = 'Test1234!'
) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for navigation after login
  await page.waitForURL(/dashboard|processes|projects/, { timeout: 10000 });
}

/**
 * Logout helper function
 */
export async function logout(page: Page) {
  // Look for logout button/link - adjust selector based on your UI
  const logoutButton = page.locator('text=Logout').or(page.locator('text=Sign out'));
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/login/, { timeout: 5000 });
  }
}

/**
 * Register helper function
 */
export async function register(
  page: Page,
  name: string,
  email: string,
  password: string
) {
  await page.goto('/register');
  await page.fill('input[name="name"], input[placeholder*="name" i]', name);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]:first-of-type', password);
  await page.fill('input[type="password"]:last-of-type', password);
  await page.click('button[type="submit"]');
  // Wait for navigation after registration
  await page.waitForURL(/dashboard|processes|projects/, { timeout: 10000 });
}

/**
 * Verify user is logged in
 */
export async function verifyLoggedIn(page: Page) {
  await expect(page.locator('body')).not.toContainText('Sign in');
  await expect(page).not.toHaveURL(/login/);
}

