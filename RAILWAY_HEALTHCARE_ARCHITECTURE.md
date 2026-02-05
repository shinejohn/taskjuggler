# Railway Architecture: 4Healthcare Platform

This document outlines the production architecture for the 4Healthcare Platform on Railway, mirroring the robust "Dev Publishing Platform" structure.

## Overview Diagram

```mermaid
graph TD
    subgraph "Healthcare Data Layer"
        PG[(Postgres-HC-HIPAA)]
        Redis[(Valkey-HC)]
        S3[AWS S3 / Storage]
    end

    subgraph "Healthcare Backend Core"
        API[4Doctors API Core]
        Horizon[Horizon Worker]
        Scheduler[Task Scheduler]
    end

    subgraph "Healthcare Apps Platform"
        Web[4Doctors Web Portal]
        Patient[Patient Portal (Future)]
    end

    Web --> API
    API --> PG
    API --> Redis
    Horizon --> Redis
    Horizon --> PG
    Scheduler --> PG
```

## 1. Healthcare Data Layer
**Purpose:** Secure, HIPAA-compliant storage for all platform data.

| Service Name | Type | Description |
|--------------|------|-------------|
| **Postgres-HC-HIPAA** | PostgreSQL | Primary relational database. Stores Users, Patients, Medical Records. |
| **Valkey-HC** | Redis | High-performance cache & queue driver. Handles user sessions and job queues. |
| **Storage** | S3 Plugin | File storage for medical documents, images, and generated PDFs. |

## 2. Healthcare Backend Services
**Purpose:** Core processing logic. These services share the SAME codebase (`taskjuggler-api`) but run different commands.

### A. 4Doctors API (Web Service)
*   **Role:** Handles all HTTP requests from the frontend.
*   **Start Command:**
    ```bash
    cd taskjuggler-api && php artisan migrate --force && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
    ```
*   **Scaling:** Scale replicas based on traffic load.

### B. Horizon Worker (Queue Processor)
*   **Role:** Processes background jobs (AI analysis, Emails, SRAM usage).
*   **Start Command:**
    ```bash
    cd taskjuggler-api && php artisan horizon
    ```
*   **Critical For:** ScribeMD Processing, AI Reports, Notifications.

### C. Task Scheduler (Cron)
*   **Role:** Runs scheduled maintenance and heartbeat tasks.
*   **Start Command:**
    ```bash
    cd taskjuggler-api && php artisan schedule:work
    ```

## 3. Healthcare Apps Platform
**Purpose:** User-facing interfaces.

### A. 4Doctors Web (Provider Portal)
*   **Currently:** Served as a Monolith with the API (Vite build copied to public).
*   **Future Split:** pure static frontend hosted on Vercel or Railway Static Site, pointing to API.

---

## Deployment Instructions

### Step 1: Create Services
1.  **Repo:** Connect `shinejohn/taskjuggler` (Branch: `4healthcare-railway-deploy`).
2.  **Create 3 Services** from this same repo:
    *   Name one **"4Doctors API"**
    *   Name one **"4Doctors Worker"**
    *   Name one **"4Doctors Scheduler"**

### Step 2: Configure Start Commands
Go to `Settings` -> `Deploy` -> `Start Command` for each service:

*   **API:** Leave default (defined in `nixpacks.toml`).
*   **Worker:** `cd taskjuggler-api && php artisan horizon`
*   **Scheduler:** `cd taskjuggler-api && php artisan schedule:work`

### Step 3: Link Variables
Ensure all 3 services share the **SAME** environment variables:
*   `DATABASE_URL`
*   `REDIS_URL`
*   `APP_KEY`
*   `OPENROUTER_API_KEY`

### Step 4: Verify Network
*   Ensure **API** can talk to **Postgres** and **Redis**.
*   Ensure **Worker** can connect to **Redis** (crucial for Horizon).

This architecture ensures your Background AI processing never slows down the Doctor's user interface.
