/**
 * Smoke tests for official-notice-web — all pages from ALLPAGES.md
 */
import { smokeTest } from './smoke-test.js';
import { APP_PAGES } from './pages.js';

for (const p of APP_PAGES['official-notice-web']) {
  smokeTest(p.path, p.auth);
}
