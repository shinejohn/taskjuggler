import { test, expect } from '@playwright/test';
import { login, register, verifyLoggedIn } from '../../playwright/utils/auth.js';

test.describe('Task Juggler Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Sign in');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await login(page, 'test@taskjuggler.com', 'Test1234!');
    await verifyLoggedIn(page);
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=/invalid|incorrect|error/i')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/register/);
    await expect(page.locator('h2')).toContainText(/create|register/i);
  });

  test('should register new user', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    await register(page, 'Test User', testEmail, 'Test1234!');
    await verifyLoggedIn(page);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Forgot');
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should submit forgot password form', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'test@taskjuggler.com');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=/sent|email|success/i')).toBeVisible({ timeout: 5000 });
  });

  test('should have Google SSO button on login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
  });

  test('should have Google SSO button on register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('text=Sign up with Google')).toBeVisible();
  });

  test('should navigate from homepage to login', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate from homepage to register', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign-up');
    await expect(page).toHaveURL(/register/);
  });
});

