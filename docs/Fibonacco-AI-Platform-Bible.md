# The Fibonacco AI Platform Bible
## The Complete Platform Reference — Business, Architecture, Integration, and Status
### v1.0 — June 2026

---

## About This Document

This is the single source of truth for the Fibonacco AI Platform (the "taskjuggler" monorepo at `Fibonacco/taskjuggler/Code`). It is designed to be consumed by both humans and AI systems. Every section explains not just what exists and how it works, but why — because the why is what prevents the next developer or AI session from breaking something that took a week to build.

This document replaces and absorbs the 200+ status/report markdown files cluttering the `Code/` root (DEPLOYMENT_*, TEST_*, RAILWAY_*, AGENT_*, etc.). Those files are historical artifacts from earlier build phases — many describe states that no longer exist. **Do not treat them as truth. This document and `Code/CLAUDE.md` are truth.**

**How to use this document:**

- **Humans:** read Part 1 and Part 2 before touching anything.
- **AI sessions (Claude Code, Cursor):** load this document plus `Code/CLAUDE.md`. Never modify module loading, middleware, or migrations without reading Part 2. Never modify provisioning or subscription code without reading Part 3 and `taskjuggler-api/PROVISIONING_CONTRACT.md`.
- **Cross-platform work:** the contracts between this platform, the Publishing platform (Day-News/Multisite), and the Command Center (Learning-Center) live in the **Fibonacco Integration Bible** (`Fibonacco/Fibonacco-Integration-Bible.md`). Read it before changing any integration surface.

**Critical naming rule:** the company is **Fibonacco**. Any occurrence of "fibonacci" in code or docs is hallucination damage from an old LLM and must be fixed on sight (a full sweep was completed June 11, 2026). Never introduce "fibonacci" into this codebase.

---

# PART 1: THE BUSINESS

## 1.1 What the AI Platform Is

The Fibonacco AI Platform is the suite of AI-powered productivity apps sold to small businesses, sitting alongside Fibonacco's two other platforms:

1. **Publishing Platform** (`Fibonacco/Day-News/Multisite`) — Day.News, GoEventCity, DowntownGuide, GoLocalVoices, AlphaSite. One Laravel codebase, five domain-routed apps. Nearly complete.
2. **Command Center** (`Fibonacco/Learning-Center`) — the CRM/sales/provisioning hub. When a customer buys a product, the Command Center provisions it on the target platform. A separate AI team owns this.
3. **AI Platform** (this repo) — the AI apps themselves.

The build sequence is: Publishing → Command Center → AI Platform. This repo is the third leg.

## 1.2 The Apps

One Laravel 12 API (`taskjuggler-api/`) serves all apps. Each app is a standalone Vue 3 SPA (NOT Inertia) plus the shared API:

| App | Frontend | Backend surface | Status |
|---|---|---|---|
| TaskJuggler | `taskjuggler-web/` + `taskjuggler-app/` (React Native) | Tasks module + core API | Active, tested |
| 4Process | `process-web/` | Processes module | Active, engine complete, tested |
| 4Projects | `projects-web/` | Projects module | **ON HOLD — founder will provide context. Do not touch.** |
| URPA (AI receptionist) | `urpa-web/` | Urpa module (routes loaded, migrations NOT run — see 2.3) | Partially wired |
| 4Calls / Coordinator | `coordinator-web/` | `routes/coordinator.php` + Coordinator module | Active, tested |
| SiteHealth Scanner | `scanner-web/` | SiteHealth module | Active |
| IdeaCircuit | `ideacircuit-web/` | inline routes in `routes/api.php` | Active |
| Official Notice | `official-notice-web/` | OfficialNotice module (own ServiceProvider) | Active |

**History that explains the mess:** each app originally had its own everything. The platform was then consolidated into this shared-API model (like the Publishing platform). Two verticals were forked out as independent platforms: `4people Platform` and `4healthcare-Platform` (4Doctors moved there for HIPAA isolation — the Doctors module was removed from this repo June 2026). Residue from the per-app era remains (see 2.3 and 2.6).

## 1.3 How It Makes Money

Subscriptions, provisioned by the Command Center after a CRM sale. The plan tier on a team's subscription controls which modules its users can reach:

| Tier | Modules |
|---|---|
| free, starter | core, tasks |
| pro | core, tasks, processes |
| business, enterprise | core, tasks, processes, projects |

Source of truth: `config/modules.php` (`subscriptions` key). Enforcement: `ModuleAccess` middleware reads `$team->subscription?->plan` (the `subscription()` relation on Team filters to `status = 'active'`). No active subscription = `free`.

The revenue paths are covered by tests (`tests/Feature/Api/ProvisioningApiTest.php`, `ProcessExecutionApiTest.php`, `TasksApiTest.php`, `AuthApiTest.php`). Keep them green.

---

# PART 2: THE ARCHITECTURE

## 2.1 Monorepo Layout

See `Code/CLAUDE.md` for the directory map, stack, conventions (UUID PKs, PostgreSQL-only syntax, no `env()` outside config, Vue/TS rules), and the Railway/Nixpacks deploy pipeline. That file is enforced; this Bible does not repeat it.

## 2.2 Module Loading — Two Generations, Both Live

This is the most important structural fact in the backend. There are **two coexisting module-loading mechanisms**:

**Generation 2 (the module system):** `App\Providers\ModuleServiceProvider` loads routes and migrations for modules flagged in `config('modules.enabled')`: **core, tasks, processes, projects**. These are the subscription-gated product modules.

**Generation 1 (legacy direct loading):** everything else is wired by hand:
- `routes/api.php` directly `require`s route files for **Communications**, **Processes**, **Projects**, **Urpa** (under `/api/urpa` prefix), and **Coordinator** (`routes/coordinator.php`), plus inline IdeaCircuit routes.
- `AppServiceProvider` loads migrations for Processes, Projects, Communications.
- **OfficialNotice** has its own service provider in `bootstrap/providers.php`.
- **SiteHealth** controllers are imported directly into `routes/api.php`.

Consequences:
- A module being absent from `config('modules.enabled')` does NOT mean its routes are dead (Urpa routes are live) — and being enabled does not mean it is sold (gating is separate, via `ModuleAccess`).
- Processes/Projects routes are loaded BOTH by ModuleServiceProvider and by `routes/api.php`. Run `php artisan route:cache` locally before deploying — duplicate route names are a known deploy killer.
- Long-term direction: migrate Gen-1 modules into the module system. Do not start this without checking route-name collisions.

## 2.3 The Urpa Module Is Half-Alive

Urpa routes are loaded, but the Urpa module is NOT in `config('modules.enabled')`, so **its migrations have never run in any environment**. `urpa_*` tables (including `urpa_fibonacco_link`) do not exist. Any Urpa endpoint that touches the database will fail at runtime.

Because the tables never existed, the fibonacci→fibonacco rename was done by editing the create-migrations in place — no rename migrations were needed. If you enable the Urpa module, its migrations run fresh and correct.

## 2.4 Middleware That Will Bite You

- **AppContext** (`X-App-Context` header) — required on `/api/auth/login` and `/api/auth/register`. Valid contexts: `urpa, scanner, ideacircuit, taskjuggler, projects, process, coordinator`. Requests without it get 400. All feature tests must send it when logging in.
- **TeamContext** (`X-Team-ID` header, falls back to `current_team_id`) — resolves the team, verifies membership, binds `app('current_team')`, merges `team_id` into the request. Used by Processes and other team-scoped routes.
- **ModuleAccess** — tier gating, see 1.3.

## 2.5 The User Model Alias

`App\Models\User` extends `App\Modules\Core\Models\User` (backward-compatibility alias). Typehints around the codebase (e.g. `Team::addMember(User $user)`) expect the **subclass** `App\Models\User`. Passing the Core parent class fails with a TypeError. **Default to importing `App\Models\User` everywhere outside the Core module's own internals.** Factories (`UserFactory`, `TeamFactory`) are bound to the `App\Models\*` aliases — `App\Modules\Core\Models\Team::factory()` does not resolve.

## 2.6 Stub Migration Disease

A batch of stub migrations dated `2026_01_16_*` was generated during an earlier phase (`$table->id()` + timestamps only). Several collided with the real module migrations (`tasks`, `subscriptions`), breaking every test run and threatening to clobber real tables. The fix pattern, already applied:

```php
public function up(): void
{
    if (Schema::hasTable('tasks')) {
        return; // real module migration owns this table
    }
    // ... stub create with uuid PK
}
```

If you find another `2026_01_16_*` stub colliding with a real table: guard it with `Schema::hasTable()`, never delete the real migration. `2026_06_11_000002_ensure_subscriptions_table_schema.php` converges drifted environments onto the real subscriptions schema. The scanner stubs (`2026_01_16_0802*`) are the ONLY migrations for their tables — leave them.

## 2.7 The Processes Engine

The 4process backend is fully implemented:

- **Models:** `Process` (status draft/active, `canExecute()` = active + has steps), `ProcessStep` (ordered, typed), `ProcessExecution` (status lifecycle, step results).
- **Execution:** `ProcessExecutionService::execute()` runs steps in order. Step types: `action` (log, update_status), `condition`, `delay`, `notification`, `webhook`, `create_task`, `update_task`. Per-step `stop_on_error` config.
- **Triggers:** `ProcessTriggerService` — `task_created`/`task_updated` (wired via `app/Listeners/TriggerProcessOnTask*.php`), `schedule` (wired via `Schedule::call` in `routes/console.php`, runs every minute as `run-scheduled-processes`), `webhook` (`handleWebhook()` exists but has **no inbound route yet** — deferred until a frontend consumer exists).
- **Route-ordering trap (fixed, do not regress):** in `app/Modules/Processes/Routes/api.php`, the literal routes `/processes/executions` MUST be registered before `apiResource('processes')`, or the `{process}` binding swallows them and returns 404. `ProcessExecutionApiTest::test_executions_index_is_not_shadowed_by_process_binding` locks this in.

## 2.8 Testing

`taskjuggler-api/tests/` — PHPUnit on sqlite `:memory:` with `RefreshDatabase`. As of June 11, 2026 the suite is fully green: **96 passed (450 assertions)**. Rules:

- Login in tests requires `X-App-Context` (see 2.4).
- Anything touching teams: create via `Team::factory()->create(['owner_id' => ...])` then `addMember()`.
- Run the full suite before any push: `php artisan test`.

---

# PART 3: INTEGRATION SURFACE (summary — details in the Integration Bible)

## 3.1 Inbound: Command Center → AI Platform provisioning

`POST /api/provision/subscription`, authenticated by `X-Provisioning-Secret` header (`config('services.provisioning.secret')`, env `PROVISIONING_SECRET`, compared with `hash_equals`). Creates/updates user, team, and active subscription; validates `plan_tier` against `config('modules.subscriptions')`. Full contract: `taskjuggler-api/PROVISIONING_CONTRACT.md`. Built June 11, 2026; covered by `ProvisioningApiTest`.

## 3.2 Outbound: AI Platform → Publishing platform bridge

`App\Modules\Urpa\Services\FibonaccoCrmService` reads Fibonacco business data via the Multisite inbound bridge (`Bearer PUBLISHING_BRIDGE_API_KEY`, base URL `PUBLISHING_API_URL` which includes `/api/v1`). Currently real: paginated `GET /bridge/export/businesses` (profile lookup, cached 1h). **Not yet available on the Multisite side:** per-business FAQs, polls, and any server-to-server publishing-workflow API — `FibonaccoPublishingService` returns inert placeholders and logs warnings. Do not invent Multisite endpoints; coordinate via the Integration Bible.

## 3.3 Other external services

Config-driven via `config/services.php` (Twilio, SendGrid, Stripe, OpenRouter, Anthropic, VAPI, ElevenLabs, AWS Connect/SNS/Pinpoint/S3/Transcribe). Stripe webhooks: `StripeWebhookController` (scanner subscriptions use raw `DB::table('subscriptions')` writes — schema-drift defensive).

---

# PART 4: CURRENT STATUS AND GAPS (June 11, 2026)

**Done this cycle:**
- Doctors module removed (lives in `4healthcare-Platform`)
- Processes wiring fixed (route shadowing, scheduler hook)
- CC provisioning endpoint built + contract published
- Fibonacco services implemented against real Multisite bridge APIs
- fibonacci→fibonacco sweep complete (code, migrations, docs, devcontainers)
- Test suite green: 96/96

**Known gaps / deferred:**
1. **4Projects — ON HOLD by founder directive.** No work on Projects module, `projects-web`, or the old "Fibonacco AI Platform" directory until further context is provided.
2. Urpa module not enabled; `urpa_*` tables don't exist (2.3).
3. Process webhook trigger has no inbound route (2.7).
4. Multisite lacks FAQ/poll/publishing-workflow APIs (3.2) — blocked on the Publishing platform team.
5. Gen-1 module loading should eventually migrate into the module system (2.2).
6. The `Code/` root needs doc archaeology: most of the 200+ status MDs should be archived.

---

*Maintained alongside `Code/CLAUDE.md` (conventions) and `Fibonacco/Fibonacco-Integration-Bible.md` (cross-platform contracts). Update this document when architecture or integration facts change — stale truth is worse than no truth.*
