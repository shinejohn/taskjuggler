# Railway Service Rename: taskjuggler → ai-tools-api

## Why Rename?

The current service name `taskjuggler` is misleading because:
- It's not just for TaskJuggler - it serves ALL apps
- It's the unified API platform for:
  - TaskJuggler
  - 4Healthcare (ScribeMD, DocBoard, etc.)
  - URPA (Scheduler)
  - 4Process
  - 4Projects
  - Official Notice
  - Site Health Scanner
  - Idea Circuit

## New Name: `ai-tools-api`

This clearly indicates:
- ✅ It's the **API server**
- ✅ For the **AI Tools platform**
- ✅ Serves **all applications**

---

## How to Rename in Railway

### Option 1: Via Railway Dashboard (Recommended)

1. Go to: https://railway.app/project/7e7372dd-373a-4e78-a51e-15eab332b67d
2. Click on the `taskjuggler` service
3. Go to **Settings**
4. Under **Service Name**, change to: `ai-tools-api`
5. Click **Save**

### Option 2: Via Railway CLI

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api
railway service rename ai-tools-api
```

---

## What Needs to be Updated After Rename

### 1. Frontend Environment Variables

All frontend apps currently point to:
```
VITE_API_URL=https://taskjuggler-production.up.railway.app
```

After rename, the URL will become:
```
VITE_API_URL=https://ai-tools-api-production.up.railway.app
```

We'll need to update all frontend services:
- 4Doctors
- URPA
- 4process
- 4projects
- Site Health
- Idea Circuit
- taskjuggler-web (when created)
- coordinator (when created)
- official-notice (when created)

### 2. Documentation

Update all documentation references from `taskjuggler` service to `ai-tools-api`.

---

## Updated Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AI TOOLS GROUP                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📦 INFRASTRUCTURE                                       │
│  ├─ Postgres - AI TOOLs    (Database)                   │
│  └─ Valkey                 (Redis/Cache/Queue)          │
│                                                          │
│  🔧 BACKEND                                              │
│  └─ ai-tools-api           (Platform API Server)        │
│     • Laravel REST API                                  │
│     • Serves ALL applications                           │
│     • Modules: TaskJuggler, 4Healthcare, URPA, etc.     │
│     • URL: ai-tools-api-production.up.railway.app       │
│                                                          │
│  🎨 FRONTEND APPS                                        │
│  ├─ taskjuggler-web        (TaskJuggler UI)             │
│  ├─ 4Doctors               (4Healthcare UI)             │
│  ├─ URPA                   (Scheduler UI)               │
│  ├─ 4process               (Process Management)         │
│  ├─ 4projects              (Project Management)         │
│  ├─ Site Health            (Scanner UI)                 │
│  ├─ Idea Circuit           (Ideas UI)                   │
│  ├─ coordinator            (Coordinator UI)             │
│  └─ official-notice        (Legal Notices UI)           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Recommended Steps

1. **Rename the service** in Railway to `ai-tools-api`
2. **Wait for Railway** to update the URL
3. **Update all frontend VITE_API_URL** variables to the new URL
4. **Redeploy frontends** to pick up the new API URL

---

**This rename makes the architecture much clearer and accurately reflects that this is the unified API platform for all AI Tools applications!**
