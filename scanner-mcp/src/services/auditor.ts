// ============================================================
// CORE PAGE AUDITOR SERVICE
// ============================================================
// The engine: land on page, find everything, test everything.
// This is framework-agnostic and works with ANY web app.
// ============================================================

import { chromium, Browser, BrowserContext, Page, ElementHandle } from 'playwright';
import fs from 'fs';
import path from 'path';
import {
  ElementQuery, ElementInfo, ElementTestResult, PageAuditResult,
  FullAuditReport, AuditSummary, FixableIssue, FixCategory,
  TestStatus, AppConfig
} from '../types.js';

// ---- Element discovery queries ----
const ELEMENT_QUERIES: ElementQuery[] = [
  { selector: 'a[href]', type: 'link', description: 'Hyperlink', testAction: 'click' },
  { selector: 'button:not([disabled])', type: 'button', description: 'Button', testAction: 'click' },
  { selector: '[role="button"]:not([disabled])', type: 'button', description: 'ARIA button', testAction: 'click' },
  { selector: 'input[type="submit"]:not([disabled])', type: 'button', description: 'Submit button', testAction: 'click' },
  { selector: 'nav a, [role="navigation"] a', type: 'nav-link', description: 'Nav link', testAction: 'click' },
  { selector: '[aria-haspopup="true"], [aria-expanded], .dropdown-toggle', type: 'dropdown', description: 'Dropdown trigger', testAction: 'click' },
  { selector: '[role="menuitem"]', type: 'menu-item', description: 'Menu item', testAction: 'click' },
  { selector: '[role="tab"]', type: 'tab', description: 'Tab', testAction: 'click' },
  { selector: 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="number"], textarea', type: 'text-input', description: 'Text input', testAction: 'focus-and-type' },
  { selector: 'select', type: 'select', description: 'Select dropdown', testAction: 'open-select' },
  { selector: 'input[type="checkbox"]:not([disabled])', type: 'checkbox', description: 'Checkbox', testAction: 'toggle' },
  { selector: 'input[type="radio"]:not([disabled])', type: 'radio', description: 'Radio button', testAction: 'toggle' },
  { selector: '[data-modal], [data-toggle="modal"], [data-bs-toggle="modal"]', type: 'modal-trigger', description: 'Modal trigger', testAction: 'click' },
  { selector: 'details summary, [data-toggle="collapse"], [data-bs-toggle="collapse"]', type: 'accordion', description: 'Accordion', testAction: 'click' },
  { selector: '[onclick], [tabindex="0"]:not(a):not(button):not(input):not(select)', type: 'custom-clickable', description: 'Custom clickable', testAction: 'click' },
  { selector: 'audio, video', type: 'media', description: 'Media player', testAction: 'check-controls' },
];

const MAX_ELEMENTS = 500;
const SCREENSHOT_DIR = './audit-screenshots';
const REPORT_DIR = './audit-reports';

export class PageAuditorService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async init(): Promise<void> {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: true,
    });
  }

  async cleanup(): Promise<void> {
    if (this.browser) await this.browser.close();
    this.browser = null;
    this.context = null;
  }

  // ============================================================
  // SINGLE PAGE AUDIT
  // ============================================================
  async auditPage(url: string, pageName: string, appName: string = 'Unknown'): Promise<PageAuditResult> {
    if (!this.context) await this.init();

    const page = await this.context!.newPage();
    const startTime = Date.now();
    const result: PageAuditResult = {
      url, name: pageName, app: appName,
      timestamp: new Date().toISOString(),
      loadStatus: 'unknown', loadTimeMs: 0,
      elements: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, errors: 0, skipped: 0 },
    };

    try {
      // Load page
      const response = await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
      result.loadTimeMs = Date.now() - startTime;

      if (!response) {
        result.loadStatus = 'FAIL — No response';
        return result;
      }

      const status = response.status();
      if (status >= 400) {
        result.loadStatus = `FAIL — HTTP ${status}`;
        return result;
      }
      result.loadStatus = `OK — HTTP ${status}`;

      // Wait for JS to settle
      await page.waitForTimeout(2000);

      // DISCOVER elements
      const elements = await this.discoverElements(page);

      // TEST each element
      for (let i = 0; i < elements.length; i++) {
        const elResult = await this.testElement(page, elements[i], url, i, elements.length);
        result.elements.push(elResult);
        this.updateSummary(result.summary, elResult.status);
      }

    } catch (err) {
      result.loadStatus = `ERROR — ${(err as Error).message}`;
    } finally {
      await page.close();
    }

    return result;
  }

  // ============================================================
  // FULL AUDIT — All pages across all apps
  // ============================================================
  async auditAll(apps: AppConfig[], tags?: string[]): Promise<FullAuditReport> {
    const startTime = Date.now();
    const runId = `audit-${Date.now()}`;
    const pages: PageAuditResult[] = [];
    const overallSummary: AuditSummary = { total: 0, passed: 0, failed: 0, warnings: 0, errors: 0, skipped: 0 };

    const filtered = tags ? apps.filter(a => a.tags?.some(t => tags.includes(t))) : apps;

    if (!this.context) await this.init();

    for (const app of filtered) {
      for (const pg of app.pages) {
        if (pg.requiresAuth && !app.auth) continue; // Skip auth pages without auth config
        const fullUrl = `${app.baseUrl}${pg.path}`;
        const result = await this.auditPage(fullUrl, pg.name, app.name);
        pages.push(result);
        // Accumulate summary
        overallSummary.total += result.summary.total;
        overallSummary.passed += result.summary.passed;
        overallSummary.failed += result.summary.failed;
        overallSummary.warnings += result.summary.warnings;
        overallSummary.errors += result.summary.errors;
        overallSummary.skipped += result.summary.skipped;
      }
    }

    const report: FullAuditReport = {
      runId, startTime: new Date(startTime).toISOString(),
      endTime: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      pages, overallSummary,
    };

    // Save report
    const reportPath = path.join(REPORT_DIR, `${runId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  // ============================================================
  // EXTRACT FIXABLE ISSUES from a report
  // ============================================================
  extractFixableIssues(report: FullAuditReport): FixableIssue[] {
    const issues: FixableIssue[] = [];
    let idx = 0;

    for (const pageResult of report.pages) {
      for (const el of pageResult.elements) {
        if (el.status === 'FAIL' || el.status === 'ERROR') {
          issues.push({
            issueId: `${report.runId}-${idx++}`,
            app: pageResult.app,
            page: pageResult.name,
            pageUrl: pageResult.url,
            elementType: el.elementType,
            label: el.label,
            selector: el.selector,
            status: el.status,
            details: el.details,
            screenshot: el.screenshot,
            consoleErrors: el.consoleErrors,
            networkErrors: el.networkErrors,
            fixCategory: this.categorizeIssue(el),
            resolved: false,
          });
        }
      }
    }

    return issues;
  }

  // ============================================================
  // INTERNAL: Discover every interactive element
  // ============================================================
  private async discoverElements(page: Page): Promise<Array<{ handle: ElementHandle; query: ElementQuery } & ElementInfo>> {
    const elements: Array<{ handle: ElementHandle; query: ElementQuery } & ElementInfo> = [];
    const seen = new Set<string>();

    for (const query of ELEMENT_QUERIES) {
      const found = await page.$$(query.selector);

      for (const el of found) {
        const fingerprint = await this.getFingerprint(el);
        if (seen.has(fingerprint)) continue;
        seen.add(fingerprint);

        const info = await this.getElementInfo(el, query);
        if (info) {
          elements.push({ handle: el, query, ...info });
        }
        if (elements.length >= MAX_ELEMENTS) break;
      }
      if (elements.length >= MAX_ELEMENTS) break;
    }

    return elements;
  }

  private async getFingerprint(el: ElementHandle): Promise<string> {
    try {
      return await el.evaluate((node: Element) => {
        const tag = node.tagName;
        const id = (node as HTMLElement).id || '';
        const href = node.getAttribute('href') || '';
        const text = (node.textContent || '').trim().substring(0, 50);
        const name = node.getAttribute('name') || '';
        const ariaLabel = node.getAttribute('aria-label') || '';
        return `${tag}|${id}|${href}|${name}|${ariaLabel}|${text}`;
      });
    } catch {
      return Math.random().toString();
    }
  }

  private async getElementInfo(el: ElementHandle, query: ElementQuery): Promise<ElementInfo | null> {
    try {
      const raw = await el.evaluate((node: Element) => {
        const el = node as HTMLElement;
        const rect = el.getBoundingClientRect();
        return {
          tag: node.tagName.toLowerCase(),
          id: el.id || null,
          className: (typeof el.className === 'string' ? el.className : null),
          text: (node.textContent || '').trim().substring(0, 100),
          href: node.getAttribute('href'),
          name: node.getAttribute('name'),
          ariaLabel: node.getAttribute('aria-label'),
          placeholder: node.getAttribute('placeholder'),
          title: node.getAttribute('title'),
          inputType: node.getAttribute('type'),
          role: node.getAttribute('role'),
          disabled: (el as HTMLButtonElement).disabled || node.getAttribute('aria-disabled') === 'true',
          visible: rect.width > 0 && rect.height > 0,
          x: Math.round(rect.x), y: Math.round(rect.y),
          width: Math.round(rect.width), height: Math.round(rect.height),
        };
      });

      if (!raw.visible || raw.disabled) return null;

      const label = raw.ariaLabel || raw.text || raw.placeholder || raw.title || raw.name || raw.href || `<${raw.tag}>`;

      return {
        ...raw,
        elementType: query.type,
        testAction: query.testAction,
        description: query.description,
        label: label.length > 60 ? label.substring(0, 57) + '...' : label,
      };
    } catch {
      return null;
    }
  }

  // ============================================================
  // INTERNAL: Test a single element
  // ============================================================
  private async testElement(
    page: Page,
    element: { handle: ElementHandle; query: ElementQuery } & ElementInfo,
    pageUrl: string,
    index: number,
    total: number
  ): Promise<ElementTestResult> {
    const result: ElementTestResult = {
      index: index + 1,
      elementType: element.elementType,
      label: element.label,
      tag: element.tag,
      href: element.href,
      id: element.id,
      location: `(${element.x}, ${element.y})`,
      testAction: element.testAction,
      status: 'unknown' as TestStatus,
      details: '',
      screenshot: null,
      consoleErrors: [],
      networkErrors: [],
      selector: this.buildSelector(element),
    };

    try {
      switch (element.testAction) {
        case 'click':
          await this.testClick(page, element, result, pageUrl);
          break;
        case 'focus-and-type':
          await this.testInput(page, element, result);
          break;
        case 'open-select':
          await this.testSelect(page, element, result);
          break;
        case 'toggle':
          await this.testToggle(page, element, result);
          break;
        case 'check-controls':
          await this.testMedia(page, element, result);
          break;
        default:
          await this.testClick(page, element, result, pageUrl);
      }
    } catch (err) {
      result.status = 'ERROR';
      result.details = `Exception: ${(err as Error).message}`;
    }

    return result;
  }

  // ---- Build a CSS selector that can re-locate this element ----
  private buildSelector(element: ElementInfo): string {
    if (element.id) return `#${element.id}`;
    let sel = element.tag;
    if (element.href) sel += `[href="${element.href}"]`;
    if (element.name) sel += `[name="${element.name}"]`;
    if (element.ariaLabel) sel += `[aria-label="${element.ariaLabel}"]`;
    if (element.role) sel += `[role="${element.role}"]`;
    return sel;
  }

  // ---- Click test ----
  private async testClick(
    page: Page,
    element: { handle: ElementHandle } & ElementInfo,
    result: ElementTestResult,
    originalUrl: string
  ): Promise<void> {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    let domChanged = false;
    let dialogAppeared = false;

    const consoleHandler = (msg: { type: () => string; text: () => string }) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const requestFailedHandler = (req: { method: () => string; url: () => string }) => {
      networkErrors.push(`${req.method()} ${req.url()}`);
    };
    const responseHandler = (resp: { status: () => number; url: () => string }) => {
      if (resp.status() >= 400) networkErrors.push(`${resp.status()} ${resp.url()}`);
    };
    const dialogHandler = async (dialog: { dismiss: () => Promise<void> }) => {
      dialogAppeared = true;
      await dialog.dismiss();
    };

    page.on('console', consoleHandler);
    page.on('requestfailed', requestFailedHandler);
    page.on('response', responseHandler);
    page.on('dialog', dialogHandler);

    const domBefore = await page.evaluate(() => document.body.innerHTML.length);
    const urlBefore = page.url();

    try {
      // Skip external links
      if (element.href?.startsWith('http') && !element.href.includes(new URL(originalUrl).hostname)) {
        result.status = 'SKIP';
        result.details = `External link: ${element.href}`;
        return;
      }

      await element.handle.scrollIntoViewIfNeeded().catch(() => {});
      await element.handle.click({ timeout: 5000 });
      await page.waitForTimeout(1000);

      const urlAfter = page.url();
      const navigationHappened = urlAfter !== urlBefore;
      const domAfter = await page.evaluate(() => document.body.innerHTML.length);
      domChanged = Math.abs(domAfter - domBefore) > 10;

      const newElements = await page.evaluate(() => {
        const modals = document.querySelectorAll('[class*="modal"].show, [role="dialog"]:not([hidden])');
        const toasts = document.querySelectorAll('[class*="toast"].show, [class*="notification"]:not(.hidden)');
        const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
        return { modals: modals.length, toasts: toasts.length, dropdowns: dropdowns.length };
      });

      // Determine result
      if (consoleErrors.length > 0) {
        result.status = 'FAIL';
        result.details = `Console errors: ${consoleErrors.join('; ')}`;
        result.consoleErrors = consoleErrors;
      } else if (networkErrors.length > 0) {
        result.status = 'FAIL';
        result.details = `Network errors: ${networkErrors.join('; ')}`;
        result.networkErrors = networkErrors;
      } else if (navigationHappened) {
        const loaded = await this.checkPageLoaded(page);
        result.status = loaded.ok ? 'PASS' : 'FAIL';
        result.details = loaded.ok ? `Navigated to ${urlAfter}` : `Navigation to ${urlAfter} — ${loaded.error}`;
        await page.goto(originalUrl, { timeout: 15000, waitUntil: 'domcontentloaded' }).catch(() => {});
        await page.waitForTimeout(500);
      } else if (dialogAppeared) {
        result.status = 'PASS';
        result.details = 'Dialog appeared';
      } else if (newElements.modals > 0) {
        result.status = 'PASS';
        result.details = 'Modal opened';
        await page.keyboard.press('Escape');
      } else if (newElements.dropdowns > 0) {
        result.status = 'PASS';
        result.details = 'Dropdown opened';
        await page.keyboard.press('Escape');
      } else if (newElements.toasts > 0) {
        result.status = 'PASS';
        result.details = 'Toast/notification appeared';
      } else if (domChanged) {
        result.status = 'PASS';
        result.details = 'DOM changed';
      } else {
        result.status = 'FAIL';
        result.details = 'NOTHING HAPPENED — No navigation, DOM change, modal, error, or network request. Element appears dead.';
        // Screenshot
        const ssName = `fail-${Date.now()}-${element.elementType}-${(element.label || 'x').replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.png`;
        const ssPath = path.join(SCREENSHOT_DIR, ssName);
        await page.screenshot({ path: ssPath, fullPage: false });
        result.screenshot = ssPath;
      }
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('not visible') || msg.includes('not in the viewport')) {
        result.status = 'SKIP';
        result.details = 'Element not visible/reachable';
      } else if (msg.includes('navigation')) {
        result.status = 'WARNING';
        result.details = `Navigation timed out: ${msg}`;
        await page.goto(originalUrl, { timeout: 15000, waitUntil: 'domcontentloaded' }).catch(() => {});
      } else {
        result.status = 'ERROR';
        result.details = `Click failed: ${msg}`;
      }
    } finally {
      page.removeListener('console', consoleHandler);
      page.removeListener('requestfailed', requestFailedHandler);
      page.removeListener('response', responseHandler);
      page.removeListener('dialog', dialogHandler);
    }
  }

  // ---- Input test ----
  private async testInput(page: Page, element: { handle: ElementHandle } & ElementInfo, result: ElementTestResult): Promise<void> {
    try {
      await element.handle.scrollIntoViewIfNeeded().catch(() => {});
      await element.handle.focus();
      await element.handle.fill('test input');
      const value = await element.handle.inputValue();
      result.status = value === 'test input' ? 'PASS' : 'WARNING';
      result.details = value === 'test input' ? 'Input accepts text' : `Input didn't retain value: "${value}"`;
      await element.handle.fill('');
    } catch (err) {
      result.status = 'FAIL';
      result.details = `Input failed: ${(err as Error).message}`;
    }
  }

  // ---- Select test ----
  private async testSelect(page: Page, element: { handle: ElementHandle } & ElementInfo, result: ElementTestResult): Promise<void> {
    try {
      const options = await element.handle.evaluate((sel: HTMLSelectElement) => {
        return Array.from(sel.options).map(o => ({ value: o.value, text: o.text, disabled: o.disabled }));
      });
      if (options.length === 0) { result.status = 'FAIL'; result.details = 'Select has NO options'; }
      else if (options.length === 1 && options[0].value === '') { result.status = 'WARNING'; result.details = 'Only placeholder option'; }
      else {
        const target = options.find(o => o.value !== '' && !o.disabled);
        if (target) {
          await element.handle.selectOption(target.value);
          result.status = 'PASS';
          result.details = `${options.length} options. Selected: "${target.text}"`;
        } else { result.status = 'WARNING'; result.details = 'All options disabled'; }
      }
    } catch (err) { result.status = 'FAIL'; result.details = `Select failed: ${(err as Error).message}`; }
  }

  // ---- Toggle test ----
  private async testToggle(page: Page, element: { handle: ElementHandle } & ElementInfo, result: ElementTestResult): Promise<void> {
    try {
      await element.handle.scrollIntoViewIfNeeded().catch(() => {});
      const before = await element.handle.isChecked();
      await element.handle.click();
      const after = await element.handle.isChecked();
      if (before !== after) { result.status = 'PASS'; result.details = `Toggled ${before ? 'off' : 'on'}`; await element.handle.click(); }
      else { result.status = 'FAIL'; result.details = 'Click did not change checked state'; }
    } catch (err) { result.status = 'FAIL'; result.details = `Toggle failed: ${(err as Error).message}`; }
  }

  // ---- Media test ----
  private async testMedia(page: Page, element: { handle: ElementHandle } & ElementInfo, result: ElementTestResult): Promise<void> {
    try {
      const info = await element.handle.evaluate((media: HTMLMediaElement) => ({
        src: media.src || media.querySelector('source')?.src || null,
        controls: media.controls,
        tag: media.tagName,
      }));
      if (!info.src) { result.status = 'FAIL'; result.details = 'No source'; }
      else if (!info.controls) { result.status = 'WARNING'; result.details = 'No controls attribute'; }
      else { result.status = 'PASS'; result.details = `${info.tag} with controls`; }
    } catch (err) { result.status = 'FAIL'; result.details = `Media check failed: ${(err as Error).message}`; }
  }

  // ---- Check page loaded ----
  private async checkPageLoaded(page: Page): Promise<{ ok: boolean; error?: string }> {
    try {
      const status = await page.evaluate(() => {
        const body = document.body.textContent || '';
        const is404 = body.includes('404') || body.includes('Not Found');
        const is500 = body.includes('500') || body.includes('Server Error');
        const isEmpty = body.trim().length < 50;
        return { is404, is500, isEmpty };
      });
      if (status.is500) return { ok: false, error: '500 Server Error' };
      if (status.is404) return { ok: false, error: '404 Not Found' };
      if (status.isEmpty) return { ok: false, error: 'Page empty' };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }

  // ---- Categorize issue for AI ----
  private categorizeIssue(el: ElementTestResult): FixCategory {
    if (el.details.includes('404')) return 'dead-link';
    if (el.details.includes('500')) return 'broken-navigation';
    if (el.details.includes('NOTHING HAPPENED')) return 'dead-button';
    if (el.consoleErrors.length > 0) return 'js-error';
    if (el.networkErrors.length > 0) return 'network-error';
    if (el.details.includes('NO options')) return 'empty-form';
    return 'unknown';
  }

  private updateSummary(summary: AuditSummary, status: TestStatus): void {
    summary.total++;
    if (status === 'PASS') summary.passed++;
    else if (status === 'FAIL') summary.failed++;
    else if (status === 'WARNING') summary.warnings++;
    else if (status === 'ERROR') summary.errors++;
    else if (status === 'SKIP') summary.skipped++;
  }
}
