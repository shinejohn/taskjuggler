# Database Migration Guide - Fibonacco AI Tools

## Project Information
- **Project Name:** Fibonacco AI Tools
- **Project ID:** `ca3879ff-fd72-4239-983d-32ade6cace83`
- **Token:** `8f594328-c956-4a15-aa41-c409a95007f6`

## Prerequisites
1. Railway CLI installed: `npm i -g @railway/cli`
2. Authenticated with Railway: `railway login`

## Step 1: Link to the New Project

```bash
cd taskjuggler-api
railway link --project ca3879ff-fd72-4239-983d-32ade6cace83
```

If prompted, select the correct environment (usually "production" or "development").

## Step 2: Verify Connection

```bash
railway status
```

This should show your project information.

## Step 3: Check Current Migration Status

```bash
railway run --service api-web php artisan migrate:status
```

This will show which migrations have been run and which are pending.

## Step 4: Run Migrations

### Option A: Run All Pending Migrations (Recommended)
```bash
railway run --service api-web php artisan migrate --force
```

### Option B: Fresh Migration (⚠️ WARNING: Drops all tables)
Only use this if you're starting fresh and want to recreate everything:
```bash
railway run --service api-web php artisan migrate:fresh --force
```

### Option C: Using the Migration Script
```bash
./run-migrations-new-project.sh
```

## Step 5: Verify Tables Were Created

```bash
railway run --service api-web php artisan tinker
```

Then in tinker:
```php
DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
```

Or check specific tables:
```php
Schema::hasTable('users');
Schema::hasTable('profiles');
Schema::hasTable('tasks');
// etc.
```

## Expected Tables After Migration

Based on the migrations in `database/migrations/`, you should have:

### Core Tables
- `users`
- `profiles`
- `teams`
- `team_members`
- `subscriptions`

### Task Management
- `tasks`
- `task_actions`
- `task_messages`
- `task_invitations`

### Marketplace
- `marketplace_vendors`
- `marketplace_listings`
- `marketplace_bids`

### AI Tools
- `ai_tool_configs`
- `ai_tool_executions`

### Communication
- `inbox_items`
- `routing_rules`
- `contact_lists`
- `contact_list_members`
- `direct_messages`

### Appointments
- `appointment_types`
- `availability_slots`
- `appointments`

### Scanner (Site Health)
- `scanner_sites`
- `scanner_scans`
- `scanner_issues`

### Idea Circuit
- `ideacircuit_meetings`
- `ideacircuit_meeting_participants`
- `ideacircuit_meeting_tasks`
- `ideacircuit_meeting_messages`
- `ideacircuit_meeting_notes`
- `ideacircuit_meeting_transcripts`
- `ideacircuit_meeting_appointments`

### Official Notice (Verified Signing)
- `verified_signing_sessions`
- `verified_signing_participants`
- `verified_signing_documents`

### 4Doctors
- `doctors_patients`
- `doctors_appointments`
- `doctors_clinical_notes`
- `doctors_rcm_claims`
- `doctors_notes`

### URPA & Coordinator
- `urpa_webhook_events`
- `coord_webhooks`

### TEF (Task Execution Framework)
- `tef_actors`
- `tef_relationships`
- `tef_conversations`
- `tef_relationship_history`
- `tef_delegation_rules`
- `tef_claim_codes`

### System Tables
- `migrations`
- `cache`
- `cache_locks`
- `jobs`
- `job_batches`
- `failed_jobs`
- `sessions`
- `password_reset_tokens`
- `personal_access_tokens`
- `notifications`
- `permissions`
- `model_has_permissions`
- `roles`
- `model_has_roles`
- `role_has_permissions`

## Troubleshooting

### Error: "Unauthorized"
Make sure you're logged in:
```bash
railway login
```

### Error: "Service not found"
Check the service name in Railway dashboard. It might be `api` instead of `api-web`:
```bash
railway run --service api php artisan migrate --force
```

### Error: "Database connection failed"
Verify your database environment variables are set in Railway:
- `DATABASE_URL`
- `DB_CONNECTION`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

### Error: "Migration already exists"
If migrations show as "Ran" but tables don't exist, you may need to:
1. Check if tables actually exist in the database
2. If not, reset migrations: `railway run --service api-web php artisan migrate:reset`
3. Then run migrations again: `railway run --service api-web php artisan migrate --force`

## Alternative: Using Railway Dashboard

1. Go to Railway dashboard: https://railway.app
2. Select "Fibonacco AI Tools" project
3. Go to your API service
4. Open the "Deployments" tab
5. Click on the latest deployment
6. Open the "Shell" tab
7. Run: `php artisan migrate --force`

## Migration Order

Migrations will run in chronological order based on their timestamps. The system will automatically handle dependencies and foreign keys.

## Next Steps

After migrations complete:
1. Verify all tables exist
2. Check for any migration errors
3. Test API endpoints
4. Verify environment variables are set correctly
5. Test authentication flow
