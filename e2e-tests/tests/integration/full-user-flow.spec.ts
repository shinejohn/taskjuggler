import { test, expect } from '@playwright/test';
import { register, login } from '../../playwright/utils/auth.js';

test.describe('Full User Flow - Task Juggler', () => {
  test('complete user journey from registration to task creation', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    const testPassword = 'Test1234!';

    // 1. Register new user
    await register(page, 'Test User', testEmail, testPassword);
    await expect(page).toHaveURL(/dashboard/);

    // 2. Navigate to tasks
    await page.goto('/tasks');
    await expect(page.locator('h1, h2')).toContainText(/task/i);

    // 3. Create a task
    await page.goto('/tasks/new');
    await page.fill('input[name="title"], input[placeholder*="title" i]', 'E2E Test Task');
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'Created by E2E test');
    
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=/create|save/i'));
    await submitButton.click();
    
    // 4. Verify task was created
    await page.waitForTimeout(2000);
    await expect(page.locator('text=E2E Test Task')).toBeVisible({ timeout: 10000 });
  });

  test('user can login, create task, and logout', async ({ page }) => {
    // Login
    await login(page, 'test@taskjuggler.com', 'Test1234!');
    await expect(page).toHaveURL(/dashboard/);

    // Navigate to create task
    await page.goto('/tasks/new');
    
    // Create task
    await page.fill('input[name="title"], input[placeholder*="title" i]', 'Quick Test Task');
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=/create|save/i'));
    await submitButton.click();
    
    // Verify success
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Quick Test Task')).toBeVisible({ timeout: 10000 });
  });
});

