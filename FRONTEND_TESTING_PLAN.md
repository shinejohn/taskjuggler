# Frontend Testing Plan

## Overview
Now that we have:
- ✅ All apps deployed
- ✅ Database seeded with test data
- ✅ All tables populated

We can test our frontend applications using:
1. **Playwright** - Automated browser testing
2. **Scanner-web** - Use our own scanner tool to test all frontend apps!

## Frontend Apps to Test

1. **taskjuggler-web** - Main task management app
2. **scanner-web** - Accessibility/SEO scanner (our testing tool!)
3. **coordinator-web** (4calls.ai) - AI coordinator app
4. **ideacircuit-web** - Meeting/idea management
5. **process-web** (process.ai) - Process management
6. **urpa-web** - Personal assistant
7. **sitehealth-web** - Site health monitoring

## Testing Strategy

### Option 1: Use Scanner-web to Test All Apps
- Add each frontend URL as a site in scanner-web
- Run scans to check accessibility, SEO, performance
- Get automated reports on issues
- Fix issues found by our own tool!

### Option 2: Playwright E2E Tests
- Set up Playwright in scanner-web or taskjuggler-web
- Create test suites for each app
- Test user flows: login, navigation, CRUD operations
- Use seeded test data (test@taskjuggler.com / password)

### Option 3: Hybrid Approach
- Use scanner-web for automated accessibility/performance checks
- Use Playwright for functional/user flow testing

## Next Steps

1. Get CloudFront URLs for all deployed apps
2. Set up Playwright in scanner-web
3. Create test sites in scanner-web for all frontend apps
4. Run initial scans
5. Create Playwright test suites
