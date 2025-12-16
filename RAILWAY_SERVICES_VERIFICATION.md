# Railway Services Verification Checklist

## ✅ Verified Services

### Backend Services

- [x] **api-web** - Laravel API web server
  - Status: ✅ RUNNING
  - URL: `https://api-web-production-cc91.up.railway.app`
  - Health Check: ✅ Responding

---

## Services to Verify in Railway Dashboard

Go to: **https://railway.app** → **shinejohn's Projects** → **Fibonacco AI**

### Backend Services (should have 3 total)

- [ ] **api-web** ✅ (VERIFIED - Running)
  - Root Directory: `taskjuggler-api`
  - Repository: `shinejohn/taskjuggler`
  
- [ ] **api-worker** - Queue worker
  - Root Directory: `taskjuggler-api`
  - Repository: `shinejohn/taskjuggler`
  - Start Command: `worker`
  - Status: Check if running

- [ ] **api-scheduler** - Scheduled tasks
  - Root Directory: `taskjuggler-api`
  - Repository: `shinejohn/taskjuggler`
  - Start Command: `scheduler`
  - Status: Check if running

### Frontend Services (should have 3 total)

- [ ] **taskjuggler** - Task Juggler frontend
  - Root Directory: `taskjuggler-web`
  - Repository: `shinejohn/taskjuggler`
  - Status: Check if running

- [ ] **process** or **4process** - Process.ai frontend
  - Root Directory: `process-web`
  - Repository: `shinejohn/4process`
  - Status: Check if running

- [ ] **projects** or **4projects** - Projects.ai frontend
  - Root Directory: `projects-web`
  - Repository: `shinejohn/4projects`
  - Status: Check if running

### Database Services (should have 2 total - NO DUPLICATES)

- [ ] **Postgres** - PostgreSQL database
  - Type: PostgreSQL
  - ⚠️ Should be ONLY ONE
  - ❌ Delete if you see: `Postgres-4f8P`, `Postgres-vc_Z`, or any other duplicates

- [ ] **Redis** - Redis cache/queue
  - Type: Redis
  - ⚠️ Should be ONLY ONE

---

## Total Expected Count

**8 services total:**
- 3 Backend services
- 3 Frontend services
- 2 Database services

---

## Checking for Duplicates

### What to Look For:

1. **Multiple PostgreSQL services:**
   - ✅ Keep: `Postgres`
   - ❌ Delete: `Postgres-4f8P`, `Postgres-vc_Z`, or any other duplicates

2. **Multiple Redis services:**
   - ✅ Keep: `Redis`
   - ❌ Delete: Any duplicates

3. **Duplicate frontend services:**
   - Check for services with same root directory but different names
   - Keep the one with the correct name (taskjuggler, process, projects)

---

## How to Delete Duplicates

1. Click on the duplicate service name
2. Go to the **Settings** tab (gear icon)
3. Scroll down to the **Danger Zone** section
4. Click **Delete Service**
5. Confirm deletion

---

## Verification Commands

Test API health:
```bash
curl https://api-web-production-cc91.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-15T20:35:55.543893Z"
}
```

---

## Next Steps

1. ✅ Verify `api-web` is running (CONFIRMED)
2. ⏳ Check dashboard for all other services
3. ⏳ Delete any duplicate database services
4. ⏳ Verify all 8 services exist (no duplicates)
5. ⏳ Check that all services are deployed successfully

