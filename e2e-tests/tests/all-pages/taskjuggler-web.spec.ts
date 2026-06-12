/**
 * Smoke tests for taskjuggler-web — all pages from ALLPAGES.md
 */
import { smokeTest } from './smoke-test.js';
import { APP_PAGES } from './pages.js';

for (const p of APP_PAGES['taskjuggler-web']) {
  smokeTest(p.path, p.auth);
}
