import { test, expect } from '@playwright/test';
import { login } from '../../playwright/utils/auth.js';

test.describe('Projects.ai - Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'test@taskjuggler.com', 'Test1234!');
    await page.goto('/app/projects');
  });

  test('should display projects page', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/project/i);
  });

  test('should navigate to create project page', async ({ page }) => {
    const createButton = page.locator('text=/new|create|add/i').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/projects.*new|projects.*create/i);
    }
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('/app/projects/new');
    
    // Fill in project form
    await page.fill('input[name="name"], input[placeholder*="name" i]', 'Test Project');
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'Test project description');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=/create|save/i'));
    await submitButton.click();
    
    // Should show success or redirect
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Test Project')).toBeVisible({ timeout: 10000 });
  });

  test('should display project list', async ({ page }) => {
    await expect(
      page.locator('text=/project|no projects|empty/i')
    ).toBeVisible({ timeout: 5000 });
  });
});

