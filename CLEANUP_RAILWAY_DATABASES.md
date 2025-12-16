# Railway Database Cleanup

## Current Situation

You have **3 PostgreSQL databases** in your "Fibonacco AI" project:
1. `Postgres-4f8P`
2. `Postgres-vc_Z`
3. `Postgres`

You also have **1 Redis** database (this is correct).

## Recommendation

**Keep:** One PostgreSQL database (suggest keeping "Postgres" as it's the cleanest name)  
**Delete:** The other 2 PostgreSQL databases (`Postgres-4f8P` and `Postgres-vc_Z`)  
**Keep:** Redis (only need one)

## Why This Happened

This likely occurred from:
- Multiple attempts to add PostgreSQL
- Previous project configurations
- CLI commands that created duplicates

## How to Clean Up

### Option 1: Via Railway Dashboard (Recommended)

1. Go to Railway dashboard → "Fibonacco AI" project
2. For each database you want to delete:
   - Click on the database service card
   - Go to **Settings** → Scroll to bottom
   - Click **"Delete Service"** (or **"Delete"**)
   - Confirm deletion

**Keep:** `Postgres` (the one without numbers/letters)  
**Delete:** `Postgres-4f8P` and `Postgres-vc_Z`

### Option 2: Via CLI

```bash
# List services to get IDs
railway service list

# Delete unwanted services (replace SERVICE_ID)
railway service delete <service-id>
```

**⚠️ Warning:** Make sure you're deleting the right databases. Check which one has your data (if any) before deleting.

## After Cleanup

You should have:
- ✅ **1 PostgreSQL database** (named "Postgres" or similar)
- ✅ **1 Redis database**
- Both should show "Online" status

## Next Steps

After cleanup:
1. Connect GitHub repos to create API and frontend services
2. Set environment variables (they'll auto-connect to the remaining PostgreSQL and Redis)

