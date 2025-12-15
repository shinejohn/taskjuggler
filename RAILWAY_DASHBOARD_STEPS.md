# Railway Dashboard - Step-by-Step Instructions

## How to Create Services in Railway Dashboard

### Overview
When you connect a GitHub repo in Railway, it asks you to configure the service. Here's what to do for each service.

---

## Step 1: Create API Web Service

1. **Go to Railway Dashboard**: https://railway.app
2. **Navigate to**: shinejohn workspace → Fibonacco AI project
3. **Click "New"** button (top right)
4. **Select "GitHub Repo"**
5. **Select repository**: `shinejohn/taskjuggler`
6. **Railway will show a configuration screen** with these options:

### Configuration Options:

**Root Directory:**
- Look for a field labeled "Root Directory" or "Working Directory"
- Enter: `taskjuggler-api`
- This tells Railway where your API code lives

**Service Name:**
- Railway may auto-generate a name like "taskjuggler"
- You can change it to: `api-web`
- Or rename it later in Settings

**Build Command:**
- Railway should auto-detect from `railway.json` or `nixpacks.toml`
- You don't need to change this

**Start Command:**
- Railway should auto-detect from `Procfile` (should be `web`)
- Verify it says `web` or `php artisan serve`
- If not, you can set it in Settings → Deploy → Start Command

7. **Click "Deploy"** or "Add Service"
8. **Wait for deployment** (30-60 seconds)

---

## Step 2: Create API Worker Service

**Same process, but different settings:**

1. **Click "New"** → **"GitHub Repo"**
2. **Select**: `shinejohn/taskjuggler` (same repo)
3. **Configuration**:
   - **Root Directory**: `taskjuggler-api` (same as api-web)
   - **Service Name**: `api-worker`
4. **After service is created**:
   - Go to the service → **Settings** tab
   - Scroll to **"Deploy"** section
   - Find **"Start Command"**
   - Change it to: `worker`
   - Click **Save**

---

## Step 3: Create API Scheduler Service

**Same process:**

1. **Click "New"** → **"GitHub Repo"**
2. **Select**: `shinejohn/taskjuggler`
3. **Configuration**:
   - **Root Directory**: `taskjuggler-api`
   - **Service Name**: `api-scheduler`
4. **After service is created**:
   - Settings → Deploy → Start Command
   - Change to: `scheduler`
   - Save

---

## Step 4: Create Task Juggler Frontend

1. **Click "New"** → **"GitHub Repo"**
2. **Select**: `shinejohn/taskjuggler`
3. **Configuration**:
   - **Root Directory**: `taskjuggler-web`
   - **Service Name**: `taskjuggler`
4. **Start Command**: Railway should auto-detect (leave as is)

---

## Step 5: Create Process Frontend

1. **Click "New"** → **"GitHub Repo"**
2. **Select**: `shinejohn/taskjuggler`
3. **Configuration**:
   - **Root Directory**: `process-web`
   - **Service Name**: `process`
4. **Start Command**: Auto-detected (leave as is)

---

## Step 6: Create Projects Frontend

1. **Click "New"** → **"GitHub Repo"**
2. **Select**: `shinejohn/taskjuggler`
3. **Configuration**:
   - **Root Directory**: `projects-web`
   - **Service Name**: `projects`
4. **Start Command**: Auto-detected (leave as is)

---

## Important Notes

### If Railway Doesn't Show "Root Directory" Field

**Option A: Railway might auto-detect**
- Railway might ask you to "Select a directory" or show a dropdown
- Choose the appropriate directory from the list

**Option B: Set it after creation**
- Create the service first
- Go to Settings → General
- Look for "Root Directory" or "Working Directory"
- Set it there

**Option C: Railway might not support root directories for monorepos**
- If Railway doesn't have this option, we may need to:
  - Use separate GitHub repos for each service, OR
  - Use Railway's build/start commands to `cd` into the directory

### Start Commands

**Where to find/set Start Commands:**
1. After creating service
2. Click on the service
3. Go to **Settings** tab
4. Scroll to **"Deploy"** section
5. Find **"Start Command"**
6. Enter the command (like `worker` or `scheduler`)

**What the Start Commands do:**
- Railway looks in the `Procfile` for these commands
- `web` = Runs `php artisan serve` (for API web)
- `worker` = Runs `php artisan queue:work` (for worker)
- `scheduler` = Runs `php artisan schedule:work` (for scheduler)

---

## Alternative: If Root Directory Option Doesn't Exist

If Railway doesn't support root directories in the UI, we can modify the start commands:

**For api-web:**
```
cd taskjuggler-api && php artisan serve --host=0.0.0.0 --port=$PORT
```

**For api-worker:**
```
cd taskjuggler-api && php artisan queue:work
```

**For api-scheduler:**
```
cd taskjuggler-api && php artisan schedule:work
```

**For frontends:**
```
cd taskjuggler-web && npm run preview -- --host 0.0.0.0 --port $PORT
```

---

## What to Tell Me

After creating services, tell me:
1. "Services created"
2. If you were able to set root directories, or if you had to use full paths in start commands
3. Any issues you encountered

Then I'll configure all the environment variables and domains via CLI!

