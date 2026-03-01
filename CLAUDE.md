# CLAUDE.md — TaskJuggler Platform

## What This Is
AI-powered task management platform with an AI receptionist, deterministic routing engine, and marketplace for human + AI vendors. This is the original monorepo that 4people and 4healthcare are forked from.

Stack: **Laravel 12 API** + **Vue 3 SPAs** (9 apps) + **React Native mobile** + **TypeScript**, deployed on **Railway** (Nixpacks) with **PostgreSQL**.

## Project Structure
```
taskjuggler-api/       → Laravel 12 backend (single API serving all apps)
taskjuggler-web/       → Main task management frontend (Vue 3)
taskjuggler-app/       → Mobile app (React Native + Expo)
coordinator-web/       → 4Calls call routing frontend
scanner-web/           → SiteHealth scanner frontend
process-web/           → 4process.ai process management
projects-web/          → 4projects.ai project management
urpa-web/              → URPA frontend
ideacircuit-web/       → IdeaCircuit frontend
official-notice-web/   → Official Notice frontend
shared-ui/             → Shared Vue component library (@taskjuggler/ui)
infrastructure/        → AWS/Pulumi configs
e2e-tests/             → Playwright E2E tests
```

**This is NOT Inertia.** All frontends are standalone Vue 3 SPAs talking to one Laravel API.

**Monorepo**: npm workspaces. Shared components in `shared-ui/` (`@taskjuggler/ui`).

## The Three Rules That Prevent 90% of Deploy Failures

1. **Never use `env()` outside of `config/` files.** Production caches config. `env()` returns null after `config:cache`.
2. **Never run composer scripts during Nixpacks install phase.** Use `--no-scripts` in install, run artisan commands explicitly in build phase.
3. **Check for duplicate route names before deploying.** Run `php artisan route:cache` locally.

---

## PHP Conventions (taskjuggler-api/)

Every Model: uses `HasUuids` trait, defines `$fillable`

Never commit: `dd()`, `dump()`, `ray()`, `var_dump()`

Environment vars: `config('services.openai.key')` — never `env('OPENAI_KEY')` outside config files

Controllers return JSON responses (not Inertia responses).

## Database (PostgreSQL — NOT MySQL)

Migrations:
- Primary keys: `$table->uuid('id')->primary()` — never `$table->id()`
- Foreign keys: `$table->foreignUuid('user_id')` — never `$table->foreignId()`
- Forbidden: `unsigned`, `tinyint`, `mediumint`, `ENUM`, `AUTO_INCREMENT`, `DATETIME`
- Use: `integer`, `smallInteger`, `text`, `uuid`, `timestamp`, `timestampTz`
- Every migration must have a `down()` method

## Vue 3 / TypeScript Conventions

- Never use `any` type — define interfaces for all data
- Use `import type { X }` for type-only imports
- Remove unused imports
- No `console.log`, `console.debug`, `debugger` in committed code
- Routing: Vue Router (`<RouterLink :to="/path">`) — not Inertia
- State: Pinia stores
- Real-time: Laravel Echo + Pusher
- UI: Tailwind CSS + Radix Vue + shared-ui components
- Icons: Lucide Vue
- Buttons: always specify `type="button"` unless it's a form submit

## Accessibility

Every interactive element needs an accessible name:
- Icon-only buttons: `aria-label="description"`
- Toggles: `role="switch"` + `aria-checked` + `aria-label`
- Inputs: associated `<label>` or `aria-label`
- Images: `alt` text (empty `alt=""` for decorative only)

## Key Backend Packages

- `laravel/sanctum` — API authentication
- `spatie/laravel-permission` — Roles and permissions
- `twilio/sdk` — Voice/SMS
- `sendgrid/sendgrid` — Email
- `pusher/pusher-php-server` — Real-time events
- `stripe/stripe-php` — Payments
- `php-mqtt/laravel-client` — MQTT messaging
- `php-mcp/laravel` — MCP server integration
- `predis/predis` — Redis client
- `aws/aws-sdk-php` — AWS services
- `dedoc/scramble` — API documentation

## Deploy Pipeline (Railway / Nixpacks)

Config: `taskjuggler-api/nixpacks.toml`

- `.env` is NOT committed — Railway sets env vars via dashboard
- `composer.lock` IS committed for version pinning
- Frontends deployed as separate Railway services
- API uses Nixpacks builder (PHP 8.2 + PostgreSQL + Node 20)

## Pre-Deploy Checklist

Run from `taskjuggler-api/`:
```bash
php artisan route:cache && php artisan route:clear
php artisan config:cache && php artisan config:clear
composer dump-autoload --optimize
php artisan package:discover --ansi
```

## Testing

- **E2E**: Playwright (in `e2e-tests/`, covers taskjuggler-web, projects-web, process-web)
- **Backend**: PHPUnit (`taskjuggler-api/tests/`)

## When Adding New Features

1. Add env vars to `config/*.php` AND `.env.example` — never use `env()` directly
2. If it adds a migration, use UUID PKs and PostgreSQL syntax
3. If it adds API routes, use unique route name prefixes to avoid collisions
4. If it adds shared UI, put it in `shared-ui/` and import as `@taskjuggler/ui`
5. Run the pre-deploy checklist before pushing
