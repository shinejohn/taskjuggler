# Project Location & Database Details

## Project Location

**Root Directory:**
```
/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
```

**API Project:**
```
/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api
```

**Web Frontend:**
```
/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-web
```

---

## Database Details

### Current Database

**Type:** SQLite (Development)
**Location:** `/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api/database/database.sqlite`
**Size:** 228 KB
**Tables:** 23 tables

**Connection Details:**
- Driver: `sqlite`
- Database file: `database/database.sqlite` (relative to project root)
- Default connection: Uses SQLite if `DATABASE_URL` is not set, otherwise PostgreSQL

### Database Configuration

**Config File:** `taskjuggler-api/config/database.php`

**Default Connection Logic:**
```php
'default' => env('DB_CONNECTION', env('DATABASE_URL') ? 'pgsql' : 'sqlite'),
```

This means:
- If `DATABASE_URL` is set → Uses PostgreSQL
- If `DATABASE_URL` is NOT set → Uses SQLite (current state)

### Production Database (Railway)

**Expected:** PostgreSQL on Railway
**Location:** Managed by Railway (auto-injected via `DATABASE_URL`)

When deployed to Railway:
- Railway automatically sets `DATABASE_URL` environment variable
- Laravel will use PostgreSQL connection
- Local SQLite database is NOT used in production

---

## Migrations Location

### Module Migrations (New Structure)
```
taskjuggler-api/app/Modules/Core/Migrations/
  ├── 2024_01_01_000001_create_teams_table.php
  ├── 2024_01_01_000002_create_team_members_table.php
  ├── 2024_01_01_000003_create_subscriptions_table.php
  └── 2024_01_01_000004_add_fields_to_users_table.php

taskjuggler-api/app/Modules/Tasks/Migrations/
  ├── 2024_01_02_000001_create_tasks_table.php
  ├── 2024_01_02_000002_create_task_actions_table.php
  └── 2024_01_02_000003_create_task_messages_table.php
```

### Existing Migrations (Original Location)
```
taskjuggler-api/database/migrations/
  └── 31 migration files (already run or pending)
```

---

## Project Name

**Current:** `taskjuggler-api` (folder name)
**Target:** `fibonacci-api` (per reorganization plan)
**Railway Project:** "Fibonacco AI"

---

## Summary

| Item | Details |
|------|---------|
| **Project Path** | `/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api` |
| **Database Type** | SQLite (local dev) / PostgreSQL (Railway production) |
| **Database Location** | `database/database.sqlite` (local) |
| **Current Tables** | 23 tables in SQLite |
| **Module Migrations** | 7 files in `app/Modules/*/Migrations/` |
| **Database Migrations** | 31 files in `database/migrations/` |
| **Duplicates** | 0 (confirmed) |

---

## Important Notes

1. **Development:** Currently using SQLite at `database/database.sqlite`
2. **Production:** Will use PostgreSQL on Railway (via `DATABASE_URL`)
3. **Migrations:** Module migrations are for NEW deployments, existing migrations stay in `database/migrations/`
4. **No Conflicts:** Zero duplicate migrations between locations

