# Task Juggler E2E Testing Suite

Comprehensive end-to-end UI testing suite for Task Juggler, Projects.ai, and Process.ai applications using Playwright.

## Setup

### Install Dependencies

```bash
cd e2e-tests
npm install
npx playwright install
```

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Base URLs for each application
TASKJUGGLER_URL=http://localhost:5173
PROJECTS_URL=http://localhost:5174
PROCESS_URL=http://localhost:5175

# API URL (for API tests if needed)
API_URL=http://localhost:8000/api

# Test credentials
TEST_EMAIL=test@taskjuggler.com
TEST_PASSWORD=Test1234!
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests for Specific App

```bash
# Task Juggler only
npm run test:taskjuggler

# Projects.ai only
npm run test:projects

# Process.ai only
npm run test:process
```

### Run Specific Test Suite

```bash
# Authentication tests only
npm run test:auth

# Homepage tests
npx playwright test tests/homepage

# Task management tests
npx playwright test tests/taskjuggler
```

### Interactive Mode

```bash
# UI Mode (recommended for development)
npm run test:ui

# Headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug
```

### Generate Tests

```bash
# Record new tests
npm run test:codegen
```

## Test Structure

```
e2e-tests/
├── playwright/
│   ├── .auth/          # Authentication state files
│   └── utils/          # Test utilities and helpers
├── tests/
│   ├── auth/           # Authentication tests
│   ├── homepage/       # Homepage tests
│   ├── taskjuggler/    # Task Juggler specific tests
│   ├── projects/       # Projects.ai specific tests
│   └── process/        # Process.ai specific tests
└── playwright.config.ts
```

## Test Coverage

### Authentication Tests
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Registration flow
- ✅ Forgot password flow
- ✅ Google SSO buttons
- ✅ Navigation between auth pages

### Task Juggler Tests
- ✅ Task list display
- ✅ Create new task
- ✅ Task filtering
- ✅ Task detail view

### Projects.ai Tests
- ✅ Project list display
- ✅ Create new project
- ✅ Project management

### Process.ai Tests
- ✅ Process list display
- ✅ Create new process
- ✅ Process builder

### Homepage Tests
- ✅ Page loads correctly
- ✅ Navigation links work
- ✅ Call-to-action buttons

## Writing New Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../playwright/utils/auth';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/feature-page');
  });

  test('should do something', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd e2e-tests && npm install
      - run: cd e2e-tests && npx playwright install --with-deps
      - run: cd e2e-tests && npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: e2e-tests/playwright-report/
```

## Debugging

### View Test Report

```bash
npm run test:report
```

### Debug Failed Tests

1. Run tests in debug mode: `npm run test:debug`
2. Use Playwright Inspector to step through tests
3. Check screenshots in `test-results/` directory
4. Check videos in `test-results/` directory

## Best Practices

1. **Use Page Object Model** for complex pages
2. **Use data-testid attributes** for reliable selectors
3. **Wait for elements** before interacting
4. **Clean up test data** after tests
5. **Use fixtures** for common setup/teardown
6. **Keep tests independent** - don't rely on test order

## Troubleshooting

### Tests fail with "Element not found"
- Check if selectors match current UI
- Use `page.pause()` to inspect page state
- Check if page loaded completely

### Tests timeout
- Increase timeout in test: `test.setTimeout(60000)`
- Check if API is responding
- Verify environment variables are set

### Authentication fails
- Verify test user exists in database
- Check API URL is correct
- Ensure API is running

