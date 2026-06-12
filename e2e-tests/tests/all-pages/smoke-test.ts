/**
 * Shared smoke test logic — no skips. Each app's spec imports this and runs only its pages.
 */
import { test, expect } from '@playwright/test';

export function smokeTest(path: string, auth?: boolean) {
  test(`loads ${path}`, async ({ page, baseURL }) => {
    const url = `${baseURL}${path}`;
    const response = await page.goto(url, { waitUntil: 'load', timeout: 20000 });

    expect(response?.status()).toBeLessThan(500);

    if (auth) {
      await new Promise((r) => setTimeout(r, 800));
    }
    if (auth && /^\/(login|signup|sign-in)/.test(new URL(page.url()).pathname)) {
      return;
    }

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toMatch(/Internal Server Error|Something went wrong|HTTP 500/i);
  });
}
