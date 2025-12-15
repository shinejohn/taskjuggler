# Railway Setup - Simple Steps

## The Easiest Approach

When Railway asks you to connect a GitHub repo, it may or may not show a "Root Directory" option. Here's what to do:

---

## Creating Services - What You'll See

When you click "New" → "GitHub Repo" and select `shinejohn/taskjuggler`, Railway will either:

**Option A:** Show a configuration screen with fields  
**Option B:** Immediately start deploying

### If Railway Shows Configuration Fields:

Look for any of these fields:
- "Root Directory"
- "Working Directory" 
- "Source Directory"
- "Service Path"

If you see it → Enter the directory name (like `taskjuggler-api`)

### If Railway Doesn't Show Root Directory:

**That's OK!** We'll set it after the service is created.

---

## Simple Step-by-Step

### 1. Create First Service (API Web)

1. Click "New" → "GitHub Repo"
2. Select `shinejohn/taskjuggler`
3. **If Railway asks for configuration:**
   - Look for root directory field → Enter: `taskjuggler-api`
   - Name the service → `api-web`
4. **If Railway doesn't ask** → Just let it create the service
5. **After service is created:**
   - Click on the service
   - Go to **Settings** tab
   - Look for **"Root Directory"** or **"Working Directory"**
   - If you see it → Set to: `taskjuggler-api`
   - Go to **Deploy** section
   - Set **Start Command** to: `web`

### 2. Create Second Service (API Worker)

**Repeat the same process, but:**
- Name: `api-worker`
- Root Directory: `taskjuggler-api` (same as api-web)
- Start Command: `worker`

### 3. Create Third Service (API Scheduler)

- Name: `api-scheduler`
- Root Directory: `taskjuggler-api`
- Start Command: `scheduler`

### 4. Create Fourth Service (Task Juggler Frontend)

- Name: `taskjuggler`
- Root Directory: `taskjuggler-web`
- Start Command: Leave as default (Railway auto-detects)

### 5. Create Fifth Service (Process Frontend)

- Name: `process`
- Root Directory: `process-web`
- Start Command: Leave as default

### 6. Create Sixth Service (Projects Frontend)

- Name: `projects`
- Root Directory: `projects-web`
- Start Command: Leave as default

---

## If Root Directory Doesn't Exist in Settings

**No problem!** We have two options:

### Option 1: Modify Start Commands

Change the start command to include the directory:

**For api-web:**
```
cd taskjuggler-api && php artisan serve --host=0.0.0.0 --port=$PORT
```

**For api-worker:**
```
cd taskjuggler-api && php artisan queue:work --tries=3 --timeout=300
```

**For api-scheduler:**
```
cd taskjuggler-api && php artisan schedule:work
```

**For taskjuggler frontend:**
```
cd taskjuggler-web && npm run preview -- --host 0.0.0.0 --port $PORT
```

**For process frontend:**
```
cd process-web && npm run preview -- --host 0.0.0.0 --port $PORT
```

**For projects frontend:**
```
cd projects-web && npm run preview -- --host 0.0.0.0 --port $PORT
```

### Option 2: Use Railway's Build Command

In the Deploy settings, you can also set a build command that changes directory before building.

---

## What to Tell Me

After creating services, just tell me:
1. "I created the services"
2. Whether you were able to set root directories or not
3. Any issues you ran into

Then I'll handle everything else via CLI:
- Setting all environment variables
- Configuring domains
- Running migrations

**Don't worry if it's not perfect** - we can fix start commands and configurations via CLI too!

