# Railway Database Cleanup - Current State

## Current Status (from Dashboard)

**Project:** Fibonacco AI  
**Environment:** production

### Databases:

1. ✅ **Postgres** (KEEP)
   - Status: Online
   - Volume: `postgres-volume` attached
   - **This is your main database - keep this one**

2. ❌ **Postgres-4f8P** (DELETE)
   - Status: Online
   - No volume attached
   - Duplicate - delete this

3. ❌ **Postgres-vc_Z** (DELETE)
   - Status: **Crashed 2 hours ago**
   - 7 warnings/issues
   - Duplicate and broken - delete this immediately

4. ✅ **Redis** (KEEP)
   - Status: Online
   - Volume: `redis-volume` attached
   - **Keep this - you need Redis**

---

## Action Required

### Step 1: Delete Duplicate PostgreSQL Databases

**In Railway Dashboard:**

1. Click on **Postgres-4f8P** card
2. Go to **Settings** tab
3. Scroll to **Danger Zone**
4. Click **Delete Service**
5. Confirm deletion

6. Click on **Postgres-vc_Z** card (the crashed one)
7. Go to **Settings** tab
8. Scroll to **Danger Zone**
9. Click **Delete Service**
10. Confirm deletion

### Step 2: Verify Final State

After cleanup, you should have:

- ✅ **Postgres** (main database with volume)
- ✅ **Redis** (cache/queue with volume)

**Total: 2 databases** (one PostgreSQL, one Redis)

---

## Why Keep `Postgres` (not the others)?

- ✅ Has `postgres-volume` attached (persistent storage)
- ✅ Clean name (no random suffix)
- ✅ Online and healthy
- ✅ Likely the one that has your actual data

The others (`Postgres-4f8P`, `Postgres-vc_Z`) are:
- Duplicates/accidental creations
- One is crashed (vc_Z)
- No volumes attached
- Random suffix names indicate they're not intentional

---

## After Cleanup

Once you've deleted the duplicates:

1. Railway will automatically inject `DATABASE_URL` from the remaining `Postgres` service
2. All your services (api-web, api-worker, etc.) will connect to the correct database
3. No code changes needed - Railway handles the environment variables automatically

---

## Next Steps After Cleanup

1. ✅ Delete duplicate databases (manual in dashboard)
2. Connect GitHub repos to create services (api-web, api-worker, taskjuggler frontend)
3. Set environment variables via CLI
4. Deploy services

