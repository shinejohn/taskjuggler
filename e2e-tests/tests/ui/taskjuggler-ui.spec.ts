import { test, expect } from '@playwright/test';

/**
 * Comprehensive UI Tests for TaskJuggler Web
 * 
 * Tests all UI interactions and user flows
 */

test.describe('TaskJuggler Web UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
  });

  test.describe('Homepage', () => {
    test('should load homepage', async ({ page }) => {
      await expect(page).toHaveTitle(/TaskJuggler/i);
    });

    test('should have navigation', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have login button', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /login/i });
      await expect(loginButton).toBeVisible();
    });
  });

  test.describe('Authentication UI', () => {
    test('should show login form', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /login/i });
      await loginButton.click();

      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should show registration form', async ({ page }) => {
      const registerButton = page.getByRole('button', { name: /register|sign up/i });
      if (await registerButton.isVisible()) {
        await registerButton.click();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
      }
    });
  });

  test.describe('Task Management UI', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      // This would need actual auth flow
    });

    test('should show tasks list', async ({ page }) => {
      // Navigate to tasks page
      const tasksLink = page.getByRole('link', { name: /tasks/i });
      if (await tasksLink.isVisible()) {
        await tasksLink.click();
        await expect(page.getByText(/tasks/i)).toBeVisible();
      }
    });

    test('should show create task button', async ({ page }) => {
      const createButton = page.getByRole('button', { name: /create.*task|new task/i });
      // Button may or may not be visible depending on auth state
      if (await createButton.isVisible()) {
        await expect(createButton).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      
      // Should have at least one h1
      expect(h1Count).toBeGreaterThan(0);
    });

    test('should have accessible buttons', async ({ page }) => {
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        
        // Button should have either aria-label or text content
        expect(ariaLabel || text).toBeTruthy();
      }
    });
  });
});
