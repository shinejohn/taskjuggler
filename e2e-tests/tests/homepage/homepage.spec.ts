import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('Task Juggler homepage should load', async ({ page }) => {
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
    await expect(page.locator('h1, h2')).toContainText(/task juggler|streamline/i);
  });

  test('Projects.ai homepage should load', async ({ page }) => {
    await page.goto(process.env.PROJECTS_URL || 'http://localhost:5174');
    await expect(page.locator('h1, h2')).toContainText(/project/i);
  });

  test('Process.ai homepage should load', async ({ page }) => {
    await page.goto(process.env.PROCESS_URL || 'http://localhost:5175');
    await expect(page.locator('h1, h2')).toContainText(/process|automate/i);
  });

  test('Task Juggler homepage should have navigation links', async ({ page }) => {
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
    await expect(page.locator('text=Features')).toBeVisible();
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Sign-up')).toBeVisible();
  });

  test('should navigate to login from homepage', async ({ page }) => {
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
    await page.click('text=Login');
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register from homepage', async ({ page }) => {
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
    await page.click('text=Sign-up');
    await expect(page).toHaveURL(/register/);
  });
});

