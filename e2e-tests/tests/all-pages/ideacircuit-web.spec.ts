/**
 * Smoke tests for ideacircuit-web — all pages from ALLPAGES.md
 */
import { smokeTest } from './smoke-test.js';
import { APP_PAGES } from './pages.js';

for (const p of APP_PAGES['ideacircuit-web']) {
  smokeTest(p.path, p.auth);
}
