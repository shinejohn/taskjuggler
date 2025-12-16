import { test, expect } from '@playwright/test';
import { login, verifyLoggedIn } from '../../playwright/utils/auth.js';

test.describe('Projects.ai Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText(/sign in|login/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await login(page, 'test@taskjuggler.com', 'Test1234!');
    await verifyLoggedIn(page);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/register/);
  });

  test('should have Google SSO button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
  });
});

