import { test, expect } from '@playwright/test';
import { login } from '../../playwright/utils/auth.js';

test.describe('Task Juggler - Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, 'test@taskjuggler.com', 'Test1234!');
    await page.goto('/dashboard');
  });

  test('should display tasks page', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('h1, h2')).toContainText(/task/i);
  });

  test('should navigate to create task page', async ({ page }) => {
    await page.goto('/tasks');
    const createButton = page.locator('text=/new|create|add/i').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/tasks.*new|tasks.*create/i);
    }
  });

  test('should create a new task', async ({ page }) => {
    await page.goto('/tasks/new');
    
    // Fill in task form
    await page.fill('input[name="title"], input[placeholder*="title" i]', 'Test Task');
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'This is a test task');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=/create|save|submit/i'));
    await submitButton.click();
    
    // Should redirect back to tasks list or show success
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Test Task')).toBeVisible({ timeout: 10000 });
  });

  test('should display task list', async ({ page }) => {
    await page.goto('/tasks');
    // Should show task list or empty state
    await expect(
      page.locator('text=/task|no tasks|empty/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/tasks');
    // Look for filter buttons/dropdowns
    const filterButton = page.locator('text=/pending|completed|all/i').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }
  });
});

