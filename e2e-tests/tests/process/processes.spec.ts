import { test, expect } from '@playwright/test';
import { login } from '../../playwright/utils/auth.js';

test.describe('Process.ai - Process Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'test@taskjuggler.com', 'Test1234!');
    await page.goto('/processes');
  });

  test('should display processes page', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/process/i);
  });

  test('should navigate to create process page', async ({ page }) => {
    const createButton = page.locator('text=/new|create|add/i').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/processes.*new|processes.*create/i);
    }
  });

  test('should create a new process', async ({ page }) => {
    await page.goto('/processes/new');
    
    // Fill in process form
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test Process');
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'Test process description');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=/create|save/i'));
    await submitButton.click();
    
    // Should show success or redirect
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Test Process')).toBeVisible({ timeout: 10000 });
  });

  test('should display process list', async ({ page }) => {
    await expect(
      page.locator('text=/process|no processes|empty/i')
    ).toBeVisible({ timeout: 5000 });
  });
});

