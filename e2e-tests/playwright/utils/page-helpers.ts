import { Page, expect } from '@playwright/test';

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png` });
}

/**
 * Fill form field by label
 */
export async function fillByLabel(page: Page, label: string, value: string) {
  const labelElement = page.locator(`text=${label}`).first();
  const input = page.locator(`input, textarea`).filter({ has: labelElement }).or(
    page.locator(`input[name*="${label.toLowerCase()}"], textarea[name*="${label.toLowerCase()}"]`)
  ).first();
  await input.fill(value);
}

/**
 * Click button by text
 */
export async function clickByText(page: Page, text: string | RegExp) {
  await page.locator(`text=${text}`).first().click();
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: string | RegExp) {
  await page.waitForResponse(response => {
    const url = response.url();
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
}

/**
 * Verify element is visible and contains text
 */
export async function verifyTextVisible(page: Page, text: string | RegExp, timeout = 5000) {
  await expect(page.locator(`text=${text}`).first()).toBeVisible({ timeout });
}

