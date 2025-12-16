# Quick Start Guide - E2E Testing

## Prerequisites

1. Node.js 24+ installed
2. All three apps running locally (or set environment variables for deployed URLs)
3. Test user created in database (`test@taskjuggler.com` / `Test1234!`)

## Setup (One Time)

```bash
cd e2e-tests
npm install
npx playwright install chromium
```

## Running Tests

### Quick Test Run

```bash
# Run all tests
npm test

# Run with UI (recommended for first time)
npm run test:ui

# Run specific app tests
npm run test:taskjuggler
npm run test:projects
npm run test:process
```

### Development Mode

```bash
# Interactive UI mode - see tests run in real-time
npm run test:ui

# Headed mode - see browser windows
npm run test:headed

# Debug mode - step through tests
npm run test:debug
```

## Test Structure

- `tests/auth/` - Authentication tests for all apps
- `tests/homepage/` - Homepage tests
- `tests/taskjuggler/` - Task Juggler specific tests
- `tests/projects/` - Projects.ai specific tests
- `tests/process/` - Process.ai specific tests
- `tests/mobile/` - Mobile/responsive tests
- `tests/accessibility/` - Accessibility tests
- `tests/integration/` - Full user flow tests

## Environment Setup

Create `.env` file in `e2e-tests/` directory:

```bash
TASKJUGGLER_URL=http://localhost:5173
PROJECTS_URL=http://localhost:5174
PROCESS_URL=http://localhost:5175
TEST_EMAIL=test@taskjuggler.com
TEST_PASSWORD=Test1234!
```

## Common Commands

```bash
# Generate new test (record interactions)
npm run test:codegen

# View test report
npm run test:report

# Run only authentication tests
npm run test:auth
```

## Troubleshooting

**Tests fail with "Page not found"**
- Make sure apps are running on correct ports
- Check environment variables in `.env`

**Authentication fails**
- Verify test user exists: `test@taskjuggler.com` / `Test1234!`
- Check API is running and accessible

**Selectors not found**
- Use `npm run test:codegen` to record new selectors
- Check browser console for errors
- Use `page.pause()` in test to inspect page state

