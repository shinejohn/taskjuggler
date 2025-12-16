import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Tests', () => {
  test('Task Juggler should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
    
    // Check mobile menu button is visible
    await expect(page.locator('button:has-text("Menu"), button[aria-label*="menu" i]')).toBeVisible();
    
    // Check text is readable
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('Login page should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto((process.env.TASKJUGGLER_URL || 'http://localhost:5173') + '/login');
    
    // Form should be visible and usable
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Projects.ai should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(process.env.PROJECTS_URL || 'http://localhost:5174');
    
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('Process.ai should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(process.env.PROCESS_URL || 'http://localhost:5175');
    
    await expect(page.locator('h1, h2')).toBeVisible();
  });
});

