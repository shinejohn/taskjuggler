import { expect, afterEach } from 'vitest';
import { cleanup } from '@vue/test-utils';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

