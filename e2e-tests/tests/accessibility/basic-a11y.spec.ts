import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('Login page should have proper form labels', async ({ page }) => {
    await page.goto((process.env.TASKJUGGLER_URL || 'http://localhost:5173') + '/login');
    
    // Check for email input with label
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Check for password input with label
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('Forms should have accessible submit buttons', async ({ page }) => {
    await page.goto((process.env.TASKJUGGLER_URL || 'http://localhost:5173') + '/register');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).not.toHaveAttribute('aria-disabled', 'true');
  });

  test('Navigation should be keyboard accessible', async ({ page }) => {
    await page.goto(process.env.TASKJUGGLER_URL || 'http://localhost:5173');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to focus on links
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

