# Railway Environment Variables & Service Linking Guide

This guide details the exact environment variable configuration for the **4Healthcare Platform**. It defines how to link the **Backend Services** (API, Worker, Scheduler) to the **Data Layer** (Postgres, Redis) using Railway's reference syntax.

## 🔗 Service Communication Map

| Service Type | Service Name | Needs to Know About | Variable Reference Syntax |
| :--- | :--- | :--- | :--- |
| **Database** | `Postgres-HC-HIPAA` | *None* | *Exports `DATABASE_URL`* |
| **Cache** | `Valkey-HC` | *None* | *Exports `REDIS_URL`* |
| **Backend** | `4healthcare Backend API` | Postgres, Valkey | `${{Postgres-HC-HIPAA.DATABASE_URL}}`, `${{Valkey-HC.REDIS_URL}}` |
| **Backend** | `4Doctors Worker` | Postgres, Valkey | `${{Postgres-HC-HIPAA.DATABASE_URL}}`, `${{Valkey-HC.REDIS_URL}}` |
| **Backend** | `4Doctors Scheduler` | Postgres, Valkey | `${{Postgres-HC-HIPAA.DATABASE_URL}}`, `${{Valkey-HC.REDIS_URL}}` |

---

## 🛠 Service-Specific Configuration

Copy these variables into the "Variables" tab for each service in Railway.

### 1. Data Layer Services

#### **A. Postgres-HC-HIPAA**
*   *Railway Managed Service - No manual variables needed.*
*   **Exports:** `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.

#### **B. Valkey-HC** (Redis)
*   *Railway Managed Service - No manual variables needed.*
*   **Exports:** `REDIS_URL`, `REDISHOST`, `REDISPORT`, `REDISUSER`, `REDISPASSWORD`.

---

### 2. Backend Services (API, Worker, Scheduler)
**Apply these variables to ALL THREE services:** `2healthcare backend api`, `4Doctors Worker`, `4Doctors Scheduler`.

#### **A. Service Links (The "Address" Information)**
These use Railway's template syntax to dynamically pull connection strings.

| Variable | Value (Copy Exact) | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `${{Postgres-HC-HIPAA.DATABASE_URL}}` | Connection string to Postgres |
| `REDIS_URL` | `${{Valkey-HC.REDIS_URL}}` | Connection string to Redis |
| `APP_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` | Auto-updates to the service's domain |

#### **B. Core Application Config**
Standard Laravel configuration for production.

| Variable | Value | Description |
| :--- | :--- | :--- |
| `APP_NAME` | `4Healthcare` | Platform Name |
| `APP_ENV` | `production` | Production mode |
| `APP_DEBUG` | `false` | Disable debug pages |
| `APP_KEY` | *(Generate One)* | Run `php artisan key:generate --show` locally |
| `LOG_CHANNEL` | `stderr` | Log to Railway console |

#### **C. Driver Configuration**
Configures Laravel to use the linked Data Services.

| Variable | Value | Description |
| :--- | :--- | :--- |
| `DB_CONNECTION` | `pgsql` | Use PostgreSQL |
| `CACHE_STORE` | `redis` | Use Redis for Cache |
| `SESSION_DRIVER` | `redis` | Use Redis for Sessions |
| `QUEUE_CONNECTION` | `redis` | Use Redis for Queues (Horizon) |

#### **D. AI & External Integrations**
Required for the "4Doctors" features to work.

| Variable | Value | Description |
| :--- | :--- | :--- |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | Your AI Key |
| `VITE_API_URL` | `${{APP_URL}}/api` | Points frontend to itself/API |

---

## 🚀 How to Apply (Bulk Import)

You can copy the block below and paste it into Railway's "Raw Editor" for **each** of the 3 backend services (`API`, `Worker`, `Scheduler`):

```env
APP_NAME=4Healthcare
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
LOG_CHANNEL=stderr

DB_CONNECTION=pgsql
DATABASE_URL=${{Postgres-HC-HIPAA.DATABASE_URL}}

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_URL=${{Valkey-HC.REDIS_URL}}

OPENROUTER_API_KEY=your_key_here
```

*Note: Railway will verify the `${{...}}` references turn blue, indicating a successful link.*
