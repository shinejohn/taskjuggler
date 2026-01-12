# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD testing and building.

## Workflows

### 1. `backend-tests.yml`
**Purpose**: Run Laravel backend tests

**Triggers**:
- Push to `main`, `master`, or `develop` branches
- Changes to `taskjuggler-api/**` directory
- Pull requests

**What it does**:
- Sets up PHP 8.2 with required extensions
- Sets up PostgreSQL 16 and Redis services
- Installs Composer and NPM dependencies
- Runs database migrations
- Runs PHPUnit/Pest tests
- Runs Laravel Pint for code style checking

### 2. `frontend-tests.yml`
**Purpose**: Test and build all Vue frontend projects

**Triggers**:
- Push to `main`, `master`, or `develop` branches
- Changes to frontend project directories
- Pull requests

**What it does**:
- Builds shared-ui library first
- For each frontend project:
  - Installs dependencies
  - Runs type checking
  - Runs linting (if configured)
  - Builds the project
  - Runs tests (coordinator-web only)

**Projects tested**:
- coordinator-web
- taskjuggler-web
- scanner-web
- urpa-web
- projects-web
- process-web
- shared-ui

### 3. `lint.yml`
**Purpose**: Run linting checks

**Triggers**:
- Push to `main`, `master`, or `develop` branches
- Pull requests
- Conditional based on commit messages

**What it does**:
- Backend: Runs Laravel Pint
- Frontend: Runs npm lint for each project (if configured)

### 4. `build.yml`
**Purpose**: Build all projects and verify they compile

**Triggers**:
- Push to `main`, `master`, or `develop` branches
- Pull requests

**What it does**:
- Builds shared-ui first
- Builds all frontend projects
- Uploads build artifacts

### 5. `ci.yml`
**Purpose**: Combined CI workflow for quick checks

**Triggers**:
- Push to `main`, `master`, `develop`, or `2026-01-09-5i88` branches
- Pull requests

**What it does**:
- Conditionally runs backend tests
- Conditionally runs frontend tests and builds
- Faster alternative to running all workflows

## Workflow Features

### Error Handling
- Uses `continue-on-error: true` for optional steps
- Graceful fallbacks for missing scripts
- Non-blocking for optional checks

### Caching
- NPM dependencies cached per project
- Speeds up workflow execution

### Dependencies
- Frontend projects depend on shared-ui being built first
- Proper job dependencies configured

### Services
- PostgreSQL 16 for backend tests
- Redis for backend tests
- Health checks configured

## Usage

### Manual Trigger
Workflows run automatically on push/PR. To manually trigger:
1. Go to GitHub Actions tab
2. Select workflow
3. Click "Run workflow"

### Skip CI
Add `[skip ci]` or `[ci skip]` to commit message to skip workflows.

## Configuration

### Node.js Version
All workflows use Node.js 24 (as specified in project engines)

### PHP Version
Backend tests use PHP 8.2

### Database
- PostgreSQL 16
- Test database: `taskjuggler_test`
- In-memory SQLite for unit tests

## Notes

- Some projects may not have all scripts configured (test, lint, type-check)
- Workflows handle missing scripts gracefully
- Build artifacts are uploaded for frontend projects
- Type checking uses `vue-tsc` as fallback if script not configured

