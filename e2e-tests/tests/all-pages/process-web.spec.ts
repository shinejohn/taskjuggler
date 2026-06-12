/**
 * Smoke tests for process-web — all pages from ALLPAGES.md
 */
import { smokeTest } from './smoke-test.js';
import { APP_PAGES } from './pages.js';

for (const p of APP_PAGES['process-web']) {
  smokeTest(p.path, p.auth);
}
