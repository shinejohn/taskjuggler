# The TaskJuggler Platform Bible
## The Complete Reference — Business, Architecture, Conventions, Operations, and Integration
### v1.0 — June 2026

---

## About This Document

This is the single source of truth for the **TaskJuggler AI platform** — the repository that
lives under `taskjuggler/Code/` (Laravel 12 API + 9 Vue 3 SPAs + a React Native mobile app).
It is the sibling of, but **distinct from**, the Fibonacco publishing platform (Day.News /
Multisite). Where the *Fibonacco Content Bible* governs the publishing platform, this Bible
governs the AI/task-exchange platform.

It is written to be consumed by both humans and AI coding sessions. Every section explains not
just *what* exists and *how* it works, but *why* — because the why is what stops the next
session from breaking something that took a week to get right.

**How to use this document:**

- **For AI sessions (Claude Code, Cursor):** Load the table of contents first. Read the parts
  relevant to your task before writing code. `CLAUDE.md` tells you *how* to write code (the
  conventions); this Bible tells you *why things exist and what breaks if you change them*. The
  two are complementary — read both.
- **For humans:** Read Part 1 (Business) and Part 2 (Architecture) before touching anything.
- **Relationship to other docs:** `Code/CLAUDE.md` is the enforced convention file and always
  wins on "how to write code." The user's global `~/.claude/CLAUDE.md` adds cross-project
  rules. This Bible adds the knowledge and intent that neither captures.

> **Important correction to the Fibonacco Content Bible.** The Content Bible (Part 1.4)
> describes "Task Juggler" as a *$6/month government project-management tool*. That description
> is **wrong** — it was written without reading this code. TaskJuggler is a **general-purpose,
> AI-powered task-exchange platform** with a marketplace for human and AI vendors. Government
> PM (4Projects) and accountability tooling are *one app surface among many*, not the product.

---

## Table of Contents

- **Part 1 — The Business:** What TaskJuggler is, the participant model, the app surfaces, the
  revenue model.
- **Part 2 — The Architecture:** One API, many windows. The modular monolith, the SPA fleet,
  the mobile app, the data model.
- **Part 3 — The Modules:** Core, Tasks, Processes, Projects, Communications, Coordinator,
  Urpa, SiteHealth, OfficialNotice — what each owns and how they connect.
- **Part 4 — Conventions:** The code rules that prevent deploy failures and data corruption.
- **Part 5 — Deploy & Operations:** Railway topology, the queue/scheduler split, `ship.sh`,
  CI, the migration traps.
- **Part 6 — Integration:** How TaskJuggler talks to the publishing platform and the Command
  Center. The bridge seams and the provisioning contract.
- **Part 7 — History & Decisions:** How we got here and why. The unfinished consolidation.
- **Appendices:** Glossary, repo map, environment matrix.

---

# PART 1: THE BUSINESS

*Why TaskJuggler exists, who it serves, and what the product actually is.*

---

## 1.1 What TaskJuggler Is

TaskJuggler is an **AI-powered task-exchange platform**. Its core idea is to make *"send me a
task"* as common and as structured as *"send me an email."* Instead of buried emails and
forgotten texts, every request becomes a living, trackable task with clear ownership and an
accountable timeline.

The atomic concept is the **task exchange** built on two roles:

- **Requestor** — the person who needs something done.
- **Owner / Do-er** — the person (or AI agent) who takes responsibility for completing it.

The defining design choice is **do-er-controlled timelines**: the do-er sets their own start
and expected-completion dates; the requestor is kept informed automatically. This single rule
is the product's differentiator — it converts vague back-and-forth into a transparent
commitment with an audit trail.

On top of that core sit:

- An **AI receptionist / assistant** that ingests inbound communication (voice, chat, text,
  email) and converts it into structured tasks, extracting addresses, phone numbers, emails,
  and timelines.
- A **deterministic routing engine** that decides who/what a task or message goes to.
- A **marketplace** where the do-er can be a human vendor *or* an AI vendor.

TaskJuggler is the **original monorepo** from which the sibling platforms `4people` and
`4healthcare` (4Doctors) were forked. Because of HIPAA, healthcare runs as its own isolated
platform — **do not grow healthcare/Doctors features inside this repo.**

## 1.2 The Participant Model

Every interaction reduces to the Requestor ↔ Do-er exchange, but participants enter the system
several ways:

- **Registered users** — authenticate via Sanctum-backed accounts (SSO planned: Google,
  Microsoft, Apple, Okta). They create and receive tasks.
- **Invited non-users** — a task can be sent to anyone by email or phone number; they join
  automatically on first interaction (the network-effect onboarding path).
- **Teams / organizations** — task pools, assignment/reassignment, workload balancing.
- **Vendors (human or AI)** — the marketplace supply side. A do-er can be a person or an AI
  agent that fulfils a task type.

The conversion engine that matters here is the **AI receptionist**: it sits at the inbound
boundary and turns unstructured contact into structured, owned, scheduled tasks.

## 1.3 The App Surfaces (One Platform, Many Windows)

TaskJuggler is not a single app — it is **one Laravel API serving a fleet of purpose-built Vue
SPAs**, each a "window" onto a shared platform. The surfaces:

| Surface | Frontend (Railway service) | What it is |
|---|---|---|
| **TaskJuggler** | `taskjuggler-web` | The flagship task-management app (the core exchange). |
| **Mobile** | `taskjuggler-app` | React Native + Expo app. Not yet in the app stores. |
| **4Calls** | `coordinator-web` | AI call routing / receptionist front end (Coordinator module). |
| **Site Health** | `scanner-web` (+ `scanner-worker`, `scanner-mcp`) | Website/SEO health scanner. |
| **4Process** | `process-web` | Process / workflow automation (Processes module). |
| **4Projects** | `projects-web` | Project management & accountability (Projects module). |
| **URPA** | `urpa-web` | URPA app surface. |
| **Idea Circuit** | `ideacircuit-web` | Idea-capture surface. |
| **Official Notice** | `official-notice-web` | Public-notice / compliance surface (OfficialNotice module). |

Shared Vue components live in `shared-ui/` and are imported as `@taskjuggler/ui`. The whole
frontend is an **npm-workspaces monorepo**.

**These are standalone Vue 3 SPAs — NOT Inertia.** Each SPA talks to the one Laravel API over
JSON. Routing is Vue Router; state is Pinia; real-time is Laravel Echo + Pusher. (Contrast with
the publishing platform, which *is* Inertia+SSR. Do not import publishing-platform assumptions
here.)

## 1.4 Revenue Model

Subscription tiers gate which modules are available (see `config/modules.php` →
`subscriptions`):

- **free** → `core`, `tasks`
- **starter** → `core`, `tasks`
- **pro** → `core`, `tasks`, `processes`
- (higher tiers add `projects`, `coordinator`, etc.)

Payments run through **Stripe** (`stripe/stripe-php`). The marketplace adds transaction
economics on top (human/AI vendor fulfilment). Revenue paths — auth, subscriptions,
provisioning, task CRUD — are the **highest-value code to protect with tests** (currently near
zero coverage; see Part 7).

---

# PART 2: THE ARCHITECTURE

*One API, many windows. Read this before modifying modules, routes, or migrations.*

---

## 2.1 Stack Overview

- **Backend:** Laravel **12**, PHP 8.2–8.4, PostgreSQL, Redis (queues + cache), Sanctum auth.
- **Frontends:** 9 × Vue 3 SPA (Vite, TypeScript, Tailwind, Radix Vue, Lucide), npm workspaces,
  shared `@taskjuggler/ui`.
- **Mobile:** React Native + Expo (`taskjuggler-app`).
- **Deploy:** Railway (Nixpacks), one service per frontend + API + worker + scheduler +
  Postgres + Redis.
- **Key packages:** `laravel/sanctum`, `spatie/laravel-permission`, `twilio/sdk`,
  `sendgrid/sendgrid`, `pusher/pusher-php-server`, `stripe/stripe-php`,
  `php-mqtt/laravel-client`, `php-mcp/laravel`, `predis/predis`, `aws/aws-sdk-php`,
  `dedoc/scramble` (API docs).

## 2.2 The Modular Monolith

The backend is a **modular monolith**. Domain code lives under `app/Modules/<Module>/`, not in
a flat `app/`. Nine modules exist:

```
app/Modules/
  Core            → users, orgs, auth, billing/subscriptions, shared services
  Tasks           → the task-exchange core (Requestor/Do-er, timelines, types)
  Processes       → 4process engine (workflow automation, step execution)
  Projects        → 4projects (project/accountability management)
  Communications  → inbound/outbound channels, messaging, notifications
  Coordinator     → 4Calls routing/receptionist
  Urpa            → URPA domain
  SiteHealth      → website/SEO scanner
  OfficialNotice  → public-notice / compliance
```

### Module enablement is load-bearing

Modules are gated by `config/modules.php`. A module's migrations and routes **only load** if
either:

1. the module is in the `enabled` list (currently `core`, `tasks`, `processes`, `projects`
   are enabled by config/env flags), **or**
2. it is explicitly wired via `loadMigrationsFrom` in `AppServiceProvider`. As of June 2026
   that explicit list is: **Processes, Projects, Communications, Urpa, Coordinator** (plus
   `database/migrations/coordinator`). **OfficialNotice loads its own.**

> **Trap:** an unloaded module = its tables are *silently never created*. If you add a module
> or move tables between modules, confirm the load path or migrations will simply not run.

## 2.3 Routes

```
routes/api.php          (367 lines)  → the main JSON API surface
routes/coordinator.php  (128 lines)  → 4Calls / Coordinator routes
routes/webhooks.php     ( 26 lines)  → inbound webhooks incl. POST /api/webhooks/processes/{webhookId}
routes/channels.php     ( 63 lines)  → broadcast channel auth (Echo/Pusher)
routes/console.php      ( 58 lines)  → scheduler entries + console commands
routes/web.php          ( 12 lines)  → minimal (health/up only; this is an API, not a web app)
```

**Route-name collisions are a real failure mode** across a multi-surface API. Use **unique
route-name prefixes per module/surface**. `route:cache` fails on duplicate names — `ship.sh`
checks this.

## 2.4 The Process Engine (fully ported)

The **4process execution engine** is fully ported into this repo (it was the centerpiece of
the consolidation). It includes:

- `ProcessExecution` / `TriggerService` and **all 7 step types**.
- Event listeners registered in `AppServiceProvider`.
- A scheduler entry in `routes/console.php`.
- A webhook trigger: `POST /api/webhooks/processes/{webhookId}`.

This is the one piece of the old "Fibonacco AI Platform" backend that has been completely
migrated. Other capabilities (marketplace, appointments, inbox/routing) may still be stranded
in the old generation — see Part 7.

## 2.5 The Frontend Fleet

All 9 SPAs are npm workspaces under `Code/`. `shared-ui/` (`@taskjuggler/ui`) is a dependency
of the apps, so **it must build first**. On Railway, a push to `main` rebuilds *every* service,
so a broken build in *any* workspace can fail a deploy — which is why `ship.sh` builds **all**
workspaces locally (shared-ui first) rather than just the changed one.

Frontends bake their API URL at build time from a **committed `.env.production`** (public
`VITE_API_URL` only). Railway services have **no** `VITE_API_URL` var. The live API base is:

```
https://ai-tools-api-production-2c1e.up.railway.app/api
```

(The old `api-web-production-cc91` domain is **dead** — never reference it.)

---

# PART 3: THE MODULES

*What each module owns and how they connect. Read the relevant module before changing it.*

---

- **Core** — identity (users, organizations), Sanctum auth, roles/permissions
  (`spatie/laravel-permission`), billing & subscription tiers, and shared services consumed by
  every other module. The provisioning endpoint (Part 6) belongs here.
- **Tasks** — the heart of the platform: the Requestor/Do-er exchange, task types (action,
  meeting, payment, approval, location, contact, delivery), do-er-controlled timelines, status
  transitions, reminders, audit trails. Every other module ultimately produces or consumes
  tasks.
- **Processes (4process)** — workflow automation. Triggers → executions → steps (7 step
  types). Fully ported and wired (Part 2.4). Webhook-triggerable.
- **Projects (4projects)** — project and accountability management; the "government PM" surface
  the Content Bible mistook for the whole product.
- **Communications** — inbound/outbound channels (Twilio voice/SMS, SendGrid email, Pusher
  real-time, MQTT), message routing, notifications. The AI receptionist's plumbing.
- **Coordinator (4Calls)** — AI call routing / receptionist. Has its own route file
  (`routes/coordinator.php`) and migration dir (`database/migrations/coordinator`). The
  **complete production 4Calls integration on the publishing side** is the reference pattern
  for integrating any AI app (see Part 6).
- **Urpa** — URPA domain surface. Contains the publishing/CRM bridge services
  (`FibonaccoPublishingService`, `FibonaccoCrmService`) — note the spelling **Fibonacco**.
- **SiteHealth** — website/SEO scanner. Newest module; has companion Railway services
  `scanner-worker` and `scanner-mcp`.
- **OfficialNotice** — public-notice / compliance surface. Scaffold stage; loads its own
  migrations.

---

# PART 4: CONVENTIONS

*The rules that prevent deploy failures and silent data corruption. `CLAUDE.md` is the
enforced version; this is the why.*

---

## 4.1 The Three Rules That Prevent 90% of Deploy Failures

1. **Never use `env()` outside `config/` files.** Production runs `config:cache`; after that,
   `env()` returns `null`. Read config values via `config('services.x.key')`. `ship.sh` errors
   on `env()` in `app/`.
2. **Never run composer scripts during the Nixpacks install phase.** Use `--no-scripts` in
   install; run artisan commands explicitly in the build phase. Skipping this causes the
   `RouteGroup` `array_merge` TypeError in Docker.
3. **Check for duplicate route names before deploying.** `php artisan route:cache` locally.
   Duplicate names break the cache.

## 4.2 PHP

- Every PHP file: `declare(strict_types=1);`.
- `final class` for classes in `Models`, `Services`, `Jobs`, `Http/Controllers` (unless
  explicitly designed for extension — check for `extends` before adding `final`).
- **Models use Laravel's built-in `HasUuids` trait** and define `$fillable`.
  > **Divergence from the publishing platform:** Multisite uses a *custom* `App\Concerns\HasUuid`.
  > **TaskJuggler uses Laravel `HasUuids`.** Do not "fix" one to match the other. Shared packages
  > must assume neither.
- Controllers return **JSON** (not Inertia responses). This is an API.
- Use the `casts()` method (Laravel 11/12 style), not the `$casts` property.
- Never commit `dd()`, `dump()`, `ray()`, `var_dump()`.

## 4.3 Database (PostgreSQL — NOT MySQL)

Migrations:

- Primary keys: `$table->uuid('id')->primary()` — never `$table->id()`.
- Foreign keys: `$table->foreignUuid('user_id')` — never `$table->foreignId()`. A `foreignId()`
  (bigint) FK against a uuid `users.id` is a hard PG type-mismatch error.
- Forbidden: `unsigned`, `tinyint`, `mediumint`, `ENUM` (the `$table->enum()` helper),
  `AUTO_INCREMENT`, `DATETIME` (`dateTime()`).
- Use: `integer`, `smallInteger`, `text`, `uuid`, `timestamp`, `timestampTz`. For Postgres
  enums use `DB::statement('CREATE TYPE ... AS ENUM ...')`, not `$table->enum()`.
- Every migration needs a `down()` method.

### PostgreSQL migration traps (hard-won, June 2026)

SQLite-based tests hide all of these. The full chain must be validated on real PostgreSQL
(`ship.sh` Phase 3 does this on a scratch DB):

- **Forward-reference FKs across files** (e.g. processes→projects, coordinator→organizations)
  fail because the referenced table isn't created yet. Fix by renaming the migration file or
  moving the FK into a later guarded migration.
- **Same-timestamp files sort alphabetically.** `issues` before `scans`, `messages` before
  `participants` — ordering bugs hide here.
- **Silent rollback trap.** A failed `DB::statement` inside a `try/catch` *aborts the PG
  transaction*; Laravel then "commits" (= rollback) and records the migration as DONE while its
  tables vanish. The original cause was a **GIN index on a `json` column** — GIN needs `jsonb`.
- **Self-referencing FK inside `Schema::create` fails on PG** — the fluent `->primary()` is
  appended *after* closure-added `foreign()` commands. Add self-FKs in a follow-up
  `Schema::table`.

## 4.4 Vue 3 / TypeScript

- Never use `any` — define interfaces for all data.
- `import type { X }` for type-only imports; remove unused imports.
- No `console.log` / `console.debug` / `debugger` in committed code.
- Routing: Vue Router (`<RouterLink :to="...">`). State: Pinia. Real-time: Laravel Echo +
  Pusher. UI: Tailwind + Radix Vue + `@taskjuggler/ui`. Icons: Lucide Vue.
- Buttons: `type="button"` unless it's a form submit.
- Accessibility: every interactive element needs an accessible name (`aria-label` on icon-only
  buttons; `role="switch"` + `aria-checked` on toggles; labels on inputs; `alt` on images).

## 4.5 When Adding a Feature

1. Add env vars to `config/*.php` **and** `.env.example` — never `env()` directly.
2. Migration → UUID PKs + PostgreSQL syntax + `down()`.
3. API routes → unique route-name prefix per surface to avoid collisions.
4. Shared UI → `shared-ui/`, imported as `@taskjuggler/ui`.
5. New module → confirm it's enabled in `config/modules.php` *or* wired via
   `loadMigrationsFrom` in `AppServiceProvider`, or its tables won't be created.
6. Run `ship.sh --check` before pushing.

---

# PART 5: DEPLOY & OPERATIONS

*Railway topology, the queue/scheduler split, and the tooling. Read before touching deploy
config.*

---

## 5.1 Railway Topology

Project: **"Fibonacco AI Tools"**. ~11 services: 9 frontends + the API + Postgres + Redis,
plus the worker/scheduler/scanner companions.

- **API service** = `ai-tools-api`, `rootDirectory /taskjuggler-api`, builder **NIXPACKS**,
  config from `taskjuggler-api/railway.json`
  (`startCommand: php artisan migrate --force && php artisan serve --port=$PORT`,
  healthcheck `/up`).
- **Queue infra:** services `ai-tools-worker` + `ai-tools-scheduler` (same repo, same root
  `/taskjuggler-api`).
  > **Critical gotcha:** `taskjuggler-api/railway.json` config-as-code **overrides** the
  > dashboard `startCommand`. The worker and scheduler use `railway.worker.json` /
  > `railway.scheduler.json` selected via each service's `railwayConfigFile` setting.
- **Redis:** private domain `Redis.railway.internal`; reference it via `${{Redis.REDIS_URL}}`,
  never a hardcoded host.
- Frontend Railway service names: 4calls=`coordinator-web`, Site Health=`scanner-web`,
  plus `4process`, `4projects`, `URPA`, `Idea Circuit`, `Official Notice`, `taskjuggler-web`.

## 5.2 Build/Deploy Traps (hard-won)

- **A `Dockerfile` in the service root silently wins over `nixpacks.toml` / `railway.json`
  builder settings.** A stale php-fpm Dockerfile (FastCGI :9000, no HTTP) once made every
  healthcheck fail with zero useful logs. `ship.sh` Phase 5 now **errors** if a `Dockerfile`
  coexists with `nixpacks.toml`.
- Nix PHP extensions are `php82Extensions.pdo_pgsql`, **not** `php82Packages.pdo_pgsql`.
- `config:cache` runs in the **build** phase → env vars are baked at build time. Prefer
  push-triggered rebuilds after changing a variable; a bare `railway redeploy` may reuse the
  old image.
- The API needs `APP_KEY`, `APP_ENV`, `APP_DEBUG`, and **`LOG_CHANNEL=stderr`** set — without
  `stderr`, Laravel errors vanish into container-local files.
- Frontends need their committed `.env.production` to ship; a Laravel-style `.gitignore` once
  excluded it (fixed June 2026). Verify a deploy by curling each domain's `index-*.js` for the
  API hostname (~3–6 min after push).

## 5.3 The Two Scripts: `cc.sh` and `ship.sh`

- **`cc.sh`** (repo-root launcher) loads *this Bible* into a Claude Code session
  (`cat <bible> | claude --model … --dangerously-skip-permissions`). Starting an AI session
  with the Bible loaded is the minimum-viable context-continuity practice.
- **`ship.sh`** is the universal pre-deploy validation + commit/push script. It auto-detects
  this repo as `PROJECT_TYPE=taskjuggler` and runs phased checks. **It must run from `Code/`
  (the git repo), not the `taskjuggler/` workspace root.**

### `ship.sh` taskjuggler-specific gates

- **Phase 2 (PHP):** syntax, `env()` in `app/`, debug calls, missing `HasUuids`. Diff base
  includes committed-but-unpushed changes (`@{upstream}..HEAD`).
- **Phase 3 (Migrations):** per-file PG-syntax checks **and** a full migration chain run on a
  *scratch PostgreSQL* (`initdb`/`pg_ctl`) — the only way to catch ordering/FK/silent-rollback
  bugs that SQLite hides. Scans both `database/migrations/` and module `Migrations/` dirs.
- **Phase 5 (Deploy):** errors on Dockerfile-shadows-nixpacks; checks `--no-scripts`,
  `config:cache`/`route:cache` in build phase; `.env.example` coverage; hardcoded
  Railway/localhost hosts.
- **Phase 6 (Frontend):** lockfile presence + commit + platform-completeness (linux-x64 native
  binaries — npm/cli#4828), and **builds all 9 workspaces** (shared-ui first) because Railway
  rebuilds every service on push.
- v4 additions (synced June 2026): optional Larastan (2b) and Pint (2c), `--deep` mode,
  `--review-logs [--fix]` AI log review via Railway + Claude API, `--use-manifest`.

Usage: `./ship.sh --check` (dry run), `./ship.sh "message"` (check + commit + push),
`--force` (emergency skip — still refuses broken PHP syntax).

## 5.4 CI & Backups

- **GitHub Actions** (`.github/workflows/ci.yml`): PHPUnit + `route:cache` + fresh-PG migrate +
  8 workspace builds + a debug-statement grep. Suite ≈ 124 tests (first green June 2026).
- **Sentry** is live on all nine PHP services (gated on `SENTRY_ENABLED`); frontends use
  `@sentry/react`-equivalent wiring. nginx-level 502/504 happen before PHP and never reach
  Sentry.
- **Railway Postgres backups:** daily 07:19 UTC + weekly Sat 06:21 UTC.
- **Keys that exist nowhere yet** (founder must create accounts): mail provider (even
  publishing prod is `MAIL_MAILER=log`), Twilio, Pusher, ElevenLabs, VAPI.

---

# PART 6: INTEGRATION

*How TaskJuggler connects to the publishing platform and the Command Center.*

---

## 6.1 The Three-Platform Landscape

There are three sibling platforms under `Fibonacco/`:

1. **Publishing** (Day-News / Multisite) — the most mature; production on Railway. It already
   exposes the *receiving* end of every integration.
2. **Command Center** (Learning-Center) — owned by a *separate* AI session; backend ~90%,
   frontend disconnected.
3. **AI platform** (this repo, TaskJuggler) — this session's mandate: complete the build,
   common tools, and integration.

## 6.2 The Bridge Seams (this repo's outbound side)

The integration code lives in the **Urpa** module:

- `app/Modules/Urpa/Services/FibonaccoCrmService.php` — implements the **real** bridge protocol
  to the publishing platform's CRM/Command-Center API (`PUBLISHING_BRIDGE_API_KEY`).
- `app/Modules/Urpa/Services/FibonaccoPublishingService.php` — an **honest placeholder**: the
  publishing platform has no server-to-server publishing API yet, so this is a stub until that
  exists. (Spelling is **Fibonacco** in code.)

Known publishing-side bug to design around: `GET /bridge/export/businesses` returns 500 (PG
statement timeout).

## 6.3 The Receiving Ends (already built on the publishing side)

The publishing platform exposes, ready for this repo to consume:

- `POST /api/v1/provision/subscription` (header `X-Provisioning-Secret`) — provisioning.
- Bridge inbound: ROI / audience / bulk exports (`PUBLISHING_BRIDGE_API_KEY`).
- A 68-endpoint Command Center CRM API incl. `/smb/{business}/ai-context`.
- A **complete production 4Calls integration** (`config/fourcalls.php`,
  `FourCallsIntegrationService`) — this is the **reference pattern** for wiring every other AI
  app into the ecosystem.

## 6.4 This Repo's Integration To-Do

- Implement the `FibonaccoPublishingService` / `FibonaccoCrmService` stubs against the real
  Multisite APIs.
- **Add a provisioning endpoint to Core** that mirrors the Multisite `ProvisioningController`
  payload, so the Command Center can provision AI-app subscriptions. When built, **publish its
  contract** for the Command Center AI session (commitment recorded in the integration plan).
- Add tests on the revenue paths (auth, subscriptions, provisioning, task CRUD).

## 6.5 Conventions Divergence (must respect across the bridge)

- UUID trait differs (`HasUuids` here vs custom `HasUuid` in Multisite) — shared packages must
  assume neither.
- Identity/SSO source of truth is expected to be **Multisite** (it owns user records). A future
  OAuth2 SSO server likely lives there.
- The founder wants the documentation restructured into **per-platform bibles** (publishing /
  command center / AI platform) plus **one Integration Bible** owning cross-platform contracts,
  identity/SSO, billing, source-of-truth rules, and shared conventions. **This Bible is the
  AI-platform one.**

---

# PART 7: HISTORY & DECISIONS

*How we got here and why. This prevents re-litigating settled decisions.*

---

## 7.1 The Two-Backends Story (it's a paused migration, not duplication)

1. **Gen 1 — app-has-its-own-everything.** `Code/Fibonacco AI Platform/` is the older
   generation (a Dec 2025 4Projects.ai build: ~30 migrations incl. processes, marketplace,
   appointments, inbox/routing, assistant channels, transactions).
2. **Gen 2 — "one DB, many windows."** The team decided to rebuild the AI platform the way the
   publishing platform was built (one DB, many surfaces): that is `Code/taskjuggler-api/` —
   the Laravel 12 modular monolith documented here.
3. **Consolidation PAUSED mid-migration** when org changes refocused all hands on publishing.
   The "two backends" are an **unfinished migration**, not accidental duplication. The process
   engine is fully ported (Part 2.4); marketplace / appointments / inbox-routing may still be
   stranded in Gen 1.
4. The Learning-Center (Command Center) frontend/backend disconnect is a **known artifact** of
   the same refocus.

## 7.2 Decisions and Their Consequences

- **Standalone Vue SPAs, not Inertia.** Each surface is independently deployable and can evolve
  its own UX. Trade-off: no server-driven routing; the API must be a clean JSON contract.
- **Modular monolith over microservices.** Shared DB and shared Core services keep the
  Requestor/Do-er model consistent across surfaces. Trade-off: module load-order and enablement
  become load-bearing (Part 2.2).
- **Laravel `HasUuids` (not the publishing custom trait).** Chosen for framework-native
  behavior here; the divergence from Multisite is deliberate and must be respected.
- **`railway.json` config-as-code per service.** Lets worker/scheduler/api share one repo with
  different start commands — at the cost of the dashboard `startCommand` being silently
  overridden (Part 5.1).
- **Scratch-PostgreSQL gate in `ship.sh`.** Added after a string of PG-only migration bugs that
  SQLite tests passed. SQLite is not an acceptable proxy for the production database.

## 7.3 Things Tried / Abandoned

- **Dockerfile builder for the API** — a stale php-fpm Dockerfile silently shadowed Nixpacks
  and broke healthchecks. Deleted; `ship.sh` now blocks coexistence.
- **AWS (ECS/Lambda/CodePipeline)** — superseded by Railway/Nixpacks (the many `AWS_*.md` and
  `CODEPIPELINE_*.md` files in `Code/` are historical artifacts).

## 7.4 Current Status (June 2026)

- ~70% production-ready. Near-zero automated tests.
- Core surfaces (TaskJuggler, 4Projects, 4Calls/Coordinator, URPA) near-ready.
- 4Process: engine ported & wired, frontend present.
- SiteHealth: new. OfficialNotice: scaffold. Mobile: not in stores.
- Release-readiness pass shipped June 2026: all 8 frontends serve bundles pointing at the live
  API; queue infra, CI, Sentry, and Postgres backups are live.

---

# APPENDICES

## Appendix A — Glossary

| Term | Meaning |
|---|---|
| **Requestor** | The participant who creates a task / needs something done. |
| **Owner / Do-er** | The participant (human or AI) who commits to completing a task. |
| **Do-er-controlled timeline** | The defining rule: the do-er sets start/completion dates. |
| **AI receptionist** | Inbound AI that converts voice/chat/text/email into structured tasks. |
| **Surface / window** | One Vue SPA onto the shared platform (e.g. 4Calls, 4Projects). |
| **Module** | A backend domain under `app/Modules/`; enablement is config-gated. |
| **Process engine** | The 4process workflow automation engine (7 step types). |
| **`@taskjuggler/ui`** | The shared Vue component library in `shared-ui/`. |
| **`HasUuids`** | Laravel's built-in UUID trait — the one TaskJuggler uses (NOT the custom one). |
| **Gen 1** | `Code/Fibonacco AI Platform/` — the old app-per-everything backend. |
| **ship.sh** | Pre-deploy validation + commit/push. Run from `Code/`. |
| **cc.sh** | Launcher that loads this Bible into a Claude Code session. |

## Appendix B — Repo Map

```
taskjuggler/                       (workspace root — NOT a git repo)
  cc.sh                            → loads this Bible into Claude Code
  ship.sh                          → copy of the deploy validator (synced)
  MD Files/task-juggler-description-3.md → canonical product description
  Code/                            (the git repo)
    CLAUDE.md                      → enforced conventions (read alongside this)
    ship.sh                        → the deploy validator (run from here)
    taskjuggler-api/               → Laravel 12 API
      app/Modules/<9 modules>
      routes/{api,coordinator,webhooks,channels,console,web}.php
      config/modules.php           → module enablement + subscription tiers
      database/migrations/         (+ per-module Migrations/ + migrations/coordinator)
      railway.json / railway.worker.json / railway.scheduler.json
      docs/Taskjuggler-Platform-Bible.md  → THIS FILE
    taskjuggler-web/  taskjuggler-app/  coordinator-web/  scanner-web/
    process-web/  projects-web/  urpa-web/  ideacircuit-web/  official-notice-web/
    scanner-worker/  scanner-mcp/  shared-ui/  (npm workspaces)
    Fibonacco AI Platform/         → Gen 1 (legacy; consolidation source)
```

## Appendix C — Environment Quick Reference

| Concern | Value / rule |
|---|---|
| Live API base | `https://ai-tools-api-production-2c1e.up.railway.app/api` |
| Dead domain | `api-web-production-cc91` — never reference |
| Frontend API URL | committed `.env.production` → public `VITE_API_URL` only |
| Redis | `${{Redis.REDIS_URL}}` (host `Redis.railway.internal`) |
| API start cmd | `railway.json`: `php artisan migrate --force && php artisan serve --port=$PORT` |
| Worker/scheduler | `railway.worker.json` / `railway.scheduler.json` via `railwayConfigFile` |
| Logging | `LOG_CHANNEL=stderr` (mandatory or errors disappear) |
| Required app vars | `APP_KEY`, `APP_ENV`, `APP_DEBUG`, `LOG_CHANNEL` |

---

*The TaskJuggler Platform Bible v1.0 — June 2026. Companion to `Code/CLAUDE.md`. Distinct from
the Fibonacco Content Bible (which governs the publishing platform).*
